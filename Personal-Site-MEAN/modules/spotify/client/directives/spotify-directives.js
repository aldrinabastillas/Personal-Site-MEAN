(function () {
    angular.module('spotify-directives', [])
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
                controller: 'PredictionController'
            }
        })
        .directive('tableColumn', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/tableColumn.html',
                controller: 'TableController',
                link: function (scope, element) {
                    $('table').tablesort(); //sets up a sortable table, see http://semantic-ui.com/collections/table.html#sortable
                }
            }
        })
        .directive('descriptionPanels', function () {
            return {
                restrict: 'E',
                templateUrl: '/modules/spotify/client/templates/descriptionPanels.html',
                link: function (scope, element) {
                    //set up collapsible accordion panels
                    for (var i = 1; i <= 4; i++) {
                        $('#heading-' + i).click(function () {
                            //need to parse index, as i will be 5 after loop is done
                            var index = $(this).attr('id').split('-')[1];
                            var panel = '#collapse-' + index;

                            $(panel).collapse('toggle'); //open or close panel

                            //flip arrows
                            var title = $(this).children('h4').children('span');
                            if ($(panel).attr('aria-expanded') == 'true') {
                                title.attr('class', 'panelArrow glyphicon glyphicon-chevron-up');
                            }
                            else {
                                title.attr('class', 'panelArrow glyphicon glyphicon-chevron-down');
                            }
                        });
                    }
                }
            }
        });

})();