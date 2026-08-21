import { notFound } from "next/navigation"

import { Demos } from "@/__registry__/demos"
import { ComponentSection } from "@/components/docs/component-section"
import { Preview } from "@/components/docs/preview"
import { categories } from "@/registry/registry-categories"
import { rootClasses } from "@/registry/registry-root-classes"
import { ui } from "@/registry/registry-ui"

export function generateStaticParams() {
  return ui.map((item) => ({ name: item.name }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = ui.find((entry) => entry.name === name)
  if (!item) notFound()

  const category = categories.find((entry) => entry.components.includes(name))
  const index = category ? category.components.indexOf(name) + 1 : 1
  const Demo = Demos[name]

  return (
    <>
      <header className="page-header">
        <div className="page-header__main">
          <div className="page-header__eyebrow">
            <span>newt/ui</span>
            <span>·</span>
            <span>
              <b>{category?.label ?? "Components"}</b>
            </span>
          </div>
          <h1>
            <em>component —</em>
            {item.title ?? item.name}
          </h1>
          {item.description ? <p className="lead">{item.description}</p> : null}
        </div>
        <div className="page-header__manifest">
          <div className="manifest__heading">registry-item</div>
          <div className="manifest__row">
            <span className="manifest__key">name</span>
            <span className="manifest__val manifest__val--brand">
              {item.name}
            </span>
          </div>
          <div className="manifest__row">
            <span className="manifest__key">root class</span>
            <span className="manifest__val">{rootClasses[name] ?? "—"}</span>
          </div>
          <div className="manifest__row">
            <span className="manifest__key">depends on</span>
            <span className="manifest__val">
              {item.registryDependencies?.join(", ") ?? "none"}
            </span>
          </div>
          <div className="manifest__row">
            <span className="manifest__key">install</span>
            <span className="manifest__val">newt-ui add {item.name}</span>
          </div>
        </div>
      </header>

      <div className="content">
        <ComponentSection
          id={name}
          index={index}
          title={item.title ?? item.name}
          rootClass={rootClasses[name]}
          description={item.description}
        >
          <Preview>{Demo ? <Demo /> : null}</Preview>
        </ComponentSection>
      </div>
    </>
  )
}
