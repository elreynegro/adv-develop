/**
 * Created by shanjock 4/19/2018
 */

(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('candidateActivityDataService', candidateActivityDataService);

    candidateActivityDataService.$inject = ['$log', 'candidateActivityViewModelService'];

    function candidateActivityDataService($log, candidateActivityViewModelService) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var vm = candidateActivityViewModelService.getVMSkeleton();
        return vm;
    }
}());