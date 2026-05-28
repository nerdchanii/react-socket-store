import { useCallback, useSyncExternalStore } from "react";
import type {
  DefaultSchema,
  SocketSchema,
  SocketStoreLike,
  TopicKey,
  TopicPayload,
  TopicState,
} from "../../types";
import { useProvidedOrContextStore } from "../context";

export type UseSocketResult<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = [TopicState<Schema, K>, (message: TopicPayload<Schema, K>) => void];

export function useSocket<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): UseSocketResult<Schema, K>;
export function useSocket<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
>(store: SocketStoreLike<Schema>, key: K): UseSocketResult<Schema, K>;

export function useSocket<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(
  storeOrKey: SocketStoreLike<Schema> | K,
  maybeKey?: K
): UseSocketResult<Schema, K> {
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
  const send = useCallback(
    (message: TopicPayload<Schema, K>) => {
      resolvedStore.send({ key, data: message });
    },
    [resolvedStore, key]
  );

  return [state, send];
}
