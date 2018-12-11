const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = require('./messageSchema');

const ChatSchema = new Schema({
    title: String,
    description: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    messages: [MessageSchema]
});

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;