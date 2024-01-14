const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joins')
    .setDescription('Replies with Pong!'),
  async run(client, interaction) {
    let voiceChannel = interaction.member.voice.channel
    if (!voiceChannel) {
      return message.channel.send(
        `${client.emotes.error} | You must be in a voice channel or enter a voice channel id!`
      )
    }
    client.distube.voices.join(voiceChannel)
    interaction.reply('Joined the voice channel!')
  }
}