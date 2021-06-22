// ref: https://github.com/AvanthikaMeenakshi/node-websockets/
const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

const db = require("../db");
Admin = db.Admin;
const jsonwebtoken = require("jsonwebtoken");

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

sendContentChange = () => {
  sendMessage(JSON.stringify({ type: typesDef.CONTENT_CHANGE }));
};

wsServer.on("request", function (request) {
  const query = request.resourceURL.query;
  console.log(query.auth);
  //request.cookies.map(async (cookie) => {
  //  if (cookie.name == "X-Authorization") {
  //    var auth = jsonwebtoken.verify(cookie.value, process.env.JWT_SECRET);
    var auth = jsonwebtoken.verify(query.auth, process.env.JWT_SECRET);
      Admin.findOne({ username: auth.user }).exec(() => {
        var userID = getUniqueID();
      
        console.log(
          new Date() +
            " Recieved a new connection from origin " +
            request.origin +
            "."
        );
      
        //var intervalId = setInterval(checkRoomData, 10000);
        var intervalId = setInterval(sendContentChange, 10000);
      
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
  //  }
  //});
});

module.exports = {
  sendMessage,
};
