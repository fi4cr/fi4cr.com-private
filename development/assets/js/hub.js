document.addEventListener('DOMContentLoaded', () => {
    // Shared Art Mapping
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

    // Updated selectors for new design
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const searchInput = document.getElementById('search-input');

    // Desktop input is wrapped in a div with "hidden md:flex". We might want to toggle this on mobile.
    // However, the simplest way to support mobile search with the current markup is to 
    // toggle the visibility of the search input wrapper when the mobile button is clicked.
    const searchInputWrapper = searchInput ? searchInput.parentElement : null;

    if (mobileSearchBtn && searchInputWrapper) {
        mobileSearchBtn.addEventListener('click', () => {
            // Toggle visibility classes
            searchInputWrapper.classList.toggle('hidden');
            searchInputWrapper.classList.toggle('flex');
            searchInputWrapper.classList.toggle('absolute'); // Position absolutely on mobile?
            searchInputWrapper.classList.toggle('top-16');
            searchInputWrapper.classList.toggle('right-6');
            searchInputWrapper.classList.toggle('z-50');

            if (!searchInputWrapper.classList.contains('hidden')) {
                searchInput.focus();
            }
        });
    }

    if (searchInput) {
        // Toggle input helper for mobile
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.toLowerCase();
            if (query.length > 0) {
                const filtered = allPlaylists.filter(p =>
                    p.playlist_name.toLowerCase().replace('fi4cr - ', '').includes(query)
                );
                renderSearchResults(filtered);
            }
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const searchContainer = document.getElementById('search-container');

            if (query.length === 0) {
                if (searchContainer) searchContainer.classList.add('hidden');
                return;
            }

            const filtered = allPlaylists.filter(p =>
                p.playlist_name.toLowerCase().replace('fi4cr - ', '').includes(query)
            );
            renderSearchResults(filtered);
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            const searchContainer = document.getElementById('search-container');
            const searchWrapper = searchInput.parentElement;

            if (searchContainer && !searchContainer.classList.contains('hidden')) {
                if (!searchContainer.contains(e.target) && !searchInput.contains(e.target)) {
                    searchContainer.classList.add('hidden');
                }
            }
        });
    }

    function renderSearchResults(playlists) {
        const searchContainer = document.getElementById('search-container');
        if (!searchContainer) return;

        searchContainer.innerHTML = '';
        searchContainer.classList.remove('hidden');

        if (playlists.length === 0) {
            searchContainer.innerHTML = `
                <div class="p-4 text-center text-gray-400 text-sm">
                    No collections found
                </div>
            `;
            return;
        }

        const list = document.createElement('div');
        list.className = 'flex flex-col py-2';

        playlists.slice(0, 6).forEach(p => { // Limit to 6 results
            const displayName = p.playlist_name.replace('fi4cr - ', '');
            const artSrc = getArtForPlaylist(displayName);
            const trackCount = p.videos ? p.videos.length : 0;
            const encodedName = encodeURIComponent(displayName);

            const item = document.createElement('a');
            item.href = `player.html?playlist=${encodedName}`;
            item.className = 'flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group';
            item.innerHTML = `
                <img src="${artSrc}" alt="${displayName}" class="w-10 h-10 rounded-md object-cover">
                <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate group-hover:text-primary transition-colors">${displayName}</p>
                    <p class="text-gray-500 text-xs truncate">${trackCount} tracks</p>
                </div>
                <span class="material-icons-outlined text-gray-600 group-hover:text-white text-sm">arrow_forward</span>
             `;
            list.appendChild(item);
        });

        searchContainer.appendChild(list);
    }







    const featuredTitle = document.getElementById('featured-title');
    const featuredTracks = document.getElementById('featured-tracks');
    const featuredCard = document.getElementById('featured-card');
    const featuredBg = document.getElementById('featured-img-bg');

    // Use a timestamp to prevent caching of the playlist data
    Promise.all([
        fetch(`assets/data/playlists.json?v=${new Date().getTime()}`).then(r => r.json()),
        fetch(`assets/data/descriptions.json?v=${CACHE_VERSION}`).then(r => r.json())
    ])
        .then(([data, descriptions]) => {
            // Assign loaded descriptions to the global/shared object or variable
            // Since getArtForPlaylist and descriptions logic are coupled, let's redefine the lookup
            // We can just use the 'descriptions' object directly in the logic below.

            // Helper to get description from the loaded JSON
            function getDescriptionForPlaylist(name, count) {
                for (const [key, value] of Object.entries(descriptions)) {
                    if (name.includes(key)) {
                        return value.replace('{count}', count);
                    }
                }
                return "";
            }

            const now = new Date();
            let allPublishedVideos = [];

            data.forEach(playlist => {
                if (playlist.videos) {
                    playlist.videos = playlist.videos.filter(v => {
                        if (!v.video_published_at) return true;
                        const vDate = new Date(v.video_published_at);
                        const isPublished = vDate <= now;

                        if (isPublished) {
                            v.playlistName = playlist.playlist_name;
                            allPublishedVideos.push(v);
                        }

                        return isPublished;
                    });
                }
            });



            let latestPly = null;
            let maxDate = new Date(0);

            function getLatestPublishedVideoDate(playlist) {
                if (!playlist.videos || playlist.videos.length === 0) return null;
                let latest = null;

                playlist.videos.forEach(v => {
                    if (v.video_published_at) {
                        const vDate = new Date(v.video_published_at);
                        if (vDate <= now) {
                            if (!latest || vDate > latest) {
                                latest = vDate;
                            }
                        }
                    }
                });
                return latest;
            }

            allPlaylists = data.filter(p => getLatestPublishedVideoDate(p) !== null);

            // Find Featured Release
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

                if (featuredTitle) featuredTitle.textContent = displayName;
                if (featuredTracks) featuredTracks.textContent = getDescriptionForPlaylist(displayName, latestPly.videos.length);
                const artSrc = getArtForPlaylist(displayName);
                if (featuredBg) featuredBg.src = artSrc;

                if (featuredCard) featuredCard.setAttribute('onclick', `window.location.href='player.html?playlist=${encodeURIComponent(displayName)}'`);
            }

            // Initial Render
            renderPlaylists(allPlaylists);

        })
        .catch(error => console.error('Error loading data for hub:', error));

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
                const trackCount = p.videos ? p.videos.length : 0;
                const encodedName = encodeURIComponent(displayName);

                // --- HTML Templates ---

                // 1. Core Collection Card (Large, Featured Visuals)
                const collectionCard = `
                    <div onclick="window.location.href='player.html?playlist=${encodedName}'" class="group relative aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 transition-colors duration-500">
                        <img alt="${displayName}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100" src="${artSrc}"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0B0710] via-[#0B0710]/20 to-transparent"></div>
                        <div class="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-900/0 transition-colors"></div>
                        <div class="absolute bottom-0 left-0 p-8 w-full">
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors">${displayName}</h3>
                            <p class="text-gray-400 text-sm font-medium flex items-center">
                                <span class="material-icons-round text-sm mr-1">graphic_eq</span> ${trackCount} Tracks
                            </p>
                        </div>
                        <div class="absolute bottom-8 right-8 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                            <button class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-primary hover:border-primary text-white flex items-center justify-center shadow-lg">
                                <span class="material-icons-round text-2xl">play_arrow</span>
                            </button>
                        </div>
                    </div>
                `;

                // 2. Style Study Card (Compact, Grid)
                const styleCard = `
                    <div onclick="window.location.href='player.html?playlist=${encodedName}'" class="bg-surface-dark hover:bg-surface-hover border border-white/5 hover:border-white/10 p-4 rounded-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                        <div class="aspect-square rounded-lg overflow-hidden mb-4 relative shadow-lg">
                            <img alt="${displayName}" class="w-full h-full object-cover" src="${artSrc}"/>
                            <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                <span class="material-icons-round text-primary text-5xl drop-shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">play_circle</span>
                            </div>
                        </div>
                        <h4 class="font-semibold text-white truncate text-sm mb-1 group-hover:text-primary transition-colors">${displayName}</h4>
                        <p class="text-xs text-gray-500 truncate">${trackCount} Tracks</p>
                    </div>
                `;

                // Categorize
                if (displayName.toLowerCase().includes('style') || displayName.toLowerCase().includes('collection')) {
                    // Heuristic: If it says "Style" or "Collection" put it in "Style Studies" / Bottom grid?
                    // Wait, user asked for "Core Collections" and "Style Studies".
                    // Let's keep the logic consistent: 
                    // IF "Style" in name -> Style Studies (Small Cards)
                    // ELSE -> Core Collections (Large Cards)

                    if (displayName.toLowerCase().includes('style')) {
                        stylesHtml += styleCard;
                    } else {
                        collectionsHtml += collectionCard;
                    }

                } else {
                    // Default to Core Collections
                    collectionsHtml += collectionCard;
                }
            });

            coreCollectionsContainer.innerHTML = collectionsHtml;
            styleStudiesContainer.innerHTML = stylesHtml;
        }
    }
});
