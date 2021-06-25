const { Telegraf } = require('telegraf')
require('dotenv').config()
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('haii')
})

bot.command('monitor', async ctx => {
    try {
        await fs.watchFile('snort.log', (curr, prev) => {
            if(curr.mtime != prev.mtime) {
                fs.readFile('snort.log', 'utf8', (err, data) => {
                    let first = '[**]'
                    let last = 'ECHO'
                    let str = data
                    let firstChar = str.search(first)
                    let lastChar = str.search(last)
                    const finalData = str.substring(Number(firstChar), Number(lastChar))
                    ctx.reply(finalData)
                })
            }
        })
    } catch (err) {
        console.log(err.message)
    }
})

bot.launch()