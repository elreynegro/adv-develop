/**
 * Created by TDadam on 7/31/2017.
 */
angular.module("com.hrlogix.ats.applyflow").controller('preferencesController', ['$scope', '$rootScope', '$location', 'candidate', 'CandidateWorkFlow', function($scope,$rootScope,$location,$controller,candidate,CandidateWorkFlow) {
    angular.extend(this, $controller('baseController', {$scope: $scope}));


    function internalMessageHandler(enabled,message) {
        $scope.showNotificationMsg = enabled;
        $scope.notificationMsg = message;
    }

    initialize();

    function initialize() {

        $rootScope.sessionNotificationShow = false;
        $rootScope.showAccount = true;
        $scope.showNotificationMsg = false;
        $scope.notificaitonEngine = {
            badRequest                     : 'Bad Request !!',
            autoJobEmailsUnSubScribeSuccess: 'You have been successfully unsubscribed from auto job email communications,you may re-subscribe from profile dashboard',
            autoJobEmailsUnSupportedMedia: 'Bad Request !! unsupported media',
            autoJobEmailsFailure: 'Something went wrong !! unable to process your request'
        };
        $rootScope.globalProgressBarHandler(true);
        try {
            if ($location.search().action) {
                var action = $location.search().action;
                switch (action) {
                    case 'unsubscribe':
                        if ($location.search().email) {
                            var email = $location.search().email;
                            processCandidatePreferences(email, action);
                        } else {
                            $rootScope.globalProgressBarHandler(false);
                            internalMessageHandler(true, $scope.notificaitonEngine.autoJobEmailsUnSupportedMedia);
                        }
                        break;
                    default:
                        $rootScope.globalProgressBarHandler(false);
                        internalMessageHandler(true, $scope.notificaitonEngine.badRequest);
                        break;
                }
            } else {
                $rootScope.globalProgressBarHandler(false);
                internalMessageHandler(true, $scope.notificaitonEngine.badRequest);
            }

        }catch (reason){
            $rootScope.globalProgressBarHandler(false);
        }
    }

    function processCandidatePreferences(email,action) {
        $scope.fetchCandidateByEmail(email)
            .then(function () {
                var candidateCurrent = undefined;
                if (angular.isArray($scope.fetchCandidateByEmailResponse) && $scope.fetchCandidateByEmailResponse.length > -1) {
                    candidateCurrent = $scope.fetchCandidateByEmailResponse[0];
                }
                if (candidateCurrent !== null && candidateCurrent !== undefined) {
                    switch (action){
                        case 'unsubscribe':
                            CandidateWorkFlow.preferences.communications.subscriptions.marketing.unSubscribe(email).$promise.then(function (result) {
                                $rootScope.globalProgressBarHandler(false);
                                internalMessageHandler(true,$scope.notificaitonEngine.autoJobEmailsUnSubScribeSuccess);
                            },function (reason) {
                                $rootScope.globalProgressBarHandler(false);
                                internalMessageHandler(true,$scope.notificaitonEngine.autoJobEmailsFailure);

                            });
                            return;
                    }
                    // if required candidate table to be updated in future please uncomment and handle conditionally
                    // candidate.updateCandidate(candidateCurrent).$promise
                    //     .then(
                    //         function (result) {
                    //             $rootScope.globalProgressBarHandler(false);
                    //             internalMessageHandler(true,$scope.notificaitonEngine.autoJobEmailsUnSubScribeSuccess);
                    //         },
                    //         function (reason) {
                    //             $rootScope.globalProgressBarHandler(false);
                    //             internalMessageHandler(true,$scope.notificaitonEngine.autoJobEmailsFailure);
                    //         }
                    //     );
                } else {
                    $rootScope.globalProgressBarHandler(false);
                    internalMessageHandler(true,$scope.notificaitonEngine.autoJobEmailsFailure);
                }

            }).catch(function (reason) {
            $rootScope.globalProgressBarHandler(false);
            internalMessageHandler(true,$scope.notificaitonEngine.autoJobEmailsFailure);
        });
    }

}]);
