document.addEventListener('DOMContentLoaded', () => {
    // Shared Art Mapping (Duplicated from script.js to avoid dependency issues for now)
    const CACHE_VERSION = '2';
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

    // --- Search Implementation ---
    let allPlaylists = [];

    const searchBtn = document.getElementById('search-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const closeSearchBtn = document.getElementById('close-search');

    if (searchBtn && searchContainer && closeSearchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            if (searchContainer.classList.contains('hidden')) {
                searchContainer.classList.remove('hidden');
                searchInput.focus();
            } else {
                searchContainer.classList.add('hidden');
            }
        });

        closeSearchBtn.addEventListener('click', () => {
            searchContainer.classList.add('hidden');
            searchInput.value = '';
            renderPlaylists(allPlaylists); // Reset view
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allPlaylists.filter(p =>
                p.playlist_name.toLowerCase().replace('fi4cr - ', '').includes(query)
            );
            renderPlaylists(filtered);
        });
    }


    // --- Notification Implementation ---
    const notificationBtn = document.getElementById('notification-btn');
    const notificationContainer = document.getElementById('notification-container');
    const notificationList = document.getElementById('notification-list');

    if (notificationBtn && notificationContainer) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop bubbling to prevent document listener from immediately closing it if that's the issue

            if (notificationContainer.classList.contains('hidden')) {
                notificationContainer.classList.remove('hidden');
                // Close search if open
                if (searchContainer && !searchContainer.classList.contains('hidden')) {
                    searchContainer.classList.add('hidden');
                }
            } else {
                notificationContainer.classList.add('hidden');
            }
        });

        // Close when clicking outside (Optional polish)
        document.addEventListener('click', (e) => {
            if (!notificationContainer.classList.contains('hidden') && !notificationContainer.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationContainer.classList.add('hidden');
            }
        });
    }

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
            notificationList.innerHTML = '<p class="text-gray text-center text-sm p-4">No new notifications</p>';
            return;
        }

        songs.forEach(song => {
            // Clean up title
            const songName = song.video_title.replace('fi4cr - ', '').replace(/ \(from .*?\)/, '');
            // Get playlist name for art
            // The song object we pass needs to have the playlistName attached
            const playlistName = song.playlistName ? song.playlistName.replace('fi4cr - ', '') : 'Unknown';
            const artSrc = getArtForPlaylist(playlistName);


            // Format date
            const dateObj = new Date(song.video_published_at);
            const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const isYest = isYesterday(dateObj);
            const subText = isYest ? 'Yesterday' : dateStr;

            const html = `
                <a href="${song.video_url}" target="_blank" class="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group">
                    <img src="${artSrc}" alt="${playlistName}" class="w-12 h-12 rounded-lg object-cover shadow-sm">
                    <div class="flex-1 min-w-0">
                        <p class="text-white text-sm font-bold truncate group-hover:text-primary transition-colors">${songName}</p>
                        <p class="text-gray text-xs truncate">${playlistName} • ${subText}</p>
                    </div>
                     <span class="material-symbols-outlined text-gray group-hover:text-white text-lg">play_arrow</span>
                </a>
            `;
            notificationList.insertAdjacentHTML('beforeend', html);
        });
    }


    const featuredTitle = document.getElementById('featured-title');
    const featuredTracks = document.getElementById('featured-tracks');
    const featuredCard = document.getElementById('featured-card');
    const featuredBg = document.getElementById('featured-img-bg');

    // Use a timestamp to prevent caching of the playlist data
    fetch(`assets/data/playlists.json?v=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            const now = new Date();

            // Filter out unpublished videos immediately AND collect all valid videos for notifications
            let allPublishedVideos = [];

            data.forEach(playlist => {
                if (playlist.videos) {
                    // Filter playlist.videos in place for the main hub view logic
                    playlist.videos = playlist.videos.filter(v => {
                        if (!v.video_published_at) return true; // Keep if no date (assumed legacy/published)
                        const vDate = new Date(v.video_published_at);
                        const isPublished = vDate <= now;

                        if (isPublished) {
                            // Attach playlist name to video object for easier processing later
                            v.playlistName = playlist.playlist_name;
                            allPublishedVideos.push(v);
                        }

                        return isPublished;
                    });
                }
            });

            // Notification Logic
            // 1. Check for videos published "Yesterday"
            let notificationSongs = allPublishedVideos.filter(v => {
                if (!v.video_published_at) return false;
                return isYesterday(new Date(v.video_published_at));
            });

            // Sort by date descending
            notificationSongs.sort((a, b) => new Date(b.video_published_at) - new Date(a.video_published_at));

            // 2. If none, grab last 6 videos
            if (notificationSongs.length === 0) {
                // Sort all videos by date descending
                allPublishedVideos.sort((a, b) => {
                    const dateA = a.video_published_at ? new Date(a.video_published_at) : new Date(0);
                    const dateB = b.video_published_at ? new Date(b.video_published_at) : new Date(0);
                    return dateB - dateA;
                });
                notificationSongs = allPublishedVideos.slice(0, 6);
            }

            renderNotifications(notificationSongs);

            // ... Rest of existing logic ...

            let latestPly = null;
            let maxDate = new Date(0);

            // Helper to get the most recent *published* video date for a playlist
            // Returns null if no videos are published yet
            function getLatestPublishedVideoDate(playlist) {
                if (!playlist.videos || playlist.videos.length === 0) return null;

                let latest = null;

                playlist.videos.forEach(v => {
                    if (v.video_published_at) {
                        const vDate = new Date(v.video_published_at);
                        // Already filtered for <= now above, but double check doesn't hurt
                        if (vDate <= now) {
                            if (!latest || vDate > latest) {
                                latest = vDate;
                            }
                        }
                    }
                });
                return latest;
            }

            // Save data for search
            allPlaylists = data.filter(p => getLatestPublishedVideoDate(p) !== null);

            // Find Featured Release (Playlist with the most recent video)
            data.forEach(p => {
                const pDate = getLatestPublishedVideoDate(p);

                if (pDate) {
                    if (pDate > maxDate) {
                        maxDate = pDate;
                        latestPly = p;
                    }
                }
            });

            if (latestPly) {
                const displayName = latestPly.playlist_name.replace('fi4cr - ', '');

                // Update Title
                if (featuredTitle) featuredTitle.textContent = displayName;

                // Update Tracks Info
                if (featuredTracks) featuredTracks.textContent = `Electronic • ${latestPly.videos.length} Tracks`;

                // Update Art
                const artSrc = getArtForPlaylist(displayName);
                if (featuredBg) featuredBg.style.backgroundImage = `url('${artSrc}')`;

                // Update Link
                if (featuredCard) featuredCard.setAttribute('onclick', `window.location.href='player.html?playlist=${encodeURIComponent(displayName)}'`);

                console.log(`Updated featured release to: ${displayName}`);
            }

            // Initial Render
            renderPlaylists(allPlaylists);

        })
        .catch(error => console.error('Error loading playlists for hub:', error));

    function renderPlaylists(playlists) {
        const coreCollectionsContainer = document.getElementById('core-collections');
        const styleStudiesContainer = document.getElementById('core-style-studies');

        if (coreCollectionsContainer && styleStudiesContainer) {
            let collectionsHtml = '';
            let stylesHtml = '';

            // Sort by track count descending
            const sorted = [...playlists].sort((a, b) => (b.videos ? b.videos.length : 0) - (a.videos ? a.videos.length : 0));

            sorted.forEach(p => {
                const displayName = p.playlist_name.replace('fi4cr - ', '');
                const artSrc = getArtForPlaylist(displayName);
                // Use 'Tracks' count as subtitle since we don't have manual genres
                const subtitle = p.videos ? `${p.videos.length} Tracks` : 'Collection';
                // Safely encode for URL
                const encodedName = encodeURIComponent(displayName);

                const cardHtml = `
                    <div onclick="window.location.href='player.html?playlist=${encodedName}'"
                        class="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                        <div class="absolute inset-0 bg-cover"
                            style="background-image: url('${artSrc}');"></div>
                        <div class="absolute inset-0 gradient-overlay-bottom"></div>
                        <div class="absolute bottom-0 left-0 p-8">
                            <p class="text-white text-lg font-bold truncate">${displayName}</p>
                            <p class="text-gray text-sm">${subtitle}</p>
                        </div>
                    </div>
                `;

                // Categorize based on "Style"
                if (displayName.toLowerCase().includes('style')) {
                    stylesHtml += cardHtml;
                } else {
                    collectionsHtml += cardHtml;
                }
            });

            coreCollectionsContainer.innerHTML = collectionsHtml;
            styleStudiesContainer.innerHTML = stylesHtml;
        }
    }
});
