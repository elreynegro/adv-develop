(function() {
    'use strict';

    angular
    .module('st.controllers.apply.site')
    .controller('searchController', searchController);

    searchController.$inject = ['$scope', '$log', '$rootScope', '$routeParams', '$controller', '$filter', '$location', '$timeout', '$sce', '$q', 
        'tableManagementService', 'requisition', 'privateRequisition', 'privateAnalytics', 'bgResumeParser', 
        'ListService', 'SessionStorage', 'LocalStorage'];

	function searchController($scope, $log, $rootScope, $routeParams, $controller, $filter, $location, $timeout, $sce, $q, 
            tableManagementService, requisition, privateRequisition, privateAnalytics, bgResumeParser, 
            ListService, SessionStorage, LocalStorage) {

            var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_SEARCH);

            angular.extend(this, $controller('baseController',  {$scope: $scope}));    

            initialize();

            $scope.filterResults = function() {
                $scope.table.filterBy($scope.basicFilter);
            };

            $scope.sortBy = function() {
                var columnName = $scope.sort;

                $scope.sort = columnName;
                $scope.table.sortBy(columnName);
            };

            $scope.setItemCount = function() {
                $scope.table.itemsPerPage = $scope.itemCount;
                $scope.table.preparePaginationSorting();
            };

            $scope.getDetails = function(reqId) { 
                logger.debug('getDetails(reqId)');    

                $scope.details = {};

                for (var key in $scope.requisitions) { 
                    if ($scope.requisitions[key].requisitionId === reqId) { 
                        $scope.details.requisitionId = $scope.requisitions[key].requisitionId;
                        $scope.details.title = $scope.requisitions[key].title;
                        $scope.details.externalDesc = $sce.trustAsHtml($scope.requisitions[key].externalDesc);
                        $scope.details.requirements = $sce.trustAsHtml($scope.requisitions[key].requirements);
                        break;
                    }
                }
            };

            $scope.applyToJob = function(reqId) { 
                logger.debug('applyToJob(reqId)');    
                logger.debug('applying to req id [' + reqId + ']');

                for (var key in $scope.requisitions) { 
                    if ($scope.requisitions[key].requisitionId === reqId) { 
                        $scope.applyReq = angular.copy($scope.requisitions[key]);
                        $scope.application.requisitionId = $scope.applyReq.requisitionId;
                        break;
                    }
                }

                SessionStorage.set('applyReq', $scope.applyReq);

                if ($scope.resumeJSON !== null && $scope.resumeJSON !== undefined) { 
                    SessionStorage.set('uploadedResume', $scope.resumeJSON);
                }

                $location.url('/apply?link=' + $scope.applyReq.requisitionId);
            };

            $scope.reloadResults = function() { 
                logger.debug('reloadResults()');    

                if ($scope.resumeSearch === true) { 
                    $scope.pageSortList.pop();
                    $scope.sort = 'title';
                }

                $scope.resumeSearch = false;
                $scope.catSearch = false;
                $scope.stateSearch = false;
                $scope.requisitionResults = angular.copy($scope.requisitions);
                $scope.table = tableManagementService($scope.requisitionResults, $scope.itemCount);
                $scope.table.sortBy($scope.sort);
                $scope.table.filterBy($scope.basicFilter);
            };

            $scope.uploadResume = function() {
                logger.debug('uploadResume()');    

                $scope.resumeParsed = false;
                $scope.parsing = true;
                var file = $scope.resumeFile;

                var inputName = 'file';
                var uploadUrl = ATS_URL + ATS_INSTANCE + "/rest/public/thirdparty/burningglass/resume/parse/" + inputName;

                bgResumeParser.parseResume(file, uploadUrl, inputName, parsedResume);
            };

            $scope.searchByCategory = function(catName) { 
                logger.debug('searchByCategory()');    

                if (catName !== '*All Open Jobs') { 
                    $scope.selectedCategory = catName;
                    $scope.bannerView = false;
                    $scope.catSearch = true;
                    $scope.stateSearch = false;
                    $scope.resumeSearch = false;

                    $scope.requisitionResults = [];

                    for (var index in $scope.requisitions) { 
                        if ($scope.requisitions[index].category === catName) { 
                            $scope.requisitionResults.push($scope.requisitions[index])
                        }
                    }

                    $scope.table = tableManagementService($scope.requisitionResults, $scope.itemCount);
                    $scope.table.sortBy($scope.sort);
                } else { 
                    $scope.bannerView = false;
                    $scope.reloadResults();
                }
            };

            $scope.searchByState = function(state) { 
                logger.debug('searchByState(state)');    

                if (state !== '*All Open Jobs') { 
                    $scope.selectedCategory = state;
                    $scope.bannerView = false;
                    $scope.stateSearch = true;
                    $scope.catSearch = false;
                    $scope.resumeSearch = false;

                    $scope.requisitionResults = [];

                    for (var index in $scope.requisitions) { 
                        if ($scope.requisitions[index].jobState === state) { 
                            $scope.requisitionResults.push($scope.requisitions[index]);
                        }
                    }

                    $scope.table = tableManagementService($scope.requisitionResults, $scope.itemCount);
                    $scope.table.sortBy($scope.sort);
                } else { 
                    $scope.bannerView = false;
                    $scope.reloadResults();
                }            
            };

            $scope.backToCatSearch = function() { 
                logger.debug('backToCatSearch()');    

                if ($scope.resumeSearch === true) { 
                    $scope.pageSortList.pop();
                    $scope.sort = 'title';
                }

                $scope.bannerView = true;
                $scope.catSearch = false;
                $scope.stateSearch = false;
                $scope.resumeSearch = false;
            };

            function initialize() { 
                toggleDebug($rootScope, $routeParams);
                logger.debug("Search Controller Called.");    

                var queryString = $location.search();
                $scope.reqIdLink = parseInt(queryString.link);


                logger.debug('queryString.link: [' + queryString.link + ']');    

                $scope.bannerView = true;
                $scope.loading = true;
                $scope.basicFilter = '';
                $scope.sort = 'title';
                $scope.pageCountList = PAGE_COUNT_LIST;
                $scope.itemCount = 15;
                $scope.applyReq = {};
                $scope.application = {};
                $scope.lists = {};
                $scope.requisitionLimits = [];
                $scope.threshold = MIN_RESUME_MATCH_THRESHOLD;
                $scope.resumeFile = {};
                $scope.resumeSearch = false;
                $scope.catSearch = false;
                $scope.stateSearch = false;
                $scope.selectedCategory = '';
                $scope.selectedState = '';
                $scope.pageSortList = [ { 'label': "ID", 'value': 'requisitionId' },
                                        { 'label': "Title", 'value': 'title' },
                                        { 'label': "City", 'value': 'jobCity' },
                                        { 'label': "State", 'value': 'jobState' },
                                        { 'label': "Category", 'value': 'category' },
                                        { 'label': "Post Date", 'value': 'postDate' } ];                   

                var listsNeeded = ["yn","category","state"];
                var loadListPromise = function() {return ListService.loadListNames($scope.lists, listsNeeded);};
                var categoryPromise = function() { return getReqCategories();  };
                var statePromise = function() { return getReqStates();  };
                var checkDirect = function() { return checkDirectLink($scope.reqIdLink); };

                loadListPromise()
                .then(searchRequisitions)
                .then(categoryPromise)
                .then(statePromise)
                .then(checkDirect)
                .catch(function(reason) { 
                    logger.error(reason);
                });    
            }

            function parsedResume(response) {
                $scope.resumeXML = response;
                var x2js = new X2JS();
                $scope.resumeJSON = x2js.xml_str2json( $scope.resumeXML );

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

                matchRequisitions();
            }

            function matchRequisitions() {
                $scope.requisitionResults = [];
                $scope.status = "Matching resume...";
                var matchRequest = {
                    searchText: $scope.searchText,
                    requisitionLimit: $scope.requisitionLimits
                };

                privateAnalytics.matchRequisitions(matchRequest).$promise.then(function(results){
                    var results = normalizeObjects(results);    

                    for (var key in results) {
                        results[key].score = Math.round(results[key].score * 100);

                        if (results[key].score > 100) {
                            results[key].score = 100;
                        }

                    }

                    $scope.requisitionResults = [];

                    for (var key in results) {
                        if (results[key].score >= $scope.threshold) {
                            for (var innerKey in $scope.requisitions) {
                                if ($scope.requisitions[innerKey].requisitionId === results[key].requisitionId) {
                                    $scope.requisitions[innerKey].score = results[key].score + '%';
                                    $scope.requisitions[innerKey].trustedExternalDesc = $sce.trustAsHtml($scope.requisitions[innerKey].externalDesc);  
                                    $scope.requisitionResults.push($scope.requisitions[innerKey]);
                                }
                            }
                        }
                    }

                    var found = false;
                    for (var index in $scope.pageSortList) { 
                        if ($scope.pageSortList[index].value === 'score') { 
                            found = true;
                            break;
                        }
                    }

                    if (!found) { 
                        $scope.pageSortList.push({ 'label': "Score", 'value': 'score' });
                        $timeout(function() {
                            $scope.sort = 'score';
                        }, 10);

                    } else { 
                        $timeout(function() {
                            $scope.sort = 'score';
                        }, 10);
                    }

                    $scope.table = tableManagementService($scope.requisitionResults, $scope.itemCount);
                    $timeout(function() {
                        $scope.table.sortBy($scope.sort);
                        $scope.table.filterBy($scope.basicFilter);
                        $scope.resumeSearch = true;
                        $scope.catSearch = false;
                        $scope.stateSearch = false;
                    }, 10);

                    if ($scope.requisitionResults.length <= 0) {
                        $scope.status = "No Results above " + $scope.threshold + "%...";
                    }

                    // populateCandidate();

                }, function(reason) {
                    logger.error(reason);

                });
            }

            function checkDirectLink(requisitionId) {
                var deferred = $q.defer();

                try {
                    logger.debug('checkDirectLink():1 passed [' + requisitionId + ']');    

                    if(requisitionId === null || requisitionId === undefined || isNaN(requisitionId))  {
                            logger.debug('checkDirectLink() returning early with no action taken');    
                             deferred.resolve(0);
                             return deferred.promise;  
                    }
                    
                    logger.debug('checkDirectLink():2 passed [' + requisitionId + ']');
                    try {
                        var directId = parseInt(requisitionId);
                        logger.debug('directId:' + directId);
                        if(!isNaN(directId))  {
                            $scope.applyToJob($scope.reqIdLink);
                        }
                    }
                    catch(reason) {
                        logger.error(reason);
                    }

                    deferred.resolve(0);
                }
                catch(reason) {
                    logger.error(reason);
                    deferred.reject(0);
                }
                return deferred.promise;  
            }

            function searchRequisitions() {
                var searchRequest = { "requisition": {   
                    "status": "Open"
                    },
                    "startPosition": 0,
                    "maxResults": 0,
                    "candidateDescriptor": null,
                    "requisitionDescriptor": {
                        "requisitionId": 1,
                        "hierarchyId": 1,
                        "usersId": 1,
                        "applyStreamId": 1, 
                        "title": "X",
                        "status": "X",
                        "internalDec": "X",
                        "externalDesc": "X",
                        "shortDesc": "X",
                        "requirements": "X",
                        "shift": "X",
                        "jobCity": "X",
                        "jobState": "X",
                        "company": "X",
                        "category": "X",
                        "division": "X",
                        "department": "X",
                        "jobCode": "X",
                        "jobType": "X"
                    }
                };

                return requisition.searchRequisitions(searchRequest).$promise.then(function(results){

                    var deferred = $q.defer();

                    try {

                        logger.debug('requisition.searchRequisitions(searchRequest)');    

                        $scope.searchResults = normalizeObjects(results);     
                        $scope.requisitions = $scope.searchResults.requisitionResults;
                        $scope.requisitionResults = angular.copy($scope.requisitions);

                        for (var key in $scope.requisitions) {
                            $scope.requisitionLimits.push($scope.requisitions[key].requisitionId);
                        }

                        for (var key in $scope.requisitionResults) {
                            var trustedDescription = $sce.trustAsHtml($scope.requisitionResults[key].externalDesc);  

                            if(trustedDescription !== null && trustedDescription !== undefined)  {
                                if(trustedDescription.length > 500)  {
                                    trustedDescription = trustedDescription.substring(0,500);
                                }
                            }

                            $scope.requisitionResults[key].trustedExternalDesc = trustedDescription;
                        }

                        $scope.table = tableManagementService($scope.requisitionResults, $scope.itemCount);
                        $scope.table.sortBy($scope.sort);
                        $scope.table.filterBy($scope.basicFilter);
                        $scope.loading = false;

                        deferred.resolve(0);
                    }

                    catch(reason) {
                        logger.error(reason);
                        deferred.resolve(0);
                    }

                    return deferred.promise;           

                });
            }

            function getReqCategories() { 
                var deferred = $q.defer();

                try {

                    logger.debug('requisition.getReqCategories()');    

                    $scope.categories = [];
                    $scope.categories.push({ 'name' : '*All Open Jobs', 'label' : '*All Open Jobs', 'count' : $scope.requisitions.length });

                    for (var reqKey in $scope.requisitions) { 
                        var found = false;

                        if ($scope.requisitions[reqKey].category === '' || 
                            $scope.requisitions[reqKey].category === null || 
                            $scope.requisitions[reqKey].category === undefined) { 
                                $scope.requisitions[reqKey].category = 'Other';
                        }

                        for (var catKey in $scope.categories) { 
                            if ($scope.categories[catKey].name === $scope.requisitions[reqKey].category) { 
                                $scope.categories[catKey].count = $scope.categories[catKey].count + 1;
                                found = true;
                                break;
                            }
                        }

                        if (!found) { 
                            $scope.categories.push({ 'name': $scope.requisitions[reqKey].category, 'count': 1 });
                        }            
                    }

                    var catList = $scope.lists.category;

                    for (var catIndex in $scope.categories) { 
                        if ($scope.categories[catIndex].name !== '*All Open Jobs' 
                            && $scope.categories[catIndex].name !== 'Other') { 

                            for (var catListIndex in catList) { 
                                if ($scope.categories[catIndex].name === catList[catListIndex].value) { 
                                    $scope.categories[catIndex].label = catList[catListIndex].label;
                                    break;
                                }
                            }
                        } else if ($scope.categories[catIndex].name === 'Other') { 
                            $scope.categories[catIndex].label = 'Other';
                        }
                    }

                    deferred.resolve(0);
                }

                catch(reason) {
                    logger.error(reason);
                    deferred.resolve(0);
                }

                return deferred.promise;

            }

            function getReqStates() { 
                var deferred = $q.defer();

                try {

                    logger.debug('requisition.getReqStates()');    

                    $scope.states = [];
                    $scope.states.push({ 'name': '*All Open Jobs', 'count': $scope.requisitions.length });

                    for (var reqKey in $scope.requisitions) { 
                        var found = false;

                        if ($scope.requisitions[reqKey].jobState === '' ||
                            $scope.requisitions[reqKey].jobState === null || 
                            $scope.requisitions[reqKey].jobState === undefined) { 
                                $scope.requisitions[reqKey].jobState = 'N/A';
                        }

                        for (var statesKey in $scope.states) { 
                            if ($scope.states[statesKey].name === $scope.requisitions[reqKey].jobState) { 
                                $scope.states[statesKey].count = $scope.states[statesKey].count + 1;
                                found = true;
                                break;
                            }
                        }

                        if (!found) { 
                            $scope.states.push({ 'name' : $scope.requisitions[reqKey].jobState, 'count' : 1 });
                        }
                    }

                    deferred.resolve(0);
                }

                catch(reason) {
                    logger.error(reason);
                    deferred.resolve(0);
                }

                return deferred.promise;
            }
	}
})();
