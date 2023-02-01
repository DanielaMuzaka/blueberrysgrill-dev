class CouldNotFindReviewError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

module.exports = CouldNotFindReviewError;