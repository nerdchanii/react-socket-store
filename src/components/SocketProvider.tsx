import React from "react";
import ReactSocketContext from "./context";

export function SocketProvider({
  children,
  store,
}: {
  children: React.ReactNode;
  store: any;
}) {
  return (
    <ReactSocketContext.Provider value={store}>
      {children}
    </ReactSocketContext.Provider>
  );
}
