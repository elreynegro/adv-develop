/**
 * Created by shanjock 4/19/2018
 */

(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('candidateProfileViewModelService', candidateProfileViewModelService);

    candidateProfileViewModelService.$inject = ['$q', '$log', 'ModelDependencyFactory', 'metadata', '$rootScope'];

    function candidateProfileViewModelService($q, $log, ModelDependencyFactory, metadata, $rootScope) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        this.vm = {
            formCollection : [],
            isShowComponent: true
        };

        this.getMetaData = getMetaData;

        var service = this;

        return service;

        function getMetaData(streamId, notifyObserverRegistration, semaphoreCollection) {
            var defer = $q.defer();
            service.notifyObserverRegistration = notifyObserverRegistration;
            return metadata.getStreamCustomFieldMetaData({streamId: streamId}).$promise.then(function (result) {
                if (result.metaData.length) {
                    $rootScope.dashboardFMEnabled = semaphoreCollection.isDashboard;
                    service.vm.isShowComponent = true;
                } else {
                    $rootScope.dashboardFMEnabled = false;
                    service.vm.isShowComponent = false;
                }
                ModelDependencyFactory.schemaInterpolation.performMetaDataInterpolation(result.metaData, semaphoreCollection, onInterpolationSuccess);
                defer.resolve(result);
            }, function (reason) {
                $rootScope.dashboardFMEnabled = false;
                service.vm.isShowComponent = false;
                logger.error(reason);
                defer.reject(reason);
            });
        }

        function onInterpolationSuccess(results) {
            service.notifyObserverRegistration(results);
            service.vm.formCollection = results;
        }

        function constructAngularSchemaObserver(formCollection, modelHandler, semaphoreCollection, candidateIdSupplier, getCandidateParams) {
            ModelDependencyFactory.angularSchemaObserver.instantiate(formCollection, modelHandler, semaphoreCollection, candidateIdSupplier, getCandidateParams);
        };


        function globalProgressBarHandler(enabled, AlwaysShowProgressbar) {
            if (enabled) {
                jQuery('.loading-container').css('display', 'block');
            } else {
                if (AlwaysShowProgressbar === undefined || AlwaysShowProgressbar !== true) {
                    jQuery('.loading-container').css('display', 'none');
                }
            }
        }

        function notificationSemaphoreHandler(state, message) {
            this.isShowNotificaiton = state;
            this.notificationMessage = message;
        };
    }
}());