const formService = require('../services/form-service');
const httpErrors = require('http-errors');
const FormDto = require('../dtos/form-dto');

class FormController {
  async createForm(req, res, next) {
    try {
      await formService.validate(req.body);
      const form = await formService.create(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        form: new FormDto(form),
      });
    } catch (error) {
      console.log(error.message);
      if (error.isJoi) {
        error.status = 422;
        return next(error);
      }
      if (httpErrors.isHttpError(error)) return next(error);
      return next(httpErrors.InternalServerError());
    }
  }

  async getDetails(req, res, next) {}
  async delete(req, res, next) {}
  async update(req, res, next) {}
}

module.exports = new FormController();
