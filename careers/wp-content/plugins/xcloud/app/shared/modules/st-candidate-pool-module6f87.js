/**
 * Created by TDadam on 12/16/2017.
 */
(function () {
    'use strict';
    angular
        .module('st.candidate.activity', [
            'com.hrlogix.ats.global.services',
            'com.hrlogix.ats.public.services',
            'ngCookies',
            'ui.bootstrap',
            'ngSanitize',
            'schemaForm',
            'pascalprecht.translate',
            'schemaForm-uiselect',
            'st.utils',
            'st.services',
            'ui.select',
            'st.shared.filter',
            'analytics.omni.tagging'
        ]);
})();
