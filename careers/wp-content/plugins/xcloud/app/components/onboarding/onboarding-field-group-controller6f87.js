/**
 * Created by TDadam on 4/8/2018.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('onBoardingFieldGroupController', onBoardingFieldGroupController);

    onBoardingFieldGroupController.$inject = ['$scope', '$log','$controller', '$location', '$window'];

    function onBoardingFieldGroupController($scope,$log,$controller,$location,$window) {
        angular.extend(this, $controller('candidateSchemaFormController',  {$scope: $scope}));
    }

})(); // End  controller=======
