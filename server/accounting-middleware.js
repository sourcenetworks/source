import Models from './models';
import express from 'Express';
import Accounting from './accounting';

const { Client, Provider, Session, TimeSlice} = Models();

function alwaysUpdate(req, res, next) {
  client = new Client
}

// decide when to use the middleware and stuff.
app.use('insert route', alwaysUpdate)

req.alwaysUpdate // When in something

function createClient (macAddress) {
  const client = new Client({
    // Whatever shit goes here
    //
  });

  client.save();
}

function updateClient (macAdd, field, data) {
  query = {MACAddress : macAdd};
  update = {data, fuckshit};
  Client.findByIDAndUpdate(query, update, (callback) =>
    console.log("We posted that shit")
  );
}
