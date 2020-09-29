/**
 * Created by TDadam on 4/8/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.candidate.activity')
        .controller('onBoardingModalFormController', onBoardingModalFormController);

    onBoardingModalFormController.$inject = ['$scope', '$log', '$q', '$controller','$timeout','$uibModalInstance','metaDataProvider','schemaModalService'];

    function onBoardingModalFormController($scope, $log, $q, $controller,$timeout,$uibModalInstance,metaDataProvider,schemaModalService) {
        angular.extend(this, $controller('candidateBaseHelper',  {$scope: $scope}));

        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW);
        var $ = jQuery;
        var _modalPopup = {
            reason : null
        };
        var E_PANEL_TYPE         = {
            CANCEL                : 0,
            CONTENT               : 1,
            LAST_FORM_CONFIRMATION: 2,
            SAVE_PROGRESS         : 3
        };

        var callBackHandler  = {
            lastForm :{
                submit : function () {
                    // do nothing
                },
                params : {}
            }
        };

        $scope.vm = {
            form      : {
                finalSubmit       : formFinalSubmit,
                fieldGroup        : {
                    count: -1
                },
                preventFinalSubmit: preventFinalSubmit
            },
            modalPopup: {
                cancel        : cancelModal,
                close         : closeModal,
                preventDismiss: preventDismiss,
                PANEL_ENUM    : E_PANEL_TYPE,
                visibility    : 1
            }
        };
        initialize();
        function initialize() {
            $scope.lastFormProxyIndicator = TEMPLATE_CONSTANTS.PREFIX.ON_BOARDING_FORM_COMPLETION;
            $scope.semaphoreCollection = {
                AlwaysShowProgressbar                : false,
                isLastFormSpecificationRuleApplicable: false,
                isLeadCapture                        : false,
                notificationMessage                  : $scope.notificationSemaphoreHandler,
                onBoarding                           : true,
                progressBar                          : $scope.globalProgressBarHandler
            };
            $scope.buildModelProcessor();
            $scope.constructAngularSchemaObserver(metaDataProvider.fieldGroups,lastFormSubmitConfirmation);
            $scope.vm.metaDataProvider = metaDataProvider;
            $scope.vm.form.fieldGroup.count  = metaDataProvider.fieldGroups.length;
            $scope.semaphoreCollection.progressBar(false);
        }

        function cancelModal () {
            $scope.vm.modalPopup.visibility = E_PANEL_TYPE.CANCEL;
        }

        function dismissConfirmation(event,reason) {
            switch(reason){
                // On event of escape button
                case schemaModalService.E_REASON.ESCAPE:
                    $scope.vm.modalPopup.visibility = E_PANEL_TYPE.CANCEL;
                    event.preventDefault();
                    break;
            }
        }

        function lastFormSubmitConfirmation(callBack,params) {
            // switch to confirmation dialog
            $scope.vm.modalPopup.visibility = E_PANEL_TYPE.LAST_FORM_CONFIRMATION;
            callBackHandler.lastForm.submit = callBack;
            callBackHandler.lastForm.params = params;
        }

        function preventFinalSubmit() {
            // prevent last form submit
            $scope.vm.modalPopup.visibility = E_PANEL_TYPE.CONTENT;
        }

        function formFinalSubmit() {
            // confirm submit
            $scope.vm.modalPopup.visibility = E_PANEL_TYPE.SAVE_PROGRESS;
            callBackHandler.lastForm.submit(callBackHandler.lastForm.params,closeModal);
        }

        function closeModal(result) {
            if(result !== undefined){
                $uibModalInstance.close({ $value : result});
            }else{
                $uibModalInstance.close();
            }
        }

        function  preventDismiss() {
            $scope.vm.modalPopup.visibility = E_PANEL_TYPE.CONTENT;
        }

        $scope.$on('modal.closing', function(event, reason, closed) {
            dismissConfirmation(event,reason);
        });

        $scope.globalProgressBarHandler = function (enabled) {
            var _loaderElement = '#onBoarding-Modal-Loader';
            if (enabled) {
                jQuery(_loaderElement).css('display', 'block');
            } else {
                if( $scope.semaphoreCollection === undefined || $scope.semaphoreCollection.AlwaysShowProgressbar === undefined || $scope.semaphoreCollection.AlwaysShowProgressbar !== true) {
                    jQuery(_loaderElement).css('display', 'none');
                }
            }
        };

    }


})(); // End  controller=======
