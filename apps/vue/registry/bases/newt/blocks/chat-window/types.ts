/*
 * `messages` is deliberately a plain array. A block does not know your data
 * layer; map onto this shape at the edge of it.
 */
export interface ChatMessage {
  id: string
  author: string
  /** The initials the avatar shows. */
  initials: string
  body: string
  /** ISO timestamp, for the `<time>` element. */
  sentAt: string
  /** What the reader sees. */
  displayTime: string
}
