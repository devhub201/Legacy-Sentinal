import { PermissionFlagsBits } from "discord.js";

/*
=========================================
 Legacy Sentinel Permission Manager
 Enterprise Discord Security Suite
=========================================
*/

const Permissions = {

    // Required permissions for the bot
    bot: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageWebhooks,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.BanMembers,
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.ManageEmojisAndStickers,
        PermissionFlagsBits.ModerateMembers
    ],

    // Dangerous permissions
    dangerous: [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.BanMembers,
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.ManageWebhooks
    ],

    has(member, permission) {
        return member.permissions.has(permission);
    },

    hasAll(member, permissions = []) {
        return permissions.every(permission =>
            member.permissions.has(permission)
        );
    },

    botMissing(guild) {

        const me = guild.members.me;

        if (!me) return this.bot;

        return this.bot.filter(permission =>
            !me.permissions.has(permission)
        );

    },

    isDangerous(permission) {
        return this.dangerous.includes(permission);
    },

    canPunish(botMember, targetMember) {

        if (!botMember || !targetMember) return false;

        if (targetMember.id === targetMember.guild.ownerId)
            return false;

        return (
            botMember.roles.highest.position >
            targetMember.roles.highest.position
        );

    }

};

export default Permissions;
