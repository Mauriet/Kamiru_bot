const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playskips')
    .setDescription('Play and skip the song.')
    .addStringOption(option => option.setName('song').setDescription('Enter a song name or link.').setRequired(true)),
  async run(client, interaction) {
    const string = interaction.options.get("song").value;
    if (!string) return interaction.reply(`${client.emotes.error} | Please enter a song url or query to search.`)
    interaction.reply('Rproducing song...')
    client.distube.play(interaction.member.voice.channel, string, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
      skip: true
    })
  }
}