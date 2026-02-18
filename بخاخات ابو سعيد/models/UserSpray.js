const { Schema, model } = require("mongoose");

module.exports = model("UserSpray", new Schema({
  userId: String,
  amount: {
    type: Number,
    default: 0
  },
  selectedColor: {
    type: String,
    default: "#ff0000"
  }
}));