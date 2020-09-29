/**
 * Created by TDadam on 12/20/2017.
 */
(function () {
    angular.module('st.shared.filter')
        .filter('titleCase', function() {
            return function(input) {
                if(input === undefined || input === null || input.length === 0){
                    return input;
                }
                return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            };
        })
})();
