export interface PagefindOption {
  /**
   * Pass extra element selectors that Pagefind should ignore when indexing
   * @see https://pagefind.app/docs/config-options/#exclude-selectors
   * @default
   * ['div.aside' ,'a.header-anchor']
   */
  excludeSelector?: string[]
}
export interface SearchConfig {
  /**
   * @default
   * 'Search'
   */
  btnPlaceholder?: string
  /**
   * @default
   * 'Search Docs'
   */
  placeholder?: string
  /**
   * @default
   * 'No results found.'
   */
  emptyText?: string
  /**
   * @default
   * 'Total: {{searchResult}} search results.'
   */
  heading?: string

  /**
   * For some special languages.
   * Customize the conversion of user input
   * @see https://pagefind.app/docs/multilingual/#specialized-languages
   */
  customSearchQuery?: (input: string) => string
}
