const Discord = require('discord.js')
const fs = require('fs')
require('colors')

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
})
client.on('ready', () => {
  console.log(`${client.user.tag.italic} is online.`.green)
})

client.login('MTE5MzM4NTQ4NjQ4MDMxODQ5NQ.GH_wyE.QT2WjTfTeOHAsn_gxP2NMy1z_nAncH2EjmMlxg')

////////////////////// Slash Commands
////////////////////////////////////////////////////////
client.slashcommand = new Discord.Collection();

fs.readdirSync('./slashcommands').forEach(async(categorys) => {
  const commandFilesSlash = fs.readdirSync(`./slashcommands/${categorys}`).filter((archivo) => archivo.endsWith('js'))

  for (const archivo of commandFilesSlash) {
    const command = require(`./slashcommands/${categorys}/${archivo}`)

    client.slashcommand.set(command.data.name, command)
  }
})

require('./slashcommand')
client.on('interactionCreate', async(interaction) => {
  if(interaction.isCommand()) {
    const cmd = client.slashcommand.get(interaction.commandName)
    if(!cmd) return;
    await cmd.run(client, interaction)
  }
})

////////////////////// Distube
////////////////////////////////////////////////////////
const { DisTube } = require('distube')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.config = require('./config.json')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

fs.readdir('./commands/', (err, files) => {
  if (err) return console.log('Could not find any commands!')
  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('Could not find any commands!')
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    console.log(`Loaded ${file}`)
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

///////////////////////////////////// Distube  (musica)
////////////////////////////////////////////////////////
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) => {
    const embed = new Discord.EmbedBuilder()
      .setTitle('Started Playing')
      .setDescription(`[${song.name}](${song.url})`)
      .addFields(
        { name: 'Duration:', value: `${song.formattedDuration}`, inline: true },
        { name: 'On queue:', value: `${queue.queues.size - 1} songs`, inline: true },
      )
      .setThumbnail(song.thumbnail)
      .addFields(
        { name: 'Status', value: `Volume: \`${queue.volume}\`  |  Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\`  |  Loop: \`${queue.loop ? 'On' : 'Off'}\`  |  Filter: \`${queue.filter ? 'On' : 'Off'}\`` },
      )
    const components = new Discord.ButtonBuilder()
      .setCustomId('pause')
      .setLabel('Pause')
      .setStyle(Discord.ButtonStyle.Secondary)
    const actionRow = new Discord.ActionRowBuilder()
      .addComponents(components)
    queue.textChannel.send({components: [actionRow], embeds: [embed] })
    try {
      const confirmation = actionRow.awaitMessageComponent()
      if(confirmation.customId === 'pause') {
        queue.pause()
      } catch (e) {
        console.log(e)
      }
    }
  })
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))
// // DisTubeOptions.searchSongs = true
// .on("searchResult", (message, result) => {
//     let i = 0
//     message.channel.send(
//         `**Choose an option from below**\n${result
//             .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
//             .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
//     )
// })
// .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
// .on("searchInvalidAnswer", message =>
//     message.channel.send(
//         `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
//     )
// )
// .on("searchDone", () => {})


