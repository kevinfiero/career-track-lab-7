DROP TABLE IF EXISTS STATES CASCADE;
DROP TABLE IF EXISTS PARKS;

CREATE TABLE STATES (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  state_name TEXT NOT NULL,
  capital TEXT NOT NULL,
  population INTEGER NOT NULL
);

CREATE TABLE PARKS (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  park_name TEXT NOT NULL,
  urban BOOLEAN NOT NULL,
  yearly_visitors INTEGER NOT NULL,
  state_id BIGINT REFERENCES STATES(id)
)