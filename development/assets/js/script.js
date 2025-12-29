document.addEventListener('DOMContentLoaded', () => {
    function log(msg) {
        console.log(msg);
    }
    log("Script loaded");
    const player = document.getElementById('main-player');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const playlistContainer = document.getElementById('playlist-container');
    const pageTitle = document.getElementById('page-title');
    const headerTitle = document.getElementById('header-title');
    const trackCount = document.getElementById('track-count');

    const heroImage = document.getElementById('hero-image');
    const miniPlayerImg = document.getElementById('mini-player-img');

    // Buttons
    const heroPlayBtn = document.getElementById('play-btn');
    const heroShuffleBtn = document.getElementById('shuffle-btn');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const nextBtn = document.getElementById('next-btn');

    let allPlaylists = [];
    let currentPlaylist = null;
    let currentIndex = -1;
    let isPlaying = false;

    // Map Playlist Names to Image Files
    const CACHE_VERSION = '3';
    const playlistArt = {
        "Swing D&B": "assets/images/covers/cover_swing_dnb.png",
        "Ragga D&B": "assets/images/covers/cover_ragga_dnb.png",
        "Hip Hop": "assets/images/covers/cover_hiphop_study.png",
        "Folk House": "assets/images/covers/cover_folk_house.png",
        "Orchestral Dubstep": "assets/images/covers/cover_orch_dubstep.png",
        "Dark Techno": "assets/images/covers/cover_dark_techno.png",
        "Chaos Rave": "assets/images/covers/cover_chaos_rave.png",
        "Celtic Trance": "assets/images/covers/cover_celtic_trance.png",
        "Neoclassical Electronic": "assets/images/covers/cover_neoclassical_electronic.png",
        "House Style": "assets/images/covers/cover_house_style.png",
        "House Music Style Study": "assets/images/covers/cover_house_style.png",
        "Rawphoric": "assets/images/covers/cover_rawphoric.png",
        "Bubblegum Dance": "assets/images/covers/cover_bubblegum_dance.png",
        "Chiptune": "assets/images/covers/cover_chiptune_style.png",
        "Hardstyle": "assets/images/covers/cover_hardstyle_hardcore.png",
        "Grime": "assets/images/covers/cover_grime_style.png",
        "Footwork": "assets/images/covers/cover_footwork_juke.png",
        "Eurodance": "assets/images/covers/cover_eurodance_style.png",
        "Electro": "assets/images/covers/cover_electro_style.png",
        "Downtempo": "assets/images/covers/cover_downtempo_style.png",
        "Breakbeat": "assets/images/covers/cover_breakbeat_style.png",
        "Ambient": "assets/images/covers/cover_ambient_style.png",
        "IDM Ambient": "assets/images/covers/cover_idm_ambient_dub.png",
        "Intelligent Dance Music Style Study": "assets/images/covers/cover_idm_style.png",
        "Hyperbaroque": "assets/images/covers/cover_hyperbaroque_collection.png",
        "World Electronica": "assets/images/covers/cover_world_electronica_style.png",
        "UK Garage": "assets/images/covers/cover_uk_garage_style.png",
        "Trap": "assets/images/covers/cover_trap_style.png",
        "Phonk": "assets/images/covers/cover_phonk_style.png",
        "Dub": "assets/images/covers/cover_dub_style.png",
        "Celtic House": "assets/images/covers/cover_celtic_house.png",
        "Disco": "assets/images/covers/cover_disco_style.png",
        "Liquid Funk": "assets/images/covers/cover_liquid_funk.png",
        "Tribal House": "assets/images/covers/cover_tribal_house.png",
        "Neo-Tokyo D&B": "assets/images/covers/cover_neotokyo_dnb.png",
        "Swing Tech House": "assets/images/covers/cover_swing_tech_house.png",
        "Dubstep Style Study": "assets/images/covers/cover_dubstep_style.png",
        "South African House": "assets/images/covers/cover_south_african_house.png",
        "Techno Style Study": "assets/images/covers/cover_techno_style.png",
        "Tech House": "assets/images/covers/cover_tech_house.png",
        "Melbourne Bounce": "assets/images/covers/cover_melbourne_bounce.png",
        "Rave House": "assets/images/covers/cover_rave_house.png",
        "Progressive House": "assets/images/covers/cover_progressive_house.png",
        "Bluestep Collection": "assets/images/covers/cover_bluestep_collection.png",
        "Nu-Jazz Style Study": "assets/images/covers/cover_nu_jazz_style.png",
        "Future Bass Style Study": "assets/images/covers/cover_future_bass_style.png",
        "Electronic Rock": "assets/images/covers/cover_electronic_rock_style.png",
        "Balkan Tech House": "assets/images/covers/cover_balkan_tech_house.png",
        "Neoclassical Hip Hop": "assets/images/covers/cover_neoclassical_hiphop.png",
        "Baroque Minimal Techno": "assets/images/covers/cover_baroque_minimal_techno.png",
        "Colour Bass": "assets/images/covers/cover_colour_bass.png",
        "Glitch Hop": "assets/images/covers/cover_glitch_hop.png",
        "Big Room House": "assets/images/covers/cover_big_room_house.png",
        "Retro House": "assets/images/covers/cover_retro_house.png",
        "French House": "assets/images/covers/cover_french_house.png",
        "Synthwave Style Study": "assets/images/covers/cover_synthwave_style.png",
        "Industrial Style Study": "assets/images/covers/cover_industrial_style.png",
        "Hyperpop Style Study": "assets/images/covers/cover_hyperpop_style.png",
        "Trance Style Study": "assets/images/covers/cover_trance_style.png",
        "D&B Style Study": "assets/images/covers/cover_dnb_style.png",
        "default": "assets/images/covers/cover_default.png"
    };

    function getArtForPlaylist(name) {
        for (const [key, value] of Object.entries(playlistArt)) {
            if (name.includes(key)) {
                return `${value}?v=${CACHE_VERSION}`;
            }
        }
        return `${playlistArt["default"]}?v=${CACHE_VERSION}`;
    }

    // Helper: Extract Video ID
    function getVideoId(url) {
        try {
            const urlObj = new URL(url);
            const v = urlObj.searchParams.get('v');
            log(`getVideoId: ${url} -> ${v}`);
            return v;
        } catch (e) {
            log(`Invalid URL: ${url} error: ${e}`);
            console.error("Invalid URL:", url);
            return null;
        }
    }

    // Helper: Send Command to Youtube Iframe
    function sendPlayerCommand(command) {
        if (!player || !player.contentWindow) return;
        player.contentWindow.postMessage(JSON.stringify({
            'event': 'command',
            'func': command,
            'args': []
        }), '*');
    }

    // Toggle Play/Pause UI and Video
    function togglePlay() {
        log(`togglePlay called. isPlaying was: ${isPlaying}`);
        if (isPlaying) {
            sendPlayerCommand('pauseVideo');
            isPlaying = false;
        } else {
            sendPlayerCommand('playVideo');
            isPlaying = true;
        }
        updatePlayButtons();
    }

    function updatePlayButtons() {
        log(`updatePlayButtons called. isPlaying: ${isPlaying}`);
        const iconName = isPlaying ? 'pause' : 'play_arrow';
        const text = isPlaying ? 'Pause' : 'Play';

        // Hero Button
        if (heroPlayBtn) {
            const icon = heroPlayBtn.querySelector('.material-symbols-outlined, .material-icons-round');
            if (icon) icon.textContent = iconName;

            // Text span (assume it's the second child or use :not selector with both classes)
            const textSpan = heroPlayBtn.querySelector('span:not(.material-symbols-outlined):not(.material-icons-round)');
            if (textSpan) textSpan.textContent = text;
        }

        // Mini Player Button
        if (miniPlayBtn) {
            miniPlayBtn.querySelector('.material-symbols-outlined').textContent = iconName;
        }
    }

    function playNext() {
        if (!currentPlaylist || currentPlaylist.videos.length === 0) return;
        let nextIndex = currentIndex + 1;
        if (nextIndex >= currentPlaylist.videos.length) {
            nextIndex = 0; // Loop
        }
        loadVideo(currentPlaylist.videos[nextIndex], nextIndex);
    }

    function playRandom() {
        log("playRandom called");
        if (!currentPlaylist || currentPlaylist.videos.length === 0) return;
        let randomIndex = Math.floor(Math.random() * currentPlaylist.videos.length);
        // Avoid repeating same song if possible
        if (currentPlaylist.videos.length > 1 && randomIndex === currentIndex) {
            randomIndex = (randomIndex + 1) % currentPlaylist.videos.length;
        }
        loadVideo(currentPlaylist.videos[randomIndex], randomIndex);
    }

    // Helper: Load Video
    // We add enablejsapi=1 to allow postMessage control
    function loadVideo(video, index) {
        log(`loadVideo called for index ${index}`);
        if (!currentPlaylist) return;
        currentIndex = index;
        const videoId = getVideoId(video.video_url);
        if (!videoId) return;

        // Reset state
        isPlaying = true;
        updatePlayButtons();

        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;

        const cleanTitle = video.video_title.replace(/fi4cr - | \(from .*\)/g, '');
        if (currentTitle) currentTitle.textContent = cleanTitle;
        if (currentArtist) currentArtist.textContent = "fi4cr";

        // Update Active Class
        document.querySelectorAll('.playlist-item').forEach(item => {
            // Reset to default state
            item.className = 'group flex items-center px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer playlist-item';
            item.innerHTML = item.innerHTML.replace(/text-primary/g, 'text-gray-600').replace(/text-white/g, 'text-gray-300');

            // Remove active-specific elements if any (simplified reset)
            const idx = item.querySelector('.item-index');
            if (idx) idx.className = 'w-8 text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors item-index';

            // Hide "Playing" text
            const p = item.querySelector('p');
            if (p) p.classList.add('hidden');
        });

        const activeItem = document.getElementById(`video-${index}`);
        if (activeItem) {
            // Apply Active State Styles
            activeItem.className = 'relative flex items-center px-4 py-3 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-xl border border-primary/20 cursor-default shadow-glow-subtle my-1 playlist-item active';

            const idx = activeItem.querySelector('.item-index');
            if (idx) idx.className = 'w-8 text-xs font-mono text-primary font-bold ml-1 item-index';

            const title = activeItem.querySelector('.item-title');
            if (title) {
                title.className = 'text-sm font-bold text-white item-title';
            }

            // Show "Playing" text
            const p = activeItem.querySelector('p');
            if (p) {
                p.classList.remove('hidden');
                p.className = 'text-[10px] text-primary/80 font-medium';
            }

            // Add the left accent bar and equalizer icon if not present
            if (!activeItem.querySelector('.active-accent')) {
                const accent = document.createElement('div');
                accent.className = 'active-accent absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full';
                activeItem.prepend(accent);

                const eq = document.createElement('div');
                eq.className = 'mr-1 active-eq';
                eq.innerHTML = '<span class="material-icons-round text-primary text-base animate-pulse">graphic_eq</span>';
                activeItem.appendChild(eq);
            }
        }
    }

    function renderPlaylist(playlist) {
        log(`renderPlaylist called for: ${playlist.playlist_name}`);
        currentPlaylist = playlist;

        // Update Header Info
        const displayName = playlist.playlist_name.replace('fi4cr - ', '');
        if (pageTitle) pageTitle.textContent = displayName;
        if (headerTitle) headerTitle.textContent = displayName;
        if (trackCount) trackCount.textContent = `${playlist.videos.length} Songs`;

        // Update Artwork
        const artSrc = getArtForPlaylist(displayName);
        if (heroImage) heroImage.src = artSrc;
        if (miniPlayerImg) miniPlayerImg.src = artSrc;

        // Clear existing items
        if (playlistContainer) {
            playlistContainer.innerHTML = '';

            // Render Tracks
            playlist.videos.forEach((video, index) => {
                const item = document.createElement('div');
                // Base classes for a list item
                item.className = 'group flex items-center px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer playlist-item';
                item.id = `video-${index}`;

                const cleanTitle = video.video_title.replace(/fi4cr - | \(from .*\)/g, '');
                // Placeholder duration since we don't have it in JSON yet
                const duration = "3:45";

                item.innerHTML = `
                    <span class="w-8 text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors item-index">${(index + 1).toString().padStart(2, '0')}</span>
                    <div class="flex-1 ml-2">
                        <h4 class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors item-title">${cleanTitle}</h4>
                        <p class="text-[10px] text-gray-600 hidden">Playing • ${duration}</p>
                    </div>
                `;

                item.addEventListener('click', () => {
                    loadVideo(video, index);
                });

                playlistContainer.appendChild(item);
            });
        }

        // Initialize with RANDOM video
        if (playlist.videos.length > 0) {
            playRandom();
        }
    }

    // Event Listeners


    if (heroPlayBtn) heroPlayBtn.addEventListener('click', togglePlay);
    if (heroShuffleBtn) heroShuffleBtn.addEventListener('click', playRandom);
    if (miniPlayBtn) miniPlayBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', playNext);

    // Fetch Data
    fetch('assets/data/playlists.json')
        .then(response => response.json())
        .then(data => {
            log(`Data loaded. Playlists: ${data.length}`);

            // Filter out unpublished videos
            const now = new Date();
            data.forEach(playlist => {
                if (playlist.videos) {
                    playlist.videos = playlist.videos.filter(v => {
                        if (!v.video_published_at) return true; // Assume published if no date
                        return new Date(v.video_published_at) <= now;
                    });
                }
            });

            allPlaylists = data;
            const urlParams = new URLSearchParams(window.location.search);
            const playlistParam = urlParams.get('playlist');
            let defaultIndex = -1;

            if (playlistParam) {
                log(`Looking for playlist param: "${playlistParam}"`);
                defaultIndex = allPlaylists.findIndex(p => {
                    const match = p.playlist_name.toLowerCase().includes(playlistParam.toLowerCase());
                    if (match) log(`Found match: ${p.playlist_name}`);
                    return match;
                });
                if (defaultIndex === -1) log(`No match found for: "${playlistParam}"`);
            } else {
                log("No playlist param found in URL");
            }

            if (defaultIndex === -1) {
                log("Finding latest published playlist...");
                const now = new Date();
                let latestPly = null;
                let maxDate = new Date(0);

                allPlaylists.forEach((p, idx) => {
                    if (p.playlist_published_at) {
                        const pDate = new Date(p.playlist_published_at);
                        // Filter out future playlists
                        if (pDate <= now && pDate > maxDate) {
                            maxDate = pDate;
                            latestPly = p;
                            defaultIndex = idx;
                        }
                    }
                });

                if (defaultIndex !== -1) {
                    log(`Selected latest playlist: ${allPlaylists[defaultIndex].playlist_name} (${maxDate.toISOString()})`);
                } else {
                    log("No valid published playlists found, defaulting to index 0");
                    defaultIndex = 0;
                }
            }

            if (defaultIndex === -1) defaultIndex = 0;

            log(`Final playlist index: ${defaultIndex}`);

            renderPlaylist(allPlaylists[defaultIndex]);
        })
        .catch(error => {
            console.error('Error loading playlists:', error);
            currentTitle.textContent = "Error loading playlist data.";
        });

    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            headerTitle.style.opacity = '1';
        } else {
            headerTitle.style.opacity = '0';
        }
    });
});
