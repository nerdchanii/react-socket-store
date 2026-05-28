import { useCallback, useSyncExternalStore } from "react";
import type {
  DefaultSchema,
  SocketSchema,
  SocketStoreLike,
  TopicKey,
  TopicState,
} from "../../types";
import { useProvidedOrContextStore } from "../context";

export type UseListenResult<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = [TopicState<Schema, K>];

export function useListen<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): UseListenResult<Schema, K>;
export function useListen<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
>(store: SocketStoreLike<Schema>, key: K): UseListenResult<Schema, K>;

export function useListen<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(
  storeOrKey: SocketStoreLike<Schema> | K,
  maybeKey?: K
): UseListenResult<Schema, K> {
  const hasExplicitStore = maybeKey !== undefined;
  const store = hasExplicitStore
    ? (storeOrKey as SocketStoreLike<Schema>)
    : undefined;
  const key = hasExplicitStore ? maybeKey : (storeOrKey as K);

  const resolvedStore = useProvidedOrContextStore<Schema>(store);
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubscribe = resolvedStore.subscribe(key, onStoreChange);

      return typeof unsubscribe === "function" ? unsubscribe : () => undefined;
    },
    [resolvedStore, key]
  );
  const getSnapshot = useCallback(
    () => resolvedStore.getState(key),
    [resolvedStore, key]
  );
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return [state];
}

export default useListen;
