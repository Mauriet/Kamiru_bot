const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stops')
    .setDescription('Stop the queue.'),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    queue.stop()
    interaction.reply(`${client.emotes.success} | Stopped!`)
  }
}