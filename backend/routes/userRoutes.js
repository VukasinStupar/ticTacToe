
const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

const validateLogin = require('../midleware/validateLogin');
const validateRegistration = require('../midleware/validateRegistration');

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { user, token } = await userService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { user, token } = await userService.login(req.body);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    const statusCode = error.name === 'AuthenticationError' ? 401 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    const statusCode = error.name === 'NotFoundError' ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

