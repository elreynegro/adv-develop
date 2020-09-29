/**
 * Created by shanjock 4/19/2018
 */

angular
    .module('st.controllers.apply.site')
    .directive('candidateActivityNotification', ['candidateActivityDataService', function (candidateActivityDataService) {
        return {
            restrict   : 'EA',
            replace    : true,
            transclude : false,
            controller : 'candidateActivityController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/candidate_activity/candidate-activity-notification.html',
            link       : function (scope, elem, attr) {
                scope.vm_can = candidateActivityDataService;
            }
        };
    }]);