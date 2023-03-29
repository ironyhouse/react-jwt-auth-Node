const UserModel = require('../models/user-model');
// hash password module
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({
      email,
    });

    // if the user already exists
    if (candidate) {
      throw ApiError.BadRequest(
        `User with "${candidate.email}" email address already exists.`
      );
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
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    // generate and update jwt tokens
    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest('Invalid activation link.');
    }

    user.isActivated = true;

    // update user in database
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    // if the user does not exist
    if (!user) {
      throw ApiError.BadRequest('Invalid login.');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    // if invalid password
    if (!isPassEquals) {
      throw ApiError.BadRequest('Invalid password.');
    }

    // generate and update jwt tokens
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    // generate and update jwt tokens
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();

    return users;
  }
}

module.exports = new UserService();
