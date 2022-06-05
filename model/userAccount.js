const mongoose = require("mongoose");
const validator = require('validator');
const validateField = require('../utils/validateField');

const  userAccountSchema = mongoose.Schema({
    uId:  { // user id 
        type : String,
        trim:true, 
        required : true,
        unique: true ,
    },
    name: {
        type : String,
           trim:true, 
        required : true

    },
    email: {
        type: String,
        required: true,
        unique: true ,
        trim:true, 
        // message: "dfkjd fsdklfjsdkfdsfld",
           validate: {
               
            validator: function (v) {
                // console.log("this" )
 
                
                let validResult = validateField.email( v)  ; 
                return  validResult.status == "ok" &&  validator.isEmail(v) ;  
                // return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(v);
            },
        }
    },
    password: {
        type : String,
        required : true , 
        trim:true, 
    },
    tokenStr: {
        type : String,
        // required : true, 
        //    trim:true, 
    }, // account activation string 
    tokenNo: {
        type : String,
        // required : true, 
        // trim:true, 
    } , // account activation number 

    // p_id: String, //public id  used for sending friend request
      lastVisitedAt: Date, 

      accessToken: String,          //temporary token given to user every time changed during login 
      tokenExpireAt: Number, //   
    accountStatus: {   //account is active or not 
        type : String,
        enum: {
            values: [ 'active' ,  'unactivate'  ],
            message: "must be  either 'active' ,  'unactivate'."
        } , 
        default:  "active",
        trim:true, 
    },  
    currentStatus: {   // currently online or not 
          type : String,
        // required : true , 
         trim:true, 
        enum: {
          values: ['online', 'offline' ],
          message: "must be  either 'online', 'offline'."
      } ,
      default: 'offline' 
    },
    accountType: {   //account type can be  public or private(not shown when other search for it )
        type : String,
        // required : true , 
        trim:true, 
        enum: {
          values: ['public', 'private' ],
          message: "must be  either 'public', 'private' ."
      } ,
    },
    profileImg: {  
        type : String,  
        trim:true,  
    }  ,
    profMess: {  // profile message
        type : String,  
        trim:true,  
    }, 
    friendRequest: [],//All recieved request are stored in this array 
    sendedRequest: [], // All seneded request are stroed in this array
    friendList: [],  // All those who accepted request
    notification: [],
    files: [],

    folderName: String,
});

module.exports = mongoose.model('userAccount', userAccountSchema);