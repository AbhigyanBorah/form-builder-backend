const formService = require("../services/form-service");
const httpErrors = require("http-errors");
const FormDto = require("../dtos/form-dto");

class FormController {
  async createForm(req, res, next) {
    try {
      const { user } = req;
      await formService.validate(req.body);
      const form = await formService.create(user, req.body);

      return res.status(201).json({
        success: true,
        form: new FormDto(form),
      });
    } catch (error) {
      if (error.isJoi) {
        error.status = 422;
        return next(error);
      }
      console.log("error - ", { error });
      if (httpErrors.isHttpError(error)) return next(error);
      return next(httpErrors.InternalServerError());
    }
  }

  async getDetails(req, res, next) {
    try {
      const { id } = req.params;
      const form = await formService.findOne(id);
      return res.status(200).json({
        success: true,
        form: new FormDto(form),
      });
    } catch (error) {
      if (httpErrors.isHttpError(error)) return next(error);
      return next(httpErrors.InternalServerError());
    }
  }

  async getForms(req, res, next) {
    try {
      const { pageNumber = 1, pageSize = 10 } = req.query;
      const paginatedForms = await formService.getForms(pageNumber, pageSize);
      console.log("form result - ", paginatedForms);
      return res.status(200).json({
        success: true,
        forms: paginatedForms.map((form) => new FormDto(form)),
      });
    } catch (error) {
      return next(httpErrors.InternalServerError());
    }
  }

  async delete(req, res, next) {
    try {
      const { formId } = req.body;
      if (!formId) next(httpErrors.BadRequest("Form id required."));

      const form = await formService.findOne(formId);
      if (!form) return next(httpErrors.NotFound("Form doesn't exist."));

      if (form.author.id.toString() !== req.user.id.toString())
        return next(httpErrors.Forbidden("You don't have permission."));
      await formService.deleteForm(formId);

      return res.status(200).json({
        success: true,
        message: "Form deleted.",
      });
    } catch (error) {
      return next(httpErrors.InternalServerError());
    }
  }

  async update(req, res, next) {
    try {
      const { formId, data } = req.body;
      if (!formId) next(httpErrors.BadRequest("Form id required."));

      const form = await formService.findOne(formId);
      if (!form) return next(httpErrors.NotFound("Form doesn't exist."));

      if (form.author.id.toString() !== req.user.id.toString())
        return next(httpErrors.Forbidden("You don't have permission."));

      const upDatedForm = await formService.updateFormData(data, formId);
      return res.status(200).json({
        success: true,
        form: new FormDto(upDatedForm),
      });
    } catch (error) {
      if (httpErrors.isHttpError(error)) return next(error);
      return next(httpErrors.InternalServerError());
    }
  }
}

module.exports = new FormController();
