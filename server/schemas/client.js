import { Schema } from 'mongoose';
import SessionSchema from './session';

export default ClientSchema = new Schema({
  MACAddress: String,
  Ethereum_Address: String.
  Contacted_Node: Boolean,
  Email: { type: String, required: true, index: {unique: true } },
  Allowed: Boolean,
  Free: Boolean,
  Current_Session: SessionSchema,
  Past_Sessions: [SessionSchema],
});
