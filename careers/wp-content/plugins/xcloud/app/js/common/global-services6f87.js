'use strict';

var globalServices = angular.module('com.hrlogix.ats.global.services', [
    'st.utils'
]);

globalServices.factory('globalService',
    ['$rootScope', '$routeParams', 'LocalStorage',
        function ($rootScope, $routeParams, LocalStorage) {

            var global = {};

            // Debug View Handler
            global.toggleDebug = function() {
                toggleDebug($rootScope, $routeParams);
                if ($routeParams.clear !== undefined && $routeParams.clear === 'true') {
                    LocalStorage.clear();
                }
            };

            global.getList = function(name) {
                return LocalStorage.get(name);
            };

            global.setList = function(name, list) {
                LocalStorage.set(name, list);
            };

            return global;
        }]);

globalServices.factory('localStorageService',
    ['localStorageHelper',
        function (localStorageHelper) {

            var localStorageService = {};

            localStorageService.getStoredItem = function(name) {
                return localStorageHelper.get(name);
            };



            localStorageService.getStoredItemViaPromise = function(name) {

                var promise = localStorageHelper.getViaPromise(name);
                if(promise === undefined)  {
                    // console.log('localStorageHelper.getPromise is undefined');
                }
                return promise;
            };

            localStorageService.setStoredItem = function(name, list) {
                localStorageHelper.set(name, list);
            };

            localStorageService.setStoredItemViaPromise = function(name, list) {
                localStorageHelper.setViaPromise(name, list);
            };


            return localStorageService;
        }]);

globalServices.factory('LinkedList', function () {

    var Node = function(data){
        this.data = data;
        this.next   = null;
    };

    var LinkedList;

    LinkedList = function () {
        this._length = 0;
        this.head = null;

        this.add = function (value) {
            var node = new Node(value);
            var currentNode = this.head;
            if(!currentNode){
                this.head = node;
                this._length ++;
                return node;
            }
            while (currentNode.next){
                currentNode = currentNode.next;
            }
            currentNode.next = node;
            this._length ++;
            return node;
        };
    };

    return LinkedList;
});