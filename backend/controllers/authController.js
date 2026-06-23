const pool = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyUrl = `http://localhost:5000/auth/verify-email?token=${verificationToken}`;

await transporter.sendMail({
  from: "your app <your_email@gmail.com>",
  to: email,
  subject: "Verify your email",
  html: `
    <h2>Welcome ${username}</h2>
    <p>Click below to verify your email:</p>
    <a href="${verifyUrl}">Verify Email</a>
  `,
});

exports.register = async (req, res) => {
  try {
    // Generate verification token
const verificationToken = crypto.randomBytes(32).toString("hex");

// Insert user (NOT verified yet)
const newUser = await pool.query(
  `INSERT INTO users (username, email, password, verification_token, is_verified) 
   VALUES ($1, $2, $3, $4, false) RETURNING *`,
  [username, email, hashedPassword, verificationToken]
);
    const { username, email, password } = req.body;

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userCheck.rows.length > 0)
      return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error('Register backend error:', err);
    res.status(500).json({ error: err.message });
    res.status(201).json({
    message: "Check your email to verify your account"
   });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userCheck.rows.length === 0)
      return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(
      password,
      userCheck.rows[0].password
    );
    if (!validPassword)
      return res.status(400).json({ message: 'Invalid password' });
      const user = userCheck.rows[0];
    const token = jwt.sign(
      { id: userCheck.rows[0].id, email: userCheck.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        hasOnboarded: user.has_onboarded
      } 
    });
    // res.json({ token, user: userCheck.rows[0] });
  } catch (err) {
    console.error('Login backend error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, username, email, has_onboarded FROM users WHERE id = $1',
            [req.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ username: user.rows[0].username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.completeOnboarding = async (req, res) => {
    try {
        const { username } = req.body;
        await pool.query(
            'UPDATE users SET has_onboarded = TRUE, username = $1 WHERE id = $2',
            [username, req.userId]
        );
        res.json({ message: "Onboarding status updated" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};
