class AppError extends Error{
    constructor(message,statusCode, errName){
        super(message, statusCode);
        this.message = message;
        this.statusCode =statusCode;
        this.name = errName ; 
        // this.status = `${statusCode}`.startsWith('4')?'Failed' : 'Error';
        // this.isOperational = true;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this,this.constructor);
          }
    }
}

module.exports = AppError;