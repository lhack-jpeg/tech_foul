// Add message and status to error output
class expressError extends Error {
  constructor (message, status) {
    super()
    this.message = message
    this.status = status

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = expressError
