angular.module("com.hrlogix.ats.applyflow").controller('backgroundInfoFormController',
    ['$scope', '$controller', '$filter', '$log', '$location', 'candidate', 'lists', 'privateCandidate', 'privateApplication', 'SessionStorage', 'LocalStorage', 'ListService', 'authService', '$rootScope', '$timeout', 'ApplicationState',
        function ($scope, $controller, $filter, $log, $location, candidate, lists, privateCandidate, privateApplication, SessionStorage, LocalStorage, ListService, authService, $rootScope, $timeout, ApplicationState) {

    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORM);

    angular.extend(this, $controller('baseController',  {$scope: $scope}));

    initialize();

    $scope.editBackground = function($event) {
        $event.preventDefault();
        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(optionsKey == 'bgInfo'){
                $rootScope.UpdateBackGroundFormFields();
                $('#'+optionsKey).slideDown();
            }else{
                $('#'+optionsKey).slideUp();
            }
        });
    };

    function callback() {
        $scope.resumeJSON = {};
    }

    $scope.submitCandidate = function () {
        logger.debug('submitCandidate called in bg form');
        var applyCan = ApplicationState.session.candidate.get();

        jQuery('.loading-container').css('display', 'block');
        
        if (applyCan !== null && applyCan !== undefined) { 
            logger.debug('applyCandidate found, updateCandidate()');
            $scope.applyCandidate = applyCan;
            $scope.applyCandidate = angular.merge($scope.applyCandidate, $scope.bgCandidate);
            jQuery('.loading-container').css('display', 'block');
            $scope.candidateServiceHandler('updateCandidate')
                .then(function () {
                    $scope.bgInfoComplete = true;
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
                } else {
                    logger.debug('applyCandidate NOT found, addCandidate()');
                    $scope.candidateServiceHandler('processAddCandidate')
                        .then(function(){
                            $scope.bgInfoComplete = true;
                            $scope.mode = 'update';
                            ListService.applyFormList('setNext');
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

        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            $scope.candidateServiceHandler('lastContainerHandler');
        }
    };

    function initialize() {
        $scope.lists = {};
        $scope.continueBtn = _XC_CONFIG.context.continue;
        $scope.formlistUpdateFlag = true;
        $scope.bgInfoComplete = false;
        ListService.applyFormList('initiFormList');

        logger.debug('backgroundInfoFormController initialize()');       
        try {

            var listsNeeded = ["yn", "ethnicity", "state", "gender"];
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
                    $scope.bgCandidate = normalizeObjects(result);
                    $scope.isSessionLogged = true;
                    $scope.bgInfoComplete = true;
                    if ($scope.bgCandidate != null) {
                        if ($scope.bgCandidate.dob != null) {
                            // TODO
                        }
                    }
                })
                    .catch(function (reason) {
                        logger.error(reason);
                    });
            }
            else {
                $scope.bgCandidate = {};
                $scope.isSessionLogged = false;
            }

            $scope.mode = 'add';
            $("#bgInfo").slideUp();

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

            $rootScope.UpdateBackGroundFormFields = function () {
                var applyCan = ApplicationState.session.candidate.get();
                $timeout(function () {
                    /*$scope.bgCandidate.dlState = applyCan.dlState;
                    $scope.bgCandidate.dlNumber = applyCan.dlNumber;
                    $scope.bgCandidate.gender = applyCan.gender;
                    $scope.bgCandidate.ethnicity = applyCan.ethnicity;*/
                    $scope.bgCandidate = applyCan;
                });
            };
        }]);
