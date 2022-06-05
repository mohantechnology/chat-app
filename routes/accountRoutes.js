const express = require('express');
const accountRoutes = express.Router();
const account = require('../controllers/account');

const auth = require('../middlewares/auth');



accountRoutes.get("/reg",  account.register);
accountRoutes.get("/login",  account.login);
// accountRoutes.get("/logout",  account.logout);
accountRoutes.post("/reg",  account.createUserAccount);
accountRoutes.post("/login",  account.loginUserAccount);

   /*use authentication for below routes */
accountRoutes.use(auth);
accountRoutes.get("/home",  account.logout);





module.exports = accountRoutes;