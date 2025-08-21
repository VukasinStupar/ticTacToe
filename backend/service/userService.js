
const {User} = require('../model/user');
const { Op } = require('sequelize');
const userRepository = require('../repository/userRepository');
const bcrypt = require('bcryptjs');
const {verifyToken, generateToken} = require('./authService');
const {AuthenticationError, ValidationError, NotFoundError} = require('./errorService');

const SALT_ROUNDS = 12;

const register = async (userData) => {
  try {
    const existingUserByEmail = await userRepository.findUserByEmail(userData.email);

    if (existingUserByEmail) {
      throw new ValidationError('User already exists with this email');
    }

    const existingUserName = await userRepository.findUserByUserName(credentials.username);
    
    if (existingUserName) {
      throw new AuthenticationError('User already exists with this username');
    }
    

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await userRepository.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword, 
    });

    const userResponse = { ...user };
    delete userResponse.password;

    

    return { user: userResponse, token };
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

    const userResponse = user;
    delete userResponse.password;

    const token = generateToken(user);
    

    return { user: userResponse, token };
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
};
