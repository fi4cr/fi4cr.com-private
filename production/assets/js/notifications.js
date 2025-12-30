document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CACHE_VERSION = '3';
    const STORAGE_KEY = 'notification_dismissed_date';

    // --- Elements ---
    const notificationBtn = document.getElementById('notification-btn');
    const notificationContainer = document.getElementById('notification-container');
    const notificationList = document.getElementById('notification-list');

    // Attempt to find the dot. It's usually the second span, or the one with 'absolute'.
    // In all HTML files it is: <span class="absolute top-2 right-2 ..."></span>
    // We can select it safely.
    const notificationDot = notificationBtn ? notificationBtn.querySelector('span.absolute') : null;

    if (!notificationBtn || !notificationContainer || !notificationList) {
        // If elements are missing (e.g. mobile player might not have them?), just return.
        // Mobile player DOES have them in the header though.
        return;
    }

    // --- Art Mapping (Simplified/Shared) ---
    // We duplicate this from hub.js to ensure this script is standalone.
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
        "Nu-Jazz Style Study": "assets/images/covers/cover_nu_jazz_style.png",
        "Future Bass Style Study": "assets/images/covers/cover_future_bass_style.png",
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

    // --- Dismissal Logic ---
    function getTodayString() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    function updateDotVisibility() {
        if (!notificationDot) return;

        const dismissedDate = localStorage.getItem(STORAGE_KEY);
        const today = getTodayString();

        if (dismissedDate === today) {
            notificationDot.classList.add('hidden');
        } else {
            notificationDot.classList.remove('hidden');
        }
    }

    // Initial check on load
    updateDotVisibility();

    // --- Event Listeners ---
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const isHidden = notificationContainer.classList.contains('hidden');
        if (isHidden) {
            notificationContainer.classList.remove('hidden');
            // User opened notifications, mark as dismissed for today
            localStorage.setItem(STORAGE_KEY, getTodayString());
            updateDotVisibility();
        } else {
            notificationContainer.classList.add('hidden');
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationContainer.classList.contains('hidden')) {
            if (!notificationBtn.contains(e.target) && !notificationContainer.contains(e.target)) {
                notificationContainer.classList.add('hidden');
            }
        }
    });

    // --- Content Loading ---
    function isYesterday(date) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    }

    function renderNotifications(songs) {
        if (!notificationList) return;
        notificationList.innerHTML = '';

        if (songs.length === 0) {
            notificationList.innerHTML = '<p class="text-gray-400 text-center text-sm p-4">No new notifications</p>';
            return;
        }

        songs.forEach(song => {
            const songName = song.video_title.replace('fi4cr - ', '').replace(/ \(from .*?\)/, '');
            const playlistName = song.playlistName ? song.playlistName.replace('fi4cr - ', '') : 'Unknown';
            const artSrc = getArtForPlaylist(playlistName);

            // Adjust date display
            const dateObj = new Date(song.video_published_at);
            const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const isYest = isYesterday(dateObj);
            const subText = isYest ? 'Yesterday' : dateStr;

            const html = `
                <a href="${song.video_url}" target="_blank" class="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group">
                    <img src="${artSrc}" alt="${playlistName}" class="w-12 h-12 rounded-lg object-cover shadow-sm">
                    <div class="flex-1 min-w-0">
                        <p class="text-white text-sm font-bold truncate group-hover:text-primary transition-colors">${songName}</p>
                        <p class="text-gray-400 text-xs truncate">${playlistName} • ${subText}</p>
                    </div>
                     <span class="material-icons-outlined text-gray-500 group-hover:text-white text-lg">play_arrow</span>
                </a>
            `;
            notificationList.insertAdjacentHTML('beforeend', html);
        });
    }

    // Fetch Data
    fetch(`assets/data/playlists.json?v=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            let allPublishedVideos = [];

            data.forEach(playlist => {
                if (playlist.videos) {
                    playlist.videos.filter(v => {
                        if (!v.video_published_at) return true;
                        return new Date(v.video_published_at) <= now;
                    }).forEach(v => {
                        // Enriched object for sorted list
                        allPublishedVideos.push({
                            ...v,
                            playlistName: playlist.playlist_name
                        });
                    });
                }
            });

            // Logic: Yesterday's songs OR last 6
            let notificationSongs = allPublishedVideos.filter(v => {
                if (!v.video_published_at) return false;
                return isYesterday(new Date(v.video_published_at));
            });

            notificationSongs.sort((a, b) => new Date(b.video_published_at) - new Date(a.video_published_at));

            if (notificationSongs.length === 0) {
                // Sort all by date desc
                allPublishedVideos.sort((a, b) => {
                    const dateA = a.video_published_at ? new Date(a.video_published_at) : new Date(0);
                    const dateB = b.video_published_at ? new Date(b.video_published_at) : new Date(0);
                    return dateB - dateA;
                });
                notificationSongs = allPublishedVideos.slice(0, 6);
            }

            renderNotifications(notificationSongs);
        })
        .catch(error => console.error('Error loading playlists for notifications:', error));
});
