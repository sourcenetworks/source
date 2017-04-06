import Firewall from './firewall.js';
import { promisify } from 'bluebird';
import dateTime from 'node-dateTime';
import { exec, execSync} from 'child_process';
import _ from 'lodash';

// @TODO: Refactor --> Lots of repeated code with IN and OUT
// @TODO: Refactor to only export the single function??
// @TODO: Refactor to include diff matching
// @TODO: Refactor to create an actual Accounting object -> is there a standard?
// @TODO: Last. Setting up a mongo instance locally?

const execCmd = promisify(exec);
const PIPE = '|';
const NOT = '-v';
const GREP_HEAD = 'grep pkts';
const GREP_REMOVE_CHAIN = 'grep -v Chain';
const REG_EX_MAC = '^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$';
const REG_EX_IP = '[0-9]+.[0-9]+.[0-9]+.[0-9]+';

let firewall;

export default class Accounting {

// @TODO 1. The accounting object for one single moment in time
// @TODO 2. There should be a list of allowed MAC Addresses,
//          and then log any that are not supposed to be on there.

    getStatisticsEvery(timeslice) {
        return setInterval(getStatisticsWithTimeStamp(), timeslice);
    }

    getStatisticsWithTimeStamp() {
        var StatsIn = firewall.getAccountingAllDevicesIn();
        var StatsOut = firewall.getAccountingAllDevicesOut();
        var date = ;

        storeRawtoTextFile(StatsIn, StatsOut, date);

        var rightNow = checkDifferentMACAddresses(MACAddresses, date);
        var rightNowJSONified = convertMACAddressStatsToJSON(rightNow);

        return rightNowJSONified;
    }

    // @TODO: Need to do something with the unallowed MAC Addresses

    // Iterate through list of MACAddresses
    checkDifferentMACAddresses(MACAddresses, date) {

        var statsForMACAll= [];
        var unallowedMacAdd = [];
        var output = []; //The two text files that we should be working with in an array

        // Gets the traffic stats for the MAC Addresses we know about
        // MACAddresses.forEach(function(MACAddress) {
        //     var statsForOne = statsForMAC(MACAddress, date, 1, 1);
        //     statsForMACAll.push(statsForOne[0]);
        //     output = [statsForOne[1], statsForOne[2]];
        // });

        while (execSync('grep ' + output[0] + REG_EX_MAC + ' -q') === 1 ) {

            // Grab the MAC Address thooooooooo.
            var grabbedMacAdd = execSync(
              'grep ' + output[0] + REG_EX_MAC + ' -o' + PIPE + ' head -1'
            );

            if (MACAddresses.includes(grabbedMacAdd)) {
                // It is on the list then do
                var statsForOne = getStatsForMAC(grabbedMacAdd, date, 1, 0);
                statsForMACAll.push(statsForOne[0]);
                output = [statsForOne[1], statsForOne[2]];
            } else {
                // If there's another IP Address on there that's not listed as an IP Address, then take note.
                unallowedMacAdd.push(grabbedMacAdd);
                var statsForOne = getStatsForMAC(grabbedMacAdd, date, 0, 0);
                statsForMACAll.push(statsForOne[0]);
                output = [statsForOne[1], statsForOne[2]];
            }
        }

        return statsForMACAll;
    }


    getStatsToPort(port, date) { // I really want to make these recursive
        var macContactNode = [];

        var output = execSync('grep' + ${port} + '> ${date}+In.txt');

        while (execSync('grep ' REG_EX_MAC + ' -q' + output) === 1 ) {
          exec('grep ' + REG_EX_MAC + ' -o' + '-m 1' + output)
            .then((mac) => {
              addContactNode.push({
                'macAddress' : mac,
                'when' : date,
              });
              output = execSync('grep ' + NOT + mac + ' -o' + '-m 1' + output);
            });
        }

        // @TODO: Add this to schema (Device Accounting) not it's own thing...
        return macContactNode;
    }

    /****
    // @function Let's you know what's going on with an object at any one time
    // @param MACAddress: MACAddress -> What's the current MAC Address
    // @param date: dateTime -> What's the current date
    // @param allowed: Bool -> Let's you know if this device is allowed on or not
    // @param free: Bool -> Let's you know if this device has been allowed on for free or not
    ***/

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
        //        Need to compare the existing database

        var MACAddressStat = {
            'MACAddress' : MACAddress,
            'Time' : date,
            'Allowed' : allowed,
            'Free': free,
            'Data In': MACAddressIn,
            'Data Out': MACAddressOut,
            'Contacted Node': no,
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
        return true;
    }

    // Might not be Necessary within Accounting.js

    /***
    /  @function For a given MAC Address, calculate how long
    /           they've been on for the current session
    /  @param       macAddress:  for a given device ***/
    calculateSessionLength(macAddress) {

    }
}
