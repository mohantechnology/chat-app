const mongoose = require("mongoose");
const validator = require('validator');
const validateField = require('../utils/validateField');

const chatMessageSchema = mongoose.Schema({
    recUserId: { // user id 
        type: String,
        required: true,
    },
    sendUserId: { // user id 
        type: String,
        required: true,
    },
    isReaded: { // is message readed by receiver
        type: Boolean,
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: true
    },

    createdBy: {   // message is created/sended by 
        type: String,
        enum: {
            values: ['server', 'self', 'friend', 'user'],
            message: "must be  either 'server', 'self', 'friend' , 'user' ."
        },
        default: "self",
        // trim: true,
    },


    date: {
        type: Number,
    },

    fileDetail: {   // if message contain file 
        path: {
            type: String,
            trim: true,
        },
        mimeType: {
            type: String,
            trim: true,
        },
    },

    // folderName: String,
},
    // {
    //     timestamps: true,
    // }
);

module.exports = mongoose.model('chatMessage', chatMessageSchema);

