import express from 'express';
import path from 'path';

// Rendering stuff
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './app';
import template from './template';

// Accounting and firewall stuff
import acct_mid from './accounting-middleware';
import getStatisWithDelay from './accounting';
import Firewall from '@sourcenetworks/node-firewall';

// DB stuff
import mongoose from 'Mongoose';

const app = express();
mongoose.connect('mongodb://localhost/source-dev');

let firewall;

/*
  @TODO Fix webpack
  @done Do the accounting/writing to DB routes
  @done     -> Create new client in route
  @done     -> Subtask 1 -> accounting js
  @done     -> Create new client in route
  @TODO Payments and such
  @TODO Integrate socket.io
*/

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const appString = renderToString(<App />);

  // @NOTE Uncomment -> Joe's stuff
  // res.redirect(302, 'http://hotspot.localnet/index')
  return res.send(template({
    body: appString,
    title: 'Source WiFi',
  }));
})

app.get('/terms_accepted', (req, res) => {
  let ip_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip_addr = ip_addr.substring(7);


  //@TODO generate a seed on the server side and pass it over?
  //      just need to associate mac address and wallet address
  return mac = firewall.getMAC(ip_addr).
    then(acct_mid.createClient(mac).
    then(mac => firewall.grantAccess(mac).
    then(() => res.sendFile(path.join(__dirname + '/public/terms_accepted.html'));
})

app.get('/index', (req, res) => {
  // @NOTE Uncomment -> Joe's stuff
  // res.sendFile(path.join(__dirname + '/public/index.html'));

  const appString = renderToString(<App />);

  res.send(template(
    body: appString,
    title: 'Source WiFi'
  ));
})

app.listen(8080, () => {
  // @NOTE Uncomment -> Joe's stuff
  firewall = new Firewall();

  // @TODO: use node-cron https://github.com/kelektiv/node-cron
  waitOneHour(){
    date = Date();
    setTimeOut(() => acct_mid.createTimeSlice(date, waitOneHour), 60*60*60*1000);
  }

  // I want it to start the accouting sequence for everything
  waitOneSecond(){
    date = Date();
    setTimeOut(() => getStatsWithDelay(date, waitOneSecond),1000);
  }

  // Starts recording that shit
  now = Date();
  createTimeSlice(now, waitOneHour);

  console.log('Source is running...');

})
