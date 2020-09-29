(function () {
    'use strict';

    angular
        .module('st.controllers.apply.site')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$log', '$location', '$http', '$rootScope','$controller', '$timeout','authService', 'candidate', '$q','ModelDependencyFactory','LocalStorage','ApplicationState', '$window'];

    function loginController($scope, $log, $location, $http, $rootScope, $controller,$timeout,authService,candidate, $q,ModelDependencyFactory,LocalStorage,ApplicationState, $window) {

        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_LOGIN);
        angular.extend(this, $controller('baseController',  {$scope: $scope}));

        $scope.fieldHelpers = {
            socialNetworkNotification:'socialNetworkNotification'
        };

        initialize();

        $scope.login = function () {
            $scope.showLoginErrorMsg = false;

            function loginSuccess(response) {

                logger.debug('Login Success with Status: ' + response.status);

                $scope.loginStatus.loginFailed = false;
                $scope.loginStatus.loginAttempted = true;
                $scope.showLoginErrorMsg = false;
                $scope.showLoginNotificationMsg = false;

                authService.setCredentials($scope.credentials);
                authService.setRoles(response.data);
                authService.loginConfirmed();

                LocalStorage.set('remember_me', $scope.rememberMe);
                $rootScope.rememberMe = $scope.rememberMe;
                // $rootScope.sessionTimeOutInitializer();

                // UserService.loadCurrentUser($scope);
                $rootScope.showAccount = true;
                ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
                var path = authService.getUrlPathIfUserExists();
                path = path.$$state.value;
                var lcpPath = $location.absUrl();
                if (lcpPath.indexOf('/profile/login/?LCPCaller=CFM') !== -1) {
                    $window.location.href = '/profile/';                         //This will not allow the returning user to come to profile/join
                }
                else {
                    if (path !== undefined && path !== null) {
                        var _hasPath = false;
                        if (path.hasOwnProperty('path')) {
                            _hasPath = true;
                            path = path.path; // don't ask
                        }
                        logger.debug('path: ' + path);
                        authService.clearUrlPathIfUserExists();
                        if(_hasPath && path.indexOf("reset-password") === -1){
                            if(path.indexOf("/campaign/")!==-1){
                                $window.location.href = path;
                            }
                            $location.url(path);
                        }
                        //$window.location.href = path;
                        jQuery('.loading-container').css('display', 'none');
                    } else {
                        // What about redirects that doesn't have to do with existing users?
                        var regularPath = authService.getLocationPath();
                        if(regularPath && regularPath.path && regularPath.path.indexOf("reset-password") === -1){
                            regularPath = regularPath.path;
                            authService.clearLocationPath();
                        }
                        else{
                            regularPath = '/profile/';
                        }
                        logger.debug('path: defaulting to account');
                        jQuery('.loading-container').css('display', 'none');
                        //$window.location.href = '/profile/';
                        $location.path(regularPath);
                    }
                }
              syncFavoriteLocations();
            }

            function loginError(response) {
                logger.debug('Login Failed with Status: ' + response.status);

                $scope.loginStatus.loginFailed = true;
                $scope.loginStatus.loginAttempted = true;
                $scope.showLoginErrorMsg = true;

                // loginCancelled() removes all session data, we still redirects
                var initial_redirect = authService.getLocationPath();

                authService.loginCancelled(response.status);
                handleError('Data: ' + response.data + ' Status: ' + response.status);

                if(initial_redirect && initial_redirect.path){
                    authService.setLocationPath(initial_redirect.path);
                }
                jQuery('.loading-container').css('display', 'none');
                setFocus('uname',WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
            }

            logger.debug('Login Attempt with crendentials ' + angular.toJson($scope.credentials));

            authService.isLoggedIn = false;
            $scope.loginStatus.loginAttempted = true;
            
            jQuery('.loading-container').css('display', 'block');
            authService.login($scope.credentials)
                .then(loginSuccess)
                .catch(loginError);

        };

        $scope.logout = function () {

            function logoutSuccess(response) {
                $scope.loginStatus.loginFailed = false;
                $scope.loginStatus.loginAttempted = false;
                authService.loginCancelled();
                $scope.setCurrentUser(null);
                XCLOUD.log_out(true);
                $location.path('/');
            }

            function logoutError(response) {
                authService.loginCancelled(response.status);
                handleError('Data: ' + response.data + ' Status: ' + response.status);
            }

            authService.logout()
                .then(logoutSuccess)
                .catch(logoutError);

        };

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
                });
        };

        function initialize() {
            jQuery('.loading-container').css('display', 'block');
            $scope.loginStatus = {};
            $scope.forgotPasswordEmail = '';
            $scope.showLoginErrorMsg = false;
            $scope.showLoginNotificationMsg = false;
            $scope.passwordUpdate = false;
            $scope.accountDeleted = false;
            $scope.emailNotExists = false;
            $rootScope.showAccount = true;
            $scope.socialProvider = ModelDependencyFactory.socialProvider;
            $scope.socialProvider.reset();
            $scope.htmlElementDefinition = {
                email: {
                    id  : 'emailInput',
                    name: 'emailInput'
                }
            };
            $scope.rememberMe = false;
            $scope.forgetPasswordLink = '/profile/forgot-password/';

            if (_XC_CONFIG.lang && _XC_CONFIG.lang !== 'en') {
                $scope.forgetPasswordLink = '/' + _XC_CONFIG.lang + $scope.forgetPasswordLink;
            }

            logger.debug('Login Controller Called.');

            customFieldRedirectDetermination();

            var redirect = authService.getUrlPathIfUserExists();
            redirect = redirect.$$state.value;
            if(authService.isLoggedIn){
                if(redirect !== undefined && redirect !== null){
                    if(redirect.path !== undefined && redirect.path !== null) {
                        $location.path(redirect.path);
                    }else{
                        $location.path('/profile/');
                    }
                }else{
                    $location.path('/profile/');
                }
            }
            if(redirect && redirect.hasOwnProperty('username')){
                $scope.credentials = {};
                $scope.credentials.username = redirect.username;
            }

            if(redirect && redirect.hasOwnProperty('notification')){
                if(redirect.notification != null && redirect.notification != '') {
                    $scope.showLoginNotificationMsg = true;
                    $scope.notificationMsg = redirect.notification;
                }
            }
            jQuery('.loading-container').css('display', 'none');
        }

        function SocialLoginEvent(eventResponse){
            try {
                $scope.showLoginNotificationMsg = false;
                jQuery('.loading-container').css('display', 'block');
                $scope.socialProvider.bindProfile(newSocialProfileHandler,AuthenticationTypeResolver,eventResponse);
            } catch(reason) {
                console.log(reason);
                jQuery('.loading-container').css('display', 'none');
            }
        }

        function newSocialProfileHandler() {
            $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.signInSocialProfile);
            $location.path('/profile/join');
        }

        function AuthenticationTypeResolver(socialProfile) {
            $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.signInSocialProfile);
            var redirectAction = {
                action: 'dashboard',
                path: '/profile/'
            };
            $scope.socialProfileAuthenticationEnabler(socialProfile,redirectAction);
        }

        function customFieldRedirectDetermination(){
            if ((CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.enabled === true && $location.search().applyCaller) ||
                (CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.enabled === true && $location.search().LCPCaller) || $location.search().micrositeCaller ) {
                var sessionRedirect = LocalStorage.get('schemaLoginRedirect');
                if($location.search().micrositeCaller ){
                    if(sessionRedirect.$$state.value !== undefined){
                        authService.setUrlPathIfUserExists($location.search().micrositeCaller, sessionRedirect.$$state.value.username);
                    }else {
                        authService.setUrlPathIfUserExists($location.search().micrositeCaller);
                    }
                }else if(sessionRedirect && sessionRedirect.$$state.value){
                    authService.setUrlPathIfUserExists(sessionRedirect.$$state.value.path, sessionRedirect.$$state.value.username);
                }
                LocalStorage.remove('schemaLoginRedirect');
            }
        }
        setTimeout(function() {
            try {
                $scope.socialProvider.jsLoadAwaitCount = 0;
                $scope.socialProvider.showUIWizard(SocialLoginEvent,$scope.socialProvider.TitleEnum.connectTitle);
                //setFocus('emailInput',WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
                /*setFocus('newPassword',WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
                if($scope.socialProvider.showWizard === true && $location.path() === '/profile/login/') {
                    $timeout(function () {
                        try {
                            // $scope.setSocialIconTabIndex();
                            setFocus($scope.socialProvider.KeysConfiguration.HTMLDefinition.mainContainerId,false);
                        } catch (reason) {
                        }
                    }, 500)
                }else{
                    setFocus('uname',WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
                }*/
            } catch (reason) {
                logger.warn("An issue has occurred while Gigya Provider Loading!");
                logger.error(reason);
            }
        }, 50);

        $scope.$on($scope.broadcastNamespace.candidateModel.socialNetwork.onAccountMerge,function (event, args) {
            $timeout(function () {
                // $scope.setSocialIconTabIndex();
                setFocus($scope.socialProvider.KeysConfiguration.HTMLDefinition.mainContainerId,false);
            },250);
        });

    }

})();
