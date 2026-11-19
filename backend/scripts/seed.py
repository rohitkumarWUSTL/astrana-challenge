import asyncio

from sqlalchemy import select

from app.core.database import SessionLocal
from app.domains.music import models


SONGS = [
    {"title": "Bohemian Rhapsody", "artist": "Queen", "album": "A Night at the Opera", "duration_seconds": 354, "year": 1975},
    {"title": "Imagine", "artist": "John Lennon", "album": "Imagine", "duration_seconds": 183, "year": 1971},
    {"title": "Smells Like Teen Spirit", "artist": "Nirvana", "album": "Nevermind", "duration_seconds": 301, "year": 1991},
    {"title": "Billie Jean", "artist": "Michael Jackson", "album": "Thriller", "duration_seconds": 294, "year": 1982},
    {"title": "Like a Rolling Stone", "artist": "Bob Dylan", "album": "Highway 61 Revisited", "duration_seconds": 369, "year": 1965},
]

PLAYLISTS = [
    {"name": "Classics", "description": "Timeless tracks across decades."},
    {"name": "Focus", "description": "Background listening for deep work."},
]


async def main() -> None:
    async with SessionLocal() as db:
        existing = await db.execute(select(models.Song))
        if existing.scalars().first() is not None:
            print("Songs already present; skipping seed.")
            return

        songs = [models.Song(**s) for s in SONGS]
        db.add_all(songs)
        await db.flush()

        playlists = [models.Playlist(**p) for p in PLAYLISTS]
        db.add_all(playlists)
        await db.flush()

        # Add first three songs to "Classics", last two to "Focus".
        for i, song in enumerate(songs[:3]):
            db.add(models.PlaylistSong(playlist_id=playlists[0].id, song_id=song.id, position=i))
        for i, song in enumerate(songs[3:]):
            db.add(models.PlaylistSong(playlist_id=playlists[1].id, song_id=song.id, position=i))

        await db.commit()
        print(f"Seeded {len(songs)} songs and {len(playlists)} playlists.")


if __name__ == "__main__":
    asyncio.run(main())
