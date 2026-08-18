# Blending Beatz — Website

Luxury Angampora-warrior themed site for the Blending Beatz brass band event (Senior Western Brass Band, Dharmapala Vidyalaya Pannipitiya), plus a school brass band registration page.

## What's inside
```
index.html          Main site — hero, about, event details, performers, schedule,
                     tickets, gallery, sponsors, venue, faq, contact
register.html        Band registration form (captain + group photo, 20 members)
css/style.css         Main site styles + design tokens
css/register.css      Registration page styles
js/main.js             Nav, embers, countdown, scroll reveal, FAQ, gallery filter
js/register.js         Member form generation, photo upload, progress bar, submission
assets/images/          logo.png, poster.png + cropped design assets
apps-script/Code.gs      Google Apps Script backend (Sheet + Drive + email)
apps-script/README.md   Backend deployment steps — do this first
```

## 1. Set up the backend first
Follow **`apps-script/README.md`** to connect your Google Sheet and Drive folder, and get your Web App URL. Paste that URL into `js/register.js` (`SCRIPT_URL`).

## 2. Fill in placeholder content
Before publishing, replace placeholders directly in `index.html`:
- **Performers** section — real photos (`assets/images/performers/...`), names, instruments, bios
- **Gallery** section — swap the sample images for real event/rehearsal photos
- **Sponsors** section — replace the "Your Logo" placeholders with sponsor logo images
- **Contact** section — real committee names, email, phone numbers, social links
- **Tickets** section — confirm prices and add real ticket purchase links
- `js/main.js` → `EVENT_DATE` — confirm the countdown target date/time is correct

## 3. Publish on GitHub Pages
1. Create a new GitHub repository (e.g. `blending-beatz`).
2. Upload all files in this folder, keeping the same structure.
3. Go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**.
5. Save. Your site will be live at `https://<your-username>.github.io/blending-beatz/` within a minute or two.
6. Registration page will be at `.../blending-beatz/register.html`.

## Design notes
- Palette: background `#151312`, antique gold `#c59a52`, maroon `#641e24`, ivory `#f1e5cf`, plus an ember accent `#d9622b` pulled from the poster's firelight.
- Signature motif: the "drum-rim" divider (brass-studded ring) marking section thresholds — echoes the wooden barrel emblem in the Blending Beatz logo, tying the warrior/rhythm/music story together visually.
- Type: Cinzel (display), Cormorant Garamond (body/prose), Jost (UI labels, nav, buttons).
- All animation respects `prefers-reduced-motion`.
