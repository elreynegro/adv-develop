(function () {
    'use strict';

    angular
        .module('st.candidate.auth')
        .controller('signInMenuController', signInMenuController);

    signInMenuController.$inject = ['$rootScope', '$scope', '$log', '$location', 'authService', 'ApplicationState', 'HTMLHelper', 'CandidateWorkFlow', 'NotificationEngine', 'schemaModalService', 'leadcaptureModalService'];

    function signInMenuController($rootScope, $scope, $log, $location, authService, ApplicationState, HTMLHelper, CandidateWorkFlow, NotificationEngine, schemaModalService, leadcaptureModalService) {
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_LOGIN);

        initialize();

        function initialize() {
            //HTMLHelper.SCRIPT_FOR("#scriptInjector", dynamicScripts());
            if(!$rootScope.TEMPLATE_CONSTANTS){
                $rootScope.TEMPLATE_CONSTANTS = TEMPLATE_CONSTANTS;
            }
        }

        /**
         * Now embedded in class-xcloud.php
         * Leaving this as a comment just in case.
         function dynamicScripts() {
            var scripts = [];
            var source = window.location.protocol + "//cdn";
            if (window.location.protocol === 'https:') {
                source += 's';
            }
            source += '.gigya.com/js/gigya.js?apiKey=' + GIGYA_APIKEY;
            scripts.push( { src : source , type : "application/javascript" });
            return scripts;
        }
         */

        $scope.openSignInModal = function ($event, loginConfiguration) {
            try {
                if ($event) {
                    $event.stopPropagation();
                    $event.preventDefault();
                }
                if (authService.isLoggedIn === true && ApplicationState.localStorage.candidate.isReturningUser.get() === false) {
                    NotificationEngine.modal.bootstrap.show(E_BOOTSTRAP_ALERT.CLASS.DANGER, TEMPLATE_CONSTANTS.VALIDATION.PREVENT_LOGIN.str);
                    return;
                }
                var _path = $location.path();
                loginConfiguration = loginConfiguration || {};
                loginConfiguration.showSocialWidget = loginConfiguration.showSocialWidget || true;
                loginConfiguration.showCreateProfileAction = loginConfiguration.showCreateProfileAction || true;
                if (typeof(_XCC_CA_CONFIG) !== 'undefined') {
                    loginConfiguration.reloadWindow = true;
                } else {
                    loginConfiguration.reloadWindow = (_path.indexOf('/apply') >= 0 || _path.indexOf('/join') >= 0); //TODO need to use params
                }
                authService.openSignInModal(loginConfiguration);
            } catch (reason) {

            }
        };

        $scope.isShowLoginMenu = function () {
            var _isReturningUser = ApplicationState.localStorage.candidate.isReturningUser.get();
            return ((_isReturningUser === true || authService.isLoggedIn !== true));
        };
        $scope.openLeadCapture = function ($event, lcpConfiguration) {
            try {
                leadcaptureModalService.setIsModalOpen(true);
                if ($event) {
                    $event.stopPropagation();
                    $event.preventDefault();
                }
                lcpConfiguration = lcpConfiguration || {};
                var _modalPopup = {
                    configuration: {
                        style: {
                            windowClass: "schema-modal-popup"
                        }
                    }
                };
                var _template = '/wp-content/plugins/xcloud/app/components/leadcapture/leadcapture-modal.html';
                var _controller = 'leadCaptureModalController';
                schemaModalService.open(_modalPopup.configuration, _template, _controller);

            } catch (reason) {

            }
        };

        function lcpModalCallback() {
            //TODO
        }

        function lcpModalDismissCallback() {
            //TODO
        }


    }

})();
