# Muhammad Bin Tariq — Research portfolio

A static Astro portfolio with an introduction and four epochs (Mentors, Research, Projects, About), a canvas loss landscape linked to scroll position, a growing noisy loss curve, a portrait, and a downloadable CV.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The static website is emitted to `dist/`.

## GitHub Pages

Live site: https://muhammadbintariq.github.io/

The repository uses GitHub Actions as its Pages publishing source. Pushing to `main` runs the official Astro build action with Node.js 24 and the committed npm lockfile, then publishes `dist/` to GitHub Pages. A deployment can also be started manually from the Actions tab. No repository base path is required for this account-level website.

To update the website, edit the source, check it locally, and push to `main`. Local preview files and installation directories are excluded from the repository.

## Edit

- Introduction, mentors, and About: `src/pages/index.astro`
- Research and project entries: `src/data/work.ts`
- Work entry layout and illustrative figures: `src/components/WorkItem.astro`
- Colors, fonts, layout: `src/styles/global.css`
- Landscape and scroll animation: `src/scripts/landscape.ts`
- Full-page route mapping: `src/scripts/scroll-path.ts`
- Downloadable CV: `public/Muhammad-Bin-Tariq-CV.pdf`

Project figures are illustrative schematics, not experimental plots. Research descriptions are based on the supplied CV and motivational letter. The SOP itself is not included in the site. Only confirmed public repository links are displayed. The supplied CV is included unchanged.

Typography follows Jayden Teoh's website: self-hosted Space Mono throughout, with regular body text, bold headings, and italic book titles. The font's open licence is included under `public/fonts/`. A linked design and website-format credit appears in the footer. The portrait is from the supplied friend website; replace `public/headshot.jpeg` to update it.

The supplied Elegance palette is used for light mode (white, black, navy, gray, amber); Coastal is used for dark mode (charcoal, slate blue, pale blue/cyan, coral). The exact hex values are defined by CSS variables in `src/styles/global.css`. The header theme toggle remembers the choice locally; the first visit follows the system preference. The same variables control the landscape, ball, and loss rail. The loss curve is an illustration of reading progress, not recorded training data. Four asymmetric valleys correspond to Mentors, Research, Projects, and About, with widths proportional to the rendered section lengths. Current LLM research is described only by a brief overview; the site does not include experimental findings or methodological details from that work.

`src/scripts/interactions.ts` handles the theme and decorative pointer accent. The native cursor stays visible. The dot uses time-based smoothing and becomes a thin ring over links and buttons. It is disabled for touch/coarse pointers and reduced-motion preferences.

The heading types and erases “Muhammad Bin Tariq”, “ML Researcher”, and “Aspiring AI Scientist” in sequence, holding each completed phrase for two seconds. A reserved heading footprint prevents layout shifts. Reduced-motion preferences show the name statically. Academic highlights are placed beside the heading and above the portrait, with a stacked layout on mobile.

The ball starts at the first outer ridge when the page is at the top, reaches each valley at its section anchor, and travels from the About valley to the far edge during the remaining scroll. The final landscape position is reached only at the page bottom; scrolling upward reverses the same route.

The site has no analytics, tracking, contact backend, or account requirements in its source. Hosting access controls are configured separately. Reduced-motion preferences disable interpolated animation and smooth scrolling.
