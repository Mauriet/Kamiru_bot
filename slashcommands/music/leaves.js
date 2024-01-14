const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaves')
    .setDescription('Leave the voice channel.'),
  async run(client, interaction) {
    
    client.distube.voices.leave(interaction)
    interaction.reply('Leaved the voice channel!')
  }
}