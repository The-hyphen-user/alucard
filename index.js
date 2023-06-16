
import dotenv from 'dotenv';
dotenv.config();
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

import cron from 'node-cron';
import discord from 'discord.js';
const Client = discord.Client;
const GatewayIntentBits = discord.GatewayIntentBits;
const MessageAttachment = discord.MessageAttachment;
const { ALUCARD_BOT_TOKEN, GUILD_ID } = process.env
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
});

import {chatgptCommand, imageGeneratorCommand} from './commands.js';
import logger from './logger.js';
import './errorHandling.js';

client.on('ready', async () => {
    const guildId = GUILD_ID
    const command = await client.application.commands.create(chatgptCommand, guildId);
    const imageCommand = await client.application.commands.create(imageGeneratorCommand, guildId);
    logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'chatgpt') {
                const user = interaction.member.user;
                const nickname = interaction.member.nickname;
                const username = nickname ? nickname : user.username;
                interaction.reply(`generating response... \n Beep Boop Calculating!`);
                const message = interaction.options.getString('message');

                logger.info(`Chat Message:${new Date()}, ${username}, ${message}, `)
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: message,
                    temperature: 0.9,
                    max_tokens: 100,
                    top_p: 0,
                    frequency_penalty: 0.5,
                    presence_penalty: 0,
                });
                logger.info(`Chat Response:${new Date()}, ${response.data.choices[0].text}`)
                console.log('r: ', response.data.choices[0].text)
                await interaction.editReply(`Beep Boop complete:\n${username}: ${message}\nChatGPT: ${response.data.choices[0].text}`);

            }

            else if (interaction.commandName === 'image') {
                const user = interaction.member.user;
                const nickname = interaction.member.nickname;
                const username = nickname ? nickname : user.username;
                interaction.reply(`generating image... \n Beep Boop`);
                const prompt = interaction.options.getString('message');
                logger.info(`Image Message: ${new Date()}, ${username}, ${prompt}`)

                const response = await openai.createImage({
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024",
                    // size: "512x512",
                })
                logger.info(`Image Response:${new Date()}, ${response.data.data[0].url}`)
                const image_url = response.data.data[0].url;
                const attachment = new MessageAttachment(image_url);
                await interaction.editReply(`Beep Boop calculations complete:\n${username}: ${prompt}\nImage: ${image_url}`);
                await interaction.reply({ files: [attachment] });
            }

        }
    } catch (error) {
        logger.error('Error:', error)
        try {
            interaction.editReply(`Beep Boop Error: ${error}`)
        } catch (err) {
            logger.error(`${new Date()}, Error while editing reply: ${error}`)
        }
    }
})
client.login(ALUCARD_BOT_TOKEN)
logger.info(`${new Date()}, Alucard is running`)

import messageDiscordNewGames from './epicGames.js'
cron.schedule('5 15 * * 5', () => {//friday at :05am PST
// cron.schedule('*/1 * * * *', () => { //every 2 minutes
    messageDiscordNewGames(client)
});