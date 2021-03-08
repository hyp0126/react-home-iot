const express = require("express");
const { mqttController } = require("../controllers");
const router = express.Router();

// Set up Route
router.post("/login", mqttController.postLogin);

// Logout / expire token
router.post("/logout", function (req, res) {});

// Ajax for roomDate
router.post("/roomData", mqttController.postRoomData);

// Test
router.get("/hello", function (req, res) {
  res.send({ tempMsgs: "Hello" });
});

router.post("/temperature", mqttController.postTemperature);

router.post("/led", mqttController.setLed);

// 404 page
//myApp.all('*', function(req, res) {
//    res.status(404).send('<h1>404 Not Found</h1>');
//    console.log(req);
//});

module.exports = router;
