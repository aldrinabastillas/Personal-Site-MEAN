(function () {
    var tableApp = angular.module('tableApp', []);

    tableApp.controller('TableController', ['$scope', '$http', function ($scope, $http) {
        $scope.billboardListCache = {}; //save lists that were already loaded
        $scope.billboardSongs = [];

        //get Billboard Top 100 songs from a past year
        //queries the DB using /module/spotify/client/server/tableModule
        $scope.getYearList = function (selectedYear) {
            //first check local cache
            if ($scope.billboardListCache[selectedYear] !== undefined) {
                $scope.billboardSongs = $scope.billboardListCache[selectedYear];
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
            //populates the years in the dropdown selection
            $scope.availableYears = [];
            var currentYear = new Date().getFullYear();
            for (i = mostRecentList; i >= 1946; i--) {
                $scope.availableYears.push(i);
            }
            $scope.selectedYear = mostRecentList; //default in the most recent year
        }();

        $scope.getYearList($scope.selectedYear); //invoke upon page load, the returned table rows 
        //aren't binding when called from link function in the table directive
    }]);
    

})();