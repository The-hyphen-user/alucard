
import { SlashCommandBuilder } from '@discordjs/builders';

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

export {chatgptCommand, imageGeneratorCommand}