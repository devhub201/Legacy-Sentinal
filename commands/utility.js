const { EmbedBuilder, PermissionFlagsBits, version } = require('discord.js');
const { pool } = require('../database');

module.exports = {
    name: 'utility',
    description: 'Tracks system health diagnostics, database latency metrics, and performance arrays.',

    async executePrefix(message, args) {
        const subCommand = args[0]?.toLowerCase() || 'status';
        const guildId = message.guild.id;

        // ==========================================
        // 📊 DIAGNOSTICS: CORE SYSTEM STATUS READOUT
        // ==========================================
        if (subCommand === 'status' || subCommand === 'ping') {
            const initialStateMessage = await message.reply('⚡ *Evaluating diagnostics arrays and routing matrices...*');
            
            // Measure database engine reply latency ticking
            const startDbTimer = Date.now();
            await pool.query('SELECT NOW()');
            const calculatedDbLatency = Date.now() - startDbTimer;

            const gatewayHeartbeatPing = message.client.ws.ping;
            const executionLatency = initialStateMessage.createdAt - message.createdAt;
            
            // Memory allocation metrics parsing
            const systemMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

            const diagnosticReportEmbed = new EmbedBuilder()
                .setTitle('📊 Sentinel Core Telemetry & Node Diagnostics')
                .setColor(0x33ff33)
                .setDescription('Real-time operational parameters mapping hardware layers and live database queries.')
                .addFields(
                    { name: '📡 Discord Gateway Heartbeat', value: `\`${gatewayHeartbeatPing}ms\``, inline: true },
                    { name: '⏳ Command Loop Latency', value: `\`${executionLatency}ms\``, inline: true },
                    { name: '💾 PostgreSQL Query Response', value: `\`${calculatedDbLatency}ms\``, inline: true },
                    { name: '🧠 Active Node Process Memory', value: `\`${systemMemoryUsage.toFixed(2)} MB\``, inline: true },
                    { name: '⚙️ Runtime Library Version', value: `\`discord.js v${version}\``, inline: true }
                )
                .setTimestamp();

            return initialStateMessage.edit({ content: null, embeds: [diagnosticReportEmbed] });
        }

        // ==========================================
        // 📋 METRICS: WHITELIST & AUDIT TELEMETRY
        // ==========================================
        if (subCommand === 'audit') {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return message.reply('❌ **Error:** Operational diagnostics require structural auditing authorizations.');
            }

            try {
                const settingsQuery = await pool.query('SELECT * FROM guild_settings WHERE guild_id = $1', [guildId]);
                const guildConfig = settingsQuery.rows[0];

                if (!guildConfig) {
                    return message.reply('ℹ️ **System Alert:** Guild structure profile row has not been initialized inside the database cluster yet.');
                }

                const whitelistProfileList = guildConfig.whitelist.length > 0 
                    ? guildConfig.whitelist.map(id => `<@${id}> (\`${id}\`)`).join('\n') 
                    : '*No accounts added to anti-nuke whitelists.*';

                const configurationsReportEmbed = new EmbedBuilder()
                    .setTitle(`🛡️ Security Schema Parameters: ${message.guild.name}`)
                    .setColor(0x3399ff)
                    .addFields(
                        { name: 'Operational State', value: `\`${guildConfig.system_status}\``, inline: true },
                        { name: 'Nuke Trigger Window', value: `\`${guildConfig.nuke_threshold}\` structural executions`, inline: true },
                        { name: 'Automated Enforcement Actions', value: `Auto-Ban: \`${guildConfig.auto_ban}\` | Auto-Recovery: \`${guildConfig.auto_recovery}\``, inline: false },
                        { name: 'Trusted Account Directives (Whitelist)', value: whitelistProfileList, inline: false }
                    )
                    .setTimestamp();

                return message.reply({ embeds: [configurationsReportEmbed] });
            } catch (err) {
                return message.reply(`❌ **Audit Execution Failure:** ${err.message}`);
            }
        }
    }
};

