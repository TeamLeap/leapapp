app.controller('ReviewsController', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {

        $scope.Reviews = {}

        $scope.ReviewsList = [];

        $scope.getReviews = function () {
            $scope.API = appConfig.emmreviewsEndPoint;

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
