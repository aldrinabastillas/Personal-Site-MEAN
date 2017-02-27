(function () {
    /* Module */
    var app = angular.module('mainApp', ['ngRoute', 'home-directives', 'spotifyApp', 'recapApp']);

    /* Controller */
    app.controller('MainController', ['$scope', function ($scope) {
        $scope.year = new Date().getFullYear();
    }]);

    /* Routes */
    app.config(function ($routeProvider, $locationProvider) {
        //for ng-view on public/index.html
        $routeProvider
            .when('/', {
                templateUrl: '/modules/home/client/index.html'
            })
            .when('/Spotify', {
                templateUrl: '/modules/spotify/client/index.html',
            })
            .when('/Recap', {
                templateUrl: '/modules/recap/client/index.html',
            });


        //remove !# from route
        //$locationProvider.html5Mode(true); //breaks when refreshing page
    });


})();