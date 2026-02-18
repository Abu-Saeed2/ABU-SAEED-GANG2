const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const GangMap = require("../models/GangMap");
const drawMap = require("../utils/drawMap");

module.exports = async interaction => {
  const gang = await GangMap.findOne({ gangId: "main" });
  if (!gang || gang.sprays.length === 0) {
    return interaction.reply({
      content: "❌ لا يوجد بخاخات حالياً",
      ephemeral: true
    });
  }

  const result = await drawMap(gang.sprays, true);
  const img = new AttachmentBuilder(result.buffer, { name: "map.png" });

  // سيليكت منيو
  const select = new StringSelectMenuBuilder()
    .setCustomId("remove_spray_select")
    .setPlaceholder("اختر رقم البخّة")
    .addOptions(
      gang.sprays.map((s, i) => ({
        label: `بخّة رقم ${i + 1}`,
        value: s.id
      }))
    );

  const row = new ActionRowBuilder().addComponents(select);

  const embed = new EmbedBuilder()
    .setTitle(" إزالة بخّة")
    .setDescription("اختر رقم البخّة من القائمة")
    .setImage("attachment://map.png");

  return interaction.reply({
    embeds: [embed],
    files: [img],
    components: [row],
    ephemeral: true
  });
};