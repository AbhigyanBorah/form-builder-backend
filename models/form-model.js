const mongoose = require('mongoose');
const { ResponseSchema } = require('./response-model');

/* Defines User Properties */
const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
        },
      ],
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
  { timestamps: true },
);

const Form = mongoose.model('Form', FormSchema);
module.exports = { Form, FormSchema };
