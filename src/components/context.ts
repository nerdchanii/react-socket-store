import { createContext, useContext } from "react";
import type { DefaultSchema, SocketSchema, SocketStoreLike } from "../types";

const ReactSocketContext = createContext<SocketStoreLike | null>(null);

export function assertSocketStore<
  Schema extends SocketSchema = DefaultSchema
>(store: SocketStoreLike | null): SocketStoreLike<Schema> {
  if (store === null) {
    throw new Error(
      "react-socket-store hooks must be used inside a SocketProvider."
    );
  }

  return store as unknown as SocketStoreLike<Schema>;
}

export function useSocketStore<
  Schema extends SocketSchema = DefaultSchema
>(): SocketStoreLike<Schema> {
  return assertSocketStore(useContext(ReactSocketContext));
}

export function useProvidedOrContextStore<
  Schema extends SocketSchema = DefaultSchema
>(store?: SocketStoreLike<Schema>): SocketStoreLike<Schema> {
  const contextStore = useContext(ReactSocketContext);

  return store ?? assertSocketStore(contextStore);
}

export default ReactSocketContext;
