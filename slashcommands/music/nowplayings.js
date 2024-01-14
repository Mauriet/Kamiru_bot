const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplayings')
    .setDescription('Now playing Song.'),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    const song = queue.songs[0]
    interaction.reply(`${client.emotes.play} | I'm playing **\`${song.name}\`**, by ${song.user}`)
  }
}