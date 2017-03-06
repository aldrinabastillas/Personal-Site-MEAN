(function () {
    angular
        .module('mainApp', ['ngRoute', 'spotifyApp', 'recapApp'])
        .controller('MainController', MainController)
        .config(MainRoutes);

        /**
         * Just sets the year in the footer so far
         */
        function MainController(){
            var vm = this;
            vm.year = new Date().getFullYear();
        };

        function MainRoutes ($routeProvider, $locationProvider) {
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
        };

})();