const userService = require('../service/user-service');

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      // return refresh token
      res.cookie('refreshToken', userData.refreshToken, {
        // cookies lifetime - 30 days
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // cookies cannot be changed
        httpOnly: true,
        // when using https
        // secure: true,
      });

      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res, next) {
    try {
    } catch (e) {}
  }

  async logout(req, res, next) {
    try {
    } catch (e) {}
  }

  async activate(req, res, next) {
    try {
    } catch (e) {}
  }

  async refresh(req, res, next) {
    try {
    } catch (e) {}
  }

  async gerUsers(req, res, next) {
    try {
      res.json(['asd', 'asd']);
    } catch (e) {}
  }
}

module.exports = new UserController();
