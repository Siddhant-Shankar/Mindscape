// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}); //Defines the shape of the user document - email and password

// Create the model…
const User = mongoose.model('User', userSchema); //Creates a user model 

// …and export it as the default export
export default User;
