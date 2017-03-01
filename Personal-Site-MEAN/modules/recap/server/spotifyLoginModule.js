(function () {
    var express = require('express');
    var app = express();
    var request = require('request');
    var querystring = require('querystring');
    var cookieParser = require('cookie-parser');
    var keys = require('./privateKeys');

    var stateKey = 'spotify_auth_state';
    var client_id = keys.spotify_client_id; // Your client id
    var redirect_uri = keys.spotify_redirect_uri; // Your redirect uri
    var client_secret = keys.spotify_client_secret; // Your secret

    app.use(cookieParser());

    /* Public Functions */
    exports.spotifyLogin = function (res) {
        var state = generateRandomString(16);
        res.cookie(stateKey, state);

        var scope = 'user-read-private playlist-modify-private'; //authorization

        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            })
        );
    };

    exports.savePlaylist = function (code, playlist) {
        return new Promise(function (resolve, reject) {
            //1: Get access token
            getAccessToken(code).then(function (accessToken) {
                //2: Get User ID
                getUserId(accessToken).then(function (userId) {
                    //3: Create Playlist 
                    createPlaylist(userId, accessToken, playlist.title).then(function (newPlaylist) {
                        //4: Add Tracks to Playlist
                        addSongs(userId, accessToken, newPlaylist.id, playlist.songs).then(function (snapshotId) {
                            resolve(newPlaylist.href);
                        });
                    });
                });
            });
            reject('Error saving playlist');
        });
    }; //end savePlaylist

    /* Private Functions*/
    function addSongs(userId, accessToken, playlistId, songs) {
        return new Promise(function (resolve, reject) {
            var body = {
                uris: [],
            }
            songs.forEach(function (song) {
                body.uris.push(song.uri);
            });

            var endpoint = 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks';
            postSpotifyData(endpoint, accessToken, body).then(function (response) {
                resolve(response.snapshot_id);
            }).catch(function (err) {
                reject(err);
            });
        });
    }; //end addSongs


    function createPlaylist(userId, accessToken, playlistTitle) {
        return new Promise(function (resolve, reject) {
            var body = {
                name: playlistTitle,
                public: false
            }
            var endpoint = 'https://api.spotify.com/v1/users/' + userId + '/playlists';
            postSpotifyData(endpoint, accessToken, body).then(function (response) {
                resolve(response);
            }).catch(function (err) {
                reject(err);
            });
        });
    }; //end createPlaylist


    function getUserId(accessToken) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/me';
            getSpotifyQuery(endpoint, accessToken).then(function (result) {
                resolve(result.id);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    function getAccessToken(code) {
        // Gets an access token for Spotify's Web APIs
        // See https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow

        return new Promise(function (resolve, reject) {
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                form: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirect_uri,
                },
                json: true
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body.access_token);
                }
                else {
                    reject('Could not obtain access token');
                }
            });

        }); //end Promise
    }; //end getAccessToken

    function getSpotifyQuery(endpoint, accessToken) {
        return new Promise(function (resolve, reject) {
            var options = {
                url: endpoint,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                json: true
            };
            request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
                else {
                    reject(error);
                }
            });
        });
    };

    function postSpotifyData(endpoint, accessToken, body) {
        return new Promise(function (resolve, reject) {
            var options = {
                url: endpoint,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                body: body,
                json: true
            };
            request.post(options, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    resolve(body);
                }
                else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
})();