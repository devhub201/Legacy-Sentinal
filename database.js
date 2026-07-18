const { Pool } = require('pg');

// Create a connection pool picking parameters directly from the configured .env
const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'legacy_sentinel',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
});

// Initialize database schemas and verify structures sequentially
async function initializeDatabase() {
    try {
        console.log('📁 [Sentinel DB] Syncing PostgreSQL Relational Architecture...');
        
        // 1. Core Guild Security Settings Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS guild_settings (
                guild_id VARCHAR(30) PRIMARY KEY,
                guild_name TEXT NOT NULL,
                owners TEXT[] DEFAULT '{}',
                whitelist TEXT[] DEFAULT '{}',
                system_status VARCHAR(30) DEFAULT 'OPERATIONAL',
                nuke_threshold INT DEFAULT 5,
                auto_ban BOOLEAN DEFAULT TRUE,
                auto_recovery BOOLEAN DEFAULT TRUE,
                last_backup_time TIMESTAMP DEFAULT NULL
            );
        `);

        // 2. High-Priority Channels Snapshot (/save data vault)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS saved_channels (
                id SERIAL PRIMARY KEY,
                guild_id VARCHAR(30) REFERENCES guild_settings(guild_id) ON DELETE CASCADE,
                channel_id VARCHAR(30) NOT NULL,
                channel_name TEXT NOT NULL,
                channel_type INT NOT NULL,
                position INT NOT NULL,
                permissions JSONB DEFAULT '[]',
                messages JSONB DEFAULT '[]',
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Complete Global Backup Snapshots Log Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS server_backups (
                backup_id SERIAL PRIMARY KEY,
                guild_id VARCHAR(30) REFERENCES guild_settings(guild_id) ON DELETE CASCADE,
                backup_type VARCHAR(30) NOT NULL, -- 'AUTOMATIC_12H' or 'MANUAL'
                structure JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ [Sentinel DB] All production tables and JSONB data channels are operational.');
    } catch (err) {
        console.error('❌ [Sentinel DB] Critical Schema Initialization Error:', err.message);
    }
}

module.exports = {
    pool,
    initializeDatabase
};

