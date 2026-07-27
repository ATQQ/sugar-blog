export interface PagefindResult {
  url: string
  content: string
  word_count: number
  filters: Filters
  meta: Meta
  anchors: Anchor[]
  weighted_locations: WeightedLocation[]
  locations: number[]
  raw_content: string
  raw_url: string
  excerpt: string
  sub_results: SubResult[]
}

export interface SubResult {
  title: string
  url: string
  anchor: Anchor
  weighted_locations: WeightedLocation[]
  locations: number[]
  excerpt: string
}

export interface WeightedLocation {
  weight: number
  balanced_score: number
  location: number
}

export interface Anchor {
  element: string
  id: string
  text: string
  location: number
}

export interface Meta {
  image_alt: string
  title: string
  image: string
  base64: string
  date?: string
  description?: string
  publish?: boolean
}

interface Filters {
}

export interface PagefindOption {
  /**
   * Pass extra element selectors that Pagefind should ignore when indexing
   * @see https://pagefind.app/docs/config-options/#exclude-selectors
   * @default
   * ['div.aside' ,'a.header-anchor']
   */
  excludeSelector?: string[]
  /**
   * Ignores any detected languages and creates a single index for the entire site as the provided language.
   * Expects an ISO 639-1 code, such as en or zh.
   * @see https://pagefind.app/docs/config-options/#force-language
   */
  forceLanguage?: string
  /**
   * You can customize the instructions to generate the index, which is useful when you customize your version of pagefind
   * @see https://pagefind.app/docs/config-options/
   */
  indexingCommand?: string
}

export interface SearchItem {
  route: string
  meta: Override<Omit<Partial<Meta>, 'base64'>, {
    date?: number
    title: string[]
  }>
  result: PagefindResult
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
   * 'Searching...'
   */
  loadingText?: string
  /**
   * When there are old search results and a new query is typed,
   * overlay a translucent loading mask on the existing results.
   * @default true
   */
  showLoadingMask?: boolean
  /**
   * @default
   * 'Total: {{searchResult}} search results.'
   */
  heading?: string

  /**
   * @default
   * 'to select'
   */
  toSelect?: string
  /**
   * @default
   * 'to navigate'
   */
  toNavigate?: string
  /**
   * @default
   * 'to close'
   */
  toClose?: string
  /**
   * @default
   * 'Search by'
   */
  searchBy?: string
  /**
   * @default
   * 'Display detailed list'
   */
  displayDetailedList?: string
  /**
   * @default
   * 'Reset search'
   */
  resetSearch?: string
  /**
   * This label is only displayed in the mobile view.
   * @default
   * 'Close search'
   */
  closeSearch?: string

  /**
   * Automatically reloads the page when the page language changes.
   *
   * The purpose is to reload the index file for the target language.
   * @default true
   */
  langReload?: boolean
  /**
   * For some special languages.
   * Customize the conversion of user input
   * @see https://pagefind.app/docs/multilingual/#specialized-languages
   */
  customSearchQuery?: (input: string) => string
  /**
   * @default false
   * @deprecated
   */
  resultOptimization?: boolean
  /**
   * Customize the filtering schema
   */
  filter?: (searchItem: SearchItem, idx: number, array: SearchItem[]) => boolean
  /**
   * Sorts search results array.
   *
   * like array.sort()
   */
  sort?: (a: SearchItem, b: SearchItem) => number
  /**
   * Search result Displays the date the document was last modified
   * @default false
   */
  showDate?: boolean | ((date: number, lang: string) => string)
  /**
   * Set the time zone for parsing date in frontmatter
   * @deprecated
   */
  timeZone?: number
  /**
   * i18n
   */
  locales?: Record<string, Omit<SearchConfig, 'locales'>>
  /**
   * ignore publish frontmatter
   * @default false
   */
  ignorePublish?: boolean

  /**
   * Manually control index generation instructions and resource loading scripts
   * @see README.md Example7
   * @default false
   */
  manual?: boolean

  /**
   * debouncedSearch delay
   * @default 300
   */
  delay?: number

  /**
   * One article displays several results
   * @default 1
   */
  pageResultCount?: number

  /**
   * MPA mode with default UI component
   * @default false
   */
  mpaDefaultUI?: boolean

  /**
   * Clear the search content and results when the search dialog is closed
   *
   * - `'never'`: Never clear search content and results when closed
   *   - Same as `'visit'` in MPA mode
   * - `'always'`: Always clear search content and results when closed
   * - `'visit'`: Clear search content and results only if user select a search result link,
   * and won't clear if user just close the dialog directly
   *
   * @default 'never'
   */
  clearWhenClosed?: 'never' | 'always' | 'visit'
}

export type PagefindConfig = PagefindOption & SearchConfig

type Override<T, U> = Omit<T, keyof U> & U
