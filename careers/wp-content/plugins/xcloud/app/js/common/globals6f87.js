'use strict';

// Global Variables & Functions

var GLOBAL_TIMEOUT = 1000;
var ROOT_SCOPE = null;

var MODULE_NAME_UTILS = "st.utils";
var MODULE_NAME_UTILS_ARRAY = "st.utils.ArrayUtil";
var MODULE_NAME_UTILS_LIST = "st.utils.ListService";
var MODULE_NAME_UTILS_LOCAL_STORAGE = "st.utils.LocalStorage";
var MODULE_NAME_UTILS_META = "st.utils.MetaService";
var MODULE_NAME_UTILS_OPTIONS = "st.utils.OptionsService";
var MODULE_NAME_UTILS_SESSION = "st.utils.SessionStorage";
var MODULE_NAME_UTILS_TABLE = "st.utils.TableService";
var MODULE_NAME_UTILS_PAGE = "st.utils.PageService";
var MODULE_NAME_UTILS_GLOBAL_STATE = "st.model.dependency.ModelDependencyFactory";

var MODULE_NAME_USER_AUTH = "st.user.auth.Auth";
var MODULE_NAME_USER_AUTH_BUFFER = "st.user.auth.AuthBuffer";

var MODULE_NAME_SERVICES = "st.services";
var MODULE_NAME_SERVICES_AI = "st.services.AIService";
var MODULE_NAME_SERVICES_APPLICATION = "st.services.ApplicationService";
var MODULE_NAME_SERVICES_HIERARCHY = "st.services.HierarchyService";
var MODULE_NAME_SERVICES_PEOPLE = "st.services.PeopleService";
var MODULE_NAME_SERVICES_REQUISITION = "st.services.RequisitionService";
var MODULE_NAME_SERVICES_USER = "st.services.UserService";
var MODULE_NAME_SERVICES_DATA_SOURCE = "st.services.DataSourceService";


var MODULE_NAME_CONTROLLERS_USER_SITE = "st.controllers.user.site";
var MODULE_NAME_CONTROLLERS_USER_SITE_BASE = "st.controllers.user.site.BaseController";
var MODULE_NAME_CONTROLLERS_USER_SITE_MAIN = "st.controllers.user.site.MainController";
var MODULE_NAME_CONTROLLERS_USER_SITE_DASHBOARD = "st.controllers.user.site.DashboardController";
var MODULE_NAME_CONTROLLERS_USER_SITE_LOGIN = "st.controllers.user.site.LoginController";

var MODULE_NAME_CONTROLLERS_USER_SITE_ANALYTICS = "st.controllers.user.site.AnalyticsController";
var MODULE_NAME_CONTROLLERS_USER_SITE_MANAGE_JOBS = "st.controllers.user.site.ManageJobsController";
var MODULE_NAME_CONTROLLERS_USER_SITE_REQUISITION_SCREEN = "st.controllers.user.site.RequisitionScreen";
var MODULE_NAME_CONTROLLERS_USER_SITE_APPLICATION_VIEW = "st.controllers.user.site.ApplicationViewController";
var MODULE_NAME_CONTROLLERS_USER_SITE_REQUISITION_PROFILE = "st.controllers.user.site.RequisitionProfileController";
var MODULE_NAME_CONTROLLERS_USER_SITE_REQUISITION_EDIT = "st.controllers.user.site.RequisitionEditController";
var MODULE_NAME_CONTROLLERS_USER_SITE_SEARCH_APPLICATIONS = "st.controllers.user.site.SearchApplicationsController";
var MODULE_NAME_CONTROLLERS_USER_SITE_ADD_CANDIDATE = "st.controllers.user.site.AddCandidateController";

var MODULE_NAME_CONTROLLERS_USER_SITE_TEMPLATES_EDIT = "st.controllers.user.site.TemplatesEditController";

var MODULE_NAME_APPLY_AUTH = 'st.candidate.auth.AuthService';

