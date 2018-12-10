const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../repositories/friendRepo');

router.post('/', (req, res) => {
    const body = req.body;

    if (!CheckObjects.isValidFriend(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const usernameFriend = body.usernameFriend;

    repo.createFriendship(req.user.username, usernameFriend, res);
});

router.delete('/', (req, res) => {
    const body = req.body;

    if (!CheckObjects.isValidFriend(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const usernameFriend = body.usernameFriend;

    repo.deleteFriendShip(req.user.username, usernameFriend, res);
});

class CheckObjects {
    static isValidFriend(object) {
        const tmp =
            object && typeof object == "object" &&
            object.usernameFriend && typeof object.usernameFriend == "string";
        console.log(`Is friendship valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }
}


module.exports = router;