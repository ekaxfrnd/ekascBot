const { Telegraf } = require('telegraf')
const { watch, createReadStream, copyFileSync } = require('fs')
require('dotenv').config()

const chokidar = require('chokidar')
const readLastLines = require('read-last-lines')
const path = require('path')

// const myPath = path.join(__dirname + '../../../../var/log/snort/alert')

const watcher = chokidar.watch(myPath, {
    persistent: true
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply(`hello there, type /help to see more commands.`)
})

bot.command('logStart', ctx => {
    watcher.on('ready', () => ctx.reply('log started.'))
    watcher.on('change', async path => {
        try {
            await readLastLines.read(path, 6)
                .then(lines => {
                    const arrayReport = lines.split(/\r?\n/)

                    const arrayMonth = [
                        'January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August',
                        'September','October', 'November', 'December' 
                    ]

                    const month = arrayMonth[Number(arrayReport[2].split(' ')[0].split('/')[0]) - 1]
                    const day = arrayReport[2].split('/')[1].split('-')[0]
                    const year = new Date().getFullYear()
                    const time = arrayReport[2].split('/')[1].split('-')[1].slice(0, 8)

                    const attackMessage = arrayReport[0].slice(19, -5).toUpperCase()
                    const attackDate =  `${month} ${Number(day)}, ${year}`
                    const attackTime = `${time} WITA`
                    const attackSource = arrayReport[2].split(' ')[1]
                    const attackProtocol = arrayReport[3].split(' ')[0]
                    const attackClassType = arrayReport[1].slice(17, -15)

                    console.log(lines)
                    ctx.reply(`
THERE IS AN ATTACK:
MESSAGE: ${attackMessage}
DATE: ${attackDate}
TIME: ${attackTime}
SOURCE: ${attackSource}
PROTOCOL: ${attackProtocol}
CLASSTYPE: ${attackClassType}
                    `)
                }) 
        } catch (err) {
            console.log(err.message)
        }
    })
})

bot.command('logStop', async ctx => {
    try {
        await watcher.close()
            .then(() => ctx.reply(`log stopped.`))
        // await watcher.unwatch(myPath)
        // ctx.reply('log stopped.')
    } catch (err) {
        console.log(err.message)
    }
})

bot.help(ctx => {
    ctx.reply(`
I can help you monitor snort logs from telegram.
You can control me by sending these commands:

# General
/start          start the bot
/help           show this help

# Snort
/logStart       start the SNORT packet logger
/logStop        stop the SNORT packet logger
    `)
})

bot.launch()
