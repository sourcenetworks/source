'use strict';

const execSync = require('child_process').execSync;

function Firewall() {}

Firewall.giveAccessToMacForTime(mac, time) {
  execSync('sudo iptables -I BITERNET_NODE_DOWN -d ' + ipaddr + ' -j ACCEPT;' +
           'sudo iptables -I BITERNET_NODE_UP -s ' + ipaddr + ' -j ACCEPT'
  );
  return;
}

Firewall.revokeAccessForMac(mac) {
  execSync('sudo iptables -I BITERNET_NODE_DOWN -d ' + ipaddr + ' -j ACCEPT;' +
           'sudo iptables -I BITERNET_NODE_UP -s ' + ipaddr + ' -j ACCEPT'
  );
  return;
}

module.exports = Firewalll;
