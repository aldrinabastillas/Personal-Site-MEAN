(function () {
    var app = angular.module('predictionApp', []);

    app.controller('PredictionController', ['$scope', '$http', function ($scope, $http) {
        //free text search songs in Spotify
        $scope.songSearch = $('#songSearch').search({
            apiSettings: {
                url: 'https://api.spotify.com/v1/search?q={query}&type=track',
                onResponse: function (spotifyResponse) {
                    var response = {
                        results: []
                    };

                    //iterate through results from Spotify
                    //See https://developer.spotify.com/web-api/search-item/ for structure
                    $.each(spotifyResponse.tracks.items, function (i, track) {
                        response.results.push({
                            title: track.name,
                            description: track.artists[0].name,
                            image: track.album.images[2].url,
                            id: track.id
                        });
                    });
                    return response;
                }
            },
            fields: { //map results from Spotify to Semantic-UI API
                results: 'results',
                title: 'title',
                description: 'description',
                image: 'image'
            },
            minCharacters: 3,
            onSelect: function (result, response) {
                //call getPrediction below
                $scope.getPrediction(result.id);
                $scope.selectedSong = result.title;
                $scope.selectedArtist = result.description;

                var url = 'https://embed.spotify.com/?uri=spotify:track:' + result.id;
                $('#spotifyPlayer').attr('src', url); //change song in the player
                //$('#play-button').click(); //not supported by Spotify
            }
        });

        //gets a prediction for a song
        $scope.getPrediction = function (songId) {
            $http.get('/getPrediction' + songId)
                .then(function successHandler(response) {
                    var label = response.data['Scored Labels'];
                    var probability = response.data['Scored Probabilities'] * 100;
                    var prediction = 'likely';

                    if (label == 'False') {
                        probability = 100 - probability; //Given probability is that the label is True, so flip if False
                        prediction = 'not likely';
                    }

                    $scope.prediction = prediction;
                    $scope.probability = probability.toFixed(2) + '%';
                },
                function errorHandler(response) {
                    $scope.errorText = response.data;
                });
        };
    }]);
})();