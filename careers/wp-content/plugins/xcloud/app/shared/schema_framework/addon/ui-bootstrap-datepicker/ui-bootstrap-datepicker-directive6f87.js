angular.module('schemaForm').directive('uiBootstrapDatepicker', function () {
    return {
        restrict: 'A',
        require : ['ngModel'],
        link    : function (scope, element, attrs, ctrls) {
            ctrls[0].$parsers.push(function (selectedDate) {
                if (attrs.isStartDate === "true" || attrs.isEndDate === "true") {
                    var pickedDate = angular.copy(selectedDate);
                    if (attrs.isStartDate === "true") {
                        if (scope.form.dateOptions.minMode.toLowerCase() === "month" && pickedDate !== null) {
                            pickedDate = new Date(pickedDate.setMonth(pickedDate.getMonth() + 1));
                        }
                        else {
                            if (pickedDate !== null)
                                pickedDate = new Date(pickedDate.setDate(pickedDate.getDate() + 1));
                        }
                        scope.$parent.$parent.$broadcast("changeMinEndDate", pickedDate);
                    }

                    if (attrs.isEndDate === "true") {
                        if (scope.form.dateOptions.minMode.toLowerCase() === "month" && pickedDate !== null) {
                            pickedDate = new Date(pickedDate.setMonth(pickedDate.getMonth() - 1));
                        }
                        else {
                            if (pickedDate !== null)
                                pickedDate = new Date(pickedDate.setDate(pickedDate.getDate() - 1));
                        }
                        scope.$parent.$parent.$broadcast('changeMaxStartDate', pickedDate);
                    }
                    minDate = scope.form.dateOptions.minDate;
                    maxDate = scope.form.dateOptions.maxDate;
                    if (selectedDate >= minDate || selectedDate <= maxDate || (maxDate === undefined && minDate === undefined) || maxDate === null || minDate === null)
                        return selectedDate;
                }
                else {
                    return selectedDate;
                }
            });

            scope.$on('changeMinEndDate', function (event, data) {
                var key = scope.form.key[0];
                if (key === attrs.id && attrs.isEndDate === "true") {
                    scope.form.dateOptions.minDate = data;
                }
            });

            scope.$on('changeMaxStartDate', function (event, data) {
                var key = scope.form.key[0];
                if (key === attrs.id && attrs.isStartDate === "true") {
                    scope.form.dateOptions.maxDate = data;
                }
            })

        }
    };
})