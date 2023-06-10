const axios = require('axios');
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const cron = require('node-cron');
const epigGamesChannelId = process.env.EPIC_GAMES_CHANNEL_ID;

const winston = require('winston');



const {
    Client,
    GatewayIntentBits,
    MessageAttachment,
} = require('discord.js')
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

const { SlashCommandBuilder } = require('@discordjs/builders');
const chatgptCommand = new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription('talks with the chatbot')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('message to sent to chat bot')
            .setRequired(true))

const imageGeneratorCommand = new SlashCommandBuilder()
    .setName('image')
    .setDescription('generates an image')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('message to sent to chat bot for image generation')
            .setRequired(true))



// Configure Winston logger
const logger = winston.createLogger({
    level: 'info', // Set the desired log level (e.g., 'info', 'debug', 'error')
    format: winston.format.simple(), // Use a simple log format
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: 'bot.log' }), // Log to a file
    ],
});

// Log uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ', err);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection: ', promise, ' Reason: ', reason);
});

// Log server shutdown
process.on('exit', (code) => {
    logger.info(`Server shutdown with exit code: ${code}`);
});

client.on('ready', async () => {
    const guildId = GUILD_ID
    const command = await client.application.commands.create(chatgptCommand, guildId);
    const imageCommand = await client.application.commands.create(imageGeneratorCommand, guildId);
    logger.info(`Logged in as ${client.user.tag}!`);
    // console.log(`${client.user.tag} Logged In`)
    //    messageDiscordNewGames()
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'chatgpt') {
                const user = interaction.member.user;
                const nickname = interaction.member.nickname;
                const username = nickname ? nickname : user.username;
                interaction.reply(`generating response... \n Beep Boop Fucking your mom!`);
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
                await interaction.editReply(`Beep Boop Fucking your mom complete:\n${username}: ${message}\nChatGPT: ${response.data.choices[0].text}`);

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
                })
                // console.log(response)
                // console.log(response.data)
                // console.log(response.data.data[0])
                // console.log(response.data.data[0].url)
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
            interaction.editReply(`Beep Boop Fucking Error: ${error}`)
        } catch (err) {
            logger.error(`${new Date()}, Error while editing reply: ${error}`)
        }
    }
})
client.login(ALUCARD_BOT_TOKEN)
logger.info(`${new Date()}, ChatGPT is running`)

const messageDiscordNewGames = async () => {
    logger.info(`${new Date()}, attempting to contact epic games`)
    const response = await axios.get('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
        {
            params: { country: 'US', locale: 'en-US' },
            headers: { 'Access-Control-Allow-Origin': '*' }
        })
    const json = response.data;
    // console.log('json:', json.data.Catalog.searchStore.elements[0].title)
    // logger.info(`Response: ${json.data.Catalog.searchStore.elements}`)
    // console.log(`responce C-logged: ${json.data.Catalog.searchStore.elements[0].title}`)
    json.data.Catalog.searchStore.elements.forEach(e => {
        if (e.title === 'Mystery Game') {
        } else {
            const promotionalOffers = e.promotions.promotionalOffers
            const upcommingPromotionalOffers = e.promotions.upcomingPromotionalOffers
            if (promotionalOffers.length === 0) {
                console.log(e.title, ' not out yet')
            } else {

                const title = e.title
                console.log('title1:', title)
                // const effectiveDate = e.effectiveDate
                const pageSlug = e.productSlug
                console.log('title:', title)
                //            const description = e.description
                //            const picture = e.keyImages[0].url
                const channel = client.channels.cache.get(epigGamesChannelId)
                //            channel.send('new game on epic games: \n',title, '\n', description, '\n', picture)
                //            channel.send(`new game on epic games:\n${title}\n${description}\n${picture}`);
                // const ref = title.replace(/\s/g, '-').toLowerCase()
                const endDate = e.promotions.promotionalOffers[0].promotionalOffers[0].endDate
                const readableDatePST = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
                channel.send(`https://www.epicgames.com/store/en-US/p/${pageSlug}`)
                channel.send(`Promotion ending ${readableDatePST}`)
            }
        }
    })
}

// cron.schedule('5 15 * * 5', () => {//friday at :05am PST
cron.schedule('*/1 * * * *', () => { //every 2 minutes
    messageDiscordNewGames()
});