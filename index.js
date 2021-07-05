const { Telegraf } = require('telegraf')
const { watch, createReadStream, copyFileSync } = require('fs')
require('dotenv').config()

const chokidar = require('chokidar')
const readLastLines = require('read-last-lines')
const path = require('path')

const myPath = path.join(__dirname + '../../../../var/log/snort/alert')

const watcher = chokidar.watch(myPath, {
    persistent: true,
    binaryInterval: 1000
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply(`hello Admin, type /logStart to start the IDS.`)
})

bot.command('logStart', ctx => {
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

                    const attackType = arrayReport[0].slice(20, -5).toUpperCase()
                    const attackDate =  `${month} ${Number(day)}, ${year}`
                    const attackTime = `${time} WITA`
                    const attackSource = arrayReport[2].split(' ')[1]
                    const attackProtocol = arrayReport[3].split(' ')[0]

                    console.log(lines)
                    ctx.reply(`
THERE IS AN ATTACK:
TYPE: ${attackType}
DATE: ${attackDate}
TIME: ${attackTime}
SOURCE: ${attackSource}
PROTOCOL: ${attackProtocol}
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
            .then(() => ctx.reply('log stopped.'))
    } catch (err) {
        console.log(err.message)
    }
})

bot.command('logPause', async ctx => {
    try {
        await watcher.unwatch('')
        ctx.reply('log puased.')
    } catch (err) {
        console.log(err.message)
    }
})

bot.help(ctx => {
    ctx.reply(`
/start      to start the bot
/logStart   to start the SNORT packet logger
/logStop    to stop the SNORT packet logger 
/logPause   to puase the SNORT packet logger
    `)
})

bot.launch()