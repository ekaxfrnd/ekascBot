const { Telegraf } = require('telegraf')
require('dotenv').config()
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('haii')
})

bot.command('monitor', ctx => {
    fs.watchFile('snort.log', (curr, prev) => {
        console.log(`the current mtime is: ${curr.mtime}`)
        console.log(`the previous mtime was: ${prev.mtime}`)
    })
})

bot.launch()