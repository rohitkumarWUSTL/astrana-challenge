from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.music import models, schemas


# ---------- Songs ----------

async def list_songs(db: AsyncSession) -> list[models.Song]:
    result = await db.execute(select(models.Song).order_by(models.Song.title))
    return list(result.scalars().all())


async def get_song(db: AsyncSession, song_id: int) -> models.Song | None:
    return await db.get(models.Song, song_id)


async def create_song(db: AsyncSession, data: schemas.SongCreate) -> models.Song:
    song = models.Song(**data.model_dump())
    db.add(song)
    await db.commit()
    await db.refresh(song)
    return song


async def update_song(
    db: AsyncSession, song: models.Song, data: schemas.SongUpdate
) -> models.Song:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(song, field, value)
    await db.commit()
    await db.refresh(song)
    return song


async def delete_song(db: AsyncSession, song: models.Song) -> None:
    await db.delete(song)
    await db.commit()


# ---------- Playlists ----------

async def list_playlists(db: AsyncSession) -> list[models.Playlist]:
    result = await db.execute(select(models.Playlist).order_by(models.Playlist.name))
    return list(result.scalars().all())


async def get_playlist(db: AsyncSession, playlist_id: int) -> models.Playlist | None:
    result = await db.execute(
        select(models.Playlist)
        .options(selectinload(models.Playlist.song_links).selectinload(models.PlaylistSong.song))
        .where(models.Playlist.id == playlist_id)
    )
    return result.scalar_one_or_none()


async def create_playlist(db: AsyncSession, data: schemas.PlaylistCreate) -> models.Playlist:
    playlist = models.Playlist(**data.model_dump())
    db.add(playlist)
    await db.commit()
    await db.refresh(playlist)
    return playlist


async def update_playlist(
    db: AsyncSession, playlist: models.Playlist, data: schemas.PlaylistUpdate
) -> models.Playlist:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(playlist, field, value)
    await db.commit()
    await db.refresh(playlist)
    return playlist


async def delete_playlist(db: AsyncSession, playlist: models.Playlist) -> None:
    await db.delete(playlist)
    await db.commit()


async def add_song_to_playlist(
    db: AsyncSession, playlist: models.Playlist, data: schemas.PlaylistSongAdd
) -> models.Playlist:
    song = await db.get(models.Song, data.song_id)
    if song is None:
        raise ValueError("song not found")

    existing = await db.execute(
        select(models.PlaylistSong).where(
            models.PlaylistSong.playlist_id == playlist.id,
            models.PlaylistSong.song_id == data.song_id,
        )
    )
    if existing.scalar_one_or_none() is not None:
        raise ValueError("song already in playlist")

    if data.position is None:
        max_pos = await db.execute(
            select(models.PlaylistSong.position)
            .where(models.PlaylistSong.playlist_id == playlist.id)
            .order_by(models.PlaylistSong.position.desc())
            .limit(1)
        )
        last = max_pos.scalar_one_or_none()
        position = (last + 1) if last is not None else 0
    else:
        position = data.position

    link = models.PlaylistSong(
        playlist_id=playlist.id, song_id=data.song_id, position=position
    )
    db.add(link)
    await db.commit()
    return await get_playlist(db, playlist.id)  # type: ignore[return-value]


async def remove_song_from_playlist(
    db: AsyncSession, playlist: models.Playlist, song_id: int
) -> models.Playlist:
    await db.execute(
        delete(models.PlaylistSong).where(
            models.PlaylistSong.playlist_id == playlist.id,
            models.PlaylistSong.song_id == song_id,
        )
    )
    await db.commit()
    return await get_playlist(db, playlist.id)  # type: ignore[return-value]
