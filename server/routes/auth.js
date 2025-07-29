// server/routes/auth.js
import express from 'express';
import bcrypt  from 'bcrypt'; //used to hash and compare passwords securely
import jwt     from 'jsonwebtoken'; //to sign and verify tokens
import User    from '../models/User.js'; //mongoose model for user documents

const router = express.Router(); //creates a  mini application to mount onto the the api path of api/auth in index.js

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
input - expects an email and password in the json body 
const hash = await bcrypt.hash(password, 10); - salt and hash the plaintext password with 10 salt rounds
saves a new user document with the email and passsword and sends the appropriate response to the consol

*/

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 
we get the email and password from the requests body
we then authenticate the email and password using a mongoose model and the findone(like the where function in SQL) and it finds one in the database of users in mongoDb
if there is none, error message. we then comapre the password associated with the user from mongodb with the password in the json request
for the jwt authetntication, this creates a jwt token with three parts - header, payload, and signature—all Base64-encoded and joined by dots
we can then store the id in the local database so then for future references made with this user, we dont constantly have to keep looking it up


*/

export default router;
