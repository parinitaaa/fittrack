# Bugs Report – FitTrack Smart Health Tracker

## Overview
This document enumerates the issues discovered while reviewing the **FitTrack** codebase and outlines the planned fixes. All identified bugs are grouped by component and include a short description, reproducibility notes, and the intended remediation.

---

## 1. Navigation & Routing
| File | Issue | Impact | Fix Plan |
|------|-------|--------|----------|
| `index.html` | Navigation links use relative paths (`index.html`, `progress.html`, etc.). When the app is served from a sub‑directory, links may break. | Users may see 404 pages. | Convert links to root‑relative (`/progress.html`) or use a base `<base href="./">` tag. |
| `home.js` | After completing the profile, a redirect to `diet.html` is scheduled with `setTimeout`. If the user reloads quickly, duplicate redirects can occur. | Possible navigation loop / flash of wrong page. | Guard the redirect with a flag stored in `localStorage` (`profileRedirectDone`). |

---

## 2. Authentication (`auth.js`)
| Issue | Description | Fix |
|-------|-------------|-----|
| **Email existence check** | Arrow function syntax displayed as escaped (`u =\u003e`). Works but is hard to read and may cause lint warnings. | Re‑write as `u => u.email === email`. |
| **Password validation** | Uses `password.length >= 6` – acceptable, but the UI expects at least **8** characters (common standard). | Update validation to `>= 8` and adjust error messages. |
| **LocalStorage key typo** | In `login.js` the alert info element is selected with `.alert-info` but the HTML uses `class="alert alert-info"`. The selector works, but the class order may cause CSS specificity issues. | Standardise to `alert alert-info` and use `document.querySelector('.alert-info')` consistently. |
| **Logout redirection** | `auth.logout()` redirects to `login.html` via `window.location.href = 'login.html';`. If the app is hosted under a sub‑path, this may break. | Use `window.location.href = './login.html';` or compute base path dynamically. |

---

## 3. Profile Page (`profile.html` & `profile.js`)
| Issue | Details | Fix |
|-------|---------|-----|
| **Email field disabled** | `<input type="email" id="email" disabled>` prevents copying the email. Users may want to copy it. | Change to `readonly` instead of `disabled`. |
| **Missing validation** | `saveProfile()` only checks name length; height, weight, and fitness goal are not validated (e.g., non‑numeric input). | Add numeric validation for height/weight and ensure a selection for fitness goal. |
| **Potential XSS** | Directly inserts user‑provided values into the DOM (e.g., `innerHTML`). If a malicious name includes HTML, it could be rendered. | Escape user input before inserting or use `textContent`. |
| **No password strength check** | `changePassword()` only shows an alert; no actual password update logic. | Implement proper password update via `auth.updatePassword(newPass)` (add method) and validation. |

---

## 4. Diet Page (`diet.js`)
| Issue | Explanation | Fix |
|-------|-------------|-----|
| **`loadWeeklyMeals` only loads Monday** | Calls `loadDayMeals('monday')` regardless of selected day, so the weekly view never changes. | Bind day‑button clicks to `loadDayMeals(this.dataset.day)` and remove the hard‑coded call. |
| **Missing error handling** | If `weeklyData[day]` is undefined, the UI shows nothing silently. | Add fallback to a default message or the Monday data with a warning. |
| **Nutrition data inconsistency** | Weekly meals omit `carbs` and `fats` fields, causing `undefined` in the template. | Extend each meal object with `carbs` and `fats` or adjust template to handle missing values. |

---

## 5. General UI/UX
| Issue | Impact | Fix |
|-------|--------|-----|
| **Hard‑coded color palette** | `style.css` uses static colors, violating the premium aesthetic guidelines (no modern gradients or glassmorphism). | Introduce CSS variables for primary/secondary colors, add subtle gradients and glass effects. |
| **Missing responsive meta tags** | Only `viewport` meta present; no responsive utilities. | Add media queries to ensure mobile friendliness. |
| **Form error elements not hidden initially** | `.form-error` elements are always present causing layout shift. | Add `display:none` by default and toggle `show` class. |

---

## 6. Code Quality & Maintenance
| Issue | Description | Remedy |
|-------|-------------|--------|
| **Duplicated script imports** | Every HTML file imports `auth.js` individually. If auth logic changes, updates must be replicated. | Centralise common scripts via a shared layout or include them once in a base template. |
| **Lack of linting configuration** | No `.eslintrc` – style inconsistencies may arise. | Add ESLint with recommended rules and run it as part of development. |
| **No unit tests** | No automated tests for critical functions (e.g., `auth.register`, `login`). | Introduce Jest tests for authentication and UI utilities. |

---

## 7. Planned Fix Implementation Summary
1. **Routing fixes** – Update navigation links and add `<base>` tag.
2. **Auth improvements** – Refactor arrow functions, tighten password rules, standardise selectors, and make logout path robust.
3. **Profile enhancements** – Change email to `readonly`, add validation, escape user data, implement password update flow.
4. **Diet page overhaul** – Remove hard‑coded Monday load, correctly bind day buttons, ensure full nutrition data.
5. **Design refresh** – Introduce CSS variables, gradients, glassmorphism, and responsive layouts.
6. **Quality upgrades** – Add ESLint config, centralise script imports, write Jest tests for auth.

Each fix will be implemented in a separate commit with corresponding unit tests and UI verification. The changes will be documented in the project’s `INSTRUCTIONS_TO_RUN.md` (or similar) to keep the setup steps up‑to‑date.

---

*Generated by Antigravity – your AI coding assistant*
