const httpErrors = require('http-errors');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const authService = require('../services/auth-service');
const hashService = require('../services/hash-service');

class UserController {
  async updatePersonalInfo(req, res, next) {
    try {
      const personalInfo = await userService.validatePersonalInfo(req.body);
      const user = await userService.updatePersonalInfo(req.user, personalInfo);

      return res.status(200).json({
        success: true,
        user: new UserDto(user),
      });
    } catch (error) {
      if (error.isJoi) {
        error.status = 400;
        return next(error);
      }
      next(httpErrors.BadRequest(error.message));
    }
  }

  async changePassword(req, res, next) {
    try {
      // Validate passwords
      const user = await userService.updatePassword(req.user, req.body);
      // Remove the refresh token corresponding to the user
      await tokenService.deleteRefreshToken({
        token: req.cookies.refreshToken,
      });
      // Clear cookies
      tokenService.clearCookies(res);

      // * Generate new tokens and attack to the cookie.
      const accessToken = await tokenService.accessToken({ id: user.id });
      const refreshToken = await tokenService.refreshToken({ id: user.id });
      tokenService.setAccessToken(res, accessToken);
      tokenService.setRefreshToken(res, refreshToken);

      return res.status(200).json({
        success: true,
        user: new UserDto(user),
      });
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;

      userService.checkNewPassword(newPassword);
      const isValid = hashService.checkPassword(oldPassword, req.user.password);
      if (!isValid)
        return next(httpErrors.BadRequest("Password doesn't match."));
      // Now check the email against user collection if any user exist with that email.
      const user = await authService.findUser({ email });
      if (!user)
        return next(httpErrors.NotFound("User doesn't exist with this email."));
      tokenService.clearCookies(res);
      await tokenService.deleteRefreshToken({ userId: user._id });
      // Now hash the new password and update with current user password.
      const hashedPassword = await hashService.hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        user: new UserDto(user),
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      await userService.deleteAccount(req.user);
      await tokenService.deleteRefreshToken({
        token: req.cookies.refreshToken,
      });
      tokenService.clearCookies(res);
      return res.status(200).json({
        success: true,
        user: null,
      });
    } catch (error) {
      return next(httpErrors.InternalServerError('Something went wrong.'));
    }
  }
}

module.exports = new UserController();
