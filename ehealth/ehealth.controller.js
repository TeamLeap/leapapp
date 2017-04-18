app.controller('ehealthController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.aggregatedList = [];
        $scope.departmentList = [];
        $scope.divisionList = [];
        $scope.typeList = [];
        var responseData = [];
        
        $scope.selectedDepartment = 'undefined', $scope.selectedDivision ='undefined', $scope.selectedMedicalType = 'undefined';
    
        $scope.login = function () {
            
            //add your code here to login
            appNavigator.pushPage('ehealth/main.html');
        }

        $scope.initEHealthInfo = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            $scope.departmentList = [];

            $scope.API = appConfig.emmEhealthinfoEndPoint;

            $http.get($scope.API).success(function (response) {
                
                responseData = response.results;

                for (var i = 0; i < responseData.length; i++) {

                    if ($scope.departmentList.indexOf(responseData[i].DEPDESCR) < 0)
                        $scope.departmentList.push(responseData[i].DEPDESCR);

                }

                $scope.isFetching = false;
                modal.hide();

            });

            $scope.$watch('selectedDepartment', function (newVal) {

                $scope.divisionList = [];
                
                $scope.typeList = [];
                
                for (var i = 0; i < responseData.length; i++) {

                    if (newVal === responseData[i].DEPDESCR) {

                        if ($scope.divisionList.indexOf(responseData[i].BLDGDESCR) < 0)
                            $scope.divisionList.push(responseData[i].BLDGDESCR);
                    }

                }
            });
            
            $scope.$watch('selectedDivision', function (newVal) {

                $scope.typeList = [];
                
                for (var i = 0; i < responseData.length; i++) {

                    if (newVal === responseData[i].BLDGDESCR) {

                        if ($scope.typeList.indexOf(responseData[i].DESCR) < 0)
                            $scope.typeList.push(responseData[i].DESCR);
                    }

                }
            });

        }
        
        $scope.getEHealthInfo = function () {
            
            $scope.aggregatedList = [];
            
            if (($scope.selectedDepartment === "undefined") || ($scope.selectedDivision === "undefined") || ($scope.selectedMedicalType) === "undefined") {

                ons.notification.alert({
                    message: 'Please select all three dropdowns!',
                    modifier: 'material'
                });


            } else {
            
            for (var i = 0; i < responseData.length; i++) {

                    if ($scope.selectedDepartment === responseData[i].DEPDESCR && $scope.selectedDivision === responseData[i].BLDGDESCR && $scope.selectedMedicalType === responseData[i].DESCR) {

                            $scope.aggregatedList.push({amount:responseData[i].PURCHPRICE, datepurchased:responseData[i].PURCHDATE, device:responseData[i].DESCR});
                    }

                }
            }
            
        }

    }]);
   