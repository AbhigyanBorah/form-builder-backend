const mongoose = require('mongoose');
const Joi = require('joi');
const { ResponseSchema } = require('./response-model');

/* Defines User Properties */
const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    formUrl: {
      type: String,
      required: true,
      default: '',
    },
    // questions: {
    //   type: [{ title: { type: String, required: true } }],
    //   required: true,
    // },
    questions: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
    },
    responses: { type: [ResponseSchema], required: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    analytics: {
      totalQuestions: { type: Number, required: true, default: 0 },
      totalResponses: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true, minimize: false },
);

const Form = mongoose.model('Form', FormSchema);

const FormValidation = Joi.object({
  title: Joi.string().trim().required().label('Form title'),
  description: Joi.string().trim().required().label('Form description'),
  questions: Joi.array().required().label('Questions'),
});

module.exports = { Form, FormSchema, FormValidation };
