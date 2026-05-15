"""
SQLite helper module for SongLookUp.

Stores songs returned by the iTunes API into a local `songs.db` file.

Schema (one table, six data columns + an auto timestamp):
    songs(
        track_id  INTEGER PRIMARY KEY,   -- iTunes trackId, prevents duplicates
        song      TEXT NOT NULL,
        artist    TEXT NOT NULL,
        album     TEXT,
        year      TEXT,
        genre     TEXT,
        saved_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )
"""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "songs.db"


def connect(db_path: Path = DB_PATH) -> sqlite3.Connection:
    """Open a connection to the SQLite database and ensure the schema exists."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    _init_schema(conn)
    return conn


def _init_schema(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS songs (
            track_id  INTEGER PRIMARY KEY,
            song      TEXT NOT NULL,
            artist    TEXT NOT NULL,
            album     TEXT,
            year      TEXT,
            genre     TEXT,
            saved_at  TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()


def save_results(conn: sqlite3.Connection, results: list[dict]) -> int:
    """Insert iTunes API result dicts into the songs table.

    Uses INSERT OR REPLACE keyed on the iTunes trackId so re-searching the
    same track refreshes the row instead of creating duplicates. Returns
    the number of rows written.
    """
    rows = []
    for r in results:
        track_id = r.get("trackId")
        if track_id is None:
            continue
        release = r.get("releaseDate", "") or ""
        year = release.split("-")[0] if release else None
        rows.append(
            (
                track_id,
                r.get("trackName", "Unknown Song"),
                r.get("artistName", "Unknown Artist"),
                r.get("collectionName"),
                year,
                r.get("primaryGenreName"),
            )
        )

    if not rows:
        return 0

    conn.executemany(
        """
        INSERT OR REPLACE INTO songs (track_id, song, artist, album, year, genre)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    conn.commit()
    return len(rows)


def fetch_all(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    """Return every saved song, newest first."""
    cur = conn.execute(
        "SELECT track_id, song, artist, album, year, genre, saved_at "
        "FROM songs ORDER BY saved_at DESC, song ASC"
    )
    return cur.fetchall()


def count_rows(conn: sqlite3.Connection) -> int:
    cur = conn.execute("SELECT COUNT(*) FROM songs")
    return cur.fetchone()[0]
