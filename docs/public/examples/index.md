# Examples

The runnable example app lives in `example/`. Keep written examples short and
directly adaptable from runnable source instead of copying large files into the
docs.

A minimal component can subscribe and send through one topic:

```tsx
import { useSocket } from "react-socket-store";

export function TalkBox() {
  const [messages, send] = useSocket("talk");

  return (
    <button type="button" onClick={() => send("hello")}>
      Messages: {messages.length}
    </button>
  );
}
```

Use `npm run docs:build` to verify the public docs site.
