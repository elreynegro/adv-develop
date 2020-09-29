/**
 * Created by TDadam on 12/16/2017.
 */
/**
 * Created by TDadam on 12/16/2017.
 */
(function() {
    'use strict';

    function formMetaData(applyStreamId,formId,schemaMetaData,formMetaData) {
        this.schemaStreamId = applyStreamId;
        this.schemaFormId = formId;
        this.schemaMetaData = schemaMetaData;
        this.formMetaData = formMetaData;
    }


    function applyFlowData(candidateId, applicationId, requisitionId,formMetaDataCollection) {
        this.candidateId = candidateId;
        this.applicationId = applicationId;
        this.requisitionId = requisitionId;
        this.formMetaDataCollection = formMetaDataCollection;
    }

    angular
        .module('st.candidate.activity')
        .controller('candidatePoolController', candidatePoolController);

    candidatePoolController.$inject = ['$scope', '$log', '$location', '$filter', '$q', '$window', '$rootScope','$controller','$timeout','$cookies', '$routeParams','SessionStorage', 'ListService', 'LocalStorage', 'requisition', '$sce','authService','candidate','jobsapi','metadata','ModelDependencyFactory','privateCandidate','ApplicationState','ApplyWorkFlow','candidateAssessmentService', 'CandidateWorkFlow','migrationService'];

    function candidatePoolController($scope, $log, $location, $filter, $q, $window, $rootScope, $controller,$timeout,$cookies, $routeParams,SessionStorage, ListService, LocalStorage, requisition, $sce,authService,candidate,jobsapi,metadata,ModelDependencyFactory,privateCandidate,ApplicationState,ApplyWorkFlow,candidateAssessmentService, CandidateWorkFlow,migrationService) {
        angular.extend(this, $controller('candidateBaseHelper',  {$scope: $scope}));

        $rootScope.sessionNotificationShow = false;
        $rootScope.showAccount = true;

        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW);
        var $ = jQuery;

        initialize();

        function initialize() {
            $scope.resetDataConsumerOfResume();
            $scope.resetParserOfResume();
            $scope.jobId = $location.search().job;
            $scope.reqId = $location.search().link;
            if(_XC_CONFIG.form_naming_enabled === true) {
                if (!$scope.jobId && !$scope.reqId) { // backward compatibility
                    $scope.reqId = $routeParams.requisitionId;
                    $scope.jobId = $routeParams.jobId;
                }else{
                    $scope.jobId = $scope.jobId ? parseInt($scope.jobId) : $scope.jobId ;
                    $scope.reqId = $scope.reqId ? parseInt($scope.reqId) : $scope.reqId ;
                }
            }
            $scope.reqIdLink = $scope.reqId;
            ApplicationState.requisitionId = $scope.reqId;
            $scope.applyReq = null;
            $rootScope.req = null;
            $scope.applyStream = {};
            $scope.isLandingPage = _XC_CONFIG.landing_page !== false;
            $scope.externalJob = {
                isEnabled: false
            };
            $scope.job = {};
            //$scope.jobId = $location.search().job;
            $scope.isInValidJob = false;

            if(_XC_CONFIG.streams.lcp !== APPLY_STREAMS.lcp){
                APPLY_STREAMS.lcp = _XC_CONFIG.streams.lcp;
            }

            $scope.jobUrl = null;
            $scope.socialAuthenticationEnablerProxy =  applyFlowSocialAuthenticationEnabler;
            $scope.lastFormProxyIndicator = "lastContainerHandler";
            $scope.semaphoreCollection = {
                isLastFormSpecificationRuleApplicable: $scope.angularSchemaObserver.formStyleHandler.viewStyle !== 5,
                progressBar                          : $scope.globalProgressBarHandler,
                onBoarding                           : false,
                notificationMessage                  : $scope.notificationSemaphoreHandler,
                isLeadCapture                        : false,
                isDashboard                          : false,
                AlwaysShowProgressbar                : false,
                captureOmniTagging                   : false,
                startup                              : {openGDPR:  migrationService.GDPR.migrationWindow.open}
            };
            SessionStorage.remove('applyReq');

            // The apply page should only be used for... applies, redirect to /apply/join/ for LCP
            if($location.path() === '/apply/' && ($scope.jobId || !$scope.reqId)){
                // manipulating path from apply to apply/join
                CandidateWorkFlow.current.setFromURLPath('/apply/join/', $scope.reqId || $scope.jobId);
            }else{
                //Set Candidate Work Flow
                CandidateWorkFlow.current.setFromURLPath($location.path(), $scope.reqId || $scope.jobId);
            }
            if($scope.isLeadCaptureForModal === true){
                CandidateWorkFlow.current.setFromURLPath('/profile/join/');
            }
            $scope.angularSchemaObserver.registerExternalJob($scope.externalJob);
            var path = $location.path();

            $scope.semaphoreCollection.isLeadCapture = $scope.isLandingPage;
            $scope.semaphoreCollection.isDashboard = $scope.angularSchemaObserver.formStyleHandler.viewStyle === 5;
            $rootScope.dashboardFMEnabled = $scope.semaphoreCollection.isDashboard;

            switch (CandidateWorkFlow.current.get()){
                case E_WORK_FLOW.APPLY_LCP:
                case E_WORK_FLOW.ALERT_LCP:
                    $scope.semaphoreCollection.isLeadCapture = true;
                    break;
                case E_WORK_FLOW.JOIN_LCP:
                    $scope.semaphoreCollection.isLeadCapture = true;
                    $scope.semaphoreCollection.redirectHandler = true;
                    break;
            }
            if($scope.semaphoreCollection.isLeadCapture) {
                $scope.semaphoreCollection.isLastFormSpecificationRuleApplicable = false;
                $scope.socialAuthenticationEnablerProxy = leadCaptureSocialAuthenticationEnabler;
                $scope.lastFormProxyIndicator = "updateCandidateSendEmail";
                if ($scope.jobId) {
                    if (authService.isLoggedIn) {
                        privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                            $scope.applyCandidate = normalizeObjects(result);
                            authService.setBasicCandidate($scope.applyCandidate);
                            processJobdata();
                        });
                    }
                    else {
                        processJobdata();
                    }
                }

                if(CandidateWorkFlow.current.get() === E_WORK_FLOW.ALERT_LCP){
                    $scope.isAlertLcp = true;
                    if(!$scope.jobId && !$scope.reqId)
                        $window.location.href = '/profile/join/';
                }

                if($scope.reqId) {
                    if (authService.isLoggedIn) {
                        privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                            $scope.applyCandidate = normalizeObjects(result);
                            authService.setBasicCandidate($scope.applyCandidate);
                            if ($cookies.get('xcc') || authService.isLoggedIn) {
                                $scope.semaphoreCollection.AlwaysShowProgressbar = true;
                                logger.log('User already completed, continue to ATS.');
                                ModelDependencyFactory.candidateHelper.captureAtsLead($scope.reqId, $scope.applyCandidate.candidateId).then(function (response) {
                                    $scope.semaphoreCollection.AlwaysShowProgressbar = false;
                                    $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                }, function (reason) {
                                    $scope.semaphoreCollection.AlwaysShowProgressbar = false;
                                    $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                });

                            }
                        });

                    }
                }
            }

            $scope.buildModelProcessor();
            getMetadata($scope.reqId).then(function(results) {
                ApplyWorkFlow.reset();
                ApplyWorkFlow.first();
                if(!$scope.semaphoreCollection.isLeadCapture){
                    $scope.applyReq = results;
                    SessionStorage.set('applyReq', results);
                    ApplicationState.localStorage.requisition.id.set($scope.applyReq.requisitionId);
                    var applyStreamId = results ? results.applyStreamId : APPLY_STREAMS.lcp;
                    // Landing pages can define the stream id in the post meta, which is exposed in the config object
                    if($scope.isLandingPage && _XC_CONFIG.landing_page.stream_id){
                        //Set Candidate Work Flow for Landing Page
                        CandidateWorkFlow.current.set(E_WORK_FLOW.MICROSITE_LCP);
                        applyStreamId = _XC_CONFIG.landing_page.stream_id;
                    }
                    $scope.applyStream.applyStreamId = results ? results.applyStreamId : applyStreamId;
                    if(!$scope.semaphoreCollection.isLeadCapture && typeof $scope.applyStream.applyStreamId === 'undefined'){
                        $('main .container-fluid').prepend(ListService.html404Content());
                    }else{
                        $scope.applyStream.requisitionId = $scope.reqId;
                        $scope.candidateId = null;
                        $scope.applicationId = null;
                        //$scope.applyFlowData = new ApplyFlowData($scope.candidateId, $scope.applicationId, $scope.requisitionId,$scope.formMetaDataCollection);
                        var assmtPositionCode = [];
                        if($scope.applyReq.assmtPositionCode !== null && $scope.applyReq.assmtPositionCode.length > 0) {
                            assmtPositionCode = $scope.applyReq.assmtPositionCode.split(',');
                        }
                        ApplicationState.localStorage.requisition.assessmentPositionCode.set(assmtPositionCode);
                    }
                } else{
                    $scope.candidateId = null;
                    $scope.applicationId = null;
                    //$scope.applyFlowData = new ApplyFlowData($scope.candidateId, -1, -1,$scope.formMetaDataCollection);
                }
            });
        }

        function processJobdata() {
            jobsapi.getJob({jobId: $scope.jobId}).$promise.then(function (result) {
                result = normalizeObjects(result);
                if(_XC_CONFIG.xcloudPageAttributes.destination !== undefined){
                    $scope.jobUrl = _XC_CONFIG.xcloudPageAttributes.destination;
                }else{
                    // There are 3 possible jobsapi fields for the apply url, this filter let's us change which one is used
                    var ats_url_field = XCLOUD.apply_filter('jobsapi_ats_field', 'seo_url');
                    $scope.jobUrl = result[ats_url_field];
                }
                $scope.job = result;
                $rootScope.job = result;
                $rootScope.jobTitle = $sce.trustAsHtml(result.title);
                //Data Contract
                // There are 3 possible jobsapi fields for the apply url, this filter let's us change which one is used
                var ats_url_field = XCLOUD.apply_filter('jobsapi_ats_field', 'seo_url');
                $scope.externalJob.isEnabled = true;
                $scope.externalJob.Id = $scope.jobId;
                $scope.externalJob.Url = result[ats_url_field];
                $scope.externalJob.details = result;

                //pre-populate Area Of Interest using Job's API result, only if areaInterest is not set
                $scope.genericDataPopulate($scope.job);

                $scope.angularSchemaObserver.registerExternalJob($scope.externalJob);
                if ($cookies.get('xcc') || authService.isLoggedIn) {
                    $scope.semaphoreCollection.AlwaysShowProgressbar = true;
                    logger.log('User already completed, continue to ATS.');
                    ModelDependencyFactory.candidateHelper.captureNonAtsLead($scope.jobId, $scope.applyCandidate.candidateId).then(function (response) {
                        $scope.semaphoreCollection.AlwaysShowProgressbar = false;
                        $scope.modelProcessor.baseHelper.seoRedirectHandler();
                    },function (reason) {
                        $scope.semaphoreCollection.AlwaysShowProgressbar = false;
                        $scope.modelProcessor.baseHelper.seoRedirectHandler();
                    });

                }
                $scope.isInValidJob = false;
            },function(error){
                $scope.isInValidJob = true;
            });
        }
        function getMetadata(reqId){
            var defer = $q.defer();
            $scope.schemaInterpolation.consumerEmitReceiver = $scope.modelProcessor.baseHelper.emitReceiver;
            if($scope.semaphoreCollection.isLeadCapture){
                var streamId = APPLY_STREAMS.lcp;
                if($location.search().sId !== undefined && $location.search().sId !== null) {
                    streamId = $location.search().sId;
                }
                if(_XC_CONFIG.landing_page && _XC_CONFIG.landing_page.stream_id){
                    streamId = _XC_CONFIG.landing_page.stream_id;
                }

                metadata.getStreamCustomFieldMetaData({streamId: streamId}).$promise.then(function(result){
                    $scope.schemaInterpolation.performMetaDataInterpolation(result.metaData,$scope.semaphoreCollection,onInterpolationSuccess);
                    defer.resolve(result);
                },function(reason){
                    logger.error(reason);
                    $scope.notificationSemaphoreHandler(true,$scope.schemaInterpolation.notificationEngine.interpolation.generalMessage);
                    $scope.globalProgressBarHandler(false);
                });
                //if it is alert lcp need requisition data to populate job title
                if(CandidateWorkFlow.current.get() === E_WORK_FLOW.ALERT_LCP){
                    metadata.getCustomFieldMetaData({requisitionId: reqId}).$promise.then(function(result) {
                        result = ApplicationState.session.requisition.addAttributes(result);
                        $rootScope.req = result.requisition;
                        var reqTitle = result.requisition.title;
                        $rootScope.req.title = $sce.trustAsHtml(reqTitle);
                        defer.resolve(result.requisition);
                    },function(reason){
                        logger.error(reason);
                        });
                }
            }
            else{
                metadata.getCustomFieldMetaData({requisitionId: reqId}).$promise.then(function(result){
                    result = ApplicationState.session.requisition.addAttributes(result);
                    $scope.applyStream.applyStreamId = result.requisition ? result.requisition.applyStreamId : APPLY_STREAMS.lcp;
                    if(typeof $scope.applyStream.applyStreamId !== 'undefined'){
                        $rootScope.req = result.requisition;
                        var reqTitle = result.requisition.title;
                        $rootScope.req.title = $sce.trustAsHtml(reqTitle);
                        $scope.schemaInterpolation.performMetaDataInterpolation(result.metaData,$scope.semaphoreCollection,onInterpolationSuccess);
                    }
                    defer.resolve(result.requisition);
                },function(reason){
                    logger.error(reason);
                    $scope.globalProgressBarHandler(false);
                    $scope.notificationSemaphoreHandler(true,$scope.schemaInterpolation.notificationEngine.interpolation.generalMessage);
                });
            }
            return defer.promise;
        }

        $scope.checkAlreadyApplied = function(){
            for(var i = 0, len = $scope.candidateApplications.length; i < len; i++){
                if($scope.candidateApplications[i].requisitionId === parseInt($scope.reqIdLink)){
                    $scope.alreadyApplied = true;
                    $rootScope.alreadyApplied = true;
                }
            }
        };

        function onInterpolationSuccess (results){
            candidateAssessmentService.loadDomainLookup();
            $scope.constructAngularSchemaObserver(results);
            $scope.preLoadExternalDataSource = false;

            if(authService.isLoggedIn === true && CandidateWorkFlow.current.get() === E_WORK_FLOW.JOIN_LCP && _XC_CONFIG.landing_page ===false) {
                $scope.modelProcessor.baseHelper.seoRedirectHandler();
            }

            $scope.formStyle = results[0].formStyle;
            if($scope.angularSchemaObserver.formStyleHandler.viewStyle === undefined || $scope.angularSchemaObserver.formStyleHandler.viewStyle === -1){
                if($scope.semaphoreCollection.isLeadCapture === true){
                    $scope.angularSchemaObserver.formStyleHandler.viewStyle = $scope.angularSchemaObserver.formStyleHandler.viewStylesEnum.none;
                }else{
                    $scope.angularSchemaObserver.formStyleHandler.viewStyle = $scope.angularSchemaObserver.formStyleHandler.viewStylesEnum.accordion;
                }
            }
            //for parsing data from resume for fields corresponding to each table. Only do it for lead capture or if the applyForm has only one form
            if ($scope.semaphoreCollection.isLeadCapture || results.length === 1)
                if (results[0].tableMap !== undefined) {
                    results[0].table = [];
                    angular.forEach(results[0].tableMap, function (value) {
                        if (value.name === "work_history" || value.name === "candidate" || value.name === "education") {
                            results[0].table.push(value.name);
                        }
                    });
                }
            if (authService.isLoggedIn !== true) {
                try {
                    this.socialProfile =  $scope.socialProvider.getProfile();
                    if(this.socialProfile === null || this.socialProfile === undefined) {
                        var _session = $scope.socialProvider.utility.sessionFromStorage();
                        if (_session.isSuccess && _session.externalState && _session.externalState.newProfile === true) {
                            $scope.socialProvider.utility.restoreSession(_session);
                            this.socialProfile = $scope.socialProvider.getProfile();
                            $scope.socialProvider.utility.deleteFromStorage();
                        }
                    }
                    if  (this.socialProfile !== null && this.socialProfile !== undefined && this.socialProfile.redirectType === $scope.socialProvider.registrationSource.signInSocialProfile)
                    {
                        $scope.socialProvider.muteWidget = true;
                        $scope.socialProvider.registerConsumer($scope.angularSchemaObserver.pushExternalData);
                        $scope.socialProvider.candidateParser(this.socialProfile);
                        $scope.socialProvider.educationParser(this.socialProfile);
                        $scope.socialProvider.workHistoryParser(this.socialProfile);
                        $scope._newSocialProfileHandler = newSocialProfileHandler;
                        $scope.preLoadExternalDataSource = true;
                    } else{
                        $scope.socialProvider.muteWidget = false;
                        $scope.socialProvider.jsLoadAwaitCount = 0;
                        $scope.socialProvider.showUIWizard(SocialLoginEvent, $scope.socialProvider.TitleEnum.joinTitle, false);
                        $scope.socialProvider.reset();
                        $scope.socialProvider.registerConsumer($scope.angularSchemaObserver.pushExternalData);
                    }
                } catch (reason) {
                    logger.warn("An issue has occurred while Gigya Provider Loading!");
                    logger.error(reason);
                }
            } else{
                $scope.socialProvider.reset();
                $scope.socialProvider.disConnectSocialConnection();
                $scope.socialProvider.utility.removeRedirectDirectionInStorage();
            }
            $scope.globalProgressBarHandler(false);
            $scope.registerParserListener($scope.angularSchemaObserver.pushExternalData);
            $scope.registerDataConsumerOfResume($scope.angularSchemaObserver.notifyExternalDataSourceLoader);

            $scope.registerGenericPopulateListener($scope.angularSchemaObserver.pushExternalData);
            $scope.registerDataConsumerOfGenericPopulate($scope.angularSchemaObserver.notifyExternalDataSourceLoader);
            $scope.formMetaDataCollection = results;
        }

        function SocialLoginEvent(eventResponse) {
            try {
                $scope.globalProgressBarHandler(true);
                $scope.socialProvider.bindProfile(newSocialProfileHandler,$scope.socialAuthenticationEnablerProxy,eventResponse);
            } catch(reason) {
                console.log(reason);
                $scope.globalProgressBarHandler(false);
            }
        }

        function newSocialProfileHandler() {
            try {
                $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.applySocialProfile);
                $scope.globalProgressBarHandler(true);
                $scope.angularSchemaObserver.notifyExternalDataSourceLoader("socialSite");
                $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                $scope.socialProvider.utility.setProfileDefaultsToStorage();
                $scope.globalProgressBarHandler(false);
            } catch (reason) {
                console.log(reason);
                $scope.globalProgressBarHandler(false);
            }
        }

        function applyFlowSocialAuthenticationEnabler(socialProfile) {
            $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.applySocialProfile);
            var redirectAction = {
                action     : 'apply',
                path       : $location.url(),
                caller     : 'apply',
                callBackUrl: $location.url()
            };
            $scope.socialProfileAuthenticationEnabler(socialProfile,redirectAction);
        }

        function leadCaptureSocialAuthenticationEnabler(socialProfile) {
            $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.talentCommunitySocialProfile);
            var redirectAction = {
                action: 'dashboard',
                path:'/profile/'
            };
            $scope.socialProfileAuthenticationEnabler(socialProfile,redirectAction);
        }
    }

})(); // End  controller=======
