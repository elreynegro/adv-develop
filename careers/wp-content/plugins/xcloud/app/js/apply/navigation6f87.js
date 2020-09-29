(function () {
    'use strict';


    angular
        .module('st.controllers.apply.site')
        .controller('navigationController', navigationController);

    navigationController.$inject = ['$scope', '$log', '$controller', '$location'];


    function navigationController($scope, $log, $controller, $location) {

        var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_ACCOUNT_NAV);

        var sections = {
            'activity'    : '/profile/',
            'edit'        : '/profile/edit/',
            'preferences' : '/profile/preferences/',
            'applications': '/profile/applications/',
            'todos'       : '/profile/todos/',
            'interviews'  : '/profile/interviews/',
            'offers'      : '/profile/offers/',
            'onboarding'  : '/profile/onboarding/',
            'assessments' : '/profile/assessments/'
        };
        // Match up the child tabs with the parent tabs, ie, To-Do's > Offers
        var section_parents = {
            'edit'       : 'edit',
            'preferences': 'edit',
            'interviews' : 'todos',
            'offers'     : 'todos',
            'onboarding' : 'todos',
            'assessments': 'todos'

        };

        // Only configured tabs from admin
        sections = _.pick(sections, DASHBOARD_TABS);

        var section_paths = _.invert(sections);

        initialize();

        function switchTabs(tab, $event){
            if(!tab){
                if($scope.accountSection in section_paths){
                    // This will tell us what sub-section they're in, ie, To Do's > Offers
                    if(section_paths[$scope.accountSection] in section_parents){
                        $scope.sub_tab = section_paths[$scope.accountSection];
                        $scope.tab = section_parents[$scope.sub_tab];
                    }
                    else {
                        $scope.sub_tab = '';
                        $scope.tab = section_paths[$scope.accountSection];
                    }
                }
                else{
                    switchTabs('applications');
                }
            }
            else{
                if($event){
                    $event.stopPropagation();
                    $event.preventDefault();
                }
                if(tab === 'todo-first-child'){
                    // Default to interviews, then see if it's an option
                    tab = 'interviews';
                    for(var i in section_parents){
                        if(section_parents[i] === 'todos' && DASHBOARD_TABS.indexOf(i) > -1){
                            tab = i;
                            break;
                        }
                    }
                }

                $scope.tab = tab;
                $scope.accountSection = sections[tab];

                // Hold on, check for subsections
                if(tab in section_parents){
                    $scope.sub_tab = tab;
                    $scope.tab = section_parents[$scope.sub_tab];
                }
                else{
                    $scope.sub_tab = '';
                }

                $scope.$parent.activeOffer = null;

                $location.path(sections[tab], false);
            }

            $scope.$parent.nav.tab = $scope.tab;
            $scope.$parent.nav.sub_tab = $scope.sub_tab;
            //$scope.$parent.profileUpdated = false;
            jQuery('.loading-container').css('display', 'none');
        }
        function activeTab(link, subsection){
            if(!sections.hasOwnProperty(link)){
                return '';
            }
            if(section_paths[$scope.accountSection] in section_parents
                && section_parents[section_paths[$scope.accountSection]] === link
                && !subsection){
                return 'active';
            }
            return $scope.accountSection === sections[link] || $scope.sub_tab === link ? 'active' : '';
        }

        function initialize(){
            $scope.$parent.nav = {};
            jQuery('.loading-container').css('display', 'block');
            $scope.tab = 'activity';
            $scope.sub_tab = '';

            // Let's make it so we can ids to the end of the path. For instance, /profile/offers/28/
            // To do that, we need to remove it from what we check in the array of paths higher up. Use routeParams in controller for it.
            var currentPath = $location.path().replace(/^(.+?)\/\d*\/?$/, '$1/');
            $scope.accountSection = currentPath;

            switchTabs();

            $scope.switchTabs = switchTabs;
            $scope.activeTab = activeTab;

            $scope.$parent.nav.switchTabs = switchTabs;
            $scope.$parent.nav.activeTab = activeTab;
            jQuery('.loading-container').css('display', 'none');
        }
    }
})();