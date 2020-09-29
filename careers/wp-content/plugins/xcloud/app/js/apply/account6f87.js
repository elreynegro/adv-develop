(function () {
    'use strict';


    var accountModule = angular.module('st.controllers.apply.site');

    accountModule.controller('accountController', accountController);


    accountController.$inject = ['$scope', '$cookies', '$log', '$controller', '$location', '$sce', '$rootScope', 'tableManagementService',
        'candidate', 'privateCandidate', 'privateApplication', 'privateRequisition', 'privateOffer',
        'privateCommunicationTemplates', 'authService', 'privateCandidateToken', 'privateCandidatePwd', 'privateTransactionLog',
        'ListService', 'bgResumeUpload', '$window', 'jobsapi', '$timeout', 'LocalStorage', '$routeParams',
        'privateStep', 'privateCommunicationLog', '$q', '$compile', '$http', 'privateUser', '$filter', 'titleCaseFilter', 'ApplicationState', 'candidateActivityViewModelService', 'schemaModalService', 'CandidateWorkFlow', 'migrationService', 'dashboardAttachmentViewModalService'];

    function accountController($scope, $cookies, $log, $controller, $location, $sce, $rootScope, tableManagementService,
                               candidate, privateCandidate, privateApplication, privateRequisition, privateOffer,
                               privateCommunicationTemplates, authService, privateCandidateToken, privateCandidatePwd, privateTransactionLog,
                               ListService, bgResumeUpload, $window, jobsapi, $timeout, LocalStorage, $routeParams,
                               privateStep, privateCommunicationLog, $q, $compile, $http, privateUser, $filter, titleCaseFilter, ApplicationState, candidateActivityViewModelService, schemaModalService, CandidateWorkFlow, migrationService, dashboardAttachmentViewModalService) {

        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_ACCOUNT);
        var $ = jQuery;
        angular.extend(this, $controller('baseController', {$scope: $scope}));
        var isRedirectToLoginPage = false;
        var deleteTokenInURL = true;
        $scope.showBorderUploadBtn = false;
        $scope.showBorderPrefWillingRelocateYes = false;
        $scope.showBorderPrefWillingRelocateNo = false;
        $scope.showBorderPrefWillingTravelNo = false;
        $scope.showBorderPrefWillingTravelYes = false;
        $scope.showBorderUnsubscribe = false;
        $scope.communicationSubscriptions = {};
        $scope.preferencesNotSet = false;
        var _communicationSubscriptions_Modified = false;
        $scope.vm = {
            panelView: E_WORK_FLOW.DASHBOARD
        };

        $rootScope.$on(BROAD_CAST_NAMESPACE.UPDATE_CANDIDATE_SCOPE, function (event, viewModel) {
            $scope.candidate = viewModel;
            $scope.editCandidate = angular.copy($scope.candidate);
        });

        $scope.togglePrefRelocateYes = function () {
            $scope.showBorderPrefWillingRelocateYes = !$scope.showBorderPrefWillingRelocateYes

        };
        $scope.togglePrefRelocateNo = function () {
            $scope.showBorderPrefWillingRelocateNo = !$scope.showBorderPrefWillingRelocateNo

        };

        $scope.togglePrefTravelYes = function () {
            $scope.showBorderPrefWillingTravelYes = !$scope.showBorderPrefWillingTravelYes

        };

        $scope.togglePrefTravelNo = function () {
            $scope.showBorderPrefWillingTravelNo = !$scope.showBorderPrefWillingTravelNo

        };

        $scope.toggleFocusUploadBtn = function () {
            $scope.showBorderUploadBtn = !$scope.showBorderUploadBtn
        };
        $scope.toggleFocusUnsubscribe = function () {
            $scope.showBorderUnsubscribe = !$scope.showBorderUnsubscribe;
        };

        initialize();


        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.hasRole = function (role) {
            return authService.hasRole(role);
        };

        $scope.hasAnyRole = function (roles) {
            return authService.hasAnyRole(roles);
        };

        $scope.hasAllRoles = function (roles) {
            return authService.hasAllRoles(roles);
        };

        // No longer used
        $scope.getDetails = function (reqId) {
            $scope.details = {};

            for (var key in $scope.requisitions) {
                if ($scope.requisitions[key].requisitionId === reqId) {
                    $scope.details.requisitionId = $scope.requisitions[key].requisitionId;
                    $scope.details.title = $scope.requisitions[key].title;
                    $scope.details.externalDesc = $sce.trustAsHtml($scope.requisitions[key].externalDesc);
                    $scope.details.requirements = $sce.trustAsHtml($scope.requisitions[key].requirements);
                    break;
                }
            }
        };

        // This replaces getDetails
        $scope.gotoJobDetails = function (job, reqId, $event) {
            if (typeof CWS === 'undefined') {
                logger.error('CWS plugin not activated!');
                $event.preventDefault();
                return false;
            }
            if (!job) {
                logger.error('JobsAPI data not found for req ' + reqId);
                $event.preventDefault();
                return false;
            }
            var seo = CWS.seo_url(job);
            var path = cws_opts.jobdetail_path || '/job';
            window.location.href = path + '/' + job.id + '/' + seo + '/';
        };

        $scope.getOfferDetails = function () {
            $scope.offerDetails = {};

            $scope.offerDetails.subject = $scope.offers[0].letter.subject;
            $scope.offerDetails.form = $sce.trustAsHtml($scope.offers[0].letter.form);
        };

        $scope.acceptOffer = function (index) {
            var offer = angular.copy($scope.offers[index]);
            offer.status = 'accept';
            offer.esig = 't';
            var getCurDate = new Date();
            offer.acceptDate = getCurDate.getTime();
            delete offer.template;
            delete offer.letter;

            jQuery('.loading-container').css('display', 'block');
            privateOffer.updateOffer(offer).$promise.then(function (results) {
                results = normalizeObjects(results);
                hasSuccess('Offer accepted!');
                $scope.offerData.showOfferAccepted = true;
                $scope.offerData.offerConfirmation = false;

                results.letter = $scope.offers[index].letter;
                $scope.offers[index] = results;
                refreshOfferCount();
                jQuery('.loading-container').css('display', 'none');

                // We can make the step api call separately
                var step = {
                    applicationId: offer.applicationId,
                    usersId      : offer.usersId,
                    stepValue    : 'Offer - Accepted'
                };
                privateStep.addApplicationStepById(step, {value: 'Offer accepted from user dashboard'});
                getCandidateActivities($scope.candidate);

            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
        };

        $scope.dismissPreferencesNotification = function () {
            var dismissedNotification = $cookies.getObject('dismissPreferencesNotification');
            if (dismissedNotification === undefined || dismissedNotification === null)
                dismissedNotification = {};
            dismissedNotification[$scope.candidate.candidateId] = "dismissed";
            $cookies.putObject('dismissPreferencesNotification', dismissedNotification);
        };

        function checkPreferenceCookie() {
            var preferenceCookie = $cookies.getObject('dismissPreferencesNotification');
            if (preferenceCookie !== undefined && preferenceCookie !== null && preferenceCookie[$scope.candidate.candidateId] === "dismissed") {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.declineOffer = function (index) {
            if ($scope.offerData.declineOfferCOnfirmation) {
                var offer = angular.copy($scope.offers[index]);
                offer.status = 'reject';
                var getCurDate = new Date();
                offer.rejectDate = getCurDate.getTime();
                delete offer.template;
                delete offer.letter;
                jQuery('.loading-container').css('display', 'block');
                privateOffer.updateOffer(offer).$promise.then(function (results) {
                    results = normalizeObjects(results);
                    hasSuccess('Offer rejected!');
                    results.letter = $scope.offers[index].letter;
                    $scope.offers[index] = results;

                    $scope.offerData.declineOfferCOnfirmation = false;
                    refreshOfferCount();
                    jQuery('.loading-container').css('display', 'none');

                    // We can make the step api call separately
                    var step = {
                        applicationId: offer.applicationId,
                        usersId      : offer.usersId,
                        stepValue    : 'Offer - Declined'
                    };
                    privateStep.addApplicationStepById(step, {value: 'Offer declined from user dashboard'});
                    getCandidateActivities($scope.candidate);
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });
            }
        };

        $scope.getAppRowClass = function (reqId) {

        };

        $scope.getStatusClass = function (status, reqStatus) {
            if (reqStatus !== 'open') {
                return 'label label-default';
            } else if (status === 'applied' || status === 'Applied') {
                return 'label label-info';
            } else if (status === 'Candidate') {
                return 'label label-azure';
            } else if (status === 'Offer' || status === 'Hired') {
                return 'label label-success';
            } else if (status === 'Rejected') {
                return 'label label-default';
            }
        };

        $scope.maskStatus = function (status, reqStatus) {
            var display = status;
            if (status && reqStatus) {
                status = status.toLowerCase();
                reqStatus = reqStatus.toLowerCase();

                if (status === 'rejected') {
                    display = 'Not selected';
                } else if (reqStatus !== 'open') {
                    display = 'Job closed';
                } else if (status === 'applied') {
                    display = 'Application received';
                } else if (status === 'candidate') {
                    display = 'In process';
                } else if (status === 'offer') {
                    display = 'Offered';
                } else if (status === 'hired') {
                    display = 'Hired';
                }
                return XCLOUD.apply_filter('application_status', display, status, reqStatus);
            } else {
                return display;
            }
        };
        $scope.preventDoubleClick = function () {
            return false;
        };

        $scope.launchResetPassword = function ($event) {
            $event.preventDefault();
            $scope.isLaunchResetPassword = true;
            $location.path('/profile/reset-password/', false);
        };

        $scope.goToProfile = function ($event) {
            $event.preventDefault();
            $scope.isLaunchResetPassword = false;
            $location.path('/profile/', false);
        };

        $scope.passwordUpdate = function ($event) {
            $event.preventDefault();
            openPasswordUpdate(E_WORK_FLOW.MODIFY_PASSWORD);
            jQuery('.loading-container').css('display', 'none');
        };

        function openPasswordUpdate(workFlow) {
            var _modalPopup = {
                configuration: {
                    candidate: $scope.editCandidate,
                    token    : $location.search().token,
                    workFlow : workFlow,
                    style    : {
                        windowClass: "schema-modal-popup"
                    }
                }
            };
            switch (workFlow) {
                case E_WORK_FLOW.CREATE_PASSWORD:
                case E_WORK_FLOW.MODIFY_PASSWORD:
                    var _template = '/wp-content/plugins/xcloud/app/components/password-update/password-update.html';
                    var _controller = 'passwordUpdateModalController';
                    schemaModalService.open(_modalPopup.configuration, _template, _controller);
                    break;
            }
        }

        function resetPasswordBackwardCompatibility() {
            try {
                if (DYNAMIC_PAGE_SETTINGS.RESET_PASSWORD_TEMPLATE_FLAG === E_TEMPLATE_FLAG_TYPE.PROFILE) {
                    if ($location.path() === '/profile/reset-password/') {
                        $location.path('/profile/', false);
                        $scope.$apply();
                    }
                    if (deleteTokenInURL === true) {
                        $location.search('token', null).replace();
                    }
                }
            } catch (reason) {
                logger.error(reason);
            }
        }

        /* $scope.alertDeleteAccount = function ($event) {
             $event.preventDefault();
             $("#deleteAccountModal").modal();
         };

         $scope.checkDeleteConfirmation = function () {
             if($scope.confirmDelete === 'DELETE'){
                 $scope.deleteAccountForm.confirmDelete.$setValidity('confirmDelete', true);
             }else{
                 $scope.deleteAccountForm.confirmDelete.$setValidity('confirmDelete', false);
             }
         };

         $scope.checkDeleteText = function() {
             if($scope.confirmDelete === 'DELETE') {
                 $scope.displayError = false;
             }
             else {
                 $scope.displayError = true;
             }
         };

         $scope.refillDeleteText = function() {
             $scope.displayError = false;
         };

         $scope.submitDeleteAccount = function ($event) {
             $event.preventDefault();
             jQuery('.loading-container').css('display', 'block');
             $scope.editCandidate.deactivateCheck = 't';
             delete $scope.editCandidate.unsubscribeCheck; // need to remove after fixing new unsubscribe requirement in GDPR
             privateCandidate.updateCandidate($scope.editCandidate).$promise.then(function (result) {
                 authService.loginCancelled();
                 $scope.setCurrentUser(null);
                 XCLOUD.personalize.init();
                 XCLOUD.log_out(true, $event, true);
                 jQuery('.loading-container').css('display', 'none');
             }, function (reason) {
                 logger.error(reason);
                 jQuery('.loading-container').css('display', 'none');
             });
         };*/

        function initialize() {
            jQuery('.loading-container').css('display', 'block');
            $scope.candidatePhotoUrl = 'https://assets-findly/wp-content/uploads/2017/04/05080540/user.png';
            $scope.orgName = _XC_CONFIG.org_name;
            $scope.executionEngineCollection = {};
            $scope.loading = true;
            $scope.profileUpdated = false;
            $scope.candidate = {};
            $scope.workHistory = {};
            $scope.eduHistory = {};
            $scope.applications = [];
            $scope.assessments = [];
            $scope.msg = '';
            $scope.fillDetailsMsg = TEMPLATE_CONSTANTS.TITLE.BANNER.PREFERENCE_NOTIFICATION_TEXT.str + '<span><br></span>' + TEMPLATE_CONSTANTS.TITLE.BANNER.PREFERENCE_NOTIFICATION_TEXT_2.str;
            $scope.lists = {};
            $scope.attachmentDetails = {};
            $scope.fileFormName = {};
            $scope.fileUrl = {};
            $rootScope.showAccount = false;
            $scope.passwordInModal = _XC_CONFIG.login_modal.passwordInModal;
            $scope.activatePreferences = _XC_CONFIG.activate_preferences;
            $scope.availableTab = function (key) {
                return DASHBOARD_TABS.indexOf(key) > -1;
            };
            $scope.socialProfileMergeEngine = {
                showMergeDialog: false
            };
            // to carry complete bunch of records
            $scope.workHistoryCollection = [];
            $scope.eduHistoryCollection = [];

            $scope.offers = [];

            $scope.accLockedStatus = true;

            $scope.interviewsByCalendarId = [];
            $scope.interviewsGrouped = [];


            $scope.preferenceButtonDisabled = true;
            $scope.profileButtonDisabled = true;
            $scope.interviewListNew = {};
            $scope.interviewIdList = {};
            $scope.interviewIdSecList = {};
            $scope.interviewEventSchedulesList = [];
            $scope.interviewEventDateList = {};
            $scope.interviewList = [];
            $scope.interviewDetails = {};
            $scope.interviewEventIdList = {};
            $scope.interviewEventIdSecList = {};
            $scope.interviewEventSchedulesList = [];
            $scope.interviewEventSchedules = [];
            $scope.interviewUpdateJSON = {};
            $scope.hiringTeamAttendees = {};
            $scope.hiringTeamAttendeesNumber = {};
            $scope.selectedScheduleId = null;

            $scope.resetPasswordUrl = '/profile/reset-password/';
            if (_XC_CONFIG.lang && _XC_CONFIG.lang !== 'en') {
                $scope.resetPasswordUrl = '/' + _XC_CONFIG.lang + $scope.resetPasswordUrl;
            }

            logger.log(DASHBOARD_TABS);

            buildExecutionEngine();
            $scope.executionEngineCollection = {
                "preferences": {
                    preExecution          : $scope.preferencesPreConditions,
                    postExecution         : $scope.preferencesPostConditions,
                    workHistoryFieldExists: false,
                    eduHistoryFieldExists : false
                }
            };

            logger.debug('initialize()', $location.search().token);

            $scope.isLaunchResetPassword = false;

            if ($location.search().token && authService.isLoggedIn !== true) { // authservice will have false sate while temporary tokens are exists
                deleteTokenInURL = false;
                $scope.msg = 'validToken';
                $rootScope.showAccount = true;
                $scope.tokenInValidation = true;
                if (_XC_CONFIG.login_modal.passwordInModal === true) {
                    openPasswordUpdate(E_WORK_FLOW.CREATE_PASSWORD);
                } else {
                    validateToken();
                }
            } else if (!authService.isLoggedIn) {
                // Below code is insert to check whether credentials are saved and authService.isLoggedIn is undefined
                var storedCredentials = LocalStorage.get('credentials', true, $rootScope.rememberMe);
                if (storedCredentials !== undefined && storedCredentials !== null) {
                    if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                        storedCredentials = storedCredentials.$$state.value;
                        $timeout(function () {
                            LocalStorage.set('credentials', storedCredentials, true); // On page refresh update credential date value to latest
                        });
                        authService.isLoggedIn = true;
                    } else {
                        storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                        if (storedCredentials !== undefined && storedCredentials !== null) {
                            if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                                storedCredentials = storedCredentials.$$state.value;
                                $timeout(function () {
                                    LocalStorage.set('oauthcredentials', storedCredentials, true);
                                });
                                authService.isLoggedIn = true;
                            }
                        }
                    }
                } else {
                    storedCredentials = LocalStorage.get('oauthcredentials', true, $rootScope.rememberMe);
                    if (storedCredentials !== undefined && storedCredentials !== null) {
                        if (storedCredentials.$$state.value !== undefined && storedCredentials.$$state.value !== null) {
                            storedCredentials = storedCredentials.$$state.value;
                            $timeout(function () {
                                LocalStorage.set('oauthcredentials', storedCredentials, true);
                            });
                            authService.isLoggedIn = true;
                        }
                    }
                }

                if (authService.isLoggedIn) {
                    $scope.msg = 'validToken';
                    $rootScope.showAccount = true;
                    logger.debug('getCurrentCandidate()');
                    getCurrentCandidate();
                }
                else {
                    isRedirectToLoginPage = true;
                }
            }
            else {
                $scope.msg = 'validToken';
                $rootScope.showAccount = true;
                logger.debug('getCurrentCandidate()');
                getCurrentCandidate();
            }
            jQuery('.loading-container').css('display', 'none');
        }

        function validateToken() {
            jQuery('.loading-container').css('display', 'block');
            privateCandidateToken.getCurrentCandidateByToken($location.search().token).query().$promise.then(function (result) {
                $scope.candidate = normalizeObjects(result);
                // $scope.candidate.password = '';

                logger.debug('candidate returned: ' + angular.toJson($scope.candidate));
                jQuery('.loading-container').css('display', 'none');
            }, function (reason) {
                logger.error(reason);
                $scope.msg = 'invalidToken';
                jQuery('.loading-container').css('display', 'none');
            });
        }

        $scope.resetPassword = function (isValid) {
            if (!isValid) {
                logger.debug('There are still invalid fields.');
                return;
            }
            jQuery('.loading-container').css('display', 'block');
            $scope.candidate.password = $scope.candidate.newPassword;
            if (!authService.isLoggedIn) {
                privateCandidatePwd.resetPassword($location.search().token).query({'value': $scope.candidate.password}).$promise.then(function (result) {
                    $scope.msg = 'passwordUpdateSuccess';
                    jQuery('.loading-container').css('display', 'none');
                }, function (reason) {
                    logger.error(reason);
                    $scope.msg = $scope.msgSuccess = 'passwordUpdateError';
                    jQuery('.loading-container').css('display', 'none');
                });
            } else if (authService.isLoggedIn) {
                $scope.editCandidate.password = $scope.candidate.newPassword;
                var getCurDate = new Date();
                $scope.editCandidate.updateDate = getCurDate.getTime();
                privateCandidate.updateCandidate($scope.editCandidate).$promise.then(function (result) {
                    $scope.candidate = normalizeObjects(result);
                    $scope.editCandidate = angular.copy($scope.candidate);
                    initialLoader();
                    authService.loginCancelled();
                    $scope.setCurrentUser(null);
                    XCLOUD.log_out(true);
                    XCLOUD.personalize.init();
                    $scope.msg = 'passwordUpdateSuccess';
                    jQuery('.loading-container').css('display', 'none');
                }, function (reason) {
                    logger.error(reason);
                    $scope.msg = 'passwordUpdateError';
                    jQuery('.loading-container').css('display', 'none');
                });
            }
        };

        function getCandidateActivities(candidateObject) {
            candidateActivityViewModelService.getCandidateActivities(candidateObject).then(function (CAResponse) {
                $scope.preferencesNotSet = CAResponse.preferenceNotification;
                $scope.$broadcast(BROAD_CAST_NAMESPACE.CANDIDATE_ACTIVITY_VM_REFRESH, CAResponse);
            }, function (reason) {
                logger.error(reason);
            })
        }

        function getCandidateSubscription(email, candidateId) {
            var deferred = $q.defer();
            CandidateWorkFlow.preferences.communications.subscriptions.getSubscriptionStatus(email, candidateId)
                .then(function (result) {
                    if (result.length !== 0) {
                        for (var i = 0; i < result.length; i++){
                            if (E_COMMUNICATION_TYPE.MARKETING === result[i].communicationType){
                                if(result[i].subscription === "f"){
                                    $scope.communicationSubscriptions.unsubscribeCheck = 'f';
                                }
                                else{
                                    $scope.communicationSubscriptions.unsubscribeCheck = 't';
                                }
                                deferred.resolve(0);
                                break;
                            }
                        }
                    }
                    else{
                        /*If a user selects to be subscribed to communication, we are not storing any data in DB, so if not result is returned, we will consider it as subscribed*/
                        $scope.communicationSubscriptions.unsubscribeCheck = 't';
                        deferred.resolve(0);
                    }
                });
            return deferred.promise;
        }

        function putCandidateSubscription() {
            if ($scope.communicationSubscriptions.oldState !== $scope.communicationSubscriptions.unsubscribeCheck) {
                if ($scope.communicationSubscriptions.unsubscribeCheck === 'f') {
                    CandidateWorkFlow.preferences.communications.subscriptions.marketing.unSubscribe($scope.editCandidate.uname);
                    $scope.profileUpdatedMsg += 'You are successfully unsubscribed form email alerts';
                } else {
                    CandidateWorkFlow.preferences.communications.subscriptions.marketing.subscribe($scope.editCandidate.uname);
                    $scope.profileUpdatedMsg += 'You are successfully subscribed to email alerts';
                }
            }
        }

        function getCurrentCandidate() {
            jQuery('.loading-container').css('display', 'block');
            privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                $scope.candidate = normalizeObjects(result);

                if ($scope.candidate.locked === 't' || $scope.candidate.locked === null) {
                    $scope.accLockedStatus = false;
                }

                authService.setBasicCandidate($scope.candidate);
                ApplicationState.session.candidate.set($scope.candidate);
                ApplicationState.localStorage.candidate.id.set($scope.candidate.candidateId);
                $scope.editCandidate = angular.copy($scope.candidate);

                initialLoader();
                getCandidateActivities($scope.candidate);
                getApplicationHistory($scope.candidate.candidateId);
                dashboardAttachmentViewModalService.getAttachments($scope.candidate).then(function (results) {
                    // var attachments = normalizeObjects(results);
                    $scope.$broadcast(BROAD_CAST_NAMESPACE.DASHBOARD_ATTACHMENT_VM_REFRESH, results);
                });
                getLists();

                privateCandidate.getCandidateWorkHistory({candidateId: $scope.candidate.candidateId}).$promise.then(function (result) {
                    $scope.addedWorkHistory = normalizeObjects(result);
                    $scope.addedWorkHistory = $filter('orderBy')($scope.addedWorkHistory, 'work_history_id', true);
                    workHistoryCollectionObserver();
                });

                privateCandidate.getCandidateEducation({candidateId: $scope.candidate.candidateId}).$promise.then(function (result) {
                    $scope.addedEduHistory = normalizeObjects(result);
                    $scope.addedEduHistory = $filter('orderBy')($scope.addedEduHistory, 'education_id', true);
                    educationHistoryCollectionObserver();
                });

                if (DASHBOARD_TABS.indexOf('interviews') > -1) {
                    var deferredVar = getInterviews($scope.candidate.candidateId);
                }
                $scope.loading = true;
                if (DASHBOARD_TABS.indexOf('assessments') > -1) {
                    getAssessments();
                }
                else {
                    $scope.loading = false;
                }

                if (CWS) {
                    CWS.build_lastviewed_list();
                }
                jQuery('.loading-container').css('display', 'none');
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
        }

        $scope.updateCandidate = function (callerType) {
            if (callerType === 'preferences') {
                $scope.preferenceButtonDisabled = true;
            }
            else if (callerType === undefined) {
                $scope.profileButtonDisabled = true;
            }

            jQuery('.loading-container').css('display', 'block');
            /*if (typeof $rootScope.dashboardFMEnabled !== 'undefined' && $rootScope.dashboardFMEnabled) {
                $scope.candidate = ApplicationState.session.candidate.get();
                if (typeof $scope.candidate === 'undefined' && $scope.candidate === null) {
                    privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                        $scope.candidate = normalizeObjects(result);
                        authService.setBasicCandidate($scope.candidate);
                        ApplicationState.session.candidate.set($scope.candidate);
                        $scope.editCandidate = angular.copy($scope.candidate);
                        $scope.manageUpdateCandidate(callerType);
                    }, function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                    });
                } else {
                    $scope.manageUpdateCandidate(callerType);
                }
            } else {
                $scope.manageUpdateCandidate(callerType);
            }*/

            var getCurDate = new Date();
            $scope.editCandidate.updateDate = getCurDate.getTime();
            if ($scope.executionEngineCollection[callerType] !== undefined) {
                $scope.executionEngineCollection[callerType].preExecution()
            }
            $scope.socialProfileMergeEngine.overrideBasicInformation($scope.editCandidate);
            privateCandidate.updateCandidate($scope.editCandidate).$promise.then(function (result) {
                $scope.candidate = normalizeObjects(result);
                $scope.editCandidate = angular.copy($scope.candidate);

                var executionEngine = $scope.executionEngineCollection[callerType];
                if (executionEngine !== undefined) {
                    $scope.executionEngineCollection[callerType].postExecution();
                }

                authService.setBasicCandidate($scope.candidate);
                ApplicationState.session.candidate.set($scope.candidate);

                if (executionEngine === undefined || (executionEngine.workHistoryFieldExists !== undefined && executionEngine.workHistoryFieldExists === true)) {
                    var workHistoryAPIProxy = privateCandidate.updateWorkHistory;
                    if ($scope.addedWorkHistory.length === 0) {
                        if ($scope.workHistory.title === undefined) {
                            workHistoryAPIProxy = null;
                        } else {
                            workHistoryAPIProxy = privateCandidate.addWorkHistory;
                        }
                    }
                    if (workHistoryAPIProxy !== null) {
                        $scope.workHistory.candidateId = $scope.candidate.candidateId;
                        workHistoryAPIProxy($scope.workHistory).$promise.then(function (results) {
                            if ($scope.addedWorkHistory.length === 0) {
                                $scope.addedWorkHistory = normalizeObjects(result);
                                workHistoryCollectionObserver();
                            }
                        }, function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });
                    }
                }
                if (executionEngine === undefined || (executionEngine.eduHistoryFieldExists !== undefined && executionEngine.eduHistoryFieldExists === true)) {
                    var eduHistoryAPIProxy = privateCandidate.updateEducation;
                    if ($scope.addedEduHistory.length === 0) {
                        if ($scope.eduHistory.levelAttained === undefined) {
                            eduHistoryAPIProxy = null;
                        } else {
                            eduHistoryAPIProxy = privateCandidate.addEducation;
                        }
                    }
                    if (eduHistoryAPIProxy !== null) {
                        $scope.eduHistory.candidateId = $scope.candidate.candidateId;
                        eduHistoryAPIProxy($scope.eduHistory).$promise.then(function (results) {
                            if ($scope.addedEduHistory.length === 0) {
                                $scope.addedEduHistory = normalizeObjects(result);
                                educationHistoryCollectionObserver();
                            }
                        }, function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });
                    }
                }

                if (executionEngine === undefined || (executionEngine.workHistoryFieldExists !== undefined && executionEngine.workHistoryFieldExists === true)) {
                    $scope.socialProfileMergeEngine.overrideWorkHistory($scope.candidate.candidateId);
                }
                if (executionEngine === undefined || (executionEngine.eduHistoryFieldExists !== undefined && executionEngine.eduHistoryFieldExists === true)) {
                    $scope.socialProfileMergeEngine.overrideEducationHistory($scope.candidate.candidateId);
                }

                $scope.profileUpdatedMsg = 'Profile Updated';
                $scope.profileUpdated = true;
                $scope.socialProfileMergeEngine.clearMergeState();
                getCandidateActivities($scope.candidate);

                $timeout(function () {
                    $scope.profileUpdated = false;
                }, 10000);

                jQuery('.loading-container').css('display', 'none');

                // $window.scrollTo(0, jQuery('.account-body').offset().top); // not working as excepted
                jQuery('html, body').animate({scrollTop: 0}, "slow");

            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
        };

        /*$scope.manageUpdateCandidate = function (callerType) {

        };*/

        $scope.semaphoreOfFormActionDisabled = function (formId) {
            if (formId === 'pinfo') {
                $scope.profileButtonDisabled = false;
            }
            else if (formId === undefined) {
                $scope.preferenceButtonDisabled = false;
            }
        };

        $scope.notifyWillingToTravelChange = function () {
            $scope.preferencesNonJSON.travelAmount = null;
            $scope.semaphoreOfFormActionDisabled();
        };

        $scope.notifyWillingToTravelChangeYes = function () {
            $scope.preferencesNonJSON.travelAmount = "0 to 25%";
            $scope.semaphoreOfFormActionDisabled();
        };

        $scope.profileUpdatedShowHide = function ($event) {
            $event.preventDefault();
            $scope.profileUpdated = false;
        };

        $scope.getType = function (doc) {
            if (doc) {
                var docType = doc.split('.');
                return docType[docType.length - 1].toUpperCase();
            }
        };

        function getApplicationHistory(canId) {
            privateApplication.getApplicationsByCandidateId({candidateId: canId}).$promise.then(function (results) {
                $scope.applications = normalizeObjects(results);

                // We need to get jobsapi data as well, so we can build urls to the job detail page
                // Thanks UnderscoreJS
                var allReqIds = _.pluck($scope.applications, 'requisitionId');
                jobsapi.getReqs({'facet': 'ref:' + allReqIds.join('~')}).$promise.then(function (jobsapi_results) {
                    jobsapi_results = normalizeObjects(jobsapi_results);
                    if (jobsapi_results && jobsapi_results.queryResult.length > 0) {
                        // Now let's add jobsapi data to each ats job as its own property
                        for (var i = 0, len = $scope.applications.length; i < len; i++) {
                            $scope.applications[i]['jobsapi'] = _.findWhere(jobsapi_results.queryResult,
                                {ref: $scope.applications[i].requisitionId.toString()});
                        }
                    }
                });

                if ($scope.applications.length) {
                    $scope.applyHistoryTable = tableManagementService($scope.applications, 5);
                    $scope.applyHistoryTable.sortBy('applyDate');
                    searchRequisitions();
                } else {
                    $scope.loading = false;
                }
                jQuery('.loading-container').css('display', 'none');
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
        }

        $scope.showRespectiveSec = function (interviewId) {
            if ($scope.flagUpdates.hasOwnProperty(interviewId)) {
                angular.forEach($scope.interviewIdSecList, function (value, key) {
                    if (key.indexOf("review_") > -1) {
                        if (key.indexOf(interviewId) > -1) {
                            $scope.interviewIdSecList[key] = false;
                        } else {
                            $scope.interviewIdSecList[key] = true;
                        }
                    }
                    else if (key.indexOf("reviewSec_") > -1) {
                        if (key.indexOf(interviewId) > -1) {
                            $scope.interviewIdSecList[key] = true;
                        } else {
                            $scope.interviewIdSecList[key] = false;
                        }
                    }
                });

                angular.forEach($scope.interviewIdList, function (value, key) {
                    $("#innerInterview_" + value).removeClass('display-none');
                    $("#confirmationContainer_" + value).addClass('display-none');
                    $("#confirmationContainer_" + value).html('');
                });

                $location.path('/profile/interviews/' + '\'' + interviewCalendarId + '\'' + '/', false);

                if (!$scope.flagUpdates[interviewId].readViewStatus) {

                    $scope.interviewUpdate = {
                        candidateId             : $scope.candidate.candidateId,
                        interviewEventScheduleId: 0,
                        interviewEventId        : interviewId,
                        statusId                : $scope.flagUpdates[interviewId].statusId,
                        status                  : 'READ',
                        proposeMessage          : ''
                    };
                    privateCandidate.updateInterviewStatus($scope.interviewUpdate).$promise.then(function (results) {
                        $scope.flagUpdates[interviewId].readViewStatus = true;
                    }, function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                    });
                }
            }
        };

        $scope.hideRespectiveSec = function (interviewId) {
            angular.forEach($scope.interviewIdSecList, function (value, key) {
                if (key.indexOf("review_" + interviewId) > -1) {
                    $scope.interviewIdSecList[key] = true;
                }
                else if (key.indexOf("reviewSec_" + interviewId) > -1) {
                    $scope.interviewIdSecList[key] = false;
                }
            });
        };

        $scope.makeCellSelectable = function ($event, interviewId, selectedScheduleId, interviewType) {
            if (interviewType === 'standard' || $scope.selectedScheduleId === selectedScheduleId) {
                $scope.selectedScheduleId = selectedScheduleId;
                if ($("#schedule_" + $scope.selectedScheduleId).hasClass("active")) {
                    $("#schedule_" + $scope.selectedScheduleId).removeClass('active');
                    $scope.selectedScheduleId = null;
                    $scope.flagUpdates[interviewId].disableConfirmInterview = true;
                } else {
                    $("#schedule_" + $scope.selectedScheduleId).addClass('active');
                    $scope.flagUpdates[interviewId].disableConfirmInterview = false;
                }

            } else if (selectedScheduleId === undefined) {
                $("#schedule_" + $scope.selectedScheduleId).removeClass('active');
                $scope.selectedScheduleId = null;
                $scope.flagUpdates[interviewId].disableConfirmInterview = true;
            } else {
                $("#schedule_" + $scope.selectedScheduleId).removeClass('active');
                $scope.selectedScheduleId = selectedScheduleId;
                $scope.flagUpdates[interviewId].disableConfirmInterview = false;
                $("#schedule_" + $scope.selectedScheduleId).addClass('active');
            }
        };

        $scope.interviewConfirm = function (captureSingleInterview, interviewId, interviewCalendarId, interviewType) {
            _.each(captureSingleInterview.schedules, function (item) {
                if (item.interviewId === parseInt(interviewId)) {
                    $scope.interviewUpdate = $scope.interviewUpdateJSON[item.interviewId];
                    $scope.interaviewExternalCalendarId = $scope.interviewUpdateJSON[item.interviewId].externalCalendarId;
                    $scope.interviewCandidateId = $scope.interviewUpdateJSON[item.interviewId].candidateId;
                    $scope.interviewUpdate.status = 'accepted';
                    $scope.interviewStartTime = $scope.interviewUpdateJSON[item.interviewId].startDateTime;
                    $scope.interviewEndTime = $scope.interviewUpdateJSON[item.interviewId].endDateTime;
                    var interviewTimeSlot = {
                        "startDateTime": $scope.interviewStartTime,
                        "endDateTime"  : $scope.interviewEndTime
                    }
                    jQuery('.loading-container').css('display', 'block');
                    privateCandidate.acceptRejectInterview({
                        externalCalendarId: $scope.interaviewExternalCalendarId,
                        action            : $scope.interviewUpdate.status,
                        candidateId       : $scope.interviewCandidateId
                    }, interviewTimeSlot).$promise.then(function (results) {
                        $scope.flagUpdates[interviewCalendarId].status = 'accepted';
                        $scope.flagUpdates[interviewCalendarId].confirmedSchdeule.startTime = formatTime($scope.interviewStartTime);
                        $scope.flagUpdates[interviewCalendarId].confirmedSchdeule.endTime = formatTime($scope.interviewEndTime);
                        $scope.flagUpdates[interviewCalendarId].confirmedSchdeule.startDate = interviewFormatDate($scope.interviewStartTime).formattedDate;
                        jQuery('.loading-container').css('display', 'none');
                        var confirmationContainerHtml = '';
                        confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
                        confirmationContainerHtml += '<div class="center" id="interviewConfirmed_' + interviewCalendarId + '">';
                        confirmationContainerHtml += '<h3 class="h3 bold m0">Your Interview has been confirmed</h3>';
                        confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">Close</button>';
                        confirmationContainerHtml += '</div>';
                        var compiledHtml = $compile(confirmationContainerHtml)($scope);
                        var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
                        $(confirmationContainerId).html(compiledHtml);
                        $(confirmationContainerId).removeClass('display-none');
                        $("#innerInterview_" + interviewCalendarId).addClass('display-none');
                    }, function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                    });
                }
            });
        };

        $scope.sendRequestAfterAccept = function (interviewId, interviewCalendarId) {
            angular.forEach($scope.interviewList, function (value, key) {
                if (value.interviewId === interviewCalendarId) {
                    angular.forEach(value.schedules, function (value2, key2) {
                        $scope.proposeInterviewTimeSent(value2.interviewId, interviewCalendarId);
                    });
                }
            });
        }
        $scope.interviewProposeAccept = function (interviewId, interviewCalendarId, interviewType) {
            var confirmationContainerHtml = '';
            confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
            confirmationContainerHtml += '<div class="center" id="proposeInterviewTime_' + interviewCalendarId + '">';
            confirmationContainerHtml += '<h3 class="h3 bold m0">Request new time.</h3>';
            confirmationContainerHtml += '<p>You need to get in touch with recruiter to request a new time. Do you wish to cancel this interview and request for new time?</p>';
            confirmationContainerHtml += '<form name="proposeInterviewTimeForm">';
            confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5 mr1" ng-click="sendRequestAfterAccept(' + interviewId + ',' + '\'' + interviewCalendarId + '\'' + ')">Send</button>';
            confirmationContainerHtml += '<button type="submit" class="btn px3 h5 bgnone bordered-themeprimary" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">Close</button></form>';
            confirmationContainerHtml += '</div>';
            var compiledHtml = $compile(confirmationContainerHtml)($scope);
            var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
            $(confirmationContainerId).html(compiledHtml);
            $(confirmationContainerId).removeClass('display-none');
            $("#innerInterview_" + interviewCalendarId).addClass('display-none');

        }

        $scope.interviewProposeMulti = function (interviewId, interviewCalendarId, interviewType) {
            angular.forEach($scope.interviewList, function (value, key) {
                if (value.interviewId === interviewCalendarId) {
                    angular.forEach(value.schedules, function (value2, key2) {
                        $scope.interviewPropose(value2.interviewId, interviewCalendarId, interviewType);
                    });
                }
            });
        }

        $scope.interviewPropose = function (interviewId, interviewCalendarId, interviewType) {
            var confirmationContainerHtml = '';
            confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
            confirmationContainerHtml += '<div class="center" id="proposeInterviewTime_' + interviewCalendarId + '">';
            confirmationContainerHtml += '<h3 class="h3 bold m0">Request new time.</h3>';
            confirmationContainerHtml += '<p>You need to get in touch with recruiter to request a new time. Do you wish to cancel this interview and request for new time?</p>';
            confirmationContainerHtml += '<form name="proposeInterviewTimeForm">';
            confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5 mr1" ng-click="proposeInterviewTimeSent(' + interviewId + ',' + '\'' + interviewCalendarId + '\'' + ')">Send</button>';
            confirmationContainerHtml += '<button type="submit" class="btn px3 h5 bgnone bordered-themeprimary" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">Close</button></form>';
            confirmationContainerHtml += '</div>';
            var compiledHtml = $compile(confirmationContainerHtml)($scope);
            var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
            $(confirmationContainerId).html(compiledHtml);
            $(confirmationContainerId).removeClass('display-none');
            $("#innerInterview_" + interviewCalendarId).addClass('display-none');
        };

        $scope.proposeInterviewTimeSent = function (interviewId, interviewCalendarId) {
            $scope.interviewUpdate = $scope.interviewUpdateJSON[interviewId];
            $scope.interviewUpdate.status = 'rejected';
            privateCandidate.updateInterviewStatus($scope.interviewUpdate).$promise.then(function (results) {
                $scope.flagUpdates[interviewCalendarId].status = 'Rejected';
                var confirmationContainerHtml = '';
                confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
                confirmationContainerHtml += '<div class="center" id="proposeInterviewTimeSent_' + interviewCalendarId + '">';
                confirmationContainerHtml += '<h3 class="h3 bold m0">Request for new Interview time has been sent.</h3>';
                confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">Close</button>';
                confirmationContainerHtml += '</div>';
                var compiledHtml = $compile(confirmationContainerHtml)($scope);
                var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
                $(confirmationContainerId).html(compiledHtml);
                $(confirmationContainerId).removeClass('display-none');
                $("#innerInterview_" + interviewCalendarId).addClass('display-none');
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });

        };

        $scope.interviewDeclineMultiAccept = function (interviewId, interviewCalendarId) {
            angular.forEach($scope.interviewList, function (value, key) {
                if (value.interviewId === interviewCalendarId) {
                    angular.forEach(value.schedules, function (value2, key2) {
                        $scope.sendExternalCalendarID = value.schedules[0].externalCalendarId;
                        $scope.sendCandidateID = value.schedules[0].interviewsCandidateId;
                        $scope.interviewId = value2.interviewId;
                    });
                    $scope.interviewDeclineConfirmed($scope.sendCandidateID, $scope.sendExternalCalendarID, $scope.interviewId, interviewCalendarId)
                }
            });
        }

        $scope.interviewDeclineMulti = function (interviewId, interviewCalendarId, interviewType) {
            var confirmationContainerHtml = '';
            confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
            confirmationContainerHtml += '<div class="center" id="interviewDecline_' + interviewCalendarId + '">';
            confirmationContainerHtml += '<h3 class="h3 bold m0 mb2">Are you sure you want to decline this interview?</h3>';
            confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5 mr1" ng-click="interviewDeclineMultiAccept('
            confirmationContainerHtml += interviewId
            confirmationContainerHtml += ','
            confirmationContainerHtml += '\''
            confirmationContainerHtml += interviewCalendarId
            confirmationContainerHtml += '\''
            confirmationContainerHtml += ')">Yes</button>';
            confirmationContainerHtml += '<button type="submit" class="btn px3 h5 bgnone bordered-themeprimary" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">No</button>';
            confirmationContainerHtml += '</div>';
            var compiledHtml = $compile(confirmationContainerHtml)($scope);
            var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
            $(confirmationContainerId).html(compiledHtml);
            $(confirmationContainerId).removeClass('display-none');
            $("#innerInterview_" + interviewCalendarId).addClass('display-none');


        }

        $scope.interviewDecline = function (captureSingleInterview, interviewId, interviewCalendarId, interviewType) {
            $scope.singleInterviewObj = captureSingleInterview;
            $scope.sendExternalCalendarID = captureSingleInterview.schedules[0].externalCalendarId;
            $scope.sendCandidateID = captureSingleInterview.schedules[0].interviewsCandidateId;
            var confirmationContainerHtml = '';
            confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
            confirmationContainerHtml += '<div class="center" id="interviewDecline_' + interviewCalendarId + '">';
            confirmationContainerHtml += '<h3 class="h3 bold m0 mb2">Are you sure you want to decline this interview?</h3>';
            confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5 mr1" ng-click="interviewDeclineConfirmed(';
            confirmationContainerHtml += $scope.sendCandidateID;
            confirmationContainerHtml += ',';
            confirmationContainerHtml += '\'';
            confirmationContainerHtml += $scope.sendExternalCalendarID;
            confirmationContainerHtml += '\'';
            confirmationContainerHtml += ',';
            confirmationContainerHtml += '\'';
            confirmationContainerHtml += interviewId;
            confirmationContainerHtml += '\'';
            confirmationContainerHtml += ',';
            confirmationContainerHtml += '\'';
            confirmationContainerHtml += interviewCalendarId;
            confirmationContainerHtml += '\'';
            confirmationContainerHtml += ')">Yes</button>';
            confirmationContainerHtml += '<button type="submit" class="btn px3 h5 bgnone bordered-themeprimary" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">No</button>';
            confirmationContainerHtml += '</div>';
            var compiledHtml = $compile(confirmationContainerHtml)($scope);
            var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
            $(confirmationContainerId).html(compiledHtml);
            $(confirmationContainerId).removeClass('display-none');
            $("#innerInterview_" + interviewCalendarId).addClass('display-none');
        };

        $scope.interviewDeclineReason = function (interviewId) {
            var confirmationContainerHtml = '';
            confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + interviewId + ')">&times;</a>';
            confirmationContainerHtml += '<div class="center" id="interviewDeclineReason_' + interviewId + '">';
            confirmationContainerHtml += '<h3 class="h3 bold m0">Reason for declining <span class="h6">(Optional)</span></h3>';
            confirmationContainerHtml += '<form name="interviewDeclineReasonForm"><input type="text" name="interviewDeclineComments" ng-model="interviewDeclineComments" id="" class="bg-white declining-input"  maxlength="" placeholder="Reason for declining"/>';
            confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5 mr1" ng-click="interviewDeclineConfirmed(' + interviewId + ')">Submit</button>';
            confirmationContainerHtml += '<button type="submit" class="btn px3 h5 bgnone bordered-themeprimary" ng-click="confirmationContainerClose(' + interviewId + ')">Close</button>';
            confirmationContainerHtml += '</div>';
            var compiledHtml = $compile(confirmationContainerHtml)($scope);
            var confirmationContainerId = "#confirmationContainer_" + interviewId;
            $(confirmationContainerId).html(compiledHtml);
            $(confirmationContainerId).removeClass('display-none');
            $("#innerInterview_" + interviewId).addClass('display-none');
        };

        $scope.interviewDeclineConfirmed = function (interviewCandidateId, interaviewExternalCalendarId, interviewId, interviewCalendarId, interviewType) { //interviewId, interviewCalendarId, interviewType
            $scope.interviewUpdate = $scope.interviewUpdateJSON[interviewId];
            $scope.interviewUpdate.status = 'rejected';
            $scope.interaviewExternalCalendarId = interaviewExternalCalendarId;
            $scope.interviewCandidateId = interviewCandidateId;
            jQuery('.loading-container').css('display', 'block');
            privateCandidate.acceptRejectInterview({
                externalCalendarId: $scope.interaviewExternalCalendarId,
                action            : $scope.interviewUpdate.status,
                candidateId       : $scope.interviewCandidateId
            }, {}).$promise.then(function (results) {
                $scope.flagUpdates[interviewCalendarId].status = 'rejected';
                jQuery('.loading-container').css('display', 'none');
                var confirmationContainerHtml = '';
                confirmationContainerHtml += '<a href="javascript:void(0)" class="h1 m0 darkgray pull-right close-btn pop-close" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">&times;</a>';
                confirmationContainerHtml += '<div class="center" id="interviewDeclineConfirmed_' + interviewCalendarId + '">';
                confirmationContainerHtml += '<h3 class="h3 bold m0">Your Interview has been declined.</h3>';
                confirmationContainerHtml += '<button type="submit" class="white btn bg-silver py1 px3 border-none h5" ng-click="confirmationContainerClose(' + '\'' + interviewCalendarId + '\'' + ')">Close</button>';
                confirmationContainerHtml += '</div>';
                var compiledHtml = $compile(confirmationContainerHtml)($scope);
                var confirmationContainerId = "#confirmationContainer_" + interviewCalendarId;
                $(confirmationContainerId).html(compiledHtml);
                $(confirmationContainerId).removeClass('display-none');
                $("#innerInterview_" + interviewCalendarId).addClass('display-none');
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
        };

        $scope.confirmationContainerClose = function (interviewId) {
            var confirmationContainerId = "#confirmationContainer_" + interviewId;
            $(confirmationContainerId).html('');
            $(confirmationContainerId).addClass('display-none');
            $("#innerInterview_" + interviewId).removeClass('display-none');
        };

        function getHiringTeamAttendees(usersId, externalCalendarId) {
            privateUser.getUser({id: usersId}).$promise.then(function (results) {
                var userDetails = normalizeObjects(results);
                var eachName = userDetails.firstName + ' ' + userDetails.lastName;
                if ($scope.hiringTeamAttendees[externalCalendarId] === undefined) {
                    $scope.hiringTeamAttendees[externalCalendarId] = eachName;
                    $scope.hiringTeamAttendeesNumber[externalCalendarId] = 1;
                }
                else {
                    if ($scope.hiringTeamAttendees[externalCalendarId].indexOf(eachName) === -1)
                        $scope.hiringTeamAttendees[externalCalendarId] += ' , ' + eachName;
                    $scope.hiringTeamAttendeesNumber[externalCalendarId] += 1;
                }
            });
        }

        function getInterviews(canId) {
            privateCandidate.getInterviewListsByCandidateId({candidateId: canId}).$promise.then(function (results) {
                var deferred = $q.defer();
                try {
                    $scope.interviewListNew = normalizeObjects(results);
                    $scope.interviewListNew = $filter('orderBy')($scope.interviewListNew, 'interview_id', true);

                    angular.forEach($scope.interviewListNew, function (value, key) {
                        $scope.interviewUpdateJSON[value.interviewId] = value;
                    });

                    var translatedJSON = _.groupBy($scope.interviewListNew, "externalCalendarId");

                    var uniqueCalendarIds = _.chain($scope.interviewListNew).map(function (interview) {
                        return interview.externalCalendarId
                    }).uniq().value();

                    _.each(uniqueCalendarIds, function (calendarId) {
                        translatedJSON[calendarId].interviewDetails = [];
                        var tempJSON = {};
                        var commonJSON = {};
                        _.each(translatedJSON[calendarId], function (interviews) {
                            getHiringTeamAttendees(interviews.usersId, interviews.externalCalendarId);
                            tempJSON = {
                                "interviewId"          : interviews.interviewId,
                                "startTime"            : interviews.startDateTime,
                                "endTime"              : interviews.endDateTime,
                                "externalCalendarId"   : calendarId,
                                "statusEach"           : interviews.status,
                                "usersId"              : interviews.usersId,
                                "interviewsCandidateId": interviews.candidateId
                            };
                            commonJSON = {
                                "interviewId"   : interviews.externalCalendarId.slice(0, 20),
                                "usersId"       : interviews.usersId,
                                "location"      : interviews.location,
                                "description"   : interviews.description,
                                "updateDateTime": interviews.updateDateTime,
                                "status"        : interviews.status,
                                "type"          : interviews.type,
                                "schedules"     : []
                            };

                            translatedJSON[calendarId].interviewDetails.push(tempJSON);
                            if (translatedJSON[calendarId].commonDetails === undefined) {
                                translatedJSON[calendarId].commonDetails = [];
                                translatedJSON[calendarId].commonDetails.push(commonJSON);


                            }
                            commonJSON.schedules = translatedJSON[calendarId].interviewDetails;

                        });


                        $scope.interviewList.push(commonJSON);
                    });

                    // console.log($scope.interviewList);

                    $scope.updateInterviewDates = {};
                    $scope.flagUpdates = {};
                    $scope.interviewEventSchedulesList = [];


                    angular.forEach($scope.interviewList, function (value, key) {
                        if ($scope.flagUpdates[value.interviewId] === undefined) {
                            $scope.flagUpdates[value.interviewId] = {};
                        }
                        angular.forEach(value.schedules, function (value3, key3) {
                            if (value.status === 'rejected' || value.status === 'accepted') {
                                if (value3.statusEach === 'accepted') {
                                    value.status = 'accepted';
                                    var statusChangedFlag = 1;
                                }
                            }
                            if (statusChangedFlag === 1) {
                                if (value3.statusEach === 'rejected') {
                                    value.status = 'rejected';
                                }
                            }
                        });

                        $scope.interviewIdSecList["review_" + value.interviewId] = true;
                        $scope.interviewIdSecList["reviewSec_" + value.interviewId] = false;
                        $scope.interviewIdList[key] = value.interviewId;
                        $scope.updateInterviewDates[value.interviewId] = value.updateDateTime;
                        var duration = (value.schedules["0"].endTime - value.schedules["0"].startTime) / 60000;
                        var hours = Math.floor(duration / 60);
                        var minutes = duration > 60 ? duration % 60 : duration;

                        var newDuration = '';
                        newDuration += duration > 60 ? (hours === 0 ? '' : hours) : '';
                        newDuration += duration > 60 ? (hours > 1 ? ' Hours' : (hours !== 0 ? ' Hour' : '')) : '';
                        newDuration += duration > 60 ? ((hours !== 0) ? ' : ' : '') : '';
                        newDuration += (minutes === 0 ? '0' : minutes);
                        newDuration += (minutes > -1 ? ' minutes' : (minutes !== 0 ? ' minute' : ''));

                        // getHiringTeamAttendees(value.usersId , value.schedules["0"].externalCalendarId);

                        if (value.type === 'option' || value.type === 'standard' || value.type === 'range') {
                            angular.forEach(value.schedules, function (value2, key2) {
                                var schedulesJSON = {
                                    "interviewId": value2.interviewId,
                                    "startTime"  : value2.startTime,
                                    "endTime"    : value2.endTime,
                                    "scheduleId" : value2.interviewId,
                                    "usersId"    : value2.usersId
                                };

                                if ($scope.interviewEventSchedules[value.schedules["0"].externalCalendarId] === undefined) {
                                    $scope.interviewEventSchedules[value.schedules["0"].externalCalendarId] = [];
                                }

                                var _existingSchedules = _.filter($scope.interviewEventSchedules[value.schedules["0"].externalCalendarId], function (schedule) {
                                    return schedule.startTime === schedulesJSON.startTime && schedule.endTime === schedulesJSON.endTime;
                                })
                                if (_existingSchedules.length === 0) {
                                    $scope.interviewEventSchedules[value.schedules["0"].externalCalendarId].push(schedulesJSON);
                                }
                            });

                        }

                        $scope.interviewEventSchedules[value.schedules["0"].externalCalendarId].sort(function (a, b) {
                            return parseFloat(a.startTime) - parseFloat(b.startTime);
                        });

                        $scope.flagUpdates[value.interviewId] = {
                            'status'                 : value.status,
                            'statusId'               : value.statusId,
                            'duration'               : newDuration,
                            'readViewStatus'         : value.readViewStatus,
                            'disableConfirmInterview': (value.type === 'standard' ? false : true),
                            'interviewExpireTime'    : false,
                            'confirmedSchdeule'      : {},
                            'startDate'              : interviewFormatDate(value.schedules["0"].startTime),
                            'displayStartDate'       : value.schedules["0"].startTime,
                            'startTime'              : formatTime(value.schedules.startTime),
                            'endTime'                : formatTime(value.schedules.endTime),
                            'timezone'               : interviewFormatDate(value.updateDateTime).formattedTimezone
                        };
                        // console.log($scope.interviewUpdateJSON[value.interviewId]);

                        angular.forEach(value.schedules, function (value3, key3) {
                            if (value3.statusEach === 'accepted') {
                                $scope.flagUpdates[value.interviewId].confirmedSchdeule.startTime = formatTime(value3.startTime);
                                $scope.flagUpdates[value.interviewId].confirmedSchdeule.endTime = formatTime(value3.endTime);
                                $scope.flagUpdates[value.interviewId].confirmedSchdeule.startDate = interviewFormatDate(value3.startTime).formattedDate;
                            }
                        });

                        var dateWiseTimeSlot = [];
                        if ($scope.interviewEventSchedulesList[value.interviewId] === undefined) {
                            $scope.interviewEventSchedulesList[value.interviewId] = {};
                            $scope.interviewEventSchedulesList[value.interviewId] = {
                                "schedules"    : [],
                                "rowLength"    : 0,
                                "rowIndexTrack": []
                            };
                        }
                        var currentInterviewSchedules = $scope.interviewEventSchedulesList[value.interviewId].schedules;
                        var lastStartTime = null;
                        angular.forEach($scope.interviewEventSchedules[value.schedules["0"].externalCalendarId], function (value2, key2) {
                            var start = new Date(value2.startTime);
                            $scope.displayDate = value2.startTime;
                            var startDate = interviewFormatDate(start).formattedDate;
                            var hours = start.getHours();
                            var minutes = start.getMinutes();
                            var ampm = hours >= 12 ? 'pm' : 'am';
                            hours = hours % 12;
                            hours = hours ? hours : 12; // the hour '0' should be '12'
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            var strTime = hours + ':' + minutes + ' ' + ampm;

                            // to find duration for each time slot
                            var end = new Date(value2.endTime);
                            var endDate = interviewFormatDate(end).formattedDate;
                            hours = end.getHours();
                            minutes = end.getMinutes();
                            ampm = hours >= 12 ? 'pm' : 'am';
                            hours = hours % 12;
                            hours = hours ? hours : 12; // the hour '0' should be '12'
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            var endTime = hours + ':' + minutes + ' ' + ampm;

                            /*var timeStart = new Date(value2.startTime).getTime();
                             var timeEnd = new Date(value2.endTime).getTime();
                             var hourDiff = timeEnd - timeStart; //in ms
                             var secDiff = hourDiff / 1000; //in s
                             var minDiff = hourDiff / 60 / 1000; //in minutes
                             var hDiff = hourDiff / 3600 / 1000; //in hours

                             var duration = hDiff === 0 ? '' : hDiff + (hDiff > 0 ? ' Hrs' : ' Hr') + minDiff === 0 ? '' : (hDiff > 0 ? ' : ' : '') +  minDiff + (minDiff > 0 ? ' mins' : 'min');

                             var slotElement = "{\"" + "startTime" + "\"" + ":" + "\"" + strTime + "\", \"" + "endTime" + "\"" + ":" + "\"" + endTime + "\", \"" + "duration" + "\"" + ":" + "\"" + duration + "\", \"" + "scheduleId" + "\"" + ":" + "\"" + value2.interviewEventScheduleId + "\" }";*/

                            var slotElement = "{\"" + "startTime" + "\"" + ":" + "\"" + strTime + "\", \"" + "endTime" + "\"" + ":" + "\"" + endTime + "\", \"" + "startDate" + "\"" + ":" + "\"" + startDate + "\", \"" + "scheduleId" + "\"" + ":" + "\"" + value2.scheduleId + "\" }";

                            if (value.type === 'standard') {
                                $scope.selectedScheduleId = value2.interviewEventScheduleId;
                            }

                            if (lastStartTime === null) {
                                lastStartTime = value2.startTime;
                            }

                            if (value2.startTime > lastStartTime) {
                                lastStartTime = value2.startTime;
                            }

                            var schedulePointer;
                            if (currentInterviewSchedules.length > 0) {
                                schedulePointer = _.findWhere(currentInterviewSchedules, {date: startDate});
                                if (schedulePointer !== undefined) {
                                    schedulePointer = schedulePointer[startDate];
                                }
                            }
                            if (schedulePointer === undefined) {
                                var parentElement = "{\"" + startDate + "\":[]," + "\"" + "date" + "\"" + ":" + "\"" + startDate + "\"}";
                                currentInterviewSchedules.push(JSON.parse(parentElement));
                                schedulePointer = currentInterviewSchedules[currentInterviewSchedules.length - 1][startDate];
                            }
                            schedulePointer.push(JSON.parse(slotElement));
                            if ($scope.interviewEventSchedulesList[value.interviewId].rowLength < schedulePointer.length) {
                                $scope.interviewEventSchedulesList[value.interviewId].rowLength = schedulePointer.length;
                            }

                        });

                        for (var index = 0; index < $scope.interviewEventSchedulesList[value.interviewId].rowLength; index++) {
                            $scope.interviewEventSchedulesList[value.interviewId].rowIndexTrack.push(index);
                        }
                        delete  $scope.interviewEventSchedulesList[value.interviewId].rowLength;

                        if (lastStartTime > new Date().getTime()) {
                            $scope.flagUpdates[value.interviewId].interviewExpireTime = false;
                        }
                        lastStartTime = null;
                    });

                    deferred.resolve($scope.flagUpdates);
                } catch (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                    deferred.reject(reason);
                }

            });
        }

        function formatTime(time) {
            var start = new Date(time);
            var hours = start.getHours();
            var minutes = start.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        function interviewFormatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                strMonth = d.toString(),
                day = '' + d.getDate(),
                year = d.getFullYear().toString(),
                hours = d.getHours(),
                minutes = d.getMinutes(),
                ampm = hours >= 12 ? 'PM' : 'AM';
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var formattedTime = (hours + ':' + minutes + ' ' + ampm);

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            strMonth = strMonth.split(' ')[1];
            var formattedDate = strMonth + ' ' + [day, year].join(',');

            var da = d.toString();
            var timeZone = da.split('(');
            timeZone = timeZone[1].slice(0, -1);

            var formattedDateArray = {};
            formattedDateArray["formattedTime"] = formattedTime;
            formattedDateArray["formattedDate"] = formattedDate;
            formattedDateArray["formattedTimezone"] = timeZone;
            formattedDateArray["formattedDateTime"] = formattedDate + " " + formattedTime;

            return formattedDateArray;
        }

        function searchRequisitions() {
            $scope.requisitions = [];
            var reqArray = [];

            for (var key in $scope.applications) {
                reqArray.push($scope.applications[key].requisitionId);
            }

            if (reqArray.length > 0) {
                privateRequisition.getRequisitionsFromList(reqArray).$promise.then(function (results) {
                    $scope.requisitions = normalizeObjects(results);

                    for (var index in $scope.requisitions) {
                        for (var innerIndex in $scope.applications) {
                            if ($scope.requisitions[index].requisitionId === $scope.applications[innerIndex].requisitionId) {
                                $scope.applications[innerIndex].title = $scope.requisitions[index].title;
                                $scope.applications[innerIndex].reqStatus = $scope.requisitions[index].status.toLowerCase();
                            }
                        }
                    }

                    // TODO: This is a PLACEHOLDER, I'm appending fake activity actions for now
                    //$scope.activity = angular.copy($scope.applyHistoryTable);
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });
            }

            if (DASHBOARD_TABS.indexOf('offers') > -1) {
                getOffers();
            }
            else {
                $scope.loading = false;
            }
            jQuery('.loading-container').css('display', 'none');
        }

        $scope.getAppById = function (id) {
            for (var i = 0, len = $scope.applications.length; i < len; i++) {
                if ($scope.applications[i].applicationId === id) {
                    return $scope.applications[i];
                }
            }
            return {};
        };


        function getLists() {
            if ($scope.activatePreferences) {
                ListService.loadListNames($scope.lists, ['education', 'category', 'jobtitles', 'locations']);
            }
            else {
                ListService.loadListNames($scope.lists, ['education', 'category']);
            }
        }

        function getOffers() {
            $scope.offerData = {};
            $scope.offers = [];
            $scope.offerData.newOffers = 0;
            $scope.offerData.activeOffer = $routeParams.offerId || null;
            $scope.offerData.showOfferAccepted = false;
            $scope.offerData.declineOfferCOnfirmation = false;
            $scope.offerData.esigMatches = false;

            $scope.offerData.checkName = function () {
                $scope.offerData.esigTouched = true;
                var candidateName = jQuery.trim($scope.candidate.firstName + ' ' + $scope.candidate.lastName);
                var formName = jQuery.trim($scope.offerData.esignature);

                // If you're wondering why I'm doing it this way instead of $setValidity, it's because the form is in an
                // ng-if, which changes its scope and doesn't know this form exists. Need to use an object like offerData instead.
                if (candidateName.toLowerCase() === formName.toLowerCase()) {
                    $scope.offerData.esigMatches = true;
                }
                else {
                    $scope.offerData.esigMatches = false;
                }
            };

            var appArray = [];

            for (var key in $scope.applications) {
                appArray.push($scope.applications[key].applicationId);
            }

            if (appArray.length > 0) {
                privateOffer.getOffersByApplicationIds(appArray).$promise.then(function (results) {
                    $scope.offers = normalizeObjects(results);
                    $scope.offers = $filter('orderBy')($scope.offers, 'created', true);

                    var filteredOffers = [];
                    for (var i = 0, len = $scope.offers.length; i < len; i++) {
                        $scope.offers[i].status = $scope.offers[i].status.toLowerCase();
                        if ($scope.offers[i].status === 'offer') {
                            $scope.offers[i].status = 'approve';
                        }
                        switch ($scope.offers[i].status) {
                            case 'approve':
                            case 'offer':
                                $scope.offerData.newOffers++;
                            case 'accept':
                            case 'reject':
                                filteredOffers.push($scope.offers[i]);
                                break;
                        }
                    }

                    // If you're wondering why I'm doing this instead of ng-repeat | orderBy: -created
                    // Some functions require an index on the offers array, let's switch one or the other.
                    $scope.offers.sort(function (a, b) {
                        if (a.created < b.created) {
                            return -1;
                        }
                        else if (a.created > b.created) {
                            return 1;
                        }
                        return 0;
                    });

                    $scope.offers = filteredOffers;

                    $scope.$watch('offers', refreshOfferCount);

                    /*if (DASHBOARD_TABS.indexOf('assessments') > -1) {
                        getAssessments();
                    }
                    else {
                        $scope.loading = false;
                    }*/
                    jQuery('.loading-container').css('display', 'none');
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });
            }
        }

        function refreshOfferCount() {
            $scope.offerData.newOffers = 0;
            for (var i = 0, len = $scope.offers.length; i < len; i++) {
                switch ($scope.offers[i].status) {
                    case 'approve':
                    case 'offer':
                        $scope.offerData.newOffers++;
                }
            }
        }

        $scope.getOfferStatus = function (offer) {
            var status = offer.status.toLowerCase();
            if (status === 'reject') {
                return 'Declined';
            }
            if (status === 'cancel') {
                return 'Cancelled';
            }
            if (status === 'accept') {
                return '<b class="status-accepted">Accepted!</b>';
            }
            return 'Unaccepted';
        };

        $scope.goToOffer = function (offerId, $event) {
            $scope.activeOffer = offerId;

            $scope.offerData.showOfferAccepted = false;
            $scope.offerData.offerConfirmation = false;
            $scope.offerData.declineOfferCOnfirmation = false;
            $scope.offerData.activeOffer = offerId;

            $location.path('/profile/offers/' + offerId + '/', false);
        };

        $scope.printOffer = function (index) {
            /* CODE FOR PRINTING A DIV, SWITCHING TO IFRAME

             var currOffer = $scope.offers[index];
             var title = $scope.getAppById(currOffer.applicationId).title;
             var mywindow = window.open('', 'PRINT', 'height=600,width=800');

             mywindow.document.write('<html><head><title>' + document.title  + '</title>');
             mywindow.document.write('</head><body >');
             mywindow.document.write('<h1>' + title  + '</h1>');
             mywindow.document.write(document.getElementById('offer-letter').innerHTML);
             mywindow.document.write('</body></html>');

             mywindow.document.close(); // necessary for IE >= 10
             mywindow.focus(); // necessary for IE >= 10

             mywindow.print();
             mywindow.close();
             */

            window.frames['offer-letter'].focus();
            window.frames['offer-letter'].print();

            return true;
        };

        $scope.closeOffer = function ($event) {
            $scope.activeOffer = null;
            $scope.showOfferAccepted = false;

            $scope.offerData.activeOffer = null;
            $scope.offerData.showOfferAccepted = false;

            $location.path('/profile/offers/', false);
        };

        function getAssessments() {
            privateCandidate.getCandidateCustomAssessments({candidateId: $scope.candidate.candidateId}).$promise.then(
                function (results) {
                    $scope.assessments = normalizeObjects(results);
                    $scope.loading = false;
                    jQuery('.loading-container').css('display', 'none');
                    checkInProcessAssessments();
                },
                function (reason) {
                    logger.error(reason);
                    $scope.loading = false;
                    jQuery('.loading-container').css('display', 'none');
                });
        }

        function checkInProcessAssessments(specificAssessment) {
            for (var i = 0, len = $scope.assessments.length; i < len; i++) {
                if ((!specificAssessment && $scope.assessments[i].testStatus === 'inprocess') ||
                    (specificAssessment && $scope.assessments[i].assessmentId === specificAssessment)) {

                    $scope.assessments[i].checking = true;
                    // Self-calling function is for closure
                    (function (i) {
                        privateCandidate.getAssessmentScores({assessmentId: $scope.assessments[i].assessmentId}).$promise.then(
                            function (result) {

                                //this is a temporary fix as the API call getAssessmentScores is not providing the name of the assessment
                                //we are forced to copy the previous name and replace it in the model object!!
                                var assessmentName = $scope.assessments[i].vendorPositionCode;
                                $scope.assessments[i] = normalizeObjects(result);
                                $scope.assessments[i].vendorPositionCode = assessmentName;
                            },
                            function (reason) {
                                $scope.assessments[i].checking = false;
                            }
                        );
                    })(i);
                }
            }
        }

        $scope.getAssessmentStatus = function (assessment) {
            var status = assessment.testStatus;
            if (status === 'invited')
                return 'Not Started';
            else if (status === 'inprocess')
                return 'Incomplete';

            return 'Completed';
        };

        var assessmentWindow, assessmentInterval;
        $scope.startAssessment = function (assessment) {
            if (!assessment.url) {
                assessmentWindow = window.open('', 'assessmentWindow');

                // Have to use $http because $resource is trying to automatically parse a string to json
                $http({
                    url              : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/' + clientName + '/start/' + assessment.assessmentId,
                    method           : 'POST',
                    transformResponse: [],
                    data             : {}
                }).then(
                    function (response) {
                        assessment.url = response.data;
                        assessment.testStatus = 'inprocess';
                        _.map($scope.assessments, function (obj) {
                            if (obj.assessmentId === assessment.assessmentId) {
                                return assessment;
                            }
                            return obj;
                        });
                        $scope.startAssessment(assessment);
                    },
                    function (response) {
                        logger.error(response);
                        $scope.loading = false;
                        jQuery('.loading-container').css('display', 'none');
                    }
                );
            }
            else {
                if (assessmentWindow && assessmentWindow.closed !== true) {
                    assessmentWindow.location.href = assessment.url;
                }
                else {
                    assessmentWindow = window.open(assessment.url, 'assessmentWindow');
                }

                // The popup is cross-domain, so we'll have to poll the window to see if it's been closed
                assessmentInterval = setInterval(function () {
                    if (assessmentWindow === null || assessmentWindow.closed) {
                        logger.log(assessmentWindow);
                        logger.log('Assessment window closed, checking status');
                        clearInterval(assessmentInterval);
                        assessmentInterval = null;
                        assessmentWindow = null;
                        checkInProcessAssessments(assessment.assessmentId);
                    }
                }, 500);
            }
        };

        $scope.socialProfileMergeEngine.overrideBasicInformation = function (candidateModel) {
            try {

                if ($scope.socialProvider.isSocialProfileToMerge === true) {
                    var socialProfile = $scope.socialProvider.getProfile();
                    if (socialProfile !== undefined) {
                        if (socialProfile.firstName.length > 0 && candidateModel.firstName !== socialProfile.firstName) candidateModel.firstName = socialProfile.firstName;
                        if (socialProfile.lastName.length > 0 && candidateModel.lastName !== socialProfile.lastName) candidateModel.lastName = socialProfile.lastName;
                        if (socialProfile.phone !== undefined && socialProfile.phone !== null && socialProfile.phone.length > 0 && socialProfile.phone !== candidateModel.phone1) candidateModel.phone1 = socialProfile.phone;
                        if (socialProfile.zip !== undefined && socialProfile.zip.length > 0 && socialProfile.zip !== candidateModel.zip) candidateModel.zip = socialProfile.zip;
                    }
                }

            } catch (reason) {
                $rootScope.globalErrorHandler(reason);
            }
        };

        $scope.socialProfileMergeEngine.overrideEducationHistory = function (candidateId) {
            try {

                var educationElementsToAdd = [];
                var educationElementsToUpdate = [];
                if ($scope.socialProvider.isSocialProfileToMerge === true) {
                    var socialProfile = $scope.socialProvider.getProfile();
                    if (socialProfile !== undefined) {
                        var socialProfileEducationHistoryCollection = $scope.socialProvider.getEducationHistoryModel(candidateId, educationElementsToAdd);
                        if (angular.isArray(socialProfileEducationHistoryCollection)) {
                            _.each(socialProfileEducationHistoryCollection, function (indexElement) {
                                var actionType = -1;
                                var savedEducationElement = _.findWhere($scope.eduHistoryCollection, {
                                    institution: indexElement.institution,
                                    subject    : indexElement.subject
                                });
                                if (savedEducationElement === undefined) {
                                    actionType = 1;
                                } else {
                                    actionType = 2;
                                }

                                switch (actionType) {
                                    case 1:
                                        educationElementsToAdd.push(indexElement);
                                        break;
                                    case 2:
                                        savedEducationElement.institution = indexElement.institution;
                                        savedEducationElement.completed = indexElement.completed;
                                        savedEducationElement.current = indexElement.current;
                                        if (indexElement.city !== '') {
                                            savedEducationElement.city = indexElement.city;
                                        }
                                        educationElementsToUpdate.push(savedEducationElement);
                                        break;
                                }
                            });
                        }
                    }

                    _.each(educationElementsToAdd, function (education) {
                        privateCandidate.addEducation(education).$promise.then(function (results) {
                        }, function (reason) {
                            $rootScope.globalErrorHandler(reason);
                            hasError(reason, 'Unable to add employment history record!');
                        });
                    });

                    if (educationElementsToAdd.length > 0) {
                        // if a candidate has education record with null
                        var savedEducationElement = _.findWhere($scope.eduHistoryCollection, {institution: null});
                        if (savedEducationElement !== undefined) {
                            var element = {
                                candidateId  : candidateId,
                                institution  : savedEducationElement.school,
                                city         : savedEducationElement.city,
                                subject      : savedEducationElement.subject,
                                levelAttained: savedEducationElement.levelAttained,
                                completed    : savedEducationElement.completed
                            };

                            privateCandidate.deleteEducationHistory({educationId: savedEducationElement.educationId}).$promise.then(function (results) {
                                // in order to change sequence of row
                                privateCandidate.addEducation(element).$promise.then(function (results) {
                                }, function (reason) {
                                    $rootScope.globalErrorHandler(reason);
                                });

                            }, function (reason) {
                                $rootScope.globalErrorHandler(reason);
                            });
                        }

                    }
                    _.each(educationElementsToUpdate, function (education) {
                        privateCandidate.updateEducation(education).$promise.then(function (results) {
                        }, function (reason) {
                            $rootScope.globalErrorHandler(reason);
                            hasError(reason, 'Unable to update employment history record!');
                        });
                    });
                }

            } catch (reason) {
                $rootScope.globalErrorHandler(reason);
            }
        };

        $scope.socialProfileMergeEngine.overrideWorkHistory = function (candidateId) {
            try {

                var workElementsToAdd = [];
                var workElementsToUpdate = [];

                if ($scope.socialProvider.isSocialProfileToMerge === true) {
                    var socialProfile = $scope.socialProvider.getProfile();
                    if (socialProfile !== undefined) {
                        var currentCompanyHandled = false;
                        var ruleEngine = {
                            fetchIsCurrentField: true
                        };
                        var socialProfileWorkHistoryCollection = $scope.socialProvider.getWorkHistoryModel(candidateId, workElementsToAdd, ruleEngine);
                        if (angular.isArray(socialProfileWorkHistoryCollection)) {
                            _.each(socialProfileWorkHistoryCollection, function (indexElement) {

                                var actionType = -1;
                                var savedWorkElement = _.findWhere($scope.workHistoryCollection, {
                                    company: indexElement.workElement.company,
                                    title  : indexElement.workElement.title
                                });
                                if (indexElement.isCurrent === true) {
                                    if (currentCompanyHandled === false && savedWorkElement === undefined) {
                                        // if a candidate from join form
                                        savedWorkElement = _.findWhere($scope.workHistoryCollection, {company: null});
                                    }
                                    currentCompanyHandled = true;
                                }

                                if (savedWorkElement !== undefined) {
                                    actionType = 2;
                                } else {
                                    actionType = 1;
                                }

                                switch (actionType) {
                                    case 1:
                                        workElementsToAdd.push(indexElement.workElement);
                                        break;
                                    case 2:
                                        savedWorkElement.company = indexElement.workElement.company;
                                        savedWorkElement.title = indexElement.workElement.title;
                                        if (indexElement.workElement.description !== '') {
                                            savedWorkElement.description = indexElement.workElement.description;
                                        }
                                        workElementsToUpdate.push(savedWorkElement);
                                        break;
                                }
                            });
                        }
                    }

                    _.each(workElementsToAdd, function (work) {
                        privateCandidate.addWorkHistory(work).$promise.then(function (results) {
                        }, function (reason) {
                            logger.error(reason);
                            hasError(reason, 'Unable to add employment history record!');
                        });
                    });

                    _.each(workElementsToUpdate, function (work) {
                        privateCandidate.updateWorkHistory(work).$promise.then(function (results) {
                        }, function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });
                    });
                }

            } catch (reason) {
                $rootScope.globalErrorHandler(reason);
            }
        };

        $scope.socialProfileMergeEngine.clearMergeState = function () {
            try {
                var response = $scope.socialProvider.utility.clearMergeProfileCache();
                if (response.isSuccess === true) {
                    $scope.socialProfileMergeEngine.showMergeDialog = $scope.socialProvider.isSocialProfileToMerge;
                    response = $scope.socialProvider.utility.getRedirectDirectionFromStorage();
                    $scope.socialProvider.utility.clearMergeProfileCache(true);
                    if (response.isSuccess === true && response.caller !== undefined && response.caller === 'apply') {
                        $location.url(response.callBack);
                    }
                }
            } catch (reason) {
                logger.error(reason);
            }
        };

        function buildExecutionEngine() {
            $scope.preferencesPreConditions = function () {

                // if ($scope.takeReverseCase) {
                //     if ($scope.communicationSubscriptions.unsubscribeCheck === 't') {
                //         $scope.communicationSubscriptions.unsubscribeCheck = 'f';
                //     } else if ($scope.communicationSubscriptions.unsubscribeCheck === 'f') {
                //         $scope.communicationSubscriptions.unsubscribeCheck = 't';
                //     }
                // }
                // _communicationSubscriptions_Modified = false;
                // if ($scope.communicationSubscriptions.unsubscribeCheck === 't' || $scope.communicationSubscriptions.unsubscribeCheck === 'f') {
                //     _communicationSubscriptions_Modified = true;
                //     confirmation = confirm("Are you sure you want to update preferences?");
                // }
                try {
                    $scope.editCandidate.preferences = angular.toJson($scope.preferencesNonJSON);
                } catch (reason) {
                }
            };
            $scope.preferencesPostConditions = function () {

                try {

                    if ($scope.editCandidate.preferences === undefined || $scope.editCandidate.preferences === null) {
                        $scope.preferencesNonJSON = {
                            location: []
                        };
                    } else {
                        $scope.preferencesNonJSON = angular.fromJson($scope.editCandidate.preferences);
                    }
                    putCandidateSubscription();
                }
                catch (reason) {
                    $scope.preferencesNonJSON = {};
                }
            };
        }

        function initialLoader() {
            $scope.preferenceNotificationDissmissed = checkPreferenceCookie();
            $scope.preferencesNotSet = candidateActivityViewModelService.checkCandidatePreference($scope.candidate)
            $scope.executionEngineCollection['preferences'].postExecution();
            loadSocialProfileData($scope.candidate.uname);
            getCandidateSubscription($scope.candidate.uname, $scope.candidate.candidateId);
            migrationService.GDPR.migrationWindow.open();
        }

        function workHistoryCollectionObserver() {
            if ($scope.addedWorkHistory.length > 0) {
                $scope.workHistory = $scope.addedWorkHistory[$scope.addedWorkHistory.length - 1];
                $scope.workHistoryCollection = $scope.addedWorkHistory;
            }
        }

        function educationHistoryCollectionObserver() {
            if ($scope.addedEduHistory.length > 0) {
                $scope.eduHistory = $scope.addedEduHistory[$scope.addedEduHistory.length - 1];
                $scope.eduHistoryCollection = $scope.addedEduHistory;
            }
        }

        function loadSocialProfileData(uName) {
            if (authService.isSocialProfileConnection()) {
                // for Merge Activity.
                var response = $scope.socialProvider.utility.loadProfileFromStorage();
                $scope.socialProfileMergeEngine.showMergeDialog = false;
                if (response.isSuccess === true) {
                    var _socialProfile = $scope.socialProvider.getProfile();
                    if ($scope.socialProvider.isSocialProfileToMerge === true) {
                        if (_socialProfile.email === uName) {
                            $scope.socialProfileMergeEngine.provider = _socialProfile.provider;
                        } else {
                            $scope.socialProvider.isSocialProfileToMerge = false
                        }
                        $scope.socialProfileMergeEngine.showMergeDialog = $scope.socialProvider.isSocialProfileToMerge;
                    }
                }
                // for Merge Activity.
                var _socialProfileDefaults = $scope.socialProvider.utility.getProfileDefaultsFromStorage();
                if (_socialProfileDefaults.isSuccess === true && _socialProfileDefaults.photoUrl !== undefined && _socialProfileDefaults.photoUrl.length > 0) {
                    $scope.candidatePhotoUrl = _socialProfileDefaults.photoUrl;
                }
            }
        }

        setTimeout(function () {
            try {
                resetPasswordBackwardCompatibility();
                $scope.isLoggedIn = authService.isLoggedIn;
                if (isRedirectToLoginPage === true) {
                    if (_XC_CONFIG.login_modal.disabled === true) {
                        authService.setLocationPath($location.url());
                        $location.path('/profile/login/');
                        $scope.$apply();
                    } else {
                        var loginConfiguration = {};
                        loginConfiguration.showSocialWidget = true;
                        loginConfiguration.showCreateProfileAction = true;
                        loginConfiguration.reloadWindow = true;
                        authService.openSignInModal(loginConfiguration);
                    }
                } else if (!$scope.tokenInValidation) {
                    // its strict mode
                    if (ApplicationState.localStorage.candidate.isReturningUser.get() === false) {
                        $rootScope.showAccount = false;
                    }
                }
            } catch (reason) {
                logger.error(reason);
            }
        }, 50);

        $scope.$on('authenticated', function () {
            $scope.isLoggedIn = authService.isLoggedIn;
        });

        $scope.$on('authenticatedReload', function () {
            $scope.isLoggedIn = authService.isLoggedIn;
        });

        $scope.$on('loggedOut', function () {
            $scope.currentUser = null;
            $scope.isLoggedIn = false;
        });
    }

    accountModule.directive('loadOfferLetter', function () {
        return {
            restrict: 'A',
            scope   : {
                offer: "=loadOfferLetter"
            },
            link    : function (scope, el, attr) {
                var iframe = el[0];
                iframe.contentWindow.document.open();
                var $html = jQuery('<div />', {html: scope.offer.offerContent});
                // console.log($html);
                $html.find('a').prop('target', '_blank');
                if (jQuery(scope.offer.offerContent).find('html')) {
                    iframe.contentWindow.document.write($html.html());
                }
                else {
                    iframe.contentWindow.document.body.write($html.html());
                }
                iframe.contentWindow.document.close();
            }
        };
    });

})();
