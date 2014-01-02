var meanPOC = angular.module('meanPOC', ['socket-io']);

function mainController($scope, $http, socket) {
	$scope.formData = {};

	socket.on("appointments_updated", function(data) {
		$scope.appointments = JSON.parse(data.appointments);
	});

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
				// update will be done by socket.io
				//$scope.appointments = data;
			})
			.error(function(data) {
				console.log('error: ' + data);
			});
	}
}