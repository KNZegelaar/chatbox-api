const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../repositories/chatRepo');

router.post('/', (req, res) => {
    const body = req.body;

    if (!CheckObjects.isValidChat(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const title = body.title;

    repo.createChat(req.user.username, title, res);
});

class CheckObjects {
    static isValidChat(object) {
        const tmp =
            object && typeof object == "object" &&
            object.title && typeof object.title == "string";
        console.log(`Is chat valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;