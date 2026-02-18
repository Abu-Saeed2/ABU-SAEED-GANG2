const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const UserSpray = require("../models/UserSpray");
const drawMap = require("../utils/drawMap");

const sessions = new Map();

module.exports = async (interaction) => {
  const user = await UserSpray.findOne({ userId: interaction.user.id });

  if (!user || !user.selectedColor) {
    return interaction.reply({
      content: "❌ لازم تحدد لون أول\nاستخدم: -تعيين-لون #ff0000",
      ephemeral: true
    });
  }

  if (user.amount <= 0) {
    return interaction.reply({
      content: "❌ ما عندك بخاخات",
      ephemeral: true
    });
  }

  const { buffer, width, height } = await drawMap([]);

  const startX = Math.floor(width / 2);
  const startY = Math.floor(height / 2);

  sessions.set(interaction.user.id, {
    x: startX,
    y: startY,
    color: user.selectedColor
  });

  const preview = await drawMap([
    { x: startX, y: startY, color: user.selectedColor }
  ]);

  const img = new AttachmentBuilder(preview.buffer, { name: "map.png" });

  const moveRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("up").setLabel("⬆️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("left").setLabel("⬅️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("right").setLabel("➡️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("down").setLabel("⬇️").setStyle(ButtonStyle.Secondary)
  );

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("confirm").setLabel("تعيين").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("cancel").setLabel("إلغاء").setStyle(ButtonStyle.Danger)
  );

  const embed = new EmbedBuilder()
    .setTitle(" حدد مكان البخاخ")
    .setImage("attachment://map.png");

  return interaction.reply({
    embeds: [embed],
    files: [img],
    components: [moveRow, actionRow],
    ephemeral: true
  });
};

module.exports.sessions = sessions;