export const INITIAL_POLICY_COMMANDS = [
  'sudo iptables -t filter -N SOURCE_PASS;' +
  'sudo iptables -t filter -A FORWARD -j SOURCE_PASS;' +
  'sudo iptables -t filter -A SOURCE_PASS -d 192.168.24.1 -j ACCEPT;' +
  'sudo iptables -t filter -A FORWARD -d 192.168.24.1 -j ACCEPT;' +
  'sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;' +
  'sudo iptables -t filter -P FORWARD DROP;' +
  'sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT;' +

  // What Dillon added
  'sudo iptables -N INET_OUT;' +
  'sudo iptables -N INET_IN;' +
  // http://unix.stackexchange.com/questions/96548/what-is-the-difference-between-output-and-forward-chains-in-iptables
];

export const DNS_FORWARDING_COMMANDS = [
  'sudo iptables -t filter -I FORWARD -p udp --dport 53 -j ACCEPT;',
  'sudo iptables -t filter -I FORWARD -p udp --sport 53 -j ACCEPT;'
];

export const DHCP_FORWARDING_COMMANDS = [
  'sudo iptables -t filter -I FORWARD -p udp --dport 67 -j ACCEPT;',
  'sudo iptables -t filter -I FORWARD -p udp --sport 67 -j ACCEPT;'
];

export function PORT_WHITELISTING_COMMANDS (port) {
  return [
    `sudo iptables -t filter -I FORWARD -p tcp --dport ${port} -j ACCEPT;`,
    `sudo iptables -t filter -I FORWARD -p tcp --sport ${port} -j ACCEPT;`
  ];
};

export function DOMAIN_WHITELISTING_COMMANDS (domain) {
  return [
    `sudo iptables -t filter -I FORWARD -p tcp --dest ${domain} -j ACCEPT;`,
    `sudo iptables -t filter -I FORWARD -p tcp --src ${domain} -j ACCEPT;`
  ];
};

export function CAPTIVE_PORTAL_COMMANDS (captivePortalAddress) {
  return [
    `sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination ${captivePortalAddress};`,
    `sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 -j DNAT --to-destination ${captivePortalAddress};`
  ];
};

export function ACCESS_GRANTING_COMMAND (mac) {
  return [
    `sudo iptables -t filter -A SOURCE_PASS -m mac --mac-source ${mac} -j ACCEPT;`,
    `sudo iptables -t nat -I PREROUTING -m mac --mac-source ${mac} -j RETURN;`
  ];
};

export function ACCESS_REVOKING_COMMAND (mac) {
  return `sudo iptables -t filter -D SOURCE_PASS -m mac --mac-source ${mac} -j ACCEPT;`
};

// Adds a given Mac Address to track usage statistics
export function ACCOUNTING_SESSION_START_COMMANDS (mac) {
  return [

    // Insert if - else if mac address is already on table
    `sudo iptables -A INPUT -m mac --mac-source ${mac} -j INET_IN;`,
    `sudo iptables -A OUTPUT -m mac --mac-source ${mac} -j INET_OUT;`
  ];
}

// Resets a Mac Address' to track usage statistics
export function ACCOUNTING_SESSION_RESET_COMMANDS (mac) {
  return [
    // I don't know if this is syntactically correct, I wasn't able to find much -c flag usage
    `sudo iptables -c INPUT -m mac --mac-source ${mac} -j INET_IN;`,
    `sudo iptables -c OUTPUT -m mac --mac-source ${mac} -j INET_OUT;`
  ];
}

// Deletes a given Mac Address from the accounting session
export function ACCOUNTING_SESSION_DELETE_COMMANDS (mac) {
  return [
    `sudo iptables -D INPUT -m mac --mac-source ${mac} -j INET_IN;`,
    `sudo iptables -D OUTPUT -m mac --mac-source ${mac} -j INET_OUT;`
  ];
}

export constant DELETE_ALL_ACCOUNTING_SESSIONS_COMMANDS = [
  'sudo iptables -L INET_IN -Z;' +
  'sudo iptables -L INET_OUT -Z;'
];

// Need to be piped the output of the commands (how much data, how is this actually grabbed?)
export constant GET_ALL_ACCOUNTING_SESSIONS_COMMANDS = [
  'sudo iptables -vnL INET_IN;' +
  'sudo iptables -vnL INET_OUT;'
];

export constant GET_INET_OUT = [
  'sudo iptables -vnL INET_OUT;'
];

export constant GET_INET_IN = [
  'sudo iptables -vnL INET_IN;'
];

// Watch accounting sessions in another window
// Probably not that useful
export constant WATCH_ACCOUNTING_SESSIONS_COMMANDS = [
  'sudo watch -n 1 iptables -vnL INET_OUT;' +
  'sudo watch -n 1 iptables -vnL INET_IN;'
];

