const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
  generateTokens(payload) {
    // create access token
    // expiresIn - token lifetime
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });

    // create refresh token
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: '30d',
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // save only one token per user
  async saveToken(userId, refreshToken) {
    // findOne - mongoDB method (return first element)
    const tokenData = await tokenModel.findOne({ user: userId });

    // if element found - update refreshToken
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    // or create new token
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
}

module.exports = new TokenService();
