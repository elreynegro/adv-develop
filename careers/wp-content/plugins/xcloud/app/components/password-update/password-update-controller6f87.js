/**
 * Created by TDadam on 4/27/2018.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('passwordUpdateModalController', passwordUpdateModalController);

    passwordUpdateModalController.$inject = ['$scope','$rootScope', '$log','$location','passwordUpdateService','metaDataProvider','schemaModalService'];

    function passwordUpdateModalController($scope,$rootScope,$log,$location,passwordUpdateService,metaDataProvider,schemaModalService) {
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW);
        var E_PANEL = {
            ERROR           : 2,
            INVALID_TOKEN   : 3,
            PASSWORD        : 0,
            PASSWORD_ENFORCE: 4,
            SUCCESS         : 1
        };

        $scope.vm = passwordUpdateService.viewModel.skeleton.get(metaDataProvider.workFlow);
        if(metaDataProvider.scope) {
            angular.extend($scope, metaDataProvider.scope);
        }

        $scope.loginToAccount = function ($event) {
            var _config = $event;
            if (_XC_CONFIG.login_modal.disabled === false) {
                closeModal();
                _config = {email: (metaDataProvider.candidate && metaDataProvider.candidate.uname) , reloadWindow : true};
            }

            switch (metaDataProvider.workFlow) {
                case E_WORK_FLOW.CREATE_PASSWORD:
                    _config.redirectURL = "/profile/";
                    _config.reloadWindow = false;
                    _config.showSocialWidget = true;
                    break;
            }
            passwordUpdateService.redirectToLoginWindow(_config);
        };

        initialize();
        function initialize() {

            $scope.E_WORK_FLOW = E_WORK_FLOW;
            $scope.E_PANEL = E_PANEL;
            $scope.vm.panel = E_PANEL.PASSWORD;
            $scope.vm.modalPopup = {
                close: closeModal
            };

            $scope.updatePassword = updatePassword;
            metaDataProvider.progressVisibility(false);
            workFlowValidation();

            $scope.dismissModal = dismissModal;
            $scope.displayPasswordContent = displayPasswordContent;
            $scope.preventDoubleClick = preventDoubleClick;
        }

        function dismissModal($event) {
            $event.preventDefault();
            closeModal();
        }

        function workFlowValidation() {
            switch (metaDataProvider.workFlow){
                case E_WORK_FLOW.CREATE_PASSWORD:
                    $scope.vm.isValidToken = false;
                    if(metaDataProvider.token) {
                        passwordUpdateService.validateToken(metaDataProvider.token)
                            .then(function (response) {
                                onTokenValidation(response.validToken === true);
                            })
                            .catch(function (reason) {
                                onTokenValidation(false);
                                logger.error(reason);
                            });
                    }
                    break;
                case E_WORK_FLOW.MODIFY_PASSWORD:
                    break;
            }
        }

        function onBeforePanelSwitch(panelToSwitch) {
            $scope.vm.panel = panelToSwitch;
        }

        function onTokenValidation(state) {
            $scope.vm.isValidToken = state;
            if(state === false) {
                onBeforePanelSwitch(E_PANEL.INVALID_TOKEN);
            }
        }

        function onUpdateSuccess() {
            onBeforePanelSwitch(E_PANEL.SUCCESS);
            switch (metaDataProvider.workFlow) {
                case E_WORK_FLOW.CREATE_PASSWORD:
                    metaDataProvider.progressVisibility(false);
                    break;
                case E_WORK_FLOW.MODIFY_PASSWORD:
                    passwordUpdateService.onPasswordUpdateSuccess();
                    metaDataProvider.progressVisibility(false);
                    break;
            }
        }

        function updatePassword(model) {
            try {
                if (model && model.$valid) {
                    metaDataProvider.progressVisibility(true);
                    passwordUpdateService.updatePassword(metaDataProvider.workFlow, $scope.vm.credentials.password, metaDataProvider.token, metaDataProvider.candidate)
                        .then(function (result) {
                            onUpdateSuccess();
                        })
                        .catch(function (reason) {
                            onBeforePanelSwitch(E_PANEL.ERROR);
                            metaDataProvider.progressVisibility(false);
                        })
                }
            } catch (reason) {
                metaDataProvider.progressVisibility(false);
            }
        }

        $scope.$on('modal.closing', function(event, reason, closed) {
            dismissConfirmation(event,reason);
        });

        function dismissConfirmation(event,reason) {
            if(isPasswordSetIsMandatory() === true) {
                switch (reason) {
                    // On event of escape button
                    case schemaModalService.E_REASON.ESCAPE:
                        switchPanel(E_PANEL.PASSWORD_ENFORCE);
                        event.preventDefault();
                        break;
                }
            }
        }

        function displayPasswordContent($event) {
            $event.preventDefault();
            switchPanel(E_PANEL.PASSWORD);
        }

        function switchPanel(type) {
            $scope.vm.panel = type;
        }

        function isPasswordSetIsMandatory() {
            return (metaDataProvider.workFlow === E_WORK_FLOW.CREATE_PASSWORD && $scope.vm.panel !== E_PANEL.SUCCESS);
        }

        function closeModal() {
            if(isPasswordSetIsMandatory() === true) {
                switchPanel(E_PANEL.PASSWORD_ENFORCE);
            }else {
                schemaModalService.close();
            }
        }
        
        function preventDoubleClick() {
            return false;
        }
    }

})(); // End  controller=======