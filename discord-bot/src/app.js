const { Structures } = require('discord.js');
const logger = require('@greencoast/logger');
const { discordToken, prefix } = require('./common/settings');
const { TTSGuild, ExtendedClient } = require('./classes/extensions');
const fse = require("fs-extra")
const fs = require("fs")
const channel_data = require("../config/channel_data.json")
const http = require("http")
const URL = require("url").URL
// Get channel and guild id within discord by right clicking on channel/server

Structures.extend('Guild', TTSGuild);

const client = new ExtendedClient();

client.registerCommands();

client.on('error', (error) => {
  logger.error(error);
});

client.on('guildCreate', (guild) => {
  logger.info(`Joined ${guild.name} guild!`);
  client.updatePresence();
});

client.on('guildDelete', (guild) => {
  logger.info(`Left ${guild.name} guild!`);
  client.updatePresence();
  guild.ttsPlayer = null;
});

client.on('guildUnavailable', (guild) => {
  logger.warn(`Guild ${guild.name} is currently unavailable!`);
});

client.on('invalidated', () => {
  logger.error('Client connection invalidated, terminating execution with code 1.');
  process.exit(1);
});

// client.on('message', (message) => {
//   if (message.author.bot) {
//     return;
//   }
//
//   const args = message.content.slice(prefix.length).trim().split(/ +/);
//   const command = args.shift().toLowerCase();
//
//   const options = {
//     args,
//     commands: client.commands
//   };
//   tts_say("hello world")
//   console.log(JSON.stringify(message))
//   console.log(JSON.stringify(message.member))
//   client.executeCommand(message, options, command);
// });

client.on('ready', () => {
  logger.info('Connected to Discord! - Ready.');
  client.updatePresence();
  server = http.createServer(server_handler)
  server.listen(8000)

  //NOTE - The HTTP module seems to call the handler twice, so this only calls it every other time. Solution works for now, however a better one might be better for the future
  //If something breaks, remove the alternating code first
  //Alternating code is currnetly removed
  var serverIsReady = true

  function server_handler(req, res){
    res.end("server is operational")

    if (true){
      if(req.url.substr(0,10) !== "/disc_tts/"){
        return
      }
      console.log(`server requested with url of: ${req.url}`)
      words = decodeURIComponent(req.url.substr(10))
      client.tts_say(channel_data.id, words)
      console.log(`saying ${words}`)
    }
    serverIsReady = !serverIsReady
  }
});

client.on('warn', (info) => {
  logger.warn(info);
});

if (client.isDebugEnabled()) {
  client.on('debug', (info) => {
    logger.debug(info);
  });
}

client.login(discordToken);
