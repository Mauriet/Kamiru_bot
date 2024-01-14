const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skiptos')
    .setDescription('Skip song to.')
    .addStringOption(option => option.setName('number').setDescription('Number of song in queue.').setRequired(true)),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    if (!interaction.options.get('number').value) {
      return interaction.reply(`${client.emotes.error} | Please provide time (in seconds) to go rewind!`)
    }
    const num = Number(interaction.options.get('number').value)
    if (isNaN(num)) return interaction.reply(`${client.emotes.error} | Please enter a valid number!`)
    await client.distube.jump(interaction, num).then(song => {
      interaction.reply({ content: `Skipped to: ${song.name}` })
    })
  }
}