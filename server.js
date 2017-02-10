// import express from string express
//

// FIX

const express   =   require('express');
const firewall  =   require('./firewall');

const app = express();

app.get('/', function (req, res) {
  res.redirect(302, '/hotspot')
})

app.get('/terms_accepted', function(req, res) {
  var ip_addr = req.connection.remoteAddress;
  var mac = firewall.getMac(ip_addr);
  firewall.grantAccess(mac);
})

app.get('/hotspot', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(80, function () {
  console.log('Source is running...')
})
