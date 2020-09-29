/**
 * Created by tdadam on 9/8/2017.
 */

(function() {
    'use strict';

    angular
        .module('st.controllers.apply.site')
        .controller('schemaScreeningController', schemaScreeningController);

    schemaScreeningController.$inject = ['$scope', '$controller', '$log', '$location', '$window', 'questions','SessionStorage', 'LocalStorage', '$q', '$rootScope', 'authService', 'ApplicationState'];

    function schemaScreeningController($scope, $controller, $log, $location, $window, questions, SessionStorage, LocalStorage, $q, $rootScope, authService, ApplicationState) {
        angular.extend(this, $controller('candidateBaseHelper',  {$scope: $scope}));

        var $ = jQuery;
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_SCREENING_QUESTIONS);

        $scope.backButtonTitle = "< Back";
        $scope.table = "answers";
        $scope.mandatoryFieldCollection = [];
        initialize();

        $scope.submitScreeningAnswers = function(form) {
            try {

                //TODO: need to remove once approach decided for actions disable.
                if(form.$invalid){
                    return false;
                }

                if(_XC_CONFIG.form_naming_enabled === true) {
                    window.dataLayer.push({
                        'event': "Analytics Funel",
                        'formName': $scope.angularSchemaObserver.activeForm.title.trim().replace(/\s+/g, '-').toLowerCase(),
                        'URL': window.location.href,
                        'requisition': ApplicationState.requisitionId
                    });
                }

                $scope.globalProgressBarHandler(true);
                $scope.applyCandidate = ApplicationState.session.candidate.get();
                $scope.appId = SessionStorage.get('appId');
                $scope.answers = [];
                var getCurDate = new Date();
                var created = getCurDate.getTime();

                for (var key in $scope.results) {
                    // in case option does not exists for question.
                    var optionId = 0;

                    // if checkbox, create individual submit object for each
                    if (($scope.results[key].answer !== null && $scope.results[key].answer !== undefined && angular.isString($scope.results[key].answer) === false)) {
                        var thisObject = Object.keys($scope.results[key].answer);

                        for (var index in thisObject) {
                            $scope.answers.push({
                                'candidateId'    : $scope.applyCandidate.candidateId,
                                'applicationId'  : $scope.appId,
                                'answer'         : $scope.results[key].options[parseInt(thisObject[index])].answer,
                                'generalOptionId': $scope.results[key].options[parseInt(thisObject[index])].generalOptionId,
                                'created'        : created
                            });
                        }

                        continue;
                    }

                    // getting general option id
                    for (var index2 in $scope.results[key].options) {
                        if ($scope.results[key].answer === $scope.results[key].options[index2].answer ||
                            $scope.results[key].options[index2].answer === 'text') {

                            optionId = $scope.results[key].options[index2].generalOptionId;

                        }
                    }

                    // create object to be submitted
                    $scope.answers.push({
                        'candidateId'    : $scope.applyCandidate.candidateId,
                        'applicationId'  : $scope.appId,
                        'answer'         : $scope.results[key].answer,
                        'generalOptionId': optionId,
                        'created'        : created
                    });
                }

                // submit answers
                $rootScope.screening_answers_submit = true;
                $rootScope.screening_answers = $scope.answers; // will be submitted to databases on application submit
                $scope.globalProgressBarHandler(false);
                $scope.angularSchemaObserver.showNextFieldGroup($scope.angularSchemaFormContainer);
            }catch (reason){
                logger.error(reason);
                $scope.globalProgressBarHandler(false);
            }
        };

        function initialize() {
            $scope.screening = [];
            $scope.applyReq = SessionStorage.get('applyReq');
            $scope.screeningQuestions = [];
            $scope.results = $scope.screeningQuestions;
            $scope.isSessionLogged = false;
            $scope.formlistUpdateFlag = true;
            $scope.continueBtn = _XC_CONFIG.context.continue;
            $rootScope.screening_answers_submit = false;
            $rootScope.screening_answers = {};
            $scope.screenCompleteIcon = false;
            $scope.formlistUpdateFlag = true;

            if ($scope.applyReq !== null && $scope.applyReq !== undefined) {
                getReqQuestions($scope.applyReq.requisitionId);
            }

            if(authService.isLoggedIn){
                $scope.isSessionLogged = true;
            }

            $scope.angularSchemaObserver.registerExternalComponent($scope);
            if ($scope.angularSchemaFormContainer.isLastForm === true) {
                $scope.continueBtn = _XC_CONFIG.context.submit;
            }
            $scope.angularSchemaFormContainer.showEditButton = authService.isLoggedIn;
        }

        function getReqQuestions(reqId) {
            var reqQuestions = [];
            if (reqId !== null && reqId !== undefined) {
                questions.getReqQuestions({ 'requisitionId': reqId }).$promise.then(function(results) {
                    reqQuestions = normalizeObjects(results);
                    if(reqQuestions.length === 0){
                        $scope.angularSchemaObserver.unRegisterExternalComponent($scope);
                    }
                    for (var key in reqQuestions) {
                        getGeneralQuestions(reqQuestions[key].questionGroupId, $scope.screeningQuestions);
                    }

                }, function(reason) {
                    logger.error(reason);
                    $scope.angularSchemaObserver.unRegisterExternalComponent($scope);
                });
            }
        }

        function getGeneralQuestions(questionGroupId, screeningQuestions) {
            questions.getGeneralQuestions({ 'questionGroupId': questionGroupId }).$promise.then(function(results) {
                var questionGroup = normalizeObjects(results);

                for (var index in questionGroup) {
                    if (questionGroup[index].active === 't') {
                        questionGroup[index].options = [];
                        questionGroup[index].answer = null;
                        getGeneralOptions(questionGroup[index].generalQuestionsId, questionGroup[index]);
                        screeningQuestions.push(questionGroup[index]);
                    }
                }

            }, function(reason) {
                logger.error(reason);
            });
        }

        function getGeneralOptions(generalQuestionsId, questionGroup) {
            questions.getGeneralOptions({ 'generalQuestionsId': generalQuestionsId }).$promise.then(function(results) {
                questionGroup.options = normalizeObjects(results);
                if(questionGroup.type === "VCheck" || questionGroup.type === "HCheck" ){
                    questionGroup.options = questionGroup.options.sort(function (opt1, opt2) {
                        return opt1.sortOrder - opt2.sortOrder ;
                    });
                }
            }, function(reason) {
                logger.error(reason);
            });
        }

        $scope.submitActionSemaphore = function () {
            var _semaphore = true;
            var _result =  _.findWhere($scope.results, {required: 't' , answer : null});
            if(_result === undefined){
                _result = _.findWhere($scope.results, {required: 't' , answer : undefined});
            }
            if(_result === undefined){
                if($scope.schemaScreeningForm === undefined){
                    return _semaphore
                }else{
                    if ($scope.angularSchemaFormContainer !== undefined && $scope.angularSchemaFormContainer.isLastForm === true) {
                        var _allFormSemaphore = $scope.angularSchemaObserver.isAllFormValid($scope.angularSchemaFormContainer);
                        _semaphore = _allFormSemaphore.returnState;
                    }
                    _semaphore = ($scope.results.length < 1 || $scope.schemaScreeningForm.$invalid === false);
                }
            }else{
                _semaphore =  false;
            }
            return _semaphore;
        }
    }

})();
