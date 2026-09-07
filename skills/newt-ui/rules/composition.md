# Compose, do not invent

The registry has 55 components. Anything outside them is a mistake worth
catching in review — a model will happily produce a component that looks right
and shares none of the structure, and it will drift from the rest of the system
the first time a token changes.

## Incorrect

```tsx
// "a Discord-style message row"
function MessageRow({ user, body }: Props) {
  return (
    <div className="flex gap-3 px-4 py-2 hover:bg-[#2e3035]">
      <img src={user.avatar} className="h-10 w-10 rounded-full" />
      <div>
        <strong className="text-[#f2f3f5]">{user.name}</strong>
        <p className="text-[#dbdee1]">{body}</p>
      </div>
    </div>
  )
}
```

That is `MessageGroup` reimplemented, with four literals and none of its
reply layout, ephemeral state, verified tag or `<time>` element.

## Correct

```bash
npx newtui@latest add message-group
```

```tsx
import { MessageGroup } from "@/components/ui/message-group"

;<MessageGroup author={user.name} avatar={user.avatar} timestamp={sentAt}>
  {body}
</MessageGroup>
```

## Incorrect

```tsx
// wrapping a component to restyle it
<div className="[&_button]:bg-purple-600">
  <Button>Send</Button>
</div>
```

## Correct

```tsx
// a variant if one fits the intent
<Button variant="primary">Send</Button>
```

```css
/* or a scoped token override, if the intent is genuinely a different brand */
.invite-panel {
  --newt-brand: #7a5af8;
}
```

## When something really is missing

Say which component you looked for, what `newtui search` returned, and what you
would compose it from. Do not write a new library component; that is an issue,
not an edit.
