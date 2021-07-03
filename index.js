const { Telegraf } = require('telegraf')
const { watch, createReadStream } = require('fs')
require('dotenv').config()

const chokidar = require('chokidar')
const readLastLines = require('read-last-lines')
const path = require('path')

const myPath = path.join(__dirname + '../../../../var/log/snort/alert')

const watcher = chokidar.watch(myPath, {
    persistent: true,
    binaryInterval: 1000
})

const log = console.log.bind(console)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply(`hello Admin, type /monitor to start the IDS.`)
})

bot.command('monitor', ctx => {
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

                    const attackType = arrayReport[0].slice(20, -5).toUpperCase()
                    const attackDay =  `${month} ${day} ${year}`

                    console.log(lines)
                    ctx.reply(`
THERE IS AN ATTACK:
TYPE: ${attackType}
DATE/TIME: ${attackDay}
                    `)
                }) 
        } catch (err) {
            console.log(err.message)
        }
    })
})

bot.launch()