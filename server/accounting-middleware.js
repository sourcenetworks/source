import Models from './models';
import express from 'Express';
import _ from 'lodash';

/*
@NOTE: This seems like a shit ton of IO and probably not the right way
       to do things
@NOTE: We don't have any middleware right now
@NOTE: This should evolve into where wrappers for Mongoose
       are stored.
*/

const { Client, Provider, Session, TimeSlice} = Models();

module.exports = {
  createClient(macAddress, ethAddress) {
    const client = new Client({
      MACAddress: macAddress,
      Ethereum_Address: ethAddress,
      Contacted_Node: false,
      Allowed: false,
      Free: false,
    });

    return client.save();
  }

  // @TODO: Update to support creating sessions by amount of time
  createSession(date, macAdd, bytes) {
    const session = new Session({
      Start_Time: date,
      Current: true,
      MACAddress: macAdd,
      Bytes_Allowed: bytes,
      Bytes_Out: 0,
      Bytes_In: 0,
      Bytes_Remaining: bytes,
      // if we meter by time then white list then
    });

    return session.save();
  }

  createTimeSlice(date, callback) {
    const timeslice = new TimeSlice({
      TimeStamp_Hour: date,
    );
    timeslice.save();

    callback();
  }

  addSessionToClient(macAdd, field, data) {
    query = { MACAddress: macAdd };

    session = getMostRecentSessionByMAC(macAdd);

    update = { Current_Session: session };
    Client.findByIDAndUpdate(query, update, () =>
      console.log("We posted that shit");
    );
  }

  updateCurrentSessionByMAC(macAdd, bytes_in, bytes_out) {
    var query = { MACAddress: macAdd, Current: true};
    var update = { Bytes_In: bytes_in, Bytes_Out: bytes_out};

    Session.findOneAndUpdate(query, update, (session) => {
      if (bytes_in + bytes_out >= session.Bytes_Allowed) {
        session.update({ Current : false })
      }
      console.log("We posted that shit");
      return session;
    });
  }

  addClientToTimeSlice(date, mac) {
    // Use diff checking, this really should change that often

    var minute = date.getMinutes();
    var second = date.getSeconds();

    var roundedDate = roundHours(date, 1);

    var client = Client.find({ MACAddress: macAdd});

    query = {TimeStamp_Hour: roundedDate};
    update = {$push: {Device.minute.second.client : client}};

    TimeSlice.findByIDAndUpdate(query, update, {upsert:true}, (e, good) => {
      if (e) return console.log("We got an error " + e));
      return console.log("succesfully saved");
  }

  revokeSessionAndUpdateClient(session, macAdd) {
    if (!session.Allowed) {
      query = { MACAddress: macAdd };
      update = {
        Allowed: false,
        {$push: {Past_Sessions: session}},
        Current_Session: null
      };
      Client.findByIDAndUpdate(query, update);
      firewall.revokeAccess(macAdd));
    }
  }

  updateClient(MACAdd, allowed, free) {
    Client.findByIDAndUpdate(query)
  }

  // @NOTE: Utility functions, I didn't really know where to put them
  roundTo(num, interval) {
    return Math.round(num / interval) * interval;
  }

  roundHours(date, interval) {
    var newDate = new Date(date);
    var h = date.getHours() + date.getMinutes() / 60 +
            date.getSeconds() / 3600 + date.getMilliseconds() / 3600000;
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(roundTo(h, interval));

    return date;
  }
}
