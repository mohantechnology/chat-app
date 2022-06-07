const mongoose = require("mongoose");
const validator = require('validator');
const validateField = require('../utils/validateField');

const chatMessageSchema = mongoose.Schema({
    uId: { // user id 
        type: String, 
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: true 
    },
   
     createdBy: {   // message is created by 
        type: String,
        enum: {
            values: ['server', 'user'],
            message: "must be  either 'server', 'user'."
        },
        default: "user",
        // trim: true,
    },
    type: {   // message type
        type: String,
        enum: {
            values: ['file', 'text'],
            message: "must be  either 'file', 'text'."
        },
        default: "text", 
    },
    
    date : {
        type: Date , 
    }
    // folderName: String,
},
// {
//     timestamps: true,
// }
);

module.exports = mongoose.model('chatMessage', chatMessageSchema);

 