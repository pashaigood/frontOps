(function () {
    angular
        .module('dtCommon')
        .directive('chartFrame', function () {
            return {
                restrict: 'C',
                replace: true,
                transclude: true,
                template: '<div>' +
                '<div class="chart-master"></div>' +
                '<div class="chart-detail"></div>' +
                '</div>',
                scope: {
                    resizable: '@?',
                    data: '=',
                    options: '=options',
                    view: '=',
                    chartConfig: '='
                },

                controller: ChartFrameController
            };
        });
    
    /**
     * @ngInject
     * @param $scope
     * @param $element
     * @param $parse
     * @param ChartFactory
     */
    function ChartFrameController($scope, $element, $parse, ChartFactory) {

        $scope.resizable = $parse($scope.resizable)();

        activate();

        function activate() {
            $scope.$watch('data', function () {
                $scope.draw();
            });

            $scope.$watch('chartConfig', function (data) {
                if (!data) {
                    return;
                }

                $scope.draw();
            });

            $scope.$on('$destroy', function() {
                if ($scope.chart) {
                    $scope.chart.destroy();
                }
            });
        }

        $scope.getData = function () {
            return $scope.data;
        };

        $scope.getView = function () {
            return $scope.view;
        };

        if ($scope.resizable) {
            $scope.$watch(function () {
                return $element.width() + ':' + $element.height();
            }, function () {
                if ($scope.chart) {
                    $scope.chart.reflow()
                }
            });
        }

        $scope.draw = _.debounce(function () {
                if (!$scope.data) {
                    return;
                }
                var options = {
                    renderTo: $element.find('.chart-master')[0],
                    view: $scope.data.type || 'columns',
                    isChart: true
                };
                var config = ChartFactory.getChartConfig(options, $scope.data);

                Object.assign(config, $scope.chartConfig);
                    if ($scope.chart) {
                        $scope.chart.destroy();
                    }
                    $scope.chart = ChartFactory.getChart(options, null, config);
        }, 10);
    }
})();
