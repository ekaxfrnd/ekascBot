const { Telegraf } = require('telegraf')
const { watch, createReadStream } = require('fs')
require('dotenv').config()

const chokidar = require('chokidar')
const readLastLines = require('read-last-lines')
const path = require('path')

const myPath = path.join(__dirname + '../../../../var/log/snort/alert')
console.log(myPath)

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
            await readLastLines.read(path, 5)
                .then(lines => console.log(lines))
        } catch (err) {
            console.log(err.message)
        }
    })
})

bot.launch()