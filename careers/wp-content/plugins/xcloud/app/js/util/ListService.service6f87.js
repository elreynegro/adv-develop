(function () {
    'use strict';

    angular
        .module('st.utils')
        .factory('ListService', ListService);

    ListService.$inject = ['$q', '$log', 'lists', 'LocalStorage'];

    function ListService($q, $log, lists, LocalStorage) {

        var logger = $log.getInstance(MODULE_NAME_UTILS_LIST);

        var services = {
            getList       : getList,
            loadListNames : loadListNames,
            retrieveLists : retrieveLists,
            applyFormList : applyFormList,
            html404Content: html404Content,
            sortList      : sortList
        };

        var html404Content = "<div class='entry entry-content-wrapper clearfix' id='search-fail'>";
        html404Content += "<h1 class='error404-header'>Page Not Found</h1>";
        html404Content += "<p>Sorry, the page you are looking for is not available.<br>Please choose another page from the menu.</p>";
        html404Content += "</div>";

        var formList = {};
        var formIdList = {};

        return services;

        function retrieveLists(listNames) {
            var data = {};

            function initialize() {
                var deferred = $q.defer();
                try {
                    logger.debug('initialize');

                    for (var listKey in listNames) {
                        var name = listNames[listKey];
                        logger.debug('name of list : ' + name);
                        data[name] = {};
                    }

                    deferred.resolve(0);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            }

            function queueLocal() {
                var deferred = $q.defer();
                try {
                    var listsNeeded = [];
                    logger.debug('queueLocal');

                    for (var listKey in listNames) {
                        var name = listNames[listKey];
                        logger.debug('listName: [' + name + ']');
                        //var localListPromise = function() { return ; };
                        listsNeeded.push(LocalStorage.get(name));
                    }

                    deferred.resolve(listsNeeded);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            }


            function executeLocal(localArray) {
                return $q.all(localArray);
            }

            function storeLocal(localData) {
                var deferred = $q.defer();
                try {
                    logger.trace('dataToShow: ' + angular.toJson(localData));

                    var listsNeeded = [];
                    logger.debug('showLocal');

                    for (var listKey in listNames) {
                        var name = listNames[listKey];
                        logger.debug('listName: [' + name + ']');
                        //logger.trace('localData: [' + angular.toJson(localData[listKey]) + ']');
                        if (localData[listKey] === undefined || localData[listKey] === null || localData[listKey] === {}) {
                            listsNeeded.push(name);
                            logger.debug(name + ' has been pushed to the queue');
                        }
                        else {
                            logger.debug(name + ' is not undeifned');
                        }
                        data[name] = localData[listKey];
                    }

                    logger.debug('listsNeeded size: ' + listsNeeded.length);
                    deferred.resolve(listsNeeded);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            }

            var executeRemoteStoreLocally = function (listsNeeded) {
                var deferred = $q.defer();

                try {
                    var promiseQueue = [];
                    logger.debug('queueListsToRetrieve ' + listsNeeded.length);

                    for (var listKey in listsNeeded) {
                        var listName = listsNeeded[listKey];

                        logger.debug('list to query: ' + listName);

                        var queryRemoteList = function () {
                            return loadActiveList(listName);
                        };
                        //var setLocal = function(listdata) { return LocalStorage.set(listdata.name, listdata.data); };

                        promiseQueue.push(queryRemoteList);
                    }

                    logger.debug('promiseQueue size: ' + promiseQueue.length);

                    deferred.resolve(0);
                    return $q.all(promiseQueue);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var resolveData = function (dataToSet) {
                var deferred = $q.defer();

                try {
                    logger.trace('resolving data : ' + angular.toJson(data));

                    deferred.resolve(data);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var initPrm = function () {
                return initialize();
            };
            var queLocPrm = function () {
                return queueLocal();
            };
            var exeLocPrm = function (localArray) {
                return executeLocal(localArray);
            };
            var showLocPrm = function (dataToShow) {
                return storeLocal(dataToShow);
            };
            var queRemPrm = function (listNames) {
                return executeRemoteStoreLocally(listNames);
            };
            var complete = function (data) {
                return resolveData(data);
            };

            return $q.when()
                .then(initPrm)
                .then(queLocPrm)
                .then(exeLocPrm)
                .then(showLocPrm)
                .then(queRemPrm)
                .then(complete)
                .catch(function (reason) {
                    logger.error(reason);
                });


        } // end of retrieve lists

        function applyFormList(funOption, setkey) {
            var set = function (setkey) {
                angular.forEach(formList, function (options, optionsKey) {
                    if (optionsKey == setkey) {
                        formList[optionsKey] = true;
                    } else {
                        formList[optionsKey] = false;
                    }
                });
            };

            var setNext = function () {
                var containers = jQuery('.apply-flow-wrapper .widget-body');
                logger.log(containers);
                var next;
                for (var i = 0, len = containers.length; i < len; i++) {
                    var $form = jQuery(containers[i]);
                    if ($form.css('display') !== 'none') {
                        logger.log('Current form found');
                        var nextIndex = i + 1;
                        if (nextIndex < len) {
                            next = jQuery(containers[nextIndex]).attr('id');
                            logger.log('Next form: ' + next);
                            break;
                        }
                    }
                }
                set(next);
            };

            var get = function () {
                return formList;
            };

            var getFormIdList = function () {
                return formIdList;
            };

            var initiFormList = function () {
                var container = jQuery('.apply-flow-wrapper .widget-body');
                container.each(function (index) {
                    var keySet = jQuery(this).attr('id');
                    var formId = jQuery(this).attr('form-id');
                    formList[keySet] = false;
                    if (formId !== "{{applyFormId}}") {
                        formIdList[formId] = keySet;
                    }
                });
            };

            if (funOption === 'initiFormList') {
                initiFormList();
            }

            if (funOption === 'set') {
                return set(setkey);
            }
            if (funOption === 'setNext') {
                return setNext();
            }
            if (funOption === 'get') {
                return get();
            }
            if (funOption === 'getFormIdList') {
                return getFormIdList();
            }
        }

        function html404Content() {
            return html404Content;
        }

        function loadListNames(target, listArray) {
            /*
             * promise chain definitions
             */
            var checkLocalStatus = function () {

                var deferred = $q.defer();
                try {
                    logger.debug('checkLocalStatus');
                    var listPromises = [];
                    for (var listKey in listArray) {
                        listPromises.push(LocalStorage.get(listArray[listKey]));
                    }
                    deferred.resolve(0);
                    return $q.all(listPromises);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;

            };

            var processLocallyFound = function (data) {
                var deferred = $q.defer();
                try {
                    logger.debug('processLocallyFound');
                    var listsStillNeeded = [];
                    for (var listKey in listArray) {
                        var namedList = listArray[listKey];

                        logger.trace(angular.toJson(data[listKey]));

                        if (data[listKey] === undefined || data[listKey] === null) {
                            logger.debug('list: ' + namedList);
                            listsStillNeeded.push(namedList);
                        }
                        else {

                            logger.trace(angular.toJson(data[listKey], true));
                            target[namedList] = data[listKey];
                            logger.trace('setting target list to : ' + namedList + ' : ' + angular.toJson(target[namedList]));
                        }
                    }

                    deferred.resolve(listsStillNeeded);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var queueListsToRetrieve = function (listsNeeded) {
                var deferred = $q.defer();
                var promiseQueue = [];
                try {
                    logger.debug('queueListsToRetrieve ' + listsNeeded.length);

                    for (var listKey in listsNeeded) {
                        var listNameToQuery = listsNeeded[listKey];

                        logger.debug('list to query: ' + listNameToQuery);

                        promiseQueue.push(loadActiveList(listNameToQuery));
                    }
                    deferred.resolve(0);
                    return $q.all(promiseQueue);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;
            };

            var setLocalStorage = function (data) {
                var deferred = $q.defer();
                try {
                    logger.debug('setLocalStorage');
                    var promiseQueue = [];
                    for (var dataKey in data) {
                        var listReturned = data[dataKey];
                        target[listReturned.name] = listReturned.data;
                        logger.debug('list queried: ' + listReturned.name);
                        //listsToReturn[listReturned.name] = listReturned.data;
                        promiseQueue.push(LocalStorage.set(listReturned.name, listReturned.data));
                    }

                    deferred.resolve(0);
                    return $q.all(promiseQueue);
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;

            };

            var translateLists = function () {
                var deferred = $q.defer();
                // Skip if there's no point!
                if (_XC_CONFIG.lang === null || _XC_CONFIG.lang === 'en' || !_XC_i18n) {
                    deferred.resolve(0);
                    return deferred.promise;
                }

                for (var list in target) {
                    if (typeof target[list] === 'object') {
                        for (var i = 0, len = target[list].length; i < len; i++) {
                            if (target[list][i].hasOwnProperty('label')) {
                                target[list][i].label = XCLOUD.i18n(target[list][i].label, 'lists');
                            }
                        }
                    }
                }

                deferred.resolve(0);
                return deferred.promise;
            };

            var deferred = $q.defer();
            // var listsToReturn = {};
            try {

                logger.debug('loadLists');

                var finalPromiseSet = checkLocalStatus()
                    .then(processLocallyFound)
                    .then(queueListsToRetrieve)
                    .then(setLocalStorage)
                    .then(translateLists)
                    .then(function () {
                        logger.debug('ListService : loadListNames completed');
                    })
                    .catch(function (reason) {
                        logger.error(reason);
                        deferred.reject(reason);
                    });

                deferred.resolve(finalPromiseSet);

            }
            catch (reason) {
                logger.error(reason);

                deferred.reject(reason);
            }
            return deferred.promise;

        }

        function getList(variable, listName, callback) {

            variable[listName] = LocalStorage.get(listName);

            if (variable[listName] === null || variable[listName] === undefined) {

                lists.getActiveListByName({name: listName}).$promise.then(function (results) {
                    variable[listName] = normalizeObjects(results);

                    LocalStorage.set(listName, variable[listName]);
                    if (callback !== null && callback !== undefined) {
                        callback();
                    }

                }, function (reason) {
                    logger.error(reason);
                    logger.error('Getting list: ' + listName);
                });

            } else {
                if (callback !== null && callback !== undefined) {
                    callback();
                }
            }
        }

        function sortList(ListArray) {
            var deferred = $q.defer();
            try {
                ListArray = _.sortBy(ListArray, 'sortOrder');
                deferred.resolve(ListArray);
            }
            catch (reason) {
                logger.error(reason);
                deferred.reject(reason);
            }
            return deferred.promise;
        }

        function loadActiveList(listName) {

            return lists.getActiveListByName({name: listName}).$promise.then(function (results) {
                var deferred = $q.defer();
                try {
                    logger.debug('loadActiveList');
                    var data = normalizeObjects(results);
                    sortList(data).then(function (sortedData) {
                        var list = {};
                        list.data = sortedData;
                        list.name = listName;
                        //logger.info('list: ' + listName + ', data: ' + angular.toJson(data));
                        deferred.resolve(list);
                    });
                }
                catch (reason) {
                    logger.error(reason);
                    deferred.reject(reason);
                }
                return deferred.promise;

            });
        }
    }
}());    