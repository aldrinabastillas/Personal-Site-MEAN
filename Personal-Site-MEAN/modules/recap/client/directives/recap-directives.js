(function () {
    angular.module('recap-directives', [])
        .directive('subpageNavBar', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/recap/client/templates/subpageNavBar.html',
            }
        })
        .directive('setlistSearch', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/recap/client/templates/setlistSearch.html',
            }
        });
})(); //end closure