const UserSpray = require("../models/UserSpray");
const config = require("../config.json");

module.exports = async message => {
  if (!message.member.roles.cache.has(config.allowedRole)) return;

  const user = message.mentions.users.first();
  const amount = parseInt(message.content.split(" ")[2]);
  if (!user || isNaN(amount)) return;

  const data = await UserSpray.findOne({ userId: user.id });
  if (!data) return;

  data.amount = Math.max(0, data.amount - amount);
  await data.save();

  message.reply(`🗑️ تم إزالة ${amount} بخاخ`);
};