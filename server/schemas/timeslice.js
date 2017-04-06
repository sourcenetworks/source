import { Schema } from 'mongoose';
import ClientSchema from './Client';

export default TimeSliceSchema = new Schema({
  TimeStamp_Hour: Date,
  Devices: [               // Array of Minutes
    [                       // Array of Seconds
      [ClientSchema]        // Array of Clients
    ]
  ]
});
