const express = require("express");
const router = express.Router();
const auth = require('../authentication/authentication.js');
const apiErrors = require("../errorMessages/apiErrors.js");
const Isemail = require('isemail');
const repo = require('../repositories/userRepo');

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    const token = request.header('X-Access-Token');
    auth.decodeToken(token, (error, payload) => {
        if (error) {
            console.log(error);
            response.status((error.status || 401)).json(apiErrors.notAuthorised())
        } else {
            request.user = {username: payload.sub};
            next();
        }
    })
});

router.route("/register").post((req, res) => {
    const body = req.body;
    if (!CheckObjects.isValidRegistration(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    // Get the users information to store in the database.
    const username = body.username;
    const email = body.email;
    const password = body.password;

    repo.createUser(username, email, password, res);
});

router.route("/login").post((request, response) => {
    const body = request.body;
    if (!CheckObjects.isValidLogin(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }
    // Get the username and password from the request.
    const username = body.username;
    const password = body.password;

    repo.login(username, password, response);
});

router.route("/user/changepassword").post((request, response) => {
    const body = request.body;

    if (!CheckObjects.isValidPasswordChange(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }

    const password = body.password;
    const newPassword = body.newPassword;

    repo.changePassword(request.user.username, password, newPassword, response);

});

router.route("/user").delete((request, response) => {
    const body = request.body;

    if (!CheckObjects.isValidDelete(body)) {
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }

    const password = body.password;


    repo.deleteUser(request.user.username, password, response);
});


class CheckObjects {
    // Returns true if the given object is a valid login
    static isValidLogin(object) {
        const tmp =
            object && typeof object == "object" &&
            object.username && typeof object.username == "string" &&
            object.password && typeof object.password == "string";
        return tmp == undefined ? false : tmp;
    }

    // Returns true if the given object is a valid register
    static isValidRegistration(object) {
        const tmp =
            object && typeof object == "object" &&
            object.username && typeof object.username == "string" && object.username.length >= 2 &&
            object.email && typeof object.email == "string" && Isemail.validate(object.email) &&
            object.password && typeof object.password == "string";
        return tmp == undefined ? false : tmp;
    }

    static isValidPasswordChange(object) {
        const tmp =
            object && typeof object == "object" &&
            object.password && typeof object.password == "string" &&
            object.newPassword && typeof object.newPassword == "string";
        return tmp == undefined ? false : tmp;
    }

    static isValidDelete(object) {
        const tmp =
            object && typeof object == "object" &&
            object.password && typeof object.password == "string";
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;
