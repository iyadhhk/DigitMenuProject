const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');
const ROLE = require('../utils/roles');
const authRole = require('../utils/authRole');

// user must be authenticated and Owner
router.post(
  '/create-worker',
  [
    body('username').trim().isLength({ min: 5 }),
    body('password').trim().isLength({ min: 5 }),
  ],
  isAuth,
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const { username, password, role, restaurantId } = req.body;
      const existedUser = await User.findOne({ username, restaurantId });
      if (existedUser) {
        const error = new Error('username already exists');
        error.statusCode = 409;
        error.data = [{ param: 'username', msg: 'username already exists' }];
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        password: hashedPassword,
        role,
        restaurantId,
      });
      const createdUser = await user.save();
      const token = jwt.sign(
        {
          username: user.username,
          userId: user._id.toString(),
          role: user.role,
        },
        jwtSecret,
        { expiresIn: '1h' }
      );
      req.io.of('/owner-space').emit('workers', { action: 'create' });
      res.status(201).json({ token, message: 'User created', userId: createdUser._id });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/workers/:restID', isAuth, authRole(ROLE.OWNER), async (req, res, next) => {
  try {
    const { restID } = req.params;
    const workers = await User.find({
      role: ['kitchen', 'server'],
      restaurantId: restID,
    });

    res.status(200).json(workers);
  } catch (err) {
    next(err);
  }
});

router.put('/del-worker', isAuth, authRole(ROLE.OWNER), async (req, res, next) => {
  try {
    const { id } = req.body;
    const response = await User.findOneAndDelete({ _id: id });
    if (!response) {
      const error = new Error('No woker');
      error.statusCode = 404;
      throw error;
    }
    req.io.of('/owner-space').emit('workers', { action: 'delete' });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
