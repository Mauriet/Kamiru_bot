const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('plays')
    .setDescription('Leave the voice channel.')
    .addStringOption(option => option.setName('song').setDescription('Enter a song name or link.').setRequired(true)),
  async run(client, interaction) {
    interaction.reply('Rproducing song...')
    await client.distube.play(interaction.member.voice.channel, interaction.options.get("song").value, {textChannel: interaction.channel, member: interaction.member})
  }
}