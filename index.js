const { Telegraf } = require('telegraf')
const util = require('util')
const watch = util.promisify(require('fs').watchFile)
const read = util.promisify(require('fs').readFile)
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('haii')
})

bot.command('monitor', async ctx => {
    try {
        // await fs.watchFile('snort.log', (curr, prev) => {
        //     if(curr.mtime != prev.mtime) {
        //         fs.readFile('snort.log', 'utf8', (err, data) => {
        //             let first = '[**]'
        //             let last = 'ECHO'
        //             let str = data
        //             let firstChar = str.search(first)
        //             let lastChar = str.search(last)
        //             const finalData = str.substring(Number(firstChar), Number(lastChar))
        //             ctx.reply(finalData)
        //         })
        //     }
        // })
        const { curr, prev } = await watch('snort.log')
        if(curr && prev) {
            console.log(`current time is: ${curr.mtime}`)
            console.log(`previous time was: ${prev.mtime}`)
        }
    } catch (err) {
        console.log(err.message)
    }
})

bot.launch()