/**
 * Created by TDadam on 4/5/2018.
 */
(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('onBoardingViewModelService', onBoardingViewModelService);

    onBoardingViewModelService.$inject = ['$q', '$log', 'schemaFormGroupInterpolation', 'schemaModalService', 'ApplicationState', 'privateOnboarding', 'authService', 'privateCandidate'];

    function onBoardingViewModelService($q, $log, schemaFormGroupInterpolation, schemaModalService, ApplicationState, privateOnboarding, authService, privateCandidate) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            get             : getViewModel,
            set             : prepareViewModel,
            getSkeleton     : getSkeleton,
            openFormInModal : openForm,
            showProgressBar : showProgressBar,
            updateFormStatus: updateFormStatus
        };
        return service;

        function getSkeleton() {
            return {
                fromGroups : [],
                requisition: {}
            }
        }

        function getViewModel() {
            return service.vm;
        }

        function prepareViewModel(semaphoreCollection, successCallback, errorCallBack) {
            service.successCallback = successCallback;
            service.errorCallBack = errorCallBack;
            schemaFormGroupInterpolation.submit(getOnboardingMetadata, semaphoreCollection, onInterpolationSuccess)
        }

        function onInterpolationSuccess(onBoardingForms) {
            service.vm = {
                onBoarding: onBoardingForms
            };
            service.successCallback(service.vm);
        }

        function getOnboardingMetadata() {
            try {
                var candidateId;
                var deferred = $q.defer();
                if (authService.isLoggedIn) {
                    privateCandidate.getCurrentCandidate().$promise
                        .then(function (result) {
                            //var applyCandidate = normalize(result);
                            candidateId = result.candidateId;
                            var payload = {
                                candidateId: candidateId
                            };
                            var data = {
                                "applicationId" : 631145,
                                "requisitionMap": {
                                    "requisitionId"   : 38034,
                                    "requisitionTitle": "CMA-Assisted Living/Memory Care"
                                },
                                "formGroups"    : [
                                    {
                                        "form": {
                                            "fieldGroups": [
                                                {
                                                    "formMetaData"  : [
                                                        {
                                                            "lookUpCollections": [
                                                                "yn"
                                                            ]
                                                        },
                                                        {
                                                            "XCloudDefinition": {
                                                                // "gridConfiguration"   : {
                                                                //     "minRowCount" : 1,
                                                                //     "maxRowCount" : 3,
                                                                //     "headerFields": [
                                                                //         "firstName",
                                                                //         "eligible",
                                                                //         "areaInterest"
                                                                //     ],
                                                                //     "enabled"     : true
                                                                // },
                                                                "glyphIcon"           : "glyphicon glyphicon-user",
                                                                //"gridViewStyle"       : 0,
                                                                "conditional"         : [],
                                                                "progressBarIsEnabled": false,
                                                                "viewStyle"           : 1,
                                                                "formTitle"           : "Ashfaque Form",
                                                                "tableMap"            : [
                                                                    {
                                                                        "name"  : "candidate",
                                                                        "fields": [
                                                                            "firstName",
                                                                            "maidenName",
                                                                            "lastName",
                                                                            "eligible",
                                                                            "areaInterest"
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            "type"    : "template",
                                                            "template": "<h3 class=\"modal-title text-center\" id=\"formGroupHeader\">W-9<\/h3>\r\n<p class=\"bordered-bottom-1 bordered-gray text-center\" id=\"formGroupSubHeader\">Employee Information and Attestation (Employees must complete and sign Section 1 of Form I-9 no later than the first day of employment, but not before accepting a job offer.)<\/p>"
                                                        },
                                                        {
                                                            "xcloudType": "template"
                                                        },
                                                        {
                                                            "htmlClass": "row",
                                                            "type"     : "section",
                                                            "items"    : [
                                                                {
                                                                    "htmlClass": "col-sm-6",
                                                                    "type"     : "section",
                                                                    "items"    : [
                                                                        {
                                                                            "controlType"      : "textbox",
                                                                            "key"              : "firstName",
                                                                            "required"         : true,
                                                                            "validationMessage": {
                                                                                "302": "First Name is required"
                                                                            }
                                                                        },
                                                                        {
                                                                            "controlType": "textbox",
                                                                            "key"        : "maidenName",
                                                                            "required"   : false
                                                                        },
                                                                        {
                                                                            "controlType": "textbox",
                                                                            "key"        : "lastName",
                                                                            "required"   : false
                                                                        },
                                                                        {
                                                                            "controlType": "radio",
                                                                            "titleMap"   : "yn",
                                                                            "key"        : "eligible",
                                                                            "required"   : false
                                                                        },
                                                                        {
                                                                            "controlType"      : "textbox",
                                                                            "key"              : "areaInterest",
                                                                            "required"         : true,
                                                                            "validationMessage": {
                                                                                "302": "Area of Interest is required"
                                                                            }
                                                                        },
                                                                        {
                                                                            "condition": "(editModel === false)",
                                                                            "items"    : [
                                                                                {
                                                                                    "items": [
                                                                                        {
                                                                                            "onClick": "showPreviousForm()",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "< Back",
                                                                                            "type"   : "button"
                                                                                        },
                                                                                        {
                                                                                            "onClick": "submitForm(ngForm,\"candidate\")",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "Continue",
                                                                                            "type"   : "button"
                                                                                        }
                                                                                    ],
                                                                                    "type" : "actions"
                                                                                }
                                                                            ],
                                                                            "type"     : "conditional"
                                                                        },
                                                                        {
                                                                            "condition": "(editModel === true)",
                                                                            "items"    : [
                                                                                {
                                                                                    "items": [
                                                                                        {
                                                                                            "onClick": "showPreviousForm()",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "< Back",
                                                                                            "type"   : "button"
                                                                                        },
                                                                                        {
                                                                                            "onClick": "updateForm(ngForm,\"candidate\")",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "Continue",
                                                                                            "type"   : "button"
                                                                                        }
                                                                                    ],
                                                                                    "type" : "actions"
                                                                                }
                                                                            ],
                                                                            "type"     : "conditional"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "htmlClass": "col-sm-6",
                                                                    "type"     : "section",
                                                                    "items"    : []
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "id"            : 44,
                                                    "schemaMetaData": {
                                                        "type"      : "object",
                                                        "properties": {
                                                            "firstName"   : {
                                                                //"validator":"string",
                                                                "title"    : "First Name",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "maidenName"  : {
                                                                //"validator":"string",
                                                                "title"    : "Maiden Name",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "lastName"    : {
                                                                //"validator":"string",
                                                                "title"    : "Last Name",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "eligible"    : {
                                                                //"validator":"string",
                                                                "title"    : "Eligible",
                                                                "type"     : "string",
                                                                "maxLength": 512
                                                            },
                                                            "areaInterest": {
                                                                //"validator":"string",
                                                                "title"    : "what are you passionate about outside of work",
                                                                "type"     : "string",
                                                                "maxlength": 124
                                                            }
                                                        }
                                                    }
                                                }
                                            ],
                                            "dueDate"    : "06-26-2018",
                                            "id"         : 52,
                                            "title"      : "Ashfaque Form",
                                            "type"       : "3",
                                            "status"     : "pending"
                                        }
                                    }
                                ]
                            };
                            var tiruData = {
                                "requisition": {
                                    "id"   : 40879,
                                    "title": "Reservation Agent"
                                },
                                "formGroups" : [
                                    {
                                        "form": {
                                            "id"         : 1,
                                            "title"      : "W-9",
                                            "dueDate"    : "10/03/2018",
                                            "status"     : "Pending",
                                            "type"       : 3,
                                            "fieldGroups": [
                                                {
                                                    "id"            : 1,
                                                    "schemaMetaData": {
                                                        "properties": {
                                                            "firstName"  : {
                                                                "title"    : "First Name (Given Name)",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "lastName"   : {
                                                                "title"    : "Last Name (Family Name)",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "middleName" : {
                                                                "title"    : "Middle Initial",
                                                                "type"     : "string",
                                                                "maxLength": 1
                                                            },
                                                            "otherName"  : {
                                                                "title"    : "Other Last Names Used(if any)",
                                                                "type"     : "string",
                                                                "maxLength": 128
                                                            },
                                                            "address1"   : {
                                                                "title"    : "Address (Street Number and Name)",
                                                                "type"     : "string",
                                                                "maxLength": 128
                                                            },
                                                            "string128_1": {
                                                                "title"    : "Apt. Number",
                                                                "type"     : "string",
                                                                "maxLength": 128
                                                            },
                                                            "city"       : {
                                                                "title"    : "City or Town",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "state"      : {
                                                                "title": "State",
                                                                "type" : "string"
                                                            },
                                                            "zip"        : {
                                                                "title": "Zip Code",
                                                                "type" : "string"
                                                            },
                                                            "dob"        : {
                                                                "title": "Date of Birth (mm/dd/yyyy)",
                                                                "type" : "string"
                                                            },
                                                            "ssn"        : {
                                                                "title": "U.S. Social Security Number(Mandatory to provide if you have SSN)",
                                                                "type" : "string"
                                                            },
                                                            "email"      : {
                                                                "title"    : "Employee's E-mail Address",
                                                                "type"     : "string",
                                                                "maxLength": 70
                                                            },
                                                            "phone1"     : {
                                                                "title"    : "Employee's Telephone Number",
                                                                "maxLength": 15,
                                                                "type"     : "string"
                                                            },
                                                            "string64_1" : {
                                                                "title"  : "I attest, under penalty of perjury, that I am (check one of the following):",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_2" : {
                                                                "title"  : "My Green Card (Permanent Resident Card) has an : ",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_3" : {
                                                                "title"      : "Alien Registration Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_4" : {
                                                                "title"      : "USCIS Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_5" : {
                                                                "title"  : "Aliens authorized to work must provide only one of the following document numbers to complete Form I-9:",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_6" : {
                                                                "title"  : "My Green Card (Permanent Resident Card) has an : ",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_7" : {
                                                                "title"      : "Alien Registration Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_8" : {
                                                                "title"      : "USCIS Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_9" : {
                                                                "title"      : "Form I-94 Admission Number:",
                                                                "type"       : "string"
                                                                , "maxLength": 64
                                                            },
                                                            "string64_10": {
                                                                "title"      : "Foreign Passport Number:",
                                                                "type"       : "string"
                                                                , "maxLength": 64
                                                            },
                                                            "string64_11": {
                                                                "title"      : "Country of Issuance:",
                                                                "type"       : "string"
                                                                , "maxLength": 64
                                                            },
                                                            "signature"  : {
                                                                "title": "Signature of Employee",
                                                                "type" : "string"
                                                            },
                                                            "date_1"     : {
                                                                "title" : " ",
                                                                "type"  : "string",
                                                                "format": "date"
                                                            }
                                                        },
                                                        "type"      : "object"
                                                    },
                                                    "formMetaData"  : [
                                                        {
                                                            "lookUpCollections": ["state", "penaltyOfPerjury", "ResidentCardTypes", "AliensauthorizedDocument"]
                                                        },
                                                        {
                                                            "XCloudDefinition": {
                                                                "formTitle"           : "EmployeeInformationandAttestation",
                                                                "glyphIcon"           : "glyphicon glyphicon-user",
                                                                "gridConfiguration"   : {},
                                                                "progressBarIsEnabled": false,
                                                                "tableMap"            : [{
                                                                    "name"  : "candidate",
                                                                    "fields": ["firstName", "lastName", "middleName", "otherName", "address1", "string128_1", "city",
                                                                        "State", "zip", "dob", "ssn", "email", "phone1", "string64_1", "string64_2", "string64_3", "string64_4",
                                                                        "string64_5", "string64_6", "string64_7", "string64_8", "string64_9", "string64_10", "string64_11", "string64_12",
                                                                        "signature", "date_1"]
                                                                }],
                                                                "viewStyle"           : 3
                                                            }
                                                        },
                                                        {
                                                            "type"    : "template",
                                                            "template": "<h3 class=\"modal-title text-center\" id=\"formGroupHeader\">W-911<\/h3>\r\n<p class=\"bordered-bottom-1 bordered-gray text-center\" id=\"formGroupSubHeader\">Employee Information and Attestation (Employees must complete and sign Section 1 of Form I-9 no later than the first day of employment, but not before accepting a job offer.)<\/p>"
                                                        },
                                                        {
                                                            "xcloudtType": "template"
                                                        },
                                                        {
                                                            "htmlClass": "row",
                                                            "items"    : [
                                                                {
                                                                    "htmlClass": "col-sm-6",
                                                                    "items"    : [
                                                                        {
                                                                            "key"        : "firstName",
                                                                            "required"   : true,
                                                                            "placeholder": "Eg, Smith"
                                                                        },
                                                                        {
                                                                            "key"        : "lastName",
                                                                            "required"   : true,
                                                                            "placeholder": "Eg, John"
                                                                        },
                                                                        {
                                                                            "key": "middleName"
                                                                        },
                                                                        {
                                                                            "key"        : "otherName",
                                                                            "placeholder": "Separate Last Names with commas"
                                                                        },
                                                                        {
                                                                            "key"     : "address1",
                                                                            "required": true,
                                                                            "type"    : "textarea"
                                                                        },
                                                                        {
                                                                            "key": "string128_1"
                                                                        },
                                                                        {
                                                                            "key"     : "city",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "state",
                                                                            "type"    : "select",
                                                                            "required": true,
                                                                            "titleMap": "state"
                                                                        },
                                                                        {
                                                                            "key"     : "zip",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "dob",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key": "ssn"
                                                                        },
                                                                        {
                                                                            "key": "email"
                                                                        },
                                                                        {
                                                                            "key": "phone1"
                                                                        },
                                                                        {
                                                                            "type"    : "template",
                                                                            "template": "<p class=\"bordered-bottom-1 bordered-gray text-left\" id=\"formGroupSubHeader\">I am aware that federal law provides for imprisonment and\/or fines for false statements or use of false documents in\r\nconnection with the completion of this form.<\/p>"
                                                                        },
                                                                        {
                                                                            "key"     : "string64_1",
                                                                            "type"    : "select",
                                                                            "required": true,
                                                                            "titleMap": "penaltyOfPerjury"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_2",
                                                                            "condition": "model.string64_1 === 'A lawful permanent resident'",
                                                                            "type"     : "select",
                                                                            "titleMap" : "ResidentCardTypes"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_3",
                                                                            "condition": "model.string64_2 === 'Alien Registration Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"      : "string64_4",
                                                                            "condition": "model.string64_2 === 'USCIS Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"      : "string64_5",
                                                                            "condition": "model.string64_1 === 'An alien authorized to work'",
                                                                            "type"     : "select",
                                                                            "required" : true,
                                                                            "titleMap" : "AliensauthorizedDocument"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_6",
                                                                            "condition": "model.string64_5 === 'Alien Registration Number/USCIS Number'",
                                                                            "type"     : "select",
                                                                            "titleMap" : "ResidentCardTypes"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_7",
                                                                            "condition": "model.string64_6 === 'Alien Registration Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"      : "string64_8",
                                                                            "condition": "model.string64_6 === 'USCIS Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"     : "string64_9",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "string64_10",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "string64_11",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "signature",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "format"           : "yyyy-mm-dd",
                                                                            "key"              : "date_1",
                                                                            "required"         : true,
                                                                            "selectMonths"     : true,
                                                                            "selectYears"      : 1,
                                                                            "type"             : "datepicker",
                                                                            "minDate"          : "new Date()",
                                                                            "maxDate"          : "new Date()",
                                                                            "validationMessage": {
                                                                                "default": "End Date is required."
                                                                            }
                                                                        },
                                                                        {
                                                                            "condition": "(editModel === false)",
                                                                            "items"    : [
                                                                                {
                                                                                    "items": [
                                                                                        {
                                                                                            "onClick": "showPreviousForm()",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "< Back",
                                                                                            "type"   : "button"
                                                                                        },
                                                                                        {
                                                                                            "onClick": "submitForm(ngForm,\"candidate\")",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "Continue",
                                                                                            "type"   : "button"
                                                                                        }
                                                                                    ],
                                                                                    "type" : "actions"
                                                                                }
                                                                            ],
                                                                            "type"     : "conditional"
                                                                        },
                                                                        {
                                                                            "condition": "(editModel === true)",
                                                                            "items"    : [
                                                                                {
                                                                                    "items": [
                                                                                        {
                                                                                            "onClick": "showPreviousForm()",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "< Back",
                                                                                            "type"   : "button"
                                                                                        },
                                                                                        {
                                                                                            "onClick": "updateForm(ngForm,\"candidate\")",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "Continue",
                                                                                            "type"   : "button"
                                                                                        }
                                                                                    ],
                                                                                    "type" : "actions"
                                                                                }
                                                                            ],
                                                                            "type"     : "conditional"
                                                                        }
                                                                    ],
                                                                    "type"     : "section"
                                                                },
                                                                {
                                                                    "htmlClass": "col-sm-6",
                                                                    "items"    : [],
                                                                    "type"     : "section"
                                                                }
                                                            ],
                                                            "type"     : "section"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id"            : 2,
                                                    "schemaMetaData": {
                                                        "type"      : "object",
                                                        "properties": {
                                                            "company"     : {
                                                                "title"      : "Company",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "maxLength"  : 80
                                                            },
                                                            "title"       : {
                                                                "title"      : "Title",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "maxLength"  : 50
                                                            },
                                                            "managerName" : {
                                                                "title"      : "Manager Name",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "maxlength"  : 50
                                                            },
                                                            "managerPhone": {
                                                                "title"      : "Manager Phone",
                                                                "controlType": "textbox",
                                                                "type"       : "string"
                                                            },
                                                            "description" : {
                                                                "title"      : "Description",
                                                                "controlType": "textarea",
                                                                "type"       : "string",
                                                                "maxLength"  : 500
                                                            },
                                                            "startDate"   : {
                                                                "title"      : "Start Date",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "pattern"    : "\\d{4}-\\d{2}-\\d{2}",
                                                                "format"     : "date"
                                                            }
                                                        }
                                                    },
                                                    "formMetaData"  : [{
                                                        "lookUpCollections": []
                                                    },
                                                        {
                                                            "XCloudDefinition": {
                                                                "table"            : "work_history",
                                                                "formTitle"        : "Experience",
                                                                "glyphIcon"        : "glyphicon glyphicon-folder-close",
                                                                "gridConfiguration": {
                                                                    "enabled"     : true,
                                                                    "minRowCount" : 0,
                                                                    "maxRowCount" : 4,
                                                                    "headerFields": ["company", "title"],
                                                                    "title"       : "Job Details"
                                                                },
                                                                "tableMap"         : [{
                                                                    "name"  : "work_history",
                                                                    "fields": ["company", "title", "managerName", "managerPhone", "description", "startDate"]
                                                                }]

                                                            }
                                                        },
                                                        {
                                                            "type": "help"
                                                        },
                                                        {
                                                            "xcloudType": "template"
                                                        },
                                                        {
                                                            "type"     : "section",
                                                            "htmlClass": "row",
                                                            "items"    : [{
                                                                "type"     : "section",
                                                                "htmlClass": "col-sm-6",
                                                                "items"    : [{
                                                                    "key"              : "company",
                                                                    "required"         : true,
                                                                    "validationMessage": {
                                                                        "302": "Company Name is required."
                                                                    },
                                                                    "sortOrder"        : 1
                                                                },
                                                                    {
                                                                        "key"              : "title",
                                                                        "required"         : true,
                                                                        "validationMessage": {
                                                                            "302": "Title is required."
                                                                        },
                                                                        "sortOrder"        : 2
                                                                    },
                                                                    {
                                                                        "key"      : "managerName",
                                                                        "required" : false,
                                                                        "sortOrder": 3
                                                                    },
                                                                    {
                                                                        "key"      : "managerPhone",
                                                                        "required" : false,
                                                                        "sortOrder": 4
                                                                    },
                                                                    {
                                                                        "key"              : "description",
                                                                        "type"             : "textarea",
                                                                        "required"         : true,
                                                                        "sortOrder"        : 5,
                                                                        "validationMessage": {
                                                                            "302": "Description is required."
                                                                        }
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowEditMode !== true)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "Add",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "submitForm(ngForm,\"work_history\")"
                                                                            }]
                                                                        }]
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowEditMode === true)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "Cancel",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "cancelRowUpdate(ngForm,\"work_history\")"
                                                                            },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Update",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "updateForm(ngForm,\"work_history\")"
                                                                                }]
                                                                        }]
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowAdded === false)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "< Back",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "showPreviousForm()"
                                                                            },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Skip",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "skipForm(ngForm,\"work_history\")"
                                                                                },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Continue",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "showNextForm(ngForm,\"work_history\")"
                                                                                }]
                                                                        }]
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowAdded === true)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "< Back",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "showPreviousForm()"
                                                                            },
                                                                                {
                                                                                    "type"    : "button",
                                                                                    "readonly": true,
                                                                                    "title"   : "Skip",
                                                                                    "style"   : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick" : "skipForm(ngForm,\"work_history\")"
                                                                                },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Continue",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "showNextForm(ngForm,\"work_history\")"
                                                                                }]
                                                                        }]
                                                                    }]
                                                            },
                                                                {
                                                                    "type"     : "section",
                                                                    "htmlClass": "col-sm-6",
                                                                    "items"    : []
                                                                }]
                                                        }]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "form": {
                                            "id"         : 2,
                                            "title"      : "W-9",
                                            "dueDate"    : "10/03/2018",
                                            "status"     : "Completed",
                                            "type"       : 3,
                                            "fieldGroups": [
                                                {
                                                    "id"            : 3,
                                                    "schemaMetaData": {
                                                        "properties": {
                                                            "firstName"  : {
                                                                "title"    : "First Name (Given Name)",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "lastName"   : {
                                                                "title"    : "Last Name (Family Name)",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "middleName" : {
                                                                "title"    : "Middle Initial",
                                                                "type"     : "string",
                                                                "maxLength": 1
                                                            },
                                                            "otherName"  : {
                                                                "title"    : "Other Last Names Used(if any)",
                                                                "type"     : "string",
                                                                "maxLength": 128
                                                            },
                                                            "address1"   : {
                                                                "title"    : "Address (Street Number and Name)",
                                                                "type"     : "string",
                                                                "maxLength": 128
                                                            },
                                                            "string128_1": {
                                                                "title"    : "Apt. Number",
                                                                "type"     : "string",
                                                                "maxLength": 128
                                                            },
                                                            "city"       : {
                                                                "title"    : "City or Town",
                                                                "type"     : "string",
                                                                "maxLength": 64
                                                            },
                                                            "state"      : {
                                                                "title": "State",
                                                                "type" : "string"
                                                            },
                                                            "zip"        : {
                                                                "title": "Zip Code",
                                                                "type" : "string"
                                                            },
                                                            "dob"        : {
                                                                "title": "Date of Birth (mm/dd/yyyy)",
                                                                "type" : "string"
                                                            },
                                                            "ssn"        : {
                                                                "title": "U.S. Social Security Number(Mandatory to provide if you have SSN)",
                                                                "type" : "string"
                                                            },
                                                            "email"      : {
                                                                "title"    : "Employee's E-mail Address",
                                                                "type"     : "string",
                                                                "maxLength": 70
                                                            },
                                                            "phone1"     : {
                                                                "title"    : "Employee's Telephone Number",
                                                                "maxLength": 15,
                                                                "type"     : "string"
                                                            },
                                                            "string64_1" : {
                                                                "title"  : "I attest, under penalty of perjury, that I am (check one of the following):",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_2" : {
                                                                "title"  : "My Green Card (Permanent Resident Card) has an : ",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_3" : {
                                                                "title"      : "Alien Registration Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_4" : {
                                                                "title"      : "USCIS Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_5" : {
                                                                "title"  : "Aliens authorized to work must provide only one of the following document numbers to complete Form I-9:",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_6" : {
                                                                "title"  : "My Green Card (Permanent Resident Card) has an : ",
                                                                "type"   : "string",
                                                                "default": ""
                                                            },
                                                            "string64_7" : {
                                                                "title"      : "Alien Registration Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_8" : {
                                                                "title"      : "USCIS Number",
                                                                "type"       : "string"
                                                                , "maxLength": 9
                                                            },
                                                            "string64_9" : {
                                                                "title"      : "Form I-94 Admission Number:",
                                                                "type"       : "string"
                                                                , "maxLength": 64
                                                            },
                                                            "string64_10": {
                                                                "title"      : "Foreign Passport Number:",
                                                                "type"       : "string"
                                                                , "maxLength": 64
                                                            },
                                                            "string64_11": {
                                                                "title"      : "Country of Issuance:",
                                                                "type"       : "string"
                                                                , "maxLength": 64
                                                            },
                                                            "signature"  : {
                                                                "title": "Signature of Employee",
                                                                "type" : "string"
                                                            },
                                                            "date_1"     : {
                                                                "title" : " ",
                                                                "type"  : "string",
                                                                "format": "date"
                                                            }
                                                        },
                                                        "type"      : "object"
                                                    },
                                                    "formMetaData"  : [
                                                        {
                                                            "lookUpCollections": ["state", "penaltyOfPerjury", "ResidentCardTypes", "AliensauthorizedDocument"]
                                                        },
                                                        {
                                                            "XCloudDefinition": {
                                                                "formTitle"           : "EmployeeInformationandAttestation",
                                                                "glyphIcon"           : "glyphicon glyphicon-user",
                                                                "gridConfiguration"   : {},
                                                                "progressBarIsEnabled": false,
                                                                "tableMap"            : [{
                                                                    "name"  : "candidate",
                                                                    "fields": ["firstName", "lastName", "middleName", "otherName", "address1", "string128_1", "city",
                                                                        "State", "zip", "dob", "ssn", "email", "phone1", "string64_1", "string64_2", "string64_3", "string64_4",
                                                                        "string64_5", "string64_6", "string64_7", "string64_8", "string64_9", "string64_10", "string64_11", "string64_12",
                                                                        "signature", "date_1"]
                                                                }],
                                                                "viewStyle"           : 3
                                                            }
                                                        },
                                                        {
                                                            "type"    : "template",
                                                            "template": "<h3 class=\"modal-title text-center\" id=\"formGroupHeader\">W-9<\/h3>\r\n<p class=\"bordered-bottom-1 bordered-gray text-center\" id=\"formGroupSubHeader\">Employee Information and Attestation (Employees must complete and sign Section 1 of Form I-9 no later than the first day of employment, but not before accepting a job offer.)<\/p>"
                                                        },
                                                        {
                                                            "xcloudtType": "template"
                                                        },
                                                        {
                                                            "htmlClass": "row",
                                                            "items"    : [
                                                                {
                                                                    "htmlClass": "col-sm-6",
                                                                    "items"    : [
                                                                        {
                                                                            "key"        : "firstName",
                                                                            "required"   : true,
                                                                            "placeholder": "Eg, Smith"
                                                                        },
                                                                        {
                                                                            "key"        : "lastName",
                                                                            "required"   : true,
                                                                            "placeholder": "Eg, John"
                                                                        },
                                                                        {
                                                                            "key": "middleName"
                                                                        },
                                                                        {
                                                                            "key"        : "otherName",
                                                                            "placeholder": "Separate Last Names with commas"
                                                                        },
                                                                        {
                                                                            "key"     : "address1",
                                                                            "required": true,
                                                                            "type"    : "textarea"
                                                                        },
                                                                        {
                                                                            "key": "string128_1"
                                                                        },
                                                                        {
                                                                            "key"     : "city",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "state",
                                                                            "type"    : "select",
                                                                            "required": true,
                                                                            "titleMap": "state"
                                                                        },
                                                                        {
                                                                            "key"     : "zip",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "dob",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key": "ssn"
                                                                        },
                                                                        {
                                                                            "key": "email"
                                                                        },
                                                                        {
                                                                            "key": "phone1"
                                                                        },
                                                                        {
                                                                            "type"    : "template",
                                                                            "template": "<p class=\"bordered-bottom-1 bordered-gray text-left\" id=\"formGroupSubHeader\">I am aware that federal law provides for imprisonment and\/or fines for false statements or use of false documents in\r\nconnection with the completion of this form.<\/p>"
                                                                        },
                                                                        {
                                                                            "key"     : "string64_1",
                                                                            "type"    : "select",
                                                                            "required": true,
                                                                            "titleMap": "penaltyOfPerjury"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_2",
                                                                            "condition": "model.string64_1 === 'A lawful permanent resident'",
                                                                            "type"     : "select",
                                                                            "titleMap" : "ResidentCardTypes"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_3",
                                                                            "condition": "model.string64_2 === 'Alien Registration Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"      : "string64_4",
                                                                            "condition": "model.string64_2 === 'USCIS Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"      : "string64_5",
                                                                            "condition": "model.string64_1 === 'An alien authorized to work'",
                                                                            "type"     : "select",
                                                                            "required" : true,
                                                                            "titleMap" : "AliensauthorizedDocument"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_6",
                                                                            "condition": "model.string64_5 === 'Alien Registration Number/USCIS Number'",
                                                                            "type"     : "select",
                                                                            "titleMap" : "ResidentCardTypes"
                                                                        },
                                                                        {
                                                                            "key"      : "string64_7",
                                                                            "condition": "model.string64_6 === 'Alien Registration Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"      : "string64_8",
                                                                            "condition": "model.string64_6 === 'USCIS Number'",
                                                                            "required" : true
                                                                        },
                                                                        {
                                                                            "key"     : "string64_9",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "string64_10",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "string64_11",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "key"     : "signature",
                                                                            "required": true
                                                                        },
                                                                        {
                                                                            "format"           : "yyyy-mm-dd",
                                                                            "key"              : "date_1",
                                                                            "required"         : true,
                                                                            "selectMonths"     : true,
                                                                            "selectYears"      : 1,
                                                                            "type"             : "datepicker",
                                                                            "minDate"          : "new Date()",
                                                                            "maxDate"          : "new Date()",
                                                                            "validationMessage": {
                                                                                "default": "End Date is required."
                                                                            }
                                                                        },
                                                                        {
                                                                            "condition": "(editModel === false)",
                                                                            "items"    : [
                                                                                {
                                                                                    "items": [
                                                                                        {
                                                                                            "onClick": "showPreviousForm()",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "< Back",
                                                                                            "type"   : "button"
                                                                                        },
                                                                                        {
                                                                                            "onClick": "submitForm(ngForm,\"candidate\")",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "Continue",
                                                                                            "type"   : "button"
                                                                                        }
                                                                                    ],
                                                                                    "type" : "actions"
                                                                                }
                                                                            ],
                                                                            "type"     : "conditional"
                                                                        },
                                                                        {
                                                                            "condition": "(editModel === true)",
                                                                            "items"    : [
                                                                                {
                                                                                    "items": [
                                                                                        {
                                                                                            "onClick": "showPreviousForm()",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "< Back",
                                                                                            "type"   : "button"
                                                                                        },
                                                                                        {
                                                                                            "onClick": "updateForm(ngForm,\"candidate\")",
                                                                                            "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                            "title"  : "Continue",
                                                                                            "type"   : "button"
                                                                                        }
                                                                                    ],
                                                                                    "type" : "actions"
                                                                                }
                                                                            ],
                                                                            "type"     : "conditional"
                                                                        }
                                                                    ],
                                                                    "type"     : "section"
                                                                },
                                                                {
                                                                    "htmlClass": "col-sm-6",
                                                                    "items"    : [],
                                                                    "type"     : "section"
                                                                }
                                                            ],
                                                            "type"     : "section"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id"            : 4,
                                                    "schemaMetaData": {
                                                        "type"      : "object",
                                                        "properties": {
                                                            "company"     : {
                                                                "title"      : "Company",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "maxLength"  : 80
                                                            },
                                                            "title"       : {
                                                                "title"      : "Title",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "maxLength"  : 50
                                                            },
                                                            "managerName" : {
                                                                "title"      : "Manager Name",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "maxlength"  : 50
                                                            },
                                                            "managerPhone": {
                                                                "title"      : "Manager Phone",
                                                                "controlType": "textbox",
                                                                "type"       : "string"
                                                            },
                                                            "description" : {
                                                                "title"      : "Description",
                                                                "controlType": "textarea",
                                                                "type"       : "string",
                                                                "maxLength"  : 500
                                                            },
                                                            "startDate"   : {
                                                                "title"      : "Start Date",
                                                                "controlType": "textbox",
                                                                "type"       : "string",
                                                                "pattern"    : "\\d{4}-\\d{2}-\\d{2}",
                                                                "format"     : "date"
                                                            }
                                                        }
                                                    },
                                                    "formMetaData"  : [{
                                                        "lookUpCollections": []
                                                    },
                                                        {
                                                            "XCloudDefinition": {
                                                                "table"            : "work_history",
                                                                "formTitle"        : "Experience",
                                                                "glyphIcon"        : "glyphicon glyphicon-folder-close",
                                                                "gridConfiguration": {
                                                                    "enabled"     : true,
                                                                    "minRowCount" : 0,
                                                                    "maxRowCount" : 4,
                                                                    "headerFields": ["company", "title"],
                                                                    "title"       : "Job Details"
                                                                },
                                                                "tableMap"         : [{
                                                                    "name"  : "work_history",
                                                                    "fields": ["company", "title", "managerName", "managerPhone", "description", "startDate"]
                                                                }]

                                                            }
                                                        },
                                                        {
                                                            "type": "help"
                                                        },
                                                        {
                                                            "xcloudType": "template"
                                                        },
                                                        {
                                                            "type"     : "section",
                                                            "htmlClass": "row",
                                                            "items"    : [{
                                                                "type"     : "section",
                                                                "htmlClass": "col-sm-6",
                                                                "items"    : [{
                                                                    "key"              : "company",
                                                                    "required"         : true,
                                                                    "validationMessage": {
                                                                        "302": "Company Name is required."
                                                                    },
                                                                    "sortOrder"        : 1
                                                                },
                                                                    {
                                                                        "key"              : "title",
                                                                        "required"         : true,
                                                                        "validationMessage": {
                                                                            "302": "Title is required."
                                                                        },
                                                                        "sortOrder"        : 2
                                                                    },
                                                                    {
                                                                        "key"      : "managerName",
                                                                        "required" : false,
                                                                        "sortOrder": 3
                                                                    },
                                                                    {
                                                                        "key"      : "managerPhone",
                                                                        "required" : false,
                                                                        "sortOrder": 4
                                                                    },
                                                                    {
                                                                        "key"              : "description",
                                                                        "type"             : "textarea",
                                                                        "required"         : true,
                                                                        "sortOrder"        : 5,
                                                                        "validationMessage": {
                                                                            "302": "Description is required."
                                                                        }
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowEditMode !== true)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "Add",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "submitForm(ngForm,\"work_history\")"
                                                                            }]
                                                                        }]
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowEditMode === true)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "Cancel",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "cancelRowUpdate(ngForm,\"work_history\")"
                                                                            },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Update",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "updateForm(ngForm,\"work_history\")"
                                                                                }]
                                                                        }]
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowAdded === false)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "< Back",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "showPreviousForm()"
                                                                            },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Skip",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "skipForm(ngForm,\"work_history\")"
                                                                                },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Continue",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "showNextForm(ngForm,\"work_history\")"
                                                                                }]
                                                                        }]
                                                                    },
                                                                    {
                                                                        "type"     : "conditional",
                                                                        "condition": "(rowAdded === true)",
                                                                        "items"    : [{
                                                                            "type" : "actions",
                                                                            "items": [{
                                                                                "type"   : "button",
                                                                                "title"  : "< Back",
                                                                                "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                "onClick": "showPreviousForm()"
                                                                            },
                                                                                {
                                                                                    "type"    : "button",
                                                                                    "readonly": true,
                                                                                    "title"   : "Skip",
                                                                                    "style"   : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick" : "skipForm(ngForm,\"work_history\")"
                                                                                },
                                                                                {
                                                                                    "type"   : "button",
                                                                                    "title"  : "Continue",
                                                                                    "style"  : "btn btn-azure w-btn style_raised color_primary size_medium margin-bottom-5 margin-right-5",
                                                                                    "onClick": "showNextForm(ngForm,\"work_history\")"
                                                                                }]
                                                                        }]
                                                                    }]
                                                            },
                                                                {
                                                                    "type"     : "section",
                                                                    "htmlClass": "col-sm-6",
                                                                    "items"    : []
                                                                }]
                                                        }]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            };
                            deferred.resolve(data);


                            //original call to get onboarding form from database
                            // privateOnboarding.getOnboardingFormJSON(payload).$promise
                            //     .then(function(data){
                            //         deferred.resolve(data)
                            //     });
                        });
                    return deferred.promise;
                }

            }
            catch (reason) {
                console.log(reason)
            }


        }

        function openForm(form, callback, dismissCallBack) {
            var _template = '/wp-content/plugins/xcloud/app/components/onboarding/onboarding-form.html';
            var _controller = 'onBoardingModalFormController';
            form.style = form.style || {};
            if (form.style.windowClass) {
                form.style.windowClass = 'schema-modal-popup';
            }
            schemaModalService.open(form, _template, _controller, callback, dismissCallBack)
        }

        function updateFormStatus(state, index) {
            if (service.vm && service.vm.onBoarding) {
                if (service.vm.onBoarding.formGroups[index].form) {
                    service.vm.onBoarding.formGroups[index].form.status = state;
                }
            }
            return service.vm;
        }

        function showProgressBar(enabled) {
            ApplicationState.uiMethods.showProgressBar(enabled, false, '#onBoarding-Loader')
        }
    }

}());

