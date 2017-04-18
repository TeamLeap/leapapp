 app.controller('indigentController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

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
     
     $scope.login = function () {
            
            $scope.message = "Please wait...";

            if (typeof $scope.username === 'undefined' && typeof $scope.password === 'undefined') {

                ons.notification.alert({
                    message: 'Username or password not provided!',
                    modifier: 'material'
                });


            } else {
                
                $scope.API = appConfig.emmloginapiEndPoint;

                $scope.API = $scope.API + '"username":"' + $scope.username + '","password":"' + $scope.password + '"}';

                $http.get($scope.API).success(function (response) {

                    if (response[0].status == 'success') {

                        window.localStorage.setItem("username", $scope.username);
                        window.localStorage.setItem("password", $scope.password);

                        appNavigator.pushPage('indigent/mainmenutab.html');
                    } else {
                        ons.notification.alert({
                            message: response[0].Description,
                            modifier: 'material'
                        });
                        
                        $scope.message = response[0].Description;
                    }

                }).error(function (error) {
                    ons.notification.alert({
                        message: 'Oops!!! Problem logging in.!',
                        modifier: 'material'
                    });
                    
                    $scope.message = 'Oops!!! Problem logging in.!';
                });
            }

        }

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

         $scope.API = appConfig.emmindigentEndPoint + 'api/applications/New';

         console.log($scope.API);

         $http.get($scope.API).success(function (data) {

             $scope.assignmentList = data;

             $scope.isFetching = false;
             modal.hide();

         }).error(function (data, status, headers, config) {

             $scope.assignmentList = [];

             $scope.isFetching = false;
             modal.hide();

             ons.notification.alert({
                 message: JSON.stringify('Connection Error - Unable to return a list of new applications'),
                 modifier: 'material'
             });

         });

     }

     $scope.loadAccepted = function () {

         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         $scope.API = appConfig.emmindigentEndPoint + 'api/applications/Accepted';

         console.log($scope.API);

         $http.get($scope.API).success(function (data) {

             $scope.assignmentList = data;

             $scope.isFetching = false;
             modal.hide();

         }).error(function (data, status, headers, config) {

             $scope.assignmentList = [];

             $scope.isFetching = false;
             modal.hide();

             ons.notification.alert({
                 message: JSON.stringify('Connection Error - Unable to return a list of new applications'),
                 modifier: 'material'
             });

         });

     }

     $scope.loadClosed = function () {

         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         $scope.API = appConfig.emmindigentEndPoint + 'api/applications/Closed';

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

     $scope.loadAssigmentDetails = function (index, assignment, status) {

         $scope.id = assignment._id;
         appNavigator.pushPage('indigent/assignmentDetails.html', {
             id: assignment._id,
             applicationRefNo: assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
             appstatus: status
         });

     }

     $scope.showApplicationDetails = function () {

         $scope.isFetching = true;

         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         var page = appNavigator.getCurrentPage();

         $scope.API = appConfig.emmindigentEndPoint + 'api/assigments/' + page.options.id;

         window.localStorage.setItem("appId", page.options.id);

         window.localStorage.setItem("applicationRefNo", page.options.applicationRefNo);

         $scope.isAccepted = page.options.appstatus === "Accepted";

         $http.get($scope.API).success(function (data) {

             $scope.assignment = data;
             console.log(data);

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

         $scope.API = appConfig.emmindigentEndPoint + 'api/assigments/' + appId;

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

     $scope.saveComments = function () {

         $rootScope.livingConditionsComments = $scope.livingConditions.comments;
         alert("Comments saved.");
     }

     $scope.loadLivingConditions = function () {

         appNavigator.pushPage('indigent/livingconditions.html', {
             id: $scope.id
         });
     }

     function setOptions(srcType) {
         var options = {
             // Some common settings are 20, 50, and 100
             quality: 50,
             destinationType: Camera.DestinationType.DATA_URL,
             // In this app, dynamically set the picture source, Camera or photo gallery
             sourceType: srcType,
             encodingType: Camera.EncodingType.JPEG,
             mediaType: Camera.MediaType.PICTURE,
             allowEdit: true,
             correctOrientation: true //Corrects Android orientation quirks
         }
         return options;
     }

     $scope.openCamera = function (selection) {

         var srcType = Camera.PictureSourceType.CAMERA;
         var options = setOptions(srcType);

         navigator.camera.getPicture(function cameraSuccess(imageUri) {

             if (selection === 1)
                 $rootScope.image1 = "data:image/jpeg;base64," + imageUri;
             else if (selection === 2)
                 $rootScope.image2 = "data:image/jpeg;base64," + imageUri;
             else if (selection === 3)
                 $rootScope.image3 = "data:image/jpeg;base64," + imageUri;
             else if (selection === 4)
                 $rootScope.image4 = "data:image/jpeg;base64," + imageUri;
             else if (selection === 5)
                 $rootScope.image5 = "data:image/jpeg;base64," + imageUri;
             else if (selection === 6)
                 $rootScope.image6 = "data:image/jpeg;base64," + imageUri;

             $scope.$apply();

         }, function cameraError(error) {

             console.debug("Unable to obtain picture: " + error, "app");

             ons.notification.alert({
                 message: JSON.stringify('Unable to obtain picture: ' + error),
                 modifier: 'material'
             });

         }, options);
     }

     $scope.loadApplicationDetails = function () {


         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         $scope.pdfUrl = '';

         $scope.pdfDocumentList = [];

         $scope.applicationRefNo = window.localStorage.getItem("applicationRefNo");

         $scope.API = appConfig.emmindigentEndPoint + 'api/assigments/imagenamelist/' + $scope.applicationRefNo;

         $http.get($scope.API).success(function (data) {

             console.log(data[0].indigentApplicationDetails.imageNameList);

             $scope.imageNameList = data[0].indigentApplicationDetails.imageNameList;

             if ($scope.imageNameList.length > 0) {

                 for (var i = 0; i < $scope.imageNameList.length; i++) {
                     $scope.pdfDocumentList.push({
                         url: appConfig.emmindigentEndPoint + 'api/assigments/imagelist/' + $scope.applicationRefNo + '/index/' + i,
                         name: $scope.imageNameList[i]
                     });
                 }
             }

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

     $scope.viewApplicationDocumentDetails = function (index, applicationDoc) {

         $scope.applicationDoc = applicationDoc;

         appNavigator.pushPage('indigent/applicationDoc.html', {
             applicationDoc: JSON.stringify(applicationDoc),
             index: index
         })
     }

     function b64toBlob(b64Data, contentType, sliceSize) {
         contentType = contentType || '';
         sliceSize = sliceSize || 512;

         var byteCharacters = atob(b64Data);
         var byteArrays = [];

         for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
             var slice = byteCharacters.slice(offset, offset + sliceSize);

             var byteNumbers = new Array(slice.length);
             for (var i = 0; i < slice.length; i++) {
                 byteNumbers[i] = slice.charCodeAt(i);
             }

             var byteArray = new Uint8Array(byteNumbers);

             byteArrays.push(byteArray);
         }

         var blob = new Blob(byteArrays, {
             type: contentType
         });
         return blob;
     }

     $scope.showApplicationDocumentDetails = function (index, applicationDoc) {

         var page = appNavigator.getCurrentPage();

         $scope.applicationDoc = applicationDoc;
         $scope.index = page.options.index;

         $scope.isFetching = true;

         var applicationRefNo = window.localStorage.getItem("applicationRefNo");

         $scope.API = appConfig.emmindigentEndPoint + 'api/assigments/imagelist/' + applicationRefNo + '/index/' + $scope.index;

         $http.get($scope.API).success(function (data) {

             pdf = atob(data);

             var arr = new Array(pdf.length);

             for (var i = 0; i < pdf.length; i++) {

                 arr[i] = pdf.charCodeAt(i);

             }

             var byteArray = new Uint8Array(arr);

             var blob = new Blob([byteArray], {
                 type: 'application/pdf'
             });

             $scope.pdf = URL.createObjectURL(blob);

             window.location = $scope.pdfUrl;

         }).error(function (data, status, headers, config) {

             $scope.isFetching = false;
             modal.hide();

             ons.notification.alert({
                 message: JSON.stringify('Something went wrong'),
                 modifier: 'material'
             });

         });

     }

     $scope.onError = function (error) {
         // handle the error
         console.log(error);
     }

     $scope.loadHouseholds = function () {

         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         var applicationRefNo = window.localStorage.getItem("applicationRefNo");

         $scope.API = appConfig.emmindigentEndPoint + 'api/assigments/household/' + applicationRefNo;

         console.log($scope.API);

         $http.get($scope.API).success(function (data) {

             $rootScope.householdList = data[0].indigentApplicationDetails;

             $scope.isFetching = false;
             modal.hide();

         }).error(function (data, status, headers, config) {

             $scope.isFetching = false;
             modal.hide();

             $rootScope.householdList = [];

             ons.notification.alert({
                 message: JSON.stringify('Connection Error - Unable to return a list of households'),
                 modifier: 'material'
             });

         });

     }

     $scope.viewHouseholdDetails = function (index, household) {

         $scope.household = household;

         appNavigator.pushPage('indigent/householdverify.html', {
             householdmember: JSON.stringify(household),
             index: index
         })
     }

     $scope.loadHouseholdDetails = function () {

         var page = appNavigator.getCurrentPage();

         $scope.household = JSON.parse(page.options.householdmember);
         var index = page.options.index;

         $scope.$watch('householdmember.isVerified', function (newVal) {

             $rootScope.householdList.householdDetail[index].personDetail.isVerified = newVal;

         });

         $scope.$watch('householdmember.comments', function (newVal) {

             $rootScope.householdList.householdDetail[index].personDetail.remarks = newVal;

         });
     }

     var signaturePad;

     $scope.loadSignature = function () {

         var canvas = document.getElementById('signatureCanvas');
         signaturePad = new SignaturePad(canvas);
     }

     $scope.saveCanvas = function () {
         var sigImg = signaturePad.toDataURL();
         $rootScope.signature = sigImg;
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

     $scope.setApplicationAccepted = function () {

         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         $scope.isAccepted = true;

         var applicationRefNo = window.localStorage.getItem("applicationRefNo");

         //TODO add this to the config file

         $scope.API = appConfig.emmindigentEndPoint + 'api/applications';

         $http.post($scope.API, {
             "applicationID": $scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
             "status": "Accepted"
         }).success(function (data) {

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


         $scope.isFetching = false;
         modal.hide();

     }

     $scope.saveApplicationDetails = function () {

         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         navigator.geolocation.getCurrentPosition(function (position) {

             $scope.userLat = position.coords.latitude;
             $scope.userLng = position.coords.longitude;
             $scope.locationAccuracy = position.coords.accuracy;

             $scope.API = appConfig.emmsaveIndigentMobiAppDetailEndPoint;

             $scope.assignment.indigentApplicationDetails.locationAccuracy = $scope.locationAccuracy;
             $scope.assignment.indigentApplicationDetails.geographicalLocation = $scope.userLat + "," + $scope.userLng;
             $scope.assignment.indigentApplicationDetails.customerSignature = $rootScope.signature;

             if (angular.isUndefined($rootScope.householdList)) {
                 alert("Please complete the household details and verify members.");
                 modal.hide();
                 return;
             }

             var i;
             for (i = 0; i < $rootScope.householdList.householdDetail.length; i++) {

                 $scope.assignment.indigentApplicationDetails.householdDetail[i].remarks = $rootScope.householdList.householdDetail[i].remarks;

                 $scope.assignment.indigentApplicationDetails.householdDetail[i].isVerified = $rootScope.householdList.householdDetail[i].isVerified;

             }

             $scope.assignment.fieldWorkerRemarks = $rootScope.livingConditionsComments;

             $scope.assignment.indigentApplicationDetails.imageList = [];

             if ($rootScope.image1)
                 $scope.assignment.indigentApplicationDetails.imageList.push($rootScope.image1);

             if ($rootScope.image2)
                 $scope.assignment.indigentApplicationDetails.imageList.push($rootScope.image2);

             if ($rootScope.image3)
                 $scope.assignment.indigentApplicationDetails.imageList.push($rootScope.image3);

             if ($rootScope.image4)
                 $scope.assignment.indigentApplicationDetails.imageList.push($rootScope.image4);

             if ($rootScope.image5)
                 $scope.assignment.indigentApplicationDetails.imageList.push($rootScope.image5);

             if ($rootScope.image6)
                 $scope.assignment.indigentApplicationDetails.imageList.push($rootScope.image6);

             if ($scope.assignment.indigentApplicationDetails.imageList.length < 3) {
                 alert("Please upload atleast 3 images and continue.");
                 modal.hide();
                 return;
             }

             $http.post($scope.API, $scope.assignment).success(function (res) {

                 $scope.isFetching = false;
                 modal.hide();

                 $scope.API = appConfig.emmindigentEndPoint + 'api/applications';

                 $http.post($scope.API, {
                     "applicationID": $scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
                     "status": "Completed"
                 }).success(function (data) {

                     $scope.isFetching = false;
                     modal.hide();

                     appNavigator.pushPage('indigent/acknowledgement.html');

                 }).error(function (data, status, headers, config) {

                     $scope.isFetching = false;
                     modal.hide();

                     ons.notification.alert({
                         message: JSON.stringify('Something went wrong'),
                         modifier: 'material'
                     });

                 });


             }).error(function (data, status, headers, config) {

                 $scope.isFetching = false;
                 modal.hide();

                 ons.notification.alert({
                     message: JSON.stringify('Something went wrong'),
                     modifier: 'material'
                 });

             });

         }, function (error) {

             console.log("Couldn't get the location of the user.");

             ons.notification.alert({
                 message: 'Please enable you GPS and try again.! ' + error.message,
                 modifier: 'material'
             });

             if (navigator.app) {
                 navigator.app.exitApp();
             } else if (navigator.device) {
                 navigator.device.exitApp();
             }

         }, {
             maximumAge: Infinity,
             timeout: 60000,
             enableHighAccuracy: true
         });


     }

     $scope.declineButtonDialog = function () {

         declineApplicationDialog.hide();

         $scope.isFetching = true;
         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         var applicationRefNo = window.localStorage.getItem("applicationRefNo");

         $scope.API = appConfig.emmindigentupdatetaskEndPoint + '{"taskStatus":"Rejected","applicationId":"' + applicationRefNo + '","reasonForRejection":"' + $scope.declineReason + '"}';

         $http.get($scope.API).success(function (data) {

             appNavigator.pushPage('indigent/assigments.html');

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