import pytest


@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_song_crud(client):
    r = await client.post(
        "/api/music/songs",
        json={"title": "Test Song", "artist": "Tester", "duration_seconds": 120},
    )
    assert r.status_code == 201
    song = r.json()
    assert song["title"] == "Test Song"

    r = await client.get(f"/api/music/songs/{song['id']}")
    assert r.status_code == 200

    r = await client.patch(f"/api/music/songs/{song['id']}", json={"title": "Renamed"})
    assert r.status_code == 200
    assert r.json()["title"] == "Renamed"

    r = await client.delete(f"/api/music/songs/{song['id']}")
    assert r.status_code == 204

    r = await client.get(f"/api/music/songs/{song['id']}")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_playlist_flow(client):
    r = await client.post("/api/music/songs", json={"title": "A", "artist": "X"})
    song_id = r.json()["id"]

    r = await client.post("/api/music/playlists", json={"name": "My List"})
    assert r.status_code == 201
    playlist_id = r.json()["id"]

    r = await client.post(
        f"/api/music/playlists/{playlist_id}/songs", json={"song_id": song_id}
    )
    assert r.status_code == 200
    assert len(r.json()["songs"]) == 1

    r = await client.delete(f"/api/music/playlists/{playlist_id}/songs/{song_id}")
    assert r.status_code == 200
    assert r.json()["songs"] == []
