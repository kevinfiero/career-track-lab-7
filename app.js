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

app.get('/State', async(req, res) => {
  const state = await State.find(req.body);
  res.send(state);
});

app.get('/Park', async(req, res) => {
  const park = await Park.find(req.body);
  res.send(park);
});

app.get('/Park/:id', async(req, res) => {
  const park = await Park.findById(req.params.id);
  res.send(park);
});

app.get('/State/:id', async(req, res) => {
  const state = await State.findById(req.params.id);
  res.send(state);
});

app.put('/Park/:id', async(req, res) => {
  const park = await Park.replace(req.params.id, req.body);
  res.send(park);
});

app.put('/State/:id', async(req, res) => {
  const state = await State.replace(req.params.id, req.body);
  res.send(state);
});

app.delete('/Park/:id', async(req, res) => {
  const park = await Park.delete(req.params.id);
  res.send(park);
});

app.delete('/State/:id', async(req, res) => {
  const state = await State.delete(req.params.id);
  res.send(state);
});

module.exports = app;
