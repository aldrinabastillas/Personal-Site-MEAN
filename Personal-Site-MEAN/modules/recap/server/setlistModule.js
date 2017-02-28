/* Private Properties */
var express = require('express');
var keys = require('./privateKeys');
var request = require('request');
var spotify = require('../../shared/server/spotifyApiModule');
var app = express();

/* Public Methods */
exports.getSetlists = function (artist) {
    return new Promise(function (resolve, reject) {
        getArtistId(artist).then(function (artistId) {
            //get list of setlists given an artistId
            var url = 'http://api.setlist.fm/rest/0.1/artist/' + artistId + '/setlists.json';
            request.get(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var obj = JSON.parse(body);
                    if (obj.setlists.setlist.length > 0) {
                        resolve(obj.setlists.setlist);
                    }
                    else {
                        reject('getSetlists(): Setlist.fm returned an error.');
                    }
                }
            });
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

exports.getSetlistSongs = function (setlistId) {
    return new Promise(function (resolve, reject) {
        //get list of songs for the specified setlistId
        getSongNames(setlistId).then(function (songs) {
            //call getSongInfo on all songs
            var tasks = songs.map(getSongInfo);
            var setlist = Promise.all(tasks)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        }).catch(function (error) {
            reject(error);
        });
    }); //end promise
};

/* Private Methods*/
/**
 * TODO
 * @param song
 */
function getSongInfo(song) {
    return new Promise(function (resolve, reject) {
        spotify.getSong(song.name, song.artist)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                //if not found in spotify, just push the song and artist name
                resolve(song);
            });
    });
}

/**
 * See http://api.setlist.fm/docs/rest.0.1.search.artists.html
 * @param artist
 */
function getArtistId(artist) {
    return new Promise(function (resolve, reject) {
        var url = 'http://api.setlist.fm/rest/0.1/search/artists.json?artistName=' + artist;

        request.get(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                if (obj.artists.artist.length > 0) {
                    resolve(obj.artists.artist[0]['@mbid']);
                }
                else if (obj.artists.artist) {
                    resolve(obj.artists.artist['@mbid']);
                }
            }
            else {
                reject('getArtistId(): Setlist.fm returned an error.');
            }
        });
    });
}

function getSongNames(setlistId) {
    return new Promise(function (resolve, reject) {
        //example setlistId = 5bf9a7a8
        var url = 'http://api.setlist.fm/rest/0.1/setlist/' + setlistId + '.json';

        request.get(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                //loop through all songs in all sets
                var obj = JSON.parse(body);
                var songs = parseSets(obj.setlist.sets, obj.setlist.artist['@name']);
                resolve(songs);
            }
            else {
                reject('Setlist.fm returned an error.');
            }
        });
    });
}

function parseSets(sets, artist) {
    var songs = [];
    if (sets.length > 0) { //if there is an array of multiple sets
        sets.forEach(function (set) {
            songs = songs.concat(parseSingleSet(set, artist));
        });
    }
    else if (sets.set.song.length > 0) { //only one set object, check if there are songs
        songs = parseSingleSet(sets.set, artist);
    }
    return songs;
}

function parseSingleSet(set, artist) {
    var songs = [];
    if (set.song.length > 0) {
        set.song.forEach(function (song) {
            var songArtist = (song.cover && song.cover['@name']) ? song.cover['@name'] : artist;
            songs.push({
                name: song['@name'],
                artist: songArtist,
            });
        });
    }
    return songs;
}
