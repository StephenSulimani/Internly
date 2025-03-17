import type Command from "../types/Command";
import { PermissionFlagsBits, type CommandInteraction } from "discord.js";
import { CommandOptionType } from "../types/CommandOption";
import prisma from "../handlers/prisma";

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
        if (interaction.guildId === null) {
            await interaction.reply({ content: "This command can only be used in a server!", ephemeral: true });
            return;
        }
        // Check Permissions of user
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({ content: "You need to be an admin to use this command!", ephemeral: true });
            return;

        }
        const role = interaction.options.get("role");
        const channel = interaction.options.get("channel");

        if (!role && !channel) {
            await interaction.reply({ content: "You need to specify a role or a channel!", ephemeral: true });
            return;
        }

        const db_guild = await prisma.guild.findFirst({
            where: {
                id: {
                    equals: interaction.guildId
                }
            }
        });

        if (!db_guild) {
            await prisma.guild.create({
                data: {
                    id: interaction.guildId
                }
            });
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
