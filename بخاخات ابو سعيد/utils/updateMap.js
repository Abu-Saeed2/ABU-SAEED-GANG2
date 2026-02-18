const { AttachmentBuilder } = require("discord.js");
const GangMap = require("../models/GangMap");
const drawMap = require("./drawMap");

module.exports = async client => {
  try {
    const gang = await GangMap.findOne({ gangId: "main" });
    if (!gang?.channelId || !gang?.messageId) return;

    const channel = await client.channels.fetch(gang.channelId).catch(() => null);
    if (!channel) return;

    const msg = await channel.messages.fetch(gang.messageId).catch(() => null);
    if (!msg) return;

    const result = await drawMap(gang.sprays);
    const img = new AttachmentBuilder(result.buffer, { name: "map.png" });

    await msg.edit({ files: [img] });
  } catch (err) {
    console.log("⚠️ updateMap skipped");
  }
};