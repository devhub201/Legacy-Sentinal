const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// Mapped JSON payloads of application slash commands matching current schemas
const commands = [
    new SlashCommandBuilder()
        .setName('security')
        .setDescription('Manages core anti-nuke parameters and whitelist states.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('scanner')
                .setDescription('Runs a structural vulnerability audit inside the current guild vector.')
        )
].map(command => command.toJSON());

// Initialize REST manager with explicit application credentials
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`⏳ [Gateway Deployer] Refreshing ${commands.length} application slash command JSON parameters...`);

        // Forcefully push structural application layouts onto the global Discord application routing array
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log(`✅ [Gateway Deployer] Successfully registered ${data.length} operational global slash commands.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ [Gateway Deployer] Critical payload registration failure:', error);
        process.exit(1);
    }
})();
