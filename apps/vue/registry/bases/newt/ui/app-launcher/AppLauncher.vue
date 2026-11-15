<script setup lang="ts">
import { DialogContent, DialogRoot, DialogTitle } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed, useAttrs } from "vue"

import { cn } from "@/lib/utils"

import { type AppLauncherVariants, appLauncherVariants } from "."

/*
 * The Apps launcher: search, recents, and the apps installed in a server. It
 * is a popout on desktop and a bottom sheet on a phone, and a dialog unless
 * it is `inline`.
 *
 * Reka owns the dialog behaviour: focus moves into the launcher, Tab cycles
 * through its controls, Escape asks to close it, and a `modal` one takes the
 * page behind it out of use. The launcher renders in place, with no portal
 * and no overlay, so the application decides where it sits. It is open for
 * as long as it is mounted. The page beside a dialog that is not modal stays
 * in use, so a press or a focus move outside does not close it.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** `popout` for desktop, `sheet` for a bottom sheet on a phone. */
    variant?: AppLauncherVariants["variant"]
    /**
     * Render the launcher in the page: no dialog role, and focus stays where
     * it is. Use it for a launcher that is always on screen, such as a
     * showcase.
     */
    inline?: boolean
    /**
     * Take the page behind the launcher out of use: it is hidden from
     * assistive technology, focus cannot move to it, and a press on it
     * closes the launcher. Use it for a sheet that covers the page. Has no
     * effect on an `inline` launcher.
     */
    modal?: boolean
    /**
     * The accessible name of the launcher. Without it, name the launcher
     * with `aria-label` or `aria-labelledby`.
     */
    label?: string
  }>(),
  { variant: "popout", inline: false, modal: false }
)

const emit = defineEmits<{
  /**
   * The user asks to close the dialog: Escape, or a press outside a `modal`
   * one. Unmount the launcher in answer; focus then returns to the element
   * that held it before the launcher opened.
   */
  close: []
}>()

const attrs = useAttrs()

const launcherClass = computed(() =>
  appLauncherVariants({ variant: props.variant })
)

/*
 * Reka always points the dialog at a title. Without a `label` there is none,
 * so the reference gives way to whatever name the application passes.
 */
const naming = computed(() =>
  props.label === undefined
    ? { "aria-labelledby": attrs["aria-labelledby"] }
    : {}
)

/*
 * The dialog has no trigger: the application opens it by mounting it. So the
 * launcher notes which element holds focus just before it takes it, and
 * hands focus back to that element when it unmounts.
 */
let opener: Element | null = null

function rememberOpener() {
  opener = document.activeElement
}

function returnFocus(event: Event) {
  event.preventDefault()
  const element = opener
  /*
   * A press outside closes a modal launcher while the press is still in
   * flight, and the browser then moves focus to the page. The timer runs
   * after it.
   */
  setTimeout(() => {
    if (element instanceof HTMLElement && element.isConnected) element.focus()
  }, 0)
}
</script>

<template>
  <!-- A name needs a role to hang on: a `div` alone may not carry one. -->
  <div
    v-if="props.inline"
    :role="props.label === undefined ? undefined : 'region'"
    :aria-label="props.label"
    v-bind="$attrs"
    :class="cn(launcherClass, props.class)"
  >
    <slot />
  </div>
  <DialogRoot
    v-else
    :open="true"
    :modal="props.modal"
    @update:open="
      (open) => {
        if (!open) emit('close')
      }
    "
  >
    <DialogContent
      v-bind="{ ...$attrs, ...naming }"
      :aria-modal="props.modal ? true : undefined"
      :aria-describedby="undefined"
      :class="cn(launcherClass, 'outline-none', props.class)"
      @open-auto-focus="rememberOpener"
      @close-auto-focus="returnFocus"
      @interact-outside="
        (event) => {
          if (!props.modal) event.preventDefault()
        }
      "
    >
      <!-- The name, as a heading no one sees: Reka points the dialog at it. -->
      <DialogTitle v-if="props.label !== undefined" class="sr-only">
        {{ props.label }}
      </DialogTitle>
      <slot />
    </DialogContent>
  </DialogRoot>
</template>
