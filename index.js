const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.json');
const cors = require('cors');

//Mongoose connection
mongoose.connect('mongodb://localhost/' + config.dbName, {useNewUrlParser: true});

mongoose.connection
    .once('open', () => {
        const port = config.serverPort;

        app.listen(port, function(){
            console.log('http://localhost: ' + port);
        });
    })
    .on('error', (error) => {
        console.warn('Warning', error);
    });

//app setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.all('*', function(req, res, next){
    next();
});

app.use(express.static(__dirname + '/public'));

// Routing
app.use('/api', require('./src/routes/authentication'));
app.use('/api/friend', require('./src/routes/friend'));
app.use('/api/chat', require('./src/routes/chat'));

module.exports = app;