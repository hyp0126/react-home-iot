// Initial Code from: http://www.steves-internet-guide.com/using-node-mqtt-client/
// 2021-01-07 Add express
// 2021-01-08 Add Mongoose, session login/logout,
//              PM2, Bootstrap4
// 2021-01-09 Add gauge https://github.com/toorshia/justgage
//                chart https://canvasjs.com/jquery-charts/line-chart/
//                datepicker https://gijgo.com/datepicker/example/bootstrap-4
// 2021-03-06 Remove session and custom token
//            Add JWT
//            Add Websocket

dotenv = require("dotenv");
const express = require("express");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");
var crypto = require("crypto");
var cors = require("cors");
var cookieParser = require("cookie-parser");

dotenv.config({ path: ".env" });
dotenv.config();

// Set up DB connection
const mongoose = require("mongoose");

var dbConnection = mongoose.connection;
var dbOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auto_reconnect: true,
};

dbConnection.on("connecting", function () {
  console.log("connecting to MongoDB...");
});

dbConnection.on("error", function (error) {
  console.error("Error in MongoDb connection: " + error);
  mongoose.disconnect();
});

dbConnection.on("connected", function () {
  console.log("MongoDB connected!");
});

dbConnection.once("open", function () {
  console.log("MongoDB connection opened!");
});

dbConnection.on("reconnected", function () {
  console.log("MongoDB reconnected!");
});

dbConnection.on("disconnected", function () {
  console.log("MongoDB disconnected!");
  mongoose.connect(process.env.MONGODB_URI, dbOption);
});

mongoose.connect(process.env.MONGODB_URI, dbOption);

// Set up the model for the mqtt message
const MqttMsg = mongoose.model("MqttMsg", {
  topic: String,
  value: String,
  date: Date,
});

// Set up the model for admin
const Admin = mongoose.model("Admin", {
  username: String,
  password: String,
});

// Set up variables to use package
myApp = express();

const corsOption = {
  credentials: true,
  origin: process.env.CORS_ORIGIN.split(" "),
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Forwarded-Proto",
    "Cookie",
    "Set-Cookie",
  ],
  exposedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Forwarded-Proto",
    "Cookie",
    "Set-Cookie",
  ],
};
myApp.use(cors(corsOption));
// Access-Control-Max-Age -> stop many preflight
//myApp.use(cors({ maxAge: 600 }));
//myApp.use(cors({ credentials: true, origin: ['http//localhost:3000'] }))

// Set up path and public folders and view folders
myApp.set("views", path.join(__dirname, "views"));

// Use public folders for CSS etc.
myApp.use(express.static(__dirname + "/public"));
myApp.set("view engine", "ejs");
myApp.use(bodyParser.urlencoded({ extended: false }));
myApp.use(bodyParser.json());

// Set up Cookie Parser
myApp.use(cookieParser());

// Set up & Connect MQTT server with TLS/SSL
var mqtt = require("mqtt");
const fs = require("fs");
var caFile = fs.readFileSync(process.env.CA_FILE);

var options = {
  clientId: "nodejs" + crypto.randomBytes(4).toString("hex"),
  rejectUnauthorized: false,
  ca: caFile,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clean: true,
  keepalive: 20,
  reconnectPeriod: 1000 * 60,
};

var mqttclient = mqtt.connect(process.env.MQTT_SERVER_URI, options);
console.log("connected flag  " + mqttclient.connected);

// Initialize mqtt data buffer
const maxRoomNumber = 3;
var roomData = [];
var prevRoomData = [];
for (var i = 0; i < maxRoomNumber; i++) {
  roomData.push({
    temperature: "",
    humidity: "",
    brightness: "",
    ledState: "",
  });

  prevRoomData.push({
    temperature: "",
    humidity: "",
    brightness: "",
    ledState: "",
  });
}

