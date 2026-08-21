# ginnydong.com — Personal Portfolio

A static, no-build-tool personal portfolio site. Every page is a self-contained
`.html` file with inline `<style>`/`<script>` — there is no bundler, no
framework, no package.json. Edit the HTML files directly.

This README exists as a **style guide and interaction-pattern reference for
AI assistants** (Claude, Codex, etc.) working in this repo. Read it before
adding or modifying pages so new work stays visually and behaviorally
consistent with the rest of the site.

## Pages

| File | Route | Nav tab / accent |
|---|---|---|
| [index.html](index.html) | `/` (About) | `#CBFF71` (green) |
| [work.html](work.html) | Work | `#FF8418` (orange) |
| [play.html](play.html) | Play | `#00D0FF` (cyan) |
| [lumino.html](lumino.html) | Work case study — Lumino | — |
| [artisk.html](artisk.html) | Work case study — Artisk | — |

Case-study pages (`lumino.html`, `artisk.html`) reuse the same shell/nav
chrome as the top-level pages but replace the main content area with a
project write-up.

Deployed via GitHub Pages, custom domain in [CNAME](CNAME) (`ginnydong.com`).
Third-party libs are vendored locally in [vendor/](vendor) (`three.min.js`,
`OrbitControls.js`) — no CDN/npm dependency for those.

---

## Style Guide

### Design tokens

```css
:root{
  --canvas:#D7D7D7;   /* page background, outside the white "paper" panels */
  --paper:#ffffff;    /* card / panel background */
  --ink:#111111;      /* primary text */
  --sidegap:24px;      /* outer page margin */
  --midgap:8px;        /* gap between panels/columns */
}
```

Recurring neutrals used across pages (not all formalized as variables yet —
match them literally when editing):

- `#f4f4f4` — default pill/button background (idle state)
- `#e9e9e9` — pill/button hover state
- `#2b2b2b` — secondary dark text/icon color
- `#000` / `#111` — primary ink (interchangeable in practice, prefer `#111`)

### Accent colors (tab identity)

Each top-level section has one signature accent, applied to its active nav
pill and reused for that section's highlights/CTAs:

- About → `#CBFF71` (lime)
- Work → `#FF8418` (orange)
- Play → `#00D0FF` (cyan)

Don't invent new accent colors for a section that already has one. A new
top-level section should pick one new saturated accent, not reuse an
existing one.

### Typography

- **Display / name / headline font:** `'Source Serif 4', serif`, always
  `font-style: italic; font-weight: 300`. Loaded via Google Fonts
  `<link>` (`ital,wght@1,300`) — only the italic 300 weight is used, don't
  pull in other weights unless a page genuinely needs them.
- **Body / UI font:** system stack —
  `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif`,
  `font-weight: 400`.
- Use the serif italic sparingly — for names/titles/big statements only.
  Everything else (nav, labels, body copy, buttons) is the system sans stack.

### Shape language

- **Pills** (`border-radius: 999px`) for: nav bar, nav tabs, icon buttons,
  chips/labels. This is the dominant, near-universal control shape.
- **Large rounded rects** (`border-radius: 22px–40px`) for: content panels,
  cards, the main content frame. Bigger container → bigger radius (e.g. the
  main `#contentWrap` uses `40px`, smaller inline cards use `22–28px`).
- Avoid sharp corners (`border-radius: 0`) except for fine dividers/hairlines.

### Layout shell

Every top-level page shares the same skeleton:

```
body (flex column, height:100%, overflow:hidden — no page scroll by default)
├── #navWrap
│   └── nav (white pill bar: logo/tabs/icon buttons)
└── .shell (flex row, gap: var(--midgap))
    ├── optional left rail (e.g. #introRail on index.html)
    └── #contentWrap (flex:1, white rounded panel, the actual page content)
```

- `nav` is a single white pill (`border-radius:999px`) containing the
  centered `.nav-tabs` (About/Work/Play) plus small circular icon buttons
  (e.g. theme/menu) at the ends.
- The active tab gets its section's accent as `background`, `color:#000`;
  inactive tabs are `#f4f4f4` with `#e9e9e9` on hover.
