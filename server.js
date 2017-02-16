// import express from string express
//

// FIX

const express = require('express');
const firewall = require('./firewall');
var path = require("path");

const app = express();

app.get('/', function (req, res) {
  console.log("/");
  res.redirect(302, '/index')
})

app.get('/terms_accepted', function(req, res) {
  var ip_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip_addr = ip_addr.substring(7);
  console.log(ip_addr);
  var mac = firewall.getMac(ip_addr);
  firewall.grantAccess(mac);
  res.sendFile(path.join(__dirname + '/html/terms_accepted.html'));
})

app.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.listen(80, function () {
  firewall.init();
  console.log('Source is running...')
})
