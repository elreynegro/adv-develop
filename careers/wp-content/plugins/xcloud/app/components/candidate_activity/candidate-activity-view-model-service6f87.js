/**
 * Created by shanjock 4/19/2018
 */

(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('candidateActivityViewModelService', candidateActivityViewModelService);

    candidateActivityViewModelService.$inject = ['$q', '$log', '$sce', '$filter', '$rootScope', 'privateCandidate', 'ApplicationState', 'tableManagementService', 'authService', 'privateTransactionLog'];


    function candidateActivityViewModelService($q, $log, $sce, $filter, $rootScope, privateCandidate, ApplicationState, tableManagementService, authService, privateTransactionLog) {

        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var vm = getVMSkeleton();

        var activityDirectives = {
            'edit'        : " class='ml1 boldfont' ng-class=activeTab('edit') ng-click=nav.switchTabs('edit',$event)",
            'preferences' : " class='ml1 boldfont' ng-class=activeTab('preferences',true) ng-click=nav.switchTabs('preferences',$event)",
            'applications': " class='ml1 boldfont' ng-class=activeTab('applications') ng-click=nav.switchTabs('applications',$event)",
            'todos'       : " class='ml1 boldfont' ng-class=activeTab('todos') ng-click=nav.switchTabs('todos',$event)",
            // Interviews and onboarding  related activities are yet to implement
            'interviews'  : " class='ml1 boldfont' ng-class=activeTab('interviews',true) ng-click=nav.switchTabs('interviews',$event)",
            'onboarding'  : " class='ml1 boldfont' ng-class=activeTab('onboarding',true) ng-click=nav.switchTabs('onboarding',$event)",
            'assessments' : " class='ml1 boldfont' ng-class=activeTab('assessments',true) ng-click=nav.switchTabs('assessments',$event)"
        };

        var nonVM = {
            candidate_activity: {},
            activeRequest     : false
        };

        var service = {
            nonVM                   : nonVM,
            getViewModel            : getViewModel,
            getVMSkeleton           : getVMSkeleton,
            addTransactionLog       : addTransactionLog,
            getCandidateActivities  : getCandidateActivities,
            filterCandidateActivity : filterCandidateActivity,
            addCandidateActivity    : addCandidateActivity,
            updateCandidateActivity : updateCandidateActivity,
            checkCandidatePreference: checkCandidatePreference,
            multipleCallLock        : multipleCallLock,
            multipleCallUnlock      : multipleCallUnlock,
            getTextChanges          : getTextChanges
        };
        return service;

        function getTextChanges(activity) {
            var tabMatch = activity.match(/href='\/profile|\/[a-z]+|\/[0-9]+/g);
            var idMatch = activity.match(/\/[0-9]+/g);
            var id;
            if (tabMatch) {
                var tab = tabMatch[1].slice(1);
                if (tab in activityDirectives) {
                    activity = activity.replace("class='action'", activityDirectives[tab]);
                } else {
                    if(idMatch !== null && idMatch !== undefined) {
                        id = idMatch[0].slice(1);
                        activity = activity.replace("class='action'", "class='ml1 boldfont' ng-class=activeTab('offers',true) ng-click=nav.switchTabs('offers',$event)" + ";" + "goToOffer(" + id + ")");
                    }
                }
            }
            return activity;
        }

        function getVMSkeleton() {
            return {
                activity                         : {},
                activity_notifications           : {},
                activityNotificationsWidgetConfig: typeof(_XCC_CA_CONFIG) !== 'undefined' ? _XCC_CA_CONFIG : {},
                preferenceNotification           : false,
                isShowComponent                  : true,
                isLoggedIn                       : authService.isLoggedIn
            }
        }

        function getViewModel(forcePull, candidateObj) {
            var deferred = $q.defer();
            if (forcePull === true || angular.equals(vm, getVMSkeleton())) {
                return getCandidateActivities(candidateObj);
            } else {
                deferred.resolve(vm);
            }
            return deferred.promise;
        }

        function addTransactionLog(params, value, candidateObj) {
            var deferred = $q.defer();
            privateTransactionLog.addEntryByCandidateId(params, value).$promise.then(function (result) {
                $rootScope.$broadcast(BROAD_CAST_NAMESPACE.GET_CANDIDATE_ACTIVITY, true, candidateObj);
            }, function (reason) {
                logger.error(reason);
                jQuery('.loading-container').css('display', 'none');
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function getCandidateActivities(candidateObj) {
            var deferred = $q.defer();
            try {
                candidateObj = candidateIdResolver(candidateObj);
                if (candidateObj) {
                    if (!nonVM.activeRequest) {
                        multipleCallLock();
                        privateCandidate.getAllCandidateActivities({candidateId: candidateObj.candidateId}).$promise.then(function (result) {
                            nonVM.candidate_activity = normalizeObjects(result);
                            nonVM.candidate_activity = $filter('filter')(nonVM.candidate_activity, {status: "!removed"});
                            vm.activity_notifications = angular.copy($filter('filter')(nonVM.candidate_activity, {
                                status: "!completed",
                                type  : "notification"
                            }).reverse());
                            for (var key1 in vm.activity_notifications) {
                                var current_notification = vm.activity_notifications[key1];
                                current_notification.activityData = current_notification.activityData.replace(" on [created_datetime]", "");
                                current_notification.activityData = parse_activity(current_notification.activityData);
                                current_notification.activityData = getTextChanges(current_notification.activityData);
                            }

                            for (var key2 in nonVM.candidate_activity) {
                                var current_activity = nonVM.candidate_activity[key2];
                                current_activity.activityData = parse_activity(current_activity.activityData);
                                current_activity.activityData = getTextChanges(current_activity.activityData);
                                current_activity.activityData = current_activity.activityData.replace("[created_datetime]", formatDate(current_activity.createdDatetime) + " " + formatTime(current_activity.createdDatetime));
                            }
                            vm.activity = tableManagementService(nonVM.candidate_activity, 7);
                            vm.isShowComponent = true;
                            vm.preferenceNotification = checkCandidatePreference(candidateObj);
                            multipleCallUnlock();
                            return deferred.resolve(vm);
                        }, function (reason) {
                            logger.error(reason);
                            multipleCallUnlock();
                            deferred.reject(reason);
                        });
                    }
                } else {
                    deferred.resolve(vm);
                }
            } catch (reason) {
                logger.error(reason);
                delete service.vm;
                deferred.reject(reason);
            }
            return deferred.promise;
        }

        function parse_activity(str) {
            if (_XC_CONFIG.lang === null || _XC_CONFIG.lang === 'en' || !_XC_i18n) {
                return str;
            }

            // Not all activity strings have a link, but let's separate that away from the rest if it is there.
            var link = '';
            str = str.replace(/\s*<a href=(.+?)>(.+?)<\/a>/, function (match, s1, s2) {
                link = ' <a href=' + s1 + '>' + XCLOUD.i18n(s2, 'dashboard') + '</a>';
                return '';
            });

            var possible_strings = {
                'file_uploaded'           : function (str) {
                    // Account for spaces in filenames. Look for extension dot first.
                    return str.replace(/(You added a new file )(.+\..+?)( on \[created_datetime\]\.)\s*/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[filename]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[filename]", s2);
                        return returnStr;
                    });
                },
                'applications'            : function (str) {
                    // Your application for [job_title] is in consideration after an initial review on [created_datetime].
                    // Your application for [job_title] is not selected for further consideration on [created_datetime]. Apply to other open positions
                    return str.replace(/(Your application for )(.+?)( is .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[job_title]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[job_title]", s2);
                        return returnStr;
                    });
                },
                'hired'                   : function (str) {
                    // Congratulations! You are hired for [job_title] position on [created_datetime].
                    return str.replace(/(Congratulations! You are hired for )(.+?)( position on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[job_title]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[job_title]", s2);
                        return returnStr;
                    });
                },
                'offer'                   : function (str) {
                    // Congratulations! We are pleased to offer you the position of [job_title] on
                    return str.replace(/(Congratulations! We are pleased to offer you the position of )(.+?)( on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[job_title]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[job_title]", s2);
                        return returnStr;
                    });
                },
                'offer_accept'            : function (str) {
                    // You accepted an offer for [job_title] on [created_datetime].
                    return str.replace(/(You accepted an offer for )(.+?)( on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[job_title]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[job_title]", s2);
                        return returnStr;
                    });
                },
                'offer_decline'           : function (str) {
                    // You declined an offer for [job_title] on [created_datetime].
                    return str.replace(/(You declined an offer for )(.+?)( on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[job_title]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[job_title]", s2);
                        return returnStr;
                    });
                },
                'completed_app'           : function (str) {
                    // You completed an application for [job_title] on [created_datetime].
                    return str.replace(/(You completed an application for )(.+?)( on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[job_title]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[job_title]", s2);
                        return returnStr;
                    });
                },
                'assessment1'             : function (str) {
                    // You were asked to take [assessment_name] assessment on [created_datetime].
                    return str.replace(/(You were asked to take )(.+?)( assessment on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[assessment_name]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[assessment_name]", s2);
                        return returnStr;
                    });
                },
                'assessment2'             : function (str) {
                    // You completed [assessment_name] assessment on [created_datetime].
                    return str.replace(/(You completed )(.+?)( assessment on .+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[assessment_name]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[assessment_name]", s2);
                        return returnStr;
                    });
                },
                'assessment_notification1': function (str) {
                    // You were asked to take [assessment_name] assessment on [created_datetime].
                    return str.replace(/(You were asked to take )(.+?)( assessment.+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[assessment_name]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[assessment_name]", s2);
                        return returnStr;
                    });
                },
                'assessment_notification2': function (str) {
                    // You completed [assessment_name] assessment on [created_datetime].
                    return str.replace(/(You completed )(.+?)( assessment.+)/, function (match, s1, s2, s3) {
                        var returnStr = XCLOUD.i18n(s1 + '[assessment_name]' + s3, 'dashboard');
                        returnStr = returnStr.replace("[assessment_name]", s2);
                        return returnStr;
                    });
                },
                'else'                    : function (str) {
                    // The API returns [created_date] and such in the text, we can do a direct translate now
                    return XCLOUD.i18n(str, 'dashboard');
                }

            };

            var new_string = str;
            for (var replaces in possible_strings) {
                new_string = possible_strings[replaces](str);

                // No sense in continuing if one matched
                if (new_string !== str) break;
            }

            return new_string + ' ' + link;
        }

        function addCandidateActivity(contextType, type, status, activityData, createdDatetime, completedDatetime, candidateObj) {
            var deferred = $q.defer();
            try {
                candidateObj = candidateIdResolver(candidateObj);
                if (candidateObj) {
                    var addActivity = {
                        candidateId      : candidateObj.candidateId,
                        contextId        : candidateObj.candidateId,
                        contextType      : contextType,
                        type             : type,
                        status           : status,
                        activityData     : activityData.toString(),
                        createdDatetime  : createdDatetime,
                        completedDatetime: completedDatetime
                    };
                    privateCandidate.addCandidateActivity(addActivity).$promise.then(function (results) {
                        $rootScope.$broadcast(BROAD_CAST_NAMESPACE.GET_CANDIDATE_ACTIVITY, true, candidateObj);
                        deferred.resolve(vm);
                    });
                }
            } catch (reason) {
                logger.error(reason);
                delete service.vm;
                jQuery('.loading-container').css('display', 'none');
                deferred.reject(reason);
            }
            return deferred.promise;
        }

        function updateCandidateActivity(activityId, contextId, contextType, type, status, activityData, createdDateTime, candidateObj, $index) {
            var deferred = $q.defer();
            try {
                candidateObj = candidateIdResolver(candidateObj);
                if (candidateObj) {
                    var updateActivity = {
                        activityId       : activityId,
                        candidateId      : candidateObj.candidateId,
                        contextId        : contextId,
                        contextType      : contextType,
                        type             : type,
                        status           : status,
                        activityData     : activityData.toString(),
                        createdDatetime  : createdDateTime,
                        completedDatetime: new Date().getTime()
                    };
                    privateCandidate.updateCandidateActivity(updateActivity).$promise.then(function (results) {
                        var output = normalizeObjects(results);
                        for (var key in nonVM.candidate_activity) {
                            var current_activity = nonVM.candidate_activity[key];
                            if (current_activity.activityId === output.activityId) {
                                current_activity.status = status;
                            }
                        }
                        nonVM.candidate_activity = $filter('filter')(nonVM.candidate_activity, {status: "!removed"});
                        vm.activity_notifications = angular.copy($filter('filter')(nonVM.candidate_activity, {
                            status: "!completed",
                            type  : "notification"
                        }).reverse());

                        vm.activity = tableManagementService(nonVM.candidate_activity, 7);

                        deferred.resolve(vm);
                    });
                }
            } catch (reason) {
                logger.error(reason);
                delete service.vm;
                jQuery('.loading-container').css('display', 'none');
                deferred.reject(reason);
            }
            return deferred.promise;
        }

        function filterCandidateActivity(searchCriteria) {
            if (searchCriteria !== "recent") {
                vm.activity = $filter('filter')(nonVM.candidate_activity, {type: searchCriteria});
                vm.activity = tableManagementService(vm.activity, 7);
            }
            else {
                vm.activity = tableManagementService(nonVM.candidate_activity, 7);
            }
            return vm;
        }

        function candidateIdResolver(candidateObj) {
            candidateObj = candidateObj || ApplicationState.session.candidate.get();
            if (candidateObj) {
                if (!angular.equals({}, candidateObj)) {
                    return candidateObj;
                }
            }
            return null;
        }

        function checkCandidatePreference(candidateObj) {
            var prefEmptyStatus = true;
            if (candidateObj.preferences !== null && !angular.equals({}, candidateObj.preferences)) {
                var _pref = angular.fromJson(candidateObj.preferences);
                if (_pref.areaOfInterest) {
                    if (_pref.areaOfInterest.length > 0) {
                        prefEmptyStatus = false
                    }
                }
                if (_pref.location) {
                    if (_pref.location.length > 0) {
                        prefEmptyStatus = false
                    }
                }
                if (_pref.jobTitle) {
                    if (_pref.jobTitle.length > 0) {
                        prefEmptyStatus = false
                    }
                }
            }

            return prefEmptyStatus;

            // return (candidateObj.preferences === null || angular.equals("{\"location\":[],\"jobTitle\":[]}", candidateObj.preferences) || angular.equals("{\"areaOfInterest\":[],\"location\":[],\"jobTitle\":[]}", candidateObj.preferences) || angular.equals({}, candidateObj.preferences));
        }

        function multipleCallLock() {
            nonVM.activeRequest = true;
        }

        function multipleCallUnlock() {
            nonVM.activeRequest = false;
        }
    }
}());