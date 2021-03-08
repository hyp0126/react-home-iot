const { mongoose } = require("./mongo.db");

// Set up the model for the mqtt message
//Define a schema
var Schema = mongoose.Schema;

var AdminModelSchema = new Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model("Admin", AdminModelSchema);
