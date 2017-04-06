import mongoose from 'mongoose';
import {
  ProviderSchema,
  ClientSchema,
  SessionSchema,
  TimeSliceSchema
  }
  from '../schemas';


export default function() {
  const Provider = mongoose.model('Provider', ProviderSchema);
  const Client = mongoose.model('Client', ClientSchema);
  const Session = mongoose.model('Session', SessionSchema);
  const TimeSlice = mongoose.model('TimeSlice', TimeSliceSchema);

  return {
    Provider,
    Client,
    Session,
    TimeSlice
  };
};
