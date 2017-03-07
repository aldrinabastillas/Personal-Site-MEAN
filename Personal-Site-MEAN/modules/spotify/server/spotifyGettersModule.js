(function () {
    'use strict';

    // Modules
    var request = require('request');
    var app = require('express')();
    var spotify = require('../../shared/server/spotifyQueryModule');

    // Public Functions
    exports.getAudioFeatures = getAudioFeatures;
    exports.getTrackReleaseDate = getTrackReleaseDate;


    // Function Implementations


    /**
     * Gets the album ID for a song.
     * See https://developer.spotify.com/web-api/get-track/
     * Calls https://api.spotify.com/v1/tracks/{id}
     * @param songId
     */
    function getAlbumId(songId) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/tracks/' + songId;
            spotify.getSpotifyQuery(endpoint).then(function (result) {
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
            spotify.getSpotifyQuery(endpoint).then(function (result) {
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
     * Given a song selected from the dropdown in /modules/spotify/client/templates/predictionColumn.html
     * returns the song's audio features. 
     * See https://developer.spotify.com/web-api/get-audio-features/
     * Calls https://api.spotify.com/v1/audio-features/{id}
     * @param songId
     */
    function getAudioFeatures(songId) {
        return new Promise(function (resolve, reject) {
            var endpoint = 'https://api.spotify.com/v1/audio-features/' + songId;
            spotify.getSpotifyQuery(endpoint).then(function (result) {
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
    function getTrackReleaseDate(songId) {
        return new Promise(function (resolve, reject) {
            getAlbumId(songId).then(function (result) {
                resolve(getAlbumReleaseDate(result));
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };

})(); //end closure