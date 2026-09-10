import { CodeBlock } from "@/registry/bases/newt/ui/code-block"

export default function CodeBlockDemo() {
  return (
    <CodeBlock language="ts">{`// example
const greet = (name: string) => \`hello \${name}\`

greet("world")`}</CodeBlock>
  )
}
