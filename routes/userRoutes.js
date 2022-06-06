const express = require('express');
const userRoutes = express.Router();
const accountController = require('../controllers/accountController');
const homeController = require('../controllers/homeController');
const findFriendController = require('../controllers/findFriendController');

const auth = require('../middlewares/auth');



userRoutes.get("/reg",  accountController.registerPage);
userRoutes.get("/login",  accountController.loginPage);
// userRoutes.get("/logout",  accountController.logout);
userRoutes.post("/reg",  accountController.createUserAccount);
userRoutes.post("/login",  accountController.loginUserAccount);

   /*use authentication for below routes */
userRoutes.use(auth);
userRoutes.get("/logout",  accountController.logout);
userRoutes.get("/home",  homeController.homePage);


userRoutes.get("/find_friend",  findFriendController.findFriendPage);
userRoutes.get("/search_friend",  findFriendController.searchFriend);
userRoutes.post("/send_friend_req",  findFriendController.sendFriendRequest);






module.exports = userRoutes;