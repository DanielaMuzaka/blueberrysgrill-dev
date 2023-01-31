class UserAlredyExistsError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

module.exports = UserAlredyExistsError;