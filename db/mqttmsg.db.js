const { mongoose } = require("./mongo.db");

// Set up the model for the mqtt message
//Define a schema
var Schema = mongoose.Schema;

var MqttMsgModelSchema = new Schema({
  topic: String,
  value: String,
  date: Date,
});

module.exports = mongoose.model("MqttMsg", MqttMsgModelSchema);
