(function () {
    angular
        .module('mainApp')
        .directive('dependencies', dependencies)
        .directive('visualizerModal', function () {
            return {
                restrict: 'E',
                templateUrl: '/home/templates/visualizer.html'
            }
        })
        .directive('navigationBar', function () {
            return {
                restrict: 'E',
                templateUrl: '/home/templates/navigationBar.html'
            }
        })
        .directive('subpageNavBar', function () {
            return {
                restrict: 'E',
                templateUrl: '/shared/subpageNavBar.html'
            }
        })
        .directive('introHeader', introHeader)
        .directive('projects', function () {
            return {
                restrict: 'E',
                templateUrl: '/home/templates/projects.html'
            }
        })
        .directive('contact', function () {
            return {
                restrict: 'E',
                templateUrl: '/home/templates/contact.html'
            }
        })
        .directive('images', function () {
            return {
                restrict: 'E',
                templateUrl: '/home/templates/images.html'
            }
        });

    function dependencies() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/dependencies.html'
        };
        return directive;
    };

    function introHeader() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/introHeader.html'
        };
        return directive;
    };

})();