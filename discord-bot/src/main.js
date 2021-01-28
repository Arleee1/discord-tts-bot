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
