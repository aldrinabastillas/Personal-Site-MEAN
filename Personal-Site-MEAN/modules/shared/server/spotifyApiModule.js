(function () {
    /* Private Properties */
    var request = require('request');
    var keys = require('./privateKeys');
    var app = require('express')();
    var cookieParser = require('cookie-parser');
    var NodeCache = require("node-cache");
    var cache = new NodeCache();
    app.use(cookieParser());

    /* Public Methods */
    /**
     * Given a song selected from the dropdown in /modules/spotify/client/templates/predictionColumn.html
     * returns the song's audio features. 
     * See https://developer.spotify.com/web-api/get-audio-features/
     * Calls https://api.spotify.com/v1/audio-features/{id}
     * @param songId
     */
    exports.getAudioFeatures = function (songId) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/audio-features/' + songId;
            getSpotifyQuery(endpoint).then(function (result) {
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
                resolve(getAlbumReleaseDate(result, res, req));
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };

    /**
     * Called from getSongInfo in setlistModule
     */
    exports.getSong = function (song, artist) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/search'
            var params = '?q=track:' + song + ' artist:' + artist + '&type=track';
            getSpotifyQuery(endpoint + params).then(function (result) {
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
            getSpotifyQuery(endpoint).then(function (result) {
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
            getSpotifyQuery(endpoint).then(function (result) {
                var date = result.release_date;
                if (date) {
                    resolve(date);
                }
                else {
                    reject(0);
                }
            }).catch(function (err) {
                reject('getAlbumReleaseDate: ' + err);
            });
        });
    };

    /**
     * 
     * @param endpoint
     */
    function getSpotifyQuery(endpoint) {
        return new Promise(function (resolve, reject) {
            getAccessToken().then(function (accessToken) {
                //Sends request to a given endpoint with the access token 
                var options = {
                    url: endpoint,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    json: true
                };
                request.get(options, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        resolve(body);
                    }
                    else {
                        reject('getSpotifyQuery: ' + error);
                    }
                });
            });
        });
    };

    /**
     * Gets an access token for Spotify's Web APIs
     * See https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow
     */
    function getAccessToken() {
        return new Promise(function (resolve, reject) {
            //currently have an access token which is not expired
            var accessToken = cache.get('api_token');
            if(accessToken){
                resolve(accessToken);
            }
            else {
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

                request.post(authOptions, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var access_token = body.access_token;
                        var test = cache.set('api_token', access_token, body.expires_in);
                        resolve(access_token);
                    }
                    else {
                        reject('getAccessToken: ' + error);
                    }
                });
            }
        });
    }; //end getAccessToken


})(); //end closure

