import chalk from "chalk";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Commands, registerCommands } from "./types/Command";
import interactionCreate from "./handlers/interactionCreate";
import type Crawler from "./types/Crawler";
import * as fs from 'fs';
import * as path from 'path';




const loadCrawlers = async (): Promise<Crawler[]> => {
    const crawlers = [];
    const crawlersPath = path.join(__dirname, '/crawlers');
    const crawlerFiles = fs.readdirSync(crawlersPath).filter(file => file.endsWith('.ts'));
    for (const file of crawlerFiles) {
        const filePath = path.join(crawlersPath, file);
        const crawler: Crawler = (await import(filePath)).default;
        crawlers.push(crawler);
    }
    return crawlers;
};


const executeCrawlers = async () => {
    const crawlers = await loadCrawlers();
    console.log(chalk.green(`[+] Loaded ${crawlers.length} crawlers`));
    // Change this to setInterval
    setInterval(async () => {
        for (const crawler of crawlers) {
            const internships = await crawler.scrape();
            console.log(chalk.green(`[${crawler.name}] Scraped ${internships.length} internship(s)!`));
        }
    }, 5 * 1000);
};

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
executeCrawlers();

client.login(process.env.BOT_TOKEN);
