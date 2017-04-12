import Firewall from '@sourcenetworks/node-firewall';
import { promisify } from 'bluebird';
import dateTime from 'node-dateTime';
import { exec, execSync} from 'child_process';
import Acct from './accounting-middleware';
import _ from 'lodash';
import Wallet from './wallet';

// @TODO: Still need to integrate ethereum part checking payment
// @TODO: Ethereum/payment checking
// @TODO: create a way for devices to get on for free

const PIPE = '|';
const NOT = '-v';
const GREP_REMOVE_CHAIN = 'grep -v Chain';
const REG_EX_MAC = '^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$';
const REG_EX_IP = '[0-9]+.[0-9]+.[0-9]+.[0-9]+';

let firewall;
const { Client, Provider, Session, TimeSlice} = Models();


export default function getStatsWithDelay(date, callback) {
  var StatsIn = firewall.getAccountingAllDevicesIn();
  var StatsOut = firewall.getAccountingAllDevicesOut();

  getStatsToPort(8454, date, StatsIn);
  checkDifferentMACAddresses(date, callback, StatsIn, StatsOut);

  callback();

  // For old time's sake -> it's not necessary anymore
  // storeRawtoTextFile(StatsIn, StatsOut, date);
}

  /***
    @function: goes through the data and writes to DB all the Client devices
    @param: Date() object
    @param: in_put: bash output of firewall in
    @param: in_put: bash output of firewall out
  ***/
checkDifferentMACAddresses(date, in_put, out_put) {
  var statsin = in_put;
  var statsout = out_put;

  while (execSync(statsin + PIPE + 'grep ' + REG_EX_MAC + ' -q') === 1 ) {
    // Grab the first line matching a MAC Address
    exec(statsin + PIPE + 'grep ' + REG_EX_MAC + PIPE + ' -m 1' + ' -o').
    then(mac => getStatsForMAC(mac, date, statsin, statsout);

    statsin = execSync(in_put + PIPE + 'grep ' + NOT + mac + '-m 1');
    statsout = execSync(out_put + PIPE + 'grep ' + NOT + mac + '-m 1');
  }
}

/***
  @function Grabs Stats from bash output and updates session + client models
  @param macAdd: MACAddress -> What's the current MAC Address
  @param date: Date() object -> What's the current date
  @param statsin: Bash output for accouting chain for input
  @param statsout: Bash output for accouting chain for output
***/
getStatsForMAC(macAdd, date, statsin, statsout) {

  var bytesIn = getByteCount(statsin);
  var bytesOut = getByteCount(statsout);

  Acct.updateCurrentSessionByMAC(macAdd, bytesIn, bytesOut).
    then(session => Acct.revokeSession(session, macAdd);
}

/***
  @function: Returns the byte count for a specific amount of time
  @param: output: Bash output
***/
getByteCount(output) {
  return exec(output + PIPE + 'grep ${MACAdd}' + ' -m 1').
    then(one_mac_stats => _.words(one_mac_stats, /[^, ]+/g)).
    then(split_words => _.toNumber(split_words[1]));
}

/***
  @function: Writes to DB the people that have interacted with the port
  @param: Port we should look at (usually going to be 8545)
  @param: Date() object
  @param: Bash output that needs to be parsed
***/
getStatsToPort(port, date, output) {
  exec(output + PIPE + 'grep' + ${port}).
  then(port_output => {
    while (execSync(port_output + PIPE + 'grep ' REG_EX_MAC + ' -q') === 1 ) {
      exec(port_output + PIPE + 'grep ' + REG_EX_MAC + ' -o' + ' -m 1').
      then(mac => Session.find({ Current: true })).
      then(session => _.includes(session, mac)).
      then(result => {
        if (!result) {
          var client = Client.find({MACAddress: mac}).update({ Contacted_Node: true });
          var fromAdd = client.Ethereum_Address;
          Wallet.getTransactionToRouter(myAdd, fromAdd).
            then(amount => amountToBytes(amount)).
            then(bytes => createSession(date, mac, bytes);
        }
      });
      port_output = execSync(port_output + PIPE + 'grep ' + NOT + mac + '-m 1');
    }
  });
}

storeRawtoTextFile(StatsIn, StatsOut, date) {
    // Add the whole output to a text file and get rid of
    // anything that isn't part of the core table
  execSync(StatsIn + PIPE + GREP_REMOVE_CHAIN + '> ${date}+In.txt');
  execSync(StatsOut + PIPE + GREP_REMOVE_CHAIN +'> ${date}+Out.txt');
  return true;
}

/***
  Now unncessary
  @function: Makes our JS object of statistics
              and makes it a JSON Object
***/
convertMACAddressStatsToJSON(rightNow){
  return JSON.stringify(rightNow);
}



/***
  @function: filters from background_lib and takes the payments
    --> The corresponding MACAddresses that we have with ethereum wallet
    --> Sets the time alloted
***/
