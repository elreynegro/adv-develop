/**
 * Created by shanjock 4/19/2018
 */

angular
    .module('st.controllers.apply.site')
    .directive('candidateActivityNotificationWidget', ['candidateActivityDataService', function (candidateActivityDataService) {
        return {
            restrict   : 'EA',
            replace    : true,
            transclude : false,
            controller : 'candidateActivityController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/candidate_activity/candidate-activity-notification-widget.html',
            link       : function (scope, elem, attr) {
                scope.vm_canw = candidateActivityDataService;
                console.log(scope.vm_canw);
            }
        };
    }]);