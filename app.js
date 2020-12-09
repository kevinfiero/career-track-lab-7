const State = require('./lib/models/state');
const Park = require('./lib/models/park');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/state', async(req, res) => {
  const state = await State.insert(req.body);
  res.send(state);
});

app.post('/Park', async(req, res) => {
  const park = await Park.insert(req.body);
  res.send(park);
});

module.exports = app;
