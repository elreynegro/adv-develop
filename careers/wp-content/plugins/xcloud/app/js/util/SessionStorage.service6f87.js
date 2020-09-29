(function () {
    'use strict';

    angular
    .module('st.utils')
    .factory('SessionStorage', SessionStorage);

    SessionStorage.$inject = ['$q', '$log', '$window', '$rootScope'];

    function SessionStorage($q, $log, $window, $rootScope) {

        var logger = $log.getInstance(MODULE_NAME_UTILS_SESSION);

        //Session Handler
        $rootScope.initialLoad = true;

        var service = {
            get: get,
            set: set,
            supports: supports,
            remove: remove,
            clear: clear
        };

        return service;

        function get(name, decrypt) {

            if (!supports()) {
                logger.warn('No Session Storage');
                deferred.resolve(undefined);
            }            

            var item = $window.sessionStorage.getItem(name);
    
            if (item === undefined || item === null) {
                if (DEBUG){
                    console.log('Session Storage: Did not find item for: ' + name);
                    console.trace();
                }
                return null;
            } else { 
                var jsonItem = angular.fromJson(item);
                var now = new Date().getTime();
                var then = parseInt(jsonItem.date);
            }

            if (now - then >= maxSessionStorageTime && $rootScope.initialLoad && (name === 'credentials' || name === 'oauthcredentials')) {
                $rootScope.initialLoad = false;
                if (DEBUG) console.log('Session Storage: Item for: ' + name + ' Expired! (' + (now - then) + ' >= ' + maxSessionStorageTime + ')');
                $window.sessionStorage.removeItem(name);
                return null;
            } else {
                if (DEBUG) console.log('Session Storage: Returning item data for: ' + name + " JSON: " + jsonItem.data);
                if(decrypt === undefined){
                    decrypt = false
                }
                if((name === 'credentials' || name === 'oauthcredentials') && decrypt) {
                    // jsonItem.data = JSON.parse(atob(jsonItem.data));
                    jsonItem.data = JSON.parse(decodeURIComponent(atob(jsonItem.data)));
                }
                return angular.fromJson(jsonItem.data);
            }

//            var deferred = $q.defer();
//            try {
//
//                if (!supports()) {
//                    logger.warn('No Session Storage');
//                    deferred.resolve(undefined);
//                }
//
//                var item = $window.sessionStorage.getItem(name);
//
//                if (item === undefined || item === null) {
//                    logger.debug('Session Storage: Did not find item for: ' + name);
//                    deferred.resolve(undefined);
//                }
//
//                var jsonItem = angular.fromJson(item);
//
//                var now = new Date().getTime();
//                var then = 0;
//
//                if (jsonItem !== undefined && jsonItem !== null) {
//                    then = parseInt(jsonItem.date);
//                }
//
//                if (now - then >= maxSessionStorageTime) {
//                    logger.debug('Session Storage: Item for: ' + name + ' Expired! (' + (now - then) + ' >= ' + maxSessionStorageTime + ')');
//
//                    remove(name);
//                    deferred.resolve(undefined);
//                } else {
//                    logger.trace(angular.toJson(jsonItem.data));
//                    deferred.resolve(angular.fromJson(jsonItem.data));
//                }
//
//            }
//            catch (reason) {
//                logger.error(reason);
//                deferred.reject(reason);
//            }
//            return deferred.promise;

        }

        function set(name, data, encrypt) {

            var deferred = $q.defer();
            try {

                if (!supports()) {
                    deferred.resolve(0);
                }

                if(encrypt === undefined){
                    encrypt = false
                }
                if((name === 'credentials' || name === 'oauthcredentials') && encrypt) {
                    // data = btoa(JSON.stringify(data));
                    data = btoa(encodeURIComponent(JSON.stringify(data)));
                }

                var storageItem = new StorageItem(data);
                if (!angular.isString(data)) {
                    logger.debug('Session Storage: Converting data to JSON String for: ' + name);
                    storageItem.data = angular.toJson(data);
                }

                logger.debug('Session Storage: Storing: ' + name);

                $window.sessionStorage.setItem(name, angular.toJson(storageItem));
                deferred.resolve(data);

            }
            catch (reason) {
                logger.error(reason);
                deferred.reject(reason);
            }
            return deferred.promise;
        }

        function supports() {
            try {
                var hasStorage = ('localStorage' in window && window['sessionStorage'] !== null);
                //logger.info('Session Storage is available: ' + hasStorage);
                return hasStorage;
            } catch (reason) {
                logger.error('Session Storage:  check caught exception! MSG:' + reason.message);
                return false;
            }
        }

        function remove(name) {
            if (!supports()) {
                return;
            }

            logger.debug('Session Storage: Removing: ' + name);

            $window.sessionStorage.removeItem(name);
        }

        function clear() {
            if (!supports()) {
                return;
            }

            logger.debug('Session Storage: Clearing ALL Session Storage items.');
            $window.sessionStorage.clear();
            XCLOUD.personalize.init();
        }

        function StorageItem(data) {
            this.date = '' + new Date().getTime();
            this.data = data;
        }
    }
}());
