class HttpError extends Error {
  constructor(message, codeErreur) {
    super(message);
    this.code = codeErreur;
  }
}

module.exports = HttpError;
