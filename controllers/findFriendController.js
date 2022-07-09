"use strict"; 
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");

/* import models */
const userAccount = require('../model/userAccount');
const chatMessage = require('../model/chatMessage');
 
module.exports.findFriendPage = catchError(async (req, res) => {

  return res.render("find_friend");

});

// ######## Search Friends  ########
module.exports.searchFriend = catchError(async (req, res) => {
 
  req.query.searchQuery = req.query.searchQuery ? req.query.searchQuery.trim() : undefined;
  const limit = req.query.limit && req.query.limit <= 5000 ? parseInt(req.query.limit) : 15;
  req.query.page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
  const skip = (req.query.page - 1) * limit;

  if (!req.query.searchQuery) {
    throw new AppError("Must have some character to search", 400);
  }

  let query = {
    $and: [
      { _id: req.user._id },
      { accessToken: req.user.accessToken }
    ]
  };

  let resultAccount = await userAccount.findOne(query, { sendedRequest: 1, friendList: 1 });

  if (!resultAccount) {
    throw new AppError("User Account Not Exist", 404);
  }

  //  create  set  of userid   for users that are already  friends
  let friendListSet = new Set(resultAccount.friendList);

  //  create  set  of userid   for those  users  whom friend request are already sended 
  let sendedRequestSet = new Set(resultAccount.sendedRequest);

  let outFilter = { uId: 1, name: 1, email: 1 ,profileImg:1,profMess:1};

  query = {
    $and: [
      {
        $or: [
          { name: new RegExp(req.query.searchQuery, "i") },
          { email: new RegExp(req.query.searchQuery, "i") },
        ]
      },
      { _id: { $ne: resultAccount._id } },
      { accountType: "public" }
    ]
  };

  let resultSearch = await userAccount.find(query, outFilter).skip(skip).limit(limit).lean();
 
  for (let i = 0; i < resultSearch.length; i++) {
    resultSearch[i].isFriend = friendListSet.has(resultSearch[i].uId) ;
    resultSearch[i].isSendedRequest = sendedRequestSet.has(resultSearch[i].uId) ;
    resultSearch[i].profMess  =    resultSearch[i].profMess || null ; 
    resultSearch[i].profileImg  =    resultSearch[i].profileImg || null ; 
  }

  return res.status(200).json({ message: "friend list are", list: resultSearch });

});

// ######## Send Friend Request ########
module.exports.sendFriendRequest = catchError(async (req, res) => {
 
  const friendUserId = req.body.friendUserId ? req.body.friendUserId.trim() : undefined;

  if (!friendUserId) {
    throw new AppError("Must have field 'friendUserId' ", 400);
  }

  let query = {
    $and: [
      { _id: req.user._id },
      { accessToken: req.user.accessToken },
 
    ]
  };
  let resultAccount = await userAccount.findOne(query, { uId: 1, sendedRequest: 1, friendList: 1 });
 
  if (!resultAccount) {
    throw new AppError("User Account Not Exist", 404);
  }

  if (resultAccount.sendedRequest.includes(friendUserId)) {
    throw new AppError("Already Sended Friend Request", 409);
  }

  if (resultAccount.friendList.includes(friendUserId)) {
    throw new AppError("Users is already in  your  Friends List", 409);
  }
 
  /* 
    In friend's account  
     - add self uId to  friend's receivedRequest array 
    
     In self  account  
     - add  friend's uId to self  sendedRequest array 
    */

  let result = await Promise.all([
    userAccount.updateOne({ uId: friendUserId }, { '$addToSet': { receivedRequest: resultAccount.uId } }),
    userAccount.updateOne({ _id: resultAccount._id }, { '$addToSet': { sendedRequest: friendUserId } }),

  ]);

  if (result[0].nModified == 1 && result[1].nModified == 1) {
    return res.status(200).json({ message: "Friend Request Sended Successfully" });

  }

  return res.status(500).json({ message: "Not Able to Update"  });

});

// ######## Get Received Friend Request ########
module.exports.listReceivedRequest = catchError(async (req, res) => {
 
  let query = {
    $and: [
      { _id: req.user._id },
      { accessToken: req.user.accessToken },
  
    ]
  };
  let resultAccount = await userAccount.findOne(query, { receivedRequest: 1 });
  if (!resultAccount) {
    throw new AppError("User Account Not Exist", 404);
  }

  if (resultAccount.receivedRequest.length == 0) {
    return res.status(200).json({ message: "Received Friend Request are", receivedRequest: [] });
  }

  const limit = req.query.limit && req.query.limit <= 5000 ? parseInt(req.query.limit) : 15;
  req.query.page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
  const skip = (req.query.page - 1) * limit;

  let result = await userAccount.find(
    { uId: { $in: resultAccount.receivedRequest } },
    { profileImg: 1, profMess: 1, name: 1, uId: 1, })
    .skip(skip).limit(limit).lean();

  return res.status(200).json({ message: "Received Friend Request are", receivedRequest: result });

});

