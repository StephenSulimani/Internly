import type Command from "../types/Command";
import { ChannelType, MessageFlags, PermissionFlagsBits, Role, type CommandInteraction, type GuildBasedChannel } from "discord.js";
import { CommandOptionType } from "../types/CommandOption";
import prisma from "../handlers/prisma";
import Embed from "../types/Embed";

const set: Command = {
    name: "set",
    description: "Sets the notification role and/or channel.",
    options: [
        {
            name: "role",
            description: "Sets the notification role.",
            type: CommandOptionType.ROLE,
            required: false,
        },
        {
            name: "channel",
            description: "Sets the notification channel.",
            type: CommandOptionType.CHANNEL,
            required: false
        }
    ],
    async execute(interaction: CommandInteraction) {
        if (interaction.guildId === null || interaction.guild === null) {
            const embed = new Embed(interaction.client, "Error", "This command can only be used in a server!");
            embed.setError();
            await interaction.reply({ embeds: [embed.getEmbed()], ephemeral: true });
            return;
        }
        // Check Permissions of user
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            const embed = new Embed(interaction.client, "Error", "You need to be an admin to use this command!");
            embed.setError();
            await interaction.reply({ embeds: [embed.getEmbed()], ephemeral: true });
            return;

        }
        const role = interaction.options.get("role");
        const channel = interaction.options.get("channel");

        let db_guild = await prisma.guild.findFirst({
            where: {
                id: {
                    equals: interaction.guildId
                }
            }
        });

        if (!db_guild) {
            db_guild = await prisma.guild.create({
                data: {
                    id: interaction.guildId
                }
            });
        }

        let notif_channel: GuildBasedChannel | null = null;
        let notif_role: Role | null = null;

        if (!role && !channel) {
            // If no arguments are passed, create the role and channel if not set. Otherwise, do nothing.


            if (db_guild.notification_role_id != "" && db_guild.notification_channel_id != "") {

                try {
                    notif_channel = await interaction.guild.channels.fetch(db_guild.notification_channel_id);
                }
                catch {
                    notif_channel = null;
                }

                try {
                    notif_role = await interaction.guild.roles.fetch(db_guild.notification_role_id);
                }
                catch {
                    notif_role = null;
                }


                if (notif_channel && notif_role) {
                    const embed = new Embed(interaction.client, "Error", `The notification role (<@&${notif_role.id}>) and channel (<#${notif_channel.id}>) are already set!`);
                    embed.setError();
                    await interaction.reply({ embeds: [embed.getEmbed()], flags: MessageFlags.Ephemeral });
                    return;
                }
            }


            try {
                if (!notif_role) {
                    notif_role = await interaction.guild.roles.create({
                        name: "Internly Notification",
                        reason: "Internly Notification Role"
                    });

                }
                if (!notif_channel) {
                    notif_channel = await interaction.guild.channels.create({
                        name: "internly",
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: interaction.guildId,
                                allow: [PermissionFlagsBits.ViewChannel],
                                deny: [PermissionFlagsBits.SendMessages]
                            },
                        ]
                    });

                }

                await prisma.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        notification_role_id: notif_role.id,
                        notification_channel_id: notif_channel.id
                    }
                });
                const embed = new Embed(interaction.client, "Success", `The notification role (<@&${notif_role.id}>) and channel (<#${notif_channel.id}>) have been created!`);
                await interaction.reply({ embeds: [embed.getEmbed()], flags: MessageFlags.Ephemeral });
                return;

            }
            catch {
                const embed = new Embed(interaction.client, "Error", "There was an error creating and saving the role and channel.");
                embed.setError();
                await interaction.reply({ embeds: [embed.getEmbed()], flags: MessageFlags.Ephemeral });
            }



            // await interaction.reply({ content: "You need to specify a role or a channel!", ephemeral: true });
        }



        if (role) {
            try {
                await prisma.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        notification_role_id: role.value as string
                    }
                });
            }
            catch {
                await interaction.reply({ content: "There was an error setting the role.", ephemeral: true });
            }
        }

        if (channel) {
            try {
                await prisma.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        notification_channel_id: channel.value as string
                    }
                });
            }
            catch {
                await interaction.reply({ content: "There was an error setting the channel.", ephemeral: true });
            }
        }

        await interaction.reply({ content: "hurd", ephemeral: true });
    },
};

export default set;
