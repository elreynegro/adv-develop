/**
 * Created by TDadam on 8/31/2017.
 */
angular.module("com.hrlogix.ats.applyflow").controller('referencesFormController',
    ['$scope', '$log', '$controller', '$location', '$window', 'SessionStorage', 'privateCandidate', 'ListService', 'LocalStorage', 'authService', '$rootScope','ModelDependencyFactory', 'ApplicationState',
        function ($scope, $log, $controller, $location, $window, SessionStorage, privateCandidate, ListService, LocalStorage, authService, $rootScope,ModelDependencyFactory, ApplicationState) {

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_WORK_HISTORY);

            angular.extend(this, $controller('baseController',  {$scope: $scope}));

            initialize();

            $scope.fieldsTouchedState = function(state){
                $scope.addReference.name.$touched = state;
                $scope.addReference.phone.$touched = state;
                $scope.addReference.dlState.$touched = state;
                $scope.addReference.city.$touched = state;
                $scope.addReference.address.$touched = state;
                $scope.addReference.addressAdditional.$touched = state;
                $scope.addReference.zip.$touched = state;
            };

            $scope.referencesContinue = function($event) {
                $event.preventDefault();
                ListService.applyFormList('setNext');
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

                $scope.referencesComplete = true;
                $scope.referencesSkip = $scope.addedReferences.length > 2;
                $scope.referencesCompleteIcon = true;
                $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;

                if($scope.reqIdLink){
                    $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                }

                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    jQuery('.loading-container').css('display', 'block');
                    $scope.candidateServiceHandler('lastContainerHandler');
                }
            };

            $scope.referencesUpdate = function($event) {
                $event.preventDefault();
                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    jQuery('.loading-container').css('display', 'block');
                    $scope.candidateServiceHandler('lastContainerHandler');
                }

                if($scope.formlistUpdateFlag){
                    ListService.applyFormList('setNext');
                    $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag
                }

                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(options){
                        $('#'+optionsKey).slideDown(function () {
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
                $scope.referencesCompleteIcon = true;
            };

            $scope.editReferences = function($event) {
                $event.preventDefault();
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'references'){
                        $('#'+optionsKey).slideDown();
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };

            $scope.gotoEditReference = function (Id) {
                for (var key in $scope.addedReferences) {
                    if ($scope.addedReferences[key].profReferenceId === Id) {
                        $scope.reference = angular.copy($scope.addedReferences[key]);
                        $scope.editReference = true;
                        break;
                    }
                }
            };

            $scope.submitReferences = function () {
                $scope.addReference.$invalid = true;
                $scope.applyCandidate = ApplicationState.session.candidate.get();
                jQuery('.loading-container').css('display', 'block');
                $scope.reference.candidateId = $scope.applyCandidate.candidateId;
                $scope.candidateServiceHandler('addReference')
                    .then(function () {
                        $scope.addedReferences.push($scope.reference);
                        $scope.referencesDisabled = true;
                        $scope.referencesSkip = $scope.addedReferences.length > 2;
                        $scope.referencesCompleteIcon = true;
                        $('#referencesCompleteBtn').focus();
                        jQuery('.loading-container').css('display', 'none');
                        $scope.reference = {};
                        $scope.fieldsTouchedState(false);
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                    });
            };

            $scope.updateReferences = function () {
                $scope.addReference.$invalid = true;
                jQuery('.loading-container').css('display', 'block');

                $scope.candidateServiceHandler('updateReference')
                    .then(function () {
                        for (var key in $scope.addedReferences) {
                            if ($scope.addedReferences[key].profReferenceId === $scope.reference.profReferenceId) {
                                $scope.addedReferences[key] = $scope.reference;
                                break;
                            }
                        }
                        $scope.referencesDisabled = true;
                        $scope.referencesSkip = $scope.addedReferences.length > 2;
                        $scope.referencesCompleteIcon = true;
                        $('#referencesCompleteBtn').focus();
                        jQuery('.loading-container').css('display', 'none');
                        $scope.reference = {};
                        $scope.editReference = false;
                        $scope.fieldsTouchedState(false);
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        jQuery('.loading-container').css('display', 'none');
                    });
            };

            $scope.cancelUpdateReference = function ($event) {
                $event.preventDefault();
                $('#referencesCompleteBtn').focus();
                $scope.reference = {};
                $scope.editReference = false;
                $scope.fieldsTouchedState(false);
            };

            $scope.deleteReferences = function(deleteReference) {
                $scope.deleteReference = deleteReference;
                $('#deleteReference').modal({ backdrop: 'static', keyboard: false, show: true });
                $('.modal-backdrop').css('z-index', '-1 !important');
            };

            $scope.deleteReferenceConfirmed = function (deleteReferenceId) {
                var ReferenceId=deleteReferenceId;
                jQuery('.loading-container').css('display', 'block');
                privateCandidate.deleteReference({profReferenceId: ReferenceId}).$promise.then(function (results) {
                    angular.forEach($scope.addedReferences, function(options, optionsKey){
                        if(options.profReferenceId === deleteReferenceId){
                            $scope.addedReferences.splice(optionsKey, 1);
                        }
                    });
                    if($scope.addedReferences.length>0){
                        $scope.referencesComplete = false;
                        $scope.referencesSkip = $scope.addedReferences.length > 2;
                        $scope.referencesCompleteIcon = false;
                    }
                    $('#referencesCompleteBtn').focus();
                    if($scope.reference !== null) {
                        if($scope.reference.profReferenceId === deleteReferenceId) {
                            $scope.reference = {};
                            $scope.editReference = false;
                            $scope.fieldsTouchedState(false);
                        }
                    }
                    jQuery('.loading-container').css('display', 'none');
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });


            };

            $scope.validatePhone = function (event) {
                if($scope.reference.phone !== undefined){
                    var elements = $scope.reference.phone.split(" ");
                    if(elements.length > 7 || $scope.reference.phone.length <= 1){
                        $scope.addReference.phone.$setValidity('required', false);
                        return false;
                    } else{
                        $scope.addReference.phone.$setValidity('required', true);
                        $scope.addReference.phone.$valid = true;
                        return true;
                    }
                } else {
                    $scope.addReference.phone.$setValidity('required', false);
                    return false;
                }
            };

            function initialize() {
                logger.debug('ReferenceFormController initialize()');
                $scope.reference = {};
                $scope.addedReferences = [];
                $scope.formlistUpdateFlag = true;
                $scope.isSessionLogged = false;
                $scope.continueBtn = _XC_CONFIG.context.continue;
                $scope.lists = {};
                ListService.applyFormList('initiFormList');
                $scope.editReference = false;

                var listsNeeded = ['state'];
                var loadListPromise = function () {
                    return ListService.loadListNames($scope.lists, listsNeeded);
                };

                loadListPromise();

                if(authService.isLoggedIn){
                    privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                        $scope.applyCandidate = normalizeObjects(result);
                        $scope.isSessionLogged = true;
                        privateCandidate.getCandidateReferences({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function(result){
                            $scope.addedReferences = normalizeObjects(result);
                            if($scope.addedReferences.length >0) {
                                $scope.referencesComplete = true;
                                $scope.referencesSkip = true;
                                $scope.referencesCompleteIcon = true;
                            }
                        });
                    })
                        .catch(function (reason) {
                            logger.error(reason);
                        });
                }

                $("#references").slideUp();

                $('#name').focus();
                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.continueBtn = _XC_CONFIG.context.submit;
                    jQuery('.loading-container').css('display', 'none');
                }
            }

        }]);
