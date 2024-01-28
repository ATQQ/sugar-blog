export const vOuterHtml = {
  mounted: (el: HTMLElement, binding: any) => {
    el.outerHTML = binding.value
  }
}
