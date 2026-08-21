import * as React from "react"

interface ComponentSectionProps {
  id: string
  index: number
  title: string
  rootClass?: string
  description?: string
  children: React.ReactNode
}

export function ComponentSection({
  id,
  index,
  title,
  rootClass,
  description,
  children,
}: ComponentSectionProps) {
  return (
    <section className="component-section" id={id}>
      <div className="component-section__head">
        <div className="component-section__num">
          {String(index).padStart(2, "0")}
        </div>
        <div className="component-section__title">
          {title}
          {rootClass ? (
            <span className="component-section__class">{rootClass}</span>
          ) : null}
        </div>
        {description ? (
          <p className="component-section__desc">{description}</p>
        ) : null}
      </div>
      <div className="component-section__body">{children}</div>
    </section>
  )
}
