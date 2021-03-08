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

module.exports = {
  mongoose,
};
