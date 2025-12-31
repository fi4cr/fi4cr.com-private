document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const CACHE_VERSION = '3';
    let allVideos = [];
    let currentVideo = null;
    let isPlaying = false;

    // --- DOM Elements ---
    // These IDs must match what we add to the HTML files
    const els = {
        title: document.getElementById('track-title'),
        artist: document.getElementById('track-artist'),
        art: document.getElementById('track-art'), // The image itself or container
        artBg: document.getElementById('track-art-bg'), // For mobile fuzzy background if used
        playBtn: document.getElementById('play-btn'), // The main play/pause button
        randomizeBtn: document.getElementById('randomize-btn'),
        nextBtn: document.getElementById('next-btn'),
        prevBtn: document.getElementById('prev-btn'),
        youtubeContainer: document.getElementById('youtube-player-container'), // Container for iframe
        progressBar: document.getElementById('progress-bar'),
        currentTime: document.getElementById('current-time'),
        totalTime: document.getElementById('total-time'),
        iframe: null // Will be created/injected
    };

    // --- Art Mapping (Duplicated from hub.js/script.js for standalone functionality) ---
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

    // --- Helper Functions ---

    function getVideoId(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('v');
        } catch (e) {
            console.error("Invalid URL:", url);
            return null;
        }
    }

    // --- Player Logic ---

    function initializeYouTubePlayer(videoId) {
        let container = els.youtubeContainer;

        // If no container found (e.g. desktop might have different layout), try to find a suitable place or fallback
        // For mobile-random-player.html, we have a details element, maybe we inject there?
        // Let's assume we will add a specific container ID in the HTML modification step.

        // If iframe exists, update src
        const existingIframe = document.getElementById('youtube-iframe');
        if (existingIframe) {
            existingIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
            els.iframe = existingIframe;
            return;
        }

        // Create Iframe if not exists
        if (container) {
            // Check if container has an iframe already
            const frame = container.querySelector('iframe');
            if (frame) {
                frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
                frame.id = 'youtube-iframe';
                els.iframe = frame;
            } else {
                // Clear container (remove placeholder image)
                container.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.id = 'youtube-iframe';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
                iframe.className = 'w-full h-full absolute inset-0';
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                container.appendChild(iframe);
                els.iframe = iframe;
            }
        }
    }

    function sendPlayerCommand(command) {
        if (els.iframe && els.iframe.contentWindow) {
            els.iframe.contentWindow.postMessage(JSON.stringify({
                'event': 'command',
                'func': command,
                'args': []
            }), '*');
        }
    }

    function playRandomVideo() {
        if (allVideos.length === 0) {
            console.warn("No videos available to play.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * allVideos.length);
        const video = allVideos[randomIndex];
        currentVideo = video;
        isPlaying = true;
        updateUI(video);
    }

    function updateUI(video) {
        // Update Text
        const cleanTitle = video.video_title.replace(/fi4cr - | \(from .*\)/g, '');
        if (els.title) els.title.textContent = cleanTitle;

        const playlistName = video.playlistName.replace('fi4cr - ', '');
        if (els.artist) els.artist.textContent = `fi4cr • ${playlistName}`; // Context: Artist • Album/Playlist

        // Update Art
        const artSrc = getArtForPlaylist(playlistName);
        if (els.art) {
            // Check if els.art is an IMG tag or a DIV with background-image
            if (els.art.tagName === 'IMG') {
                els.art.src = artSrc;
            } else {
                els.art.style.backgroundImage = `url('${artSrc}')`;
            }
        }
        if (els.artBg) {
            els.artBg.style.backgroundImage = `url('${artSrc}')`;
        }

        // Update Buttons
        updatePlayButtonState();

        // Play Video
        const videoId = getVideoId(video.video_url);
        if (videoId) {
            initializeYouTubePlayer(videoId);
        }
    }

    function updatePlayButtonState() {
        if (!els.playBtn) return;
        const icon = els.playBtn.querySelector('.material-symbols-outlined') || els.playBtn.querySelector('span');
        if (icon) {
            icon.textContent = isPlaying ? 'pause' : 'play_arrow';
        }
    }

    function togglePlay() {
        if (isPlaying) {
            sendPlayerCommand('pauseVideo');
            isPlaying = false;
        } else {
            sendPlayerCommand('playVideo');
            isPlaying = true;
        }
        updatePlayButtonState();
    }

    // --- Initialization & Fetching ---

    // Fetch and Filter
    fetch('assets/data/playlists.json')
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            // "Before Yesterday" logic
            // Yesterday start of day? Or literally 24 hours ago?
            // "video date is before yesterday" usually means < (Today - 1 Day)
            // Let's go with strictly 24 hours ago from now to be safe, or just use midnight yesterday.
            // User words: "before yesterday like we do the others". 
            // In hub.js, it filters vDate <= now. 
            // The previous requirement in `hub.js` (from context) was just "not future".
            // But the User specifically asked for "before yesterday".

            // Let's define "yesterday" as 24h ago for safety, or we can construct a date object.
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);

            data.forEach(playlist => {
                if (playlist.videos) {
                    playlist.videos.forEach(video => {
                        if (video.video_published_at) {
                            const vDate = new Date(video.video_published_at);
                            if (vDate < yesterday) {
                                // Add playlist metadata to video object for UI use
                                video.playlistName = playlist.playlist_name;
                                allVideos.push(video);
                            }
                        }
                    });
                }
            });

            console.log(`Loaded ${allVideos.length} videos matching criteria.`);

            // Auto-play on load if possible, or wait for interaction
            // Random player usually implies immediate action
            if (allVideos.length > 0) {
                playRandomVideo();
            } else {
                if (els.title) els.title.textContent = "No tracks found";
                if (els.artist) els.artist.textContent = "Try again later";
            }
        })
        .catch(err => console.error("Error loading playlists:", err));


    // --- Event Listeners ---
    if (els.randomizeBtn) els.randomizeBtn.addEventListener('click', playRandomVideo);
    if (els.playBtn) els.playBtn.addEventListener('click', togglePlay);

    // Next/Prev buttons behavior: "Random" player usually implies Next = Random again.
    if (els.nextBtn) els.nextBtn.addEventListener('click', playRandomVideo);
    if (els.prevBtn) els.prevBtn.addEventListener('click', playRandomVideo); // Previous typically doesn't make sense in random mode history unless tracked. For now, random.

});
