(function () {
    'use strict';

    var authApp = angular.module('st.candidate.auth');
    authApp.factory('authService', authService);
    authApp.config(authConfig);

    authService.$inject = ['$http', '$log', '$resource', '$rootScope', '$timeout', '$location', '$window', 'authBuffer', 'SessionStorage', 'LocalStorage', '$cookies', 'ModelDependencyFactory', '$q', 'ApplicationState','SignInModalService','CandidateWorkFlow','socialAuthService'];

    authConfig.$inject = ['$httpProvider'];

    /* Auth Services */

    function authService($http, $log, $resource, $rootScope, $timeout, $location, $window, authBuffer, SessionStorage, LocalStorage, $cookies, ModelDependencyFactory, $q, ApplicationState,SignInModalService,CandidateWorkFlow,socialAuthService) {
        var logger = $log.getInstance(MODULE_NAME_APPLY_AUTH);
        var loginStatus = {loginFailed: false, loginAttempted: false};
        var aservice = {
            _applicationState: ApplicationState
        };
        var isLoggedIn = false;
        var credentials = {
            username: '',
            password: ''
        };
        var roles = [];

        $rootScope.Sessioncounter = 60;

        aservice.oAuthToken = {
            token   : '',
            authType: '',
            username: ''
        };
        aservice.internalToken = angular.copy(aservice.oAuthToken);

        aservice.getCredentials = function () {
            return this.credentials;
        };

        aservice.setCredentials = function (credentials) {
            this.credentials = credentials;
        };

        aservice.clearCredentials = function () {
            this.credentials = {
                username: '',
                password: ''
            };
        };

        aservice.getRoles = function () {
            return this.roles;
        };

        aservice.setRoles = function (roles) {
            this.roles = roles;
        };

        aservice.clearRoles = function () {
            this.roles = [];
        };

        aservice.hasRole = function (role) {
            if (this.roles === undefined || this.roles === null || this.roles.length === 0 ||
                role === undefined || role === null) {
                return false;
            }

            var roleString = new String(role).toUpperCase();

            for (var key in this.roles) {
                try {
                    var rolesName = this.roles[key].name.toUpperCase();

                    if (roleString === rolesName) {
                        return true;
                    }

                } catch (reason) {
                    logger.warn("An issue has occurred getting role name!");
                    logger.error(reason);
                    return false;
                }
            }

            return false;
        };

        aservice.hasAllRoles = function (checkRoles) {
            if (checkRoles === undefined || checkRoles === null || checkRoles.length === 0) {
                return false;
            }

            for (var key in checkRoles) {
                if (!aservice.hasRole(checkRoles[key])) {
                    return false;
                }
            }

            return true;
        };

        aservice.hasAnyRole = function (checkRoles) {
            if (checkRoles === undefined || checkRoles === null || checkRoles.length === 0) {
                return false;
            }

            for (var key in checkRoles) {
                if (aservice.hasRole(checkRoles[key])) {
                    return true;
                }
            }

            return false;
        };

        aservice.login = function (credentials) {
            logger.debug('candidate authentication');
            logger.debug('url: ' + ATS_URL + ATS_INSTANCE);
            logger.debug('credentials ' + angular.toJson(credentials));
            return $http.post(ATS_URL + ATS_INSTANCE + '/rest/login', credentials, {
                headers: { 'Authorization' : buildAuthHeader(credentials) },
                withCredentials: true
            });
        };

        aservice.logout = function () {
//          This doesn't actually do anything on the server or client
//          return $http.get(ATS_URL + ATS_INSTANCE + '/rest/logout', { 
//          headers: { 'Authorization' : aservice.getAuthHeader() },
//          withCredentials: true
//          });
            logger.log("authService logout function");
            // function already exists for clear session, clear roles, clear credentials.
            //So using that function to avoid redundant data
            ApplicationState.localStorage.keep();
            aservice.loginCancelled('Logout function called');
            ApplicationState.localStorage.restore();
        };

        aservice.getAuthHeader = function () {
            return buildAuthHeader(this.credentials);
        };

        aservice.updateHeaders = function (config) {
            config.headers['Authorization'] = aservice.getAuthHeader();
            return config;
        };

        aservice.loginConfirmed = function (sessionVariables) {
            if(sessionVariables){
                aservice = angular.extend(aservice,sessionVariables);
            }
            authBuffer.retryAll(aservice.updateHeaders);
            LocalStorage.set('credentials', this.credentials, true);
            LocalStorage.set('roles', this.roles);
            $http.defaults.headers.common['Authorization'] = aservice.getAuthHeader();
            this.isLoggedIn = true;
            $timeout(function () {
                $rootScope.$broadcast('authenticated');
                $rootScope.$broadcast(BROAD_CAST_NAMESPACE.GET_CANDIDATE_ACTIVITY, true, {});
            }, 50);
        };

        aservice.loginCancelled = function (reason) {
            authBuffer.rejectAll(reason);
            aservice.clearCredentials();
            aservice.clearRoles();
            $http.defaults.headers.common['Authorization'] = null;
            // We'll clear all session data

            SessionStorage.clear();
            LocalStorage.clear();
            this.isLoggedIn = false;
            ModelDependencyFactory.socialProvider.reset();
            // Clear cookie key 'XCC'
            $cookies.remove('xcc');
            $timeout(function () {
                $rootScope.$broadcast('loggedOut');
            }, 50);
            XCLOUD.personalize.init();
        };

        aservice.getLocationPath = function () {
            logger.debug('aservice.getLocationPath');
            //return authBuffer.getPath();
            var sessionRedirect = SessionStorage.get('loginRedirect');
            if (sessionRedirect) {
                return sessionRedirect;
            }
            return authBuffer.getPath();
        };

        aservice.getUrlPathIfUserExists = function () {
            logger.debug('aservice.getUrlPathIfUserExists');
            var sessionRedirect = LocalStorage.get('loginRedirect');
            if (sessionRedirect) {
                return sessionRedirect;
            }
            return authBuffer.getPath();
        };

        aservice.setUrlPathIfUserExists = function (path, username, notification) {
            logger.debug('aservice.setUrlPathIfUserExists');
            var save = {path: path};
            if (username) {
                save.username = username;
            }
            if (notification) {
                save.notification = notification;
            }
            LocalStorage.set('loginRedirect', save);
        };

        aservice.setLocationPath = function (path, username, notification) {
            logger.debug('aservice.setLocationPath');
            var save = {path: path};
            if (username) {
                save.username = username;
            }
            if (notification) {
                save.notification = notification;
            }
            SessionStorage.set('loginRedirect', save);
        };

        aservice.clearUrlPathIfUserExists = function () {
            logger.debug('aservice.clearUrlPathIfUserExists');
            authBuffer.setPath(null);
            LocalStorage.remove('loginRedirect');
        };

        aservice.clearLocationPath = function () {
            logger.debug('aservice.clearLocationPath');
            authBuffer.setPath(null);
            SessionStorage.remove('loginRedirect');
        };

        function buildAuthHeader(credentials) {
            //return 'Basic ' + btoa(clientName + '/' + credentials.username + ':' + credentials.password);
            // return 'Basic ' + btoa('candidate/' + clientName + '/' + credentials.username + ':' + credentials.password);
            return 'Basic ' + btoa(encodeURIComponent('candidate/' + clientName + '/' + credentials.username + ':' + credentials.password));
        }

        aservice.setBasicCandidate = function (candidate) {
            var basic = _.pick(candidate, 'firstName', 'lastName', 'city', 'state', 'country', 'zip', 'phone1', 'candidateId', 'description', 'areaInterest', 'preferences');
            basic.isLocked = (ApplicationState.localStorage.candidate.isReturningUser.get() === false);
            LocalStorage.set('candidate', basic);

            XCLOUD.personalize.init(); // out-of-app personalizations

            return basic;
        };

        $rootScope.rememberMe = LocalStorage.get('remember_me', false);

        if ($rootScope.rememberMe !== undefined && $rootScope.rememberMe !== null) {
            if ($rootScope.rememberMe.$$state.value !== undefined && $rootScope.rememberMe.$$state.value !== null) {
                $rootScope.rememberMe = $rootScope.rememberMe.$$state.value;
            } else {
                $rootScope.rememberMe = false;
            }
        } else {
            $rootScope.rememberMe = false;
        }

        // Before we leave, let's see if we have LocalStorage credentials
        var storedCredentials = LocalStorage.get('credentials', true, $rootScope.rememberMe);

        if (storedCredentials !== undefined && storedCredentials !== null) {
            if(storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                // We do, so update the local ones, set the headers, and store them
                // again which will update the session timeout.

                logger.debug('AuthService : checking stored credenetials');
                var newStoredCredentials = storedCredentials.$$state.value;
                logger.debug(angular.toJson(newStoredCredentials));

                var storedRoles = LocalStorage.get('roles');
                if(storedRoles !== undefined && storedRoles !== null){
                    if(storedRoles.$$state.value !== undefined && storedRoles.$$state.value !== null){
                        aservice.setRoles(storedRoles);
                    }
                }
                aservice.setCredentials(newStoredCredentials);

                $http.defaults.headers.common['Authorization'] = buildAuthHeader(newStoredCredentials);

                /*LocalStorage.set('credentials', newStoredCredentials, true);
                LocalStorage.set('roles', storedRoles);*/

                if (newStoredCredentials.username === undefined) {
                    aservice.loginCancelled('expired credentials');
                }
                else {
                    aservice.isLoggedIn = true;
                }

                $timeout(function () {
                    $rootScope.$broadcast('authenticatedReload');
                }, 50);
            }
        }


        // Bearer Authentication Helpers
        aservice.setOAuthToken = function (token, authType, useremail) {
            token = token.replace(/"/g, "");
            this.oAuthToken.token = token.toString();
            this.oAuthToken.authType = authType;
            this.oAuthToken.username = useremail;
        };

        aservice.buildOAuthHeader = function () {
            return this.oAuthToken.authType + this.oAuthToken.token;
        };

        aservice.getOAuthHeader = function () {
            return this.buildOAuthHeader();
        };

        aservice.updateOAuthHeaders = function (config) {
            config.headers['Authorization'] = aservice.getOAuthHeader();
            return config;
        };

        function loginConfirmedForBearer() {
            authBuffer.retryAll(aservice.updateOAuthHeaders);
            $http.defaults.headers.common['Authorization'] = aservice.buildOAuthHeader();
            LocalStorage.set('oauthcredentials', aservice.oAuthToken, true);
            aservice.isLoggedIn = true;
            LocalStorage.set('oauthcredentials', aservice.oAuthToken, true);
            $timeout(function () {
                $rootScope.$broadcast('authenticated');
            }, 50);
        }

        aservice.socialLogin = function (username, token, successCallback, errorCallback) {
            logger.debug('Social user authentication');
            try {
                aservice.setOAuthToken(token, 'Bearer APPLY ', username);
                loginConfirmedForBearer();
                if (successCallback !== undefined) successCallback(aservice.oAuthToken.token);
            }
            catch (x) {
                if (errorCallback !== undefined) errorCallback(x);
                return false;
            }
        };

        aservice.getSocialInternalToken = function (authType, profile, skipExecution) {
            var deferred = $q.defer();
            logger.debug('internal bearer authentication');
            if (skipExecution) {
                deferred.resolve(0);
                return deferred.promise;
            }
            try {

                var req = {
                    method           : 'GET',
                    url              : ATS_URL + ATS_INSTANCE + '/rest/token/internal',
                    // TODO: no need to override default  response handler.
                    transformResponse: function (data, header) {
                        return data;
                    }
                };
                aservice.internalToken.token = undefined;
                $http(req).then(
                    function (response) {
                        aservice.internalToken.authType = authType;
                        aservice.internalToken.userName = profile.email;
                        aservice.internalToken.token = response.data;
                        deferred.resolve(aservice.internalToken);
                    },
                    function (reason) {
                        logger.error('internal bearer authentication failed.');
                        logger.error(reason);
                        deferred.resolve(reason);
                    }
                );
                return deferred.promise;
            }
            catch (reason) {
                logger.error('internal bearer authentication failed.');
                logger.error(reason);
                deferred.resolve(reason);
            }
        };

        aservice.extendCurrentBearerAuthentication = function (oAuthTokenModel) {
            if (oAuthTokenModel !== undefined && oAuthTokenModel !== null) {
                aservice.oAuthToken = oAuthTokenModel;
                loginConfirmedForBearer();
            }
        };

        var storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);

        if (storedCredentials !== undefined && storedCredentials !== null) {
            if(storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                storedCredentials = storedCredentials.$$state.value;
                aservice.extendCurrentBearerAuthentication(storedCredentials);
            }
        }

        aservice.isSocialProfileConnection = function () {
            try {
                var storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                if (storedCredentials !== undefined && storedCredentials !== null) {
                    if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (reason) {
                return false;
            }
        };


        aservice.openSignInModal = function(loginConfiguration){
            loginConfiguration = loginConfiguration || {};
            if(_XC_CONFIG.login_modal.disabled === false){
                SignInModalService.open(loginConfiguration,aservice.signInModalCallback,aservice.signInModalDismissCallback);
            }else{
                loginConfiguration.preventDefault();
                $location.url('/profile/login/');
            }
        };

        aservice.standardLogin = function(_loginConfiguration){
            var loginConfiguration = {};
            loginConfiguration.email = storedCredentials.username;
            loginConfiguration.showSocialWidget = true;
            loginConfiguration.showCreateProfileAction = true;
            loginConfiguration.reloadWindow = true;
            if(_loginConfiguration) {
                loginConfiguration = angular.extend(loginConfiguration, _loginConfiguration);
            }
            aservice.openSignInModal(loginConfiguration);
        };

        aservice.signInModalCallback = function(response){
            // TODO
            if(response.showProgressbar  === true){
                ApplicationState.uiMethods.showProgressBar(true);
            }
            if(response.loadSessionVariables === true ) {
                aservice.loadSessionVariables(response.reloadWindow);
            }
        };

        aservice.loadSessionVariables = function (reloadWindow) {
            $rootScope.$broadcast('authenticated');
            CandidateWorkFlow.getCurrentCandidate()
                .then(function (result) {
                    aservice.setBasicCandidate(result);
                    ApplicationState.uiMethods.showProgressBar(false);
                    if(reloadWindow === true){
                        $window.location.reload();
                    }
                })
                .catch(function (reason) {
                    ApplicationState.uiMethods.showProgressBar(false);
                    logger.error(reason);
                })
        };

        aservice.signInModalDismissCallback = function(response) {
            if (response.launchForgotPassword === true) {
                ApplicationState.uiMethods.showProgressBar(false);
                SignInModalService.openPassword({reloadOnCancel: response.reloadOnCancel}, aservice.signInModalCallback,aservice.signInModalDismissCallback);
            } else if (response.reloadOnCancel === true) {
                ApplicationState.uiMethods.showProgressBar(true);
                response.window.location.reload();
            }else if (response.showProgressbar === true) {
                ApplicationState.uiMethods.showProgressBar(true);
            }
        };

        aservice.resetCurrentSession = function (configuration) {
            aservice.loginCancelled();
            XCLOUD.log_out(true,configuration.event,null,configuration.skipRedirection);
            XCLOUD.personalize.init();
        };

        aservice.confirmSocialLogin = function(socialProfile,redirectAction,location,window,progressHandler,redirectionCallback) {
            socialAuthService.login(ModelDependencyFactory.socialProvider,aservice.socialLogin,socialProfile,redirectAction,location,window,progressHandler,redirectionCallback);
        };

        return aservice;
    }

    function authConfig($httpProvider) {
        var authBuffer; // Can't directly inject a service into a config.

        // We do this so our custom Basic Authenticator knows we're an AJAX call
        // and won't send back the WWW-Authenticate header and just a 401.
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        $httpProvider.interceptors.push(['$q', '$location', '$injector', function ($q, $location, $injector) {
            return {
                'response'     : function (response) {
                    return response;
                },
                'responseError': function (response) {
                    if (response.status === 401) {
                        // Set the failed login error on the login page
                        if (loginStatus.loginAttempted) loginStatus.loginFailed = true;

                        // Get our authBuffer
                        authBuffer = authBuffer || $injector.get('authBuffer');

                        // Let's store off the location the user tried that caused an auth failure.
                        // and redirect to the login page. (Unless we're already there).
                        if ($location.path() !== '/profile/login/') {
                            authBuffer.setPath($location.path());
                            $location.path('/profile/login/');
                            if (DEBUG) logger.log('Redirecting to login page.');
                        }

                        // Get our deferred calls and save them off to be executed later. 
                        // We may want to remove this in the future.
                        var deferred = $q.defer();

                        authBuffer.append(response.config, deferred);

                        return deferred.promise;
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    }

    authApp.run(['$rootScope', '$timeout', '$document', 'authService', '$location', 'SessionStorage', 'candidate', 'LocalStorage', function($rootScope, $timeout, $document, authService, $location, SessionStorage, candidate, LocalStorage) {
        // if (DEBUG) console.log('starting run');

        // Timeout timer value
        var TimeOutTimerValue = (maxSessionStorageTime- (60 * 1000));

        /*$rootScope.rememberMe = LocalStorage.get('remember_me', false);

        if($rootScope.rememberMe !== undefined && $rootScope.rememberMe !== null) {
            if ($rootScope.rememberMe.$$state.value !== undefined && $rootScope.rememberMe.$$state.value !== null && !$rootScope.rememberMe.$$state.value) {
                $rootScope.rememberMe = $rootScope.rememberMe.$$state.value;
            }
        }*/

        // Start a timeout
        var TimeOut_Thread = $timeout(function(){ LogoutFromNotifyClick() } , TimeOutTimerValue );
        var TimeOut_Thread_notification_active = false;
        $rootScope.sessionNotificationShow = false;

        var sessionContent = '<div ng-show="sessionNotificationShow" class="alert alert-info bold center">';
        sessionContent += '<p class="mt0">Hey! You will be logged off in <span ng-model="Sessioncounter">{{Sessioncounter}}</span> Seconds due to inactivity. <a id="sessionCheckNotify" class="bold" href="#" ng-click="sessionReset($event)">Click here to continue</a></p>';
        sessionContent +=  '</div>'
        jQuery('#sessionNotificationContainer').html(sessionContent);

        var bodyElement = angular.element($document);

        // angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'], uncomment to add 'movemove' and 'touchmove'
        angular.forEach(['keydown', 'keyup', 'click', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'scroll', 'focus'],
            function(EventName) {
                bodyElement.bind(EventName, function (e) { TimeOut_Resetter(e) });
            });

        var storedCredentials = LocalStorage.get('credentials', true, $rootScope.rememberMe);
        if(storedCredentials !== undefined && storedCredentials !== null){
            if(storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null){
                storedCredentials = storedCredentials.$$state.value;
                $timeout(function() {
                    LocalStorage.set('credentials', storedCredentials, true); // On page refresh update credential date value to latest
                });
                authService.isLoggedIn = true;
            }else{
                storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                if(storedCredentials !== undefined && storedCredentials !== null) {
                    if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                        storedCredentials = storedCredentials.$$state.value;
                        $timeout(function() {
                            LocalStorage.set('oauthcredentials', storedCredentials, true);
                        });
                        $rootScope.$broadcast('authenticatedReload');
                        authService.isLoggedIn = true;
                    }
                }
            }
        }else{
            storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
            if(storedCredentials !== undefined && storedCredentials !== null) {
                if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                    storedCredentials = storedCredentials.$$state.value;
                    $timeout(function() {
                        LocalStorage.set('oauthcredentials', storedCredentials, true);
                    });
                    $rootScope.$broadcast('authenticatedReload');
                    authService.isLoggedIn = true;
                }
            }
        }

        if(authService.isLoggedIn !== true){
            var _hashTag = $location.hash();
            if(_hashTag === "signin"){
                $location.hash('');
                authService.standardLogin();
            }
        }

        function LogoutFromNotifyClick(){
            // if (DEBUG) console.log("LogoutFromNotifyClick called");
            if (authService.isLoggedIn && !$rootScope.rememberMe) {
                $rootScope.sessionNotificationShow = true;
                TimeOut_Thread_notification_active = true;

                // timeout makes sure that is invoked after any other event has been triggered.
                // e.g. click events that need to run before the focus or
                // inputs elements that are in a disabled state but are enabled when those events are triggered.
                $timeout(function() {
                    jQuery('#sessionCheckNotify').focus();
                });

                $rootScope.Sessioncounter = 60;
                $rootScope.onTimeout = function () {
                    $rootScope.Sessioncounter--;
                    if ($rootScope.Sessioncounter === 0) {
                        $timeout.cancel($rootScope.myTimeOut);
                        TimeOut_Thread_notification_active = false;
                        LogoutByTimer();
                    }
                    $rootScope.myTimeOut = $timeout($rootScope.onTimeout, 1000);
                };
                $rootScope.myTimeOut = $timeout($rootScope.onTimeout, 1000);
            }else{
                $rootScope.sessionNotificationShow = false;
                TimeOut_Thread_notification_active = false;
                TimeOut_Resetter();
            }
        }

        $rootScope.sessionReset = function($event){
            $event.preventDefault();
            // if (DEBUG) console.log("Reset Session clicked.");
            $rootScope.sessionNotificationShow = false;
            TimeOut_Thread_notification_active = false;
            $rootScope.initialLoad = false;
            var storedCredentials = LocalStorage.get('credentials', true, $rootScope.rememberMe);

            if(storedCredentials!== undefined && storedCredentials !== null) {
                if(storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                    storedCredentials = storedCredentials.$$state.value;
                    $timeout(function() {
                        LocalStorage.set('credentials', storedCredentials, true);
                    });
                }else{
                    storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                    if(storedCredentials!== undefined && storedCredentials !== null) {
                        if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                            storedCredentials = storedCredentials.$$state.value;
                            $timeout(function() {
                                LocalStorage.set('oauthcredentials', storedCredentials, true);
                            });
                        }
                    }
                }
            }else {
                storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                if(storedCredentials!== undefined && storedCredentials !== null) {
                    if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                        storedCredentials = storedCredentials.$$state.value;
                        $timeout(function() {
                            LocalStorage.set('oauthcredentials', storedCredentials, true);
                        });
                    }
                }
            }
            $timeout.cancel($rootScope.myTimeOut);
            TimeOut_Resetter();
        };

        function LogoutByTimer(){
            // if (DEBUG) console.log("LogoutByTimer called");
            if (authService.isLoggedIn && !TimeOut_Thread_notification_active) {
                $rootScope.initialLoad = false;
                $rootScope.sessionNotificationShow = false;
                // if (DEBUG) console.log('Logout');
                var storedCredentials = LocalStorage.get('credentials', true, $rootScope.rememberMe);

                var storedApplyCandidate = authService._applicationState.session.candidate.get();
                if(storedCredentials !== undefined && storedCredentials !== null){
                    if(storedCredentials.$$state.value === undefined) {
                        storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                    }
                }
                // storedCredentials = storedCredentials.$$state.value;
                var notification = null;
                if($location.url().indexOf('/apply/') !== -1 && storedCredentials.username !== undefined && ($rootScope.isNewUser === true)){
                    var emailCandidate = {};
                    emailCandidate.name = EMAIL_ACTIVATION_LINK_NAME;
                    emailCandidate.type = EMAIL_ACTIVATION_LINK_TYPE;
                    emailCandidate.client = clientName;
                    emailCandidate.username = storedCredentials.username;
                    storedApplyCandidate.locked = 't';
                    candidate.updateCandidate(storedApplyCandidate).$promise.then(function (result) {
                        candidate.emailCandidate(emailCandidate).$promise.then(function (result) {
                            // logger.debug('Result !!!: ' + result);
                        });
                    });
                    notification = XCLOUD.i18n("Please check your Email and reset password, then you can login", TEMPLATE_CONSTANTS.FIELD_TYPES.VALIDATION);
                }
                if(_XC_CONFIG.login_modal.disabled === true) {
                    authService.loginCancelled();
                    // $scope.setCurrentUser(null);
                    XCLOUD.log_out(true);
                    XCLOUD.personalize.init();
                    authService.setUrlPathIfUserExists($location.url(), storedCredentials.username, notification);
                    $location.url('/profile/login/');
                }else {
                    authService.resetCurrentSession({skipRedirection: true});
                    //Standard Login
                    authService.standardLogin({notification : notification , reloadOnCancel : true});
                }
            }
        }

        function TimeOut_Resetter(e){
            // if (DEBUG) console.log(' ' + e);

            if(!TimeOut_Thread_notification_active && !$rootScope.rememberMe) {
                /// Stop the pending timeout
                $timeout.cancel(TimeOut_Thread);

                /// Reset the timeout
                TimeOut_Thread = $timeout(function () {
                    LogoutFromNotifyClick()
                }, TimeOutTimerValue);
            }else{
                /// Stop the pending timeout
                $timeout.cancel(TimeOut_Thread);
            }
        }

    }]);
})();
