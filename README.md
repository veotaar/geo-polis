# 🎯 GeoPolis - GeoGuessr Account Status Checker

A Discord bot that monitors GeoGuessr accounts for ban status and alerts your server when accounts get banned.

## ✨ Features

- 🔍 Check if GeoGuessr profiles are banned via Discord commands
- 📊 Periodic monitoring of unbanned accounts
- 🚨 Automatic Discord alerts when accounts get banned
- 📈 Web dashboard for monitoring background jobs
- 🔐 Authentication protected routes

## 🛠️ Tech Stack

- **Runtime**: Bun ⚡
- **Web Framework**: Hono 🔥
- **Database**: SQLite + drizzle-orm 🗄️
- **Queue/Cache**: Redis 🔴
- **Background Jobs**: BullMQ 🐂
- **Discord API**: Discord.js 🤖
- **Validation**: Zod ✅
- **Job Dashboard**: bull-board 📊
- **Authentication**: better-auth 🔐
- **Containerization**: Docker 🐳

## 🚀 Setup

You need to create a discord bot and invite it to your server, after that:

### Using Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/veotaar/geo-polis.git
   cd geo-polis
   ```

2. **Configure environment variables**

    Edit .env with your Discord app token and other settings
   ```bash
   cp .env.example .env
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

### Manual Setup

1. **Prerequisites**
   - Bun runtime
   - Local Redis server

2. **Clone the repository**
   ```bash
   git clone https://github.com/veotaar/geo-polis.git
   cd geo-polis
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Configure environment variables**

    Edit .env with your Discord app token and other settings
   ```bash
   cp .env.example .env
   ```

5. **Register discord commands**

    ```bash
    bun discord:push
    ```

6. **Run database migrations**
   ```bash
    bun db:push
   ```

7. **Start the application**
   ```bash
   bun dev
   ```

## 📝 Usage

### Discord Commands
- Add account to monitoring (returns  info about account): `/kontrol <geoguessr profile link>`

### Web UI
- `http://localhost:3000/list` to view added accounts
- `http://localhost:3000/bullboard` to view bull-board dashboard
- `http://localhost:3000/signup`
- `http://localhost:3000/login`


