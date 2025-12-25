document.addEventListener('DOMContentLoaded', () => {
    // Shared Art Mapping (Duplicated from script.js to avoid dependency issues for now)
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
        "default": "assets/images/covers/cover_swing_dnb.png"
    };

    function getArtForPlaylist(name) {
        for (const [key, value] of Object.entries(playlistArt)) {
            if (name.includes(key)) {
                return value;
            }
        }
        return playlistArt["default"];
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
                        if (vDate <= now) {
                            if (!latest || vDate > latest) {
                                latest = vDate;
                            }
                        }
                    }
                });
                return latest;
            }

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



            // --- Dynamic Grid Rendering ---
            const coreCollectionsContainer = document.getElementById('core-collections');
            const styleStudiesContainer = document.getElementById('core-style-studies');

            if (coreCollectionsContainer && styleStudiesContainer) {
                let collectionsHtml = '';
                let stylesHtml = '';

                data.forEach(p => {
                    // Filter: Only show playlists that have at least one published video
                    const hasPublishedVideos = getLatestPublishedVideoDate(p) !== null;

                    if (!hasPublishedVideos) return;

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
        })
        .catch(error => console.error('Error loading playlists for hub:', error));
});
