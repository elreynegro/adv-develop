/**
 * Created by Shanjock on 5/07/2018.
 */

angular.module('st.candidate.activity')
    .directive("dashboardAttachment",function(){
        return{
            restrict    : 'EA',
            replace     : true,
            transclude  : false,
            controller  : 'dashboardAttachmentController',
            templateUrl : '/wp-content/plugins/xcloud/app/components/dashboard_attachment/dashboard-attachment.html'
        }
    });
