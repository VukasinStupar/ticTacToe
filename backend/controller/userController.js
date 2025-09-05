
const userService = require('../service/userService');

const register = async (req, res) => {

    const { user } = await userService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user },
    });
};

const login = async (req, res) => {
    const { user, token } = await userService.login(req.body);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token },
    });
};

const getUser = async (req, res) => {
    const user = await userService.getUserById(req.params.id);

    res.json({
      success: true,
      data: user,
    });
};

module.exports = {
  register,
  login,
  getUser,
};