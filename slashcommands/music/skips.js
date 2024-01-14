const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skips')
    .setDescription('Skip the song.'),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    try {
      const song = await queue.skip()
      interaction.reply(`${client.emotes.success} | Skipped! Now playing:\n${song.name}`)
    } catch (e) {
      interaction.reply(`${client.emotes.error} | ${e}`)
    }
  }
}

