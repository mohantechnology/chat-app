const express = require('express');
const userRoutes = express.Router();
const accountController = require('../controllers/accountController');
const homeController = require('../controllers/homeController');

const auth = require('../middlewares/auth');



userRoutes.get("/reg",  accountController.register);
userRoutes.get("/login",  accountController.login);
// userRoutes.get("/logout",  accountController.logout);
userRoutes.post("/reg",  accountController.createUserAccount);
userRoutes.post("/login",  accountController.loginUserAccount);

   /*use authentication for below routes */
userRoutes.use(auth);
userRoutes.get("/logout",  accountController.logout);
userRoutes.get("/home",  homeController.homePage);






module.exports = userRoutes;