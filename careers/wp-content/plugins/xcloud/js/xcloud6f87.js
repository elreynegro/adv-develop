var XCLOUD = XCLOUD || {};

var XCLOUDInitiLoad = true;

XCLOUD.cookies = {
    getItem: function (sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

// Straight from the app
XCLOUD.local = (function($){
    var maxSessionStorageTime = 30 * 60 * 1000;
    var service = {
        get: get,
        set: set,
        supports: supports,
        remove: remove,
        clear: clear
    };

    return service;

    function get(name, session) {
        if (!supports()) {
            return null;
        }

        name = _XC_CONFIG.org + '.' + name;

        var item = window.localStorage.getItem(name);

        if (item === undefined || item === null) {
            return null;
        } else {
            var jsonItem = JSON.parse(item);
            var now = new Date().getTime();
            var then = parseInt(jsonItem.date);
        }

        if (now - then >= maxSessionStorageTime) {
            window.localStorage.removeItem(name);
            return null;
        } else {
            return JSON.parse(jsonItem.data);
        }
    }

    function set(name, data) {
        try {
            if (!supports()) {
                return;
            }

            name = _XC_CONFIG.org + '.' + name;

            var storageItem = new StorageItem(data);

            window.localStorage.setItem(name, JSON.stringify(storageItem));
        }
        catch (reason) {
            if(console && console.error){
                console.error(reason)
            }
        }
    }

    function supports() {
        try {
            var hasStorage = ('localStorage' in window);
            return hasStorage;
        } catch (reason) {
            if(console && console.warn){
                console.warn('localStorage not supported');
            }
            return false;
        }
    }

    function remove(name, session) {
        if (!supports()) {
            return;
        }

        if(session){
            window.sessionStorage.removeItem(name);
            return;
        }

        window.localStorage.removeItem(name);
    }

    function clear(session) {
        if (!supports()) {
            return;
        }

        if(session){
            window.sessionStorage.clear();
            return;
        }
        window.localStorage.clear();
    }

    function StorageItem(data) {
        this.date = '' + new Date().getTime();
        this.data = data;
    }
})(jQuery);

XCLOUD.user = (function($){
    var user = XCLOUD.local.get('candidate');

    function logged_in(){
        return user !== null;
    }

    function get(key){
        if(!logged_in()){
            return '';
        }
        if(key in user){
            return user[key];
        }
        return '';
    }
})(jQuery);

XCLOUD.personalize = (function($){
    // Personalized elements are hidden on page load. If logged in, parse the elements for profile fields.
    // If not logged in, show the "not logged in" content instead.
    var xcc = null;
    var prevFirstName = null;
    var prevDataIf = null;
    function get_candidate(){
        var user = XCLOUD.local.get('candidate');
        if(user === null) {
            user = XCLOUD.cookies.getItem('xcc');
        }
        if(user !== null && typeof user === 'string'){
            user = JSON.parse(user);
        }

        return user;
    }
    xcc = get_candidate();

    var parse_string = function(str){
        var pattern = /\{\{(.+?)\}\}/g;
        str = str.replace(pattern, function (match, offset, string) {
            match = match.replace('{{', '').replace('}}', '');
            return getter(match);
        });
        return str;
    };

    var getter = function(key){
        var xcc = get_candidate();
        return xcc && xcc.hasOwnProperty(key) ? xcc[key] : '';
    };

    return {
        init: function (params) {
            // Apply filter
            _XC_CONFIG = XCLOUD.apply_filter('xcc_config', _XC_CONFIG);

            /*Add filter can be used in wordpress script as below
            XCLOUD.add_filter('xcc_config', function (xcc_config) { // code goes here.... });*/

            // Remove any existing dynamic elements
            $('.xcc-sign-in-submenu').remove();
            $(this).removeClass('out in');

            xcc = get_candidate();
            if (xcc === null || xcc.isLocked === true) {
                $('.xcc-logged-out').show();
                $('.menu-inline .xcc-sign-in').hide();
                $('.xcc-sign-in').each(function(){
                    var submenu = '<div class="xcc-sign-in-submenu display-none-mobile" ng-app="st.apply.site" ng-controller="signInMenuController">';
                    submenu +='<div id="scriptInjector"></div>';
                    if(_XC_CONFIG.login_modal.disabled === false){
                        _XC_CONFIG.signInHTML = '<a class="sign-in-link avia-color-theme-color pointer" href="javascript:angular.element(\'.xcc-sign-in-submenu\').scope().openSignInModal();" ng-click="openSignInModal($event)">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.login ? _XC_CONFIG.menuShortcodesAttr.login : 'Already have a profile?', 'labels') + '</a>';
                        submenu += _XC_CONFIG.signInHTML;
                    }
                    else {
                        _XC_CONFIG.signInHTML = '<a class="sign-in-link avia-color-theme-color" href="/' + (_XC_CONFIG.lang ? _XC_CONFIG.lang + '/' : '') + 'profile/login/">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.login ? _XC_CONFIG.menuShortcodesAttr.login : 'Already have a profile?', 'labels') + '</a>';
                        submenu += _XC_CONFIG.signInHTML;
                    }
                    if(_XC_CONFIG.lead_capture_as_modal == 'true'){
                        var applyPage = window.location.pathname;
                        applyPage = applyPage.toLowerCase();
                        /*If it is an apply page showing dynamic forms, we fall back to profile/join page. As multiple dynamic forms are creating issues with current implementation */
                        if(applyPage.indexOf('/apply/')>-1){
                            submenu += '<a class="create-profile-link" href="/' + (_XC_CONFIG.lang ? _XC_CONFIG.lang + '/' : '') + 'profile/join/">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.createprofile ? _XC_CONFIG.menuShortcodesAttr.createprofile : 'Sign In', 'labels') + '</a>';
                        }else
                        {
                            submenu += '<a class="create-profile-link" href="javascript:angular.element(\'.xcc-sign-in-submenu\').scope().openLeadCapture();" ng-click="openLeadCapture($event)">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.createprofile ? _XC_CONFIG.menuShortcodesAttr.createprofile : 'Sign In', 'labels') + '</a>';
                        }
                    }
                    else{
                        submenu += '<a class="create-profile-link" href="/' + (_XC_CONFIG.lang ? _XC_CONFIG.lang + '/' : '') + 'profile/join/">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.createprofile ? _XC_CONFIG.menuShortcodesAttr.createprofile : 'Sign In', 'labels') + '</a>';
                    }

                    /*submenu += '<a class="sign-in-link avia-color-theme-color"  >' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.login ? _XC_CONFIG.menuShortcodesAttr.login : 'Already have a profile?', 'labels') + '</a>';*/
                    //This needs to be done based on wp-admin settings

                    //submenu += '<a class="create-profile-link" href="/' + (_XC_CONFIG.lang ? _XC_CONFIG.lang + '/' : '') + 'profile/join/">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.createprofile ? _XC_CONFIG.menuShortcodesAttr.createprofile : 'Sign In', 'labels') + '</a>';
                    submenu += '</div>';

                    $(this).parent().addClass('xcc-sign-in-parent').append(submenu);
                    $(this).parent().parent().addClass('xcc-wrapper');
                    $(this).html($(this).data('not')).addClass('out');
                });
                var count = 0;
                $('.xcc-angular-app-load').each(function(){
                    var newId = "xcc-angular-app-load-"+count;
                    var activityContent = '<div id="' + newId + '" ng-app="st.apply.site" ng-controller="mainController as mc">';
                    if(_XCC_CA_CONFIG.not_logged_in === 'custom'){
                        activityContent += _XCC_CA_CONFIG.not_logged_in_cust_html
                    }else {
                        activityContent += _XC_CONFIG.signInHTML;
                    }
                    activityContent += ' <div candidate-activity-notification-widget></div></div>';
                    $(this).html(activityContent);
                    angular.element('#'+newId).scope();
                    count++;
                });
            }
            else if(xcc !== null && xcc.isLocked !== true){
                try {
                    $('.xcc-logged-out').hide();
                    $('.xcc-logged-in,.xcc-sign-in').each(function () {
                        // No checks for a specific field
                        if ($(this).data('if') === '') {
                            $(this).html(parse_string($(this).html())).show();
                        }
                        else {
                            if($(this).is('.xcc-sign-in')){
                                $('.menu-inline .xcc-sign-in').show();
                                var dataIf = getter('firstName');
                                if((_XC_CONFIG.menuShortcodesAttr.if !== undefined && _XC_CONFIG.menuShortcodesAttr.if.length > 0 && _XC_CONFIG.menuShortcodesAttr.if.indexOf("{{firstName}}") >= 0) || prevDataIf !== null){
                                    if(dataIf !== prevDataIf && prevDataIf !== null){
                                        _XC_CONFIG.menuShortcodesAttr.if = _XC_CONFIG.menuShortcodesAttr.if.replace(prevDataIf, dataIf);
                                        prevDataIf = dataIf;
                                    }else{
                                        prevDataIf = dataIf;
                                        _XC_CONFIG.menuShortcodesAttr.if = _XC_CONFIG.menuShortcodesAttr.if.replace('{{firstName}}', dataIf);
                                    }
                                }else{
                                    prevDataIf = dataIf;
                                    _XC_CONFIG.menuShortcodesAttr.if = XCLOUD.i18n('Welcome') + ' ' + getter('firstName');
                                }

                                var submenu = '<div class="xcc-sign-in-submenu">';
                                submenu += '<a class="account-link" href="/' + (_XC_CONFIG.lang ? _XC_CONFIG.lang + '/' : '') + 'profile/">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.profile) + '</a>';
                                var firstName = getter('firstName');
                                if ((_XC_CONFIG.menuShortcodesAttr.logout !== undefined && _XC_CONFIG.menuShortcodesAttr.logout.length > 0 && _XC_CONFIG.menuShortcodesAttr.logout.indexOf("{{firstName}}") >= 0) || prevFirstName !== null ){
                                    if(firstName !== prevFirstName && prevFirstName !== null)
                                    {
                                        _XC_CONFIG.menuShortcodesAttr.logout = _XC_CONFIG.menuShortcodesAttr.logout.replace(prevFirstName, firstName);
                                        prevFirstName = firstName;
                                    }
                                    else{
                                        prevFirstName = firstName;
                                        _XC_CONFIG.menuShortcodesAttr.logout = _XC_CONFIG.menuShortcodesAttr.logout.replace('{{firstName}}', firstName);
                                    }
                                }else{
                                    prevFirstName = firstName;
                                    _XC_CONFIG.menuShortcodesAttr.logout = XCLOUD.i18n('Not') + ' ' + getter('firstName') + '? <b>' + XCLOUD.i18n('Sign out') + '</b>';
                                }
                                submenu += '<a class="xcc-log-out" href="#">' + XCLOUD.i18n(_XC_CONFIG.menuShortcodesAttr.logout) + '</a>';
                                submenu += '</div>';

                                $('.xcc-sign-in').attr('data-if', _XC_CONFIG.menuShortcodesAttr.if);
                                $('.xcc-sign-in').attr('aria-label', _XC_CONFIG.menuShortcodesAttr.if);
                                $(this).parent().addClass('xcc-sign-in-parent').append(submenu);
                                $(this).html(parse_string($(this).data('if'))).addClass('in');
                                $(this).parent().parent().addClass('xcc-wrapper');
                            }
                            else {
                                // Condition met
                                if (xcc.hasOwnProperty($(this).data('if'))) {
                                    $(this).html(parse_string( XCLOUD.i18n($(this).html()) )).show();
                                }
                                // Show sibling xcc-logged-out element instead
                                else {
                                    $(this).siblings('.xcc-logged-out').show();
                                }
                            }
                        }
                    });
                    $('.xcc-angular-app-load').each(function(){
                        if(location.pathname.indexOf("/profile/") === -1 && location.pathname.indexOf("/apply/") === -1) {
                            var activityContent = '<div ng-app="st.apply.site" ng-controller="mainController as mc"><div candidate-activity-notification-widget></div></div>';
                            $(this).html(activityContent);
                        }
                    });
                }
                catch (x) {
                    CWS.log(x);
                }
            }
			if(jQuery.isFunction(CWS.loadRecommendationWidgets)) {
				CWS.loadRecommendationWidgets(XCLOUDInitiLoad);
                XCLOUDInitiLoad = false;
			}
			XCLOUD.load_persona_data(xcc);
        },
        logged_in: function(){
            return !(get_candidate() === null)
        },
        parse: parse_string,
        get: getter
    }
})(jQuery);

XCLOUD.load_persona_data = function(user){
    var $ = jQuery;
    var widgets = $('.xcc-persona-widget');

    if(!widgets.length){
        return;
    }

    function build_widget(el, data, options){
        var html = '<h3 class="widgettitle">' + options.title + '</h3>';
        if(data.length > 0){
            for(var i = 0, len = data.length; i < len; i++){
                html = XCLOUD.apply_filter('persona_widget_pre_item', html, data[i]);
                // Following Enfold's setup
                var title = data[i].title.rendered;
                html += '<h4 class="av-magazine-title entry-title" itemprop="headline"><a href="' + data[i].link + '" title="Link to: ' + title + '">' + title + '</a></h4>';
                html += '<hr />';
                html = XCLOUD.apply_filter('persona_widget_post_item', html, data[i]);
            }
            el.html(html);
        }
    }

    widgets.each(function() {
        var el = $(this);
        var data = decodeURIComponent($(this).data('options'));
        data = JSON.parse(data);

        // This will help for temporary enhancements
        data = XCLOUD.apply_filter('persona_widget_options', data);

        // If not_logged_in equates to false, don't show anything
        if (user === null && !data.not_logged_in) {
            return;
        }

        var post_type = data.post_types.split(',');
        var requests = [];
        var persona_data = [];

        for (var i = 0, len = post_type.length; i < len; i++) {
            var url = '/wp-json/wp/v2/' + post_type[i];
            if (user !== null && user.areaInterest) {
                url += '?filter[taxonomy]=persona&filter[term]=' + encodeURIComponent(user.areaInterest);
            }
            else {
                url += '?persona=' + data.not_logged_in;
            }

            requests.push($.get(url,
                function (results) {
                    console.log(results);
                    persona_data = _.union(persona_data, results);
                }
            ));
        }

        $.when.apply(undefined, requests).then(function (results) {
            persona_data = XCLOUD.apply_filter('persona_widget_data', persona_data);
            build_widget(el, persona_data, data);
        });

    });
};

XCLOUD.log_out = function(no_reload, event, isRedirectionForHomePage,skipRedirection){
    var key = 'candidate';
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + key);
    XCLOUD.local.remove(key, true);
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + 'credentials');
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + 'oauthcredentials');
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + 'roles');
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + 'remember_me');
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + 'Y9dN0');
    XCLOUD.local.remove(_XC_CONFIG.org + '.' + 'applyCandidate');
    XCLOUD.cookies.removeItem('xcc');
    //ApplicationState.session.candidate.resume.applyResumeStateContainer.remove();
    window.sessionStorage.removeItem("ApplyResumeStateContainer");
    window.sessionStorage.removeItem("SocialSiteStateContainer");

    if(event){
        event.preventDefault();
        event.stopPropagation();
    }
    if(skipRedirection && skipRedirection === true) {
        return;
    }
    if(_XC_CONFIG.menuShortcodesAttr !== undefined && _XC_CONFIG.menuShortcodesAttr !== null) {
        if(isRedirectionForHomePage === true){
            window.location = '/';
        }else {
            if (_XC_CONFIG.menuShortcodesAttr.logoutdest !== undefined && _XC_CONFIG.menuShortcodesAttr.logoutdest !== '#' && _XC_CONFIG.menuShortcodesAttr.logoutdest !== null) {
                window.location.href = _XC_CONFIG.menuShortcodesAttr.logoutdest;
            } else if (no_reload !== true) {
                if(_XC_CONFIG.login_modal.disabled === true){
                    window.location.reload();
                }else {
                    window.location = '/';
                }
            }
        }
    }else if(!isRedirectionForHomePage || isRedirectionForHomePage === true){
        window.location = '/';
    }
    else if(no_reload !== true){
        window.location.reload();
    }
};

