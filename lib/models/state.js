const pool = require('../utils/pool');

module.exports = class State {
  id;
  stateName;
  capital;
  population;

  constructor(row){
    this.id = row.id;
    this.stateName = row.state_name;
    this.capital = row.capital;
    this.population = row.population;
  }

  static async insert({ stateName, capital, population }) {
    const { rows } = await pool.query(
      'INSERT INTO STATES (state_name, capital, population) VALUES ($1, $2, $3) RETURNING *',
      [stateName, capital, population]
    );

    return new State(rows[0]);
  }

    




};
