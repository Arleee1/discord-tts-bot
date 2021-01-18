const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('@greencoast/logger');
const { ACTIVITY_TYPE } = require('../../common/constants');

class ExtendedClient extends Client {
  constructor(options) {
    super(options);

    this.commands = new Collection();
  }

  registerCommands() {
    const commandsPath = path.join(__dirname, '../../commands');
    const commandFiles = fs.readdirSync(commandsPath);
    commandFiles.forEach((file) => {
      const command = require(path.join(commandsPath, file));
      this.commands.set(command.name, command);
    });
  }

  updatePresence() {
    const numOfGuilds = this.guilds.cache.reduce((sum) => sum + 1, 0);
    const presence = `${numOfGuilds} servers!`;

    this.user.setPresence({
      activity: {
        name: presence,
        type: ACTIVITY_TYPE.playing
      }
    })
      .then(() => {
        logger.info(`Presence updated to: ${presence}`);
      }).catch((error) => {
        logger.error(error);
      });
  }

  executeCommand(message, options, commandName) {
    const author = message.guild ? message.member.displayName : message.author.username;
    const origin = message.guild ? message.guild.name : `DM with ${author}`;

    const command = this.commands.get(commandName);

    if (!command) {
      return;
    }

    try {
      logger.info(`User ${author} issued command ${commandName} in ${origin}.`);
      command.execute(message, options);
    } catch (error) {
      logger.error(error);
      message.reply("there's been a problem executing your command.");
    }
  }

  isDebugEnabled() {
    return process.argv.includes('--debug');
  }

  tts_say(channel_id, words) {
    //Says the words using TTS in the channel specified by the ID in "../config/channel_data.json"
    //Param: words - words to be said in the channel
  
    //Gets the channel object from the ID specified in "../config/channel_data.json", and calls channel_callback, passing the channel object as a parameter
    this.channels.fetch(channel_id)
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
}

module.exports = ExtendedClient;
