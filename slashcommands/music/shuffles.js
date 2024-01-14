const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffles')
    .setDescription('Shuffle the queue.'),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    queue.shuffle()
    interaction.reply('Shuffled songs in the queue')
  }
}