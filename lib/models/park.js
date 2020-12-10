const pool = require('../utils/pool');
const State = require('./State');

module.exports = class Park {
  id;
  parkName;
  urban;
  yearlyVisitors;
  stateId;

  constructor(row){
    this.id = String(row.id);
    this.parkName = row.park_name;
    this.urban = String(row.urban);
    this.yearlyVisitors = String(row.yearly_visitors);
    this.stateId = String(row.state_id);
  }

  static async insert({ parkName, urban, yearlyVisitors, stateId }) {
    const { rows } = await pool.query(
      'INSERT INTO PARKS (park_name, urban, yearly_visitors, state_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [parkName, urban, yearlyVisitors, stateId]
    );
    return new Park(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM PARKS');

    return rows.map(row => new Park(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(`
      select 
        STATES.*,
        array_to_json(array_agg(PARKS.*)) AS PARKS
      FROM
        STATES
      JOIN PARKS
      ON PARKS.state_id=STATES.id
      WHERE STATES.id=$1
      GROUP BY STATES.id
    `, [id]);

    if(!rows[0]) throw new Error(`No State with ${id} found!`);

    return {
      ...new State(rows[0]),
      parks: rows[0].parks.map(park => new Park(park))
    };
  }

  static async replace(id, { parkName, urban, yearlyVisitors, stateId }) {
    const { rows } = await pool.query(`
    UPDATE PARKS SET park_name = $1, urban = $2, yearly_visitors = $3, state_id = $4 WHERE ID = $5 RETURNING *`,
    [parkName, urban, yearlyVisitors, stateId, id]);

    if(!rows[0]) throw new Error(`No Park with ${id} found!`);

    return new Park(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(`
    DELETE FROM PARKS WHERE ID=$1 RETURNING *`,
    [id]);

    if(!rows[0]) throw new Error(`No Park with ${id} found!`);

    return new Park(rows[0]);
  }

};
