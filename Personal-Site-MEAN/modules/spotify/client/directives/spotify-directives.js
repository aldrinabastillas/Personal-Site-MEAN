(function () {
    angular.module('spotify-directives', [])
        .directive('subpageNavBar', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/subpageNavBar.html',
            }
        })
        .directive('playerColumn', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/playerColumn.html',
            }
        })
        .directive('predictionColumn', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/predictionColumn.html',
            }
        })
        .directive('tableColumn', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/tableColumn.html',
            }
        })
        .directive('descriptionPanels', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/descriptionPanels.html',
            }
        });

})();