# fi4cr-website

A functional, audio-first music frontend featuring a curated collection of electronic music styles, from "Swing D&B" to "Progresive Folk House" and beyond.

## Features

- **Hub-Centric Navigation**: A central "Hub" (`index.html`) showcasing featured releases, trending tracks, and core collections.
- **Dedicated Player**: A focused player experience (`player.html`) with deep links from the Hub.
- **Audio-First Design**: A clean, dark-themed interface focused on the playlist experience.
- **Glassmorphism UI**: Modern, translucent effects on headers and players.
- **Mobile-First**: Fully responsive layout with a fixed header and floating mini-player.
- **Dynamic Playlist Support**: Loads 50+ playlists dynamically from `playlists.json`.
- **Custom Cover Art**: Unique, AI-generated abstract artwork for each collection.
- **YouTube Integration**: Embeds YouTube videos seamlessly using the IFrame API.
- **Random Autoplay**: Automatically selects a random track on load and on playlist switch.

## Tech Stack

- **HTML5**: Semantic structure.
- **CSS3**: Vanilla CSS with custom variables for theming, gradients, and animations.
- **JavaScript (ES6+)**: Module-based logic for dynamic rendering and state management.
- **Assets**: Google Fonts (Spline Sans) and Material Symbols.

## Setup

1.  Clone the repository.
2.  Serve the directory using a local web server (e.g., `python3 -m http.server`).
3.  Open `http://localhost:8000` in your browser.
