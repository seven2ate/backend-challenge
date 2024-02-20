const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user instance with the request body data
    const newUser = new User(req.body);

    // Validate user data
    await newUser.validate();

    // Save the new user to the database
    await newUser.save();

    // Generate JWT token upon successful registration
    const token = jwt.sign(
      { userId: newUser._id },
      secret,
      { expiresIn: '1d' },
    );

    // Return success response with user and token
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email and select the password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Compare provided password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If passwords don't match, send error response
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1d' });

    // Send user and token in response
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  authenticateUser,
};
