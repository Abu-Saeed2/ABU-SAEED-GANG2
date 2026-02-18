const UserSpray = require("../models/UserSpray");
const config = require("../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = async message => {
  if (!message.member.roles.cache.has(config.allowedRole)) return;

  const user = message.mentions.users.first();
  if (!user) return;

  const data = await UserSpray.findOne({ userId: user.id });
  if (!data) return;

  const embed = new EmbedBuilder()
    .setTitle("**🖍️ — البخاخات**")
    .addFields(
      { name: "العدد", value: `${data.amount}`, inline: true },
      { name: "اللون", value: data.selectedColor, inline: true }
    );

  message.reply({ embeds: [embed] });
};