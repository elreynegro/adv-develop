'use strict';

// Custom configuration items on a per system basis: local, cert, prod
//Client details
var clientName = _XC_CONFIG && _XC_CONFIG.org ? _XC_CONFIG.org : 'choc';
// var maxSessionStorageTime = 2 * 60 * 1000; // 2 minutes;
var maxSessionStorageTime = 30 * 60 * 1000; // 30 minutes;
var maxFileSizeforResume = 2048000;
// The default options for the ckEditor to be used for any site.
var ckEditorOptions = {};
var ATS_INSTANCE = '/ats-v2';
var ATSREPORTING_INSTANCE = "/atsreporting";
var DEBUG = _XC_CONFIG && _XC_CONFIG.env !== "prod";
var ATS_URL = "https://atscore.app.x-cloud.io";
var PAGE_TEMPLATES = {
    'thank_you': '/wp-content/plugins/xcloud/app/components/apply/thank-you.html'
};
var DASHBOARD_TABS = ['activity', 'edit', 'applications'];

var GIGYA_APIKEY = '3_ZMDOWjFQhiDPP1ioKYzuUGP4v3p2PVhBs-a7ZJt83lyKfEcKhQvl1uUGRfa2ZHEj';
var GIGYA_SOCIAL_SETTINGS =  {};
var CUSTOM_FIELD_MANAGEMENT_SETTINGS = {
    stream             : {
        apply      : {
            enabled     : false,
            controller  : 'applyController',
            templateFlag: 'apply'
        },
        leadCapture: {
            enabled     : false,
            controller  : 'applyController',
            templateFlag: 'join'
        }
    },
    navigation         : {
        url   : "",
        params: {}
    },
    resumeDataParseRule: {
        includeMandatoryFieldCheck: false
    }
};

var DYNAMIC_PAGE_SETTINGS = {
    RESET_PASSWORD_TEMPLATE_FLAG: 'reset'
};

var WCAG_COMPLIANCE_SETTINGS;

var EMAIL_PASSWORD_RESET_NAME = 'Password Reset';
var EMAIL_PASSWORD_RESET_TYPE = 'System';
var EMAIL_ACTIVATION_LINK_NAME = 'Activation Link';
var EMAIL_ACTIVATION_LINK_TYPE = 'System';
var ACTIVE_LANGUAGE_CODE_ID = 1;
var LANGUAGE_COLLECTION = [];

