const httpErrors = require('http-errors');
const { User, UserValidation } = require('../models/user-model');
const { Form } = require('../models/form-model');
const JoiValidateOptions = require('../constants/joiOptions');
const hashService = require('./hash-service');

class AuthService {
  async validateUserData(data) {
    return UserValidation.validateAsync(data, JoiValidateOptions);
  }

  async createUser(data) {
    try {
      const hashedPassword = await hashService.hashPassword(data.password);
      const user = new User({ ...data, password: hashedPassword });
      return user.save();
    } catch (error) {
      throw httpErrors.InternalServerError('Something went wrong. Try again.');
    }
  }

  async findUser(filter) {
    return await User.findOne(filter).populate('forms').exec();
  }
}

module.exports = new AuthService();
