import dotenv from "dotenv";

dotenv.config();

/*
=========================================
 Legacy Sentinel
 Enterprise Discord Security Suite
 Powered by Legacy Cloud
=========================================
*/

const required = [
    "TOKEN",
    "CLIENT_ID",
    "OWNER_ID",
    "DIABLO_ID",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD"
];

for (const key of required) {
    if (!process.env[key]) {
        console.error(`❌ Missing Environment Variable -> ${key}`);
        process.exit(1);
    }
}

export default {

    // ======================
    // Branding
    // ======================

    branding: {

        name: "Legacy Sentinel",

        developer: "Legacy Cloud",

        version: "1.0.0",

        footer: "🛡️ Legacy Sentinel • Enterprise Security",

        website: "",

        support: "",

        color: "#4F8CFF",

        success: "#2ECC71",

        danger: "#E74C3C",

        warning: "#F1C40F",

        info: "#3498DB"

    },

    // ======================
    // Discord
    // ======================

    discord: {

        token: process.env.TOKEN,

        clientId: process.env.CLIENT_ID,

        ownerId: process.env.OWNER_ID,

        diabloId: process.env.DIABLO_ID

    },

    // ======================
    // Database
    // ======================

    database: {

        host: process.env.DB_HOST,

        port: Number(process.env.DB_PORT),

        database: process.env.DB_NAME,

        user: process.env.DB_USER,

        password: process.env.DB_PASSWORD

    },

    // ======================
    // Dashboard
    // ======================

    dashboard: {

        port: Number(process.env.DASHBOARD_PORT || 3000),

        session: process.env.SESSION_SECRET,

        domain: process.env.DOMAIN

    },

    // ======================
    // Backup
    // ======================

    backup: {

        interval: process.env.BACKUP_INTERVAL || "12h",

        maxBackups: Number(process.env.MAX_BACKUPS || 30)

    },

    // ======================
    // Security
    // ======================

    security: {

        autoBan: process.env.AUTO_BAN === "true",

        autoRecovery: process.env.AUTO_RECOVERY === "true",

        whitelistBypass: process.env.WHITELIST_BYPASS === "true",

        nukeThreshold: Number(process.env.NUKE_THRESHOLD || 5)

    },

    // ======================
    // Logs
    // ======================

    logs: {

        level: process.env.LOG_LEVEL || "info"

    },

    // ======================
    // UI
    // ======================

    ui: {

        loading: [
            "▱▱▱▱▱",
            "▰▱▱▱▱",
            "▰▰▱▱▱",
            "▰▰▰▱▱",
            "▰▰▰▰▱",
            "▰▰▰▰▰"
        ],

        icons: {

            success: "✅",

            error: "❌",

            warning: "⚠️",

            shield: "🛡️",

            backup: "💾",

            restore: "♻️",

            server: "🌐",

            database: "🗄️",

            dashboard: "📊"

        }

    }

};
