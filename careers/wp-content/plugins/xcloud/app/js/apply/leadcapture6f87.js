angular.module("com.hrlogix.ats.applyflow").controller('leadCaptureFormController',
    ['$scope', '$controller', '$log', '$location', '$window', '$q','$sce','$cookies', '$rootScope', '$filter', '$http', '$timeout', '$compile', 'candidate', 'privateCandidate', 'lists', 'privateApplication', 'authService', 'authBuffer', 'ListService', 'SessionStorage', 'LocalStorage', 'jobsapi', 'privateFolder', 'publicFolder', 'omniTaggingFactory', 'CandidateWorkFlow',
        function ($scope, $controller, $log, $location, $window, $q, $sce, $cookies, $rootScope,$filter, $http, $timeout, $compile, candidate, privateCandidate, lists, privateApplication, authService, authBuffer, ListService, SessionStorage, LocalStorage, jobsapi, privateFolder, publicFolder, omniTaggingFactory, CandidateWorkFlow) {

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_LEAD_CAPTURE);
            $scope.fieldHelpers = {
                topVisibleField: 'uname',
                loginControlId : 'loginHandler',
                resumeUploadBanner:'resumeUploadBanner',
                socialNetworkNotification:'socialNetworkNotification'
            };
            angular.extend(this, $controller('baseController',  {$scope: $scope}));
            var isBearerAuthentication = false;

            initialize();

            function focusHandler(identity){
                if(identity === undefined) {
                    setFocus($scope.topVisibleField, WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
                }else{
                    setFocus(identity, WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
                }
            }

            function getApplyFormConfigVisibleField(defaultKey){
                var deferred = $q.defer();
                var position =2;
                var index = 0;
                angular.forEach($scope.applyFormConfig,function(element,key){
                    if(index < position) {
                        if (element.hide === false) {
                            index++;
                        }
                        if (index === position) {
                            return deferred.resolve(key);
                        }
                    } else if(index > position){
                        return deferred.resolve(defaultKey);
                    }
                });
                return deferred.promise;
            }

            function prepareXCCComplianceGuidelines() {
                var validatorRule = {
                    'uName': {
                        validations: {
                            uniqueEmail: {
                                key       : 'uniqueEmail',
                                focusField: $scope.fieldHelpers.loginControlId
                            }
                        }
                    }
                };
                $scope.valdatorRule = {
                    uName : angular.toJson(validatorRule.uName)
                }
            }

            $scope.submitCandidate = function () {
                if ($scope.customFieldResults !== undefined) {
                    for (var key in $scope.customFieldResults) {
                        $scope.applyCandidate[$scope.customFieldResults[key].columnName] = $scope.customFieldResults[key].result;
                    }
                }

                $log.log('Job id: ' + $scope.jobId);
                $log.log('Job url: ' + $scope.jobUrl);

                if ($scope.mode === 'add') {
                    if (angular.equals({}, $scope.fileFormName)) {
                        $scope.applyCandidate.locked = 't';
                    } else {
                        $scope.applyCandidate.locked = null;
                    }

                    jQuery('.loading-container').css('display', 'block');
                    $scope.applyCandidate.interestCard = 't';
                    $scope.candidateServiceHandler('processAddCandidate')
                        .then(function (processAddCandidateResponse) {
                            var deferred = $q.defer();
                            jQuery('.loading-container').css('display', 'block');
                            try {
                                var cookieData = _.pick($scope.applyCandidate, 'firstName', 'lastName', 'city', 'state', 'zip', 'phone1', 'candidateId', 'description', 'areaInterest');
                                if($scope.workHistory.title){
                                    cookieData['description'] = $scope.workHistory.title;
                                }

                                var expires = new Date();
                                expires.setDate(expires.getDate() + 30);
                                var opts = {'expires': expires};
                                $cookies.putObject('xcc', cookieData, opts);
                                // $scope.applyCandidate.password = 'password';

                                logger.trace('apply candidate: \n' + angular.toJson($scope.applyCandidate));
                                if(_XC_CONFIG.omniDataEnabled === 'true') {
                                    if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                                        if(_XC_CONFIG.landing_page && _XC_CONFIG.landing_page.id){
                                            omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, _XC_CONFIG.landing_page.id, $scope.applyCandidate.email);
                                            $('html.landing-page body').append($compile('<omni-tagging-directive flow="MICROSITE_campaign"></omni-tagging-directive>')($scope));
                                        }
                                        else {
                                            omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, 0, $scope.applyCandidate.email);
                                        }
                                    }
                                }

                                if(_XC_CONFIG.landing_page && _XC_CONFIG.landing_page.folder_id){
                                    // We'll add them to a folder async from the rest of the api calls
                                    var folderData = {
                                        destinationList: [parseInt(_XC_CONFIG.landing_page.folder_id)],
                                        candidateList: [parseInt($scope.applyCandidate.candidateId)]
                                        //status: "associated",
                                        //created: new Date().getTime(),
                                        //emailed: "f"
                                    };
                                    publicFolder.addCandidateToFolder(folderData);
                                    jQuery('.loader').css('display', 'none');
                                }

                                $scope.candidateServiceHandler('addWorkHistory')
                                    .then(function (addWorkHistoryResponse) {
                                        $scope.candidateServiceHandler('addEducationHistory')
                                            .then(function(addEducationHistoryResponse){
                                                // var deferred = $q.defer();
                                                try {
                                                    logger.debug('processAddCandidate complete');
                                                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                                                        $scope.candidateServiceHandler('updateCandidateSendEmail')
                                                            .then(function () {
                                                                logger.debug('Application complete, thank you!: headed to account');
                                                                deferred.resolve(0);
                                                            })
                                                            .catch(function (reason) {
                                                                logger.error(reason);
                                                                deferred.reject(reason);
                                                                jQuery('.loading-container').css('display', 'none');
                                                            });
                                                    }

                                                    if ($scope.isLastForm !== true) {
                                                        jQuery('.loading-container').css('display', 'none');
                                                        deferred.resolve(0);
                                                    }
                                                }
                                                catch (reason) {
                                                    logger.error(reason);
                                                    deferred.reject(reason);
                                                    jQuery('.loading-container').css('display', 'none');
                                                }
                                            })
                                            .catch(function (reason) {
                                                logger.error(reason);
                                                deferred.reject(reason);
                                                jQuery('.loading-container').css('display', 'none');
                                            });
                                    })
                                    .catch(function (reason) {
                                        logger.error(reason);
                                        deferred.reject(reason);
                                        jQuery('.loading-container').css('display', 'none');
                                    });
                            }
                            catch (reason) {
                                logger.error(reason);
                                deferred.reject(reason);
                                jQuery('.loading-container').css('display', 'none');
                            }
                            return deferred.promise;
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                        });
                } else {
                    jQuery('.loading-container').css('display', 'block');

                    $scope.candidateServiceHandler('updateCandidate')
                        .then(function () {
                            $scope.credentials.username = $scope.applyCandidate.uname;
                            $scope.credentials.password = $scope.applyCandidate.password;
                            LeadCaptureLogin()
                                .then(function (loginResponse) {
                                    if(_XC_CONFIG.landing_page && _XC_CONFIG.landing_page.folder_id){
                                        // We'll add them to a folder async from the rest of the api calls
                                        var folderData = {
                                            destinationList: [parseInt(_XC_CONFIG.landing_page.folder_id)],
                                            candidateList: [parseInt($scope.applyCandidate.candidateId)]
                                            //status: "associated",
                                            //created: new Date().getTime(),
                                            //emailed: "f"
                                        };
                                        publicFolder.addCandidateToFolder(folderData);
                                        jQuery('.loader').css('display', 'none');
                                    }

                                    if($scope.workHistory.workHistoryId != undefined && $scope.eduHistory.educationId != undefined) {
                                        $scope.candidateServiceHandler('updateWorkHistory')
                                            .then(function () {
                                                $scope.candidateServiceHandler('updateEducation')
                                                    .then(function () {
                                                        var deferred = $q.defer();
                                                        try {
                                                            logger.debug('processAddCandidate complete');
                                                            if ($scope.isLastContainer === true && $scope.isLastForm === true && ($scope.applyCandidate.locked === 'f' || isBearerAuthentication === true)) {
                                                                hasSuccess('Application complete, thank you!');
                                                                if ($scope.jobId && $scope.jobUrl) {
                                                                    $scope.seoRedirectHandler();
                                                                } else if(_XC_CONFIG.landing_page){
                                                                    if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                                                                        omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, _XC_CONFIG.landing_page.id, $scope.applyCandidate.email);
                                                                        $('html.landing-page body').append($compile('<omni-tagging-directive flow="MICROSITE_campaign"></omni-tagging-directive>')($scope))
                                                                    }
                                                                    if(_XC_CONFIG.landing_page.destination) {
                                                                        window.location.href = _XC_CONFIG.landing_page.destination;
                                                                    }
                                                                    else {
                                                                        $('.landing-page-content').hide();
                                                                        $('.landing-page-thank-you').show();
                                                                    }
                                                                } else {
                                                                    $location.url('/profile/');
                                                                }
                                                            }else {
                                                                $scope.candidateServiceHandler('updateCandidateSendEmail')
                                                                    .then(function () {
                                                                        logger.debug('Application complete, thank you!: headed to account');
                                                                        deferred.resolve(0);
                                                                    })
                                                                    .catch(function (reason) {
                                                                        logger.error(reason);
                                                                        jQuery('.loading-container').css('display', 'none');
                                                                    });
                                                            }
                                                        }
                                                        catch (reason) {
                                                            logger.error(reason);
                                                            deferred.reject(reason);
                                                            jQuery('.loading-container').css('display', 'none');
                                                        }
                                                    })
                                                    .catch(function (reason) {
                                                        logger.error(reason);
                                                        jQuery('.loading-container').css('display', 'none');
                                                    });
                                            })
                                            .catch(function (reason) {
                                                logger.error(reason);
                                                jQuery('.loading-container').css('display', 'none');
                                            });
                                    }else {
                                        if ($scope.workHistory.workHistoryId == undefined) {
                                            $scope.candidateServiceHandler('addWorkHistory')
                                                .then(function () {
                                                    //To make sure synchronous call to API before another API call
                                                    // Otherwise it will do asynchronous call and return error.
                                                });
                                        } else{
                                            $scope.candidateServiceHandler('updateWorkHistory')
                                                .then(function () {
                                                    //To make sure synchronous call to API before another API call
                                                    // Otherwise it will return error.
                                                });
                                        }
                                        if ($scope.eduHistory.educationId == undefined) {
                                            $scope.candidateServiceHandler('addEducationHistory')
                                                .then(function () {
                                                    //To make sure synchronous call to API before another API call
                                                    // Otherwise it will return error.
                                                });
                                        }else{
                                            $scope.candidateServiceHandler('updateEducation')
                                                .then(function () {
                                                    //To make sure synchronous call to API before another API call
                                                    // Otherwise it will return error.
                                                });
                                        }
                                        try {
                                            var deferred = $q.defer();
                                            logger.debug('processAddCandidate complete');
                                            if ($scope.isLastContainer === true && $scope.isLastForm === true &&
                                                ($scope.applyCandidate.locked == 't' ||
                                                $scope.applyCandidate.locked == null ||
                                                $scope.applyCandidate.locked == undefined)) {
                                                $scope.candidateServiceHandler('updateCandidateSendEmail')
                                                    .then(function () {
                                                        logger.debug('Application complete, thank you!: headed to account');
                                                        deferred.resolve(0);
                                                    })
                                                    .catch(function (reason) {
                                                        logger.error(reason);
                                                        jQuery('.loading-container').css('display', 'none');
                                                    });
                                            }else if($scope.isLastContainer === true && $scope.isLastForm === true && ($scope.applyCandidate.locked === 'f' || isBearerAuthentication === true)){
                                                hasSuccess('Application complete, thank you!');
                                                delete $rootScope.resumeJSON;
                                                delete $rootScope.resumeParsed;
                                                delete $rootScope.applyCandidateId;
                                                if ($scope.jobId && $scope.jobUrl) {
                                                    $scope.seoRedirectHandler();
                                                } else if(_XC_CONFIG.landing_page) {
                                                    if (_XC_CONFIG.landing_page.destination) {
                                                        window.location.href = _XC_CONFIG.landing_page.destination;
                                                    }
                                                    else {
                                                        $('.landing-page-content').hide();
                                                        $('.landing-page-thank-you').show();
                                                    }
                                                }
                                                else {
                                                    $location.url('/profile/');
                                                }
                                            }

                                            if ($scope.isLastForm !== true) {
                                                deferred.resolve(0);
                                            }
                                            jQuery('.loading-container').css('display', 'none');
                                        }
                                        catch (reason) {
                                            logger.error(reason);
                                            deferred.reject(reason);
                                            jQuery('.loading-container').css('display', 'none');
                                        }
                                    }
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    jQuery('.loading-container').css('display', 'none');
                                });

                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });
                }
            };

            function initialize() {

                $scope.lists = {};
                $scope.job = {};
                $scope.jobId = $location.search().job;
                $scope.jobUrl = null;
                $scope.noThanksMsg = (_XC_CONFIG.context.noThanks === ""? "No thanks, continue to apply" : _XC_CONFIG.context.noThanks);
                $scope.attachmentDetails = {};
                $scope.fileFormName = {};
                $scope.uniqueEmail = true;
                $scope.deactiveCheck = true;
                $rootScope.showAccount = true;
                $scope.resumeJSON = {};
                $scope.formlistUpdateFlag = true;
                $scope.isSessionLogged = false;
                $scope.queueInProgress = null;
                $scope.credentials = {};
                $scope.performInitialValidation = false;
                $scope.TandC_url = _XC_CONFIG.copyright.TandC_url;
                $scope.terms_policy_enabled = (_XC_CONFIG.copyright.terms_policy_enabled === 'true' || _XC_CONFIG.copyright.terms_policy_enabled === true);
                $scope.privacyPolicyUrl = _XC_CONFIG.copyright.privacyPolicyUrl;
                $scope.copyrightYear = _XC_CONFIG.copyright.copyrightYear;
                $scope.isLandingPage = _XC_CONFIG.landing_page !== false;
                $scope.isInvalidJob = true;
                $scope.applyFormConfig = {
                    'uname'         : {'required': true, 'hide': false},
                    'firstName'     : {'required': true, 'hide': false},
                    'lastName'      : {'required': true, 'hide': false},
                    'postalCode'    : {'required': true, 'hide': false},
                    'phone1'        : {'required': false, 'hide': false},
                    'title'         : {'required': true, 'hide': false},
                    'levelAttained' : {'required': true, 'hide': false},
                    'areaInterest': {'required': true, 'hide': false},
                    'fileupload'    : {'required': false, 'hide': false}
                };

                if(authService.isLoggedIn === true && CandidateWorkFlow.current.get() === E_WORK_FLOW.JOIN_LCP && _XC_CONFIG.landing_page ===false) {
                    $scope.modelProcessor.baseHelper.seoRedirectHandler();
                }

                if($location.path() === '/profile/job-alert/'){
                    $scope.isAlertLcp = true;
                    if(!$location.search().job && !$location.search().link)
                        $window.location.href = '/profile/join/';
                }

                if($scope.isLandingPage) {
                    $scope.applyFormConfig = _XC_CONFIG.landing_page.stream_config || {};
                }

                try {
                    logger.debug('personalInformationFormController initialize()');

                    prepareXCCComplianceGuidelines();
                    var listsNeeded = ["yn", "education", "state", 'category'];
                    $scope.listFieldMapping = {};
                    $scope.listFieldMapping['areaInterest'] = 'category';
                    $scope.listFieldMapping['levelAttained'] = 'education';
                    var loadListPromise = function () {
                        return ListService.loadListNames($scope.lists, listsNeeded);
                    };

                    $scope.confirmPassword = {text: ''};
                    $scope.customFieldResults = [];

                    $scope.mode = 'add';
                    $scope.applyCandidate = {};
                    $scope.workHistory = {};
                    $scope.eduHistory = {};

                    loadListPromise().then(function () {
                        if (authService.isLoggedIn) {
                            isBearerAuthentication = authService.isSocialProfileConnection();
                            logger.debug('querying candidate');
                            privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                                $scope.applyCandidate = normalizeObjects(result);

                                //pre-populate Area Of Interest if not set for loggedIn user
                                if(!angular.equals(queryString, {})) {
                                    newQueryString = queryString;
                                    $scope.genericCandidateParser(newQueryString);
                                }

                                if($scope.reqIdLink){
                                    if($cookies.get('xcc') || authService.isLoggedIn){
                                        logger.log('User already completed, continue to ATS.');
                                        $scope.CandidateModelHelper.captureAtsLead($scope.reqIdLink, $scope.applyCandidate.candidateId).then(function (response) {
                                            $scope.seoRedirectHandler();
                                        },function (response) {
                                            $scope.seoRedirectHandler();
                                        });
                                    }
                                }

                                else if ($scope.jobId){
                                    if($cookies.get('xcc') || authService.isLoggedIn){
                                        logger.log('User already completed, continue to ATS.');
                                        $scope.CandidateModelHelper.captureNonAtsLead($scope.jobId, $scope.applyCandidate.candidateId).then(function (response) {
                                            $scope.seoRedirectHandler();
                                        },function (response) {
                                            $scope.seoRedirectHandler();
                                        });

                                    }
                                }
                                else {
                                    $scope.canInfoComplete = true;
                                    $scope.isSessionLogged = true;
                                    $scope.mode = 'update';
                                    authService.setBasicCandidate($scope.applyCandidate);
                                    privateCandidate.getCandidateWorkHistory({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function (result) {
                                        $scope.addedWorkHistory = normalizeObjects(result);
                                        if ($scope.addedWorkHistory.length > 0) {
                                            $scope.workHistory = $scope.addedWorkHistory[$scope.addedWorkHistory.length - 1];
                                        }
                                    });
                                    privateCandidate.getCandidateEducation({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function (result) {
                                        $scope.addedEduHistory = normalizeObjects(result);
                                        if ($scope.addedEduHistory.length > 0) {
                                            $scope.eduHistory = $scope.addedEduHistory[$scope.addedEduHistory.length - 1];
                                        }

                                    });
                                }
                            });
                        }else{
                            //pre-populate Area Of Interest from Url params // primary_category
                            var queryString = $location.search();
                            var newQueryString = null;
                            if(!angular.equals(queryString, {})) {
                                newQueryString = queryString;
                                $scope.genericCandidateParser(newQueryString);
                            }
                        }
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                    });

                }
                catch (reason) {
                    logger.error(reason);
                }

                // Nick: making this an async call for now
                if ($scope.jobId) {
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
                        $scope.isInvalidJob = false;
                        //pre-populate Area Of Interest using Job's API result, only if areaInterest is not set
                        $scope.genericCandidateParser($scope.job);
                    },function(error){
                        $scope.isInvalidJob = true;
                    });
                }
                else{
                    $scope.isInvalidJob = false;
                }

                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                   jQuery('.loading-container').css('display', 'none');
                }
            }

            function SocialLoginEvent(eventResponse){
                try {
                    jQuery('.loading-container').css('display', 'block');
                    $scope.socialProvider.bindProfile(newSocialProfileHandler,AuthenticationTypeResolver,eventResponse);
                } catch(reason) {
                    console.log(reason);
                    jQuery('.loading-container').css('display', 'none');
                }
            }
            
            function ExtractSocialProfile(socialProfile) {
                $scope.overrideCandidateDataWithSocial(socialProfile);
                $scope.workHistory.title = socialProfile.currentTitle;
            }

            function performFieldValidations(){
                try {
                    $scope.fieldValidator.isDirtyValid = true;
                    $scope.queueCheckEmail();
                    $scope.checkEmail();
                    $scope.$apply();
                }catch (reason){

                }
            }

            function newSocialProfileHandler() {
                $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.talentCommunitySocialProfile);
                jQuery('.loading-container').css('display', 'block');
                try {
                    $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                    $scope.fieldValidator.isDirtyValid = false;
                    var socialProfile = $scope.socialProvider.getProfile();
                    $scope.socialProvider.utility.setProfileDefaultsToStorage();
                    ExtractSocialProfile(socialProfile);
                    performFieldValidations();
                    // $timeout(function () {
                    //     $scope.setSocialIconTabIndex();
                    // },250);
                    jQuery('.loading-container').css('display', 'none');
                } catch(reason) {
                    console.log(reason);
                    jQuery('.loading-container').css('display', 'none');
                }
            }

            // awaiting for view to be loaded completely
            function AuthenticationTypeResolver(socialProfile) {
                $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.talentCommunitySocialProfile);
                var redirectAction = {
                    action: 'dashboard',
                    path:'/profile/'
                };
                if(_XC_CONFIG.landing_page){
                    redirectAction.action = 'microsite';
                    redirectAction.path = _XC_CONFIG.landing_page.destination || null;
                }
                $scope.socialProfileAuthenticationEnabler(socialProfile,redirectAction);
            }

            function LeadCaptureLogin() {
                var deferred = $q.defer();
                try {
                    if((isBearerAuthentication !== true)){
                        return $scope.candidateServiceHandler('login');
                    }else{
                        deferred.resolve(0);
                    }
                }
                catch (reason){
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            }

            setTimeout(function() {
                if (authService.isLoggedIn !== true)
                {
                    try {
                        $scope.fieldValidator.reset();
                        $scope.socialProvider.jsLoadAwaitCount = 0;
                        $scope.socialProvider.showUIWizard(SocialLoginEvent,$scope.socialProvider.TitleEnum.joinTitle,true);
                    } catch (reason) {
                        logger.warn("An issue has occurred while Gigya Provider Loading!");
                        logger.error(reason);
                    }
                    $scope.socialRedirectActionFound = false;
                    this.socialProfile =  $scope.socialProvider.getProfile();
                    if  (this.socialProfile !== null && this.socialProfile !== undefined && this.socialProfile.redirectType === $scope.socialProvider.registrationSource.signInSocialProfile)
                    {
                        $scope.socialRedirectActionFound = true;
                        $scope.performInitialValidation = true;
                        ExtractSocialProfile(this.socialProfile);
                        // awaiting for view to be loaded completely
                        setTimeout(function() {
                            if ($scope.performInitialValidation === true) {
                                performFieldValidations();
                            }
                        }, 50);
                    } else{
                        $scope.socialProvider.reset();
                    }

                    if($scope.socialProvider.showWizard === true) {
                        $timeout(function () {
                            try {
                                // $scope.setSocialIconTabIndex();
                                if($scope.socialRedirectActionFound !== true){
                                    setFocus($scope.socialProvider.KeysConfiguration.HTMLDefinition.mainContainerId,false);
                                }else{
                                    focusHandler();
                                }
                            } catch (reason) {
                            }
                        }, 500)
                    }else{
                        focusHandler();
                    }
                }else{
                    focusHandler($scope.fieldHelpers.resumeUploadBanner);
                }
            }, 50);

            //<editor-fold desc="listeners">
            $scope.$on($scope.broadcastNamespace.candidateModel.parse.associatedData,function(){
                if ($rootScope.resumeJSON.ResDoc.resume.experience !== undefined && $rootScope.resumeJSON.ResDoc.resume.experience !== null) {
                    var _workHistory = $scope.CandidateModelHelper.parserCollection.resume.getEmploymentModel($rootScope.resumeJSON.ResDoc.resume.experience, {candidateId: $rootScope.applyCandidateId});
                    var title = $scope.CandidateModelHelper.filters.getCurrentJob(_workHistory).title;
                    if ($scope.workHistory.title === null || $scope.workHistory.title === undefined || $scope.workHistory.title.length === 0) {
                        $scope.workHistory.title = title;
                    }
                }
                if ($rootScope.resumeJSON.ResDoc.resume.education !== undefined && $rootScope.resumeJSON.ResDoc.resume.education !== null) {
                    var _eduHistory = $scope.CandidateModelHelper.parserCollection.resume.getEducationModel($rootScope.resumeJSON.ResDoc.resume.education, {candidateId: $rootScope.applyCandidateId});
                    var levelAttained = $scope.CandidateModelHelper.filters.getCurrentEducation(_eduHistory).levelAttained;
                    if ($scope.eduHistory.levelAttained !== null && $scope.eduHistory.levelAttained !== undefined && $scope.eduHistory.levelAttained.length > 0) {
                        $scope.eduHistory.levelAttained = levelAttained;
                    }
                }
            });

            $scope.$on($scope.broadcastNamespace.candidateModel.parse.clearAssociatedData,function(){
                delete  $scope.workHistory.title;
                delete  $scope.eduHistory.levelAttained;
            });

            $scope.$on($scope.broadcastNamespace.candidateModel.validations.emailExistence,function (event, args) {
                $timeout(function (args) {
                    if(args.emailExists === true){
                        focusHandler($scope.fieldHelpers.loginControlId);
                    }else{
                        getApplyFormConfigVisibleField($scope.fieldHelpers.topVisibleField).then(function(key){
                            $timeout(function(key){
                                focusHandler(key);
                            },50,false,key);
                        });
                    }
                },50,false,args)
            });

            $scope.$on($scope.broadcastNamespace.candidateModel.socialNetwork.onAccountMerge,function (event, args) {
                $timeout(function () {
                    // $scope.setSocialIconTabIndex();
                    setFocus($scope.socialProvider.KeysConfiguration.HTMLDefinition.mainContainerId,false);
                },250);
            });

            //</editor-fold>
       }
    ]
);
