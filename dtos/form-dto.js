class FormDto {
  constructor(form) {
    this.id = form._id;
    this.title = form.title;
    this.description = form.description;
    this.questions = form.questions;
    this.status = form.status;
    this.responses = form.responses;
    this.author = form.author;
    this.analytics = form.analytics;
    this.createdAt = form.createdAt;
  }
}

module.exports = FormDto;
