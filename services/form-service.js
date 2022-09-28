const JoiValidateOptions = require('../constants/joiOptions');
const { FormValidation, Form } = require('../models/form-model');
const httpErrors = require('http-errors');
const { isValidObjectId } = require('mongoose');

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

  async findOne(id) {
    const isValid = isValidObjectId(id);
    if (!isValid) throw httpErrors.UnprocessableEntity('Invalid id.');
    return Form.findById(id).populate('author');
  }

  async deleteForm(id) {
    return Form.deleteOne({ _id: id });
  }

  async getForms(pageNumber, pageSize) {
    pageSize = pageSize > 10 ? 10 : pageSize;
    return Form.find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
  }

  async updateFormData(data, id) {
    return await Form.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true },
    );
  }
}

module.exports = new FormService();
