import { highlighter } from "../utils/logger.js"
import {
  DEFAULT_PRESET,
  decodePreset,
  encodePreset,
  presetSchema,
  presetToCss,
  templateFor,
} from "../utils/preset.js"

export interface PresetOptions {
  /** `decode`, `encode` or `css`. */
  action?: string
  /** The code for `decode`/`css`, or a JSON fragment for `encode`. */
  value?: string
  json: boolean
}

/**
 * The codec, exposed. Nobody needs this to use newt/ui — it exists so a code
 * that behaves oddly can be read without decoding base64 by hand, and so the
 * docs can be checked against the same implementation the CLI runs.
 */
export async function preset(options: PresetOptions): Promise<void> {
  const { action, value } = options

  switch (action) {
    case "decode": {
      if (!value) throw new Error("Please pass a preset code to decode.")
      const decoded = decodePreset(value)
      if (options.json) {
        console.log(JSON.stringify(decoded))
        break
      }
      const template = templateFor(decoded)
      console.log(`${highlighter.bold("framework")}  ${decoded.t}`)
      console.log(
        `${highlighter.bold("template")}   ${template ?? "none — create the project with its own tool"}`
      )
      console.log(`${highlighter.bold("brand")}      ${decoded.b}`)
      console.log(`${highlighter.bold("radius")}     ${decoded.r}`)
      console.log(`${highlighter.bold("font")}       ${decoded.f}`)
      console.log(`${highlighter.bold("mode")}       ${decoded.m}`)
      console.log(`${highlighter.bold("direction")}  ${decoded.d}`)
      break
    }

    case "encode": {
      /*
       * The fragment is parsed as a partial preset rather than inspected: an
       * argument that is not an object, or names a field that does not exist,
       * fails here with the field named instead of somewhere downstream.
       */
      const overrides = presetSchema
        .partial()
        .parse(value === undefined ? {} : JSON.parse(value))
      console.log(
        encodePreset(presetSchema.parse({ ...DEFAULT_PRESET, ...overrides }))
      )
      break
    }

    case "css": {
      if (!value) throw new Error("Please pass a preset code.")
      process.stdout.write(presetToCss(decodePreset(value)))
      break
    }

    default:
      throw new Error(
        `Unknown preset action "${action ?? ""}". Expected ${highlighter.info("decode")}, ${highlighter.info("encode")} or ${highlighter.info("css")}.`
      )
  }
}
