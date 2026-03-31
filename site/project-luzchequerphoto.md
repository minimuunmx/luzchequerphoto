# Luz Chequer Photo - Website Redesign

## Project Structure
- **Site files**: `luzchequerphoto/site/` (index.html, families.html, brands.html, styles.css, script.js)
- **Assets**: `luzchequerphoto/logo/`, `luzchequerphoto/porfolio/` (note: "porfolio" not "portfolio")
- **Dev server**: `npx serve luzchequerphoto -l 3848` then visit `/site/`

## Pages
- **index.html** - Homepage with split-hero (two panels linking to Families/Brands), quote, about, contact
- **families.html** - Family photography page with hero, intro, full gallery (30 photos), about, contact
- **brands.html** - Brand photography page with hero, intro, gallery (11 photos), about, contact

## Brand Colors (from Mesa de trabajo)
| Color       | HEX       | CSS var        |
|-------------|-----------|----------------|
| Lime        | #E0EABC   | --lime         |
| Mint        | #ABC0B9   | --mint         |
| Teal        | #5F929F   | --teal         |
| Navy        | #315065   | --navy         |
| Light Blue  | #A7C1E1   | --light-blue   |
| Cream (bg)  | #F7F3EE   | --cream        |

## Fonts
- Display: Cormorant Garamond (Google Fonts)
- Body: Inter (Google Fonts)

## Features
- EN/NL language toggle (all text via data-en/data-nl attributes)
- Portfolio lightbox with keyboard nav (arrows, escape)
- Scroll-triggered fade-in animations
- Active nav link tracking via IntersectionObserver
- Mobile hamburger menu with full-screen overlay
- Responsive: desktop (side-by-side), tablet, mobile (stacked)
