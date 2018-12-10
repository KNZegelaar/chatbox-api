const ApiErrors = require('../errorMessages/apiErrors');
const User = require('../schemas/userSchema');
const Chat = require('../schemas/chatSchema');
const Message = require('../schemas/messageSchema');

class MessageRepository {
    static createMessage(username, chatId, content, res) {
        User.findOne({username})
            .then((user) => {
                Chat.findOne({_id: chatId})
                    .then((chat) => {
                        chat.messages.push({content, user});

                        chat.save()
                            .then(() => {
                                res.status(200).json({"message": "message created and saved to the chat"})
                            })
                            .catch(() => res.status(500).json(ApiErrors.internalServerError()))
                    })
                    .catch(() => res.status(404).json(ApiErrors.notFound("user")))
            })
    }
}


module.exports = MessageRepository;