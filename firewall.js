'use strict';

// promsify exec sync so you can catch errors]
// make objects out your commands so they are more modular

const execSync = require('child_process').execSync;

const captivePortalAddress = '192.168.24.1:4040';

const whitelist_domains = [
  'source.com'
]

const whitelist_ports = [
]

function Firewall() {}

Firewall.init = function() {
  // Initial policies
  execSync('sudo iptables -t filter -N SOURCE_PASS' +
           'sudo iptables -t filter -A FORWARD -j SOURCE_PASS'
           'sudo iptables -t filter -P SOURCE_PASS DROP' +
           'sudo iptables -t filter -P FORWARD DROP' +
  );

  // DNS Forwarding
  execSync('sudo iptables -t filter -I FORWARD -p udp --dport 53 -j ACCEPT;' +
           'sudo iptables -t filter -I FORWARD -p udp --sport 53 -j ACCEPT'
  );

  // Whitelisting
  whitelist_ports.forEach(function(port) {
    execSync('sudo iptables -t filter -I FORWARD -p tcp --dport ' + port +
                ' -j ACCEPT;' +
             'sudo iptables -t filter -I FORWARD -p tcp --sport ' + port +
                ' -j ACCEPT'
    );
  });

  whitelist_domains.forEach(function(domain) {
    execSync('sudo iptables -t filter -I FORWARD -p tcp --dest ' + domain +
                ' -j ACCEPT;' +
             'sudo iptables -t filter -I FORWARD -p tcp --src ' + domain +
                ' -j ACCEPT'
    );
  });

  // Setup forwarding captive portal
  execSync('sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80' +
              '-j DNAT --to-destination ' + captivePortalAddress + ';' +
           'sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443' +
              '-j DNAT --to-destination ' + captivePortalAddress
  );

  return;
}

Firewall.grantAccess = function(mac) {
  execSync('sudo iptables -t filter -A SOURCE_PASS -m ' + mac + '-j ACCEPT');
}

Firewall.revokeAccess = function(mac) {
  execSync('sudo iptables -t filter -D SOURCE_PASS -m ' + mac + '-j ACCEPT');
}

Firewall.getMac = function(ip_addr) {
  $arp = "/usr/sbin/arp"; // Attempt to get the client's mac address
  $mac = shell_exec("$arp -a ".$_SERVER['REMOTE_ADDR']);
preg_match('/..:..:..:..:..:../',$mac , $matches);
$mac2 = $matches[0];
  mac = execSync('sudo iptables -t filter -D SOURCE_PASS -m ' + mac + '-j ACCEPT');
  return mac;
}

// TODO log traffic

module.exports = Firewall;
