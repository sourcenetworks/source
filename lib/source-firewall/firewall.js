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
  ACCESS_REVOKING_COMMAND,
  ACCOUNTING_SESSION_START_COMMANDS,
  ACCOUNTING_SESSION_RESET_COMMANDS,
  ACCOUNTING_SESSION_DELETE_COMMANDS,
  GET_ALL_ACCOUNTING_SESSIONS_COMMANDS,
  WATCH_ACCOUNTING_SESSIONS_COMMANDS
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
    return _.flatten(ACCESS_GRANTING_COMMAND(macAddress)).forEach(execSync);
  }

  revokeAccess(macAddress) {
    return _.flatten(ACCESS_REVOKING_COMMAND(macAddress)).forEach(execSync);
  }

  getMAC(ipAddress) {
    return execCmd(`sudo arp -a ${ipAddress} | cut -d " " -f 4`)
    .then(mac => mac.toString())
    .then(mac => mac.substring(0, mac.length - 1));
  }

  // Start tracking a specific MAC address
  startAccountingMAC(macAddress) {
    return _.flatten(ACCOUNTING_SESSION_START_COMMANDS)).forEach(execSync);
  }

  // Reset the counter to zero for a given device at the ip_addr
  deleteAccountingMAC(macAddress) {
    return _.flatten(ACCOUNTING_SESSION_DELETE_COMMANDS(macAddress)).forEach(execSync);
  }

  // Gets the accounting session at one instance
  getAccountingDevices() {
    return _.flatten(GET_ALL_ACCOUNTING_SESSIONS_COMMANDS)).forEach(execSync);
  }


  // My thought process is loop to call function to grab data (every 1s)
  // -> this outputs to terminal (as it do)
  // -> we pipe and grep it up ->
  // -> grep to JSON objects (with space delimited making it a new object ???)
  //          -> top line becomes key and then rest of table is values
  // -> store JSON in mongo
  // -> mongo to admin panel/passed to front end

}
