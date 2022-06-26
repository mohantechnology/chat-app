const mongoose = require("mongoose");
const validator = require('validator');
const validateField = require('../utils/validateField');

const userAccountSchema = mongoose.Schema({
    uId: { // user id 
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        trim: true,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // message: "dfkjd fsdklfjsdkfdsfld",
        validate: {

            validator: function (v) {
                // console.log("this" )


                let validResult = validateField.email(v);
                return validResult.status == "ok" && validator.isEmail(v);
                // return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(v);
            },
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    facebookId: String,          //facebook id if signup with facebook 
  
    // p_id: String, //public id  used for sending friend request
    lastVisitedAt: Date,

    accessToken: String,          //temporary token given to user every time changed during login 
    tokenExpireAt: Number, //   
    accountStatus: {   //account is active or not 
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: "must be  either 'active' ,  'inactive'."
        },
        default: "inactive",
        trim: true,
    },
    currentStatus: {   // currently online or not 
        type: String,
        // required : true , 
        trim: true,
        enum: {
            values: ['online', 'offline'],
            message: "must be  either 'online', 'offline'."
        },
        default: 'offline'
    },
    accountType: {   //account type can be  public or private(not shown when other search for it )
        type: String,
        // required : true , 
        trim: true,
        enum: {
            values: ['public', 'private'],
            message: "must be  either 'public', 'private' ."
        },
    },
      messageTone: {   // incoming message tone 
        type: String,
        // required : true , 
        trim: true,
        enum: {
            values: ['on', 'off'],
            message: "must be  either 'on', 'off'."
        },
        default: 'on'
    },
    profileImg: {
        type: String,
        trim: true,
        default: null,

    },
    profMess: {  // profile message
        type: String,
        trim: true,
        default: null,
    },
    receivedRequest: [{  //All receive request are stored in this array 
        type: String , 
    } ],

    sendedRequest: [{ // All seneded request are stroed in this array
        type: String , 
    } ], 

    friendList: [{ // All those who accepted request
        type: String , 
    } ], 
    notification: [{
        message: {  
             type: String, 
            trim: true, 
        },
        date : {
            type: Number , 
        },
        name:  {
            type: String , 
        }, 
        profileImg:  {
            type: String , 
        }, 
        profMess:  {
            type: String , 
        },  
    }],
//     files: [ {   //  contains all files name uploaded by this user
//         type: String,  
//    }],

    // folderName: { //  folder name for all files uploaded for this user including profile image
    //     type: String,
    //     trim: true,
    //     required: true,
    //     unique: true,
    // },,
},
{
    timestamps: true,
});

module.exports = mongoose.model('userAccount', userAccountSchema);


/*

  receivedRequest: [{  //All receive request are stored in this array 
        type: mongoose.Types.ObjectId,
        ref: 'userAccount'
    } ],

    sendedRequest: [{ // All seneded request are stroed in this array
        type: mongoose.Types.ObjectId,
        ref: 'userAccount'
    } ], 

    friendList: [{ // All those who accepted request
        type: mongoose.Types.ObjectId,
        ref: 'userAccount'
    } ],  


    */