angular
.module('analytics.omni.tagging')
.directive('omniTaggingDirective',['omniTaggingFactory', function(omniTaggingFactory){
    return{
        restrict: 'EA',
        link: function(scope,element,attrs){
            var flow = attrs.flow;
            if(_XC_CONFIG.omniDataEnabled === 'true') {
                if (typeof(_XC_CONFIG.analytics_id) !== "undefined" && _XC_CONFIG.analytics_id !== "" && _XC_CONFIG.analytics_id !== null) {
                    scope.imgSrc = omniTaggingFactory.omniTaggingCreateTag(flow);
                }
            }
        },
        templateUrl: '/wp-content/plugins/xcloud/app/components/omni_tagging/omni-tagging.html'
    }

    }]
);





