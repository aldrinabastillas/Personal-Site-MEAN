(function () {
    var app = angular.module('setlistApp', []);

    app.controller('SetlistController', ['$scope', '$http', function ($scope, $http) {
        $scope.artistSearch = $('#artistSearch').search({
            apiSettings: {
                url: 'https://api.spotify.com/v1/search?q={query}&type=artist',
                onResponse: function (spotifyResponse) {
                    var response = {
                        results: []
                    };

                    //iterate through results from Spotify
                    //See https://developer.spotify.com/web-api/search-item/ for structure
                    $.each(spotifyResponse.artists.items, function (i, artist) {
                        response.results.push({
                            title: artist.name,
                            image: (artist.images.length == 3) ? artist.images[0].url : "", //pick smallest image
                            id: artist.id
                        });
                    });
                    return response;
                }
            },
            fields: { //map results from Spotify to Semantic-UI API
                results: 'results',
                title: 'title',
                image: 'image'
            },
            minCharacters: 3,
            onSelect: function (result, response) {
                $scope.getSetlists(result.title);
            }
        }); //end artistSearch

        $scope.getSetlists = function (artist) {
            $http.get('/getSetlists' + artist)
                .then(function successHandler(response) {
                    //TODO: display list of setlists
                },
                function errorHandler(response) {

                });
        }; //end getSetlists

    }]); //end controller
})(); //end closure