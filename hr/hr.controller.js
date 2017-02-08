app.controller('hrController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.aggregatedList = [];
        $scope.markers = [];
        $scope.employeeList = [];

        $scope.initHRInfo = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();


            d3.json(appConfig.emmHRinfoEndPoint, function (data) {

                $scope.employeeList = data.results;

                //Female
                var femaleList = {
                    key: "Female",
                    color: "#4f99b4",
                    values: []
                };

                var i;
                var count;
                for (i = 0; i < data.results.length; i++) {

                    var count = data.results.reduce(function (n, person) {
                        return n + (person.TOWN_OR_CITY == data.results[i].TOWN_OR_CITY && person.SEX == 'F');
                    }, 0);

                    femaleList.values.push({
                        value: count,
                        label: data.results[i].TOWN_OR_CITY
                    });
                }

                //Male
                var maleList = {
                    key: "Male",
                    color: "#00FF00",
                    values: []
                };

                var i;
                var count;
                for (i = 0; i < data.results.length; i++) {

                    var count = data.results.reduce(function (n, person) {
                        return n + (person.TOWN_OR_CITY == data.results[i].TOWN_OR_CITY && person.SEX == 'M');
                    }, 0);

                    maleList.values.push({
                        value: count,
                        label: data.results[i].TOWN_OR_CITY
                    });
                }

                $scope.maleHighValue = 0, $scope.femaleHighValue = 0;
                $scope.maleHighRegion = "", $scope.femaleHighRegion = "";

                for (i = 0; i < maleList.values.length; i++) {

                    if (parseInt(maleList.values[i].value, 10) > $scope.maleHighValue) {
                        $scope.maleHighValue = maleList.values[i].value;
                        $scope.maleHighRegion = maleList.values[i].label;
                    }

                };

                for (i = 0; i < femaleList.values.length; i++) {

                    if (parseInt(femaleList.values[i].value, 10) > $scope.femaleHighValue) {
                        $scope.femaleHighValue = femaleList.values[i].value;
                        $scope.femaleHighRegion = femaleList.values[i].label;
                    }

                };

                $scope.aggregatedList = [femaleList, maleList];

                $scope.$apply();


                nv.addGraph(function () {

                    var chart = nv.models.multiBarHorizontalChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .margin({
                            top: 55,
                            right: 5,
                            bottom: 5,
                            left: 65
                        })
                        .showValues(true) //Show bar value next to each bar.
                        //.tooltips(true) //Show tooltips on hover.
                        //.transitionDuration(350)
                        .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.

                    chart.yAxis
                        .tickFormat(d3.format(',.0f'));

                    chart.groupSpacing(0);
                    chart.height(900);

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

        $scope.pullMarkersContent = function () {

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                $http.get('regions.json').success(function (response) {

                    $scope.locations = response.regions;

                    $.each($scope.locations, function (index, value) {

                        var distance = Haversine($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng, $scope.userLat, $scope.userLng);

                        $scope.markers.push({
                            'id': index,
                            'title': $scope.locations[index].section,
                            'content': $scope.locations[index].section,

                            'distance': (Math.round(distance * 100) / 100),
                            'location': [$scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng],
                            'type': $scope.locations[index].type,
                            'icon': "images/icons/mapicon.png"

                        });

                    });

                });


                d3.json(appConfig.emmHRinfoEndPoint, function (data) {

                    $scope.employeeList = data.results;
                });

            }, function (error) {

                console.log("Couldn't get the location of the user.");

                ons.notification.alert({
                    message: 'Please enable you GPS and try again.!',
                    modifier: 'material'
                });

                modal.hide();

                console.log(error.code);

                $rootScope.goExit();

            }, {
                maximumAge: Infinity,
                timeout: 60000,
                enableHighAccuracy: true
            });

        }


        $scope.showMarker = function (event) {

            $scope.marker = $scope.markers[this.id];

            var count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title);
            }, 0);

            var femalecount = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.SEX == 'F');
            }, 0);

            var malecount = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.SEX == 'M');
            }, 0);

            var Over50count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.AGEGROUP == 'Over50');
            }, 0);

            var LessThan45count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.AGEGROUP == 'LessThan45');
            }, 0);

            var LessThan40count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.AGEGROUP == 'LessThan40');
            }, 0);

            var LessThan35count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.AGEGROUP == 'LessThan35');
            }, 0);

            var LessThan30count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.AGEGROUP == 'LessThan30');
            }, 0);

            var LessThan25count = $scope.employeeList.reduce(function (n, person) {
                return n + (person.TOWN_OR_CITY == $scope.marker.title && person.AGEGROUP == 'LessThan25');
            }, 0);

            $scope.infoWindow = {
                id: $scope.marker.id,

                title: $scope.marker.title,
                content: 'There are ' + count + ' employees, ' + femalecount + ' females and ' + malecount + ' males. <br><br> Age Group<br> 1. ' + Over50count + ' over 50 years. <br> 2. ' + LessThan45count + ' over 45 and less than 50 years. <br> 3. ' + LessThan40count + ' over 35 and less than 45 years. <br> 4. ' + LessThan35count + ' over 30 and less than 35 years. <br>5. ' + LessThan30count + ' over 25 and less than 30 years. <br>6. ' + LessThan25count + '  less than 25 years.',

                distance: $scope.marker.distance,
                location: $scope.marker.location,

            };
            $scope.$apply();
            $scope.showInfoWindow(event, 'marker-info', this.getPosition());

        }

        }]);