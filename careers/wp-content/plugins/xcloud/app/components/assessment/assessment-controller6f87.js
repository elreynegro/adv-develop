/**
 * Created by TDadam on 2/14/2018.
 */
(function() {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('assessmentController', assessmentController);

    assessmentController.$inject = ['$scope', '$rootScope', '$http','$location','$log','ApplicationState','assessmentViewModelService','ApplyWorkFlow','authService'];

    function assessmentController($scope,$rootScope,$http,$location,$log,ApplicationState,assessmentViewModelService,ApplyWorkFlow,authService) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var assessmentWindow;
        $scope.vm = {
            assessments             : [],
            ApplyWorkFlow           : ApplyWorkFlow,
            getAssessmentStatus     : assessmentViewModelService.getAssessmentStatus,
            isShowComponent         : true,
            isAssessmentCanBeSkipped: false,
            preventDoubleClick      : preventDoubleClick,
            startAssessment         : startAssessment,
            skipFlow                : skipFlow,
            workFlowMovement        : workFlowMovement
        };

        initialize();
        function initialize() {

            restoreWorkFlow();
            var candidateId = ApplicationState.localStorage.candidate.id.get();
            var positionCode = ApplicationState.localStorage.requisition.assessmentPositionCode.get();
            if (positionCode === null || angular.isArray(positionCode) === false) {
                positionCode = [];
            }
            assessmentViewModelService.obtainCandidateLockState()
                .then(function (result) {
                    assessmentViewModelService.getVMFromCache(positionCode, candidateId)
                        .then(function (viewModel) {
                            $scope.vm = angular.merge($scope.vm, viewModel);
                            if ($scope.vm.assessments.length === 0) {
                                workFlowMovement();
                            }
                            assessmentViewModelService.releaseCandidateLockState();
                        })

                })
                .catch(function (reason) {
                    logger.error('failed to update candidate locked state ');
                    logger.error(reason);
                });
        }


        function startAssessment(assessment) {
            if (!assessment.url) {
                assessmentWindow = window.open('', 'assessmentWindow');
                // Have to use $http because $resource is trying to automatically parse a string to json
                assessmentViewModelService.obtainCandidateLockState()
                    .then(function (result) {
                        $http({
                            url              : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/' + clientName + '/start/' + assessment.assessmentId,
                            method           : 'POST',
                            transformResponse: [],
                            data             : {}
                        }).then(
                            function (response) {
                                assessment.url = response.data;
                                assessment.testStatus = 'inprocess';
                                _.map($scope.assessments, function(obj){
                                    if(obj.assessmentId === assessment.assessmentId){
                                        return assessment;
                                    }
                                    return obj;
                                });
                                assessmentViewModelService.releaseCandidateLockState();
                                startAssessment(assessment);
                            },
                            function (response) {
                                logger.error(response);
                                $scope.loading = false;
                                jQuery('.loading-container').css('display', 'none');
                            }
                        );
                    })
                    .catch(function (reason) {
                        logger.error('failed to update candidate locked state ');
                        logger.error(reason);
                    });
            }
            else {
                if (assessmentWindow && assessmentWindow.closed !== true) {
                    assessmentWindow.location.href = assessment.url;
                }
                else {
                    assessmentWindow = window.open(assessment.url, 'assessmentWindow');
                }
                workFlowMovement();
            }
        }

        function workFlowMovement() {
            var result = _.findWhere($scope.vm.assessments,{ testStatus : 'invited'});
            if(result === undefined || result === null){
                var nextWorkFlow = completeCurrentStepInWorkFlow();
                if(ApplicationState.localStorage.candidate.isReturningUser.get() === false && nextWorkFlow.retainSession === false) {
                    assessmentViewModelService.releaseCandidateLockState()
                        .then(function (result) {
                            authService.logout();
                            redirectHandler();
                        })
                        .catch(function (reason) {
                            logger.error('failed to update candidate locked state ');
                            logger.error(reason);
                        });
                }else{
                    redirectHandler();
                }
            }
        }

        function  redirectHandler() {
            ApplyWorkFlow.redirectToCurrent();
        }

        function restoreWorkFlow() {
            var current = ApplyWorkFlow.current();
            if(current === undefined || current === null){
                ApplyWorkFlow.reset();
                ApplyWorkFlow.first(); // Application
                ApplyWorkFlow.next(); // Assessment
            }
        }

        function completeCurrentStepInWorkFlow() {
            restoreWorkFlow();
            return ApplyWorkFlow.next();
        }

        function skipFlow() {
            completeCurrentStepInWorkFlow();
            ApplyWorkFlow.redirectToCurrent();
        }

        function preventDoubleClick() {
            return false;
        }

    }
})(); // End  controller=======

