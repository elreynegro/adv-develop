/**
 * Created by TDadam on 2/14/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('assessmentViewModelService', assessmentViewModelService);

    assessmentViewModelService.$inject = ['$q', '$log','candidateAssessmentService','authService','candidate','ApplicationState','ApplyWorkFlow'];

    function assessmentViewModelService($q, $log,candidateAssessmentService,authService,candidate,ApplicationState,ApplyWorkFlow)  {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            getVMFromCache           : viewModelCache,
            getAssessmentStatus      : getAssessmentStatus,
            obtainCandidateLockState : obtainCandidateLockState,
            releaseCandidateLockState: releaseCandidateLockState
        };
        return service;

        function viewModelCache(positionCode,candidateId) {
            var vm = {
                isShowComponent: true
            };
            var deferred = $q.defer();
            vm.assessments = candidateAssessmentService.filterFromCache(positionCode);
            if (authService.isLoggedIn && (vm.assessments === undefined || vm.assessments.length < positionCode.length)) {
                var _lookup = candidateAssessmentService.getLookUpCollection();
                if (_lookup === undefined || _lookup.length === 0) {
                    candidateAssessmentService.loadDomainLookup()
                        .then(function () {
                            candidateAssessmentService.get(candidateId)
                                .then(function (result) {
                                    // Make sure filter is performed
                                    vm.assessments = candidateAssessmentService.filterFromCache(positionCode);
                                    statusEvaluate(vm);
                                    deferred.resolve(vm);
                                })
                        });
                } else {
                    candidateAssessmentService.get(candidateId)
                        .then(function (result) {
                            // Make sure filter is performed
                            vm.assessments = candidateAssessmentService.filterFromCache(positionCode);
                            statusEvaluate(vm);
                            deferred.resolve(vm);
                        })
                }
            } else {
                deferred.resolve(vm);
            }
            return deferred.promise;
        }

        function getAssessmentStatus (assessment) {
            var status = assessment.testStatus;
            if (status === 'invited')
                return 'Not Started';
            else if (status === 'inprocess')
                return 'Incomplete';
            return 'Completed';
        }

        function statusEvaluate(vm) {
            if(vm === undefined || vm.assessments === undefined || vm.assessments.length === 0){
                return vm;
            }
            try {
                for (var index = 0; index < vm.assessments.length; index++) {
                    if (getAssessmentStatus(vm.assessments[index]) !== 'Completed') {
                        // when there are assessment to complete
                        vm.isAssessmentCanBeSkipped = false;
                        return vm;
                    }
                }
                // when there are no assessment to complete
                vm.isAssessmentCanBeSkipped = true;
            }catch (reason){
                vm.isAssessmentCanBeSkipped = false;
            }
            return vm;
        }

        function obtainCandidateLockState() {
            return ApplyWorkFlow.obtainCandidateLockState(ApplyWorkFlow.current());
        }

        function releaseCandidateLockState() {
            return ApplyWorkFlow.releaseCandidateLockState(ApplyWorkFlow.current());
        }

        function getAssessmentStatus (assessment) {
            var status = assessment.testStatus;
            if (status === 'invited')
                return 'Not Started';
            else if (status === 'inprocess')
                return 'Incomplete';
            return 'Completed';
        }

        function statusEvaluate(vm) {
            if(vm === undefined || vm.assessments === undefined || vm.assessments.length === 0){
                return vm;
            }
            try {
                for (var index = 0; index < vm.assessments.length; index++) {
                    if (getAssessmentStatus(vm.assessments[index]) !== 'Completed') {
                        // when there are assessment to complete
                        vm.isAssessmentCanBeSkipped = false;
                        return vm;
                    }
                }
                // when there are no assessment to complete
                vm.isAssessmentCanBeSkipped = true;
            }catch (reason){
                vm.isAssessmentCanBeSkipped = false;
            }
            return vm;
        }

        function obtainCandidateLockState() {
            return ApplyWorkFlow.obtainCandidateLockState(ApplyWorkFlow.current());
        }

        function releaseCandidateLockState() {
            return ApplyWorkFlow.releaseCandidateLockState(ApplyWorkFlow.current());
        }
    }
}());
