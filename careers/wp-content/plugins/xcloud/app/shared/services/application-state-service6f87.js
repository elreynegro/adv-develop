/**
 * Created by TDadam on 2/11/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('ApplicationState', ApplicationState);

    ApplicationState.$inject = ['$q', '$log','$window','SessionStorage','LocalStorage'];

    function ApplicationState($q, $log,$window,SessionStorage,LocalStorage) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var inMemoryStorage = {
            candidate: {
                candidateId: null
            }
        };
        var service = {
            localStorage: {
                application  : {
                    id: {
                        get: getApplicationId,
                        set: setApplicationId
                    }
                },
                candidate    : {
                    id             : {
                        get: getCandidateId,
                        set: setCandidateId
                    },
                    isReturningUser: {
                        get: getIsReturningUser,
                        set: setIsReturningUser
                    }
                },
                keep         : localStorageInMemorySave,
                requisition  : {
                    id                    : {
                        get: getRequisitionId,
                        set: setRequisitionId
                    },
                    assessmentPositionCode: {
                        get: getRequisitionAssmtPositionCode,
                        set: setRequisitionAssmtPositionCode
                    }
                },
                restore      : localStorageRestore,
                screening    : {
                    isShowComponent: {
                        get: getScreeningIsShowComponent,
                        set: setScreeningIsShowComponent
                    },
                    result         : {
                        get: getScreeningResult,
                        set: setScreeningResult
                    }
                },
                storageToKeep: [
                    "Y9dJ0",
                    "Y9dI0",
                    "Y9dK0",
                    "Y9dM0",
                    "Y9dN0",
                    "Y9dP0",
                    "screeningResult"
                ]
            },
            session     : {
                candidate  : {
                    get               : getCandidate,
                    set               : setCandidate,
                    resume            : {
                        applyResumeStateContainer: {
                            get   : getApplyResumeStateContainer,
                            set   : setApplyResumeStateContainer,
                            remove: removeApplyResumeStateContainer
                        }
                    },
                    socialLoginSession: {
                        get   : getSocialSiteStateContainer,
                        set   : setSocialSiteStateContainer,
                        remove: removeSocialSiteStateContainer
                    }
                },
                requisition: {
                    get          : getRequisition,
                    set          : setRequisition,
                    addAttributes: addAdditionalAttributesToRequisition
                }
            },
            uiMethods   : {
                showProgressBar: globalProgressBarHandler
            }
        };

        return service;


        function addAdditionalAttributesToRequisition(results) {
            if (results && results.requisition) {
                results.requisition.screenInMessage = results.screenInMessage;
                results.requisition.screenOutMessage = results.screenOutMessage;
            }
            return results;
        }

        function getApplyResumeStateContainer() {
            return sessionStorageGet("ApplyResumeStateContainer")
        }

        function setApplyResumeStateContainer(data) {
            sessionStorageSet("ApplyResumeStateContainer", data)
        }

        function removeApplyResumeStateContainer() {
            sessionStorage.removeItem("ApplyResumeStateContainer");
        }

        function getSocialSiteStateContainer() {
            return sessionStorageGet("SocialSiteStateContainer")
        }

        function setSocialSiteStateContainer(data) {
            sessionStorageSet("SocialSiteStateContainer", data)
        }

        function removeSocialSiteStateContainer() {
            sessionStorage.removeItem("SocialSiteStateContainer");
        }


        function getApplicationId() {
            return localStorageGet('Y9dJ0');
        }

        function setApplicationId(data) {
            localStorageSet('Y9dJ0', data);
        }

        function getCandidateId() {
            var _data = localStorageGet('Y9dI0');
            if(angular.equals({}, _data) || _data === null){
                return {
                    candidateId: inMemoryStorage.candidate.candidateId
                }
            }
            return _data;
        }

        function setCandidateId(data) {
            localStorageSet('Y9dI0', data);
        }

        function getIsReturningUser() {
            var data = localStorageGet('Y9dN0');
            if (data.isReturningUser === undefined) {
                return false;
            } else {
                return data.isReturningUser;
            }
        }

        function setIsReturningUser(data) {
            localStorageSet('Y9dN0', data);
        }


        function getCandidate() {
            return localStorageGet('applyCandidate');
        }

        function setCandidate(data) {
            localStorageSet('applyCandidate', data);
        }

        function getScreeningResult() {
            return localStorageGet('screeningResult');
        }

        function setScreeningResult(data) {
            localStorageSet('screeningResult', data);
        }

        function getScreeningIsShowComponent() {
            var data = localStorageGet('Y9dP0');
            if (data.show === undefined) {
                return false;
            } else {
                return data.show;
            }
        }

        function setScreeningIsShowComponent(data) {
            localStorageSet('Y9dP0', data);
        }

        function getRequisitionId() {
            return localStorageGet('Y9dK0');
        }

        function setRequisitionId(data) {
            localStorageSet('Y9dK0', data);
        }

        function getRequisitionAssmtPositionCode() {
            return localStorageGet('Y9dM0');
        }

        function setRequisitionAssmtPositionCode(data) {
            localStorageSet('Y9dM0', data);
        }

        function getRequisition() {
            return sessionStorageGet('applyReq');
        }

        function setRequisition(data) {
            sessionStorageSet('applyReq', data);
        }

        function localStorageSet(key, data) {
            return LocalStorage.set(key, data);
        }

        function localStorageGet(key) {
            var data = LocalStorage.get(key);
            if (data !== null && data !== undefined && data.$$state.value !== undefined) {
                return data.$$state.value
            } else {
                return {};
            }
        }

        function sessionStorageSet(key, data) {
            return SessionStorage.set(key, data);
        }

        function sessionStorageGet(key) {
            return SessionStorage.get(key);
        }

        function localStorageInMemorySave() {
            service.storageToRestore = [];
            for (var index = 0; index < service.localStorage.storageToKeep.length; index++) {
                var key = service.localStorage.storageToKeep[index];
                var obj = {
                    key  : key,
                    value: localStorageGet(key)
                };
                service.storageToRestore.push(obj);
            }
        }

        function localStorageRestore() {
            for (var index = 0; index < service.storageToRestore.length; index++) {
                var storageObj = service.storageToRestore[index];
                localStorageSet(storageObj.key, storageObj.value);
            }
        }

        function globalProgressBarHandler(enabled, AlwaysShowProgressbar,loaderId) {
            var _loaderElement = loaderId ? loaderId : '.loading-container';
            if (enabled) {
                jQuery(_loaderElement).css('display', 'block');
            } else {
                if (AlwaysShowProgressbar === undefined || AlwaysShowProgressbar !== true) {
                    jQuery(_loaderElement).css('display', 'none');
                }
            }
        }
    }
}());
