import { Schema } from 'mongoose';

export default ProviderSchema = new Schema({
  name: String,
  email: String,
  phone_number: String,
  verified: Boolean,
  ethereum_addresses: [String],
  ethereum_privatekeys: [String],
  devices: [{
    id: String,
    model: String,
    type: String,
  }],
});
