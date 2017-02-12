// import express from string express
//

// FIX

import express from 'express';
import path from 'path';
import Firewall from './firewall';

const app = express();
let firewall;

app.get('/', (req, res) => {
  res.redirect(302, '/index')
})

app.get('/terms_accepted', (req, res) => {
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ipAddress = ipAddress.substring(7);

  return firewall.getMac(ipAddress)
  .then(firewall.grantAccess)
  .then(() => res.sendFile(path.join(`${__dirname}/html/terms_accepted.html`)));
});

app.get('/index', (req, res) => {
  return res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.listen(80, () => {
  firewall = new Firewall();
  console.log('Source is running...')
});
