import React from "react";
import type { ISocketStore } from "socket-store";
import ReactSocketContext from "./context";

export function SocketProvider({
  children,
  store,
}: {
  children: React.ReactNode;
  store: ISocketStore;
}) {
  return (
    <ReactSocketContext.Provider value={store}>
      {children}
    </ReactSocketContext.Provider>
  );
}
