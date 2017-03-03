(function () {
    angular.module('home-directives', [])
        .directive('dependencies', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/dependencies.html'
            }
        })
        .directive('visualizerModal', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/visualizer.html'
            }
        })
        .directive('navigationBar', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/navigationBar.html'
            }
        })
        .directive('subpageNavBar', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/shared/client/subpageNavBar.html'
            }
        })
        .directive('introHeader', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/introHeader.html'
            }
        })
        .directive('projects', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/projects.html'
            }
        })
        .directive('contact', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/contact.html'
            }
        })
        .directive('images', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/home/client/templates/images.html'
            }
        });
})();