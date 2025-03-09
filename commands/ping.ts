import { MessageFlags, type CommandInteraction } from "discord.js";
import type Command from "../types/Command";

const ping: Command = {
    name: "ping",
    description: "Replies with Pong!",
    async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: "Pong!", flags: MessageFlags.Ephemeral });
    },
};

export default ping;
