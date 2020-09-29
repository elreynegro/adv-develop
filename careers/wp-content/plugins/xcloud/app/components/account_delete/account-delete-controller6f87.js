/**
 * Created by Shanjock on 5/07/2018.
 */

(function(){
    'use strict';

    angular.module('st.candidate.activity')
        .controller('accountDeleteController',accountDeleteController);
    accountDeleteController.$inject = ['$scope', '$log', 'authService', 'schemaModalService', 'CandidateWorkFlow'];

    function accountDeleteController($scope, $log, authService, schemaModalService, CandidateWorkFlow) {
        $scope.AD_VM = {};

        initialize();

        function initialize() {
            $scope.AD_VM.isShowComponent = true;

            $scope.AD_VM.modalPopup = {
                open: openModal,
                close: closeModal,
                configuration: {
                    style: {
                        windowClass: "schema-modal-popup",
                        size       : E_MODAL_POPUP_SIZE.NONE // none will let content decides dimensions
                    }
                }
            };

            $scope.confirmDelete = null;
        }

        function closeModal() {
            $scope.confirmDelete = null;
            schemaModalService.close();
        }

        function openModal ($event, showModal) {
            $event.preventDefault();
            if(showModal) {
                $scope.confirmDelete = null;
                var _template = '/wp-content/plugins/xcloud/app/components/account_delete/account-delete-modal.html';
                var _controller = 'accountDeleteController';
                schemaModalService.open($scope.AD_VM.modalPopup.configuration, _template, _controller);
            }
        }

        function openDeleteModal ($event, showModal) {
            $event.preventDefault();
            if(showModal) {
                $scope.confirmDelete = null;
                var _template = '/wp-content/plugins/xcloud/app/components/account_delete/account-delete-confirm-modal.html';
                var _controller = 'accountDeleteController';
                schemaModalService.open($scope.AD_VM.modalPopup.configuration, _template, _controller);
            }
        }

        /*$scope.checkDeleteConfirmation = function () {
            if($scope.confirmDelete === 'DELETE'){
                $scope.deleteAccountForm.confirmDelete.$setValidity('confirmDelete', true);
            }else{
                $scope.deleteAccountForm.confirmDelete.$setValidity('confirmDelete', false);
            }
        };*/

        $scope.checkDeleteText = function() {
            if($scope.confirmDelete === 'DELETE') {
                $scope.displayError = false;
                $scope.deleteAccountForm.confirmDelete.$setValidity('confirmDelete', true);
            }
            else {
                $scope.displayError = true;
                $scope.deleteAccountForm.confirmDelete.$setValidity('confirmDelete', false);
            }
        };

        $scope.refillDeleteText = function() {
            $scope.displayError = false;
        };

        $scope.updateDeleteAccount = function ($event) {
            $event.preventDefault();
            try {
                jQuery('.loading-container').css('display', 'block');
                CandidateWorkFlow.profile.deactivate().then(function(){
                    authService.loginCancelled();
                    closeModal();
                    openDeleteModal ($event, true);
                    jQuery('.loading-container').css('display', 'none');
                }, function (reason) {
                    $log.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                })
            } catch (err) {
                $log.error("Account Delete error", err);
                jQuery('.loading-container').css('display', 'none');
            }
        };

        $scope.goToHome = function($event) {
            jQuery('.loading-container').css('display', 'block');
            XCLOUD.personalize.init();
            XCLOUD.log_out(true, $event, true);
            jQuery('.loading-container').css('display', 'none');
        };
    }
})();
