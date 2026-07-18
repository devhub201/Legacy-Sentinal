const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, initializeDatabase } = require('./database');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration
    ]
});

client.commands = new Collection();
client.prefix = '<'; // Default prefix fallback

// Initialize Database Connection
initializeDatabase();

// ==========================================
// 🌐 INTEGRATED EXPRESS WEB API GATEWAY
// ==========================================
const app = express();
app.use(cors());
app.use(express.json());

// Main Auth/Guild Status endpoint for premium dashboard
app.get('/api/guilds/:id', async (req, res) => {
    try {
        const guildId = req.params.id;
        const liveGuild = client.guilds.cache.get(guildId);
        
        if (!liveGuild) {
            return res.status(404).json({ success: false, error: "Guild not indexed by bot cache." });
        }

        // Fetch local settings from PostgreSQL
        const settingsRes = await pool.query('SELECT * FROM guild_settings WHERE guild_id = $1', [guildId]);
        
        // Fetch backup statistics count
        const backupCountRes = await pool.query('SELECT COUNT(*) FROM server_backups WHERE guild_id = $1', [guildId]);
        
        // Fetch premium priority saved channels count
        const savedChannelsRes = await pool.query('SELECT COUNT(*) FROM saved_channels WHERE guild_id = $1', [guildId]);

        let settings = settingsRes.rows[0];
        if (!settings) {
            // Auto-inject missing configuration row safely
            const insertRes = await pool.query(
                `INSERT INTO guild_settings (guild_id, guild_name, owners, nuke_threshold, auto_ban, auto_recovery) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [liveGuild.id, liveGuild.name, [process.env.OWNER_ID], 5, true, true]
            );
            settings = insertRes.rows[0];
        }

        res.json({
            success: true,
            guildData: {
                id: liveGuild.id,
                name: liveGuild.name,
                icon: liveGuild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png',
                memberCount: liveGuild.memberCount,
                systemStatus: settings.system_status,
                nukeThreshold: settings.nuke_threshold,
                autoBan: settings.auto_ban,
                autoRecovery: settings.auto_recovery,
                lastBackup: settings.last_backup_time,
                totalBackups: parseInt(backupCountRes.rows[0].count),
                totalPrioritySaved: parseInt(savedChannelsRes.rows[0].count),
                whitelist: settings.whitelist || []
            }
        });
    } catch (err) {
        console.error('❌ [API Error]:', err.message);
        res.status(500).json({ success: false, error: "Internal Gateway Server Error Details: " + err.message });
    }
});

// Update configs directly from Dashboard panel adjustments
app.post('/api/guilds/:id/update', async (req, res) => {
    try {
        const guildId = req.params.id;
        const { nukeThreshold, autoBan, autoRecovery } = req.body;

        await pool.query(
            `UPDATE guild_settings 
             SET nuke_threshold = $1, auto_ban = $2, auto_recovery = $3 
             WHERE guild_id = $4`,
            [nukeThreshold, autoBan, autoRecovery, guildId]
        );

        res.json({ success: true, message: "Security configurations updated in PostgreSQL vault." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// ⏰ AUTOMATED 12-HOUR STRUCTURAL BACKUP LOOP
// ==========================================
setInterval(async () => {
    console.log('⏳ [Sentinel Engine] Executing automated global backup sync loop...');
    for (const [guildId, guild] of client.guilds.cache) {
        try {
            const fetchedChannels = await guild.channels.fetch();
            
            // Build absolute clean structure layout mapping
            const channelsPayload = fetchedChannels.map(c => ({
                id: c.id,
                name: c.name,
                type: c.type,
                position: c.position,
                parentId: c.parentId
            }));

            const fullStructure = { channels: channelsPayload };

            // Log snapshot row inside server_backups
            await pool.query(
                'INSERT INTO server_backups (guild_id, backup_type, structure) VALUES ($1, $2, $3)',
                [guildId, 'AUTOMATIC_12H', JSON.stringify(fullStructure)]
            );

            // Update timestamp trace on primary settings row
            await pool.query(
                'UPDATE guild_settings SET last_backup_time = CURRENT_TIMESTAMP WHERE guild_id = $1',
                [guildId]
            );
            
            console.log(`✅ [Automated System] Sync completed for guild structure: ${guild.name}`);
        } catch (e) {
            console.error(`❌ [Automated Loop Alert] Failed on server reference ${guildId}:`, e.message);
        }
    }
}, 12 * 60 * 60 * 1000); // 12 Hours exact delay ticking

// ==========================================
// 🚀 EVENT LIFECYCLE INITIALIZER
// ==========================================
client.once('ready', () => {
    console.log(`🚀 [Sentinel Bot Engine] Authenticated as user link ${client.user.tag}`);
    client.user.setActivity('Legacy Cloud Protections', { type: ActivityType.Competing });

    // Open Dashboard Dynamic Web API Hook Listener using Dashboard Port from .env
    const API_PORT = process.env.DASHBOARD_PORT || 3000;
    app.listen(API_PORT, () => {
        console.log(`⚡ [Dashboard Backend Router] Express API pipeline operational on allocation link: ${process.env.DOMAIN}`);
    });
});

client.login(process.env.TOKEN);

