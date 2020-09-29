angular
    .module('st.candidate.activity')
    .directive('leadCaptureModalThankYou', ['leadcaptureModalService', function (leadcaptureModalService) {
        return {
            restrict   : 'EA',
            //link
            controller : function ($scope) {
                $scope.thankYouMessage = leadcaptureModalService.getModalThankYouMessage();
            },
            templateUrl: '/wp-content/plugins/xcloud/app/components/leadcapture/modal-thank-you.html'
        }

    }]);
