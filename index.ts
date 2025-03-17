import chalk from "chalk";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Commands, registerCommands } from "./types/Command";
import interactionCreate from "./handlers/interactionCreate";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once(Events.ClientReady, async (user) => {
    console.log(chalk.green(`[+] Logged in as ${user.user.tag}`));
    await registerCommands(client);
    console.log(chalk.green(`[+] Registered ${Commands.length} commands`));
});

interactionCreate(client);

client.login(process.env.BOT_TOKEN);
