const express = require('express');
const accountRoutes = express.Router();
const account = require('../controllers/account');

accountRoutes.get("/logout",  account.logout);
accountRoutes.get("/reg/temp",  account.reg);



module.exports = accountRoutes;