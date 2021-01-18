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

function tts_say(words) {
  //Says the words using TTS in the channel specified by the ID in "../config/channel_data.json"
  //Param: words - words to be said in the channel

  //Gets the channel object from the ID specified in "../config/channel_data.json", and calls channel_callback, passing the channel object as a parameter
  client.channels.fetch(channel_data.id)
    .then(channel_callback);

  //Plays the TTS
  //Param: channel - the voice channel object where the TTS will play
  function channel_callback(channel){
    const { ttsPlayer, name: guildName, voice } = channel.guild;
    const connection = voice ? voice.connection : null;


    if (!channel) {
      //message.reply('you need to be in a voice channel first.');
      return;
    }

    if (!channel.joinable) {
      //message.reply('I cannot join your voice channel.');
      return;
    }

    if (connection) {
      ttsPlayer.say(words);
    } else {
      channel.join()
        .then(() => {
          logger.info(`Joined ${channel.name} in ${guildName}.`);
          //message.channel.send(`Joined ${channel}.`);
          ttsPlayer.say(words);
        })
        .catch((error) => {
          throw error;
        });
    }
  }
}

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
  var serverIsReady = true
  
  function server_handler(req, res){
    res.end("server is operational")

    if (serverIsReady){
      if(req.url.substr(0,10) !== "/disc_tts/"){
        return
      }
      console.log(`server requested with url of: ${req.url}`)
      words = decodeURIComponent(req.url.substr(10))
      tts_say(words)
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
