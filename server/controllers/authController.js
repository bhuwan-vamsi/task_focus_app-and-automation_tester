const User = require('../models/user')
const {hashPassword, comparePasswords, authenticateToken} = require('../helpers/auth')
const jwt = require('jsonwebtoken')

// Register Endpoint
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // check if details were entered
        if(!name || !email || !password) {
            return res.json({
                error: 'Details not entered!'
            })
        };
        if(password.length < 6) {
            return res.json({
                error: 'Password too short'
            })
        };

        const exist = await User.findOne({email})

        if(exist) {
            console.log('Exists')
            return res.json({
                error: 'Email already registered'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        return res.json(user);
    } catch (error) {
        return res.json({ message: 'Registration failed'})
    }
}

// Login Endpoint
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !comparePasswords(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }).json({ message: 'Login successful', user });
};

const verifyProfile = async (req, res) => {
    try {
        // Fetch user details from the database using the user ID set by authenticateToken
        const user = await User.findById(req.userId).select('-password'); // Exclude password for security

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the user profile as the response
        return res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'strict',
    });
    return res.json({ message: 'Logged out successfully' });
};


module.exports = {
    registerUser,
    verifyProfile,
    loginUser,
    logoutUser,
}