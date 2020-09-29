/**
 * Created by shanjock 4/19/2018
 */

(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('dashboardAttachmentViewModalService', dashboardAttachmentViewModalService);

    dashboardAttachmentViewModalService.$inject = ['$q', '$log', '$sce', 'privateCandidate', 'authService', 'candidateActivityViewModelService', 'ApplicationState', 'ModelDependencyFactory', 'bgResumeUpload', 'bgResumeParser', '$http', 'schemaModalService', 'privateTransactionLog'];

    function dashboardAttachmentViewModalService($q, $log, $sce, privateCandidate, authService, candidateActivityViewModelService, ApplicationState, ModelDependencyFactory, bgResumeUpload, bgResumeParser, $http, schemaModalService, privateTransactionLog) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var vm = getVMSkeleton();

        var nonVM = {

            attachments        : {},
            workHistoryToUpload: [],
            attachmentDetails  : {},
            eduHistoryToUpload : [],
            resumeXML          : {},
            activeRequest      : false,
            passedScope        : {}
            /*candidateObj: candidateIdResolver()*/
        };

        var service = {
            nonVM                                : nonVM,
            getVMSkeleton                        : getVMSkeleton,
            updateServiceVM                      : updateServiceVM,
            getAttachments                       : getAttachments,
            deleteDocumentHandler                : deleteDocumentHandler,
            downloadDocumentHandler              : downloadDocumentHandler,
            deleteExistingWorkHistoryRecords     : deleteExistingWorkHistoryRecords,
            deleteExistingEducationHistoryRecords: deleteExistingEducationHistoryRecords,
            burningGlassParserErrorHandler       : burningGlassParserErrorHandler,
            burningGlassParserHandler            : burningGlassParserHandler,
            resumeEducationHistoryParser         : resumeEducationHistoryParser,
            addEducationHistory                  : addEducationHistory,
            addWorkHistory                       : addWorkHistory,
            uploadResume                         : uploadResume,
            retainScope                          : retainScope
        };
        return service;

        function getVMSkeleton() {
            var prepareVM = {
                candidateObj            : candidateIdResolver(),
                isShowComponent         : true,
                showBorderUploadBtn     : false,
                modalPopup              : {},
                attachments             : {},
                isUnsupported           : false,
                attachmentDetails       : {},
                fileFormName            : {},
                fileSizeError           : false,
                uploadFileDisabled      : false,
                invalidResumeErrorMsg   : 'Attachment content type is invalid',
                unSupportResumeErrorMsg : 'Unsupported file format',
                sizeExceedResumeErrorMsg: 'Exceeded file size'
            };

            prepareVM.modalPopup = {
                open         : openModal,
                close        : closeModal,
                configuration: {
                    style: {
                        windowClass: "schema-modal-popup",
                        size       : E_MODAL_POPUP_SIZE.NONE // none will let content decides dimensions
                    }
                }
            };

            return prepareVM;
        }

        function updateServiceVM(passedScope) {
            vm = passedScope;
        }

        function candidateIdResolver(candidateObj) {
            candidateObj = candidateObj || ApplicationState.session.candidate.get();
            if (candidateObj) {
                if (!angular.equals({}, candidateObj)) {
                    return candidateObj;
                }
            }
            return null;
        }

        function getAttachments(candidateObj) {
            var deferred = $q.defer();
            privateCandidate.getCandidateAttachments({candidateId: candidateObj.candidateId}).$promise.then(function (results) {
                vm.attachments = normalizeObjects(results);
                jQuery('.loading-container').css('display', 'none');
                return deferred.resolve(vm);
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function deleteDocumentHandler(deleteAttachmentId) {
            closeModal();
            var deferred = $q.defer();
            jQuery('.loading-container').css('display', 'block');
            privateCandidate.deleteCandidateAttachmentById({attachmentId: deleteAttachmentId}).$promise.then(function (results) {
                try {
                    angular.forEach(vm.attachments, function (options, optionsKey) {
                        if (options.attachmentId == deleteAttachmentId) {
                            vm.attachments.splice(optionsKey, 1);
                        }
                    });
                    jQuery('.loading-container').css('display', 'none');
                    return deferred.resolve(vm);
                } catch (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                    deferred.reject(reason);
                }
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function downloadDocumentHandler(attachmentId, docType) {
            jQuery('.loading-container').css('display', 'block');
            privateCandidate.getCandidateAttachmentById({attachmentId: attachmentId}).$promise.then(function (results, status, header) {
                try {
                    var b64Data = results.document;
                    var byteCharacters = atob(b64Data);
                    var byteNumbers = new Array(byteCharacters.length);

                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);
                    var blob = new Blob([byteArray], {type: docType});
                    var url = (window.URL || window.webkitURL).createObjectURL(blob);

                    if (window.navigator && window.navigator.msSaveBlob) {
                        window.navigator.msSaveBlob(blob, results.name);
                    } else {
                        // not working as except in FireFox browser
                        /*var anchor = angular.element('<a></a>');
                         anchor.attr({ href: url, target: '_blank', download: results.name });
                         anchor[0].click();*/

                        var link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', results.name);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                    jQuery('.loading-container').css('display', 'none');
                } catch (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                }
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
            });
        }

        function closeModal() {
            schemaModalService.close();
            jQuery('.loading-container').css('display', 'block');
        }

        function openModal($event, showModal, passedScope) {
            jQuery('.loading-container').css('display', 'none');
            nonVM.passedScope = passedScope;
            $event.preventDefault();
            if (showModal) {
                var _template = '/wp-content/plugins/xcloud/app/components/dashboard_attachment/attachment-parse-confirmation-modal.html';
                var _controller = 'dashboardAttachmentController';
                schemaModalService.open(vm.modalPopup.configuration, _template, _controller);
            }
        }

        function retainScope() {
            return nonVM.passedScope.DA_VM;
        }

        function deleteExistingWorkHistoryRecords() {
            var deferred = $q.defer();
            privateCandidate.deleteAllCandidateWorkHistory({candidateId: vm.candidateObj.candidateId}).$promise.then(function (results) {
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
                return deferred.resolve(0);
            });
            return deferred.promise;
        }

        function deleteExistingEducationHistoryRecords() {
            var deferred = $q.defer();
            privateCandidate.deleteAllCandidateEducation({candidateId: vm.candidateObj.candidateId}).$promise.then(function (results) {
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
                return deferred.resolve(0);
            });
            return deferred.promise;
        }

        function burningGlassParserErrorHandler() {
            jQuery('.loading-container').css('display', 'none');
            return;
        }

        function burningGlassParserHandler(resp) {
            // logger.log(resp);
            try {
                var resumeXML = resp;

                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/transform/html";
                var data = resumeXML;

                $http({
                    url            : uploadUrl,
                    method         : "POST",
                    withCredentials: true,
                    headers        : {
                        'Content-Type': 'application/xml'
                    },
                    data           : data
                }).success(
                    function (response) {
                        resumeXML = response;

                    }).error(
                    function () {
                        resumeXML = null;
                    });

                var x2js = new X2JS();
                var resumeJSON = x2js.xml_str2json(resumeXML);

                if (resumeJSON.ResDoc.resume === undefined || resumeJSON.ResDoc.resume.contact === undefined) {
                    return burningGlassParserErrorHandler();
                }
                var resumeContent = resumeJSON.ResDoc.resume;
                resumeEducationHistoryParser(resumeContent);
                resumeWorkHistoryParser(resumeContent);
                uploadResume();
            } catch (reason) {
                jQuery('.loading-container').css('display', 'none');
            }
        }

        function resumeEducationHistoryParser(resumeContent) {
            try {
                nonVM.eduHistoryToUpload = [];
                var resumeEducationContent = resumeContent.education;
                if (resumeEducationContent !== null && resumeEducationContent !== undefined) {
                    nonVM.eduHistoryToUpload = ModelDependencyFactory.candidateHelper.parserCollection.resume.getEducationModel(resumeEducationContent, {}, vm.candidateObj.candidateId);
                    addEducationHistory(nonVM.eduHistoryToUpload);
                }
            } catch (reason) {
                logger.error(reason);
            }
        }

        function resumeWorkHistoryParser(resumeContent) {
            try {
                nonVM.workHistoryToUpload = [];
                nonVM.workHistoryToUpload = ModelDependencyFactory.candidateHelper.parserCollection.resume.getEmploymentModel(resumeContent.experience, {}, vm.candidateObj.candidateId);
                addWorkHistory(nonVM.workHistoryToUpload);
            } catch (reason) {
                logger.error(reason);
            }
        }

        function addEducationHistory(payLoad) {
            var deferred = $q.defer();
            if (nonVM.eduHistoryToUpload !== null && nonVM.eduHistoryToUpload !== undefined && nonVM.eduHistoryToUpload.length > 0) {
                privateCandidate.addEducationList(nonVM.eduHistoryToUpload).$promise.then(function (results) {
                    logger.info('add education history record success');
                    deferred.resolve(results);
                }, function (reason) {
                    hasError(reason, 'Unable to add employment history record!');
                    deferred.reject(reason);
                });
                deferred.resolve(0);
            }
            return deferred.promise;
        }

        function addWorkHistory(payLoad) {
            var deferred = $q.defer();
            if (nonVM.workHistoryToUpload !== null && nonVM.workHistoryToUpload !== undefined
                && nonVM.workHistoryToUpload.length > 0) {
                privateCandidate.addWorkHistoryList(nonVM.workHistoryToUpload).$promise.then(function (results) {
                    logger.info('add employment history record success');
                    deferred.resolve(results);
                }, function (reason) {
                    hasError(reason, 'Unable to add employment history record!');
                    deferred.reject(reason);
                });
                return deferred.promise;
            }
        }

        function uploadResume() {
            closeModal();
            if (!vm.fileFormName) {
                return;
            }
            var file = vm.fileFormName;
            logger.debug('file was selected: ', JSON.stringify(vm.attachmentDetails));

            var inputName = 'fileFormName';
            var attachmentFormName = 'attachmentFormName';
            var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/private/candidate/attachment/" + clientName + "/" + inputName + "/" + attachmentFormName;
            jQuery('.loading-container').css('display', 'block');
            bgResumeUpload.parseResume(file, uploadUrl, inputName, attachmentFormName, vm.attachmentDetails, parsedResume);
        }

        function parsedResume(resp) {

            vm.fileFormName = null;
            vm.attachmentDetails = {};
            jQuery('#fileupload').val(null);
            jQuery('.loading-container').css('display', 'none');
            var params = {
                candidateId: vm.candidateObj.candidateId,
                usersId    : 0
            };

            var value = {
                "value": "[candidate.first_name] [candidate.last_name] uploaded an attachment"
            };
            getAttachments(vm.candidateObj).then(function (results) {
                vm = results;
            });

            vm.uploadFileDisabled = true;
            candidateActivityViewModelService.addTransactionLog(params, value, vm.candidateObj);
        }

    }
}());