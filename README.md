This bot allows to use voice or text messages in Telegram and get response from ChatGPT.

how to run:

1. git clone https://github.com/MishkaKlkv/voice-gpt-telegram-bot
2. npm i
3. Register your new bot in @BotFather and get token of this new bot
4. Create default.json and production.json files in config folder like this:
    ```
    {
        "TELEGRAM_TOKEN": "",
        "OPENAI_KEY": ""
    }
    ```
    Insert your bot token and OPENAI_KEY
5. Start application for development:  ```npm run dev ```
6. To start it in docker do  ```make build ``` and then  ```make run ```
