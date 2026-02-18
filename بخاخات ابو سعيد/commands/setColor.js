const UserSpray = require("../models/UserSpray");
const GangMap = require("../models/GangMap");
const updateMap = require("../utils/updateMap");
const config = require("../config.json");

module.exports = async message => {
  // صلاحية الرتبة
  if (!message.member.roles.cache.has(config.allowedRole))
    return message.reply("❌ ما عندك صلاحية");

  const user = message.mentions.users.first();
  const color = message.content.split(" ").pop();

  if (!user)
    return message.reply("❌ منشن الشخص");

  if (!/^#[0-9A-Fa-f]{6}$/.test(color))
    return message.reply("❌ كود اللون غير صحيح\nمثال: #ff0000");

  // تحديث المستخدم
  let data = await UserSpray.findOne({ userId: user.id });
  if (!data) {
    data = await UserSpray.create({
      userId: user.id,
      amount: 0,
      selectedColor: color
    });
  } else {
    data.selectedColor = color;
    await data.save();
  }

  // تحديث كل بخاخاته
  const gang = await GangMap.findOne({ gangId: "main" });
  if (gang) {
    gang.sprays.forEach(s => {
      if (s.userId === user.id) {
        s.color = color;
      }
    });
    await gang.save();
    await updateMap(message.client);
  }

  message.reply(`🎨 تم تعيين اللون ${color} لـ <@${user.id}>`);
};