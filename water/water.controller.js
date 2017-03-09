 app.controller('waterPotablePointsController', ['$http', '$scope', '$rootScope', '$compile', 'appConfig','loadingMessageService', function ($http, $scope, $rootScope, $compile, appConfig,loadingMessageService) {

     $scope.map;
     $scope.overlay;
     $scope.markers = [];
     $scope.markerId = 1;


     $scope.init = function () {

         $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
         modal.show();

         navigator.geolocation.getCurrentPosition(function (position) {

             $scope.userLat = position.coords.latitude;
             $scope.userLng = position.coords.longitude;

             $scope.centerMap = [$scope.userLat, $scope.userLng]; // Start Position

             var radius = appNavigator.getCurrentPage().options.radius;

             $scope.API = appConfig.emmwaterpotablepointsEndPoint;

             $http.get($scope.API).success(function (response) {

                 $scope.locations = response.Response;

                 $scope.markers = [];

                 $.each($scope.locations, function (index, value) {

                    if(index>0)
                         $scope.markers.push({
                             'id': index,
                             'title': $scope.locations[index].address,
                             'content': $scope.locations[index].address,
                             'address': $scope.locations[index].address,
                             'seq': $scope.locations[index].code,
                             'location': [$scope.locations[index].latitude, $scope.locations[index].longitude],
                             'icon': "images/icons/mapicon.png"
                         });

                 });

                 modal.hide();
                 poiDialog.hide();


             });

         }, function (error) {

             console.log("Couldn't get the location of the user.");


             ons.notification.alert({
                 message: 'Please enable you GPS and try again.! ' + error.message,
                 modifier: 'material'
             });

             console.log(error.code);

             $rootScope.goExit();

         }, {
             maximumAge: Infinity,
             timeout: 60000,
             enableHighAccuracy: true
         });

         $scope.showMarker = function (event) {

             $scope.marker = $scope.markers[this.id];

             $scope.infoWindow = {
                 id: $scope.marker.id,
                 icon: $scope.marker.icon,
                 title: $scope.marker.title,
                 content: $scope.marker.content,
                 address: $scope.marker.address,
                 hours: $scope.marker.hours,
                 phone: $scope.marker.phone,
                 distance: $scope.marker.distance,
                 location: $scope.marker.location,

             };
             $scope.$apply();
             $scope.showInfoWindow(event, 'marker-info', this.getPosition());

         }

     }
    }]);