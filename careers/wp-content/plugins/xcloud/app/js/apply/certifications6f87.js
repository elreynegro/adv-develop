angular.module("com.hrlogix.ats.applyflow").controller('certificationFormController',
    ['$scope', '$log', '$location', '$window', 'SessionStorage', 'privateCandidate', 'ListService', 'LocalStorage', 'authService', '$rootScope','ModelDependencyFactory','$controller','$timeout', 'ApplicationState',
        function ($scope, $log, $location, $window, SessionStorage, privateCandidate, ListService, LocalStorage, authService, $rootScope,ModelDependencyFactory, $controller, $timeout, ApplicationState) {

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_WORK_HISTORY);
            angular.extend(this, $controller('baseController',  {$scope: $scope}));

            initialize();

            function initialize() {
                logger.debug('certificationFormController initialize()');
		        $scope.TEMPLATE_CONSTANTS = $rootScope.TEMPLATE_CONSTANTS;
                $scope.reqIdLink = $location.search().link;
                $scope.cert = {};
                $scope.addedCerts = [];
                $scope.continueBtn = _XC_CONFIG.context.continue;
                $scope.editingCert = false;
                $scope.formlistUpdateFlag = true;
                $scope.isSessionLogged = false;
                ListService.applyFormList('initiFormList');

                /*if(ApplicationState.session.candidate.get() !== null && ApplicationState.session.candidate.get() !== undefined){
                    $scope.applyCandidate = ApplicationState.session.candidate.get();
                    privateCandidate.getCertifications({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function(result){
                        $scope.addedCerts = normalizeObjects(result);
                    });
                }
                else*/
                if(authService.isLoggedIn) {
                    privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                        $scope.applyCandidate = normalizeObjects(result);
                        $scope.isSessionLogged = true;
                        privateCandidate.getCertifications({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function (result) {
                            $scope.addedCerts = normalizeObjects(result);
                            if($scope.addedCerts !== undefined && $scope.addedCerts !== null && $scope.addedCerts.length > 0){
                                $scope.certsComplete = true;
                                $scope.certsSkip = true;
                                $scope.certCompleteIcon = true;
                            }
                        });
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                    });
                }

                $("#certHistory").slideUp();

                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.continueBtn = _XC_CONFIG.context.submit;
                    jQuery('.loading-container').css('display', 'none');
                }
            }

            // TODO: Straight copy and paste, need to clean this up
            $scope.certsContinue = function($event) {
                $event.preventDefault();
                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.candidateServiceHandler('lastContainerHandler');
                }
                ListService.applyFormList('setNext');
                $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
                logger.log(ListService.applyFormList('get'));
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(options){
                        $('#'+optionsKey).slideDown(function() {
                            $scope.applyCandidate = ApplicationState.session.candidate.get();
                            if (optionsKey == 'empHistory' && options === true) {
                                $rootScope.populateWorkHistory();
                            } else if (optionsKey == 'eduHistory' && options === true) {
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
                if($scope.reqIdLink){
                    $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                }
                $scope.certsComplete = true;
                $scope.certsSkip = true;
                $scope.certCompleteIcon = true;
            };

            // TODO: Straight copy and paste, need to clean this up
            $scope.certsUpdate = function($event) {
                $event.preventDefault();
                if($scope.formlistUpdateFlag){
                    ListService.applyFormList('setNext');
                    $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag
                }
                logger.log(ListService.applyFormList('get'));
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(options){
                        $('#'+optionsKey).slideDown(function () {
                            $scope.applyCandidate = ApplicationState.session.candidate.get();
                            if (optionsKey == 'empHistory' && options === true) {
                                $rootScope.populateWorkHistory();
                            } else if (optionsKey == 'eduHistory' && options === true) {
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
                if($scope.reqIdLink){
                    $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                }
                $scope.certCompleteIcon = true;
            };

            $scope.addCert = function () {
                $scope.applyCandidate = ApplicationState.session.candidate.get();
                $scope.cert.candidateId = $scope.applyCandidate.candidateId;
                $scope.addCerts.$invalid = true;
                jQuery('.loading-container').css('display', 'block');

                privateCandidate.addCertification($scope.cert).$promise.then(function (results) {
                    $scope.addedCerts.push(normalizeObjects(results));
                    $scope.certsSkip = true;
                    $scope.certsComplete = true;
                    $scope.certCompleteIcon = true;
                    $scope.addCerts.certName.$touched = false;
                    $scope.addCerts.certIssueDate.$touched = false;
                    $timeout(function(){
                        $('#certsCompleteBtn').focus();
                    },500);
                    jQuery('.loading-container').css('display', 'none');
                    $scope.cert = {};
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });
            };

            $scope.cancelUpdateCert = function ($event) {
                $event.preventDefault();
                $scope.certsComplete = true;
                $scope.certsSkip = true;
                $scope.certCompleteIcon = true;
                $('#certsCompleteBtn').focus();
                $scope.addCerts.certName.$touched = false;
                $scope.addCerts.certIssueDate.$touched = false;

                $scope.cert = {};
                $scope.editingCert = false;
            };

            $scope.deleteCert = function(deleteCertObj) {
                $scope.deletingCert = deleteCertObj;
                $('#deleteCertKey').html($scope.deletingCert.name);
                $('#deleteCertModal').modal({ backdrop: 'static', keyboard: false, show: true });
                $('.modal-backdrop').css('z-index', '-1 !important');
                $timeout(function(){
                    $("#confirmCertDelete").focus()
                },500);
            };

            $scope.deleteCertConfirmed = function (deleteCertificationId) {
                var certificationId = deleteCertificationId;
                jQuery('.loading-container').css('display', 'block');
                privateCandidate.deleteCertification({certificationId: certificationId}).$promise.then(function (results) {

                    angular.forEach($scope.addedCerts, function(options, optionsKey){
                        if(options.certificationId == deleteCertificationId){
                            $scope.addedCerts.splice(optionsKey, 1);
                        }
                    });

                    if($scope.addedCerts.length>0){
                        $scope.certsComplete = true;
                        $scope.certsSkip = true;
                        $scope.certCompleteIcon = true;
                    }else{
                        $scope.certsComplete = false;
                        $scope.certsSkip = false;
                        $scope.certCompleteIcon = false;
                    }

                    if($scope.cert !== null) {
                        if($scope.cert.certificationId === deleteCertificationId) {
                            $scope.addCerts.certName.$touched = false;
                            $scope.addCerts.certIssueDate.$touched = false;
                            $scope.cert = {};
                            $scope.editingCert = false;
                        }
                    }
                    if($scope.addedCerts.length>0){
                        $timeout(function(){
                            $('#certsCompleteBtn').focus();
                        },500)
                    }
                    else{
                        $timeout(function(){
                            $('#certsSkipBtn').focus();
                        },500)
                    }
                    jQuery('.loading-container').css('display', 'none');
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });


            };

            // TODO: Example of redundant code
            $scope.editCerts = function($event){
                $event.preventDefault();
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'certHistory'){
                        $('#'+optionsKey).slideDown();
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };

            $scope.gotoEditCert = function (Id) {
                for (var key in $scope.addedCerts) {
                    if ($scope.addedCerts[key].certificationId === Id) {
                        $scope.cert = angular.copy($scope.addedCerts[key]);
                        $scope.cert.issueDate = $scope.formatDate($scope.cert.issueDate);
                        $scope.editingCert = true;
                        break;
                    }
                }
            };

            $scope.updateCert = function () {
                $scope.addCerts.$invalid = true;
                jQuery('.loading-container').css('display', 'block');

                privateCandidate.updateCertification($scope.cert).$promise.then(function (results) {
                    for (var key in $scope.addedCerts) {
                        if ($scope.addedCerts[key].certificationId === $scope.cert.certificationId) {
                            $scope.addedCerts[key] = $scope.cert;
                            break;
                        }
                    }
                    $scope.certsComplete = true;
                    $scope.certsSkip = true;
                    $scope.certCompleteIcon = true;
                    $('#certsCompleteBtn').focus();
                    $scope.addCerts.certName.$touched = false;
                    $scope.addCerts.certIssueDate.$touched = false;
                    jQuery('.loading-container').css('display', 'none');
                    $scope.cert = {};
                    $scope.editingCert = false;
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });

            };

            // API is coming back YYYY-MM-DD but Angular is outputting this as a timestamp
            $scope.formatDate = function(str){
                if(str.toString().indexOf('-') < 1){ // <1 because the timestamp might be negative
                    var timestamp = new Date(str);
                    var month = (timestamp.getUTCMonth() + 1).toString();
                    month = month.length < 2 ? '0' + month : month;

                    var day = timestamp.getUTCDate().toString();
                    day = day.length < 2 ? '0' + day : day;

                    str = timestamp.getUTCFullYear() + '-' + month + '-' + day;
                }
                return str;
            }
        }
    ]
);
