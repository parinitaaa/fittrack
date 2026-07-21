# FitTrack – Smart Health Tracker

## Overview
FitTrack is a client‑side web application that provides a fitness dashboard, profile setup, diet recommendations, progress tracking, and reward management. All pages are built with plain HTML, CSS, and vanilla JavaScript (no build tools or server‑side code).

## Prerequisites
- A modern web browser (Chrome, Edge, Firefox, Safari).
- **Optional**: A local static web server for a better development experience (e.g., `node`, `python`). This is only needed if you want to avoid CORS restrictions while loading assets.

## Running the Application
You have two simple ways to launch the app:

### 1️⃣ Open directly in the browser (quick preview)
1. Navigate to the project root folder in File Explorer.
2. Double‑click `index.html` (or right‑click → **Open with** → your browser).
3. The dashboard will load and JavaScript modules (`auth.js`, `home.js`, etc.) will be executed automatically.

> **Note**: Some browsers may block local script loading due to security policies. If you encounter a blank page or console errors, use the static‑server method below.

### 2️⃣ Serve with a local static server (recommended)
#### Using Node.js (npm)
```bash
# If you do not have Node installed, download it from https://nodejs.org/
# From the project root folder run:
cd "C:/Users/tina/Downloads/Projects for Evaluation-20260514T094413Z-3-001/Projects for Evaluation/FitTrack- smart health tracker/FitTrack- smart health tracker"
# Install a minimal http‑server (one‑time)
npm install -g serve   # or use npx serve for no‑install
# Serve the folder
serve .
```
The command will display a local URL, e.g. `http://localhost:3000`. Open that URL in your browser.

#### Using Python (no npm needed)
```bash
# Python 3 must be installed.
cd "C:/Users/tina/Downloads/Projects for Evaluation-20260514T094413Z-3-001/Projects for Evaluation/FitTrack- smart health tracker/FitTrack- smart health tracker"
python -m http.server 8000
```
Then open `http://localhost:8000` in a browser.

## Project Structure
```
FitTrack- smart health tracker/
│   index.html          # Main dashboard entry point
│   style.css           # Global stylesheet (glassmorphism, gradients, etc.)
│   auth.js             # Authentication helper (localStorage mock)
│   home.js             # Core UI logic for dashboard
│   …
│   profile.html, diet.html, progress.html, reward.html   # Additional pages
│   profile.js, diet.js, progress.js, reward.js          # Page‑specific scripts
│   register.html, login.html, register.js, login.js      # Simple auth UI
```
All JavaScript files are plain modules that manipulate the DOM; no bundler is required.

## Customising / Extending
- To change the colour palette, edit the CSS variables in `style.css`.
- To add new pages, create a new `.html` file and a corresponding `.js` script, then add a navigation link in `index.html`.

## FAQ
**Q:** I get `Failed to load resource: net::ERR_FILE_NOT_FOUND` for scripts.
**A:** This happens when opening files directly (`file://`). Use the static server method above.

**Q:** Where is the user data stored?
**A:** The app uses `localStorage` in the browser; clearing the browser data will reset the profile.


