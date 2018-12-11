const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../repositories/chatRepo');

router.get('/all', (req, res) => {
    repo.findAllChats(res);
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