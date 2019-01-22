const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    title: String,
    description: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;