const mongoose = require('mongoose');

/* Defines User Properties */
const ResponseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, required: true },
    responses: {
      type: [
        {
          question: { id: mongoose.Schema.Types.ObjectId, title: String },
          answer: String,
        },
      ],
      required: true,
    },
    responder: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
    },
    analytics: {
      questionAnswered: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true },
);

const Response = mongoose.model('Response', ResponseSchema);
module.exports = { Response, ResponseSchema };
