'use strict';

var APPLY_FLOW_TEMPLATE_BASE = '/wp-content/plugins/xcloud/app/templates/';

function ApplyFlowData(candidateId, applicationId, requisitionId) {
    this.candidateId = candidateId;
    this.applicationId = applicationId;
    this.requisitionId = requisitionId;
}

var applyFlowModule = angular.module('com.hrlogix.ats.applyflow', [ 'com.hrlogix.ats.global.services',
                                                                    'com.hrlogix.ats.public.services',
                                                                    'st.shared.widget',
                                                                    'st.candidate.activity',
                                                                    'st.utils', 'st.services', 'ngCookies','schemaForm','pascalprecht.translate','schemaForm-uiselect','ui.select', 'ngSanitize','st.candidate.screening.questions','st.candidate.auth']);

applyFlowModule.controller('applyFlowMainController', ['$scope', '$log', '$location', '$filter', '$q', '$window', '$rootScope', 'applyflow', 'SessionStorage', 'ListService', 'LocalStorage', 'requisition', '$sce', '$timeout','ApplicationState','ApplyWorkFlow','CandidateWorkFlow',
    function ($scope, $log, $location, $filter, $q, $window, $rootScope, applyflow, SessionStorage, ListService, LocalStorage, requisition, $sce, $timeout,ApplicationState,ApplyWorkFlow,CandidateWorkFlow) {

    var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW);
    var $ = jQuery;

    initialize();

    function initialize() {
        $scope.reqId = $location.search().link;
        $scope.applyReq = null;
        $rootScope.req = null;
        $scope.applyStream = {};
        $scope.isLCP = false;
        $scope.isLandingPage = _XC_CONFIG.landing_page !== false;

        SessionStorage.remove('applyReq'); // reset job deatils on refresh

        //Set Candidate Work Flow
        CandidateWorkFlow.current.setFromURLPath($location.path());

        /* REMOVE LATER, KEEPING FOR REFERENCE
        if ($scope.reqId !== null && $scope.reqId !== undefined) {

            if ($scope.applyReq !== null && $scope.applyReq !== undefined) {

                if ($scope.applyReq.applyStreamId !== null && $scope.applyReq.applyStreamId !== undefined) {
                    $scope.applyStream.applyStreamId = $scope.applyReq.applyStreamId;
                    $scope.requisitionId = $scope.applyReq.requisitionId;
                } else {
                    $scope.applyStream.applyStreamId = APPLY_STREAMS.ats;
                    $scope.requisitionId = $scope.applyReq.requisitionId;
                }

            } else {
                $scope.applyStream.applyStreamId = APPLY_STREAMS.lcp;
                $scope.requisitionId = null;
            }

        } else {
            $scope.applyStream.applyStreamId = APPLY_STREAMS.lcp;
            $scope.requisitionId = null;
        }
         */

        // The apply page should only be used for... applies, redirect to /apply/join/ for LCP
        if($location.path() === '/apply/' && ($location.search().job || !$location.search().link)){
            $window.location.href = '/apply/join/' + ($location.search().job ? '?job=' + $location.search().job : '');
        }

        if($location.path() === '/profile/join/'){
            $scope.isLCP = true;
        }

        getReq($scope.reqId).then(function(req) {
            $scope.applyReq = req;
            SessionStorage.set('applyReq', req);
            if(_XC_CONFIG.streams.lcp !== APPLY_STREAMS.lcp){
                APPLY_STREAMS.lcp = _XC_CONFIG.streams.lcp;
            }
            var applyStreamId = req ? req.applyStreamId : APPLY_STREAMS.lcp;
            if($scope.applyReq)
            {
                ApplicationState.localStorage.requisition.id.set($scope.applyReq.requisitionId);
            }
            // Landing pages can define the stream id in the post meta, which is exposed in the config object
            if($scope.isLandingPage && _XC_CONFIG.landing_page.stream_id){
                applyStreamId = _XC_CONFIG.landing_page.stream_id;
            }
            var assmtPositionCode = [];
            if($scope.applyReq !== undefined && $scope.applyReq !== null && $scope.applyReq.assmtPositionCode !== null && $scope.applyReq.assmtPositionCode.length > 0) {
                assmtPositionCode = $scope.applyReq.assmtPositionCode.split(',');
            }
            ApplicationState.localStorage.requisition.assessmentPositionCode.set(assmtPositionCode);
            $scope.applyStream.applyStreamId = req ? req.applyStreamId : applyStreamId;
            if(typeof $scope.applyStream.applyStreamId === 'undefined'){
                $('main .container-fluid').prepend(ListService.html404Content());
            }else{
                if($scope.applyReq !== null && $scope.applyReq !== undefined) {
                    ApplicationState.screeningInMessage = $scope.applyReq.screenInMessage;
                    ApplicationState.screeningOutMessage = $scope.applyReq.screenOutMessage;
                }
                $scope.applyStream.requisitionId = $scope.reqId;
                $scope.candidateId = null;
                $scope.applicationId = null;

                $scope.applyFlowData = new ApplyFlowData($scope.candidateId, $scope.applicationId, $scope.requisitionId);

                applyflow.getApplyStreamCfgs({applyStreamId: $scope.applyStream.applyStreamId}).$promise.then(function (results) {

                    $scope.applyStreamConfigs = $filter('orderBy')(normalizeObjects(results), 'sortOrder');

                    applyflow.getApplyContainers({applyStreamId: $scope.applyStream.applyStreamId}).$promise.then(function (results) {
                        var applyContainers = normalizeObjects(results);
                        for (var key in $scope.applyStreamConfigs) {
                            for (var innerKey in applyContainers) {
                                if ($scope.applyStreamConfigs[key].applyContainerId === applyContainers[innerKey].applyContainerId) {
                                    $scope.applyStreamConfigs[key].applyContainer = applyContainers[innerKey];
                                    break;
                                }
                            }
                        }

                    }, function (reason) {
                        logger.error(reason);
                    });

                }, function (reason) {
                    logger.error(reason);
                });
            }
        });
    }

    function getReq(reqId){
        var defer = $q.defer();
        ApplyWorkFlow.reset();
        ApplyWorkFlow.first();
        if(!reqId){
            // Treat as lead capture if there's no req
            defer.resolve(null);
        }
        else if($location.path() === '/profile/job-alert/'){
            requisition.getRequisition({id: reqId}).$promise.then(function(result){
                $scope.applyStream.applyStreamId = result ? result.applyStreamId : APPLY_STREAMS.lcp;
                if(typeof $scope.applyStream.applyStreamId != 'undefined'){
                    $rootScope.req = result;
                    var reqTitle = result.title;
                    $rootScope.req.title = $sce.trustAsHtml(reqTitle);
                }
                defer.resolve(null);
            });
        }
        else{
            requisition.getRequisition({id: reqId}).$promise.then(function(result){
                $scope.applyStream.applyStreamId = result ? result.applyStreamId : APPLY_STREAMS.lcp;
                if(typeof $scope.applyStream.applyStreamId != 'undefined'){
                    $rootScope.req = result;
                    var reqTitle = result.title;
                    $rootScope.req.title = $sce.trustAsHtml(reqTitle);
                }
                defer.resolve(result);
            });
        }
        return defer.promise;
    }

}]);

