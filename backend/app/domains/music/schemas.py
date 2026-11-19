from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SongBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    artist: str = Field(min_length=1, max_length=255)
    album: str | None = Field(default=None, max_length=255)
    duration_seconds: int | None = Field(default=None, ge=0)
    year: int | None = Field(default=None, ge=0, le=9999)


class SongCreate(SongBase):
    pass


class SongUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    artist: str | None = Field(default=None, min_length=1, max_length=255)
    album: str | None = Field(default=None, max_length=255)
    duration_seconds: int | None = Field(default=None, ge=0)
    year: int | None = Field(default=None, ge=0, le=9999)


class SongRead(SongBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class PlaylistBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None


class PlaylistCreate(PlaylistBase):
    pass


class PlaylistUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None


class PlaylistRead(PlaylistBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class PlaylistDetail(PlaylistRead):
    songs: list[SongRead] = []


class PlaylistSongAdd(BaseModel):
    song_id: int
    position: int | None = Field(default=None, ge=0)
