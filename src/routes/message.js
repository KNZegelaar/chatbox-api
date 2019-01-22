const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../repositories/messageRepo');

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