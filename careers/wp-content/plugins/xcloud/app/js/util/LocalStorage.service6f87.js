(function() {
    'use strict';

    angular
    .module('st.utils')
    .factory('LocalStorage', LocalStorage);

    LocalStorage.$inject = ['$q', '$log', '$window'];


    function LocalStorage($q, $log, $window)   {

    	    var logger = $log.getInstance(MODULE_NAME_UTILS_LOCAL_STORAGE);


            var service = {
            	get      : get,
            	getOptions : getOptions,
            	set      : set,
            	setOptions : setOptions,
            	supports : supports,
            	remove   : remove,
            	clear    : clear
            };

            return service;

            function get(name, decrypt, rememberMe) {

            	var deferred = $q.defer();
            	try   {

					logger.debug('module name: ' + angular.module('st.utils').name);
            		var LocalVarName = name;
            		name = clientName + '.' + name;

            		if (!supports()) {
            			logger.warn('No Local Storage');
            			deferred.resolve(undefined);
            		}

            		var item = $window.localStorage.getItem(name);

            		logger.trace('LocalStorage item: ' + angular.toJson(item, true));

            		if (item === undefined || item === null) {
            			logger.debug('Local Storage: Did not find item for: ' + name);
            			deferred.resolve(undefined);
            		}

            		var jsonItem = angular.fromJson(item);

            		var now = new Date().getTime();
            		var then = 0;

            		if(jsonItem !== undefined && jsonItem !== null)  {
            			then = parseInt(jsonItem.date);
            		}

                    if(decrypt === undefined) {
                        decrypt = false;
                    }

                    if(rememberMe === undefined) {
                        rememberMe = false;
					}
                    if((LocalVarName === 'credentials' || LocalVarName === 'oauthcredentials') && decrypt && jsonItem !== null) {
                    	if(jsonItem.data !== undefined && jsonItem.data !== null) {
                            // jsonItem.data = atob(jsonItem.data);
                            jsonItem.data = decodeURIComponent(atob(jsonItem.data));
                        }
                    }

            		if (jsonItem !== null && now - then >= maxSessionStorageTime && (LocalVarName === 'credentials' || LocalVarName === 'oauthcredentials') && !rememberMe) {
            			logger.debug('Local Storage: Item for: ' + name + ' Expired! (' + (now - then) + ' >= ' + maxSessionStorageTime + ')');
                        $window.localStorage.removeItem(name);
            			//storage.remove(name);
            			deferred.resolve(undefined);
            		} else {
                        logger.debug('Local Storage: Returning item data for: ' + name);
                        // logger.trace('Local Storage: Returning item data of length : ' + name + ": " + jsonItem.data.length);
						if(jsonItem !== null) {
                            deferred.resolve(angular.fromJson(jsonItem.data));
                        }else{
                            deferred.resolve(null);
						}
            		}


            	}
            	catch(reason) {
            		logger.error(reason);
            		deferred.reject(reason);
            	}
            	return deferred.promise;

            };


            function set(name, data, encrypt) {

            	var deferred = $q.defer();
            	try   {
                    if(encrypt === undefined){
                        encrypt = false
                    }
                    if((name === 'credentials' || name === 'oauthcredentials') && encrypt) {
                        // data = btoa(JSON.stringify(data));
                        data = btoa(encodeURIComponent(JSON.stringify(data)));
                    }

            		name = clientName + '.' + name;

            		if (!supports()) {
            			logger.trace('does not support storage');
            			deferred.resolve(0);
            		}

                    var storageItem = new StorageItem(data);
            		if (!angular.isString(data)) {
            			logger.trace('Local Storage: Converting data to JSON String for: ' + name);
            			storageItem.data = angular.toJson(data);
            		}

            		logger.debug('Local Storage: Storing: ' + name);

            		$window.localStorage.setItem(name, angular.toJson(storageItem));
            		deferred.resolve(storageItem);
            	}
            	catch(reason) {
            		logger.error(reason);
            		deferred.reject(reason);
            	}
            	return deferred.promise;
            }

            function setOptions(name, data)  {

            	var deferred = $q.defer();
            	try   {

            		name =  'options.' + name;
            		logger.debug('setting options [' + name + '], data [' + angular.toJson(data) + ']');
            		return deferred.promise.then(set(name, data));
            		//deferred.resolve(0);
            	}
            	catch(reason) {
            		logger.error(reason);
            		deferred.reject(reason);
            	}
            	deferred.resolve(0);
            	return deferred.promise;


            }

            function getOptions(name)  {
            	name =  'options.' + name;
            	return get(name);
            }

            function supports() {
                try {
                    var hasStorage = ('localStorage' in window && window.localStorage !== null);
                    logger.debug('Local Storage is available: ' + hasStorage);
                    return hasStorage;
                } catch (e) {
                	logger.error(e);
                    logger.error('Local Storage check caught exception! MSG:' + e.message);
                    return false;
                }
            }


            function remove(name) {
                if (!supports()) {
                    return;
                }

                name = clientName + '.' + name;

                logger.debug('Local Storage: Removing: ' + name);

                $window.localStorage.removeItem(name);
            }

            function clear() {
                if (!supports()) {
                    return;
                }

                logger.debug('Local Storage: Clearing ALL local storage items.');

                $window.localStorage.clear();
            }

            function StorageItem(data) {
                this.date = '' + new Date().getTime();
                this.data = data;
            }


    }






}());
