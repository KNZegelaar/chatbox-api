const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const Chat = require('../src/schemas/chatSchema');
const assert = require('assert');

chai.should();
chai.use(chaiHttp);


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

    it('should return an array of chats on GET request', (done)=> {
        chai.request(index)
            .get('/api/chat')
            .set('X-Access-Token', this.token)
            .end((err, res) => {
                token = res.body.token;
                res.should.have.status(200);
                res.body.should.have.property('chats');
                res.body.should.be.a('object');
                done();
            });
    });

    it('should return an error on GET /all request', (done)=> {
        chai.request(index)
            .get('/api/chat/all')
            .set('X-Access-Token', this.token)
            .end((err, res) => {
                token = res.body.token;
                res.should.have.status(500);
                done();
            });
    });

    //UPDATE

    it('should update an chat', (done)=>{
        Chat.findOne({title: "Test Chat"})
            .then((chat)=>{
                chai.request(index)
                    .put('/api/chat/' + chat._id)
                    .set('X-Access-Token', this.token)
                    .send({
                        title: "Test Chat",
                        description: "This is a updated chat created in the test folder"
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message', 'The chat has successfully been updated');

                        Chat.findOne({title: "Test Chat"})
                            .then((chat2)=> {
                                assert(chat2.description === "This is a updated chat created in the test folder");
                                done();
                            })
                    });
            })
    });

    it('should not be able to update an chat when no title is provided', (done)=>{
        Chat.findOne({title: "Test Chat"})
            .then((chat)=>{
                chai.request(index)
                    .put('/api/chat/' + chat._id)
                    .set('X-Access-Token', this.token)
                    .send({
                        description: "This is a updated chat created in the test folder"
                    })
                    .end((err, res) => {
                        res.should.have.status(412);
                        res.body.should.have.property('message', 'One or more properties in the request body are missing or are invalid.');
                        done();
                    });
            })
    });

    it('should not be able to update an chat when no title is provided', (done)=>{
        Chat.findOne({title: "Test Chat"})
            .then((chat)=>{
                chai.request(index)
                    .put('/api/chat/' + chat._id)
                    .set('X-Access-Token', this.token)
                    .send({
                        title: "Test Chat"
                    })
                    .end((err, res) => {
                        res.should.have.status(412);
                        res.body.should.have.property('message', 'One or more properties in the request body are missing or are invalid.');
                        done();
                    });
            })
    });
});
