const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resumes')
    .setDescription('Resume the song.'),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    if (queue.paused) {
      queue.resume()
      interaction.reply('Resumed the song for you :)')
    } else {
      interaction.reply('The queue is not paused!')
    }
  }
}