import { Schema } from 'mongoose';

export default SessionSchema = new Schema({
  Session_ID: ObjectID,
  MACAddress: String,
  Current: Boolean,
  Start_Time: Date,
  Bytes_Allowed: Number,
  Bytes_Out: Number,
  Bytes_In: Number,
  Time_Remaining: Number,
  End_Time: Date,
});
