const { Telegraf } = require('telegraf')
require('dotenv').config()
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('haii')
})

bot.command('monitor', ctx => {
    fs.watchFile('snort.log', (curr, prev) => {
        if(curr.mtime != prev.mtime) {
            fs.readFile('snort.log', 'utf8', (err, data) => {
                console.log(data)
            })
        }
    })
})

bot.launch()