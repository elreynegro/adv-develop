/**
 * Created by TDadam on 4/5/2018.
 */
(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('schemaFormGroupInterpolation', schemaFormGroupInterpolation);

    schemaFormGroupInterpolation.$inject = ['$q', '$log', 'ModelDependencyFactory'];

    function schemaFormGroupInterpolation($q, $log, ModelDependencyFactory) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            submit: submit
        };
        return service;

        function submit(getMetaData, semaphoreCollection, successCallBack, errorCallback) {
            try {
                getMetaData().then(function (result) {
                    service.skippedFormGroup = [];
                    service.metaData = result;
                    service.semaphoreCollection = semaphoreCollection;
                    service.successCallBack = successCallBack;
                    service.errorCallback = errorCallback;
                    if (result.formGroups.length > 0) {
                        interpolationIteration(0);
                    }
                });
            }
            catch (error) {
                console.log(error.message)
            }
        }

        function interpolationIteration(nextIndex) {
            var _formElement = service.metaData.formGroups[nextIndex];
            for (var subIndex = 0; subIndex < _formElement.form.fieldGroups.length; subIndex++) {
                var _fieldGroup = _formElement.form.fieldGroups[subIndex];
                _fieldGroup.parentId = _formElement.form.id;
                _fieldGroup.headIndex = nextIndex;
            }
            ModelDependencyFactory.schemaInterpolation.consumerEmitReceiver = emitReceiver;
            ModelDependencyFactory.schemaInterpolation.performMetaDataInterpolation(_formElement.form.fieldGroups, service.semaphoreCollection, formCommit, errorCallBack, {doNotParse: true})
        }

        function emitReceiver(eventName, args) {
            ModelDependencyFactory.angularSchemaObserver.registerNgModel(args);
        }

        function formCommit(fieldGroupCollection) {
            try {
                var _headIndex = fieldGroupCollection[0].headIndex;
                logger.debug('commit form' + _headIndex);
                service.metaData.formGroups[_headIndex].form.fieldGroups = fieldGroupCollection;
                service.metaData.formGroups[_headIndex].form.isInterpolationCompleted = true;
                formFinalizeHandler(_headIndex + 1);
            } catch (reason) {
                service.errorCallback(reason);
            }
        }

        function errorCallBack(reason) {
            service.errorCallback(reason);
        }

        function formFinalizeHandler(nextIndex) {
            try {
                if (nextIndex === service.metaData.formGroups.length) {
                    service.successCallBack(service.metaData);
                } else {
                    interpolationIteration(nextIndex)
                }
            } catch (reason) {
                service.errorCallback(reason);
            }
        }
    }
}());
