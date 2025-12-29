#!/bin/bash

# Define source and destination
SOURCE="development/"
DEST="production/"

# Check if source exists
if [ ! -d "$SOURCE" ]; then
  echo "Error: Source directory '$SOURCE' does not exist."
  exit 1
fi

# Create destination if it doesn't exist
mkdir -p "$DEST"

# Perform the copy using rsync
# -a: archive mode (preserves permissions, times, symbolic links, etc.)
# -v: verbose
# --delete: delete extraneous files from dest dirs (optional, but good for "deploy" syncing)
# --exclude: exclude specific files

echo "Deploying from $SOURCE to $DEST..."
rsync -av --delete --exclude 'assets/data/playlists.json' "$SOURCE" "$DEST"

echo "Filtering playlists..."
python3 filter_playlists.py

echo "Deployment complete."
