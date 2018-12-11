const ApiErrors = require('../errorMessages/apiErrors');
const neo4j = require('neo4j-driver').v1;
const config = require('../../config');
const driver = neo4j.driver('bolt://localhost:'+ config.neo4jPort + '/', neo4j.auth.basic(config.neo4jUser, config.neo4jPassword));

class FriendRepository {
    static createFriendship(username, usernameNewFriend, res){
        const session = driver.session();
        session
            .run('MATCH (a:User {username: "' + username + '"}) ' +
                'MATCH (b:User {username: "' + usernameNewFriend + '"}) ' +
                'MERGE (a)-[:FRIENDS]-(b)')
            .then(function (result) {
                result.records.forEach(function (record) {});
                session.close();

                res.status(200).json({message: username + " and " + usernameNewFriend + " are now friends"});
            })
            .catch(function (error) {
                res.status(500).json(ApiErrors.internalServerError());
                console.log(error);
            });
    }

    static deleteFriendShip(username, usernameFriend, res){
        const session = driver.session();
        session
            .run('MATCH (a:User {username: "'+ username +'"}) '
                +'MATCH (b:User {username: "'+ usernameFriend +'"}) '
                +'MATCH (a)-[r]-(b) '
                +'DELETE r')
            .then(function () {
                session.close();
                res.status(200).json({message: username + " and " + usernameFriend + " are no longer friends"});
            })
            .catch(() => res.status(500).json(ApiErrors.internalServerError()));
    }
}

module.exports = FriendRepository;