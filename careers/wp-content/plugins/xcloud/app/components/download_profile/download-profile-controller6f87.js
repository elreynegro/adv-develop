(function(){
    'use strict';
    angular.module('st.candidate.activity')
        .controller('downloadProfileController',downloadProfileController);
    downloadProfileController.$inject = ['$scope','$q','$http','ApplicationState','schemaModalService'];

    function downloadProfileController($scope, $q, $http,ApplicationState,schemaModalService) {
        //commented as we are going ahead with only CSV files download
        //$scope.downloadProfileTypes=['CSV','JSON'];

        var E_PROFILE_MODAL_CONTENT = {
            DOWNLOAD_ATTEMPT: 0
        };

        $scope.vModel = {
            E_PROFILE_MODAL_CONTENT : E_PROFILE_MODAL_CONTENT,
            modalPopup: {
                close        : closeModal,
                configuration: {
                    style: {
                        windowClass: "schema-modal-popup",
                        size       : E_MODAL_POPUP_SIZE.NONE // none will let content decides dimensions
                    }
                },
                panelView    : E_PROFILE_MODAL_CONTENT.DOWNLOAD_ATTEMPT
            }
        };

        $scope.downloadedfileName = "profile-data";
        $scope.selectedDownloadType = "CSV";

        $scope.downloadProfile = function ($event,showModal) {
            $event.preventDefault();
            if (showModal) {
                var _template = '/wp-content/plugins/xcloud/app/components/download_profile/download-modal.html';
                var _controller = 'downloadProfileController';
                schemaModalService.open($scope.vModel.modalPopup.configuration, _template, _controller)
            }
            var candidateId = ApplicationState.localStorage.candidate.id.get();
            if (candidateId === null || typeof (candidateId) === "undefined") {
                candidateId = $scope.candidate.candidateId;
            }
            var candidateIds = [];
            candidateIds.push(candidateId);
            $http.post(ATS_URL + ATS_INSTANCE + '/rest/private/bulk/export/candidates/' + _XC_CONFIG.org, {
                "client"      : _XC_CONFIG.org,
                "candidateIds": candidateIds,
                "format"      : $scope.selectedDownloadType.toLowerCase()
            }, {responseType: 'arraybuffer'}).success(function (data, status, headers) {
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                var contentType = headers["content-type"] || "application/octet-stream";
                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                if (urlCreator) {
                    var blob = new Blob([data], {
                        type: contentType
                    });
                    var url = urlCreator.createObjectURL(blob);
                    if (isIE) {

                        window.navigator.msSaveBlob(blob, $scope.downloadedfileName + ".csv");

                    } else {

                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.style = "display: none";
                        a.href = url;
                        a.download = $scope.downloadedfileName + ".csv"; //you may assign this value from header as well
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }
            })
        };
        
        function closeModal() {
            schemaModalService.close();
        }

    }
})();