- Content lives inside white rounded panels sitting on the `--canvas` gray
  background — never place page content directly on `--canvas`.
- Pages default to `overflow:hidden` full-viewport (app-like, not a
  scrolling document). Only opt into page scroll (see `index.html`'s small-
  screen media query) when content genuinely can't fit, and do it via a
  responsive override, not as the default.

### Motion

- Entrance animations: slide-in + fade (`translateX`/`opacity`), staggered
  per element via incremental `animation-delay` (see `.intro-frame` in
  index.html — `.1s`, `.22s`, `.34s`), `cubic-bezier(.65,0,.35,1)`,
  duration ~`.6s`.
- Hover/interactive transitions: simple `background .2s` / `opacity .35s`
  ease, no bounce/spring easing on hover states — save the custom
  cubic-bezier for entrance choreography only.
- Always respect `prefers-reduced-motion: reduce` — disable/short-circuit
  entrance animations under that media query (see index.html's
  `@media (prefers-reduced-motion:reduce)` block and the `.no-intro-anim`
  escape hatch class).

### Responsiveness

- Design mobile/small-screen behavior as an explicit override block, not a
  from-scratch mobile-first build — this codebase is desktop-first with
  targeted `@media` adjustments (e.g. stacking a side rail below content).
- Container queries (`container-type: inline-size`, `cqi` units) are used
  for internal type scaling that depends on a panel's own width, not the
  viewport (see `.intro-name{font-size:19.5cqi}`). Prefer this over vw units
  when sizing text inside a resizable panel.

---

## 交互方式 / Interaction Patterns (for AI agents)

给其他 AI（Claude、Codex 等）在这个仓库工作时的行为准则：

1. **单文件、无构建**：每个页面是独立的 `.html`，CSS 写在 `<style>` 内，JS 写在
   `<script>` 内。不要引入 bundler、框架或 npm 依赖；第三方库需要就直接下载到
   [vendor/](vendor) 并本地引用（参考 `three.min.js` 的做法）。

2. **先复用已有的 shell/nav**：新增页面时，从最相似的现有页面（通常是
   `index.html`）复制 `<nav>` + `#navWrap` + `.shell` 骨架，而不是重新设计导航栏。
   保持 pill 形状、颜色 token、hover 行为完全一致。

3. **颜色/字体只能从 token 表里取**：不要为一次性效果引入新的十六进制色值或新
   字体。如果确实需要新的强调色（比如新增一个顶级 tab），选一个未被占用的高
   饱和色，并同步更新本 README 的 Accent colors 表格。

4. **动效要克制**：入场用 stagger + `cubic-bezier(.65,0,.35,1)`；交互反馈用简单
   的 `.2s`/`.35s` ease。不要为普通 hover 状态加自定义缓动曲线。始终加
   `prefers-reduced-motion` 兜底。

5. **移动端是覆盖层，不是重新设计**：默认桌面優先、`overflow:hidden` 的沉浸式
   布局；小屏适配通过 `@media` 覆盖特定属性（比如把侧栏改成堆叠、允许页面滚
   动），不要把整个页面改造成传统响应式文档流。

6. **case-study 页面的模式**：像 `lumino.html`、`artisk.html` 这样的项目详情页，
   要复用同一套 nav/shell chrome，只替换 `#contentWrap` 内部内容。看
   [lumino.html](lumino.html) 里注释提到的 "rail-frame/content-frame" 模式作为
   参考实现。

7. **改动前后自检**：
   - 新颜色/圆角/字体是否已经在本文档"Style Guide"里有定义？没有就先复用现有
     的，而不是自创。
   - nav 的 active/hover 状态、pill 形状是否和其他页面保持一致？
   - 是否保留了 `prefers-reduced-motion` 处理？
   - 大改动后，直接在浏览器打开对应 `.html` 文件（`file://` 或本地静态服务器）
     肉眼核对效果，而不是只看代码。

8. **提交前**：这是一个部署到 GitHub Pages 的仓库（见 [CNAME](CNAME)）。不要
   假设有 CI/构建步骤 — 提交的 HTML 就是线上直接渲染的内容，改错一个标签就是
   线上事故，务必本地打开检查后再提交。
