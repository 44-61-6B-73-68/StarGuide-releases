# StarGuide landing page: design log

Static site: `index.html`, `css/style.css`, `js/main.js`, `fonts/` (Cormorant Garamond + Inter, OFL), `img/` (WebP, rendered by the app from one phone photo), `favicon.svg`. No external requests.

## Round 1: bold foundation
Critique: the old page was a system-font bootstrap look: flat cards, no hierarchy, no depth, nothing interactive beyond a basic slider.
Changed: full rewrite. Design tokens (colour, radius, spacing, shadow, easing), serif display headlines with gold italic accents, sticky blurred nav with active-section highlight and scroll progress bar, pointer-reactive canvas starfield in the hero (pauses off-screen / reduced-motion), before/after slider with 6 style chips crossfading (drag, touch, keyboard), 3-step "how it works" with animated progress, tabbed feature showcase, lightbox gallery of 8 styles, OS-aware download section with install steps and SmartScreen note, animated FAQ, footer credits. Rendered 4 extra styles (Blueprint, Watercolor, Cinematic, Poster); all images optimised to WebP.

## Round 2: mobile + trust
Critique: on a phone the hero slider sat far below the fold and the nav links vanished entirely.
Changed: mobile menu (burger, Esc to close), trust strip (offline / photos stay put / no account / free) replacing hero pills, compact mobile hero and side-by-side CTAs.

## Round 3: hero scale + interaction test
Critique: the hero visual was undersized next to a big headline; the "drag" hint cost vertical space. Tested drag, chips crossfade, tabs (arrow keys), FAQ, lightbox (arrows): all work.
Changed: slider now up to 70vh tall, "Drag to compare" pill lives inside it and fades on first touch, caption now states a real fact (961 stars matched in this photo), subtle mouse-only 3D tilt on the slider.

## Round 4: feature panels with substance
Critique: three of six feature tabs were just chip clouds; looked placeholder-ish. Also two ticks claimed things I could not verify.
Changed: opt-in toggle visual (all off), exposure-pile + filenames visual, export "file tiles". Removed unverifiable claims from copy.

## Round 5: real imagery in "how it works"
Critique: step illustrations were generic icons; step cards felt stock.
Changed: step 1 shows the real photo in a drop zone, step 3 three real rendered styles. Fixed an overflow bug in the art boxes.

## Round 6: gallery captions + download layout
Critique: style names only appeared on hover (invisible on touch); the download "specs" card was a tall empty box that repeated the Windows card.
Changed: captions always visible; "At a glance" list (system, size, install, internet, account, price) replaces it; install steps text fixed.

## Round 7: accessibility + no-JS
Critique: with JS off only the first feature tab was reachable; "planned" OS cards were dimmed via opacity (contrast risk).
Changed: no-JS fallbacks (all feature panels visible, tabs hidden), dashed non-opacity styling for planned OSes. Audited alt text, headings, fonts, text contrast (all body text passes 4.5:1; gold-gradient buttons ~11:1), no horizontal scroll at 360/768/1280/1920.

## Round 8: tablet/desktop polish + hero life
Critique: scrollbar on the mobile tab strip, hero looked small on 1920, hero loaded all at once.
Changed: hidden tab scrollbar with edge fade, staggered hero entrance, glow behind the slider changes colour with the chosen style, wider layout and bigger headline at 1600px+, no idle image prefetch on phones or Save-Data.

## Round 9: closing CTA + chip bug
Critique: page ended abruptly after the FAQ; choosing a style chip during the intro sweep left the slider parked at 100% so the new style was invisible.
Changed: closing "Find out what is in your sky" band with the download button, footer back-to-top, chips now glide the slider back to centre when the overlay would be hidden.

## Round 10: final verification
Critique: on 360px the 2-up gallery captions covered too much of the images.
Changed: compact mobile captions. Verified: no console errors, no external requests, download href unchanged, no horizontal scroll at 360/768/1280/1920, keyboard (slider, tabs, FAQ, lightbox, menu) works.

## Known weaknesses / next ideas
- Fonts are TTF (no woff2 tool available offline); subsetting would save about 250 KB.
- Real app UI screenshots are not shown yet (only rendered output); a clean screenshot of the main window would add credibility.
- The source photo is dark, so the "before" half looks nearly black; a brighter example photo would show the contrast better.
- No real-device testing (iOS Safari / Android Chrome) yet; backdrop-filter and dialog fallbacks unchecked.
- Slider glow transition between styles is instant, not eased.

## Round 11: convincing before/after + real constellations
Critique: the raw photo is nearly black, so the slider's "before" half proved nothing; the starfield was generic dots.
Changed: "Your photo" side is now a brightened preview (glow subtracted, gentle curve, from the original TIFF), clearly labelled "brightened"; the label is a button that toggles to the photo as shot. Hero background is now Scorpius, Sagittarius and Ophiuchus drawn as star-to-star lines that draw themselves and glow as the pointer nears (plus a periodic self-draw for touch screens); still pauses off-screen, static under reduced motion.

