
const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const tokenDecode = require('./utils');

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required'
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
  
  next();
};

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

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const decoded = userService.verifyToken(token);
    
    res.json({
      success: true,
      message: 'Token is valid',
      data: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});


router.post("/username", async (req, res) => {
    try {
        const decoded = await tokenDecode(req);
          console.log('logovanje................',decoded)

        if(!decoded){
          return res.status(401).json({
            
            success: false,
            message: 'token invalid'
        });
        }

        const { username } = req.body; 
        const user = await userService.findUserByUserName(username);

        res.json({
            success: true,
            message: "User found successfully",
            data: { user, decoded } 
        });

    } catch (error) {
        const statusCode = error.name === "NotFoundError" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

console.log('routes user')