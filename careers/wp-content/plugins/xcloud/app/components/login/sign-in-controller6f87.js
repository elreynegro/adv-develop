(function () {
    'use strict';

    angular
        .module('st.candidate.auth')
        .controller('signInController', signInController);

    signInController.$inject = ['$rootScope', '$scope', '$log','$q', '$location', '$uibModalInstance', '$window', 'authService', 'ModelDependencyFactory','LocalStorage','loginConfigurations','ApplicationState','CandidateWorkFlow'];

    function signInController($rootScope, $scope,$log,$q,$location,$uibModalInstance,  $window,authService,ModelDependencyFactory,LocalStorage,loginConfigurations,ApplicationState,CandidateWorkFlow) {
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_LOGIN);
        if(loginConfigurations.progressVisibility)
        {
            loginConfigurations.progressVisibility(true);
        }
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

        function initialize() {

            $scope.applyCandidate = {};
            $scope.applyCandidate.uname = loginConfigurations.email;
            $scope.vm.externalService = {};

            $scope.vm.externalService.socialProvider = ModelDependencyFactory.socialProvider;

            $scope.vm.flags = {};

            $scope.vm.validation = {
                showSummary      : false,
                validationMessage: ""
            };

            $scope.vm.credentials = {
                username: loginConfigurations.email
            };

            $scope.vm.UI_Decoration = {
                closeButtonLabel       : TEMPLATE_CONSTANTS.TITLE.ACTIONS.CLOSE.str,
                CREATE_ONE             : TEMPLATE_CONSTANTS.TITLE.ACTIONS.CREATE_ONE.str,
                DO_NOT_HAVE_PROFILE    : TEMPLATE_CONSTANTS.TITLE.LABELS.DO_NOT_HAVE_PROFILE.str,
                header                 : loginConfigurations.header,
                subHeader              : loginConfigurations.subHeader,
                separator              : loginConfigurations.separator,
                signInCaption          : loginConfigurations.signInCaption,
                showSocialWidget       : loginConfigurations.showSocialWidget,
                showCreateProfileAction: loginConfigurations.showCreateProfileAction
            };
            $scope.vm.notification = loginConfigurations.notification;
            if ($scope.vm.UI_Decoration.showSocialWidget === true) {
                // Consider XCLOUD ADMIN Setting
                $scope.vm.UI_Decoration.showSocialWidget = $scope.vm.externalService.socialProvider.showWizard;
            }

            if (loginConfigurations.socialUserRedirectAction === undefined) {
                loginConfigurations.socialUserRedirectAction = 'dashboard';
            }
            if (loginConfigurations.socialUserRedirectURL === undefined) {
                loginConfigurations.socialUserRedirectURL = '/profile/';
            }
        }

        $scope.onFocusState = function () {
            $scope.inputGotFocused = true;
        };

        $scope.onFocusLostState = function(){
            $scope.inputGotFocused = false;
        };

        $scope.invalidateEmail = function (event, formName, inputName){
            event.preventDefault();
            if($scope.vm.credentials !== undefined && $scope.vm.credentials.username !== undefined && $scope.vm.credentials.username !== null && $scope.vm.credentials.username !== '') {
                $scope.vm.credentials.username = $scope.vm.credentials.username.replace(/\s+$/, '');
                var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!emailRegex.test($scope.vm.credentials.username)) {
                    $scope[formName][inputName].$setValidity('email', false);
                    $scope[formName][inputName].$touched = true;
                    $scope[formName][inputName].$invalid = true;
                    $scope.vm.invalidEmail = true;
                }else{
                    $scope[formName][inputName].$setValidity('email', true);
                    $scope[formName][inputName].$invalid = false;
                    $scope.vm.invalidEmail = false;
                }
            }else{
                $scope[formName][inputName].$setValidity('email', true);
                $scope.vm.invalidEmail = false;
            }
        };

        $scope.login = function login() {
            loginConfigurations.progressVisibility(true);
            authService.login($scope.vm.credentials)
                .then(loginSuccess)
                .catch(loginError);
        };

        $scope.loginModalCancel = function (event,isForgotPasswordCaller) {
            event.preventDefault();
            loginModalResponse.activityType = -1;
            loginModalResponse.authenticationSuccess = false;
            loginModalResponse.launchForgotPassword = isForgotPasswordCaller;
            loginModalResponse.reloadOnCancel = loginConfigurations.reloadOnCancel;
            loginModalResponse.window = $window;
            $uibModalInstance.dismiss(loginModalResponse);
        };

        function loginSuccess(response) {
            logger.debug('Login Success with Status: ' + response.status);
            $scope.vm.validation.showSummary  = false;

            authService.setCredentials($scope.vm.credentials);
            authService.setRoles(response.data);
            authService.loginConfirmed();

            LocalStorage.set('remember_me', $scope.vm.flags.rememberMe);
            $rootScope.rememberMe = $scope.vm.flags.rememberMe;
            $rootScope.showAccount = false;

            loginModalResponse.activityType = 0;
            loginModalResponse.authenticationSuccess = true;
            loginModalResponse.rememberMe = angular.copy($scope.vm.flags.rememberMe);
            loginModalResponse.loadSessionVariables = false;
            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
            syncFavoriteLocations();
            redirectionFinalize(loginModalResponse);
        }

        function redirectionFinalize(loginModalResponse) {
            loginModalResponse.loadSessionVariables = true;
            if (loginConfigurations.redirectURL !== undefined && loginConfigurations.redirectURL !== null) {
                loginModalResponse.showProgressbar = true;
                $location.url(loginConfigurations.redirectURL);
            } else if(loginConfigurations.isLeadCapture) {
                loginModalResponse.showProgressbar = true;
                var loginRedirect = ModelDependencyFactory.schemaInterpolation.languageSupplier("/profile/");
                window.location.replace(loginRedirect);
                loginModalResponse.showProgressbar = false;
            }
            else if(loginConfigurations.reloadWindow !== undefined && loginConfigurations.reloadWindow === true){
                loginModalResponse.reloadWindow = true;
                loginModalResponse.showProgressbar = true;
            } else {
                loginConfigurations.progressVisibility(false);
                $rootScope.showAccount = true;
                loginModalResponse.showProgressbar = true;
            }
            $uibModalInstance.close(loginModalResponse);
        }

        function loginError(response) {
            loginConfigurations.progressVisibility(false);
            loginModalResponse.reason = 'Login Failed with Status: ' + response.status;
            loginModalResponse.authenticationSuccess = false;
            $scope.vm.validation.showSummary  = true;
            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: false});
            authService.loginCancelled(response.status);
        }

        function confirmAuthentication(socialProfile) {
            $scope.vm.externalService.socialProvider.setRegistrationCaller($scope.vm.externalService.socialProvider.registrationSource.signInSocialProfile);
            var redirectAction = {
                action: loginConfigurations.socialUserRedirectAction,
                path  : loginConfigurations.socialUserRedirectURL
            };
            authService.confirmSocialLogin(socialProfile, redirectAction, $location, $window, loginConfigurations.progressVisibility,socialLoginRedirectCallback);
        }

        function socialLoginRedirectCallback() {
            loginModalResponse.activityType = 1;
            loginModalResponse.authenticationSuccess = true;
            redirectionFinalize(loginModalResponse);
        }

        function SocialLoginEvent(eventResponse){
            try {
                $scope.showLoginNotificationMsg = false;
                loginConfigurations.progressVisibility(true);
                $scope.vm.externalService.socialProvider.bindProfile(newSocialProfileHandler,confirmAuthentication,eventResponse);
            } catch(reason) {
                console.log(reason);
                loginConfigurations.progressVisibility(false);
            }
        }

        function newSocialProfileHandler() {
            $scope.vm.externalService.socialProvider.setRegistrationCaller($scope.vm.externalService.socialProvider.registrationSource.signInSocialProfile);
            $scope.vm.externalService.socialProvider.utility.sessionToStorage({ newProfile : true});
            $location.path('/profile/join/');
            $window.location.reload();
        }

        $scope.onFormKeyPress = function ($event) {
            if($event && $event.keyCode === 13){
                // Check Form Valid
                if($scope.xcloud_Signin && $scope.xcloud_Signin.$valid){
                    $scope.login();
                }
            }
        };

        setTimeout(function() {
            try {
                var _flow = CandidateWorkFlow.current.getFromPath($location.path());
                _flow = CandidateWorkFlow.current.getFromRouteParams(_flow);
                switch (_flow) {
                    case E_WORK_FLOW.NONE: // Display only is not APPLY / JOIN
                        if ($scope.vm.UI_Decoration.showSocialWidget === true) {
                            $scope.vm.externalService.socialProvider.jsLoadAwaitCount = 0;
                            $scope.vm.externalService.socialProvider.showUIWizard(SocialLoginEvent);
                        }
                        break;
                    default:
                        break;
                }
                loginConfigurations.progressVisibility(false);
            } catch (reason) {
                loginConfigurations.progressVisibility(false);
                logger.warn("An issue has occurred while Gigya Provider Loading!");
                logger.error(reason);
            }
        }, 5);

        $scope.redirectToCreateProfile =  function (event) {
            if(1 === 2){ // TODO: for modal LCP
                event.preventDefault();

            }
        }
    }

})();
