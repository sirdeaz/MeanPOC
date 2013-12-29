var meanPOC = angular.module('meanPOC', []);

function mainController($scope, $http) {
	$scope.formData = {};

	$http.get('api/appointments')
		.success(function(data) {
			$scope.appointments = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('error: ' + data);
		});

	$scope.createAppointment = function() {
		$http.post('/api/appointments', $scope.formData)
		.success(function(data) {
			$scope.formData = {};
			$scope.appointments = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('error: ' + data);
		});
	}
}