// ######## Accept  Received Friend Request ########
module.exports.acceptFriendRequest = catchError(async (req, res) => {

  const friendUserId = req.body.friendUserId ? req.body.friendUserId.trim() : undefined;

  if (!friendUserId) {
    throw new AppError("Must have field 'friendUserId' ", 400);
  }

  /* check if friend invitation for self exist or not */
  let query = {
    $and: [
      { _id: req.user._id },
      { accessToken: req.user.accessToken },
      { receivedRequest: friendUserId },
    ]
  };
  let resultAccount = await userAccount.findOne(query, { _id: 1 });
  if (!resultAccount) {
    throw new AppError("Friend Request Not Exist", 404);
  }

  /* 
    In friend's account  
     - add self uId to friendList array 
     - remove self uId  from   sendedRequest array
     - push message in notification array to notify friend that his Request is  accepted

    In self  account  
     - add friend's uId  to friendList array 
     - remove friend's uId   from   receivedRequest array 
    */

  let result = await Promise.all([
    userAccount.updateOne({ uId: friendUserId }, {
      '$addToSet': { friendList: req.user.uId },
      '$pull': { sendedRequest: req.user.uId },
      '$push': {
        notification: {
          message: req.user.name + " Accepted your Friend Request",
          date: new Date().getTime(), 
          name: req.user.name, 
          profileImg: req.user.profileImg, 
          profMess: req.user.profMess,  
        }
      },
    }),

    userAccount.updateOne({ _id: req.user._id }, {
      '$addToSet': { friendList: friendUserId },
      '$pull': { receivedRequest: friendUserId },
    }),
  ]);

  if (result[0].nModified == 1 && result[1].nModified == 1) {
    res.status(200).json({ message: "Accepted Friend Request Successfully" });

    /* 
  In friend's account   
   - create chat message about accepted request
 
  In self  account  
   - create chat message about accepted request
 
    /*  */
 
    result =  await chatMessage.create(
      {
        message: "Friend Request Accepted",
        recUserId: friendUserId,
        sendUserId: req.user.uId,
        isReaded: false , 
        createdBy: "server",
        date: new Date().getTime(),
      } 
    );
 
  }
  else {
    res.status(500).json({ message: "Not Able to Update" });
  }

});

// ######## Remove Friend from Friend List ########
module.exports.removeFriendFromList = catchError(async (req, res) => {
 
  const friendUserId = req.body.friendUserId ? req.body.friendUserId.trim() : undefined;

  if (!friendUserId) {
    throw new AppError("Must have field 'friendUserId' ", 400);
  }

  /* 
    In friend's account  
     - remove self uId  from   friendList array
    In self  account   
     - remove friend's uId   from   friendList array 
    */

  let result = await Promise.all([
    userAccount.updateOne({ uId: friendUserId }, {
      '$pull': { friendList: req.user.uId },
    }),
    userAccount.updateOne({ uId: req.user.uId  }, {
      '$pull': { friendList: friendUserId },
    })

  ]);
 
  if (result[0].nModified == 1 && result[1].nModified == 1) {
    res.status(200).json({ message: "Successfully Removed Friend  from Friend List" });

    /* 
    In friend's account   
   - create chat message about Removed request
 
  In self  account  
   - create chat message about Removed request
 
    /*  */
 
    result =  await chatMessage.create([
      {
        message: "Friend removed You from Friend List",
        recUserId: friendUserId,
        sendUserId: req.user.uId,
        isReaded: false , 
        createdBy: "server",
        date: new Date().getTime(),
      },
      {
        message: "You Removed Friend  from Friend List",
        recUserId: req.user.uId,
        sendUserId: friendUserId,
        isReaded: false , 
        createdBy: "server",
        date: new Date().getTime(),
      } 
    ]);
 
  }
  else {
    res.status(500).json({ message: "Not Able to Update" });
  }

});

// (async function (){
//         receivedRequest  : []   ,
//         sendedRequest  : []   ,
//        friendList  : []   ,
  
//       }} ))
// })(); 