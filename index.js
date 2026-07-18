const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Pulling primary clients and database hooks from previous milestones
const client = require('./bot');
const securityModule = require('./commands/security');
const backupModule = require('./commands/backup');
const utilityModule = require('./commands/utility');
const { initializeWatchers } = require('./events/antiNuke');

// ==========================================
// 📥 COMMAND METRIC CONTAINER REGISTRY
// ==========================================
// Binding local collection map indexes manually to bypass filesystem async leaks
const modulesArray = [securityModule, backupModule, utilityModule];

modulesArray.forEach(cmd => {
    client.commands.set(cmd.name, cmd);
    console.log(`📡 [Boot Link] Command module bound into execution container: <${cmd.name}`);
});

// ==========================================
// 🛡️ SECURITY EVENT INITIALIZATION LOCK
// ==========================================
// Passing live client framework references straight into the anti-nuke audit logs loop
initializeWatchers(client);

// ==========================================
// ⌨️ SUITE ROUTER: PREFIX MESSAGE INTERCEPTOR
// ==========================================
client.on('messageCreate', async (message) => {
    // Drop processing loops instantly if author profile is a bot or outside guild scope
    if (message.author.bot || !message.guild) return;

    // Check if the inbound traffic starts with the designated environment configuration prefix
    const activePrefix = client.prefix;
    if (!message.content.startsWith(activePrefix)) return;

    // Splitting execution strings cleanly via white space arrays
    const parameterSlices = message.content.slice(activePrefix.length).trim().split(/ +/);
    const invokedCommandName = parameterSlices.shift().toLowerCase();

    // Verify mapping profile matching our module parameters
    const mappedExecutionNode = client.commands.get(invokedCommandName);
    if (!mappedExecutionNode || !mappedExecutionNode.executePrefix) return;

    try {
        await mappedExecutionNode.executePrefix(message, parameterSlices);
    } catch (error) {
        console.error(`❌ [Runtime Incident] Core execution failure on prefix command <${invokedCommandName}:`, error.message);
        message.reply('🚨 **Internal Telemetry Core Alert:** An unexpected runtime anomaly blocked this transaction sequence.');
    }
});

// ==========================================
// ⚡ APP TERMINATION SAFELOCK HANDLING
// ==========================================
process.on('unhandledRejection', (reason) => {
    console.error('🚨 [Critical System Intercept] Safe-catch logged an unhandled async process rejection:', reason);
});

