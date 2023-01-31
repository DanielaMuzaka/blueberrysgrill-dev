class WrongPasswordError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

module.exports = WrongPasswordError;