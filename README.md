# Shop Cars Board

Simple browser-based board for tracking shop vehicles, who moved them, where they are, and current EV charge or gas level.

## Features

- Add vehicle entries with:
  - Vehicle name/id
  - Type (`EV` or `Gas`)
  - Current location
  - Driver
  - Charge/fuel percentage
  - Optional notes
- Edit or delete existing entries.
- Clear all entries with a confirmation step.
- Persists updates using browser `localStorage` so the board survives page refreshes.

## Run locally

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve with a local web server (recommended)

From this repo folder run:

```bash
python3 -m http.server 8000
```

Then visit:

- `http://localhost:8000`

## How to test it

1. Add a car entry and click **Save vehicle**.
2. Confirm a card appears in **Current board** with location, driver, and charge/fuel.
3. Click **Edit**, change values, then click **Update vehicle**.
4. Confirm the card updates and shows a fresh **Last updated** time.
5. Click **Delete** on a card and confirm it is removed.
6. Add 2+ cards, click **Clear all**, and confirm the board empties after confirmation.
7. Refresh the page after adding entries and confirm data is still there (localStorage persistence).

## Quick technical checks

Run this JavaScript syntax check:

```bash
node --check script.js
```
