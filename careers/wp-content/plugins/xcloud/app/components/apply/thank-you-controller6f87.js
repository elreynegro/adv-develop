/**
 * Created by TDadam on 2/1/2018.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('applyThankYouController', applyThankYouController);

    applyThankYouController.$inject = ['$scope', '$rootScope', '$log','ApplicationState'];

    function applyThankYouController($scope,$rootScope,$log,ApplicationState) {
        $scope.vm = {};
        $scope.setVariable = setVariable;
        $scope.getVariable = getVariable;

        initialize();
        function  inMemoryFlag() {
            for(var i = 0; i < 10; i ++) {
                setVariable("flag" + i, false);
            }
        }

        function initialize() {
            inMemoryFlag();
            if ($rootScope.isReturningUser === undefined) {
                $rootScope.isReturningUser = ApplicationState.localStorage.candidate.isReturningUser.get();
            }
        }

        function setVariable(variableName, value) {
            $scope[variableName] = value;
        }

        function getVariable(variableName, value) {
            return $scope[variableName];
        }
    }
})(); // End  controller=======
