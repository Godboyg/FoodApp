const jwt = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET = process.env.Secret || 'your_secret_key';

function verifyToken(req, res, next) {
  const token = req.cookies.jwttoken; 

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("logged user",req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
}

module.exports = verifyToken;
