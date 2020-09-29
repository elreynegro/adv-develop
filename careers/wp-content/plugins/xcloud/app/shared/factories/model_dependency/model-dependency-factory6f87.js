/**
 * Created by TDadam on 6/12/2017.
 */
(function () {
    /*'use strict';*/

    angular
        .module('st.model.dependency')
        .factory('ModelDependencyFactory', ModelDependencyFactory);


    ModelDependencyFactory.$inject = ['$q', '$log', '$rootScope', '$location', '$timeout', '$filter', 'candidate', 'ListService', '$sce', 'LinkedList', 'LocalStorage', 'requisition', 'privateFolder', 'publicFolder', 'titleCaseFilter', 'ApplicationState', 'CandidateWorkFlow', 'communicationTemplateService', 'leadcaptureModalService', 'privateCandidate'];

    function ModelDependencyFactory($q, $log, $rootScope, $location, $timeout, $filter, candidate, ListService, $sce, LinkedList, LocalStorage, requisition, privateFolder, publicFolder, titleCaseFilter, ApplicationState, CandidateWorkFlow, communicationTemplateService, leadcaptureModalService, privateCandidate) {


        // Initialise
        var logger = $log.getInstance(MODULE_NAME_UTILS_GLOBAL_STATE);
        var service = {};

        constructFieldValidationLibrary(service, logger);
        communicationTemplateService.setResetPasswordLink();
        constructSocialLoginService(service, logger, $location, candidate, LocalStorage, titleCaseFilter, ApplicationState, $timeout);
        constructCandidateModelHelperService(service, candidate, logger, $filter, requisition, publicFolder, $q);
        constructInterpolationService(service, logger, ListService, $q, $timeout, $sce, leadcaptureModalService, $location);
        constructAngularSchemaObserverService(service, logger, $q, $timeout, candidate, LinkedList, CandidateWorkFlow, ApplicationState, $rootScope, privateCandidate);
        return service;
    }

    function constructFieldValidationLibrary(service, logger) {
        var fieldValidator = {};

        fieldValidator.isDirtyValid = false;
        fieldValidator.isDirtyValidation = function (field) {
            fieldValidator.isDirtyValid = (typeof (field.$modelValue) !== "undefined" && field.$modelValue.length > 0);
            return ((field.$touched || this.isDirtyValid) && field.$valid);
        };

        fieldValidator.isDirtyInValidation = function (field) {
            fieldValidator.isDirtyValid = (typeof (field.$modelValue) !== "undefined" && field.$modelValue.length > 0);
            return ((field.$touched || this.isDirtyValid) && field.$invalid);
        };

        fieldValidator.reset = function () {
            this.isDirtyValid = false;
        };
        service.fieldValidator = fieldValidator;
    }

    function constructSocialLoginService(service, logger, $location, candidate, LocalStorage, titleCaseFilter, ApplicationState, $timeout) {
        service.socialProvider = {};
        service.genericPopulate = {};
        service.socialProvider.utility = {};
        service.socialProvider.titleCaseFilter = titleCaseFilter;

        service.socialProvider.enabledProviders = GIGYA_SOCIAL_SETTINGS.providers;
        service.socialProvider.registrationSource = {
            talentCommunitySocialProfile: 'socialprofile-join',
            applySocialProfile          : 'socialprofile-apply',
            signInSocialProfile         : 'socialprofile-signin'
        };
        service.socialProvider.KeysConfiguration = {
            localStorageSocialMergedProfile: 'socialMergedProfile',
            localStorageRedirectKey        : 'socialProfileRedirect',
            socialStorageKey               : "socialProfileStorage",
            sessionStorageKey              : "socialProfileSession",
            storageDataMap                 : [
                {
                    modelKey: "photoUrl"

                },
                {
                    modelKey: "uname"
                }
            ],
            HTMLDefinition                 : {
                mainContainerId     : 'socialSiteProvider',
                mainContainerLoginId: 'socialLoginProvider'
            }
        };
        service.socialProvider.notificationMessage = '';
        service.socialProvider.notificationEngine = {
            registrationFail          : 'Registration Failure: Something went wrong and we could not register with your social profile. Please try again later.',
            loginFail                 : 'Login Failure: Something went wrong and we failed to connect to your social network. Please try again later.',
            unSupportedActivity       : 'Unsupported Activity.',
            multipleAccountRestriction: '',
            deactivatedMessage        : XCLOUD.i18n("Sorry, this account has been deleted at the user's request.", "validation"),
            generalException          : 'General Exception: Something went wrong while trying to access your social profile. Please try again later.',
            mergeIntermediateMessage  : function () {
                return '<span> We see that you have an existing account. This account has been connected with your ' + service.socialProvider.titleCaseFilter(service.socialProvider.getProfile().provider) + ' profile. Please login with your ' + service.socialProvider.titleCaseFilter(service.socialProvider.getProfile().provider) + ' profile to access your account. </span>';
            }
        };
        service.socialProvider.TitleEnum = {
            connectTitle: XCLOUD.i18n("Quickly login with your social network.", "text"),
            joinTitle   : XCLOUD.i18n("Quickly join with your social network.", "text")
        };
        service.socialProvider.showWizard = GIGYA_SOCIAL_SETTINGS.enabled;
        service.socialProvider.candidateExists = candidate.candidateExists;
        service.socialProvider.getSocialUserInfo = candidate.getSocialUserInfo;
        service.socialProvider.isSocialUserRegistration = false;
        service.socialProvider.isOverrideEducationandWorkHistoryCapture = true;
        service.socialProvider.currentBody = undefined;
        service.socialProvider.isSocialProfileToMerge = false;
        service.socialProvider.isGigyaRegistrationSucceeded = true;
        service.socialProvider.isShowNotificaiton = false;
        service.socialProvider.consumerCollection = [];
        service.socialProvider.parserCollection = [];
        service.socialProvider.muteWidget = false;
        try {
            service.socialProvider.jsLoadAwaitCount = 0;
            service.socialProvider.showUIWizard = function (callback, headerText, isResetOverridden) {
                if (isResetOverridden !== true) this.reset();
                if (this.showWizard === true) {
                    try {
                        service.socialProvider.jsLoadAwaitCount++;
                        gigya.socialize.showLoginUI({
                            version          : 2,
                            containerID      : "socialLoginProvider", cid: '', width: 300, height: 60,
                            showTermsLink    : false, // remove 'Terms' link
                            hideGigyaLink    : true,  // hide gigya link
                            buttonsStyle     : 'fullLogoColored',
                            enabledProviders : this.enabledProviders,
                            sessionExpiration: 0,
                            headerText       : headerText ? headerText : '',
                            authCodeOnly     : true
                        });
                        gigya.socialize.addEventHandlers({
                            onLogin: callback
                        });
                        service.socialProvider.jsLoadAwaitCount = 0;
                    } catch (reason) {
                        // 3 seconds are allowed for slower network
                        if (service.socialProvider.jsLoadAwaitCount < 12) {
                            $timeout(function (_callback, _headerText, _isResetOverridden) {
                                service.socialProvider.showUIWizard(_callback, _headerText, _isResetOverridden);
                            }, 250, callback, headerText, isResetOverridden);
                        }
                    }
                }
            }
        } catch (reason) {
            logger.warn("SocailLogin:An issue has occurred while Gigya Provider Loading!");
            logger.error(reason);
        }

        service.socialProvider.resolveAreaOfInterest = function (inputValue) {
            return inputValue
        };

        service.socialProvider.userInfoResponse = function (gigyaData) {
            try {
                gigyaData.status = 'OK';
                if (gigyaData.status !== undefined && gigyaData.status === 'OK') {
                    var _profile = JSON.parse(gigyaData.userInfo);
                    window.localStorage.setItem('socialUser', _profile.email);
                    service.socialProvider.profile.bearerAccessToken = gigyaData.accessToken;
                    service.socialProvider.profile.deactivCheck = gigyaData.deactivCheck;
                    service.socialProvider.profile.provider = _profile.loginProvider;
                    service.socialProvider.profile.uid = _profile.UID;
                    service.socialProvider.profile.lastName = _profile.lastName;
                    service.socialProvider.profile.gender = _profile.gender;
                    service.socialProvider.profile.email = _profile.email;
                    service.socialProvider.profile.firstName = _profile.firstName;
                    service.socialProvider.profile.zip = _profile.zip;
                    service.socialProvider.profile.isSiteUidRegistered = _profile.isSiteUID;
                    service.socialProvider.profile.state = _profile.state;
                    service.socialProvider.profile.country = _profile.country;
                    service.socialProvider.profile.photoUrl = _profile.photoURL;
                    service.socialProvider.profile.thumbnailUrl = _profile.thumbnailURL;
                    if (service.socialProvider.profile.photoUrl === null || service.socialProvider.profile.photoUrl === undefined || service.socialProvider.profile.photoUrl.length === 0) {
                        service.socialProvider.profile.photoUrl = service.socialProvider.profile.thumbnailUrl;
                    }
                    service.socialProvider.profile.workHistory = _profile.work;
                    service.socialProvider.profile.educationHistory = _profile.education;
                    service.socialProvider.profile.phone = (_profile.phones !== undefined && _profile.phones.length > 0) ? _profile.phones[0].number : null;
                    service.socialProvider.profile.industry = service.socialProvider.resolveAreaOfInterest(_profile.industry);
                    service.socialProvider.profile.redirectType = 'none';
                    if (angular.isArray(service.socialProvider.profile.workHistory)) {
                        var titleElement = _.findWhere(service.socialProvider.profile.workHistory, {isCurrent: true});
                        if (titleElement !== undefined) {
                            service.socialProvider.profile.currentTitle = titleElement.title;
                        }
                    }
                    service.socialProvider.notificationEngine.multipleAccountRestriction = 'We identified that you had an existing social profile linked with us,Please use linked social network or site credentials to login.';

                    angular.forEach(service.socialProvider.parserCollection, function (parser) {
                        parser(service.socialProvider.profile);
                    });

                } else {
                    logger.log('Insufficient social response supplied.');
                }
                service.socialProvider.resolveCandidateLoginIdentity();
            } catch (reason) {
                service.socialProvider.profile = service.socialProvider.profileBaseModel();
                logger.error(reason);
                service.socialProvider.internalError();
                jQuery('.loading-container-instance').css('display', 'none');
                jQuery('#modal-Loader').css('display', 'none');
            }
        };

        service.socialProvider.bindProfile = function (newCandidateHandlerCaller, returningCandidateHandlerCaller, gigyaLoginResponse) {
            this.newCandidateHandlerCaller = newCandidateHandlerCaller;
            this.returningCandidateHandlerCaller = returningCandidateHandlerCaller;
            this.isGigyaRegistrationSucceeded = true;
            service.socialProvider.isShowNotificaiton = false;
            var bodyObject = {
                code       : gigyaLoginResponse.authCode,
                redirectUri: window.location.origin + '/profile/'
            };
            this.currentBody = bodyObject;
            this.fetchUserInfo(bodyObject, this.userInfoResponse);
        };

        service.socialProvider.profileBaseModel = function () {
            return {
                bearerAccessToken  : undefined,
                country            : '',
                currentTitle       : '',
                educationHistory   : [],
                email              : '',
                emailExists        : false,
                firstName          : '',
                gender             : '',
                industry           : '',
                isSiteUidRegistered: false,
                isUserRegistered   : false,
                lastName           : '',
                phone              : '',
                photoURL           : '',
                provider           : '',
                redirectType       : 'none',
                uid                : '',
                workHistory        : [],
                zip                : ''
            };
        };

        service.socialProvider.getProfile = function () {
            return this.profile;
        };

        service.socialProvider.setRegistrationCaller = function (flag) {
            service.socialProvider.isSocialUserRegistration = false;
            service.socialProvider.isOverrideEducationandWorkHistoryCapture = true;
            switch (flag) {
                case service.socialProvider.registrationSource.applySocialProfile:
                    service.socialProvider.isSocialUserRegistration = true;
                    service.socialProvider.isOverrideEducationandWorkHistoryCapture = true;
                    break;
                case service.socialProvider.registrationSource.talentCommunitySocialProfile:
                    service.socialProvider.isSocialUserRegistration = true;
                    service.socialProvider.isOverrideEducationandWorkHistoryCapture = false;
                    break;
                case service.socialProvider.registrationSource.signInSocialProfile:
                    service.socialProvider.isSocialUserRegistration = true;
                    service.socialProvider.isOverrideEducationandWorkHistoryCapture = false;
                    break;
            }
            this.profile.redirectType = flag;
        };

        service.socialProvider.registerConsumer = function (consumer) {
            if (this.parserCollection.length === 0) {
                this.parserCollection.push(service.socialProvider.candidateParser);
                this.parserCollection.push(service.socialProvider.educationParser);
                this.parserCollection.push(service.socialProvider.workHistoryParser);
            }
            this.consumerCollection.push(consumer);
        };

        service.socialProvider.reset = function () {
            this.profile = this.profileBaseModel();
            this.consumerCollection = [];
        };

        service.socialProvider.notifyConsumer = function (input) {
            angular.forEach(this.consumerCollection, function (consumer) {
                consumer(input);
            });
        };

        service.genericPopulate.notifyConsumer = function (input) {
            angular.forEach(this.consumerCollection, function (consumer) {
                consumer(input);
            });
        };

        service.socialProvider.disConnectSocialConnection = function () {
            this.reset();
            this.isSocialUserRegistration = false;
            this.isOverrideEducationandWorkHistoryCapture = true;

        };

        service.socialProvider.resolveCandidateLoginIdentity = function () {
            var socialProfile = this.getProfile();
            if (this.profile.email !== null && this.profile.email !== undefined &&
                this.profile.bearerAccessToken !== null && this.profile.bearerAccessToken !== undefined && this.profile.bearerAccessToken.length > 0) {
                service.socialProvider.returningCandidateHandler(socialProfile);
            } else {
                if (this.profile.deactivCheck === 't') {
                    //service.socialProvider.newCandidateHandler(socialProfile);
                    //TODO : GDPR User story pending
                    jQuery('.loading-container').css('display', 'none');
                    jQuery('.loading-container-instance').css('display', 'none');
                    jQuery('#modal-Loader').css('display', 'none');
                    this.showNotificationToggle(true, service.socialProvider.notificationEngine.deactivatedMessage);
                } else {
                    this.candidateExists({username: this.profile.email, clientName: clientName}).$promise.then(
                        function (result) {
                            service.socialProvider.newCandidateHandler(socialProfile);
                        }, function (reason) {
                            service.socialProvider.returningCandidateHandler(socialProfile)
                        });
                }
            }
        };

        service.socialProvider.resetEventListeners = function () {
            if (this.existingSocialProfileHandler !== undefined) {
                this.existingSocialProfileHandler = undefined;
            }
            if (this.newSocialProfileHandler !== undefined) {
                this.newSocialProfileHandler = undefined;
            }
        };

        service.socialProvider.newCandidateHandler = function (socialProfile) {
            try {
                if (this.newCandidateHandlerCaller !== undefined) {
                    this.newCandidateHandlerCaller(socialProfile);
                }
                this.resetEventListeners();
                jQuery('.loading-container-instance').css('display', 'none');
                jQuery('#modal-Loader').css('display', 'none');
            } catch (reason) {
                console.log(reason);
                jQuery('.loading-container').css('display', 'none');
                jQuery('.loading-container-instance').css('display', 'none');
                jQuery('#modal-Loader').css('display', 'none');
            }
        };

        service.socialProvider.returningCandidateHandler = function (socialProfile) {
            try {
                this.profile.emailExists = true;
                if (this.returningCandidateHandlerCaller !== undefined) {
                    this.returningCandidateHandlerCaller(socialProfile);
                }
                this.resetEventListeners();
                jQuery('.loading-container-instance').css('display', 'none');
                jQuery('#modal-Loader').css('display', 'none');
            } catch (reason) {
                jQuery('.loading-container').css('display', 'none');
                jQuery('.loading-container-instance').css('display', 'none');
                jQuery('#modal-Loader').css('display', 'none');
            }
        };

        service.socialProvider.getWorkHistoryModel = function (candidateId, callerDefaultHistory, ruleEngine) {
            var profile = service.socialProvider.getProfile();
            var workHistoryModel = [];
            if (profile !== null && profile !== undefined) {
                if (angular.isArray(profile.workHistory)) {
                    _.each(profile.workHistory, function (work) {
                        if (work.company !== null && work.company !== undefined) {
                            if (work.title === null || work.title === undefined) {
                                work.title = '';
                            }
                            var workElement = {
                                candidateId: candidateId,
                                company    : work.company,
                                current    : (work.isCurrent === true) ? 't' : 'f',
                                description: '',
                                title      : work.title
                            };
                            var responseElement = workElement;
                            if (ruleEngine !== undefined) {
                                if (ruleEngine.fetchIsCurrentField !== undefined && ruleEngine.fetchIsCurrentField === true) {
                                    responseElement = {
                                        isCurrent  : work.isCurrent,
                                        workElement: workElement
                                    };
                                }
                            }
                            workHistoryModel.push(responseElement);

                        } else {
                            logger.log('command: workhistory record is skipped due to employer un available');
                        }
                    });
                } else {
                    return callerDefaultHistory;
                }
            }
            return workHistoryModel;
        };

        service.socialProvider.getEducationHistoryModel = function (candidateId, callerDefaultHistory) {
            var profile = service.socialProvider.getProfile();
            var educationModel = [];

            if (profile !== null && profile !== undefined) {
                if (angular.isArray(profile.educationHistory)) {
                    _.each(profile.educationHistory, function (education) {
                        if (education.degree !== null && education.degree !== undefined) {

                            if (education.school === null && education.school === undefined) {
                                education.school = '';
                            }
                            if (education.endYear !== null && education.endYear !== undefined && education.endYear !== 0) {
                                education.completed = 't';
                            } else {
                                education.completed = 'f';
                            }
                            education.address = {};
                            education.address.city = '';
                            var ed = {
                                'candidateId'  : candidateId,
                                'city'         : education.address.city,
                                'completed'    : education.completed,
                                'institution'  : education.school,
                                'levelAttained': education.degree,
                                'subject'      : education.degree
                            };
                            educationModel.push(ed);

                        } else {
                            logger.log('command: eduhistory record is skipped due to degree un available');
                        }
                    });
                } else {
                    return callerDefaultHistory;
                }
            }
            return educationModel;
        };

        service.socialProvider.setProfile = function (socialProfile) {
            this.profile = socialProfile;
        };

        service.socialProvider.showNotificationToggle = function (toggleState, message) {
            this.isShowNotificaiton = toggleState;
            this.notificationMessage = message;
        };

        service.socialProvider.internalError = function () {
            jQuery('.loading-container').css('display', 'none');
            this.showNotificationToggle(true, service.socialProvider.notificationEngine.generalException);
        };

        service.socialProvider.fetchUserInfo = function (bodyObject, successCallback) {
            this.getSocialUserInfo(bodyObject).$promise.then(
                function (result) {
                    successCallback(result);
                }, function (reason) {
                    service.socialProvider.internalError();
                });

        };

        // TODO: until GIGYA provide tab index feature
        service.socialProvider.utility.setTabIndex = function () {
            try {
                var element = jQuery('#socialLoginProvider_uiContainer > div.gigya-login-providers > table > tbody > tr > td > div > div > div > span:nth-child(1) > button');
                if (element.length === undefined || element.length === 0) {
                    return false;
                }
                element.attr('tabindex', 0);
                jQuery('#socialLoginProvider_uiContainer > div.gigya-login-providers > table > tbody > tr > td > div > div > div > span:nth-child(2) > button').attr('tabindex', 0);
                jQuery('#socialLoginProvider_uiContainer > div.gigya-login-providers > table > tbody > tr > td > div > div > div > span:nth-child(3) > button').attr('tabindex', 0);
                return true;
            } catch (reason) {

            }
        };

        service.socialProvider.utility.sessionToStorage = function (externalState) {
            externalState = externalState || {};
            try {
                var storageModel = {profile: service.socialProvider.getProfile(), externalState: externalState};
                ApplicationState.session.candidate.socialLoginSession.set(storageModel);

            } catch (reason) {
                logger.error(reason);
            }
        };

        service.socialProvider.utility.sessionFromStorage = function () {
            var response = {
                isSuccess: false
            };
            try {
                var value = ApplicationState.session.candidate.socialLoginSession.get();
                if (value !== null && value !== undefined) {
                    response = value;
                    response.isSuccess = true;
                }
                return response;
            } catch (reason) {
                logger.error(reason);
                return response;
            }
        };

        service.socialProvider.utility.deleteFromStorage = function () {
            ApplicationState.session.candidate.socialLoginSession.remove();
        };

        service.socialProvider.utility.restoreSession = function (session, authService) {
            try {
                if (session && session.profile) {
                    service.socialProvider.profile = service.socialProvider.profile || service.socialProvider.profileBaseModel();
                    angular.extend(service.socialProvider.profile, session.profile);
                    service.socialProvider.setRegistrationCaller(service.socialProvider.profile.redirectType);
                    this.profile = service.socialProvider.profile;
                    angular.forEach(service.socialProvider.parserCollection, function (parser) {
                        parser(service.socialProvider.profile);
                    });
                    if (authService) authService.internalToken = session.externalState.internalToken;
                }
            }
            catch (reason) {
                logger.error(reason);
                return response;
            }
        };

        service.socialProvider.utility.setProfileDefaultsToStorage = function () {
            try {
                var _storage = {};
                var _socialProfile = service.socialProvider.getProfile();
                var _keyConfig = service.socialProvider.KeysConfiguration;
                for (var index = 0; index < _keyConfig.storageDataMap.length; index++) {
                    var modelKey = _keyConfig.storageDataMap[index].modelKey;
                    _storage[modelKey] = _socialProfile[modelKey];
                }
                LocalStorage.set(_keyConfig.socialStorageKey, _storage);
            } catch (reason) {
                logger.error(reason);
            }
        };

        service.socialProvider.utility.getProfileDefaultsFromStorage = function () {
            var response = {
                isSuccess: false
            };
            try {
                var _keyConfig = service.socialProvider.KeysConfiguration;
                var value = LocalStorage.get(_keyConfig.socialStorageKey);
                if (value !== null && value !== undefined && value.$$state.value !== undefined) {
                    response = value.$$state.value;
                    response.isSuccess = true;
                }
                return response;
            } catch (reason) {
                logger.error(reason);
                return response;
            }
        };

        service.socialProvider.utility.loadProfileFromStorage = function () {
            var response = {
                isSuccess: false
            };
            try {
                var _keyConfig = service.socialProvider.KeysConfiguration;
                var _socialProfile = LocalStorage.get(_keyConfig.localStorageSocialMergedProfile);
                if (_socialProfile !== null && _socialProfile !== undefined && _socialProfile.$$state.value !== undefined) {
                    service.socialProvider.setProfile(_socialProfile.$$state.value);
                    service.socialProvider.isSocialProfileToMerge = true;
                    response.isSuccess = true;
                } else {
                    response.isSuccess = false;
                    service.socialProvider.isSocialProfileToMerge = false;
                }
                return response;
            } catch (reason) {
                service.socialProvider.isSocialProfileToMerge = false;
                return response;
            }
        };

        service.socialProvider.utility.clearMergeProfileCache = function (clearStorage) {
            var response = {
                isSuccess: false
            };
            try {
                var _keyConfig = service.socialProvider.KeysConfiguration;
                if (service.socialProvider.isSocialProfileToMerge === true || clearStorage === true) {
                    service.socialProvider.isSocialProfileToMerge = false;
                    response.isSuccess = true;
                    if (clearStorage === true) {
                        LocalStorage.remove(_keyConfig.localStorageSocialMergedProfile);
                    }
                }
                return response;
            } catch (reason) {
                return response;
            }
        };

        service.socialProvider.utility.getRedirectDirectionFromStorage = function () {
            var response = {
                isSuccess: false
            };
            try {
                var _keyConfig = service.socialProvider.KeysConfiguration;
                var redirectHandler = LocalStorage.get(_keyConfig.localStorageRedirectKey);
                if (redirectHandler !== null && redirectHandler !== undefined && redirectHandler.$$state.value !== undefined) {
                    redirectHandler = redirectHandler.$$state.value;
                    response.isSuccess = true;
                    response.callBack = redirectHandler.callBack;
                    response.action = redirectHandler.action;
                    response.path = redirectHandler.path;
                    response.caller = redirectHandler.caller;
                    response.isSuccess = true;
                }
                return response;
            } catch (reason) {
                return response;
            }
        };

        service.socialProvider.utility.setRedirectDirectionToStorage = function (redirectDirection) {
            var response = {
                isSuccess: false
            };
            try {
                var _keyConfig = service.socialProvider.KeysConfiguration;
                LocalStorage.set(_keyConfig.localStorageRedirectKey, redirectDirection);
                response.isSuccess = true;
            } catch (reason) {
                return response;
            }
        };

        service.socialProvider.utility.removeRedirectDirectionInStorage = function () {
            var response = {
                isSuccess: false
            };
            try {
                var _keyConfig = service.socialProvider.KeysConfiguration;
                LocalStorage.remove(_keyConfig.localStorageRedirectKey);
                response.isSuccess = true;
            } catch (reason) {
                return response;
            }
        };


        //<editor-fold desc="Social site user data parsers">
        service.socialProvider.candidateParser = function (profile) {
            try {
                var returnProfile = {};
                if (profile !== undefined) {
                    returnProfile.uname = profile.email;
                    returnProfile.firstName = profile.firstName;
                    returnProfile.lastName = profile.lastName;
                    returnProfile.phone1 = profile.phone;
                    returnProfile.zip = profile.zip;
                }
                var input = {
                    data    : returnProfile,
                    identity: "socialSite",
                    key     : "candidate"
                };
                service.socialProvider.notifyConsumer(input);
            } catch (reason) {
                jQuery('.loading-container').css('display', 'none');
            }
        };

        service.socialProvider.educationParser = function (profile) {
            var educationCollection = [];
            if (profile !== null && profile !== undefined) {
                if (angular.isArray(profile.educationHistory)) {
                    angular.forEach(profile.educationHistory, function (education) {
                        if (education.degree !== null && education.degree !== undefined) {

                            if (education.school === null && education.school === undefined) {
                                education.school = '';
                            }
                            if (education.endYear !== null && education.endYear !== undefined && education.endYear !== 0) {
                                education.completed = 't';
                            } else {
                                education.completed = 'f';
                            }
                            education.address = {};
                            education.address.city = '';
                            var ed = {
                                'city'         : education.address.city,
                                'completed'    : education.completed,
                                'institution'  : education.school,
                                'levelAttained': education.degree,
                                'subject'      : education.degree
                            };
                            educationCollection.push(ed);
                        } else {
                            logger.log('command: eduhistory record is skipped due to degree un available');
                        }
                    });
                    var input = {
                        key       : "education"
                        , data    : educationCollection
                        , identity: "socialSite"
                    };
                    service.socialProvider.notifyConsumer(input);
                }
            }
        };

        service.socialProvider.workHistoryParser = function (profile) {
            var employmentCollection = [];
            if (profile !== null && profile !== undefined) {
                if (angular.isArray(profile.workHistory)) {
                    angular.forEach(profile.workHistory, function (work) {
                        if (work.company !== null && work.company !== undefined) {
                            if (work.title === null || work.title === undefined) {
                                work.title = '';
                            }

                            var workElement = {
                                company    : work.company,
                                current    : (work.isCurrent === true) ? 't' : 'f',
                                description: '',
                                title      : work.title
                            };

                            employmentCollection.push(workElement);
                        } else {
                            logger.log('command: workhistory record is skipped due to employer un available');
                        }
                    });
                    var input = {
                        data    : employmentCollection,
                        identity: "socialSite",
                        key     : "work_history"
                    };
                    service.socialProvider.notifyConsumer(input);
                }
            }
        };

        service.genericPopulate.candidateParser = function (profile) {
            try {
                var returnProfile = {};
                if (profile !== undefined) {
                    returnProfile.areaInterest = profile.primaryCategory;
                }
                var input = {
                    data    : returnProfile,
                    identity: "genericPopulate",
                    key     : "candidate"
                };
                service.genericPopulate.notifyConsumer(input);
            } catch (reason) {
                jQuery('.loading-container').css('display', 'none');
            }
        };
        //</editor-fold>

    }

    function constructCandidateModelHelperService(service, candidate, logger, $filter, requisition, publicFolder, $q) {
        var _candidateHelper = {};
        service.candidateHelper = _candidateHelper;

        try {

            _candidateHelper.captureNonAtsLead = function (jobId, candidateId) {
                if (jobId !== undefined) {
                    var deferred = $q.defer();
                    var jobDetails = {"requisition": {"number_1": jobId}};
                    var folderId;
                    //search for req Id by job id
                    jQuery('.loading-container').css('display', 'block');
                    requisition.searchRequisitions(jobDetails).$promise.then(function (requisitionResponse) {
                        var requisitionSearchResult = normalizeObjects(requisitionResponse);
                        var requisitionResults = requisitionSearchResult.requisitionResults;
                        if (requisitionResults.length !== 0) {
                            for (var key in requisitionResults) {
                                var requisitionId = requisitionResults[key].requisitionId;
                                if (requisitionId !== null && requisitionId !== undefined) {
                                    var requisitionDetails = {
                                        "client"       : clientName,
                                        "requisitionId": requisitionResults[key].requisitionId,
                                        "type"         : "live"
                                    };
                                    //get folder details through requisition id
                                    publicFolder.getFolderByRequisitionAndType(requisitionDetails).$promise.then(function (FolderResults) {
                                        var folderDetails = normalizeObjects(FolderResults);
                                        angular.forEach(folderDetails, function (value2, key2) {
                                            folderId = folderDetails[key2]['folderId'];
                                            publicFolder.addCandidateToFolder({
                                                "candidateList"  : [candidateId],
                                                "destinationList": [folderId]
                                            }).$promise.then(function (response) {
                                                deferred.resolve(response);
                                            }, function (reason) {
                                                logger.error(reason);
                                                deferred.reject(reason);
                                            });
                                        });
                                        // deferred.resolve(folderDetails);
                                    }, function (FolderReason) {
                                        logger.error(FolderReason);
                                        deferred.reject(FolderReason);
                                    });
                                }
                            }
                        } else {
                            deferred.reject("no requisitionId found");
                        }
                    }, function (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                }
            };

            _candidateHelper.captureAtsLead = function (reqId, candidateId) {
                if (reqId !== null && reqId !== undefined) {
                    var deferred = $q.defer();
                    var folderId;
                    var requisitionDetails = {
                        "client"       : clientName,
                        "requisitionId": reqId,
                        "type"         : "live"
                    };
                    //get folder details through requisition id
                    publicFolder.getFolderByRequisitionAndType(requisitionDetails).$promise.then(function (FolderResults) {
                        var folderDetails = normalizeObjects(FolderResults);
                        angular.forEach(folderDetails, function (value2, key2) {
                            folderId = folderDetails[key2]['folderId'];
                            publicFolder.addCandidateToFolder({
                                "candidateList"  : [candidateId],
                                "destinationList": [folderId]
                            }).$promise.then(function (response) {
                                deferred.resolve(response);
                            }, function (reason) {
                                logger.error(reason);
                                deferred.reject(reason);
                            });
                        });
                    }, function (FolderReason) {
                        logger.error(FolderReason);
                        deferred.reject(FolderReason);
                    });
                    return deferred.promise;
                }
            };

            _candidateHelper.ApplyDefaultModes = function (candidateModel) {
                if (typeof(candidateModel.accessType) == "undefined" || candidateModel.accessType == "") {
                    candidateModel.accessType = 'E';
                }
                delete candidateModel.unsubscribeCheck;
                candidateModel.deactivateCheck = 'f';
                candidateModel.languageCodeId = ACTIVE_LANGUAGE_CODE_ID;
            };

            _candidateHelper.responsePrototype = {
                hasSuccess: true,
                reason    : 'success'
            };

            _candidateHelper.setterProcessor = {
                zeoCode: function (candidateInputModel, override, callback) {
                    var response = angular.copy(_candidateHelper.responsePrototype);
                    var params = {};
                    params.postalcode = candidateInputModel.zip;

                    if (candidateInputModel.zip !== null || candidateInputModel.zip !== undefined) {
                        candidate.getPostalCodesData(params).$promise.then(function (results) {
                            var zipCode = results;
                            if (zipCode[0] !== undefined && zipCode[0] !== null) {
                                if (override === true || candidateInputModel.country === null || candidateInputModel.country === undefined || candidateInputModel.country.length === 0) {
                                    candidateInputModel.country = zipCode[0].country;
                                }
                                if (override === true || candidateInputModel.state === null || candidateInputModel.state === undefined || candidateInputModel.country.state === 0) {
                                    candidateInputModel.state = zipCode[0].provinceAbbr;
                                }
                                if (override === true || candidateInputModel.city === null || candidateInputModel.city === undefined || candidateInputModel.country.city === 0) {
                                    candidateInputModel.city = zipCode[0].CityName;
                                }
                                if (override === true || candidateInputModel.latitude === null || candidateInputModel.latitude === undefined || candidateInputModel.country.city === 0) {
                                    candidateInputModel.latitude = zipCode[0].latitude;
                                }
                                if (override === true || candidateInputModel.longitude === null || candidateInputModel.longitude === undefined || candidateInputModel.country.city === 0) {
                                    candidateInputModel.longitude = zipCode[0].longitude;
                                }
                            }
                            callback(response);
                        }, function (reason) {
                            response.hasSuccess = false;
                            response.reason = reason;
                            callback(response);
                        });
                    }
                }
            };

            _candidateHelper.filters = {
                getCurrentJob: function (collection) {
                    var _currentEmployer = _.findWhere(collection, {current: 't'});
                    if (_currentEmployer === undefined) {
                        if (collection.length !== 0) {
                            _currentEmployer = $filter('orderBy')(collection, '-endDate', false)[0];
                        } else {
                            _currentEmployer = {};
                        }
                    }
                    return _currentEmployer;
                },

                getCurrentEducation: function (collection) {
                    var _currentEdu = _.where(collection, {completed: 't'});
                    if (_currentEdu.length > 0) {
                        _currentEdu = _currentEdu[0];
                    } else {
                        _currentEdu = {};
                    }
                    return _currentEdu;
                }
            };

            _candidateHelper.parserCollection = {
                resume: {
                    getEducationModel: function (resumeEducationDataSource, argumentCollection, candidateId) {
                        if(candidateId === undefined) {
                            candidateId = '';
                        }
                        var _parsedEducation;
                        var parsedEducationElementCollection = [];
                        var _currentResumeElement;

                        var calculatedPredictor = {
                            emptyData: {
                                address: false,
                                degree : false,
                                subject: false
                            }
                        };
                        var calculatedDataSource = {
                            institute       : '',
                            inDefiniteBucket: {
                                institute: ''
                            }
                        };
                        var savedResumeEducationDataSource = resumeEducationDataSource;

                        if (resumeEducationDataSource === undefined) {
                            return parsedEducationElementCollection;
                        }

                        if (resumeEducationDataSource.length !== undefined && resumeEducationDataSource.length > 0) {
                            if (resumeEducationDataSource[0].school !== undefined) {
                                resumeEducationDataSource.school = resumeEducationDataSource[0].school;
                            }
                        }

                        if (typeof(resumeEducationDataSource.school) === 'object') {
                            if (resumeEducationDataSource.school.length === undefined) {
                                var facilitateArray = [];
                                facilitateArray.push(resumeEducationDataSource.school);
                                resumeEducationDataSource.school = facilitateArray;
                            }
                            if (resumeEducationDataSource.school.length !== undefined && resumeEducationDataSource.school.length > 1) {
                                resumeEducationDataSource.school.sort(function (a, b) {
                                    a = parseInt(a['_id']);
                                    b = parseInt(b['_id']);
                                    return b - a;
                                });
                            }
                            for (var key in resumeEducationDataSource.school) {
                                var _startDate = null, _endDate = null;
                                calculatedPredictor.emptyData.degree = false;
                                calculatedPredictor.emptyData.subject = false;
                                _currentResumeElement = resumeEducationDataSource.school[key];
                                if (_currentResumeElement.degree === undefined || _currentResumeElement.degree === null || typeof(_currentResumeElement.degree) !== 'object') {
                                    /*If there is no data in the _currentResumeElement.degree then we put the value for levelAttained as null*/
                                    calculatedPredictor.emptyData.degree = true;
                                } else {
                                    if (_currentResumeElement.degree.__text === undefined || _currentResumeElement.degree.__text === null) {
                                        _currentResumeElement.degree.__text = '';
                                    } else {
                                        _currentResumeElement.degree.__text = _currentResumeElement.degree.__text.length > 80 ? _currentResumeElement.degree.__text.substring(0, 79) : _currentResumeElement.degree.__text;
                                    }
                                }

                                if (_currentResumeElement.major === undefined || _currentResumeElement.major === null || typeof(_currentResumeElement.major) !== 'object') {
                                    /*If there is no data in the _currentResumeElement.major then we put the value for subject as null*/
                                    calculatedPredictor.emptyData.subject = true;
                                } else {
                                    if (_currentResumeElement.major.__text === undefined || _currentResumeElement.major.__text === null) {
                                        _currentResumeElement.major.__text = '';
                                    } else {
                                        _currentResumeElement.major.__text = _currentResumeElement.major.__text.length > 80 ? _currentResumeElement.major.__text.substring(0, 79) : _currentResumeElement.major.__text
                                    }
                                }

                                if (_currentResumeElement.institution === undefined || _currentResumeElement.institution === null) {
                                    _currentResumeElement.institution = '';
                                } else {
                                    calculatedDataSource.institute = _currentResumeElement.institution.toString();
                                    calculatedDataSource.institute = calculatedDataSource.institute.length > 80 ? calculatedDataSource.institute.substring(0, 79) : calculatedDataSource.institute;
                                }

                                calculatedPredictor.emptyData.address = false;
                                if (_currentResumeElement.address === undefined || _currentResumeElement.address === null) {
                                    _currentResumeElement.address = {};
                                    calculatedPredictor.emptyData.address = true;
                                } else {
                                    if (angular.isString(_currentResumeElement.address)) {
                                        /// TODO: address is expected as object, need to identify what data it has in form of string.
                                        _currentResumeElement.address = {};
                                        calculatedPredictor.emptyData.address = true;
                                    } else if (_currentResumeElement.address.city === undefined || _currentResumeElement.address.city === null) {
                                        _currentResumeElement.address.city = '';
                                    }
                                }

                                if ((_currentResumeElement.completiondate === undefined || _currentResumeElement.completiondate === null) && (_currentResumeElement.daterange === undefined || _currentResumeElement.daterange === null) ) {
                                    /*There are two variables on which we depend for checking the start date and end date, if neither of the variables are defines then
                                     we treat as DEGREE NOT COMPLETED*/
                                    _currentResumeElement.completed = 'f';
                                } else if((_currentResumeElement.daterange === undefined || _currentResumeElement.daterange === null) && (_currentResumeElement.completiondate !== null)){
                                    _currentResumeElement.completed = 't';
                                    if (angular.isArray(_currentResumeElement.completiondate)) {
                                        switch (_currentResumeElement.completiondate.length) {
                                            case 1:
                                                _startDate = _currentResumeElement.completiondate[0]._iso8601;
                                                break;
                                            case 2:
                                                _startDate = _currentResumeElement.completiondate[1]._iso8601;
                                                _endDate = _currentResumeElement.completiondate[0]._iso8601;
                                                break;
                                        }
                                    } else {
                                        _endDate = _currentResumeElement.completiondate._iso8601;
                                    }
                                } else if((_currentResumeElement.completiondate === undefined || _currentResumeElement.completiondate === null) && (_currentResumeElement.daterange !== null)) {
                                    _currentResumeElement.completed = 't';
                                    if(_currentResumeElement.daterange.start !== undefined){
                                        _startDate = _currentResumeElement.daterange.start._iso8601;
                                    }
                                    if(_currentResumeElement.daterange.end !== undefined){
                                        _endDate = _currentResumeElement.daterange.end._iso8601;
                                    }
                                }

                                calculatedDataSource.inDefiniteBucket.institute = _currentResumeElement.institution === '' ? _currentResumeElement.institution : calculatedDataSource.institute;

                                _parsedEducation = {
                                    'city'         : calculatedPredictor.emptyData.address === true ? '' : _currentResumeElement.address.city,
                                    'completed'    : _currentResumeElement.completed,
                                    'institution'  : _currentResumeElement.institution === '' ? _currentResumeElement.institution : calculatedDataSource.institute,
                                    'levelAttained': calculatedPredictor.emptyData.degree === true ? '' : _currentResumeElement.degree.__text,
                                    'subject': calculatedPredictor.emptyData.subject === true ? '' : _currentResumeElement.major.__text,
                                    'candidateId':candidateId
                                };
                                if (_startDate !== null) {
                                    _parsedEducation.startDate = _startDate;
                                }
                                if (_endDate !== null) {
                                    _parsedEducation.endDate = _endDate;
                                }
                                if (argumentCollection !== undefined && argumentCollection.candidateId !== undefined) {
                                    _parsedEducation.candidateId = argumentCollection.candidateId;
                                }
                                parsedEducationElementCollection.push(_parsedEducation);
                            }
                        }

                        if (resumeEducationDataSource.degree !== undefined || resumeEducationDataSource.institution !== undefined) {
                            calculatedPredictor.emptyData.address = false;
                            if (resumeEducationDataSource.address === undefined || resumeEducationDataSource.address === null) {
                                resumeEducationDataSource.address = {};
                                calculatedPredictor.emptyData.address = true;
                            } else {
                                if (angular.isString(resumeEducationDataSource.address)) {
                                    /// TODO: address is expected as object, need to identify what data it has in form of string.
                                    resumeEducationDataSource.address = {};
                                    calculatedPredictor.emptyData.address = true;
                                } else if (resumeEducationDataSource.address.city === undefined || resumeEducationDataSource.address.city === null) {
                                    resumeEducationDataSource.address.city = '';
                                }
                            }
                            /*if (resumeEducationDataSource.completiondate === undefined || resumeEducationDataSource.completiondate === null) {
                                resumeEducationDataSource.completed = 'f';
                            } else {
                                resumeEducationDataSource.completed = 't';
                            }*/
                            if ((resumeEducationDataSource.completiondate === undefined || resumeEducationDataSource.completiondate === null) && (resumeEducationDataSource.daterange === undefined || resumeEducationDataSource.daterange === null) ) {
                                    resumeEducationDataSource.completed = 'f';
                                } else if((resumeEducationDataSource.daterange === undefined || resumeEducationDataSource.daterange === null) && (resumeEducationDataSource.completiondate !== null)){
                                    resumeEducationDataSource.completed = 't';
                                    if (angular.isArray(resumeEducationDataSource.completiondate)) {
                                        switch (resumeEducationDataSource.completiondate.length) {
                                            case 1:
                                                _startDate = resumeEducationDataSource.completiondate[0]._iso8601;
                                                break;
                                            case 2:
                                                _startDate = resumeEducationDataSource.completiondate[1]._iso8601;
                                                _endDate = resumeEducationDataSource.completiondate[0]._iso8601;
                                                break;
                                        }
                                    } else {
                                        _endDate = resumeEducationDataSource.completiondate._iso8601;
                                    }
                                } else if((resumeEducationDataSource.completiondate === undefined || resumeEducationDataSource.completiondate === null) && (resumeEducationDataSource.daterange !== null)) {
                                    resumeEducationDataSource.completed = 't';
                                    if(resumeEducationDataSource.daterange.start !== undefined){
                                        _startDate = resumeEducationDataSource.daterange.start._iso8601;
                                    }
                                    if(resumeEducationDataSource.daterange.end !== undefined){
                                        _endDate = resumeEducationDataSource.daterange.end._iso8601;
                                    }
                                }
                            if (resumeEducationDataSource.institution === undefined || resumeEducationDataSource.institution === null) {
                                resumeEducationDataSource.institution = '';
                            } else {
                                var newInstitute = resumeEducationDataSource.institution.toString();
                                newInstitute = newInstitute.length > 80 ? newInstitute.substring(0, 79) : newInstitute;
                            }

                            calculatedPredictor.emptyData.degree = false;
                            if (resumeEducationDataSource.degree === undefined || resumeEducationDataSource.degree === null || typeof(resumeEducationDataSource.degree) !== 'object') {
                                calculatedPredictor.emptyData.degree = true;
                            } else {
                                if (resumeEducationDataSource.degree.__text === undefined || resumeEducationDataSource.degree.__text === null) {
                                    resumeEducationDataSource.degree.__text = '';
                                } else {
                                    resumeEducationDataSource.degree.__text = resumeEducationDataSource.degree.__text.length > 80 ? resumeEducationDataSource.degree.__text.substring(0, 79) : resumeEducationDataSource.degree.__text;
                                }
                            }

                            calculatedPredictor.emptyData.subject = false;
                            if (resumeEducationDataSource.major === undefined || resumeEducationDataSource.major === null || typeof(resumeEducationDataSource.major) !== 'object') {
                                calculatedPredictor.emptyData.subject = true;
                            } else {
                                if (resumeEducationDataSource.major.__text === undefined || resumeEducationDataSource.major.__text === null) {
                                    resumeEducationDataSource.major.__text = '';
                                } else {
                                    resumeEducationDataSource.major.__text = resumeEducationDataSource.major.__text.length > 80 ? resumeEducationDataSource.major.__text.substring(0, 79) : resumeEducationDataSource.major.__text;
                                }
                            }

                            _parsedEducation = {
                                'city'         : calculatedPredictor.emptyData.address === true ? '' : resumeEducationDataSource.address.city,
                                'completed'    : resumeEducationDataSource.completed,
                                'institution'  : resumeEducationDataSource.institution === '' ? calculatedDataSource.inDefiniteBucket.institute : calculatedDataSource.institute,
                                'levelAttained': calculatedPredictor.emptyData.degree === true ? '' : resumeEducationDataSource.degree.__text,
                                'subject': calculatedPredictor.emptyData.subject === true ? '' : resumeEducationDataSource.major.__text,
                                'candidateId':candidateId
                            };
                            if (_startDate !== null) {
                                _parsedEducation.startDate = _startDate;
                            }
                            if (_endDate !== null) {
                                _parsedEducation.endDate = _endDate;
                            }
                            if (argumentCollection !== undefined && argumentCollection.candidateId !== undefined) {
                                _parsedEducation.candidateId = argumentCollection.candidateId;
                            }
                            parsedEducationElementCollection.push(_parsedEducation);
                        }
                        return parsedEducationElementCollection;
                    },
                    getEmploymentModel: function (resumeEmpDataSource, argumentCollection, candidateId) {
                        if(candidateId === undefined) {
                            candidateId = '';
                        }
                        var _parsedEmployment;
                        var parsedEmpElementCollection = [];
                        var _currentEmploymentElement;

                        var calculatedPredictor = {
                            emptyData: {},
                            logical  : {
                                isMultiplePositionHeld: false
                            }
                        };
                        var calculatedDataSource = {
                            city            : '',
                            description     : '',
                            endDate         : '',
                            inDefiniteBucket: {
                                companyTitle: ''

                            },
                            isCurrent       : 'f',
                            startDate       : ''
                        };

                        var saveResumeEmpDataSource = resumeEmpDataSource;

                        if (resumeEmpDataSource === undefined) {
                            return parsedEmpElementCollection;
                        }

                        if (resumeEmpDataSource.length !== undefined && resumeEmpDataSource.length > 0) {
                            if (resumeEmpDataSource[0].job !== undefined) {
                                resumeEmpDataSource.job = resumeEmpDataSource[0].job;
                            }
                        }
                        if (resumeEmpDataSource.job.length !== undefined && resumeEmpDataSource.job.length > 1) {
                            resumeEmpDataSource.job.sort(function (a, b) {
                                a = parseInt(a['_id']);
                                b = parseInt(b['_id']);
                                return b - a;
                            });
                        }

                        for (var key in resumeEmpDataSource.job) {
                            _currentEmploymentElement = resumeEmpDataSource.job[key];

                            if (calculatedPredictor.logical.isMultiplePositionHeld && _currentEmploymentElement.hasOwnProperty('_inferred-from')) {
                                if (_currentEmploymentElement.title === undefined || _currentEmploymentElement.title === null) {
                                    _currentEmploymentElement.title = '';
                                } else {
                                    _currentEmploymentElement.title = _currentEmploymentElement.title.toString();
                                    _currentEmploymentElement.title = (_currentEmploymentElement.title.length > 50) ? _currentEmploymentElement.title.substring(0, 49) : _currentEmploymentElement.title;
                                }
                                if (_currentEmploymentElement.description === undefined || _currentEmploymentElement.description === null) {
                                    _currentEmploymentElement.description = '';
                                }

                                calculatedDataSource.startDate = '';
                                calculatedDataSource.endDate = '';
                                calculatedDataSource.isCurrent = 'f';

                                if (_currentEmploymentElement.daterange !== undefined && _currentEmploymentElement.daterange !== null) {
                                    if (_currentEmploymentElement.daterange.start !== undefined && _currentEmploymentElement.daterange.start !== null) {
                                        calculatedDataSource.startDate = _currentEmploymentElement.daterange.start._iso8601;
                                    }
                                   /* if (_currentEmploymentElement.daterange.end !== undefined && _currentEmploymentElement.daterange.end !== null) {
                                        if (_currentEmploymentElement.daterange.end._days.toLowerCase() === 'present') {
                                            calculatedDataSource.isCurrent = 't';
                                        } else {
                                            calculatedDataSource.endDate = _currentEmploymentElement.daterange.end._iso8601;
                                        }
                                    }*/
                                    if (_currentEmploymentElement.daterange.end !== undefined && _currentEmploymentElement.daterange.end !== null) {
                                        /*If there is a sring PRESENT in the daterange.end variable we treat it as the current job*/
                                        if(_currentEmploymentElement.daterange.end._days !== undefined) {
                                            if (_currentEmploymentElement.daterange.end._days.toLowerCase().indexOf('present') !== -1) {
                                                calculatedDataSource.isCurrent = 't';
                                            }
                                            else {
                                                calculatedDataSource.endDate = _currentEmploymentElement.daterange.end._iso8601;
                                            }
                                        }
                                        else if(typeof(_currentEmploymentElement.daterange.end) === 'string') {
                                            if (_currentEmploymentElement.daterange.end.toLowerCase().indexOf('present') !== -1) {
                                                calculatedDataSource.isCurrent = 't';
                                            }
                                            else {
                                                calculatedDataSource.endDate = _currentEmploymentElement.daterange.end._iso8601;
                                            }
                                        }
                                    }
                                }

                                calculatedDataSource.description = angular.isArray(_currentEmploymentElement.description) ? _currentEmploymentElement.description.toString() : _currentEmploymentElement.description;
                                calculatedDataSource.description = (calculatedDataSource.description.length > 100) ? calculatedDataSource.description.substring(0, 100) + '..' : calculatedDataSource.description;

                                _parsedEmployment = {
                                    'city'       : calculatedDataSource.city,
                                    'company'    : calculatedDataSource.inDefiniteBucket.companyTitle,
                                    'current'    : calculatedDataSource.isCurrent,
                                    'description': calculatedDataSource.description,
                                    'endDate': calculatedDataSource.endDate,
                                    'startDate': calculatedDataSource.startDate,
                                    'title': _currentEmploymentElement.title,
                                    'candidateId':candidateId
                                };
                                if (argumentCollection !== undefined && argumentCollection.candidateId !== undefined) {
                                    _parsedEmployment.candidateId = argumentCollection.candidateId;
                                }
                                parsedEmpElementCollection.push(_parsedEmployment);
                            } else {
                                if (_currentEmploymentElement.hasOwnProperty('_inferred-to')) {
                                    calculatedPredictor.logical.isMultiplePositionHeld = true;
                                    calculatedDataSource.inDefiniteBucket.companyTitle = _currentEmploymentElement.employer.substring(0, 79);
                                    if (_currentEmploymentElement.address !== undefined && _currentEmploymentElement.address !== null) {
                                        if (_currentEmploymentElement.address.city !== undefined && _currentEmploymentElement.address.city !== null) {
                                            calculatedDataSource.city = _currentEmploymentElement.address.city;
                                        } else {
                                            calculatedDataSource.city = '';
                                        }
                                    } else {
                                        calculatedDataSource.city = '';
                                    }
                                } else {
                                    calculatedPredictor.logical.isMultiplePositionHeld = false;
                                    calculatedDataSource.inDefiniteBucket.companyTitle = '';
                                    calculatedDataSource.city = '';
                                    /*The code commenting is done to remove the constarint, where we only took the job where employer name was defined
                                    But now we are taking all entries */
                                    /*if (_currentEmploymentElement.employer !== undefined) {
                                        if (_currentEmploymentElement.employer !== null) {*/
                                            if(_currentEmploymentElement.employer === undefined || _currentEmploymentElement.employer === null) {
                                                _currentEmploymentElement.employer = '';
                                            }
                                            else {
                                                _currentEmploymentElement.employer = _currentEmploymentElement.employer.toString().substring(0, 79);
                                            }
                                            if (_currentEmploymentElement.title === undefined || _currentEmploymentElement.title === null) {
                                                _currentEmploymentElement.title = '';
                                            } else {
                                                _currentEmploymentElement.title = _currentEmploymentElement.title.toString();
                                                _currentEmploymentElement.title = (_currentEmploymentElement.title.length > 50) ? _currentEmploymentElement.title.substring(0, 49) : _currentEmploymentElement.title;
                                            }
                                            if (_currentEmploymentElement.description === undefined || _currentEmploymentElement.description === null) {
                                                _currentEmploymentElement.description = '';
                                            }

                                            calculatedDataSource.description = angular.isArray(_currentEmploymentElement.description) ? _currentEmploymentElement.description.toString() : _currentEmploymentElement.description;
                                            calculatedDataSource.description = (calculatedDataSource.description.length > 100) ? calculatedDataSource.description.substring(0, 100) + '..' : calculatedDataSource.description;

                                            calculatedDataSource.startDate = null;
                                            calculatedDataSource.endDate = null;
                                            calculatedDataSource.isCurrent = 'f';

                                            if (_currentEmploymentElement.daterange !== undefined && _currentEmploymentElement.daterange !== null) {
                                                if (_currentEmploymentElement.daterange.start !== undefined && _currentEmploymentElement.daterange.start !== null) {
                                                    calculatedDataSource.startDate = _currentEmploymentElement.daterange.start._iso8601;
                                                }
                                                if (_currentEmploymentElement.daterange.end !== undefined && _currentEmploymentElement.daterange.end !== null) {
                                                    if(_currentEmploymentElement.daterange.end._days !== undefined) {
                                                        if (_currentEmploymentElement.daterange.end._days.toLowerCase().indexOf('present') !== -1) {
                                                            calculatedDataSource.isCurrent = 't';
                                                        }
                                                        else {
                                                            calculatedDataSource.endDate = _currentEmploymentElement.daterange.end._iso8601;
                                                        }
                                                    }
                                                    else if(typeof(_currentEmploymentElement.daterange.end) === 'string') {
                                                        if (_currentEmploymentElement.daterange.end.toLowerCase().indexOf('present') !== -1) {
                                                            calculatedDataSource.isCurrent = 't';
                                                        }
                                                        else {
                                                            calculatedDataSource.endDate = _currentEmploymentElement.daterange.end._iso8601;
                                                        }
                                                    }
                                                }
                                            }

                                            if (_currentEmploymentElement.address !== undefined && _currentEmploymentElement.address !== null) {
                                                if (_currentEmploymentElement.address.city !== undefined && _currentEmploymentElement.address.city !== null) {
                                                    calculatedDataSource.city = _currentEmploymentElement.address.city;
                                                }
                                            }
                                            _parsedEmployment = {
                                                'city'       : calculatedDataSource.city,
                                                'company'    : _currentEmploymentElement.employer,
                                                'current'    : calculatedDataSource.isCurrent,
                                                'description': calculatedDataSource.description,
                                                'endDate'    : calculatedDataSource.endDate,
                                                'startDate'  : calculatedDataSource.startDate,
                                                'title': _currentEmploymentElement.title,
                                                'candidateId':candidateId
                                            };

                                            if (argumentCollection !== undefined && argumentCollection.candidateId !== undefined) {
                                                _parsedEmployment.candidateId = argumentCollection.candidateId;
                                            }
                                            parsedEmpElementCollection.push(_parsedEmployment);
                                            /*else {
                                        logger.log('resumeParse: work history record is skipped due to employer un available');
                                    }*/
                                }
                            }
                        }
                        if (parsedEmpElementCollection.length > 0) parsedEmpElementCollection = parsedEmpElementCollection.slice().reverse();
                        return parsedEmpElementCollection;
                    }
                }
            };

            _candidateHelper.configuration = {
                loadLanguages: function () {
                    candidate.getLanguages().$promise.then(function (results) {
                        LANGUAGE_COLLECTION = normalizeObjects(results);
                        if (_XC_CONFIG.lang && _XC_CONFIG.lang !== 'en') {
                            var language_Element = _.findWhere(LANGUAGE_COLLECTION, {
                                language: _XC_CONFIG.lang
                            });
                            if (language_Element !== undefined) {
                                ACTIVE_LANGUAGE_CODE_ID = language_Element.languageCodeId;
                            }
                        }
                    }, function (reason) {
                        logger.error(reason);
                    });
                }
            }

        } catch (reason) {
            logger.warn("CandidateModel:An issue has occurred while CandidateModel Loading!");
            logger.error(reason);
        }
    }

    function constructInterpolationService(service, logger, ListService, $q, $timeout, $sce, leadcaptureModalService, $location) {

        service.schemaInterpolation = {
            frameworkMetaData : [
                {
                    streamId        : undefined,
                    formId          : undefined,
                    schemaDefinition: undefined,
                    formDefinition  : undefined
                }
            ],
            notificationEngine: {
                interpolation: {
                    generalMessage: "Something went wrong, we are not able to process your request. Please try again later."
                }
            },
            location:$location
        };

        service.schemaInterpolation.constructors = [];

        service.schemaInterpolation.definitionHandler = [];

        service.schemaInterpolation.fieldHandler = [];

        service.schemaInterpolation.sectionHandler = [];

        service.schemaInterpolation.fieldMetaData = [];

        service.schemaInterpolation.frameworkMetaData = [];

        service.schemaInterpolation.indexOfFieldGroup = 0;

        service.schemaInterpolation.metaData = [];

        service.schemaInterpolation.finalizedFormGroup = [];

        service.schemaInterpolation.skippedFormGroup = [];

        service.schemaInterpolation.finalizedFrameworkMetaData = [];

        service.schemaInterpolation.skippedFrameworkMetaData = [];

        service.schemaInterpolation.domainLookup = [];

        service.schemaInterpolation.lookUpToFetch = ["assmt_position_codes"];

        service.schemaInterpolation.schemDefinition = {
            "properties": {
                "uname"       : {
                    "key"   : "uname",
                    "schema": {
                        "pattern"  : "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
                        "maxLength": 75
                    }
                },
                "dob"         : {
                    "key"   : "dob",
                    "schema": {
                        "pattern"  : "\\d{4}-\\d{2}-\\d{2}",
                        "format"   : "uib-date"
                    }
                },
                "issueDate"     :{
                    "key"   : "issueDate",
                    "schema": {
                        "format" :"uib-date"
                    }
                },
                "ssn"         : {
                    "key"   : "ssn",
                    "schema": {
                        "format": "uimask"
                    }
                },
                "phone1"      : {
                    "key"   : "phone1",
                    "schema": {
                        "format": "uimask"
                    }
                },
                "managerPhone": {
                    "key"   : "managerPhone",
                    "schema": {
                        "format": "uimask"
                    }
                },
                "subscription"  : {
                    "key"   : "subscription",
                    "schema": {
                        "title": TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE
                    }
                },
                "termsAndPolicy": {
                    "key"   : "termsAndPolicy",
                    "schema": {
                        "title": TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_POLICY_TITLE
                    }
                }

            }
        };

        service.schemaInterpolation.formDefinition = {
            gridDirective: {
                "XCloudType": "template",
                "type"      : "template"
            },
            "properties" : {
                "uname"                       : {
                    "type"     : "conditional",
                    "condition": "uNameEditable === true",
                    "items"    : [
                        {
                            "key"              : "uname",
                            "ngModelOptions"   : {updateOn: 'blur'},
                            "destroyStrategy"  : "retain",
                            "required"         : true,
                            "labelHtmlClass"   : "asterisk",
                            "validationMessage": {
                                "302"     : XCLOUD.i18n("User Name / Email is required.", "validation"),
                                "202"     : XCLOUD.i18n("Invalid email address.", "validation"),
                                "201"     : XCLOUD.i18n("User Name / Email is too long, maximum {75 chars}", "validation"),
                                "required": XCLOUD.i18n("User Name / Email is required.", "validation")
                            },
                            "$asyncValidators" : {
                                9001: function (uname) {
                                    return service.angularSchemaObserver.notifyBlurEventListener(uname, 'uname');
                                }
                            }
                        }
                    ]
                },
                "uNameEditMode"               : {
                    "type"     : "conditional",
                    "condition": "uNameEditable !== true",
                    "items"    : [
                        {
                            "readonly"         : true,
                            "destroyStrategy"  : "retain",
                            "key"              : "uname",
                            "type"             : "text",
                            "required"         : true,
                            "ngModelOptions"   : {updateOn: 'blur'},
                            "fieldHtmlClass"   : "schema-form-control-disabled",
                            "labelHtmlClass"   : "asterisk",
                            "validationMessage": {
                                "302"     : XCLOUD.i18n("User Name / Email is required.", "validation"),
                                "202"     : XCLOUD.i18n("Invalid email address.", "validation"),
                                "201"     : XCLOUD.i18n("User Name / Email is too long, maximum {75 chars}", "validation"),
                                "required": XCLOUD.i18n("User Name / Email is required.", "validation")
                            },
                            "$asyncValidators" : {
                                9001: function (uname) {
                                    return service.angularSchemaObserver.notifyBlurEventListener(uname, 'uname');
                                }
                            }
                        }
                    ]
                },
                "lastFormActionConditionals"  : ["(editModel === true)", "(editModel === false)", "(rowAdded === true)", "(rowAdded === false)"],
                "submitActionConditionals"    : ["(editModel === true)", "(editModel === false)", "(rowEditMode !== true)", "(rowEditMode === true)"],
                "navigationConditionals"      : ["(rowAdded === true)", "(rowAdded === false)"],
                "submitActionEnableCondition" : "(submitActionSemaphore() === true)",
                "submitActionDisableCondition": "(submitActionSemaphore() === false)",
                "dob"                         : {
                    "key"              : "dob",
                    "type"             : "uib_datepicker",
                    "dateOptions"      : {
                        "maxDate"      : new Date()
                    },
                    "fieldAddonRight"  : true,
                    "popupPlacement"  : "bottom-right",
                    "format"           : "yyyy-MM-dd",
                    "validationMessage": {
                        "default": XCLOUD.i18n("Enter valid date.", "validation")
                    }
                },
                "issueDate"                   : {
                    "key"              : "issueDate",
                    "type"             : "uib_datepicker",
                    "dateOptions"      : {
                        "maxDate"      : new Date()
                    },
                    "fieldAddonRight"  : true,
                    "popupPlacement"  : "bottom-right",
                    "validationMessage": {
                        "default": XCLOUD.i18n("Enter valid date.", "validation")
                    }

                },
                "date_6"                      : {
                    "key"         : "date_6",
                    "type"        : "uib_datepicker",
                    "dateOptions"      : {
                        "minDate"      : new Date()
                    },
                    "format"      : "yyyy-MM-dd",
                    "fieldAddonRight"  : true,
                    "popupPlacement"  : "bottom-right",
                    "validationMessage": {
                        "default": XCLOUD.i18n("Enter valid date.", "validation")
                    }
                },
                "dateFieldProtoType"          : {
                    "type"        : "datepicker",
                    "selectYears" : true,
                    "selectMonths": true,
                    "format"      : "yyyy-mm-dd"
                },
                "uib-dateFieldProtoType"       :{
                    "type"            : "uib_datepicker",
                    "fieldAddonRight" : true,
                    "popupPlacement"  : "bottom-right",
                    "validationMessage": {
                        "default": XCLOUD.i18n("Enter valid date.", "validation")
                    }
                },
                "ssn"                         : {
                    "key"                : "ssn",
                    "maskFormat"         : "999-99-9999",
                    "maskPlaceHolderChar": "_",
                    "validationMessage"  : {
                        "default": " "
                    }
                },
                "phone1"                      : {
                    "key"                : "phone1",
                    "maskFormat"         : "9999999999?9?9?9?9",
                    "maskPlaceHolderChar": "space",
                    "validationMessage"  : {
                        "default": " "
                    }
                },
                "managerPhone"                : {
                    "key"                : "managerPhone",
                    "maskFormat"         : "9999999999?9?9?9?9",
                    "maskPlaceHolderChar": "space",
                    "validationMessage"  : {
                        "default": " "
                    }
                },
                "zip"                         : {
                    "key"              : "zip",
                    "ngModelOptions"   : {updateOn: 'blur'},
                    "destroyStrategy"  : "retain",
                    "validationMessage": {},
                    "$asyncValidators" : {
                        9002: function (zip) {
                            return service.angularSchemaObserver.notifyBlurEventListener(zip, 'zip');
                        }
                    }
                }
            }
        };

        service.schemaInterpolation.fetchDomainLookup = function (destinyList, listToRetrieve) {
            return ListService.loadListNames(destinyList, listToRetrieve);
        };

        service.schemaInterpolation.prepareValidationMessage = function (params) {
            var message = {
                "key"              : params.key,
                "validationMessage": {}
            };
            if (params.required !== undefined && params.required === true) {
                var _302Message = typeof (params.validationMessage) === "undefined" ? {} : params.validationMessage["302"];
                if ((params.validationMessage === undefined || params.validationMessage["302"] === undefined)) {
                    message.validationMessage = angular.merge(message.validationMessage, {"302": XCLOUD.i18n(params.title, "labels") + " " + XCLOUD.i18n("is required.", "validation")});
                    _302Message = message.validationMessage["302"];
                }
                // Not all of these can actually happen in a field, but for
                // we never know when one might pop up so it's best to cover them all.
                if(params.validationMessage === undefined  || params.validationMessage["required"] === undefined) {
                    message.validationMessage = angular.merge(message.validationMessage, {"required": _302Message});
                }
            }
            if (params.maxLength !== undefined && (params.validationMessage === undefined || params.validationMessage["201"] === undefined)) {
                message.validationMessage = angular.merge(message.validationMessage, {"201": XCLOUD.i18n(params.title, "labels") + " " + XCLOUD.i18n("is too long, maximum {", "validation") + params.maxLength + XCLOUD.i18n(" chars}.", "validation")});
            }
            if (params.pattern !== undefined && (params.validationMessage === undefined || params.validationMessage["202"] === undefined)) {
                message.validationMessage = angular.merge(message.validationMessage, {"202": XCLOUD.i18n(params.title, "labels") + " " + XCLOUD.i18n("is invalid.", "validation")});
            }
            return message;
        };

        //<editor-fold description="Meta Data Sanitize Rule Collection">

        service.schemaInterpolation.notifyOnException = function (semaphoreProgressBar, isNotifyUI, notificationMessage, reason) {
            if (reason !== undefined) {
                logger.error(reason);
            }
            service.schemaInterpolation.semaphoreCollection.progressBar(semaphoreProgressBar);
            service.schemaInterpolation.semaphoreCollection.notificationMessage(isNotifyUI, notificationMessage);
        };

        service.schemaInterpolation.conditionalDefinition = function (fieldMetaDataCollection) {
            if (_XC_CONFIG.login_modal.disabled === false) {
                if(_XC_CONFIG.landing_page){
                    /*We are passing the entire url path as multilang also need to be considered while redirecting to microsite*/
                    var micrositeUrl = service.schemaInterpolation.location.url();
                    service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + " onClick=" + "\"(function(){angular.element('#candidatePoolMainContainer').scope().setRedirectToCurrent({ email : angular.element('#uname').val(), reloadWindow : true});return false;})();return false;" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                }
                else if(service.schemaInterpolation.semaphoreCollection.isLeadCapture === true) {
                    if(service.schemaInterpolation.semaphoreCollection.redirectHandler === true) {
                        service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + " onClick=" + "\"(function(){angular.element('#candidatePoolMainContainer').scope().setRedirectToCurrent({ email : angular.element('#uname').val(), isLeadCapture : true});return false;})();return false;" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                    }
                    else {
                        service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + " onClick=" + "\"(function(){angular.element('#candidatePoolMainContainer').scope().setRedirectToCurrent({ email : angular.element('#uname').val(), reloadWindow : true});return false;})();return false;" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                    }
                }
                else {
                    service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + " onClick=" + "\"(function(){angular.element('#candidatePoolMainContainer').scope().setRedirectToCurrent({ email : angular.element('#uname').val(), reloadWindow : true});return false;})();return false;" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                }
            } else {
                var loginRedirect = service.schemaInterpolation.languageSupplier("/profile/login");
                if(_XC_CONFIG.landing_page){
                    /*We are passing the entire url path as multilang also need to be considered while redirecting to microsite*/
                    var micrositeUrl = service.schemaInterpolation.location.url();
                    service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + "  href=" + "\"/profile/login/?micrositeCaller="+ micrositeUrl + "\"" + "ng-click=" + "\"setRedirectToCurrent($event)" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                }
                else if (service.schemaInterpolation.semaphoreCollection.isLeadCapture === false) {
                    service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + "  href=" + "\"" + loginRedirect + "?applyCaller=CFM" + "\"" + "ng-click=" + "\"setRedirectToCurrent($event)" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                } else {
                    if(service.schemaInterpolation.semaphoreCollection.redirectHandler === true) {
                        //The redirectHandler flags is used to identify if it is profile/join and redirect the user to dashboard
                        service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + "  href=" + "\"" + loginRedirect + "?LCPCaller=CFM" + "\"" + "ng-click=" + "\"setRedirectToCurrent($event)" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                    }
                    else {
                        // the below cases are for apply/join and profile/job-alert where the user needs to be redirected to third party and not dashboard
                        service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = "<span id='email_exists_Check'>" + XCLOUD.i18n("It looks like you already have an account", "validation") + ", <b><a class=" + "\"pointer" + "\"" + " id=" + "\"unameLoginLink" + "\"" + "  href=" + "\"" + loginRedirect + "?applyCaller=CFM" + "\"" + "ng-click=" + "\"setRedirectToCurrent($event)" + "\"" + ">" + XCLOUD.i18n("log in?", "validation") + "</a></b></span>";
                    }
                }
            }
            service.schemaInterpolation.formDefinition.properties.uNameEditMode.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE] = service.schemaInterpolation.formDefinition.properties.uname.items[0].validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE];
            service.schemaInterpolation.formDefinition.properties.zip.validationMessage[ERROR_CONFIGURATION.CODES.VALIDATION.ZIP_LOOKUP] = "";
        };

        service.schemaInterpolation.languageSupplier = function(urlPattern) {
            var lang = _XC_CONFIG.lang;
            if(lang !== undefined && lang !== null && lang !== "en") {
                return("/" + lang + urlPattern);
            }
            else {
                return(urlPattern);
            }
        };

        service.schemaInterpolation.metadataConstructor = function (fieldMetaDataCollection) {
            logger.debug('metadataConstructor execution');
            service.schemaInterpolation.conditionalDefinition();
            var deferred = $q.defer();
            var _indexOfForm = 0;
            _.each(fieldMetaDataCollection, function (fieldMetaData) {
                try {
                    if (fieldMetaData !== null && fieldMetaData !== undefined && fieldMetaData.formMetaData !== null && fieldMetaData.schemaMetaData !== null) {
                        var fieldMetaData_schemaMetaData;
                        var fieldMetaData_formMetaData;
                        if(service.schemaInterpolation.configurations === undefined || service.schemaInterpolation.configurations.doNotParse !== true) {
                            fieldMetaData_schemaMetaData = JSON.parse(fieldMetaData.schemaMetaData);
                            fieldMetaData_formMetaData = JSON.parse(fieldMetaData.formMetaData);
                        }else{
                            fieldMetaData_schemaMetaData = fieldMetaData.schemaMetaData;
                            fieldMetaData_formMetaData = fieldMetaData.formMetaData;
                        }
                        _indexOfForm++;
                        var element = {
                            actionsTitleOverride    : fieldMetaData_formMetaData[1]["XCloudDefinition"].actionsTitleOverride,
                            defaultValueFieldObject : {},
                            fieldDefinition         : [],
                            fieldLookUpCollection   : [],
                            fieldNameCollection     : [],
                            formDefinition          : fieldMetaData_formMetaData,
                            formTitle               : ' ' + fieldMetaData_formMetaData[1]["XCloudDefinition"].formTitle,
                            formStyle               : {
                                progressBar: {
                                    class: 'disabled'
                                },
                                viewStyle  : fieldMetaData_formMetaData[1]["XCloudDefinition"].viewStyle
                            },
                            glyphIcon               : fieldMetaData_formMetaData[1]["XCloudDefinition"].glyphIcon,
                            gridConfiguration       : fieldMetaData_formMetaData[1]["XCloudDefinition"].gridConfiguration,
                            gridEnabled             : fieldMetaData_formMetaData[1]["XCloudDefinition"].gridEnabled,
                            hide                    : fieldMetaData_formMetaData[1]["XCloudDefinition"].viewStyle !== 5,
			    headIndex               : fieldMetaData.headIndex,
                            indexOfForm             : _indexOfForm,
                            isFirstForm             : false,
                            isLastForm              : false,
                            mandatoryFieldCollection: [],
                            model                   : {},
                            parentId                : fieldMetaData.parentId,
                            replicate               : fieldMetaData_formMetaData[1]["XCloudDefinition"].replicate,
                            schemaDefinition        : fieldMetaData_schemaMetaData,
                            schemaFormId            : fieldMetaData.schemaFormId,
                            schemaStreamId          : fieldMetaData.schemaStreamId,
                            table                   : fieldMetaData_formMetaData[1]["XCloudDefinition"].table,
                            tableMap                : fieldMetaData_formMetaData[1]["XCloudDefinition"].tableMap,
                            actionsTitleOverride    : fieldMetaData_formMetaData[1]["XCloudDefinition"].actionsTitleOverride,
                            defaultValueFieldObject : {},
                            fieldParserDefinition   : {
                                "dateFields": []
                            }
                        };

                        if (element.replicate !== undefined) {
                            element.replicate = (element.replicate === "true" || element.replicate === true);
                        }
                        // TODO: until stream level config supplied
                        if (element.indexOfForm === 1) {
                            service.angularSchemaObserver.formStyleHandler.viewStyle = element.formStyle.viewStyle;
                            service.angularSchemaObserver.formStyleHandler.progressBar.enabled = fieldMetaData_formMetaData[1]["XCloudDefinition"].progressBarIsEnabled;
                            service.angularSchemaObserver.formStyleHandler.grid.viewStyle = fieldMetaData_formMetaData[1]["XCloudDefinition"].gridViewStyle;
                            if(!fieldMetaData_formMetaData[1]["XCloudDefinition"].modalThankYouMessage === false){
                                leadcaptureModalService.setModalThankYouMessage(fieldMetaData_formMetaData[1]["XCloudDefinition"].modalThankYouMessage);
                                

                            }
                            if (service.angularSchemaObserver.formStyleHandler.grid.viewStyle === undefined) {
                                service.angularSchemaObserver.formStyleHandler.grid.viewStyle = 0;
                            }
                        }

                        if (element.formDefinition[0].lookUpCollections !== undefined && element.formDefinition[0].lookUpCollections.length > 0) {
                            if (element.formDefinition[0].lookUpCollections !== undefined && element.formDefinition[0].lookUpCollections.length > 0) {
                                service.schemaInterpolation.lookUpToFetch = _.uniq(service.schemaInterpolation.lookUpToFetch.concat(element.formDefinition[0].lookUpCollections));
                            }
                        }
                        service.schemaInterpolation.frameworkMetaData.push(element);
                        deferred.resolve(element);
                    } else {
                        service.schemaInterpolation.skippedFrameworkMetaData.push(element);
                        deferred.resolve(element);
                        service.schemaInterpolation.finalizeHandler();
                    }
                } catch (reason) {
                    service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
                }
            });
            return deferred.promise;
        };

        service.schemaInterpolation.domainLookupConstructor = function () {
            var deferred = $q.defer();
            logger.debug('domainLookupConstructor execution');
            try {
                if (service.schemaInterpolation.lookUpToFetch.length > 0) {
                    service.schemaInterpolation.fetchDomainLookup(
                        service.schemaInterpolation.domainLookup,
                        service.schemaInterpolation.lookUpToFetch)
                        .then(function (response) {
                            deferred.resolve(0);
                            logger.debug("lookup collection for form schema fetched");
                            service.schemaInterpolation.startDefinitionHandler();
                        });
                } else {
                    deferred.resolve(0);
                    service.schemaInterpolation.startDefinitionHandler();
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
            return deferred.promise;
        };

        service.schemaInterpolation.startDefinitionHandler = function () {
            try {
                _.each(service.schemaInterpolation.frameworkMetaData, function (frameworkMetadata) {
                    service.schemaInterpolation.indexOfFieldGroup = service.schemaInterpolation.indexOfFieldGroup + 1;
                    service.schemaInterpolation.executeHandler(service.schemaInterpolation.definitionHandler, frameworkMetadata);
                })
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        //TODO: till html supplied by XCR
        service.schemaInterpolation.staticDefinitionHandler = function (helpDirective) {
            if (helpDirective.helpvalue !== undefined) {
                switch (helpDirective.helpvalue) {
                    case '_XC_CONFIG.context.confirmation':
                        helpDirective.helpvalue = _XC_CONFIG.context.confirmation;
                        break;
                    case '_XC_CONFIG.context.eeo':
                        helpDirective.helpvalue = _XC_CONFIG.context.eeo;
                        break;
                    default:
                        break;
                }
            }
        };

        service.schemaInterpolation.formDetermination = function (frameworkMetaData) {
            logger.debug('formDetermination execution');
            var deferred = $q.defer();
            try {
                if(frameworkMetaData.gridEnabled === undefined && frameworkMetaData.gridConfiguration !== undefined){
                    frameworkMetaData.gridEnabled = frameworkMetaData.gridConfiguration.enabled;
                }
                if(frameworkMetaData.table === undefined && angular.isArray(frameworkMetaData.tableMap) && frameworkMetaData.tableMap.length > 0){
                    frameworkMetaData.table = frameworkMetaData.tableMap[0].name;
                }
                if (frameworkMetaData.gridEnabled) {
                    service.schemaInterpolation.formDefinition.gridDirective.template = "<schema-Grid table=&quot;" + frameworkMetaData.table + "&quot; parent-form-title=" + "\"'" + frameworkMetaData.formTitle + "'\"" + "></schema-Grid>";
                    angular.merge(frameworkMetaData.formDefinition[3], service.schemaInterpolation.formDefinition.gridDirective);
                }

                // Enable scroll for modal
                if(service.angularSchemaObserver.formStyleHandler.viewStyle === service.angularSchemaObserver.formStyleHandler.viewStylesEnum.modal)
                {
                    if(frameworkMetaData.formDefinition[4].type  === "section"){
                        if(frameworkMetaData.formDefinition[4].htmlClass === undefined){
                            frameworkMetaData.formDefinition[4].htmlClass = "";
                        }
                        frameworkMetaData.formDefinition[4].htmlClass += " " + service.angularSchemaObserver.formStyleHandler.modal.scrollbarCSSClass;
                    }
                }

                service.schemaInterpolation.staticDefinitionHandler(frameworkMetaData.formDefinition[2]);
                var _sectionIndex = 1;
                angular.forEach(frameworkMetaData.formDefinition[4].items, function (formSection) {
                    var ruleParam = {
                        isuNameContains       : false,
                        uNameFieldIndex       : false,
                        iterationIdentity     : frameworkMetaData.formTitle + _sectionIndex,
                        iterationTitleIdentity: frameworkMetaData.formTitle
                    };
                    _sectionIndex++;
                    _.each(formSection.items, function (controlElement, index, source) {

                        // sanitize defaults with add on
                        ruleParam.schemaFormId = frameworkMetaData.schemaFormId;
                        ruleParam.fieldElement = controlElement;
                        ruleParam.formSection = formSection;
                        ruleParam.source = source;
                        ruleParam.index = index;
                        angular.forEach(service.schemaInterpolation.fieldHandler, function (rule) {
                            rule(frameworkMetaData, ruleParam);
                        });

                    });

                    angular.forEach(service.schemaInterpolation.sectionHandler, function (rule) {
                        rule(formSection);
                    });

                    deferred.resolve(0);
                });
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
            return deferred.promise;
        };
        service.schemaInterpolation.changeSectionClass = function(section){
            //This value is set when the LCP modal is opened
            if(leadcaptureModalService.getCalledFromModal()){
                if (section.hasOwnProperty("items")){
                    if(section.items.length>0){
                        if(!_XC_CONFIG.lcp_modal_field_class){
                            section.htmlClass = "col-sm-12";
                        }
                        else{
                            section.htmlClass = _XC_CONFIG.lcp_modal_field_class;
                        }
                    }
                    else{
                        //making the last section as display none
                        section.htmlClass = "display-none";
                        leadcaptureModalService.resetCalledFromModal();
                    }
                }
                else{
                    leadcaptureModalService.resetCalledFromModal();
                }
            }
        };

        //<editor-fold description="Form Sanitize Rule Collection">

        service.schemaInterpolation.mandatoryFieldExecuter = function (frameworkMetaData, params) {
            try {
                if (params.fieldElement.key !== undefined && params.fieldElement.type !== 'button' && params.fieldElement.type !== 'submit') {
                    if (params.fieldElement.required !== undefined && params.fieldElement.required === true) {
                        var schemaElement = frameworkMetaData.schemaDefinition.properties[params.fieldElement.key];
                        if (schemaElement !== undefined && schemaElement.title !== undefined) {
                            params.fieldElement.title = XCLOUD.i18n(schemaElement.title, "labels");
                            if (params.fieldElement.labelHtmlClass === undefined) {
                                params.fieldElement.labelHtmlClass = "";
                            } else {
                                params.fieldElement.labelHtmlClass += " ";
                            }
                            params.fieldElement.labelHtmlClass += "asterisk";
                        }
                        if (params.fieldElement.condition === undefined) {
                            var mandatoryField = [];
                            mandatoryField.push(params.fieldElement.key);
                            frameworkMetaData.mandatoryFieldCollection = _.uniq(frameworkMetaData.mandatoryFieldCollection.concat(mandatoryField));
                        }
                        if (schemaElement !== undefined && schemaElement.default !== undefined) {
                            frameworkMetaData.defaultValueFieldObject[params.fieldElement.key] = schemaElement.default;
                        }
                    }
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.assembleFieldName = function (frameworkMetaData, params) {
            try {
                if (params.fieldElement.key !== undefined) {
                    var field = [];
                    field.push(params.fieldElement.key);
                    frameworkMetaData.fieldNameCollection = _.uniq(frameworkMetaData.fieldNameCollection.concat(field));
                    var schemaElement = frameworkMetaData.schemaDefinition.properties[params.fieldElement.key];
                    if (schemaElement !== undefined) {
                        frameworkMetaData.fieldDefinition.push(
                            {
                                key  : params.fieldElement.key,
                                title: schemaElement.title
                            }
                        )
                    }
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.ngModelReceiverInjection = function (fieldSchema) {
            try {
                if (fieldSchema !== undefined) {
                    fieldSchema.ngModel = function (schemaNgModel) {
                        if (service.schemaInterpolation.consumerEmitReceiver !== undefined) {
                            service.schemaInterpolation.consumerEmitReceiver('schemaNgModelPropagation', schemaNgModel);
                        }
                    };
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.domainValidator = function (frameworkMetaData, params) {
            try {
                var fieldCustomSchema = service.schemaInterpolation.formDefinition.properties[params.fieldElement.key];
                if (fieldCustomSchema !== undefined) {
                    var element = _.findWhere(service.schemaInterpolation.coreDependencyBucket, {iterationTitleIdentity: params.iterationTitleIdentity});
                    if (element === undefined) {
                        service.schemaInterpolation.coreDependencyBucket.push({
                            iterationTitleIdentity: params.iterationTitleIdentity,
                            index                 : params.index
                        });
                        service.schemaInterpolation.ngModelReceiverInjection((params.fieldElement.key === "uname" ? fieldCustomSchema.items[0] : fieldCustomSchema));
                    }
                    if (params.fieldElement.key === "uname") {
                        params.isuNameContains = true;

                        // overwriting the required and 302 validation message from DB form.
                        if(params.fieldElement.validationMessage !== undefined){
                            if(params.fieldElement.validationMessage.hasOwnProperty('302')){
                                fieldCustomSchema.items[0].validationMessage['302'] = params.fieldElement.validationMessage['302']
                            }
                            if(params.fieldElement.validationMessage.hasOwnProperty('required')){
                                fieldCustomSchema.items[0].validationMessage['required'] = params.fieldElement.validationMessage['required']
                            }
                        }
                        params.uNameFieldIndex = params.index;
                        fieldCustomSchema.items[0].title = angular.copy(params.fieldElement.title);
                        params.source[params.index] = angular.copy(fieldCustomSchema);

                        /// editMode uname rule
                        var _fieldCustomSchema = service.schemaInterpolation.formDefinition.properties["uNameEditMode"];
                        _fieldCustomSchema.items[0].title = fieldCustomSchema.items[0].title;
                        if (params.index === 0) service.schemaInterpolation.ngModelReceiverInjection(_fieldCustomSchema.items[0]);
                        service.schemaInterpolation.additionalElementCollection.push({
                            iterationIdentity: params.iterationIdentity,
                            section          : params.formSection,
                            element          : _fieldCustomSchema,
                            index            : params.index + 1,
                            injected         : false
                        });
                    } else {
                        angular.merge(params.fieldElement, fieldCustomSchema);
                    }
                } else {
                    if (params.index === 0) {
                        service.schemaInterpolation.ngModelReceiverInjection(params.fieldElement)
                    }
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.protoTypeBuilder = function (frameworkMetaData, params) {
            try {
                var schemaElement = frameworkMetaData.schemaDefinition.properties[params.fieldElement.key];
                // if (schemaElement !== undefined && schemaElement.format !== undefined && schemaElement.format === "date") {
                //     var specificProtoType = service.schemaInterpolation.formDefinition.properties[params.fieldElement.key];
                //     if (specificProtoType === undefined) {
                //         var protoType = angular.copy(service.schemaInterpolation.formDefinition.properties["dateFieldProtoType"]);
                //         params.fieldElement.selectYears = protoType.selectYears;
                //         params.fieldElement.selectMonths = true;
                //         params.fieldElement.format = protoType.format;
                //         var dateFieldParser = [];
                //         dateFieldParser.push(params.fieldElement.key);
                //         frameworkMetaData.fieldParserDefinition.dateFields = _.uniq(frameworkMetaData.fieldParserDefinition.dateFields.concat(dateFieldParser));
                //     }
                // }
                if (schemaElement !== undefined && schemaElement.format !== undefined && schemaElement.format === "date") {
                    schemaElement.format = "uib-date";
                    var specificProtoType = service.schemaInterpolation.formDefinition.properties[params.fieldElement.key];
                    if (specificProtoType === undefined) {
                        var protoType = angular.copy(service.schemaInterpolation.formDefinition.properties["uib-dateFieldProtoType"]);
                        params.fieldElement.fieldAddonRight = protoType.fieldAddonRight;
                        params.fieldElement.type = protoType.type;
                        params.fieldElement.popupPlacement = protoType.popupPlacement;
                        if(params.fieldElement.dateOptions != undefined){
                            var minDate = params.fieldElement.dateOptions.minDate;
                            var maxDate = params.fieldElement.dateOptions.maxDate;
                        }
                        if(minDate !== undefined && minDate !== null && minDate !== "")
                        {
                            if(minDate.toLowerCase() === "today")
                            {
                                params.fieldElement.dateOptions.minDate = new Date();
                            }
                            else {
                                params.fieldElement.dateOptions.minDate = new Date(minDate);
                            }
                        }
                        if(maxDate !== undefined && maxDate !== null && maxDate !== "")
                        {
                            if(maxDate.toLowerCase() === "today")
                            {
                                params.fieldElement.dateOptions.maxDate = new Date();
                            }
                            else {
                                params.fieldElement.dateOptions.maxDate = new Date(maxDate);
                            }
                        }
                        params.fieldElement.validationMessage.default = protoType.validationMessage.default;
                        var dateFieldParser = [];
                        dateFieldParser.push(params.fieldElement.key);
                        frameworkMetaData.fieldParserDefinition.dateFields = _.uniq(frameworkMetaData.fieldParserDefinition.dateFields.concat(dateFieldParser));
                    }
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.validationSummaryBuilder = function (frameworkMetaData, params) {
            try {
                var schemaElement = frameworkMetaData.schemaDefinition.properties[params.fieldElement.key];
                if (schemaElement !== undefined) {
                    var parameters = {
                        key              : params.fieldElement.key,
                        title            : schemaElement.title,
                        maxLength        : schemaElement.maxLength,
                        required         : params.fieldElement.required,
                        pattern          : schemaElement.pattern,
                        validationMessage: params.fieldElement.validationMessage
                    };
                    // Translations on vlidation messages
                    if (parameters.validationMessage) {
                        for (var code in parameters.validationMessage) {
                            parameters.validationMessage[code] = XCLOUD.i18n(parameters.validationMessage[code], 'validation');
                        }
                    }
                    var validationMessageCollection = angular.copy(service.schemaInterpolation.prepareValidationMessage(parameters));
                    angular.merge(params.fieldElement, validationMessageCollection);
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.domainLookupMap = function (frameworkMetaData, params) {
            try {
                var isCriteriaMet = (params.fieldElement.type !== undefined && params.fieldElement.titleMap !== undefined && angular.isArray(params.fieldElement.titleMap) === false);
                if (isCriteriaMet) {
                    var lookUp = service.schemaInterpolation.domainLookup[params.fieldElement.titleMap];
                    var _lookupFormatter = null;
                    switch (params.fieldElement.type) {
                        case ANGULAR_SCHEMA_FORMATTER.LOOK_UP.TYPES.UI_SELECT:
                        case ANGULAR_SCHEMA_FORMATTER.LOOK_UP.TYPES.UI_MULTI_SELECT:
                            _lookupFormatter = ANGULAR_SCHEMA_FORMATTER.LOOK_UP.UI_SELECT;
                            break;
                        case ANGULAR_SCHEMA_FORMATTER.LOOK_UP.TYPES.SELECT:
                            _lookupFormatter = ANGULAR_SCHEMA_FORMATTER.LOOK_UP.DROP_DOWN;
                            break;
                        default:
                            _lookupFormatter = ANGULAR_SCHEMA_FORMATTER.LOOK_UP.DEFAULT;
                            break;
                    }
                    var _formattedLookup = service.schemaInterpolation.domainLookupFormatter(lookUp, _lookupFormatter);
                    if (_lookupFormatter.SOURCE === ANGULAR_SCHEMA_FORMATTER.LOOK_UP.UI_SELECT.SOURCE) {
                        frameworkMetaData.schemaDefinition.properties[params.fieldElement.key][_lookupFormatter.SOURCE] = _formattedLookup;
                    } else {
                        params.fieldElement[_lookupFormatter.SOURCE] = _formattedLookup;
                    }


                    var element = _.where(frameworkMetaData.fieldLookUpCollection, {key: params.fieldElement.key});
                    if (element === undefined || element.length === 0) {
                        var fieldAttribute = {
                            key       : params.fieldElement.key,
                            listLookUp: lookUp
                        };
                        frameworkMetaData.fieldLookUpCollection.push(fieldAttribute)
                    }
                }
                params.titleMapWithList = isCriteriaMet;
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.lastFieldGroupBuilder = function (frameworkMetaData, params) {
            try {
                if (service.schemaInterpolation.indexOfFieldGroup === (service.schemaInterpolation.fieldMetaData.length - service.schemaInterpolation.skippedFrameworkMetaData.length) &&
                    params.fieldElement.key === undefined && params.fieldElement.type !== undefined
                    && params.fieldElement.type === "conditional" && service.schemaInterpolation.formDefinition.properties["lastFormActionConditionals"].indexOf(params.fieldElement.condition) > -1) {
                    if (params.fieldElement.items.length > 0) {
                        angular.forEach(params.fieldElement.items, function (conditionalItem) {
                            if (conditionalItem.type === "actions") {
                                angular.forEach(conditionalItem.items, function (actionItem) {
                                    if ((frameworkMetaData.actionsTitleOverride === undefined || frameworkMetaData.actionsTitleOverride !== false) && (actionItem.title === "Update" || actionItem.title === "Continue")) {
                                        actionItem.title = _XC_CONFIG.context.submit;
                                    }
                                    actionItem.title = XCLOUD.i18n(actionItem.title, 'buttons');
                                });
                            }
                        });
                    }
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.fieldGroupActionDisableSemaphore = function (frameworkMetaData, params) {
            try {
                var elementCanSplice = (frameworkMetaData.gridEnabled === true && frameworkMetaData.gridConfiguration.minRowCount !== 0);
                var spliceCurrentElement = false;
                if (params.fieldElement.key === undefined && params.fieldElement.type !== undefined
                    && params.fieldElement.type === "conditional" && params.fieldElement.items.length > 0) {

                    if (service.schemaInterpolation.formDefinition.properties["submitActionConditionals"].indexOf(params.fieldElement.condition) > -1) {

                        var criteriaMet = false;
                        var clonedConditionElement = angular.copy(params.fieldElement);

                        for (var index = 0; index < params.fieldElement.items.length; index++) {

                            if (params.fieldElement.items[index].type === "actions" && params.fieldElement.items[index].items.length > 0) {

                                for (var subIndex = 0; subIndex < params.fieldElement.items[index].items.length; subIndex++) {
                                    clonedConditionElement.items[index].items[subIndex].mandatoryFieldCollection = frameworkMetaData.mandatoryFieldCollection.join('XCloudStatus ') + 'XCloudStatus';
                                    if(clonedConditionElement.items[index].items[subIndex].mandatoryFieldCollection.indexOf('termsAndPolicy') === -1){
                                        clonedConditionElement.items[index].items[subIndex].mandatoryFieldCollection += ' termsAndPolicyXCloudStatus';
                                    }

                                    if (params.fieldElement.items[index].items[subIndex].type === "button" && params.fieldElement.items[index].items[subIndex].onClick !== undefined
                                        && (params.fieldElement.items[index].items[subIndex].onClick.indexOf('submitForm') > -1 || params.fieldElement.items[index].items[subIndex].onClick.indexOf('updateForm') > -1
                                            || params.fieldElement.items[index].items[subIndex].onClick.indexOf('showNextForm') > -1)) {
                                        clonedConditionElement.items[index].items[subIndex].readonly = true;
                                        criteriaMet = true;
                                    }

                                    if (params.fieldElement.items[index].items[subIndex].type === "button") {
                                        clonedConditionElement.items[index].items[subIndex].htmlClass = "schema-form-actions-row m0";
                                        params.fieldElement.items[index].items[subIndex].htmlClass = clonedConditionElement.items[index].items[subIndex].htmlClass;
                                        if (params.fieldElement.items[index].items[subIndex].onClick !== undefined && params.fieldElement.items[index].items[subIndex].onClick.indexOf('skipForm') > -1) {
                                            params.fieldElement.items[index].items[subIndex].readonly = true;
                                        }
                                        clonedConditionElement.items[index].items[subIndex].title = XCLOUD.i18n(clonedConditionElement.items[index].items[subIndex].title, "buttons");
                                    }
                                    if (params.fieldElement.items[index].items[subIndex].type === "button" && params.fieldElement.items[index].items[subIndex].onClick.indexOf('showPreviousForm') > -1) {
                                        spliceCurrentElement = (frameworkMetaData.index <= 1 || (service.angularSchemaObserver.formStyleHandler.viewStyle !== service.angularSchemaObserver.formStyleHandler.viewStylesEnum.slide && service.angularSchemaObserver.formStyleHandler.viewStyle !== service.angularSchemaObserver.formStyleHandler.viewStylesEnum.modal));
                                    }
                                    if (spliceCurrentElement === true) {
                                        spliceCurrentElement = false;
                                        var _preElements = _.filter(service.schemaInterpolation.additionalElementCollection, function (element) {
                                            return (element.iterationIdentity === params.iterationIdentity && (element.index < params.index) && element.injected === false);
                                        });
                                        var _postElements = _.filter(service.schemaInterpolation.additionalElementCollection, function (element) {
                                            return (element.iterationIdentity === params.iterationIdentity && (element.index >= params.index) && element.injected === false);
                                        });
                                        service.schemaInterpolation.spliceOffsetCollection.push({
                                            ignoreIncremental: true,
                                            itemIndex        : index,
                                            itemSubIndex     : subIndex,
                                            iterationIdentity: params.iterationIdentity,
                                            removed          : false,
                                            section          : params.formSection,
                                            sectionItemIndex : params.index + _preElements.length + _postElements.length
                                        });
                                        service.schemaInterpolation.spliceOffsetCollection.push({
                                            ignoreIncremental: true,
                                            itemIndex        : index,
                                            itemSubIndex     : subIndex,
                                            iterationIdentity: params.iterationIdentity,
                                            removed          : false,
                                            section          : params.formSection,
                                            sectionItemIndex : params.index + _preElements.length + _postElements.length + 1
                                        });
                                    }
                                }
                                params.fieldElement.items[index].type = "fieldset";
                                clonedConditionElement.items[index].type = "fieldset";
                                params.fieldElement.items[index].htmlClass = "m0";
                                clonedConditionElement.items[index].htmlClass = "m0";
                            }
                        }

                        if (criteriaMet) {

                            clonedConditionElement.condition = clonedConditionElement.condition.replace("(", ' ');
                            clonedConditionElement.condition = clonedConditionElement.condition.replace(")", ' ');
                            params.fieldElement.condition = "(" + clonedConditionElement.condition + " && " + service.schemaInterpolation.formDefinition.properties["submitActionEnableCondition"] + " )";
                            clonedConditionElement.condition = "(" + clonedConditionElement.condition + " && " + service.schemaInterpolation.formDefinition.properties["submitActionDisableCondition"] + " )";

                            service.schemaInterpolation.additionalElementCollection.push({
                                element          : clonedConditionElement,
                                index            : params.index + 1,
                                injected         : false,
                                iterationIdentity: params.iterationIdentity,
                                section          : params.formSection
                            });
                        }
                    }
                    else {
                        var conditionalPosition = service.schemaInterpolation.formDefinition.properties["navigationConditionals"].indexOf(params.fieldElement.condition);
                        var removedCount = 0;
                        if (conditionalPosition > -1) {
                            for (index = 0; index < params.fieldElement.items.length; index++) {
                                if (params.fieldElement.items[index].type === "actions" && params.fieldElement.items[index].items.length > 0) {
                                    for (subIndex = 0; subIndex < params.fieldElement.items[index].items.length; subIndex++) {
                                        if (params.fieldElement.items[index].items[subIndex].type === "button") {
                                            params.fieldElement.items[index].items[subIndex].htmlClass = "schema-form-actions-row m0";
                                        }
                                        if (params.fieldElement.items[index].items[subIndex].type === "button" && params.fieldElement.items[index].items[subIndex].onClick !== undefined) {
                                            if (params.fieldElement.items[index].items[subIndex].onClick.indexOf('showNextForm') > -1) {
                                                params.fieldElement.items[index].items[subIndex].readonly = !(conditionalPosition === 0);
                                            } else if (params.fieldElement.items[index].items[subIndex].onClick.indexOf('skipForm') > -1) {
                                                params.fieldElement.items[index].items[subIndex].readonly = !(conditionalPosition === 1);
                                                spliceCurrentElement = elementCanSplice;
                                            }else if (params.fieldElement.items[index].items[subIndex].onClick.indexOf('showPreviousForm') > -1) {
                                                spliceCurrentElement = (frameworkMetaData.index <= 1 || (service.angularSchemaObserver.formStyleHandler.viewStyle !== service.angularSchemaObserver.formStyleHandler.viewStylesEnum.slide && service.angularSchemaObserver.formStyleHandler.viewStyle !== service.angularSchemaObserver.formStyleHandler.viewStylesEnum.modal));
                                            }
                                        }
                                        if (spliceCurrentElement === true) {
                                            spliceCurrentElement = false;
                                            service.schemaInterpolation.spliceOffsetCollection.push({
                                                itemIndex        : index,
                                                itemSubIndex     : subIndex - removedCount,
                                                iterationIdentity: params.iterationIdentity,
                                                removed          : false,
                                                section          : params.formSection,
                                                sectionItemIndex : params.index
                                            });
                                            removedCount++;
                                        }
                                    }
                                    params.fieldElement.items[index].type = "fieldset";
                                    params.fieldElement.items[index].htmlClass = "m0";
                                }
                            }
                        }
                    }
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.additionalElementInsertion = function () {
            try {
                var deferred = $q.defer();
                var inserted = 0;
                var collection = _.filter(service.schemaInterpolation.additionalElementCollection, {injected: false});
                for (var index = 0; index < collection.length; index++) {
                    var additionalElement = collection[index];
                    additionalElement.injected = true;
                    additionalElement.section.items.splice(additionalElement.index + inserted, 0, additionalElement.element);
                    inserted++;
                }
                deferred.resolve(0);
                return deferred.promise;
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.dirtyElementRemoval = function () {
            try {
                var deferred = $q.defer();
                var deletedCount = 0;
                var collection = _.filter(service.schemaInterpolation.spliceOffsetCollection, {removed: false});
                angular.forEach(collection, function (dirtyElement) {
                    var _selectionIndex = angular.copy(dirtyElement.sectionItemIndex);
                    var insertedElementCollection = _.filter(service.schemaInterpolation.additionalElementCollection, {
                        iterationIdentity: dirtyElement.iterationIdentity, injected: true
                    });
                    angular.forEach(insertedElementCollection, function (insertedElement) {
                        if (((insertedElement.index - 1) < _selectionIndex) && (dirtyElement.ignoreIncremental === undefined || dirtyElement.ignoreIncremental === false)) {
                            dirtyElement.sectionItemIndex += 1;
                        }
                    });
                    dirtyElement.removed = true;
                    if (dirtyElement.itemSubIndex === -1) {
                        dirtyElement.section.items[dirtyElement.sectionItemIndex].items.splice(dirtyElement.itemIndex, 1);
                    } else {
                        dirtyElement.section.items[dirtyElement.sectionItemIndex].items[dirtyElement.itemIndex].items.splice(dirtyElement.itemSubIndex, 1);
                    }
                    deletedCount++;
                });
                deferred.resolve(0);
                return deferred.promise;
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        //</editor-fold>

        service.schemaInterpolation.schemaDetermination = function (frameworkMetaData) {
            logger.debug('schemaDetermination execution');
            try {
                var deferred = $q.defer();
                var schema = frameworkMetaData.schemaDefinition.properties;
                angular.forEach(service.schemaInterpolation.schemDefinition.properties, function (customSchemaElement) {
                    var element = schema[customSchemaElement.key];
                    if (element !== undefined) {
                        angular.merge(element, customSchemaElement.schema);
                    }
                });
                if (_XC_CONFIG.lang) {
                    angular.forEach(schema, function (field) {
                        if (field.title) {
                            field.title = XCLOUD.i18n(field.title, 'labels');
                        }
                    });
                }
                deferred.resolve(0);
                return deferred.promise;
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };

        service.schemaInterpolation.domainLookupFormatter = function (collection, lookupFormatter) {
            var returns = [];
            try {
                angular.forEach(collection, function (element) {
                        var returnElement = {};
                        returnElement[lookupFormatter.VALUE_FIELD] = element.value;
                        returnElement[lookupFormatter.LABEL_FIELD] = XCLOUD.i18n(element.label, 'lists');
                        returns.push(returnElement);
                    }
                );
                return returns;
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
                return [];
            }
        };

        service.schemaInterpolation.fieldGroupCommit = function (frameworkMetaData) {
            logger.debug('commit execution');
            var deferred = $q.defer();
            deferred.resolve(frameworkMetaData);
            service.schemaInterpolation.finalizedFrameworkMetaData.push(frameworkMetaData);
            service.schemaInterpolation.finalizeHandler();
            return deferred.promise;
        };

        service.schemaInterpolation.finalizeHandler = function () {
            try {
                if (service.schemaInterpolation.fieldMetaData.length === (service.schemaInterpolation.finalizedFrameworkMetaData.length + service.schemaInterpolation.skippedFrameworkMetaData.length)
                    && service.schemaInterpolation.successCallBack !== undefined) {
                    var length = service.schemaInterpolation.finalizedFrameworkMetaData.length;
                    service.schemaInterpolation.finalizedFrameworkMetaData[length - 1].isLastContainer = true;
                    service.schemaInterpolation.finalizedFrameworkMetaData[length - 1].isLastForm = true;
                    service.schemaInterpolation.finalizedFrameworkMetaData[0].isFirstForm = true;
                    service.domainLookup = service.schemaInterpolation.domainLookup;
                    service.schemaInterpolation.successCallBack(service.schemaInterpolation.finalizedFrameworkMetaData);
                }
            } catch (reason) {
                service.schemaInterpolation.notifyOnException(false, true, service.schemaInterpolation.notificationEngine.interpolation.generalMessage, reason);
            }
        };
        //</editor-fold>

        service.schemaInterpolation.executeHandler = function (ruleCollection, fieldMetaData) {
            _.each(ruleCollection, function (ruleEngine) {
                ruleEngine(fieldMetaData);
            })
        };

        service.schemaInterpolation.performMetaDataInterpolation = function (fieldMetaData,semaphoreCollection,successCallBack,errorCallback,configurations) {
            logger.debug('performMetaDataInterpolation execution');

            service.schemaInterpolation.additionalElementCollection = [];
            service.schemaInterpolation.coreDependencyBucket = [];
            service.schemaInterpolation.indexOfFieldGroup = 0;
            service.schemaInterpolation.definitionHandler = [];
            service.schemaInterpolation.errorCallback = errorCallback;
            service.schemaInterpolation.fieldHandler = [];
            service.schemaInterpolation.fieldMetaData = fieldMetaData;
            service.schemaInterpolation.finalizedFrameworkMetaData = [];
            service.schemaInterpolation.frameworkMetaData = [];
            service.schemaInterpolation.constructors = [];
            service.schemaInterpolation.sectionHandler = [];
            service.schemaInterpolation.semaphoreCollection = semaphoreCollection;
            service.schemaInterpolation.skippedFrameworkMetaData = [];
            service.schemaInterpolation.spliceOffsetCollection = [];
            service.schemaInterpolation.successCallBack = successCallBack;
            service.schemaInterpolation.configurations = configurations;

            // inject rules
            service.schemaInterpolation.constructors.push(service.schemaInterpolation.metadataConstructor);
            service.schemaInterpolation.constructors.push(service.schemaInterpolation.domainLookupConstructor);

            // Facilitate Angular Form
            service.schemaInterpolation.definitionHandler.push(service.schemaInterpolation.schemaDetermination);
            service.schemaInterpolation.definitionHandler.push(service.schemaInterpolation.formDetermination);
            // Conclude Interpolation
            service.schemaInterpolation.definitionHandler.push(service.schemaInterpolation.fieldGroupCommit);

            // Accumulate mandatory field
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.mandatoryFieldExecuter);
            // Accumulate field
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.assembleFieldName);
            // Prototype definition of field
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.protoTypeBuilder);
            // build validation messages
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.validationSummaryBuilder);
            // Ng Model & custom field rules
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.domainValidator);
            // List mapping
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.domainLookupMap);

            // Last form specification
            if (service.schemaInterpolation.semaphoreCollection.isLastFormSpecificationRuleApplicable) {
                service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.lastFieldGroupBuilder);
            }
            // Action
            service.schemaInterpolation.fieldHandler.push(service.schemaInterpolation.fieldGroupActionDisableSemaphore);

            // insert additional elements
            service.schemaInterpolation.sectionHandler.push(service.schemaInterpolation.additionalElementInsertion);
            // remove dirty elements
            service.schemaInterpolation.sectionHandler.push(service.schemaInterpolation.dirtyElementRemoval);
            //For LCP as modal change the field length by overwriting class provided in JSON
            service.schemaInterpolation.sectionHandler.push(service.schemaInterpolation.changeSectionClass);

            //execute pre-rules
            service.schemaInterpolation.executeHandler(service.schemaInterpolation.constructors, fieldMetaData);

        };
    }

    function constructAngularSchemaObserverService(service, logger, $q, $timeout, candidate, LinkedList, CandidateWorkFlow, ApplicationState, $rootScope, privateCandidate) {
        // <editor-fold desc="constructor">
        service.angularSchemaObserver = {
            fieldGroupCollection          : [],
            gridDataSourceCollection: [],
            instanceMemberCollection: {},
            notificationEngine      : {
                Grid          : {
                    invalidConfig : 'Invalid configuration we are not able to process your request. Please contact administrator.',
                    dataSourceLoad: 'Something went wrong, we are not able to load data. Please try again later.'
                },
                notImplemented: 'Processor is not implemented. We are not able to process your request.',
                generalMessage: 'Something went wrong, we are not able to process your request. Please try again later.'
            },
            transactionMode         : {
                Insert: 0,
                Update: 1
            },
            core                    : {
                table: 'candidate',
                field: 'uname',
		onBoarding: {
                    editModeTable: ["candidate"],
                    fieldGroupSubmitParams: {
                        scopeMembers: {
                            isOfflineStorage: false
                        }
                    }
                }
            },
            formStyleHandler        : {
                viewStylesEnum: {
                    none     : 0,
                    accordion: 1,
                    slide    : 2,
                    modal    : 3
                },
                viewStyle     : 0,
                utility       : {
                    getGridColumnWidth: function (columnCount) {
                        var _response = {
                            columnSize: 0,
                            reminder  : 0
                        };
                        switch (columnCount) {
                            case 1:
                                _response.columnSize = columnCount;
                                break;
                            case 2:
                                _response.columnSize = 6;
                                break;
                            case 3:
                                _response.columnSize = 4;
                                break;
                            case 4:
                                _response.columnSize = 3;
                                break;
                            case 5:
                                _response.columnSize = 2;
                                _response.reminder = 2;
                                break;
                            case 6:
                                _response.columnSize = 2;
                                break;
                            default:
                                _response.columnSize = 1;
                                break;
                        }
                        return _response;
                    }
                },
                progressBar   : {
                    enabled                : false,
                    cssClassEnum           : {
                        active  : 'active',
                        disabled: 'disabled',
                        complete: 'complete'
                    },
                    utility                : {
                        defaultClass   : '',
                        reminder       : 0,
                        reminderClass  : '',
                        setDefaultClass: function (formCount) {
                            var _response = service.angularSchemaObserver.formStyleHandler.utility.getGridColumnWidth(formCount);
                            service.angularSchemaObserver.formStyleHandler.progressBar.utility.defaultClass = 'col-md-' + _response.columnSize + ' col-sm-' + _response.columnSize + ' col-xs-' + _response.columnSize + ' bs-wizard-step';
                            service.angularSchemaObserver.formStyleHandler.progressBar.utility.reminder = _response.reminder;
                            service.angularSchemaObserver.formStyleHandler.progressBar.utility.reminderClass = 'col-md-' + _response.reminder + ' col-sm-' + _response.reminder + ' col-xs-' + _response.reminder;
                        }
                    },
                    getStepClass           : function (index) {
                        var form = service.angularSchemaObserver.getFormByIndex(index - 1);
                        if (form !== null) {
                            return service.angularSchemaObserver.formStyleHandler.progressBar.utility.defaultClass + ' ' + form.formStyle.progressBar.class;
                        } else {
                            return service.angularSchemaObserver.formStyleHandler.progressBar.utility.defaultClass + ' ' + service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.disabled;
                        }
                    },
                    getReminderClass       : function () {
                        return service.angularSchemaObserver.formStyleHandler.progressBar.utility.reminderClass;
                    },
                    switchTo               : function (index) {
                        var form = service.angularSchemaObserver.getFormByIndex(index - 1);
                        if (form !== null && form.editModel === true) {
                            service.angularSchemaObserver.showFieldGroup(form);
                        }
                    },
                    isFormCompleted        : function (index) {
                        var form = service.angularSchemaObserver.getFormByIndex(index - 1);
                        if (form !== null) {
                            return (form.formStyle.progressBar.class === service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.complete || form.formStyle.progressBar.class === service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.disabledForComplete);
                        } else {
                            return false;
                        }
                    },
                    toggleIndicatorCssClass: function (form) {
                        var _form = form;
                        while (_form.nextFieldGroup !== undefined && _form.nextFieldGroup !== null) {
                            _form.nextFieldGroup.formStyle.progressBar.class = service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.disabled;
                            if (_form.nextFieldGroup.editModel === false) {
                                break;
                            }
                            _form = _form.nextFieldGroup;
                        }
                        _form = form;
                        while (_form.previousFieldGroup !== undefined && _form.previousFieldGroup !== null) {
                            if (_form.previousFieldGroup.editModel === true) {
                                _form.previousFieldGroup.formStyle.progressBar.class = service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.complete;
                            } else {
                                break;
                            }
                            _form = _form.previousFieldGroup;
                        }
                    }
                },
                grid          : {
                    viewStyle: 0,
                    utility  : {
                        getGridColumnSize: function (columnCount) {
                            var _response = service.angularSchemaObserver.formStyleHandler.utility.getGridColumnWidth(columnCount);
                            if (_response.reminder === 0) {
                                _response.columnSize--;
                            }
                            return 'col-md-' + _response.columnSize + ' col-sm-10 ' + ' col-xs-10'
                        }
                    }
                },
                modal : {
                    scrollbarCSSClass : "modal-popup-scroll-container"
                }
            }
        };

        service.angularSchemaObserver.registerExternalJob = function (job) {
            service.angularSchemaObserver.externalJob = job;
        };

        service.angularSchemaObserver.notifyOnException = function (semaphoreProgressBar, isNotifyUI, notificationMessage, reason) {
            if (reason !== undefined) {
                logger.error(reason);
            }
            service.angularSchemaObserver.semaphoreCollection.progressBar(semaphoreProgressBar);
            service.angularSchemaObserver.semaphoreCollection.notificationMessage(isNotifyUI, notificationMessage);
        };

        service.angularSchemaObserver.instantiate = function (fieldGroupCollection, viewModelProcessor,semaphoreCollection,candidateIdSupplier,candidateParameterSupplier,lastFormConfirmationHandler) {
            this.fieldGroupCollection = [];
            this.gridDataSourceCollection = [];
            this.schemaDefinitionCollection = fieldGroupCollection;
            this.viewModelProcessor = viewModelProcessor;
            this.semaphoreCollection = semaphoreCollection;
            this.candidateIdSupplier = candidateIdSupplier;
            this.candidateParameterSupplier = candidateParameterSupplier;
            this.lastFormConfirmationHandler = lastFormConfirmationHandler;
            // seed data
            service.angularSchemaObserver.formStyleHandler.progressBar.utility.setDefaultClass(fieldGroupCollection.length);
        };

        //</editor-fold>

        //<editor-fold desc="Model broadcast / mediator channel">

        service.angularSchemaObserver.notifyBlurEventListener = function (data, fieldKey) {
            try {
                var deferred = $q.defer();
                var _form = service.angularSchemaObserver.getBlurEventListener(fieldKey)[0];
                if (_form !== undefined && _form.blurEventListeners !== undefined) {
                    var _blurProcessor = _form[_form.blurEventListeners[fieldKey].handler];
                    if (_blurProcessor !== undefined) {
                        return _blurProcessor(data, service.angularSchemaObserver.semaphoreCollection.progressBar, candidate)
                    }
                } else {
                    deferred.resolve(0);
                }
                return deferred.promise;
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.notImplemented, reason);
            }
        };

        //</editor-fold>

        //<editor-fold desc="filters">

        service.angularSchemaObserver.getForm = function (title) {
            try {
                return _.findWhere(this.fieldGroupCollection, {title: title});
            }catch(reason){
                service.angularSchemaObserver.notifyOnException(false,true,service.angularSchemaObserver.notificationEngine.generalMessage,reason);
            }
        };

        service.angularSchemaObserver.getFormByTable = function (table) {
            try {
                return _.findWhere(this.fieldGroupCollection, {table: table});
            }catch(reason){
                service.angularSchemaObserver.notifyOnException(false,true,service.angularSchemaObserver.notificationEngine.generalMessage,reason);
            }
        };

        service.angularSchemaObserver.getAllFormByTable = function (table) {
            try {
                return _.filter(this.fieldGroupCollection, {table: table});
            }catch(reason){
                service.angularSchemaObserver.notifyOnException(false,true,service.angularSchemaObserver.notificationEngine.generalMessage,reason);
            }
        };

        service.angularSchemaObserver.getFormByAnyFieldName = function (fieldName) {
            try {
                var _filteredForm = {};
                for (var index = 0; index < this.fieldGroupCollection.length; index++) {
                    if (this.fieldGroupCollection[index].fieldNameCollection.indexOf(fieldName) >= 0) {
                        _filteredForm.form = this.fieldGroupCollection[index];
                        break;
                    }
                }
                return _filteredForm
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.getFormByIndex = function (index) {
            try {
                var _filteredForm = null;
                if(this.fieldGroupCollection !== undefined && (this.fieldGroupCollection.length - 1) >= index){
                    _filteredForm = this.fieldGroupCollection[index];
                }
                if (_filteredForm === undefined) {
                    _filteredForm = null;
                }
                return _filteredForm;
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.getBlurEventListener = function (fieldKey) {
            try {
                return _.where(this.fieldGroupCollection, function (form) {
                    if (form.blurEventListeners === undefined) {
                        return false;
                    } else {
                        return (form.blurEventListeners[fieldKey] !== undefined)
                    }
                });
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.isAllFormValid = function(currentFieldGroup){
            var _response = {
                form        : null,
                invalidForms: [],
                returnState : false
            };
            try {
                for (var index = 0; index < this.fieldGroupCollection.length; index++) {
                    if (this.fieldGroupCollection[index].title !== currentFieldGroup.title) {
                        _response.form = this.fieldGroupCollection[index];
                        if(_response.form.externalComponent !== undefined){
                            _response.returnState = _response.form.externalComponent.submitActionSemaphore();
                        } else if (_response.form.gridEnabled === true) {
                            if (_response.form.gridHandler !== undefined) {
                                _response.returnState = _response.form.gridHandler.hasMinimumRowFilled();
                            }
                        } else {
                            _response.returnState = _response.form.submitActionSemaphore();
                        }
                        if (_response.returnState === false) {
                            _response.invalidForms.push(_response.form.title);
                        }
                    }
                }
                _response.returnState = _response.invalidForms.length === 0;
                if (_response.returnState === true) {
                    _response.form = null;
                }
                return _response;
            } catch (reason) {
                _response.returnState = false;
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.getTransactionMode = function(currentFieldGroup) {
            var _response = {
                transactionMode: service.angularSchemaObserver.transactionMode.Insert,
                returnState    : true
            };
            try {
                // tables like candidate are always on edit mode for onBoarding.
                if(service.angularSchemaObserver.semaphoreCollection.onBoarding === true){
                    var _index = service.angularSchemaObserver.core.onBoarding.editModeTable.indexOf(currentFieldGroup.table);
                    if(_index >= 0){
                        _response.transactionMode = service.angularSchemaObserver.transactionMode.Update;
                        return _response;
                    }
                }
                var _collection = service.angularSchemaObserver.getAllFormByTable(currentFieldGroup.table);
                for (var index = 0; index < _collection.length; index++) {
                    var form = _collection[index];
                    if (form.title !== currentFieldGroup.title) {
                        if(form.editModel === true){
                            _response.transactionMode = service.angularSchemaObserver.transactionMode.Update;
                            break;
                        }
                    }
                }
                return _response;
            } catch (reason) {
                _response.returnState = false;
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
                return _response;
            }
        };

        service.angularSchemaObserver.isCustomParserContainsField  = function(fieldName,customParserDefinition){
              var _mappedFields =  _.findWhere(customParserDefinition,{groupBy : "mappedFields"});
              if(_mappedFields){
                  return _.contains(_mappedFields.fieldCollection ,fieldName);
              }else{
                  return false;
              }
        };
        //</editor-fold>

        // <editor-fold desc = "Transaction QUEUE"
        service.angularSchemaObserver.buildTransactionQueue = function (tableSchema, baseTable, fieldNameCollection, programmaticModel) {
            try {
                if (baseTable === 'answers') {
                    return;
                }
                var _linkedTransaction = new LinkedList();
                var _isHeadTran = true;
                var _currentTransaction;
                var _keyField = null;
                var _modelProcessor;
                if (tableSchema !== undefined && angular.isArray(tableSchema)) {
                    for (var index = 0; index < tableSchema.length; index++) {
                        var _fieldCollection = tableSchema[index].fields;
                        if (angular.isArray(_fieldCollection)) {
                            _keyField = null;
                            _modelProcessor = service.angularSchemaObserver.viewModelProcessor[tableSchema[index].name];
                            if (_modelProcessor !== undefined) {
                                _keyField = _modelProcessor.keyField;
                            }
                            _currentTransaction = {
                                fieldNameCollection               : _fieldCollection,
                                isCandidateIdRequired             : (tableSchema[index].name !== service.angularSchemaObserver.core.table && tableSchema[index].name !== "candidate_subscription"),
                                isUNameRequired                   : (tableSchema[index].name === 'candidate_subscription'),
                                keyField                          : _keyField,
                                table                             : tableSchema[index].name,
                                transactionIsolated               : _isHeadTran,
                                transactionMode                   : service.angularSchemaObserver.transactionMode.Insert,
                                fieldCustomParserDefinition       : service.angularSchemaObserver.structureFieldCustomParserDefinition(tableSchema[index].fieldCustomParserDefinition)
                            };
                            programmaticModel[tableSchema[index].name] = {};
                            _linkedTransaction.add(angular.copy(_currentTransaction));
                            _isHeadTran = false;
                        }
                    }
                } else {
                    _modelProcessor = service.angularSchemaObserver.viewModelProcessor[baseTable];
                    if (_modelProcessor !== undefined) {
                        _keyField = _modelProcessor.keyField;
                    }
                    _currentTransaction = {
                        fieldNameCollection               : fieldNameCollection,
                        isCandidateIdRequired             : (baseTable !== service.angularSchemaObserver.core.table),
                        isUNameRequired                   : (baseTable === 'candidate_subscription'),
                        keyField                          : _keyField,
                        table                             : baseTable,
                        transactionIsolated               : _isHeadTran,
                        transactionMode                   : service.angularSchemaObserver.transactionMode.Insert,
                        fieldCustomParserDefinition       : []
                    };
                    programmaticModel[baseTable] = {};
                    _linkedTransaction.add(angular.copy(_currentTransaction));
                }
                return _linkedTransaction;
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.structureFieldCustomParserDefinition  = function(fieldCustomParserDefinition){
            if( typeof(fieldCustomParserDefinition) !== "undefined") {
                var _mappedField = _.pluck(fieldCustomParserDefinition, "mappedFields");
                var _unionMappedField = [];
                for (var index = 0; index < _mappedField.length; index++) {
                    if (typeof(_mappedField[index]) !== "undefined") {
                        _unionMappedField = _.uniq(_unionMappedField.concat(_mappedField[index]));
                    }
                }
                fieldCustomParserDefinition.push({groupBy : "mappedFields" ,  fieldCollection : _unionMappedField })
            }
            return fieldCustomParserDefinition;
        };

        //</editor-fold>

        // <editor-fold desc = "Register"
        service.angularSchemaObserver.registerNgModel = function (ngModel) {
            try {
                var _formElement = service.angularSchemaObserver.getFormByAnyFieldName(ngModel.$name);
                if (_formElement.form !== undefined) {
                    _formElement.form.currentFieldGroup = ngModel.$$parentForm;
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.registerExternalValidator = function (validPredictor, formIndex) {
            try {
                var _form = service.angularSchemaObserver.getFormByIndex(parseInt(formIndex));
                if (_form !== undefined) {
                    _form.registerExternalValidator(validPredictor);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, false, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.registerForm = function (form) {
            try {
                var _form = service.angularSchemaObserver.getForm(form.title);
                if (_form === undefined) {
                    form.nextFieldGroup = null;
                    form.previousFieldGroup = null;
                    var _fieldGroupCollection = service.angularSchemaObserver.fieldGroupCollection;
                    form.transactionQueue = service.angularSchemaObserver.buildTransactionQueue(form.tableMap, form.table, form.fieldNameCollection,form.programmaticModel);
                    form.getNextTransaction();
                    form.editModel = false;
                    if(form.isPartialSave !== undefined && form.isPartialSave === true) {
                        service.angularSchemaObserver.resetModelState(form);
                    }
                    _fieldGroupCollection.push(form);
                    if (_fieldGroupCollection.length > 1) {
                        var previousFieldGroup = _fieldGroupCollection[_fieldGroupCollection.length - 2];
                        previousFieldGroup.nextFieldGroup = form;
                        form.previousFieldGroup = previousFieldGroup;
                    } else if (_fieldGroupCollection.length === 1) {
                        form.blurEventListeners = {
                            uname: {
                                handler: ["uNameOnBlur"]
                            },
                            zip  : {
                                handler: ["setZeoCode"]
                            }
                        };
                        form.hide = false;
                        service.angularSchemaObserver.onFormActive(form)
                    }
                }
                if (service.angularSchemaObserver.schemaDefinitionCollection.length === service.angularSchemaObserver.fieldGroupCollection.length) {
                    service.angularSchemaObserver.viewModelProcessor.globalConstructor.initialize();
                    service.angularSchemaObserver.fieldGroupCollection[0].populateForm(service.angularSchemaObserver.onPreLoadComplete);
                    if(_XC_CONFIG.form_naming_enabled === true){
                        service.angularSchemaObserver.setFormURLVariable(service.angularSchemaObserver.fieldGroupCollection[0]); // FOR FIRST FORM
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.registerGrid = function (grid) {
            try {
                var rootCause = '';
                var _form = service.angularSchemaObserver.getForm(grid.parentFormTitle);
                if (_form === undefined || _form.gridConfiguration === undefined) {
                    rootCause = '';
                    if (_form !== undefined) {
                        rootCause += _form.parentFormTitle + ':';
                    }
                    rootCause += service.angularSchemaObserver.notificationEngine.Grid.invalidConfig;
                    service.schemaInterpolation.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.Grid.invalidConfig, rootCause);
                    return;
                }
                var registerDelegate = service.angularSchemaObserver.viewModelProcessor[grid.table].registerGridConfiguration;
                if (registerDelegate !== undefined) {
                    grid.modelHandler = registerDelegate(_form.gridConfiguration, _form.fieldDefinition);
                    grid.parent = _form;
                    _form.gridHandler = grid;
                } else {
                    rootCause = _form.parentFormTitle + ':' + service.angularSchemaObserver.notificationEngine.notImplemented;
                    service.schemaInterpolation.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.notImplemented, rootCause);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.registerExternalComponent = function (externalComponent) {
            try {
                var _form = service.angularSchemaObserver.getFormByTable(externalComponent.table);
                if (_form !== undefined) {
                    externalComponent.angularSchemaFormContainer = _form;
                    _form.externalComponent = externalComponent;
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.unRegisterExternalComponent = function (externalComponent) {
            var _form = service.angularSchemaObserver.getFormByTable(externalComponent.table);
            if (_form !== undefined) {
                _form.isShowComponent = false;
                delete _form.externalComponent;
                _form.previousFieldGroup.nextFieldGroup = _form.nextFieldGroup;
            }
        };
        //</editor-fold>

        //<editor-fold desc="Action observer">

        service.angularSchemaObserver.notifyOnAction = function (form, transaction) {
            try {
                switch (transaction.transactionMode) {
                    case service.angularSchemaObserver.transactionMode.Insert:
                        service.angularSchemaObserver.createHandler(form, transaction);
                        break;
                    case service.angularSchemaObserver.transactionMode.Update:
                        service.angularSchemaObserver.updateHandler(form, transaction);
                        break;
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };


        service.angularSchemaObserver.notifyOnRetrieve = function (form, transaction, callerIdentity) {
            try {
                var _modelProcessor = service.angularSchemaObserver.viewModelProcessor[transaction.table];
                if (_modelProcessor !== undefined) {
                    _modelProcessor.retrieve(form, service.angularSchemaObserver.loadModel, callerIdentity);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.createHandler = function (form, transaction) {
            try {
                if (service.angularSchemaObserver.hasRowCapacity(form) === false) {
                    service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                    return;
                }
                var _modelProcessor = service.angularSchemaObserver.viewModelProcessor[transaction.table];
                if (_modelProcessor !== undefined) {
                    _modelProcessor.submit(form, transaction);
                } else {
                    service.angularSchemaObserver.viewModelProcessor.baseHelper.submit(form, transaction);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.updateHandler = function (form, transaction) {
            try {
                var _modelProcessor = service.angularSchemaObserver.viewModelProcessor[transaction.table];
                if (_modelProcessor !== undefined) {
                    _modelProcessor.update(form, transaction);
                } else {
                    service.angularSchemaObserver.viewModelProcessor.baseHelper.update(form, transaction);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.resetModelHandler = function (form, table) {
            try {
                service.angularSchemaObserver.viewModelProcessor.baseHelper.gridFormHandler.resetFormModel(form);
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.onFormActive = function (form) {
            try {
                service.angularSchemaObserver.formStyleHandler.progressBar.toggleIndicatorCssClass(form);
                form.formStyle.progressBar.class = service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.active;
                service.angularSchemaObserver.activeForm = form;
                if(_XC_CONFIG.form_naming_enabled === true) {
                    service.angularSchemaObserver.setFormURLVariable(form);
                }
                if (form.replicate !== undefined && form.replicate === true) {
                    service.angularSchemaObserver.replicateModel({
                        table    : form.table,
                        editModel: true
                    }, form.indexOfForm, form.fieldNameCollection, form.model);
                }
                form.setKeyElementFocus();
                form.onFormActive();

            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.DashboardUpdateAllFormData = function (_currentFieldGroup, _PNextFieldGroup) {
            try {
                if(service.angularSchemaObserver.formStyleHandler.viewStyle === 5){
                    service.angularSchemaObserver.replicateModel({
                        table: _currentFieldGroup.table
                    }, _currentFieldGroup.indexOfForm, _currentFieldGroup.fieldNameCollection, _currentFieldGroup.model, true);

                    var candidateObj = ApplicationState.session.candidate.get();

                    var activityData = "Your Talent Profile is updated on [created_datetime]. <a href='/profile/edit' class='action'>View Profile »</a>";

                    if (candidateObj) {
                        var addActivity = {
                            candidateId      : candidateObj.candidateId,
                            contextId        : candidateObj.candidateId,
                            contextType      : 'candidate',
                            type             : 'summary',
                            status           : 'created',
                            activityData     : activityData.toString(),
                            createdDatetime  : new Date().getTime()
                        };
                        privateCandidate.addCandidateActivity(addActivity).$promise.then(function (results) {
                            $rootScope.$broadcast(BROAD_CAST_NAMESPACE.GET_CANDIDATE_ACTIVITY, true, candidateObj);
                        }, function (reason) {
                            service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
                        });
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        if(_XC_CONFIG.form_naming_enabled === true) {
            service.angularSchemaObserver.setFormURLVariable = function (form) {
                form.onFormActive(CandidateWorkFlow.current.URLVariable());
            };
        }

        service.angularSchemaObserver.onFormLostFocus = function (form) {
            try {
                form.hide = true;
                //form.formStyle.progressBar.class = service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.complete;
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.onFormComplete = function (form) {
            try {
                form.editModel = true;
                form.formStyle.progressBar.class = service.angularSchemaObserver.formStyleHandler.progressBar.cssClassEnum.complete;

            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.showFieldGroup = function (currentFieldGroup,semaphoreForSenderForm) {
            try {
                if (service.angularSchemaObserver.activeForm.semaphoreForSenderForm === true) {
                    currentFieldGroup.semaphoreForSenderForm = true;
                } else if (currentFieldGroup.indexOfForm < service.angularSchemaObserver.activeForm.indexOfForm) {
                    service.angularSchemaObserver.senderForm = service.angularSchemaObserver.activeForm;
                    currentFieldGroup.semaphoreForSenderForm = (semaphoreForSenderForm === undefined ? true : semaphoreForSenderForm);
                } else {
                    currentFieldGroup.semaphoreForSenderForm = false;
                    service.angularSchemaObserver.activeForm.semaphoreForSenderForm = false;
                }
                service.angularSchemaObserver.onFormLostFocus(service.angularSchemaObserver.activeForm);
                currentFieldGroup.hide = false;
                service.angularSchemaObserver.onFormActive(currentFieldGroup);
                if (currentFieldGroup.gridEnabled) {
                    service.angularSchemaObserver.externalDataSourcePreLoad(currentFieldGroup);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.offlineSave = function (currentFieldGroup) {
            var deferred = $q.defer();
            if (service.angularSchemaObserver.hasMinimumRowFilled(currentFieldGroup) === false) {
                deferred.resolve(0);
                service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                return deferred.promise;
            }
            if (currentFieldGroup.isLastForm !== true) {
                if (currentFieldGroup.nextFieldGroup !== undefined) {
                    var _nextFieldGroup = currentFieldGroup.nextFieldGroup;
                    service.angularSchemaObserver.onFormLostFocus(currentFieldGroup);
                    _nextFieldGroup.hide = false;
                    service.angularSchemaObserver.onFormActive(_nextFieldGroup);
                    deferred.resolve(0);
                    return deferred.promise;
                }else{
                    service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                    deferred.resolve(0);
                    return deferred.promise;
                }
            }else{
                if(service.angularSchemaObserver.lastFormConfirmationHandler !== undefined){
                    service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                    service.angularSchemaObserver.lastFormConfirmationHandler(service.angularSchemaObserver.finalSubmit,currentFieldGroup);
                }else{
                    service.angularSchemaObserver.finalSubmit(currentFieldGroup);
                }
                deferred.resolve(0);
            }
            return deferred.promise;
        };

        service.angularSchemaObserver.finalSubmit = function(currentFieldGroup,callBack){
            try {
                if(callBack !== undefined){
                    currentFieldGroup.finalSubmitCallBack = callBack;
                }else{
                    delete currentFieldGroup.finalSubmitCallBack;
                }
                // iterate all form to submit
                service.angularSchemaObserver.fieldGroupCollection[0].programmaticSubmit(service.angularSchemaObserver.core.onBoarding.fieldGroupSubmitParams);
            }catch (reason){
                // Restore offline storage state on error.
                angular.forEach(service.angularSchemaObserver.fieldGroupCollection, function (fieldGroupInstance) {
                    fieldGroupInstance.isOfflineStorage = true;
                });
                service.angularSchemaObserver.notifyOnException(false,true,service.angularSchemaObserver.notificationEngine.generalMessage,reason);
            }
        };

        service.angularSchemaObserver.showNextFieldGroup = function (currentFieldGroup) {
            try {
                var deferred = $q.defer();
                if (service.angularSchemaObserver.hasMinimumRowFilled(currentFieldGroup) === false) {
                    deferred.resolve(0);
                    service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                    return deferred.promise;
                }
                currentFieldGroup.onTransactionSuccess();
                var _transaction = currentFieldGroup.getNextTransaction();
                if ((_transaction === null) && currentFieldGroup.onCompleteHandler === undefined) {
                    if (currentFieldGroup.isLastForm === true) {
                        try {
                            if(typeof currentFieldGroup.isPartialSave !== "undefined" && typeof currentFieldGroup.isOfflineStorage !== "undefined" && currentFieldGroup.isPartialSave !== false && currentFieldGroup.isOfflineStorage !== true){
                                // offline storage
                                service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                                if (currentFieldGroup.finalSubmitCallBack !== undefined) {
                                    currentFieldGroup.finalSubmitCallBack({
                                        result: {
                                            parentId  : currentFieldGroup.parentId,
                                            headIndex : currentFieldGroup.headIndex,
                                            hasSuccess: true
                                        }
                                    })
                                }
                                deferred.resolve(0);
                                return deferred.promise;
                            }else{
                                // Connected storage
                                return service.angularSchemaObserver.viewModelProcessor.baseHelper.lastFormHandler(currentFieldGroup);
                            }
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                            service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                        }
                    } else {
                        var _nextFieldGroup;
                        service.angularSchemaObserver.onFormComplete(currentFieldGroup);
                        if(currentFieldGroup.isPartialSave !== true) {
                            service.angularSchemaObserver.onFormLostFocus(currentFieldGroup);
                            currentFieldGroup.uNameEditable = !currentFieldGroup.editModel;
                            if (currentFieldGroup.nextFieldGroup !== undefined) {
                                _nextFieldGroup = currentFieldGroup.nextFieldGroup;
                                if (currentFieldGroup.semaphoreForSenderForm !== undefined && currentFieldGroup.semaphoreForSenderForm === true) {
                                    _nextFieldGroup = service.angularSchemaObserver.senderForm;
                                    currentFieldGroup.semaphoreForSenderForm = false;
                                }
                                if (_nextFieldGroup.gridEnabled) {
                                    service.angularSchemaObserver.externalDataSourcePreLoad(_nextFieldGroup);
                                } else {
                                    service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                                }
                                _nextFieldGroup.hide = false;
                                service.angularSchemaObserver.onFormActive(_nextFieldGroup);
                                service.angularSchemaObserver.DashboardUpdateAllFormData(currentFieldGroup, _nextFieldGroup);
                                deferred.resolve(0);
                                return deferred.promise;
                            }
                            service.angularSchemaObserver.semaphoreCollection.progressBar(false);
                            deferred.resolve(0);
                            return deferred.promise;
                        }else{
                            _nextFieldGroup = currentFieldGroup.nextFieldGroup;
                            if(_nextFieldGroup !== undefined){
                                _nextFieldGroup.programmaticSubmit(service.angularSchemaObserver.core.onBoarding.fieldGroupSubmitParams);
                            }
                            deferred.resolve(0);
                            return deferred.promise;
                        }
                    }
                } else {
                    service.angularSchemaObserver.onFormComplete(currentFieldGroup);
                    if ((_transaction === null)) {
                        currentFieldGroup.onCompleteHandler(currentFieldGroup);
                    } else {
                        service.angularSchemaObserver.notifyOnAction(currentFieldGroup, _transaction);
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.editRow = function (grid, rowModel) {
            try {
                var _form = service.angularSchemaObserver.getForm(grid.parentFormTitle);
                $timeout(function (inputModel, fieldGroupInstance) {
                    fieldGroupInstance.initiateTransaction();
                    service.angularSchemaObserver.viewParser(fieldGroupInstance.filter.getFieldParserDefinition(), fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, fieldGroupInstance.model, inputModel, grid.modelHandler);
                }, 250, true, rowModel, _form)
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.deleteRow = function (grid, input) {
            try {
                var form = service.angularSchemaObserver.getForm(grid.parentFormTitle);
                service.angularSchemaObserver.viewModelProcessor[grid.table].delete(form, input);
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.hasMinimumRowFilled = function (currentFieldGroup) {
            try {
                if (currentFieldGroup.gridEnabled !== true) {
                    return true;
                } else {
                    return currentFieldGroup.gridHandler.hasMinimumRowFilled();
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.hasRowCapacity = function (currentFieldGroup) {
            try {
                if (currentFieldGroup.gridEnabled !== true) {
                    return true;
                } else {
                    return currentFieldGroup.gridHandler.hasRowCapacity();
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        //</editor-fold>

        //<editor-fold desc="Data load observer">

        service.angularSchemaObserver.onPreLoadComplete = function (form) {
            try {
                delete form.onPreLoadComplete;
                angular.forEach(service.angularSchemaObserver.fieldGroupCollection, function (fieldGroupInstance) {
                    if (fieldGroupInstance.table !== service.angularSchemaObserver.core.table) {
                        var _formController = service.angularSchemaObserver.viewModelProcessor[fieldGroupInstance.table];
                        if (_formController !== undefined) {
                            if (_formController.initialize !== undefined) {
                                if (fieldGroupInstance.gridEnabled) {
                                    _formController.initialize(fieldGroupInstance, service.angularSchemaObserver.dataSourceLoader);
                                } else {
                                    _formController.initialize(fieldGroupInstance, service.angularSchemaObserver.loadModel);
                                }
                            }
                        } else {
                            service.angularSchemaObserver.viewModelProcessor.baseHelper.initialize();
                        }
                    }
                });
                form.setKeyElementFocus();
                if (service.angularSchemaObserver.semaphoreCollection.startup && service.angularSchemaObserver.semaphoreCollection.startup.openGDPR) {
                    service.angularSchemaObserver.semaphoreCollection.startup.openGDPR();
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.loadModel = function (model, form, editModel, uNameEditable, validateOnPopulation, callerIdentity) {
            try {
                if (angular.isArray(model)) {
                    if (model.length > 0) {
                        model = model[0];
                    } else {
                        model = null;
                    }
                }
                var _currentTran = form.getCurrentTransaction();
                if (_currentTran.transactionIsolated === true) {
                    var collection = _.filter(service.angularSchemaObserver.fieldGroupCollection, {table: form.table});
                    for (var index = 0; index < collection.length; index++) {
                        var fieldGroupInstance = collection[index];
                        var _formTran = fieldGroupInstance.getCurrentTransaction();
                        if(_formTran === null){
                            fieldGroupInstance.initiateTransaction();
                        }
                        if (editModel !== undefined) {
                            fieldGroupInstance.editModel = editModel;
                        } else {
                            fieldGroupInstance.editModel = true;
                        }
                        if (uNameEditable !== undefined) {
                            fieldGroupInstance.uNameEditable = uNameEditable;
                        } else {
                            fieldGroupInstance.uNameEditable = !fieldGroupInstance.editModel;
                        }
                        service.angularSchemaObserver.modelParser(model, fieldGroupInstance, validateOnPopulation,callerIdentity);
                    }
                } else {
                    service.angularSchemaObserver.modelParser(model, form, validateOnPopulation, callerIdentity);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.modelParser = function(model,fieldGroupInstance,validateOnPopulation,callerIdentity) {
            try {
                if (model !== null && model !== undefined && (callerIdentity !== 'socialSite') && (callerIdentity !== 'resume')) {
                    fieldGroupInstance.onTransactionSuccess();
                }
                $timeout(function (model, fieldGroupInstance) {
                    var _currentTran = fieldGroupInstance.getCurrentTransaction();
                    if (model !== null && model !== undefined) {
                        service.angularSchemaObserver.databaseToModelConverter(fieldGroupInstance.filter.getFieldCustomParserDefinition(),fieldGroupInstance.filter.getFieldParserDefinition(),fieldGroupInstance.filter.getFieldCollection(), fieldGroupInstance.fieldLookUpCollection, fieldGroupInstance.model, model, _currentTran);
                    }
                    var _nextTran = fieldGroupInstance.getNextTransaction();
                    if (_nextTran === null) {
                        if (fieldGroupInstance.isFirstForm === true && validateOnPopulation !== undefined && validateOnPopulation === true) fieldGroupInstance.validateForm(true);
                        if (fieldGroupInstance.onPreLoadComplete !== undefined) {
                            fieldGroupInstance.onPreLoadComplete(fieldGroupInstance);
                        }
                    } else {
                        service.angularSchemaObserver.notifyOnRetrieve(fieldGroupInstance, _nextTran,callerIdentity);
                    }

                }, 500, true, model, fieldGroupInstance)
            }catch(reason){
                service.angularSchemaObserver.notifyOnException(false,true,service.angularSchemaObserver.notificationEngine.generalMessage,reason);
            }
        };

        service.angularSchemaObserver.dataSourceLoader = function (modelCollection, form) {
            try {
                if (modelCollection !== null) {
                    form.editModel = true;
                    var _sourceCollection = [];
                    angular.forEach(modelCollection, function (inputModel) {
                        var _parsedModel = {};
                        service.angularSchemaObserver.databaseToModelConverter(form.filter.getFieldCustomParserDefinition(), form.filter.getFieldParserDefinition(), form.filter.getFieldCollection(), form.fieldLookUpCollection, _parsedModel, inputModel, undefined, true, form.gridHandler.modelHandler);
                        _sourceCollection.push(_parsedModel);
                    });
                    form.gridHandler.setDataSource(_sourceCollection, form.table);
                    service.angularSchemaObserver.saveModelState(form);
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.replicateModel = function (filter, indexOfForm, fieldCollection, targetModel, dashboardAllFormUpdate) {
            try {
                var collection = _.filter(service.angularSchemaObserver.fieldGroupCollection, filter);
                angular.forEach(collection, function (form) {
                    if(typeof dashboardAllFormUpdate !== 'undefined' && dashboardAllFormUpdate){
                        if (form.indexOfForm !== indexOfForm) {
                            targetModel = angular.merge(form.model, _.pick(targetModel, fieldCollection));
                        }
                    }
                    else if (form.indexOfForm < indexOfForm) {
                        targetModel = angular.merge(targetModel, _.pick(form.model, fieldCollection));
                    }
                });

            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.notImplemented, reason);
            }
        };

        //</editor-fold>

        //<editor-fold desc="external data source observer">

        service.angularSchemaObserver.notifyExternalDataSourceLoader = function (identity) {
            try {
                service.angularSchemaObserver.fieldGroupCollection[0].initiateTransaction();
                //The below line is a fix because of onboarding bug breaking the code
                service.angularSchemaObserver.fieldGroupCollection[0].currentForm = service.angularSchemaObserver.fieldGroupCollection[0].ngForm;
                service.angularSchemaObserver.externalDataSourcePreLoad(service.angularSchemaObserver.fieldGroupCollection[0], identity);
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.pushExternalData = function (input) {
            try {
                if (input !== undefined && input.key !== undefined && input.data !== undefined) {
                    var _dataSourceProvider = service.angularSchemaObserver.getExternalDataSource(input.key, input.identity);
                    if (_dataSourceProvider.source !== undefined) {
                        var inputDataObject = {
                            data: input.data
                        };
                        _dataSourceProvider.source = angular.extend(_dataSourceProvider.source, inputDataObject);
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.getExternalDataSource = function (modelIdentity, sourceIdentity) {
            try {
                var _modelProcessor = service.angularSchemaObserver.viewModelProcessor[modelIdentity];
                var _response = {
                    modelProcessor: _modelProcessor
                };
                if (_modelProcessor !== undefined) {
                    _response.source = _modelProcessor.externalDataSourceCollection[sourceIdentity];
                }
                return _response;
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.getPrimaryExternalDataSource = function (sourceCollection) {
            try {
                return sourceCollection[sourceCollection.primary.identity];
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.getSecondaryExternalDataSource = function (sourceCollection) {
            try {
                return sourceCollection[sourceCollection.secondary.identity];
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.externalDataSourcePreLoad = function (fieldGroupInstance,source) {
            try {
                if(angular.isArray(fieldGroupInstance.table)) {
                    angular.forEach(fieldGroupInstance.table , function(table){
                        var _dataSourceProvider = service.angularSchemaObserver.getExternalDataSource(table, source);
                        if (_dataSourceProvider.modelProcessor !== undefined) {
                            if (fieldGroupInstance.gridEnabled !== true) {
                                if (_dataSourceProvider.source.data !== undefined)
                                    service.angularSchemaObserver.loadModel(_dataSourceProvider.source.data, fieldGroupInstance, fieldGroupInstance.editModel, (source !== "socialSite" ? fieldGroupInstance.uNameEditable : false), true, source);
                            } else {
                                if (fieldGroupInstance.gridHandler.modelHandler.rowCollection.length === 0 && _dataSourceProvider.modelProcessor.externalDataInsertion !== undefined) {
                                    _dataSourceProvider.modelProcessor.externalDataInsertion(fieldGroupInstance);
                                }
                            }
                        }
                    })
                }
                else {
                    var _dataSourceProvider = service.angularSchemaObserver.getExternalDataSource(fieldGroupInstance.table, source);
                    if (_dataSourceProvider.modelProcessor !== undefined) {
                        if (fieldGroupInstance.gridEnabled !== true) {
                            service.angularSchemaObserver.loadModel(_dataSourceProvider.source.data, fieldGroupInstance, fieldGroupInstance.editModel, (source !== "socialSite" ? fieldGroupInstance.uNameEditable : false), true, source);
                        } else {
                            if (fieldGroupInstance.gridHandler.modelHandler.rowCollection.length === 0 && _dataSourceProvider.modelProcessor.externalDataInsertion !== undefined) {
                                _dataSourceProvider.modelProcessor.externalDataInsertion(fieldGroupInstance);
                            }
                        }
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };
        service.angularSchemaObserver.programmaticDataSourceInsertion = function (fieldGroupInstance) {
            try {
                var _modelProcessor = service.angularSchemaObserver.viewModelProcessor[fieldGroupInstance.table];
                if (_modelProcessor !== undefined) {
                    if (fieldGroupInstance.gridEnabled === true) {
                        if (fieldGroupInstance.gridHandler.modelHandler.rowCollection.length > 0 && _modelProcessor.externalDataInsertion !== undefined) {
                            _modelProcessor.externalDataInsertion(fieldGroupInstance);
                        }
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };


        service.angularSchemaObserver.externalDataSourceModelReset = function () {
            try {
                var fieldGroupInstance = service.angularSchemaObserver.fieldGroupCollection[0];
                if (fieldGroupInstance !== undefined && fieldGroupInstance.fieldNameCollection.indexOf(service.angularSchemaObserver.core.field) >= 0) {
                    fieldGroupInstance.model = {};
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };
        //</editor-fold>

        //<editor-fold desc="Momento">
        service.angularSchemaObserver.saveModelState = function(fieldGroupInstance){
            fieldGroupInstance.previousModelState = angular.copy(fieldGroupInstance.model);
            if(fieldGroupInstance.gridEnabled){
                fieldGroupInstance.previousModelRowCollectionState = angular.copy(fieldGroupInstance.rowCollection);
            }
        };

        service.angularSchemaObserver.saveModelStateForAll = function(){
            angular.forEach(service.angularSchemaObserver.fieldGroupCollection, function (fieldGroupInstance) {
                fieldGroupInstance.previousModelState = angular.copy(fieldGroupInstance.model);
                if (fieldGroupInstance.gridEnabled) {
                    fieldGroupInstance.previousModelRowCollectionState = angular.copy(fieldGroupInstance.rowCollection);
                }
            });
        };

        service.angularSchemaObserver.restoreModelState = function(){
            angular.forEach(service.angularSchemaObserver.fieldGroupCollection, function (fieldGroupInstance) {
                fieldGroupInstance.model = angular.copy(fieldGroupInstance.previousModelState);
                if(fieldGroupInstance.gridEnabled){
                    fieldGroupInstance.rowCollection = angular.copy(fieldGroupInstance.previousModelRowCollectionState);
                }
            });
        };

        service.angularSchemaObserver.resetModelState = function(fieldGroupInstance){
            fieldGroupInstance.hide = true;
            fieldGroupInstance.model = {};
            if(fieldGroupInstance.gridEnabled){
                fieldGroupInstance.rowCollection = [];
            }
        };
        //</editor>

        //<editor-fold desc="field parsers">

        service.angularSchemaObserver.mergeModel = function (inputModel, targetModel) {
            inputModel = angular.merge(inputModel, targetModel);
        };
        //introduced for preferences field containing all of areas of interest, preferred job title and preferred locations!
        service.angularSchemaObserver.multipleFormToSingleColumnMapping = function (formInstance, targetModel, parseMode, ApplicationState) {
            /*checking if the candidate data for the field is available*/
            var candidateData = ApplicationState.session.candidate.get();
            var modelsToAddToTargetModel = {};
            var customFieldParsers = formInstance.filter.getFieldCustomParserDefinition();
            if (typeof(customFieldParsers) !== "undefined") {
                for (var counter = 0; counter < customFieldParsers.length; counter++) {
                    var eachFieldCustomParser = customFieldParsers[counter];
                    if (eachFieldCustomParser.hasOwnProperty("mappedFields")) {
                        var fieldName = eachFieldCustomParser.field;
                        if (typeof(candidateData[fieldName]) !== "undefined") {
                            /**in case it is a logged in user don't replace the entire data
                             * instead replace only the specific data you want to save
                             * Like for preferences column don't overwrite job-search and only overwrite
                             * areaInterest from LCP**/
                            modelsToAddToTargetModel[fieldName] = angular.fromJson(candidateData[fieldName]);
                            /*checking once again in case the value field is empty*/
                            if(!modelsToAddToTargetModel[fieldName]){
                                modelsToAddToTargetModel[fieldName] = {};
                            }
                        }
                        else {
                            modelsToAddToTargetModel[fieldName] = {};
                        }
                        if (eachFieldCustomParser["mappedFields"].length !== 0) {
                            for (var i = 0; i < eachFieldCustomParser["mappedFields"].length; i++) {
                                var eachMappedField = eachFieldCustomParser["mappedFields"][i];
                                if (typeof(eachFieldCustomParser["parser"]) !== "undefined") {
                                    if (targetModel.hasOwnProperty(eachMappedField)) {
                                        modelsToAddToTargetModel[fieldName][eachMappedField] = targetModel[eachMappedField];
                                        delete targetModel[eachMappedField];
                                    }
                                }
                                else {
                                    delete targetModel[eachMappedField];
                                }
                            }
                            var _parser = service.angularSchemaObserver.viewModelProcessor.fieldParser[eachFieldCustomParser.parser];
                            if (_parser !== undefined) {
                                targetModel[eachFieldCustomParser.field] = _parser[parseMode](modelsToAddToTargetModel[eachFieldCustomParser.field]);
                            }
                        }
                    }
                }
            }
        };

        //introduced for preferences field containing araofinterest,jobtitle and location
        service.angularSchemaObserver.singleColumnToMultipleFormMapping = function (fieldCustomParserDefinition, field, _clonedInputModel, parseMode) {
            if (typeof(fieldCustomParserDefinition) !== "undefined" && fieldCustomParserDefinition !== null) {
                for (var i = 0; i < fieldCustomParserDefinition.length; i++) {
                    var eachCustomParseDefinition = fieldCustomParserDefinition[i];
                    var dbField = eachCustomParseDefinition.field;
                    if (typeof(eachCustomParseDefinition.mappedFields) !== "undefined" && eachCustomParseDefinition.mappedFields !== null) {
                        if(typeof (_clonedInputModel[dbField]) !== "undefined") {
                            var mappedFields = eachCustomParseDefinition.mappedFields;
                            for (var k = 0; k < mappedFields.length; k++) {
                                if (field === mappedFields[k]) {
                                    var _parser = service.angularSchemaObserver.viewModelProcessor.fieldParser[eachCustomParseDefinition.parser];
                                    var dataFromDB = {};
                                    if (_parser !== undefined) {
                                        dataFromDB = _parser[parseMode](_clonedInputModel[dbField]);
                                        _clonedInputModel[field] = dataFromDB[field];
                                        // for lazy bind
                                        service.angularSchemaObserver.activeForm.$broadcast(BROAD_CAST_NAMESPACE.SCHEMA_UI_SELECT_NGMODEL_PROPAGATION, _clonedInputModel[field], field);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };


        service.angularSchemaObserver.performFieldCustomParser = function (fieldCustomParserDefinition, fieldName, value, parseMode) {
            if (fieldCustomParserDefinition !== undefined) {
                var fieldParserArray = _.filter(fieldCustomParserDefinition, {field: fieldName});
                if (fieldParserArray !== undefined && fieldParserArray.length > 0) {
                    for (var index = 0; index < fieldParserArray.length; index++) {
                        var _parser = service.angularSchemaObserver.viewModelProcessor.fieldParser[fieldParserArray[index].parser];
                        if (_parser !== undefined) {
                            return _parser[parseMode](value);
                        } else {
                            return value;
                        }
                    }
                } else {
                    return value;
                }
            } else {
                return value;
            }
        };

        service.angularSchemaObserver.databaseToModelConverter = function (fieldCustomParserDefinition, fieldParserDefinition, fieldNameCollection, domainLookup, targetModel, inputModel, currentTran, isCustomParserRequired, gridModelHandler) {
            try {
                var _clonedInputModel = angular.copy(inputModel);
                angular.forEach(fieldNameCollection, function (field) {
                    if (_clonedInputModel[field] !== undefined || service.angularSchemaObserver.isCustomParserContainsField(field,fieldCustomParserDefinition)) {
                        _clonedInputModel[field] = service.angularSchemaObserver.viewModelProcessor.fieldParser["null"].defaults(_clonedInputModel[field]);
                        service.angularSchemaObserver.singleColumnToMultipleFormMapping(fieldCustomParserDefinition, field, _clonedInputModel, "fromDB");
                        _clonedInputModel[field] = service.angularSchemaObserver.performFieldCustomParser(fieldCustomParserDefinition, field, _clonedInputModel[field], "fromDB");
                        if (isCustomParserRequired === undefined || isCustomParserRequired === true) {
                            if (gridModelHandler !== undefined) {
                                _clonedInputModel[field] = service.angularSchemaObserver.viewModelProcessor.fieldParser["list"].getDisplayText(domainLookup, field, _clonedInputModel[field]);
                            }
                            var parser = service.angularSchemaObserver.viewModelProcessor.fieldParser[field];
                            if (parser === undefined) {
                                var _index = fieldParserDefinition.dateFields.indexOf(field);
                                if (_index >= 0) {
                                    parser = service.angularSchemaObserver.viewModelProcessor.fieldParser.genericDateParser;
                                }
                            }
                            if (parser !== undefined) {
                                _clonedInputModel[field] = parser.displayParser(_clonedInputModel[field],gridModelHandler !== undefined);
                            }
                        }
                        if ((targetModel[field] === undefined) || (_clonedInputModel[field] !== undefined && (_clonedInputModel[field] === null || _clonedInputModel[field].length > 0) && targetModel[field] !== _clonedInputModel[field])) {
                            targetModel = angular.extend(targetModel, _.pick(_clonedInputModel, field));
                        }
                    }
                });
                if (gridModelHandler !== undefined) {
                    targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, gridModelHandler.keyField));
                    if (gridModelHandler.additionalKeyFieldCollection !== undefined && gridModelHandler.additionalKeyFieldCollection.length > 0) {
                        targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, gridModelHandler.additionalKeyFieldCollection));
                    }
                } else {
                    //TODO: few iteration currentTran will be null need to check
                    if(currentTran === null){
                        currentTran = {};
                        currentTran.keyField = null
                    }
                    targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, currentTran.keyField));
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.viewParser = function (fieldParserDefinition, fieldNameCollection, domainLookup, targetModel, inputModel, gridModelHandler) {
            try {
                var _clonedInputModel = angular.copy(inputModel);
                angular.forEach(fieldNameCollection, function (field) {
                    _clonedInputModel[field] = service.angularSchemaObserver.viewModelProcessor.fieldParser.list.getDisplayValue(domainLookup, field, _clonedInputModel[field]);
                    var parser = service.angularSchemaObserver.viewModelProcessor.fieldParser[field];
                    if (parser === undefined) {
                        var _index = fieldParserDefinition.dateFields.indexOf(field);
                        if (_index >= 0) {
                            parser = service.angularSchemaObserver.viewModelProcessor.fieldParser.genericDateParser;
                        }
                    }
                    if (parser !== undefined) {
                        _clonedInputModel[field] = parser.viewParser(_clonedInputModel[field]);
                    }
                    targetModel = angular.extend(targetModel, _.pick(_clonedInputModel, field));
                });
                if (gridModelHandler !== undefined) {
                    targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, gridModelHandler.keyField));
                    if (gridModelHandler.additionalKeyFieldCollection !== undefined && gridModelHandler.additionalKeyFieldCollection.length > 0) {
                        targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, gridModelHandler.additionalKeyFieldCollection));
                    }
                }
            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };

        service.angularSchemaObserver.modelToDatabaseConverter = function (fieldGroupInstance, targetModel, isCustomParserRequired) {
            try {
                var _clonedInputModel = fieldGroupInstance.filter.getModel();
                angular.forEach(fieldGroupInstance.filter.getFieldCollection(), function (field) {
                    _clonedInputModel[field] = service.angularSchemaObserver.performFieldCustomParser(fieldGroupInstance.filter.getFieldCustomParserDefinition(), field, _clonedInputModel[field], "toDB");
                    if (isCustomParserRequired === undefined || isCustomParserRequired === true) {
                        var parser = service.angularSchemaObserver.viewModelProcessor.fieldParser[field];
                        if (parser === undefined) {
                            var _index = fieldGroupInstance.filter.getFieldParserDefinition().dateFields.indexOf(field);
                            if (_index >= 0) {
                                parser = service.angularSchemaObserver.viewModelProcessor.fieldParser.genericDateParser;
                            }
                        }
                        if (parser !== undefined) {
                            _clonedInputModel[field] = parser.databaseParser(_clonedInputModel[field]);
                        }
                    }
                    targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, field));
                });
                var currentTran = fieldGroupInstance.getCurrentTransaction();
                if (currentTran.isCandidateIdRequired) {
                    targetModel.candidateId = service.angularSchemaObserver.candidateIdSupplier();
                }
                if (currentTran.isUNameRequired) {
                    targetModel.email = service.angularSchemaObserver.candidateParameterSupplier('email');
                }
                if (currentTran.transactionMode === service.angularSchemaObserver.transactionMode.Update) {
                    targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, currentTran.keyField));
                }
                if (fieldGroupInstance.gridEnabled) {
                    targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, fieldGroupInstance.gridHandler.modelHandler.keyField));
                    if (fieldGroupInstance.gridHandler.modelHandler.additionalKeyFieldCollection !== undefined && fieldGroupInstance.gridHandler.modelHandler.additionalKeyFieldCollection.length > 0) {
                        targetModel = angular.merge(targetModel, _.pick(_clonedInputModel, fieldGroupInstance.gridHandler.modelHandler.additionalKeyFieldCollection));
                        if (fieldGroupInstance.isOfflineStorage !== true && targetModel.candidateId === undefined && fieldGroupInstance.gridHandler.modelHandler.additionalKeyFieldCollection.indexOf("candidateId") > -1) {
                            targetModel.candidateId = service.angularSchemaObserver.candidateIdSupplier();
                        }
                    }
                }
                fieldGroupInstance.extendModelProgrammatically(targetModel);
                // Single field mapping to multiple form data
                service.angularSchemaObserver.multipleFormToSingleColumnMapping(fieldGroupInstance, targetModel, "toDB", ApplicationState);

            } catch (reason) {
                service.angularSchemaObserver.notifyOnException(false, true, service.angularSchemaObserver.notificationEngine.generalMessage, reason);
            }
        };
        //</editor-fold>
    }

}());
