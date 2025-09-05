const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const validateLogin = require('../middleware/validateLogin');
const validateRegistration = require('../middleware/validateRegistration');

router.post('/register', validateRegistration, userController.register,
);
router.post('/login', validateLogin, userController.login);

router.get('/:id', userController.getUser);

module.exports = router;
//