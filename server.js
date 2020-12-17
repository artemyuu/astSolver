const net = require("net");
const spawn = require("child_process").spawn;
const fs = require("fs");

// const PATH = "A:\\Python\\openCV\\astSolver\\resolve.py";
const PATH = "./resolve.py";
const SOCKETS = new Map();
const server = net.createServer();

const connection = (socket) => {
  console.log(`Client ${get_address(socket)} opened conection`);
  SOCKETS.set(get_address(socket), {
    socket,
    data: {
      SIZE_OF_DATA: 0,
      SIZE_OF_DATA_CURRENT: 0,
      CHUNKS_OF_DATA: [],
      RESULT: null,
    },
  });
  socket.on("data", (data) => {
    data_reduce(SOCKETS.get(get_address(socket)), data); //Как теперь нам сделать socket.write() внтури этой функции, когда у нас отрабатывает возврат значения из консоли, забиндить контекст socketa
    //тогда переписать с стрелочных на анонимные
  });

  socket.on("error", () => {
    console.log(`Error on client ${get_address(socket)}`);
  });

  socket.on("close", () => {
    console.log(`Client ${get_address(socket)} closed conection`);
    SOCKETS.delete(get_address(socket));
  });
};

server.on("connection", connection);
server.on("error", () => {
  console.log("Error on server");
});

server.listen(33333, () => {
  console.log("Server is running");
});

const get_address = socket => {
  return `${socket.remoteAddress}:${socket.remotePort}`;
}

const size_parse = (data) => {
  let str = "";
  let index = 0;
  data.find((v, i) => {
    let char = String.fromCharCode(v);
    if (char === ":") {
      index = i;
      return true;
    }
    str += char;
    return false;
  });
  return [+str, index];
};

const chunk_data = (socket_obj, bytes) => {
  const { data } = socket_obj;
  data.SIZE_OF_DATA_CURRENT += bytes.length;
  logger(data, bytes);
  progress_bar(data);
  data.CHUNKS_OF_DATA.push(bytes);
  if (data.SIZE_OF_DATA_CURRENT === data.SIZE_OF_DATA) {
    console.log("COMPLETE");
    produce(socket_obj, concat_data(data.CHUNKS_OF_DATA));
  }
};

const concat_data = (data_arr) => {
  return Buffer.concat(data_arr);
};

const data_reduce = (socket_obj, bytes) => {
  const { data } = socket_obj;
  let cmd = bytes.slice(0, 4).toString();

  switch (cmd) {
    case 'size':
      const arr = size_parse(bytes.slice(5, bytes.length));
      const offset_bytes = arr[1];
      data.SIZE_OF_DATA = arr[0];
      // console.log('START');
      // console.log('START SIZE OF DATA', data.SIZE_OF_DATA);
      const bytes_after = bytes.slice(6 + offset_bytes);
      if (bytes_after.length > 0) chunk_data(socket_obj, bytes_after);
      break;
    default:
      chunk_data(socket_obj, bytes);
  }
};

const produce = (socket_obj, bytes) => {
  const { socket, data } = socket_obj;
  fs.writeFile("data.json", bytes, "utf-8", () => {
    clear_data(socket_obj);
    const pyProcess = spawn("python", [PATH]);
    pyProcess.stdout.pipe(process.stdout);
    pyProcess.stderr.pipe(process.stderr);
    pyProcess.stdout.on("data", (bytes_from) => {
      data.RESULT = bytes_from;
      socket.write(bytes_from);
      console.clear();
    });
  });
};

const clear_data = (socket_obj) => {
  const { data } = socket_obj;
  data.SIZE_OF_DATA = 0;
  data.SIZE_OF_DATA_CURRENT = 0;
  data.CHUNKS_OF_DATA = [];
  // data.RESULT = null;
};

const progress_bar = (data) => {
  let out = "",
    part = "-",
    part_count = 20,
    current_percent = (data.SIZE_OF_DATA_CURRENT * 100) / data.SIZE_OF_DATA,
    current_part_count = Math.ceil((part_count * current_percent) / 100);
  for (let k = 0; k < current_part_count; k++) {
    out += part;
  }
  console.log("RECEIVING DATA");
  console.log(out + " " + current_percent.toFixed(1) + "%");
};

const logger = (data, bytes) => {
  console.clear();
  // console.log("CHUNK -> " + bytes.length);
  // console.log("SIZE_OF_DATA_CURRENT -> " + data.SIZE_OF_DATA_CURRENT);
};
