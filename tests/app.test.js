const fakeRequest = require('supertest');
const app = require('../app');
const pool = require('../lib/utils/pool');
const fs = require('fs');
const State = require('../lib/models/state');
const Park = require('../lib/models/park');

describe('test state and park model', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync('./lib/sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('insert into State', async() => {
    const newState = {
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '50000000'
    };

    const expectation = {
      'id': '1',
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '50000000'

    };

    const data = await fakeRequest(app)
      .post('/state')
      .send(newState)
      .expect(200);

    expect(expectation).toEqual(data.body);
  });

  it('insert into Park with foreign key in State', async() => {
    await State.insert({
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });

    const newPark = {
      'parkName': 'Central Park',
      'urban': 'true',
      'yearlyVisitors': '38000000',
      'stateId': '1'
    };

    const expectation = {
      'id': '1',
      'parkName': 'Central Park',
      'urban': 'true',
      'yearlyVisitors': '38000000',
      'stateId': '1'
    };

    const data = await fakeRequest(app)
      .post('/park')
      .send(newPark)
      .expect(200);

    expect(expectation).toEqual(data.body);
  });

  it('return all Parks', async() => {

    await State.insert({
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });

    const newParks = await Promise.all([
      {
        'parkName': 'Central Park',
        'urban': 'true',
        'yearlyVisitors': '38000000',
        'stateId': '1'
      },
      {
        'parkName': 'Niagara Falls',
        'urban': 'true',
        'yearlyVisitors': '12000000',
        'stateId': '1'
      },
      {
        'parkName': 'Buttermilk Falls State Park',
        'urban': 'false',
        'yearlyVisitors': '200000',
        'stateId': '1'
      }
    ].map(park => Park.insert(park)));

    const data = await fakeRequest(app)
      .get('/park');

    expect(data.body).toEqual(expect.arrayContaining(newParks));
    expect(data.body).toHaveLength(newParks.length);

  });

  it('return all States', async() => {

    const newStates = await Promise.all([
      {
        'stateName': 'New York',
        'capital': 'Albany',
        'population': '19450000'
      },
      {
        'stateName': 'California',
        'capital': 'Sacramento',
        'population': '39510000'
      },
      {
        'stateName': 'Texas',
        'capital': 'Austin',
        'population': '29000000'
      }
    ].map(state => State.insert(state)));

    const data = await fakeRequest(app)
      .get('/state');

    expect(data.body).toEqual(expect.arrayContaining(newStates));
    expect(data.body).toHaveLength(newStates.length);

  });
  

  it('get State by ID and associated parks', async() => {

    const state = await State.insert({
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });

    const parks = await Promise.all([
      {
        'parkName': 'Central Park',
        'urban': 'true',
        'yearlyVisitors': '38000000',
        'stateId': '1'
      },
      {
        'parkName': 'Niagara Falls',
        'urban': 'true',
        'yearlyVisitors': '12000000',
        'stateId': '1'
      },
      {
        'parkName': 'Buttermilk Falls State Park',
        'urban': 'false',
        'yearlyVisitors': '200000',
        'stateId': '1'
      }
    ].map(park => Park.insert(park)));

    const data = await fakeRequest(app)
      .get(`/park/${state.id}`);

    expect(data.body).toEqual({
      ...state,
      parks: expect.arrayContaining(parks)
    });


  });

  it('get State by ID', async() => {

    const state = await State.insert({
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });

    const data = await fakeRequest(app)
      .get(`/state/${state.id}`);

    expect(data.body).toEqual({
      'id': '1',
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });


  });

  it('update park by ID', async() => {

    await State.insert({
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });

    const park = await Park.insert(
      {
        'parkName': 'Central Park',
        'urban': 'true',
        'yearlyVisitors': '38000000',
        'stateId': '1'
      });

    const expectation = 
      {
        'id': '1',
        'parkName': 'Central Park - NYC',
        'urban': 'true',
        'yearlyVisitors': '750000000',
        'stateId': '1'
      };

    const data = await fakeRequest(app)
      .put(`/park/${park.id}`)
      .send({
        'parkName': 'Central Park - NYC',
        'urban': 'true',
        'yearlyVisitors': '750000000',
        'stateId': '1'
      });

    expect(data.body).toEqual(expectation);

  });

  it('update state by ID', async() => {

    const state = await State.insert({
      'stateName': 'New York',
      'capital': 'New York City',
      'population': '19450000'
    });

    const expectation = 
      {
        'id': '1',
        'stateName': 'New York',
        'capital': 'Albany',
        'population': '19450000'
      };

    const data = await fakeRequest(app)
      .put(`/state/${state.id}`)
      .send({
        'stateName': 'New York',
        'capital': 'Albany',
        'population': '19450000'
      });

    expect(data.body).toEqual(expectation);

  });

  it('delete park by ID', async() => {

    await State.insert({
      'stateName': 'New York',
      'capital': 'Albany',
      'population': '19450000'
    });

    const park = await Park.insert(
      {
        'parkName': 'Central Park',
        'urban': 'true',
        'yearlyVisitors': '38000000',
        'stateId': '1'
      });

    const expectation = 
      {
        'id': '1',
        'parkName': 'Central Park',
        'urban': 'true',
        'yearlyVisitors': '38000000',
        'stateId': '1'
      };

    const data = await fakeRequest(app)
      .delete(`/park/${park.id}`);

    expect(data.body).toEqual(expectation);


  });

  it('delete state by ID', async() => {

    const state = await State.insert(
      {
        'stateName': 'New York',
        'capital': 'Albany',
        'population': '19450000'
      });


    const expectation = 
      {
        'id': '1',
        'stateName': 'New York',
        'capital': 'Albany',
        'population': '19450000'
      };

    const data = await fakeRequest(app)
      .delete(`/state/${state.id}`);

    expect(data.body).toEqual(expectation);


  });

});



