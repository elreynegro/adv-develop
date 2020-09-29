/**
 * Created by TDadam on 2/8/2018.
 */

(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('screeningMessageViewModelService', screeningMessageViewModelService);

    screeningMessageViewModelService.$inject = ['$q', '$log', 'privateCandidate','ApplicationState','authService'];

    function screeningMessageViewModelService($q, $log,privateCandidate,ApplicationState,authService)  {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            getViewModel: getViewModel,
            setViewModel: prepareViewModel,
            hasQualified: hasQualified
        };
        return service;

        /**
         *
         * @param resultsPayLoad
         */
        function prepareViewModel() {
            service.vm = {
                isShowComponent: false
            };
            var requisition = ApplicationState.session.requisition.get();
            var payLoad  = {
                candidateId  : ApplicationState.localStorage.candidate.id.get(),
                applicationId: ApplicationState.localStorage.application.id.get()
            };
            if(authService.isLoggedIn) {
                return privateCandidate.getScreeningResult(payLoad).$promise.then(function (results) {
                    var deferred = $q.defer();
                    try {
                        if (results.hasQualified !== null) {
                            service.vm.hasQualified = results.hasQualified;
                            service.vm.isShowComponent = (ApplicationState.showScreeningMessageComponent === true);
                            if (service.vm.hasQualified === true) {
                                service.vm.message = requisition.screenInMessage;
                            } else {
                                service.vm.message = requisition.screenOutMessage;
                            }
                        }
                        deferred.resolve(service.vm);
                    }
                    catch (reason) {
                        logger.error(reason);
                        delete service.vm;
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            }
        }
        function getViewModel() {
            if(service.vm === undefined) {
                return ApplicationState.localStorage.screening.result.get();
            }else{
                return service.vm;
            }
        }

        function hasQualified() {
            var vm;
            if(service.vm === undefined) {
                vm = ApplicationState.localStorage.screening.result.get();
            }else{
                vm = service.vm;
            }
            if(vm === undefined || vm === null){
                return vm;
            }else{
                return vm.hasQualified;
            }
        }
    }
}());
