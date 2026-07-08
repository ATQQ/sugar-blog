export function findNextSibling(el: Element, selector: string) {
  let sibling = el.nextElementSibling

  while (sibling) {
    if (sibling.matches(selector))
      return sibling
    sibling = sibling.nextElementSibling
  }
}

export function findPreviousSibling(el: Element, selector: string) {
  let sibling = el.previousElementSibling

  while (sibling) {
    if (sibling.matches(selector))
      return sibling
    sibling = sibling.previousElementSibling
  }
}

let uid = 0
export function createId(prefix = 'command') {
  uid += 1
  return `${prefix}-${Date.now().toString(36)}-${uid.toString(36)}`
}
