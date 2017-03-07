(function () {
    'use strict';

    angular
        .module('spotifyApp')
        .controller('TableController', TableController);

    TableController.$inject = ['$http'];

    function TableController($http) {
        var vm = this;

        // Public Functions
        vm.getYearList = getYearList;
        vm.populateDropdown = populateDropdown;


        // Public Properties
        vm.availableYears = [];
        vm.billboardListCache = {}; //save lists that were already loaded
        vm.billboardSongs = [];
        vm.selectedYear = 2015;


        // Function Implementations


        /**
         * Get Billboard Top 100 songs from a past year
         * Queries the DB using /module/spotify/client/server/tableModule
         * @param {*} selectedYear 
         */
        function getYearList(selectedYear) {
            //first check local cache
            if (vm.billboardListCache[selectedYear] !== undefined) {
                vm.billboardSongs = vm.billboardListCache[selectedYear];
            }
            else {
                $http.get('/spotify/getYearList/' + selectedYear)
                    .then(function successHandler(response) {
                        var songs = [];
                        $.each(response.data, function (index, item) {
                            songs.push({
                                Position: item.Position,
                                Song: item.Song,
                                Artist: item.Artist
                            });
                        });
                        vm.billboardListCache[selectedYear] = songs; //add to cache
                        vm.billboardSongs = null;
                        vm.billboardSongs = songs;
                    });
            }
        };
        getYearList(vm.selectedYear); //invoke upon page load, TODO: move to directive

        /**
         * 
         */
        function populateDropdown() {
            var mostRecentList = 2015;
            //populates the years in the dropdown selection
            vm.availableYears = [];
            var currentYear = new Date().getFullYear();
            for (var i = mostRecentList; i >= 1946; i--) {
                vm.availableYears.push(i);
            }
            vm.selectedYear = mostRecentList; //default in the most recent year
        };
        populateDropdown();


    }; //end TableController


})();