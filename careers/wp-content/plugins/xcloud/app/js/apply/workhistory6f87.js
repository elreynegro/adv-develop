angular.module("com.hrlogix.ats.applyflow").controller('workHistoryFormController',
    ['$scope', '$log', '$controller', '$location', '$window', 'SessionStorage', 'privateCandidate', 'ListService', 'LocalStorage', 'authService', '$rootScope','ModelDependencyFactory', '$q','$timeout', 'ApplicationState',
        function ($scope, $log, $controller, $location, $window, SessionStorage, privateCandidate, ListService, LocalStorage, authService, $rootScope,ModelDependencyFactory, $q, $timeout, ApplicationState) {

    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_WORK_HISTORY);

    angular.extend(this, $controller('baseController',  {$scope: $scope}));

    initialize();

    $scope.empHistoryContinue = function($event) {
        $event.preventDefault();
        ListService.applyFormList('setNext');
        logger.log(ListService.applyFormList('get'));
        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(options){
                $('#'+optionsKey).slideDown(function() {
                    $scope.applyCandidate = ApplicationState.session.candidate.get();
                    if (optionsKey == 'eduHistory' && options === true) {
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

        $scope.empHistoryComplete = true;
        $scope.empHistorySkip = true;
        $scope.empHistoryCompleteIcon = true;
        $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;

        if($scope.reqIdLink){
            $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
        }

        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            jQuery('.loading-container').css('display', 'block');
            $scope.candidateServiceHandler('lastContainerHandler');
        }
    };

    $scope.empHistoryUpdate = function($event) {
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

        $scope.empHistoryCompleteIcon = true;
    };

    $scope.editEmpHistory = function($event) {
        $event.preventDefault();
        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(optionsKey == 'empHistory'){
                $('#'+optionsKey).slideDown();
            }else{
                $('#'+optionsKey).slideUp();
            }
        });
    };

    $scope.gotoEditWorkHistory = function (Id) {
        for (var key in $scope.addedWorkHistory) {
            if ($scope.addedWorkHistory[key].workHistoryId === Id) {
                $scope.workHistory = angular.copy($scope.addedWorkHistory[key]);
                $scope.editWH = true;
                break;
            }
        }
    };

    $scope.resetFormsValidity = function () {
        $scope.addEmpHistory.company.$touched = false;
        $scope.addEmpHistory.title.$touched = false;
        $scope.addEmpHistory.managerName.$touched = false;
        $scope.addEmpHistory.managerPhone.$touched = false;
        $scope.addEmpHistory.description.$touched = false;
        if($scope.addEmpHistory.contact !== undefined) {
            $scope.addEmpHistory.contact.$touched = false;
        }
        if($scope.addEmpHistory.startDate !== undefined) {
            $scope.addEmpHistory.startDate.$touched = false;
        }
        if($scope.addEmpHistory.endDate !== undefined) {
            $scope.addEmpHistory.endDate.$touched = false;
        }
        if($scope.addEmpHistory.address1 !== undefined) {
            $scope.addEmpHistory.address1.$touched = false;
        }
        if($scope.addEmpHistory.city !== undefined) {
            $scope.addEmpHistory.city.$touched = false;
        }
        if($scope.addEmpHistory.state !== undefined) {
            $scope.addEmpHistory.state.$touched = false;
        }
        if($scope.addEmpHistory.zip !== undefined) {
            $scope.addEmpHistory.zip.$touched = false;
        }
        if($scope.addEmpHistory.startSalary !== undefined) {
            $scope.addEmpHistory.startSalary.$touched = false;
        }
        if($scope.addEmpHistory.endSalary !== undefined) {
            $scope.addEmpHistory.endSalary.$touched = false;
        }
        if($scope.addEmpHistory.reason !== undefined) {
            $scope.addEmpHistory.reason.$touched = false;
        }
        if($scope.addEmpHistory.gapExplain !== undefined) {
            $scope.addEmpHistory.gapExplain.$touched = false;
        }
        if($scope.addEmpHistory.char1_1 !== undefined) {
            $scope.addEmpHistory.char1_1.$touched = false;
        }
        if($scope.addEmpHistory.char1_2 !== undefined) {
            $scope.addEmpHistory.char1_2.$touched = false;
        }
    };

    $scope.submitEmpHistory = function () {
        $scope.addEmpHistory.$invalid = true;
        jQuery('.loading-container').css('display', 'block');

        $scope.candidateServiceHandler('addWorkHistory')
            .then(function () {
                $scope.addedWorkHistory.push($scope.workHistory);
                $scope.empHistoryDisabled = true;
                $scope.empHistorySkip = true;
                $scope.empHistoryCompleteIcon = true;
                $scope.resetFormsValidity();
                $scope.workHistory = {};
                $scope.workHistory.current = 'f';
                $timeout(function(){$('#empHistoryCompleteBtn').focus();},500);
                jQuery('.loading-container').css('display', 'none');
            })
            .catch(function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
    };

    $scope.updateEmpHistory = function () {
        $scope.addEmpHistory.$invalid = true;
        jQuery('.loading-container').css('display', 'block');

        $scope.candidateServiceHandler('updateWorkHistory')
            .then(function () {
                for (var key in $scope.addedWorkHistory) {
                    if ($scope.addedWorkHistory[key].workHistoryId === $scope.workHistory.workHistoryId) {
                        $scope.addedWorkHistory[key] = $scope.workHistory;
                        break;
                    }
                }
                $scope.empHistoryDisabled = true;
                $scope.empHistorySkip = true;
                $scope.empHistoryCompleteIcon = true;
                $('#empHistoryCompleteBtn').focus();
                $scope.resetFormsValidity();
                jQuery('.loading-container').css('display', 'none');
                $scope.workHistory = {};
                $scope.workHistory.current = 'f';
                $scope.editWH = false;
            })
            .catch(function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
    };

    $scope.cancelUpdateEmp = function ($event) {
        $event.preventDefault();
        // Commented: The Current State for core variables need to retain.
        // $scope.empHistoryComplete = true;
        // $scope.empHistoryDisabled = true;
        // $scope.empHistorySkip = true;
        // $scope.empHistoryCompleteIcon = true;

        $('#empHistoryCompleteBtn').focus();
        $scope.resetFormsValidity();

        $scope.workHistory = {};
        $scope.workHistory.current = 'f';
        $scope.editWH = false;
    };

    $scope.deleteEmpHistory = function(deleteWorkHistory) {
        $scope.deleteWorkHistory = deleteWorkHistory;
        $('#deleteWorkHistory_company').html($scope.deleteWorkHistory.company);
        $('#deleteEmpHistModal').modal({ backdrop: 'static', keyboard: false, show: true });
        $('.modal-backdrop').css('z-index', '-1 !important');
        $timeout(function(){
            $("#confirmEmpDelete").focus();
        },500);


    };

    $scope.deleteEmpHistoryConfirmed = function (deleteWorkHistoryId) {
        var workHistoryId=deleteWorkHistoryId;
       jQuery('.loading-container').css('display', 'block');
        privateCandidate.deleteWorkHistory({workHistoryId: workHistoryId}).$promise.then(function (results) {

            angular.forEach($scope.addedWorkHistory, function(options, optionsKey){
                if(options.workHistoryId == deleteWorkHistoryId){
                    $scope.addedWorkHistory.splice(optionsKey, 1);
                }
            });

            // Commented: Just need to do re-model in case no records exists
            // if($scope.addedWorkHistory.length>0){
            //     $scope.empHistoryComplete = true;
            //     $scope.empHistoryDisabled = true;
            //     $scope.empHistorySkip = true;
            //     $scope.empHistoryCompleteIcon = true;
            // }else{
            //     $scope.empHistoryComplete = false;
            //     $scope.empHistorySkip = false;
            //     $scope.empHistoryCompleteIcon = false;
            // }

            if($scope.addedWorkHistory.length>0){
                $scope.empHistoryComplete = false;
                $scope.empHistorySkip = false;
                $scope.empHistoryCompleteIcon = false;
            }


            if($scope.workHistory !== null) {
                if($scope.workHistory.workHistoryId === deleteWorkHistoryId) {
                    $scope.resetFormsValidity();
                    $scope.workHistory = {};
                    $scope.workHistory.current = 'f';
                    $scope.editWH = false;
                }
            }
            if($scope.addedWorkHistory.length>0) {
                $timeout(function () {
                    $('#empHistoryCompleteBtn').focus();
                }, 500)
            }
            else{
                $timeout(function () {
                    $('#empHistorySkipBtn').focus();
                }, 500)
            }
            jQuery('.loading-container').css('display', 'none');
        }, function (reason) {
          logger.error(reason);
          jQuery('.loading-container').css('display', 'none');
        });


    };
    
    $scope.validateEndDate = function () {
        if($scope.workHistory.current === 't'){
            $scope.workHistory.endDate = null;
        }
    };

    $scope.validatePhone2 = function () {
        if($scope.workHistory.managerPhone > 0){
            $scope.phone2Flase = true;
        }else{
            $scope.phone2Flase = false;
        }
    };

    $scope.compareDate = function (controlId,viewValue,control) {
        var deferred = $q.defer();
        try {
            if($scope.dateCompareFieldCollection.length > 0){
                var workHistoryLocal = {};
                angular.forEach($scope.dateCompareFieldCollection, function(value, key){
                    if(value.indexOf(controlId) !== -1){
                        var element = value.split(',');
                        // element = element.split(',');
                        if(element.length >0 ){
                            workHistoryLocal[element[0]] = $("#"+element[0]).val();
                            workHistoryLocal[element[1]] = $("#"+element[1]).val();
                            if(controlId === element[0]){
                                if(workHistoryLocal[element[1]] !== null && workHistoryLocal[element[1]] !== undefined){
                                    var toDate = new Date(workHistoryLocal[element[1]]);
                                    var fromDate = new Date(viewValue);
                                    if(fromDate > toDate){
                                        $scope.datecompareFieldErrors[element[0]] = true;
                                        deferred.resolve(false);
                                    }else{
                                        $scope.datecompareFieldErrors[element[0]] = false;
                                        $scope.datecompareFieldErrors[element[1]] = false;
                                        $scope.workHistory[element[1]] = workHistoryLocal[element[1]];
                                        deferred.resolve(true);
                                    }
                                }else{
                                    $scope.datecompareFieldErrors[element[0]] = false;
                                    $scope.datecompareFieldErrors[element[1]] = false;
                                    deferred.resolve(true);
                                }
                            }
                            if(controlId === element[1]){
                                if(workHistoryLocal[element[0]] !== null && workHistoryLocal[element[1]] !== undefined){
                                    var fromDate = new Date(workHistoryLocal[element[0]]);
                                    var toDate= new Date(viewValue);
                                    if(fromDate > toDate){
                                        $scope.datecompareFieldErrors[element[1]] = true;
                                        deferred.resolve(false);
                                    }else{
                                        $scope.datecompareFieldErrors[element[1]] = false;
                                        $scope.datecompareFieldErrors[element[0]] = false;
                                        $scope.workHistory[element[0]] = workHistoryLocal[element[0]];
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
        logger.debug('workHistoryFormController initialize()');
        $scope.lists = {};
        $scope.workHistory = {};
        $scope.dobPattern = '\\d{4}-\\d{2}-\\d{2}';
        $scope.workHistory.current = 'f';
        $scope.addedWorkHistory = [];
        $scope.formlistUpdateFlag = true;
        $scope.isSessionLogged = false;
        $scope.continueBtn = _XC_CONFIG.context.continue;
        ListService.applyFormList('initiFormList');

        $scope.phone2Flase = false;

        $scope.dateCompareFieldCollection = [];
        $scope.dateCompareFieldCollection.push( 'startDate,endDate' ); //static date field populating for Ward trucking
        $scope.datecompareFieldErrors = {};
        $scope.datecompareFieldErrors = {'startDate':false, 'endDate':false};

        var listsNeeded = ["yn", "state"];
        var loadListPromise = function () {
            return ListService.loadListNames($scope.lists, listsNeeded);
        };

        try {
            loadListPromise().then(function () {
                /*if(ApplicationState.session.candidate.get() !== null && ApplicationState.session.candidate.get() !== undefined){
                 $scope.applyCandidate = ApplicationState.session.candidate.get();
                 privateCandidate.getCandidateWorkHistory({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function(result){
                 $scope.addedWorkHistory = normalizeObjects(result);
                 });
                 }
                 else*/
                if (authService.isLoggedIn) {
                    privateCandidate.getCurrentCandidate().$promise.then(function (result) {
                        $scope.applyCandidate = normalizeObjects(result);
                        $scope.isSessionLogged = true;
                        privateCandidate.getCandidateWorkHistory({candidateId: $scope.applyCandidate.candidateId}).$promise.then(function (result) {
                            $scope.addedWorkHistory = normalizeObjects(result);
                            if ($scope.addedWorkHistory.length > 0) {
                                $scope.empHistoryComplete = true;
                                $scope.empHistorySkip = true;
                                $scope.empHistoryCompleteIcon = true;
                            }
                        });
                    })
                        .catch(function (reason) {
                            logger.error(reason);
                        });
                }

                $("#empHistory").slideUp();

                if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                    $scope.continueBtn = _XC_CONFIG.context.submit;
                    jQuery('.loading-container').css('display', 'none');
                }
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

    $rootScope.populateWorkHistory = function() {
        if ($scope.addedWorkHistory.length>0)
        {
            return;
        }
        $scope.workHistoryToUpload = [];
        if ($rootScope.resumeParsed === true) {
            if ($rootScope.resumeJSON.ResDoc.resume.experience !== undefined && $rootScope.resumeJSON.ResDoc.resume.experience !== null) {
                var experience = $rootScope.resumeJSON.ResDoc.resume.experience;
                // The code has refactor as reusable processor between CFM and static stream's.
                $scope.workHistoryToUpload = ModelDependencyFactory.candidateHelper.parserCollection.resume.getEmploymentModel(experience,{candidateId:$rootScope.applyCandidateId});
            }
        } else {
            var socialProfile =  ModelDependencyFactory.socialProvider.getProfile();
            if ( socialProfile !== null && socialProfile !== undefined && socialProfile.redirectType === ModelDependencyFactory.socialProvider.registrationSource.applySocialProfile){
                $scope.workHistoryToUpload = ModelDependencyFactory.socialProvider.getWorkHistoryModel($rootScope.applyCandidateId);
            }
        }

        for (var index in $scope.workHistoryToUpload) {
            privateCandidate.addWorkHistory($scope.workHistoryToUpload[index]).$promise.then(function(results) {
                $scope.addedWorkHistory.push(normalizeObjects(results));
            }, function(reason) {
                hasError(reason, 'Unable to add employment history record!');
            });
        }
    };

}]);
