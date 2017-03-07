(function () {
    'use strict';

    // Modules
    var request = require('request');
    var keys = require('./privateKeys'); //not in repo
    var app = require('express')();
    var cookieParser = require('cookie-parser');
    var NodeCache = require("node-cache");
    var cache = new NodeCache();
    app.use(cookieParser());

    // Public Functions
    exports.getAccessToken = getAccessToken;
    exports.getSpotifyQuery = getSpotifyQuery;
    exports.postSpotifyData = postSpotifyData;


    //Function Implementations

    /**
     * Gets an access token for Spotify's Web APIs
     * See https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow
     */
    function getAccessToken(accessToken) {
        return new Promise(function (resolve, reject) {
            //currently have an access token or one in cahc
            //which is not expired
            if (accessToken) {
                resolve(accessToken);
            }
            else if (cache.get('api_token')) {
                resolve(cache.get('api_token'));
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

    /**
     * 
     * @param endpoint {string} URL of Spotify API
     */
    function getSpotifyQuery(endpoint, accessToken) {
        return new Promise(function (resolve, reject) {
            getAccessToken(accessToken).then(function (accessToken) {
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
    }; //end getSpotifyQuery


    /**
     * 
     * @param {*} endpoint 
     * @param {*} accessToken 
     * @param {*} body 
     */
    function postSpotifyData (endpoint, accessToken, body) {
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
                    reject('Response from SpotifyAPIs: ' + response.statusMessage);
                }
            });
        });
    }; //end postSpotifyData

})(); //end closure

