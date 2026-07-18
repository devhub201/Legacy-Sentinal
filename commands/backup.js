const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { pool } = require('../database');

module.exports = {
    name: 'backup',
    description: 'Handles server snapshots, selective channel saves, and full structural recovery mapping.',

    async executePrefix(message, args) {
        const subCommand = args[0]?.toLowerCase();
        const guildId = message.guild.id;

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ **Error:** Access Denied. Backup nodes execution requires administrative privileges.');
        }

        // 1. PREFIX ROUTE: Selective High-Priority Channel Save Target
        if (subCommand === 'save') {
            const targetChannel = message.mentions.channels.first() || message.channel;
            
            if (targetChannel.type !== ChannelType.GuildText) {
                return message.reply('❌ **Error:** Snapshot backup captures can only target valid Guild Text Channels.');
            }

            message.reply(`⏳ *Syncing target channel data vault logs for \`#${targetChannel.name}\`...*`);

            try {
                // Fetch last 50 historical message entries from the target channel text buffer
                const messageBuffer = await targetChannel.messages.fetch({ limit: 50 });
                const clearPayload = messageBuffer.map(msg => ({
                    content: msg.content,
                    authorName: msg.author.username,
                    attachments: msg.attachments.map(a => a.url),
                    embeds: msg.embeds.map(e => e.toJSON ? e.toJSON() : e)
                }));

                const permissionOverwrites = targetChannel.permissionOverwrites.cache.map(ov => ({
                    id: ov.id,
                    type: ov.type,
                    allow: ov.allow.toArray(),
                    deny: ov.deny.toArray()
                }));

                // Push payload snapshot directly into PostgreSQL table matching the structure mapped in database.js
                await pool.query(
                    `INSERT INTO saved_channels (guild_id, channel_id, channel_name, channel_type, position, permissions, messages)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        guildId, 
                        targetChannel.id, 
                        targetChannel.name, 
                        targetChannel.type, 
                        targetChannel.position, 
                        JSON.stringify(permissionOverwrites), 
                        JSON.stringify(clearPayload)
                    ]
                );

                return message.reply(`✅ **High-Priority Backup Lock:** Channel configuration map and recent message array saved successfully.`);
            } catch (err) {
                return message.reply(`❌ **Internal Processing Breakdown:** ${err.message}`);
            }
        }

        // 2. PREFIX ROUTE: Full Rollover Recovery Execution
        if (subCommand === 'restore') {
            message.reply('⏳ *Querying relational infrastructure databases for recent layout nodes...*');

            try {
                const backupRes = await pool.query(
                    'SELECT * FROM server_backups WHERE guild_id = $1 ORDER BY created_at DESC LIMIT 1',
                    [guildId]
                );

                if (backupRes.rows.length === 0) {
                    return message.reply('❌ **Data Void:** No snapshot entry logs mapped for this guild signature.');
                }

                const lastBackup = backupRes.rows[0];
                const backupStructure = lastBackup.structure;

                message.reply('⚙️ *Relational layout data found. Rebuilding channels block map topology...*');

                // Loop layout mapping array fetched from JSONB parameter and build nodes
                for (const channelItem of backupStructure.channels) {
                    const checkExists = message.guild.channels.cache.find(c => c.name === channelItem.name);
                    if (!checkExists) {
                        await message.guild.channels.create({
                            name: channelItem.name,
                            type: channelItem.type,
                            position: channelItem.position
                        }).catch(() => {});
                    }
                }

                return message.reply('✅ **Structural Restoration Sequence Completed:** Available layout traces successfully mapped.');
            } catch (err) {
                return message.reply(`❌ **Restoration Processing Interrupted:** ${err.message}`);
            }
        }
    }
};

