# Project Overview

This project is a Telegram bot built with Node.js and TypeScript. It serves as a portfolio and skills showcase for a developer, and also includes a feature to check the USD to RUB exchange rate using the CoinGecko API.

## Main Technologies

*   **Backend:** Node.js, TypeScript
*   **Telegram Bot:** `node-telegram-bot-api`
*   **API Interaction:** `axios` for making requests to the CoinGecko API
*   **Environment Variables:** `dotenv` for managing configuration

## Architecture

The project is structured into a `src` directory containing the main application logic.

*   `src/index.ts`: The main entry point of the application. It initializes the Telegram bot, sets up command and message handlers, and orchestrates the bot's responses.
*   `src/core/text.ts`: This file stores the text content for the bot's "Portfolio" and "Skills" sections. This separation of content from logic makes it easier to update the bot's responses.
*   `src/core/currencyService.ts`: This module is responsible for all interactions with the CoinGecko API. It includes functions for checking API status, fetching historical data, and getting the latest exchange rates.

# Building and Running

## Prerequisites

*   Node.js and npm installed
*   A Telegram bot token
*   A CoinGecko API key (optional, but recommended)

## Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Telegram bot token and optional CoinGecko API key:
    ```
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token
    COINGECKO_API_KEY=your_coingecko_api_key
    ```

## Running the Bot

*   **Development:**
    ```bash
    npm run dev
    ```
    This will run the bot using `nodemon`, which will automatically restart the server on file changes.

*   **Production:**
    1.  Build the TypeScript code:
        ```bash
        npm run build
        ```
    2.  Start the bot:
        ```bash
        npm run start
        ```

# Development Conventions

*   **Language:** The project is written in TypeScript, so all new code should also be in TypeScript.
*   **Code Style:** The existing code follows a consistent style. Please maintain this style in any new contributions.
*   **Modularity:** The code is organized into modules with specific responsibilities. This should be continued to keep the codebase clean and maintainable.
