const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const User = require('../src/schemas/userSchema');
const assert = require('assert');
const config = require('../config');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:'+ config.neo4jPort + '/', neo4j.auth.basic(config.neo4jUser, config.neo4jPassword));

chai.should();
chai.use(chaiHttp);

describe('Registration', () => {
    let token = null;

    afterEach((done) => {
        chai.request(index)
            .delete('/api/user')
            .set('X-Access-Token', token)
            .send({
                password: "Password123!"
            })
            .end((err, res) => {
                if (err) console.log("Error: " + err);
                done();
            });
    });

    it('should return an error on GET request', (done)=> {
        chai.request(index)
            .get('/api/register')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    it('should throw an error when the username is shorter than 2 chars', (done)=> {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "A",
                email: "JoeEmail@avans.com",
                password: "Password123!"
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should throw an error when email is invalid', (done) => {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "Joe",
                email: "NotAnEmailAddress",
                password: "Password123!"
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should create a user in the mongoDB database', (done) => {
        //create a new user
        chai.request(index)
            .post('/api/register')
            .send({
                username: "Joe",
                email: "JoeEmail@avans.com",
                password: "Password123!"
            })
            .end((err, res) => {
                token = res.body.token;

                //find the user in the database
                User.findOne({username: "Joe"})
                    .then((user) => {
                        user.should.be.a('object');
                        assert(user.username === "Joe");
                        assert(user.email === "JoeEmail@avans.com");
                        done();
                    });
            });
    });

    it('should create a user in the neo4j database', (done) => {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "Joe",
                email: "JoeEmail@avans.com",
                password: "Password123!"
            })
            .end((err, res) => {
                token = res.body.token;

                //find the user in the database
                const session = driver.session();

                //TODO: The method doesn't check if its really Joe
                session
                    .run('MATCH (a:User { username: "Joe"}) RETURN a')
                    .then(function (result) {
                        result.records.forEach(function (record) {
                            record.should.be.a('object');
                        });
                        session.close();
                        done();
                    })
            });
    });
});

describe('Login', () => {
    let token = '';

    before((done)=> {
        chai.request(index)
            .post('/api/register')
            .send({
                username: "Joe",
                email: "JoeEmail@avans.com",
                password: "Password123!"
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    after((done) => {
        chai.request(index)
            .delete('/api/user')
            .set('X-Access-Token', token)
            .send({
                password: "Password123!"
            })
            .end((err, res) => {
                if (err) console.log("Error: " + err);
                done();
            });
    });

    it('should return an error on GET request', (done)=> {
        chai.request(index)
            .get('/api/login')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    it('should return an token when correct credentials are provided', (done)=> {
        chai.request(index)
            .post('/api/login')
            .send({
                username: "Joe",
                password: "Password123!"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');

                done();
            });
    });

    it('should return an error when an email used instead of a username', (done)=>{
        chai.request(index)
            .post('/api/login')
            .send({
                email: "JoeEmail@avans.com",
                password: "Password123!"
            })
            .end((err, res) => {
                res.should.have.status(412);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');

                done();
            });
    });

    it('should return an error when the password is wrong', (done) => {
        chai.request(index)
            .post('/api/login')
            .send({
                username: "Joe",
                password: "WRONGPASSWORD"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');

                done();
            });
    });

    it('should return an error with the wrong username', (done) => {
        chai.request(index)
            .post('/api/login')
            .send({
                username: "WRONGUSERNAME",
                password: "Password123!"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');

                done();
            });
    });
});