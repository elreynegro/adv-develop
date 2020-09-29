/**
 * Created by TDadam on 2/11/2018.
 */
angular
    .module('st.candidate.screening.questions')
    .directive('screeningMessage', function() {
        return {
            restrict    : 'EA',
            replace     : true,
            transclude  : false,
            controller  : 'screeningMessageController',
            templateUrl : '/wp-content/plugins/xcloud/app/components/screening_questions/screening-message.html'
        };
    });
