'use strict';

/* Services */

var thirdpartyServices = angular.module('com.hrlogix.ats.thirdparty.services', ['ngResource'])

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                var fileModelName = attrs.fileModel

                element.bind('change', function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(element.val());
                        ngModel.$render();
                        modelSetter(scope.$parent, element[0].files[0]);
                        modelSetter(scope , element[0].files[0]);
                        /*if(typeof(scope[fileModelName]) === "object"){
                            modelSetter(scope , element[0].files[0]);
                         }*/
                    });
                });
            }
        };
    }])
    .directive('fileModelApply', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModelApply);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])

    .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            }
        };
    })

    .directive('maxlen', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var $uiSelect = angular.element(element[0].querySelector('.ui-select-search'));
                $uiSelect.attr("maxlength", attr.maxlen);
            }
        };
    })

    .directive('googleLocationProvider', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {

                var options = {
                    types: ['(cities)'],
                    multipleSelectionOn: attr.multipleSelectionOn,
                    selectionOnNgModel: attr.selectionOnNgModel,
                    autocompleteFromId: element[0].id
                };
                var inputField = jQuery('#' + element[0].id + ' .ui-select-search');
                var autocompleteFrom = new google.maps.places.Autocomplete(inputField[0], options);
                google.maps.event.addListener(autocompleteFrom, 'place_changed', function () {
                    var place = autocompleteFrom.getPlace();
                    var city;
                    var region;
                    var country;
                    if (place.address_components !== undefined) {
                        //trunkating country, and retrieving only city name and region
                        for (var i = 0; i < place.address_components.length; i++) {
                            var component = place.address_components[i]
                            switch (component.types[0]) {
                                case "locality" :
                                    city = component.long_name;
                                    break;
                                case "administrative_area_level_1" :
                                    region = component.short_name;
                                    break;
                                case "country" :
                                    country = component.short_name;
                                    break;
                            }
                        }

                        var locationShortIdentity = city;
                        locationShortIdentity += (region !== undefined ? "," + region : "," + country);
                        if (autocompleteFrom.multipleSelectionOn !== undefined) {

                            // down to model
                            var ngModelHierarchy = autocompleteFrom.selectionOnNgModel.split('.');
                            if (ngModelHierarchy.length > 0) {
                                var sourceModel = scope[ngModelHierarchy[0]];
                                if (sourceModel === undefined) {
                                    if (ngModelHierarchy.length === 1) {
                                        sourceModel = [];
                                    } else {
                                        sourceModel = {};
                                    }
                                }
                                for (var index = 1; index <= ngModelHierarchy.length - 1; index++) {
                                    sourceModel = sourceModel[ngModelHierarchy[index]];
                                    if (sourceModel === undefined) {
                                        if (index <= ngModelHierarchy.length - 1) {
                                            sourceModel = {};
                                        } else {
                                            break;
                                        }
                                    }
                                }
                            }

                            if (sourceModel === undefined) {
                                sourceModel = [];
                            }

                            if (sourceModel.indexOf(locationShortIdentity) < 0) {
                                sourceModel.push(locationShortIdentity);
                            }
                            inputField[0].value = "";
                            scope.$apply();
                            inputField.focus();

                        }
                    }
                });
            }
        };
    })

    .service('bgResumeParser', ['$http', function ($http) {

        this.parseResume = function (file, uploadUrl, fileInputName, successFunction, errorFunction) {

            var data = new FormData();

            data.append(fileInputName, file);

            $http.post(uploadUrl, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function (response) {
                    if (successFunction !== undefined && successFunction !== null) {
                        successFunction(response);
                    }
                    jQuery('.loading-container').css('display', 'none');
                })
                .error(function (response) {
                    if (errorFunction !== undefined && errorFunction !== null) {
                        errorFunction(response);
                    }
                    jQuery('.loading-container').css('display', 'none');
                });
        };
    }])

    .service('bgResumeUpload', ['$http', '$q', function ($http, $q) {

        this.parseResume = function (file, uploadUrl, fileInputName, attachmentFormName, attachmentDetails, successFunction, errorFunction) {
            var deferred = $q.defer();
            var data = new FormData();

            data.append(fileInputName, file);
            data.append(attachmentFormName, JSON.stringify(attachmentDetails));

            $http.post(uploadUrl, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function (response) {
                    deferred.resolve(response)
                    if (successFunction !== undefined && successFunction !== null) {
                        successFunction(response);
                    }
                })
                .error(function (response) {
                    deferred.reject(response);
                    if (errorFunction !== undefined && errorFunction !== null) {
                        errorFunction(response);
                    }
                });
            return deferred.promise;
        };
    }]);
