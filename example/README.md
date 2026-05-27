# react-socket-store Example

This Vite app can run against the local WebSocket echo server in this
directory. The server listens on `ws://localhost:3000`, matching
`src/sockets/index.ts`.

## Run Locally

From `example/`, install dependencies, then start the WebSocket server and Vite
app in separate terminals:

```bash
npm install
npm run server
```

```bash
npm run dev
```

Open the Vite URL, type a chat message, and submit it. The app sends
`{ "key": "talk", "data": "<message>" }`; the local server echoes that topic
message back; the `talk` handler appends the payload to the visible chat state.

Closing the browser tab closes the WebSocket connection. Stopping the server
with `Ctrl+C` closes any connected example clients.

## Verify

After the package root has been built, run:

```bash
npm run build
```
