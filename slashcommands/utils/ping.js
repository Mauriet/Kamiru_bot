const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async run(client, interaction) {

    interaction.reply(`Your ping is ${Date.now() - interaction.createdTimestamp}ms.\nAPI ping is ${Math.round(client.ws.ping)}ms`);
  }
}