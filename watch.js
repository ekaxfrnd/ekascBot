// const fs = require('fs')
// const util = require('util')
// const watch = util.promisify(require('fs').watchFile)
// const read = util.promisify(require('fs').readFile)

// const testWatchAndRead = async () => {
//     try {
//         await fs.watchFile('test.log', {
//             interval: 1000
//         }, (curr, prev) => {
//             // console.log(`the current mtime is: ${curr.mtime}`)
//             // console.log(`the previous mtime was: ${prev.mtime}`)

//             if(curr.mtime != prev.mtime) {
//                 fs.readFile('test.log', 'utf8', (err, data) => {
//                     console.log(data)
//                 })
//             }
//         })
//     } catch (err) {
//         console.log(err.message)
//     }
// }

// testWatchAndRead()

// const Tail = require('tail').Tail

// tail = new Tail('test.log')

// tail.on('line', data => {
//     console.log(data)
// })

// tail.watch()

// const fs = require('fs')
// let lineno = 0

// const stream = fs.createWriteStream('test.log', { flags: 'a' })

// stream.on('open', () => {
//     console.log('Stream opened, will start writing in 2 secs')
//     setInterval(() => {
//         stream.write((++lineno)+ 'oi\n')
//     })
// })

const { watch, createReadStream } = require('fs')

watch('test.log', { encoding: 'utf8'}, (eventType, filename) => {
    if(eventType == 'change') {
        createReadStream(filename)
            .on('data', data => {
                console.log(data.toString())
            })
    }
})



