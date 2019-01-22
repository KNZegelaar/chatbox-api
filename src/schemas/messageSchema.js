const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chat'
    },
    timeStamp: { type: Date, default: Date.now()},
    content: String
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;