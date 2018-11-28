(function(angular){
	angular.module('dtCommon').directive('colorpickerResultTransformer', colorpickerTransformer);

	function colorpickerTransformer() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function($scope, element, $attrs, ngModel) {
				var vm = this;
				var initWithValue = $scope.$eval($attrs.colorpickerResultTransformerGetter);
				var exchangeVariableName = $scope.$eval($attrs.colorpickerResultTransformerVarname);
				$scope[exchangeVariableName] = '#' + initWithValue;
				$scope.$on('colorpicker-closed', function(event, data) {
					$scope.$eval($attrs.colorpickerResultTransformerSetter, {
						$color: data.value.substr(1)
					});
				});
			}
		}
	}
})(angular);