const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    timeStamp: { type: Date, default: Date.now().toString()},
    content: String
});

module.exports = MessageSchema;