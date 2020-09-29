/**
 * Created by shanjock46 on 7/24/2017.
 */

angular.module("com.hrlogix.ats.applyflow").controller('experienceDriverFormController',
    ['$scope', '$controller', '$filter', '$log', '$location', 'candidate', 'lists', 'privateCandidate', 'privateApplication', 'SessionStorage', 'LocalStorage', 'ListService', 'authService', '$rootScope', '$timeout', 'ApplicationState',
        function ($scope, $controller, $filter, $log, $location, candidate, lists, privateCandidate, privateApplication, SessionStorage, LocalStorage, ListService, authService, $rootScope, $timeout, ApplicationState) {

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORM);

            angular.extend(this, $controller('baseController',  {$scope: $scope}));

            initialize();

            $scope.editExpDriver = function($event) {
                $event.preventDefault();
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'expDriver'){
                        $rootScope.UpdateExperienceDriverFormFields();
                        $('#'+optionsKey).slideDown();
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };

            $scope.submitExpDriverCandidate = function () {
                logger.debug('submitCandidate called in bg form');
                var applyCan = ApplicationState.session.candidate.get();
                $scope.applyCandidate = applyCan;

                jQuery('.loading-container').css('display', 'block');

                if (applyCan !== null && applyCan !== undefined) {
                    logger.debug('applyCandidate found, updateCandidate()');
                    var experienceDriverFieldList = ['dlState', 'dlNumber', 'string64_29', 'string64_30', 'date_6', 'char1_12', 'char1_13', 'text_5', 'text_6'];
                    $.each(experienceDriverFieldList, function( index, value ) {
                        $scope.applyCandidate[value] = $scope.edCandidate[value];
                    });
                    // $scope.applyCandidate = angular.merge($scope.applyCandidate, $scope.edCandidate);
                    jQuery('.loading-container').css('display', 'block');
                    $scope.candidateServiceHandler('updateCandidate')
                        .then(function () {
                            $scope.expDriverComplete = true;
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

            function initialize() {
                $scope.lists = {};
                $scope.continueBtn = _XC_CONFIG.context.continue;
                $scope.formlistUpdateFlag = true;
                $scope.expDriverComplete = false;
                ListService.applyFormList('initiFormList');

                $scope.edCandidate = {};
                $scope.isSessionLogged = false;

                logger.debug('experiencePlatfromController initialize()');
                try {

                    var listsNeeded = ["yn", "state", "yn_denied_license", "yn_suspended_license"];
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
                            $scope.edCandidate = normalizeObjects(result);
                            $scope.isSessionLogged = true;
                            $scope.expDriverComplete = true;
                        })
                            .catch(function (reason) {
                                logger.error(reason);
                            });
                    }

                    $scope.mode = 'add';
                    $("#expDriver").slideUp();

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

            $rootScope.UpdateExperienceDriverFormFields = function () {
                var applyCan = ApplicationState.session.candidate.get();
                $timeout(function () {
                    /*$scope.edCandidate.dlState = applyCan.dlState;
                    $scope.edCandidate.dlNumber = applyCan.dlNumber;*/
                    $scope.edCandidate = applyCan;
                });
            };
        }
    ]
);
