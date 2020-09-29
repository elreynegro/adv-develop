(function() {
    'use strict';

    angular.module('st.candidate.auth', [
        'ngCookies',
    	'ngResource', 
    	'st.utils', 
    	'st.services',
        'st.model.dependency',
        'ui.bootstrap'
    ]);
})();