var MODULE_NAME_CONTROLLERS_APPLY_SITE_BASE = "st.controllers.apply.site.BaseController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_MAIN = "st.controllers.apply.site.MainController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY = "st.controllers.apply.site.applyController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_LOGIN = "st.controllers.apply.site.LoginController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_SEARCH = "st.controllers.apply.site.SearchController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_SCREENING_QUESTIONS = "st.controllers.apply.site.ScreeningQuestionsController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_SCREEN_QUESTION = "st.controllers.apply.site.QuestionController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_ACCOUNT = "st.controllers.apply.site.AccountController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_ACCOUNT_NAV = "st.controllers.apply.site.NavigationController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_CONFIRMATION = "st.controllers.apply.site.confirmationController";

var MODULE_NAME_CONTROLLERS_DASHBOARD_ATTACHMENT_ACCOUNT = "st.candidate.activity.dashboardAttachmentController";

var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW = "st.controllers.apply.site.ApplyFlow";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS = "st.controllers.apply.site.ApplyFlowForms";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORM = "st.controllers.apply.site.ApplyFlowForms";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_CONTAINERS = "st.controllers.apply.site.ApplyFlowContainers";


var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_PERSONAL_INFO = "st.controllers.apply.site.personalInformationFormController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_LEAD_CAPTURE = "st.controllers.apply.site.leadCaptureFormController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_WORK_HISTORY = "st.controllers.apply.site.workHistoryFormController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_EDUCATION = "st.controllers.apply.site.educationHistoryFormController";
var MODULE_NAME_CONTROLLERS_APPLY_SITE_APPLY_FLOW_FORMS_EEO = "st.controllers.apply.site.eeoFormController";

var loginStatus = {loginFailed: false, loginAttempted: false};


function isPromise(deferred) {

    if (angular.isObject(deferred) &&
        angular.isObject(deferred.promise) &&
        deferred.promise.then instanceof Function &&
        deferred.promise["catch"] instanceof Function &&
        deferred.promise["finally"] instanceof Function) {
        //This is a simple Promise
        return true;
    }
    return false;
}

function toggleDebug(rootScope, routeParam) {

    if (ROOT_SCOPE === null) {
        ROOT_SCOPE = rootScope;
    }

    if (routeParam.debug !== undefined) {
        if (routeParam.debug === 'true') {
            rootScope.debugOption = '?debug=true';
            rootScope.showDebug = true;
            DEBUG = true;
        } else {
            rootScope.debugOption = '';
            rootScope.showDebug = false;
            DEBUG = false;
        }
    } else {
        rootScope.debugOption = '';
        rootScope.showDebug = false;
        DEBUG = false;
    }
}

function normalizeObjects(dirty) {
    return angular.fromJson(angular.toJson(dirty));
}

function reOrderFiltered(filter, grouping, orderColumn) {
    var reOrders = filter('orderBy')(grouping, orderColumn);
    var index = 0;
    for (var key in reOrders) {
        reOrders[key][orderColumn] = index++;
    }
}

function reOrder(list, orderColumn) {
    var index = 1;
    for (var key in list) {
        list[key][orderColumn] = index++;
    }
}

function selectAllByName(textName) {
    var textElement = document.getElementById(textName);
    selectAll(textElement);
}

function selectAll(text) {
    text.select();
}

function findLabelByValue(list, value) {
    for (var key in list) {
        if (list[key].value === value) {
            return list[key].label;
        }
    }
    return '';
}

function findActionByValue(list, value) {
    for (var key in list) {
        if (list[key].value === value) {
            return list[key].action;
        }
    }
    return '';
}

function findObjectById(list, id) {
    for (var key in list) {
        if (list[key].id === id) {
            return list[key];
        }
    }
    return null;
}

function findObjectByField(list, field, value) {
    for (var key in list) {
        if (list[key][field] === value) {
            return list[key];
        }
    }
    return null;
}

