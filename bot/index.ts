import mainProcess from 'process'
import {Context, Markup, Telegraf} from 'telegraf'
import {InlineKeyboardMarkup, ReplyKeyboardMarkup, Update} from "typegram"
import {BotSchema, IPM2Packet} from "../types"
import IBranch = BotSchema.IBranch

let bot

type KeyboardsType = Markup.Markup<ReplyKeyboardMarkup> | Markup.Markup<InlineKeyboardMarkup>
type ReplyArgsType = [ string, KeyboardsType ]

const createBotHears = (branch: BotSchema.IBranch) => {
    bot.hears(branch.input, createBotHearsMiddleware(branch.response))
}

const createBotHearsMiddleware = (response: BotSchema.IResponse) => {
    const replyArgs = [response.message, makeKeyboard(response) as KeyboardsType]
    let next: (ctx: Context<Update>) => void
    if (response.next) next = createBotHearsMiddleware(response.next)
    return (ctx: Context<Update>) => {
        ctx.reply(...replyArgs as ReplyArgsType)
        if (next) next(ctx)
    }
}

const createBotActions = (branchs: IBranch[]): Markup.Markup<InlineKeyboardMarkup> => {
    const buttons = []
    for (let branch of branchs) {
        const input = branch.input
        const res = branch.response
        const callbackId = (Math.random() + 1).toString(36).substring(2)

        buttons.push(Markup.button.callback(input, callbackId))

        const replyArgs = [res.message, makeKeyboard(branch.response) as KeyboardsType]
        bot.action(callbackId, ctx => ctx.reply(...replyArgs as ReplyArgsType))
    }

    return Markup.inlineKeyboard(buttons)
}

const makeKeyboard = (response: BotSchema.IResponse): KeyboardsType | void => {
    let result
    if (response.inlineButtons) {
        result = createBotActions(response.inlineButtons)
    } else if (response.buttons) {
        result = Markup.keyboard(response.buttons.map(btn => btn.input))
        for (let branch of response.buttons) {
            bot.hears(branch.input, createBotHearsMiddleware(branch.response))
        }
    }

    return result
}

const handleProcessMessage = (data) => {
    if (!data.token || !data.branch) return
    if (bot) bot.stop('restart')
    bot = new Telegraf(data.token)
    createBotHears(data.branch)
    bot.launch()
}

mainProcess.on('message', (event: { data: IPM2Packet }) => handleProcessMessage(event.data))
