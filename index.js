const { Telegraf } = require('telegraf')
const { watch, createReadStream } = require('fs')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply(`hello Admin, type /monitor to start the IDS.`)
})

bot.command('monitor', ctx => {
    watch('snort', { encoding: 'utf8'}, (eventType, filename) => {
        if(eventType == 'change') {
            createReadStream(filename)
                .on('data', data => {
                    console.log(data.toString())
                })
        }
    })
})

bot.launch()