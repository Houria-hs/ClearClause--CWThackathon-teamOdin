const pool = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
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
      return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(
      password,
      userCheck.rows[0].password
    );
    if (!validPassword)
      return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: userCheck.rows[0].id, email: userCheck.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: userCheck.rows[0] });
  } catch (err) {
    console.error('Login backend error:', err);
    res.status(500).json({ error: err.message });
  }
};
