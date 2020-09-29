/**
 * Created by shanjock 4/19/2018
 */

(function () {
    'use strict';

    angular
        .module('st.controllers.apply.site')
        .controller('candidateActivityController', candidateActivityController);

    candidateActivityController.$inject = ['$scope', '$log', 'authService', 'candidateActivityViewModelService', 'candidateActivityDataService', '$rootScope'];

    function candidateActivityController($scope, $log, authService, candidateActivityViewModelService, candidateActivityDataService, $rootScope) {

        $scope.vm = candidateActivityViewModelService.getVMSkeleton();
        angular.copy($scope.vm, candidateActivityDataService);

        $scope.activity_notifications = {};
        $scope.activitySelectOptions = [
            {"optionid:": "recent", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.RECENT_ACTIVITY.str, "val": "recent"},
            {"optionid:": "action", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.ACTION.str, "val": "action"},
            {"optionid:": "reminder", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.REMINDER.str, "val": "reminder"},
            {"optionid:": "summary", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.SUMMARY.str, "val": "summary"},
            {"optionid:": "notification", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.NOTIFICATION.str, "val": "notification"},
            {"optionid:": "status", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.STATUS.str, "val": "status"},
            {"optionid:": "suggestion", "title": TEMPLATE_CONSTANTS.TITLE.CANDIDATE_ACTIVITY.SUGGESTION.str, "val": "suggestion"}
        ];
        $scope.activityIcons = {};
        $scope.activityIcons = {
            'action'      : {
                'icons'    : 'fa-bolt',
                'customcss': 'gold'
            },
            'reminder'    : {
                'icons'    : 'fa-calendar-check-o',
                'customcss': 'red'
            },
            'summary'     : {
                'icons'    : 'fa-info-circle',
                'customcss': 'blue'
            },
            'notification': {
                'icons'    : 'fa-exclamation-triangle',
                'customcss': 'darkorange'
            },
            'status'      : {
                'icons'    : 'fa-check-circle',
                'customcss': 'darkgreen'
            },
            'suggestion'  : {
                'icons'    : 'fa-lightbulb-o',
                'customcss': 'black'
            }
        };
        $scope.activityfilterItem = {
            item: $scope.activitySelectOptions[0]
        };

        $scope.getCandidateActivityViewModelService = function (forcePull, candidateObj) {
            candidateActivityViewModelService.getViewModel(forcePull, candidateObj).then(function (CAResponse) {
                $scope.vm = CAResponse;
                angular.copy($scope.vm, candidateActivityDataService);
            });
        };

        initialize();

        //Initialization
        function initialize() {
            try {
                // default
                $scope.getCandidateActivityViewModelService(true);

            } catch (err) {
                $log.error("Candidate Activity init error", err);
            }
        }

        $scope.activityFilter = function (filterCriteria) {
            $scope.vm = candidateActivityViewModelService.filterCandidateActivity(filterCriteria);
            angular.copy($scope.vm, candidateActivityDataService);
        };

        $scope.updateCandidateActivity = function (activityId, contextId, contextType, type, status, activityData, createdDateTime, candidateObj, $index) {
            try {
                candidateActivityViewModelService.updateCandidateActivity(activityId, contextId, contextType, type, status, activityData, createdDateTime, candidateObj, $index).then(function (results) {
                    // var output = normalizeObjects(results);
                    $scope.vm = results;
                    angular.copy($scope.vm, candidateActivityDataService);
                });
            } catch (err) {
                $log.error("Candidate Activity update error", err);
            }
        };

        $rootScope.$on(BROAD_CAST_NAMESPACE.GET_CANDIDATE_ACTIVITY, function (event, forcePull, candidateObj) {

            // candidateActivityViewModelService.multipleCallUnlock();   //todo: Candidate Activity needs to be tested again.

            $scope.getCandidateActivityViewModelService(forcePull, candidateObj);
        });

        $scope.$on(BROAD_CAST_NAMESPACE.CANDIDATE_ACTIVITY_VM_REFRESH, function (event, viewModel) {
            $scope.vm = viewModel;
            angular.copy($scope.vm, candidateActivityDataService);
        });
    }
})(); // End  controller=======