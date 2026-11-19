from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Song(Base):
    __tablename__ = "songs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    artist: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    album: Mapped[str | None] = mapped_column(String(255), nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    playlist_links: Mapped[list["PlaylistSong"]] = relationship(
        back_populates="song", cascade="all, delete-orphan"
    )


class Playlist(Base):
    __tablename__ = "playlists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    song_links: Mapped[list["PlaylistSong"]] = relationship(
        back_populates="playlist",
        cascade="all, delete-orphan",
        order_by="PlaylistSong.position",
    )


class PlaylistSong(Base):
    __tablename__ = "playlist_songs"
    __table_args__ = (UniqueConstraint("playlist_id", "song_id", name="uq_playlist_song"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    playlist_id: Mapped[int] = mapped_column(
        ForeignKey("playlists.id", ondelete="CASCADE"), nullable=False, index=True
    )
    song_id: Mapped[int] = mapped_column(
        ForeignKey("songs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    playlist: Mapped[Playlist] = relationship(back_populates="song_links")
    song: Mapped[Song] = relationship(back_populates="playlist_links")
