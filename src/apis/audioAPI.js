import { BASE_API_URL } from '../config/constants'

async function fetchGETSongMetadata(songID) {
    const response = await fetch(`${BASE_API_URL}/audio-services/song/${songID}/metadata`, {
        method: 'GET',
        credentials: 'include',
    })

    return await response.json();
}

async function fetchGETArtistMetadata(artistID) {
    const response = await fetch(`${BASE_API_URL}/audio-services/artist/${artistID}/metadata`, {
        method: 'GET',
        credentials: 'include',
    })

    return await response.json();
}

async function fetchGETAlbumMetadata(albumID) {
    const response = await fetch(`${BASE_API_URL}/audio-services/album/${albumID}/metadata`, {
        method: 'GET',
        credentials: 'include',
    })

    return await response.json();
}

async function fetchGETAlbumSongs(albumID) {
    const response = await fetch(`${BASE_API_URL}/audio-services/album/${albumID}/songs`, {
        method: 'GET',
        credentials: 'include',
    })

    return await response.json();
}

export default {
    fetchGETSongMetadata,
    fetchGETArtistMetadata,
    fetchGETAlbumMetadata,
    fetchGETAlbumSongs
}