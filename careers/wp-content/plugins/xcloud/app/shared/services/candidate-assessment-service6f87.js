/**
 * Created by TDadam on 2/14/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('candidateAssessmentService', candidateAssessmentService);

    candidateAssessmentService.$inject = ['$q', '$log', 'privateCandidate','ListService'];

    function candidateAssessmentService($q, $log,privateCandidate,ListService)  {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        // in-memory data members
        var assessmentArray = [];

        var service = {
            createForRequisition: createForRequisition,
            get                 : getAssessment,
            getFromCache        : getAssessments,
            filterFromCache     : filterAssessment,
            loadDomainLookup: loadDomainLookup,
            getLookUpCollection    : getLookUpCollection
        };
        return service;

        //<editor-fold desc="API Interaction">
        function getAssessment(candidateId) {
            assessmentArray = [];
            var instance = this;
            assessmentArray = [];
            if (candidateId !== null && candidateId !== undefined) {
                return privateCandidate.getCandidateAssessments({candidateId : candidateId}).$promise.then(function (result) {
                    var deferred = $q.defer();
                    try {
                        var existingAssessments = normalizeObjects(result);
                        setAssessment(existingAssessments);
                        deferred.resolve(existingAssessments);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            }
            else {
                var deferred = $q.defer();
                deferred.reject('invalid arguments');
                return deferred.promise;
            }
        }

        function createForRequisition(candidateId,requisitionId) {
            assessmentArray = [];
            var instance = this;
            if (candidateId !== null && candidateId !== undefined && requisitionId !== null && requisitionId !== undefined) {
                return privateCandidate.createCandidateAssessmentForRequisition({candidateId : candidateId , requisitionId : requisitionId}).$promise.then(function (result) {
                    var deferred = $q.defer();
                    try {
                        result = normalizeObjects(result);
                        setAssessment(result);
                        deferred.resolve(result);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            }
            else {
                var deferred = $q.defer();
                deferred.reject('invalid arguments');
                return deferred.promise;
            }
        }
        //</editor-fold>

        //<editor-fold desc="Setters and Getters">
        function setAssessment(assessmentInputArray) {
            if (assessmentInputArray !== undefined && angular.isArray(assessmentInputArray)) {
                for (var i = 0; i < assessmentInputArray.length; i++) {
                    var assessmentObj = assessmentInputArray[i];
                    assessmentObj.positionLabel = getAssessmentDescription(assessmentObj.vendorPositionCode);
                    assessmentArray.push(assessmentObj);
                }
            }
        }

        function getAssessmentDescription(positionCode) {
            if (positionCode !== undefined) {
                var assessmentObj = _.findWhere(service.domainLookup.assmt_position_codes, {value: positionCode});
                if (assessmentObj === undefined) {
                    return positionCode
                } else {
                    return assessmentObj.label;
                }
            } else {
                return positionCode;
            }
        }

        function addAssessment(assessment) {
            assessmentArray.push(assessment);
        }

        function getAssessments() {
            return assessmentArray;
        }
        //</editor-fold>

        function filterAssessment(positionCodeArray) {
            return _.filter(assessmentArray,function (assessment) {
                return (positionCodeArray.indexOf(assessment.vendorPositionCode) > -1)
            });
        }

        function loadDomainLookup() {
            var listsNeeded = ["assmt_position_codes"];
            service.domainLookup = [];
            return ListService.loadListNames(service.domainLookup, listsNeeded)
        }

        function getLookUpCollection() {
            return service.domainLookup;
        }
    }
}());
