import type {
  DefaultSchema,
  SocketSchema,
  TopicKey,
  TopicPayload,
  TopicState,
} from "../../types";
import { useListen } from "./useListen";
import { useSend } from "./useSend";

export type UseSocketResult<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = [TopicState<Schema, K>, (message: TopicPayload<Schema, K>) => void];

export function useSocket<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): UseSocketResult<Schema, K> {
  const [state] = useListen<Schema, K>(key);
  const [send] = useSend<Schema, K>(key);

  return [state, send];
}
