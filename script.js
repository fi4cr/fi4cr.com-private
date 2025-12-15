document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('main-player');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const playlistContainer = document.getElementById('playlist-container');
    const pageTitle = document.getElementById('page-title');
    const headerTitle = document.getElementById('header-title');
    const playlistSelect = document.getElementById('playlist-select');
    const trackCount = document.getElementById('track-count');
    const heroImage = document.getElementById('hero-image');
    const miniPlayerImg = document.getElementById('mini-player-img');

    let allPlaylists = [];

    // Map Playlist Names to Image Files
    // Using partial matching since names might vary slightly
    const playlistArt = {
        "Swing D&B": "cover_swing_dnb.png",
        "Ragga D&B": "cover_ragga_dnb.png",
        "default": "cover_swing_dnb.png" // Fallback
    };

    function getArtForPlaylist(name) {
        for (const [key, value] of Object.entries(playlistArt)) {
            if (name.includes(key)) {
                return value;
            }
        }
        return playlistArt["default"];
    }

    // Helper: Extract Video ID from URL
    function getVideoId(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('v');
        } catch (e) {
            console.error("Invalid URL:", url);
            return null;
        }
    }

    // Helper: Load Video
    function loadVideo(video, index) {
        const videoId = getVideoId(video.video_url);
        if (!videoId) return;

        // Using user_commands=1 to allow JS control if needed, rel=0 to not show unrelated videos
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

        // Update Title and Artist
        const cleanTitle = video.video_title.replace(/fi4cr - | \(from .*\)/g, '');
        currentTitle.textContent = cleanTitle;
        currentArtist.textContent = "fi4cr";

        // Update Active Class
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.getElementById(`video-${index}`);
        if (activeItem) activeItem.classList.add('active');
    }

    // Function to render a specific playlist
    function renderPlaylist(playlist) {
        // Update Header Info
        const displayName = playlist.playlist_name.replace('fi4cr - ', '');
        pageTitle.textContent = displayName;
        headerTitle.textContent = displayName;

        // Update Stats
        trackCount.textContent = `${playlist.videos.length} Songs`;

        // Update Artwork
        const artSrc = getArtForPlaylist(displayName);
        if (heroImage) heroImage.src = artSrc;
        // Update mini player image only if not playing (optional, or always update)
        // For now, let's keep mini player synced with the playlist context
        if (miniPlayerImg) miniPlayerImg.src = artSrc;

        // Clear existing items
        playlistContainer.innerHTML = '';

        // Render Tracks
        playlist.videos.forEach((video, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.id = `video-${index}`;

            // Clean up title for display
            const cleanTitle = video.video_title.replace(/fi4cr - | \(from .*\)/g, '');

            item.innerHTML = `
                <div class="item-index">${(index + 1).toString().padStart(2, '0')}</div>
                <div class="item-info">
                    <div class="item-title">${cleanTitle}</div>
                </div>
            `;

            item.addEventListener('click', () => {
                loadVideo(video, index);
            });

            playlistContainer.appendChild(item);
        });

        // Initialize with RANDOM video
        if (playlist.videos.length > 0) {
            const randomIndex = Math.floor(Math.random() * playlist.videos.length);
            loadVideo(playlist.videos[randomIndex], randomIndex);
        }
    }

    // Select Change Handler
    playlistSelect.addEventListener('change', (e) => {
        const selectedIndex = e.target.value;
        renderPlaylist(allPlaylists[selectedIndex]);
    });

    // Fetch Data
    fetch('playlists.json')
        .then(response => response.json())
        .then(data => {
            allPlaylists = data;

            // Populate Select Dropdown
            allPlaylists.forEach((playlist, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = playlist.playlist_name.replace('fi4cr - ', '');
                playlistSelect.appendChild(option);
            });

            // Find default "Swing D&B" or use first
            let defaultIndex = allPlaylists.findIndex(p => p.playlist_name.includes("Swing D&B Collection"));
            if (defaultIndex === -1) defaultIndex = 0;

            playlistSelect.value = defaultIndex;
            renderPlaylist(allPlaylists[defaultIndex]);
        })
        .catch(error => {
            console.error('Error loading playlists:', error);
            currentTitle.textContent = "Error loading playlist data.";
        });

    // Header Scroll Effect (Reveal Title)
    // const mainContent = document.querySelector('.main-content');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            headerTitle.style.opacity = '1';
        } else {
            headerTitle.style.opacity = '0';
        }
    });
});
