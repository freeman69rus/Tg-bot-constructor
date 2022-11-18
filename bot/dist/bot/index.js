"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const telegraf_1 = require("telegraf");
let bot;
const createBotHears = (branch) => {
    bot.hears(branch.input, createBotHearsMiddleware(branch.response));
};
const createBotHearsMiddleware = (response) => {
    const replyArgs = [response.message, makeKeyboard(response)];
    let next;
    if (response.next)
        next = createBotHearsMiddleware(response.next);
    return (ctx) => {
        ctx.reply(...replyArgs);
        if (next)
            next(ctx);
    };
};
const createBotActions = (branchs) => {
    const buttons = [];
    for (let branch of branchs) {
        const input = branch.input;
        const res = branch.response;
        const callbackId = (Math.random() + 1).toString(36).substring(2);
        buttons.push(telegraf_1.Markup.button.callback(input, callbackId));
        const replyArgs = [res.message, makeKeyboard(branch.response)];
        bot.action(callbackId, ctx => ctx.reply(...replyArgs));
    }
    return telegraf_1.Markup.inlineKeyboard(buttons);
};
const makeKeyboard = (response) => {
    let result;
    if (response.inlineButtons) {
        result = createBotActions(response.inlineButtons);
    }
    else if (response.buttons) {
        result = telegraf_1.Markup.keyboard(response.buttons.map(btn => btn.input));
        for (let branch of response.buttons) {
            bot.hears(branch.input, createBotHearsMiddleware(branch.response));
        }
    }
    return result;
};
const handleProcessMessage = (data) => {
    if (!data.token || !data.branch)
        return;
    if (bot)
        bot.stop('restart');
    bot = new telegraf_1.Telegraf(data.token);
    createBotHears(data.branch);
    bot.launch();
};
process_1.default.on('message', (event) => handleProcessMessage(event.data));
