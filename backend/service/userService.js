
const {User} = require('../model/user');
const { Op } = require('sequelize');
const userRepository = require('../repository/userRepository');
const bcrypt = require('bcryptjs');
const {verifyToken, generateToken} = require('./authService');
// isti komentar kao i auth servisu, izvuci definicije errora u poseban fajl
const {AuthenticationError, ValidationError, NotFoundError} = require('../middleware/errorMiddleware');

const SALT_ROUNDS = 12;

const register = async ({ username, email, password }) => {
  try {

    const existingUserByEmail = await userRepository.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new ValidationError('User already exists with this email');
    }

    const existingUserName = await userRepository.findUserByUserName(username);
    if (existingUserName) {
      throw new AuthenticationError('User already exists with this username');
    }
    

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);


    const user = await userRepository.createUser({
      username: username,
      email: email,
      password: hashedPassword, 
    });

    delete user.password;
    
    return user;

  } catch (error) {
    if (error.name === 'ValidationError') {
      throw error;
    }
    throw new Error(`Registration failed: ${error.message}`);
  }
};

const login = async (credentials) => {
  try {
    const { username, password } = credentials;

    // Ovu proveru vec radis u validateLogin middleware-u tako da nema potrebe raditi to i u servisu
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    const user = await userRepository.findUserByUserName(credentials.username);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    delete user.password;

    const token = generateToken(user);
    

    return {user, token};
    
  } catch (error) {
    if (error.name === 'AuthenticationError' || error.name === 'ValidationError') {
      throw error;
    }
    throw new Error(`Login failed: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id, {
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    if (error.name === 'NotFoundError') {
      throw error;
    }
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

const findUserByUserName = async (username) => {
    try {
        const user = await userRepository.findUserByUserName(username);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    } catch (error) {
        if (error.name === "NotFoundError") throw error;
        throw new Error(`Failed to get user: ${error.message}`);
    }
};



module.exports = {
  register,
  login,
  getUserById,
  findUserByUserName,
  verifyToken ,
};
