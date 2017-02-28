(function () {
    /* Private Properties */
    var request = require('request');
    var keys = require('./privateKeys');

    /* Public Methods */
    /** Given a song selected from the dropdown in /modules/spotify/client/templates/predictionColumn.html
     * returns the song's audio features. 
     * See https://developer.spotify.com/web-api/get-audio-features/
     * Calls https://api.spotify.com/v1/audio-features/{id}
     * @param songId
     */
    exports.getAudioFeatures = function (songId) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/audio-features/' + songId;
            sendSpotifyQuery(endpoint).then(function (result) {
                resolve(result);
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };

    /**
     * Gets the year a track was released by first getting its album
       and then returning the Date the album was released
     * @param songId
     */
    exports.getTrackReleaseDate = function (songId) {
        return new Promise(function (resolve, reject) {
            getAlbumId(songId).then(function (result) {
                resolve(getAlbumReleaseDate(result));
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };

    /**
     * TODO
     */
    exports.getSong = function (song, artist) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/search'
            var params = '?q=track:' + song + ' artist:' + artist + '&type=track';
            sendSpotifyQuery(endpoint + params).then(function (result) {
                if (result.tracks.total > 0) {
                    var tempSong = result.tracks.items[0];
                    var info = {
                        id: tempSong['id'],
                        name: tempSong['name'],
                        preview: tempSong['preview_url'],
                        uri: tempSong['uri'],
                        image: tempSong.album.images[2]['url'],
                        album: tempSong.album['name'],
                        artist: tempSong.artists[0]['name'],
                    };
                    console.log(info);
                    resolve(info);
                }
                else {
                    reject(reason);
                }
            }).catch(function (reason) {
                reject(reason);
            });

        });
    };


    /* Private Methods */
    /**
     * Gets the album ID for a song.
     * See https://developer.spotify.com/web-api/get-track/
     * Calls https://api.spotify.com/v1/tracks/{id}
     * @param songId
     */
    function getAlbumId(songId) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/tracks/' + songId;
            sendSpotifyQuery(endpoint).then(function (result) {
                var albumId = result.album.id
                if (albumId) {
                    resolve(albumId);
                }
                else {
                    reject('Could not get album ID');
                }
            });
        });
    };

    /**
     * Gets the release date for an album
     * See https://developer.spotify.com/web-api/get-album/
     * Calls https://api.spotify.com/v1/albums/{id}
     * @param albumId
     */
    function getAlbumReleaseDate(albumId) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/albums/' + albumId;
            sendSpotifyQuery(endpoint).then(function (result) {
                var date = result.release_date;
                if (date) {
                    resolve(date);
                }
                else {
                    reject(-1);
                }
            });
        });
    };

    /**
     * First gets an access token, and then given a Spotify API endpoint, returns the response
     * @param endpoint
     */
    function sendSpotifyQuery(endpoint) {
        // Gets an access token for Spotify's Web APIs
        // See https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow
        return new Promise(function (resolve, reject) {
            var client_id = keys.spotify_client_id;
            var client_secret = keys.spotify_client_secret;
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                form: {
                    grant_type: 'client_credentials'
                },
                json: true
            };

            //Sends request to a given endpoint with the access token 
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var accessToken = body.access_token;
                    var options = {
                        url: endpoint,
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        },
                        json: true
                    };
                    request.get(options, function (error, response, body) {
                        resolve(body);
                    });
                }
                else {
                    reject('Could not obtain access token');
                }
            });
        });
    };
})();

