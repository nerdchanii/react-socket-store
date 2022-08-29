import { createMessageHandler, SocketStore } from "react-socket-store";

const messageHandlers = [
  createMessageHandler(
    "talk",
    (state: string[], data: string) => {
      return [...state, data];
    },
    []
  ),
  createMessageHandler(
    "trade",
    (state: string | null, data: string) => {
      return data;
    },
    null
  ),
];

const store = new SocketStore(
  new WebSocket("ws://localhost:3000"),
  messageHandlers
);

export default store;
