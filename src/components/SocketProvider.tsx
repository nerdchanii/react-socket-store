import React from "react";
import type { DefaultSchema, SocketSchema, SocketStoreLike } from "../types";
import ReactSocketContext from "./context";

export type SocketProviderProps<
  Schema extends SocketSchema = DefaultSchema
> = {
  children: React.ReactNode;
  store: SocketStoreLike<Schema>;
};

export function SocketProvider<Schema extends SocketSchema = DefaultSchema>({
  children,
  store,
}: SocketProviderProps<Schema>) {
  return (
    <ReactSocketContext.Provider value={store as unknown as SocketStoreLike}>
      {children}
    </ReactSocketContext.Provider>
  );
}
