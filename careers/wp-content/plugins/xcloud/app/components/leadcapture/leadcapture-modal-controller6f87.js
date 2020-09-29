(function () {
    'use strict';
    angular
        .module('st.candidate.activity')
        .controller("leadCaptureModalController", leadCaptureModalController);
    leadCaptureModalController.$inject = ['$scope', '$log', '$controller', '$location', '$window', 'metaDataProvider', 'schemaModalService', 'migrationService', 'leadcaptureModalService']

    function leadCaptureModalController($scope, $log, $controller, $location, $window, metaDataProvider, schemaModalService, migrationService, leadcaptureModalService) {
        $scope.isLeadCaptureForModal = true;
        $scope.isModalLcpShowThankYou = false;
        leadcaptureModalService.setCallFromModal();
        angular.extend(this, $controller('candidatePoolController', {$scope: $scope}));
        $scope.vm = {
            E_PANEL           : {
                LCP: 0
            },
            decorator         : {
                header   : !_XC_CONFIG.lcp_modal_header? '':_XC_CONFIG.lcp_modal_header,
                subHeader: !_XC_CONFIG.lcp_modal_sub_header? '':_XC_CONFIG.lcp_modal_sub_header
            },
            preventDoubleClick: preventDoubleClick,
            modalPopup        : {
                close            : modalDismiss,
                enableCloseButton: true,
                panel            : 0 //LCP
            }
        };

        initialize();

        function initialize() {

        }

        $scope.$on('modal.closing', function (event, reason, closed) {
            leadcaptureModalService.resetCalledFromModal();
            leadcaptureModalService.setIsModalOpen(false);
            dismissConfirmation(event, reason);
        });
        $scope.$on('closeLeadCaptureModal',function(event, reason, data){
            if(leadcaptureModalService.getIsModalOpen()){
                $scope.vm.modalPopup.close();
            }

        });

        function modalDismiss(event) {

            if (event) {
                event.preventDefault();
            }
            schemaModalService.close();
        }

        function preventDoubleClick() {
            return false;
        }

        function dismissConfirmation(event, reason) {
            switch (reason) {
                case schemaModalService.E_REASON.ESCAPE:
                    // if needed to prevent modal from closing use this section
                    break;
            }
        }

    }

})(); // End  controller=======



