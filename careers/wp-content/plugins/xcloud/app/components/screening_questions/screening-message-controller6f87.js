/**
 * Created by TDadam on 2/11/2018.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.screening.questions')
        .controller('screeningMessageController', screeningMessageController);

    screeningMessageController.$inject = ['$scope', '$log','$q','screeningMessageViewModelService'];

    function screeningMessageController($scope,$log,$q,screeningMessageViewModelService) {
        $scope.vm = {
            isShowComponent: false
        };

        initialize();

        //Initialization
        function  initialize() {
            try {
                // default
                $scope.vm  = screeningMessageViewModelService.getViewModel();
            } catch (err) {
                $log.error("screening-message init error", err);
            }
        }
    }
})(); // End  controller=======