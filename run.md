# How to Run the FitTrack Project

## Prerequisites
- **Node.js** (includes npm) – version **14.x** or newer.
- A modern web browser (Chrome, Edge, Firefox, etc.).
- (Optional) Git – if you need to clone the repository.

## 1. Open a terminal (PowerShell)
```powershell
cd "C:\Users\tina\Downloads\Projects for Evaluation-20260514T094413Z-3-001\Projects for Evaluation\FitTrack- smart health tracker\FitTrack- smart health tracker"
```

## 2. Install dependencies (if a `package.json` exists)
```powershell
npm install
```
> This will install any dev tools such as `http-server`, `live-server`, or a Vite setup. If the project has no `package.json`, the command will finish quickly – no extra packages are required.

## 3. Serve the application locally
You must serve the files over HTTP (not via `file:///`). Choose one of the following methods:

### Option A – Quick built‑in server (no extra install)
```powershell
npx http-server . -p 8080
```
Open your browser and navigate to `http://localhost:8080/index.html`.

### Option B – Live‑server (auto‑reload)
```powershell
npm install -g live-server   # run once to install globally
live-server
```
This starts a dev server, opens the default page, and reloads automatically on file changes.

### Option C – Vite (if the project uses Vite)
```powershell
npm run dev
```
The script defined in `package.json` will start Vite (usually on `http://localhost:5173`).

## 4. Verify the app
1. Open the entry page (`index.html` or `login.html`).
2. After logging in (or using the dummy auth), you will be redirected to `diet.html`.
3. The **Diet page** now correctly:
   - Highlights the current day button.
   - Loads the proper weekly meals.
   - Shows a friendly message when a day has no meals.
   - Displays nutrition columns (`calories`, `protein`, `carbs`, `fats`).

## 5. Common troubleshooting
- **Blank page / script load errors** – Make sure you are accessing the page through `http://localhost:...` and not via a `file:///` URL.
- **`auth is not defined`** – Ensure `<script src="auth.js"></script>` is included **before** `diet.js` in the HTML.
- **Styles look broken** – Verify `<link rel="stylesheet" href="style.css">` exists in the HTML file.
- **Day buttons do not update** – Clear the browser cache (`Ctrl+F5`) or restart the dev server.

## 6. Optional development workflow
To get live reload while editing:
```powershell
live-server   # or use the Vite dev server if configured
```
Now any save triggers an automatic browser refresh, letting you see changes instantly.

---
*These instructions assume you are on Windows and have the necessary permissions to run `npm` commands.*
