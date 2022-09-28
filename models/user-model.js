const mongoose = require('mongoose');
const Joi = require('joi');

/* Defines User Properties */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
    totalForms: {
      type: Number,
      default: function () {
        return this.forms.length;
      },
    },
  },
  { timestamps: true },
);

const UserValidation = Joi.object({
  username: Joi.string().trim().required().label('Username'),
  email: Joi.string().email().trim().required().label('Email'),
  password: Joi.string().min(5).trim().required().label('Password'),
});

const PersonalInfoValidation = Joi.object({
  username: Joi.string().trim().label('Username'),
  email: Joi.string().email().trim().label('Email'),
});

const PasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().trim().required().label('Old password'),
  newPassword: Joi.string().trim().min(5).required().label('New password'),
});

const User = mongoose.model('User', UserSchema);
module.exports = {
  User,
  UserValidation,
  PersonalInfoValidation,
  PasswordValidationSchema,
};
