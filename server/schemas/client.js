import { Schema } from 'mongoose';
import SessionSchema from './session';

export default ClientSchema = new Schema({
  MACAddress: String,
  Contacted_Node: Boolean,
  Allowed: Boolean,
  Free: Boolean,
  Session_Bytes_In: Number,
  Current_Session: SessionSchema,
  Past_Sessions: [SessionSchema],
});