// Handle incoming messages
mqttclient.on("message", function (topic, message, packet) {
  //console.log('message is ' + message);
  //console.log('topic is ' + topic);

  for (var i = 0; i < maxRoomNumber; i++) {
    var topics = topic.toString().split("/");
    if (topics[1] == "room".concat(i + 1)) {
      if (topics[2] == "temperature") {
        roomData[i].temperature = message.toString();
      }
      if (topics[2] == "humidity") {
        roomData[i].humidity = message.toString();
      }
      if (topics[2] == "brightness") {
        roomData[i].brightness = message.toString();
      }
      if (topics[2] == "ledState") {
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
  mqttMsg.save().then(function () {
    // Display Local time, but save UTC time
    //console.log(`New mqttMsg created${mqttMsg.date}`);
  });

  //checkRoomData();
});

function checkRoomData() {
  for (var i = 0; i < maxRoomNumber - 1; i++) {
    if (
      roomData[i].temperature != prevRoomData[i].temperature ||
      roomData[i].humidity != prevRoomData[i].humidity ||
      roomData[i].brightness != prevRoomData[i].brightness ||
      roomData[i].ledState != prevRoomData[i].ledState
    ) {
      sendMessage(JSON.stringify({ type: typesDef.CONTENT_CHANGE }));
      break;
    }
  }

  for (var i = 0; i < maxRoomNumber; i++) {
    prevRoomData[i].temperature = roomData[i].temperature;
    prevRoomData[i].humidity = roomData[i].humidity;
    prevRoomData[i].brightness = roomData[i].brightness;
    prevRoomData[i].ledState = roomData[i].ledState;
  }
}

mqttclient.on("connect", function () {
  console.log("connected  " + mqttclient.connected);

  console.log("subscribing to topics");
  for (var i = 0; i < maxRoomNumber; i++) {
    mqttclient.subscribe(`home/room${i + 1}/temperature`, { qos: 1 });
    mqttclient.subscribe(`home/room${i + 1}/humidity`, { qos: 1 });
    mqttclient.subscribe(`home/room${i + 1}/brightness`, { qos: 1 });
    mqttclient.subscribe(`home/room${i + 1}/ledState`, { qos: 1 });
  }
  console.log("end of script");
});

mqttclient.on("disconnect", function () {
  console.log("Mqtt disconnected");
});

mqttclient.on("close", function () {
  console.log("Mqtt closed");
});

// Handle errors
mqttclient.on("error", function (error) {
  console.log("Mqtt can't connect" + error);
  process.exit(1);
  //client.end();
});

// Set up Route
// Login page / get Token

// JWT
myApp.post("/api/login", (req, res) => {
  var user = req.body.username;
  var pass = req.body.password;

  Admin.findOne({ username: user, password: pass }).exec(function (err, admin) {
    if (admin) {
      //Send JWT token
      res.json({
        token: jsonwebtoken.sign(
          { user: admin.username },
          process.env.JWT_SECRET
        ),
      });
    } else {
      //No response
    }
  });
});

myApp.use(jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }));

// Logout / expire token
myApp.post("/api/logout", function (req, res) {});

// Ajax for roomDate
myApp.post("/api/roomData", function (req, res) {
  res.send({ roomData: roomData });
});

// Test
myApp.get("/api/hello", function (req, res) {
  res.send({ tempMsgs: "Hello" });
});

// Ajax for temperature on the selected date
myApp.post("/api/temperature", function (req, res) {
  var startTime = new Date(req.body.startTime);
  var startTime = startTime.toUTCString();
  //console.log(`startTime:${startTime}`);
  var endTime = new Date(req.body.endTime);
  var endTime = endTime.toUTCString();
  //console.log(`endTime:${endTime}`);
  MqttMsg.find({ date: { $gte: startTime, $lte: endTime } }).exec(function (
    err,
    mqttMsgs
  ) {
    var topics;
    var tempMsgs = [];
    for (var i = 0; i < mqttMsgs.length; i++) {
      topics = mqttMsgs[i].topic.split("/");
      if (topics[2] == "temperature") {
        tempMsgs.push(mqttMsgs[i]);
      }
    }

    res.send({ tempMsgs: tempMsgs });
  });
});

// Toggle Led
var mqttPubOptions = {
  retain: true,
  qos: 1,
};

myApp.post("/api/led", function (req, res) {
  var message = "";

  var id = parseInt(req.body.id);
  if (id > 0 && id <= maxRoomNumber) {
    if (roomData[id - 1].ledState == "1") {
      message = "0";
    } else {
      message = "1";
    }
    if (mqttclient.connected == true) {
      mqttclient.publish(`home/room${id}/led`, message, mqttPubOptions);
      console.log("publishing", `home/room${id}/led/${message}`);
    }
  }
});

// 404 page
//myApp.all('*', function(req, res) {
//    res.status(404).send('<h1>404 Not Found</h1>');
//    console.log(req);
//});

// Start the server and listen at a port
myApp.listen(8080);
console.log("Website at port 8080 was running.");

// Websocket
// https://github.com/AvanthikaMeenakshi/node-websockets/
const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

// I'm maintaining all active connections in this object
const clients = {};

const sendMessage = (json) => {
  // We are sending the current data to all connected clients
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(json);
  });
};

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange",
};

wsServer.on("request", function (request) {
  var userID = getUniqueID();

  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      request.origin +
      "."
  );

  var intervalId = setInterval(checkRoomData, 10000);

  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      const dataFromClient = JSON.parse(message.utf8Data);
      const json = { type: dataFromClient.type };
      sendMessage(JSON.stringify(json));
    }
  });
  // user disconnected
  connection.on("close", function (connection) {
    clearInterval(intervalId);

    console.log(new Date() + " Peer " + userID + " disconnected.");
    const json = { type: typesDef.USER_EVENT };
    delete clients[userID];
    sendMessage(JSON.stringify(json));
  });
});
