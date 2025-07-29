// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//pulling in core libraries and route 

import authRoutes from './routes/auth.js';
import journalRoutes from './routes/journal.js';

dotenv.config();
//dotenv.config gets in PORT, MONGO URI, and JWT Secret from ENV
const app = express(); //instatiation of the express module(itself is a function), used to show web server instance              
const PORT = process.env.PORT || 8000; //instance of the port(set to 8000 - virtual endpoint for network communication to a server)

// Middleware & routes (unchanged)
app.use(cors()); //allows communication from the port for the react app and the port for the backend(cross origin resource sharing)
app.use(express.json()); //parses data from the front end into a json object that can be used by the backend
app.use('/api/auth', authRoutes); //mounts the authetentication routes to the routes/auth.js(any api call goes to that file)
app.use('/api/journal', journalRoutes); //same logic but for journalling

// OPTIONAL: health-check endpoint
app.get('/', (_req, res) => res.send('🟢 MindScape API is alive'));

// Connect to Atlas *then* start listening
mongoose
  .connect(process.env.MONGO_URI) //returns a promise
  .then(() => {
    console.log('✅ Connected to Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Atlas connection error:', err);
  });
