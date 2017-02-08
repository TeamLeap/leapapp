app.controller('vehicleController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.vehicle = {}

        $scope.vehicleList = []

        $scope.getStartDate = function () {

            var startDate;

            var options = {
                date: new Date(),
                mode: 'date'
            }

            datePicker.show(options, function (date) {

                $scope.vehicle.startDate = date;
                $scope.$apply();

            })

        };

        $scope.getEndDate = function () {

            var options = {
                date: new Date(),
                mode: 'date'
            }

            datePicker.show(options, function (date) {

                $scope.vehicle.endDate = date;
                $scope.$apply();

            })

        };

        $scope.getVehicleRegistration = function () {

            $scope.API = appConfig.emmlocationEndPoint;

            if (typeof $scope.vehicle.startDate === 'undefined' && typeof $scope.vehicle.endDate === 'undefined') {

                ons.notification.alert({
                    message: 'This input form not complete!',
                    modifier: 'material'
                });


            } else {

                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();


                var month = $scope.vehicle.startDate.getMonth();

                var day = $scope.vehicle.startDate.getDate();

                var year = $scope.vehicle.startDate.getFullYear();

                //

                var endmonth = $scope.vehicle.endDate.getMonth();

                var endday = $scope.vehicle.endDate.getDate();

                var endyear = $scope.vehicle.endDate.getFullYear();

                $scope.API = $scope.API + '{"serviceRequest":{"searchCriteria":[{"name": "startDate","value":"' + year + "-" + month + "-" + day + '"},{"name":"endDate","value":"' + endyear + "-" + endmonth + "-" + endday + '"}],"locationType":"vehicles"}}';

                console.log($scope.API);

                $http.get($scope.API).success(function (data) {

                    $scope.vehicleList = data.rows;

                    $scope.isFetching = false;
                    modal.hide();

                }).error(function (data, status, headers, config) {

                    $scope.isFetching = false;
                    modal.hide();

                    ons.notification.alert({
                        message: JSON.stringify('Please specify a different date range'),
                        modifier: 'material'
                    });

                });

            }
        };

        $scope.loadVehicleDetails = function (index, vehicle) {

            appNavigator.pushPage('vehicledetails.html', {
                fleetno: vehicle.FLEET_NO
            });

        };

        $scope.showVehicleDetails = function () {

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var fleetno = appNavigator.getCurrentPage().options.fleetno;

            $scope.API = appConfig.emmfleetEndPoint;

            $scope.API = $scope.API + '{"fleetNumber":"' + fleetno + '"}';

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                    if (data.vehiclePositioning.length > 0)
                        $scope.result = data.vehiclePositioning[0];
                    else
                        ons.notification.alert({
                            message: 'Fleet Number not found!',
                            modifier: 'material'
                        });

                    $scope.isFetching = false;
                    modal.hide();

                },
                function (error) {

                    console.log("Couldn't get the location details.");

                    ons.notification.alert({
                        message: 'Something wrong with your connection.!',
                        modifier: 'material'
                    });

                    modal.hide();

                    console.log(error.code);

                });

        }

    }]);