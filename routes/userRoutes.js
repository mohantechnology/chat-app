const express = require('express');
const userRoutes = express.Router();
const accountController = require('../controllers/accountController');
const homeController = require('../controllers/homeController');
const findFriendController = require('../controllers/findFriendController');
const chatController = require('../controllers/chatController');
const videoChatController = require('../controllers/videoChatController');

const auth = require('../middlewares/auth');

userRoutes.get("/",  accountController.landingPage);
userRoutes.get("/reg",  accountController.registerPage);
userRoutes.get("/login",  accountController.loginPage);

userRoutes.get("/active",  accountController.activateAccountPage);
userRoutes.get("/forgot",  accountController.forgotPasswordPage);
userRoutes.get("/res_pass_num",  accountController.verifyOTPPage); // reset password with otp 
userRoutes.get("/update_pass",  accountController.updatePasswordPage);

userRoutes.post("/reg",  accountController.createUserAccount);
userRoutes.post("/login",  accountController.loginUserAccount);
userRoutes.post("/google_signin",  accountController.loginWithGoogleAccount);
userRoutes.post("/facebook_signin",  accountController.loginWithFaceBookAccount);

userRoutes.get("/activate",  accountController.activateAccount);  // for reset link 
userRoutes.post("/activate",  accountController.activateAccount); // for otp
userRoutes.post("/resend_activate_link",  accountController.resendActivationLink) ; 

userRoutes.post("/send_verfi_link",  accountController.sendResetPasswordEmail);
userRoutes.get("/verify_token",  accountController.verifyToken);   // for reset link 
userRoutes.post("/verify_token",  accountController.verifyToken); // for otp
userRoutes.post("/update_password",  accountController.updatePassword);

if(  process.env.NODE_ENV === "test"){
  userRoutes.delete("/del_account",  accountController.deleteUserAccount);
}

/*use authentication for below routes */
userRoutes.use(auth);

userRoutes.post("/logout",  accountController.logout);

userRoutes.get("/home",  homeController.homePage);
userRoutes.get("/list_notifi",  homeController.listNotification);
userRoutes.get("/profile",  homeController.getProfileDetail);
userRoutes.post("/update_profile",  homeController.updateProfileDetail);

/* Manage friends  request */
userRoutes.get("/find_friend",  findFriendController.findFriendPage);
userRoutes.get("/search_friend",  findFriendController.searchFriend);
userRoutes.post("/send_friend_req",  findFriendController.sendFriendRequest);

userRoutes.get("/list_rec_request",  findFriendController.listReceivedRequest);
userRoutes.post("/accept_friend_req",  findFriendController.acceptFriendRequest);
userRoutes.post("/remove_friend_from_list",  findFriendController.removeFriendFromList);

/*  chat message  */
userRoutes.get("/list_message",  chatController.listMessage);
userRoutes.post("/save_message",  chatController.saveMessage);

userRoutes.post("/upload_file",  chatController.uploadFile);
userRoutes.get("/download_file",  chatController.downloadFile);

/*  video chat   */

userRoutes.get("/video-chat",  videoChatController.videoPage);

module.exports = userRoutes;