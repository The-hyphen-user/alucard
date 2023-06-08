require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const cron = require('node-cron');
const epigGamesChannelId = process.env.epigGamesChannelId;
const openai = new OpenAIApi(configuration)
const {
    Client,
    GatewayIntentBits,
} = require('discord.js')
const { BOT_TOKEN, GUILD_ID } = process.env
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

client.on('ready', async () => {
    const guildId = GUILD_ID
    const command = await client.application.commands.create(chatgptCommand, guildId);
    console.log(`${client.user.tag} Logged In`)
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'chatgpt') {
                const user = interaction.member.user;
                const nickname = interaction.member.nickname;
                const username = nickname ? nickname : user.username;
                interaction.reply(`generating response... \n Beep Boop`);

                const message = interaction.options.getString('message');

                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: message,
                    temperature: 0.9,
                    max_tokens: 100,
                    top_p: 0,
                    frequency_penalty: 0.5,
                    presence_penalty: 0,
                });
                await interaction.editReply(`Beep Boop calculations complete:\n${username}: ${message}\nChatGPT: ${response.data.choices[0].text}`);

            }
        }
    } catch (err) {
        console.log('error: ' + err)
        try{
            interaction.editReply(`beep boop error: ${err}`)
        }catch(err){
            console.log(err)
        }
    }
})

client.login(BOT_TOKEN)
console.log('ChatGPT is running')

const messageDiscordNewGames = async () => {
    const data = await fetch('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
    {
    params: { country: 'US', locale: 'en-US' },
    headers: { 'Access-Control-Allow-Origin': '*' }
    })
    const json = await data.json()
    json.data.Catalog.searchStore.elements.forEach(e => {
        if (e.title === 'Mystery Game'){
        } else {
            const title = e.title
            const description = e.description
            const picture = e.keyImages[0].url
            const channel = client.channels.cache.get(epigGamesChannelId)
            // channel.send('new game on epic games: \n',title, '\n', description, '\n', picture)
            channel.send(`new game on epic games:\n${title}\n${description}\n${picture}`);

        }
    })
}

cron.schedule('5 15 * * 5', () => {
    messageDiscordNewGames()
  });