# minecraft-discord-tts-bot
A simple bot that uses TTS to echo what you say in minecraft chat into a discord voice channel
Based on moonstar-x/discord-tts-bot

Setup Instructions:
Download forge and put the mod in your mods folder
Edit discord-bot/config/channel_data.json to use the discord channel ID of the voice channel you want the bot to speak in
Run discord-bot/src/app.js using node.js

Usage instructions:
In minecraft, to turn on TTS, type .tts into the chat and send it
The .tts message will toggle whether or not the tts is on, and the .tts message will not be sent to the server you're on or any other players you are playing with
Other players will, however, still see all other chats you say
