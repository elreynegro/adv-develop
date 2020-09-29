/**
 * Created by TDadam on 12/16/2017.
 */
(function () {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('candidateBaseHelper', candidateBaseHelper);


    candidateBaseHelper.$inject = ['$scope', '$rootScope', '$q', '$log', '$http', '$timeout', '$window', '$compile', 'metadata', 'lists', 'SessionStorage', 'LocalStorage', '$cookies', '$location', 'authService', 'privateApplication', 'privateStep', 'candidate', 'privateCandidate', 'bgResumeParser', 'bgResumeUpload', 'ModelDependencyFactory', 'questions', 'privateFolder', 'publicFolder', '$filter', 'omniTaggingFactory', 'screeningMessageViewModelService', 'ApplicationState', 'candidateAssessmentService', 'ApplyWorkFlow', 'SignInModalService', 'CandidateWorkFlow', 'leadcaptureModalService'];

    function candidateBaseHelper($scope, $rootScope, $q, $log, $http, $timeout, $window, $compile, metadata, lists, SessionStorage, LocalStorage, $cookies, $location, authService, privateApplication, privateStep, candidate, privateCandidate, bgResumeParser, bgResumeUpload, ModelDependencyFactory, questions, privateFolder, publicFolder, $filter, omniTaggingFactory, screeningMessageViewModelService, ApplicationState, candidateAssessmentService, ApplyWorkFlow, SignInModalService, CandidateWorkFlow, leadcaptureModalService) {
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_BASE);
        var queryString = $location.search();
        var isBearerAuthentication = false;
        $scope.reqIdLink = parseInt(queryString.link);
        $scope.step = {};
        $scope.application = {};
        $scope.resumeDataConsumerCollection = [];
        $scope.resumeParserListenerCollection = [];

        $scope.genericPopulateDataConsumerCollection = [];
        $scope.genericPopulateListenerCollection = [];

        initialize();

        function initialize() {
            logger.debug('candidateBaseController.');

            $scope.isAlertLcp = false;
            $scope.isUpdate = false;
            $scope.attachmentDetails = {};
            $scope.fileFormName = {};
            $rootScope.resumeJSON = {};
            $rootScope.resumeParsed = false;
            $rootScope.applyCandidateId = null;
            $scope.alreadyApplied = false;
            $scope.credentials = {};
            $scope.uniqueEmail = true;
            $scope.deactiveCheck = true;
            $scope.applyCandidate = {};

            // Satellite Helpers
            $scope.socialProvider = ModelDependencyFactory.socialProvider;
            $scope.fieldValidator = ModelDependencyFactory.fieldValidator;
            $scope.CandidateModelHelper = ModelDependencyFactory.candidateHelper;
            $scope.schemaInterpolation = ModelDependencyFactory.schemaInterpolation;
            $scope.angularSchemaObserver = ModelDependencyFactory.angularSchemaObserver;
            // Oi!!! We need to consolidate code!
            $scope.continueBtn = "Continue";


            //clear resume data from applycandidate variable
            $rootScope.candidateResumeUpdated = false;
            $rootScope.resumeXML = null;
        }

        function insertMicrositeOmnidata() {
            if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, _XC_CONFIG.landing_page.id, $scope.applyCandidate.email);
                $('html.landing-page body').append($compile('<omni-tagging-directive flow="MICROSITE_campaign"></omni-tagging-directive>')($scope))
            }
        }

        //<editor-fold desc="Utility Helpers">

        $scope.$on('globalProgressBarHandler', function (event, args) {
            $scope.globalProgressBarHandler(args.state);
        });

        $scope.globalProgressBarHandler = function (enabled, loaderId) {
            var _loaderElement = loaderId ? loaderId : '.loading-container';
            if (enabled) {
                jQuery(_loaderElement).css('display', 'block');
            } else {
                if ($scope.semaphoreCollection === undefined || $scope.semaphoreCollection.AlwaysShowProgressbar === undefined || $scope.semaphoreCollection.AlwaysShowProgressbar !== true) {
                    jQuery(_loaderElement).css('display', 'none');
                }
            }
        };

        $rootScope.globalErrorHandler = function (reason) {
            logger.error(reason);
            jQuery('.loading-container').css('display', 'none');
        };

        $scope.notificationSemaphoreHandler = function (state, message) {
            $scope.isShowNotificaiton = state;
            $scope.notificationMessage = message;
        };

        $scope.setRedirectToCurrent = function (loginConfiguration, forgotPasswordCaller) {
            //incase the modal lead capture is open and we try to sign in using the notification message for recurring visitor, we have to close the Lead Capture Modal.
            if (leadcaptureModalService.getIsModalOpen()) {
                $rootScope.$broadcast('closeLeadCaptureModal');
                //this will be caught in leadcapture-modal-controller
            }
            authService.openSignInModal(loginConfiguration);
        };

        $scope.setRedirectToCurrentModule = function () {
            authService.setUrlPathIfUserExists($location.url(), $scope.applyCandidate.uname);
        };

        $scope.getLabelByValue = function (value, list) {
            for (var key in list) {
                if (list[key].value === value) {
                    return list[key].label;
                }
            }
        };

        $scope.getValueByLabel = function (label, list) {
            for (var key in list) {
                if (list[key].label === label) {
                    return list[key].value;
                }
            }
        };

        $scope.getValueFromArrayOrString = function (arrayOrString, position) {
            if (position === undefined || position === null) {
                position = 0;
            }

            if (!angular.isArray(arrayOrString)) {
                return arrayOrString;
            } else {
                return arrayOrString[position];
            }
        };

        $scope.notifyConsumer = function (consumerCollection, input) {
            angular.forEach(consumerCollection, function (consumer) {
                consumer(input);
            });
        };

        $scope.registerDataConsumerOfResume = function (consumer) {
            $scope.resumeDataConsumerCollection.push(consumer);
        };

        $scope.candidateIdSupplier = function () {
            $scope.applyCandidate = ApplicationState.session.candidate.get();
            if ($scope.applyCandidate === null) {
                return -1;
            }
            return $scope.applyCandidate.candidateId;
        };

        $scope.getCandidateParams = function (param) {
            $scope.applyCandidate = ApplicationState.session.candidate.get();
            return $scope.applyCandidate[param];
        };

        $scope.registerParserListener = function (parser) {
            $scope.resumeParserListenerCollection.push(parser);
        };

        $scope.resetParserOfResume = function () {
            $scope.resumeParserListenerCollection = [];
        };

        $scope.resetDataConsumerOfResume = function () {
            $scope.resumeDataConsumerCollection = [];
        };

        $scope.registerDataConsumerOfGenericPopulate = function (consumer) {
            $scope.genericPopulateDataConsumerCollection.push(consumer);
        };

        $scope.registerGenericPopulateListener = function (parser) {
            $scope.genericPopulateListenerCollection.push(parser);
        };

        //</editor-fold>

        //<editor-fold desc="Candidate API proxy">

        $scope.apiProxyHandler = function (proxyFlag, parameters) {
            var deferred = $q.defer();

            // In case request is for basic authentication on bearer authentication will be skipped
            if (parameters !== undefined && parameters.byPassProxy !== undefined && parameters.byPassProxy === true) {
                deferred.resolve(0);
                return deferred.promise;
            }

            if (parameters !== undefined && parameters.isOfflineStorage !== undefined && parameters.isOfflineStorage === true) {
                deferred.resolve(parameters.viewModel);
                return deferred.promise;
            }

            //<editor-fold desc="Add Candidate">
            var prepareAddCandidate = function () {
                var deferred = $q.defer();

                try {

                    logger.trace('apply candidate: \n' + angular.toJson($scope.applyCandidate));

                    if ($scope.applyCandidate === undefined) {
                        deferred.reject('applyCandidate was not found on $scope');
                    }

                    var lowerCaseUname = $scope.applyCandidate.uname.toLowerCase();
                    $scope.applyCandidate.uname = lowerCaseUname;
                    $scope.applyCandidate.email = lowerCaseUname;
                    $scope.applyCandidate.password = 'password';
                    $scope.CandidateModelHelper.ApplyDefaultModes($scope.applyCandidate);
                    var getCurDate = new Date();
                    $scope.applyCandidate.createDate = $scope.applyCandidate.updateDate = getCurDate.getTime();
                    delete $scope.applyCandidate.candidateId;

                    if ($rootScope.resumeParsed && $rootScope.resumeXML !== null) {
                        $scope.applyCandidate.resume = $rootScope.resumeXML;
                    }

                    deferred.resolve(0);

                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var executeAddCandidate = function () {

                logger.debug('executeAddCandidate');

                $scope.applyCandidate.locked = null;

                return candidate.addCandidate($scope.applyCandidate).$promise.then(function (result) {
                    var deferred = $q.defer();

                    try {
                        logger.debug('executeAddCandidate');
                        ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: false});
                        $scope.applyCandidate = normalizeObjects(result);
                        ApplicationState.session.candidate.set($scope.applyCandidate);
                        ApplicationState.localStorage.candidate.id.set($scope.applyCandidate.candidateId);
                        $rootScope.isNewUser = true;
                        $rootScope.candidateResumeUpdated = true;
                        $scope.credentials.username = $scope.applyCandidate.uname;
                        $scope.credentials.password = $scope.applyCandidate.password;
                        $scope.attachmentDetails.candidateId = $scope.applyCandidate.candidateId;
                        $rootScope.applyCandidateId = $scope.applyCandidate.candidateId;
                        $scope.mode = 'update';
                        if (($scope.angularSchemaObserver.formStyleHandler.viewStyle !== 2) && _XC_CONFIG.omniDataEnabled === 'true') {
                            if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                                omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, $scope.reqIdLink, $scope.applyCandidate.email)
                            }
                            $scope.semaphoreCollection.captureOmniTagging = false;
                            if ($scope.angularSchemaObserver.formStyleHandler.viewStyle === 1) {
                                $scope.semaphoreCollection.captureOmniTagging = true;
                            }
                        }

                        logger.trace(angular.toJson($scope.credentials));

                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if (proxyFlag === 'processAddCandidate') {
                // authService.isLoggedIn;
                deferred = $q.defer();
                try {
                    prepareAddCandidate()
                        .then(function () {
                            executeAddCandidate()
                                .then(function () {
                                    if ($scope.jobId) {
                                        $scope.CandidateModelHelper.captureNonAtsLead($scope.jobId, $rootScope.applyCandidateId);
                                    } else if ($scope.reqIdLink && $scope.isAlertLcp) {
                                        $scope.CandidateModelHelper.captureAtsLead($scope.reqIdLink, $rootScope.applyCandidateId);
                                    }
                                    $scope.executeSocialProfileDependencyResolver()
                                        .then(function () {
                                            $scope.getSocialChannel()
                                                .then(function () {
                                                    $scope.processCandidateSocialChannel()
                                                        .then(function () {
                                                            $scope.executeGigyaNotifyRegistration()
                                                                .then(function () {
                                                                    login()
                                                                        .then(function () {
                                                                            authService.getSocialInternalToken('Bearer APPLY ', $scope.socialProvider.getProfile(), !$scope.socialProvider.isSocialUserRegistration)
                                                                                .then(function (internalToken) {
                                                                                    if ($scope.socialProvider.isGigyaRegistrationSucceeded) {
                                                                                        var candidateDetails = {internalToken: internalToken};
                                                                                        candidateDetails.mail = $scope.applyCandidate.uname;
                                                                                        if ($scope.semaphoreCollection.isLeadCapture) {
                                                                                            if ($scope.jobId !== null && typeof ($scope.jobId) !== "undefined") {
                                                                                                candidateDetails.jobId = $scope.jobId;
                                                                                                candidateDetails.flow = "APPLY_LCP";
                                                                                            }
                                                                                            else {
                                                                                                candidateDetails.flow = "LCP";
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            candidateDetails.flow = "APPLY";
                                                                                            candidateDetails.reqId = $scope.reqId;
                                                                                        }
                                                                                        $scope.socialProvider.utility.sessionToStorage(candidateDetails);
                                                                                    }
                                                                                    uploadResume()
                                                                                        .then(function (resp) {
                                                                                            //Setting up applyResumeState
                                                                                            var applyResumeState = {};
                                                                                            var applyResumeStateContainer = ApplicationState.session.candidate.resume.applyResumeStateContainer.get();
                                                                                            //var applyResumeStateContainer=ApplicationState.sessionStorageGet("ApplyResumeStateContainer")
                                                                                            if (applyResumeStateContainer === null) {
                                                                                                applyResumeStateContainer = {};
                                                                                            }
                                                                                            if (resp.hasOwnProperty("uploadedResume")) {
                                                                                                //if resume is not uploaded when first form is submitted
                                                                                                if (!resp.uploadedResume) {
                                                                                                    applyResumeState.isResumeUploaded = false;
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                if (typeof(resp) !== "undefined") {
                                                                                                    //if resume is uploaded
                                                                                                    applyResumeState.isResumeUploaded = true;
                                                                                                    applyResumeState.attachmentId = resp.attachmentId;
                                                                                                    applyResumeState.attachmentName = resp.name;
                                                                                                    applyResumeState.mail = $scope.applyCandidate.uname;
                                                                                                    applyResumeState.candidateId = $scope.applyCandidate.candidateId;
                                                                                                    if ($scope.semaphoreCollection.isLeadCapture) {
                                                                                                        if ($scope.jobId !== null && typeof ($scope.jobId) !== "undefined") {
                                                                                                            applyResumeState.jobId = $scope.jobId;
                                                                                                            applyResumeState.flow = "APPLY_LCP"
                                                                                                        }
                                                                                                        else {
                                                                                                            applyResumeState.flow = "LCP"
                                                                                                        }
                                                                                                    }
                                                                                                    else {
                                                                                                        applyResumeState.flow = "APPLY"
                                                                                                        applyResumeState.reqId = $scope.reqId;
                                                                                                    }
                                                                                                    applyResumeState.reqId = $scope.reqId;
                                                                                                }
                                                                                            }
                                                                                            applyResumeStateContainer["ApplyResumeState"] = applyResumeState;
                                                                                            ApplicationState.session.candidate.resume.applyResumeStateContainer.set(applyResumeStateContainer)
                                                                                            logger.debug('resolving add candidate');
                                                                                            deferred.resolve(0);
                                                                                        })
                                                                                        .catch(function (reason) {
                                                                                            logger.error(reason);
                                                                                            $scope.globalProgressBarHandler(false);
                                                                                        });
                                                                                })
                                                                                .catch(function (reason) {
                                                                                    logger.error(reason);
                                                                                    $scope.globalProgressBarHandler(false);
                                                                                });
                                                                        })
                                                                        .catch(function (reason) {
                                                                            logger.error(reason);
                                                                            $scope.globalProgressBarHandler(false);
                                                                        });
                                                                })
                                                                .catch(function (reason) {
                                                                    logger.error(reason);
                                                                    $scope.globalProgressBarHandler(false);
                                                                });
                                                        })
                                                        .catch(function (reason) {
                                                            logger.error(reason);
                                                            $scope.globalProgressBarHandler(false);
                                                        });
                                                })
                                                .catch(function (reason) {
                                                    logger.error(reason);
                                                    $scope.globalProgressBarHandler(false);
                                                });
                                        })
                                        .catch(function (reason) {
                                            logger.error(reason);
                                            $scope.globalProgressBarHandler(false);
                                        });

                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    $scope.globalProgressBarHandler(false);
                                });
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            $scope.globalProgressBarHandler(false);
                        });

                }
                catch (reason) {
                    logger.error(reason);
                    $scope.globalProgressBarHandler(false);
                    deferred.reject(reason);
                }
                return deferred.promise;
            }
            //</editor-fold>

            //<editor-fold desc="update Candidate">
            var updateCandidate = function () {
                logger.debug('updateCandidate()');
                logger.trace('applyCandidate: ' + angular.toJson($scope.applyCandidate));
                /*this will be used to reload resume on refresh*/
                $scope.isResumeUpdated = false

                var getCurDate = new Date();
                $scope.applyCandidate.updateDate = getCurDate.getTime();
                if (($scope.applyCandidate.password === undefined || $scope.applyCandidate.password === null) && authService.isSocialProfileConnection() === true) {
                    $scope.applyCandidate.password = '!msocpf#!0'
                }
                if ($rootScope.resumeParsed && $rootScope.resumeXML !== null) {
                    $scope.applyCandidate.resume = $rootScope.resumeXML;
                    $scope.isResumeUpdated = true
                }
                return candidate.updateCandidate($scope.applyCandidate).$promise.then(function (result) {
                    var deferred = $q.defer();
                    try {
                        $scope.applyCandidate = normalizeObjects(result);
                        ApplicationState.session.candidate.set($scope.applyCandidate);
                        authService.setBasicCandidate($scope.applyCandidate);

                        if($scope.angularSchemaObserver.formStyleHandler.viewStyle === 5) {
                            $rootScope.$broadcast(BROAD_CAST_NAMESPACE.UPDATE_CANDIDATE_SCOPE, $scope.applyCandidate);
                        }

                        /*setting resume details in session storage in case the page is refreshed after saving*/
                        if ($scope.isResumeUpdated) {
                            var applyResumeState = {};
                            applyResumeState.isResumeUploaded = true;
                            applyResumeState.mail = $scope.applyCandidate.uname;
                            applyResumeState.candidateId = $scope.applyCandidate.candidateId;
                            if ($scope.semaphoreCollection.isLeadCapture) {
                                if ($scope.jobId !== null && typeof ($scope.jobId) !== "undefined") {
                                    applyResumeState.jobId = $scope.jobId;
                                    applyResumeState.flow = "APPLY_LCP"
                                }
                                else {
                                    applyResumeState.flow = "LCP"
                                }
                            }
                            else {
                                applyResumeState.flow = "APPLY"
                                applyResumeState.reqId = $scope.reqId;
                            }
                            applyResumeState.reqId = $scope.reqId;

                            var applyResumeStateContainer = ApplicationState.session.candidate.resume.applyResumeStateContainer.get();
                            if (applyResumeStateContainer === null) {
                                applyResumeStateContainer = {}
                            }
                            applyResumeStateContainer["ApplyResumeState"] = applyResumeState;
                            ApplicationState.session.candidate.resume.applyResumeStateContainer.set(applyResumeStateContainer)
                        }
                        $rootScope.candidateResumeUpdated = true;
                        if ($scope.jobId && ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true)) {
                            $scope.CandidateModelHelper.captureNonAtsLead($scope.jobId, $scope.applyCandidate.candidateId);
                        } else if ($scope.reqIdLink && $scope.isAlertLcp && ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true)) {
                            $scope.CandidateModelHelper.captureAtsLead($scope.reqIdLink, $scope.applyCandidate.candidateId);
                        }
                        deferred.resolve($scope.applyCandidate);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if (proxyFlag === 'updateCandidate') {
                return updateCandidate();
            }
            //</editor-fold>

            //<editor-fold desc="Candidate Education">
            var addEducationHistory = function (payLoad) {
                var deferred = $q.defer();
                if (payLoad.completed === null || payLoad.completed === undefined) {
                    payLoad.completed = 't';
                }
                if ($scope.eduHistoryToUpload !== null && $scope.eduHistoryToUpload !== undefined && $scope.eduHistoryToUpload.length > 0 && $scope.eduHistoryUploaded !== undefined && $scope.eduHistoryUploaded.length === 0 && $scope.angularSchemaObserver.semaphoreCollection.isLeadCapture === true) {
                    /*if($scope.angularSchemaObserver.semaphoreCollection.isLeadCapture !== true) {
                        for (var index in $scope.eduHistoryToUpload) {
                            if($scope.eduHistoryToUpload[index].candidateId === undefined || $scope.eduHistoryToUpload[index].candidateId === null) {
                                $scope.eduHistoryToUpload[index].candidateId = $scope.applyCandidate.candidateId;
                            }
                            privateCandidate.addEducation($scope.eduHistoryToUpload[index]).$promise.then(function (results) {
                                logger.info('add education history record success');
                                $scope.eduHistoryUploaded.push(results);
                                deferred.resolve(results);
                            }, function (reason) {
                                hasError(reason, 'Unable to add employment history record!');
                                deferred.reject(reason);
                            });
                        }
                    }*/
                    privateCandidate.addEducation(payLoad).$promise.then(function (results) {
                        try {
                            $scope.eduHistory = normalizeObjects(results);
                            for (var index in $scope.eduHistoryToUpload) {
                                if($scope.resumeParsed === true){
                                    $scope.eduHistoryToUpload[index].candidateId = $scope.applyCandidate.candidateId;
                                }
                                privateCandidate.addEducation($scope.eduHistoryToUpload[index]).$promise.then(function (results) {
                                    logger.info('add education history record success');
                                    $scope.eduHistoryUploaded.push(results);
                                    deferred.resolve(results);
                                }, function (reason) {
                                    hasError(reason, 'Unable to add employment history record!');
                                    deferred.reject(reason);
                                });
                            }
                            deferred.resolve(0);
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                    });

                    return deferred.promise;
                } else {
                    return privateCandidate.addEducation(payLoad).$promise.then(function (results) {
                        try {
                            payLoad = normalizeObjects(results);
                            deferred.resolve(payLoad);
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                        return deferred.promise;
                    });
                }
            };

            if (proxyFlag === 'addEducationHistory') {
                return addEducationHistory(parameters.viewModel);
            }

            var updateEducation = function (payLoad) {
                var deferred = $q.defer();
                if (payLoad.completed === null || payLoad.completed === undefined) {
                    payLoad.completed = 't';
                }
                return privateCandidate.updateEducation(payLoad).$promise.then(function (results) {
                    try {
                        payLoad = normalizeObjects(results);
                        deferred.resolve(payLoad);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if (proxyFlag === 'updateEducation') {
                return updateEducation(parameters.viewModel);
            }
            //</editor-fold>

            //<editor-fold desc="Candidate Employment"
            var addWorkHistory = function (payLoad) {
                var deferred = $q.defer();
                if ($scope.workHistoryToUpload !== null && $scope.workHistoryToUpload !== undefined
                    && $scope.workHistoryToUpload.length > 0 && $scope.workHistoryUploaded !== undefined && $scope.workHistoryUploaded.length === 0 &&
                    $scope.angularSchemaObserver.semaphoreCollection.isLeadCapture === true) {
                    for (var index in $scope.workHistoryToUpload) {
                        if($scope.resumeParsed === true){
                            $scope.workHistoryToUpload[index].candidateId = $scope.applyCandidate.candidateId;
                        }
                        if(parseInt(index) === 0 && (payLoad.title !== undefined || payLoad.title !== null) ) {
                            $scope.workHistoryToUpload[index].title = payLoad.title;
                        }
                        privateCandidate.addWorkHistory($scope.workHistoryToUpload[index]).$promise.then(function (results) {
                            logger.info('add employment history record success');
                            $scope.workHistoryUploaded.push(results);
                            deferred.resolve(results);
                        }, function (reason) {
                            hasError(reason, 'Unable to add employment history record!');
                            deferred.reject(reason);
                        });
                    }
                    return deferred.promise;
                } else {
                    return privateCandidate.addWorkHistory(payLoad).$promise.then(function (results) {
                        try {
                            payLoad = normalizeObjects(results);
                            deferred.resolve(payLoad);
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                        return deferred.promise;
                    });
                }
            };

            if (proxyFlag === 'addWorkHistory') {
                return addWorkHistory(parameters.viewModel);
            }

            var updateWorkHistory = function (payLoad) {
                var deferred = $q.defer();
                return privateCandidate.updateWorkHistory(payLoad).$promise.then(function (results) {
                    try {
                        payLoad = normalizeObjects(results);
                        deferred.resolve(payLoad);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if (proxyFlag === 'updateWorkHistory') {
                return updateWorkHistory(parameters.viewModel);
            }
            //</editor-fold>

            //<editor-fold desc="candidate certifications">
            var addCertification = function (payLoad) {
                var deferred = $q.defer();
                return privateCandidate.addCertification(payLoad).$promise.then(function (results) {
                    try {
                        payLoad = normalizeObjects(results);
                        deferred.resolve(payLoad);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if (proxyFlag === 'addCertification') {
                return addCertification(parameters.viewModel);
            }

            var updateCertification = function (payLoad) {
                var deferred = $q.defer();
                return privateCandidate.updateCertification(payLoad).$promise.then(function (results) {
                    try {
                        payLoad = normalizeObjects(results);
                        deferred.resolve(payLoad);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if (proxyFlag === 'updateCertification') {
                return updateCertification(parameters.viewModel);
            }

            //</editor-fold>

            //<editor-fold desc="Candidate Email Communication">
            var emailCandidate = function () {
                var deferred = $q.defer();
                // need to skip Email Notification for Social User's
                if ($scope.socialProvider.isSocialUserRegistration === true) {
                    deferred.resolve(0);
                    return deferred.promise;
                }

                var emailCandidate = {};
                emailCandidate.name = EMAIL_ACTIVATION_LINK_NAME;
                emailCandidate.type = EMAIL_ACTIVATION_LINK_TYPE;
                emailCandidate.client = clientName;
                emailCandidate.username = $scope.applyCandidate.email;
                return candidate.emailCandidate(emailCandidate).$promise.then(function (result) {
                    try {
                        logger.debug('Result !!!: ' + result);
                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };
            //</editor-fold>

            //<editor-fold desc="Application Submit">
            var lastContainerHandler = function () {
                $scope.globalProgressBarHandler(true);
                $scope.applicationStepServiceHandler()
                    .then(function () {
                        $scope.globalProgressBarHandler(true);
                        hasSuccess('Application complete, thank you!');
                        if (($scope.isSessionLogged && $scope.applyCandidate.locked === 'f') ||
                            (authService.isLoggedIn && authService.isSocialProfileConnection() === true)) {
                            delete $rootScope.resumeJSON;
                            delete $rootScope.resumeParsed;
                            delete $rootScope.applyCandidateId;
                            delete $rootScope.screening_answers_submit;
                            delete $rootScope.screening_answers;
                            if (authService.isSocialProfileConnection() === true) {
                                $rootScope.isReturningUser = $scope.applyCandidate.locked !== null;
                                ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: $rootScope.isReturningUser});
                            } else {
                                $rootScope.isReturningUser = true;
                                ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
                            }
                            $scope.globalProgressBarHandler(false);
                            $location.url(ApplyWorkFlow.current().url);
                        } else {
                            $scope.globalProgressBarHandler(true);
                            $rootScope.isReturningUser = false;
                            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: false});
                            $scope.apiProxyHandler('updateCandidateSendEmail')
                                .then(function () {
                                    logger.debug('Application complete, thank you!: headed to account');
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    $scope.globalProgressBarHandler(false);
                                });
                        }
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        $scope.globalProgressBarHandler(false);
                    });
            };

            if (proxyFlag === 'lastContainerHandler') {
                lastContainerHandler();
            }

            if (proxyFlag === 'updateCandidateSendEmail') {
                deferred = $q.defer();
                try {
                    if (!$scope.isSessionLogged || $scope.applyCandidate.locked === null || $scope.applyCandidate.locked === undefined) {
                        $scope.applyCandidate.locked = 't';
                        $scope.applyCandidate.password = $scope.applyCandidate.password = 'password';
                        $scope.isSessionLogged = !$scope.isSessionLogged;
                    }
                    updateCandidate()
                        .then(function (updateCandidateResponse) {
                            $scope.globalProgressBarHandler(true);
                            $scope.applyCandidate = updateCandidateResponse;
                            logger.debug('updateCandidate complete');
                            var urlPath = $location.url();
                            var emailRedirectURL = '';
                            var isLandingPage = _XC_CONFIG.landing_page !== false;
                            if (!$scope.isLeadCaptureForModal) {
                                if (urlPath.indexOf('/apply/') !== -1) {
                                    emailRedirectURL = ApplyWorkFlow.current().url;
                                } else if (urlPath.indexOf('/profile/') !== -1) {
                                    emailRedirectURL = '/profile/thank-you/';
                                } else {
                                    if (isLandingPage && _XC_CONFIG.landing_page.destination) {
                                        emailRedirectURL = _XC_CONFIG.landing_page.destination;
                                    }
                                    else {
                                        emailRedirectURL = '/profile/thank-you/';
                                    }
                                }
                            }
                            else {
                                emailRedirectURL = false;
                            }
                            emailCandidate()
                                .then(function (emailCandidateResponse) {
                                    if (!$scope.semaphoreCollection.isLeadCapture)
                                        $scope.globalProgressBarHandler(false);
                                    var deferred = $q.defer();
                                    try {

                                        var socialProfile = $scope.socialProvider.getProfile();
                                        logout(ApplyWorkFlow.current().retainSession);
                                        if ($scope.socialProvider.isSocialUserRegistration === true) {
                                            $scope.socialUserFirstLoginAttempt();
                                        } else if ($scope.jobId && $scope.jobUrl) {
                                            $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                        }
                                        else if (CandidateWorkFlow.current.get() === E_WORK_FLOW.ALERT_LCP) {
                                            $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                        }
                                        // Need to assume that we need to do full redirects for landing pages
                                        else if (isLandingPage) {
                                            insertMicrositeOmnidata();
                                            // May not have a redirect, just show the thank-you content
                                            $('.landing-page-content').hide();
                                            $('.landing-page-thank-you').show();

                                            if (_XC_CONFIG.landing_page.destination) {
                                                window.location.href = emailRedirectURL;
                                            }
                                        }
                                        else {
                                            if (emailRedirectURL) {
                                                $location.url(emailRedirectURL);
                                            }
                                            else {
                                                $scope.globalProgressBarHandler(false);
                                                $scope.isModalLcpShowThankYou = true;
                                            }
                                        }
                                        deferred.resolve(0);
                                    }
                                    catch (reason) {
                                        logger.error(reason);
                                        $scope.globalProgressBarHandler(false);

                                        if ($scope.jobId && $scope.jobUrl) {
                                            $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                        } else {
                                            $location.url(emailRedirectURL);
                                        }
                                        deferred.reject(reason);
                                    }
                                    return deferred.promise;
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    logout(ApplyWorkFlow.current().retainSession);
                                    $scope.globalProgressBarHandler(false);
                                    if ($scope.jobId && $scope.jobUrl) {
                                        $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                    } else if (CandidateWorkFlow.current.get() === E_WORK_FLOW.ALERT_LCP) {
                                        $scope.modelProcessor.baseHelper.seoRedirectHandler();
                                    } else {
                                        $location.url(emailRedirectURL);
                                    }
                                    deferred.reject(reason);
                                });
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            $scope.globalProgressBarHandler(false);
                        });
                }
                catch (reason) {
                    logger.error(reason);
                    $scope.globalProgressBarHandler(false);
                    deferred.reject(reason);
                }
                return deferred.promise;
            }
            //</editor-fold>

            //<editor-fold desc="candidate login">
            if (proxyFlag === 'login') {
                return login();
            }
            //</editor-fold>

            //<editor-fold desc="subscriptions">
            var unsubscribeAlerts = function (payLoad) {
                var deferred = $q.defer();
                if (payLoad.subscription === true || $scope.isUpdate) {
                    deferred.resolve(0);
                    return deferred.promise;
                }
                CandidateWorkFlow.preferences.communications.subscriptions.marketing.unSubscribe(payLoad.email).then(function (response) {
                    deferred.resolve(0);
                }, function (reason) {
                    deferred.resolve(0);
                });
                return deferred.promise;
            };

            if (proxyFlag === 'unsubscribeAlerts') {
                return unsubscribeAlerts(parameters.viewModel);
            }
            //</editor-fold>

            //<editor-fold desc="candidate OPT IN and OUT">
            var candidateOptIn = function (payLoad) {
                var deferred = $q.defer();
                if (!payLoad || !payLoad.termsAndPolicy || payLoad.termsAndPolicy === false) {
                    deferred.resolve(0);
                    return deferred.promise;
                }
                CandidateWorkFlow.profile.termsAndConditions.optIN(payLoad.candidateId).then(function (response) {
                    deferred.resolve(0);
                }, function (reason) {
                    deferred.resolve(0);
                });
                return deferred.promise;
            };

            if (proxyFlag === 'termsAndConditionsOptIn') {
                return candidateOptIn(parameters.viewModel);
            }
            //</editor-fold>

            // <editor-fold desc="on boarding">
            var onFormComplete = function (payLoad) {
                //TODO
                var deferred = $q.defer();
                deferred.resolve(0);
                return deferred.promise();
            };

            if (proxyFlag === TEMPLATE_CONSTANTS.PREFIX.ON_BOARDING_FORM_COMPLETION) {
                return onFormComplete(parameters.viewModel);
            }

            //</editor-fold>

        };

        $scope.fetchCurrentCandidate = function (fieldGroupInstance, loggedInCallBack) {
            if (authService.isLoggedIn) {
                logger.debug('querying candidate');
                privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                    $scope.applyCandidate = normalizeObjects(result);
                    ApplicationState.session.candidate.set($scope.applyCandidate);
                    ApplicationState.localStorage.candidate.id.set($scope.applyCandidate.candidateId);
                    authService.setBasicCandidate($scope.applyCandidate);
                    //A generic broad cast once the candidate details has been fetched. We will be calling this only for the first form, to avoid multiple event creation.
                    //Any requirement for a specific scenario can be implemented by catching the event on their respective controllers.
                    if (fieldGroupInstance.indexOfForm === 1) {
                        var reqId = "";
                        var jobId = "";
                        if ($scope.reqId !== null && typeof($scope.reqId) !== "undefined") {
                            reqId = $scope.reqId;
                        }
                        if ($scope.jobId !== null && typeof($scope.jobId) !== "undefined") {
                            jobId = $scope.jobId;
                        }
                        $rootScope.$broadcast(BROAD_CAST_NAMESPACE.CURRENT_CANDIDATE_FETCHED, {
                            candidateId: $scope.applyCandidate.candidateId,
                            mail       : $scope.applyCandidate.uname,
                            reqId      : reqId,
                            jobId      : jobId
                        });
                    }
                    $scope.isSessionLogged = true;
                    $scope.canInfoComplete = true;
                    isBearerAuthentication = authService.isSocialProfileConnection();
                    $scope.genericDataPopulate();
                    /*var genericData = $scope.modelProcessor.candidate.externalDataSourceCollection["genericPopulate"].data;
                     if(genericData !== undefined && genericData  !== null && !angular.equals(genericData, {})){
                     var candidateModel = angular.merge(angular.copy($scope.applyCandidate),genericData);
                     }*/
                    if (loggedInCallBack !== undefined) loggedInCallBack($scope.applyCandidate, fieldGroupInstance);
                    if (!$scope.semaphoreCollection.isLeadCapture && $scope.semaphoreCollection.onBoarding !== true) {
                        privateApplication.getApplicationsByCandidateId({candidateId: $scope.applyCandidate.candidateId}).$promise
                            .then(function (result) {
                                $scope.candidateApplications = normalizeObjects(result);
                                logger.log('Application info:');
                                logger.log($scope.candidateApplications);
                                if($scope.checkAlreadyApplied) $scope.checkAlreadyApplied();
                                $scope.globalProgressBarHandler(false);
                            });
                    } else {
                        $scope.globalProgressBarHandler(false);
                    }
                })
                    .catch(function (reason) {
                        logger.error(reason);
                        $scope.globalProgressBarHandler(false);
                    });

            } else {
                //if(!angular.equals(queryString, {})) {
                $scope.genericDataPopulate();
                //}
                $scope.globalProgressBarHandler(false);
                logger.debug('add new candidate');
                $scope.isSessionLogged = false;
                isBearerAuthentication = false;
            }
        };

        $scope.fetchCandidateAssociationData = function (fieldGroupInstance, dataSourceLoader, addressOfAPI) {
            if (authService.isLoggedIn) {
                fieldGroupInstance.showEditButton = true;
                var applyCandidate = ApplicationState.session.candidate.get();
                addressOfAPI({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function (result) {
                    var results = normalizeObjects(result);
                    fieldGroupInstance.showEditButton = true;
                    if (results.length > 0) {
                        dataSourceLoader(results, fieldGroupInstance);
                    } else {
                        dataSourceLoader(null, fieldGroupInstance);
                    }
                    $scope.globalProgressBarHandler(false);
                }, function (reason) {
                    $scope.globalProgressBarHandler(false);
                    logger.error(reason);
                });
            }
            $scope.globalProgressBarHandler(false);
        };

        //</editor-fold>

        //<editor-fold desc="Application Steps">
        $scope.applicationStepServiceHandler = function () {
            var prepareAddApplication = function () {
                var deferred = $q.defer();
                try {
                    logger.debug('prepareAddApplication');
                    $scope.applyCandidate = ApplicationState.session.candidate.get();
                    $scope.application.candidateId = $scope.applyCandidate.candidateId;
                    $scope.application.requisitionId = $scope.reqIdLink;
                    if (_XC_CONFIG.omniDataEnabled === 'true') {
                        if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                            omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.application.candidateId, $scope.application.requisitionId, $scope.applyCandidate.email)
                        }
                    }
                    //remove session storage of resume data
                    //sessionStorage.clear()
                    ApplicationState.session.candidate.resume.applyResumeStateContainer.remove();

                    $scope.application.status = 'Applied';
                    $scope.application.reqScreenValue = 0;
                    $scope.application.generalScreenValue = 0;
                    $scope.application.interviewScreenValue = 0;
                    $scope.application.totalScreenValue = 0;
                    var getCurDate = new Date();
                    $scope.application.applyDate = getCurDate.getTime();

                    var cookieData = $scope.applyCandidate;
                    delete cookieData.password;

                    var expires = new Date();
                    expires.setDate(expires.getDate() + 30);
                    var opts = {'expires': expires};
                    $cookies.putObject('xcc', cookieData);

                    deferred.resolve(0);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var executeAddApplication = function () {
                return privateApplication.addApplication($scope.application).$promise.then(function (results) {
                    var deferred = $q.defer();
                    try {
                        $scope.application = normalizeObjects(results);
                        SessionStorage.set('appId', $scope.application.applicationId);
                        ApplicationState.localStorage.application.id.set($scope.application.applicationId);
                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var prepareAddStep = function () {
                var deferred = $q.defer();
                try {
                    logger.debug('prepareAddStep');
                    var getCurDate = new Date();
                    $scope.step.data = {
                        'applicationId': $scope.application.applicationId,
                        'name'         : $scope.application.status,
                        'usersId'      : 1
                    };
                    $scope.step.comment = {value: 'System Generated'};
                    logger.trace(angular.toJson($scope.step));

                    deferred.resolve(0);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var executeAddStep = function () {
                logger.debug('executeAddStep');
                return privateStep.addApplicationStepById({
                    applicationId: $scope.step.data.applicationId,
                    usersId      : $scope.step.data.usersId,
                    stepValue    : $scope.step.data.name
                }, $scope.step.comment).$promise.then(function (results) {
                    var deferred = $q.defer();
                    try {
                        logger.debug('add step has been completed');
                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var submitScreeningAnswers = function (responseCount) {
                logger.debug('submitScreeningAnswers');
                var deferred = $q.defer();
                var addedAnswer = [];
                responseCount = $rootScope.screening_answers.length;
                try {
                    for (var key2 in $rootScope.screening_answers) {
                        if ($rootScope.screening_answers[key2].answer != null) {
                            $rootScope.screening_answers[key2].applicationId = $scope.application.applicationId;
                            try {
                                questions.addAnswer($rootScope.screening_answers[key2]).$promise
                                    .then(function (results) {
                                        addedAnswer.push(normalizeObjects(results));
                                        if (responseCount === addedAnswer.length) {
                                            logger.debug('add answers has been completed');
                                            return deferred.resolve(addedAnswer);
                                        }
                                    })
                                    .catch(function (reason) {
                                        logger.error(reason);
                                        deferred.reject(reason);
                                    });
                            }
                            catch (reason) {
                                logger.error(reason);
                                deferred.reject(reason);
                            }
                        } else {
                            responseCount = responseCount - 1;
                        }
                    }
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }

                return deferred.promise;
            };

            var deferred = $q.defer();
            try {
                prepareAddApplication()
                    .then(function (addApplicationResponse) {
                        executeAddApplication()
                            .then(function (executeApplicationResponse) {
                                prepareAddStep()
                                    .then(function (addStepResponse) {
                                        executeAddStep()
                                            .then(function (executeStepResponse) {
                                                ApplyWorkFlow.next();
                                                ApplicationState.showScreeningMessageComponent = false;
                                                if ($rootScope.screening_answers_submit && $rootScope.screening_answers.length > 0) {
                                                    ApplicationState.showScreeningMessageComponent = true;
                                                    submitScreeningAnswers()
                                                        .then(function (submitScreeningAnswersResponse) {
                                                            screeningMessageViewModelService.setViewModel()
                                                                .then(function (screeningMessageViewModel) {
                                                                    ApplicationState.localStorage.screening.result.set(screeningMessageViewModel);
                                                                    logger.debug('screening evaluation is completed');
                                                                    if (screeningMessageViewModel.hasQualified) {
                                                                        var positionCode = ApplicationState.localStorage.requisition.assessmentPositionCode.get();
                                                                        if (positionCode !== null && angular.isArray(positionCode) === true && positionCode.length > 0) {
                                                                            candidateAssessmentService.createForRequisition(ApplicationState.session.candidate.get().candidateId, ApplicationState.session.requisition.get().requisitionId)
                                                                                .then(function (result) {
                                                                                    if (result.length === 0) {
                                                                                        logger.debug('NO assessment for candidate is created');
                                                                                    } else {
                                                                                        logger.debug('assessment for candidate is created');
                                                                                    }
                                                                                    deferred.resolve(0);
                                                                                })
                                                                                .catch(function (reason) {
                                                                                    ApplyWorkFlow.next();
                                                                                    logger.error('failed to create assessments');
                                                                                    logger.error(reason);
                                                                                    deferred.resolve(0);
                                                                                });
                                                                        } else {
                                                                            ApplyWorkFlow.next();
                                                                            logger.debug('add Application step completed');
                                                                            deferred.resolve(0);
                                                                        }
                                                                    } else {
                                                                        ApplyWorkFlow.next();
                                                                        logger.debug('add Application step completed');
                                                                        deferred.resolve(0);
                                                                    }
                                                                })
                                                                .catch(function (reason) {
                                                                    ApplyWorkFlow.next();
                                                                    logger.error(reason);
                                                                    deferred.resolve(0);
                                                                });
                                                        })
                                                        .catch(function (reason) {
                                                            logger.error(reason);
                                                            $scope.globalProgressBarHandler(false);
                                                            deferred.reject(reason);
                                                        });
                                                } else {
                                                    ApplyWorkFlow.next();
                                                    logger.debug('add Application step completed');
                                                    deferred.resolve(0);
                                                }
                                            })
                                            .catch(function (reason) {
                                                logger.error(reason);
                                                $scope.globalProgressBarHandler(false);
                                                deferred.reject(reason);
                                            });
                                    })
                                    .catch(function (reason) {
                                        logger.error(reason);
                                        $scope.globalProgressBarHandler(false);
                                        deferred.reject(reason);
                                    });
                            })
                            .catch(function (reason) {
                                logger.error(reason);
                                $scope.globalProgressBarHandler(false);
                                deferred.reject(reason);
                            });
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        $scope.globalProgressBarHandler(false);
                        deferred.reject(reason);
                    });
            }
            catch (reason) {
                logger.error(reason);
                deferred.reject(reason);
            }
            return deferred.promise;
        };
        //</editor-fold>

        //<editor-fold desc="View-Model Processor">
        $scope.buildModelProcessor = function () {

            var globalConstructor = {
                initialize: function () {
                    $scope.globalProgressBarHandler(true);
                    $scope.attachmentDetails = {};
                    $scope.fileFormName = {};
                    $scope.dobPattern = '\\d{4}-\\d{2}-\\d{2}';
                    $rootScope.resumeJSON = {};
                    $rootScope.resumeParsed = false;
                    $rootScope.applyCandidateId = null;
                    $scope.alreadyApplied = false;
                    $scope.credentials = {};
                    $scope.uniqueEmail = true;
                    $scope.deactiveCheck = true;
                    $scope.applyCandidate = {};

                    if ((!authService.isLoggedIn) && ($scope.preLoadExternalDataSource !== undefined && $scope.preLoadExternalDataSource === true)) {
                        $scope._newSocialProfileHandler();
                    } else {
                        $scope.globalProgressBarHandler(false);
                    }
                }
            };

            var externalDataSourceProtoType = {
                "resume"         : {},
                "socialSite"     : {},
                "genericPopulate": {},
                "primary"        : {"identity": "resume"},
                "secondary"      : {"identity": "socialSite"},
                "third"          : {"identity": "genericPopulate"}
            };

            var baseHelper = {
                fieldParsers                : {
                    JSON             : {
                        fromDB: function (value) {
                            try {
                                if (value !== undefined && value !== null) {
                                    var _parsedValue = angular.fromJson(value);
                                    return _parsedValue;
                                } else {
                                    return value;
                                }
                            }
                            catch (reason) {
                                return value;
                            }
                        },
                        toDB  : function (value) {
                            try {

                                return angular.toJson(value);

                            }
                            catch (reason) {
                                return value;
                            }
                        }
                    },
                    arrayToJoin      : {
                        toDB  : function (value) {
                            try {
                                if (value !== undefined && value !== null) {
                                    if (angular.isArray(value)) {
                                        return value.join();
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return value;
                                }
                            }
                            catch (reason) {
                                return value;
                            }
                        },
                        fromDB: function (value) {
                            try {
                                if (value !== undefined && value !== null) {
                                    return value.split(",");
                                } else {
                                    return value;
                                }
                            }
                            catch (reason) {
                                return value;
                            }
                        }
                    },
                    "null"           : {
                        defaults: function (value) {
                            if (value === null) {
                                return '';
                            } else {
                                return value;
                            }
                        }
                    },
                    "list"           : {
                        internalCaller : function (fieldLookUpCollection, key, value, addressOfCaller) {
                            if (fieldLookUpCollection === undefined || fieldLookUpCollection.length === 0) {
                                return value;
                            }
                            var element = _.where(fieldLookUpCollection, {key: key});
                            if (element !== undefined && element.length > 0) {
                                return addressOfCaller(value, element[0].listLookUp);
                            } else {
                                return value;
                            }
                        },
                        getDisplayText : function (fieldLookUpCollection, key, value) {
                            return this.internalCaller(fieldLookUpCollection, key, value, $scope.getLabelByValue);
                        },
                        getDisplayValue: function (fieldLookUpCollection, key, value) {
                            return this.internalCaller(fieldLookUpCollection, key, value, $scope.getValueByLabel);
                        }
                    },
                    "completed"      : {
                        displayParser : function (value) {
                            if (value === true || value === 't') {
                                return 'Yes';
                            } else {
                                return 'No';
                            }
                        },
                        viewParser    : function (value) {
                            if (value === 'Yes') {
                                return true;
                            } else if (value === 'No') {
                                return false;
                            } else {
                                return value;
                            }
                        },
                        databaseParser: function (value) {
                            if (value === true) {
                                return 't';
                            } else {
                                return 'f';
                            }
                        }
                    },
                    "issueDate"      : {
                        displayParser : function (value, formatInString) {
                            if (formatInString === true) {
                                return $filter('date')(value, 'yyyy-MM-dd');
                            } else {
                                return new Date(value);
                            }
                        },
                        viewParser    : function (value) {
                            return new Date(value);
                        },
                        databaseParser: function (value) {
                            return $filter('date')(value, 'yyyy-MM-dd');
                        }
                    },
                    "dob"            : {
                        displayParser : function (value, formatInString) {
                            if (value == null || value == '')
                                return null;
                            else {
                                if (formatInString === true) {
                                    return $filter('date')(value, 'yyyy-MM-dd');
                                } else {
                                    return new Date(value);
                                }
                            }

                        },
                        viewParser    : function (value) {
                            return new Date(value);
                        },
                        databaseParser: function (value) {
                            return $filter('date')(value, 'yyyy-MM-dd');
                        }
                    },
                    genericDateParser: {
                        displayParser : function (value, formatInString) {
                            if (value == null || value == '')
                                return null;
                            else {
                                if (formatInString === true) {
                                    return $filter('date')(value, 'yyyy-MM-dd');
                                } else {
                                    return new Date(value);
                                }
                            }

                        },
                        viewParser    : function (value) {
                            return new Date(value);
                        },
                        databaseParser: function (value) {
                            return $filter('date')(value, 'yyyy-MM-dd');
                        }
                    }
                },
                gridFormHandler             : {
                    submit                 : function (fieldGroupInstance, transaction, apiProxyKey) {
                        $scope.globalProgressBarHandler(true);
                        var isValidTransactionQueue = fieldGroupInstance.isValidTransactionQueue();
                        if (fieldGroupInstance.gridHandler !== undefined || (isValidTransactionQueue)) {
                            var parameters = {
                                viewModel       : {},
                                isOfflineStorage: fieldGroupInstance.isOfflineStorage
                            };
                            $scope.angularSchemaObserver.modelToDatabaseConverter(fieldGroupInstance, parameters.viewModel);
                            $scope.apiProxyHandler(apiProxyKey, parameters)
                                .then(function (results) {
                                    parameters.viewModel = results;
                                    var addedRow = {};
                                    if (fieldGroupInstance.gridHandler !== undefined) {
                                        $scope.angularSchemaObserver.databaseToModelConverter(fieldGroupInstance.filter.getFieldCustomParserDefinition(), fieldGroupInstance.filter.getFieldParserDefinition(), fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, addedRow, parameters.viewModel, transaction, true, fieldGroupInstance.gridHandler.modelHandler);
                                        fieldGroupInstance.gridHandler.addRow(addedRow, transaction.table);
                                        $scope.modelProcessor.baseHelper.gridFormHandler.resetFormModel(fieldGroupInstance);
                                    } else {
                                        $scope.angularSchemaObserver.databaseToModelConverter(fieldGroupInstance.filter.getFieldCustomParserDefinition(), fieldGroupInstance.filter.getFieldParserDefinition(), fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, addedRow, parameters.viewModel, transaction, true);
                                        $scope.angularSchemaObserver.mergeModel(fieldGroupInstance.model, addedRow);
                                        $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                                    }
                                    if ($scope.semaphoreCollection.isLeadCapture === false
                                        || $scope.angularSchemaObserver.formStyleHandler.viewStyle !== $scope.angularSchemaObserver.formStyleHandler.viewStylesEnum.none) {
                                        $scope.globalProgressBarHandler(false);
                                    }
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    $scope.globalProgressBarHandler(false);
                                });

                        }
                    }
                    , update               : function (fieldGroupInstance, transaction, apiProxyKey) {
                        $scope.globalProgressBarHandler(true);
                        var isValidTransactionQueue = fieldGroupInstance.isValidTransactionQueue();
                        if (fieldGroupInstance.gridHandler !== undefined || (isValidTransactionQueue)) {
                            var parameters = {
                                viewModel       : {},
                                isOfflineStorage: fieldGroupInstance.isOfflineStorage
                            };
                            $scope.angularSchemaObserver.modelToDatabaseConverter(fieldGroupInstance, parameters.viewModel);
                            $scope.apiProxyHandler(apiProxyKey, parameters)
                                .then(function (results) {
                                    parameters.viewModel = results;
                                    var modifiedData = {};
                                    if (fieldGroupInstance.gridHandler !== undefined) {
                                        $scope.angularSchemaObserver.databaseToModelConverter(fieldGroupInstance.filter.getFieldCustomParserDefinition(), fieldGroupInstance.filter.getFieldParserDefinition(), fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, modifiedData, parameters.viewModel, transaction, true, fieldGroupInstance.gridHandler.modelHandler);
                                        fieldGroupInstance.gridHandler.updateRow(modifiedData, transaction.table);
                                        $scope.modelProcessor.baseHelper.gridFormHandler.resetFormModel(fieldGroupInstance);

                                    } else {
                                        $scope.angularSchemaObserver.databaseToModelConverter(fieldGroupInstance.filter.getFieldCustomParserDefinition(), fieldGroupInstance.filter.getFieldParserDefinition(), fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, modifiedData, parameters.viewModel, transaction, true);
                                        $scope.angularSchemaObserver.mergeModel(fieldGroupInstance.model, modifiedData);
                                        $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                                    }
                                    if ($scope.semaphoreCollection.isLeadCapture === false
                                        || $scope.angularSchemaObserver.formStyleHandler.viewStyle !== $scope.angularSchemaObserver.formStyleHandler.viewStylesEnum.none) {
                                        $scope.globalProgressBarHandler(false);
                                    }
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    $scope.globalProgressBarHandler(false);
                                });

                        }
                    }
                    , delete               : function (fieldGroupInstance, addressOfApi, apiParams, keyField) {
                        $scope.globalProgressBarHandler(true);
                        if (fieldGroupInstance.isOfflineStorage !== undefined && fieldGroupInstance.isOfflineStorage === true) {
                            fieldGroupInstance.gridHandler.removeRow(keyField);
                            fieldGroupInstance.model = {};
                            fieldGroupInstance.model.completed = false;
                            $scope.globalProgressBarHandler(false);
                            return;
                        }
                        addressOfApi(apiParams).$promise.then(function (results) {
                            fieldGroupInstance.gridHandler.removeRow(keyField);
                            fieldGroupInstance.model = {};
                            fieldGroupInstance.model.completed = false;
                            $scope.globalProgressBarHandler(false);
                        }, function (reason) {
                            logger.error(reason);
                            $scope.globalProgressBarHandler(false);
                        });

                    }
                    , resetFormModel       : function (fieldGroupInstance) {
                        fieldGroupInstance.model = {};
                        fieldGroupInstance.model.completed = false;
                        fieldGroupInstance.currentForm.$setPristine();
                        fieldGroupInstance.currentForm.$setUntouched();
                        fieldGroupInstance.setKeyElementFocus();
                    }
                    , externalDataInsertion: function (fieldGroupInstance, apiProxyKey, source) {
                        var _dataSourceSyncWasDisabled = (fieldGroupInstance.isPartialSave === true && fieldGroupInstance.isOfflineStorage === false);
                        var sourceIdentity = source.primary.identity;
                        var inputModelCollection = $scope.angularSchemaObserver.getPrimaryExternalDataSource(source).data;
                        if ((!angular.isArray(inputModelCollection) || inputModelCollection.length === 0)) {
                            inputModelCollection = $scope.angularSchemaObserver.getSecondaryExternalDataSource(source).data;
                            sourceIdentity = source.secondary.identity;
                        }
                        if (_dataSourceSyncWasDisabled && (!angular.isArray(inputModelCollection) || inputModelCollection.length === 0)) {
                            inputModelCollection = fieldGroupInstance.gridHandler.modelHandler.rowCollection;
                        }
                        var deferred = $q.defer();
                        if (authService.isLoggedIn) {
                            var completedCount = 0;
                            var rowLimitCount = fieldGroupInstance.gridHandler.modelHandler.maxRowCount;
                            var applyCandidate = ApplicationState.session.candidate.get();
                            if (angular.isArray(inputModelCollection)) {
                                angular.forEach(inputModelCollection, function (model) {
                                    if ((CUSTOM_FIELD_MANAGEMENT_SETTINGS === undefined || CUSTOM_FIELD_MANAGEMENT_SETTINGS.resumeDataParseRule === undefined || CUSTOM_FIELD_MANAGEMENT_SETTINGS.resumeDataParseRule.includeMandatoryFieldCheck !== true || sourceIdentity !== source.primary.identity) || (formInstance.isValidModel(model))) {
                                        model.candidateId = $scope.applyCandidate.candidateId;
                                        $scope.globalProgressBarHandler(true);
                                        if (rowLimitCount === 0 || completedCount < rowLimitCount) {
                                            completedCount++;
                                            var parameters = {
                                                viewModel: model
                                            };
                                            $scope.apiProxyHandler(apiProxyKey, parameters)
                                                .then(function (results) {
                                                    parameters.viewModel = results;
                                                    var addedRow = {};
                                                    $scope.angularSchemaObserver.databaseToModelConverter(fieldGroupInstance.filter.getFieldCustomParserDefinition(), fieldGroupInstance.filter.getFieldParserDefinition(), fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, addedRow, parameters.viewModel, null, true, fieldGroupInstance.gridHandler.modelHandler);
                                                    if (_dataSourceSyncWasDisabled === false) {
                                                        fieldGroupInstance.gridHandler.addRow(addedRow, fieldGroupInstance.table);
                                                    } else {
                                                        angular.extend(model, parameters.viewModel);
                                                        deferred.resolve(0);
                                                        $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                                                        return;
                                                    }
                                                    deferred.resolve(0);
                                                })
                                                .catch(function (reason) {
                                                    logger.error(reason);
                                                    $scope.globalProgressBarHandler(false);
                                                });
                                        }
                                    }
                                });
                                $scope.globalProgressBarHandler(false);
                            } else {
                                $scope.globalProgressBarHandler(false);
                                deferred.resolve(0);
                            }
                        } else {
                            $scope.globalProgressBarHandler(false);
                            deferred.resolve(0);
                        }
                        return deferred.$promise;
                    }
                },
                externalDataSourceCollection: angular.copy(externalDataSourceProtoType),
                protoTypeSupplier           : {
                    gridConfiguration: function (sourceConfig, gridConfiguration, fieldDefinition) {
                        sourceConfig.rowCollection = [];
                        sourceConfig.minRowCount = gridConfiguration.minRowCount;
                        sourceConfig.maxRowCount = gridConfiguration.maxRowCount;
                        sourceConfig.title = gridConfiguration.title;
                        sourceConfig.messageOnMinCount = gridConfiguration.messageOnMinCount;
                        sourceConfig.messageOnMaxCount = gridConfiguration.messageOnMaxCount;
                        if (gridConfiguration.labelField !== undefined) {
                            sourceConfig.labelField = gridConfiguration.labelField;
                        }
                        sourceConfig.columns = [];
                        angular.forEach(gridConfiguration.headerFields, function (headerField) {
                            var definition = _.findWhere(fieldDefinition, {key: headerField});
                            if (definition !== undefined) {
                                sourceConfig.columns.push({key: definition.key, title: definition.title});
                            }
                        });
                    }
                }
                , initialize                : function () {
                    $scope.editModel = authService.isLoggedIn;
                },
                submit                      : function (fieldGroupInstance, transaction) {
                    var deferred = $q.defer();
                    return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                },
                update                      : function (fieldGroupInstance, transaction) {
                    var deferred = $q.defer();
                    return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                },
                lastFormHandler             : function (fieldGroupInstance) {
                    var deferred = $q.defer();
                    if (fieldGroupInstance.isLastForm === true) {
                        $scope.globalProgressBarHandler(true);
                        fieldGroupInstance.hide = true;
                        fieldGroupInstance.editModel = true;
                        if ($scope.semaphoreCollection.isLeadCapture) {
                            return $scope.modelProcessor.baseHelper.leadCaptureLastFormHandler(fieldGroupInstance);
                        }else if($scope.semaphoreCollection.isDashboard){
                            var _nextFieldGroup = fieldGroupInstance.nextFieldGroup;
                            $scope.angularSchemaObserver.DashboardUpdateAllFormData(fieldGroupInstance, _nextFieldGroup);
                            $scope.globalProgressBarHandler(false);
                        }else {
                            return $scope.apiProxyHandler($scope.lastFormProxyIndicator);
                        }
                    }
                },
                leadCaptureLastFormHandler  : function (fieldGroupInstance) {
                    var deferred = $q.defer();
                    var isLandingPage = _XC_CONFIG.landing_page !== false;
                    $scope.applyCandidate = ApplicationState.session.candidate.get();
                    try {
                        logger.debug('processAddCandidate complete');
                        if (fieldGroupInstance.isLastForm === true &&
                            ($scope.applyCandidate.locked === 't' ||
                                $scope.applyCandidate.locked === null ||
                                $scope.applyCandidate.locked === undefined)) {
                            $scope.apiProxyHandler('updateCandidateSendEmail')
                                .then(function () {
                                    logger.debug('Application complete, thank you!: headed to account');
                                    deferred.resolve(0);
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    $scope.globalProgressBarHandler(false);
                                });
                        } else if (fieldGroupInstance.isLastForm === true && ($scope.applyCandidate.locked === 'f' || isBearerAuthentication === true)) {
                            hasSuccess('update complete, thank you!');
                            delete $rootScope.resumeJSON;
                            delete $rootScope.resumeParsed;
                            delete $rootScope.applyCandidateId;
                            if ($scope.jobId && $scope.jobUrl) {
                                $scope.modelProcessor.baseHelper.seoRedirectHandler();
                            }
                            /*This redirect scenario is for logged in user in microsite. After updating the data the page should show thank you message*/
                            else if (_XC_CONFIG.landing_page) {
                                if (_XC_CONFIG.landing_page.destination) {
                                    $window.location.href = _XC_CONFIG.landing_page.destination;
                                }
                                else {
                                    insertMicrositeOmnidata();
                                    $('.landing-page-content').hide();
                                    $('.landing-page-thank-you').show();
                                }
                            }
                            else {
                                $window.location.href = '/profile/';
                            }
                        } else if (fieldGroupInstance.isLastForm !== true) {
                            $scope.globalProgressBarHandler(false);
                            delete fieldGroupInstance.onCompleteHandler;
                            return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                        }
                    }
                    catch (reason) {
                        $scope.globalProgressBarHandler(false);
                        deferred.reject(reason);
                        logger.error(reason);
                    }
                    return deferred.promise;
                },
                seoRedirectHandler          : function () {
                    if (_XC_CONFIG.xcloudPageAttributes.destination !== undefined && _XC_CONFIG.xcloudPageAttributes.destination !== null) {
                        if (_XC_CONFIG.xcloudPageAttributes.target !== undefined && _XC_CONFIG.xcloudPageAttributes.target !== null) {
                            if (_XC_CONFIG.xcloudPageAttributes.targetWindow !== undefined && _XC_CONFIG.xcloudPageAttributes.targetWindow !== null) {
                                $window.open(_XC_CONFIG.xcloudPageAttributes.destination ? _XC_CONFIG.xcloudPageAttributes.destination : $scope.jobUrl, _XC_CONFIG.xcloudPageAttributes.target, "location=yes");
                            } else {
                                $window.open(_XC_CONFIG.xcloudPageAttributes.destination ? _XC_CONFIG.xcloudPageAttributes.destination : $scope.jobUrl, _XC_CONFIG.xcloudPageAttributes.target);
                            }
                            if ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true) {
                                $window.open('/profile/');
                            }
                            else if ($rootScope.isNewUser === true) {
                                var parentPage = $window.location.pathname.split('/');
                                if (parentPage.length === 3) {
                                    $window.location.href = '/' + parentPage[1] + '/thank-you/';
                                }
                                else if (parentPage.length === 4) {
                                    $window.location.href = '/' + parentPage[1] + '/' + parentPage[2] + '/thank-you/';
                                } else {
                                    $window.location.href = '/profile/thank-you/';
                                }
                            }
                        } else {
                            $window.location.href = _XC_CONFIG.xcloudPageAttributes.destination ? _XC_CONFIG.xcloudPageAttributes.destination : $scope.jobUrl;
                        }
                    }
                    else if(authService.isLoggedIn === true && CandidateWorkFlow.current.get() === E_WORK_FLOW.JOIN_LCP && _XC_CONFIG.landing_page ===false) {
                        var loginRedirect = ModelDependencyFactory.schemaInterpolation.languageSupplier("/profile/");
                        window.location.replace(loginRedirect);
                    }
                    else {
                        if ($scope.jobUrl !== undefined && $scope.jobUrl !== null) {
                            $window.location.href = $scope.jobUrl;
                        } else {
                            logger.log('Fetching job url failed');
                            if ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true) {
                                $window.location.href = '/profile';
                            }
                            else if ($rootScope.isNewUser === true) {
                                var parentPage = $window.location.pathname.split('/');
                                if (parentPage.length === 3) {
                                    $window.location.href = '/' + parentPage[1] + '/thank-you/';
                                }
                                else if (parentPage.length === 4) {
                                    $window.location.href = '/' + parentPage[1] + '/' + parentPage[2] + '/thank-you/';
                                } else {
                                    $window.location.href = '/profile/thank-you/';
                                }
                            }
                        }

                    }
                }
                , emitReceiver              : function (eventName, args) {
                    $scope.angularSchemaObserver.registerNgModel(args);
                }
            };

            var candidateHandler = {
                keyField                    : 'candidateId',
                submit                      : function (fieldGroupInstance, transaction) {
                    $scope.globalProgressBarHandler(true);
                    var parameters = {
                        viewModel: {}
                    };
                    $scope.angularSchemaObserver.modelToDatabaseConverter(fieldGroupInstance, parameters.viewModel);
                    $scope.applyCandidate = angular.merge($scope.applyCandidate, parameters.viewModel);
                    $scope.apiProxyHandler('processAddCandidate')
                        .then(function () {
                            var deferred = $q.defer();
                            if ($scope.semaphoreCollection.isLeadCapture) {
                                var cookieData = _.pick($scope.applyCandidate, fieldGroupInstance.filter.getFieldCollection());
                                var expires = new Date();
                                expires.setDate(expires.getDate() + 30);
                                var opts = {'expires': expires};
                                $cookies.putObject('xcc', cookieData, opts);

                                if (_XC_CONFIG.landing_page && _XC_CONFIG.landing_page.folder_id) {
                                    // We'll add them to a folder async from the rest of the api
                                    //modifying the api as private endpoint is not working
                                    var folderData = {
                                        destinationList: [parseInt(_XC_CONFIG.landing_page.folder_id)],
                                        candidateList  : [parseInt($scope.applyCandidate.candidateId)]
                                        //status     : "associated",
                                        //created    : new Date().getTime(),
                                        //emailed    : "f"
                                    };
                                    publicFolder.addCandidateToFolder(folderData);
                                    jQuery('.loader').css('display', 'none');
                                }
                                var folderId = $scope.angularSchemaObserver.schemaDefinitionCollection[0].formDefinition[1].XCloudDefinition.folderId;
                                if(folderId !== undefined && folderId !== null) {
                                    var folderIdCollection = [];
                                    if(angular.isArray(folderId)) {
                                        angular.forEach(folderId, function (folderId) {
                                            if(folderId !== null && folderId !== undefined) {
                                                folderIdCollection.push(folderId);
                                            }
                                        });
                                    }
                                    else {
                                        folderIdCollection.push(folderId);
                                    }
                                    var folderData = {
                                        destinationList: folderIdCollection,
                                        candidateList  : [parseInt($scope.applyCandidate.candidateId)]
                                    };
                                    publicFolder.addCandidateToFolder(folderData);
                                    jQuery('.loader').css('display', 'none');
                                }
                            }
                            return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            $scope.globalProgressBarHandler(false);
                        });

                },
                update                      : function (fieldGroupInstance, transaction) {
                    $scope.globalProgressBarHandler(true);
                    var parameters = {
                        viewModel: {}
                    };
                    $scope.isUpdate = true;
                    $scope.applyCandidate = ApplicationState.session.candidate.get();

                    $scope.angularSchemaObserver.modelToDatabaseConverter(fieldGroupInstance, parameters.viewModel);
                    $scope.applyCandidate = angular.merge($scope.applyCandidate, parameters.viewModel);
                    $scope.apiProxyHandler('updateCandidate')
                        .then(function (updateCandidateResponse) {
                            var deferred = $q.defer();
                            try {
                                logger.debug('updateCandidate complete');
                                if ($scope.semaphoreCollection.isLeadCapture) {
                                    $scope.credentials.username = $scope.applyCandidate.uname;
                                    $scope.credentials.password = $scope.applyCandidate.password;
                                    $scope.apiProxyHandler('login', {byPassProxy: isBearerAuthentication})
                                        .then(function (loginResponse) {
                                            if (_XC_CONFIG.landing_page && _XC_CONFIG.landing_page.folder_id) {
                                                // We'll add them to a folder async from the rest of the api calls
                                                var folderData = {
                                                    destinationList: [parseInt(_XC_CONFIG.landing_page.folder_id)],
                                                    candidateList  : [parseInt($scope.applyCandidate.candidateId)]
                                                    //status         : "associated",
                                                    //created        : new Date().getTime(),
                                                    //emailed        : "f"
                                                };
                                                publicFolder.addCandidateToFolder(folderData);
                                                jQuery('.loader').css('display', 'none');
                                            }
                                        })
                                        .catch(function (reason) {
                                            logger.error(reason);
                                            $scope.globalProgressBarHandler(false);
                                        });
                                }
                                fieldGroupInstance.onCompleteHandler = candidateHandler.onUpdate;
                                // if($scope.angularSchemaObserver.formStyleHandler.viewStyle !== 5)
                                return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                            }
                            catch (reason) {
                                logger.error(reason);
                                $scope.globalProgressBarHandler(false);
                                deferred.reject(reason);
                            }
                            return deferred.promise;
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            $scope.globalProgressBarHandler(false);
                        });
                },
                retrieve                    : function (fieldGroupInstance, preLoadCallBack) {
                    return $scope.fetchCurrentCandidate(fieldGroupInstance, preLoadCallBack);
                },
                onUpdate                    : function (fieldGroupInstance) {
                    var deferred = $q.defer();
                    if ($scope.semaphoreCollection.isLeadCapture) {
                        return $scope.modelProcessor.baseHelper.leadCaptureLastFormHandler(fieldGroupInstance);
                    } else {
                        $scope.globalProgressBarHandler(false);
                        delete fieldGroupInstance.onCompleteHandler;
                        return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                    }
                },
                externalDataSourceCollection: angular.copy(externalDataSourceProtoType)
            };

            var educationHandler = {
                keyField                    : "educationId",
                initialize                  : function (fieldGroupInstance, dataSourceLoader) {
                    fieldGroupInstance.model = {};
                    fieldGroupInstance.model.completed = false;
                    $scope.globalProgressBarHandler(true);
                    this.retrieve(fieldGroupInstance, dataSourceLoader);
                },
                retrieve                    : function (fieldGroupInstance, preLoadCallBack, callerIdentity) {
                    if (callerIdentity === undefined || callerIdentity === 'DB') {
                        $scope.fetchCandidateAssociationData(fieldGroupInstance, preLoadCallBack, privateCandidate.getCandidateEducation);
                    } else if (callerIdentity === 'socialSite') {
                        preLoadCallBack(educationHandler.externalDataSourceCollection[callerIdentity].data, fieldGroupInstance, null, null, true, callerIdentity);
                    }
                },
                submit                      : function (fieldGroupInstance, transaction) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.submit(fieldGroupInstance, transaction, 'addEducationHistory');
                },
                update                      : function (fieldGroupInstance, transaction) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.update(fieldGroupInstance, transaction, 'updateEducation');
                },
                delete                      : function (fieldGroupInstance, keyField) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.delete(fieldGroupInstance, privateCandidate.deleteEducationHistory, {educationId: keyField}, keyField);
                },
                registerGridConfiguration   : function (gridConfiguration, fieldDefinition) {
                    var modelHandler = {};
                    modelHandler.keyField = educationHandler.keyField;
                    modelHandler.additionalKeyFieldCollection = ["candidateId"];
                    modelHandler.labelField = "institution";
                    $scope.modelProcessor.baseHelper.protoTypeSupplier.gridConfiguration(modelHandler, gridConfiguration, fieldDefinition);
                    return modelHandler;
                },
                externalDataSourceCollection: angular.copy(externalDataSourceProtoType),
                externalDataInsertion       : function (fieldGroupInstance) {
                    var deferred = $q.defer();
                    return $scope.modelProcessor.baseHelper.gridFormHandler.externalDataInsertion(fieldGroupInstance, 'addEducationHistory', educationHandler.externalDataSourceCollection);
                },
                resetExternalDataSource     : function (source) {
                    educationHandler.externalDataSourceCollection[source] = {};
                }
            };

            var workHistoryHandler = {
                keyField                    : "workHistoryId",
                initialize                  : function (fieldGroupInstance, dataSourceLoader) {
                    fieldGroupInstance.model = {};
                    this.retrieve(fieldGroupInstance, dataSourceLoader);
                },
                retrieve                    : function (fieldGroupInstance, preLoadCallBack, callerIdentity) {
                    if (callerIdentity === undefined || callerIdentity === 'DB') {
                        $scope.fetchCandidateAssociationData(fieldGroupInstance, preLoadCallBack, privateCandidate.getCandidateWorkHistory);
                    } else if (callerIdentity === 'socialSite') {
                        preLoadCallBack(workHistoryHandler.externalDataSourceCollection[callerIdentity].data, fieldGroupInstance, null, null, true, callerIdentity);
                    }
                },
                submit                      : function (fieldGroupInstance, transaction) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.submit(fieldGroupInstance, transaction, 'addWorkHistory');
                },
                update                      : function (fieldGroupInstance, transaction) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.update(fieldGroupInstance, transaction, 'updateWorkHistory');
                },
                delete                      : function (fieldGroupInstance, keyField) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.delete(fieldGroupInstance, privateCandidate.deleteWorkHistory, {workHistoryId: keyField}, keyField);
                },
                registerGridConfiguration   : function (gridConfiguration, fieldDefinition) {
                    var modelHandler = {};
                    modelHandler.keyField = workHistoryHandler.keyField;
                    modelHandler.additionalKeyFieldCollection = ["candidateId"];
                    modelHandler.labelField = "company";
                    $scope.modelProcessor.baseHelper.protoTypeSupplier.gridConfiguration(modelHandler, gridConfiguration, fieldDefinition);
                    return modelHandler;
                },
                externalDataSourceCollection: angular.copy(externalDataSourceProtoType),
                externalDataInsertion       : function (fieldGroupInstance) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.externalDataInsertion(fieldGroupInstance, 'addWorkHistory', workHistoryHandler.externalDataSourceCollection);
                },
                resetExternalDataSource     : function (source) {
                    workHistoryHandler.externalDataSourceCollection[source] = {};
                }
            };

            var certificationHandler = {
                keyField                      : "certificationId",
                initialize                    : function (fieldGroupInstance, dataSourceLoader) {
                    fieldGroupInstance.model = {};
                    this.retrieve(fieldGroupInstance, dataSourceLoader);
                },
                retrieve                      : function (fieldGroupInstance, preLoadCallBack, callerIdentity) {
                    $scope.fetchCandidateAssociationData(fieldGroupInstance, preLoadCallBack, privateCandidate.getCertifications);
                }
                , submit                      : function (fieldGroupInstance, transaction) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.submit(fieldGroupInstance, transaction, 'addCertification');
                }
                , update                      : function (fieldGroupInstance, transaction) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.update(fieldGroupInstance, transaction, 'updateCertification');
                }
                , delete                      : function (fieldGroupInstance, keyField) {
                    return $scope.modelProcessor.baseHelper.gridFormHandler.delete(fieldGroupInstance, privateCandidate.deleteCertification, {certificationId: keyField}, keyField);
                }
                , registerGridConfiguration   : function (gridConfiguration, fieldDefinition) {
                    var modelHandler = {};
                    modelHandler.keyField = certificationHandler.keyField;
                    modelHandler.additionalKeyFieldCollection = ["candidateId"];
                    modelHandler.labelField = "name";
                    $scope.modelProcessor.baseHelper.protoTypeSupplier.gridConfiguration(modelHandler, gridConfiguration, fieldDefinition);
                    return modelHandler;
                }
                , externalDataSourceCollection: angular.copy(externalDataSourceProtoType),
                resetExternalDataSource       : function (source) {
                    educationHandler.externalDataSourceCollection[source] = {};
                }
            };

            var candidate_optin = {
                keyField: 'candidate_optin_id',
                submit  : function (fieldGroupInstance, transaction) {
                    $scope.globalProgressBarHandler(true);
                    var isValidTransactionQueue = fieldGroupInstance.isValidTransactionQueue();
                    if (isValidTransactionQueue) {
                        var parameters = {
                            viewModel: {}
                        };
                        $scope.angularSchemaObserver.modelToDatabaseConverter(fieldGroupInstance, parameters.viewModel);
                        $scope.apiProxyHandler('termsAndConditionsOptIn', parameters)
                            .then(function (results) {
                                var deferred = $q.defer();
                                parameters.viewModel = results;
                                return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                            })
                            .catch(function (reason) {
                                logger.error(reason);
                                $scope.globalProgressBarHandler(false);
                            });

                    }
                },
                update  : function (fieldGroupInstance, transaction) {
                    $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                },
                retrieve: function (fieldGroupInstance, preLoadCallBack,callerIdentity) {
                    if (preLoadCallBack && callerIdentity !== 'genericPopulate') {
                        preLoadCallBack({}, fieldGroupInstance,null,null,null,callerIdentity);
                    }
                }
            };

            var subscriptionHandler = {
                keyField: 'candidate_subscription_id',
                submit  : function (fieldGroupInstance, transaction) {
                    $scope.globalProgressBarHandler(true);
                    var isValidTransactionQueue = fieldGroupInstance.isValidTransactionQueue();
                    if (isValidTransactionQueue) {
                        var parameters = {
                            viewModel: {}
                        };
                        $scope.angularSchemaObserver.modelToDatabaseConverter(fieldGroupInstance, parameters.viewModel);
                        $scope.apiProxyHandler('unsubscribeAlerts', parameters)
                            .then(function (results) {
                                var deferred = $q.defer();
                                parameters.viewModel = results;
                                return $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                            })
                            .catch(function (reason) {
                                logger.error(reason);
                                $scope.globalProgressBarHandler(false);
                            });

                    }
                },
                update  : function (fieldGroupInstance, transaction) {
                    $scope.angularSchemaObserver.showNextFieldGroup(fieldGroupInstance);
                },
                retrieve: function (fieldGroupInstance, preLoadCallBack,callerIdentity) {
                    if (preLoadCallBack && callerIdentity !== 'genericPopulate') {
                        preLoadCallBack({}, fieldGroupInstance,null,null,null,callerIdentity);
                    }
                }
            };

            $scope.modelProcessor = {
                "candidate"             : candidateHandler,
                "education"             : educationHandler,
                "work_history"          : workHistoryHandler,
                "certification"         : certificationHandler,
                "globalConstructor"     : globalConstructor,
                "fieldParser"           : baseHelper.fieldParsers,
                "baseHelper"            : baseHelper,
                "progressBarSemaphore"  : $scope.globalProgressBarHandler,
                "candidate_subscription": subscriptionHandler,
                "candidate_optin"       : candidate_optin
            };

        };
        //</editor-fold>

        //<editor-fold desc="Basic authentication Handlers">
        var login = function () {
            logger.debug('login');
            authService.isLoggedIn = false;

            var deferred = $q.defer();

            try {
                authService.setCredentials($scope.credentials);
                authService.setRoles({});
                authService.loginConfirmed();

                $scope.currentUser = $scope.credentials;

                deferred.resolve($scope.credentials);

            }
            catch (reason) {
                logger.error(reason);
                deferred.reject(reason);
            }
            return deferred.promise;
        };

        var logout = function (skipLogOut) {
            delete $rootScope.resumeJSON;
            delete $rootScope.resumeParsed;
            delete $rootScope.applyCandidateId;
            delete $rootScope.screening_answers_submit;
            delete $rootScope.screening_answers;
            if (skipLogOut === undefined || skipLogOut === false) {
                authService.logout();
            }

        };
        //</editor-fold>

        //<editor-fold desc="angular schema observer">
        $scope.constructAngularSchemaObserver = function (fieldGroupCollection, lastFormConfirmationHandler) {
            if($scope.modelProcessor === undefined){
                $scope.buildModelProcessor();
            }
            $scope.angularSchemaObserver.instantiate(fieldGroupCollection, $scope.modelProcessor, $scope.semaphoreCollection, $scope.candidateIdSupplier, $scope.getCandidateParams, lastFormConfirmationHandler);
        };

        //</editor-fold>

        //<editor-fold desc="Social login helpers">
        $scope.getCandidateSocialChannelModel = function (socialChannelId, candidateId, socialProfile) {
            var result = {};
            result.socialChannelId = socialChannelId;
            result.candidateId = candidateId;
            result.email = socialProfile.email;
            result.providerUid = socialProfile.uid;
            result.created = new Date();
            result.updated = new Date();
            return result;
        };

        $scope.executeSocialProfileDependencyResolver = function () {
            var deferred = $q.defer();
            if (DEBUG) logger.debug('executeSocialProfileDependencyResolver');
            if ($scope.socialProvider.isSocialUserRegistration === true &&
                $scope.socialProvider.isOverrideEducationandWorkHistoryCapture === false) {
                try {
                    if ($scope.workHistory.length === undefined || $scope.workHistory.length === 0) {
                        $scope.workHistoryToUpload = ModelDependencyFactory.socialProvider.getWorkHistoryModel($rootScope.applyCandidateId, $scope.workHistory);
                        $scope.workHistoryUploaded = [];
                    }
                    if ($scope.eduHistory.length === undefined || $scope.eduHistory.length === 0) {
                        $scope.eduHistoryToUpload = ModelDependencyFactory.socialProvider.getEducationHistoryModel($rootScope.applyCandidateId, $scope.eduHistory);
                        $scope.eduHistoryUploaded = [];
                    }
                    deferred.resolve(0);
                } catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
            } else {
                deferred.resolve(0);
            }

            return deferred.promise;
        };

        $scope.getSocialChannel = function () {
            var deferred = $q.defer();
            logger.debug('getSocialChannel');
            if ($scope.socialProvider.isSocialUserRegistration === true) {
                var socialProfile = $scope.socialProvider.getProfile();
                var socialChannel = {};
                socialChannel.socialChannelName = socialProfile.provider;
                return candidate.getSocialChannel(socialChannel).$promise.then(function (result) {
                    try {
                        logger.debug('success:getSocialChannel');
                        $scope.socialChannel = normalizeObjects(result);
                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                }, function (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                });
            } else {
                deferred.resolve(0);
            }

            return deferred.promise;

        };

        $scope.processCandidateSocialChannel = function (socialChannelObject) {
            var deferred = $q.defer();
            logger.debug('processCandidateSocialChannel');
            if ($scope.socialProvider.isSocialUserRegistration === true) {
                var socialProfile = $scope.socialProvider.getProfile();
                var candidateSocialChannel = $scope.getCandidateSocialChannelModel($scope.socialChannel.socialChannelId, $rootScope.applyCandidateId, socialProfile);
                if ((socialChannelObject === null || socialChannelObject === undefined || socialChannelObject.socialchannelConfigId === null || socialChannelObject.socialchannelConfigId === undefined)) {
                    return candidate.addCandidateToSocialChannel(candidateSocialChannel).$promise.then(
                        function (result) {
                            deferred.resolve(0);
                        }, function (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                    );
                } else {
                    candidateSocialChannel.socialchannelConfigId = socialChannelObject.socialchannelConfigId;
                    return candidate.updateCandidateInSocialChannel(candidateSocialChannel).$promise.then(
                        function (result) {
                            deferred.resolve(0);
                        }, function (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                    );
                }
            } else {
                deferred.resolve(0);
            }
            return deferred.promise;
        };

        $scope.executeGigyaNotifyRegistration = function () {
            var deferred = $q.defer();
            $scope.socialProvider.isGigyaRegistrationSucceeded = true;
            $scope.socialProvider.showNotificationToggle(false, '');
            logger.debug('executeGigyaNotifyRegistration');
            var socialProfile = $scope.socialProvider.getProfile();
            if ($scope.socialProvider.isSocialUserRegistration === true) {
                var inputs = {
                    candidateId    : $rootScope.applyCandidateId,
                    apiKeyType     : GIGYA_SOCIAL_SETTINGS.gigyashortcode,
                    socialChannelId: $scope.socialChannel.socialChannelId
                };
                return candidate.gigyaNotifyRegistration(inputs).$promise.then(
                    function (result) {
                        logger.debug('GigyaRegistraionSuccess');
                        deferred.resolve(0);
                    }, function (reason) {
                        $scope.socialProvider.isGigyaRegistrationSucceeded = false;
                        $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.registrationFail);
                        logger.error(reason);
                        deferred.resolve(0);
                    }
                );
            } else {
                deferred.resolve(0);
            }

            return deferred.promise;
        };

        $scope.fetchSocialChannelByEmailAndProvider = function (email, socialProvider) {
            logger.debug('fetchSocialChannelByEmailAndProvider');
            var deferred = $q.defer();
            $scope.socialChannel = undefined;
            var params = {};
            params.userEmail = email;
            params.socialChannelName = socialProvider;
            return candidate.getSocialChannelByEmailAndSocialProvider(params).$promise
                .then
                (
                    function (result) {
                        $scope.socialChannel = normalizeObjects(result);
                        deferred.resolve(result);
                        return deferred.$promise;
                    },
                    function (reason) {
                        $scope.socialChannel = undefined;
                        deferred.resolve($scope.socialChannel);
                        return deferred.$promise;
                    }
                );
        };

        $scope.getSocialChannelByEmail = function (email) {
            logger.debug('getSocialChannelByEmail');
            var deferred = $q.defer();
            $scope.socialChannel = undefined;
            var params = {};
            params.userEmail = email;
            return candidate.getSocialChannelByEmail(params).$promise
                .then
                (
                    function (result) {
                        $scope.socialChannel = normalizeObjects(result);
                        deferred.resolve(result);
                        return deferred.$promise;
                    },
                    function (reason) {
                        $scope.socialChannel = undefined;
                        deferred.resolve($scope.socialChannel);
                        return deferred.$promise;
                    }
                );
        };

        $scope.fetchCandidateByEmail = function (email) {
            logger.debug('fetchCandidateByEmail');

            var deferred = $q.defer();
            var params = {};
            params.emailId = email;
            return candidate.getCandidateByEmail(params).$promise
                .then
                (
                    function (result) {
                        $scope.fetchCandidateByEmailResponse = normalizeObjects(result);
                        deferred.resolve($scope.fetchCandidateByEmailResponse);
                    },
                    function (reason) {
                        $rootScope.globalErrorHandler(reason);
                        $scope.fetchCandidateByEmailResponse = undefined;
                        deferred.reject($scope.fetchCandidateByEmailResponse);
                    }
                );
        };

        $scope.socialProfileAuthenticationEnabler = function (socialProfile, redirectAction) {
            var deferred = $q.defer();
            try {
                var registeredSocialChannel = {};
                $scope.socialProvider.utility.setProfileDefaultsToStorage();
                /// check user has social profile registered in our records
                $scope.fetchSocialChannelByEmailAndProvider(socialProfile.email, socialProfile.provider)
                    .then(function () {
                        socialProfile.isUserRegistered = $scope.socialChannel !== undefined;
                        registeredSocialChannel = angular.copy($scope.socialChannel);
                        if ((socialProfile.bearerAccessToken === null || socialProfile.bearerAccessToken === undefined) || (socialProfile.isUserRegistered === false)) {
                            // check for any social profile has registered for same candidate
                            $scope.fetchCandidateByEmail(socialProfile.email)
                                .then(function () {
                                    var candidateCurrent = undefined;
                                    if (angular.isArray($scope.fetchCandidateByEmailResponse) && $scope.fetchCandidateByEmailResponse.length > -1) {
                                        candidateCurrent = $scope.fetchCandidateByEmailResponse[0];
                                    }
                                    if (candidateCurrent !== null && candidateCurrent !== undefined) {
                                        $rootScope.applyCandidateId = candidateCurrent.candidateId;
                                        $scope.getSocialChannel()
                                            .then(function () {
                                                $scope.processCandidateSocialChannel(registeredSocialChannel)
                                                    .then(function () {
                                                        $scope.executeGigyaNotifyRegistration()
                                                            .then(function () {
                                                                if ($scope.socialProvider.isGigyaRegistrationSucceeded) {
                                                                    $scope.socialProvider.utility.clearMergeProfileCache(true);
                                                                    delete  $rootScope.applyCandidateId;
                                                                    if (registeredSocialChannel === null || registeredSocialChannel === undefined) {
                                                                        redirectAction.action = 'merge';
                                                                        redirectAction.path = '/profile/edit/';
                                                                        $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
                                                                        LocalStorage.set($scope.socialProvider.KeysConfiguration.localStorageSocialMergedProfile, socialProfile);
                                                                    } else {
                                                                        redirectAction.action = 'dashboard';
                                                                        redirectAction.path = '/profile/';
                                                                        $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
                                                                    }
                                                                    deferred.resolve(0);
                                                                    if (socialProfile.bearerAccessToken === null || socialProfile.bearerAccessToken === undefined) {
                                                                        $scope.socialProvider.setRegistrationCaller('');
                                                                        $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.mergeIntermediateMessage());
                                                                    } else {
                                                                        $scope.socialProfileLogin(socialProfile, redirectAction);
                                                                    }
                                                                } else {
                                                                    $scope.socialProvider.setRegistrationCaller('');
                                                                    deferred.reject(0);
                                                                }
                                                                $scope.globalProgressBarHandler(false);
                                                            })
                                                            .catch(function (reason) {
                                                                $rootScope.globalErrorHandler(reason);
                                                            });
                                                    })
                                                    .catch(function (reason) {
                                                        $rootScope.globalErrorHandler(reason);
                                                    });
                                            })
                                            .catch(function (reason) {
                                                $rootScope.globalErrorHandler(reason);
                                            });
                                    } else {
                                        $scope.globalProgressBarHandler(false);
                                        $scope.socialProvider.setRegistrationCaller('');
                                        deferred.reject(0);
                                        $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.registrationFail);
                                    }
                                })
                                .catch(function (reason) {
                                    $rootScope.globalErrorHandler(reason);
                                });
                        } else {
                            $scope.socialProfileLogin(socialProfile, redirectAction);
                            deferred.resolve(0);
                        }
                    })
                    .catch(function (reason) {
                        $rootScope.globalErrorHandler(reason);
                        $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.generalException);
                    })

            } catch (reason) {
                $rootScope.globalErrorHandler(reason);
                $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.generalException);
            }

        };

        $scope.overrideCandidateDataWithSocial = function (socialProfile) {
            try {
                if (socialProfile !== undefined) {
                    $scope.applyCandidate.uname = socialProfile.email;
                    if (socialProfile.firstName.length > 0 && $scope.applyCandidate.firstName !== socialProfile.firstName) $scope.applyCandidate.firstName = socialProfile.firstName;
                    if (socialProfile.lastName.length > 0 && $scope.applyCandidate.lastName !== socialProfile.lastName) $scope.applyCandidate.lastName = socialProfile.lastName;
                    if (socialProfile.phone !== null && socialProfile.phone.length > 0 && socialProfile.phone !== $scope.applyCandidate.phone1) $scope.applyCandidate.phone1 = socialProfile.phone;
                    if (socialProfile.zip !== null && socialProfile.zip !== undefined && socialProfile.zip.length > 0 && socialProfile.zip !== $scope.applyCandidate.zip) $scope.applyCandidate.zip = socialProfile.zip;
                }
            } catch (reason) {
                $rootScope.globalErrorHandler(reason);
            }
        };

        $scope.socialBearerSuccessHandler = function () {
            $scope.socialProvider.disConnectSocialConnection();
            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
            var redirectHandler = $scope.socialProvider.utility.getRedirectDirectionFromStorage();
            if ($scope.jobId && $scope.jobUrl) {
                if (redirectHandler.isSuccess === true) {
                    $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                }
                $scope.modelProcessor.baseHelper.seoRedirectHandler();
            } else if (redirectHandler.isSuccess === true) {
                if (_XC_CONFIG.landing_page) {
                    //adding the user to the folder in case the user is a returning social user.If the user is already added to the folder they wont be added again.
                    var folderId = parseInt(_XC_CONFIG.landing_page.folder_id);
                    var email = $scope.socialChannel.email;
                    if (!isNaN(folderId) && typeof(email) !== "undefined") {
                        publicFolder.addCandidateToFolderByEmail({folderId: folderId, email: email});
                    }
                    redirectHandler.action = 'microsite';
                    if (_XC_CONFIG.landing_page.destination) {
                        redirectHandler.path = _XC_CONFIG.landing_page.destination;
                    }
                    else {
                        redirectHandler.path = "";
                    }
                }
                switch (redirectHandler.action) {
                    case 'merge':
                        $location.url(redirectHandler.path);
                        break;
                    case 'apply':
                        $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                        $window.location.reload();
                        break;
                    case 'microsite':
                        LocalStorage.remove('socialProfileRedirect');
                        insertMicrositeOmnidata();
                        $('.landing-page-content').hide();
                        $('.landing-page-thank-you').show();
                        if (redirectHandler.path) {
                            $window.location.href = redirectHandler.path;
                        }
                        break;
                    default:
                        $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                        if (leadcaptureModalService.getIsModalOpen()) {
                            //If LCP is opened on modal, then on social log in of returning user we need to redirect to profile page
                            leadcaptureModalService.resetCalledFromModal();
                            leadcaptureModalService.setIsModalOpen(false);
                            $window.location.href = redirectHandler.path;
                        }
                        else {
                            if($scope.semaphoreCollection.isLeadCapture) {
                                window.location.replace(redirectHandler.path);
                            } else {
                                $location.url(redirectHandler.path);
                            }
                        }
                        break;
                }
            } else {
                $location.path('/profile/');
            }
            $scope.globalProgressBarHandler(false);
        };

        $scope.socialUserFirstLoginAttempt = function () {
            var redirectAction = {
                action: 'dashboard',
                path  : '/profile/'
            };
            $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
            if (authService.internalToken.token !== undefined && authService.internalToken.token.length > 0) {
                authService.extendCurrentBearerAuthentication(authService.internalToken);
                ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
                $scope.socialBearerSuccessHandler();
            } else {
                $scope.globalProgressBarHandler(false);
                $scope.socialProvider.setRegistrationCaller('');
                if (_XC_CONFIG.login_modal.disabled === false) {
                    $location.url('/');
                } else {
                    $location.url('/profile/login/');
                }
                $scope.socialProvider.showNotificationToggle(true, ModelDependencyFactory.socialProvider.notificationEngine.loginFail);
            }
        };

        $scope.socialProfileLogin = function (socialProfile, redirectAction) {
            /// TODO: need to remove overridden of  redirectAction once account validation gets implemented
            var redirectHandler = $scope.socialProvider.utility.getRedirectDirectionFromStorage();
            if (redirectHandler.isSuccess === true) {
                switch (redirectHandler.action) {
                    case 'merge':
                        redirectAction = angular.merge(redirectAction, redirectHandler);
                        break;
                }
            }
            $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
            authService.socialLogin(socialProfile.email, socialProfile.bearerAccessToken, $scope.socialBearerSuccessHandler);
        };

        $scope.socialMergeProfileLogin = function (response) {
            $scope.socialProvider.utility.removeRedirectDirectionInStorage();
            $scope.socialProvider.setRegistrationCaller('');
            if (response.accessToken !== null && response.accessToken !== undefined) {
                authService.socialLogin($scope.socialProvider.getProfile().email, response.accessToken, $scope.socialBearerSuccessHandler);
            } else {
                $scope.socialProvider.showNotificationToggle(true, ModelDependencyFactory.socialProvider.notificationEngine.loginFail);
            }
        };


        //</editor-fold>

        //<editor-fold desc="Resume handler">

        $scope.$on('attachmentCacheCleared', function (event, args) {
            $scope.fileFormName = {};
            $scope.applyCandidate = {};
            $scope.angularSchemaObserver.externalDataSourceModelReset();
            //clear in memory parsed resume data as well
            $scope.modelProcessor.education.resetExternalDataSource("resume")
            $scope.modelProcessor.work_history.resetExternalDataSource("resume")
            $scope.modelProcessor.certification.resetExternalDataSource("resume");
            ApplicationState.session.candidate.resume.applyResumeStateContainer.remove();


        });
        //fetch Social site data in case it is a refresh from social site
        var _socialProfileRestoreAttempts = 0;
        $scope.$on(BROAD_CAST_NAMESPACE.CURRENT_CANDIDATE_FETCHED, function (event, args) {
            var socialSiteStateContainer = $scope.socialProvider.utility.sessionFromStorage();
            if (socialSiteStateContainer && socialSiteStateContainer.isSuccess === true && _socialProfileRestoreAttempts === 0) {
                if (typeof(socialSiteStateContainer.externalState) !== "undefined" && socialSiteStateContainer.externalState !== null) {
                    if ($scope.applyCandidate.uname === socialSiteStateContainer.externalState.mail) {
                        $scope.socialProvider.reset();
                        $scope.socialProvider.registerConsumer($scope.angularSchemaObserver.pushExternalData);
                        $scope.socialProvider.utility.restoreSession(socialSiteStateContainer, authService);
                        _socialProfileRestoreAttempts++;
                    }
                }
            }
        });

        $scope.$on('setDocumentDetails', function (eventname, args) {
            $scope.fileFormName = args.fileFormName;
            $scope.attachmentDetails = args.attachmentDetails;
            //setting attachment details in session storage as it will be used in case the user refreshes the page
            var applyResumeStateContainer = ApplicationState.session.candidate.resume.applyResumeStateContainer.get()
            if (applyResumeStateContainer === null) {
                applyResumeStateContainer = {}
            }
            applyResumeStateContainer["ApplyResumeFileFormName"] = $scope.fileFormName;
            applyResumeStateContainer["ApplyResumeAttachmentDetails"] = $scope.attachmentDetails;
            ApplicationState.session.candidate.resume.applyResumeStateContainer.set(applyResumeStateContainer)
        });

        var uploadResume = function () {
            var deferred = $q.defer();
            var file = $scope.fileFormName;
            //success handler function needs to know when no resumes were uploaded
            if (angular.equals({}, $scope.fileFormName)) {
                deferred.resolve({uploadedResume: false});
                return deferred.promise;
            }
            logger.log('file was selected: ', JSON.stringify($scope.attachmentDetails));
            var inputName = 'fileFormName';
            var attachmentFormName = 'attachmentFormName';
            var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/private/candidate/attachment/" + clientName + "/" + inputName + "/" + attachmentFormName;
            bgResumeUpload.parseResume(file, uploadUrl, inputName, attachmentFormName, $scope.attachmentDetails,
                function (resp) {
                    deferred.resolve(resp);
                }, function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        //<editor-fold desc="Query String (Generic) content parsers">
        $scope.genericDataPopulate = function (JobData) {
            var needsNotify = false;

            // Maxmind IP location detection
            var maxmindIsEnabled = (
                cws_opts
                && cws_opts.ip_detect
                && typeof get_location_cookie_value === 'function'
                && read_location_cookie() !== null
            );
            /*if (maxmindIsEnabled) {
                if (!authService.isLoggedIn) {
                    needsNotify = true;
                    var location_data = {};
                    location_data.city = get_location_cookie_value('cityname') ==="undefined"? "": get_location_cookie_value('cityname');
                    location_data.state = get_location_cookie_value('statecode') === "undefined" ? "" : get_location_cookie_value('statecode') ;
                    location_data.zip = get_location_cookie_value('postal') === "undefined" ? "" : get_location_cookie_value('postal');
                    location_data.country = get_location_cookie_value('countrycode') === "undefined" ? "" : get_location_cookie_value('countrycode');
                    location_data.latitude = get_location_cookie_value('latitude') === "undefined" ? "" : get_location_cookie_value('latitude');
                    location_data.longitude = get_location_cookie_value('longitude') === "undefined" ? "" : get_location_cookie_value('longitude');
                    genericCandidateLocation(location_data);
                }
            }*/

            if ((_XC_CONFIG.field_mapping !== undefined && _XC_CONFIG.field_mapping.length > 0 && !authService.isLoggedIn) || maxmindIsEnabled && !authService.isLoggedIn) {
                var internalParserCollection = [genericCandidateParser];
                var newQueryString = {};
                var genericDataCombined = {};
                var location_data = {};

                if(maxmindIsEnabled){
                    location_data.city = get_location_cookie_value('cityname') ==="undefined"? "": get_location_cookie_value('cityname');
                    location_data.state = get_location_cookie_value('statecode') === "undefined" ? "" : get_location_cookie_value('statecode') ;
                    location_data.zip = get_location_cookie_value('postal') === "undefined" ? "" : get_location_cookie_value('postal');
                    location_data.country = get_location_cookie_value('countrycode') === "undefined" ? "" : get_location_cookie_value('countrycode');
                    location_data.latitude = get_location_cookie_value('latitude') === "undefined" ? "" : get_location_cookie_value('latitude');
                    location_data.longitude = get_location_cookie_value('longitude') === "undefined" ? "" : get_location_cookie_value('longitude');
                }
                if (!angular.equals(queryString, {}) || JobData !== undefined) {
                    if (JobData !== undefined) {
                        newQueryString = JobData;
                        if (!angular.equals(queryString, {})) {
                            jQuery.each(queryString, function (i, v) {
                                newQueryString.v = queryString[i];
                            });
                        }
                    }
                    else if (!angular.equals(queryString, {})) {
                        newQueryString = queryString;
                    }
                }

                if(!angular.equals(location_data, {})){
                    genericDataCombined.locationData = location_data;
                }

                if(!angular.equals(newQueryString, {})){
                    genericDataCombined.newQueryString = newQueryString;
                }

                if(!angular.equals(genericDataCombined, {})){
                    angular.forEach(internalParserCollection, function (parser) {
                        parser(genericDataCombined);
                    });
                }
                needsNotify = true;
            }

            if (needsNotify) {
                $scope.notifyConsumer($scope.genericPopulateDataConsumerCollection, "genericPopulate");
            }
        };

        var genericCandidateParser = function (queryString) {
            try {
                if(typeof queryString.newQueryString !== "undefined" && typeof _XC_CONFIG.field_mapping !== "undefined" && _XC_CONFIG.field_mapping.length > 0) {
                    var newQueryString = queryString.newQueryString;
                    if (newQueryString !== undefined && newQueryString !== null && !angular.equals(newQueryString, {})) {
                        var mappingFields = JSON.parse(_XC_CONFIG.field_mapping).payLoad_SP_mapping;
                        var candidateModel = $scope.angularSchemaObserver.getExternalDataSource('candidate', 'genericPopulate').source || {};
                        for (var i = 0; i < mappingFields.length; i++) {
                            var map = mappingFields[i];
                            if (newQueryString[map.source] !== undefined && ($scope.applyCandidate[map.destination] === undefined || angular.equals($scope.applyCandidate, {}) || $scope.applyCandidate[map.destination] === null || $scope.applyCandidate[map.destination] === '')) {
                                candidateModel[map.destination] = newQueryString[map.source];
                            }
                        }
                        if (!angular.equals(candidateModel, {})) {
                            $scope.applyCandidate = angular.merge(angular.copy($scope.applyCandidate), candidateModel);
                        }

                    }
                }

                if(typeof queryString.locationData !== "undefined"){
                    $scope.applyCandidate = angular.merge(angular.copy($scope.applyCandidate), queryString.locationData);
                }

                var input = {
                    key       : "candidate"
                    , data    : angular.copy($scope.applyCandidate)
                    , identity: "genericPopulate"
                };
                $scope.notifyConsumer($scope.genericPopulateListenerCollection, input);
            } catch (reason) {
                logger.error(reason);
            }

        };

        /*var genericCandidateLocation = function (location) {
            $scope.applyCandidate = angular.merge(angular.copy($scope.applyCandidate), location);
            var input = {
                key       : "candidate"
                , data    : angular.copy($scope.applyCandidate)
                , identity: "genericPopulate"
            };
            $scope.notifyConsumer($scope.genericPopulateListenerCollection, input);
        };*/
        //</editor-fold>

        //<editor-fold desc="resume content parsers">
        var resumeCandidateParser = function (resumeContent) {
            try {
                var contactInfo = resumeContent.contact;
                if ($scope.socialProvider.isSocialUserRegistration === false) {
                    if ($scope.applyCandidate.uname === undefined || $scope.applyCandidate.uname === null) {
                        if (contactInfo !== undefined && contactInfo !== null && contactInfo.email !== null && contactInfo.email !== undefined) {
                            $scope.applyCandidate.uname = $scope.getValueFromArrayOrString(contactInfo.email, 0);
                            $scope.applyCandidate.uname = $scope.applyCandidate.uname.toLowerCase();
                        }
                    }
                }

                if (contactInfo.name !== undefined) {
                    if (angular.isArray(contactInfo.name.givenname) || typeof contactInfo.name.givenname === "object") {
                        $scope.applyCandidate.firstName = ($scope.applyCandidate.firstName === undefined) ?
                            $scope.getValueFromArrayOrString(contactInfo.name.givenname, 0) : $scope.applyCandidate.firstName;
                        $scope.applyCandidate.middleName = ($scope.applyCandidate.middleName === undefined) ?
                            $scope.getValueFromArrayOrString(contactInfo.name.givenname, 1)[0] : $scope.applyCandidate.middleName;
                    } else if (contactInfo.name.givenname !== undefined) {
                        $scope.applyCandidate.firstName = ($scope.applyCandidate.firstName === undefined) ?
                            contactInfo.name.givenname : $scope.applyCandidate.firstName;
                    }
                    $scope.applyCandidate.lastName = ($scope.applyCandidate.lastName === undefined) ? $scope.getValueFromArrayOrString(contactInfo.name.surname, 0) : $scope.applyCandidate.lastName;
                }

                var parsePhoneNum;
                if (angular.isArray(contactInfo.phone) || typeof contactInfo.phone === "object") {
                    parsePhoneNum = $scope.getValueFromArrayOrString(contactInfo.phone, 0);
                    parsePhoneNum = (parsePhoneNum.__text === undefined) ? parsePhoneNum : parsePhoneNum.__text;
                } else if (contactInfo.phone !== undefined && contactInfo.phone !== null) {
                    parsePhoneNum = contactInfo.phone;
                }

                if (angular.isArray(contactInfo.phone) || typeof contactInfo.phone === "object" || (contactInfo.phone !== undefined && contactInfo.phone !== null)) {
                    // parsePhoneNum = parsePhoneNum.replace(/[^\w\s]/gi, '');
                    parsePhoneNum = parsePhoneNum.replace(/\D/g, '');
                    $scope.applyCandidate.phone1 = ($scope.applyCandidate.phone1 === undefined || $scope.applyCandidate.phone1 === null || $scope.applyCandidate.phone1.length === 0) ? parsePhoneNum : $scope.applyCandidate.phone1;
                    parsePhoneNum = null;
                }

                if (angular.isArray(contactInfo.address) || typeof contactInfo.address === "object") {
                    var newPostalCode = null;
                    var newStreet = null;
                    var newCity = null;
                    var newState = null;
                    angular.forEach(contactInfo.address, function (info) {
                        if (info.hasOwnProperty('postalcode')) {
                            newPostalCode = info.postalcode;
                        } else if (info.hasOwnProperty('zip')) {
                            newPostalCode = info.zip;
                        }
                        if (info.hasOwnProperty('street')) {
                            newStreet = info.street;
                        }
                        if (info.hasOwnProperty('city')) {
                            newCity = info.city;
                        }
                        if (info.hasOwnProperty('_state')) {
                            newState = info._state;
                        }
                    });
                    $scope.applyCandidate.zip = ($scope.applyCandidate.zip === undefined || $scope.applyCandidate.zip === null || $scope.applyCandidate.zip.length === 0) ? (newPostalCode !== null ? newPostalCode : contactInfo.address.postalcode) : $scope.applyCandidate.zip;
                    $scope.applyCandidate.address1 = ($scope.applyCandidate.address1 === undefined || $scope.applyCandidate.address1 === null || $scope.applyCandidate.address1.length === 0) ? (newStreet !== null ? newStreet : $scope.getValueFromArrayOrString(contactInfo.address.street, 0)) : $scope.applyCandidate.address1;
                    $scope.applyCandidate.city = ($scope.applyCandidate.city === undefined || $scope.applyCandidate.city === null || $scope.applyCandidate.city.length === 0) ? (newCity !== null ? newCity : $scope.getValueFromArrayOrString(contactInfo.address.city, 0)) : $scope.applyCandidate.city;
                    $scope.applyCandidate.state = ($scope.applyCandidate.state === undefined || $scope.applyCandidate.state === null || $scope.applyCandidate.city.state === 0) ? (newState !== null ? newState : $scope.getValueFromArrayOrString(contactInfo.address._state, 0)) : $scope.applyCandidate.state;
                }

                var input = {
                    key       : "candidate"
                    , data    : angular.copy($scope.applyCandidate)
                    , identity: "resume"
                };
                $scope.notifyConsumer($scope.resumeParserListenerCollection, input);

            } catch (reason) {
                logger.error(reason);
            }
        };

        var resumeEducationHistoryParser = function (resumeContent) {
            try {
                $scope.eduHistoryToUpload = [];
                var resumeEducationContent = resumeContent.education;
                if ($rootScope.resumeParsed === true) {
                    if (resumeEducationContent !== null && resumeEducationContent !== undefined) {
                        $scope.eduHistoryToUpload = ModelDependencyFactory.candidateHelper.parserCollection.resume.getEducationModel(resumeEducationContent);
                        $scope.eduHistoryUploaded = [];
                    }
                }
                var input = {
                    key     : "education",
                    data    : angular.copy($scope.eduHistoryToUpload),
                    identity: "resume"
                };
                $scope.notifyConsumer($scope.resumeParserListenerCollection, input);
            } catch (reason) {
                logger.error(reason);
            }
        };

        var resumeWorkHistoryParser = function (resumeContent) {
            try {
                $scope.workHistoryToUpload = [];
                if ($rootScope.resumeParsed === true) {
                    $scope.workHistoryToUpload = ModelDependencyFactory.candidateHelper.parserCollection.resume.getEmploymentModel(resumeContent.experience);
                    $scope.workHistoryUploaded = [];
                }
                var input = {
                    key       : "work_history"
                    , data    : angular.copy($scope.workHistoryToUpload)
                    , identity: "resume"
                };
                $scope.notifyConsumer($scope.resumeParserListenerCollection, input);
            } catch (reason) {
                logger.error(reason);
            }
        };
        //</editor-fold>

        $scope.$on('burningGlassParserHandler', function (event, args) {
            // logger.log(resp);
            try {
                var resp = args.response;
                /*
                 * Setting the args in session storage to use for refresh scenario
                 *
                 * */
                var applyResumeStateContainer = ApplicationState.session.candidate.resume.applyResumeStateContainer.get()
                if (applyResumeStateContainer !== null && typeof(applyResumeStateContainer) !== "undefined") {
                    applyResumeStateContainer['resumeXMLArg'] = args;
                }
                else {
                    applyResumeStateContainer = {}
                    applyResumeStateContainer['resumeXMLArg'] = args;
                }
                ApplicationState.session.candidate.resume.applyResumeStateContainer.set(applyResumeStateContainer)

                var internalParserCollection = [resumeCandidateParser, resumeEducationHistoryParser, resumeWorkHistoryParser];

                $scope.resumeXML = resp;

                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/transform/html";
                var data = $scope.resumeXML;

                $http({
                    url            : uploadUrl,
                    method         : "POST",
                    withCredentials: true,
                    headers        : {
                        'Content-Type': 'application/xml'
                    },
                    data           : data
                }).success(
                    function (response) {
                        $rootScope.resumeXML = response;
                    }).error(
                    function () {
                        $rootScope.resumeXML = null;
                    });
                var x2js = new X2JS();
                $rootScope.resumeJSON = x2js.xml_str2json($scope.resumeXML);
                $rootScope.resumeParsed = true;
                $scope.isInvalidContentCV = false;

                if ($rootScope.resumeJSON.ResDoc.resume === undefined || $rootScope.resumeJSON.ResDoc.resume.contact === undefined) {
                    return burningGlassParserErrorHandler();
                }

                angular.forEach(internalParserCollection, function (parser) {
                    parser($rootScope.resumeJSON.ResDoc.resume);
                });
                $scope.notifyConsumer($scope.resumeDataConsumerCollection, "resume");

            } catch (reason) {
                $scope.globalProgressBarHandler(false);
            }
        });

        //</editor-fold>

    }


})(); // End  controller=======
