export type SocketSchema = {
  [topic: string]: {
    state: unknown;
    payload: unknown;
  };
};

export type DefaultSchema = Record<string, { state: any; payload: any }>;

export type TopicKey<Schema extends SocketSchema> = keyof Schema & string;

export type TopicState<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = Schema[K]["state"];

export type TopicPayload<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = Schema[K]["payload"];

export type Unsubscribe = () => void;

export interface SocketStoreLike<Schema extends SocketSchema = DefaultSchema> {
  onConnect(): void;
  onMessage(message: MessageEvent): void;
  send<K extends TopicKey<Schema>>(message: {
    key: K;
    data: TopicPayload<Schema, K>;
  }): void;
  getState<K extends TopicKey<Schema>>(key: K): TopicState<Schema, K>;
  subscribe<K extends TopicKey<Schema>>(
    key: K,
    listener: (state: TopicState<Schema, K>) => void
  ): Unsubscribe | void;
}

export type ISocketStore<Schema extends SocketSchema = DefaultSchema> =
  SocketStoreLike<Schema>;
