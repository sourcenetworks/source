// promsify exec sync so you can catch errors]
// make objects out your commands so they are more modular

const execSync = require('child_process').execSync;

const captivePortalAddress = '192.168.24.1';

const whitelist_domains = [
  'source.com'
]

const whitelist_ports = [
  67,
  68
]

function Firewall() {}

Firewall.init = function() {
  // Initial policies
  execSync('sudo iptables -t filter -N SOURCE_PASS;' +
           'sudo iptables -t filter -A FORWARD -j SOURCE_PASS;' +
           'sudo iptables -t filter -A SOURCE_PASS -d 192.168.24.1 -j ACCEPT;' +
           'sudo iptables -t filter -A FORWARD -d 192.168.24.1 -j ACCEPT;' +
           'sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;' +
           'sudo iptables -t filter -P FORWARD DROP;' +
           'sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT'
  );

  // Setup forwarding captive portal
  execSync('sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 ' +
              '-j DNAT --to-destination ' + captivePortalAddress + ';' +
           'sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 ' +
              '-j DNAT --to-destination ' + captivePortalAddress
  );


  // DNS Forwarding
  execSync('sudo iptables -t filter -I FORWARD -p udp --dport 53 -j ACCEPT;' +
           'sudo iptables -t filter -I FORWARD -p udp --sport 53 -j ACCEPT'
  );

  // Whitelisting
  whitelist_ports.forEach(function(port) {
    execSync('sudo iptables -t filter -I FORWARD -p udp --dport ' + port +
                ' -j ACCEPT;' +
             'sudo iptables -t filter -I FORWARD -p udp --sport ' + port +
                ' -j ACCEPT'
    );
  });

  whitelist_domains.forEach(function(domain) {
    execSync('sudo iptables -t filter -I FORWARD -p udp --dest ' + domain +
                ' -j ACCEPT;' +
             'sudo iptables -t filter -I FORWARD -p udp --src ' + domain +
                ' -j ACCEPT'
    );
  });

  return;
}

Firewall.grantAccess = function(mac) {
  execSync('sudo iptables -t filter -A SOURCE_PASS -m mac --mac-source ' + mac + ' -j ACCEPT;' +
           'sudo iptables -t nat -I PREROUTING -m mac --mac-source ' + mac + ' -j RETURN'
  );
  console.log(mac);
}

Firewall.revokeAccess = function(mac) {
  execSync('sudo iptables -t filter -D SOURCE_PASS -m mac --mac-source ' + mac + ' -j ACCEPT');
}

Firewall.getMac = function(ip_addr) {
  mac = execSync('sudo arp -a ' + ip_addr + ' | cut -d " " -f 4');
  mac = mac.toString();
  return mac.substring(0, mac.length - 1);
}

// TODO log traffic

module.exports = Firewall;
