// server/models/Entry.js
import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:        { type: String, required: true },
  mood:           { type: String },
  sentimentScore: { type: Number },
  createdAt:      { type: Date, default: Date.now }
}); //schema for the model

// Create the model…
const Entry = mongoose.model('Entry', entrySchema); //creates a default entry

// …and export it as the default export
export default Entry;