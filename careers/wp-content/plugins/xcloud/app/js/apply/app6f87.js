'use strict';

var MIN_RESUME_MATCH_THRESHOLD = 25;

var PAGE_COUNT_LIST = [{'label': '5', 'value': 5},
    {'label': '10', 'value': 10},
    {'label': '15', 'value': 15},
    {'label': '20', 'value': 20},
    {'label': '25', 'value': 25},
    {'label': 'All', 'value': 1000000}];

var hrlogixApp = angular.module('st.apply.site', [
    'ngRoute',
    'ngSanitize',
    'com.hrlogix.ats.applyflow',
    'ui.mask',
    'com.hrlogix.ats.global.services',
    'com.hrlogix.ats.public.services',
    'com.hrlogix.ats.private.services',
    'st.utils',
    'st.services',
    'st.candidate.auth',
    'st.controllers.apply.site',
    'st.model.dependency'
]);

hrlogixApp.run(['$log', function ($log) {

    $log.logLevels[MODULE_NAME_UTILS] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_ARRAY] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_LIST] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_LOCAL_STORAGE] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_META] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_OPTIONS] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_SESSION] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_UTILS_TABLE] = $log.LEVEL.INFO;

    $log.logLevels[MODULE_NAME_SERVICES] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_SERVICES_AI] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_SERVICES_APPLICATION] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_SERVICES_HIERARCHY] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_SERVICES_PEOPLE] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_SERVICES_REQUISITION] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_SERVICES_USER] = $log.LEVEL.INFO;

    $log.logLevels[MODULE_NAME_USER_AUTH] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_USER_AUTH_BUFFER] = $log.LEVEL.INFO;

    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_BASE] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_MAIN] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_DASHBOARD] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_LOGIN] = $log.LEVEL.INFO;

    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_ANALYTICS] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_MANAGE_JOBS] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_REQUISITION_SCREEN] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_APPLICATION_VIEW] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_REQUISITION_PROFILE] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_REQUISITION_EDIT] = $log.LEVEL.INFO;
    $log.logLevels[MODULE_NAME_CONTROLLERS_USER_SITE_SEARCH_APPLICATIONS] = $log.LEVEL.INFO;

    $log.logLevels['*'] = DEBUG ? $log.LEVEL.TRACE : $log.LEVEL.ERROR;

}]);

hrlogixApp.config(['$locationProvider', '$routeProvider', '$logProvider', '$httpProvider', function ($locationProvider, $routeProvider, $logProvider, $httpProvider) {

    $locationProvider.hashPrefix('');
    $logProvider.debugEnabled(DEBUG);
    $routeProvider.when('/deprecated/', {
        templateUrl: 'notemplate',
        controller : 'nocontroller',
        caseInsensitiveMatch: true
    }).when('/apply/thank-you/', {
        templateUrl: PAGE_TEMPLATES['thank_you_apply'],
        controller : 'applyThankYouController',
        caseInsensitiveMatch: true
    }).when('/apply/assessment/', {
        templateUrl: PAGE_TEMPLATES['assessment_apply'],
        controller : 'assessmentController',
        caseInsensitiveMatch: true
    }).when('/apply/join/', {
        templateUrl: PAGE_TEMPLATES['apply_join'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/apply/join/:jobId/:stepId/:pageName/', {
        templateUrl: PAGE_TEMPLATES['apply_join'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/apply/join/:jobId/:stepId/', {
        templateUrl: PAGE_TEMPLATES['apply_join'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/apply/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.templateFlag],
        controller: CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.controller,
        caseInsensitiveMatch: true
    }).when('/apply/:requisitionId/:stepId/:pagename/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.templateFlag],
        controller: CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.controller,
        caseInsensitiveMatch: true
    }).when('/apply/:requisitionId/:stepId/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.templateFlag],
        controller: CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.controller,
        caseInsensitiveMatch: true
    }).when('/apply/:requisitionId/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.templateFlag],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.apply.controller,
        caseInsensitiveMatch: true
    }).when('/profile/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/join/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.templateFlag],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/join/:stepId/:pagename/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.templateFlag],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/join/:stepId/', {
        templateUrl: PAGE_TEMPLATES[CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.templateFlag],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/job-alert/', {
        templateUrl: PAGE_TEMPLATES['job_alert'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/job-alert/:jobId/:stepId/:pagename/', {
        templateUrl: PAGE_TEMPLATES['job_alert'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/job-alert/:jobId/:stepId/', {
        templateUrl: PAGE_TEMPLATES['job_alert'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/job-alert/:jobId/', {
        templateUrl: PAGE_TEMPLATES['job_alert'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/campaign/:name/', {
        templateUrl: PAGE_TEMPLATES['microsite'],
        controller : CUSTOM_FIELD_MANAGEMENT_SETTINGS.stream.leadCapture.controller,
        caseInsensitiveMatch: true
    }).when('/profile/login/', {
        templateUrl: PAGE_TEMPLATES['login'],
        controller : 'loginController',
        caseInsensitiveMatch: true
    }).when('/profile/thank-you/', {
        templateUrl: PAGE_TEMPLATES['thank_you'],
        controller : 'applyController',
        caseInsensitiveMatch: true
    }).when('/profile/alert-thank-you/', {
        templateUrl: PAGE_TEMPLATES['alert_thank_you'],
        controller : 'thankYouAlertController',
        caseInsensitiveMatch: true
    }).when('/profile/reset-password/', {
        templateUrl: PAGE_TEMPLATES[DYNAMIC_PAGE_SETTINGS.RESET_PASSWORD_TEMPLATE_FLAG],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/forgot-password/', {
        templateUrl: PAGE_TEMPLATES['forgot'],
        controller : 'loginController',
        caseInsensitiveMatch: true
    }).when('/profile/applications/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/todos/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/interviews/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/interviews/:interviewId/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/offers/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/offers/:offerId/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/onboarding/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/assessments/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/edit/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/preferences/', {
        templateUrl: PAGE_TEMPLATES['profile'],
        controller : 'accountController',
        caseInsensitiveMatch: true
    }).when('/profile/actionpreferences/', {
        templateUrl         : '/wp-content/plugins/xcloud/app/apply/preferences.html',
        controller          : 'preferencesController',
        caseInsensitiveMatch: true
    });

   $locationProvider.html5Mode({enabled: true, rewriteLinks: false, requireBase: false});
}]);

hrlogixApp.run(['$route', '$rootScope', '$location', '$log', function ($route, $rootScope, $location, $log) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
                XCLOUD.refresh_language_switcher();
            });
        }

        var ret = original.apply($location, [path]);
        XCLOUD.refresh_language_switcher();

        return ret;
    };

    $rootScope.$on('$viewContentLoaded', XCLOUD.view_loaded);
}]);
