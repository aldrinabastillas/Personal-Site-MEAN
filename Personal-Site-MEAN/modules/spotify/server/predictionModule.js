/* Private Properties */
var express = require('express');
var spotify = require('./spotifyApiModule');
var request = require('request');
var app = express();

/* Public Methods */
/**
 * 
 * @param songId
 */
exports.getPrediction = function (songId) {
    return new Promise(function (resolve, reject) {
        var audioFeatures = spotify.getAudioFeatures(songId);
        var date = spotify.getTrackReleaseDate(songId);

        //wait for both requests to complete
        Promise.all([audioFeatures, date]).then(function (values) {
            callMLService(values[0], values[1]).then(function (prediction) {
                if (prediction.Results) {
                    resolve(prediction.Results.output1[0]);
                }
                else {
                    resolve(prediction);
                }
            }).catch(function (reason) {
                reject(reason);
            });
        });
    });
}

/* Private Methods*/
/**
 * 
 * @param audioFeatures
 * @param date
 */
function callMLService(audioFeatures, date) {
    return new Promise(function (resolve, reject) {
        var input = formatInput(audioFeatures, date);
        var endpoint = 'https://ussouthcentral.services.azureml.net/workspaces/90569c39ed404120800dca5909257988/services/4f74fa834a8e479d8d8795a21eeb3b74/execute?api-version=2.0&format=swagger';
        var apiKey = 'MwC/RyyU/RenwU9X6l1IIoBGQer/MdTz0Y7iDGDBwsM461ig1PtxPX7DlJGEzFqcAfabdC/HUSpHXOR+uczY7g==';
        var postBody = {
            url: endpoint,
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            body: input,
            json: true
        };

        request.post(postBody, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
            }
            else {
                reject('Try again: Microsoft Azure Machine Learning web service returned an error.');
            }
        });
    });
}

/**
 * Formats the input to the web service in the expected format
 * See https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-consume-web-services#request-response-service-rrs
 * @param audioFeatures
 * @param date
 */
function formatInput(audioFeatures, date) {
    var year = date.toString().split('-')[0];
    var decade = Math.floor(year / 10) * 10;
    return input = {
        'Inputs': {
            'input1': [
                {
                    'Decade': decade.toString(),
                    'Danceability': audioFeatures.danceability.toString(),
                    'Energy': audioFeatures.energy.toString(),
                    'Loudness': audioFeatures.loudness.toString(),
                    'Speechiness': audioFeatures.speechiness.toString(),
                    'Acousticness': audioFeatures.acousticness.toString(),
                    'Instrumentalness': audioFeatures.instrumentalness.toString(),
                    'Liveness': audioFeatures.liveness.toString(),
                    'Valence': audioFeatures.valence.toString(),
                    'Duration': audioFeatures.duration_ms.toString()
                }
            ]
        },
        'GlobalParameters': {}
    };
}
