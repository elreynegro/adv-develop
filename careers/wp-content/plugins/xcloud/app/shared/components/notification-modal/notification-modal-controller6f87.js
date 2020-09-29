/**
 * Created by TDadam on 5/14/2018.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('notificationModalController', notificationModalController);

    notificationModalController.$inject = ['$scope', '$log', 'metaDataProvider'];

    function notificationModalController($scope, $log, metaDataProvider) {
        $scope.vm = {
            modalPopup: {
                close: closeModal
            }
        };
        if (metaDataProvider.vm) {
            $scope.vm = angular.extend($scope.vm, metaDataProvider.vm);
        }
        function closeModal() {
            metaDataProvider.closeModal();
        }
    }

})(); // End  controller=======