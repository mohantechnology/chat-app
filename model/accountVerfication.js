const mongoose = require("mongoose");
const accountVerficationSchema = mongoose.Schema({

  /*
 used to 
  -   activate account 
  -   reset password 
    */

  verficationType: {   //  
    type: String,
    required : true , 
    trim: true,
    enum: {
      values: ['activateAccount', 'resetPassword'],
      message: "must be  either 'activateAccount', 'resetPassword'."
    },
      
  },

  userId: { 
    type: String,
    required: true,
  },

  email: { 
    type: String,
    required: true,
    trim:true, 

  },

  expireAt: { //Expire date  in millisecond 

    type: Number,
    default: false
    // required: true,

  },

  tokenStr: {  // account activation string 
    type: String,
    required: true,

  },
  tokenNo: { // account activation number 
    type: String,
    required: true,

  },

}
, {
  timestamps: true,
});
const accountVerfication = mongoose.model("accountVerfication", accountVerficationSchema);
module.exports = accountVerfication;