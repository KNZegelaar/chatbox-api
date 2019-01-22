const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const Chat = require('../src/schemas/chatSchema');
const Message = require('../src/schemas/messageSchema');
const assert = require('assert');

chai.should();
chai.use(chaiHttp);

describe('Message', () => {
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


                chai.request(index)
                    .post('/api/chat')
                    .set('X-Access-Token', this.token)
                    .send({
                        title: "Message Chat",
                        description: "This is a chat created in the test folder"
                    })
                    .end((err, res) => {
                        done();
                    });
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

                Chat.findOneAndRemove({title: "Message Chat"})
                    .then(()=> console.log("Message chat has been removed"));
                done();
            });
    });

    it('should create a new message', (done) => {
        Chat.findOne({title: "Message Chat"})
            .then((chat)=>{
                chai.request(index)
                    .post('/api/message/' + chat._id)
                    .set('X-Access-Token', this.token)
                    .send({
                        content: "This is a message created in the test folder"
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message', 'message created and saved to the chat');
                        done();
                    });
            })
    });

    it('should not create a new message when there is no content provided', (done) => {
        Chat.findOne({title: "Message Chat"})
            .then((chat)=>{
                chai.request(index)
                    .post('/api/message/' + chat._id)
                    .set('X-Access-Token', this.token)
                    .end((err, res) => {
                        res.should.have.status(412);
                        res.body.should.have.property('message', 'One or more properties in the request body are missing or are invalid.');
                        done();
                    });
            })
    });

});
