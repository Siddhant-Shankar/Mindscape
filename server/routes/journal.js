// server/routes/journal.js
import express from 'express';
import jwt     from 'jsonwebtoken';
import Entry   from '../models/Entry.js';

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/* 
this part is meant for authenticating the user and making sure the jwt token matches the user its supposed to match to
*/

// Create entry
router.post('/', auth, async (req, res) => {
  try {
    const entry = await Entry.create({ ...req.body, userId: req.userId });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get entries
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 
Creates a post request and the first thing is from the body of the the request with the user id
and then we create the entry schema according to what it should be stored as in mongodb


the 2nd .get request deals with getting all the entries from the mongodb schema and then we sort it according to last creation(recent at the top)
*/

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Entry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; //make this router avaliable to index.js

