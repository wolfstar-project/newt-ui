import { useEffect, useState } from "react"

import {
  DEFAULT_TYPESET,
  parseTypeset,
  type TypesetParams,
} from "@/lib/typeset"

import TypesetPreview, {
  SURFACE_LABELS,
  SURFACES,
  type Surface,
} from "./TypesetPreview"

/**
 * The standalone page. It reads the same query the builder writes and shows
 * every surface in order, because the question this page answers is how the
 * configuration holds up across all of them rather than one at a time.
 */
export default function TypesetPreviewFrame() {
  const [params, setParams] = useState<TypesetParams>(DEFAULT_TYPESET)

  useEffect(() => setParams(parseTypeset(window.location.search)), [])

  return (
    <>
      {SURFACES.map((surface: Surface) => (
        <section key={surface} className="typeset-standalone-section">
          <h2 className="typeset-standalone-label">
            {SURFACE_LABELS[surface]}
          </h2>
          <TypesetPreview params={params} surface={surface} />
        </section>
      ))}
    </>
  )
}
