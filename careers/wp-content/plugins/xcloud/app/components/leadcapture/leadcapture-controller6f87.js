/**
 * Created by TDadam on 12/16/2017.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('leadCaptureController', leadCaptureController);

    leadCaptureController.$inject = ['$scope', '$log','$controller', '$location', '$window'];

    function leadCaptureController($scope,$log,$controller,$location,$window) {
        angular.extend(this, $controller('candidateSchemaFormController',  {$scope: $scope}));
    }

})(); // End  controller=======