"""
SongLookUp - a small CLI tool that queries the public iTunes Search API,
displays song information, and saves the results to a local SQLite database.

Public data source: https://itunes.apple.com/search
Docs: https://performance-partners.apple.com/search-api

Usage:
    python song_lookup.py "Bohemian Rhapsody"   # search + save to songs.db
    python song_lookup.py --list                # show everything saved so far
    python song_lookup.py                       # interactive prompt
"""

import sys
import requests

import db

ITUNES_SEARCH_URL = "https://itunes.apple.com/search"


def search_songs(query: str, limit: int = 5) -> list[dict]:
    """Query the iTunes Search API for songs matching `query`.

    Returns a list of result dicts (may be empty). Raises requests.HTTPError
    on a bad HTTP response.
    """
    params = {
        "term": query,
        "media": "music",
        "entity": "song",
        "limit": limit,
    }
    response = requests.get(ITUNES_SEARCH_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    return data.get("results", [])


def format_result(index: int, result: dict) -> str:
    """Build a clean, human-readable string for a single iTunes result."""
    song = result.get("trackName", "Unknown Song")
    artist = result.get("artistName", "Unknown Artist")
    album = result.get("collectionName", "Unknown Album")
    release = result.get("releaseDate", "")
    year = release.split("-")[0] if release else "----"
    genre = result.get("primaryGenreName", "Unknown Genre")

    return (
        f"{index}. {song}\n"
        f"   Artist : {artist}\n"
        f"   Album  : {album}\n"
        f"   Year   : {year}\n"
        f"   Genre  : {genre}"
    )


def format_row(index: int, row) -> str:
    """Format a sqlite3.Row from the songs table for display."""
    return (
        f"{index}. {row['song']}\n"
        f"   Artist : {row['artist']}\n"
        f"   Album  : {row['album'] or 'Unknown Album'}\n"
        f"   Year   : {row['year'] or '----'}\n"
        f"   Genre  : {row['genre'] or 'Unknown Genre'}\n"
        f"   Saved  : {row['saved_at']}"
    )


def list_saved() -> int:
    """Print every record currently stored in the database."""
    with db.connect() as conn:
        rows = db.fetch_all(conn)

    if not rows:
        print("No songs saved yet. Run a search first.")
        return 0

    print(f"\n{len(rows)} song(s) saved in {db.DB_PATH.name}:\n")
    print("-" * 50)
    for i, row in enumerate(rows, start=1):
        print(format_row(i, row))
        print("-" * 50)
    return 0


def run_search(query: str) -> int:
    print(f"\nSearching iTunes for: {query!r}\n")

    try:
        results = search_songs(query)
    except requests.RequestException as exc:
        print(f"Error contacting iTunes API: {exc}")
        return 1

    if not results:
        print("No results found.")
        return 0

    print(f"Found {len(results)} result(s):\n")
    print("-" * 50)
    for i, result in enumerate(results, start=1):
        print(format_result(i, result))
        print("-" * 50)

    with db.connect() as conn:
        saved = db.save_results(conn, results)
        total = db.count_rows(conn)

    print(f"\nSaved {saved} record(s) to {db.DB_PATH.name} (total stored: {total}).")
    return 0


def main() -> int:
    args = sys.argv[1:]

    if args and args[0] in {"--list", "-l"}:
        return list_saved()

    if args:
        query = " ".join(args)
    else:
        query = input("Enter a song or artist to look up: ").strip()

    if not query:
        print("No search term provided. Exiting.")
        return 1

    return run_search(query)


if __name__ == "__main__":
    sys.exit(main())
