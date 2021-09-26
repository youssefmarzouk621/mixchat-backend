const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const message = new mongoose.Schema({
  sender: {//destination
    type: Schema.ObjectId,
    ref: 'users'
  },
  receiver: {//connectedUser
    type: Schema.ObjectId,
    ref: 'users'
  },
  type: {
    type: String
  },
  message: {
    type: String
  },
  discussionId: {
    type: String
  },
  seen: {
    type: String
  },
},{timestamps:true})
const Message = mongoose.model('messages', message);
module.exports = Message
