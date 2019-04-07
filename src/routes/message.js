const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../repositories/messageRepo');

router.get('/:chatId', (req, res) => {
   const chatId = req.params.chatId;
   repo.readMessage(chatId, res);
});

router.post('/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    const body = req.body;

    if (!CheckObjects.isValidMessage(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const content = body.content;

    repo.createMessage(req.user.username, chatId, content, res);
});

router.delete('/:messageId', (req, res) => {
    const messageId = req.params.messageId;

    repo.deleteMessage(messageId, res);
});

router.put('/:messageId', (req, res) => {
    const messageId = req.params.messageId;
    const body = req.body;

    if (!CheckObjects.isValidMessage(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const content = body.content;

    repo.updateMessage(req.user.username, messageId, content, res);
});

class CheckObjects {
    static isValidMessage(object) {
        const tmp =
            object && typeof object == "object" &&
            object.content && typeof object.content == "string";
        console.log(`Is message valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;