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
                let first = '[**]'
                let last = 'ECHO'
                let str = data
                let firstChar = str.search(first)
                let lastChar = str.search(last)
                const finalData = str.slice(Number(firstChar))
                ctx.reply(finalData)
            })
        }
    })
})

bot.launch()