(function () {
    'use strict';

    angular
        .module('st.controllers.apply.site')
        .controller('applyController', applyController);

    applyController.$inject = ['$scope', '$log', '$controller', '$location', 'SessionStorage', 'bgResumeParser'];
    function applyController($scope, $log, $controller, $location, SessionStorage, bgResumeParser) {

        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY);

        angular.extend(this, $controller('baseController', {$scope: $scope}));

        initialize();

        $scope.uploadResume = function () {
            $scope.resumeParsed = false;
            $scope.parsing = true;
            var file = $scope.resumeFile;

            var inputName = 'file';
            var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/parse/" + inputName;

            bgResumeParser.parseResume(file, uploadUrl, inputName, parsedResume);
        };

        function initialize() {
            $scope.resumeFile = {};
            $scope.resumeJSON = SessionStorage.get('uploadedResume');
            $scope.jobId = $location.search().job;

            if ($scope.resumeJSON !== null && $scope.resumeJSON !== undefined) {
                $scope.resumeParsed = true;
            } else {
                $scope.resumeParsed = false;
            }
        }

        function parsedResume(response) {
            $scope.resumeXML = response;
            var x2js = new X2JS();
            $scope.resumeJSON = x2js.xml_str2json($scope.resumeXML);

            if ($scope.resumeJSON.ResDoc.resume === null || $scope.resumeJSON.ResDoc.resume === undefined) {
                $scope.searchText = '';
            } else if ($scope.resumeJSON.ResDoc.resume.summary === null || $scope.resumeJSON.ResDoc.resume.summary === undefined) {
                $scope.searchText = '';
            } else if ($scope.resumeJSON.ResDoc.resume.summary.summary === null || $scope.resumeJSON.ResDoc.resume.summary.summary === undefined) {
                $scope.searchText = '';
            } else {
                $scope.searchText = $scope.resumeJSON.ResDoc.resume.summary.summary;
            }

            var experience = $scope.getValueFromArrayOrString($scope.resumeJSON.ResDoc.resume.experience, 0);

            if (experience !== undefined && experience.job !== undefined && experience.job !== null && experience.job.length > 0) {
                for (var key in experience.job) {
                    if (experience.job[key].title !== undefined && experience.job[key].title !== null) {
                        $scope.searchText += " " + experience.job[key].title;
                    }

                    if (experience.job[key].description !== undefined && experience.job[key].description !== null) {
                        $scope.searchText += " " + experience.job[key].description;
                    }
                }
            }

            $scope.resumeParsed = true;
            $scope.parsing = false;

            SessionStorage.set('uploadedResume', $scope.resumeJSON);

        }

    }

})();
