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
// 2021-03-07 Add Directories

dotenv = require("dotenv");
const express = require("express");
const jwt = require("express-jwt");
const path = require("path");
const bodyParser = require("body-parser");
var cors = require("cors");
var cookieParser = require("cookie-parser");

dotenv.config({ path: ".env" });
dotenv.config();

//Websocket
webSocket = require("./services/websocket");

//mqtt service
mqttService = require("./services/mqtt.service");
mqttService.setSendMessage(webSocket.sendMessage);

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

myApp.use(
  jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }).unless({
    path: ["/api/login", "/api/logout"],
  })
);

routes = require("./routes");
myApp.use("/api", routes);

// Start the server and listen at a port
myApp.listen(8080);
console.log("Website at port 8080 was running.");
