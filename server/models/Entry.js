import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:             { type: String, required: true },
  mood:                { type: String },
  sentimentScore:      { type: Number },
  sentimentLabel:      { type: String },
  sentimentConfidence: { type: Number, min: 0, max: 1 },
  createdAt:           { type: Date, default: Date.now }
});

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
