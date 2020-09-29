/**
 * Created by shanjock on 05/03/2018.
 */
(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('communicationTemplateService', communicationTemplateService);

    communicationTemplateService.$inject = ['$q', '$log'];

    function communicationTemplateService($q, $log) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            setActivationLink: setActivationLinkConfig,
            setResetPasswordLink: setResetPasswordLinkConfig
        };
        return service;

        //<editor-fold desc="API Interaction">
        function setActivationLinkConfig(_currentWorkFlow) {
            if(_XC_CONFIG && _XC_CONFIG.communicationTplConfig) {
                // set Activation Link Communication Template Name
                switch (_currentWorkFlow) {
                    case E_WORK_FLOW.JOIN_LCP:
                        EMAIL_ACTIVATION_LINK_NAME = _XC_CONFIG.communicationTplConfig[_XC_CONFIG.communicationTplConfig.join_lcp];
                        break;
                    case E_WORK_FLOW.APPLY_LCP:
                        EMAIL_ACTIVATION_LINK_NAME = _XC_CONFIG.communicationTplConfig[_XC_CONFIG.communicationTplConfig.apply_lcp];
                        break;
                    case E_WORK_FLOW.ALERT_LCP:
                        EMAIL_ACTIVATION_LINK_NAME = _XC_CONFIG.communicationTplConfig[_XC_CONFIG.communicationTplConfig.alert_lcp];
                        break;
                    case E_WORK_FLOW.MICROSITE_LCP:
                        EMAIL_ACTIVATION_LINK_NAME = _XC_CONFIG.communicationTplConfig[_XC_CONFIG.communicationTplConfig.microsite_lcp];
                        break;
                    case E_WORK_FLOW.APPLY:
                        EMAIL_ACTIVATION_LINK_NAME = _XC_CONFIG.communicationTplConfig.apply_tpl_name;
                        break;
                    default:
                        // Silence is golden.
                }
            }
        }

        function setResetPasswordLinkConfig() {
            if(_XC_CONFIG && _XC_CONFIG.communicationTplConfig) {
                // set Password Reset Communication Template Name
                EMAIL_PASSWORD_RESET_NAME = _XC_CONFIG.communicationTplConfig.pwd_reset_tpl_name;
            }
        }
    }
}());
