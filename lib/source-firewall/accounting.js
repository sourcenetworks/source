import Firewall from './firewall.js';
import { promisify } from 'bluebird';
import dateTime from 'node-dateTime';               // https://www.npmjs.com/package/node-datetime
import { exec, execSync} from 'child_process';
import _ from 'lodash';                             // Utility, read documentation

// Decouple this from the front end when it's displaying the accounting statistics
// We will also need admin and password settings, duh
/// We don't need to write any of this!!!

// @todo Last. Setting up a mongo instance locally?

// @todo Refactor --> Lots of repeated code with IN and OUT
// @todo Refactor code with
// @todo Refactor to only export the single function??

const execCmd = promisify(exec);
const PIPE = '|';
const NOT = '-v';
const GREP_HEAD = 'grep pkts';
const GREP_REMOVE_CHAIN = 'grep -v Chain';
const REG_EX_MAC = '^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$';

let firewall;

export default class Accounting {

// @todo 2. Grab some all the listed IP Addresses in an array (or can we get from grep output?)

// @todo 1. The accounting object for one single moment in time
    // @todo 2. There should be a list of allowed MAC Addresses, and then log any that are not supposed to be on there.

    getStatisticsEvery(timeslice) {
        return setInterval(getStatisticsWithTimeStamp(), timeslice);
    }

    getStatisticsWithTimeStamp() {
        var StatsIn = firewall.getAccountingAllDevicesIn();
        var StatsOut = firewall.getAccountingAllDevicesOut();
        var date = dateTime.now();

        storeRawtoTextFile(StatsIn, StatsOut, date);

        var rightNow = checkDifferentMACAddresses(MACAddresses, date);

        var rightNowJSONified = convertMACAddressStatsToJSON(rightNow);

        return rightNowJSONified;

    }

    // Iterate through list of MACAddresses
    checkDifferentMACAddresses(MACAddresses, date) {

        var statsForMACAll= [];
        var unAllowedMacAdd = [];
        var output = []; //The two text files that we should be working with in an array

        // Gets the traffic stats for the MAC Addresses we know about
        // MACAddresses.forEach(function(MACAddress) {
        //     var statsForOne = statsForMAC(MACAddress, date, 1, 1);
        //     statsForMACAll.push(statsForOne[0]);
        //     output = [statsForOne[1], statsForOne[2]];
        // });

        while (execSync('grep ' + output[0] + REG_EX_MAC + ' -q') === 1 ) {

            // Grab the MAC Address thooooooooo.
            var grabbedMacAdd = execSync('grep ' + output[0] + REG_EX_MAC + ' -o' + PIPE + ' head -1');

            if (MACAddresses.includes(grabbedMacAdd)) {
                // It is on the list then do
                var statsForOne = statsForMAC(grabbedMacAdd, date, 1, 0);
                statsForMACAll.push(statsForOne[0]);
                output = [statsForOne[1], statsForOne[2]];
            } else {
                // If there's another IP Address on there that's not listed as an IP Address, then take note.
                unAllowedMacAdd.push(grabbedMacAdd);
                var statsForOne = statsForMAC(grabbedMacAdd, date, 0, 0);
                statsForMACAll.push(statsForOne[0]);
                output = [statsForOne[1], statsForOne[2]];
            }

        }

        return statsForMACAll;
    }



    /****
    // @function Let's you know what's going on with an object at any one time
    // @param MACAddress: MACAddress -> What's the current MAC Address
    // @param date: dateTime -> What's the current date
    // @param allowed: Bool -> Let's you know if this device is allowed on or not
    // @param free: Bool -> Let's you know if this device has been allowed on for free or not
    ***/

    // @todo: Split into multiple different functions
    getStatsForMAC(MACAddress, date, allowed, free) {

        var grepStatIn = execSync('grep ${MACAddress}' + ' < ${date}+In.txt');
        var grepStatOut = execSync('grep ${MACAddress}' + ' < ${date}+Out.txt');

        // What's the output without the current MACAddress
        var grepStatInV = execSync('grep ${MACAddress}' + NOT + ' < ${date}+In.txt');
        var grepStatOutV = execSync('grep ${MACAddress}' + NOT + ' < ${date}+Out.txt');

        var statsForMACIn = _.words(grepStatIn, /[^, ]+/g);
        var statsForMACOut = _.words(grepStatOut, /[^, ]+/g);

        // In
        var pktsIn = _.toNumber(statsForMACIn[0]);
        var bytesIn = _.toNumber(statsForMACIn[1]);

        // Out
        var pktsOut = _.toNumber(statsForMACOut[0]);
        var bytesOut = _.toNumber(statsForMACOut[1]);

        // Dictionary with bytes and packets in
        var MACAddressIn = {
            'Packets': pktsIn,
            'Bytes': bytesIn
        }

        // Dictionary with bytes and packets out
        var MACAddressOut = {
            'Packets': pktsOut,
            'Bytes': bytesOut
        }

        // The whole thing

        // @todo: Need to define new dictionary object that is accessible by everyone else
        //        Need to compare the existing data base right now
        // if MACAddressStat[MACAddress]

        // else

        var MACAddressStat = {
            'MACAddress' : MACAddress,
            'Time' : date,
            'Allowed' : allowed,
            'Free': free,
            'Data In': MACAddressIn, // Dictionary with bytes and packets in
            'Data Out': MACAddressOut // Dictionary with bytes and packets out
            // Add a time left counter??
        };

        return [MACAddressStat, grepStatOutV, grepStatInV];
    }

    // @function: Makes our JS object of statistics and makes it a JSON Object
    convertMACAddressStatsToJSON(rightNow){
        return JSON.stringify(rightNow);
    }

    storeRawtoTextFile(StatsIn, StatsOut, date) {
        // Add the whole output to a text file and get rid of anything that isn't part of the core table
        execSync(StatsIn + PIPE + GREP_REMOVE_CHAIN + '> ${date}+In.txt');
        execSync(StatsOut + PIPE + GREP_REMOVE_CHAIN +'> ${date}+Out.txt');

        execSync(GREP_HEAD + '-v' + ' < ${date}+In.txt');
        execSync(GREP_HEAD + '-v' + '< ${date}+Out.txt');

        // These should always be the same, so why is this necessary?
        var finalHeaders = _.words(HEAD_IN) === _.words(HEAD_OUT);

        return true;
    }

    // Might not be Necessary within Accounting.js

    // @function: For a given MAC Address, calculate how long they've been on for the current session
    // @param: MAC Address for a given device
    calculateSessionLength(macAddress) {

    }
}
