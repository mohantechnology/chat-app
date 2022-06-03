const express = require('express');
const accountRoutes = express.Router();
const account = require('../controllers/account');

const auth = require('../middlewares/auth');



accountRoutes.get("/reg",  account.register);
accountRoutes.get("/login",  account.login);

// accountRoutes.use(auth);
accountRoutes.get("/logout",  account.logout);
accountRoutes.post("/reg",  account.createUserAccount);



module.exports = accountRoutes;