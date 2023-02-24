require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)
const {
    Client,
    GatewayIntentBits,
} = require('discord.js')
const { ALUCARD_BOT_TOKEN, TESTING_SERVER_GUILD_ID } = process.env
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
    const guildId = TESTING_SERVER_GUILD_ID
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
                interaction.reply(`generating response... \n Beep Boop Fucking your mom!`);

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
                await interaction.editReply(`Beep Boop Fucking your mom complete:\n${username}: ${message}\nChatGPT: ${response.data.choices[0].text}`);

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

client.login(ALUCARD_BOT_TOKEN)
console.log('ChatGPT is running')