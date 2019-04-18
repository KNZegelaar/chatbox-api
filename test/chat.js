const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const Chat = require('../src/schemas/chatSchema');
const assert = require('assert');

chai.should();
chai.use(chaiHttp);

//TODO: write tests for DELETE and UPDATE Chat

describe('Chat', () => {
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
                this.token = res.body.token;
                done();
            });
    });

    after((done) => {
        chai.request(index)
            .delete('/api/user')
            .set('X-Access-Token', this.token)
            .send({
                password: "Password123!"
            })
            .end((err, res) => {
                if (err) console.log("Error: " + err);

                Chat.findOneAndRemove({title:"Test Chat"})
                    .then(()=> console.log("Test chat removed"));
                done();
            });
    });

    //CREATE

    it('should create a new chat', (done) => {
        chai.request(index)
            .post('/api/chat')
            .set('X-Access-Token', this.token)
            .send({
                title: "Test Chat",
                description: "This is a chat created in the test folder"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message', 'The chat has successfully been created');

                Chat.findOne({title: "Test Chat"})
                    .then((chat)=>{
                        chat.should.be.a('object');
                        assert(chat.title === "Test Chat");
                        done();
                    });
            });
    });

    it('should not create a new chat when no title is provided', (done) => {
        chai.request(index)
            .post('/api/chat')
            .set('X-Access-Token', this.token)
            .send({
                description: "This is a chat created in the test folder"
            })
            .end((err, res) => {
                res.should.have.status(412);
                res.body.should.have.property('message', 'One or more properties in the request body are missing or are invalid.');
                done();
            });
    });

    it('should not create a new chat when no description is provided', (done) => {
        chai.request(index)
            .post('/api/chat')
            .set('X-Access-Token', this.token)
            .send({
                title: "Test Chat",
            })
            .end((err, res) => {
                res.should.have.status(412);
                res.body.should.have.property('message', 'One or more properties in the request body are missing or are invalid.');
                done();
            });
    });

    //READ

    it('should return an error on GET request', (done)=> {
        chai.request(index)
            .get('/api/chat')
            .set('X-Access-Token', this.token)
            .end((err, res) => {
                token = res.body.token;
                res.should.have.status(404);
                done();
            });
    });

    it('should return an array of chats on GET /all request', (done)=> {
        chai.request(index)
            .get('/api/chat/all')
            .set('X-Access-Token', this.token)
            .end((err, res) => {
                token = res.body.token;
                res.should.have.status(200);
                res.body.should.have.property('chats');
                res.body.should.be.a('object');
                done();
            });
    });

    //UPDATE

    it('should update an chat', (done)=>{
       done();
    });


    // TODO: should be able to update an existing chat
    // TODO: should not be able to update a non existing chat
    // TODO: should not be able to update a chat when neither a title or description is given in the body
});
