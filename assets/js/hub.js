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
        "Synthwave": "assets/images/covers/cover_synthwave_style.png",
        "Intelligent Dance Music": "assets/images/covers/cover_idm_style.png",
        "Industrial Style Study": "assets/images/covers/cover_industrial_style.png",
        "Hyperpop Style Study": "assets/images/covers/cover_hyperpop_style.png",
        "Trance Style Study": "assets/images/covers/cover_trance_style.png",
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

    fetch('assets/data/playlists.json')
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            let latestPly = null;
            let maxDate = new Date(0);

            data.forEach(p => {
                if (p.playlist_published_at) {
                    const pDate = new Date(p.playlist_published_at);
                    // Filter out future playlists matches script.js logic
                    if (pDate <= now && pDate > maxDate) {
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
                // Encode the playlist name to handle spaces and special chars
                if (featuredCard) featuredCard.setAttribute('onclick', `window.location.href='player.html?playlist=${encodeURIComponent(displayName)}'`);

                console.log(`Updated featured release to: ${displayName}`);
            }
        })
        .catch(error => console.error('Error loading playlists for hub:', error));
});
