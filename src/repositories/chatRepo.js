const ApiErrors = require('../errorMessages/apiErrors');
const User = require('../schemas/userSchema');
const Chat = require('../schemas/chatSchema');

class ChatRepository {
    static createChat(username, title, description, res){
        User.findOne({username})
            .then((user) => {
                const chat = new Chat({title, description, creator: user});

                chat.save()
                    .then(() => res.status(200).json({message: "The chat has successfully been created"}))
                    .catch(() => res.status(500).json(ApiErrors.internalServerError()))
            })
            .catch(()=> res.status(404).json(ApiErrors.notFound("user")))
    }

    static findAllChats(res){
        Chat.find()
            .then((chats)=> res.status(200).json({chats: chats}))
            .catch(() => res.status(500).json(ApiErrors.internalServerError()))
    }
}

module.exports = ChatRepository;