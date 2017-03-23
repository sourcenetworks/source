import express from 'express';
import path from 'path';
import Firewall from 'source-firewall';
import dateTime from 'node-datetime';

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
  .then(mac => firewall.grantAccess(mac))


  .then(() => res.sendFile(path.join(__dirname + '/public/terms_accepted.html')));
})

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.listen(80, () => {
  firewall = new Firewall();
  console.log('Source is running...')
})
