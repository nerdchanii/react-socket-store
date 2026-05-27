import { useState } from "react";
import type { DefaultSchema, SocketSchema, SocketStoreLike } from "../../types";

/**
 * Stabilizes a side-effect-free store factory for the component lifetime.
 * Do not open WebSocket connections or allocate other external resources here.
 */
export function useSocketStoreRef<
  Schema extends SocketSchema = DefaultSchema,
  Store extends SocketStoreLike<Schema> = SocketStoreLike<Schema>
>(createStore: () => Store): Store {
  const [store] = useState(createStore);

  return store;
}
