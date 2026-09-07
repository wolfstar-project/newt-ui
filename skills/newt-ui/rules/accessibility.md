# Accessibility

The components carry their own semantics. What breaks is almost always the
markup written around them.

## Incorrect

```tsx
<Button variant="icon" onClick={mute}>
  <MicOffIcon />
</Button>
```

An icon-only control with no accessible name. A screen reader announces
"button".

## Correct

```tsx
<Button variant="icon" aria-label="Mute channel" onClick={mute}>
  <MicOffIcon />
</Button>
```

## Incorrect

```tsx
<span className="text-newt-online">●</span>
```

State carried by colour alone.

## Correct

```tsx
<StatusIndicator status="online" label="Online" />
```

The dot encodes its state in shape as well as colour — idle is a crescent,
do-not-disturb is a bar — and carries `role="status"` with a name.

## Incorrect

```tsx
<Input placeholder="Channel name" />
```

A placeholder is not a label: it disappears on focus and is not announced.

## Correct

```tsx
<Field>
  <Label>Channel name</Label>
  <Input />
</Field>
```

## Still yours

- One `<h1>` per page, a `<main>`, and a heading order that does not skip.
- An `aria-live` region for data that changes while somebody is reading it —
  the components do not know which of your updates matter.
- `lang` and `dir` on `<html>`.
- Never remove a `:focus-visible` ring. It is a 2px `--newt-text-link` outline
  at 2px offset, and it is the only thing a keyboard user has.
