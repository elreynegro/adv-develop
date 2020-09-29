angular.module("com.hrlogix.ats.applyflow").controller('eeoFormController',
    ['$scope', '$controller', '$filter', '$log', '$location', 'candidate', 'lists', 'privateCandidate', 'privateApplication', 'SessionStorage', 'LocalStorage', 'ListService', 'authService', '$rootScope', '$timeout', 'ApplicationState',
        function ($scope, $controller, $filter, $log, $location, candidate, lists, privateCandidate, privateApplication, SessionStorage, LocalStorage, ListService, authService, $rootScope, $timeout, ApplicationState) {

            angular.extend(this, $controller('baseController',  {$scope: $scope}));

            var $ = jQuery;
            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_EEO);

            initialize();

            $scope.editEeo = function($event) {
                $event.preventDefault();
                $scope.eeoCandidate = $scope.applyCandidate;
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'eeoInfo'){
                        $('#'+optionsKey).slideDown(function () {
                            $rootScope.UpdateEeoFormFields();
                        });
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };


            function initialize(){
                $scope.lists = {};
                $scope.application = {};
                $scope.step = {};
                $scope.continueBtn = _XC_CONFIG.context.continue;
                $scope.eeoMsg = _XC_CONFIG.context.eeo;
                $scope.mode = 'add';
                ListService.applyFormList('initiFormList');
                $scope.isSessionLogged = false;
                $scope.formlistUpdateFlag = true;
                $scope.eeoCompleteIcon = false;

                // Since this form is optional, don't prepopulate it
                $scope.eeoCandidate = {};


                if(authService.isLoggedIn){
                    privateCandidate.getCurrentCandidate().$promise
                        .then(function (result) {
                            $scope.isSessionLogged = true;
                            $scope.applyCandidate = normalizeObjects(result);
                            $scope.eeoCandidate = $scope.applyCandidate;
                            $scope.eeoInfoComplete = true;
                            $scope.eeoCompleteIcon = true;
                        })
                        .catch(function (reason) {
                            logger.error(reason);
                        });
                }
                else{
                    $scope.applyCandidate = {};
                }

                var listsNeeded = ["yn", "ethnicity", "gender"];
                var loadListPromise = function () {
                    return ListService.loadListNames($scope.lists, listsNeeded);
                };
                loadListPromise();

                $("#eeoInfo").slideUp();

                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.continueBtn = _XC_CONFIG.context.submit;
                    jQuery('.loading-container').css('display', 'none');
                }
            }

            $scope.updateCandidate = function(){
                $scope.applyCandidate = ApplicationState.session.candidate.get();

                var getCurDate = new Date();
                $scope.applyCandidate.updateDate = getCurDate.getTime();
                var toSubmit = angular.merge($scope.applyCandidate, $scope.eeoCandidate);

                jQuery('.loading-container').css('display', 'block');

                candidate.updateCandidate(toSubmit).$promise.then(function (result) {
                    $scope.applyCandidate = normalizeObjects(result);
                    $scope.eeoCandidate = $scope.applyCandidate;
                    ApplicationState.session.candidate.set( $scope.applyCandidate);
                    $scope.eeoInfoComplete = true;
                    if($scope.mode == 'add'){
                        $scope.mode = 'update';
                    }

                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                        $scope.applyCandidate = ApplicationState.session.candidate.get();
                        logger.log($scope.applyCandidate);
                        $scope.candidateServiceHandler('lastContainerHandler');
                    }
                    else{
                        if($scope.formlistUpdateFlag){
                            ListService.applyFormList('setNext');
                            $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
                        }
                        $scope.eeoCompleteIcon = true;
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
                    }
                }, function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });

                if($scope.reqIdLink){
                    $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
                }
            };

            /*$scope.editEeo = function($event) {
                $event.preventDefault();
                $scope.eeoCandidate = $scope.applyCandidate;
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'eeoInfo'){
                        $('#'+optionsKey).slideDown(function () {
                            $rootScope.UpdateEeoFormFields();
                        });
                    }else{
                        $('#'+optionsKey).slideUp();
                    }
                });
            };*/
            $rootScope.UpdateEeoFormFields = function () {
                var applyCan = ApplicationState.session.candidate.get();
                $timeout(function () {
                    /*$scope.eeoCandidate.gender = applyCan.gender;
                    $scope.eeoCandidate.ethnicity = applyCan.ethnicity;*/
                    $scope.eeoCandidate = applyCan;
                });
            };
        }
    ]
);