function length(field) {
    if (field === undefined) {
        return 0;
    }
    return field.length;

}


// Date time functions
function formatDateTime(milliseconds) { // 01/01/2015 1:30 PM

    var formatted = '';
    var offset = 0; // new Date().getTimezoneOffset();

    if (milliseconds !== null) {
        var date = new Date(milliseconds - (offset * 60 * 1000));
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour24 = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var hour = (hour24 > 12 ? hour24 - 12 : hour24);
        var ampm = (hour24 < 12 ? ' AM' : ' PM');
        if (hour === 0)
            hour = 12;
        return (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + year + ' ' +
            hour + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + ampm;
    }

    return formatted;
}

function formatDate(milliseconds) {

    var formatted = '';
    var offset = 0;  // new Date().getTimezoneOffset();

    if (milliseconds !== null) {
        var date = new Date(milliseconds - (offset * 60 * 1000));
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + year;
    }
    return formatted;
}

function formatTime(milliseconds) { // 01/01/2015 1:30 PM

    var formatted = '';
    var offset = 0; // new Date().getTimezoneOffset();

    if (milliseconds !== null) {
        var date = new Date(milliseconds - (offset * 60 * 1000));
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour24 = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var hour = (hour24 > 12 ? hour24 - 12 : hour24);
        var ampm = (hour24 < 12 ? ' AM' : ' PM');
        if (hour === 0)
            hour = 12;
        return hour + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + ampm;
    }

    return formatted;
}


// Uses JQuery and a modal dialog with the id: errorModal
function handleError(reason, errorMsg) {
    if (DEBUG) {
        // console.log(errorMsg);
    }

    if (ROOT_SCOPE !== null) {
        var atsMessage = null;

        if (reason !== undefined && reason !== null) {
            if (reason.data !== undefined && reason.data.message !== undefined) {
                atsMessage = reason.data.message;
            }
        }

        ROOT_SCOPE.errorMessage = errorMsg;
        ROOT_SCOPE.atsMessage = (atsMessage === null ? "" : atsMessage);
        $('#errorModal').modal({backdrop: 'static', keyboard: false, show: true});
    }
}

function hasSuccess(message) {

    if (DEBUG) {
        // console.log('Success: ' + message);
    }

    if (ROOT_SCOPE !== null) {
        ROOT_SCOPE.hasSuccess = true;
        ROOT_SCOPE.successMessage = message;
    }
}

function clearSuccess() {

    if (DEBUG) {
        // console.log('Clearning Success.');
    }

    if (ROOT_SCOPE !== null) {
        ROOT_SCOPE.hasSuccess = false;
    }
}


// Uses hasError t/f toggle to allow ng-show to determine
// the error display method
function hasError(reason, errorMsg) {
    if (ROOT_SCOPE !== null) {
        var atsMessage = null;
        var atsDetail = null;

        if (reason !== undefined && reason !== null) {
            if (reason.data !== undefined && reason.data !== null) {
                if (reason.data.message !== undefined && reason.data.message !== null) {
                    atsMessage = reason.data.message;
                }
                if (reason.data.detail !== undefined && reason.data.detail !== null) {
                    atsDetail = reason.data.detail;
                }

                if (DEBUG) {
                    // console.log(errorMsg + ' AtsMessage: ' + (atsMessage === null ? "" : atsMessage) + '\n - Detail: ' + (atsDetail === null ? "" : atsDetail));
                }
            }
        } else {
            if (DEBUG) {
                // console.log(errorMsg);
            }
        }

        ROOT_SCOPE.errorMessage = errorMsg;
        ROOT_SCOPE.atsMessage = (atsMessage === null ? "" : atsMessage);
        ROOT_SCOPE.atsDetail = (atsDetail === null ? "" : atsDetail);
        ROOT_SCOPE.hasError = true;
    }
}

function htmlDecode(input) {
    if (input === undefined || input === null) {
        input = "&nbsp;";
    }
    var element = document.createElement('div');
    element.innerHTML = input;
    return element.childNodes[0].nodeValue;
}

function singleSignOn(navigateTo, currentUser) {
    var form = document.createElement("form");
    form.setAttribute("method", 'POST');
    form.setAttribute("action", LEGACY_URL + '/Login.ats');

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", 'uname');
    hiddenField.setAttribute("value", currentUser.username);
    form.appendChild(hiddenField);

    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", 'password');
    hiddenField.setAttribute("value", currentUser.password);
    form.appendChild(hiddenField);

    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", 'errPage');
    hiddenField.setAttribute("value", 'Setup.ats');
    form.appendChild(hiddenField);

    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", 'nextPage');
    hiddenField.setAttribute("value", navigateTo);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}

function lowerCaseFirst(string) {
    if (string === undefined) {
        return string;
    }

    // Lower the first letter always
    var result = string.charAt(0).toLowerCase();
    var lastPart = string.slice(1);

    // if the next value is lowercase, we're done
    if (lastPart.charAt(0) !== lastPart.charAt(0).toLowerCase()) {

        for (var key = 0; key < lastPart.length; key++) {
            if (lastPart[key] === lastPart[key].toUpperCase()) {
                var nextKey = key + 1;
                if (lastPart.charAt(nextKey) !== undefined && lastPart.charAt(nextKey) !== lastPart.charAt(nextKey).toLowerCase()) {
                    lastPart = lastPart.charAt(key).toLowerCase() + lastPart.slice(key + 1);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    return result + lastPart;
}

function upperCaseFirst(string) {
    if (string === undefined) {
        return string;
    }

    var result = string.charAt(0).toUpperCase();
    var lastPart = string.slice(1);

    return result + lastPart;
}

function normalizeFieldName(fieldName) {

    var normalized = '';

    for (var x = 0; x < fieldName.length; x++) {
        if (fieldName.charAt(x) === fieldName.charAt(x).toUpperCase() && isChar(fieldName.charAt(x))) {
            normalized = normalized + ' ';
        }
        normalized = normalized + fieldName.charAt(x);
    }

    return upperCaseFirst(normalized);
}

function isChar(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// cleans a json objec of its unknown paramters (ie, extra labels)
// scrub - the object to scrub
// name - the ATS Core name of the object
// metadata - a reference to the metadata angular.service
function scrubObject(scrub, name, metadata) {

    if (scrub === null || scrub === undefined ||
        name === null || name === undefined ||
        metadata === null || metadata === undefined) {

        if (DEBUG) {
            // console.log("scrubObject called with null/undefined parameters!");
        }
        return;
    }

    metadata.getTableMetadata({table: name}).$promise.then(function (result) {

        var tableData = normalizeObjects(result);

        for (var field in scrub) {
            var found = false;

            for (var key in tableData) {
                if (field === tableData[key].fieldName) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                delete scrub[field];
                if (DEBUG) {
                    // console.log("Scrub - Deleted field: " + field);
                }
            }
        }

    }, function (reason) {
        handleError(reason, "Unable to scrub object: " + name);
    });
}

/* Taken from: http://www.movable-type.co.uk/scripts/latlong.html
 *
 * This uses the ‘haversine’ formula to calculate the great-circle distance between
 * two points – that is, the shortest distance over the earth’s surface – giving an
 * ‘as-the-crow-flies’ distance between the points (ignoring any hills they fly
 * over, of course!).
 *
 * Haversine
 * formula:	a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
 * c = 2 ⋅ atan2( √a, √(1−a) )
 * d = R ⋅ c
 * where φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
 * note that angles need to be in radians to pass to trig functions!
 *
 */
var METERS_PER_MILE = 1609.34;

function Location(latitude, longitude) {
    this.latitude = Number(latitude);
    this.longitude = Number(longitude);
}

function calculateDistance(locationA, locationB) {

    if (!(locationA instanceof Location) || !(locationB instanceof Location)) {
        return -1;
    }

    var R = 6371e3; // metres

    var φ1 = locationA.latitude * Math.PI / 180;
    var φ2 = locationB.latitude * Math.PI / 180;

    var Δφ = (locationB.latitude - locationA.latitude) * Math.PI / 180;
    var Δλ = (locationB.longitude - locationA.longitude) * Math.PI / 180;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return Number(d / METERS_PER_MILE).toFixed(2);
}

function isValidJSObject(objectToValidate) {
    return objectToValidate !== undefined && objectToValidate !== null;
}

function setFocus(elementIdentity,selectOnFocus,selectorPrefix,elementPositionIndex){
    try {

        var selector = '#';
        if (selectorPrefix !== undefined) {
            selector = selectorPrefix;
        }
        selector = selector + elementIdentity;

        var selectorElement = jQuery(selector);
        if (elementPositionIndex !== undefined && isNaN(elementPositionIndex) === false) {
            selectorElement = selectorElement[elementPositionIndex];
        }

        if(selectorElement.focus !== undefined) {
            selectorElement.focus();
            if (selectOnFocus !== undefined && selectOnFocus === true) {
                selectorElement.select();
            }
        }
    }catch (reason){

    }
}

// sync between cookie and DB to persist favorite locations
function getHost() {
    var ATS_URL = "https://atscore.app.x-cloud.io";
    var ATS_INSTANCE = '/ats-v2';
    if (_XC_CONFIG) {
        if (_XC_CONFIG.env === 'stg') {
            ATS_URL = "https://pub-cert-atscore.app.x-cloud.io";
        }
        else if (_XC_CONFIG.env === 'dev') {
            ATS_URL = "https://dev-atscore.app.x-cloud.io";
        }
    }
    return ATS_URL + ATS_INSTANCE;
}

function getFavoriteLocationsInCookie() {
    //returns the array of favorite location objects from cookie
    var name = 'location_favorite';
    var decodedCookie = document.cookie;
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            var x =c.substring(name.length+1, c.length);
            return JSON.parse(x);
        }
    }
    return [];
}

function syncFavoriteLocations() {
    try{
        var cookieData = getFavoriteLocationsInCookie();
        if(cookieData.length > 0){
            if (localStorage.getItem('xcloud.credentials') !== null) {
                var credentials = JSON.parse(decodeURIComponent(atob(JSON.parse(localStorage.getItem('xcloud.credentials')).data)));
                var host = getHost();
                var token = 'Basic ' + btoa(encodeURIComponent('candidate/' + _XC_CONFIG.org + '/' + credentials.username + ':' + credentials.password));
                var ajaxURLCurrent = host + '/rest/private/candidate/' + _XC_CONFIG.org + '/current';
                jQuery.ajax(ajaxURLCurrent, {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    success   : function (candidateObj) {
                        var caId = candidateObj.candidateId;
                        if(caId){
                            for(var i = 0; i <cookieData.length; i++) {
                                cookieData[i].candidateId = caId;
                                var ajaxURL_Add = host + '/rest/private/candidate/' + _XC_CONFIG.org + '/savesearch/add';
                                jQuery.ajax(ajaxURL_Add, {
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader("Authorization", token);
                                    },
                                    headers   : {
                                        'Accept'      : 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    data      : JSON.stringify(cookieData[i]),
                                    // data      : data,
                                    datatype  : 'json',
                                    method    : "PUT",
                                    success   : function (data) {
                                    },
                                    error     : function (e) {
                                        console.log(e);
                                    }
                                });
                            }
                            document.cookie = "location_favorite =" + JSON.stringify([]) + ";" + 0 +";path=/";
                        }
                    }, error  : function (e) {
                        console.log(e);
                    }
                });
            }
        }
    }catch (e) {
        console.log(e);
    }
}

