/**
 * Created by shanjock46 on 7/24/2017.
 */

angular.module("com.hrlogix.ats.applyflow").controller('drivingExperienceFormController',
    ['$scope', '$controller', '$filter', '$log', '$location', 'candidate', 'lists', 'privateCandidate', 'privateApplication', 'SessionStorage', 'LocalStorage', 'ListService', 'authService', '$rootScope', '$q', 'ApplicationState',
        function ($scope, $controller, $filter, $log, $location, candidate, lists, privateCandidate, privateApplication, SessionStorage, LocalStorage, ListService, authService, $rootScope, $q, ApplicationState) {

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORM);

            angular.extend(this, $controller('baseController',  {$scope: $scope}));

            initialize();

            $scope.editDrivingExperienceForm = function($event) {
                $event.preventDefault();
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'drivingExperience'){
                        $('#'+optionsKey).slideDown();
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };

            $scope.submitDrivingExpCandidate = function () {
                logger.debug('submitCandidate called in bg form');
                var applyCan = ApplicationState.session.candidate.get();
                $scope.applyCandidate = applyCan;

                jQuery('.loading-container').css('display', 'block');

                if (applyCan !== null && applyCan !== undefined) {
                    logger.debug('applyCandidate found, updateCandidate()');
                    var drivingExperienceFieldList = ['char1_14', 'string64_31', 'date_7', 'date_8', 'string64_32',
                        'char1_15', 'string64_33', 'date_9', 'date_10', 'string64_34', 'char1_23', 'string64_55',
                        'date_13', 'date_14', 'string64_56', 'char1_16', 'string64_35', 'date_11', 'date_12',
                        'string64_36', 'text_7', 'text_8', 'text_9', 'char1_17', 'char1_18', 'char1_19', 'text_11',
                        'char1_20', 'text_10', 'char1_22', 'text_12', 'text_14'];
                    $.each(drivingExperienceFieldList, function( index, value ) {
                        $scope.applyCandidate[value] = $scope.deCandidate[value];
                    });
                    // $scope.applyCandidate = angular.merge($scope.applyCandidate, $scope.deCandidate);
                    jQuery('.loading-container').css('display', 'block');
                    $scope.candidateServiceHandler('updateCandidate')
                        .then(function () {
                            $scope.drivingExperienceFormComplete = true;
                            if($scope.formlistUpdateFlag){
                                $scope.mode = 'update';
                                ListService.applyFormList('setNext');
                                $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
                            }
                            angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                                if(options){
                                    $('#'+optionsKey).slideDown(function(){
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
                            jQuery('.loading-container').css('display', 'none');
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                            jQuery('.loading-container').css('display', 'none');
                        });
                }

                if($scope.reqIdLink){
                    $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                }

                if ($scope.applyCandidate === undefined || $scope.applyCandidate === null) {
                    logger.error('applyCandidate was not found on $scope');
                    jQuery('.loading-container').css('display', 'none');
                }
                else if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.candidateServiceHandler('lastContainerHandler');
                }
            };

            $scope.compareDate = function (controlId,viewValue,control) {
                var deferred = $q.defer();
                try {
                    if($scope.dateCompareFieldCollection.length > 0){
                        var deCandidateLocal = {};
                        angular.forEach($scope.dateCompareFieldCollection, function(value, key){
                            if(value.indexOf(controlId) !== -1){
                                var element = value.split(',');
                                // element = element.split(',');
                                if(element.length >0 ){
                                    deCandidateLocal[element[0]] = $("#"+element[0]).val();
                                    deCandidateLocal[element[1]] = $("#"+element[1]).val();
                                    if(controlId === element[0]){
                                        if(deCandidateLocal[element[1]] !== null && deCandidateLocal[element[1]] !== undefined){
                                            var toDate = new Date(deCandidateLocal[element[1]]);
                                            var fromDate = new Date(viewValue);
                                            if(fromDate > toDate){
                                                $scope.datecompareFieldErrors[element[0]] = true;
                                                deferred.resolve(false);
                                            }else{
                                                $scope.datecompareFieldErrors[element[0]] = false;
                                                $scope.datecompareFieldErrors[element[1]] = false;
                                                $scope.deCandidate[element[1]] = deCandidateLocal[element[1]];
                                                deferred.resolve(true);
                                            }
                                        }else{
                                            $scope.datecompareFieldErrors[element[0]] = false;
                                            $scope.datecompareFieldErrors[element[1]] = false;
                                            deferred.resolve(true);
                                        }
                                    }
                                    if(controlId === element[1]){
                                        if(deCandidateLocal[element[0]] !== null && deCandidateLocal[element[1]] !== undefined){
                                            var fromDate = new Date(deCandidateLocal[element[0]]);
                                            var toDate= new Date(viewValue);
                                            if(fromDate > toDate){
                                                $scope.datecompareFieldErrors[element[1]] = true;
                                                deferred.resolve(false);
                                            }else{
                                                $scope.datecompareFieldErrors[element[1]] = false;
                                                $scope.datecompareFieldErrors[element[0]] = false;
                                                $scope.deCandidate[element[0]] = deCandidateLocal[element[0]];
                                                deferred.resolve(true);
                                            }
                                        }else{
                                            $scope.datecompareFieldErrors[element[1]] = false;
                                            $scope.datecompareFieldErrors[element[0]] = false;
                                            deferred.resolve(true);
                                        }
                                    }
                                }
                            }
                        });
                    }else{
                        $scope.datecompareFieldErrors[element[0]] = false;
                        $scope.datecompareFieldErrors[element[1]] = false;
                        deferred.resolve(true);
                    }
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }

                return deferred.promise;
            };

            function initialize() {
                $scope.lists = {};
                $scope.continueBtn = _XC_CONFIG.context.continue;
                $scope.dobPattern = '\\d{4}-\\d{2}-\\d{2}';
                $scope.formlistUpdateFlag = true;
                $scope.drivingExperienceFormComplete = false;
                ListService.applyFormList('initiFormList');

                $scope.deCandidate = {};
                $scope.isSessionLogged = false;

                $scope.dateCompareFieldCollection = [];
                $scope.dateCompareFieldCollection.push( 'date_7,date_8', 'date_9,date_10', 'date_13,date_14','date_11,date_12' ); //static date field populating for Ward trucking
                $scope.datecompareFieldErrors = {};
                $scope.datecompareFieldErrors = {'date_7':false, 'date_8':false, 'date_9':false, 'date_10':false, 'date_11':false, 'date_12':false, 'date_13':false};

                logger.debug('experiencePlatfromController initialize()');
                try {

                    var listsNeeded = ["yn", "yn_straight_truck", "yn_tractor", "yn_two_trailers", "yn_other_equipment", "year_down", "yn_auto_accident", "yn_auto_violation", "yn_failed_no", "yn_failed_yes", "yn_dui"];
                    var loadListPromise = function () {
                        return ListService.loadListNames($scope.lists, listsNeeded);
                    };

                    loadListPromise();

                    // Commented because few time this controller initialize happens before personalinforamtion controller
                    // and below code depends on value saved in personalinforamtion controller
                    /*if(ApplicationState.session.candidate.get() !== null && ApplicationState.session.candidate.get() !== undefined){
                     $scope.bgCandidate = ApplicationState.session.candidate.get();
                     }
                     else*/

                    if (authService.isLoggedIn) {
                        privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                            $scope.deCandidate = normalizeObjects(result);
                            $scope.isSessionLogged = true;
                            $scope.drivingExperienceFormComplete = true;
                        })
                            .catch(function (reason) {
                                logger.error(reason);
                            });
                    }

                    $scope.mode = 'add';
                    $("#drivingExperience").slideUp();

                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                        $scope.continueBtn = _XC_CONFIG.context.submit;
                        jQuery('.loading-container').css('display', 'none');
                    }
                }
                catch (reason) {
                    logger.error(reason);
                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                        $scope.continueBtn = _XC_CONFIG.context.submit;
                        jQuery('.loading-container').css('display', 'none');
                    }
                }
            }
        }
    ]
);
