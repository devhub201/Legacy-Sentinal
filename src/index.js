import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import chalk from "chalk";
import config from "./config.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ],

    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User
    ]
});

client.commands = new Collection();

client.cooldowns = new Collection();

client.config = config;

global.client = client;

/*
===========================================
 Legacy Sentinel
 Enterprise Discord Security Suite
 Powered By Legacy Cloud
===========================================
*/

console.clear();

console.log(
chalk.blue(`
╔════════════════════════════════════════════╗
║                                            ║
║           LEGACY SENTINEL                  ║
║    Enterprise Discord Security Suite       ║
║                                            ║
╚════════════════════════════════════════════╝
`)
);

console.log(chalk.green("✔ Configuration Loaded"));
console.log(chalk.green("✔ Client Created"));
console.log(chalk.yellow("⏳ Connecting to Discord..."));

client.once("ready", async () => {

    console.clear();

    console.log(chalk.green(`
==========================================
 Legacy Sentinel Started Successfully
==========================================

Bot        : ${client.user.tag}
Servers    : ${client.guilds.cache.size}
Users      : ${client.users.cache.size}
Developer  : Legacy Cloud
Version    : ${config.branding.version}

Status     : ONLINE
==========================================
`));

});

client.on("error", console.error);

process.on("unhandledRejection", console.error);

process.on("uncaughtException", console.error);

process.on("SIGINT", async () => {

    console.log(chalk.red("\nStopping Legacy Sentinel..."));

    client.destroy();

    process.exit(0);

});

client.login(config.discord.token);
