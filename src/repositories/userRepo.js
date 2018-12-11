const auth = require('../authentication/authentication');
const User = require('../schemas/userSchema');
const ApiErrors = require('../errorMessages/apiErrors');
const config = require('../../config');

class UserRepository {
    static createUser(username, email, password, res) {
        const newUser = new User({ username: username, email: email, password: password });

        User.findOne({username})
            .then((user) => {
                if (user === null) {
                    newUser.save()
                        .then(() => {
                            res.status(200).json({token: auth.encodeToken(username)});
                        })
                        .catch(() => res.status(500).json(ApiErrors.internalServerError()))
                } else res.status(420).json(ApiErrors.userExists());
            })
            .catch(() => {res.status(500).json(ApiErrors.internalServerError())}
            );
    };

    static login(username, password, res) {
        User.findOne({username})
            .then((user) => {
                if(user.password === password) res.status(200).json({token: auth.encodeToken(username)});
                else res.status(401).json(ApiErrors.notAuthorised());
            })
            .catch(() => {res.status(401).json(ApiErrors.notAuthorised())});

    };

    static changePassword(username, password, newPassword, res) {
        User.findOne({username})
            .then((user) => {
                console.log("User: " + user);
                if(user.password === password){
                    user.set({password: newPassword});
                    user.save()
                        .then(() => res.status(200).json({message: "your password has been changed."}))
                        .catch(() => res.status(500).json(ApiErrors.internalServerError()))
                } else res.status(401).json(ApiErrors.notAuthorised());
            })
            .catch(() => {res.status(404).json(ApiErrors.notFound(username))});
    };

    static deleteUser(username, password, res){
        User.findOneAndDelete({username, password})
            .then(() => {
                res.status(200).json({message: "the user has been deleted."});
            })
            .catch(() => {res.status(401).json(ApiErrors.notAuthorised())});
    };
}

module.exports = UserRepository;