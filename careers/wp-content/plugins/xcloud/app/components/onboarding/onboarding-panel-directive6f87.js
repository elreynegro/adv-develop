/**
 * Created by TDadam on 4/6/2018.
 */
angular
    .module('st.candidate.activity')
    .directive('onBoardingPanel', function() {
        return {
            restrict: 'EA',
            scope: {
                isShowComponent: '='
            },
            replace: true,
            transclude: false,
            controller: 'onBoardingController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/onboarding/onboarding-panel.html'
        };
    });