applyFlowModule.directive('applyFlow', function () {
    return {
        restrict: 'E',
        scope: {
            applyStream: "=",
            candidateId: "=",
            applicationId: "=",
            requisitionId: "="
        },
        replace: true,
        transclude: false,
        controller: 'applyFlowMainController',
        templateUrl: APPLY_FLOW_TEMPLATE_BASE + 'apply-flow.html'
    };
});

applyFlowModule.controller('applyContainerController', ['$scope', '$log', '$filter', 'applyflow', function ($scope, $log, $filter, applyflow) {

    $scope.initialized = false;

    $scope.getTemplateUrl = function() {
        if ($scope.applyStreamCfg.applyContainer !== undefined) {
            initialize();
            return APPLY_FLOW_TEMPLATE_BASE + 'containers/' + $scope.applyStreamCfg.applyContainer.templateName;
        } else {
            return '';
        }
    };

    function initialize() {
        if (!$scope.initialized) {
            $scope.initialized = true;
            jQuery('.loading-container').css('display', 'block');
            applyflow.getApplyContainerCfgs( { applyStreamCfgId: $scope.applyStreamCfg.applyStreamCfgId }).$promise.then(function(results) {

                $scope.applyContainerConfigs = $filter('orderBy')(normalizeObjects(results), 'sortOrder');

                applyflow.getApplyForms( { applyStreamCfgId: $scope.applyStreamCfg.applyStreamCfgId }).$promise.then(function(results) {

                    var applyForms = normalizeObjects(results);
                    for (var key in $scope.applyContainerConfigs) {
                        for (var innerKey in applyForms) {
                            if ($scope.applyContainerConfigs[key].applyFormId === applyForms[innerKey].applyFormId) {
                                $scope.applyContainerConfigs[key].applyForm = applyForms[innerKey];
                                break;
                            }
                        }
                    }
                }, function(reason) {
                	logger.error(reason);
                });

            }, function(reason) {
            	logger.error(reason);
            });
        }
    }

}]);

applyFlowModule.directive('applyFlowContainer', function() {
    return {
        restrict: 'E',
        scope: {
            applyFlowData: "=",
            applyStream: "=",
            applyStreamCfg: '=',
            isLastContainer: '=',
            applyContainerId:'='
        },
        replace: true,
        transclude: false,
        controller: 'applyContainerController',
        template: '<ng-include src="getTemplateUrl()"/>'
    };
});

