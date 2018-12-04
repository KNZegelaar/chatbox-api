const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const User = require('../src/schemas/userSchema');
const assert = require('assert');

chai.should();
chai.use(chaiHttp);

describe('Registration', () => {
    let token = '';

    afterEach((done) => {
        chai.request(index)
            .delete('/api/user')
            .set('X-Access-Token', token)
            .end((err, res) => {
                if (err) console.log("Error: " + err);
                if (res) console.log("The test user has been deleted");

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

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');

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
});

describe('Login', () => {

});