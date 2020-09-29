/**
 * Created by TDadam on 10/30/2017.
 */
angular
    .module('st.shared.widget')
    .controller('schemaResumeController', schemaResumeController);

schemaResumeController.$inject = ['$scope', '$rootScope','$q','$log','authService','bgResumeParser','ApplicationState'];

function schemaResumeController($scope,$rootScope,$q,$log,authService,bgResumeParser,ApplicationState) {
    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_UTILS_GLOBAL_STATE);
    $scope.isFileRquired = false;
    $scope.isFileValid = false;
    $scope.fileHasFocus = false;

    initialize();
    //in case it is a page refresh, we got to show the resume, if uploaded
    $scope.$on(BROAD_CAST_NAMESPACE.CURRENT_CANDIDATE_FETCHED,function(event,args){
        //load resume on refresh
        var candidateId = args.candidateId;
        var email = args.mail;
        var reqId = args.reqId;
        var jobId = args.jobId;

        loadResumeOnRefresh(candidateId,email,reqId,jobId);
    });

    function loadResumeOnRefresh(candidateId,email,reqId,jobId) {
        var applyResumeStateContainer = ApplicationState.session.candidate.resume.applyResumeStateContainer.get();
        var setResume = false;
        if (applyResumeStateContainer !== null) {
            if (applyResumeStateContainer.ApplyResumeState && applyResumeStateContainer.ApplyResumeState.isResumeUploaded) {
                if (applyResumeStateContainer.ApplyResumeState.candidateId === candidateId) {
                    if (applyResumeStateContainer.ApplyResumeState.flow === "LCP") {
                        setResume = "true";
                    }
                    else if (applyResumeStateContainer.ApplyResumeState.flow === "APPLY_LCP" && applyResumeStateContainer.ApplyResumeState.jobId === jobId) {
                        setResume = "true";
                    }
                    else if (applyResumeStateContainer.ApplyResumeState.flow === "APPLY" && applyResumeStateContainer.ApplyResumeState.reqId === reqId) {
                        setResume = true;
                    }

                    if (setResume) {
                        //$rootScope.candidateResumeUpdated = true;
                        $scope.fileFormName = applyResumeStateContainer.ApplyResumeFileFormName;
                        $scope.attachmentDetails = applyResumeStateContainer.ApplyResumeAttachmentDetails;
                        $rootScope.$broadcast('setDocumentDetails', {
                            fileFormName     : applyResumeStateContainer.ApplyResumeFileFormName,
                            attachmentDetails: applyResumeStateContainer.ApplyResumeAttachmentDetails
                        });
                        if (applyResumeStateContainer.resumeXMLArg !== null && typeof(applyResumeStateContainer.resumeXMLArg) !== "undefined") {
                            $rootScope.$broadcast("burningGlassParserHandler", applyResumeStateContainer.resumeXMLArg);
                        }

                    }
                }
            }
        }
    }
    function initialize() {
        $scope.isUnsupported = false;
        $scope.fileSizeError = false;
        $scope.isInvalidContentCV = false;
        $scope.attachmentDetails = {};
        $scope.fileFormName = {};
        $rootScope.resumeJSON = {};
        $rootScope.resumeParsed = false;
        $scope.fileUploadIsValid = true;

        // Resume Error Configuration
        $scope.invalidResumeErrorMsg = TEMPLATE_CONSTANTS.VALIDATION.INVALID_CONTENT.str;
        $scope.unSupportResumeErrorMsg = TEMPLATE_CONSTANTS.VALIDATION.IN_COMPATIBLE_FILE_FORMAT.str;
        $scope.sizeExceedResumeErrorMsg = TEMPLATE_CONSTANTS.VALIDATION.FILE_SIZE_EXCEED.str;
    }

    $scope.assignDocumentDetails = function (event) {

        try {
            var validFormats = ['application/rtf', 'application/msword', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            var result = validFormats.indexOf(event.target.files[0].type);

            // If MS Office is not installed result will be -1, hence depending on file property with name as below code
            if(result === -1){
                var validFileExt = ['doc', 'docx', 'txt', 'pdf', 'rtf'];
                var fileAttr = event.target.files[0].name.split('.');
                result = validFileExt.indexOf(fileAttr[fileAttr.length-1].toLowerCase());
            }

            $scope.isUnsupported = false;
            $scope.fileSizeError = false;
            $scope.attachmentDetails.name = '';
            $scope.isInvalidContentCV = false;

            if (result === -1) {
                $scope.$apply(function () {
                    $scope.isUnsupported = true;
                });
            } else if (event.target.files[0].size > maxFileSizeforResume) {
                $scope.$apply(function () {
                    $scope.fileSizeError = true;
                });
            } else {
                $scope.$apply(function () {
                    $scope.attachmentDetails.name = event.target.files[0].name;
                    $scope.attachmentDetails.createDate = event.target.files[0].lastModified;
                    $scope.attachmentDetails.description = 'Test';
                    $scope.attachmentDetails.type = event.target.files[0].type;
                    $scope.attachmentDetails.attachmentType = 'Resume';
                    $scope.attachmentDetails.document = null;
                    $scope.attachmentDetails.isCanUpload = 't';
                });

                $scope.$emit('setDocumentDetails', {
                    fileFormName     : $scope.fileFormName,
                    attachmentDetails: $scope.attachmentDetails
                });
                var file = $scope.fileFormName;
                var inputName = 'fileFormName';
                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/parse/" + inputName;
                $scope.$emit('globalProgressBarHandler', {
                    state: true
                });
                bgResumeParser.parseResume(file, uploadUrl, inputName, burningGlassParserHandler, burningGlassParserErrorHandler);
            }
        } catch (reason) {
            $scope.$emit('globalProgressBarHandler', {
                state: false
            });
        }
    };

    $scope.removeAttachment = function ($event) {
        $scope.clearAttachmentCache();
        $event.preventDefault();
        return false;
    };

    $scope.$on('triggerClearAttachmentCache', function (event, args) {
        $scope.clearAttachmentCache(args);
    });

    $scope.clearAttachmentCache = function ($event) {
        $scope.fileFormName = {};
        $scope.attachmentDetails = {};
        $rootScope.resumeParsed = false;
        watchRequiredFieldValidation(false);
        if (!authService.isLoggedIn) {
            $scope.$emit('attachmentCacheCleared');
        }
        else if (!$rootScope.candidateResumeUpdated) {
            $rootScope.resumeXML = null;
        }
        jQuery('#fileupload').val(null);
        $scope.$emit('setDocumentDetails', {
            fileFormName: {}, attachmentDetails: {}
        });
    };

    var burningGlassParserErrorHandler = function () {
        $scope.isInvalidContentCV = true;
        watchRequiredFieldValidation(false);
        $scope.$emit('globalProgressBarHandler', {
            state: false
        });
        $scope.clearAttachmentCache();
    };

    var burningGlassParserHandler = function (resp) {
        $scope.isInvalidContentCV = false;
        watchRequiredFieldValidation(true);
        $scope.$emit('burningGlassParserHandler', {
            response: resp
        });
    };

    $scope.onFocusState = function () {
        $scope.isFocused = true;
    };

    $scope.onFocusLostState = function () {
        $scope.isFocused = false;
        $scope.fileHasFocus = true;
    };

    $scope.isValid = function () {
        // we need to fix for logged in users.
        if(authService.isLoggedIn && ApplicationState.localStorage.candidate.isReturningUser.get() === true){
            return true;
        }else{
            if($scope.isFileValid === false) {
                $scope.fileHasFocus = true;
            }
            return $scope.isFileValid;
        }
    };

    function watchRequiredFieldValidation(state) {
        $scope.isFileValid = state;
    }

    $scope.registerValidator = function (placeHolderPosition) {
        angularSchemaObserver.registerExternalValidator($scope.isValid,placeHolderPosition);
    }
}
