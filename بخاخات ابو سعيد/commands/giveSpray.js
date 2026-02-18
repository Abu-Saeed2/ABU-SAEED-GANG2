const UserSpray = require("../models/UserSpray");
const config = require("../config.json");

module.exports = async message => {
  if (!message.member.roles.cache.has(config.allowedRole)) return;

  const user = message.mentions.users.first();
  const amount = parseInt(message.content.split(" ")[2]);
  if (!user || isNaN(amount)) return;

  let data = await UserSpray.findOne({ userId: user.id });
  if (!data) data = await UserSpray.create({ userId: user.id });

  data.amount += amount;
  await data.save();

  message.reply(`✅ تم إعطاء ${amount} بخاخ`);
};