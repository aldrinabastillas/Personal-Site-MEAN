(function () {
    'use strict';

    angular
        .module('mainApp')
        .directive('contact', contact)
        .directive('images', images)
        .directive('introHeader', introHeader)
        .directive('navigationBar', navigationBar)
        .directive('projects', projects)
        .directive('subpageNavBar', subpageNavBar)
        .directive('visualizerModal', visualizerModal);

    function contact() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/contact.html'
        }
        return directive;
    };

    function images() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/images.html'
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

    function navigationBar() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/navigationBar.html'
        };
        return directive;
    };

    function projects() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/projects.html'
        };
        return directive;
    };

    function subpageNavBar() {
        var directive = {
            restrict: 'E',
            templateUrl: '/shared/subpageNavBar.html'
        };
        return directive;
    };

    function visualizerModal() {
        var directive = {
            restrict: 'E',
            templateUrl: '/home/templates/visualizer.html'
        };
        return directive;
    };

})();