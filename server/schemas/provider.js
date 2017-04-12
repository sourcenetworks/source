import { Schema } from 'mongoose';

// Unsafe rn

export default ProviderSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone_number: String,
  verified: Boolean,
  mnemonic: String,
  ethereum_addresses: [String],
  ethereum_privatekeys: [String],
  devices: [{
    MACAddress: String,
    model: String,
    type: String,
  }],
});
