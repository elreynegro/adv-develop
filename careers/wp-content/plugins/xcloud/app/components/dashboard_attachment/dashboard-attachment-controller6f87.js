/**
 * Created by Shanjock on 5/07/2018.
 */

(function () {
    'use strict';

    angular.module('st.candidate.activity')
        .controller('dashboardAttachmentController', dashboardAttachmentController);
    dashboardAttachmentController.$inject = ['$scope', '$log', 'schemaModalService', 'dashboardAttachmentViewModalService', 'bgResumeUpload', 'privateCandidate', 'bgResumeParser'];

    function dashboardAttachmentController($scope, $log, schemaModalService, dashboardAttachmentViewModalService, bgResumeUpload, privateCandidate, bgResumeParser) {
        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_DASHBOARD_ATTACHMENT_ACCOUNT);
        $scope.DA_VM = {};

        initialize();

        function initialize() {
            $scope.DA_VM = dashboardAttachmentViewModalService.getVMSkeleton();
        }

        $scope.preventDoubleClick = function () {
            return false;
        };

        $scope.toggleFocusUploadBtn = function () {
            $scope.DA_VM.showBorderUploadBtn = !$scope.DA_VM.showBorderUploadBtn;
        };

        $scope.deleteDocumentHandler = function (deleteAttachmentId) {
            if (confirm(TEMPLATE_CONSTANTS.TITLE.LABELS.DELETE_ATTACHMENT_CONFIRMATION.str)) {
                dashboardAttachmentViewModalService.deleteDocumentHandler(deleteAttachmentId).then(function (results) {
                    $scope.DA_VM = results;
                });
            }
        };

        $scope.downloadDocumentHandler = function (attachmentId, docType) {
            dashboardAttachmentViewModalService.downloadDocumentHandler(attachmentId, docType);
        };

        $scope.assignDocumentDetails = function (event) {
            var validFormats = ['application/rtf', 'application/msword', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            var result = validFormats.indexOf(event.target.files[0].type);

            // If MS Office is not installed result will be -1, hence depending on file property with name as below code
            if(result === -1){
                var validFileExt = ['doc', 'docx', 'txt', 'pdf', 'rtf'];
                var fileAttr = event.target.files[0].name.split('.');
                result = validFileExt.indexOf(fileAttr[fileAttr.length-1].toLowerCase());
            }

            if(typeof $scope.DA_VM.fileFormName === 'undefined' || angular.equals($scope.DA_VM.fileFormName, {})){
                $scope.DA_VM.fileFormName = event.target.files[0];
            }

            var getCurDate = new Date();
            $scope.DA_VM.isUnsupported = false;
            $scope.DA_VM.fileSizeError = false;
            $scope.DA_VM.attachmentDetails.name = '';
            $scope.DA_VM.uploadFileDisabled = true;

            if (result === -1) {
                $scope.$apply(function () {
                    $scope.DA_VM.isUnsupported = true;
                    $scope.DA_VM.fileFormName = null;
                });
            } else if (event.target.files[0].size > maxFileSizeforResume) {
                $scope.$apply(function () {
                    $scope.DA_VM.fileSizeError = true;
                    $scope.DA_VM.fileFormName = null;
                });
            }
            else {
                $scope.$apply(function () {
                    $scope.DA_VM.attachmentDetails.name = event.target.files[0].name;
                    $scope.DA_VM.attachmentDetails.createDate = getCurDate.getTime();
                    $scope.DA_VM.attachmentDetails.description = 'Test';
                    $scope.DA_VM.attachmentDetails.type = event.target.files[0].type;
                    $scope.DA_VM.attachmentDetails.attachmentType = 'Resume';
                    $scope.DA_VM.attachmentDetails.document = null;
                    if ($scope.DA_VM.candidateObj === null){
                        var candidateObjUpdate = dashboardAttachmentViewModalService.getVMSkeleton();   //The control comes here every time when on initialization the candidateObj is not defined.
                        $scope.DA_VM.candidateObj = candidateObjUpdate.candidateObj;
                    }
                    $scope.DA_VM.attachmentDetails.candidateId = $scope.DA_VM.candidateObj.candidateId;
                    /*if($scope.DA_VM.candidateObj === undefined || $scope.DA_VM.candidateObj === null) {
                        $scope.DA_VM.candidateObj = {};
                    }*/
                    // $scope.DA_VM.candidateObj.candidateId = $scope.candidate.candidateId;
                    $scope.DA_VM.attachmentDetails.isCanUpload = 't';
                    $scope.DA_VM.uploadFileDisabled = false;
                });
            }
            dashboardAttachmentViewModalService.updateServiceVM($scope.DA_VM);
        };

        $scope.uploadFromDashboard = function() {
            schemaModalService.close();
            dashboardAttachmentViewModalService.deleteExistingWorkHistoryRecords();
            dashboardAttachmentViewModalService.deleteExistingEducationHistoryRecords();
            $scope.DA_VM = dashboardAttachmentViewModalService.retainScope();
            var file = $scope.DA_VM.fileFormName;

            logger.log('file was selected: ', JSON.stringify($scope.attachmentDetails));

            var inputName = 'fileFormName';
            var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/parse/" + inputName;
            jQuery('.loading-container').css('display', 'block');
            bgResumeParser.parseResume(file, uploadUrl, inputName, dashboardAttachmentViewModalService.burningGlassParserHandler, dashboardAttachmentViewModalService.burningGlassParserErrorHandler);
        };

        $scope.uploadResume = function() {
            dashboardAttachmentViewModalService.uploadResume();
            $scope.DA_VM.uploadFileDisabled = true;
        };

        $scope.$on(BROAD_CAST_NAMESPACE.DASHBOARD_ATTACHMENT_VM_REFRESH, function (event, viewModel) {
            $scope.DA_VM = viewModel;
        });
    }
})();
