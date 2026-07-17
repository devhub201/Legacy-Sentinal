import { randomUUID } from "uuid";

/*
=========================================
 Legacy Sentinel Helpers
 Enterprise Discord Security Suite
=========================================
*/

const Helpers = {

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    uuid() {
        return randomUUID();
    },

    timestamp() {
        return Math.floor(Date.now() / 1000);
    },

    unix() {
        return `<t:${Math.floor(Date.now() / 1000)}:F>`;
    },

    shortTime() {
        return `<t:${Math.floor(Date.now() / 1000)}:R>`;
    },

    capitalize(text = "") {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    chunk(array = [], size = 10) {

        const chunks = [];

        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }

        return chunks;

    },

    formatBytes(bytes = 0) {

        if (bytes === 0) return "0 B";

        const k = 1024;

        const sizes = ["B", "KB", "MB", "GB", "TB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;

    },

    progress(current, total, size = 20) {

        const percentage = Math.min(current / total, 1);

        const filled = Math.round(size * percentage);

        return "█".repeat(filled) + "░".repeat(size - filled);

    },

    percentage(current, total) {

        return ((current / total) * 100).toFixed(1);

    },

    random(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;

    },

    truncate(text = "", length = 100) {

        if (text.length <= length) return text;

        return text.slice(0, length - 3) + "...";

    },

    clean(text = "") {

        return text
            .replace(/`/g, "\\`")
            .replace(/@everyone/g, "@ everyone")
            .replace(/@here/g, "@ here");

    }

};

export default Helpers;.
