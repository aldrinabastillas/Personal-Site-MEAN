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
                //controller: 'TableController',
                //controllerAs: 'tableCtrl',
                //bindToController: true,
                //scope: {
                //    populateDropdown: '&populateDropdown',
                //    billboardSongs: '='
                //},
                link: function (scope, element) {
                    $('table').tablesort(); //sets up a sortable table, see http://semantic-ui.com/collections/table.html#sortable

                    $('a[role="button"]').click(function () { //flip accordion panel arrows
                        if ($(this).attr('aria-expanded') == 'true') {
                            $(this).children('span').attr('class', 'panelArrow glyphicon glyphicon-chevron-down');
                        }
                        else {
                            $(this).children('span').attr('class', 'panelArrow glyphicon glyphicon-chevron-up');
                        }
                    });

                    //scope.populateDropdown();

                }
            }
        })
        .directive('descriptionPanels', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/descriptionPanels.html',
            }
        });

})();