// Initial Code from: http://www.steves-internet-guide.com/using-node-mqtt-client/
// 2021-01-07 Add express
// 2021-01-08 Add Mongoose, session login/logout, 
//              PM2, Bootstrap4
// 2021-01-09 Add gauge https://github.com/toorshia/justgage
//                chart https://canvasjs.com/jquery-charts/line-chart/
//                datepicker https://gijgo.com/datepicker/example/bootstrap-4

dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var crypto = require("crypto");
var cors = require('cors');

dotenv.config({ path: '.env' });
dotenv.config();

// Get express session
const session = require('express-session');

// Set up DB connection
const mongoose = require('mongoose');

var dbConnection = mongoose.connection;
var dbOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auto_reconnect: true
}

dbConnection.on('connecting', function() {
  console.log('connecting to MongoDB...');
});

dbConnection.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

dbConnection.on('connected', function() {
  console.log('MongoDB connected!');
});

dbConnection.once('open', function() {
  console.log('MongoDB connection opened!');
});

dbConnection.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});

dbConnection.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  mongoose.connect(process.env.MONGODB_URI, dbOption);
});

mongoose.connect(process.env.MONGODB_URI, dbOption);

// Set up the model for the mqtt message
const MqttMsg = mongoose.model('MqttMsg', {
    topic: String,
    value: String,
    date: Date
});

// Set up the model for admin
const Admin = mongoose.model('Admin', {
    username: String,
    password: String
});

// Set up variables to use package
myApp = express();
myApp.use(cors());

// Set up path and public folders and view folders
myApp.set('views', path.join(__dirname, 'views'));

// Use public folders for CSS etc.
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');
myApp.use(bodyParser.urlencoded({extended: false}));
myApp.use(bodyParser.json());

// Set up session 
myApp.use(session({
    secret: 'superrandomsecret',
    resave: false,
    saveUninitialized: true
}));

// Set up & Connect MQTT server with TLS/SSL
var mqtt = require('mqtt');
const fs = require('fs');
var caFile = fs.readFileSync(process.env.CA_FILE);

var options = {
    clientId: 'nodejs' + crypto.randomBytes(4).toString('hex'),
    rejectUnauthorized : false,
    ca:caFile, 
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clean: true,
    keepalive: 20,
    reconnectPeriod: 1000 * 60
};

var mqttclient = mqtt.connect(process.env.MQTT_SERVER_URI, options);
console.log("connected flag  " + mqttclient.connected);

// Initialize mqtt data buffer
const maxRoomNumber = 2;
var roomData = [];
for (var i = 0; i < maxRoomNumber; i++){
    roomData.push({
        temperature: '',
        humidity: '',
        brightness: '',
        ledState: '',
    });
}

// Handle incoming messages
mqttclient.on('message',function(topic, message, packet){
	//console.log('message is ' + message);
    //console.log('topic is ' + topic);

    for (var i = 0; i < maxRoomNumber; i++){
        var topics = topic.toString().split('/');
        if (topics[1] == 'room'.concat(i+1)){
            if (topics[2] == 'temperature'){
                roomData[i].temperature = message.toString();
            }
            if (topics[2] == 'humidity'){
                roomData[i].humidity = message.toString();
            }
            if (topics[2] == 'brightness'){
                roomData[i].brightness = message.toString();
            }
            if (topics[2] == 'ledState'){
                roomData[i].ledState = message.toString();
            }
        }
    }

    // Create an object for the model MqttMsg
    var mqttMsg = new MqttMsg();
    mqttMsg.topic = topic;
    mqttMsg.value = message.toString();
    var date = new Date();
    mqttMsg.date = date.toUTCString();
    // Save the MqttMsg to MongoDB
    mqttMsg.save().then(function(){
        // Display Local time, but save UTC time
        //console.log(`New mqttMsg created${mqttMsg.date}`);
    });
});

mqttclient.on("connect", function() {	
    console.log("connected  "+ mqttclient.connected);

    console.log("subscribing to topics");
    for (var i = 0; i < maxRoomNumber; i++) {
        mqttclient.subscribe(`home/room${i+1}/temperature`, {qos:1});
        mqttclient.subscribe(`home/room${i+1}/humidity`, {qos:1});
        mqttclient.subscribe(`home/room${i+1}/brightness`, {qos:1});
        mqttclient.subscribe(`home/room${i+1}/ledState`, {qos:1});
    }
    console.log("end of script");
});

mqttclient.on('disconnect', function() {	
    console.log("Mqtt disconnected");
});

mqttclient.on('close', function() {	
    console.log("Mqtt closed");
});

// Handle errors
mqttclient.on("error",function(error){
    console.log("Mqtt can't connect" + error);
    process.exit(1);
    //client.end();
});

// Set up Route
// Login page / get Token
var userToken;

myApp.post('/api/login', function(req, res){
    var user = req.body.username;
    var pass = req.body.password;

    Admin.findOne({username: user, password: pass}).exec(function(err, admin){
        // Log errors
        //console.log('Error: ' + err);
        //console.log('Admin: ' + admin);
        if (admin) {
            // Store username in session and set logged in true
            req.session.username = admin.username;
            req.session.userLoggedIn = true;

            //Send access token
            userToken = crypto.randomBytes(16).toString('hex');
            res.send({
                token: userToken
            });
        } else {
            //No response
        }
    });
});

// Logout / expire token
myApp.post('/api/logout', function(req, res){

    userToken = null;
    if (req.session.username) {
        req.session.destroy(function(err) {
            res.send({logout: true});
        });
    } else {
        //No response
    }
});

// Ajax for roomDate
myApp.post('/api/roomData', function(req, res){
    if (userToken != null && req.body.token === userToken){
        res.send({roomData: roomData});
    }
});

// Test
myApp.get('/api/hello', function(req, res){
	res.send({tempMsgs: "Hello"});
});

// Ajax for temperature on the selected date
myApp.post('/api/temperature', function(req, res){
    if (userToken != null && req.body.token === userToken){
        var startTime = new Date(req.body.startTime);
        var startTime = startTime.toUTCString();     
        //console.log(`startTime:${startTime}`);
        var endTime = new Date(req.body.endTime);
        var endTime = endTime.toUTCString();     
        //console.log(`endTime:${endTime}`);
        MqttMsg.find({"date": {'$gte': startTime, '$lte': endTime}}).exec(function(err, mqttMsgs){
            var topics;
            var tempMsgs = [];
            for (var i = 0; i < mqttMsgs.length; i++){
                topics = mqttMsgs[i].topic.split('/');
                if (topics[2] == 'temperature'){
                    tempMsgs.push(mqttMsgs[i]);
                }
            }

            res.send({tempMsgs: tempMsgs});
        });
    }
});

// Toggle Led
var mqttPubOptions = {
    retain:true,
    qos:1
};

myApp.post('/api/led', function(req, res){
    var message='';

    if (userToken != null && req.body.token === userToken){
        var id = parseInt(req.body.id);
        if (id > 0 && id <= maxRoomNumber) {
            if (roomData[id-1].ledState == '1'){
                message = '0';
            } else {
                message = '1';
            }
            if (mqttclient.connected == true){
                mqttclient.publish(`home/room${id}/led`,message,mqttPubOptions);
                console.log("publishing", `home/room${id}/led/${message}`);
            }
        }
    }
});

// 404 page
//myApp.all('*', function(req, res) {
//    res.status(404).send('<h1>404 Not Found</h1>');
//    console.log(req);
//});

// Start the server and listen at a port
myApp.listen(8080, "0.0.0.0");
console.log('Website at port 8080 was running.');
