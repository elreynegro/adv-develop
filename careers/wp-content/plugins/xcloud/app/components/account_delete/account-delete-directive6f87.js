/**
 * Created by Shanjock on 5/07/2018.
 */

angular.module('st.candidate.activity')
    .directive("accountDelete",function(){
        return{
            restrict    : 'EA',
            replace     : true,
            transclude  : false,
            controller  : 'accountDeleteController',
            templateUrl : '/wp-content/plugins/xcloud/app/components/account_delete/account-delete.html'
        }
    });
