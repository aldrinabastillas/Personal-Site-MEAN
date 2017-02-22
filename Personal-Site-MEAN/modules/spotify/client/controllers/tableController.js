(function () {
    var tableApp = angular.module('tableApp', []);

    tableApp.run(function () {
        $('table').tablesort(); //sets up a sortable table, see http://semantic-ui.com/collections/table.html#sortable

        $('a[role="button"]').click(function () { //flip accordion panel arrows
            if ($(this).attr('aria-expanded') == 'true') {
                $(this).children('span').attr('class', 'panelArrow glyphicon glyphicon-chevron-down');
            }
            else {
                $(this).children('span').attr('class', 'panelArrow glyphicon glyphicon-chevron-up');
            }
        });
    });

    
    tableApp.controller('TableController', ['$scope', '$http', function ($scope, $http) {
        var mostRecentList = 2015;
        //populate year dropdown
        $scope.availableYears = [];
        var currentYear = new Date().getFullYear();
        for (i = mostRecentList; i >= 1946; i--) {
            $scope.availableYears.push(i);
        }
        $scope.selectedYear = $scope.availableYears[0]; //default in the most recent year


        //get Billboard Top 100 songs from a past year
        $scope.billboardListCache = {}; //save lists that were already loaded
        $scope.billboardSongs = [];
        $scope.getYearList = function (selectedYear) {
            //first check local cache
            if ($scope.billboardListCache[selectedYear] !== undefined) {
                $scope.billboardSongs = spotify.billboardListCache[selectedYear];
            }
            else {
                $http.get('GetYearList/' + selectedYear)
                    .success(function (response, status) {
                        var songs = [];
                        $.each(response, function (index, item) {
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

        //invoke getYearList upon page load -uncomment for now 
        //$scope.getYearList($scope.selectedYear);

    }]);
    

})();