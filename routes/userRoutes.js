const express = require('express');
const userRoutes = express.Router();
const account = require('../controllers/account');
const home = require('../controllers/home');

const auth = require('../middlewares/auth');



userRoutes.get("/reg",  account.register);
userRoutes.get("/login",  account.login);
// userRoutes.get("/logout",  account.logout);
userRoutes.post("/reg",  account.createUserAccount);
userRoutes.post("/login",  account.loginUserAccount);

   /*use authentication for below routes */
userRoutes.use(auth);
userRoutes.get("/logout",  account.logout);
userRoutes.get("/home",  home.homePage);






module.exports = userRoutes;