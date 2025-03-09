import * as fs from 'fs';
import * as path from 'path';
import type { Client, CommandInteraction } from "discord.js";
import chalk from 'chalk';

export default interface Command {
    name: string;
    description: string;
    execute(interaction: CommandInteraction): Promise<void>;
};

export const Commands: Command[] = [];

export const registerCommands = async (client: Client): Promise<void> => {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: Command = (await import(filePath)).default;
        Commands.push(command);
    }
    await client.application?.commands.set(Commands);
    return;
};
