const pool = require('../utils/pool');

module.exports = class Park {
  id;
  parkName;
  urban;
  yearlyVisitors;
  stateId;

  constructor(row){
    this.id = row.id;
    this.parkName = row.park_name;
    this.urban = row.urban;
    this.yearlyVisitors = row.yearly_visitors;
    this.stateId = row.state_id;
  }

  static async insert({ parkName, urban, yearlyVisitors, stateId }) {
    const { rows } = await pool.query(
      'INSERT INTO PARKS (park_name, urban, yearly_visitors, state_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [parkName, urban, yearlyVisitors, stateId]
    );
    return new Park(rows[0]);
  }













};
