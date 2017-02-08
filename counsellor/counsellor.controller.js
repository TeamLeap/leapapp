    app.controller('talkToCounsellorController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        $scope.API = AppConfig.emmcomplainsapiEndPoint;

        $scope.incidenttypelist = [{
            "id": "51",
            "name": "Burst Water Pipe"
            }, {
            "id": "72",
            "name": "Dirty Smelly Water"
            }, {
            "id": "76",
            "name": "Electricity outage - Resident"
            }, {
            "id": "78",
            "name": "Exposed Wires"
            }, {
            "id": "83",
            "name": "Faulty Water Hydrant"
            }, {
            "id": "89",
            "name": "General water outage"
            }, {
            "id": "119",
            "name": "Load shedding Notice"
            }, {
            "id": "128",
            "name": "No Water"
            }, {
            "id": "130",
            "name": "Noise pollution"
            }, {
            "id": "132",
            "name": "Non Removal of Refuse Bins - Residential"
            }, {
            "id": "221",
            "name": "Request grass cutting schedule"
            }, {
            "id": "257",
            "name": "Water Leak"
            }, {
            "id": "260",
            "name": "Water pollution"
            }, {
            "id": "261",
            "name": "Water Pressure Fault"
            }, {
            "id": "262",
            "name": "Water Quality Complaint"
            }];

        $scope.arealist = [{
            "id": "1",
            "name": "Boksburg"
            }, {
            "id": "2",
            "name": "Bedfordview"
            }, {
            "id": "3",
            "name": "Benoni"
            }, {
            "id": "4",
            "name": "Alberton"
            }, {
            "id": "5",
            "name": "Germiston"
            }, {
            "id": "6",
            "name": "Brakpan"
            }, {
            "id": "7",
            "name": "Edenvale"
            }, {
            "id": "8",
            "name": "Springs"
            }, {
            "id": "9",
            "name": "Nigel"
            }, {
            "id": "10",
            "name": "Kempton Park"
            }];

        $scope.pullContent = function () {

            $scope.API = appConfig.emmretrievecomplaintapiEndPoint; //"http://196.15.242.146:5555/rest/EMMMobiApp/resource/retrieveComplaint";

            $http.get($scope.API).success(function (response) {

                $scope.incidents = response.incidents;

            });

        }

        $scope.goComplain = function () {

            if (typeof $scope.incidenttype_selected === 'undefined' && typeof $scope.area_selected === 'undefined' && typeof $scope.description === 'undefined' && typeof $scope.mobileno === 'undefined') {

                ons.notification.alert({
                    message: 'This input form not complete!',
                    modifier: 'material'
                });
            } else {

                $scope.API = $scope.API + '{"userID":"' + window.localStorage.getItem("userId") + '","pushToken":"' + window.localStorage.getItem("pushToken") + '","description":"' + $scope.description + '","incidentType":"' + $scope.incidenttype_selected.id + '","area":"' + $scope.area_selected.id + '","smsNumber":"' + $scope.mobileNo + '"}';

                $http.get($scope.API).success(function (data) {

                    ons.notification.alert({
                        message: 'Your message was submitted to counsellor',
                        modifier: 'material'
                    });

                    appNavigator.pushPage('main-tab.html');
                    appNavigator.getCurrentPage().destroy();

                }).error(function (error) {

                    if (error === null) {
                        ons.notification.alert({
                            message: 'Oops!!! Something went wrong',
                            modifier: 'material'
                        });
                    } else {

                        ons.notification.alert({
                            message: 'ERROR: ' + error,
                            modifier: 'material'
                        });
                    }

                });
                //window.history.go(-2);

            }
        }

    }]);