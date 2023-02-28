const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err}

        error.message = err.message

        if(err.name === 'CastError'){
            const message =`Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }


        // Validation Error 
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value = value.message);
            error = new ErrorHandler(message, 400)
        }

        // Duplicate key Error 
        if (err.code === 11000){
            const message = `Duplicate ${object.keys(err.keyvalue)} Error`
            error = new ErrorHandler(message, 400)
        }

        // Wrong Jwt 
        if (err.name === 'JsonWebTokenError'){
            const message = `JSON Web Token invalid. Please Try Again`
            error = new ErrorHandler(message, 400)
        }

        // Expired Jwt 
        if (err.name === 'TokenExpiredError'){
            const message = `JSON Web Token has been Expired`
            error = new ErrorHandler(message, 400)
        }

        


        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }

    err.message = err.message || 'Internal Server Error'

    res.status(err.statusCode).json({
        success: false,
        error: err
    })
}