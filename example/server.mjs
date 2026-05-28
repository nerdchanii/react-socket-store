import { createHash } from "node:crypto";
import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 3000);
const clients = new Set();

function acceptKey(key) {
  return createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");
}

function readFrame(buffer) {
  const opcode = buffer[0] & 0x0f;
  let length = buffer[1] & 0x7f;
  let offset = 2;

  if (length === 126) {
    length = buffer.readUInt16BE(offset);
    offset += 2;
  }

  const mask = buffer.subarray(offset, offset + 4);
  offset += 4;

  const payload = buffer.subarray(offset, offset + length);
  const unmasked = Buffer.alloc(payload.length);

  for (let index = 0; index < payload.length; index += 1) {
    unmasked[index] = payload[index] ^ mask[index % 4];
  }

  return { opcode, text: unmasked.toString("utf8") };
}

function writeFrame(socket, text) {
  const payload = Buffer.from(text);
  const header =
    payload.length < 126
      ? Buffer.from([0x81, payload.length])
      : Buffer.from([0x81, 126, payload.length >> 8, payload.length & 0xff]);

  socket.write(Buffer.concat([header, payload]));
}

function writeClose(socket) {
  socket.write(Buffer.from([0x88, 0x00]));
}

function isTopicMessage(text) {
  try {
    const message = JSON.parse(text);

    return (
      message !== null &&
      typeof message === "object" &&
      typeof message.key === "string" &&
      Object.hasOwn(message, "data")
    );
  } catch {
    return false;
  }
}

const server = createServer();

server.on("upgrade", (request, socket) => {
  const key = request.headers["sec-websocket-key"];

  if (typeof key !== "string") {
    socket.destroy();
    return;
  }

  socket.write(
    [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${acceptKey(key)}`,
      "",
      "",
    ].join("\r\n")
  );

  clients.add(socket);

  socket.on("data", (buffer) => {
    const { opcode, text } = readFrame(buffer);

    if (opcode === 8) {
      writeClose(socket);
      socket.end();
      return;
    }

    if (opcode === 1 && isTopicMessage(text)) {
      writeFrame(socket, text);
    }
  });

  socket.on("close", () => clients.delete(socket));
});

server.listen(port, () => {
  console.log(
    `react-socket-store example WebSocket server: ws://localhost:${port}`
  );
});

process.on("SIGINT", () => {
  for (const client of clients) {
    writeClose(client);
    client.end();
  }

  server.close(() => process.exit(0));
});
