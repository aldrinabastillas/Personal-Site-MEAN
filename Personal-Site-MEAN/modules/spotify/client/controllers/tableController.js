﻿(function () {
    var tableApp = angular.module('tableApp', []);

    tableApp.controller('TableController', ['$scope', '$http', function ($scope, $http) {
        $scope.billboardListCache = {}; //save lists that were already loaded
        $scope.billboardSongs = [];

        //get Billboard Top 100 songs from a past year
        $scope.getYearList = function (selectedYear) {
            //first check local cache
            if ($scope.billboardListCache[selectedYear] !== undefined) {
                $scope.billboardSongs = spotify.billboardListCache[selectedYear];
            }
            else {
                $http.get('/getYearList' + selectedYear)
                    .then(function successHandler(response) {
                        var songs = [];
                        $.each(response.data, function (index, item) {
                            songs.push({
                                Position: item.Position,
                                Song: item.Song,
                                Artist: item.Artist
                            });
                        });
                        $scope.billboardListCache[selectedYear] = songs; //add to cache
                        $scope.billboardSongs = null;
                        $scope.billboardSongs = songs;
                    });
            }
        };

        $scope.populateDropdown = function () {
            var mostRecentList = 2015;
            //populate year dropdown
            $scope.availableYears = [];
            var currentYear = new Date().getFullYear();
            for (i = mostRecentList; i >= 1946; i--) {
                $scope.availableYears.push(i);
            }
            $scope.selectedYear = $scope.availableYears[0]; //default in the most recent year
            $scope.getYearList($scope.selectedYear);
        } (); //invoke upon page load, table rows don't bind when called from link function for some reason
    }]);
    

})();