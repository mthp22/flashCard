import hljs from 'highlight.js/lib/core'

import bash from 'highlight.js/lib/languages/bash'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

/**
 * highlight.js core + only the languages our cards actually use.
 * Registering all ~190 languages would add ~900 kB to the bundle.
 */
const SUPPORTED_LANGUAGES = {
  bash,
  csharp,
  css,
  java,
  javascript,
  json,
  python,
  typescript,
  xml,
} as const

for (const [name, language] of Object.entries(SUPPORTED_LANGUAGES)) {
  hljs.registerLanguage(name, language)
}

export { hljs }
