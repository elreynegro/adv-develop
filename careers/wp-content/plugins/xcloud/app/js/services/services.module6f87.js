(function() {
    'use strict';

    angular.module('st.services', [
    	'com.hrlogix.ats.public.services',
    	'com.hrlogix.ats.private.services',
    	'st.utils',
        'st.model.dependency'
    ]);
})();