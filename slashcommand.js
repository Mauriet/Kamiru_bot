const fs = require('node:fs');
const path = require('node:path');
const { Routes, Client } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [];

fs.readdirSync('./slashcommands').forEach(async(categorys) => {
  const commandFilesSlash = fs.readdirSync(`./slashcommands/${categorys}`).filter((archivo) => archivo.endsWith('js'))

  for (const archivo of commandFilesSlash) {
    const command = require(`./slashcommands/${categorys}/${archivo}`)
    commands.push(command.data.toJSON())
  }
})

const rest = new REST({ version: '10' }).setToken('MTE5MzM4NTQ4NjQ4MDMxODQ5NQ.GH_wyE.QT2WjTfTeOHAsn_gxP2NMy1z_nAncH2EjmMlxg');
async function creareSlash() {
  try {
    await rest.put(
      Routes.applicationCommands('1193385486480318495'), {
        body: commands
      }
    )
  } catch (error) {
    console.error(error)
  }
}
creareSlash()