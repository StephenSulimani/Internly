import { ChatInputCommandInteraction, Events, type Client, type CommandInteraction } from "discord.js";
import { Commands } from "../types/Command";

export default (client: Client) => {
    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isCommand()) {
            return await commandHandler(interaction);
        }
    });
};

const commandHandler = async (interaction: CommandInteraction) => {
    if (interaction.isChatInputCommand()) {
        return await chatInputCommandHandler(interaction);
    }
};

const chatInputCommandHandler = async (interaction: ChatInputCommandInteraction) => {
    const command = Commands.find(command => command.name === interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {

        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
};
