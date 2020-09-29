/**
 * Created by TDadam on 5/6/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('socialAuthService', socialAuthService);

    socialAuthService.$inject = ['$q', '$log', 'candidate','LocalStorage','ApplicationState'];

    function socialAuthService($q, $log,candidate,LocalStorage,ApplicationState)  {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var socialChannel = null;
        var fetchCandidateByEmailResponse = null;
        var socialProvider;
        var _redirectionCallback;
        var _location , _window;
        var _progressHandler;
        var _tokenValidator;

        var service = {
            login : login
        };
        return service;

        function login(socialProviderService,tokenValidator,socialProfile,redirectAction,location,window,progressHandler,redirectionCallback) {
            var candidateId = -1;
            socialProvider = socialProviderService;
            _redirectionCallback = redirectionCallback;
            _location = location;
            _window = window;
            _progressHandler = progressHandler || dummyReceiver;
            _tokenValidator = tokenValidator;

            var deferred = $q.defer();
            try {
                var registeredSocialChannel = {};
                socialProvider.utility.setProfileDefaultsToStorage();
                /// check user has social profile registered in our records
                fetchSocialChannelByEmailAndProvider(socialProfile.email, socialProfile.provider)
                    .then(function () {
                        socialProfile.isUserRegistered = socialChannel !== undefined;
                        registeredSocialChannel = angular.copy(socialChannel);
                        if ((socialProfile.bearerAccessToken === null || socialProfile.bearerAccessToken === undefined) || (socialProfile.isUserRegistered === false)) {
                            // check for any social profile has registered for same candidate
                            fetchCandidateByEmail(socialProfile.email)
                                .then(function () {
                                    var candidateCurrent = undefined;
                                    if (angular.isArray(fetchCandidateByEmailResponse) && fetchCandidateByEmailResponse.length > -1) {
                                        candidateCurrent = fetchCandidateByEmailResponse[0];
                                    }
                                    if (candidateCurrent !== null && candidateCurrent !== undefined) {
                                        candidateId = candidateCurrent.candidateId;
                                        getSocialChannel()
                                            .then(function () {
                                                processCandidateSocialChannel(registeredSocialChannel, candidateId)
                                                    .then(function () {
                                                        executeGigyaNotifyRegistration(candidateId)
                                                            .then(function () {
                                                                if (socialProvider.isGigyaRegistrationSucceeded) {
                                                                    socialProvider.utility.clearMergeProfileCache(true);
                                                                    if (registeredSocialChannel === null || registeredSocialChannel === undefined) {
                                                                        redirectAction.action = 'merge';
                                                                        redirectAction.path = '/profile/edit/';
                                                                        socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
                                                                        LocalStorage.set(socialProvider.KeysConfiguration.localStorageSocialMergedProfile, socialProfile);
                                                                    } else {
                                                                        redirectAction.action = 'dashboard';
                                                                        redirectAction.path = '/profile/';
                                                                        socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
                                                                    }
                                                                    deferred.resolve(0);
                                                                    if (socialProfile.bearerAccessToken === null || socialProfile.bearerAccessToken === undefined) {
                                                                        socialProvider.setRegistrationCaller('');
                                                                        socialProvider.showNotificationToggle(true, socialProvider.notificationEngine.mergeIntermediateMessage());
                                                                    } else {
                                                                        validateToken(socialProfile, redirectAction);
                                                                    }
                                                                } else {
                                                                    socialProvider.setRegistrationCaller('');
                                                                    deferred.reject(0);
                                                                }
                                                                _progressHandler(false);
                                                            })
                                                            .catch(function (reason) {
                                                                logger.error(reason);
                                                                _progressHandler(false);
                                                            });
                                                    })
                                                    .catch(function (reason) {
                                                        logger.error(reason);
                                                        _progressHandler(false);
                                                    });
                                            })
                                            .catch(function (reason) {
                                                logger.error(reason);
                                                _progressHandler(false);
                                            });
                                    } else {
                                        _progressHandler(false);
                                        socialProvider.setRegistrationCaller('');
                                        deferred.reject(0);
                                        socialProvider.showNotificationToggle(true, socialProvider.notificationEngine.registrationFail);
                                    }
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    _progressHandler(false);
                                });
                        } else {
                            validateToken(socialProfile, redirectAction);
                            deferred.resolve(0);
                        }
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        _progressHandler(false);
                        socialProvider.showNotificationToggle(true, socialProvider.notificationEngine.generalException);
                    })

            } catch (reason) {
                logger.error(reason);
                _progressHandler(false);
                socialProvider.showNotificationToggle(true, socialProvider.notificationEngine.generalException);
            }
        }

        function fetchSocialChannelByEmailAndProvider (email,socialProvider) {
            logger.debug('fetchSocialChannelByEmailAndProvider');
            var deferred = $q.defer();
            socialChannel = undefined;
            var params ={};
            params.userEmail = email;
            params.socialChannelName = socialProvider;
            return candidate.getSocialChannelByEmailAndSocialProvider(params).$promise
                .then
                (
                    function (result) {
                        socialChannel = normalizeObjects(result);
                        deferred.resolve(result);
                        return deferred.$promise;
                    },
                    function(reason) {
                        socialChannel = undefined;
                        deferred.resolve(socialChannel);
                        return deferred.$promise;
                    }
                );
        }

        function fetchCandidateByEmail (email) {
            logger.debug('fetchCandidateByEmail');
            var deferred = $q.defer();
            var params = {};
            params.emailId = email;
            return candidate.getCandidateByEmail(params).$promise
                .then
                (
                    function (result) {
                        fetchCandidateByEmailResponse = normalizeObjects(result);
                        deferred.resolve(fetchCandidateByEmailResponse);
                    },
                    function (reason) {
                        fetchCandidateByEmailResponse = undefined;
                        deferred.reject(fetchCandidateByEmailResponse);
                    }
                );
        }

        function getSocialChannel () {
            var deferred = $q.defer();
            logger.debug('getSocialChannel');
            if (socialProvider.isSocialUserRegistration === true) {
                var _socialProfile = socialProvider.getProfile();
                var _payLoad = {};
                _payLoad.socialChannelName = _socialProfile.provider;
                return candidate.getSocialChannel(_payLoad).$promise.then(function (result) {
                    try {
                        logger.debug('success:getSocialChannel');
                        socialChannel = normalizeObjects(result);
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
        }

        function processCandidateSocialChannel (socialChannelObject,candidateId) {
            var deferred = $q.defer();
            logger.debug('processCandidateSocialChannel');
            if (socialProvider.isSocialUserRegistration === true) {
                var _socialProfile = socialProvider.getProfile();
                var candidateSocialChannel = getCandidateSocialChannelModel(socialChannel.socialChannelId, candidateId, _socialProfile);
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
        }

        function executeGigyaNotifyRegistration (candidateId) {
            var deferred = $q.defer();
            socialProvider.isGigyaRegistrationSucceeded = true;
            socialProvider.showNotificationToggle(false, '');
            logger.debug('executeGigyaNotifyRegistration');
            if (socialProvider.isSocialUserRegistration === true) {
                var inputs = {
                    candidateId    : candidateId,
                    apiKeyType     : GIGYA_SOCIAL_SETTINGS.gigyashortcode,
                    socialChannelId: socialChannel.socialChannelId
                };
                return candidate.gigyaNotifyRegistration(inputs).$promise.then(
                    function (result) {
                        logger.debug('GigyaRegistraionSuccess');
                        deferred.resolve(0);
                    }, function (reason) {
                        socialProvider.isGigyaRegistrationSucceeded = false;
                        socialProvider.showNotificationToggle(true, socialProvider.notificationEngine.registrationFail);
                        logger.error(reason);
                        deferred.resolve(0);
                    }
                );
            } else {
                deferred.resolve(0);
            }

            return deferred.promise;
        }

        function validateToken (socialProfile,redirectAction) {
            /// TODO: need to remove overridden of  redirectAction once account validation gets implemented
            var redirectHandler = socialProvider.utility.getRedirectDirectionFromStorage();
            if (redirectHandler.isSuccess === true) {
                switch (redirectHandler.action) {
                    case 'merge':
                        redirectAction = angular.merge(redirectAction, redirectHandler);
                        break;
                }
            }
            socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
            if (_tokenValidator) {
                _tokenValidator(socialProfile.email, socialProfile.bearerAccessToken, socialBearerSuccessHandler);
            }
        }

        function socialBearerSuccessHandler () {
            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
            socialProvider.disConnectSocialConnection();
            var redirectHandler = socialProvider.utility.getRedirectDirectionFromStorage();
            if (_redirectionCallback && angular.isFunction(_redirectionCallback)) {
                if (redirectHandler.isSuccess === true) {
                    socialProvider.utility.removeRedirectDirectionInStorage();
                }
                _redirectionCallback();
            } else if (redirectHandler.isSuccess === true) {
                switch (redirectHandler.action) {
                    case 'merge':
                        _location.url(redirectHandler.path);
                        break;
                    case 'apply':
                        socialProvider.utility.removeRedirectDirectionInStorage();
                        _window.location.reload();
                        break;
                    case 'microsite':
                        LocalStorage.remove('socialProfileRedirect');
                        $('.landing-page-content').hide();
                        $('.landing-page-thank-you').show();
                        if (redirectHandler.path) {
                            _window.location.href = redirectHandler.path;
                        }
                        break;
                    default:
                        socialProvider.utility.removeRedirectDirectionInStorage();
                        _location.url(redirectHandler.path);
                        break;
                }
            } else {
                _location.path('/profile/');
            }
        }

        function getCandidateSocialChannelModel (socialChannelId,candidateId,socialProfile) {
            var result = {};
            result.socialChannelId = socialChannelId;
            result.candidateId = candidateId;
            result.email = socialProfile.email;
            result.providerUid = socialProfile.uid;
            result.created = new Date();
            result.updated = new Date();
            return result;
        }

        function dummyReceiver() {

        }

   }
}());