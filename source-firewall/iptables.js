export INITIAL_POLICY_COMMANDS = [
  'sudo iptables -t filter -N SOURCE_PASS;' +
  'sudo iptables -t filter -A FORWARD -j SOURCE_PASS;' +
  'sudo iptables -t filter -A SOURCE_PASS -d 192.168.24.1 -j ACCEPT;' +
  'sudo iptables -t filter -A FORWARD -d 192.168.24.1 -j ACCEPT;' +
  'sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;' +
  'sudo iptables -t filter -P FORWARD DROP;' +
  'sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT'
];

export DNS_FORWARDING_COMMANDS = [
  'sudo iptables -t filter -I FORWARD -p udp --dport 53 -j ACCEPT;',
  'sudo iptables -t filter -I FORWARD -p udp --sport 53 -j ACCEPT;'
];

export DHCP_FORWARDING_COMMANDS = [
  'sudo iptables -t filter -I FORWARD -p udp --dport 67 -j ACCEPT;',
  'sudo iptables -t filter -I FORWARD -p udp --sport 67 -j ACCEPT;'
];

export PORT_WHITELISTING_COMMANDS = function (port) {
  return [
    'sudo iptables -t filter -I FORWARD -p tcp --dport ${port} -j ACCEPT;',
    'sudo iptables -t filter -I FORWARD -p tcp --sport ${port} -j ACCEPT;'
  ];
};

export DOMAIN_WHITELISTING_COMMANDS = function (domain) {
  return [
    'sudo iptables -t filter -I FORWARD -p tcp --dest ${domain} -j ACCEPT;',
    'sudo iptables -t filter -I FORWARD -p tcp --src ${domain} -j ACCEPT;'
  ];
};

export CAPTIVE_PORTAL_COMMANDS = function (captivePortalAddress) {
  return [
    'sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination ${captivePortalAddress};',
    'sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 -j DNAT --to-destination ${captivePortalAddress};'
  ];
};

export ACCESS_GRANTING_COMMAND = function (mac) {
  return [
    'sudo iptables -t filter -A SOURCE_PASS -m mac --mac-source ${mac} -j ACCEPT;',
    'sudo iptables -t nat -I PREROUTING -m mac --mac-source ${mac} -j RETURN'
  ]
};

export ACCESS_REVOKING_COMMAND = function (mac) {
  return 'sudo iptables -t filter -D SOURCE_PASS -m mac --mac-source ${mac} -j ACCEPT;'
};
