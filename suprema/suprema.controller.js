app.controller('supremaController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.suprema = {}

        $scope.tarrifTypeList = [

            {
                "id": 1,
                "name": "Tariff A"
                    },
            {
                "id": 2,
                "name": "Tariff B"
                    },
         ];
        $scope.meterStatusList = [

            {
                "id": 1,
                "name": "Blocked"
                    },
            {
                "id": 2,
                "name": "UnBlocked"
                    },
         ];

        $scope.getMeterRegistration = function () {

            $scope.API = appConfig.emmsupremaEndPoint;

            if (typeof $scope.suprema.tarrifType === 'undefined' && typeof $scope.suprema.startdate === 'undefined' && typeof $scope.suprema.enddate === 'undefined' && typeof $scope.suprema.meterstatus === 'undefined') {

                ons.notification.alert({
                    message: 'This input form not complete!',
                    modifier: 'material'
                });


            } else {

                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();

                $scope.API = $scope.API + '{"tarrifType":"' + $scope.suprema.tarrifType + '","startDate":"' + $scope.suprema.startdate + '","endDate":"' + $scope.suprema.enddate + '","meterstatus":"' + $scope.suprema.meterstatus + '"}';

                $http.get($scope.API).success(function (data) {

                    $scope.meters = data.getTarrif;

                    $scope.isFetching = false;
                    modal.hide();

                }).error(function (data, status, headers, config) {

                    $scope.isFetching = false;
                    modal.hide();

                    ons.notification.alert({
                        message: JSON.stringify(data),
                        modifier: 'material'
                    });

                    console.debug("error", status);
                });

            }
        };

     }]);