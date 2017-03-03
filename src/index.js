import express from 'express';
import path from 'path';
import Firewall from '@sourcenetworks/node-firewall';

const app = express();
let firewall;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(302, 'http://hotspot.localnet/index');
});

app.get('/terms_accepted', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.substring(7);

  return firewall.getMAC(ip)
  .then(mac => firewall.grantAccess(mac))
  .then(() => res.sendFile(`${__dirname}/public/terms_accepted.html`));
});

app.get('/index', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(80, () => {
  firewall = new Firewall();
  console.log('Source is running...');
});