if(_XC_CONFIG) {
    if (_XC_CONFIG.env === 'stg') {
        ATS_URL = "https://pub-cert-atscore.app.x-cloud.io";
    }
    else if (_XC_CONFIG.env === 'dev') {
        ATS_URL = "https://dev-atscore.app.x-cloud.io"
    }

    GIGYA_APIKEY = _XC_CONFIG.keys.gigya;
    GIGYA_SOCIAL_SETTINGS = _XC_CONFIG.social;

    WCAG_COMPLIANCE_SETTINGS = (_XC_CONFIG.wCAGCompliance);
    CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.enabled = (_XC_CONFIG.custom_field_management.stream.apply.enabled === 'true');
    CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.enabled = (_XC_CONFIG.custom_field_management.stream.leadCapture.enabled === 'true');
    if(CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.enabled) CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.controller = 'candidatePoolController';
    if(CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.enabled) CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller = 'candidatePoolController';
    if (_XC_CONFIG.custom_field_management.resumeDataParseRule.includeMandatoryFieldCheck === "true"){
        CUSTOM_FIELD_MANAGEMENT_SETTINGS.resumeDataParseRule.includeMandatoryFieldCheck = true;
    }
    (function() {
        // Didn't want to add this var to a global level so I'm putting it in a self-calling function
        var content_proxy = '/?xccp=';
        if (_XC_CONFIG.lang && _XC_CONFIG.lang !== 'en') {
            content_proxy = '/' + _XC_CONFIG.lang + content_proxy;
        }

        PAGE_TEMPLATES['apply'] = _XC_CONFIG.pages['apply'] ? content_proxy + _XC_CONFIG.pages['apply'] : '';
        PAGE_TEMPLATES['profile'] = _XC_CONFIG.pages['profile'] ? content_proxy + _XC_CONFIG.pages['profile'] : '';
        PAGE_TEMPLATES['join'] = _XC_CONFIG.pages['join'] ? content_proxy + _XC_CONFIG.pages['join'] : '';
        PAGE_TEMPLATES['reset'] = _XC_CONFIG.pages['reset'] ? content_proxy + _XC_CONFIG.pages['reset'] : '';
        PAGE_TEMPLATES['forgot'] = _XC_CONFIG.pages['forgot'] ? content_proxy + _XC_CONFIG.pages['forgot'] : '';
        PAGE_TEMPLATES['login'] = _XC_CONFIG.pages['login'] ? content_proxy + _XC_CONFIG.pages['login'] : '';
        PAGE_TEMPLATES['thank_you'] = _XC_CONFIG.pages['thank_you'] ? content_proxy + _XC_CONFIG.pages['thank_you'] : '';
        PAGE_TEMPLATES['thank_you_apply'] = _XC_CONFIG.pages['thank_you_apply'] ? content_proxy + _XC_CONFIG.pages['thank_you_apply'] : '';
        PAGE_TEMPLATES['apply_join'] = _XC_CONFIG.pages['apply_join'] ? content_proxy + _XC_CONFIG.pages['apply_join'] : '';
        PAGE_TEMPLATES['job_alert'] = _XC_CONFIG.pages['job_alert'] ? content_proxy + _XC_CONFIG.pages['job_alert'] : '';
        PAGE_TEMPLATES['alert_thank_you'] = _XC_CONFIG.pages['alert_thank_you'] ? content_proxy + _XC_CONFIG.pages['alert_thank_you'] : '';
        PAGE_TEMPLATES['assessment_apply'] = _XC_CONFIG.pages['assessment_apply'] ? content_proxy + _XC_CONFIG.pages['assessment_apply'] : '';
        PAGE_TEMPLATES['microsite'] = '/wp-content/plugins/xcloud/app/apply/apply.html';
        if(CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.enabled){
            PAGE_TEMPLATES['microsite'] = '/wp-content/plugins/xcloud/app/components/candidate_pool/candidate-pool.html';
        }
    })();

    DASHBOARD_TABS = _XC_CONFIG.tabs;
    DYNAMIC_PAGE_SETTINGS.RESET_PASSWORD_TEMPLATE_FLAG =  (_XC_CONFIG.login_modal.disabled === false) ? 'profile' : DYNAMIC_PAGE_SETTINGS.RESET_PASSWORD_TEMPLATE_FLAG;
}

var JOBSAPI_ORG = 1806;
if(cws_opts && cws_opts.org){
    JOBSAPI_ORG = cws_opts.org;
}

// Reverse this for multilingual
if( _XC_CONFIG && !_XC_CONFIG.context ){
    _XC_CONFIG.context = {};
    _XC_CONFIG.context.continue = 'Save and Continue';
    _XC_CONFIG.context.submit = 'Submit Application';
    _XC_CONFIG.context.confirmation = '<p>By selecting the \'Submit Application\' button, I agree to the following:</p>' +
        '<p>I certify that the information contained in this application is true and complete to the best of my knowledge and understand that any misrepresentation, omission of facts, or misleading information is ground for refusal to hire, or if hired, dismissal.</p>' +
        '<p>I understand that every aspect of my employment with Symphony Talent, LLC ("the Company") shall be on an "at will" basis, meaning that I or the Company may terminate my employment at any time, or any reason, with or without cause. I also understand that the Company expressly reserves its inherent authority to manage and control the business enterprise and to exercise its sole discretion to determine all issues pertaining to my employment, including all matters pertaining to promotion, job assignment, and the size of the workforce, demotion, transfer and discipline. I further understand and agree that no one other than the President of the Company may modify or change the "at-will" nature of my employment relationship. Any such modifications must be in writing and signed by the President of the Company and me to be effective.</p>' +
        '<p>It is my understanding that my employment at the Company is contingent upon completion of a satisfactory background investigation, reference checks and verification of proof of work eligibility. A negative reference or report may or may not prevent me from working at the Company. However, the reference or report will be evaluated as to its effect upon my employment.</p>';
}

var ATSREPORTING_URL = "https://cert-data.hrapply.com";
var LEGACY_URL = "https://cert.hrapply.com/" + clientName;

var APPLY_STREAMS = {
    lcp      : _XC_CONFIG && _XC_CONFIG.streams.lcp ? _XC_CONFIG.streams.lcp : 35,
    lcp_short: _XC_CONFIG && _XC_CONFIG.streams.lcp_short ? _XC_CONFIG.streams.lcp_short : 35
};