/*
 * `messages` is deliberately a plain array. The block knows nothing about a
 * model or a transport; map onto this shape at the edge of it.
 */
export interface AiChatMessage {
  id: string
  role: "user" | "assistant"
  /** An assistant's body is rendered as chat markdown; a user's as written. */
  body: string
  /** ISO timestamp, for the `<time>` element. */
  sentAt: string
  /** What the reader sees. */
  displayTime: string
}
