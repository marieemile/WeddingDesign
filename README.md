# Marie’s Dream Wedding

A static website for Marie & André’s wedding. The home page is the interactive **design system**: colour ramps, type, buttons, tags, the guest list, tabs, forms, toasts, cards, doodle icons and tokens, with animation throughout. Behind it is the **brand kit**, with colour, type, the M & A wordmark, 88 doodles, monograms, the painted watercolour pieces, tee artwork, and a **template studio** for menus, signature drinks, table numbers, place cards, the order of the day and the welcome sign.

There is no build step. It's plain HTML, CSS and JS, and it deploys to Vercel as-is.

## Put it on Vercel

**Option A: drag and drop (no tools needed)**
1. Go to <https://vercel.com/new> and sign in.
2. Choose to deploy without Git and drag this whole `design-kit` folder in.
3. Leave the framework preset as **Other**, with no build command and no output directory. Then deploy.

**Option B: the Vercel CLI**
```bash
npm i -g vercel
cd ~/Desktop/Claude/Planner/design-kit
vercel          # first time: answer the prompts, framework "Other"
vercel --prod   # publish
```

**Option C: through GitHub**
Push this folder to a repo, then import the repo at vercel.com/new. Every push redeploys it.

## What's where

| Path | What |
|---|---|
| `index.html` | The design system: “Marie’s Dream Wedding”, the home page |
| `kit.html` | The brand kit: anchor, colour, type, logo, monograms, doodles, painted pieces, stationery, tees, rules, downloads |
| `studio.html` | The template studio. Edits are saved in the visitor's own browser |
| `pages/` | The long-form brand book, the table suite and the confirmation card, as they were |
| `data/kit-data.js` | Every doodle, the wordmark and the monograms as inline SVG, recoloured through `currentColor` |
| `data/painted.js` | Where each painted piece sits on the approved menu cards, as % of the card |
| `assets/painted/` | The watercolour pieces as transparent PNGs, plus the A5/A6 painted border |
| `assets/doodles/`, `assets/logo/`, `assets/tees/` | Source SVGs (and tee PNGs) |
| `assets/tables/` | The 20 table-number paintings, at web resolution |
| `downloads/` | Ready-made zips linked from the Downloads section |

## Printing from the studio

* **Print or save as PDF** sets the page size for the template (A5, A6 or A4) with no margins. In the print dialog, choose *Save as PDF*, scale **100%**, and turn **background graphics on**.
* **Download PNG** paints the card at 300 dpi. It loads a small library from jsDelivr, so it needs an internet connection.
* The table paintings in this kit are compressed for the web (900 px wide). For the final print run, use the originals in `Stationary/tablenumber/ChatGPT to use/`.
* The painted pieces were cut from the original illustrations at about 2× their on-card size. They're sharp at A5, but they aren't meant to be blown up to poster size.

Fonts are Cormorant Garamond, Jost and WindSong, all free from Google Fonts.
