const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const config = require("./config.json");

// ===== Commands =====
const assign = require("./commands/assign");
const giveSpray = require("./commands/giveSpray");
const removeSpray = require("./commands/removeSpray");
const setColor = require("./commands/setColor");
const checkSprays = require("./commands/checkSprays");
const setChannel = require("./commands/setChannel");

// ===== Interactions =====
const sprayHandler = require("./interactions/spray");
const removeHandler = require("./interactions/remove");

// ===== Utils =====
const drawMap = require("./utils/drawMap");
const updateMap = require("./utils/updateMap");

// ===== Models =====
const UserSpray = require("./models/UserSpray");
const GangMap = require("./models/GangMap");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== MongoDB =====
mongoose.connect(config.mongo).then(() => {
  console.log("MongoDB Connected");
});

// ===== Prefix Commands =====
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
  const cmd = args.shift();

  if (cmd === "تعيين") return assign(message);
  if (cmd === "اعطاء-بخاخ") return giveSpray(message);
  if (cmd === "ازالة-بخاخ") return removeSpray(message);
  if (cmd === "تعيين-لون") return setColor(message);
  if (cmd === "كشف-البخاخات") return checkSprays(message);
  if (cmd === "تعيين-شات") return setChannel(message);
});

// ===== Interactions =====
client.on("interactionCreate", async interaction => {
  // ===== Buttons =====
  if (interaction.isButton()) {
 
    if (interaction.customId === "spray_start") {
      return sprayHandler(interaction);
    }

   
    if (interaction.customId === "spray_remove") {
      return removeHandler(interaction);
    }

   
    const session = sprayHandler.sessions.get(interaction.user.id);
    if (!session) return;

    const step = 10;

    if (interaction.customId === "up") session.y -= step;
    if (interaction.customId === "down") session.y += step;
    if (interaction.customId === "left") session.x -= step;
    if (interaction.customId === "right") session.x += step;

   
    if (interaction.customId === "cancel") {
      sprayHandler.sessions.delete(interaction.user.id);
      return interaction.update({
        content: "❌ تم الإلغاء",
        components: [],
        embeds: [],
        files: []
      });
    }

   
    if (interaction.customId === "confirm") {
      const user = await UserSpray.findOne({ userId: interaction.user.id });
      const gang = await GangMap.findOne({ gangId: "main" });
      if (!user || !gang) return;

      user.amount -= 1;
      await user.save();

      gang.sprays.push({
        id: require("uuid").v4(),
        userId: interaction.user.id,
        color: user.selectedColor,
        x: session.x,
        y: session.y
      });

      await gang.save();
      sprayHandler.sessions.delete(interaction.user.id);

      await updateMap(client);

      return interaction.update({
        content: "✅ تم تثبيت البخ",
        components: [],
        embeds: [],
        files: []
      });
    }

    
    const preview = await drawMap([
      { x: session.x, y: session.y, color: session.color }
    ]);

    const img = new AttachmentBuilder(preview.buffer, { name: "map.png" });

    return interaction.update({ files: [img] });
  }

  // ===== Select Menu =====
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "remove_spray_select") {
      const gang = await GangMap.findOne({ gangId: "main" });
      if (!gang) return;

      gang.sprays = gang.sprays.filter(s => s.id !== interaction.values[0]);
      await gang.save();

      await updateMap(client);

      return interaction.update({
        content: "✅ تم حذف البخّة",
        components: [],
        embeds: [],
        files: []
      });
    }
  }
});

// ===== Ready =====
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(config.token);