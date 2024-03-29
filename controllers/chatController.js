const path = require('path');
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");
const utilFunc = require('../utils/utilFunc');
 
const fs = require('fs');

/* import models */
const userAccount = require('../model/userAccount');
const chatMessage = require('../model/chatMessage');
 
// ######## List Chat Message  ########
module.exports.listMessage = catchError(async (req, res) => {

  const friendUserId = req.query.friendUserId ? req.query.friendUserId.trim() : undefined;

  if (!friendUserId) {
    throw new AppError("Must have field 'friendUserId' ", 400);
  }

  const limit = req.query.limit && req.query.limit <= 5000 ? parseInt(req.query.limit) : 15;
  req.query.page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
  const skip = (req.query.page - 1) * limit;

  /*   list message that are  
          -  sended by  that friend and  received  to self 
          -  sended by  self and received to  that friend 
       */

  let query = {
    $or: [
      {
        $and: [
          { sendUserId: friendUserId },
          { recUserId: req.user.uId },
        ]
      },
      {
        $and: [
          { sendUserId: req.user.uId },
          { recUserId: friendUserId },

        ]
      }
    ]

  };

  let response = { readed: [], unreaded: [] };
  let unreadedMessageIdList = [];
  let outFilter = { __v: 0, sendUserId: 0  };

  let resultMessage = await chatMessage.find(query, outFilter).skip(skip).limit(limit).sort({ date: -1 }).lean();

  /* reverse and extract id of  messages  that are recevied by self   and are not marked as readed   */
  for (let i = resultMessage.length - 1; i >= 0; i--) {
    if (resultMessage[i].recUserId == req.user.uId && resultMessage[i].isReaded == false) {
      unreadedMessageIdList.push(resultMessage[i]._id);
      response.unreaded.push(resultMessage[i]);
    }
    else {
      response.readed.push(resultMessage[i]);
    }
 
    /* if message is not created by server then add if message is created by self or his friend */
    if( resultMessage[i].createdBy != "server" ){ 
      resultMessage[i].createdBy   = resultMessage[i].recUserId == req.user.uId  ? "friend": "self" ; 
    }
    resultMessage[i].messageDate = new Date(resultMessage[i].date).toISOString();
  }

  /* if request containt 'friendProfile' == 'yes'  then send profile detail with response   */
  if( req.query.friendProfile == 'yes'){ 
    response.friendProfile =  await userAccount.findOne({uId : friendUserId},
      { _id: 0,name: 1 , profileImg: 1  , profMess: 1 , currentStatus: 1 });
  }

  res.status(200).json({ message: "Messages are", data: response });

  /* marked  unreaded messages as readed   */
  if (unreadedMessageIdList.length) {
    await chatMessage.updateMany({ _id: { $in: unreadedMessageIdList } }, { $set: { isReaded: true } });
  }

});

// ######## Save Message  ########
module.exports.saveMessage = catchError(async (req, res) => {

  /*   create message      */

  const body = req.body;

  if (!body.receiver.uId || !body.receiver.currentStatus || !body.messageType || !body.message) {
    throw new AppError("Must have field 'receiver.uId', 'receiver.currentStatus', 'messageType', 'message'   ", 400);
  }
 
  let messageData =    {
    message: body.message,
    recUserId: body.receiver.uId,
    sendUserId: req.user.uId,
    // createdBy: "server",
    isReaded: body.receiver.currentStatus == "online" ? true : false,
    date: new Date().getTime(),
    messageType: body.messageType,
    createdBy: "user",
  };

  /* if file then add file detail */
  if (body.messageType == "file") {
    if (!body.fileName || !body.mimeType) {
      throw new AppError("Must have field 'fileName' , 'mimeType' ", 400);
    }
     
    messageData.fileName =  body.fileName ; 
    messageData.mimeType =  body.mimeType ; 
     
  }

  let result = await chatMessage.create( messageData );

  res.status(201).json({
    message: "Message Saved  Successfully",
    data: body.result ? result : undefined, // include  result document  in response if result !== undefined
  });

});

// ######## upload file   ########
module.exports.uploadFile = catchError(async (req, res) => {
    
  /* if request contain  profile image file then save the file   */
  if (req.files &&  req.files.uploadFile ){
    
    let uploadFile = req.files.uploadFile  ; 
    let extn = uploadFile.name.split(".").pop().toLocaleLowerCase() ; 
     
    // if (  uploadFile.mimetype.split("/")[0] != 'image'){ 
    //     throw new AppError("File Not  Supported for Profile Image", 415 );
    // }   
    // else  if( !constant.ACCEPTABLE_IMAGE_EXT_lIST.includes(extn)   ) { 
    //     throw new AppError("Invalid File extension of Profile Image. Valid Extension are "+ constant.ACCEPTABLE_IMAGE_EXT_lIST.join(", ") , 415 ); 
    // }
       
    let fileName =  "tf_" +     utilFunc.generateRandomBytes(25) +"."+ extn ;  
    await uploadFile.mv(  __dirname + '/../public/upload/transferFile/' + fileName) ; 

    res.status(200).json({
      message: "File Uploaded Successfully",
      data: {
        fileName: fileName,
        mimeType: uploadFile.mimetype,
        filePath : 'upload/transferFile/' + fileName,
      }   
    } ); 
             
    /* add  fileName to uploaded file list    */
          
    await userAccount.updateOne(
      {  $and: [    { _id: req.user._id },  { accessToken: req.user.accessToken }   ]}, 
      { $push: { files: fileName} });
                
  }
  else { 
    throw new AppError("Must have file with keyName 'uploadFile' ", 400 );
  }
     
});

// ######## download  File   ########
module.exports.downloadFile = catchError(async (req, res) => { 
    
  req.query.fileName =  req.query.fileName ?  req.query.fileName.trim(): undefined ;  

  if (!req.query.fileName) {
    throw new AppError("Must have field 'fileName' ", 400);
  }
  
  let filePath  = path.resolve (__dirname + `/../public/upload/transferFile/${req.query.fileName}`);
  // let path_link =__dirname + `/transfer_file`;
  
  let uploadDirPath =  path.resolve(__dirname + "/../public/upload/transferFile/"); 
  /* check if file path is of uploaded directory */
  if (!filePath.startsWith(uploadDirPath)) {
    throw new AppError("You  do not have access to download this  file", 403)   ;
  }
      
  if (!fs.existsSync(filePath)) {
    throw new AppError("File Not Exist", 404)   ;
  }

  res.download(filePath,req.query.fileName);

});
