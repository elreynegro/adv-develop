angular.module('st.candidate.activity')
    .directive("downloadProfile",function(){
        return{
            restrict    : 'EA',
            replace     : true,
            transclude  : false,
            controller  : 'downloadProfileController',
            templateUrl : '/wp-content/plugins/xcloud/app/components/download_profile/download-profile.html'
        }
    });