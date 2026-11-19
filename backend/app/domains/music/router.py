from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.domains.music import schemas, service

router = APIRouter()


# ---------- Songs ----------

@router.get("/songs", response_model=list[schemas.SongRead])
async def list_songs(db: AsyncSession = Depends(get_session)):
    return await service.list_songs(db)


@router.get("/songs/{song_id}", response_model=schemas.SongRead)
async def get_song(song_id: int, db: AsyncSession = Depends(get_session)):
    song = await service.get_song(db, song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.post("/songs", response_model=schemas.SongRead, status_code=status.HTTP_201_CREATED)
async def create_song(payload: schemas.SongCreate, db: AsyncSession = Depends(get_session)):
    return await service.create_song(db, payload)


@router.patch("/songs/{song_id}", response_model=schemas.SongRead)
async def update_song(
    song_id: int, payload: schemas.SongUpdate, db: AsyncSession = Depends(get_session)
):
    song = await service.get_song(db, song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return await service.update_song(db, song, payload)


@router.delete("/songs/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_song(song_id: int, db: AsyncSession = Depends(get_session)):
    song = await service.get_song(db, song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    await service.delete_song(db, song)


# ---------- Playlists ----------

@router.get("/playlists", response_model=list[schemas.PlaylistRead])
async def list_playlists(db: AsyncSession = Depends(get_session)):
    return await service.list_playlists(db)


@router.get("/playlists/{playlist_id}", response_model=schemas.PlaylistDetail)
async def get_playlist(playlist_id: int, db: AsyncSession = Depends(get_session)):
    playlist = await service.get_playlist(db, playlist_id)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return schemas.PlaylistDetail(
        id=playlist.id,
        name=playlist.name,
        description=playlist.description,
        created_at=playlist.created_at,
        updated_at=playlist.updated_at,
        songs=[schemas.SongRead.model_validate(link.song) for link in playlist.song_links],
    )


@router.post(
    "/playlists", response_model=schemas.PlaylistRead, status_code=status.HTTP_201_CREATED
)
async def create_playlist(
    payload: schemas.PlaylistCreate, db: AsyncSession = Depends(get_session)
):
    return await service.create_playlist(db, payload)


@router.patch("/playlists/{playlist_id}", response_model=schemas.PlaylistRead)
async def update_playlist(
    playlist_id: int,
    payload: schemas.PlaylistUpdate,
    db: AsyncSession = Depends(get_session),
):
    playlist = await service.get_playlist(db, playlist_id)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return await service.update_playlist(db, playlist, payload)


@router.delete("/playlists/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_playlist(playlist_id: int, db: AsyncSession = Depends(get_session)):
    playlist = await service.get_playlist(db, playlist_id)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    await service.delete_playlist(db, playlist)


@router.post("/playlists/{playlist_id}/songs", response_model=schemas.PlaylistDetail)
async def add_song_to_playlist(
    playlist_id: int,
    payload: schemas.PlaylistSongAdd,
    db: AsyncSession = Depends(get_session),
):
    playlist = await service.get_playlist(db, playlist_id)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    try:
        updated = await service.add_song_to_playlist(db, playlist, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return schemas.PlaylistDetail(
        id=updated.id,
        name=updated.name,
        description=updated.description,
        created_at=updated.created_at,
        updated_at=updated.updated_at,
        songs=[schemas.SongRead.model_validate(link.song) for link in updated.song_links],
    )


@router.delete(
    "/playlists/{playlist_id}/songs/{song_id}", response_model=schemas.PlaylistDetail
)
async def remove_song_from_playlist(
    playlist_id: int, song_id: int, db: AsyncSession = Depends(get_session)
):
    playlist = await service.get_playlist(db, playlist_id)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    updated = await service.remove_song_from_playlist(db, playlist, song_id)
    return schemas.PlaylistDetail(
        id=updated.id,
        name=updated.name,
        description=updated.description,
        created_at=updated.created_at,
        updated_at=updated.updated_at,
        songs=[schemas.SongRead.model_validate(link.song) for link in updated.song_links],
    )
