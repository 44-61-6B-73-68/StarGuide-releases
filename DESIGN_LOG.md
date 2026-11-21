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
