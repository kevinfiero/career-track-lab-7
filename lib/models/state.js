const pool = require('../utils/pool');

module.exports = class State {
  id;
  stateName;
  capital;
  population;

  constructor(row){
    this.id = String(row.id);
    this.stateName = row.state_name;
    this.capital = row.capital;
    this.population = String(row.population);
  }

  static async insert({ stateName, capital, population }) {
    const { rows } = await pool.query(
      'INSERT INTO STATES (state_name, capital, population) VALUES ($1, $2, $3) RETURNING *',
      [stateName, capital, population]
    );

    return new State(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM STATES');

    return rows.map(row => new State(row));
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM STATES WHERE ID = $1', [id]);

    if(!rows[0]) throw new Error(`No State with ${id} found!`);

    return new State(rows[0]);
  }

  static async replace(id, { stateName, capital, population }) {
    const { rows } = await pool.query(`
    UPDATE STATES SET state_name = $1, capital = $2, population = $3 WHERE ID = $4 RETURNING *`,
    [stateName, capital, population, id]);

    if(!rows[0]) throw new Error(`No State with ${id} found!`);

    return new State(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(`
    DELETE FROM STATES WHERE ID=$1 RETURNING *`,
    [id]);

    if(!rows[0]) throw new Error(`No State with ${id} found!`);

    return new State(rows[0]);
  }




};
