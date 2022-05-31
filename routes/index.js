"use strict";
const express = require('express');
const accountRoutes = require("./account");
const chatRoutes = require("./chat");

const init = (app) => {
    // console.log ( app ) ; 
    /*Make Request Body Avaliable to Frontend */
    app.use((req, res, next) => {
        res.locals.req = req
        next()
    });
    app.set('trust proxy', true);  
       // Version 1 routes
       app.use('/',chatRoutes);
       app.use('/admin',accountRoutes);
    //    app.use('/student',ClientUserRoutes);
    //    app.use('/instructor',InstructorRoutes);
    //    app.use('/client',ClientRoutes);
    //    app.use('/pub', allowCORS , PublicRoutes);

    app.use((req, res, next) => {
        const err = new Error("Page Not Found");
        err.status = 'fail';
        err.statusCode = 404;
        err.message = 'Page Not Found';
        // req.statu("new AppError(`Page Not Found`, 404)");
        res.status(404).send({ "status": "error", message: "page not found from routes",error:err })
    });
 
}

module.exports = init;