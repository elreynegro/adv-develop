(function () {
    'use strict';

    angular
        .module('st.candidate.auth')
        .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$rootScope', '$scope', '$log','$q', '$http', '$timeout', '$location', '$uibModalInstance', '$uibModal', '$controller', 'authService', 'candidate','ModelDependencyFactory','LocalStorage','loginConfigurations'];

    function ForgotPasswordController($rootScope, $scope,$log,$q,$http,$timeout,$location,$uibModalInstance, $uibModal, $controller, authService,candidate,ModelDependencyFactory,LocalStorage,loginConfigurations) {
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_LOGIN);
        //angular.extend(this, $controller('candidateBaseHelper',  {$scope: $scope}));

        var loginModalResponse = {
            authenticationSuccess: false,
            reason:"",
            // activityType closeModal : -1 Basic : 0 and Social : 1 and forgotPassword : 2
            activityType: 0,
            rememberMe : false,
            userName : ''
        };


        $scope.vm = {};
        initialize();

        $scope.forgotPasswordHandler = function (isValid) {
            $scope.forgotPasswordForm.$invalid = true;
            if (!isValid) {
                logger.debug('There are still invalid fields.');
                return;
            }
            var emailCandidate = {};
            emailCandidate.name = EMAIL_PASSWORD_RESET_NAME;
            emailCandidate.type = EMAIL_PASSWORD_RESET_TYPE;
            emailCandidate.client = clientName;
            emailCandidate.username = $scope.forgotPasswordEmail;
            $scope.passwordUpdate = false;
            $scope.accountDeleted = false;
            jQuery('.loading-container').css('display', 'block');
            candidate.candidateExists({username: $scope.forgotPasswordEmail, clientName: clientName}).$promise.then(function (result) {
                var deferred = $q.defer();
                $scope.emailNotExists = true;
                $scope.forgotPasswordForm.$invalid = false;
                deferred.resolve(0);
                logger.log(result);
                jQuery('.loading-container').css('display', 'none');
                setFocus($scope.htmlElementDefinition.email.id,WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
            }, function (reason) {
                var deferred = $q.defer();
                $scope.emailNotExists = false;
                $scope.forgotPasswordForm.$invalid = true;
                jQuery('.loading-container').css('display', 'none');
                deferred.reject(reason);
            });

            candidate.getCandidateActivationByEmail({
                username  : $scope.forgotPasswordEmail,
                clientName: clientName
            }).$promise.then(
                function (result) {
                    var deActiveCheck = normalizeObjects(result);
                    if(deActiveCheck[0] === 't') {
                        $scope.accountDeleted = true;
                    }else{
                        if(!$scope.emailNotExists){
                            var params = {params: {emailId: $scope.forgotPasswordEmail}};

                            $http.get(ATS_URL + ATS_INSTANCE + '/rest/public/candidate/' + clientName + '/id/email/'+$scope.forgotPasswordEmail, params).then(
                                function (result) {
                                    // logger.log(result.data[0]);
                                    $scope.applyCandidate = normalizeObjects(result.data[0]);
                                    if($scope.applyCandidate != undefined){
                                        $scope.applyCandidate.locked = 't';
                                        return candidate.updateCandidate($scope.applyCandidate).$promise.then(function (result) {
                                            $scope.applyCandidate = normalizeObjects(result);
                                            return candidate.emailCandidate(emailCandidate).$promise.then(function (result) {
                                                var deferred = $q.defer();
                                                try {
                                                    logger.debug('Result !!!: ' + result);
                                                    $scope.passwordUpdate = true;
                                                    $scope.forgotPasswordForm.$invalid = true;
                                                    deferred.resolve(0);
                                                    jQuery('.loading-container').css('display', 'none');
                                                }
                                                catch (reason) {
                                                    logger.error(reason);
                                                    $scope.passwordUpdate = false;
                                                    $scope.forgotPasswordForm.$invalid = false;
                                                    deferred.reject(reason);
                                                    jQuery('.loading-container').css('display', 'none');
                                                    setFocus($scope.htmlElementDefinition.email.id,WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
                                                }
                                                return deferred.promise;
                                            });
                                        }, function (reason) {
                                            logger.error(reason);
                                            jQuery('.loading-container').css('display', 'none');
                                        });
                                    }else{
                                        jQuery('.loading-container').css('display', 'none');
                                    }
                                },
                                function (result) {
                                    logger.log(result);
                                    jQuery('.loading-container').css('display', 'none');
                                }
                            );
                        }
                    }
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });
        };

        $scope.cancel = function cancel() {
            loginModalResponse.activityType = -1;
            loginModalResponse.authenticationSuccess = false;
            $uibModalInstance.dismiss(loginModalResponse);
        };

        function initialize() {
            $scope.forgotPasswordEmail = '';
            $scope.passwordUpdate = false;
            $scope.accountDeleted = false;
            $scope.emailNotExists = false;
            // $rootScope.showAccount = true;
        }
    }

})();
