const httpErrors = require('http-errors');
const {
  PersonalInfoValidation,
  PasswordValidationSchema,
} = require('../models/user-model');
const JoiValidateOptions = require('../constants/joiOptions');
const hashService = require('./hash-service');

class UserService {
  async updatePersonalInfo(user, personalInfo) {
    user.username = personalInfo.username || user.username;
    user.email = personalInfo.email || user.email;
    return user.save();
  }

  async validatePersonalInfo(info) {
    const personalInfo = await PersonalInfoValidation.validateAsync(
      info,
      JoiValidateOptions,
    );
    if (Object.entries(personalInfo).length === 0)
      throw httpErrors.BadRequest('At least one field is required.');
    return personalInfo;
  }

  async updatePassword(user, data) {
    try {
      const { oldPassword, newPassword } =
        await PasswordValidationSchema.validateAsync(data, JoiValidateOptions);

      if (oldPassword.toLowerCase() === newPassword.toLowerCase())
        throw httpErrors.BadRequest('Passwords must be different.');

      const isValid = await hashService.checkPassword(
        oldPassword,
        user.password,
      );
      if (!isValid) throw httpErrors.BadRequest("Password doesn't match.");

      const hashedPassword = await hashService.hashPassword(newPassword);
      user.password = hashedPassword;
      return user.save();
    } catch (error) {
      if (error.isJoi) error.status = 422;
      throw error;
    }
  }

  async deleteAccount(user) {
    return user.remove();
  }

  checkNewPassword(password) {
    if (!password)
      throw httpErrors.UnprocessableEntity('Password must be provided.');

    if (password.length < 5)
      throw httpErrors.UnprocessableEntity(
        'Password must be at least 5 characters long.',
      );
  }
}

module.exports = new UserService();
