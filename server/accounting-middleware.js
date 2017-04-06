import Models from './models';
import express from 'Express';

const { Client, Provider, Session, TimeSlice} = Models.on();

function alwaysUpdate(req, res, next) {
  client = new Client
}

// decide when to use the middleware and stuff.
app.use('insert route', alwaysUpdate)

req.alwaysUpdate
