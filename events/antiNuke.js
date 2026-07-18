const { AuditLogEvent, PermissionFlagsBits } = require('discord.js');
const { pool } = require('../database');

// Runtime volatile memory maps to compute transaction logs inside a 60-second execution window
const actionTrackerMap = new Map();

/**
 * Validates whether the explicit actor profile is authorized to execute structural updates
 */
async function assessActorPrivilege(guildId, actorId) {
    // Primary System Owner bypass check direct from environment variables
    if (actorId === process.env.OWNER_ID) return true;

    const settingsRes = await pool.query('SELECT whitelist FROM guild_settings WHERE guild_id = $1', [guildId]);
    const configRow = settingsRes.rows[0];
    
    if (configRow && configRow.whitelist) {
        return configRow.whitelist.includes(actorId);
    }
    return false;
}

/**
 * Computes individual threat levels and enforces constraints sequentially
 */
async function processActionTelemetry(guild, actionType, executorId) {
    const guildId = guild.id;

    // Bypass inspection protocols instantly if the account is trusted or whitelisted
    const isTrusted = await assessActorPrivilege(guildId, executorId);
    if (isTrusted) return;

    // Fetch live system limits threshold parameters directly from the PostgreSQL engine
    const settingsRes = await pool.query(
        'SELECT nuke_threshold, auto_ban, auto_recovery FROM guild_settings WHERE guild_id = $1',
        [guildId]
    );
    const serverLimits = settingsRes.rows[0] || { nuke_threshold: 5, auto_ban: true, auto_recovery: true };

    const trackingKey = `${guildId}-${executorId}-${actionType}`;
    const timestampNow = Date.now();

    if (!actionTrackerMap.has(trackingKey)) {
        actionTrackerMap.set(trackingKey, []);
    }

    const transactionTimeline = actionTrackerMap.get(trackingKey);
    // Clean old logging entries exceeding the 60 seconds tracking interval parameters
    const cleanTimeline = transactionTimeline.filter(timeIndex => timestampNow - timeIndex < 60000);
    cleanTimeline.push(timestampNow);
    actionTrackerMap.set(trackingKey, cleanTimeline);

    // Evaluate malicious rate window constraints
    if (cleanTimeline.length >= serverLimits.nuke_threshold) {
        console.log(`🚨 [Sentinel Threat Alert] Intrusion detection limit breached by user reference: ${executorId}`);
        
        // Execution Action 1: Terminate bad actor session instantly if auto_ban flag is set
        if (serverLimits.auto_ban) {
            const targetMember = await guild.members.fetch(executorId).catch(() => null);
            if (targetMember && targetMember.bannable) {
                await targetMember.ban({ 
                    reason: 'Legacy Sentinel Security Protocol: Destructive Rate Limit Threshold Breached.' 
                }).catch(err => console.error(`❌ [Ban Failure]: ${err.message}`));
                console.log(`🛑 [Sentinel Enforcement] Malicious profile account terminated successfully.`);
            }
        }

        // Flush volatile metrics stack tracking trace for the specific profile key after mitigation
        actionTrackerMap.delete(trackingKey);
    }
}

module.exports = {
    name: 'antiNukeInit',
    
    /**
     * Spawns core telemetry channel loops across standard operational nodes
     */
    initializeWatchers(client) {
        console.log('🛡️ [Sentinel Security] Dynamic Anti-Nuke Telemetry Listeners online.');

        // 1. MONITOR ROUTE: Channel Destruction Events
        client.on('channelDelete', async (channel) => {
            if (!channel.guild) return;
            
            try {
                const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
                const primaryLogEntry = auditLogs.entries.first();
                if (!primaryLogEntry) return;

                const { executor } = primaryLogEntry;
                if (!executor || executor.bot) return;

                await processActionTelemetry(channel.guild, 'CHANNEL_DELETE', executor.id);
            } catch (e) {
                console.error('❌ [Anti-Nuke Channel Processing Error]:', e.message);
            }
        });

        // 2. MONITOR ROUTE: Role Destruction Events
        client.on('roleDelete', async (role) => {
            if (!role.guild) return;

            try {
                const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });
                const primaryLogEntry = auditLogs.entries.first();
                if (!primaryLogEntry) return;

                const { executor } = primaryLogEntry;
                if (!executor || executor.bot) return;

                await processActionTelemetry(role.guild, 'ROLE_DELETE', executor.id);
            } catch (e) {
                console.error('❌ [Anti-Nuke Role Processing Error]:', e.message);
            }
        });
    }
};
