
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController'); 
const errorMiddleware = require('../middleware/errorMiddleware');

const validateLogin = require('../middleware/validateLogin');
const validateRegistration = require('../middleware/validateRegistration');

router.post('/register', errorMiddleware, validateRegistration, userController.register);
router.post('/login',errorMiddleware , validateLogin, userController.login);
router.get('/:id', errorMiddleware, userController.getUser);

module.exports = router;

