const JoiValidateOptions = require('../constants/joiOptions');
const { FormValidation, Form } = require('../models/form-model');
const httpErrors = require('http-errors');

class FormService {
  async validate(formData) {
    const isValidForm = await FormValidation.validateAsync(
      formData,
      JoiValidateOptions,
    );
    if (!isValidForm) throw httpErrors.BadRequest('All fields are required.');
  }

  async create(author, formData) {
    const data = {
      ...formData,
      author,
      analytics: {
        totalQuestions: formData.questions.length,
        totalResponses: 0,
      },
    };
    const form = new Form(data);
    return form.save();
  }
}

module.exports = new FormService();
