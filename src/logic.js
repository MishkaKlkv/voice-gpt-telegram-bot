import bot from "nodemon";
import {message} from "telegraf/filters";
import {INITIAL_SESSION, processTextToChat} from "./openai.js";
import {code} from "telegraf/format";

bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('Got it. Waiting for response from server...'))
        await processTextToChat(ctx, ctx.message.text)
    } catch (e) {
        console.log(`Error while voice message`, e.message)
    }
})
