/**
 * Created by shanjock 4/19/2018
 */
(function () {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('candidateProfilePlaceholderController', candidateProfilePlaceholderController);

    candidateProfilePlaceholderController.$inject = ['$scope', '$rootScope', '$log', 'authService', '$controller', '$location', '$window', 'candidateProfileViewModelService'];

    function candidateProfilePlaceholderController($scope, $rootScope, $log, authService, $controller, $location, $window, candidateProfileViewModelService) {
        angular.extend(this, $controller('candidateBaseHelper', {$scope: $scope}));

        $scope.disableDashboardFM = function () {
            $scope.vm = candidateProfileViewModelService.vm;
            $rootScope.dashboardFMEnabled = false;
            $scope.vm.isShowComponent = false;
        };

        initialize();

        function initialize() {
            $scope.semaphoreCollection = {
                isLastFormSpecificationRuleApplicable: false,
                progressBar                          : $scope.globalProgressBarHandler,
                notificationMessage                  : $scope.notificationSemaphoreHandler,
                isLeadCapture                        : false,
                isDashboard                          : true,
                AlwaysShowProgressbar                : false,
                captureOmniTagging                   : false
            };

            if(typeof authService.isLoggedIn !== 'undefined' && authService.isLoggedIn) {
                // $scope.vm = candidateProfileViewModelService.vm;

                // if (angular.equals($scope.vm.formCollection, [])) {
                    if (typeof _XC_CONFIG !== 'undefined') {
                        if (_XC_CONFIG.dash_fm_enabled === true || _XC_CONFIG.dash_fm_enabled === 'true') {
                            if (_XC_CONFIG.dash_fm_stream !== null && _XC_CONFIG.dash_fm_stream !== '' && _XC_CONFIG.dash_fm_stream !== 0) {
                                candidateProfileViewModelService.getMetaData(_XC_CONFIG.dash_fm_stream, $scope.constructAngularSchemaObserver, $scope.semaphoreCollection).then(function (result) {
                                    $scope.vm = candidateProfileViewModelService.vm;
                                });
                            } else {
                                $scope.disableDashboardFM();
                            }
                        } else {
                            $scope.disableDashboardFM();
                        }
                    } else {
                        $scope.disableDashboardFM();
                    }
                // }
            }
        }
    }
})(); // End  controller=======