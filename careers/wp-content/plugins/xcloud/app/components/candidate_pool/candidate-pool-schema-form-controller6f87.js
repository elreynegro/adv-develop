/**
 * Created by TDadam on 8/17/2017.
 */
(function() {
    'use strict';

angular
    .module('st.candidate.activity')
    .controller('candidateSchemaFormController', candidateSchemaFormController);

    candidateSchemaFormController.$inject = ['$scope', '$q','$timeout','$location','ModelDependencyFactory', 'ApplicationState', 'authService', 'LocalStorage','HTMLHelper', 'publicFolder'];

    function candidateSchemaFormController($scope,$q,$timeout,$location,ModelDependencyFactory,ApplicationState,authService,LocalStorage,HTMLHelper, publicFolder) {

        // Top level members
        $scope.angularSchemaObserver = ModelDependencyFactory.angularSchemaObserver;
        $scope.candidateHelper = ModelDependencyFactory.candidateHelper;
        $scope.canFormBeSkipped = false;
        $scope.currentForm = {};
        $scope.editModel = false;
        $scope.showEditButton = false;
        $scope.filter = {};
        $scope.formStyle = {
            progressBar: {
                class: 'disabled'
            }
        };
        $scope.programmaticModel = {};
        $scope.rowAdded = false;
        $scope.rowEditMode = false;
        $scope.socialProvider = ModelDependencyFactory.socialProvider;
        $scope.TEMPLATE_CONSTANTS = TEMPLATE_CONSTANTS;
        $scope.uNameEditable = true;
        $scope.controlState = {};
        $scope.isShowComponent = true;

        var headProxy;
        var currentProxy;
        var externalValidatorCollection = [];

        $scope.getGlyphIcon = function () {
            return $scope.glyphIcon;
        };

        $scope.restoreErrorState = function (currentForm) {
            currentForm.$pristine = false;
            currentForm.$dirty = true;
            for (var errorCode in  currentForm.$error) {
                if (currentForm.$error.hasOwnProperty(errorCode)) {
                    angular.forEach(currentForm.$error[errorCode], function (errorElement) {
                        if (errorElement.$error !== undefined && errorElement.$error.schemaForm !== undefined) {
                            if (errorElement.$error.schemaForm === true) {
                                errorElement.$error.schemaForm = false;
                            }
                        }
                    })
                }
            }
        };

        $scope.onFocusHandler = function(key){
            $scope.controlState[key] = true;
        };

        $scope.onBlurHandler = function(key){
            $scope.controlState[key] = false;
        };

        $scope.doOutlineOnFocus = function(key){
            return ($scope.controlState[key] === true);
        };

        /**
         *
         * @param elementId
         * @param nextElementId
         */
        $scope.blurAlternative = function (elementId, nextElementId) {
            try {
                var element_Selector = '#' + elementId;
                jQuery(element_Selector).keyup(function (event, args) {
                    $scope.currentForm = $scope.ngForm;
                    var elementNgModel = $scope.currentForm[event.currentTarget.name];
                    jQuery(element_Selector).unbind('keyup');
                    if (elementNgModel !== undefined) {
                        elementNgModel.$validate();
                    }
                    jQuery(element_Selector).change(function (event, args) {
                        jQuery(element_Selector).unbind('change');
                        jQuery(element_Selector).unbind('focusout');
                    });
                    jQuery(element_Selector).focusout(function (event, args) {
                        jQuery(element_Selector).unbind('focusout');
                        if (elementNgModel !== undefined) {
                            elementNgModel.$validate();
                        }
                    });
                });
                if (nextElementId !== undefined) {
                    jQuery(element_Selector).attr('schemaBlurFocus', nextElementId);
                    if (nextElementId !== undefined) {
                        $timeout(function () {
                            jQuery('#' + nextElementId).focus();
                        }, 100, false)
                    }
                }
            } catch (reason) {

            }
        };

        $scope.setRedirectToCurrentModule = function (username) {
            var save = {path: $location.url()};
            if (username) {
                save.username = username;
            }
            LocalStorage.set(STORAGE_KEY.SCHEMA_LOGIN_REDIRECT, save);
        };

        $scope.removeRedirectToCurrentModule = function () {
            try {
                var sessionRedirect = LocalStorage.get(STORAGE_KEY.SCHEMA_LOGIN_REDIRECT);
                if (sessionRedirect && sessionRedirect.$$state.value) {
                    LocalStorage.remove(STORAGE_KEY.SCHEMA_LOGIN_REDIRECT);
                }
            } catch (reason) {
                logger.error(reason);
            }
        };

        // satellite Members

        $scope.isValidTransactionQueue = function () {
            return ($scope.transactionQueue !== undefined && $scope.transactionQueue.head !== null)
        };

        $scope.initiateTransaction = function () {
            $scope.transactionDefaults();
            return $scope.getNextTransaction();
        };

        $scope.getNextTransaction = function () {
            if (headProxy === null && $scope.transactionQueue !== undefined) {
                headProxy = $scope.transactionQueue.head;
                currentProxy = headProxy;
                return currentProxy.data;
            }
            if (currentProxy !== undefined && currentProxy !== null) {
                headProxy = currentProxy;
                currentProxy = currentProxy.next;
                if (currentProxy !== null) {
                    return currentProxy.data;
                } else {
                    return null;
                }

            }
            return currentProxy;
        };

        $scope.getCurrentTransaction = function () {
            if (currentProxy !== null) {
                return currentProxy.data;
            } else {
                return null;
            }
        };

        $scope.onTransactionSuccess = function () {
            if (currentProxy !== null) {
                currentProxy.data.transactionMode = $scope.angularSchemaObserver.transactionMode.Update;
            }
        };

        $scope.filter.getFieldCollection = function () {
            if (currentProxy !== null) {
                return currentProxy.data.fieldNameCollection;
            } else {
                return null;
            }
        };

        $scope.filter.getFieldCustomParserDefinition= function () {
            if (currentProxy !== null) {
                return currentProxy.data.fieldCustomParserDefinition;
            } else {
                return null;
            }
        };

        $scope.filter.getFieldParserDefinition= function () {
            return $scope.fieldParserDefinition;
        };

        $scope.filter.getModel = function () {
            if (angular.isUndefined($scope.model)) {
                return $scope.model;
            }
            return angular.copy($scope.model);
        };

        $scope.extendModelProgrammatically = function (viewModel) {
            if (currentProxy === null) {
                return;
            }
            var _model = $scope.programmaticModel[$scope.getCurrentTransaction().table];
            if (_model === undefined) {
                return;
            }
            viewModel = angular.merge(viewModel, _model);
        };

        $scope.setSocialIconTabIndex = function (globalProgressBarHandler) {
            if (globalProgressBarHandler !== undefined) globalProgressBarHandler(true);
            var state = $scope.socialProvider.utility.setTabIndex();
            $scope.socialIconObserverAttemptCount++;
            if (state === false && $scope.socialIconObserverAttemptCount < 20) {
                setTimeout($scope.setSocialIconTabIndex, 250)
            } else {
                if (globalProgressBarHandler !== undefined) globalProgressBarHandler(false);
            }
        };

        $scope.setKeyElementFocus = function (globalProgressBarHandler) {
            return true;
            // TODO
        };

        $scope.onFormActive = function () {
            $scope.setKeyElementFocus();
            if($scope.fieldGroupCount !== undefined) {
                TEMPLATE_CONSTANTS.RUNTIME.fieldGroupIndex = "(" + TEMPLATE_CONSTANTS.TITLE.LABELS.PAGE.str + " " + $scope.index  + "/" + $scope.fieldGroupCount + ")";
            }
        };

        $scope.submitActionSemaphore = function () {
            var returnState = true;
            $scope.currentForm = $scope.ngForm;

            if ($scope.mandatoryFieldCollection.length === 0 && externalValidatorCollection.length === 0) {
                returnState = true;
            }
            for (var index = 0; index < $scope.mandatoryFieldCollection.length; index++) {
                var modelKey = $scope.mandatoryFieldCollection[index];
                var modelData = $scope.model[modelKey];
                if($scope.model !== undefined){
                    if(modelData === undefined){
                        returnState = false;
                        break;
                    }
                }
            }  
            if(returnState === true){
                for(index = 0; index < externalValidatorCollection.length; index++){
                    if(externalValidatorCollection[index]() === false){
                        returnState = false;
                        break;
                    }
                }
            }            
            returnState = ( ($scope.currentForm.$pristine !== true || returnState === true) && ($scope.currentForm.$name === undefined || ($scope.currentForm.$valid && returnState === true)));
            if (returnState === undefined) {
                returnState = false;
            }
            if(returnState === true) {
                for (index = 0; index < $scope.mandatoryFieldCollection.length; index++) {
                    modelKey = $scope.mandatoryFieldCollection[index];
                    modelData = $scope.model[modelKey];
                    if ($scope.model !== undefined) {
                        if (angular.isArray(modelData)) {
                            var defaultOfField = $scope.defaultValueFieldObject[modelKey];
                            if (modelData.length === 0) {
                                returnState = false;
                                break;
                            } else if (modelData[0].length === 0) {
                                returnState = false;
                                break;
                            } else if (modelData[0] === defaultOfField) {
                                returnState = false;
                                break;
                            }
                        }
                    }
                }
            }
            if ($scope.gridEnabled === true && returnState === true) {
                returnState = ($scope.rowEditMode === true || ($scope.gridHandler && $scope.gridHandler.hasRowCapacity()));
            }
            if (returnState === true && $scope.isLastForm) {
                var _formValidation = $scope.angularSchemaObserver.isAllFormValid($scope);
                returnState = _formValidation.returnState;
                if(returnState === false) {
                    $scope.notificationMessage = HTMLHelper.UL_FOR(TEMPLATE_CONSTANTS.VALIDATION.INCOMPLETE.str,_formValidation.invalidForms);
                    $scope.isShowErrorAtBottom = true;
                }else{
                    $scope.isShowErrorAtBottom = false;
                }
            }
            return returnState;
        };

        $scope.validateForm = function (digest) {
            try {
                if (digest !== undefined && digest === true) {
                    $scope.$apply();
                }
            } catch (reason) {

            }
            $scope.$broadcast(BROAD_CAST_NAMESPACE.SCHEMA_FORM_VALIDATE);
            $scope.restoreErrorState($scope.currentForm);
        };

        $scope.transactionDefaults = function () {
            currentProxy = null;
            headProxy = null;
        };

        $scope.programmaticSubmit = function (params) {
            params = params || {};
            if(params.scopeMembers !== undefined) {
                angular.extend($scope, params.scopeMembers);
            }
            var tran = $scope.initiateTransaction();
            if($scope.editModel === true){
                tran.transactionMode = $scope.angularSchemaObserver.transactionMode.Update;
            }else{
                tran.transactionMode = $scope.angularSchemaObserver.getTransactionMode($scope).transactionMode;
            }

            if($scope.fieldGroupCount !== undefined) {
                TEMPLATE_CONSTANTS.RUNTIME.transactionStatusIndex = TEMPLATE_CONSTANTS.TITLE.LABELS.SAVING.str + " " + $scope.index  + "/" + $scope.fieldGroupCount;
            }
            if($scope.gridEnabled === true){
                $scope.angularSchemaObserver.programmaticDataSourceInsertion($scope);
            }else {
                $scope.angularSchemaObserver.notifyOnAction($scope, tran);
            }
        };

        $scope.submitForm = function (form, table) {

            $scope.currentForm = form;
            $scope.validateForm();
            if (form.$valid ) {
                if($scope.isLastForm && $scope.angularSchemaObserver.isAllFormValid($scope).returnState === false){
                    $scope.restoreErrorState($scope.currentForm);
                    return;
                }
                // If its a microsite and log in is switched off for microsite. On submit we just connect the candidate to the folder and show thank you page.
                if(_XC_CONFIG.landing_page && !(_XC_CONFIG.is_microsite_log_in_enabled === "true" || _XC_CONFIG.is_microsite_log_in_enabled === true) && _XC_CONFIG.landing_page.existing_user){
                    var folderId = parseInt(_XC_CONFIG.landing_page.folder_id);
                    var email = _XC_CONFIG.landing_page.existing_user;
                    if (!isNaN(folderId)) {
                        publicFolder.addCandidateToFolderByEmail({folderId: folderId, email: email});
                    }
                    $('.landing-page-content').hide();
                    $('.landing-page-thank-you').show();
                    delete _XC_CONFIG.landing_page.existing_user;
                    if (_XC_CONFIG.landing_page.destination) {
                        $window.location.href = _XC_CONFIG.landing_page.destination;
                    }
                }
                else{
		    if($scope.gridEnabled === true || $scope.isPartialSave === undefined || $scope.isPartialSave !== true) {
                        var tran = $scope.initiateTransaction();
                        // in case multiple forms got mapped to same table
                        tran.transactionMode = $scope.angularSchemaObserver.getTransactionMode($scope).transactionMode;
                        $scope.angularSchemaObserver.notifyOnAction($scope, tran);
                        if(_XC_CONFIG.form_naming_enabled === true) {
                            window.dataLayer.push({
                                'event': "Analytics Funel",
                                'formName': $scope.angularSchemaObserver.activeForm.title.trim().replace(/\s+/g, '-').toLowerCase(),
                                'URL': window.location.href,
                                'requisition': ApplicationState.requisitionId
                            });
                        }
                    }else{
                         $scope.angularSchemaObserver.offlineSave($scope);
		    }
                }
            } else {
                $scope.restoreErrorState($scope.currentForm);
            }
        };

        $scope.updateForm = function (form, table) {
            $scope.currentForm = form;
            $scope.validateForm();
            if (form.$valid) {
	        if($scope.gridEnabled === true || $scope.isPartialSave === undefined || $scope.isPartialSave !== true) {
                    var tran = $scope.initiateTransaction();
                    tran.transactionMode = $scope.angularSchemaObserver.transactionMode.Update;
                    $scope.angularSchemaObserver.notifyOnAction($scope, tran);
                    if(_XC_CONFIG.form_naming_enabled === true) {
                        window.dataLayer.push({
                            'event': "Analytics Funel",
                            'formName': $scope.angularSchemaObserver.activeForm.title.trim().replace(/\s+/g, '-').toLowerCase(),
                            'URL': window.location.href,
                            'requisition': ApplicationState.requisitionId
                        });
                    }
                }else{
                     $scope.angularSchemaObserver.offlineSave($scope);
                }
            } else {
                $scope.restoreErrorState($scope.currentForm);
            }
        };

        $scope.populateForm = function (callBack) {
            $scope.transactionDefaults();
            if($scope.hasRetrieveMuted === undefined || $scope.hasRetrieveMuted !== true) {
                $scope.onPreLoadComplete = callBack;
                $scope.angularSchemaObserver.notifyOnRetrieve($scope, $scope.getNextTransaction());
            }
        };

        $scope.showForm = function (retainCurrentFormAsCallback) {
            $scope.angularSchemaObserver.showFieldGroup($scope,retainCurrentFormAsCallback);
        };

        $scope.skipForm = function (form, table, e) {
            if($scope.isPartialSave === undefined || $scope.isPartialSave !== true){
                if(typeof event !== "undefined"){
                    if(event.target.getAttribute('class').indexOf('disabled') === -1) {
                        $scope.angularSchemaObserver.showNextFieldGroup($scope);
                    }
                }else if(typeof e !== "undefined"){
                    if(e.target.getAttribute('class').indexOf('disabled') === -1) {
                        $scope.angularSchemaObserver.showNextFieldGroup($scope);
                    }
                }
            }
            else{
                $scope.angularSchemaObserver.offlineSave($scope);
            }
        };

        $scope.showNextForm = function (form, table, e) {
            if($scope.isPartialSave === undefined || $scope.isPartialSave !== true){
                if(typeof event !== "undefined"){
                    if(event.target.getAttribute('class').indexOf('disabled') === -1) {
                        $scope.angularSchemaObserver.showNextFieldGroup($scope);
                    }
                }else if(typeof e !== "undefined"){
                    if(e.target.getAttribute('class').indexOf('disabled') === -1) {
                        $scope.angularSchemaObserver.showNextFieldGroup($scope);
                    }
                }
            }
            else{
                $scope.angularSchemaObserver.offlineSave($scope);
            }
        };

        $scope.showPreviousForm = function (form, table, e) {
            if ($scope.previousFieldGroup !== null) {
                if(typeof event !== "undefined"){
                    if ($scope.previousFieldGroup !== null && (event.target.getAttribute('class').indexOf('disabled') === -1)) {
                        $scope.angularSchemaObserver.showFieldGroup($scope.previousFieldGroup, false);
                    }
                }else if(typeof e !== "undefined"){
                    if ($scope.previousFieldGroup !== null && (e.target.getAttribute('class').indexOf('disabled') === -1)) {
                        $scope.angularSchemaObserver.showFieldGroup($scope.previousFieldGroup, false);
                    }
                }
            }

        };

        $scope.cancelRowUpdate = function (form, table) {
            $scope.gridHandler.cancelRowUpdate();
            $scope.angularSchemaObserver.resetModelHandler($scope, table);
        };

        function initializeOperation() {
            var table1= angular.isArray($scope.table) ? $scope.table[0] : $scope.table;
            switch (table1) {
                case 'candidate':
                    $scope.uNameOnBlur = function (modelValue, globalProgressBarHandler, candidateService) {
                        var deferred = $q.defer();
                        try {
                            $timeout(function () {
                                try {
                                    if (angular.isString(modelValue) && modelValue.length !== 0) {
                                        if (!authService.isLoggedIn) {
                                            globalProgressBarHandler(true);
                                            candidateService.candidateExists({
                                                username  : modelValue,
                                                clientName: clientName
                                            }).$promise.then(
                                                function (result) {
                                                    /*in microsite for a new user the existing user value should be reset*/
                                                    if(_XC_CONFIG.landing_page){
                                                        if (typeof _XC_CONFIG.landing_page.existing_user !== "undefined"){
                                                            delete _XC_CONFIG.landing_page.existing_user;
                                                        }
                                                    }
                                                    globalProgressBarHandler(false);
                                                    deferred.resolve(0);
                                                    $scope.removeRedirectToCurrentModule();
                                                }, function (reason) {
                                                    //If this is a microsite and configured not to show log in we will bypass the existing email id check and populate the email id for later use
                                                    if(_XC_CONFIG.landing_page && (_XC_CONFIG.is_microsite_log_in_enabled === false || _XC_CONFIG.is_microsite_log_in_enabled === "false")){
                                                        _XC_CONFIG.landing_page.existing_user = modelValue;
                                                        globalProgressBarHandler(false);
                                                        deferred.resolve(0);
                                                        $scope.removeRedirectToCurrentModule();
                                                    }
                                                    else{
                                                        candidateService.getCandidateActivationByEmail({
                                                            username  : modelValue,
                                                            clientName: clientName
                                                        }).$promise.then(
                                                            function (result) {
                                                                deferred.reject(0);
                                                                var deActiveCheck = normalizeObjects(result);
                                                                $scope.$broadcast(ERROR_CONFIGURATION.PREFIX.VALIDATION.UNAME_EMAIL_EXISTENCE, ERROR_CONFIGURATION.CODES.VALIDATION.EMAIL_EXISTENCE, false);
                                                                globalProgressBarHandler(false);
                                                                $scope.blurAlternative(TEMPLATE_CONSTANTS.ELEMENT_ID.UNAME, TEMPLATE_CONSTANTS.ELEMENT_ID.UNAME_LOGIN_LINK_ID);
                                                                $scope.setRedirectToCurrentModule(modelValue);
                                                                if(deActiveCheck[0] === 't') {
                                                                    _findElementAttemptCount = 0;
                                                                    findElement("#email_exists_Check", profileDeactivateMessage);
                                                                }
                                                            }, function (reason) {
                                                                deferred.reject(0);
                                                                globalProgressBarHandler(false);
                                                            });

                                                    }

                                                });
                                        } else {
                                            deferred.resolve(0);
                                            globalProgressBarHandler(false);
                                        }
                                    } else {
                                        deferred.resolve();
                                        globalProgressBarHandler(false);
                                    }
                                } catch (reason) {
                                    deferred.resolve();
                                    globalProgressBarHandler(false);
                                    logger.error(reason);
                                }
                            }, 500, false);
                        } catch (reason) {
                            deferred.resolve();
                            globalProgressBarHandler(false);
                            logger.error(reason);
                        }
                        return deferred.promise;
                    };
                    $scope.setZeoCode = function (modelValue, globalProgressBarHandler) {
                        var deferred = $q.defer();
                        $scope.globalProgressBarHandler = globalProgressBarHandler;
                        try {
                            $timeout(function () {
                                try {
                                    if (angular.isString(modelValue) && modelValue.length !== 0) {
                                        globalProgressBarHandler(true);
                                        deferred.resolve(0);
                                        var _model = $scope.programmaticModel[$scope.angularSchemaObserver.core.table];
                                        _model.zip = modelValue;
                                        ModelDependencyFactory.candidateHelper.setterProcessor.zeoCode(_model, true, $scope.modelFactoryResponseHandler);
                                        globalProgressBarHandler(false);
                                    } else {
                                        deferred.resolve();
                                        globalProgressBarHandler(false);
                                    }
                                } catch (reason) {
                                    deferred.resolve(0);
                                    globalProgressBarHandler(false);
                                }
                            }, 500, false);

                        } catch (reason) {
                            deferred.resolve(0);
                            globalProgressBarHandler(false);
                        }
                        return deferred.promise;
                    };
                    $scope.modelFactoryResponseHandler = function (response) {
                        if (response.hasSuccess === false) {
                            logger.error(response.response);
                            $scope.globalProgressBarHandler(false);
                        }
                    };
                    break;
            }
        }

        $scope.onFormActive = function (URLVariables) {
            if (_XC_CONFIG.form_naming_enabled === true) {
                if (URLVariables && URLVariables.path && URLVariables.path.default) {
                    var formTitle = $scope.title.trim();
                    formTitle = formTitle.replace(/\s+/g, '-').toLowerCase();
                    var _uri = URLVariables.path.default + $scope.indexOfForm + "/";
                    if (formTitle !== undefined) {
                        _uri += formTitle + "/";
                    }
                    _uri = encodeURI(_uri);
                    $location.path(_uri, false);
                    $location.search('link', null);
                    $location.search('job', null);
                }
            }
        };

        var _findElementAttemptCount = 0;
        function findElement(elementId,callback) {
            if (_findElementAttemptCount > 12) {
                return;
            }
            setTimeout(function () {
                try {
                    _findElementAttemptCount++;
                    var _element = jQuery(elementId);
                    if (_element.length === 0) {
                        findElement(elementId, callback);
                    } else {
                        _findElementAttemptCount = 0;
                        callback(_element);
                    }
                } catch (reason) {
                    logger.error(reason);
                }
            }, 200);
        }

        function profileDeactivateMessage(element) {
            element.html(ModelDependencyFactory.socialProvider.notificationEngine.deactivatedMessage);
        }

        initialize();

        function initialize() {
            $scope.terms_policy_enabled = (_XC_CONFIG.copyright.terms_policy_enabled === 'true' || _XC_CONFIG.copyright.terms_policy_enabled === true );
            $scope.TandC_url = _XC_CONFIG.copyright.TandC_url;
            $scope.privacyPolicyUrl = _XC_CONFIG.copyright.privacyPolicyUrl;
            $scope.copyrightYear = _XC_CONFIG.copyright.copyrightYear;
            initializeOperation();
            $scope.transactionDefaults();
            $scope.angularSchemaObserver.registerForm($scope);
            $scope.removeRedirectToCurrentModule();
        }

        $scope.registerExternalValidator = function(validPredictor) {
            externalValidatorCollection.push(validPredictor);
        };

        $scope.isValidModel = function (model) {
            return requiredValidator(model);
        };

        function requiredValidator(model) {
            var returnState = false;
            if (model === undefined) {
                return returnState;
            }
            if ($scope.mandatoryFieldCollection.length === 0) {
                returnState = true;
                return returnState;
            }
            returnState = true;
            for (var index = 0; index < $scope.mandatoryFieldCollection.length; index++) {
                var modelKey = $scope.mandatoryFieldCollection[index];
                var modelData = model[modelKey];
                if (modelData === null || modelData === undefined) {
                    returnState = false;
                    return returnState;
                }else if((angular.isArray(modelData) === false && modelData.length === 0)){
                    returnState = false;
                    return returnState;
                }else if(( angular.isArray(modelData) === true && (modelData.length === 0 || modelData[0].length === 0))){
                    returnState = false;
                    return returnState;
                }
            }
            return returnState;
        }
    }

})(); // End  controller=======
