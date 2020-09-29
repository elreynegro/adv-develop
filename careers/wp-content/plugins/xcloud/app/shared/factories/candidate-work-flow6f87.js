/**
 * Created by TDadam on 2/19/2018.
 */
(function() {
    'use strict';
    angular
        .module('com.hrlogix.ats.global.services')
        .factory('CandidateWorkFlow', CandidateWorkFlow);

    CandidateWorkFlow.$inject = ['$q','$log','$routeParams','candidate','ApplicationState','privateCandidate','candidateSubscription', 'communicationTemplateService','privateCandidateOptIn'];

    function CandidateWorkFlow($q,$log,$routeParams,candidate,ApplicationState,privateCandidate,candidateSubscription, communicationTemplateService,privateCandidateOptIn) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var service = this;
        var _currentWorkFlow = null;

        service.obtainLockState = obtainLockState;
        service.releaseLockState = releaseLockState;
        service.getCurrentCandidate = getCurrentCandidate;

        service.profile = {
            deactivate        : deactivateProfile,
            termsAndConditions: {
                optIN   : candidateOptIn,
                hasOptIn: hasCandidateOptIn
            }
        };

        service.current = {
            set               : setWorkFlow,
            get               : getWorkFlow,
            getFromPath       : getFromPath,
            getFromRouteParams: getFromRouteParams,
            setFromURLPath    : setFromURLPath,
            URLVariable       : getURLVariable
        };
        service.preferences = {
            communications: {
                subscriptions: {
                    marketing            : {
                        subscribe  : subscribeMarketing,
                        unSubscribe: unSubscribeMarketing
                    },
                    getList              : getSubscriptionsList,
                    getSubscriptionStatus: getSubscriptionStatus,
                    isSubscribed         : isSubscribed
                }
            }
        };
        service.isReturningUser = isReturningUser;
        service.setCandidate = setCandidate;
        return service;


        function obtainLockState(workFlow) {
            return updateCandidate(workFlow, null);
        }

        function releaseLockState(workFlow) {
            return updateCandidate(workFlow, 't');
        }

        function updateCandidate(workFlow, lockedState) {
            if (ApplicationState.localStorage.candidate.isReturningUser.get() !== false) {
                var _deferred = $q.defer();
                _deferred.resolve(0);
                return _deferred.promise;
            }
            if (workFlow === null || workFlow === undefined || workFlow.retainSession === undefined) {
                var deferred = $q.defer();
                deferred.reject('no work flow step identified');
                return deferred.promise;
            }
            var candidateModel = ApplicationState.session.candidate.get();
            candidateModel.locked = lockedState;
            return candidate.updateCandidate(candidateModel).$promise.then(function (result) {
                var deferred = $q.defer();
                try {
                    result = normalizeObjects(result);
                    ApplicationState.session.candidate.set(result);
                    deferred.resolve(result);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            });
        }

        function getCurrentCandidate() {
            var _deferred = $q.defer();
            privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                _deferred.resolve(normalizeObjects(result));
            }, function (reason) {
                logger.error(reason);
            });
            return _deferred.promise;
        }
        
        function deactivateProfile () {
            var deferred = $q.defer();
            try {
                var candidateObj = ApplicationState.session.candidate.get();
                if(candidateObj && !angular.equals({}, candidateObj)) {
                    candidateObj.deactivateCheck = 't';
                    //Garbling up the uname and email so that the user can create an account again
                    // garbling format XX-email-tyyyyddmmss-XX
                    var date = new Date();
                    var timestamp = "t" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
                    var garbledEmail = "XX-" + candidateObj.email + "-" + timestamp + "-XX";
                    candidateObj.email = garbledEmail;
                    var garbledUname = "XX-" + candidateObj.uname + "-" + timestamp + "-XX";
                    candidateObj.uname = garbledUname;
                    privateCandidate.updateCandidate(candidateObj).$promise.then(function (results) {
                        var output = normalizeObjects(results);
                        deferred.resolve(output);
                    }, function (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    });
                }
            } catch (reason) {
                logger.error(reason);
                deferred.reject(reason);
            }
            return deferred.promise;
        }

        function _candidateSubscription(email, communicationType, isSubscribed) {
            var deferred = $q.defer();
            var _payLoad = {
                communicationType: communicationType,
                subscription     : isSubscribed,
                userName         : email
            };
            return candidateSubscription.modify(_payLoad).$promise.then(function (result) {
                result = normalizeObjects(result);
                var _candidateSubscription = getCandidateRowElementFromSubscriptions(email, communicationType);
                if (_candidateSubscription === undefined) {
                    pushCandidateSubscriptionToList(result)
                } else {
                    _candidateSubscription.subscription = result.subscription;
                }
                deferred.resolve(result);
            }, function (reason) {
                deferred.reject(reason);
            })
        }

        function subscribeMarketing(email) {
            return _candidateSubscription(email, E_COMMUNICATION_TYPE.MARKETING, EBOOLEAN_TYPE.TRUE);
        }

        function unSubscribeMarketing(email) {
            return _candidateSubscription(email, E_COMMUNICATION_TYPE.MARKETING, EBOOLEAN_TYPE.FALSE);
        }

        function getSubscriptionsList() {
            var deferred = $q.defer();
            candidateSubscription.getList().$promise.then(function (result) {
                service.preferences.communications.subscriptions.list = normalizeObjects(result);
                deferred.resolve(service.preferences.communications.subscriptions.list);
            }, function (reason) {
                logger.error(reason);
                deferred.reject(reason);
            });
            return deferred.promise;
        }
        function getSubscriptionStatus(email, candidateId){
            var deferred = $q.defer();
            candidateSubscription.getSubscription({candidateId: candidateId}).$promise.then(function(result){
                var returnResult =  normalizeObjects(result);
                deferred.resolve(returnResult);

            }, function (reason){
                logger.error(reason);
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function pushCandidateSubscriptionToList(element) {
            service.preferences.communications.subscriptions.list = service.preferences.communications.subscriptions.list || [];
            service.preferences.communications.subscriptions.list.push(element);
        }

        function getCandidateRowElementFromSubscriptions(email, communicationType) {
            return _.findWhere(service.preferences.communications.subscriptions.list, {
                userName         : email,
                communicationType: communicationType
            });
        }

        function isSubscribed(email, communicationType) {
            var _candidateSubscription = getCandidateRowElementFromSubscriptions(email, communicationType);
            return (_candidateSubscription === undefined || _candidateSubscription.subscription === EBOOLEAN_TYPE.TRUE)
        }

        function setWorkFlow(workFlow) {
            _currentWorkFlow = workFlow;
            communicationTemplateService.setActivationLink(_currentWorkFlow);
        }

        function getURLVariable() {
            return service.URLVariables;
        }

        function getWorkFlow() {
            return _currentWorkFlow;
        }

        function setApplyURLVariable(path) {
            service.URLVariables = {
                path: {default: path}
            }
        }

        function setApplyLCPURLVariable(path) {
            service.URLVariables = {
                path: {default: path}
            }
        }

        function setFromURLPath(path,id) {
            var _flow = getFromPath(path,id);
            setWorkFlow(_flow);
            switch(_flow)
            {
                case E_WORK_FLOW.ALERT_LCP:
                    setApplyURLVariable('/profile/job-alert/' + id + '/');
                    break;
                case E_WORK_FLOW.JOIN_LCP:
                    setApplyURLVariable('/profile/join/');
                    break;
                case E_WORK_FLOW.APPLY:
                    setApplyURLVariable('/apply/' + id + '/');
                    break;
                case E_WORK_FLOW.APPLY_LCP:
                    setApplyLCPURLVariable('/apply/join/' + id + '/');
                    break;
                default:
                    break;
            }
        }

        function getFromPath(path,id) {
            if (!path) {
                return E_WORK_FLOW.NONE;
            }
            else if (path.indexOf('/profile/join/') > -1 && id === undefined) {    //'/profile/join/'
                return E_WORK_FLOW.JOIN_LCP;
            } else if (path.indexOf('/profile/join/') > -1 && id !== undefined) {   //'/apply/join/'
                return E_WORK_FLOW.APPLY_LCP;
            } else if (path.indexOf('/apply/join/') > -1 && id !== undefined) {   //'/apply/join/'
                return E_WORK_FLOW.APPLY_LCP;
            } else if (path.indexOf('/profile/job-alert/') > -1) {
                return E_WORK_FLOW.ALERT_LCP;
            } else if (path.indexOf('/apply/') > -1) {
                return E_WORK_FLOW.APPLY;
            } else {
                return E_WORK_FLOW.NONE;
            }
        }

        function candidateOptIn(candidateId) {
            var deferred = $q.defer();
            candidateId = candidateIdResolver(candidateId);
            var _date = new Date();
            var _payLoad = {
                candidateId: candidateId,
                consentDate: _date.getTime()
            };
            privateCandidateOptIn.consent(_payLoad).$promise.then(function (result) {
                deferred.resolve(normalizeObjects(result));
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function hasCandidateOptIn(candidateId){
            var deferred = $q.defer();
            candidateId = candidateIdResolver(candidateId);
            var _payLoad = {
                candidateId     : candidateId,
                candidateOptinId: 0
            };
            privateCandidateOptIn.isExists(_payLoad).$promise.then(function (result) {
                var _result = normalizeObjects(result);
                deferred.resolve(true);
            }, function (reason) {
                deferred.resolve(false);
            });
            return deferred.promise;
        }

        function candidateIdResolver(candidateId) {
            candidateId = candidateId || ApplicationState.localStorage.candidate.id.get();
            if(candidateId){
                if(!angular.equals({}, candidateId)){
                    try {
                        candidateId = parseInt(candidateId);
                        return candidateId;
                    }catch (err) {
                        $log.error("parse Int error on candidate id", err);
                        return null;
                    }
                }
            }
            return null;
        }

        function getFromRouteParams(flow) {
            switch (flow) {
                case E_WORK_FLOW.APPLY:
                    if ($routeParams.requisitionId || $routeParams.link) {
                        return E_WORK_FLOW.APPLY;
                    } else {
                        return E_WORK_FLOW.NONE;
                    }
                    break;
                default:
                    return flow;
            }
        }

        function isReturningUser() {
            return ApplicationState.localStorage.candidate.isReturningUser.get();
        }

        function setCandidate(candidate) {
            if (candidate) {
                ApplicationState.session.candidate.set(candidate);
                ApplicationState.localStorage.candidate.id.set(candidate.candidateId);

            }
        }
    }
}());
