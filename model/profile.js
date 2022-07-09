   
const mongoose = require("mongoose"); 
module.exports =  new  mongoose.Schema({
  friend_name: String,
  friend_email: String,
  friend_u_id: String,
  chat_message: [],
  recieved_message: [],
  sent_message: [],
  current_status: String,
  is_blocked: Boolean

});
