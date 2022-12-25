"use strict"; 
const userRoutes = require("./userRoutes"); 

const init = (app) => { 
  /*Make Request Body Avaliable to Frontend */
  app.use((req, res, next) => {
    res.locals.req = req;
    next();
  });
  app.set('trust proxy', true);  
 
  app.use('/',userRoutes);

  app.use((req, res) => { 
    const err = new Error("Page Not Found");
    err.status = 'fail';
    err.statusCode = 404;
    err.message = 'Page Not Found';
    // req.statu("new AppError(`Page Not Found`, 404)");
    res.status(404).send({ "status": "error", message: "page not found",error:err , method: req.method });
  });
 
};

module.exports = init;