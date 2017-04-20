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
import Wallet from './wallet';

// DB stuff
import mongoose from 'Mongoose';

const app = express();
mongoose.connect('mongodb://localhost/source-dev');

let firewall;

/*
  @TODO Fix webpack
  @TODO Payments and such
  @TODO Integrate socket.io
  // @TODO: use node-cron https://github.com/kelektiv/node-cron
  // @TODO: generate a seed on the server side and pass it over?
  //      just need to associate mac address and wallet address
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

// Add authenticated user routes

/* Provider.getAuthenticated('jmar777', 'Password123', function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });
*/

app.post('/provider', (req, res) => {
  const { name, email, password } = req.body;
  var wallet = Wallet.createAccount(password);

  provider = new Provider({
    name: name,
    email: email,
    verified: Boolean,
    password: password,
    mnemonic: wallet.keystore.mnemonic,
    ethereum_addresses: wallet.keystore.addresses,
    ethereum_privatekeys: wallet.keystore.pwDerivedKey,
  });

  provider.save(function(err) {
    if (err) throw err;

    Provider.findOne({ name: name}).
    then((user) => user.comparePassword(password, function(err,
      if (err) throw err;
      console.log(password, isMatch);
    ))).
  });

  return res.send({ name, email, phone, });
})

app.listen(8080, () => {
  // @NOTE Uncomment -> Joe's stuff
  firewall = new Firewall();

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
