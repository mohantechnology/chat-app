"use strict";
const express = require('express');
const userRoutes = require("./userRoutes");
const catchError = require("../middlewares/catchError.js");

const init = (app) => {
    // console.log ( app ) ; 
    /*Make Request Body Avaliable to Frontend */
    app.use((req, res, next) => {
        res.locals.req = req
        next()
    });
    app.set('trust proxy', true);  
       // Version 1 routes
    //    app.use('/chat',chatRoutes);
       app.use('/',userRoutes);
    //    app.use('/student',ClientUserRoutes);
    //    app.use('/instructor',InstructorRoutes);
    //    app.use('/client',ClientRoutes);
    //    app.use('/pub', allowCORS , PublicRoutes);

    app.use((req, res, next) => {
        console.log( "inside first use")
        const err = new Error("Page Not Found");
        err.status = 'fail';
        err.statusCode = 404;
        err.message = 'Page Not Found';
        // req.statu("new AppError(`Page Not Found`, 404)");
        res.status(404).send({ "status": "error", message: "page not found",error:err , method: req.method })
    });

    // catch error 
    // app.use(catchError)
    // app.use((err, req, res, next) => {

    //     console.log("inside second use") ; 
    //     console.log("err ---------") ; 
    //     console.log(err) ;

    //        console.log("err.name ---------") ; 
    //     console.log(err.name) ;
    //     //      console.log("req ---------") ; 
    //     // console.log(req) ; 
        
    //     // console.log("res ---------") ; 
    //     // console.log(res) ; 

    //     // console.log("next ---------") ; 
    //     // console.log(next) ; 


    //     // console.log(err.errors) ; 
    //     // console.log("typeof err.errors") ; 
    //     // console.log(typeof err.errors) ; 
    //     // res.status(err.statusCode||500).json({
    //     //     message : err.message, 
    //     //     err: err
    //     // })
    //     // return err; 

    //     // if(err.name === 'ValidationError'  ) { return   handle_mongoose_validation_error(err, res);}
    //     // if(err.name === 'ValidationError') return err = handleValidationError(err, res);
    //     // else if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
    //     // else res.status(err.statusCode||500).json({
    //     //     message : err.message
    //     // })
    // })
 
}

module.exports = init;