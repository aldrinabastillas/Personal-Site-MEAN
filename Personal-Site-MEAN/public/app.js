(function () {
    /* Module */
    var app = angular.module('mainApp', ['ngRoute', 'home-directives', 'spotifyApp']);

    /* Controller */
    app.controller('MainController', ['$scope', function ($scope) {
        $scope.year = new Date().getFullYear();
    }]);

    /* Routes */
    app.config(function ($routeProvider) {
        //for ng-view on public/index.html
        $routeProvider
            .when('/', {
                templateUrl: '/modules/home/client/index.html'
            })
            .when('/Spotify', {
                templateUrl: '/modules/spotify/client/index.html',
            });
    });


})();