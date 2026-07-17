import chalk from "chalk";

const timestamp = () => {
    return new Date().toLocaleString("en-IN", {
        hour12: true
    });
};

const log = {

    info(message) {
        console.log(
            `${chalk.blue("[INFO]")} ${chalk.gray(timestamp())} ${chalk.white(message)}`
        );
    },

    success(message) {
        console.log(
            `${chalk.green("[SUCCESS]")} ${chalk.gray(timestamp())} ${chalk.green(message)}`
        );
    },

    warning(message) {
        console.log(
            `${chalk.yellow("[WARNING]")} ${chalk.gray(timestamp())} ${chalk.yellow(message)}`
        );
    },

    error(message) {
        console.log(
            `${chalk.red("[ERROR]")} ${chalk.gray(timestamp())} ${chalk.red(message)}`
        );
    },

    security(message) {
        console.log(
            `${chalk.magenta("[SECURITY]")} ${chalk.gray(timestamp())} ${chalk.magenta(message)}`
        );
    },

    backup(message) {
        console.log(
            `${chalk.cyan("[BACKUP]")} ${chalk.gray(timestamp())} ${chalk.cyan(message)}`
        );
    },

    restore(message) {
        console.log(
            `${chalk.greenBright("[RESTORE]")} ${chalk.gray(timestamp())} ${chalk.greenBright(message)}`
        );
    },

    dashboard(message) {
        console.log(
            `${chalk.hex("#4F8CFF")("[DASHBOARD]")} ${chalk.gray(timestamp())} ${chalk.hex("#4F8CFF")(message)}`
        );
    },

    antinuke(message) {
        console.log(
            `${chalk.hex("#ff3b30")("[ANTI-NUKE]")} ${chalk.gray(timestamp())} ${chalk.hex("#ff3b30")(message)}`
        );
    }

};

export default log;
