# fi4cr-website

A functional, audio-first music frontend featuring a curated collection of electronic music styles, from "Swing D&B" to "Progresive Folk House" and beyond.

## Directory Structure

*   **`development/`**: Contains the source code and raw assets. **Make all edits here.**
*   **`production/`**: The deployment target. This directory is automatically generated/synced from `development/`.

## Deployment

To deploy changes from `development` to `production`, run the included script:

```bash
./deploy_to_production.sh
```

This script:
1.  Syncs all files from `development/` to `production/` (excluding `playlists.json`).
2.  Runs `filter_playlists.py` to process `playlists.json`.
3.  **Filters out** any songs scheduled for publication more than **1 month** from the current date.

## Local Development

1.  Navigate to the development directory:
    ```bash
    cd development
    ```
2.  Start a local server:
    ```bash
    python3 -m http.server 8086
    ```
3.  Open `http://localhost:8086` in your browser.

## Features

- **Hub-Centric Navigation**: A central "Hub" (`index.html`) showcasing featured releases, trending tracks, and core collections.
- **Dedicated Player**: A focused player experience (`player.html`) with deep links from the Hub.
- **Dynamic Playlist Support**: Loads 50+ playlists dynamically from `playlists.json`.
- **Custom Cover Art**: Unique, AI-generated abstract artwork for each collection.
- **Smart Filtering**: Automatically hides future releases (via the deployment script) to keep the "New" section relevant.
- **Glassmorphism UI**: Modern, translucent effects on headers and players.
- **Mobile-First**: Fully responsive layout.

## Tech Stack

- **HTML5**: Semantic structure.
- **CSS3**: Vanilla CSS with custom variables for theming.
- **JavaScript (ES6+)**: Module-based logic.
- **Python**: Used for build/deployment logic (`filter_playlists.py`).
