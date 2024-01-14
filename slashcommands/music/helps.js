const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('helps')
    .setDescription('Name of commands'),
  async run(client, interaction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Commands')
          .setDescription(client.commands.map(cmd => `\`${cmd.name}\``).join(', '))
          .setColor('Blue')
      ]
    })
  }
}