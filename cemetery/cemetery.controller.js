app.controller('cemetryController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.cemetryList = [];
        $scope.isShowing = false;

        $scope.getCementries = function () {

            $scope.API = appConfig.emmcemetryEndPoint;

            if (typeof $scope.firstname === 'undefined' && typeof $scope.lastname === 'undefined' && typeof $scope.idno === 'undefined') {

                ons.notification.alert({
                    message: 'This input form not complete!',
                    modifier: 'material'
                });


            } else {

                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();
                
                if (typeof $scope.firstname === 'undefined')
                    $scope.firstname = '';
                else if(typeof $scope.lastname === 'undefined')
                    $scope.lastname = '';
                else
                    $scope.idno = '';
                
                $scope.API = $scope.API + '{"FIRSTNAME":"' + $scope.firstname + '","SURNAME":"' + $scope.lastname + '","IDNO":"' + $scope.idno + '"}}';

                $http.get($scope.API).success(function (data) {

                    $scope.cemetryList = [];
                    
                    if (typeof data.results === 'undefined')
                        $scope.cemetryList = [data];
                    else
                        $scope.cemetryList = data.results;

                    $scope.isFetching = false;
                    modal.hide();

                }).error(function (data, status, headers, config) {

                    $scope.isFetching = false;
                    modal.hide();

                    ons.notification.alert({
                        message: JSON.stringify('Something went wrong'),
                        modifier: 'material'
                    });

                });

            }
        };


    }]);