import json
import datetime
from dateutil import parser
import os

# Define paths
SOURCE_FILE = 'development/assets/data/playlists.json'
DEST_FILE = 'production/assets/data/playlists.json'

def filter_playlists():
    # check if source exists
    if not os.path.exists(SOURCE_FILE):
        print(f"Error: Source file {SOURCE_FILE} not found.")
        return

    # Load data
    with open(SOURCE_FILE, 'r') as f:
        playlists = json.load(f)

    # Get current date and cutoff date (1 month from now)
    now = datetime.datetime.now(datetime.timezone.utc)
    cutoff_date = now + datetime.timedelta(days=30)
    
    print(f"Filtering songs published after: {cutoff_date.isoformat()}")

    filtered_playlists = []
    
    for playlist in playlists:
        filtered_videos = []
        if 'videos' in playlist:
            for video in playlist['videos']:
                published_at_str = video.get('video_published_at')
                if published_at_str:
                    try:
                        published_at = parser.parse(published_at_str)
                        # Ensure timezone awareness if not present (assume UTC)
                        if published_at.tzinfo is None:
                            published_at = published_at.replace(tzinfo=datetime.timezone.utc)
                            
                        if published_at <= cutoff_date:
                            filtered_videos.append(video)
                    except Exception as e:
                        print(f"Error parsing date for video {video.get('video_title')}: {e}")
                        # If date can't be parsed, maybe keep it? or drop it? 
                        # strict approach: drop it. "safe" approach: keep it.
                        # Given requirements, let's keep it but warn.
                        filtered_videos.append(video)
                else:
                    # No date, keep it
                    filtered_videos.append(video)
        
        # Create a copy of the playlist with filtered videos
        new_playlist = playlist.copy()
        new_playlist['videos'] = filtered_videos
        filtered_playlists.append(new_playlist)

    # Ensure dest directory exists
    os.makedirs(os.path.dirname(DEST_FILE), exist_ok=True)

    # Write output
    with open(DEST_FILE, 'w') as f:
        json.dump(filtered_playlists, f, indent=2)
    
    print(f"Successfully processed {len(playlists)} playlists.")
    print(f"Filtered data written to {DEST_FILE}")

if __name__ == "__main__":
    filter_playlists()
