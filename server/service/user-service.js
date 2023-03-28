const UserModel = require('../models/user-model');
// hash password module
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({
      email,
    });

    // if the user already exists
    if (candidate) {
      throw new Error(`User with ${candidate} email address already exists.`);
    }

    // hash password before saving in database
    const hashPassword = await bcrypt.hash(password, 3);
    // generate uuid
    const activationLink = uuid.v4();
    // create user to database
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    // send activation link to email
    await mailService.sendActivationMail(email, activationLink);

    // generate and update jwt tokens
    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
