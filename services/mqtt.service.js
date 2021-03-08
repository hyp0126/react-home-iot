// Set up & Connect MQTT server with TLS/SSL
var mqtt = require("mqtt");
const fs = require("fs");
var caFile = fs.readFileSync(process.env.CA_FILE);
var crypto = require("crypto");
var sendMessage;

const db = require("../db");
MqttMsg = db.Mqttmsg;

function setSendMessage(_sendMessage) {
  sendMessage = _sendMessage;
}

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

var mqttclient = null;

function getMqttClient() {
  if (mqttclient == null) {
    mqttclient = mqtt.connect(process.env.MQTT_SERVER_URI, options);
    console.log("connected flag  " + mqttclient.connected);

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
  }

  return mqttclient;
}

// Connect
getMqttClient();

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

function checkRoomData(sendMessage) {
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

module.exports = {
  roomData,
  setSendMessage,
  getMqttClient,
};
