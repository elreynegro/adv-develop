/**
 * Created by TDadam on 12/19/2017.
 */
angular.module("schemaForm")
    .run(["$templateCache",
        function($templateCache) {
        $templateCache.put("directives/decorators/bootstrap/datepicker/datepicker.html",
            "<div class=\"form-group {{form.htmlClass}}\" ng-class=\"{\'has-error\': hasError()}\">\n  <label for=\"{{form.key.slice(-1)[0]}}\" class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>\n  <div ng-class=\"{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}\">\n    <span ng-if=\"form.fieldAddonLeft\"\n          class=\"input-group-addon\"\n          ng-bind-html=\"form.fieldAddonLeft\"></span>\n    <input ng-required=\"form.required\" ng-show=\"form.key\"\n           type=\"text\"\n           class=\"form-control schema-text-uppercase {{form.fieldHtmlClass}}\"\n           schema-validate=\"form\"\n           ng-model=\"$$value$$\"\n           ng-disabled=\"form.readonly\"\n           pick-a-date=\"form.pickadate\"\n           min-date=\"form.minDate\"\n           max-date=\"form.maxDate\"\n           select-years=\"form.selectYears\"\n           select-months=\"form.selectMonths\"\n           name=\"{{form.key.slice(-1)[0]}}\"\n           id=\"{{form.key.slice(-1)[0]}}\"\n           format=\"form.format\"\n            placeholder=\"{{form.format}}\"\n            title=\"{{form.key.slice(-1)[0]}}\"\n            />\n    <span ng-if=\"form.fieldAddonRight\"\n          class=\"input-group-addon\"\n          ng-bind-html=\"form.fieldAddonRight\"></span>\n  </div>\n  <span id=\"{{form.key.slice(-1)[0] + \'XCloudStatus\'}}\" aria-live=\"polite\" role=\"alert\" class=\"help-block red\" ng-show=\"ngModel.$touched && ngModel.$error.required && ngModel.$dirty === false\" >{{form.validationMessage[\"302\"]}}</span><span aria-live=\"polite\"  role=\"alert\" class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");
            }]
    );
