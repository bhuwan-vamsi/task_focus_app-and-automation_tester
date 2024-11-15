const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

const comparePasswords = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

// Token verification middleware to set req.user
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the JWT token and decode the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach the user ID to the request object
        next(); // Token is valid, proceed to the next middleware
    } catch (err) {
        console.log('Invalid token:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
  

module.exports = {
    hashPassword,
    comparePasswords,
    authenticateToken,
}