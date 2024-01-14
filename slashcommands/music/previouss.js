const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previouss')
    .setDescription('Previous song.'),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    const song = queue.previous()
    interaction.reply(`${client.emotes.success} | Now playing:\n${song.name}`)
  }
}