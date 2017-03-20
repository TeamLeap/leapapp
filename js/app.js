// In this file we are goint to include all the Controllers our app it's going to need
(function () {
    'use strict';

    var app = angular.module('app', ['onsen', 'angular-images-loaded', 'ngMap', 'nvd3', 'ngMessages', 'angularSoap']);

    var datePicker;

    // Filter to convert HTML content to string by removing all HTML tags
    app.filter('htmlToPlaintext', function () {
        return function (text) {
            return String(text).replace(/<[^>]+>/gm, '');
        }
    });

    // Filter to show Miles instead of KM
    app.filter('showMiles', function () {
        return function (item) {
            return (item * 0.621).toFixed(2);
        };
    });

    app.controller('networkController', function ($scope, $q, $rootScope) {

        document.addEventListener('deviceready', function () {

            navigator.splashscreen.hide();

           
            //checkinng if the server is offline 
            
            
              
            $http.get('http://wmdev.ekurhuleni.gov.za:5558').then(function(response) {
                
                datePicker = window.plugins.datePicker;
           
            }, function(errResponse){
               
                 appNavigator.pushPage('offline.html');
                
                
            });
            
            

            //OAuth.initialize('cxhwciIvEZEjw2e5pVe8ucOB6H8')

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

            }, function (error) {

                console.log("Couldn't get the location of the user.");

                ons.notification.alert({
                    message: 'Please enable you GPS and try again.! ' + error.message,
                    modifier: 'material'
                });


                console.log(error);

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

            var notificationOpenedCallback = function (jsonData) {

                ons.notification.alert({
                    message: jsonData.message,
                    modifier: 'material'
                });

                console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            };


            /*window.plugins.OneSignal.init("a17d1266-3037-4f13-8c29-e2203d0f3458", {
                    googleProjectNumber: "1030098960429"
                },
                notificationOpenedCallback);*/

            window.plugins.OneSignal
                .startInit("a17d1266-3037-4f13-8c29-e2203d0f3458", "1030098960429")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            /* window.plugins.OneSignal.getIds(function (ids) {
                 window.localStorage.setItem("pushToken", ids.pushToken);
                 window.localStorage.setItem("userId", ids.userId);

                 console.log('pushToken is: ' + window.localStorage.getItem("pushToken"));
             });*/


            // Show an alert box if a notification comes in when the user is in your app.
            //window.plugins.OneSignal.enableInAppAlertNotification(true);

        }, false);

        // Check if is Offline
        document.addEventListener("offline", function () {

            offlineMessage.show();

            /* 
             * With this line of code you can hide the modal in 8 seconds but the user will be able to use your app
             * If you want to block the use of the app till the user gets internet again, please delete this line.       
             */

            setTimeout('offlineMessage.hide()', 8000);

        }, false);

        document.addEventListener("online", function () {
            // If you remove the "setTimeout('offlineMessage.hide()', 8000);" you must remove the comment for the line above      
            // offlineMessage.hide();
        });


        $rootScope.back = function () {
            window.history.back();
        }

        //Phonegap action
        $rootScope.goExit = function () {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }

        $scope.twitterSignIn = function () {

            $('#result').html("");
            OAuth.popup('twitter')
                .done(function (r) {
                    // the access_token is available via r.access_token
                    // but the http functions automagically wrap the jquery calls
                    r.get('/1.1/account/verify_credentials.json')
                        .done(function (data) {

                            /* appNavigator.pushPage('profileinfo.html', {
                                 firstname: data.firstname,
                                 lastname: data.lastname,
                                 email: data.email
                             });*/

                            window.localStorage.setItem("firstname", data.firstname);
                            window.localStorage.setItem("lastname", data.lastname);

                            window.localStorage.setObject('loggedIn', true);

                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            $('#result').html("req error: " + textStatus);
                        });
                })
                .fail(function (e) {
                    $('#result').html('error: ' + e.message);
                });
        }

        $scope.facebookSignIn = function () {

            $('#result').html("");
            OAuth.popup('facebook')
                .done(function (r) {
                    // the access_token is available via r.access_token
                    // but the http functions automagically wrap the jquery calls
                    r.me().done(function (data) {
                            //alert(JSON.stringify(data));
                            $('#result').html("facebook: Hello, " + data.name + " !");

                            /* appNavigator.pushPage('profileinfo.html', {
                                     firstname: data.firstname,
                                     lastname: data.lastname,
                                     email: data.email
                                 });*/
                            window.localStorage.setItem("firstname", data.firstname);
                            window.localStorage.setItem("lastname", data.lastname);
                            window.localStorage.setObject('loggedIn', true);

                            appNavigator.pushPage('main-tab.html');

                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            $('#result').html("req error: " + textStatus);
                        });
                })
                .fail(function (e) {
                    $('#result').html('error: ' + e.message);
                });
        }

        $scope.googleSignIn = function () {

            $('#result').html("");
            OAuth.popup('google')
                .done(function (r) {


                    // the access_token is available via r.access_token
                    // but the http functions automagically wrap the jquery calls
                    r.me().done(function (data) {
                            //alert(JSON.stringify(data));
                            $('#result').html("google: Hello, " + data.name + " !");

                            /*appNavigator.pushPage('profileinfo.html', {
                                firstname: data.firstname,
                                lastname: data.lastname,
                                email: data.email
                            });*/
                            window.localStorage.setItem("firstname", data.firstname);
                            window.localStorage.setItem("lastname", data.lastname);
                            window.localStorage.setObject('loggedIn', true);

                            appNavigator.pushPage('main-tab.html');
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            $('#result').html("req error: " + textStatus);
                        });
                })
                .fail(function (e) {
                    $('#result').html('error: ' + e.message);
                });
        }

        $scope.linkedInSignIn = function () {

            $('#result').html("");
            OAuth.popup('linkedin')
                .done(function (r) {

                    // the access_token is available via r.access_token
                    // but the http functions automagically wrap the jquery calls
                    r.me().done(function (data) {
                            //alert(JSON.stringify(data));
                            $('#result').html("linkedIn: Hello, " + data.name + " !");

                            /*appNavigator.pushPage('profileinfo.html', {
                                firstname: data.firstname,
                                lastname: data.lastname,
                                email: data.email
                            });*/
                            window.localStorage.setItem("firstname", data.firstname);
                            window.localStorage.setItem("lastname", data.lastname);
                            window.localStorage.setObject('loggedIn', true);

                            appNavigator.pushPage('main-tab.html');

                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            $('#result').html("req error: " + textStatus);
                        });
                })
                .fail(function (e) {
                    $('#result').html('error: ' + e.message);
                });
        }

        $scope.emailSignIn = function () {
            appNavigator.pushPage('register.html');
        }

        $scope.signIn = function () {

            appNavigator.pushPage('signin.html');

        }

    });

    // This functions will help us save the JSON in the localStorage to read the website content offline

    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    // This directive will  allow us to cache all the images that have the img-cache attribute in the <img> tag
    app.directive('imgCache', ['$document', function ($document) {
        return {
            link: function (scope, ele, attrs) {
                var target = $(ele);

                scope.$on('ImgCacheReady', function () {

                    ImgCache.isCached(attrs.src, function (path, success) {
                        if (success) {
                            ImgCache.useCachedFile(target);
                        } else {
                            ImgCache.cacheFile(attrs.src, function () {
                                ImgCache.useCachedFile(target);
                            });
                        }
                    });
                }, false);

            }
        };
    }]);


    // Map Markers Controller
    var map;


    app.factory('loadingMessageService', function () {
        return {
            showMessage: function () {
                var messageList = ["Ekurhuleni economy contributes 6.2% to national production;", "Has a share of ±7.3% of national employment;", "Ekurhuleni economy produces 26% of the total economic output of Gauteng;", "Ekurhuleni economy produces 26% of the total economic output of Gauteng", "Ekurhuleni economy grew 3% per annum between 1996 and 2009", "Ekurhuleni economy accounted for 17.6% of national imports between 1996 and 2003", "Ekurhuleni economy accounted for 6.7% of national exports between 1995 and 2003", "The City of Ekurhuleni’s long term roadmap, the Growth and Development Strategy 2055, is in place to which the city’s flagship projects are aligned", "The city has an annual operating budget of around R31.4 billion and capital budget of around R4.5 billion. The city received a clean audit for the 2013/14 financial year", "Stretching from OR Tambo International Airport, the Albertina Sisulu Corridor is a prime investment and development location. Straddling the R21 and R24 freeways, which runs through Ekurhuleni, the corridor links Johannesburg, OR Tambo International Airport and Pretoria (Tshwane)", "The Albertina Sisulu Corridor offers a myriad of investment opportunities in a wide range of sectors, including logistics, telecommunications and business outsourcing, import and export, manufacturing and processing, transport-related services, office and retail space, agriculture, eco-tourism and conservation", "The Albertina Sisulu Corridor offers a myriad of investment opportunities in a wide range of sectors, including logistics, telecommunications and business outsourcing, import and export, manufacturing and processing, transport-related services, office and retail space, agriculture, eco-tourism and conservation", "The Gauteng Industrial Development Zone (IDZ) will, through its subsidiary the Gauteng Growth and Development Agency (GGDA) operationalize the industrial development zone at the OR Tambo International Airport. In the first phase a Jewellery Manufacturing Precinct will be established. This is linked to the broader Ekurhuleni Aerotropolis flagship project – the vision is to create a world-class globally competitive manufacturing space opening in 2017", "Business activities in Ekurhuleni townships are diverse and range from retail, industrial activity to construction. The city has devised an urban development structure that creates investment opportunities for business while also contributing to social development and upliftment. Ekurhuleni has a well-developed network of infrastructure as well as strong telecommunications infrastructure and powerful electricity grids", "Not only is more than a quarter of Africa’s railway tracks situated in South Africa, but at the heart of this hub is situated in Germiston, in the City of Ekurhuleni. This is the busiest Southern African Development Community rail interchange in Africa. Sentrarand, the biggest railway shunting yard in the country is also situated in Ekurhuleni", "Ekurhuleni’s water quality and reticulation systems are some of the best in the world, with the city receiving the Blue Drop Platinum Award for the high quality of tap water that it supplies to its citizens for three consecutive years", "Ekurhuleni can be regarded as the transportation hub of the country. It is home to OR Tambo International Airport, the busiest airport in Africa, which services the entire continent and links to major cities throughout the world. Similarly, many of the world’s leading airlines fly into OR Tambo International Airport, which has been identified as the nucleus for the development of the aerotropolis", "The city is home to Tambo-Springs, an initiative that involves creating significantly improved intermodal capabilities for the movement of freight to and from Gauteng, The Tambo-Springs inland port will function as a multimodal logistics gateway, This is to be achieved by the operational twinning of the inland port with other seaport inland, and cross-border locations,. To ensure seamless movement of freight between modes", "Together with national government, the City of Ekurhuleni is undertaking 21 industrial initiatives, all under the banner of the aerotropolis. These are designed to revitalize the manufacturing sector, aviation, transport, and logistics industries linked to the airport. These will dramatically transform the current industrial structure of the economy of Ekurhuleni", " The Gillooly’s motor vehicle exchange is the business in the country, making Ekurhuleni the heart of the movement of goods in the country", "Roads are well maintained and more than capable of handling the city’s increasing commercial traffic. The N3 from Johannesburg to Durban, the N12 from Johannesburg to Witbank and the R21 highway, which joins OR Tambo International Airport to the rest of the province, all meet at Gillooly’s interchange right in the heart of Ekurhuleni", "A modern road network system reaches every part of the Ekurhuleni region and connects all the major towns, offering convenience and a seamless travel experience"];

                return messageList[Math.floor(Math.random() * messageList.length)];
            }
        };
    });

    app.controller('branchesController', function ($http, $scope, $filter, $rootScope, $compile, $sce, loadingMessageService, appConfig) {

        $scope.getAll = true;
        $scope.locationsType = 'map';
        $scope.centerMap = [40.7112, -74.213]; // Start Position

        $scope.API = appConfig.municloudapiEndPoint; //'http://munipoiapp.herokuapp.com/api/';

        if ($rootScope.searchOptions == true)
            $scope.API = $scope.API + 'pois?artcentres=' + $rootScope.artcentre + '&schools=' + $rootScope.schools + '&votingstations=' + $rootScope.votingstations + '&parks=' + $rootScope.parks + '&clinics=' + $rootScope.clinics;
        else
            $scope.API = $scope.API + 'pois?artcentres=true&schools=true&votingstations=true&parks=true&clinics=true';

        $rootScope.searchOptions = false;
        $scope.viewsettings = 0;

        $scope.isFetching = true;
        $scope.locations = [];
        $scope.userLat = 0;
        $scope.userLng = 0;
        $scope.closestLocations = [];
        $scope.minDistance = 15; // Km
        $scope.markers = [];

        $scope.email = '';
        $scope.firstname = '';
        $scope.lastname = '';
        $scope.phoneNumber = '';
        $scope.idNumber = '';
        $scope.crmNumber = '';
        $scope.password = '';

        $scope.infoWindow = {
            id: '',
            title: '',
            content: '',
            address: '',
            hours: '',
            phone: '',
            distance: ''
        };

        $rootScope.$on("CallDrawMyLocation", function (event, position) {
            $scope.drawMyLocation(position.coords.latitude, position.coords.longitude);
        });

        // true is to show ALL locations, false to show ONLY closests locations
        $scope.checkIfLoggedIn = function (value, locationType) {
            $scope.isLoggedIn = true; //window.localStorage.getObject("loggedIn");

            if (!$scope.isLoggedIn) {
                appNavigator.pushPage('signinsocial.html');

            }


        }

        $scope.applyView = function () {

            $scope.viewsettings = window.localStorage.getObject("viewsettings");

        }

        // true is to show ALL locations, false to show ONLY closests locations
        $scope.start = function (value, locationType) {
            $scope.getAll = value;
            $scope.locationsType = locationType;

            if (locationType == 'list' || locationType == 'map') {
                $scope.init();
            }
        }

        $scope.profileInfo = function () {

            var page = appNavigator.getCurrentPage();
            $scope.email = page.options.email;
            $scope.firstname = page.options.firstname;
            $scope.lastname = page.options.lastname;

        }

        $scope.registerCustomer = function () {

            if (typeof $scope.phoneNumber === null && typeof $scope.firstname === '' && typeof $scope.lastname === '' && typeof $scope.idNumber === null && typeof $scope.password === '') {

                ons.notification.alert({
                    message: 'Please fill in the required fields!',
                    modifier: 'material'
                });

            } else {

                $scope.API = appConfig.emmregistercustomerapiEndPoint; //"http://196.15.242.146:5555/rest/EMMPerson/resources/customer/{";

                $scope.API = $scope.API + '"phoneNumber":"' + $scope.phoneNumber + '","email":"' + $scope.email + '","name":"' + $scope.firstname + '","surname":"' + $scope.lastname + '","password":"' + $scope.password + '","idNumber":"' + $scope.idNumber + '"}';

                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();

                $http.get($scope.API).success(function (response) {

                    if (response[0].status == "success") {

                        window.localStorage.setItem("idNumber", response[0].SAid);
                        window.localStorage.setItem("crmNumber", response[0].crmid);
                        window.localStorage.setItem("area", "Boksburg");
                        window.localStorage.setItem("firstname", $scope.firstname);
                        window.localStorage.setItem("lastname", $scope.lastname);
                        window.localStorage.setItem("email", $scope.email);


                        modal.hide();

                        ons.notification.alert({
                            message: 'Thank you for registering with us.!',
                            modifier: 'material'
                        });

                        appNavigator.pushPage('main-tab.html');

                    } else {
                        modal.hide();
                        ons.notification.alert({
                            message: 'User could not be registered on CRM.!',
                            modifier: 'material'
                        });

                    }

                }).error(function (error) {
                    modal.hide();
                    ons.notification.alert({
                        message: 'Oops!!! Problem registering your profile on the system.!',
                        modifier: 'material'
                    });
                });
            }

        }

        $scope.$on('mapInitialized', function (event, evtMap) {

            map = evtMap;

            $scope.init();
        });

        $scope.init = function () {

            //Force data List View to reload data
            window.localStorage.removeItem("rootsLastPage");
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.drawMyLocation(position.coords.latitude, position.coords.longitude);
                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                window.localStorage.setItem("lat", JSON.stringify($scope.userLat));
                window.localStorage.setItem("lng", JSON.stringify($scope.userLng));

                if ($scope.getAll == true)
                    $scope.getAllRecords();
                else {

                    $scope.closestLocation();
                }

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

        }

        $scope.drawMyLocation = function (lat, lng) {

            //$scope.getAllRecords();

            if ($scope.locationsType == 'map') {
                var pinLayer;

                var swBound = new google.maps.LatLng(lat, lng);
                var neBound = new google.maps.LatLng(lat, lng);
                var bounds = new google.maps.LatLngBounds(swBound, neBound);

                pinLayer = new PinLayer(bounds, map);
            }

            $scope.centerMap = [lat, lng];

        }

        $scope.dialNumber = function (number) {

            phonedialer.dial(
                number,
                function (err) {
                    if (err == "empty") alert("Unknown phone number");
                    else alert("Dialer Error:" + err);
                },
                function (success) {
                    //alert('Dialing succeeded');
                }
            );
        }

        $scope.poiGooglePlaces = function () {

            var near = appNavigator.getCurrentPage().options.near;

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();

            modal.show();

            if (near == 1)
                $scope.poiGooglePlacesNearMe();
            else {


                navigator.geolocation.getCurrentPosition(function (position) {

                    $scope.userLat = position.coords.latitude;
                    $scope.userLng = position.coords.longitude;

                    var radius = appNavigator.getCurrentPage().options.radius;

                    $scope.API = appConfig.nearbysearchapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=" + radius + "&type=police&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";

                    $http.get($scope.API).success(function (response) {

                        $scope.locations = response.results;

                        $.each($scope.locations, function (index, value) {

                            var distance = Haversine($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng, $scope.userLat, $scope.userLng);

                            $scope.markers.push({
                                'id': index,
                                'title': $scope.locations[index].name,
                                'content': $scope.locations[index].name,
                                'placeid': $scope.locations[index].place_id,
                                'address': "",
                                'seq': $scope.locations[index].seq,
                                'phone': "",
                                'distance': (Math.round(distance * 100) / 100),
                                'location': [$scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng],
                                'type': $scope.locations[index].type,
                                'icon': "images/icons/mapicon.png"
                                    /*'icon': {
                                        path: MAP_PIN,
                                        fillColor: $scope.locations[index].colour,
                                        fillOpacity: 1,
                                        strokeColor: '',
                                        strokeWeight: 0
                                    }*/
                            });

                        });
                    });

                    modal.hide();

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

        }

        $scope.poiGooglePlacesNearMe = function () {

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                $scope.API = appConfig.nearbysearchapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=10000&type=police&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";

                $http.get($scope.API).success(function (response) {

                    $scope.locations = response.results;

                    $.each($scope.locations, function (index, value) {

                        var distance = Haversine($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng, $scope.userLat, $scope.userLng);

                        $scope.markers.push({
                            'id': index,
                            'title': $scope.locations[index].name,
                            'placeid': $scope.locations[index].place_id,
                            'content': $scope.locations[index].name,
                            'address': "",
                            'seq': $scope.locations[index].seq,
                            'phone': "",
                            'distance': (Math.round(distance * 100) / 100),
                            'location': [$scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng],
                            'type': $scope.locations[index].type,
                            'icon': "images/icons/mapicon.png"
                                /*'icon': {
                                    path: MAP_PIN,
                                    fillColor: $scope.locations[index].colour,
                                    fillOpacity: 1,
                                    strokeColor: '',
                                    strokeWeight: 0
                                }*/
                        });

                    });
                });

                modal.hide();

            }, function (error) {

                console.log("Couldn't get the location of the user.");

                ons.notification.alert({
                    message: 'Please enable you GPS and try again.! ' + error.message,
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

        $scope.showPOIDetails = function () {

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var placeid = appNavigator.getCurrentPage().options.placeid;

            $scope.API = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeid + "&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";

            $http.get($scope.API).success(function (response) {

                $scope.result = response.result;

                modal.hide();

            }, function (error) {

                console.log("Couldn't get the location details.");

                ons.notification.alert({
                    message: 'Something wrong with your connection.!',
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

        $scope.placeCall = function (num) {

            phonedialer.dial(
                num.replace(/\s/g, ''),
                function (err) {
                    if (err == "empty") alert("Unknown phone number");
                    else alert("Dialer Error:" + err);
                },
                function (success) {
                    console.log('Dialing succeeded');
                }
            );

        }

        $scope.loadPOIDetails = function (index, marker) {

            appNavigator.pushPage('placedetail.html', {
                placeid: marker.placeid
            });

        }

        $scope.pullMarkersContent = function () {

            $scope.API = appConfig.poiapiEndPoint;

            $scope.API = $scope.API + '?' + $rootScope.optionselected + '=true'

            $http.get($scope.API).success(function (response) {

                $scope.locations = response.poi;
                // Get all locations
                $scope.allLocations();

                //Force data List View to reload data
                window.localStorage.removeItem("rootsLastPage");

            });

        }

        $scope.pullContent = function () {

            $scope.API = appConfig.poiapiEndPoint;;

            if ($scope.getAll)
                $scope.API = $scope.API + '?pageNumber=' + $scope.pageNumber + '&num=10&' + $rootScope.optionselected + '=true'
            else
                $scope.API = $scope.API + '?' + $rootScope.optionselected + '=true'


            $http.get($scope.API).success(function (response) {

                $scope.locations = response.poi;

                if ($scope.pageNumber >= response.pages) {

                    window.localStorage.setObject('rootsPOI', $scope.locations); // we save the posts in localStorage
                    window.localStorage.setItem('rootsDate', new Date());
                    window.localStorage.setItem("rootsLastPage", $scope.currentPage);
                    window.localStorage.setItem("rootsTotalPages", response.pages);
                    window.localStorage.setItem("rootsOptionSelected", $rootScope.optionselected);

                    if ($scope.getAll)
                    // Get all locations
                        $scope.allLocations();
                    else
                        $scope.closestLocation();

                    // hide the more news button
                    $('#moreButton').fadeOut('fast');
                    modal.hide();
                } else {

                    //$scope.locations = $scope.locations.concat(response.poi);
                    window.localStorage.setObject('rootsPOI', $scope.locations); // we save the posts in localStorage
                    window.localStorage.setItem('rootsDate', new Date());
                    window.localStorage.setItem("rootsLastPage", $scope.currentPage);
                    window.localStorage.setItem("rootsTotalPages", response.pages);
                    window.localStorage.setItem("rootsOptionSelected", $rootScope.optionselected);

                    // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
                    // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

                    $scope.totalPages = response.pages;

                    modal.hide();
                    $scope.isFetching = false;

                    if ($scope.pageNumber == response.pages) {

                        // hide the more news button
                        $('#moreButton').fadeOut('fast');

                    }

                    if ($scope.getAll)
                    // Get all locations
                        $scope.allLocations();
                    else
                        $scope.closestLocation();


                }

            });


        }

        $scope.nextPage = function () {

            $scope.currentPage++;
            $scope.pageNumber = $scope.currentPage;
            $scope.getAllRecords($scope.pageNumber);

        }

        $scope.getAllRecords = function (pageNumber) {

            $scope.isFetching = true;

            if (window.localStorage.getItem("rootsLastPage") == null) {

                // Let's reset everything and get new content from the site.
                $scope.currentPage = 1;
                $scope.pageNumber = 1;
                $scope.lastSavedPage = 0;


                window.localStorage.removeItem("rootsLastPage");
                window.localStorage.removeItem("rootsPOI");
                window.localStorage.removeItem("rootsTotalPages");
                window.localStorage.removeItem("rootsDate");
                window.localStorage.removeItem("rootsOptionSelected");

                $scope.pullContent();

            } else {

                var now = new Date();
                var saved = new Date(window.localStorage.getItem("rootsDate"));
                var optionPrevouslySelected = window.localStorage.getItem("rootsOptionSelected");

                var difference = Math.abs(now.getTime() - saved.getTime()) / 3600000;

                // Lets compare the current dateTime with the one we saved when we got the posts.
                // If the difference between the dates is more than 24 hours I think is time to get fresh content
                // You can change the 24 to something shorter or longer


                if (optionPrevouslySelected != $rootScope.optionselected) {
                    // Let's reset everything and get new content from the site.
                    $scope.currentPage = 1;
                    $scope.pageNumber = 1;
                    $scope.lastSavedPage = 0;
                    window.localStorage.removeItem("rootsLastPage");
                    window.localStorage.removeItem("rootsPOI");
                    window.localStorage.removeItem("rootsTotalPages");
                    window.localStorage.removeItem("rootsDate");
                    window.localStorage.removeItem("rootsOptionSelected");

                    $scope.pullContent();

                } else {

                    $scope.lastSavedPage = window.localStorage.getItem("rootsLastPage");

                    // If the page we want is greater than the last saved page, we need to pull content from the web
                    if ($scope.currentPage > $scope.lastSavedPage) {

                        $scope.pullContent();

                        // else if the page we want is lower than the last saved page, we have it on local Storage, so just show it.
                    } else {

                        $scope.locations = window.localStorage.getObject('rootsPOI');
                        $scope.currentPage = $scope.lastSavedPage;
                        $scope.totalPages = window.localStorage.getItem("rootsTotalPages");
                        $scope.isFetching = false;

                        modal.hide();

                    }

                }

            }


        };

        $scope.allLocations = function () {

            $.each($scope.locations, function (index, value) {

                var distance = Haversine($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng, $scope.userLat, $scope.userLng);

                $scope.markers.push({
                    'id': index,
                    'title': $scope.locations[index].name,
                    'content': $scope.locations[index].name,
                    'address': "",
                    'seq': $scope.locations[index].seq,
                    'phone': "",
                    'distance': (Math.round(distance * 100) / 100),
                    'location': [$scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng],
                    'type': $scope.locations[index].type,
                    'icon': "images/icons/mapicon.png"
                        /*'icon': {
                            path: MAP_PIN,
                            fillColor: $scope.locations[index].colour,
                            fillOpacity: 1,
                            strokeColor: '',
                            strokeWeight: 0
                        }*/
                });

            });

            window.localStorage.setItem("markers", JSON.stringify($scope.markers));


        }

        $scope.showMap = function (dlat, dlon) {
            var link = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&daddr=" + dlat + "," + dlon;
            console.log(link);

            window.location = link;
        }

        $scope.closestLocation = function () {

            $scope.getAllRecords();

            for (var i = 0; i < $scope.locations.length; i++) {

                // Get lat and lon from each item
                var locationLat = $scope.locations[i].geometry.location.lat;
                var locationLng = $scope.locations[i].geometry.location.lng;

                // get the distance between user's location and this point
                var dist = Haversine(locationLat, locationLng, $scope.userLat, $scope.userLng);

                if (dist < $scope.minDistance) {
                    $scope.closestLocations.push(i);
                }

            }

            $.each($scope.closestLocations, function (index, value) {

                var distance = Haversine($scope.locations[value].geometry.location.lat, $scope.locations[value].geometry.location.lng, $scope.userLat, $scope.userLng);

                $scope.markers.push({
                    'id': index,
                    'title': $scope.locations[index].name,
                    'content': $scope.locations[index].name,
                    'address': "",
                    'hours': "",
                    'phone': "",
                    'distance': (Math.round(distance * 100) / 100),
                    'location': [$scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng],
                    'type': $scope.locations[index].type,
                    'icon': "images/icons/mapicon.png"
                        /* 'icon': {
                             path: MAP_PIN,
                             fillColor: $scope.locations[index].colour,
                             fillOpacity: 1,
                             strokeColor: '',
                             strokeWeight: 0
                         }*/
                });

            });

        }

        $scope.showMarker = function (event) {

            $scope.marker = $scope.markers[this.id];

            $scope.infoWindow = {
                id: $scope.marker.id,
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

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }

        $scope.signIn = function () {

            appNavigator.pushPage('signin.html');

        }

        $scope.signOut = function () {

            window.localStorage.removeItem("username");
            window.localStorage.removeItem("password");
            window.localStorage.removeItem("loggedIn"); // force user to login

            appNavigator.pushPage('signinsocial.html');

        }

        // Get Directions
        $(document).on('click', '.get-directions', function (e) {

            e.preventDefault();

            $scope.markers = JSON.parse(window.localStorage.getItem("markers"));
            $scope.userLat = JSON.parse(window.localStorage.getItem("lat"));
            $scope.userLng = JSON.parse(window.localStorage.getItem("lng"));

            var marker = $scope.markers[$(this).attr('data-marker')];

            var link = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&daddr=" + marker.location[0] + "," + marker.location[1];
            console.log(link);

            window.location = link;

            // Apple
            //window.location.href = 'maps://maps.apple.com/?q='+marker.location[0]+','+marker.location[1];

            // Google Maps (Android)
            //var ref = window.open('http://maps.google.com/maps?q=' + marker.location[0] + ',' + marker.location[1], '_system', 'location=yes');

        });

        // Call
        $(document).on('click', '.call-phone', function (e) {

            e.preventDefault();

            var phone = $(this).attr('data-phone');
            phone = phone.replace(/\D+/g, "");

            window.open('tel:' + phone, '_system')

        });

    });

    app.controller('notificationsController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.notificationList = [];

        $scope.getNotificationList = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            db.transaction(function (tx) {

                tx.executeSql('CREATE TABLE IF NOT EXISTS notifications (id integer primary key, title text, message text)');

                tx.executeSql("INSERT INTO notifications (title, message) VALUES (?,?)", ["Notification", "Testing Tsheko"], function (tx, res) {
                    console.log("insertId: " + res.insertId + " -- probably 1");
                    console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

                }, function (e) {
                    console.log("ERROR: " + e.message);
                });
            });

            //appNavigator.pushPage('notifications.html');

            db.transaction(function (tx) {
                tx.executeSql("select id,title,message from notifications order by id desc;", [], function (tx, res) {
                    console.log("res.rows.item(0).message: " + res.rows.item(0).message + " -- should be 1");
                    $scope.notificationList = res.rows;
                });
            });

            $scope.isFetching = false;
            modal.hide();

        }

    }]);

    app.controller('goodsReturnedNotesController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.goodsReturned = {}

        $scope.returnedNotesList = [];

        $scope.getGoodsReturnedNotes = function () {
            $scope.API = appConfig.emmtransactionaleventsEndPoint;

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            $scope.API = $scope.API + '{"serviceProperties":{"systemCode":"code","key":"key"},"serviceRequest"{"searchType":"details","transactionalEventsType":"goodsReturnedNotes"}}';
            console.log($scope.API);
            $http.get($scope.API).success(function (data) {
                $scope.returnedNotesList = data.rows.rows;

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

        };
    }]);
    
    
    
    
     app.controller('ReviewsController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.Reviews = {}

        $scope.ReviewsList = [];
          
        $scope.getReviews = function () {
            $scope.API = appConfig. emmreviewsEndPoint;

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
          
            console.log($scope.API);
            $http.get($scope.API).success(function (data) {
                $scope.ReviewsList = data.data;
                

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

        };
         
          $scope.loadReviewsDetails = function (index, ReviewsList) {

            appNavigator.pushPage('reviews.html', {
                ID: ReviewsList.review_id
            });

        };

        $scope.showReviewsDetails = function () {

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

           var ID = appNavigator.getCurrentPage().options.ID;

            $scope.API = appConfig.emmreviewsEndPoint;

            $scope.API = $scope.API + '{"ReviewNumber":"' + ID + '"}';

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                 $scope.ReviewsList = data[0];

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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    app.controller('employeeController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.employee = {}

        $scope.employeeList = [];

        var femalecount = 0,
            malecount = 0,
            minyearfemale = 0,
            minyearmale = 0;

        $scope.getEmployee = function () {

            $scope.API = appConfig.emmemployeeEndPoint;

            if (typeof $scope.employee.startDate === 'undefined' && typeof $scope.employee.endDate === 'undefined') {
                ons.notification.alert({
                    message: 'This input form not complete!',
                    modifier: 'material'
                });
            } else {
                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();

                var month = $scope.employee.startDate.getMonth();
                var day = $scope.employee.startDate.getDate();
                var year = $scope.employee.startDate.getFullYear();
                var endmonth = $scope.employee.endDate.getMonth();
                var endday = $scope.employee.endDate.getDate();
                var endyear = $scope.employee.endDate.getFullYear();

                $scope.API = $scope.API + '{"serviceProperties":{"systemCode":"code","key":"key"},"serviceRequest":{"searchCriteria":[{"name":"startDate","value":"' + year + "-" + month + "-" + day + '"},{"name":"endDate","value":"' + endyear + "-" + endmonth + "-" + endday + '"}],"searchType":"date","personType":"employees"}}';

                $http.get($scope.API).success(function (data) {

                    if (!angular.isUndefined(data.rows[0].employeeFLEETDataDocument)) {

                        $scope.employeeList = data.rows[0].employeeFLEETDataDocument;

                        minyearfemale = $scope.employeeList[0].DATE_OF_BIRTH.substring(6);
                        minyearmale = $scope.employeeList[0].DATE_OF_BIRTH.substring(6);

                        angular.forEach($scope.employeeList, function (value, key) {
                            if (value.GENDER === "F") {
                                femalecount++;

                                if (value.DATE_OF_BIRTH.substring(6) < minyearfemale)
                                    minyearfemale = value.DATE_OF_BIRTH.substring(6);

                            } else {
                                malecount++;

                                if (value.DATE_OF_BIRTH.substring(6) < minyearmale)
                                    minyearmale = value.DATE_OF_BIRTH.substring(6);
                            }


                        });

                    }

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

        $scope.showStats = function () {

            appNavigator.pushPage('employeestats.html', {
                minyearfemale: minyearfemale,
                minyearmale: minyearmale,
                femalecount: femalecount,
                malecount: malecount
            });

        };

        $scope.getEmployeeStartDate = function () {

            var startDate;

            var options = {
                date: new Date(),
                mode: 'date'
            }

            datePicker.show(options, function (date) {

                $scope.employee.startDate = date;
                $scope.$apply();

            })

        };

        $scope.getEmployeeEndDate = function () {

            var endDate;

            var options = {
                date: new Date(),
                mode: 'date'
            }

            datePicker.show(options, function (date) {

                $scope.employee.endDate = date;
                $scope.$apply();

            })

        };

        $scope.loadEmployeeDetails = function (index, vehicle) {
            appNavigator.pushPage('employeedetails.html', {
                employees: employee.EMPLOYEE_NO
            });
        };

        $scope.showEmployeeDetails = function () {
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            var employeeno = appNavigator.getCurrentPage().options.employeeno;
            $scope.API = appConfig.emmemployeeEndPoint;

            $http.get($scope.API).success(function (response) {
                    $scope.employees = data.getEmployees;
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
                    $rootScope.goExit();
                }, {
                    maximumAge: Infinity,
                    timeout: 60000,
                    enableHighAccuracy: true
                });
        }

        // Show latest stats
        $scope.showEmployeeStats = function () {

            $scope.options = {

                chart: {

                    type: 'pieChart',

                    height: 500,

                    x: function (d) {
                        return d.Name;
                    },

                    y: function (d) {

                        return d.PercOfEmployee;
                    },

                    showLabels: true,
                    showLegend: true,

                    duration: 500,

                    labelThreshold: 0.01,

                    labelSunbeamLayout: true,

                    valueFormat: function (d) {

                        return d3.format(',.0f')(d) + ' ' + $scope.graphtitle;

                    },

                    legend: {

                        margin: {

                            top: 5,

                            right: 35,

                            bottom: 5,

                            left: 0

                        }

                    },

                    "title": {

                        "enable": true,

                        "text": "Latest Stats"

                    },

                    "subtitle": {

                        "enable": true,

                        "text": "This information was provided by the eFleet",

                        "css": {

                            "text-align": "right",

                            "margin": "10px 13px 0px 7px"

                        }

                    },

                    caption: {

                        enable: true,

                        html: 'Click on the legend to show/hide',

                        css: {

                            'text-align': 'justify',

                            'margin': '10px 13px 0px 7px'

                        }

                    }

                }

            };

            var page = appNavigator.getCurrentPage();
            $scope.minyearfemale = page.options.minyearfemale;
            $scope.minyearmale = page.options.minyearmale;
            $scope.femalecount = page.options.femalecount;
            $scope.malecount = page.options.malecount;
            $scope.graphtitle = "Employees";

            $scope.data = [{
                    Name: 'Male',
                    PercOfEmployee: $scope.malecount
                                      },
                {
                    Name: 'Female',
                    PercOfEmployee: $scope.femalecount
                                      }
                                    ];

        };


    }]);

    app.controller('purchaseOrderController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.purchaseOrderDetails = {}
        $scope.isShowing = false;

        $scope.getPurchaseOrder = function () {

            $scope.API = appConfig.emmpurchaseorderEndPoint;

            if (typeof $scope.purchaseorder.ordernumber === 'undefined') {

                ons.notification.alert({
                    message: 'This input form not complete!',
                    modifier: 'material'
                });


            } else {

                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();

                $scope.API = $scope.API + '{"purcahseOrder":{"orderNumber":"' + $scope.purchaseorder.ordernumber + '"}}';

                console.log($scope.API);

                $http.get($scope.API).success(function (data) {

                    $scope.purchaseOrderDetails = data.purchaseOrderDeatils;

                    if (!angular.isUndefined($scope.purchaseOrderDetails))
                        $scope.isShowing = true;

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

    app.controller('mapController', ['$http', '$scope', '$rootScope', '$compile', 'appConfig', function ($http, $scope, $rootScope, $compile, appConfig) {

        $scope.map;
        $scope.overlay;
        $scope.markers = [];
        $scope.markerId = 1;

        var menuIcons = {
            schools: {
                icon: '/images/icons/school.png'
            },
            parks: {
                icon: '/images/icons/resturant.png'
            },
            artcentres: {
                icon: '/images/icons/hotel.png'
            },
            customercarecentres: {
                icon: '/images/icons/customercarecentres.png'
            },
            police: {
                icon: '/images/icons/police.png'
            },
            clinics: {
                icon: '/images/icons/clinics.png'
            }
        };

        var infowindow = new google.maps.InfoWindow({
            content: 'testing',
            maxWidth: 200
        });

        //Map initialization  
        $scope.start = function () {

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                var latlng = new google.maps.LatLng($scope.userLat, $scope.userLng);

                var myOptions = {
                    zoom: 11,
                    center: latlng,
                    //mapTypeId: google.maps.MapTypeId.SATELLITE
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                $scope.overlay = new google.maps.OverlayView();
                $scope.overlay.draw = function () {}; // empty function required

                $scope.overlay.setMap($scope.map);
                $scope.element = document.getElementById('map_canvas');
                $scope.hammertime = Hammer($scope.element).on("hold", function (event) {
                    $scope.addOnClick(event);
                });

            }, function (error) {

                console.log("Couldn't get the location of the user.");


                ons.notification.alert({
                    message: 'Please enable you GPS and try again.! ' + error.message,
                    modifier: 'material'
                });

                console.log(error.code);

            }, {
                maximumAge: Infinity,
                timeout: 60000,
                enableHighAccuracy: true
            });

        };

        $scope.signOut = function () {

            window.localStorage.removeItem("username");
            window.localStorage.removeItem("password");
            window.localStorage.removeItem("loggedIn"); // force user to login

            appNavigator.pushPage('signinsocial.html');

        }


        //Delete all Markers
        $scope.resetAllMarkers = function () {


            if ($scope.markers.length == 0) {
                return;
            }

            for (var i = 0; i < $scope.markers.length; i++) {

                //Remove the marker from Map                  
                $scope.markers[i].setMap(null);
            }
        };

        //show all Markers
        $scope.showMarkers = function (type) {

            //var image;
            modal.show();

            //reset what is on the map currently
            $scope.resetAllMarkers();

            if (type == "poi")
                $scope.loadPOIMarkers();
            else
                $scope.loadMarkers(type);

            modal.hide();

        };


        $scope.loadMarkers = function (type) {


            $scope.API = appConfig.poiapiEndPoint; //"http://munipoiapp.herokuapp.com/api/pois";

            $scope.API = $scope.API + '?' + type + '=true'

            $scope.markers = [];

            $http.get($scope.API).success(function (response) {

                /*  $.each(response.poi, function (key, value) {

                      var latLng = new google.maps.LatLng(value.lat, value.lon);
                      var marker = new google.maps.Marker({
                          'position': latLng
                      });
                      markers.push(marker);
                  });*/

                for (var i = 0; i < response.poi.length; i++) {

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(response.poi[i].geometry.location.lat, response.poi[i].geometry.location.lng),
                        map: $scope.map,
                        title: response.poi[i].name

                    });

                    $scope.markers.push(marker);

                    marker.content = "<div><p>" + marker.title + "</p><input type='submit' ng-click='getDirections(" + marker.position.lat() + "," + marker.position.lng() + ")' class='btn-distance' value='Directions' /></div>";

                    google.maps.event.addListener(marker, 'click', (function (marker, i, $scope) {
                        return function () {
                            var compiled = $compile(marker.content)($scope);
                            $scope.$apply();
                            infowindow.setContent(compiled[0]);
                            infowindow.open(map, marker);
                        }
                    })(marker, i, $scope));

                }

            });

        }

        $scope.loadPOIMarkers = function (type) {

            modal.show();

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                $scope.API = appConfig.nearbysearchapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=25000&type=point_of_interest&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";

                $http.get($scope.API).success(function (response) {

                    $scope.locations = response.results;

                    $scope.markers = [];

                    $.each($scope.locations, function (index, value) {

                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng),
                            map: $scope.map,
                            title: $scope.locations[index].name
                        });

                        $scope.markers.push(marker);

                        marker.content = "<div><h3>" + marker.title + "</h3><input type='submit' ng-click='getDirections(" + marker.position.lat() + "," + marker.position.lng() + ")' class='btn-distance' value='Directions' /></div>";

                        google.maps.event.addListener(marker, 'click', (function (marker, index) {
                            return function () {
                                //infowindow.setContent($scope.locations[index].name);
                                var compiled = $compile(marker.content)($scope);
                                $scope.$apply();
                                infowindow.setContent(compiled[0]);
                                infowindow.open(map, marker);
                            }
                        })(marker, index));

                    });

                    modal.hide();


                });

            }, function (error) {

                console.log("Couldn't get the location of the user.");


                ons.notification.alert({
                    message: 'Please enable you GPS and try again.! ' + error.message,
                    modifier: 'material'
                });

                console.log(error.code);

            }, {
                maximumAge: Infinity,
                timeout: 60000,
                enableHighAccuracy: true
            });

        }

        $scope.loadClinicsMarkers = function () {

            modal.show();

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                $scope.API = appConfig.emmclinicapiEndPoint;

                $http.get($scope.API).success(function (response) {

                    $scope.locations = response.GPS;

                    $scope.markers = [];

                    $.each($scope.locations, function (index, value) {

                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.locations[index].Lat, $scope.locations[index].Long),
                            map: $scope.map,
                            title: $scope.locations[index].ClinicAddress
                        });

                        $scope.markers.push(marker);

                        marker.content = "<div><h3>" + marker.title + "</h3><input type='submit' ng-click='getDirections(" + marker.position.lat() + "," + marker.position.lng() + ")' class='btn-distance' value='Directions' /></div>";

                        google.maps.event.addListener(marker, 'click', (function (marker, index) {
                            return function () {
                                //infowindow.setContent($scope.locations[index].ClinicAddress);
                                var compiled = $compile(marker.content)($scope);
                                $scope.$apply();
                                infowindow.setContent(compiled[0]);
                                infowindow.open(map, marker);
                            }
                        })(marker, index));

                    });

                    modal.hide();


                });

            }, function (error) {

                console.log("Couldn't get the location of the user.");


                ons.notification.alert({
                    message: 'Please enable you GPS and try again.! ' + error.message,
                    modifier: 'material'
                });

                console.log(error.code);

            }, {
                maximumAge: Infinity,
                timeout: 60000,
                enableHighAccuracy: true
            });

        }

        $scope.getDirections = function (lat, lot) {

            var link = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&daddr=" + lat + "," + lot;
            console.log(link);

            window.location = link;
        }

        $scope.rad = function (x) {
            return x * Math.PI / 180;
        };

        //Calculate the distance between the Markers
        $scope.calculateDistance = function () {

            if ($scope.markers.length < 2) {
                ons.notification.alert({
                    message: 'Insert at least 2 markers!!!'
                });
            } else {
                var totalDistance = 0;
                var partialDistance = [];
                partialDistance.length = $scope.markers.length - 1;

                for (var i = 0; i < partialDistance.length; i++) {
                    var p1 = $scope.markers[i];
                    var p2 = $scope.markers[i + 1];

                    var R = 6378137; // Earth’s mean radius in meter
                    var dLat = $scope.rad(p2.position.lat() - p1.position.lat());
                    var dLong = $scope.rad(p2.position.lng() - p1.position.lng());
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos($scope.rad(p1.position.lat())) * Math.cos($scope.rad(p2.position.lat())) *
                        Math.sin(dLong / 2) * Math.sin(dLong / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    totalDistance += R * c / 1000; //distance in Km
                    partialDistance[i] = R * c / 1000;
                }


                ons.notification.confirm({
                    message: 'Do you want to see the partial distances?',
                    callback: function (idx) {

                        ons.notification.alert({
                            message: "The total distance is " + totalDistance.toFixed(1) + " km"
                        });

                        switch (idx) {
                        case 0:

                            break;
                        case 1:
                            for (var i = (partialDistance.length - 1); i >= 0; i--) {

                                ons.notification.alert({
                                    message: "The partial distance from point " + (i + 1) + " to point " + (i + 2) + " is " + partialDistance[i].toFixed(1) + " km"
                                });
                            }
                            break;
                        }
                    }
                });
            }
        };

        //Add single Marker
        $scope.addOnClick = function (event) {
            var x = event.gesture.center.pageX;
            var y = event.gesture.center.pageY - 44;
            var point = new google.maps.Point(x, y);
            var coordinates = $scope.overlay.getProjection().fromContainerPixelToLatLng(point);

            var marker = new google.maps.Marker({
                position: coordinates,
                map: $scope.map
            });

            marker.id = $scope.markerId;
            $scope.markerId++;
            $scope.markers.push(marker);


            //Creation of the listener associated to the Markers click

            google.maps.event.addListener(marker, "click", function (e) {
                ons.notification.confirm({
                    message: 'Do you want to delete the marker?',
                    callback: function (idx) {
                        switch (idx) {
                        case 0:
                            ons.notification.alert({
                                message: 'You pressed "Cancel".'
                            });
                            break;
                        case 1:
                            for (var i = 0; i < $scope.markers.length; i++) {
                                if ($scope.markers[i].id == marker.id) {
                                    //Remove the marker from Map                  
                                    $scope.markers[i].setMap(null);

                                    //Remove the marker from array.
                                    $scope.markers.splice(i, 1);
                                }
                            }
                            ons.notification.alert({
                                message: 'Marker deleted.'
                            });
                            break;
                        }
                    }
                });
            });

        }
    }]);

    app.controller('categoryController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', function ($http, $scope, $rootScope, $sce, appConfig) {

        $rootScope.title = "";
        $scope.ads = [];
        $scope.category = "";
        $scope.API = appConfig.municloudapiEndPoint; // 'http://munipoiapp.herokuapp.com/api/';


        // true is to show ALL locations, false to show ONLY closests locations
        $scope.start = function () {

            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false
            });

            var page = appNavigator.getCurrentPage();
            $rootScope.title = page.options.categoryTitle;
            $scope.category = page.options.category;

        }

        $scope.getAdsByCategory = function (category) {

            $scope.isFetching = true;
            $http.get($scope.API + 'ads/categories/' + category).success(function (response) {

                $scope.ads = response;

                $scope.isFetching = false;

            }, function (error) {
                console.log("Results not showing");
                console.log(error);
            });

        }

        $scope.showPOI = function () {

            //set all the search option to false
            $rootScope.optionselected = "";

            $rootScope.searchOptions = true; //customised search

            window.localStorage.removeItem("rootsLastPage");
            window.localStorage.removeItem("rootsPOI");
            window.localStorage.removeItem("rootsTotalPages");
            window.localStorage.removeItem("rootsDate");
            window.localStorage.removeItem("rootsOptionSelected");

            //check which dataset to load
            switch ($scope.category) {
            case 'votingstations':
                $rootScope.optionselected = 'votingstations';
                break;
            case 'parks':
                $rootScope.optionselected = 'parks';
                break;
            case 'schools':
                $rootScope.optionselected = 'schools';
                break;
            case 'artcentres':
                $rootScope.optionselected = 'artcentres';
                break;
            case 'ccc':
                $rootScope.optionselected = 'ccc';
                break;
                /*case 'police':
                    $rootScope.optionselected = 'police';
                    break;*/
            case 'clinics':
                $rootScope.optionselected = 'clinics';
                break;
            default:
            }

            if ($rootScope.optionselected === 'police' || $rootScope.optionselected === 'clinics')
                appNavigator.pushPage('places.html', {
                    radius: '25000'
                });
            else
            //appNavigator.pushPage('branches-list.html');
                appNavigator.pushPage('branches.html');

        };

        $scope.showStats = function () {

            //check which dataset to load
            switch ($scope.category) {
            case 'votingstations':
                $rootScope.optionselected = 'votingstations';
                break;
            case 'parks':
                $rootScope.optionselected = 'parks';
                break;
            case 'schools':
                $rootScope.optionselected = 'schools';
                break;
            case 'artcentres':
                $rootScope.optionselected = 'artcentres';
                break;
            case 'ccc':
                $rootScope.optionselected = 'ccc';
                break;
            case 'clinics':
                $rootScope.optionselected = 'clinics';
                break;
            default:
            }

            appNavigator.pushPage('stats.html');

        };

        $scope.showNearMe = function () {

            //set all the search option to false
            $rootScope.optionselected = "";

            $rootScope.searchOptions = true; //customised search

            window.localStorage.removeItem("rootsLastPage");
            window.localStorage.removeItem("rootsPOI");
            window.localStorage.removeItem("rootsTotalPages");
            window.localStorage.removeItem("rootsDate");
            window.localStorage.removeItem("rootsOptionSelected");

            //check which dataset to load
            switch ($scope.category) {
            case 'votingstations':
                $rootScope.optionselected = 'votingstations';
                break;
            case 'parks':
                $rootScope.optionselected = 'parks';
                break;
            case 'schools':
                $rootScope.optionselected = 'schools';
                break;
            case 'artcentres':
                $rootScope.optionselected = 'artcentres';
                break;
            case 'ccc':
                $rootScope.optionselected = 'ccc';
                break;
                /*case 'police':
                    $rootScope.optionselected = 'police';
                    break;*/
            case 'clinics':
                $rootScope.optionselected = 'clinics';
                break;
            default:
            }

            if ($rootScope.optionselected === 'police' || $rootScope.optionselected === 'clinics')
                appNavigator.pushPage('places.html', {
                    radius: '2000',
                    near: '1'
                });
            else
                appNavigator.pushPage('nearme.html');

        };

        $scope.showProfile = function () {

            if (window.localStorage.getItem("idNumber") === '')
                dialog.show();
            else {
                $scope.idnumber = window.localStorage.getItem("idNumber");


                appNavigator.pushPage('profile.html', {
                    id: $scope.idnumber
                });

            }

        };

        $scope.showLatestResults = function () {

            appNavigator.pushPage('votingstats.html');

        };

    }]);

    app.controller('poiController', ['$scope', '$rootScope', '$sce', '$http', 'loadingMessageService', 'appConfig', function ($scope, $rootScope, $sce, $http, loadingMessageService, appConfig) {

        $scope.locations = [];
        $scope.locationsType = 'map';
        $scope.userLat = 0;
        $scope.userLng = 0;

        $scope.init = function initMap(poiType) {

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                $scope.centerMap = [$scope.userLat, $scope.userLng]; // Start Position

                var radius = appNavigator.getCurrentPage().options.radius;

                if (poiType == 'All')
                    $scope.API = appConfig.nearbysearchapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=25000&type=point_of_interest&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";
                else
                    $scope.API = appConfig.nearbysearchapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=10000&type=" + poiType + "&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";

                $http.get($scope.API).success(function (response) {

                    $scope.locations = response.results;

                    $scope.markers = [];

                    $.each($scope.locations, function (index, value) {

                        var distance = Haversine($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng, $scope.userLat, $scope.userLng);

                        $scope.markers.push({
                            'id': index,
                            'title': $scope.locations[index].name,
                            'content': $scope.locations[index].name,
                            'address': "",
                            'seq': $scope.locations[index].seq,
                            'phone': "",
                            'distance': (Math.round(distance * 100) / 100),
                            'location': [$scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng],
                            'type': $scope.locations[index].type,
                            'icon': "images/icons/mapicon.png"
                                /*'icon': {
                                    url: $scope.locations[index].icon,
                                    scaledSize: new google.maps.Size(20, 34), // scaled size
                                    origin: new google.maps.Point(0, 0), // origin
                                    anchor: new google.maps.Point(0, 0) // anchor
                                }*/
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

        $scope.loadPOI = function (poiType) {

            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            $scope.markers = [];

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.drawMyLocation(position.coords.latitude, position.coords.longitude);

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;

                $scope.centerMap = [$scope.userLat, $scope.userLng]; // Start Position

                if (poiType == 'All')
                    $scope.API = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=2000&type=point_of_interest&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";
                else
                    $scope.API = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&radius=5000&type=" + poiType + "&key=AIzaSyD8Or6tO3h801EW-QtIDI_VG-93B5OnoIM";

                $http.get($scope.API).success(function (response) {

                    $scope.locations = response.results;

                    $.each($scope.locations, function (index, value) {

                        var distance = Haversine($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng, $scope.userLat, $scope.userLng);

                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.locations[index].geometry.location.lat, $scope.locations[index].geometry.location.lng)

                        });

                        $scope.markers[index] = marker;

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

        $scope.poiBar = function () {

            poiDialog.show();
        }

        $scope.showMarkers = function (map) {

            for (var key in map.markers) {
                map.markers[key].setMap(map);
            };
        }

        $scope.hideMarkers = function (map) {
            for (var key in map.markers) {
                map.markers[key].setMap(null);
            };
        }

     }]);

    app.controller('votingController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {


    }]);

    app.controller('loginController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        $scope.init = function () {

            $scope.username = window.localStorage.getItem("username");
            $scope.password = window.localStorage.getItem("password");

            if ($scope.username != null && $scope.password != null) {
                appNavigator.pushPage('main-tab.html');
            }

        }

        $scope.signUp = function () {

            appNavigator.pushPage('signup.html');

        }

        $scope.forgot = function () {

            appNavigator.pushPage('forgot.html');

        }

        $scope.login = function () {

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

                        window.localStorage.setItem("idNumber", response[0].SAid);
                        window.localStorage.setItem("crmNumber", response[0].crmid);

                        window.localStorage.setItem("username", $scope.username);
                        window.localStorage.setItem("password", $scope.password);

                        appNavigator.pushPage('main-tab.html');
                    } else {
                        ons.notification.alert({
                            message: response[0].Description,
                            modifier: 'material'
                        });
                    }

                }).error(function (error) {
                    ons.notification.alert({
                        message: 'Oops!!! Problem logging in.!',
                        modifier: 'material'
                    });
                });
            }

        }

        $scope.pushForgotPassword = function () {

            if (typeof $scope.email === 'undefined') {

                ons.notification.alert({
                    message: 'Email not provided!',
                    modifier: 'material'
                });


            } else {

                $scope.API = appConfig.emmpasswordrecoveryapiEndPoint;
                $scope.API = $scope.API + '"emailAddress":"' + $scope.email + '"}';

                $http.get($scope.API).success(function (response) {

                    ons.notification.alert({
                        message: response[0].status.description,
                        modifier: 'material'
                    });

                    appNavigator.pushPage('signin.html');


                });
            }
        }

    }]);

    app.controller('profileController', ['$scope', '$rootScope', '$sce', '$http', 'appConfig', function ($scope, $rootScope, $sce, $http, appConfig) {

        var page = appNavigator.getCurrentPage();
        var id = page.options.id;

        $scope.votingdetails = '';

        $scope.meterdetails = '';

        $scope.pullContent = function () {

            $scope.API = appConfig.emmvoterspersondetailsapiEndPoint + id;

            window.localStorage.setItem("idNumber", id);

            $http.get($scope.API).success(function (response) {

                $scope.votingdetails = response;

            });

        }

        $scope.pullMeterContent = function () {

            $scope.API = appConfig.emmmetersapiEndPoint; // "http://196.15.242.146:5555/rest/EMMSuprema/resources/getMeterDetails/64010";

            window.localStorage.setItem("meternumber", "64010");

            $http.get($scope.API).success(function (response) {

                $scope.meterdetails = response;

            }).error(function (error) {
                ons.notification.alert({
                    message: JSON.stringify(error),
                    modifier: 'material'
                });
            });

        }

        $scope.getDirections = function () {
            var link = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&daddr=" + $scope.votingdetails.Voter.VotingStation.Location.Latitude + "," + $scope.votingdetails.Voter.VotingStation.Location.Longitude;
            console.log(link);

            window.location = link;
        }


    }]);

    app.controller('userProfileController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        $scope.dialogs = {};

        $scope.init = function () {

            $rootScope.idnumber = window.localStorage.getItem("idNumber");
            $rootScope.crmnumber = window.localStorage.getItem("crmNumber");
            $rootScope.area = window.localStorage.getItem("area");
            $rootScope.firstname = window.localStorage.getItem("firstname");
            $rootScope.lastname = window.localStorage.getItem("lastname");
            $rootScope.email = window.localStorage.getItem("email");

        }

        $scope.getDirections = function (dlat, dlon) {
            var link = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&daddr=" + $scope.votingdetails.Voter.VotingStation.Location.Latitude + "," + $scope.votingdetails.Voter.VotingStation.Location.Longitude;
            console.log(link);

            window.location = link;
        }

        $scope.loadProfile = function () {

            if (!$scope.dialogs[profileUpdateDialog]) {

                $scope.init();

                ons.createDialog(profileUpdateDialog, {
                    parentScope: $rootScope
                }).then(function (dialog) {
                    $scope.dialogs[profileUpdateDialog] = dialog;
                    dialog.show();
                });
            } else {
                $scope.dialogs[profileUpdateDialog].show();
            }
            profileUpdateDialog.show();
        }

        $scope.updateProfile = function () {

            window.localStorage.setItem("idNumber", $scope.idnumber);
            window.localStorage.setItem("firstname", $scope.firstname);
            window.localStorage.setItem("lastname", $scope.lastname);
            window.localStorage.setItem("email", $scope.email);

            ons.notification.alert({
                message: 'Profile updated succesfully!',
                modifier: 'material'
            });

            //profileUpdateDialog.hide();


        }

        $scope.viewCaseHistory = function () {

            appNavigator.pushPage('casehistory.html');


        }

        $scope.viewMeter = function () {

            appNavigator.pushPage('meterinfo.html');


        }

    }]);

    app.controller('caseHistoryController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        $scope.dialogs = {};
        $scope.cases = [];

        $scope.init = function () {

            $rootScope.crmnumber = window.localStorage.getItem("crmNumber");
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            $scope.API = appConfig.emmcasehistoryapiEndPoint;

            $scope.API = $scope.API + '"days":"100","CRMID":"2571133"}';

            $http.get($scope.API).success(function (response) {

                $scope.cases = response.Cases;

                modal.hide();

            }).error(function (error) {
                ons.notification.alert({
                    message: 'Oops!!! Problem returning case history from CRM.!',
                    modifier: 'material'
                });
            });

        }

        $scope.getDirections = function (dlat, dlon) {
            var link = appConfig.googledirectionapiEndPoint + $scope.userLat + "," + $scope.userLng + "&daddr=" + $scope.votingdetails.Voter.VotingStation.Location.Latitude + "," + $scope.votingdetails.Voter.VotingStation.Location.Longitude;
            console.log(link);

            window.location = link;
        }

        $scope.loadProfile = function () {

            if (!$scope.dialogs[profileUpdateDialog]) {

                $scope.init();

                ons.createDialog(profileUpdateDialog, {
                    parentScope: $rootScope
                }).then(function (dialog) {
                    $scope.dialogs[profileUpdateDialog] = dialog;
                    dialog.show();
                });
            } else {
                $scope.dialogs[profileUpdateDialog].show();
            }
            profileUpdateDialog.show();
        }

        $scope.viewMeter = function () {

            if (!$scope.dialogs[meterInfoDialog]) {

                $scope.init();

                ons.createDialog(meterInfoDialog, {
                    parentScope: $rootScope
                }).then(function (dialog) {
                    $scope.dialogs[meterInfoDialog] = dialog;
                    dialog.show();
                });
            } else {
                $scope.dialogs[meterInfoDialog].show();
            }
            meterInfoDialog.show();
        }

        $scope.updateProfile = function () {

            window.localStorage.setItem("idNumber", $scope.idnumber);
            window.localStorage.setItem("firstname", $scope.firstname);
            window.localStorage.setItem("lastname", $scope.lastname);

            profileUpdateDialog.hide();


        }

        $scope.updateProfile = function () {

            window.localStorage.setItem("meternumber", $scope.meternumber);

            meterInfoDialog.hide();


        }

        $scope.viewCaseHistory = function () {

            appNavigator.pushPage('casehistory.html');

        }

    }]);

    app.controller('statsController', ['$scope', '$rootScope', '$sce', '$http', 'appConfig', function ($scope, $rootScope, $sce, $http, appConfig) {

        $scope.options = {

            chart: {

                type: 'lineChart',

                height: 500,

                x: function (d) {
                    return d.key;
                },

                y: function (d) {

                    return d.y;
                },

                showLabels: false,


                duration: 500,

                labelThreshold: 0.01,

                labelSunbeamLayout: false,

                valueFormat: function (d) {

                    return d3.format(',.0f')(d) + $scope.graphtitle;

                },

                legend: {
                    "enable": false

                },

                "title": {

                    "enable": true,

                    "text": "Ekurhuleni Stats"

                },

                "subtitle": {

                    "enable": true,

                    "text": "This information was provided by the IEC",

                    "css": {

                        "text-align": "center",

                        "margin": "10px 13px 0px 7px"

                    }

                },

                caption: {

                    enable: true,

                    html: 'Click on the legend to show/hide',

                    css: {

                        'text-align': 'justify',

                        'margin': '10px 13px 0px 7px'

                    }

                }

            }

        };

        $scope.title = {};
        $scope.graphtitle = {};
        $scope.data = [];

        $scope.votesStats = [

            {

                key: "DA",

                y: 238380

            },

            {

                key: "ACDP",

                y: 5526

            },

            {

                key: "BCP",

                y: 663

            },

            {

                key: "APC",

                y: 4241

            },

            {

                key: "ANC",

                y: 478068

            },

            {

                key: "CDP",

                y: 837

            },

            {

                key: "COPE",

                y: 6206

            }, {

                key: "ACACA",

                y: 927

            },

            {

                key: "DRA",

                y: 3759

            },

            {

                key: "FNLA",

                y: 620

            },

            {

                key: "IND",

                y: 2391

            },

            {

                key: "IRAS",

                y: 6080

            },

            {

                key: "IFP",

                y: 8165

            },

            {

                key: "NFP",

                y: 8165

            }, {

                key: "NRP",

                y: 572

            },

            {

                key: "PAC",

                y: 5873

            },

            {

                key: "PAM",

                y: 85

            },

            {

                key: "PCO",

                y: 832

            },

            {

                key: "SCO",

                y: 873

            },

            {

                key: "TRC",

                y: 784

            },

            {

                key: "UUPUN",

                y: 34

            }, {

                key: "UDM",

                y: 4002

            },

            {

                key: "VF",

                y: 4655

            }

        ];

        $scope.parksStats = [

            {

                key: "Animal Parks",

                y: 3

            },

            {

                key: "Bird Sanctuaries",

                y: 5

            },

            {

                key: "Nature Reserves",

                y: 3

            },

            {

                key: "Watesports / Fishing Areas",

                y: 5

            },

            {

                key: "Parks / Gardens",

                y: 27

            }

                ];



        $scope.schoolsStats = [

            {



                key: "Colleges",

                y: 14

                }, {



                key: "Combined Schools",

                y: 45

                }, {



                key: "Immediate Schools",

                y: 4

                }, {



                key: "Primary Schools",

                y: 324

                }, {



                key: "Proposed Schools",

                y: 4

                }, {



                key: "Secondary Schools",

                y: 133

                }, {



                key: "Special Schools",

                y: 9

                }, {



                key: "Tertiary Schools",

                y: 6

                }

            ];


        // Show latest stats
        $scope.showVoterLatestResults = function () {

            $scope.options = {

                chart: {

                    type: 'pieChart',

                    height: 500,

                    x: function (d) {
                        return d.Name;
                    },

                    y: function (d) {

                        return d.PercOfVotes;
                    },

                    showLabels: true,
                    showLegend: false,

                    duration: 500,

                    labelThreshold: 0.01,

                    labelSunbeamLayout: true,

                    valueFormat: function (d) {

                        return d3.format(',.0f')(d) + $scope.graphtitle;

                    },

                    legend: {

                        margin: {

                            top: 5,

                            right: 35,

                            bottom: 5,

                            left: 0

                        }

                    },

                    "title": {

                        "enable": true,

                        "text": "Latest Stats"

                    },

                    "subtitle": {

                        "enable": true,

                        "text": "This information was provided by the IEC",

                        "css": {

                            "text-align": "right",

                            "margin": "10px 13px 0px 7px"

                        }

                    },

                    caption: {

                        enable: true,

                        html: 'Click on the legend to show/hide',

                        css: {

                            'text-align': 'justify',

                            'margin': '10px 13px 0px 7px'

                        }

                    }

                }

            };

            $rootScope.optionselected = 'latest';

            $scope.resultsDetails = {};

            $scope.API = appConfig.emmvotingstatsapiEndPoint;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            $http.get($scope.API).success(function (response) {

                $scope.partyBallotResults = response.PartyBallotResults;
                $scope.resultsDetails = response;

                $scope.loadData();
                modal.hide();

            });


        };


        // determine the stats data to load

        $scope.loadData = function () {

            switch ($rootScope.optionselected) {

            case 'votingstations':

                $scope.data = $scope.votesStats;
                $scope.title = "Voting Stations";
                $scope.graphtitle = " votes";
                break;

            case 'parks':

                $scope.data = $scope.parksStats;
                $scope.title = "Parks";
                $scope.graphtitle = " parks";
                break;

            case 'schools':

                $scope.data = $scope.schoolsStats;
                $scope.title = "Schools";
                $scope.graphtitle = " schools";
                break;

            case 'artcentres':

                $scope.title = "Art Centres";
                $scope.data = [];
                $scope.graphtitle = " art centers";
                break;

            case 'ccc':

                $scope.title = "Customer Care Centres";
                $scope.data = [];
                $scope.graphtitle = " customer care centres";
                break;

            case 'latest':

                $scope.data = $scope.partyBallotResults;
                $scope.title = "Latest Results for the National Election for Province and Municipality";
                $scope.graphtitle = "% Of Votes";
                break;

            default:

            }

        }



    }]);

    app.controller('searchController', ['$scope', '$rootScope', '$sce', function ($scope, $rootScope, $sce) {

        $scope.searchOptions = true;

        $scope.showPOI = function () {

            $rootScope.school = $scope.school;
            $rootScope.artcentre = $scope.artcentre;
            $rootScope.parks = $scope.parks;
            $rootScope.votingstations = $scope.votingstations;
            $rootScope.searchOptions = $scope.searchOptions;

            appNavigator.pushPage('branches-list.html');

        };

    }]);

    app.controller('notificationController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        var page = appNavigator.getCurrentPage();
        var ids = page.options.ids;

        $scope.sendMessage = function () {

            var message = {
                app_id: "a17d1266-3037-4f13-8c29-e2203d0f3458",
                contents: {
                    "en": $scope.message
                },
                include_player_ids: [ids]
            };

            $http.post("https://onesignal.com/api/v1/notifications", message, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ODUzM2RkOWYtZWM0MS00NzI5LWE0MGItMWI0ZDU5MDQ3MDc4'
                }
            }).success(function (responseData) {
                appNavigator.pushPage('counsellor.html');
                appNavigator.getCurrentPage().destroy();
            }).error(function (error) {
                alert(JSON.stringify(error));
            });

        };

    }]);

    app.controller('loadingMessageService', ['$scope', function ($scope) {

        $scope.showMessage = function () {

            $scope.messageList = ["Contributes 6.2% to national production;", "Has a share of ±7.3% of national employment;", "Produces 26% of the total economic output of Gauteng;"];

            $scope.didyouknowmessage = $scope.messageList[Math.floor(Math.random() * $scope.messageList.length)];

        }

    }]);

    
    /*app.controller('speachSearchController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        function recognizeSpeech() {
            var maxMatches = 5;
            var promptString = "Speak now"; // optional
            var language = "en-US"; // optional
            window.plugins.speechrecognizer.startRecognize(function (result) {
                alert(result);
                $scope.recognizedText = result;
            }, function (errorMessage) {
                console.log("Error message: " + errorMessage);
            }, maxMatches, promptString, language);
        }

    }]);*/


    // Maps Functions //

    // Math Functions
    function Deg2Rad(deg) {
        return deg * Math.PI / 180;
    }

    // Get Distance between two lat/lng points using the Haversine function
    // First published by Roger Sinnott in Sky & Telescope magazine in 1984 ("Virtues of the Haversine")
    function Haversine(lat1, lon1, lat2, lon2) {
        var R = 6372.8; // Earth Radius in Kilometers

        var dLat = Deg2Rad(lat2 - lat1);
        var dLon = Deg2Rad(lon2 - lon1);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        // Return Distance in Kilometers
        return d;
    }

    // Pulse Marker Icon
    function PinLayer(bounds, map) {
        this.bounds = bounds;
        this.setMap(null);
        this.setMap(map);
    }

    PinLayer.prototype = new google.maps.OverlayView();

    PinLayer.prototype.onAdd = function () {

        // Container
        var container = document.createElement('DIV');
        container.className = "pulse-marker";

        // Pin
        var marker = document.createElement('DIV');
        marker.className = "pin";

        // Pulse
        var pulse = document.createElement('DIV');
        pulse.className = 'pulse';

        container.appendChild(marker);
        container.appendChild(pulse);

        this.getPanes().overlayLayer.appendChild(container);

        container.appendChild(document.createElement("DIV"));
        this.div = container;
    }

    PinLayer.prototype.draw = function () {
        var overlayProjection = this.getProjection();
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
        var div = this.div;
        div.style.left = sw.x - 8 + 'px';
        div.style.top = ne.y - 15 + 'px';
    }

    // Custom Marker SetMap
    Marker.prototype.setMap = function () {
        google.maps.Marker.prototype.setMap.apply(this, arguments);
        (this.MarkerLabel) && this.MarkerLabel.setMap.apply(this.MarkerLabel, arguments);
    };

})();