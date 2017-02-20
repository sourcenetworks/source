import { promisify } from 'bluebird';
import { exec, execSync } from 'child_process';
import _ from 'lodash';

import {
  INITIAL_POLICY_COMMANDS,
  DNS_FORWARDING_COMMANDS,
  DCHP_FORWARDING_COMMANDS,
  PORT_WHITELISTING_COMMANDS,
  DOMAIN_WHITELISTING_COMMANDS,
  CAPTIVE_PORTAL_COMMANDS,
  ACCESS_GRANTING_COMMAND,
  ACCESS_REVOKING_COMMAND
} from './iptables';

const execCmd = promisify(exec);

export default class Firewall {
  constructor(options) {
    // TODO: Update static variables to pull from config file
    const captivePortalAddress = '192.168.24.1:80';
    const whitelistedDomains = ['www.sourcewifi.com'];
    const whitelistedPorts = ['8080'];

    INITIAL_POLICY_COMMANDS.forEach(execSync);
    DNS_FORWARDING_COMMANDS.forEach(execSync);
    _.flatten(whitelistedPorts.map(PORT_WHITELISTING_COMMANDS)).forEach(execSync);
    _.flatten(whitelistedDomains.map(DOMAIN_WHITELISTING_COMMANDS)).forEach(execSync);
    CAPTIVE_PORTAL_COMMANDS(captivePortalAddress).forEach(execSync);
  }

  grantAccess(macAddress) {
    return execSync(_.flatten(ACCESS_GRANTING_COMMAND(macAddress)));
  }

  revokeAccess(macAddress) {
    console.log(_.flatten(ACCESS_REVOKING_COMMAND(macAddress)));
    return execSync(_.flatten(ACCESS_REVOKING_COMMAND(macAddress)));
  }

  getMAC(ipAddress) {
    return execCmd(`sudo arp -a ${ipAddress} | cut -d " " -f 4`)
    .then(mac => mac.toString())
    .then(mac => mac.substring(0, mac.length - 1));
  }
}
