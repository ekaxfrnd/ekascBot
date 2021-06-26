const { Telegraf } = require('telegraf')
const fs = require('fs')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('haii')
})

bot.command('monitor', async ctx => {
    try {
        await fs.watchFile('snort.log', {
            bigint: false,
            persistent: true,
            interval: 1000
        }, (curr, prev) => {
            if(curr.mtime != prev.mtime) {
                setInterval(() => {
                    fs.readFile('snort.log', 'utf8', (err, data) => {
                        let first = '[**]'
                        let last = 'ECHO'
                        let str = data
                        let firstChar = str.search(first)
                        let lastChar = str.search(last)
                        const finalData = str.substring(Number(firstChar), Number(lastChar))
                        ctx.reply(finalData)
                    })
                }, 1000)
            }
        })
    } catch (err) {
        console.log(err.message)
    }
})

bot.launch()