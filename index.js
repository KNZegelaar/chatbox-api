const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.json');
const cors = require('cors');
const CONNECTION_STRING = 'mongodb+srv://'+ config.dbUser + ':' + config.dbPassword + '@cluster0-wessr.azure.mongodb.net/' + config.dbName +'?retryWrites=true';

if(process)

//Mongoose connection

    // mongodb+srv://Admin:<PASSWORD>@cluster0-wessr.azure.mongodb.net/test?retryWrites=true
mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});

mongoose.connection
    .once('open', () => {
        const port =  process.env.PORT || config.serverPort;

        app.listen(port, function(){
            console.log('Running on port: ' + port);
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
app.use('/api/chat', require('./src/routes/chat'));
app.use('/api/message', require('./src/routes/message'));

module.exports = app;