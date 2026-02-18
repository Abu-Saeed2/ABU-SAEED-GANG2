const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = async message => {
  const embed = new EmbedBuilder()
    .setTitle("**🖍️ — نظام البخاخات . **")
    .setDescription("**- يمكنك اختيار العمليه الذي تريدها من الازرار بالاسفل . **");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("spray_start")
      .setLabel("بخ")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("spray_remove")
      .setLabel("إزالة")
      .setStyle(ButtonStyle.Danger)
  );

  message.reply({ embeds: [embed], components: [row] });
};