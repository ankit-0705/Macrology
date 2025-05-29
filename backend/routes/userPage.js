const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/userModel');
const picMiddleware = require('../middleware/picLogic');
const jwtMiddleware = require('../middleware/jwtLogic');
require('dotenv').config();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const jwt_Token = process.env.JWT_SECRET;

const isEmailOrPhone = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  return emailRegex.test(value) || phoneRegex.test(value);
};

// Route 1: User Creation
router.post('/register', upload.single('image'), picMiddleware, [
  body('name', 'Enter a valid user name.').isLength({ min: 3 }),
  body('email', 'Enter a valid user email.').isEmail(),
  body('password', 'Enter a valid strong password.').isStrongPassword(),
  body('pnum', 'Phone number must be 10 digits long.').isLength({ min: 10, max: 10 })
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry, a user with this email already exists" });
    }

    let image = null;
    if (req.file) {
      image = {
        data: req.file.buffer,
        mimeType: req.file.mimetype
      };
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create and Save user to the database
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      pnum: req.body.pnum,
      pic: image
    });

    const data = {
      user: {
        id: user.id
      }
    };

    const jwtToken = jwt.sign(data, jwt_Token, { expiresIn: '1h' }); // JWT with expiration
    res.json({
      success: true,
      message: "User successfully added to the database.",
      token: jwtToken
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Route 2: User Authentication (Login)
router.post('/login', [
  body('emailOrPhone', 'Enter a valid login option.').custom(isEmailOrPhone),
  body('password', 'Enter a valid strong password.').isStrongPassword()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { emailOrPhone, password } = req.body;
  try {
    let user;
    
    if(emailOrPhone.includes('@')){
      user = await User.findOne({email: emailOrPhone});
    }else{
      user = await User.findOne({pnum:emailOrPhone});
    }

    if (!user) {
      return res.status(400).json({ error: "Login with correct credentials." });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Login with correct credentials." });
    }

    const data = {
      user: {
        id: user.id
      }
    };

    const jwtToken = jwt.sign(data, jwt_Token, { expiresIn: '1h' }); // JWT with expiration
    res.json({ jwtToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Route 3: Fetch User Info
router.post('/getuser', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Route 4: Update User Info
router.put('/updateuser', jwtMiddleware, upload.single('image'), [
  body('name').optional().isLength({ min: 3 }).withMessage("Name must be at least 3 characters."),
  body('email').optional().isEmail().withMessage("Invalid email format."),
  body('pnum').optional().isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits.")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const updateFields = {};

    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.pnum) updateFields.pnum = req.body.pnum;

    if (req.file) {
      updateFields.pic = {
        data: req.file.buffer,
        mimeType: req.file.mimetype
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "User information updated successfully.",
      user: updatedUser
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});


module.exports = router;
