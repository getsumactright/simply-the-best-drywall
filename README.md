# Simply The Best Drywall

Website for Ray Abreu's drywall repair business in Elk Grove, CA. One scrolling page, static HTML/CSS/JS, no build step. Hosted on GitHub Pages.

Design direction: **Raking Light** (dark, one texture fills the hero). It started as Option B of round 2 in the client design workspace, which keeps its own untouched copy of the demo.

## Layout

- `index.html`: the whole site (hero texture switcher, texture matching, services, work, reviews, Ray, contact)
- `css/site.css`: all styles
- `js/site.js`: header, texture switcher, before/after sliders, reveal, video loops, contact form
- `assets/img/`, `assets/video/`: Ray's own photos and clips, plus six generated example textures (`tex-*.webp`, always labelled as examples) and `og.jpg` for link previews
- `404.html`, `robots.txt`, `sitemap.xml`

## Preview

    python3 -m http.server 8850

Then open http://localhost:8850/.

## Before launch

1. **Contact form.** GitHub Pages can't receive form posts. Until an endpoint is set, submitting opens a pre-filled text message to Ray. To send to his inbox, create a form on a service such as Formspree or Web3Forms and put its URL in `data-endpoint` on the `<form>` in `index.html`. The form posts JSON (`first`, `last`, `email`, `phone`, `details`).
2. **Domain.** Replace `https://getsumactright.github.io/simply-the-best-drywall/` in `index.html` (canonical, Open Graph, JSON-LD), `robots.txt` and `sitemap.xml` with the real domain.
3. **Indexing.** Remove the `noindex` meta tag in `index.html` and `404.html` when the site goes live.
4. **Confirm with Ray.** Drywall since 1996 (the old site says "over 24 years"), that he does knockdown and skip trowel, his email address, the service area beyond Elk Grove, and opening hours (from Yelp, pulled 2026-10-01).

## Content rules

Wording about Ray comes from his current site (stbdrywall.com) and Yelp listing. Job photos and videos are his. No invented reviews, ratings or claims; reviews link out to Yelp and HomeAdvisor. The texture close-ups are generated examples and must stay labelled as such.
