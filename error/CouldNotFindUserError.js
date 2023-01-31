class CouldNotFindUserError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

module.exports = CouldNotFindUserError;