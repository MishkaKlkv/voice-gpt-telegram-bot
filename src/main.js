import { Telegraf, session } from 'telegraf';
import config from 'config';
import process from "nodemon";
import {message} from "telegraf/filters";
import {code} from "telegraf/format";
import { ogg } from './ogg.js';
import { removeFile } from './utils.js';
import { openai, initCommand, processTextToChat, INITIAL_SESSION } from './openai.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));
bot.use(session());
bot.command('new', initCommand);
bot.command('start', initCommand);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.on(message('voice'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION;
    try {
        await ctx.reply(code('Got it. Waiting for response from server...'));
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);
        const oggPath = await ogg.create(link.href, userId);
        const mp3Path = await ogg.toMp3(oggPath, userId);
        await removeFile(oggPath);
        const text = await openai.transcription(mp3Path);
        await ctx.reply(code(`Your query: ${text}`));
        await processTextToChat(ctx, text)

        ctx.session.messages.push({role: openai.roles.USER, content: text});
        const response = await openai.chat(ctx.session.messages);
        ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response.content});

        await ctx.reply(response.content);
    } catch (e) {
        console.error(`Error while processing voice message`, e.message);
    }
})

bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION;
    try {
        await ctx.reply(code('Got it. Waiting for response from server...'));

        ctx.session.messages.push({role: openai.roles.USER, content: ctx.message.text});
        const response = await openai.chat(ctx.session.messages);
        ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response.content});

        await ctx.reply(response.content);
    } catch (e) {
        console.error(`Error while processing voice message`, e.message);
    }
})
