const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this.pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name 
			FROM playlists 
			LEFT JOIN users ON users.id=playlists.owner 
			WHERE playlists.id=$1`,
      values: [playlistId],
    };

    const playlist = await this.pool.query(playlistQuery);

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer 
			FROM songs 
			JOIN playlist_songs ON songs.id = playlist_songs.song_id 
			WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songs = await this.pool.query(songsQuery);

    return {
      id: playlist.rows[0].id,
      name: playlist.rows[0].name,
      songs: songs.rows,
    };
  }
}

module.exports = PlaylistService;
