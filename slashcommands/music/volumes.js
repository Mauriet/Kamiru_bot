const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volumes')
    .setDescription('Set volume of the song.')
    .addStringOption(option => option.setName('volume').setDescription('Add volume 1-100').setRequired(true)),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    const volume = parseInt(interaction.options.get('volume').value)
    if (isNaN(volume)) return interaction.reply(`${client.emotes.error} | Please enter a valid number!`)
    queue.setVolume(volume)
    interaction.reply(`${client.emotes.success} | Volume set to \`${volume}\``)
  }
}