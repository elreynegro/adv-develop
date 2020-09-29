angular.module("com.hrlogix.ats.applyflow").controller('educationHistoryFormController',
    ['$scope', '$controller', '$log', '$location', '$window', 'SessionStorage', 'privateCandidate', 'ListService', 'LocalStorage', 'authService', '$rootScope','ModelDependencyFactory','$timeout', 'ApplicationState',
        function ($scope, $controller, $log, $location, $window, SessionStorage, privateCandidate, ListService, LocalStorage, authService, $rootScope,ModelDependencyFactory,$timeout, ApplicationState) {

    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_EDUCATION);

    angular.extend(this, $controller('baseController',  {$scope: $scope}));

    initialize();
    /*Did you Graduate slider. Focus and remove focus from span slider based on hidden check box focus*/
    $scope.showBorder = false;
    $scope.graduateToggleFocus = function(){
        $scope.showBorder = !$scope.showBorder;
    }

    $scope.booleanToYesNo = function(booleanItem) {
        if (booleanItem === true || booleanItem === 't') {
            return 'Yes';
        } else {
            return 'No';
        }
    };

    $scope.eduHistoryContinue = function($event) {
        $event.preventDefault();
        ListService.applyFormList('setNext');
        $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(options){
                $('#'+optionsKey).slideDown(function() {
                    // populateNextSection();
                    // $rootScope.populateWorkHistory($scope.resumeParsed, $scope.resumeJSON, $scope.applyCandidate.candidateId, clearResumeObj);

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

        $scope.eduHistoryComplete = true;
        $scope.eduHistoryCompleteIcon = true;
        $scope.addEduHistory.institution.$touched = false;

        if($scope.reqIdLink){
            $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
        }
        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            jQuery('.loading-container').css('display', 'block');
            $scope.candidateServiceHandler('lastContainerHandler');
        }
    };

    $scope.eduHistoryUpdate = function($event) {
        $event.preventDefault();
        if($scope.formlistUpdateFlag){
            ListService.applyFormList('setNext');
            $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag
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

        $scope.addEduHistory.institution.$touched = false;

        if($scope.reqIdLink){
            $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
        }

        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            jQuery('.loading-container').css('display', 'block');
            $scope.candidateServiceHandler('lastContainerHandler');
        }
    };

    $scope.editEduHistory = function($event) {
        $event.preventDefault();
        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(optionsKey == 'eduHistory'){
                $('#'+optionsKey).slideDown();
            }else{
                $('#'+optionsKey).slideUp();
            }
        });
    };

    $scope.gotoEditEduHistory = function (Id) {
        for (var key in $scope.addedEduHistory) {
            if ($scope.addedEduHistory[key].educationId === Id) {
                $scope.eduHistory = angular.copy($scope.addedEduHistory[key]);
                $scope.editEdu = true;
                break;
            }
        }
    };

    $scope.submitEduHistory = function () {
        $scope.addEduHistory.$invalid = true;
        // $scope.eduHistory.levelAttained = $scope.eduHistory.subject;
        jQuery('.loading-container').css('display', 'block');
        $scope.candidateServiceHandler('addEducationHistory')
            .then(function () {
                $scope.addedEduHistory.push($scope.eduHistory);
                $scope.eduHistoryDisabled = true;
                $scope.eduHistoryCompleteIcon = true;
                $scope.addEduHistory.institution.$touched = false;
                $scope.addEduHistory.city.$touched = false;
                $scope.addEduHistory.state.$touched = false;
                $scope.addEduHistory.country.$touched = false;
                $scope.addEduHistory.levelAttained.$touched = false;
                $scope.addEduHistory.subject.$touched = false;
                $scope.eduHistory = {};
                $scope.eduHistory.completed = 'f';
                $timeout(function(){
                    $('#eduHistoryCompleteBtn').focus();
                },500)
                jQuery('.loading-container').css('display', 'none');
            })
            .catch(function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
    };

    $scope.updateEduHistory = function () {
        $scope.addEduHistory.$invalid = true;
        jQuery('.loading-container').css('display', 'block');
        $scope.candidateServiceHandler('updateEducation')
            .then(function () {
                for (var key in $scope.addedEduHistory) {
                    if ($scope.addedEduHistory[key].educationId === $scope.eduHistory.educationId) {
                        $scope.addedEduHistory[key] = $scope.eduHistory;
                        break;
                    }
                }
                $scope.eduHistoryDisabled = true;
                $scope.eduHistoryCompleteIcon = true;
                $scope.addEduHistory.institution.$touched = false;
                $scope.addEduHistory.city.$touched = false;
                $scope.addEduHistory.state.$touched = false;
                $scope.addEduHistory.country.$touched = false;
                $scope.addEduHistory.levelAttained.$touched = false;
                $scope.addEduHistory.subject.$touched = false;
                $scope.eduHistory = {};
                $scope.eduHistory.completed = 'f';
                $scope.editEdu = false;
                $('#eduHistoryCompleteBtn').focus();
                jQuery('.loading-container').css('display', 'none');
            })
            .catch(function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });


    };

    $scope.cancelUpdateEdu = function ($event) {
        $event.preventDefault();
        $scope.eduHistoryDisabled = true;
        $scope.eduHistoryCompleteIcon = true;
        $scope.addEduHistory.institution.$touched = false;
        $scope.addEduHistory.city.$touched = false;
        $scope.addEduHistory.state.$touched = false;
        $scope.addEduHistory.country.$touched = false;
        $scope.addEduHistory.levelAttained.$touched = false;
        $scope.addEduHistory.subject.$touched = false;
        $scope.eduHistory = {};
        $scope.eduHistory.completed = 'f';
        $scope.editEdu = false;
        $('#eduHistoryCompleteBtn').focus();
    };

    $scope.deleteEduHistory = function(deleteEducationHistory) {
        $scope.deleteEducationHistory = deleteEducationHistory;
        $('#deleteEducationHistory_institution').html($scope.deleteEducationHistory.institution);
        $('#deleteEduHistModal').modal({ backdrop: 'static', keyboard: false, show: true });
        $('.modal-backdrop').css('z-index', '-1 !important');
        $timeout(function(){
            $("#confirmEduDelete").focus();
        },500);
    };

    $scope.deleteEduHistoryConfirmed = function (deleteEducationHistoryId) {
        var educationId = deleteEducationHistoryId;
        jQuery('.loading-container').css('display', 'block');
        privateCandidate.deleteEducationHistory({educationId: educationId}).$promise.then(function (results) {

            angular.forEach($scope.addedEduHistory, function(options, optionsKey){
                if(options.educationId == deleteEducationHistoryId){
                    $scope.addedEduHistory.splice(optionsKey, 1);
                }
            });

            if($scope.addedEduHistory.length>0){
                $scope.eduHistoryDisabled = true;
                $scope.eduHistoryCompleteIcon = true;
            }else{
                $scope.eduHistoryDisabled = false;
                $scope.eduHistoryCompleteIcon = false;
            }


            if($scope.eduHistory !== null) {
                if ($scope.eduHistory.educationId === deleteEducationHistoryId) {
                    $scope.addEduHistory.institution.$touched = false;
                    $scope.addEduHistory.city.$touched = false;
                    $scope.addEduHistory.state.$touched = false;
                    $scope.addEduHistory.country.$touched = false;
                    $scope.addEduHistory.subject.$touched = false;
                    $scope.addEduHistory.levelAttained.$touched = false;
                    $scope.eduHistory = {};
                    $scope.eduHistory.completed = 'f';
                    $scope.editEdu = false;
                }
            }
            if($scope.addedEduHistory.length>0){
                $timeout(function(){
                    $('#eduHistoryCompleteBtn').focus();
                },500)
            }
            else{
                $timeout(function () {
                    $("#institution").focus();
                },500)
            }

            jQuery('.loading-container').css('display', 'none');
        }, function (reason) {
          logger.error(reason);
          jQuery('.loading-container').css('display', 'none');
        });


    };

    function initialize() {
        logger.debug('educationHistoryFormController initialize()');
        $scope.eduHistory = {};
        $scope.eduHistory.completed = 'f';
        $scope.addedEduHistory = [];
        $scope.lists = {};
        $scope.eduHistoryDisabled = false;
        $scope.eduHistoryComplete = false;
        $scope.continueBtn = _XC_CONFIG.context.continue;
        ListService.applyFormList('initiFormList');
        $scope.formlistUpdateFlag = true;

        var listsNeeded = ['yn', 'state', 'education'];
        var loadListPromise = function () {
            return ListService.loadListNames($scope.lists, listsNeeded);
        };

        loadListPromise();
        /*if(ApplicationState.session.candidate.get() !== null && ApplicationState.session.candidate.get() !== undefined){
            $scope.applyCandidate = ApplicationState.session.candidate.get();
            privateCandidate.getCandidateEducation({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function(result){
                $scope.addedEduHistory = normalizeObjects(result);
            });
        }
        else*/
        if(authService.isLoggedIn){
            privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                $scope.applyCandidate = normalizeObjects(result);
                $scope.isSessionLogged = true;
                privateCandidate.getCandidateEducation({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function(result){
                    $scope.addedEduHistory = normalizeObjects(result);
                    if($scope.addedEduHistory.length >0){
                        $scope.eduHistoryComplete = true;
                        $scope.eduHistoryCompleteIcon = true;
                    }
                });
            })
            .catch(function (reason) {
                logger.error(reason);
            });
        }else{
            $scope.isSessionLogged = false;
        }

        $("#eduHistory").slideUp();

        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            $scope.continueBtn = _XC_CONFIG.context.submit;
            jQuery('.loading-container').css('display', 'none');
        }
    }

    $rootScope.populateEducation = function() {
        if ($scope.addedEduHistory.length>0)
        {
            return;
        }

        $scope.educationToUpload = [];

        if ($rootScope.resumeParsed === true) {
            if ($rootScope.resumeJSON.ResDoc.resume.education !== undefined && $rootScope.resumeJSON.ResDoc.resume.education !== null) {
                var resumeEducation = $rootScope.resumeJSON.ResDoc.resume.education;
                // The code has refactor as reusable processor between CFM and static stream's.
                $scope.educationToUpload = ModelDependencyFactory.candidateHelper.parserCollection.resume.getEducationModel(resumeEducation,{candidateId:$rootScope.applyCandidateId});
            }
        } else {
            var socialProfile =  ModelDependencyFactory.socialProvider.getProfile();
            if ( socialProfile !== null && socialProfile !== undefined && socialProfile.redirectType === ModelDependencyFactory.socialProvider.registrationSource.applySocialProfile){
                $scope.educationToUpload = ModelDependencyFactory.socialProvider.getEducationHistoryModel($rootScope.applyCandidateId);
            }
        }

        console.log($scope.educationToUpload);

        for (var index in $scope.educationToUpload) {
            privateCandidate.addEducation($scope.educationToUpload[index]).$promise.then(function(results) {
                $scope.addedEduHistory.push(normalizeObjects(results));
            }, function(reason) {
                hasError(reason, 'Unable to add employment history record!');
            });
        }
    }

}]);
