const jsonwebtoken = require("jsonwebtoken");
// Set up DB connection
// Set up the model for the mqtt message
const db = require("../db");
MqttMsg = db.Mqttmsg;
Admin = db.Admin;
mqttclient = require("../services/mqtt.service").getMqttClient();
roomData = require("../services/mqtt.service").roomData;

// Login page / get Token
function postLogin(req, res) {
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
}

function postRoomData(req, res) {
  res.send({ roomData: roomData });
}

// Ajax for temperature on the selected date
function postTemperature(req, res) {
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
}

// Toggle Led
var mqttPubOptions = {
  retain: true,
  qos: 1,
};

function setLed(req, res) {
  var message = "";

  var id = parseInt(req.body.id);
  if (id > 0 && id <= roomData.length) {
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
}

module.exports = {
  postLogin,
  postRoomData,
  postTemperature,
  setLed,
};
