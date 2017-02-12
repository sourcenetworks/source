export INITIAL_POLICY_COMMANDS = [
  'sudo iptables -t filter -N SOURCE_PASS;',
  'sudo iptables -t filter -P FORWARD DROP;',
  'sudo iptables -t filter -A FORWARD -j SOURCE_PASS;',
  'sudo iptables -A FORWARD -j SOURCE_PASS -i eth0;',
  'iptables -t nat -A POSTROUTING -p all -o eth0 -j MASQUERADE;'
];

export DNS_FORWARDING_COMMANDS = [
  'sudo iptables -t filter -I FORWARD -p udp --dport 53 -j ACCEPT;',
  'sudo iptables -t filter -I FORWARD -p udp --sport 53 -j ACCEPT;'
];

export PORT_WHITELISTING_COMMANDS = (port) => {
  return [
    `sudo iptables -t filter -I FORWARD -p tcp --dport ${port} -j ACCEPT;`,
    `sudo iptables -t filter -I FORWARD -p tcp --sport ${port} -j ACCEPT;`
  ];
};

export DOMAIN_WHITELISTING_COMMANDS = (domain) => {
  return [
    `sudo iptables -t filter -I FORWARD -p tcp --dest ${domain} -j ACCEPT;`,
    `sudo iptables -t filter -I FORWARD -p tcp --src ${domain} -j ACCEPT;`
  ];
};

export CAPTIVE_PORTAL_COMMANDS = (captivePortalAddress) => {
  return [
    `sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination ${captivePortalAddress};`,
    `sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 -j DNAT --to-destination ${captivePortalAddress};`
  ];
};

export ACCESS_GRANTING_COMMAND = (mac) => {
  return `sudo iptables -t filter -A SOURCE_PASS -m mac --mac-source ${mac} -j ACCEPT;`
};

export ACCESS_REVOKING_COMMAND = (mac) => {
  return `sudo iptables -t filter -D SOURCE_PASS -m mac --mac-source ${mac} -j ACCEPT;`
};
