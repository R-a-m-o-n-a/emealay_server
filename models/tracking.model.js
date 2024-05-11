import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
  userId: String,
  datetime: Date,
  page: String,
  subpage: String,
  module: String,
  event: String,
}, { strict: false }); // also add fields that have not been specified (for custom tracking data that can vary a lot)

const Tracking = mongoose.model('Tracking', trackingSchema);

export default Tracking;
