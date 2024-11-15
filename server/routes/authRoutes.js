const express = require('express');
const router = express.Router();
const cors = require('cors');
const { authenticateToken } = require('../helpers/auth');
const { registerUser, loginUser, verifyProfile, logoutUser } = require('../controllers/authController')

// midddleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify-profile', authenticateToken, verifyProfile);
router.post('/logout', logoutUser)

module.exports = router