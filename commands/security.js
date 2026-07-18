const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { pool } = require('../database');

// Helper function to check if the caller is the legitimate primary owner from environment variables
function isBotOwner(userId) {
    return userId === process.env.OWNER_ID;
}

module.exports = {
    name: 'security',
    description: 'Manages anti-nuke parameters, whitelists, and lockdown states.',
    
    // ==========================================
    // 🖥️ PREFIX COMMAND ROUTER HANDLER
    // ==========================================
    async executePrefix(message, args) {
        const subCommand = args[0]?.toLowerCase();
        const guildId = message.guild.id;

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !isBotOwner(message.author.id)) {
            return message.reply('❌ **Error:** You require administrative privileges to command security modules.');
        }

        // 1. PREFIX ROUTE: Whitelist Management
        if (subCommand === 'whitelist') {
            const action = args[1]?.toLowerCase();
            const targetUser = message.mentions.users.first() || args[2];

            if (!action || !targetUser) {
                return message.reply('ℹ️ **Syntax:** `<security whitelist [add/remove] [@user/ID]`');
            }

            const targetId = typeof targetUser === 'object' ? targetUser.id : targetUser;

            if (action === 'add') {
                await pool.query(
                    `UPDATE guild_settings SET whitelist = array_append(whitelist, $1) 
                     WHERE guild_id = $2 AND NOT ($1 = ANY(whitelist))`,
                    [targetId, guildId]
                );
                return message.reply(`✅ Successfully added User (\`${targetId}\`) into server anti-nuke security whitelist configuration.`);
            } else if (action === 'remove') {
                await pool.query(
                    `UPDATE guild_settings SET whitelist = array_remove(whitelist, $1) WHERE guild_id = $2`,
                    [targetId, guildId]
                );
                return message.reply(`🛑 Target User (\`${targetId}\`) stripped from server security whitelist permissions.`);
            }
        }

        // 2. PREFIX ROUTE: Global Emergency Lockdown Toggle
        if (subCommand === 'lockdown') {
            const state = args[1]?.toLowerCase();
            if (!state || (state !== 'enable' && state !== 'disable')) {
                return message.reply('ℹ️ **Syntax:** `<security lockdown [enable/disable]`');
            }

            const isLockdown = state === 'enable';
            const statusString = isLockdown ? 'MAINTENANCE_PENDING' : 'OPERATIONAL';

            await pool.query('UPDATE guild_settings SET system_status = $1 WHERE guild_id = $2', [statusString, guildId]);
            
            // Loop through channels to forcefully drop SendMessages override checks
            const channels = await message.guild.channels.fetch();
            for (const [id, channel] of channels) {
                if (channel.type === ChannelType.GuildText) {
                    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                        SendMessages: !isLockdown
                    }).catch(() => {});
                }
            }

            return message.reply(isLockdown 
                ? '⚠️ **CRITICAL INJECT:** Global lockdown state active. Text traffic routes frozen read-only.'
                : '✅ **SYSTEM ALERT:** Emergency metrics rolled back. Global text permissions restored.'
            );
        }
    },

    // ==========================================
    // ⚙️ APPLICATION SLASH COMMAND EXECUTION INTERFACES
    // ==========================================
    async executeSlash(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const subCommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !isBotOwner(interaction.user.id)) {
            return interaction.editReply({ content: '❌ Security state controls restricted to server administrators.' });
        }

        if (subCommand === 'scanner') {
            const channels = await interaction.guild.channels.fetch();
            const dangerousRoles = interaction.guild.roles.cache.filter(role => 
                role.permissions.has(PermissionFlagsBits.Administrator) || 
                role.permissions.has(PermissionFlagsBits.BanMembers)
            );

            const scanEmbed = new EmbedBuilder()
                .setTitle('🛡️ Sentinel Telemetry: Security Scan Report')
                .setColor(0xff3333)
                .setDescription(`Live analysis framework tracking vulnerable vectors inside **${interaction.guild.name}**.`)
                .addFields(
                    { name: 'Dangerous Administrator Roles Total', value: `\`${dangerousRoles.size}\` identified rows.`, inline: false },
                    { name: 'Channel Structure Allocations', value: `\`${channels.size}\` live configurations active.`, inline: true }
                )
                .setTimestamp();

            return interaction.editReply({ embeds: [scanEmbed] });
        }
    }
};
      
