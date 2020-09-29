/**
 * Created by shanjock 4/19/2018
 */
(function () {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('candidateProfileController', candidateProfileController);

    candidateProfileController.$inject = ['$scope', '$log', '$controller', '$location', '$window'];

    function candidateProfileController($scope, $log, $controller, $location, $window) {
        angular.extend(this, $controller('candidateSchemaFormController', {$scope: $scope}));

    }

})(); // End  controller=======