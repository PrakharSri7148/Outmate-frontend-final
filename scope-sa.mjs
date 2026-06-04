import postcss from 'postcss'
import fs from 'node:fs'

const DIR = '/tmp/sa-src/'
const FILES = ['outmate.css', 'vid.css', 'vid2.css', 'social-agent.css']

// keyframes this design defines — renamed to sa-* to avoid clobbering other pages
const KF = ['scrollx', 'pulse', 'bob']
const KF_SORTED = [...KF].sort((a, b) => b.length - a.length)
const KFSET = new Set(KF)

function renameInValue(val) {
  let out = val
  for (const name of KF_SORTED) {
    const re = new RegExp('(^|[\\s,])' + name.replace(/[-]/g, '\\-') + '([\\s,]|$)', 'g')
    out = out.replace(re, (_m, a, b) => a + 'sa-' + name + b)
  }
  return out
}

const EXACT = {
  ':root': '.sa-root',
  'html': '.sa-root',
  'body': '.sa-root',
  '*': '.sa-root *',
  'a': '.sa-root a',
  'img': '.sa-root img',
  '::selection': '.sa-root ::selection',
  'html,body': '.sa-root',
}
function scopeSelector(selRaw) {
  const sel = selRaw.trim()
  if (sel in EXACT) return EXACT[sel]
  return '.sa-root ' + sel
}

function scopePlugin() {
  return {
    postcssPlugin: 'scope-sa',
    Once(root) {
      root.walkAtRules(/^(-\w+-)?keyframes$/i, (at) => {
        const name = at.params.trim()
        if (KFSET.has(name)) at.params = 'sa-' + name
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
   OUTMATE — Social Agent product page (SCOPED under .sa-root)
   Sources (in order): outmate.css, vid.css, vid2.css, social-agent.css
   (social-agent.css loads LAST and overrides the others.)
   Keyframes prefixed sa-*. Do not edit global index.css.
   ============================================================ */

/* zoom to match sibling use-case pages' scale */
.sa-root { zoom: 0.7; }

`
fs.writeFileSync('/Users/prakharsrivastava/Downloads/outmate-frontend/src/pages/social-agent.css', header + res.css)
console.log('written', (header + res.css).length, 'bytes')