XCLOUD.change_iframe_height = function(){
    try {
        var iframes = document.getElementsByClassName('dynamic-iframe');
        if (iframes.length > 0) {
            for(var i = 0, len = iframes.length; i < len; i++){
                // Check if cross-origin
                if(iframes[i].contentWindow && iframes[i].contentWindow.document) {
                    iframes[i].height = "";
                    jQuery(iframes[i]).css('height', iframes[i].contentWindow.document.body.scrollHeight + "px");
                }
            }
        }
    }
    catch(x){ }
};

XCLOUD.view_loaded = function(e){
    if(DEBUG){
        console.log('View loaded event emitted');
    }
    // Run functions here that need to be executed after the routing view changes (personalization, widgets, etc)
    if(XCLOUD.in_iframe()) {
        parent.XCLOUD.change_iframe_height();
    }

    XCLOUD.refresh_language_switcher();

    // Or execute code with this filter
    XCLOUD.apply_filter('xcc_view_loaded', {});
};

XCLOUD.filters = {};
XCLOUD.add_filter = function (filter_name, filter_function) {
    if (typeof filter_function == 'function') {
        if (!XCLOUD.filters.hasOwnProperty(filter_name)) {
            XCLOUD.filters[filter_name] = [];
        }
        XCLOUD.filters[filter_name].push(filter_function);
    }
};
XCLOUD.apply_filter = function (filter_name, obj) {
    if (XCLOUD.filters.hasOwnProperty(filter_name)) {
        for (var i = 0, len = XCLOUD.filters[filter_name].length; i < len; i++) {
            // by passing in "arguments" minus the filter name, we can pass more than one
            obj = XCLOUD.filters[filter_name][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
    return obj;
};

XCLOUD.i18n = function(str, context){
    // Proper requirements don't exist, let's not bother
    if(_XC_CONFIG.lang === null || _XC_CONFIG.lang === 'en' || !_XC_i18n){
        return str;
    }

    // Check if a translation exists
    if(_XC_i18n[context] && _XC_i18n[context][str] && _XC_i18n[context][str][_XC_CONFIG.lang]){
        return _XC_i18n[context][str][_XC_CONFIG.lang];
    }

    // Nope
    return str;
};

XCLOUD.in_iframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

var last_body_height;

XCLOUD.refresh_language_switcher = function(){
    if(_XC_CONFIG.lang) {
        // Strip out the language code from the current path, so /es/profile/login/ becomes /profile/login/
        // English ends up unaffected by this
        var app_page = location.pathname.replace('/' + _XC_CONFIG.lang + '/', '/');

        jQuery('.wpml-ls-menu-item a').each(function () {
            // Easy way to parse a url
            var l = document.createElement("a");
            l.href = this.href;
            var path = l.pathname;

            // This part might look weird... I've added a hash table of all languages to _XC_CONFIG.langs, and we're going to check each language switcher url
            // This regex will return 'profile' for English, and 'es' for Spanish
            var lang_code = RegExp('^/(.+?)/').exec(path);
            if (lang_code !== null) {
                // 'es' exists in _XC_CONFIG.langs, so let's prepend that language code to the new app page
                if (lang_code[1] in _XC_CONFIG.langs) {
                    this.href = '/' + lang_code[1] + app_page + location.search;
                }
                // 'profile' does not exists in langs, we can assume this link is for English and we just use the root path for the app page
                else {
                    this.href = app_page + location.search;
                }
            }
        });
    }
};

(function($){
    $(document).ready(function(){
        XCLOUD.personalize.init();
        if(XCLOUD.in_iframe()) {
            last_body_height = $('body').outerHeight();
            parent.XCLOUD.change_iframe_height();

            setInterval(function(){
                var new_body_height = $('body').outerHeight();
                if(new_body_height !== last_body_height){
                    parent.XCLOUD.change_iframe_height();
                    last_body_height = new_body_height;
                }
            }, 100);
        }

        $('body').delegate('.xcc-log-out', 'click', function(e){
            XCLOUD.log_out(false, e);
        });
        $('.xcc-sign-in').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // There has to be a better solution than this...
        var scrollToTop = jQuery('#scroll-top-link');
        if(scrollToTop.length > 0) {
            scrollToTop.click(function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
            });
        }

        if(window.matchMedia("(max-width:767px)").matches || navigator.userAgent.match(/iPad/i) != null){
            $('.menu-dropdown .xcc-sign-in').click(function(){
                $('.xcc-sign-in-submenu').toggle();
            });
        }

    });
})(jQuery);