applyFlowModule.controller('applyFormController', ['$scope', '$log', 'applyflow', function ($scope, $log, applyflow) {

    $scope.initialized = false;

    $scope.getTemplateUrl = function() {
        if ($scope.applyForm !== undefined) {
            initialize();
            return APPLY_FLOW_TEMPLATE_BASE + 'forms/' + $scope.applyForm.templateName;
        } else {
            return '';
        }
    };

    function initialize() {
        if (!$scope.initialized) {
            $scope.initialized = true;

            applyflow.getApplyFormCfgs( { applyFormId: $scope.applyForm.applyFormId }).$promise.then(function(results) {
                var applyFormConfigs = normalizeObjects(results);
                for (var key in applyFormConfigs) {
                    if ($scope.applyStream.applyStreamId === applyFormConfigs[key].applyStreamId) {
                        $scope.applyFormConfig = applyFormConfigs[key];
                        $scope.applyFormConfig = angular.fromJson($scope.applyFormConfig.applyFormConfig);
                        break;
                    }
                }

            }, function(reason) {
            	logger.error(reason);
            });
        }
    }

}]);

applyFlowModule.directive('applyFlowForm', function() {
    return {
        restrict: 'E',
        scope: {
            applyFlowData: "=",
            applyStream: "=",
            applyForm: '=',
            isLastContainer: '=',
            isLastForm: '=',
            applyFormId: '=',
            applyStreamId:'=',
            applyContainerId:'='
        },
        replace: true,
        transclude: false,
        controller: 'applyFormController',
        template: '<ng-include src="getTemplateUrl()"/>'
    };
});

applyFlowModule.directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require : 'ngModel',
        scope   : false,
        link    : function (scope, element, attrs, ctrl) {
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: '-100:+0',
                onSelect  : function (date) {
                    ctrl.$setViewValue(date);
                    scope.date = date;
                    scope.$apply();
                    //scope.bgCandidate.dob.$invalid = false;
                }
            });

            ctrl.$validators.dobMax = function(modelVal, viewVal){
                // Stands for yyyy-mm-dd format
                if(modelVal === '' || modelVal === null || modelVal === undefined ){
                    return true;
                }
                if(modelVal !== undefined){
                    if (modelVal.toString().length < 10) {
                        return false;
                    }
                }

                var inputDate = Date.parse(modelVal);
                // Make sure it can be parsed
                if(isNaN(inputDate)){
                    return false;
                }
                inputDate = new Date(modelVal);
                return inputDate < new Date();
            };

        }
    };
});

applyFlowModule.directive('jqexpirationdatepicker1', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require : 'ngModel',
        scope   : false,
        link    : function (scope, element, attrs, ctrl) {
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: 'c-100:c+100',
                onSelect  : function (date) {
                    if(scope.compareDate !== undefined){
                        scope.compareDate(ctrl.$name,date,ctrl).then(function(compareResult){
                            compareResult = normalizeObjects(compareResult);
                            if(compareResult){
                                ctrl.$setViewValue(date);
                                scope.date = date;
                                $timeout(function() {
                                    scope.$apply();
                                }, 500);
                            } else{
                                ctrl.$setViewValue("");
                                scope.date = "";
                                $timeout(function() {
                                    scope.$apply();
                                }, 500);
                            }
                        });
                    }else{
                        ctrl.$setViewValue(date);
                        scope.date = date;
                        scope.$apply();
                    }
                }
            });

            ctrl.$validators.date_MinMax = function(modelVal, viewVal){
                // Stands for yyyy-mm-dd format
                if(modelVal !== undefined && modelVal !== null){
                    if (modelVal.toString().length < 10) {
                        return false;
                    }
                }

                var inputDate = Date.parse(modelVal);
                // Make sure it can be parsed
                if(isNaN(inputDate)){
                    return false;
                }

                return true;
            };

        }
    };
}]);


applyFlowModule.directive('jqexpirationdatepicker', function () {
    return {
        restrict: 'A',
        require : 'ngModel',
        scope   : false,
        link    : function (scope, element, attrs, ctrl) {
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: 'c-0:c+100',
                onSelect  : function (date) {
                    ctrl.$setViewValue(date);
                    scope.date = date;
                    scope.$apply();
                    //scope.bgCandidate.dob.$invalid = false;
                }
            });

            ctrl.$validators.date_6Max = function(modelVal, viewVal){
                // Stands for yyyy-mm-dd format
                if(modelVal != undefined){
                    if (modelVal.toString().length < 10) {
                        return false;
                    }
                }

                var inputDate = Date.parse(modelVal);
                // Make sure it can be parsed
                if(isNaN(inputDate)){
                    return false;
                }
                inputDate = new Date(modelVal);
                return inputDate > new Date();
            };

        }
    };
});

applyFlowModule.directive('i18n', function () {
    return {
        restrict: 'A',
        link    : function (scope, element, attrs) {
            var str = element.html();
            var context = 'XCC';
            if(attrs['i18n']){
                context = attrs['i18n'];
            }
            element.html(XCLOUD.i18n(str, context));
        }
    };
});
