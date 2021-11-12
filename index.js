const { Telegraf } = require('telegraf')
const { watch, createReadStream, copyFileSync } = require('fs')
require('dotenv').config()

const chokidar = require('chokidar')
const readLastLines = require('read-last-lines')
const path = require('path')

const myPath = path.join(__dirname + '../../../../var/log/snort/alert')

const watcher = chokidar.watch(myPath, {
    persistent: true
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply(`hello there, type /help to see more commands.`)
})

bot.command('log', ctx => {
    watcher.on('ready', () => ctx.reply('log started.'))
    watcher.on('change', async path => {
        try {
            const lines = await readLastLines.read(path, 1)
            const arrMonth = [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September','October', 'November', 'December'
            ]
	    
            const month = arrMonth[Number(lines.split('/')[0]) - 1]
            const day = lines.split('/')[1].slice(0, 2)
            const year = new Date().getFullYear()
            const time = lines.split('-')[1].slice(0,8)
        
            const attMessage = lines.split('[')[2].slice(13)
	    const attSource = lines.split('}')[1].split('->')[0].slice(1)
            const attClassType = lines.split(':')[5].slice(1, -11)

                console.log(lines)
                ctx.reply(`
there is an attack:
messsage: ${attMessage.toUpper()}
date: ${day} ${month}, ${year}
time: ${time} WITA
source: ${attSource}
classtype: ${attClassType}
                    `)
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
/log       start the SNORT NIDS mode
    `)
})

bot.launch()
