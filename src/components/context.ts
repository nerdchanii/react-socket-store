import { createContext, useContext } from "react";
import type { ISocketStore } from "socket-store";

const ReactSocketContext = createContext<ISocketStore | null>(null);

export function useSocketStore(): ISocketStore {
  const store = useContext(ReactSocketContext);

  if (store === null) {
    throw new Error(
      "react-socket-store hooks must be used inside a SocketProvider."
    );
  }

  return store;
}

export default ReactSocketContext;
