(function() {
    'use strict';

    angular.module('st.controllers.apply.site', [
    	'com.hrlogix.ats.global.services',
    	'com.hrlogix.ats.public.services',
    	'com.hrlogix.ats.private.services',
    	'com.hrlogix.ats.thirdparty.services',
    	'com.hrlogix.ats.applyflow',
    	'st.utils',
    	'st.services',
    	'st.candidate.auth',
		'st.model.dependency',
        'st.shared.filter',
		'ui.bootstrap'
    ]);

})();