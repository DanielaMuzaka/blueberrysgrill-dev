class NotAuthorizedError extends Error {
    constructor(message) {
      super();
      this.message = message;
    }
  }
  
  module.exports = NotAuthorizedError;