const User = require("../models/user");
const { hashPassword, comparePasswords, generateToken } = require("../helpers/auth");

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
    if (password.length < 6) return res.status(400).json({ error: "Password too short" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await comparePasswords(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = generateToken(user._id);
  res
    .cookie("token", token, { httpOnly: true, secure: false })
    .json({ message: "Login successful", user });
};

// Verify Profile
const verifyProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// Logout
const logoutUser = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: false });
  res.json({ message: "Logout successful" });
};

module.exports = { registerUser, loginUser, verifyProfile, logoutUser };
