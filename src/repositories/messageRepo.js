const ApiErrors = require('../errorMessages/apiErrors');
const User = require('../schemas/userSchema');
const Chat = require('../schemas/chatSchema');
const Message = require('../schemas/messageSchema');

class MessageRepository {

    static readMessage(chatId, res){
        Message.find({chat: chatId })
            .populate('user', 'username')
            .then((messages)=> {
                res.status(200).json({Messages: messages})
            })
            .catch(() => res.status(404).json(ApiErrors.notFound("chat")));
    }

    static createMessage(username, chatId, content, res) {
        User.findOne({username})
            .then((user) => {
                Chat.findOne({_id: chatId})
                    .then((chat) => {
                        const message = new Message({content, user, chat});
                        console.log(message);

                        message.save()
                            .then(() => res.status(200).json({message: "The message has successfully been created"}))
                            .catch(() => res.status(500).json(ApiErrors.internalServerError()));

                    })
                    .catch(() => res.status(404).json(ApiErrors.notFound("user")))
            })
    }

    //TODO: write UPDATE

    //TODO: write DELETE
}

module.exports = MessageRepository;