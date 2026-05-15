Quinn Smiley
CIT 383
May 10th, 2026

Part 1

1. SongLookUp

2. iTunes

3. API

4. SQLite

5. Songs



Part 2

1. db.py

2. Schema (one table, six data columns + an auto timestamp):
    songs(
        track_id  INTEGER PRIMARY KEY,   -- iTunes trackId, prevents duplicates
        song      TEXT NOT NULL,
        artist    TEXT NOT NULL,
        album     TEXT,
        year      TEXT,
        genre     TEXT,
        saved_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )

3. trackid, song, artist, album, year, genre, saved_at

4. 5 per input



Part 4

1. iTunes

2. Top 5 search results

3. The top 5 results, and the search

4. The top 5 search results including the title, artist, album, year, and genre




Part 5

The tool sends a GET request to iTunes public search with the inut used as URL parameters. Becuasse its using API the response is in JSON. The data is processed by filtering the fields that are needed. The data is stored in one table with track_id as the primary key and song, artist, album, year, genre, and saved_at as columns. The easiest part was using the API to fetch the data. The hardest part was thinking about what data was necessary and how to restructure it for the user. 




Part 6

This project confirmed that API is the best way to fetch data. While web-scraping is a useful tool for when API is unavailable, API requests are the most reliable and readable way to gather data. 

Local storage is useful for a data collection tool because it allows us to store data without actually creating a database or server. it was especially useful for this short-term project which was fairly simple. 

If the tool were to run automatically every day there would be a severe risk of duplicates especially when taking the saved_at column into account. 

AI wrote most of the code for me (ran out of time), but I was still able to come up with something that I fully understand. I would improve the data that is collected becuase right now there are a lot of unecessary fields. 