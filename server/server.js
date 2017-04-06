import express from 'express';
import path from 'path';
import Firewall from '@sourcenetworks/node-firewall';

/*
@TODO: add Background Lib dependency + node setup script (Niraj)
@TODO: create an additional screen with the QR Code. + additional information
       + the IP address that this thing is coming from? (Niraj)
@DONE: IP Tables config mark traffic to and from the ethereum node
       -> Use this for metering a session.
@DONE: Added the whitelisted port for geth node

Payment process starting flow
@DONE    1. See an IP address has made contact with the geth node
@TODO    2. Check if money has been paid to listed add (async, timeone when?)
@TODO    3. On front end, need to make that you can't overpay

In future -> Basic Payment Channel Contract
In future -> Centralized Server to handle hops
In future -> Make the iptable/accounting table thing more robust

@TODO: add Mongoose to this (and set it up thru scripts)
@TODO: create a model for the accounting table + MACAddresses
       + payment information (in Background, make sure these things are
         being posted to the MongoDB instance/
       + need to define the interface for this
*/

const app = express();
let firewall;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(302, 'http://hotspot.localnet/index')
})

app.get('/terms_accepted', (req, res) => {
  let ip_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip_addr = ip_addr.substring(7);

  return mac = firewall.getMAC(ip_addr)
  .then(mac => firewall.grantAccess(mac);
  .then(() => res.sendFile(path.join(__dirname + '/public/terms_accepted.html')));
})

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.listen(80, () => {
  // firewall = new Firewall();
  console.log('Source is running...');

})
