/* Private Properties */
var express = require('express');
var keys = require('./privateKeys');
var request = require('request');
var app = express();

/* Public Methods */
exports.getSetlists = function (artist) {
    return new Promise(function (resolve, reject) {
        var artistId = getArtistId(artist).then(function (artistId) {
            //get list of setlists given an artistId
            var url = 'http://api.setlist.fm/rest/0.1/artist/' + artistId + '/setlists.json';
            request.get(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var obj = JSON.parse(body);
                    if (obj.setlists.setlist.length > 0) {
                        resolve(obj.setlists.setlist);
                    }
                    else {
                        reject('Setlist.fm returned an error.');
                    }
                }
            });
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

/* Private Methods*/
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
                reject('Setlist.fm returned an error.');
            }
        });
    });
}