import { useState } from "react";
import type { DefaultSchema, SocketSchema, SocketStoreLike } from "../../types";

export function useSocketStoreRef<
  Schema extends SocketSchema = DefaultSchema,
  Store extends SocketStoreLike<Schema> = SocketStoreLike<Schema>
>(createStore: () => Store): Store {
  const [store] = useState(createStore);

  return store;
}
