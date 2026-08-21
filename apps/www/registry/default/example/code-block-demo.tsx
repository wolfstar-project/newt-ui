import { CodeBlock, CodeToken } from "@/registry/default/ui/code-block"

export default function CodeBlockDemo() {
  return (
    <CodeBlock>
      <CodeToken kind="comment">{"// example"}</CodeToken>
      {"\n"}
      <CodeToken kind="keyword">const</CodeToken>{" "}
      <CodeToken kind="function">greet</CodeToken>
      {" = () => "}
      <CodeToken kind="string">&quot;hello&quot;</CodeToken>;
    </CodeBlock>
  )
}
