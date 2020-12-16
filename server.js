const net = require('net')
const spawn = require('child_process').spawn
const fs = require('fs')

const PATH = 'A:\\Python\\openCV\\astSolver\\resolve.py'
let SIZE_OF_DATA = 0
let SIZE_OF_DATA_CURRENT = 0
let CHUNK_OF_DATA = []
let RESULT = null

const connection = (socket) => {
  console.log('Присоединение')
  socket.on('data', (data) => {
    dataReduce(data) //Как теперь нам сделать socket.write() внтури этой функции, когда у нас отрабатывает возврат значения из консоли, забиндить контекст socketa
    //тогда переписать с стрелочных на анонимные
  })

  socket.on('error', () => {
    console.log('Error client')
  })

  socket.on('close', () => {
    SIZE_OF_DATA = 0
    SIZE_OF_DATA_CURRENT = 0
    CHUNK_OF_DATA = []
  })
}

const server = net.createServer()
server.on('connection', connection)

server.on('error', () => {
  console.log('Error')
})
server.listen(3000, 'localhost', () => {
  console.log('Server is running')
})

const sizeParse = (data) => {
  let str = ''
  let index = 0
  data.find((v, i) => {
    let char = String.fromCharCode(v)
    if (char === ':') {
      index = i
      return true
    }
    str += char
    return false
  })
  return str
}
const chunkData = (data) => {
  SIZE_OF_DATA_CURRENT += data.length
  logger(data)
  progress_bar()
  CHUNK_OF_DATA.push(data)
  if (SIZE_OF_DATA_CURRENT === SIZE_OF_DATA) {
    // console.clear();
    console.log('COMPLETE')

    produce(concatData(CHUNK_OF_DATA))
  }
}
const concatData = (data_arr) => {
  return Buffer.concat(data_arr)
}
const dataReduce = (data) => {
  let cmd = data.slice(0, 4).toString()
  if (cmd === 'size') {
    SIZE_OF_DATA = +sizeParse(data.slice(5, data.length))
    console.log('START')
    console.log('START SIZE OF DATA -> ' + SIZE_OF_DATA)
    // chunkData(data.slice(5 + offset, data.length));
  } else chunkData(data)
}
const produce = (data) => {
  fs.writeFile('data.json', data, 'utf-8', () => {
    const pyProcess = spawn('python', [PATH])
    pyProcess.stdout.pipe(process.stdout)
    pyProcess.stderr.pipe(process.stderr)
    pyProcess.stdout.on('data', (data) => {
      RESULT = data.toString('utf8')
    })
  })
}
const progress_bar = () => {
  let out = '',
    part = '-',
    part_count = 20,
    current_percent = (SIZE_OF_DATA_CURRENT * 100) / SIZE_OF_DATA,
    current_part_count = Math.ceil((part_count * current_percent) / 100)

  for (let k = 0; k < current_part_count; k++) {
    out += part
  }

  console.log('RECEIVING DATA')
  console.log(out + ' ' + current_percent.toFixed(1) + '%')
}
const logger = (data) => {
  console.clear()
  console.log('CHUNK -> ' + data.length)
  console.log('SIZE_OF_DATA_CURRENT -> ' + SIZE_OF_DATA_CURRENT)
}
