const pool = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ====================== REGISTER ======================
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Save user
    const newUser = await pool.query(
      `INSERT INTO users
      (username, email, password, is_verified, verification_token)
      VALUES ($1, $2, $3, false, $4)
      RETURNING *`,
      [username, email, hashedPassword, verificationToken]
    );

    // Verification link
    const verifyUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: `"ClearClause" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Welcome ${username} 👋</h2>
        <p>Click the button below to verify your email.</p>

        <a href="${verifyUrl}"
           style="
             background:#2563eb;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:6px;
             display:inline-block;
           ">
          Verify Email
        </a>

        <p>If you didn't create this account, you can ignore this email.</p>
      `,
    });

    return res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = userCheck.rows[0];

    // Check email verification FIRST
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first.",
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        hasOnboarded: user.has_onboarded,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ====================== VERIFY EMAIL ======================
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await pool.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid verification token.",
      });
    }

    await pool.query(
      `UPDATE users
       SET is_verified = true,
           verification_token = NULL
       WHERE id = $1`,
      [user.rows[0].id]
    );

    return res.redirect(
  `${process.env.CLIENT_URL}/verify-email-success`
);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Verification failed.",
    });
  }
};

// ====================== PROFILE ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, email, has_onboarded FROM users WHERE id = $1",
      [req.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ====================== ONBOARDING ======================
exports.completeOnboarding = async (req, res) => {
  try {
    const { username } = req.body;

    await pool.query(
      `UPDATE users
       SET has_onboarded = TRUE,
           username = $1
       WHERE id = $2`,
      [username, req.userId]
    );

    res.json({
      message: "Onboarding completed.",
    });

  } catch (err) {
    res.status(500).json({
      message: "Update failed.",
    });
  }
};



exports.testVerifyUser = async (req, res) => {
  try {
    // Never allow this in production
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const { email } = req.body;

    await pool.query(
      `
      UPDATE users
      SET is_verified = true,
          verification_token = NULL
      WHERE email = $1
      `,
      [email]
    );

    res.json({
      message: "User verified successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};