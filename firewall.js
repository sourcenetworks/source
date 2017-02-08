'use strict';

const execSync = require('child_process').execSync;

function Firewall() {}

Firewall.giveAccessToMacForTime = function(mac, time) {
  execSync('sudo iptables -I BITERNET_NODE_DOWN -d ' + ipaddr + ' -j ACCEPT;' +
           'sudo iptables -I BITERNET_NODE_UP -s ' + ipaddr + ' -j ACCEPT'
  );
  return;
}

Firewall.revokeAccessForMac = function(time) {
  execSync('sudo iptables -I BITERNET_NODE_DOWN -d ' + ipaddr + ' -j ACCEPT;' +
           'sudo iptables -I BITERNET_NODE_UP -s ' + ipaddr + ' -j ACCEPT'
  );
  return;
}

Firewall.testFunction = function() {
  return 'test function worked';
}

module.exports = Firewall;
