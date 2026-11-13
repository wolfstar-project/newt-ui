<script setup lang="ts">
import { computed, provide, ref, type HTMLAttributes } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "~~/registry/bases/newt/ui/modal"

import { cn } from "@/lib/utils"

import {
  defaultMarkdownLabels,
  MARKDOWN_CONTEXT_KEY,
  type MarkdownLabels,
  type MarkdownResolveEmoji,
  type MarkdownResolveMention,
} from "."
import {
  isEmojiOnly,
  parseMarkdown,
  type MarkdownMentionKind,
} from "./markdown-syntax"
import MarkdownBlocks from "./MarkdownBlocks.vue"

/*
 * Renders a message written in chat markdown with the library's own parts.
 * The source is parsed, never injected as HTML.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** The message source, in chat markdown. */
    content: string
    /**
     * Name (and colour, avatar) for a mention id. Without it, or when it
     * returns nothing, a numeric id shows as `unknown-user` and a name shows
     * as written, so `<@username>` reads as `@username`.
     */
    resolveMention?: MarkdownResolveMention
    /**
     * Image URL for a server emoji. Without it, or when it returns nothing,
     * the emoji shows as its `:name:` text — newt/ui never fetches one itself.
     */
    resolveEmoji?: MarkdownResolveEmoji
    /**
     * Makes mentions buttons that emit `mention-click`. Off by default: they
     * are read-only text, out of the tab order.
     */
    interactiveMentions?: boolean
    /**
     * Added to a heading's level to pick its element: `#` with the default 2
     * is an `<h3>`, so a message never outranks the page around it.
     */
    headingOffset?: number
    /** Locale for timestamps. Defaults to the reader's. */
    locale?: string
    /**
     * Ask before opening a masked link (`[text](url)`), whose text hides its
     * address. On by default.
     */
    linkWarning?: boolean
    labels?: Partial<MarkdownLabels>
  }>(),
  { interactiveMentions: false, headingOffset: 2, linkWarning: true }
)

const emit = defineEmits<{
  (e: "mention-click", mention: { kind: MarkdownMentionKind; id: string }): void
}>()

const blocks = computed(() => parseMarkdown(props.content))
const labels = computed(() => ({ ...defaultMarkdownLabels, ...props.labels }))
const pendingUrl = ref<string | null>(null)
/*
 * The warning opens from a link, not from a `ModalTrigger`, so focus goes back
 * to whatever held it when the link was activated.
 */
let opener: HTMLElement | null = null

function returnFocus(event: Event) {
  event.preventDefault()
  if (opener?.isConnected) opener.focus()
}

provide(MARKDOWN_CONTEXT_KEY, () => ({
  resolveMention: props.resolveMention,
  resolveEmoji: props.resolveEmoji,
  mentionsInteractive: props.interactiveMentions,
  onMentionClick: (mention) => emit("mention-click", mention),
  headingOffset: props.headingOffset,
  locale: props.locale,
  labels: labels.value,
  jumbo: isEmojiOnly(blocks.value),
  interceptLink: (url, masked) => {
    if (!masked || !props.linkWarning) return false
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    pendingUrl.value = url
    return true
  },
}))

const warningOpen = computed({
  get: () => pendingUrl.value !== null,
  set: (open: boolean) => {
    if (!open) pendingUrl.value = null
  },
})

function visit() {
  if (pendingUrl.value) {
    window.open(pendingUrl.value, "_blank", "noopener,noreferrer")
  }
  pendingUrl.value = null
}
</script>

<template>
  <div :class="cn('min-w-0 break-words [overflow-wrap:anywhere]', props.class)">
    <MarkdownBlocks :blocks="blocks" />
    <Modal v-model:open="warningOpen">
      <ModalContent
        :aria-describedby="undefined"
        @close-auto-focus="returnFocus"
      >
        <ModalHeader>
          <ModalTitle>{{ labels.linkWarningTitle }}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p class="m-0">{{ labels.linkWarningBody }}</p>
          <p
            class="mt-2 break-all rounded-sm bg-newt-bg-base p-2 font-mono text-[13px] text-newt-text-primary"
          >
            {{ pendingUrl }}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" @click="pendingUrl = null">
            {{ labels.linkWarningCancel }}
          </Button>
          <Button variant="primary" @click="visit">
            {{ labels.linkWarningConfirm }}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </div>
</template>
