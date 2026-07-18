# 🛡️ Legacy Sentinel — Enterprise Anti-Nuke Engine
<p align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop" alt="Cyberpunk Banner" width="100%" style="border-radius: 12px; max-height: 240px; object-fit: cover;" />
</p>
<p align="center">
  <img src="https://img.shields.io/github/stars/devhub201/Legacy-Sentinal?style=flat-square&color=7289da" alt="Stars" />
  <img src="https://img.shields.io/github/forks/devhub201/Legacy-Sentinal?style=flat-square&color=43b581" alt="Forks" />
  <img src="https://img.shields.io/badge/PostgreSQL-Active-4169E1?style=flat-square" alt="Database" />
</p>
---
## 📝 Project Overview
**Legacy Sentinel** ek high-performance aur real-time Discord protection engine hai. Yeh system malicious administrators aur token leaks se hone wale mass role/channel destructions ko instantly trace karta hai aur malicious actors ko immediate lock out (auto-ban) kar deta hai. 
Isme ek highly responsive embedded **Glassmorphic Web Dashboard Interface** diya gaya hai jo live state parameters aur PostgreSQL telemetry monitoring pipelines ko tracking panel par update karta hai.
---
## 📊 Premium Analytics Hub Preview
<p align="center">
  <img src="https://docs.statbot.net/img/docs/guide/5-dashboard/dashboard-message-example.png" alt="Integrated Web Dashboard Interface" width="100%" style="border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);" />
</p>
---
## 🛠️ System Command Matrix

| Command | Mode | Target / Args | Core System Operation |
| :--- | :--- | :--- | :--- |
| `/security scanner` | Slash | None | Server vulnerabilities aur risky permissions audit report generate karta hai. |
| `<security whitelist add` | Prefix | `@User` | Selected user profiles ko anti-nuke protection exceptions list me daalta hai. |
| `<security whitelist remove` | Prefix | `@User` | Whitelist settings database row records se user ko delete karta hai. |
| `<security lockdown enable` | Prefix | None | Full channel routes lock karke configuration emergency read-only mode par dalta hai. |
| `<security lockdown disable` | Prefix | None | Emergency server lockdowns configurations instantly remove aur revert karta hai. |
| `<backup save` | Prefix | `#Channel` | Text channels configuration settings aur message cache metadata save karta hai. |
| `<backup restore` | Prefix | None | Database snapshots fetch karke server structure instantly recreate karta hai. |
| `<utility status` | Prefix | None | Node cluster RAM usage limits, connection delay, aur active stats data fetch karta hai. |

---
## ⚙️ Quick Installation Registry
# Repository Clone & Module Setup
git clone https://github.com/devhub201/Legacy-Sentinal.git
cd Legacy-Sentinal && npm install
### 1. Environment Configuration (.env)
TOKEN = YOUR_BOT_TOKEN
CLIENT_ID = YOUR_APPLICATION_ID
OWNER_ID = YOUR_DISCORD_ACCOUNT_ID
DATABASE_URL = postgresql://postgres:password@127.0.0.1:5432/legacy_sentinel
PORT = 3000
### 2. Database Schema Setup
CREATE DATABASE legacy_sentinel;
CREATE TABLE guild_settings (guild_id VARCHAR(30) PRIMARY KEY, nuke_threshold INT DEFAULT 5, auto_ban BOOLEAN DEFAULT TRUE, whitelist TEXT[]);
CREATE TABLE saved_channels (guild_id VARCHAR(30), channel_id VARCHAR(30), permissions JSONB, messages JSONB);
### 3. Execution Loops
npm run deploy
npm start
---
## 📂 Project Directory Structure
Legacy-Sentinal/
├── commands/           # Command layout drivers (security.js, backup.js, utility.js)
├── events/             # Real-time event monitor engine (antiNuke.js)
├── dashboard/          # Glassmorphic web console interface modules (index.html, dashboard.js)
├── database.js         # Connection pooling query layer
└── index.js            # Master orchestrator startup script
---
## 📜 System Terms & License
Distributed under the **MIT Open Source Protocol**. Feel free to deploy pull request instances or log bug reports on the active tracking matrix.
