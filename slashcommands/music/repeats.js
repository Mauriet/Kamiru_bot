const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeats')
    .setDescription('Repeat song.')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Repeat mode.')
        .setRequired(true)
        .addChoices(
          { name: 'off', value: 'off' },
          { name: 'song', value: 'song' },
          { name: 'queue', value: 'queue' }
        )),
  async run(client, interaction) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing playing!`)
    let mode = null
    switch (interaction.options.get('mode').value) {
      case 'off':
        mode = 0
        break
      case 'song':
        mode = 1
        break
      case 'queue':
        mode = 2
        break
    }
    mode = queue.setRepeatMode(mode)
    mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
    interaction.reply(`${client.emotes.repeat} | Set repeat mode to \`${mode}\``)
  },
}