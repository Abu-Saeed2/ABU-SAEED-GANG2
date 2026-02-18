const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const GangMap = require("../models/GangMap");
const drawMap = require("../utils/drawMap");
const config = require("../config.json");

module.exports = async message => {
  if (!message.member.roles.cache.has(config.allowedRole))
    return message.reply("❌ ما عندك صلاحية");

  // رسم الخريطة
  const result = await drawMap([]);
  const img = new AttachmentBuilder(result.buffer, { name: "map.png" });

  const embed = new EmbedBuilder()
    .setTitle("🗺️ خريطة العصابات")
    .setImage("attachment://map.png");

  const sent = await message.channel.send({
    embeds: [embed],
    files: [img]
  });

  // حفظ البيانات
  await GangMap.findOneAndUpdate(
    { gangId: "main" },
    {
      guildId: message.guild.id,
      channelId: message.channel.id,
      messageId: sent.id
    },
    { upsert: true }
  );

  message.reply("✅ تم تعيين شات الخريطة بنجاح");
};