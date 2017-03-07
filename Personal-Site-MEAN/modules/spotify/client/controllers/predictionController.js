(function () {
    'use strict';

    angular
        .module('spotifyApp')
        .controller('PredictionController', PredictionController);

    PredictionController.$inject = ['$http'];

    function PredictionController($http) {
        var vm = this;

        //Public Functions
        vm.getPrediction = getPrediction;
        vm.songSearch = songSearch;
        

        //Public Properties
        vm.errorText = '';
        vm.prediction = '';
        vm.probability = '';
        vm.selectedSong = '';
        vm.selectedArtist = '';


        //Implementations

        /**
         * Free text search songs in Spotify's library
         */
        function getSongSearchOptions() {
            var options = {
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
                    vm.getPrediction(result.id);
                    vm.selectedSong = result.title;
                    vm.selectedArtist = result.description;

                    var url = 'https://embed.spotify.com/?uri=spotify:track:' + result.id;
                    $('#spotifyPlayer').attr('src', url); //change song in the player
                    //$('#play-button').click(); //not supported by Spotify
                }
            };
            return options;
        };

        
        /**
         * Gets a prediction for a song given a Spotify song ID
         * Called from getSongSearchOptions
         * @param {string} songId 
         */
        function getPrediction(songId) {
            $http.get('/spotify/getPrediction/' + songId)
                .then(function successHandler(response) {
                    var label = response.data['Scored Labels'];
                    var probability = response.data['Scored Probabilities'] * 100;
                    var prediction = 'likely';

                    if (label == 'False') {
                        probability = 100 - probability; //Given probability is that the label is True, so flip if False
                        prediction = 'not likely';
                    }

                    vm.prediction = prediction;
                    vm.probability = probability.toFixed(2) + '%';
                },
                function errorHandler(response) {
                    vm.errorText = response.data;
                });
        };

        var songSearch = $('#songSearch').search(getSongSearchOptions());
    }; //end controller

})();