/**
 * Created by shanjock46 on 7/24/2017.
 */

angular.module("com.hrlogix.ats.applyflow").controller('skillsFormController',
    ['$scope', '$controller', '$filter', '$log', '$location', 'candidate', 'lists', 'privateCandidate', 'privateApplication', 'SessionStorage', 'LocalStorage', 'ListService', 'authService', '$rootScope', 'ApplicationState',
        function ($scope, $controller, $filter, $log, $location, candidate, lists, privateCandidate, privateApplication, SessionStorage, LocalStorage, ListService, authService, $rootScope, ApplicationState) {

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORM);

            angular.extend(this, $controller('baseController',  {$scope: $scope}));

            initialize();

            $scope.editSkillsForm = function($event) {
                $event.preventDefault();
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'SkillsContainer'){
                        $('#'+optionsKey).slideDown();
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };

            $scope.submitSkillsCandidate = function () {
                logger.debug('submitCandidate called in bg form');
                var applyCan = ApplicationState.session.candidate.get();
                $scope.applyCandidate = applyCan;

                jQuery('.loading-container').css('display', 'block');

                if (applyCan !== null && applyCan !== undefined) {
                    logger.debug('applyCandidate found, updateCandidate()');
                    var SkillsContainerFieldList = ['char1_24', 'string64_72', 'text_15', 'char1_25', 'text_16', 'text_17', 'text_18', 'text_14'];
                    $.each(SkillsContainerFieldList, function( index, value ) {
                        $scope.applyCandidate[value] = $scope.skillCandidate[value];
                    });
                    // $scope.applyCandidate = angular.merge($scope.applyCandidate, $scope.skillCandidate);
                    jQuery('.loading-container').css('display', 'block');
                    $scope.candidateServiceHandler('updateCandidate')
                        .then(function () {
                            $scope.skillsFormComplete = true;
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
                $scope.skillsFormComplete = false;
                ListService.applyFormList('initiFormList');

                $scope.skillCandidate = {};
                $scope.isSessionLogged = false;

                logger.debug('skillsFormController initialize()');
                try {

                    var listsNeeded = ["yn", "yn_military_training"];
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
                            $scope.skillCandidate = normalizeObjects(result);
                            $scope.isSessionLogged = true;
                            $scope.skillsFormComplete = true;
                        })
                            .catch(function (reason) {
                                logger.error(reason);
                            });
                    }

                    $scope.mode = 'add';
                    $("#SkillsContainer").slideUp();

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
