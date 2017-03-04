(function () {
    /* Module */
    angular
        .module('mainApp', ['ngRoute', 'home-directives', 'spotifyApp', 'recapApp'])
        .controller('MainController', function () {
            var vm = this;
            vm.year = new Date().getFullYear();
        })
        .config(function ($routeProvider, $locationProvider) {
            /* Routes */
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