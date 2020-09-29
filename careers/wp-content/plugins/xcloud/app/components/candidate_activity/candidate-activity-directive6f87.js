/**
 * Created by shanjock 4/19/2018
 */

angular
    .module('st.controllers.apply.site')
    .directive('candidateActivity', ['candidateActivityDataService', function (candidateActivityDataService) {
        return {
            restrict   : 'EA',
            replace    : true,
            transclude : false,
            controller : 'candidateActivityController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/candidate_activity/candidate-activity.html',
            link       : function (scope, elem, attr) {
                scope.vm_ca = candidateActivityDataService;
            }
        };
    }])

    .directive('compile', ['$compile', function ($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);