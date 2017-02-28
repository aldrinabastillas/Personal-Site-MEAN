(function () {
    var app = angular.module('setlistApp', []);

    app.controller('SetlistController', ['$scope', '$http', function ($scope, $http) {

        /* Free-text search for an artist in Spotify */
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


        /* Given an artist, display setlists*/
        $scope.getSetlists = function (artist) {
            $http.get('/getSetlists/' + artist)
                .then(function (response) {
                    var setlistArr = [];
                    $.each(response.data, function (index, item) {
                        var date = parseDate(item['@eventDate']);
                        var venue = item['venue']['@name'] + ', ' + item['venue']['city']['@name'];
                        //var songs = (item['sets'] != "") ? item['sets']['set']['song'].length : 0;
                        setlistArr.push({
                            date: date,
                            venue: venue,
                            id: item['@id'],
                            //songs: songs
                        });
                    });

                    $scope.setlists = setlistArr;
                }).catch(function (e) {
                    $scope.noSetlists = true;
                });
        }; //end getSetlists


        /* Parse dates from Setlist.fm into JS format*/
        function parseDate (dateString) {
            //dates from setlist.fm are 'DD-MM-YYY'
            var split = dateString.split('-');

            //which is incompatible with JS and Angular
            //year, month (0-11), date
            return new Date(split[2], split[1] - 1, split[0]);
        }; //end parseDate

        $scope.getSetlistSongs = function (setlistId) {
            console.log(setlistId);
            $http.get('/getSetlistSongs/' + setlistId)
                .then(function (response) {
                    $scope.songs = response.data
                }).catch(function (e) {
                    console.log(e);
                });
        }; //end getSetlistSongs

    }]); //end controller
})(); //end closure