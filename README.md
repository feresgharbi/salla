# RIHA Maison — Salla theme

The RIHA storefront design (white and gold, a story for every fragrance, calm scroll motion) as a Salla **Twilight** theme.

It is built on Salla's official starter theme **Raed** (MIT licence), so every store feature keeps working: real cart and checkout, Mada / Apple Pay / Tabby / COD from the Salla dashboard, product options, customer account, wishlist, reviews, offers, search, multi-language and currencies. The RIHA design is layered on top.

## What changed from Raed

| Area | File |
|---|---|
| Brand fonts (Italiana, El Messiri, Tajawal, Jost), body classes, RIHA script | `src/views/layouts/master.twig`, `src/assets/fonts/` |
| Floating capsule header, announcement line, text logo | `src/views/components/header/header.twig` |
| Footer with centred logo | `src/views/components/footer/footer.twig` |
| 9 homepage sections (editable in the theme editor) | `src/views/components/home/riha/*.twig` + `twilight.json` |
| Product page: big title, French name from the product subtitle, notes pyramid, service details | `src/views/pages/product/single.twig` |
| Category / listing page heading | `src/views/pages/product/index.twig` |
| Static pages (e.g. the house story) | `src/views/pages/page-single.twig` |
| All RIHA styles (plain CSS, easy to edit) | `src/assets/styles/06-riha/_riha.scss` |
| Motion, parallax, header hide on scroll, notes pyramid | `src/assets/js/riha.js` |

Raed's own homepage sections are still available in the editor, just not added by default.

## Run it

You need Node 22+, pnpm and the Salla CLI, plus a Salla Partners account with a demo store.

```bash
npm i -g @salla.sa/cli pnpm
pnpm install
salla login
salla theme preview      # builds and opens the theme on your demo store with live reload
```

The `public/` folder is already built and included, so the theme works as soon as it's pushed. Push the folder to a GitHub repo, then `salla theme push` (or connect the repo in Salla Partners → Themes). If you change files in `src/`, rebuild with `pnpm run production` before pushing.

**Homepage:** by default it shows the full RIHA page with all the original text. To edit sections one by one in the theme editor, turn on "تعديل أقسام الرئيسية من محرر القالب" in theme settings. Paste your story page and discovery box links in the settings too.

## Homepage sections (theme editor → Home)

1. **Hero** — photo, small line, big name, Arabic line, button.
2. **Intro** — one large sentence and a Latin signature.
3. **Fragrance universes** — one panel per fragrance: arched photo, Latin + Arabic name, story, top / heart / base notes, price line, button, panel colour (HEX, e.g. `#FAF2E2`). Choose the product as the button link.
4. **Names marquee** — fragrance names scrolling across.
5. **Collection** — product slider. Pick products, or a category, or leave empty for the latest products.
6. **Heritage** — parallax photo, two dates (2021 Tunis → 2026 Riyadh), text and link.
7. **Craft** — three arched images with titles.
8. **Discovery box** — image, chips, button (link it to the discovery box product).
9. **Services** — icon tiles (sealed bottles, gift wrap, delivery, payments).

The default photos are Unsplash stock from the static site. Replace them with RIHA's own shoot in the editor.

## Theme settings (theme editor → Settings → "هوية ريحا")

- Text logo on/off, logo text and tagline (switch off to use the uploaded logo).
- Announcement line (leave empty to hide).
- Brand fonts on/off, scroll motion on/off, hide header on scroll.
- Footer tagline.
- Product page: delivery, returns and payment paragraphs.

Set the store's main colour in Salla to **#1B1A18** so Salla's own buttons and badges match.

## Products: how to fill them so the design shows

- **Name**: Arabic name, e.g. `عطر أوريا`.
- **Subtitle** (العنوان الفرعي): the French name, e.g. `Auréa`. It shows under the title in the Italiana font, on product cards and the product page.
- **Description**: write the story, then one line per note:

  ```
  الافتتاحية: فانيليا
  القلب: لافندر
  القاعدة: حبوب التونكا
  ```

  The theme turns these lines into the notes pyramid and hides the raw lines. English or French labels also work (Top / Heart / Base, Notes de tête / cœur / fond).
- **Sizes** (50 / 100 ml): use Salla product options as usual.
- **Promotion title** (e.g. `عرض الافتتاح`) shows as the gold pill on the card.

## Not carried over from the static site

- The static cart drawer and the shop filter chips: Salla's real cart and Salla's filters replace them.
- The newsletter form: Salla has no built-in newsletter, so add one with a Salla app if needed.
- The `story.html` page: create it as a Salla page (Pages → New page) and link it from the menu and the Heritage section.
