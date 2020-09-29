/**
 * Created by TDadam on 5/21/2018.
 */
(function () {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('GDPRMigrationController', GDPRMigrationController);

    GDPRMigrationController.$inject = ['$scope', '$log', 'metaDataProvider', 'schemaModalService', 'migrationService'];

    function GDPRMigrationController($scope, $log, metaDataProvider, schemaModalService, migrationService) {
        $scope.vm = {
            E_PANEL                   : {
                CLOSE_PREVENT: 1,
                MIGRATION    : 0,
                SUCCESS      : 2
            },
            decorator                 : {
                header                 : TEMPLATE_CONSTANTS.TITLE.HEADER.GDPR_MIGRATION.str,
                subHeader              : TEMPLATE_CONSTANTS.TITLE.HEADER.REVIEW_AND_COMPLETE.str,
                termsAndConditions     : TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_POLICY_TITLE,
                marketing_Subscriptions: TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE
            },
            displayMigrationPanel     : displayMigrationPanel,
            displayClosePreventMessage: displayClosePreventMessage,
            preventDoubleClick        : preventDoubleClick,
            updateGDPRMigration       : updateGDPRMigration,
            modalPopup                : {
                close            : modalDismiss,
                enableCloseButton: _XC_CONFIG.migration.GDPR.enableCloseButtonInModal,
                panel            : 0 //MIGRATION
            }
        };

        initialize();

        function initialize() {
            $scope.subscribe = true;
        }

        if (metaDataProvider.vm) {
            $scope.vm = angular.extend($scope.vm, metaDataProvider.vm);
        }

        function modalDismiss(event,close) {
            if(event){
                event.preventDefault();
            }
            schemaModalService.close();
        }

        function preventDoubleClick() {
            return false;
        }

        function switchPanel(type) {
            $scope.vm.modalPopup.panel = type;
        }

        function displayMigrationPanel($event) {
            if ($event) $event.preventDefault();
            switchPanel($scope.vm.E_PANEL.MIGRATION);
        }

        function displayClosePreventMessage($event) {
            if ($event) $event.preventDefault();
            switchPanel($scope.vm.E_PANEL.CLOSE);
        }

        $scope.$on('modal.closing', function (event, reason, closed) {
            dismissConfirmation(event, reason);
        });

        function dismissConfirmation(event, reason) {
            switch (reason) {
                // On event of escape button
                case schemaModalService.E_REASON.ESCAPE:
                    if(_XC_CONFIG.migration.GDPR.enableCloseButtonInModal !== true){
                        showNotification(TEMPLATE_CONSTANTS.TITLE.BANNER.GDPR_NON_COMPLIANCE.str);
                        event.preventDefault();
                    }
                    break;
            }
        }

        function updateGDPRMigration(event) {
            metaDataProvider.progressVisibility(true);
            try {
                event.preventDefault();
                migrationService.GDPR.updateTermsAndMarketing({
                    termsAndPolicy: $scope.termsAndPolicy,
                    subscribe     : $scope.subscribe
                }).then(function (result) {
                    metaDataProvider.progressVisibility(false);
                    switchPanel($scope.vm.E_PANEL.SUCCESS);
                }, function (reason) {
                    metaDataProvider.progressVisibility(false);
                    showNotification(TEMPLATE_CONSTANTS.VALIDATION.GDPR_UPDATE_FAILURE.str);
                })
            } catch (reason) {
                metaDataProvider.progressVisibility(false);
            }
        }

        function showNotification(message) {
            $scope.isShowNotificaiton = true;
            $scope.notificationMessage = message;
        }

    }

})(); // End  controller=======