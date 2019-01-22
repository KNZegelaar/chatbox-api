const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../repositories/chatRepo');


//TODO: change '/all' into '/'
router.get('/', (req, res) => {
    repo.findAllChats(res);
});

router.get('/:chatId', (req, res) => {
    const chatId = req.params.chatId;

    repo.findOneChat(chatId, res);
});

router.delete('/:chatId', (req, res) => {
    const chatId = req.params.chatId;

    repo.deleteChat(chatId, res);
});

router.put('/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    const body = req.body;

    if (!CheckObjects.isValidChat(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const title = body.title;
    const description = body.description;


    repo.updateChat(chatId, title, description, res);
});

router.post('/', (req, res) => {
    const body = req.body;

    if (!CheckObjects.isValidChat(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const title = body.title;
    const description = body.description;

    repo.createChat(req.user.username, title, description, res);
});

class CheckObjects {
    static isValidChat(object) {
        const tmp =
            object && typeof object == "object" &&
            object.description && typeof object.description == "string" &&
            object.title && typeof object.title == "string";
        console.log(`Is chat valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;