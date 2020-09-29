/**
 * Created by TDadam on 12/16/2017.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('jobApplyController', jobApplyController);

    jobApplyController.$inject = ['$scope', '$log','$controller', '$location', '$window'];

    function jobApplyController($scope,$log,$controller,$location,$window) {
        angular.extend(this, $controller('candidateSchemaFormController',  {$scope: $scope}));


    }

})(); // End  controller=======