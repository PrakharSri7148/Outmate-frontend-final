import postcss from 'postcss'
import fs from 'node:fs'

const DIR = '/Users/prakharsrivastava/Downloads/b2b-database-handoff/'
const FILES = ['outmate.css', 'vid.css', 'vid2.css', 'sales.css', 'b2b.css']

// keyframes this design defines — renamed to b2b-* to avoid clobbering other pages
const KF = ['scrollx', 'pulse', 'nlpblink', 'bob']
const KF_SORTED = [...KF].sort((a, b) => b.length - a.length)
const KFSET = new Set(KF)

function renameInValue(val) {
  let out = val
  for (const name of KF_SORTED) {
    const re = new RegExp('(^|[\\s,])' + name.replace(/[-]/g, '\\-') + '([\\s,]|$)', 'g')
    out = out.replace(re, (_m, a, b) => a + 'b2b-' + name + b)
  }
  return out
}

const EXACT = {
  ':root': '.b2b-root',
  'html': '.b2b-root',
  'body': '.b2b-root',
  '*': '.b2b-root *',
  'a': '.b2b-root a',
  'img': '.b2b-root img',
  '::selection': '.b2b-root ::selection',
}
function scopeSelector(selRaw) {
  const sel = selRaw.trim()
  if (sel in EXACT) return EXACT[sel]
  return '.b2b-root ' + sel
}

function scopePlugin() {
  return {
    postcssPlugin: 'scope-b2b',
    Once(root) {
      root.walkAtRules(/^(-\w+-)?keyframes$/i, (at) => {
        const name = at.params.trim()
        if (KFSET.has(name)) at.params = 'b2b-' + name
      })
      root.walkDecls((decl) => {
        if (/^(-\w+-)?animation(-name)?$/i.test(decl.prop)) {
          decl.value = renameInValue(decl.value)
        }
      })
      root.walkRules((rule) => {
        const p = rule.parent
        if (p && p.type === 'atrule' && /keyframes$/i.test(p.name)) return
        rule.selectors = rule.selectors.map(scopeSelector)
      })
    },
  }
}
scopePlugin.postcss = true

let combined = ''
for (const f of FILES) combined += fs.readFileSync(DIR + f, 'utf8') + '\n'

const res = await postcss([scopePlugin]).process(combined, { from: undefined })
const header = `/* ============================================================
   OUTMATE — B2B Database product page (SCOPED under .b2b-root)
   Sources (in order): outmate.css, vid.css, vid2.css, sales.css, b2b.css
   (b2b.css loads LAST and overrides the others.)
   Keyframes prefixed b2b-*. Do not edit global index.css.
   ============================================================ */

/* zoom to match sibling use-case pages' scale */
.b2b-root { zoom: 0.7; }

`
fs.writeFileSync('/Users/prakharsrivastava/Downloads/outmate-frontend/src/pages/b2b-database.css', header + res.css)
console.log('written', (header + res.css).length, 'bytes')
