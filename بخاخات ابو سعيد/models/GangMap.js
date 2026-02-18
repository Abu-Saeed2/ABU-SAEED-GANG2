const mongoose = require("mongoose");

const GangMapSchema = new mongoose.Schema({
  gangId: { type: String, default: "main" },

  guildId: String,
  channelId: String,
  messageId: String,

  sprays: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("GangMap", GangMapSchema);