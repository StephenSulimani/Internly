import { EmbedBuilder, type Client } from "discord.js";

export default class Embed {
    client: Client;
    embed: EmbedBuilder;

    constructor(client: Client, title: string, description: string) {
        this.client = client;
        this.embed = new EmbedBuilder()
            .setAuthor({
                name: this.client.user?.username ? this.client.user.username : "Internly",
                iconURL: this.client.user?.avatarURL() ? this.client.user.avatarURL() : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5HSSIZ0dsaXl25YISpEey6sm4Je0v3Q8zg&s"
            })
            .setColor(0x003366)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    }

    getEmbed() {
        return this.embed;
    }

    setError() {
        this.embed.setColor(0xff0000);
    }


}
