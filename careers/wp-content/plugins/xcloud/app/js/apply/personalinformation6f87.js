angular.module("com.hrlogix.ats.applyflow").controller('personalInformationFormController',
    ['$scope', '$controller', '$rootScope', '$log', '$location', '$q', '$cookies', '$http', '$timeout', '$window', 'candidate', 'privateCandidate', 'lists', 'privateApplication', 'privateStep', 'SessionStorage', 'LocalStorage', 'authService', 'ListService', 'bgResumeUpload', 'bgResumeParser','ApplicationState','candidateAssessmentService',
        function ($scope, $controller, $rootScope, $log, $location, $q, $cookies, $http, $timeout, $window, candidate, privateCandidate, lists, privateApplication, privateStep, SessionStorage, LocalStorage, authService, ListService, bgResumeUpload, bgResumeParser,ApplicationState,candidateAssessmentService) {


    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_PERSONAL_INFO);

    angular.extend(this, $controller('baseController',  {$scope: $scope}));

    initialize();

    $scope.editCanInfo = function($event) {
        $event.preventDefault();
        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(optionsKey == 'canInfo'){
                $rootScope.UpdatePersonalInformationFormFields();
                $('#'+optionsKey).slideDown();
            }else{
                $('#'+optionsKey).slideUp();
            }
        });
    };

    $scope.submitCandidate = function () {
        if ($scope.customFieldResults !== undefined) {
            for (var key in $scope.customFieldResults) {
                $scope.applyCandidate[$scope.customFieldResults[key].columnName] = $scope.customFieldResults[key].result;
            }
        }

        if ($scope.mode === 'add') {
            jQuery('.loading-container').css('display', 'block');

            $scope.candidateServiceHandler('processAddCandidate')
            .then(function () {
                if($scope.reqIdLink){
                    $scope.setApplicationStatus('add',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                }
                var deferred = $q.defer();
                try {
                    logger.debug('processAddCandidate complete');
                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                        jQuery('.loading-container').css('display', 'block');
                        $scope.applicationStepServiceHandler()
                            .then(function () {
                                $scope.candidateServiceHandler('updateCandidateSendEmail')
                                    .then(function () {
                                        logger.debug('Application complete, thank you!: headed to account');
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
                    }else{
						ListService.applyFormList('setNext');
						$scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
						$scope.canInfoComplete = true;
						angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
							if(options){
								$('#'+optionsKey).slideDown(function() {
									if(optionsKey == 'empHistory' && options === true) {
										$rootScope.populateWorkHistory();
									}  else if (optionsKey == 'eduHistory' && options === true) {
										$rootScope.populateEducation();
									}

                                    if(optionsKey == 'bgInfo'){
                                        $rootScope.UpdateBackGroundFormFields();
                                    }else if(optionsKey == 'expDriver'){
                                        $rootScope.UpdateExperienceDriverFormFields();
                                    }else if(optionsKey == 'eeoInfo'){
                                        $rootScope.UpdateEeoFormFields();
                                    }
								});
							}else{
								$('#'+optionsKey).slideUp();
							}
						});

						if ($scope.isLastForm !== true) {
							jQuery('.loading-container').css('display', 'none');
							deferred.resolve(0);
						}
					}
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
                jQuery('.loading-container').css('display', 'none');
            });

        } else {
            jQuery('.loading-container').css('display', 'block');

            $scope.candidateServiceHandler('updateCandidate')
                .then(function (updateCandidateResponse) {
                    if($scope.reqIdLink && $scope.hasApplied){
                        $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                    }else if($scope.reqIdLink && !$scope.hasApplied){
                        $scope.setApplicationStatus('add',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                    }
                    var deferred = $q.defer();
                    try {
                        logger.debug('updateCandidate complete');

                        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                            logger.debug('Application complete, thank you!');
                            $scope.applicationStepServiceHandler()
                                .then(function (applicationStepServiceHandlerResponse) {
                                    $location.url('/profile/');
                                })
                                .catch(function (reason) {
                                    logger.error(reason);
                                    jQuery('.loading-container').css('display', 'none');
                                });
                        }

                        if($scope.formlistUpdateFlag){
                            ListService.applyFormList('setNext');
                            $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
                        }
                        $scope.canInfoComplete = true;
                        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                            if(options){
                                $('#'+optionsKey).slideDown();

                                if(optionsKey == 'bgInfo'){
                                    $rootScope.UpdateBackGroundFormFields();
                                }else if(optionsKey == 'expDriver'){
                                    $rootScope.UpdateExperienceDriverFormFields();
                                }else if(optionsKey == 'eeoInfo'){
                                    $rootScope.UpdateEeoFormFields();
                                }
                            }else{
                                $('#'+optionsKey).slideUp();
                            }
                        });

                        jQuery('.loading-container').css('display', 'none');

                        deferred.resolve(0);
                    }
                    catch (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                })
                .catch(function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });
        }
    };

    $scope.validatePhone2 = function () {
        if($scope.applyCandidate.phone2 > 0){
            $scope.phone2Flase = true;
        }else{
            $scope.phone2Flase = false;
        }
    };

    function initialize() {
        $scope.lists = {};
        $scope.attachmentDetails = {};
        $scope.fileFormName = {};
        $scope.dobPattern = '\\d{4}-\\d{2}-\\d{2}';
        $scope.redirectPath = $location.url();
        $rootScope.resumeJSON = {};
        $rootScope.resumeParsed = false;
        $rootScope.applyCandidateId = null;
        $scope.canInfoComplete = false;
        $scope.alreadyApplied = false;
        $scope.credentials = {};
        $scope.addedWorkHistory = [];
        ListService.applyFormList('initiFormList');
        $scope.uniqueEmail = true;
        $scope.deactiveCheck = true;
        $rootScope.showAccount = true;
        $scope.queueInProgress = null;
        $scope.formlistUpdateFlag = true;

        $scope.socialProvider.reset();
        $scope.fieldValidator.reset();

        $scope.phone2Flase = false;

        try {
            logger.debug('personalInformationFormController initialize()');

            var listsNeeded = ["yn", "education", "state", "address_years", "address_months", "yn_referral","assmt_position_codes"];
            var loadListPromise = function () {
                return ListService.loadListNames($scope.lists, listsNeeded);
            };

            $scope.confirmPassword = {text: ''};
            $scope.customFieldResults = [];

            logger.debug('application requisition id: ' + $scope.reqIdLink);

            $scope.mode = 'add';
            $scope.applyCandidate = {};

            loadListPromise().then(function () {
                if($scope.lists.address_years.length === 0){
                    $scope.lists.address_years = [{"listId":8992,"list":"address_years","label":"1","value":"1","action":null,"sortOrder":2,"locale":null,"active":"t"},{"listId":8993,"list":"address_years","label":"2","value":"2","action":null,"sortOrder":3,"locale":null,"active":"t"},{"listId":8994,"list":"address_years","label":"3","value":"3","action":null,"sortOrder":4,"locale":null,"active":"t"},{"listId":8995,"list":"address_years","label":"4","value":"4","action":null,"sortOrder":5,"locale":null,"active":"t"},{"listId":8996,"list":"address_years","label":"5","value":"5","action":null,"sortOrder":6,"locale":null,"active":"t"},{"listId":8997,"list":"address_years","label":"6","value":"6","action":null,"sortOrder":7,"locale":null,"active":"t"},{"listId":8998,"list":"address_years","label":"7","value":"7","action":null,"sortOrder":8,"locale":null,"active":"t"},{"listId":8999,"list":"address_years","label":"8","value":"8","action":null,"sortOrder":9,"locale":null,"active":"t"},{"listId":9000,"list":"address_years","label":"9","value":"9","action":null,"sortOrder":10,"locale":null,"active":"t"},{"listId":9001,"list":"address_years","label":"10","value":"10","action":null,"sortOrder":11,"locale":null,"active":"t"},{"listId":9002,"list":"address_years","label":"11","value":"11","action":null,"sortOrder":12,"locale":null,"active":"t"},{"listId":9003,"list":"address_years","label":"12","value":"12","action":null,"sortOrder":13,"locale":null,"active":"t"},{"listId":9004,"list":"address_years","label":"13","value":"13","action":null,"sortOrder":14,"locale":null,"active":"t"},{"listId":9005,"list":"address_years","label":"14","value":"14","action":null,"sortOrder":15,"locale":null,"active":"t"},{"listId":9006,"list":"address_years","label":"15","value":"15","action":null,"sortOrder":16,"locale":null,"active":"t"},{"listId":9007,"list":"address_years","label":"16","value":"16","action":null,"sortOrder":17,"locale":null,"active":"t"},{"listId":9008,"list":"address_years","label":"17","value":"17","action":null,"sortOrder":18,"locale":null,"active":"t"},{"listId":9009,"list":"address_years","label":"18","value":"18","action":null,"sortOrder":19,"locale":null,"active":"t"},{"listId":9010,"list":"address_years","label":"19","value":"19","action":null,"sortOrder":20,"locale":null,"active":"t"},{"listId":9011,"list":"address_years","label":"20","value":"20","action":null,"sortOrder":21,"locale":null,"active":"t"},{"listId":9012,"list":"address_years","label":"21","value":"21","action":null,"sortOrder":22,"locale":null,"active":"t"},{"listId":9013,"list":"address_years","label":"22","value":"22","action":null,"sortOrder":23,"locale":null,"active":"t"},{"listId":9014,"list":"address_years","label":"23","value":"23","action":null,"sortOrder":24,"locale":null,"active":"t"},{"listId":9015,"list":"address_years","label":"24","value":"24","action":null,"sortOrder":25,"locale":null,"active":"t"},{"listId":9016,"list":"address_years","label":"25","value":"25","action":null,"sortOrder":26,"locale":null,"active":"t"},{"listId":9017,"list":"address_years","label":"26","value":"26","action":null,"sortOrder":27,"locale":null,"active":"t"},{"listId":9018,"list":"address_years","label":"27","value":"27","action":null,"sortOrder":28,"locale":null,"active":"t"},{"listId":9019,"list":"address_years","label":"28","value":"28","action":null,"sortOrder":29,"locale":null,"active":"t"},{"listId":9020,"list":"address_years","label":"29","value":"29","action":null,"sortOrder":30,"locale":null,"active":"t"},{"listId":9021,"list":"address_years","label":"30","value":"30","action":null,"sortOrder":31,"locale":null,"active":"t"},{"listId":9022,"list":"address_years","label":"31","value":"31","action":null,"sortOrder":32,"locale":null,"active":"t"},{"listId":9023,"list":"address_years","label":"32","value":"32","action":null,"sortOrder":33,"locale":null,"active":"t"},{"listId":9024,"list":"address_years","label":"33","value":"33","action":null,"sortOrder":34,"locale":null,"active":"t"},{"listId":9025,"list":"address_years","label":"34","value":"34","action":null,"sortOrder":35,"locale":null,"active":"t"},{"listId":9026,"list":"address_years","label":"35","value":"35","action":null,"sortOrder":36,"locale":null,"active":"t"},{"listId":9027,"list":"address_years","label":"36","value":"36","action":null,"sortOrder":37,"locale":null,"active":"t"},{"listId":9028,"list":"address_years","label":"37","value":"37","action":null,"sortOrder":38,"locale":null,"active":"t"},{"listId":9029,"list":"address_years","label":"38","value":"38","action":null,"sortOrder":39,"locale":null,"active":"t"},{"listId":9030,"list":"address_years","label":"39","value":"39","action":null,"sortOrder":40,"locale":null,"active":"t"},{"listId":9031,"list":"address_years","label":"40","value":"40","action":null,"sortOrder":41,"locale":null,"active":"t"},{"listId":9032,"list":"address_years","label":"41","value":"41","action":null,"sortOrder":42,"locale":null,"active":"t"},{"listId":9033,"list":"address_years","label":"42","value":"42","action":null,"sortOrder":43,"locale":null,"active":"t"},{"listId":9034,"list":"address_years","label":"43","value":"43","action":null,"sortOrder":44,"locale":null,"active":"t"},{"listId":9035,"list":"address_years","label":"44","value":"44","action":null,"sortOrder":45,"locale":null,"active":"t"},{"listId":9036,"list":"address_years","label":"45","value":"45","action":null,"sortOrder":46,"locale":null,"active":"t"},{"listId":9037,"list":"address_years","label":"46","value":"46","action":null,"sortOrder":47,"locale":null,"active":"t"},{"listId":9038,"list":"address_years","label":"47","value":"47","action":null,"sortOrder":48,"locale":null,"active":"t"},{"listId":9039,"list":"address_years","label":"48","value":"48","action":null,"sortOrder":49,"locale":null,"active":"t"},{"listId":9040,"list":"address_years","label":"49","value":"49","action":null,"sortOrder":50,"locale":null,"active":"t"},{"listId":9041,"list":"address_years","label":"50","value":"50","action":null,"sortOrder":51,"locale":null,"active":"t"},{"listId":9042,"list":"address_years","label":"51","value":"51","action":null,"sortOrder":52,"locale":null,"active":"t"},{"listId":9043,"list":"address_years","label":"52","value":"52","action":null,"sortOrder":53,"locale":null,"active":"t"},{"listId":9044,"list":"address_years","label":"53","value":"53","action":null,"sortOrder":54,"locale":null,"active":"t"},{"listId":9045,"list":"address_years","label":"54","value":"54","action":null,"sortOrder":55,"locale":null,"active":"t"},{"listId":9046,"list":"address_years","label":"55","value":"55","action":null,"sortOrder":56,"locale":null,"active":"t"},{"listId":9047,"list":"address_years","label":"56","value":"56","action":null,"sortOrder":57,"locale":null,"active":"t"},{"listId":9048,"list":"address_years","label":"57","value":"57","action":null,"sortOrder":58,"locale":null,"active":"t"},{"listId":9049,"list":"address_years","label":"58","value":"58","action":null,"sortOrder":59,"locale":null,"active":"t"},{"listId":9050,"list":"address_years","label":"59","value":"59","action":null,"sortOrder":60,"locale":null,"active":"t"},{"listId":9051,"list":"address_years","label":"60","value":"60","action":null,"sortOrder":61,"locale":null,"active":"t"},{"listId":9052,"list":"address_years","label":"61","value":"61","action":null,"sortOrder":62,"locale":null,"active":"t"},{"listId":9053,"list":"address_years","label":"62","value":"62","action":null,"sortOrder":63,"locale":null,"active":"t"},{"listId":9054,"list":"address_years","label":"63","value":"63","action":null,"sortOrder":64,"locale":null,"active":"t"},{"listId":9055,"list":"address_years","label":"64","value":"64","action":null,"sortOrder":65,"locale":null,"active":"t"},{"listId":9056,"list":"address_years","label":"65","value":"65","action":null,"sortOrder":66,"locale":null,"active":"t"},{"listId":9057,"list":"address_years","label":"66","value":"66","action":null,"sortOrder":67,"locale":null,"active":"t"},{"listId":9058,"list":"address_years","label":"67","value":"67","action":null,"sortOrder":68,"locale":null,"active":"t"},{"listId":9059,"list":"address_years","label":"68","value":"68","action":null,"sortOrder":69,"locale":null,"active":"t"},{"listId":9060,"list":"address_years","label":"69","value":"69","action":null,"sortOrder":70,"locale":null,"active":"t"},{"listId":9061,"list":"address_years","label":"70","value":"70","action":null,"sortOrder":71,"locale":null,"active":"t"},{"listId":9062,"list":"address_years","label":"71","value":"71","action":null,"sortOrder":72,"locale":null,"active":"t"},{"listId":9063,"list":"address_years","label":"72","value":"72","action":null,"sortOrder":73,"locale":null,"active":"t"},{"listId":9064,"list":"address_years","label":"73","value":"73","action":null,"sortOrder":74,"locale":null,"active":"t"},{"listId":9065,"list":"address_years","label":"74","value":"74","action":null,"sortOrder":75,"locale":null,"active":"t"},{"listId":9066,"list":"address_years","label":"75","value":"75","action":null,"sortOrder":76,"locale":null,"active":"t"},{"listId":9110,"list":"address_years","label":"0","value":"0","action":null,"sortOrder":1,"locale":null,"active":"t"}];
                }
                if($scope.lists.address_months.length === 0){
                    $scope.lists.address_months = [{"listId":9067,"list":"address_months","label":"1","value":"1","action":null,"sortOrder":2,"locale":null,"active":"t"},{"listId":9068,"list":"address_months","label":"2","value":"2","action":null,"sortOrder":3,"locale":null,"active":"t"},{"listId":9069,"list":"address_months","label":"3","value":"3","action":null,"sortOrder":4,"locale":null,"active":"t"},{"listId":9070,"list":"address_months","label":"4","value":"4","action":null,"sortOrder":5,"locale":null,"active":"t"},{"listId":9071,"list":"address_months","label":"5","value":"5","action":null,"sortOrder":6,"locale":null,"active":"t"},{"listId":9072,"list":"address_months","label":"6","value":"6","action":null,"sortOrder":7,"locale":null,"active":"t"},{"listId":9073,"list":"address_months","label":"7","value":"7","action":null,"sortOrder":8,"locale":null,"active":"t"},{"listId":9074,"list":"address_months","label":"8","value":"8","action":null,"sortOrder":9,"locale":null,"active":"t"},{"listId":9075,"list":"address_months","label":"9","value":"9","action":null,"sortOrder":10,"locale":null,"active":"t"},{"listId":9076,"list":"address_months","label":"10","value":"10","action":null,"sortOrder":11,"locale":null,"active":"t"},{"listId":9077,"list":"address_months","label":"11","value":"11","action":null,"sortOrder":12,"locale":null,"active":"t"},{"listId":9078,"list":"address_months","label":"12","value":"12","action":null,"sortOrder":13,"locale":null,"active":"t"},{"listId":9111,"list":"address_months","label":"0","value":"0","action":null,"sortOrder":1,"locale":null,"active":"t"}];
                }
                if($scope.lists.yn_referral.length === 0){
                    $scope.lists.yn_referral = [{"listId":9204,"list":"yn_referral","label":"Employee Referral","value":"t","action":"Referral.jsp","sortOrder":9,"locale":null,"active":"t"},{"listId":9580,"list":"yn_referral","label":"Indeed","value":"Indeed_com","action":null,"sortOrder":11,"locale":null,"active":"t"},{"listId":9594,"list":"yn_referral","label":"CareerBuilder","value":"CareerBuilder_com","action":null,"sortOrder":4,"locale":null,"active":"t"},{"listId":9604,"list":"yn_referral","label":"Monster","value":"Monster_com","action":null,"sortOrder":15,"locale":null,"active":"t"},{"listId":9605,"list":"yn_referral","label":"LinkedIn","value":"Linkedin_com","action":null,"sortOrder":14,"locale":null,"active":"t"},{"listId":9606,"list":"yn_referral","label":"Transport Topics","value":"TransportTopics_com","action":null,"sortOrder":20,"locale":null,"active":"t"},{"listId":9607,"list":"yn_referral","label":"Ward Web Site","value":"WardTrucking_Com","action":null,"sortOrder":22,"locale":null,"active":"t"},{"listId":9608,"list":"yn_referral","label":"Newspaper Ad","value":"NewspaperAd","action":null,"sortOrder":16,"locale":null,"active":"t"},{"listId":9609,"list":"yn_referral","label":"Career Fair","value":"CareerFair","action":null,"sortOrder":3,"locale":null,"active":"t"},{"listId":9610,"list":"yn_referral","label":"Agency","value":"AgencyReferral","action":null,"sortOrder":1,"locale":null,"active":"t"},{"listId":9611,"list":"yn_referral","label":"Other","value":"Other_Misc","action":null,"sortOrder":17,"locale":null,"active":"t"},{"listId":9625,"list":"yn_referral","label":"SimplyHired","value":"SimplyHired","action":null,"sortOrder":18,"locale":null,"active":"t"},{"listId":9626,"list":"yn_referral","label":"Email","value":"9626","action":null,"sortOrder":8,"locale":null,"active":"t"},{"listId":9627,"list":"yn_referral","label":"Billboard","value":"9627","action":null,"sortOrder":2,"locale":null,"active":"t"},{"listId":9628,"list":"yn_referral","label":"Trucking Unlimited","value":"9628","action":null,"sortOrder":21,"locale":null,"active":"t"},{"listId":9629,"list":"yn_referral","label":"Decal on Ward Trailer","value":"9629","action":null,"sortOrder":6,"locale":null,"active":"t"},{"listId":9646,"list":"yn_referral","label":"Social Media","value":"9646","action":null,"sortOrder":19,"locale":null,"active":"t"},{"listId":9647,"list":"yn_referral","label":"CraigsList","value":"9647","action":null,"sortOrder":5,"locale":null,"active":"t"},{"listId":9648,"list":"yn_referral","label":"Jobs In Motion","value":"9648","action":null,"sortOrder":12,"locale":null,"active":"t"},{"listId":9649,"list":"yn_referral","label":"DieselJobs.com","value":"9649","action":null,"sortOrder":7,"locale":null,"active":"t"},{"listId":9651,"list":"yn_referral","label":"Jobs2Careers","value":"9651","action":null,"sortOrder":13,"locale":null,"active":"t"},{"listId":9655,"list":"yn_referral","label":"Glassdoor","value":"glassdoor","action":null,"sortOrder":10,"locale":null,"active":"t"}];
                }
                if (authService.isLoggedIn) {
                    logger.debug('querying candidate');

                    privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                        $scope.applyCandidate = normalizeObjects(result);
                        ApplicationState.session.candidate.set( $scope.applyCandidate);
                        ApplicationState.localStorage.candidate.id.set($scope.applyCandidate.candidateId);
                        authService.setBasicCandidate($scope.applyCandidate);
                        $scope.mode = 'update';
                        $scope.isSessionLogged = true;
                        ListService.applyFormList('setNext');
                        $scope.canInfoComplete = true;
                        ApplicationState.localStorage.candidate.id.set($scope.applyCandidate.candidateId);
                        privateApplication.getApplicationsByCandidateId({candidateId: $scope.applyCandidate.candidateId}).$promise
                            .then(function (result) {
                                $scope.candidateApplications = normalizeObjects(result);
                                logger.log('Application info:');
                                logger.log($scope.candidateApplications);
                                jQuery('.loading-container').css('display', 'block');
                                checkAlreadyApplied();
                                if($scope.alreadyApplied === false){
                                    $scope.getApplicationStatus($scope.applyStreamId);
                                }
                            });
                    })
                        .catch(function (reason) {
                            logger.error(reason);
                        });

                } else {
                    logger.debug('add new candidate');
                    $scope.applyCandidate = {};
                    $scope.isSessionLogged = false;
                }
                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.continueBtn = _XC_CONFIG.context.submit;
                    jQuery('.loading-container').css('display', 'none');
                }
                candidateAssessmentService.loadDomainLookup();
            })
                .catch(function (reason) {
                    logger.error(reason);
                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                        $scope.continueBtn = _XC_CONFIG.context.submit;
                        jQuery('.loading-container').css('display', 'none');
                    }
                });
        }
        catch (reason) {
            logger.error(reason);
            if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                $scope.continueBtn = _XC_CONFIG.context.submit;
                jQuery('.loading-container').css('display', 'none');
            }
        }
    }

    function checkAlreadyApplied(){
        for(var i = 0, len = $scope.candidateApplications.length; i < len; i++){
            if($scope.candidateApplications[i].requisitionId == $scope.reqIdLink){
                jQuery('.loading-container').css('display', 'none');
                $scope.alreadyApplied = true;
                $rootScope.alreadyApplied = true;
            }
        }
    }

    function populateCandidate() {
        var contactInfo = $rootScope.resumeJSON.ResDoc.resume.contact;
        $scope.applyCandidate.uname = $scope.getValueFromArrayOrString(contactInfo.email.toLowerCase(), 0);
        $scope.applyCandidate.firstName = $scope.getValueFromArrayOrString(contactInfo.name.givenname, 0);

        if (angular.isArray(contactInfo.name.givenname)) {
            $scope.applyCandidate.middleName = $scope.getValueFromArrayOrString(contactInfo.name.givenname, 1);
        }

        $scope.applyCandidate.lastName = $scope.getValueFromArrayOrString(contactInfo.name.surname, 0);
//            $scope.applyCandidate.address1 = $scope.getValueFromArrayOrString(contactInfo.address.street, 0);
//            $scope.applyCandidate.city = $scope.getValueFromArrayOrString(contactInfo.address.city, 0);
//            $scope.applyCandidate.state = $scope.getValueFromArrayOrString(contactInfo.address._state, 0);
//            $scope.applyCandidate.zip = $scope.getValueFromArrayOrString(contactInfo.address.postalcode, 0);

        if (angular.isArray(contactInfo.phone)) {
            $scope.applyCandidate.phone1 = $scope.getValueFromArrayOrString(contactInfo.phone, 0);
//                $scope.applyCandidate.phone2 = $scope.getValueFromArrayOrString(contactInfo.phone, 1);
        } else {
            $scope.applyCandidate.phone1 = contactInfo.phone;
        }

    }

    function SocialLoginEvent(eventResponse) {
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
    }

    function newSocialProfileHandler() {
        try {
            $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.applySocialProfile);
            jQuery('.loading-container').css('display', 'block');
            $scope.fieldValidator.isDirtyValid = false;
            var socialProfile = $scope.socialProvider.getProfile();
            if (socialProfile !== null && socialProfile !== undefined) {
                $scope.fieldValidator.isDirtyValid = true;
                ExtractSocialProfile(socialProfile);
                $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                $scope.socialProvider.utility.setProfileDefaultsToStorage();
                $scope.queueCheckEmail();
                $scope.checkEmail();
                $scope.$apply();
            }
            jQuery('.loading-container').css('display', 'none');
        } catch (reason) {
            console.log(reason);
            jQuery('.loading-container').css('display', 'none');
        }
    }

    function AuthenticationTypeResolver(socialProfile) {
        $scope.socialProvider.setRegistrationCaller($scope.socialProvider.registrationSource.applySocialProfile);
        var redirectAction = {
            action: 'apply',
            path:$location.url(),
            caller: 'apply',
            callBackUrl:$location.url()
        };
        $scope.socialProfileAuthenticationEnabler(socialProfile,redirectAction);
    }
            setTimeout(function() {
                if (authService.isLoggedIn !== true) {
                    try {
                        $scope.socialProvider.jsLoadAwaitCount = 0;
                        $scope.socialProvider.showUIWizard(SocialLoginEvent, null, false);
                    } catch (reason) {
                        logger.warn("An issue has occurred while Gigya Provider Loading!");
                        logger.error(reason);
                    }
                } else{
                    $scope.socialProvider.reset();
                    $scope.socialProvider.disConnectSocialConnection();
                    $scope.socialProvider.utility.removeRedirectDirectionInStorage();
                }

            }, 50);

            $rootScope.UpdatePersonalInformationFormFields = function () {
                var applyCan = ApplicationState.session.candidate.get();
                $timeout(function () {
                    $scope.applyCandidate = applyCan;
                });
            };

        }]);
