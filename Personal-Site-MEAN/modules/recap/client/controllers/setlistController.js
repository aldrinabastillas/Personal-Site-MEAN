(function () {
    var app = angular.module('setlistApp', []);

    app.controller('SetlistController', ['$scope', '$http', '$window',
        function ($scope, $http, $window) {

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
                    var artist = result.title
                    $scope.selectedArtist = artist;
                    $scope.getSetlists(artist);
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
                        $scope.error = true;
                    });
            }; //end getSetlists

            /* Parse dates from Setlist.fm into JS format*/
            function parseDate(dateString) {
                var split = dateString.split('-'); //dates from setlist.fm are 'DD-MM-YYY'
                //which is incompatible with JS and Angular

                return new Date(split[2], split[1] - 1, split[0]); //year, month (0-11), date
            }; //end parseDate

            /*Given a setlist, get the songs info from Spotify*/
            $scope.getSetlistSongs = function (setlist) {
                $http.get('/getSetlistSongs/' + setlist.id)
                    .then(function (response) {
                        var title = $scope.selectedArtist + ' @ ' + setlist.venue;
                        $scope.playlist = {
                            title: title,
                            songs: response.data,
                        };
                    }).catch(function (e) {
                        //TODO:
                        $scope.error = true;
                    });
            }; //end getSetlistSongs

            $scope.playPreview = function (songId) {
                var preview = $('#' + songId).get(0);
                if (preview.paused) {
                    preview.play();
                }
                else {
                    preview.pause();
                }
            }; //end playPreview

            $scope.savePlaylist = function () {
                var playlist = JSON.stringify($scope.playlist);
                $http.post('/savePlaylist', playlist)
                    .then(function (response) {
                        console.log(response);
                    }).catch(function (e) {
                        console.log(e);
                    });
            };

            $scope.loginPopup = function () {
                $window.open('/modules/recap/client/templates/spotifyLogin.html',
                    'name', 'width=200,height=200');
                $http.get('/spotifyLogin');
            };

        }]); //end controller
})(); //end closure