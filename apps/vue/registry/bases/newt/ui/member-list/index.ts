import type { InjectionKey } from "vue"

export { default as MemberList } from "./MemberList.vue"
export { default as MemberListSection } from "./MemberListSection.vue"
export { default as MemberListHeading } from "./MemberListHeading.vue"
export { default as MemberListItem } from "./MemberListItem.vue"
export { default as MemberListInfo } from "./MemberListInfo.vue"
export { default as MemberListNameRow } from "./MemberListNameRow.vue"
export { default as MemberListName } from "./MemberListName.vue"
export { default as MemberListAppTag } from "./MemberListAppTag.vue"
export { default as MemberListRole } from "./MemberListRole.vue"

/*
 * The composition:
 *
 *   MemberListSection          <section>
 *     MemberListHeading        <h3 id>
 *     MemberList               role="list", aria-labelledby the heading
 *       MemberListItem         role="listitem"
 *
 * A heading is never a child of the list, which may own only list items.
 * The section generates one id, the heading takes it and the list points at
 * it, so each list is named by its heading. A list outside a section takes
 * an `aria-label` instead.
 */
export const memberListSectionKey: InjectionKey<string> = Symbol(
  "newt-member-list-section"
)