## Round 12: real app screenshots, poster/cinematic, fonts
Critique: no proof of the actual interface; Poster and Cinematic missing from the slider; fonts heavy; mobile nav dead without JS.
Changed: new "Inside the app" section with two real StarGuide window screenshots (Neon / Atlas; file name blanked, caption notes Auto-enhance is on). Cinematic and Poster join the slider as contained cards on a matching background. Fonts subset to Latin and converted to WOFF (about 430 KB to 120 KB; no brotli available for woff2). Slider glow colour now eases between styles (registered CSS properties). No-JS mobile nav shows the links as a second row.

## Rounds 13-14: rhythm, micro-interactions, real UI crops
Critique: sections were visually identical blocks; buttons and nav felt static; the "Improves the photo" tab used a made-up toggle graphic.
Changed: star-studded hairline between sections, nav underline on hover, sheen sweep on gold buttons, balanced paragraph wrapping. The Improve tab now shows a real crop of the app's Enhance panel (its own text says the photo is left as is unless you ask).

## Rounds 15-20: verification sweep
Checked 360 / 768 / 1280 / 1920: no horizontal scroll, no console errors. Reduced motion exercised by stubbing matchMedia in a throwaway page (slider starts at 50%, constellations drawn static, no animation loop); CSS reduced-motion rules reviewed but not browser-emulated. No-JS look checked by forcing the class: nav links become a scrollable second row, all feature panels show. Mobile: left/right slider tags no longer collide, chips tightened.

## Remaining weaknesses
- No woff2 (brotli not available); WOFF subset is about 120 KB total.
- Slider "before" is a processed preview of the TIFF, not the raw file; it is labelled and the toggle shows the real dark one.
- App screenshots show Auto-enhance on (grey, flat photo); a hand-graded example would look richer.
- Screenshot text is small on phones (no zoom/pan yet).
- The constellation shapes are hand-approximated, not catalogue-exact.
- No real-device (iOS/Android) testing.

## Round 21: app screenshots without editing
Critique: the screenshots showed Auto-enhance on, which contradicts "photo stays as shot".
Changed: re-captured both windows from a copy of the photo with editing off (natural look; style thumbnails now show the real photo too); file name blanked. Tap or click opens a lightbox with a Zoom/Fit toggle (full 2561 px images) so UI text is readable on phones. Enhance crop recaptured (switch off, 0%).

## Round 22: break the formula
Critique: every section was a centred heading over a grid.
Changed: numbers row of true facts (8 styles, 961 stars matched in the example, 6 export routes, 0 accounts) with count-up; one full-bleed statement band ("Your sky, named. Your photos stay yours."); editorial split headings for How it works, Features and Styles; FAQ as sticky heading plus list; bento gallery (Atlas large, Educational wide).

## Round 23: constellation behind text
Critique: Scorpius ran through the headline.
Changed: canvas clips out the hero copy block (with padding), so lines pass behind the text instead of through it; soft cursor glow follows the pointer.

## Round 24: polish and robustness
Changed: shimmer placeholders and fade-in for lazy images, press states on buttons/chips/tabs, lining numerals (Cormorant re-subset with lnum), CSS reduced-motion rules for the new pieces, minimum slider height on very short windows, width/height on all hero images, copy tightened. Audit: 0 external requests, 27 requests (about 616 KB including idle prefetch of the 8 full-size style images; about 280 KB before it), no duplicate ids, no heading level skips, one main/nav/footer landmark, every button and link named.

## Rounds 25-28: cold review passes
Art-director pass 1: step cards still used a near-black photo and a generic diagram. Fixed: the drop zone and the "stars recognised" card now use the brightened preview, with the constellation line drawn over it. Verified reduced-motion CSS by injecting its rules (hero visible, no animations, sheen off, reveals visible) and the JS path (static sky, slider at 50%). Checked a very wide and short window (1600x520): no horizontal scroll, slider keeps a 340 px minimum height.

## Rounds 29-30: final review
Checked 360 / 768 / 1280 / 1920 again, console clean, zero external requests, Download href unchanged (Windows card and closing call-to-action). Nothing pushed or published.

## File layout and preview (README note)
- `index.html`: the whole page (semantic HTML, no build step).
- `css/style.css`: design tokens (colour, radius, spacing, shadow, easing) at the top, then components, then responsive and reduced-motion rules.
- `js/main.js`: vanilla JS only: nav, scroll reveal, before/after slider with style chips and brightening toggle, feature tabs, FAQ animation, lightbox with zoom, count-up numbers, OS-aware download text, constellation canvas. Everything degrades without JS.
- `img/`: WebP images rendered by the app from one phone photo (`*-sm.webp` are 560 px thumbnails), `original-bright.webp` (labelled brightened preview), `original.webp` (as shot), `app-*.webp` real window screenshots (`-full` for the zoom view), `og.jpg` for social previews.
- `fonts/`: Cormorant Garamond and Inter (OFL), subset to Latin, WOFF.
- `favicon.svg`: star mark.
- Preview locally: from this folder run `python -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765/ (opening index.html from disk also works for a quick look, but use the server for accurate loading).
- Keep the Download button href as `https://github.com/44-61-6B-73-68/StarGuide-releases/releases/latest`.
