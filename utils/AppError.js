class AppError extends Error{
  constructor(message,statusCode, errName){
    super(message, statusCode);
    this.message = message;
    this.statusCode =statusCode;
    this.name = errName ; 
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this,this.constructor);
    }
  }
}

module.exports = AppError;