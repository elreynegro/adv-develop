(function() {
    'use strict';
        
    angular
    .module('st.controllers.apply.site')
    .controller('baseController', baseController);

    baseController.$inject = ['$scope', '$rootScope', '$q', '$log', '$http', '$timeout', '$window', '$compile', 'metadata', 'lists', 'SessionStorage', 'LocalStorage', '$cookies', '$location', 'authService', 'privateApplication', 'privateStep', 'candidate', 'privateCandidate', 'bgResumeParser', 'bgResumeUpload', 'ModelDependencyFactory', 'questions','privateApplyFlow','ListService','omniTaggingFactory','screeningMessageViewModelService','ApplicationState','candidateAssessmentService','ApplyWorkFlow','SignInModalService','migrationService'];

    function baseController($scope, $rootScope, $q, $log, $http, $timeout, $window, $compile, metadata, lists, SessionStorage, LocalStorage, $cookies, $location, authService, privateApplication, privateStep, candidate, privateCandidate, bgResumeParser, bgResumeUpload, ModelDependencyFactory, questions, privateApplyFlow,ListService,omniTaggingFactory,screeningMessageViewModelService,ApplicationState,candidateAssessmentService,ApplyWorkFlow,SignInModalService,migrationService) {
        var $ = jQuery;
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_BASE);
        $scope.fieldHelpers={
            topVisibleField: 'uname',
            loginControlId: 'loginHandler'
        };
        $scope.step = {};
        $scope.application = {};

        var queryString = $location.search();
        $scope.reqIdLink = parseInt(queryString.link);

        initialize();

        $scope.genericCandidateParser = function (queryString) {
            try {
                if(queryString !== undefined && queryString !== null && _XC_CONFIG.field_mapping !== undefined && _XC_CONFIG.field_mapping.length > 0) {
                    var mappingFields = JSON.parse(_XC_CONFIG.field_mapping).payLoad_SP_mapping;
                    var candidateModel = {};
                    for (var i = 0; i < mappingFields.length; i++) {
                        var map = mappingFields[i];
                        if (queryString[map.source] !== undefined && ($scope.applyCandidate[map.destination] === undefined || angular.equals($scope.applyCandidate, {}) || $scope.applyCandidate[map.destination] === null || $scope.applyCandidate[map.destination] === '')) {
                            if($scope.listFieldMapping[map.destination] !== undefined){
                                var newList = $scope.lists[$scope.listFieldMapping[map.destination]];
                                for (var z = 0; z < newList.length; z++){
                                    if(newList[z].value.toLowerCase().indexOf(queryString[map.source].toLowerCase()) > -1){
                                        candidateModel[map.destination] = queryString[map.source];
                                        break;
                                    }
                                }
                            }else{
                                candidateModel[map.destination] = queryString[map.source];
                            }
                        }
                    }
                    if(!angular.equals(candidateModel, {})) {
                        $scope.applyCandidate = candidateModel;
                    }
                }
            } catch (reason) {
                logger.error(reason);
            }
        };

        $scope.getList = function (variable, listName, callback) {
            variable[listName] = LocalStorage.get(listName);

            if (variable[listName] === null || variable[listName] === undefined) {
                lists.getActiveListByName({ name: listName }).$promise.then(function(results) {
                    variable[listName] = normalizeObjects(results);
                    LocalStorage.set(listName, variable[listName]);

                    if (callback !== null && callback !== undefined) {
                        callback();
                    }

                }, function(reason) {
                    logger.error(reason);
                });

            } else {
                if (callback !== null && callback !== undefined) {
                    callback();
                }
            }
        };

        $scope.getMetadata =  function(variable, tableName, callback) {
                variable = LocalStorage.get(clientName + '.metadata.' + tableName);

                if (variable === null || variable === undefined) {
                    metadata.getTableMetadata({ table: tableName }).$promise.then(function(results) {
                        variable = normalizeObjects(results);
                        LocalStorage.set(clientName + '.metadata.' + tableName, variable);

                        if (callback !== null && callback !== undefined) {
                            callback();
                        }

                    }, function(reason) {
                        logger.error(reason);
                    });
                } else {
                    if (callback !== null && callback !== undefined) {
                        callback();
                    }
                }

                return variable;
        };

        $scope.booleanToYesNo = function(booleanItem) {
            if (booleanItem === true || booleanItem === 't') {
                return 'Yes';
            } else {
                return 'No';
            }
        };

        $scope.formatDate = function(milliseconds) {
            return formatDate(milliseconds);
        };

        $scope.formatTime = function(milliseconds) {
            return formatTime(milliseconds);
        };

        $scope.formatPhone = function(phoneNumber) {
            if (phoneNumber === undefined || phoneNumber === null || phoneNumber.length < 10) {
                    return phoneNumber;
            }

            var areaCode = phoneNumber.slice(0,3);
            var prefix = phoneNumber.slice(3,6);
            var npxx = phoneNumber.slice(6);

            return '(' + areaCode + ')' + prefix + '-' + npxx;
        };

        $scope.getValueFromArrayOrString = function(arrayOrString, position) {
            if (position === undefined || position === null) {
                position = 0;
            }

            if (!angular.isArray(arrayOrString)) {
                return arrayOrString;
            } else {
                return arrayOrString[position];
            }
        };

        $scope.getLabelByValue = function(value, list) {
            for (var key in list) {
                if (list[key].value === value) {
                    return list[key].label;
                }
            }
        };

        $scope.queueCheckEmail = function(){
            if($scope.applyCandidate.uname != undefined){
                if($scope.applyCandidate.uname.length > 75){
                    $scope.addCandidate.uname.$setValidity('maxCharExceed', false);
                }else{
                    $scope.addCandidate.uname.$setValidity('maxCharExceed', true);
                }
            }else{
                $scope.addCandidate.uname.$setValidity('maxCharExceed', true);
            }
        };

        $scope.invalidateEmail = function (event, formName, inputName){
            event.preventDefault();
            if($scope.credentials !== undefined && $scope.credentials.username !== undefined && $scope.credentials.username !== null && $scope.credentials.username !== '') {
                $scope.credentials.username = $scope.credentials.username.replace(/\s+$/, '');
                var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!emailRegex.test($scope.credentials.username)) {
                    $scope[formName][inputName].$setValidity('email', false);
                    $scope[formName][inputName].$touched = true;
                    $scope[formName][inputName].$invalid = true;
                    $scope.invalidEmail = true;
                }else{
                    $scope[formName][inputName].$setValidity('email', true);
                    $scope.invalidEmail = false;
                }
            }else{
                $scope[formName][inputName].$setValidity('email', true);
                $scope.invalidEmail = false;
            }
        };

        $scope.setUniqueEmail = function(state,broadcastMessage) {
            $scope.uniqueEmail = state;
            $scope.addCandidate.uname.$setValidity('uniqueEmail', state);
            if(broadcastMessage === undefined || broadcastMessage=== true) {
                var args = {
                    emailExists: !state
                };
                $scope.$broadcast($scope.broadcastNamespace.candidateModel.validations.emailExistence, args);
            }
        };

        $scope.setDeactivatedEmail = function(state) {
            $scope.deactiveCheck = state;
            $scope.addCandidate.uname.$setValidity('deactiveCheck', state);
        };

        // in case of need please implement same in lower level.
        // $scope.$on($scope.broadcastNamespace.candidateModel.validations.emailExistence,function (event, args) {
        //     $timeout(function (args) {
        //         if(args.emailExists === true){
        //             console.log("In email exists");
        //             focusHandler($scope.fieldHelpers.loginControlId);
        //         }else{
        //             getApplyFormConfigVisibleField($scope.fieldHelpers.topVisibleField).then(function(key){
        //                 $timeout(function(key){
        //                     focusHandler(key);
        //                 },50,false,key);
        //             });
        //         }
        //     },50,false,args)
        // });

        function focusHandler(identity){
            if(identity === undefined) {
                setFocus($scope.topVisibleField, WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
            }else{
                setFocus(identity, WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
            }
        }

        $scope.checkEmail = function($event) {
            if(authService.isLoggedIn) {
                $event.preventDefault();
                /// prevent email exists validation check for logged in user.
                return;
            }
            logger.log('Checking email');
            if ($scope.addCandidate.uname.$valid || $scope.addCandidate.uname.$error.uniqueEmail == true || $scope.fieldValidator.isDirtyValid === true) {
                try {
                    jQuery('.loading-container').css('display', 'block');
                    candidate.candidateExists({
                        username  : $scope.applyCandidate.uname,
                        clientName: clientName
                    }).$promise.then(
                        function (result) {
                            $scope.setUniqueEmail(true);
                            jQuery('.loading-container').css('display', 'none');
                        }, function (reason) {
                            candidate.getCandidateActivationByEmail({
                                username  : $scope.applyCandidate.uname,
                                clientName: clientName
                            }).$promise.then(
                                function (result) {
                                    var deActiveCheck = normalizeObjects(result);
                                    if(deActiveCheck[0] === 't') {
                                        $scope.setDeactivatedEmail(false);
                                    }else{
                                        $scope.setUniqueEmail(false);
                                    }
                                    jQuery('.loading-container').css('display', 'none');
                                }, function (reason) {
                                    logger.log(reason);
                                    $scope.setUniqueEmail(false);
                                    jQuery('.loading-container').css('display', 'none');
                                });
                        });
                }
                catch(x){
                    logger.log(x);
                    $scope.addCandidate.uname.$setValidity('uniqueEmail', false);
                }
            }
        };

        $scope.setZeoCode = function(override){
           var response = ModelDependencyFactory.candidateHelper.setterProcessor.zeoCode($scope.applyCandidate,override,$scope.modelFactoryResponseHandler);
        };

        $scope.modelFactoryResponseHandler = function(response){
            if(response.hasSuccess === false){
                logger.error(response.response);
                jQuery('.loading-container').css('display', 'none');
            }
        };

        $scope.seoRedirectHandler = function () {
            if(_XC_CONFIG.xcloudPageAttributes.destination !== undefined && _XC_CONFIG.xcloudPageAttributes.destination !== null) {
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
                }else{
                    $window.location.href = _XC_CONFIG.xcloudPageAttributes.destination ? _XC_CONFIG.xcloudPageAttributes.destination : $scope.jobUrl;
                }
            }else{
                if($scope.jobUrl !== undefined && $scope.jobUrl !== null) {
                    $window.location.href = $scope.jobUrl;
                }else{
                    logger.log('Fetching job Url failed');
                    if ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true) {
                        logger.log('Fetching job details failed');
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
        };

        $scope.applicationStepServiceHandler = function() {
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

            var submitScreeningAnswers = function () {
                logger.debug('submitScreeningAnswers');
                var deferred = $q.defer();
                var addedAnswer = [];
                try {
                    for (var key2 in $rootScope.screening_answers) {
                        if ($rootScope.screening_answers[key2].answer != null) {
                            $rootScope.screening_answers[key2].applicationId = $scope.application.applicationId;
                            try {
                                questions.addAnswer($rootScope.screening_answers[key2]).$promise
                                    .then(function (results) {
                                        addedAnswer.push(normalizeObjects(results));
                                        if($rootScope.screening_answers.length === addedAnswer.length) {
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
                                                            jQuery('.loading-container').css('display', 'none');
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
                                                jQuery('.loading-container').css('display', 'none');
                                                deferred.reject(reason);
                                            });
                                    })
                                    .catch(function (reason) {
                                        logger.error(reason);
                                        jQuery('.loading-container').css('display', 'none');
                                        deferred.reject(reason);
                                    });
                            })
                            .catch(function (reason) {
                                logger.error(reason);
                                jQuery('.loading-container').css('display', 'none');
                                deferred.reject(reason);
                            });
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                        deferred.reject(reason);
                    });
            }
            catch (reason) {
                logger.error(reason);
                deferred.reject(reason);
            }
            return deferred.promise;
        };

        var burningGlassParserErrorHandler = function(){
            $scope.isInvalidContentCV = true;
            jQuery('.loading-container').css('display', 'none');
            $scope.clearAttachmentCache();
            return;            
        };
        
        var burningGlassParserHandler = function(resp) {
            // logger.log(resp);
            try {
                $scope.resumeXML = resp;

                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/transform/html";
                var data = $scope.resumeXML;

                $http({
                    url : uploadUrl,
                    method : "POST",
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/xml'
                    },
                    data: data
                }).success(
                    function(response) {
                        $rootScope.resumeXML = response;

                    }).error(
                    function(response,status, headers, config) {
                        $rootScope.resumeXML = null;
                    });

                var x2js = new X2JS();
                $rootScope.resumeJSON = x2js.xml_str2json($scope.resumeXML);
                $rootScope.resumeParsed = true;
                $scope.isInvalidContentCV = false;

                if ($rootScope.resumeJSON.ResDoc.resume === undefined || $rootScope.resumeJSON.ResDoc.resume.contact === undefined) {
                    return burningGlassParserErrorHandler();
                }

                var contactInfo = $rootScope.resumeJSON.ResDoc.resume.contact;

                if ($scope.socialProvider.isSocialUserRegistration === false) {
                    if ($scope.applyCandidate.uname === undefined || $scope.applyCandidate.uname === null) {
                        if (contactInfo != undefined && contactInfo != null && contactInfo.email != null && contactInfo.email != undefined) {
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
                            $scope.getValueFromArrayOrString(contactInfo.name.givenname, 1) : $scope.applyCandidate.middleName;
                    }else if(contactInfo.   name.givenname !== undefined){
                        $scope.applyCandidate.firstName = ($scope.applyCandidate.firstName === undefined) ?
                            contactInfo.name.givenname : $scope.applyCandidate.firstName;
                    }
                    $scope.applyCandidate.lastName = ($scope.applyCandidate.lastName === undefined) ? $scope.getValueFromArrayOrString(contactInfo.name.surname, 0) : $scope.applyCandidate.lastName;
                }

                if (angular.isArray(contactInfo.phone) || typeof contactInfo.phone === "object") {
                    var parsePhoneNum = $scope.getValueFromArrayOrString(contactInfo.phone, 0);
                    parsePhoneNum = (parsePhoneNum.__text === undefined) ? parsePhoneNum : parsePhoneNum.__text;
                }else if (contactInfo.phone !== undefined && contactInfo.phone !== null){
                    var parsePhoneNum = contactInfo.phone;
                }

                if(angular.isArray(contactInfo.phone) || typeof contactInfo.phone === "object" || (contactInfo.phone !== undefined && contactInfo.phone !== null)){
                    // parsePhoneNum = parsePhoneNum.replace(/[^\w\s]/gi, '');
                    parsePhoneNum = parsePhoneNum.replace(/\D/g,'');
                    $scope.applyCandidate.phone1 = ($scope.applyCandidate.phone1 === undefined || $scope.applyCandidate.phone1 === null || $scope.applyCandidate.phone1.length === 0) ? parsePhoneNum : $scope.applyCandidate.phone1;
                    parsePhoneNum = null;
                }

                var newPostalCode = null;
                var newStreet = null;
                var newCity = null;
                var newState = null;
                if(angular.isArray(contactInfo.address) || typeof contactInfo.address === "object"){
                    $.each(contactInfo.address, function(key, info) {
                        if(info.hasOwnProperty('postalcode')){
                            newPostalCode = info.postalcode;
                        }else if(info.hasOwnProperty('zip')){
                            newPostalCode = info.zip;
                        }
                        if(info.hasOwnProperty('street')){
                            newStreet = info.street;
                        }
                        if(info.hasOwnProperty('city')){
                            newCity = info.city;
                        }
                        if(info.hasOwnProperty('_state')){
                            newState = info._state;
                        }
                    });
                }

                $scope.applyCandidate.zip = ($scope.applyCandidate.zip === undefined || $scope.applyCandidate.zip === null || $scope.applyCandidate.zip.length === 0) ? (newPostalCode !== null ? newPostalCode : contactInfo.address.postalcode ): $scope.applyCandidate.zip;
                $scope.applyCandidate.address1 = ($scope.applyCandidate.address1 === undefined || $scope.applyCandidate.address1 === null || $scope.applyCandidate.address1.length === 0) ? (newStreet !== null ? newStreet : $scope.getValueFromArrayOrString(contactInfo.address.street, 0) ) : $scope.applyCandidate.address1;
                $scope.applyCandidate.city = ($scope.applyCandidate.city === undefined || $scope.applyCandidate.city === null || $scope.applyCandidate.city.length === 0) ? (newCity !== null ? newCity : $scope.getValueFromArrayOrString(contactInfo.address.city, 0) ) : $scope.applyCandidate.city;
                $scope.applyCandidate.state = ($scope.applyCandidate.state === undefined || $scope.applyCandidate.state === null || $scope.applyCandidate.city.state === 0) ? (newState !== null ? newState : $scope.getValueFromArrayOrString(contactInfo.address._state, 0) ) : $scope.applyCandidate.state;

                $scope.$broadcast($scope.broadcastNamespace.candidateModel.parse.associatedData);
                $timeout(function () {
                        // Someone please change this. Calling checkEmail() did not work 100%.
                        jQuery('#uname').trigger('blur');
                        $scope.setZeoCode(false);
                    }, 250
                );
            }catch (reason) {
                jQuery('.loading-container').css('display', 'none');
            }
        };

        $scope.assignDocumentDetails = function (event) {

            var validFormats = ['application/rtf', 'application/msword', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];var validFormats = ['application/rtf', 'application/msword', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            var result = validFormats.indexOf(event.target.files[0].type);

            // If MS Office is not installed result will be -1, hence depending on file property with name as below code
            if(result === -1){
                var validFileExt = ['doc', 'docx', 'txt', 'pdf', 'rtf'];
                var fileAttr = event.target.files[0].name.split('.');
                result = validFileExt.indexOf(fileAttr[fileAttr.length-1].toLowerCase());
            }

            var getCurDate = new Date();
            $scope.isUnsupported = false;
            $scope.fileSizeError = false;
            $scope.attachmentDetails.name = '';
            $scope.isInvalidContentCV = false;

            if (result === -1) {
                $scope.$apply(function () {
                    $scope.isUnsupported = true;
                    setFocus('fileupload',false);
                });
            } else if (event.target.files[0].size > maxFileSizeforResume) {
                $scope.$apply(function () {
                    $scope.fileSizeError = true;
                    setFocus('fileupload',false);
                });
            } else {
                $scope.$apply(function () {
                    $scope.attachmentDetails.name = event.target.files[0].name;
                    $scope.attachmentDetails.createDate = getCurDate.getTime();
                    $scope.attachmentDetails.description = 'Test';
                    $scope.attachmentDetails.type = event.target.files[0].type;
                    $scope.attachmentDetails.attachmentType = 'Resume';
                    $scope.attachmentDetails.document = null;
                    $scope.attachmentDetails.isCanUpload = 't';
                });

                var file = $scope.fileFormName;

                logger.log('file was selected: ', JSON.stringify($scope.attachmentDetails));

                var inputName = 'fileFormName';
                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/parse/" + inputName;
                jQuery('.loading-container').css('display', 'block');
                bgResumeParser.parseResume(file, uploadUrl, inputName, burningGlassParserHandler,burningGlassParserErrorHandler);
            }
        };

        $scope.removeAttachment = function($event){
            $scope.clearAttachmentCache();
            $event.preventDefault();
            setFocus('uname',WCAG_COMPLIANCE_SETTINGS.validator.selectionOnFocus);
            return false;
        };
        
        $scope.clearAttachmentCache = function(){
            $scope.fileFormName = {};
            $scope.attachmentDetails = {};
            if(!authService.isLoggedIn){
                $scope.applyCandidate = {};
                $scope.$broadcast($scope.broadcastNamespace.candidateModel.parse.clearAssociatedData);
                $rootScope.resumeParsed = false;
                $scope.addCandidate.uname.$setValidity('uniqueEmail', true);
                $scope.uniqueEmail = true;
                $scope.deactiveCheck = true;
                $scope.addCandidate.uname.$touched = false;
                // $scope.addCandidate.uname.$error.uniqueEmail = false;
                // $scope.uniqueEmail = true;
                // $scope.addCandidate.uname.$setValidity('uniqueEmail', true);
            }
            else if(!$rootScope.candidateResumeUpdated) {
                $rootScope.resumeXML = null;
                $rootScope.resumeParsed = false;
            }
            jQuery('#fileupload').val(null);
        };

        $scope.setRedirectToCurrent = function($event, loginConfiguration, forgotPasswordCaller){
            if(_XC_CONFIG.login_modal.disabled === false){
                if($event !== undefined) $event.preventDefault();
                if(forgotPasswordCaller === true){
                    $scope.cancel(true);
                    $scope.ForgotPasswordView = true;
                    $scope.setRedirectToCurrentModule();
                    SignInModalService.openPassword({},$scope.signInModalCallback);
                }
                else {
                    $scope.setRedirectToCurrentModule();
                    SignInModalService.open(loginConfiguration,$scope.signInModalCallback);
                }

            }else{
                if($event !== undefined) $event.preventDefault();
                $scope.setRedirectToCurrentModule();
                $location.url('/profile/login/');
            }
        };


        $scope.signInModalCallback = function(response){
            // TODO
            if(response.showProgressbar  === true){
                $scope.globalProgressBarHandler(true);
            }
        };

        $scope.setRedirectToCurrentModule = function () {
            authService.setUrlPathIfUserExists($location.url(), $scope.applyCandidate.uname);
        };

        $scope.getApplicationStatus = function (applyStreamId) {
            try {
                var params = {};
                params.clientName = clientName;
                params.candidateId = $scope.applyCandidate.candidateId;
                params.requisitionId = $scope.reqIdLink;
                privateApplyFlow.getApplyCandidateByCandidateIdReqId(params).$promise.then(function (results){
                    var candidateRecord = normalizeObjects(results);
                    if(candidateRecord.length !== 0){
                        $scope.hasApplied = true;
                        for(var i in candidateRecord){
                            if(candidateRecord[i].applyStreamId === applyStreamId)
                            {
                                $rootScope.applyCandidateStatusId = candidateRecord[i].applyCandidateId;
                                $scope.currentApplyformId = candidateRecord[i].applyFormId;
                            }
                            else {
                                $scope.hasApplied = false;
                                privateApplyFlow.deleteApplyCandidateRecords({client:clientName, applycandidateId: candidateRecord[i].applyCandidateId});
                                break;
                            }
                        }
                        angular.forEach(ListService.applyFormList('getFormIdList'), function(options, optionsKey){
                            if(optionsKey == $scope.currentApplyformId){
                                $('#'+options).slideDown();
                            }else{
                                $('#'+options).slideUp();
                            }
                        });
                        jQuery('.loading-container').css('display', 'none');
                    }
                    else{
                        $scope.hasApplied = false;
                        jQuery('.loading-container').css('display', 'none');
                    }
                }, function (reason) {
                    logger.error(reason);
                });
            }catch (reason) {
                logger.error(reason);
            }
        };

        $scope.setApplicationStatus = function (status,applyFormId,applyStreamId,applyContainerId) {
            try {
                $scope.applyCandidate = ApplicationState.session.candidate.get();
                var applicationData = {
                    "candidateId": $scope.applyCandidate.candidateId,
                    "requisitionId": $scope.reqIdLink,
                    "applicationId": 0,
                    "applyStreamId": applyStreamId,
                    "applyContainerId": applyContainerId,
                    "applyFormId": applyFormId,
                    "completed": ""
                };
                if(status === 'add'){
                    privateApplyFlow.addApplyCandidate(applicationData).$promise.then(function (results) {
                        var data = normalizeObjects(results);
                        $rootScope.applyCandidateStatusId = data.applyCandidateId;
                    });
                }

                if(status === 'update'){
                    applicationData.applyCandidateId = $rootScope.applyCandidateStatusId;
                    privateApplyFlow.updateApplyCandidate(applicationData).$promise.then(function (results) {
                    });
                }
            }catch (reason) {
                logger.error(reason);
            }
        };

        $scope.candidateServiceHandler = function(functionCallTo){
            var deferred = $q.defer();

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

                    if($rootScope.resumeParsed && $rootScope.resumeXML !== null){
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
                        if(_XC_CONFIG.omniDataEnabled === 'true') {
                            if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                                omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, $scope.reqIdLink,$scope.applyCandidate.email);
                                $scope.captureOmniTagging = true;
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

            var parsedResume = function(resp) {
                logger.log(resp);
            };

            var uploadResume = function () {
                var deferred = $q.defer();
                var file = $scope.fileFormName;
                if(angular.equals({}, $scope.fileFormName)){
                    deferred.resolve(0);
                    return deferred.promise;
                }
                logger.log('file was selected: ', JSON.stringify($scope.attachmentDetails));

                var inputName = 'fileFormName';
                var attachmentFormName = 'attachmentFormName';
                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/private/candidate/attachment/"+ clientName +"/"+ inputName +"/"+ attachmentFormName;
                bgResumeUpload.parseResume(file, uploadUrl, inputName, attachmentFormName, $scope.attachmentDetails,
                    function(resp) {
                        deferred.resolve(resp);
                    }, function(err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            };

            var updateCandidate = function(){
                logger.debug('updateCandidate()');
                logger.trace('applyCandidate: ' + angular.toJson($scope.applyCandidate));

                var getCurDate = new Date();
                $scope.applyCandidate.updateDate = getCurDate.getTime();
                if(($scope.applyCandidate.password === undefined || $scope.applyCandidate.password === null )&& authService.isSocialProfileConnection() === true){
                    $scope.applyCandidate.password = '!msocpf#!0'
                }
                if($rootScope.resumeParsed && $rootScope.resumeXML !== null){
                    $scope.applyCandidate.resume = $rootScope.resumeXML;
                }
                return candidate.updateCandidate($scope.applyCandidate).$promise.then(function (result) {
                    var deferred = $q.defer();
                    try {
                        $scope.applyCandidate = normalizeObjects(result);
                        ApplicationState.session.candidate.set($scope.applyCandidate);
                        $rootScope.candidateResumeUpdated = true;
                        if($scope.jobId && ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true)) {
                            $scope.CandidateModelHelper.captureNonAtsLead($scope.jobId, $scope.applyCandidate.candidateId);
                        }else if($scope.reqIdLink && $scope.isAlertLcp && ($rootScope.isNewUser === undefined || $rootScope.isNewUser !== true)){
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

            var lockCandidate = function(){
                var deferred = $q.defer();
                $scope.applyCandidate.locked = 't';
                return candidate.updateCandidate($scope.applyCandidate).$promise.then(function (result) {
                    try {
                        $scope.applyCandidate = normalizeObjects(result);
                        ApplicationState.session.candidate.set($scope.applyCandidate);
                        $scope.mode = 'update';

                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var emailCandidate = function(){
                var deferred = $q.defer();
                // need to skip Email Notification for Social User's
                if  ($scope.socialProvider.isSocialUserRegistration === true) {
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
                        // logout();
                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var addWorkHistory = function () {
                var deferred = $q.defer();
                $scope.applyCandidate = ApplicationState.session.candidate.get();
                if ($scope.workHistoryToUpload !== null && $scope.workHistoryToUpload !== undefined
                    && $scope.workHistoryToUpload.length > 0 && $scope.workHistoryUploaded !== undefined && $scope.workHistoryUploaded.length === 0) {
                    for (var index in $scope.workHistoryToUpload) {
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
                    $scope.workHistory.candidateId = $scope.applyCandidate.candidateId;
                    return privateCandidate.addWorkHistory($scope.workHistory).$promise.then(function (results) {
                        try {
                            $scope.workHistory = normalizeObjects(results);
                            logger.debug(angular.toJson($scope.credentials));
                            deferred.resolve($scope.workHistory);
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                        return deferred.promise;
                    });
                }
            };

            var updateWorkHistory = function () {
                var deferred = $q.defer();
                return privateCandidate.updateWorkHistory($scope.workHistory).$promise.then(function (results) {
                    try {
                        $scope.workHistory = normalizeObjects(results);
                        logger.debug(angular.toJson($scope.credentials));
                        deferred.resolve($scope.workHistory);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var addEducationHistory = function () {
                var deferred = $q.defer();
                $scope.applyCandidate = ApplicationState.session.candidate.get();
                if ($scope.eduHistoryToUpload !== null && $scope.eduHistoryToUpload !== undefined
                    && $scope.eduHistoryToUpload.length > 0 && $scope.eduHistoryUploaded !== undefined && $scope.eduHistoryUploaded.length === 0) {

                    for (var index in $scope.eduHistoryToUpload) {
                        privateCandidate.addEducation($scope.eduHistoryToUpload[index]).$promise.then(function(results) {
                            logger.info('add education history record success');
                            $scope.eduHistoryUploaded.push(results);
                            deferred.resolve(results);
                        }, function(reason) {
                            hasError(reason, 'Unable to add employment history record!');
                            deferred.reject(reason);
                        });
                    }

                    $scope.eduHistory.candidateId = $scope.applyCandidate.candidateId;
                    if ($scope.eduHistory.completed === null || $scope.eduHistory.completed === undefined) {
                        $scope.eduHistory.completed = 't';
                    }

                    privateCandidate.addEducation($scope.eduHistory).$promise.then(function (results) {
                        try {
                            $scope.eduHistory = normalizeObjects(results);
                            deferred.resolve(0);
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                    });

                    return deferred.promise;
                } else {
                    $scope.eduHistory.candidateId = $scope.applyCandidate.candidateId;
                    if ($scope.eduHistory.completed === null || $scope.eduHistory.completed === undefined) {
                        $scope.eduHistory.completed = 't';
                    }
                    return privateCandidate.addEducation($scope.eduHistory).$promise.then(function (results) {
                        try {
                            $scope.eduHistory = normalizeObjects(results);
                            logger.debug(angular.toJson($scope.credentials));
                            deferred.resolve(0);
                        }
                        catch (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                        return deferred.promise;
                    });
                }
            };

            var updateEducation = function () {
                var deferred = $q.defer();

                if($scope.eduHistory.completed == null || typeof $scope.eduHistory.completed == 'undefined'){
                    $scope.eduHistory.completed = 't';
                }

                return privateCandidate.updateEducation($scope.eduHistory).$promise.then(function (results) {
                    try {
                        $scope.eduHistory = normalizeObjects(results);
                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var logout = function(skipLogOut){
                delete $rootScope.resumeJSON;
                delete $rootScope.resumeParsed;
                delete $rootScope.applyCandidateId;
                delete $rootScope.screening_answers_submit;
                delete $rootScope.screening_answers;
                if(skipLogOut === undefined || skipLogOut === false) {
                    authService.logout();
                }
            };

            var login = function () {
                logger.debug('login');
                var deferred = $q.defer();
                authService.isLoggedIn = false;
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

            var lastContainerHandler = function () {
                $scope.applicationStepServiceHandler()
                    .then(function () {
                        hasSuccess('Application complete, thank you!');
                        if( ($scope.isSessionLogged && $scope.applyCandidate.locked === 'f') ||
                            (authService.isLoggedIn && authService.isSocialProfileConnection() === true)){
                            delete $rootScope.resumeJSON;
                            delete $rootScope.resumeParsed;
                            delete $rootScope.applyCandidateId;
                            delete $rootScope.screening_answers_submit;
                            delete $rootScope.screening_answers;
                            $rootScope.isReturningUser = true;
                            jQuery('.loading-container').css('display', 'none');
                            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser : true});
                            $location.url(ApplyWorkFlow.current().url);
                        }else {
                            $rootScope.isReturningUser = false;
                            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser : false});
                            $scope.candidateServiceHandler('updateCandidateSendEmail')
                                .then(function () {
                                    logger.debug('Application complete, thank you!: headed to account');
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    jQuery('.loading-container').css('display', 'none');
                                });
                        }
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                    });
            };

            var addReference = function () {
                var deferred = $q.defer();
                if($scope.reference.title === undefined){
                    $scope.reference.title = " ";
                }
                return privateCandidate.addReference($scope.reference).$promise.then(function (results) {
                    try {
                        $scope.reference = normalizeObjects(results);
                        deferred.resolve($scope.reference);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            var updateReference = function () {
                var deferred = $q.defer();
                return privateCandidate.updateReference($scope.reference).$promise.then(function (results) {
                    try {
                        $scope.reference = normalizeObjects(results);
                        deferred.resolve($scope.reference);
                    }
                    catch (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                });
            };

            if(functionCallTo == 'processAddCandidate'){
                // authService.isLoggedIn;
                deferred = $q.defer();
                try {
                    prepareAddCandidate()
                        .then(function(){
                            executeAddCandidate()
                                .then(function() {
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
                                                                            $scope.termsAndConditionsUpdate()
                                                                                .then(function () {
                                                                                    authService.getSocialInternalToken('Bearer APPLY ', $scope.socialProvider.getProfile(), !$scope.socialProvider.isSocialUserRegistration)
                                                                                        .then(function () {
                                                                                            uploadResume()
                                                                                                .then(function () {
                                                                                                    logger.debug('resolving add candidate');
                                                                                                    deferred.resolve(0);
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
                                })
                                .catch(function(reason){
                                    logger.error(reason);
                                    jQuery('.loading-container').css('display', 'none');
                                });
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });

                }
                catch (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                    deferred.reject(reason);
                }
                return deferred.promise;
            }

            if(functionCallTo === 'updateCandidate'){
                var updateCandidateResponse = updateCandidate();
                jQuery('.loading-container').css('display', 'none');
                return updateCandidateResponse;
            }

            if(functionCallTo === 'updateCandidateSendEmail'){
                deferred = $q.defer();
                try{
                    if(!$scope.isSessionLogged || $scope.applyCandidate.locked == null || $scope.applyCandidate.locked == undefined){
                        $scope.applyCandidate.locked = 't';
                        $scope.applyCandidate.password = $scope.applyCandidate.password = 'password';
                        $scope.isSessionLogged = !$scope.isSessionLogged;
                    }
                    updateCandidate()
                        .then(function(updateCandidateResponse) {
                            $scope.applyCandidate = updateCandidateResponse;
                            logger.debug('updateCandidate complete');
                            var urlPath = $location.url();
                            var emailRedirectURL = '';
                            var isLandingPage = _XC_CONFIG.landing_page !== false;
                            if(urlPath.indexOf('apply') !== -1){
                                emailRedirectURL = ApplyWorkFlow.current().url;
                            }else if(urlPath.indexOf('profile') !== -1){
                                emailRedirectURL = '/profile/thank-you/';
                            }else{
                                if(isLandingPage){
                                    if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                                        omniTaggingFactory.omniTagginPopulateParams(_XC_CONFIG.analytics_id, $scope.applyCandidate.candidateId, _XC_CONFIG.landing_page.folder_id, $scope.applyCandidate.email);
                                        $('html.landing-page body').append($compile('<omni-tagging-directive flow="MICROSITE_campaign"></omni-tagging-directive>')($scope));
                                    }
                                    if(_XC_CONFIG.landing_page.destination) {
                                        emailRedirectURL = _XC_CONFIG.landing_page.destination;
                                    }
                                    else {
                                        $('.landing-page-content').hide();
                                        $('.landing-page-thank-you').show();
                                    }
                                }
                                else {
                                    emailRedirectURL = '/profile/thank-you/';
                                }
                            }

                            emailCandidate()
                                .then(function(emailCandidateResponse){
                                    var deferred = $q.defer();
                                    try {

                                        var socialProfile = $scope.socialProvider.getProfile();
                                        logout(ApplyWorkFlow.current().retainSession);
                                        // jQuery('.loading-container').css('display', 'none');
                                        if ($scope.socialProvider.isSocialUserRegistration === true) {
                                            $scope.socialUserFirstLoginAttempt();
                                        } else if ($scope.jobId && $scope.jobUrl) {
                                            $scope.seoRedirectHandler();
                                        }else if($location.path() === '/profile/job-alert/'){
                                            $scope.seoRedirectHandler();
                                        }
                                        // Need to assume that we need to do full redirects for landing pages
                                        else if (isLandingPage) {
                                            // May not have a redirect, just show the thank-you content
                                            $('.landing-page-content').hide();
                                            $('.landing-page-thank-you').show();

                                            if (_XC_CONFIG.landing_page.destination) {
                                                window.location.href = emailRedirectURL;
                                            }
                                        }
                                        else {
                                            $location.url(emailRedirectURL);
                                        }
                                        deferred.resolve(0);
                                    }
                                    catch (reason) {
                                        logger.error(reason);
                                        jQuery('.loading-container').css('display', 'none');

                                        if ($scope.jobId && $scope.jobUrl) {
                                            $scope.seoRedirectHandler();
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
                                    jQuery('.loading-container').css('display', 'none');
                                    if ($scope.jobId && $scope.jobUrl) {
                                        $scope.seoRedirectHandler();
                                    }else if($location.path() === '/profile/job-alert/'){
                                        $scope.seoRedirectHandler();
                                    } else {
                                        $location.url(emailRedirectURL);
                                    }
                                    deferred.reject(reason);
                                });
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });
                }
                catch (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                    deferred.reject(reason);
                }
                return deferred.promise;
            }

            if(functionCallTo === 'addWorkHistory') {
                return addWorkHistory();
            }

            if(functionCallTo === 'updateWorkHistory'){
                return updateWorkHistory();
            }

            if(functionCallTo === 'addEducationHistory'){
                return addEducationHistory();
            }

            if(functionCallTo === 'updateEducation'){
                return updateEducation();
            }

            if(functionCallTo === 'lastContainerHandler'){
                lastContainerHandler();
            }

            if(functionCallTo === 'login'){
                return login();
            }

            if(functionCallTo === 'addReference'){
                return addReference();
            }

            if(functionCallTo === 'updateReference'){
                return updateReference();
            }

        };

        function initialize() {
            logger.debug('Base Controller Called.');
            $scope.TEMPLATE_CONSTANTS = $rootScope.TEMPLATE_CONSTANTS;
            $scope.isAlertLcp = false;

            // Satellite Helpers
            $scope.socialProvider = ModelDependencyFactory.socialProvider;
            $scope.fieldValidator =  ModelDependencyFactory.fieldValidator;
            $scope.CandidateModelHelper =  ModelDependencyFactory.candidateHelper;
            $scope.socialIconObserverAttemptCount = 0;
            // Resume Error Configuration
            $scope.invalidResumeErrorMsg = TEMPLATE_CONSTANTS.VALIDATION.INVALID_CONTENT.str;
            $scope.unSupportResumeErrorMsg = TEMPLATE_CONSTANTS.VALIDATION.IN_COMPATIBLE_FILE_FORMAT.str;
            $scope.sizeExceedResumeErrorMsg = TEMPLATE_CONSTANTS.VALIDATION.FILE_SIZE_EXCEED.str;
            
            // Oi!!! We need to consolidate code!
            $scope.continueBtn = "Save and Continue";

            //clear resume data from applycandidate variable
            $rootScope.candidateResumeUpdated = false;
            $rootScope.resumeXML = null;

            $scope.captureOmniTagging = false;

            // Broadcast Namespace
            $scope.broadcastNamespace = {
                candidateModel:{
                    parse : {
                        associatedData : 'onCandidateAssociateData',
                        clearAssociatedData:'onCandidateAssociateDataClear'
                    },
                    validations:{
                        emailExistence: 'onCandidateExists'
                    },
                    socialNetwork:{
                        onAccountMerge:'onAccountMerge'
                    }
                }
            }
            loadTermsAndConditionsViewModel();
        }

        function loadTermsAndConditionsViewModel() {
            $scope.vm = {
                decorator                 : {
                    termsAndConditions     : TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_POLICY_TITLE,
                    marketing_Subscriptions: TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE
                }
            };
        }
        $rootScope.globalErrorHandler = function (reason) {
            logger.error(reason);
            jQuery('.loading-container').css('display', 'none');
        };

        $scope.getCandidateSocialChannelModel = function  (socialChannelId,candidateId,socialProfile) {
            var result = {};
            result.socialChannelId = socialChannelId;
            result.candidateId = candidateId;
            result.email = socialProfile.email;
            result.providerUid = socialProfile.uid;
            result.created = new Date();
            result.updated = new Date();
            return result;
        };

        $scope.executeSocialProfileDependencyResolver  = function (){
            var deferred = $q.defer();
            if (DEBUG) logger.debug('executeSocialProfileDependencyResolver');
            if  ($scope.socialProvider.isSocialUserRegistration === true &&
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
                } catch (reason){
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
            if  ($scope.socialProvider.isSocialUserRegistration === true) {
                var socialProfile =  $scope.socialProvider.getProfile();
                var socialChannel ={};
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
                },function(reason){
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
            if  ($scope.socialProvider.isSocialUserRegistration === true) {
                var socialProfile =  $scope.socialProvider.getProfile();
                var candidateSocialChannel = $scope.getCandidateSocialChannelModel($scope.socialChannel.socialChannelId, $rootScope.applyCandidateId,socialProfile);
                if((socialChannelObject === null || socialChannelObject === undefined || socialChannelObject.socialchannelConfigId  === null || socialChannelObject.socialchannelConfigId === undefined)) {
                    return candidate.addCandidateToSocialChannel(candidateSocialChannel).$promise.then(
                        function (result) {
                            deferred.resolve(0);
                        }, function (reason) {
                            logger.error(reason);
                            deferred.reject(reason);
                        }
                    );
                }else{
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
            } else{
                deferred.resolve(0);
            }
            return deferred.promise;
        };

        $scope.executeGigyaNotifyRegistration = function () {
            var deferred = $q.defer();
            $scope.socialProvider.isGigyaRegistrationSucceeded = true;
            $scope.socialProvider.showNotificationToggle(false,'');
            logger.debug('executeGigyaNotifyRegistration');
            var socialProfile =  $scope.socialProvider.getProfile();
            if  ($scope.socialProvider.isSocialUserRegistration === true) {
                var inputs = {
                    candidateId    : $rootScope.applyCandidateId,
                    apiKeyType     : GIGYA_SOCIAL_SETTINGS.gigyashortcode,
                    socialChannelId: $scope.socialChannel.socialChannelId
                };
                return candidate.gigyaNotifyRegistration(inputs).$promise.then(
                    function(result){
                        logger.debug('GigyaRegistraionSuccess');
                        deferred.resolve(0);
                    },function (reason) {
                        $scope.socialProvider.isGigyaRegistrationSucceeded = false;
                        $scope.socialProvider.isGigyaRegistrationSucceeded = false;
                        $scope.socialProvider.showNotificationToggle(true,$scope.socialProvider.notificationEngine.registrationFail);
                        logger.error(reason);
                        deferred.resolve(0);
                    }
                );
            } else{
                deferred.resolve(0);
            }

            return deferred.promise;
        };

        $scope.fetchSocialChannelByEmailAndProvider = function (email,socialProvider) {
            logger.debug('fetchSocialChannelByEmailAndProvider');
            var deferred = $q.defer();
            $scope.socialChannel = undefined;
            var params ={};
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
                    function(reason) {
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
            var params ={};
            params.userEmail = email;
            return candidate.getSocialChannelByEmail(params).$promise
                .then
                (
                    function (result) {
                        $scope.socialChannel = normalizeObjects(result);
                        deferred.resolve(result);
                        return deferred.$promise;
                    },
                    function(reason) {
                        $scope.socialChannel = undefined;
                        deferred.resolve($scope.socialChannel);
                        return deferred.$promise;
                    }
                );
        };

        $scope.fetchCandidateByEmail = function (email) {
            logger.debug('fetchCandidateByEmail');

            var deferred = $q.defer();
            var params ={};
            params.emailId = email;
            return candidate.getCandidateByEmail(params).$promise
                .then
                (
                    function (result) {
                        $scope.fetchCandidateByEmailResponse = normalizeObjects(result);
                        deferred.resolve($scope.fetchCandidateByEmailResponse);
                    },
                    function(reason) {
                        $rootScope.globalErrorHandler(reason);
                        $scope.fetchCandidateByEmailResponse = undefined;
                        deferred.reject($scope.fetchCandidateByEmailResponse);
                    }
                );
        };

        $scope.socialProfileAuthenticationEnabler = function (socialProfile,redirectAction) {
            var deferred = $q.defer();
            try {
                var registeredSocialChannel = {};
                $scope.socialProvider.utility.setProfileDefaultsToStorage();
                /// check user has social profile registered in our records
                $scope.fetchSocialChannelByEmailAndProvider(socialProfile.email, socialProfile.provider)
                    .then(function () {
                        socialProfile.isUserRegistered = ($scope.socialChannel !== undefined);
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
                                                                                if(registeredSocialChannel === null || registeredSocialChannel === undefined) {
                                                                                    redirectAction.action = 'merge';
                                                                                    redirectAction.path = '/profile/edit/';
                                                                                    $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
                                                                                    LocalStorage.set($scope.socialProvider.KeysConfiguration.localStorageSocialMergedProfile, socialProfile);
                                                                                }else {
                                                                                    redirectAction.action = 'dashboard';
                                                                                    redirectAction.path = '/profile/';
                                                                                    $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
                                                                                }
                                                                                deferred.resolve(0);
                                                                                if (socialProfile.bearerAccessToken === null || socialProfile.bearerAccessToken === undefined) {
                                                                                    //$scope.socialProvider.fetchUserInfo($scope.socialProvider.currentBody, $scope.socialMergeProfileLogin);
                                                                                    $scope.socialProvider.setRegistrationCaller('');
                                                                                    $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.mergeIntermediateMessage());
                                                                                    $scope.$broadcast($scope.broadcastNamespace.candidateModel.socialNetwork.onAccountMerge);
                                                                                } else {
                                                                                    $scope.socialProfileLogin(socialProfile,redirectAction);
                                                                                }
                                                                            } else {
                                                                                $scope.socialProvider.setRegistrationCaller('');
                                                                                deferred.reject(0);
                                                                            }
                                                                            jQuery('.loading-container').css('display', 'none');
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
                                                    jQuery('.loading-container').css('display', 'none');
                                                    $scope.socialProvider.setRegistrationCaller('');
                                                    deferred.reject(0);
                                                    $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.registrationFail);
                                                }
                                            })
                                            .catch(function (reason) {
                                                $rootScope.globalErrorHandler(reason);
                                            });
                        } else {
                            $scope.socialProfileLogin(socialProfile,redirectAction);
                            deferred.resolve(0);
                        }
                    })
                    .catch(function (reason) {
                        $rootScope.globalErrorHandler(reason);
                        $scope.socialProvider.showNotificationToggle(true, $scope.socialProvider.notificationEngine.generalException);
                    })

            } catch (reason) {
                $rootScope.globalErrorHandler(reason);
                $scope.socialProvider.showNotificationToggle(true,$scope.socialProvider.notificationEngine.generalException);
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
            }catch (reason){
                $rootScope.globalErrorHandler(reason);
            }
        };

        $rootScope.globalProgressBarHandler = function (enabled) {
            if (enabled) {
                jQuery('.loading-container').css('display', 'block');
            } else {
                jQuery('.loading-container').css('display', 'none');
            }
        };

        $scope.socialBearerSuccessHandler = function() {
            $scope.socialProvider.disConnectSocialConnection();
            ApplicationState.localStorage.candidate.isReturningUser.set({isReturningUser: true});
            var redirectHandler = $scope.socialProvider.utility.getRedirectDirectionFromStorage();
            if($scope.jobId && $scope.jobUrl) {
                if(redirectHandler.isSuccess === true){
                    $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                }
                $scope.seoRedirectHandler();
            } else if (redirectHandler.isSuccess === true){
                switch(redirectHandler.action){
                    case 'merge':
                        $location.path(redirectHandler.path);
                        break;
                    case 'apply':
                        $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                        $window.location.reload();
                        break;
                    case 'microsite':
                        LocalStorage.remove('socialProfileRedirect');
                        $('.landing-page-content').hide();
                        $('.landing-page-thank-you').show();
                        if(redirectHandler.path){
                            $window.location.href = redirectHandler.path;
                        }
                        break;
                    default:
                        $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                        $location.path(redirectHandler.path);
                        break;
                }
            } else{
                $location.path('/profile/');
            }
            jQuery('.loading-container').css('display', 'none');
        };

        $scope.socialUserFirstLoginAttempt = function () {
            var redirectAction = {
                action: 'dashboard',
                path:'/profile/'
            };
            $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
            if( authService.internalToken.token !== undefined && authService.internalToken.token.length >0){
                authService.extendCurrentBearerAuthentication(authService.internalToken);
                $scope.socialBearerSuccessHandler();
            }  else {
                jQuery('.loading-container').css('display', 'none');
                $scope.socialProvider.setRegistrationCaller('');
                $location.url('/profile/login/');
                $scope.socialProvider.showNotificationToggle(true,ModelDependencyFactory.socialProvider.notificationEngine.loginFail);
            }
        };

        $scope.socialProfileLogin = function (socialProfile,redirectAction) {
            /// TODO: need to remove overridden of  redirectAction once account validation gets implemented
            var redirectHandler = $scope.socialProvider.utility.getRedirectDirectionFromStorage();
            if (redirectHandler.isSuccess === true){
                switch (redirectHandler.action) {
                    case 'merge':
                        redirectAction = angular.merge(redirectAction,redirectHandler);
                        break;
                }
            }
            $scope.socialProvider.utility.setRedirectDirectionToStorage(redirectAction);
            authService.socialLogin(socialProfile.email, socialProfile.bearerAccessToken, $scope.socialBearerSuccessHandler);
        };

        $scope.socialMergeProfileLogin = function (response) {
            $scope.socialProvider.utility.removeRedirectDirectionInStorage();
            $scope.socialProvider.setRegistrationCaller('');
            if(response.accessToken !== null && response.accessToken !== undefined){
                authService.socialLogin($scope.socialProvider.getProfile().email, response.accessToken, $scope.socialBearerSuccessHandler);
            } else{
                $scope.socialProvider.showNotificationToggle(true,ModelDependencyFactory.socialProvider.notificationEngine.loginFail);
            }
        };

        $scope.setSocialIconTabIndex = function() {
            $rootScope.globalProgressBarHandler(true);
            var state = $scope.socialProvider.utility.setTabIndex();
            $scope.socialIconObserverAttemptCount ++;
            if(state === false && $scope.socialIconObserverAttemptCount < 20){
                setTimeout($scope.setSocialIconTabIndex,250)
            }else{
                $rootScope.globalProgressBarHandler(false);
            }
        };

        $scope.onFileUploadFocus = function () {
            $scope.fileUploadGotFocused = true;
        };

        $scope.onFileLostFocus = function(){
            $scope.fileUploadGotFocused = false;
        };

        $scope.onFocusState = function () {
            $scope.inputGotFocused = true;
        };

        $scope.onFocusLostState = function(){
            $scope.inputGotFocused = false;
        };

        $scope.termsAndConditionsUpdate = function () {
            var deferred = $q.defer();
            migrationService.GDPR.updateTermsAndMarketing({
                termsAndPolicy: $scope.termsAndPolicy,
                subscribe     : $scope.subscribe
            }).then(function (result) {
                deferred.resolve(0);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }

    }

})();
