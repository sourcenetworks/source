import express from 'express';
import path from 'path';

// @NOTE Uncomment -> Joe's stuff
// import Firewall from '@sourcenetworks/node-firewall';

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './app';
import template from './template';

const app = express();

// @NOTE Uncomment -> Joe's stuff
// let firewall;

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

  // @NOTE Uncomment -> Joe's stuff
  return /* mac = firewall.getMAC(ip_addr)
  .then(mac => firewall.grantAccess(mac)
  .then(() => */ res.sendFile(path.join(__dirname + '/public/terms_accepted.html'));
})

app.get('/index', (req, res) => {
  // @NOTE Uncomment -> Joe's stuff
  // res.sendFile(path.join(__dirname + '/public/index.html'));

  const appString = renderToString(<App />);

  res.send(template(
    body: appString,
    title: 'Dick WiFi'
  ));
})

app.listen(8080, () => {
  // @NOTE Uncomment -> Joe's stuff
  // firewall = new Firewall()


  // @TODO: Logic to set interval for stuff grabbing the IP Table business
  console.log('Source is running...');

})
