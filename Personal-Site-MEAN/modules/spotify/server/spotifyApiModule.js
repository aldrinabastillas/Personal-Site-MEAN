(function () {
    /* Private Properties */
    var request = require('request');

    /* Public Methods */
    /**
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
    }

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
    }

    /* Private Methods */
    /**
     * Gets the album ID for a song
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
     * 
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
    }

    /**
     * 
     * @param endpoint
     */
    function sendSpotifyQuery(endpoint) {
        return new Promise(function (resolve, reject) {
            var client_id = '3af0f886f6e1419e824f334d91f4b8ff';
            var client_secret = 'c44eb13f52ec433fafc69e05fb3581bb';
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

