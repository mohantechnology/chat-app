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
    isReaded: { // user id 
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
            values: ['server', 'self', 'friend'],
            message: "must be  either 'server', 'self', 'friend'."
        },
        default: "self",
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

    date: {
        type: Number,
    }
    // folderName: String,
},
    // {
    //     timestamps: true,
    // }
);

module.exports = mongoose.model('chatMessage', chatMessageSchema);

