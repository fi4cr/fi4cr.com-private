# fi4cr-website

A functional, audio-first music frontend for the "Swing D&B" and "Ragga D&B" collections.

## Features

- **Audio-First Design**: A clean, dark-themed interface focused on the playlist experience.
- **Glassmorphism UI**: Modern, translucent effects on headers and players.
- **Mobile-First**: Fully responsive layout with a fixed header and floating mini-player.
- **Dynamic Playlist Support**: Loads playlists dynamically from `playlists.json`.
- **Custom Cover Art**: Unique, generated artwork for each playlist ("Swing D&B" and "Ragga D&B").
- **YouTube Integration**: Embeds YouTube videos seamlessly using the IFrame API.
- **Random Autoplay**: Automatically selects a random track on load and on playlist switch.
- **Playback Controls**: Shuffle and play buttons integrated with the YouTube player.

## Tech Stack

- **HTML5**: Semantic structure.
- **CSS3**: Vanilla CSS with custom variables for theming and animations.
- **JavaScript (ES6+)**: Module-based logic for dynamic rendering and state management.
- **Assets**: Google Fonts (Spline Sans) and Material Symbols.

## Setup

1.  Clone the repository.
2.  Serve the directory using a local web server (e.g., `python3 -m http.server`).
3.  Open `http://localhost:8000` in your browser.
