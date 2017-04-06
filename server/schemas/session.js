import { Schema } from 'mongoose';

// This is for one slice of time, that doesnt really work
export default SessionSchema = new Schema({
  Start_Time: Date,
  Bytes_Allowed: Number,
  Bytes_Out: Number,
  Bytes_In: Number,
  Bytes_Remaining: Number,
  Time_Remaining: Number,
  End_Time: Date
});
