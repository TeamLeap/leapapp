 app.controller('indigentController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', '$soap', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService, $soap) {

        $scope.aggregatedList = [];


        $scope.dialogs = [];
        $scope.declineReason = "";


        $scope.declineReasonList = [

            {
                "id": 1,
                "name": "Incomplete information"
                    },
            {
                "id": 2,
                "name": "The house is not indigent"
                    },
            {
                "id": 3,
                "name": "Other"
                    }
         ];

        $scope.initIndigent = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            d3.json(appConfig.emmIdigentEndPoint, function (data) {

                //UnEmployed
                var unemployedList = {
                    key: "UnEmployed",
                    color: "#4f99b4",
                    values: []
                };

                var i;
                $scope.unEmployedHighValue = 0, $scope.employedHighValue = 0, $scope.childHeadedHighValue = 0;
                $scope.unEmployedHighWard = "", $scope.employedHighWard = "", $scope.childHeadedHighWard = "";

                for (i = 0; i < data.length; i++) {

                    if (parseInt(data[i].unemployed, 10) > $scope.unEmployedHighValue) {
                        $scope.unEmployedHighValue = data[i].unemployed;
                        $scope.unEmployedHighWard = data[i].a_wardNo;
                    }

                    unemployedList.values.push({
                        value: data[i].unemployed,
                        label: data[i].a_wardNo
                    });

                };

                //Employees
                var employedList = {
                    key: "Employed",
                    color: "#4d4cb9",
                    values: []
                };

                var i;

                for (i = 0; i < data.length; i++) {

                    if (parseInt(data[i].employed, 10) > $scope.employedHighValue) {
                        $scope.employedHighValue = data[i].employed;
                        $scope.employedHighWard = data[i].a_wardNo;
                    }

                    employedList.values.push({
                        value: data[i].employed,
                        label: data[i].a_wardNo
                    });

                };

                var childHeadedList = {
                    key: "ChildHeaded",
                    color: "#00FF00",
                    values: []
                };
                var i;


                for (i = 0; i < data.length; i++) {

                    if (parseInt(data[i].childHeaded, 10) > $scope.childHeadedHighValue) {
                        $scope.childHeadedHighValue = data[i].childHeaded;
                        $scope.childHeadedHighWard = data[i].a_wardNo;
                    }

                    childHeadedList.values.push({
                        value: data[i].childHeaded,
                        label: data[i].a_wardNo
                    });

                };

                $scope.aggregatedList = [unemployedList, employedList, childHeadedList];

                $scope.$apply();


                nv.addGraph(function () {

                    var chart = nv.models.multiBarHorizontalChart()
                        .x(function (d) {
                            return "Ward " + d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .margin({
                            top: 55,
                            right: 5,
                            bottom: 5,
                            left: 55
                        })
                        .showValues(true) //Show bar value next to each bar.
                        //.tooltips(true) //Show tooltips on hover.
                        //.transitionDuration(350)
                        .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.

                    chart.yAxis
                        .tickFormat(d3.format(',.2f'));
                    chart.groupSpacing(0);
                    chart.height(1600);

                    d3.select('#chart1 svg')
                        .datum($scope.aggregatedList)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });

                $scope.isFetching = false;
                modal.hide();
            });

        }

        $scope.loadAssigments = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            $scope.API = 'https://munipoiapp.herokuapp.com/api/applications/New';

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                $scope.assignmentList = data;

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

        $scope.loadClosed = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            $scope.API = 'https://munipoiapp.herokuapp.com/api/applications/Closed';

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                $scope.closedList = data;

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

        $scope.loadAssigmentDetails = function (index, assignment) {

            $scope.id = assignment._id;
            appNavigator.pushPage('assignmentDetails.html', {
                id: assignment._id,
                applicationRefNo: assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo
            });

        }

        $scope.showAssigmentDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var page = appNavigator.getCurrentPage();

            $scope.API = 'https://munipoiapp.herokuapp.com/api/assigments/' + page.options.id;

            window.localStorage.setItem("appId", page.options.id);

            window.localStorage.setItem("applicationRefNo", page.options.applicationRefNo);

            $http.get($scope.API).success(function (data) {

                $scope.assignment = data;

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

        $scope.showLivingConditionsDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var appId = window.localStorage.getItem("appId");

            $scope.API = 'https://munipoiapp.herokuapp.com/api/assigments/' + appId;

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                $scope.livingConditions = data;

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

        $scope.loadLivingConditions = function () {

            appNavigator.pushPage('livingconditions.html', {
                id: $scope.id
            });
        }

        $scope.openCamera = function (selection) {

            var srcType = Camera.PictureSourceType.CAMERA;
            var options = setOptions(srcType);
            var func = createNewFileEntry;

            navigator.camera.getPicture(function cameraSuccess(imageUri) {

                if (selection === 1)
                    $scope.image1 = "data:image/jpeg;base64," + imageUri;
                else if (selection === 2)
                    $scope.image2 = "data:image/jpeg;base64," + imageUri;
                else if (selection === 3)
                    $scope.image3 = "data:image/jpeg;base64," + imageUri;
                else if (selection === 4)
                    $scope.image4 = "data:image/jpeg;base64," + imageUri;
                else if (selection === 5)
                    $scope.image5 = "data:image/jpeg;base64," + imageUri;
                else if (selection === 6)
                    $scope.image6 = "data:image/jpeg;base64," + imageUri;
                
                 console.debug("picture: " + imageUri, "app");

                //displayImage(imageUri);
                // You may choose to copy the picture, save it somewhere, or upload.
                //func(imageUri);
                
                $scope.$apply();

            }, function cameraError(error) {

                console.debug("Unable to obtain picture: " + error, "app");

                ons.notification.alert({
                    message: JSON.stringify('Unable to obtain picture: ' + error),
                    modifier: 'material'
                });

            }, options);
        }

        $scope.loadHouseholds = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var applicationRefNo = window.localStorage.getItem("applicationRefNo");

            $scope.API = 'https://munipoiapp.herokuapp.com/api/assigments/household/' + applicationRefNo;

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                $scope.householdList = data[0].indigentApplicationDetails;

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

        $scope.viewHouseholdDetails = function (index, household) {

            $scope.household = household;

            appNavigator.pushPage('householdverify.html', {
                householdmember: JSON.stringify(household)
            })
        }

        $scope.loadHouseholdDetails = function () {

            var page = appNavigator.getCurrentPage();

            $scope.household = JSON.parse(page.options.householdmember);
        }

        var signaturePad;

        $scope.loadSignature = function () {

            var canvas = document.getElementById('signatureCanvas');
            signaturePad = new SignaturePad(canvas);
        }

        $scope.saveCanvas = function () {
            var sigImg = signaturePad.toDataURL();
            $scope.signature = sigImg;
        }

        $scope.loadAcceptDialog = function () {

            if (!$scope.dialogs[declineApplicationDialog]) {

                ons.createDialog(declineApplicationDialog, {
                    parentScope: $rootScope
                }).then(function (dialog) {
                    $scope.dialogs[declineApplicationDialog] = dialog;
                    dialog.show();
                });
            } else {
                $scope.dialogs[declineApplicationDialog].show();
            }
            declineApplicationDialog.show();
        }

        $scope.declineButtonDialog = function () {

            declineApplicationDialog.hide();

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var applicationRefNo = window.localStorage.getItem("applicationRefNo");

            $scope.API = 'http://196.15.242.146:5555/rest/EMMShared/resources/updateFieldWorkerTaskStatus/{"taskStatus":"Accepted","applicationId":"' + applicationRefNo + '","reasonForRejection":"' + $scope.declineReason + '"}';

            $http.get($scope.API).success(function (data) {

                appNavigator.pushPage('assigments.html');

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

    }]);