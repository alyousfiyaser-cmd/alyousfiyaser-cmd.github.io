# Yaser Alyousfi — Executive Personal Profile (GitHub Pages export)

A complete static, multi-page export of the executive profile website.
No build step, no framework, no server — plain HTML, CSS, and a small vanilla JS file.

## Files — all flat, no subfolders

Every file sits at the top level, so you can select them **all at once** in GitHub's
upload dialog (Ctrl+A) and drop them into the repository root. No folders involved.

```
index.html          Home — hero, mandate, navigation
profile.html        Executive profile + what leadership gains
scope.html          Executive scope (nine core responsibilities)
execution.html      Execution framework + how I work
background.html     Professional foundation + interests
contact.html        Contact
styles.css          Full design system (hand-authored)
app.js              Menu, scroll reveals, page-transition fallback
yaser-alyousfi-portrait.png
og-banner.png       Social preview image
favicon.svg
.nojekyll           Tells GitHub Pages to serve files as-is
```

> `.nojekyll` is an empty file whose name starts with a dot. Windows Explorer hides it
> by default — turn on **View → Hidden items** before selecting, or upload it separately.
> Without it GitHub Pages still works here, but it is good practice to include it.

## Publish on GitHub Pages

1. In the repository click **Add file → Upload files**.
2. Select **all twelve files** at once (open this folder, press Ctrl+A) and drop them in.
   They must land in the repository root, next to each other — not inside a folder.
3. Write a commit message and press **Commit changes**.
4. Open **Settings → Pages**, choose **Deploy from a branch**, select the branch and
   **/(root)**, then save. The URL appears after a minute or two.

For a repository named `<username>.github.io` the site is served at
`https://<username>.github.io/`. Re-uploading the same file names later overwrites them,
so updates are just another upload.

All paths are relative, so the site works from a project subpath
(`username.github.io/repo/`) as well as from a custom domain.

## The portrait backdrop

Every page carries the same portrait as a fixed, masked backdrop
(`<div class="backdrop">` + `.backdrop` in `styles.css`). It is anchored to the
viewport, so it holds perfectly still while the content scrolls over it. Panels, cards
and the footer are deliberately semi-transparent, so the portrait reads faintly through
the whole page without ever competing with the text: a horizontal scrim keeps the
reading column clean, and the image only gains presence toward the right edge.

Cream sections carry the same portrait as a printed watermark
(`.section--light::before`, `mix-blend-mode: multiply` over a fixed background), so the
image continues across light and dark sections alike.

On the home page the framed portrait leads, and the backdrop fades in only once you
scroll past the hero (`body.page-home.past-hero`) so the face is never doubled.

Tuning: `.backdrop img { opacity }` for dark pages, `.section--light::before { opacity }`
for cream sections, and the `mask-image` gradients on both to change how far left the
image reaches.

## Page transitions

Navigation uses the native **cross-document View Transitions API**
(`@view-transition { navigation: auto; }`). The outgoing page dims and drifts back while
the incoming page is revealed with a bottom-up `clip-path` wipe — and because the header
and the portrait backdrop are pulled out of the snapshot with their own
`view-transition-name`, they stay perfectly still: only the content wipes over the
portrait, which surfaces at full strength for the length of the transition. A thin
gold-to-teal line sweeps across the top on arrival.

Browsers without the API fall back to an equivalent JavaScript wipe in `app.js`.
Both paths respect `prefers-reduced-motion`.

## Typography

- Headings: **Playfair Display** (Google Fonts)
- Body / UI: **Inter** (Google Fonts)

Both are loaded from `fonts.googleapis.com` with `display=swap`, and a full system
serif / sans fallback stack is defined, so the layout is stable even before the
webfonts arrive. To remove the external dependency, download the two families,
put the `.woff2` files beside these files, add `@font-face` rules at the top of
`styles.css`, and delete the Google Fonts `<link>` tags from each page.

## Editing

Colors, spacing, and fonts are all CSS custom properties defined in `:root` at the
top of `styles.css` — change a token there and it updates across every page.
Light (cream) sections simply re-declare those same tokens inside `.section--light`.
