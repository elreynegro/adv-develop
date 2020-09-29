// Base object used for common functions
var CWS = CWS || {};
var $ = jQuery;

// jQuery UI extension to allow html chars in autocomplete
// @formatter:off
!function(t){function e(e,i){var o=new RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(e){return o.test(t("<div>").html(e.label||e.value||e).text())})}var i=t.ui.autocomplete.prototype,o=i._initSource;t.extend(i,{_initSource:function(){this.options.html&&t.isArray(this.options.source)?this.source=function(t,i){i(e(this.options.source,t.term))}:o.call(this)},_renderItem:function(e,i){return t("<li></li>").data("item.autocomplete",i).append(t("<a></a>")[this.options.html?"html":"text"](i.label)).appendTo(e)}})}(jQuery);
// @formatter:on

CWS.log = function (msg) {
    // IE8 check
    if (window.console && console.log) {
        console.log(msg);
    }
};

CWS.str_to_css_class = function(str){
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9]/g, ' ');
    str = str.replace(/\s/g, '-');
    str = str.replace(/-+/g, '-');
    return str;
};

CWS.aria_live = function (msg, assertive) {
    if (cws_opts && cws_opts.accessible) {
        msg = CWS._(msg);
        if (assertive) {
            jQuery('#aria-live-assertive span').hide();
            jQuery('#aria-live-assertive').append('<span>' + msg + '</span>');
        }
        else {
            jQuery('#aria-live span').hide();
            jQuery('#aria-live').append('<span>' + msg + '</span>');
        }
    }
    // Ignore the rest
};

CWS.isIE = function () {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');

    // Up to IE10, may alter this function later to include IE11 and IE12 if needed
    if (msie > 0) {
        return true;
    }

    return false;
};

// @formatter:off
CWS.states = { 'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'};

CWS.state_codes = { 'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'};

// Used for Date.getMonth()
CWS.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// @formatter:on

CWS.async_loader = function () {
    // GMaps & Places
    if(CWS.cookies.getItem('event_calender_pro_plugin_google_api_call') === null){
        //CWS.log(CWS.cookies.getItem('event_calender_pro_plugin_google_api_call'));
        if (typeof google == 'undefined' || typeof google.maps == 'undefined' || typeof google.maps.places == 'undefined' && !jQuery('#tribe-bar-geoloc').length) {
            if(cws_opts.google_type !== 'here') {
                var key = '';
                if (cws_opts.google_type && cws_opts.google_key) {
                    key = '&' + cws_opts.google_type + '=' + cws_opts.google_key;
                }

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = CWS.apply_filter('google_maps_url', 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
                    '&libraries=places&callback=CWS_init_autocomplete' + key);
                document.body.appendChild(script);
            }
        }
    }

    // Pollinator
    /* Removed due to service no longer existing; commenting for reference
    if (cws_opts && cws_opts.poll_script) {
        var poll = document.createElement('script');
        poll.type = 'text/javascript';
        poll.src = cws_opts.poll_script;
        document.body.appendChild(poll);

    }
    */
};

CWS.build_querystring = function (obj, pollinator) {
    var qs = '?';
    for (key in obj) {
        if (typeof obj[key] === 'object') {
            // Array of values
            for (var i = 0, len = obj[key].length; i < len; i++) {
                qs += key + '[]=' + encodeURIComponent(obj[key][i]) + '&';
            }
        }
        else {
            qs += key + '=' + encodeURIComponent(obj[key]) + '&';
        }
    }
    if (qs === '?') {
        if (pollinator) {
            qs = '';
        }
        else {
            qs = window.location.pathname;
        }
    }
    else {
        qs = qs.substring(0, qs.length - 1);
    }

    return qs;
};

CWS.build_querystring_uri = function (obj) {
    return window.location.origin + window.location.pathname + CWS.build_querystring(obj);
};

CWS.toggle_job_cart = function (ele) {
    var cart = CWS.cookies.getItem('jobcart'),
        data = CWS.apply_filter('cart_job_data', JSON.parse(decodeURIComponent(ele.data('job')).replace(/\+/g, ' '))),
        add = ele.data('add'),
        add_text = 'Add to Cart',
        remove_text = 'Remove from Cart';

    if (cws_opts && cws_opts.localization) {
        add_text = cws_opts.localization.add_to_cart;
        remove_text = cws_opts.localization.remove_from_cart;
    }
    if (ele.data('addtext')) {
        add_text = ele.data('addtext');
    }
    if (ele.data('removetext')) {
        remove_text = ele.data('removetext');
    }

    // If the apply button exists, use its url to store in the cookie instead
    if (data.url && jQuery('.apply-btn')) {
        data.url = jQuery('.apply-btn').attr('href');
    }
    else {
        data.url = '#';
    }

    add_text = CWS.apply_filter('cart_add_text', add_text);
    remove_text = CWS.apply_filter('cart_remove_text', remove_text);

    var cart_event = jQuery.Event('cart_toggled');
    cart_event.added = add;
    jQuery(window).trigger(cart_event);

    if (cart) {
        cart = JSON.parse(cart);
        if (add) {
            cart[data['id']] = data;
            ele.data('add', false).attr('aria-pressed', 'true').children('.cartbtn-text').html(remove_text);

            setTimeout(function () {
                CWS.aria_live('Added to job cart', true);
            }, 200);
        }
        else {
            delete cart[data['id']];
            ele.data('add', true).attr('aria-pressed', 'false').children('.cartbtn-text').html(add_text);

            setTimeout(function () {
                CWS.aria_live('Removed from job cart', true);
            }, 200);
        }
    }
    else {
        cart = {};
        cart[data['id']] = data;
        ele.data('add', false).attr('aria-pressed', 'true').children('.cartbtn-text').html(remove_text);
    }

    CWS.cookies.setItem('jobcart', JSON.stringify(cart), null, '/');
};

CWS.check_cart_count = function () {
    var $ = jQuery;
    var jc_counter = $('.jobcart-counter');
    var jc_addbtn = $('.jobcart-btn');
    var cart = CWS.cookies.getItem('jobcart');
    var add_text = 'Add to Cart';
    var remove_text = 'Remove from Cart';

    if (cws_opts && cws_opts.localization) {
        add_text = cws_opts.localization.add_to_cart;
        remove_text = cws_opts.localization.remove_from_cart;
    }

    if (cart) {
        cart = decodeURIComponent(cart);
        if (cart.charAt(0) !== '{') {
            // Dunno why this is happening, but if the cart isn't JSON, remove it
            CWS.cookies.removeItem('jobcart');
            cart = [];
        }
        else {
            cart = JSON.parse(cart);
        }
    }
    else {
        cart = {};
    }

    if (jc_addbtn) {
        if (jc_addbtn.data('addtext')) {
            add_text = jc_addbtn.data('addtext');
        }
        if (jc_addbtn.data('removetext')) {
            remove_text = jc_addbtn.data('removetext');
        }

        var job_data = decodeURIComponent(jc_addbtn.data('job'));

        if (job_data && cart.hasOwnProperty(job_data.id)) {
            jc_addbtn.children('.cartbtn-text').html(remove_text);
            jc_addbtn.data('add', false);
        }
    }

    if (jc_counter) {
        var counter = 0;
        for (job in cart) {
            counter++;
        }
        if (counter > 0) {
            jc_counter.show();
            jc_counter.children('.jobcart-count').html('' + counter);
        }
    }

};

CWS.remove_from_cart = function(id, el){
    var cart = CWS.cookies.getItem('jobcart');
    if (cart) {
        cart = JSON.parse(cart);
        if(cart[id]){
            delete cart[id];
            CWS.cookies.setItem('jobcart', JSON.stringify(cart), null, '/');
        }
    }

    var count = 0;
    for (jobs in cart) {
        count++;
    }

    CWS.aria_live('Removed', true);

    jQuery(el).parent().parent().fadeOut(300, function () {
        jQuery(this).remove();
        var counter = jQuery('.jobcart-counter');
        if (counter) {
            jQuery('.jobcart-count').html('' + count);
        }

        if (count == 0) {
            jQuery('.jobcart .error').fadeIn(300);

            if (counter) {
                counter.fadeOut(300);
            }
        }
    });
};

CWS.build_cart_list = function () {
    var $ = jQuery;
    if ($('.jobcart').length > 0) {
        // Server is having issues reading cookies... let's build the cart list if there's actually jobs in it
        var cart = CWS.cookies.getItem('jobcart');

        if (cart) {
            var cart = JSON.parse(cart);
            var html = '';
            var cls = 'avia-button avia-color-theme-color avia-size-small';
            var apply = 'Apply';
            if (cws_opts) {
                if (cws_opts.localization && cws_opts.localization.applybtn) {
                    apply = cws_opts.localization.applybtn;
                }
            }
            var job_detail = window.cws_opts.job_detail_path;

            if (!jQuery.isEmptyObject(cart)) {
                for (job in cart) {
                    var apply_onclick = '';
                    cart[job] = CWS.apply_filter('cart_list_job', cart[job]);
                    if (!cart[job].hasOwnProperty('url')) {
                        CWS.log('"apply-btn" css class missing on job detail page.')
                    }
                    else {
                        if (cart[job]['url'].indexOf('connect.find.') > -1 || cart[job]['url'].indexOf('connect.thehive.') > -1) {
                            apply_onclick = 'onclick="CWS.show_pollinator_lightbox(this); return false;"'
                        }
                        else if (cws_opts && cws_opts.mc_apply) {
                            cls += ' mailchimp-apply';
                        }
                        html += '<div class="jobcart-row">';
                        html += '<div class="flex_column av_one_fifth first">';
                        html += '<span id="gtm-jobcart-apply" ><a href="' + cart[job]['url'] + '" target="_blank" class="' + cls + '" ' + apply_onclick + '>' + apply + '</a></span>';
                        html += '</div>';
                        html += '<div class="flex_column av_two_fifth">#' + cart[job]['ref'] + ' <a href="' + job_detail + '/' + cart[job]['id'] + '/' + CWS.seo_url(cart[job]) + '">' + cart[job]['title'] + '</a></div>';
                        html += '<div class="flex_column av_one_fifth">' + cart[job]['primary_city'] + '</div>';
                        html += '<div class="flex_column av_one_fifth last"><a href="#" onclick="CWS.remove_from_cart(' + cart[job]['id'] + ', this); return false;">Remove</a></div>';
                        html += '</div>';
                    }
                }

                if (html !== '') {
                    $('.jobcart .error').hide();
                    $('.jobcart').append(html);

                    CWS.init_mailchimp_listener();
                }
            }
        }
    }
};

CWS.seo_url = function (job) {
    var url = job.title;
    if (job.location_type) {
        if (job.location_type == 'Nationwide') {
            if (job.primary_country) {
                url += ' ' + job.primary_country;
            }
            url += ' nationwide';
        }
        else if (job.location_type == 'Statewide') {
            if (job.primary_state) {
                if (CWS.states && job.primary_state in CWS.states) {
                    url += ' ' + CWS.states[job.primary_state];
                }
                else {
                    url += ' ' + job.primary_state;
                }
            }
            url += ' statewide';
        }
        else if (job.location_type == 'Remote') {
            url += ' remote';
        }
    }
    else {
        if (job.primary_country == 'US') {
            url += ' ' + (job.primary_city || '') + (job.primary_state ? ' ' + job.primary_state : '');
        }
        else {
            url += ' ' + job.primary_city + ' ' + job.primary_country;
        }
    }
    url = url.toLowerCase();
    url = jQuery.trim(url);

    // Non-alphanumeric characters changed to hyphens
    url = url.replace(/[^a-zA-Z0-9]/gi, '-');
    url = url.replace(/-{2,20}/g, '-');

    return url + '/';
};

CWS.show_pollinator_lightbox = function (el) {
    var url = jQuery(el).attr('href');
    if(cws_opts && cws_opts.poll_nolightbox){
        window.open(url);
    }
    else if (findly && findly.connect) {
        findly.connect.widget.lightboxconnector.show(url)
    }
    else {
        CWS.log('Pollinator script not embedded.');
    }
};

CWS.ie8_placeholders = function () {
    var $ = jQuery;

    // Ignore all of this unless it's IE8
    if ($('html').hasClass('avia-msie-8')) {
        $('input[type=text]').each(function () {
            var placeholder = $(this).attr('placeholder');
            if (placeholder) {
                // Set placeholder as value first
                if ($(this).val() == '') {
                    $(this).val(placeholder);
                }

                // Wipe if needed on focus
                $(this).focus(function () {
                    if ($(this).val() == placeholder) {
                        $(this).val('');
                    }
                });

                // Add it back if empty on blur
                $(this).blur(function () {
                    if ($.trim($(this).val()) == '') {
                        $(this).val(placeholder);
                    }
                });
            }
        });

        // Clear text fields on submit
        $('form').each(function () {
            $(this).submit(function () {
                $(this).find('input[type=text]').each(function () {
                    var placeholder = $(this).attr('placeholder');
                    if (placeholder && $(this).val() == placeholder) {
                        $(this).val('');
                    }
                });
            });
        });
    }
};

// Google Places object required
CWS.get_state_country = function (place) {
    var country = _.find(place, function (obj) {
        return obj.types[0] == 'country';
    });
    var state = _.find(place, function (obj) {
        return obj.types[0] == 'administrative_area_level_1';
    });

    // There should always be at least a country returned, but in case there is no state, return the country as state
    if (typeof state === 'undefined') {
        state = '';
    }

    // We only need the short name
    country = country.short_name;
    state = state.short_name;

    return {country: country, state: state};
};

// IE7/IE8 can't parse dates...
(function () {
    var D = new Date('2011-06-02T09:34:29+02:00');
    if (!D || +D !== 1307000069000) {
        Date.fromISO = function (s) {
            var day, tz,
                rx = /^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
                p = rx.exec(s) || [];
            if (p[1]) {
                day = p[1].split(/\D/);
                for (var i = 0, L = day.length; i < L; i++) {
                    day[i] = parseInt(day[i], 10) || 0;
                }
                ;
                day[1] -= 1;
                day = new Date(Date.UTC.apply(Date, day));
                if (!day.getDate()) return NaN;
                if (p[5]) {
                    tz = (parseInt(p[5], 10) * 60);
                    if (p[6]) tz += parseInt(p[6], 10);
                    if (p[4] == '+') tz *= -1;
                    if (tz) day.setUTCMinutes(day.getUTCMinutes() + tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else {
        Date.fromISO = function (s) {
            return new Date(s);
        }
    }

    // More IE problems
    if (!Date.prototype.toISOString) {
        (function () {
            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }

            Date.prototype.toISOString = function () {
                return this.getUTCFullYear()
                    + '-' + pad(this.getUTCMonth() + 1)
                    + '-' + pad(this.getUTCDate())
                    + 'T' + pad(this.getUTCHours())
                    + ':' + pad(this.getUTCMinutes())
                    + ':' + pad(this.getUTCSeconds())
                    + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                    + 'Z';
            };
        }() );
    }

    // Icons have aria-hidden=true by default, we don't want that for share links
    CWS.remove_aria_hidden = function () {
        jQuery('.av-share-link a').each(function () {
            jQuery(this).removeAttr('aria-hidden');
        });
    };

    CWS.init_mailchimp_listener = function () {
        if (jQuery('.mailchimp-apply').length > 0) {
            jQuery('.mailchimp-apply').magnificPopup({
                type     : 'iframe',
                iframe   : {
                    markup: '<div class="mfp-iframe-scaler">'
                        + '<div class="mfp-close"></div>'
                        + '<iframe class="mfp-iframe mailchimp-apply-iframe" frameborder="0" allowfullscreen></iframe>'
                        + '</div>'
                },
                callbacks: {
                    resize: function () {
                        //CWS.log('popup changed');
                        var el = jQuery('iframe.mailchimp-apply-iframe');
                        var h = el.css('height');
                        el.css({'height': ''});
                        el.parent().css({'height': h});

                    },
                    open  : function () {
                        jQuery('iframe.mailchimp-apply-iframe').iFrameResize({
                            autoResize     : true,
                            resizedCallback: function (obj) {
                                jQuery(obj.iframe).parent().css({height: obj.height});
                            }
                        });
                    }
                }
            });
        }
    };

    CWS.depersonalize_toggle = function (e) {
        var currently = CWS.cookies.getItem('depersonalize');
        CWS.log(currently);
        if (currently) {
            // Not much to do here, I don't think we need to refresh
            CWS.log(CWS.cookies.removeItem('depersonalize', '/'));
            return;
        }

        else {
            var all_cookies = CWS.cookies.keys();
            var hostNameArray = location.hostname.split(".");
            var tld = "." + hostNameArray[hostNameArray.length - 2] + "." + hostNameArray[hostNameArray.length - 1];

            for (var i = 0, len = all_cookies.length; i < len; i++) {
                if (all_cookies[i].indexOf('_vwo') > -1) {
                    CWS.cookies.removeItem(all_cookies[i], '/');
                    CWS.cookies.removeItem(all_cookies[i], '/', tld);
                }
            }

            var exp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)); // 1 year
            CWS.cookies.setItem('depersonalize', '1', exp, '/');

            window.location.reload();
        }
    };

    /**
     * Can be used three ways.
     * 1. Provide the element and spacing values to this function
     * 2. Element on the page has class 'sticky-element' with data-spacing value
     * 3. Element on the page has class 'sticky-element' and a second class 'sticky-spacing-xxx'
     * @param el
     * @param spacing
     */
    CWS.create_sticky_element = function (el, spacing) {
        if (!el) {
            jQuery('.sticky-element').each(function () {
                var spacing = jQuery(this).data('spacing');
                if(typeof spacing === 'undefined'){
                    var cls = jQuery(this).attr('class').split(' '),
                        changed = false;
                    for(var i = 0, len = cls.length; i < len; i ++){
                        var splt = cls[i].split('sticky-spacing-');
                        if(splt.length === 2){
                            spacing = parseInt(splt[1]);
                            changed = true;
                            break;
                        }
                    }

                    // Default if missing spacing class
                    if(changed === false){
                        spacing = 0;
                    }
                }
                else{
                    spacing = parseInt(spacing);
                }
                jQuery(this).sticky({topSpacing: spacing});
            });
        }
        else {
            jQuery(el).sticky({topSpacing: spacing});
        }
    };

    CWS.build_select2 = function(){
        jQuery('.text_select').each(function () {
            // Used to separate out facet counts into their own element
            var template = function(facet){
                var facet_count_regex = /^(.+?) \((\d+)\)$/g;
                var result = facet_count_regex.exec(facet.text);
                if(result !== null && result.length > 2){
                    return jQuery(
                        '<span>' + result[1] + ' <span class="facet-count">' + result[2] + '</span></span>'
                    );
                }
                return facet.text;
            };

            if (jQuery(this).attr('placeholder')) {
                var opts = {
                    placeholder: jQuery(this).attr('placeholder'),
                    allowClear : true,
                    templateResult: template,
                    templateSelection: template
                };
                jQuery(this).select2(CWS.apply_filter('select2_options', opts));
            }
            else {
                var opts = {
                    templateResult: template,
                    templateSelection: template
                };
                jQuery(this).select2(CWS.apply_filter('select2_options', opts));
            }
        });
    };

    jQuery(document).ready(function () {
        var $ = jQuery;
        CWS.async_loader();
        CWS.check_cart_count();
        CWS.init_keyword_autocomplete();
        CWS.build_cart_list();
        CWS.create_sticky_element();

        if (cws_opts) {
            if (cws_opts.personalization && !CWS.depersonalize) {
                CWS.init_tracking();
                CWS.build_recentviewed_list();
                if(location.pathname !== '/profile/') {
                    CWS.build_lastviewed_list();
                }
                CWS.build_search_history();
            }
            if (cws_opts.accessible) {
                CWS.remove_aria_hidden();
            }
        }

        if(jQuery("#s").length === 1){
            jQuery("#searchform").submit(function () {
                if($.trim($("#s").val()) === ""){
                    return false;
                }
            })
        }

        if(jQuery("#blog-search").length === 1){
            $.widget("custom.blogSearchAutocomplete", $.ui.autocomplete, {
                _renderItem : function (ul,item) {
                    var expr = new RegExp(this.term,"gi");
                    var answer = item.label.replace(expr,"<span class='search-suggestion-text'>"+ expr.exec(item.label) +"</span>");

                    return jQuery("<li>")
                        .append("<a>"+answer+"</a><hr/>")
                        .appendTo(ul);
                },

                _resizeMenu: function () {
                    var ul = this.menu.element;
                    ul.outerWidth(this.element.outerWidth());
                }
            });
            jQuery("#blog-search").blogSearchAutocomplete({
                source : function(request, response){
                    var results = jQuery.ui.autocomplete.filter(cws_opts.blog_post_titles,request.term);
                    response(results.splice(0,6));
                },
                select : function (event,ui) {
                    window.location = ui.item.url;
                }
            })
            jQuery("#searchform").submit(function () {
                if($.trim($("#blog-search").val()) === ""){
                    return false;
                }
            })
        }


        // Timer might not be necessary... sometimes the HTML tag didn't have the IE8 class
        setTimeout(CWS.ie8_placeholders, 500);

        // Tablets reported keeping disabled attribute on back button
        jQuery('.widget-jobsearch input, .widget-jobsearch select').removeProp('disabled');

        if (cws_opts && !cws_opts.accessible && jQuery('body.l-body').length === 0) {
            CWS.build_select2();
        }
        else if(jQuery('body.l-body').length){
            /****
             * ZEPHYR IGNORES SELECTS
             */
            jQuery(document).on('focus', '.w-form-row-field select', function(){
                jQuery(this).closest('.w-form-row').addClass('focused');
            });
            jQuery(document).on('blur', '.w-form-row-field select', function(){
                jQuery(this).closest('.w-form-row').removeClass('focused');
            });
            jQuery('select').each(function(index, input){
                var $input = jQuery(input),
                    $row = $input.closest('.w-form-row');
                if ($input.attr('type') == 'hidden') return;
                $row.toggleClass('not-empty', $input.val() != '');
                $input.on('input', function(){
                    $row.toggleClass('not-empty', $input.val() != '');
                });
            });
        }

        jQuery('.apply-btn').click(function () {
            if (!CWS.depersonalize) {
                if (window.current_job_id) {
                    CWS.track('lastjob_applied_id', window.current_job_id);
                }
                if (window.current_job_industry) {
                    CWS.track('lastjob_applied_industry', window.current_job_industry);
                }
                if (window.current_job_function) {
                    CWS.track('lastjob_applied_function', window.current_job_function);
                }
            }
        });

        jQuery('.jobcart-btn').click(function () {
            var ele = jQuery(this);
            CWS.toggle_job_cart(ele);
            return false;
        });
        jQuery('.jobcart-btn').keydown(function (e) {
            var which = e.which;
            if (which === 13 || which === 32) {
                e.preventDefault();
                e.target.click();
            }
        });

        var button_switch = jQuery('.personalize-check');
        if (button_switch.length > 0) {
            var depersonalize = CWS.cookies.getItem('depersonalize') || 0;
            button_switch.each(function () {
                var opts = jQuery(this).data();
                opts.checked = !Boolean(depersonalize);
                jQuery(this).switchButton(opts);
            });

            button_switch.change(CWS.depersonalize_toggle);
        }

        if ("geolocation" in navigator && window.location.protocol == 'https:') {
            jQuery('.geolocation-icon').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                navigator.geolocation.getCurrentPosition(CWS.geolocation_callback);
                return false;
            });
            jQuery('.geolocation-icon').on('keydown', function(event){
                switch (event.which) {
                    case 13:
                    case 32: {
                        $(event.target).click();

                        // Necessary?
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                }
            });
        }
        else {
            jQuery('.geolocation-icon,.leaflet-control-locate').hide();
        }

        CWS.init_mailchimp_listener();

        jQuery('#cws_quickjobsearch_keywords').keypress(function (e) {
            // The logic here is that if they select a suggested keyword, set it to fuzzy = 1. If they change the field otherwise, remove that value.
            if (e.keyCode != 13 // enter
                || !(e.keyCode >= 37 && e.keyCode <= 40) // arrow keys
                || e.keyCode != 9) { // tab
                jQuery('#cws_quickjobsearch_fuzzy').val('');
            }
        });

        // Keypress doesn't pick up backspace or delete... keyup does, but it also picks up shift/ctrl/alt etc
        jQuery('#cws_quickjobsearch_keywords').keyup(function (e) {
            if (e.keyCode == 8 || e.keyCode == 46) {
                jQuery('#cws_quickjobsearch_fuzzy').val('');
            }
        });

        // Stops search forms from submitting empty querystrings (GTM related)
        jQuery('#cws_quickjobsearch').submit(function () {
            // Clear radius if there are no coordinates
            if (jQuery('#cws_quickjobsearch_latitude') && !jQuery('#cws_quickjobsearch_latitude').val()) {
                jQuery('#cws_quickjobsearch_radius').val('');
            }

            // Need to save the google place to localstorage for search history widget
            else if(cws_opts && cws_opts.personalization){
                if(CWS.last_place && CWS.storageAvailable('localStorage')){
                    localStorage.setItem('last_place', JSON.stringify(CWS.last_place));
                }
            }

            var empty = true;
            jQuery(this).find('input,select').not(':input[type=button], :input[type=submit]').each(function () {
                if (jQuery.trim(jQuery(this).val()) === '') {
                    jQuery(this).attr('disabled', true);
                }
                else {
                    empty = false;
                }
            });

            if (empty) {
                window.location = jQuery(this).attr('action');
                return false;
            }
        });

        var geolocation_addr = CWS.cookies.getItem('geolocation_addr'),
            geolocation_lat = CWS.cookies.getItem('geolocation_lat'),
            geolocation_lon = CWS.cookies.getItem('geolocation_lon');

        if (geolocation_addr !== null && geolocation_lat !== null && geolocation_lon !== null && jQuery('#cws_quickjobsearch_latitude').length > 0) {
            jQuery('#cws_quickjobsearch_location').val(geolocation_addr);
            jQuery('#cws_quickjobsearch_latitude').val(geolocation_lat);
            jQuery('#cws_quickjobsearch_longitude').val(geolocation_lon);

            jQuery('.geolocation-icon').hide().parent().removeClass('with_geo');
        }

        // Store original referrer
        if (document.referrer && CWS.cookies.getItem('ref') === null) {
            try {
                // Nifty way to parse a URI
                var parser = document.createElement('a');
                parser.href = document.referrer;

                // Only setting this if the referrer is third party
                if (parser.hostname != window.location.hostname) {
                    var exp = new Date(Date.now() + (1000 * 60 * 60 * 3)); // 3 hours
                    parser.hostname = CWS.apply_filter('ref_set', parser.hostname);
                    CWS.cookies.setItem('ref', parser.hostname, exp, '/');
                }
            }
            catch (ex) {
                CWS.log(ex);
            }
        }


    });
})();

CWS._ = function (str) {
    // Mimicing Wordpress' __() function for translating strings
    if (cws_opts && cws_opts.localization && cws_opts.localization.hasOwnProperty(str)) {
        return cws_opts.localization[str];
    }
    return str;
};

CWS.init_tracking = function () {
    var $ = jQuery;
    $('.mc4wp-form').submit(function (e) {
        var firstname = $('.mc4wp-form [name="FNAME"]');
        var lastname = $('.mc4wp-form [name="LNAME"]');
        var email = $('.mc4wp-form [name="EMAIL"]');
        var area = $('.mc4wp-form [name="AREA"]');

        var hostNameArray = location.hostname.split(".");
        var tld = '.' + hostNameArray[hostNameArray.length - 2] + '.' + hostNameArray[hostNameArray.length - 1]; // ie, ".findly.com"

        var dt = new Date();
        var expDate = new Date(dt.getTime() + 1000 * 60 * 60);
        var exp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)); // 30 days

        if (firstname.length) {
            CWS.cookies.setItem('_vwo_firstname', firstname.val(), exp, '/', tld);
        }
        if (lastname.length) {
            CWS.cookies.setItem('_vwo_lastname', lastname.val(), exp, '/', tld);
        }
        if (email.length) {
            CWS.cookies.setItem('_vwo_email', email.val(), exp, '/', tld);
        }
        if (area.length) {
            CWS.cookies.setItem('_vwo_area', area.val(), exp, '/', tld);
        }

    });

    if(typeof window.current_job_id !== 'undefined'){
        // Tilde delimited list of last job ids viewed
        var curr = CWS.cookies.getItem('lvids') || '',
            job_id = window.current_job_id.toString();

        curr = curr === '' ? [] : curr.split('~');

        // Check if this job is already in there
        if(_.indexOf(curr, job_id) !== -1){
            return;
        }

        // Remove the last id if there are 10
        if(curr.length == 10){
            curr.pop();
        }

        curr.unshift(job_id);

        var dt = new Date();
        var exp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)); // 30 days
        CWS.cookies.setItem('lvids', curr.join('~'), exp, '/');
    }
};

CWS.build_recentviewed_list = function(){
    var $ = jQuery,
        widgets = $('.recently-viewed-jobs');

    if(widgets.length > 0) {
        var job_ids = CWS.cookies.getItem('lvids') || '';
        jobs_arr = job_ids === '' ? [] : job_ids.split('~');

        if(jobs_arr.length > 0){
            var data = {'facet': 'id:' + job_ids};
            $.ajax({
                url: '/wp-content/plugins/cws/includes/api.php',
                data: data,
                dataType: 'json',
                cache: true,
                success: function(jobs){
                    if(jobs && jobs.totalHits > 0){
                        jobs = jobs.queryResult;

                        // This is kinda silly but it doesn't come back in the order of our IDs (in order of last viewed)
                        var new_jobs = [];
                        for(var i = 0, len = jobs_arr.length; i < len; i++){
                            var that_job = _.findWhere(jobs, {id: parseInt(jobs_arr[i])});
                            if(that_job){
                                new_jobs.push(that_job);
                            }
                        }
                        jobs = new_jobs;

                        $('.recently-viewed-jobs').each(function () {
                            var title = decodeURIComponent($(this).data('title')).replace(/\+/g, ' '),
                                limit = parseInt($(this).data('limit'));

                            if(title) {
                                if (cws_opts.accessible) {
                                    title = '<div class="widgettitle">' + title + '</div>';
                                }
                                else {
                                    title = '<h2 class="widgettitle">' + title + '</h2>';
                                }
                            }

                            var html = '';
                            for(var i = 0, len = jobs.length; i < len && i < limit; i++){
                                html += '<div class="job-row ' + (i % 2 !== 0 ? 'alt' : '') + '"><a href="' + cws_opts.job_detail_path + '/' +jobs[i].id + '/' + CWS.seo_url(jobs[i]) + '">' + jobs[i].title + '</a></div>';
                            }

                            $(this).html(title + html);
                        });
                    }
                    else {
                        widgets.parent().hide();
                    }
                }
            });
        }
        else {
            $('.recently-viewed-jobs').each(function () {
                $(this).parent().hide();
            });
        }
    }
};

CWS.build_lastviewed_list = function(){
    var $ = jQuery,
        widgets = $('.joblist.catloc');

    if(widgets.length > 0) {
        var job_cat = CWS.cookies.getItem('_vwo_lastjob_viewed_category') || '';
        var job_loc = CWS.cookies.getItem('_vwo_lastjob_viewed_coords');
        var xcc_use_last_job_title = widgets.data('xcc-last-title');
        var noresults = widgets.data('noresults');
        var data = {sortfield: 'open_date', sortorder: 'descending', limit: widgets.data('limit')};

        if(xcc_use_last_job_title && XCLOUD && XCLOUD.personalize.logged_in()){
            $('.xcc-heading').each(function(){
                $(this).data('xcc-logged-out', $(this).html());
                $(this).html(XCLOUD.personalize.parse($(this).data('xcc-logged-in')));
                var last_job_title = XCLOUD.personalize.get('description'),
                    area_of_interest = XCLOUD.personalize.get('areaInterest');

                // Use last job title if it is set, otherwise area of interest
                if(last_job_title) {
                    data['SearchText'] = last_job_title;
                }
                else if(area_of_interest){
                    data['SearchText'] = area_of_interest;
                }
            });
        }
        else {
            if (job_cat) {
                data['facet'] = 'primary_category:' + job_cat;
            }
            if (job_loc !== null) {
                job_loc = job_loc.split(',');
                data['longitude'] = job_loc[0];
                data['latitude'] = job_loc[1];
                data['locationradius'] = 30;
            }
            if(typeof(current_job) !== 'undefined'){
                if(current_job.id){
                    data['notfacet'] = 'id:'+ current_job.id;
                }
            }
        }


        data = CWS.apply_filter('joblist_ajax_data', data);

        $.ajax({
            url     : '/wp-content/plugins/cws/includes/api.php',
            data    : data,
            dataType: 'json',
            cache   : true,
            success : function (jobs) {
                if (jobs && jobs.totalHits > 0) {
                    jobs = jobs.queryResult;

                    widgets.each(function () {
                        var tag = 'div';
                        if ($(this).is('ol') || $(this).is('ul')) {
                            tag = 'li';
                        }

                        var html = '';
                        for (var i = 0, len = jobs.length; i < len; i++) {
                            var custom_class = '';
                            if($(this).data('image-field')){
                                custom_class = CWS.str_to_css_class(jobs[i][$(this).data('image-field')]);
                            }

                            html += '<' + tag + ' class="widget_joblist_row ' + custom_class + ' ' + (i % 2 !== 0 ? 'alt' : '') + '">';
                            html += '<a href="' + cws_opts.job_detail_path + '/' + jobs[i].id + '/' + CWS.seo_url(jobs[i]) + '">' + jobs[i].title + '</a>';
                            if ($(this).data('category')) {
                                html += '<div class="widget_joblist_category">' + jobs[i]['primary_category'] + '</div>';
                            }
                            if ($(this).data('location')) {
                                html += '<div class="widget_joblist_loc">';
                                html += jobs[i]['primary_city'] + ( jobs[i]['primary_state'] ? ', ' + jobs[i]['primary_state'] : '' );
                                html += '</div>';
                            }
                            if($(this).data('posted-date') || $(this).data('posted-days') ){
                                html += '<div class="widget_joblist_posted">';
                                html += '<span class="posted-text">Posted: </span>';
                                html += '<span class="posted-date">';
                                var date = new Date(jobs[i]['open_date']);
                                if($(this).data('posted-date')) {
                                    html += (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                                }
                                else{
                                    var seconds = (new Date() - date) / 1000;
                                    var days = Math.floor(seconds / 86400);
                                    seconds %= 86400;
                                    var hours = Math.floor(seconds / 3600);

                                    if(days > 0) {
                                        html += days + ' days ago';
                                    }
                                    else{
                                        html += hours + ' hours ago';
                                    }
                                }
                                html += '</span>';
                                html += '</div>';
                            }
                            html += '</' + tag + '>';
                        }

                        $(this).html(html);
                    });
                }
                else {
                    widgets.html(noresults);
                }
            }
        });
    }
};

CWS.build_search_history = function(){
    if(CWS.storageAvailable('localStorage')){
        var $ = jQuery,
            widgets = $('.search-history'),
            list = localStorage.getItem('last_searches'),
            limit = parseInt(widgets.data('limit'));

        if(list){
            list = list.split('|');
            var title = decodeURIComponent(widgets.data('title')).replace(/\+/g, ' '),
                html = '';

            if(title) {
                if (cws_opts.accessible) {
                    title = '<div class="widgettitle">' + title + '</div>';
                }
                else {
                    title = '<h2 class="widgettitle">' + title + '</h2>';
                }
            }

            var i = list.length, num = 0;
            while(i-- && num < limit){
                var srch = list[i].split('~');
                var str = srch[0];
                var url = srch[1];

                html += '<div class="last-search-row ' + (num % 2 !== 0 ? 'alt' : '') + '">';
                html += '<a href="' + url + '" clas="search-history-link">' + str + '</a>';
                html += '<a href="#" class="search-history-delete" onclick="CWS.remove_search_history(' + i + '); return false;">&times;</a>';
                html += '</div>';
                num++;
            }

            widgets.html(title + html);
        }
        else{
            widgets.parent().hide();
        }
    }
};

CWS.remove_search_history = function(index){
    if(index === null){
        localStorage.removeItem('last_searches');
    }
    else{
        var list = localStorage.getItem('last_searches');
        if(list){
            list = list.split('|');
            list.splice(index, 1);
            localStorage.setItem('last_searches', list.join('|'));
        }
    }
    CWS.build_search_history();
};

CWS.storageAvailable = function(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
};

CWS.track = function (name, value) {
    if (!CWS.depersonalize) {
        var hostNameArray = location.hostname.split(".");
        var tld = '.' + hostNameArray[hostNameArray.length - 2] + '.' + hostNameArray[hostNameArray.length - 1]; // ie, ".findly.com"

        var dt = new Date();
        var expDate = new Date(dt.getTime() + 1000 * 60 * 60);
        var exp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)); // 30 days

        CWS.cookies.setItem('_vwo_' + name, value, exp, '/');
    }
};

CWS.geolocation_callback = function (position) {
    var $ = jQuery;

    $.ajax({
        url: 'https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&json_callback=CWS_location_callback&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude,
        dataType: 'jsonp',
        crossDomain: true,
        cache: true,
        jsonpCallback: 'mapCallback',
        success: CWS_location_callback
    });
};

var CWS_location_callback = function (data) {
    var $ = jQuery;
    if (data && data.address) {
        $('#cws_quickjobsearch_latitude,#cws_jobsearch_latitude').val(data.lat);
        $('#cws_quickjobsearch_longitude,#cws_jobsearch_longitude').val(data.lon);

        data.address.state = CWS.state_codes.hasOwnProperty(data.address.state) ? CWS.state_codes[data.address.state] : data.address.state;

        if ($('#cws_jobsearch_nationwide_country').length > 0 || $('#cws_quickjobsearch_nationwide').length > 0) {
            $('#cws_jobsearch_nationwide_country,#cws_quickjobsearch_nationwide').val(data.address.country_code.toUpperCase());
            $('#cws_jobsearch_statewide_state,#cws_quickjobsearch_statewide').val(data.address.state);
        }

        var formatted = data.address.city || data.address.county;
        formatted += data.address.state ? ', ' + data.address.state : '';
        formatted += data.address.country_code ? ', ' + data.address.country_code.toUpperCase() : '';

        /*var formatted = data.address.city + ', ' + data.address.state + ', ' + data.address.country_code.toUpperCase();
        
		if(data.address.city != undefined){
            formatted += data.address.city + ', ';
        }

        if(data.address.state != undefined){
            formatted += data.address.state + ', ';
        }

        if(data.address.country_code != undefined){
            formatted += data.address.country_code.toUpperCase();
        }*/

        $('#cws_quickjobsearch_location,#cws_jobsearch_location').val(formatted);

        // Clear out other fields just in case
        $('#cws_quickjobsearch_state,#cws_quickjobsearch_country,#cws_jobsearch_state,#cws_jobsearch_country').val('');

        $('.geolocation-icon').hide().parent().removeClass('with_geo');

        var dt = new Date();
        var expDate = new Date(dt.getTime() + 1000 * 60 * 60);
        var exp = new Date(Date.now() + (1000 * 60 * 60));

        CWS.cookies.setItem('geolocation_addr', formatted, expDate.toUTCString(), '/');
        CWS.cookies.setItem('geolocation_lat', data.lat, expDate.toUTCString(), '/');
        CWS.cookies.setItem('geolocation_lon', data.lon, expDate.toUTCString(), '/');

        if (CWS.jobs && $('#cws_jobsearch_latitude').length > 0) {
            CWS.jobs.gather();
        }
    }
    else {
        CWS.log('Reverse geocoding failed.');
        CWS.log(data);
    }
};

CWS.last_place = null;
CWS_init_autocomplete = function () {
    var input = document.getElementById('cws_quickjobsearch_location');
    var autocomplete;

    // Quick search
    if (input && jQuery(input).is('input') && google && google.maps && google.maps.places) { // lol
        /******* THIS SECTION SELECTS THE FIRST LOCATION ON ENTER **********/
            // jQuery doesn't return an event object, so we need to check for IE-compatibility
        var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

        function addEventListenerWrapper(type, listener) {
            // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
            // and then trigger the original listener.
            if (type == "keydown") {
                var orig_listener = listener;
                listener = function (event) {
                    var suggestion_selected = jQuery(".pac-item-selected").length > 0;
                    if (event.which == 13 && !suggestion_selected) {
                        var simulated_downarrow = jQuery.Event("keydown", {keyCode: 40, which: 40});
                        orig_listener.apply(input, [simulated_downarrow]);

                        if (jQuery(".pac-container").css('display') != 'none') {
                            event.preventDefault();
                        }
                    }

                    orig_listener.apply(input, [event]);
                };
            }

            // add the modified listener
            _addEventListener.apply(input, [type, listener]);
        }

        // More IE-checks
        if (input.addEventListener) {
            input.addEventListener = addEventListenerWrapper;
        }
        else if (input.attachEvent) {
            input.attachEvent = addEventListenerWrapper;
        }
        /********************* END HACK *************************/

        /*autocomplete = new google.maps.places.Autocomplete(input,
            {
                'types': ['geocode']
            });*/

        var location_type = cws_opts.google_place_search_type; // For getting Default Search type

        if(location_type == 'all' || location_type == ''){ //comparing with null if Search type is not set/configured.
            var place_set_type = {
                'types': []  // for all types initialize to null
            };
            location_type = '';
        }else{
            var place_set_type = {
                'types': [location_type]
            };
        }

        autocomplete = new google.maps.places.Autocomplete(input, place_set_type);

        autocomplete.setTypes([location_type]);

        google.maps.event.addListener(autocomplete, 'place_changed', function (e) {
            // It should be safe to show the geolocation icon again assuming the location changed by user input
            jQuery('.location-wrapper .geolocation-icon').show().parent().addClass('with_geo');

            var place = autocomplete.getPlace();
            if (place && place.geometry) {
                if (place.address_components[0]['types'][0] === 'country') {
                    jQuery('#cws_quickjobsearch_country').val(place.address_components[0]['short_name']);
                }
                else if (place.address_components[0]['types'][0] === 'administrative_area_level_1') {
                    jQuery('#cws_quickjobsearch_state').val(place.address_components[0]['short_name']);
                    if (place.address_components[1]['types'][0] === 'country') {
                        jQuery('#cws_quickjobsearch_country').val(place.address_components[1]['short_name']);
                    }
                }
                else {
                    jQuery('#cws_quickjobsearch_latitude').val(place.geometry.location.lat());
                    jQuery('#cws_quickjobsearch_longitude').val(place.geometry.location.lng());
                }

                // We don't need many checks for location type. If the nationwide/statewide field doesn't exist, they disappear from the url.
                var state_country = CWS.get_state_country(place.address_components);
                if (state_country.country) {
                    jQuery('#cws_quickjobsearch_nationwide').val(state_country.country);
                }
                if (state_country.state) {
                    jQuery('#cws_quickjobsearch_statewide').val(state_country.state);
                }
                CWS.last_place = place;
            }
        });
    }

    jQuery(input).keyup(function (e) {
        if (e.keyCode == 13 && jQuery(".pac-container").css('display') != 'none') {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(function () {
                CWS.aria_live(jQuery(input).val() + ' selected.', true);
            }, 500);
            return false;
        }

        if (jQuery(input).val() === '') {
            jQuery('.location-wrapper .geolocation-icon').show().parent().addClass('with_geo');
        }
    });
    jQuery(input).on('focus', function (e) {
        CWS.aria_live('Type a location, and use the down arrow to select a suggestion.', true);
    });
    jQuery(input).keyup(function (e) {
        var $ = jQuery;
        // Up, down arrows
        if (e.keyCode == 40 || e.keyCode == 38) {
            if ($('.pac-container').css('display') == 'none' || $('.pac-item').length == 0) {
                CWS.aria_live('No locations match your input.', true);
            }
            else if ($('.pac-item-selected').length > 0) {
                CWS.aria_live($('.pac-item-selected .pac-item-query').text() + ', ' + $('.pac-item-selected > span:last-child').text(), true);
            }
        }
    });

    // Full search
    if (CWS && CWS.jobs) {
        CWS.jobs.init_loc_autocomplete();
    }
};

CWS.apply_lightbox = function (e) {
    var $ = jQuery;
    $this = $(this);
    jQuery.magnificPopup({
        items: {
            src: $this.attr('href')
        },
        type: 'iframe'
    });
};

CWS.init_enhanced_keyword_search = function(){
    /*Enhanced Keyword Search Job Overlay*/
    if (cws_opts && (cws_opts.enhanced_keyword_search_job_overlay_keyup || cws_opts.enhanced_keyword_search_job_overlay_focus) && !cws_opts.accessible) {
        if (cws_opts.enhanced_keyword_search_job_overlay_focus.length > 0 || cws_opts.enhanced_keyword_search_job_overlay_focus.length > 0) {
            /*Initial check whether recent enhanced search available in localstorage*/
            if(CWS.storageAvailable('localStorage')) {
                var recent_enhanced_search_inti = localStorage.getItem('recent_enhanced_search');
                if(recent_enhanced_search_inti !== null ) {
                    recent_enhanced_search_inti = JSON.parse(localStorage.getItem('recent_enhanced_search'));
                    if (recent_enhanced_search_inti.length > 0) {
                        for (var i = 0; i < recent_enhanced_search_inti.length; i++) {
                            cws_opts.enhanced_keyword_search_job_overlay_keyup.push(recent_enhanced_search_inti[i]);
                        }
                    }
                }

                if(typeof xcloud_client !== 'undefined') {
                    if(xcloud_client !== null) {
                        var candidate_peference = localStorage.getItem(xcloud_client + '.candidate');
                        if (candidate_peference !== null) {
                            candidate_peference = JSON.parse(JSON.parse(JSON.parse(candidate_peference).data).preferences);
                            $.each(candidate_peference, function(key,prefer) {
                                if($.isArray(prefer)) {
                                    $.each(prefer, function (key2, value2) {
                                        prefer[key2] = value2.toLowerCase();
                                    });
                                }
                            });
                            $.each(candidate_peference, function(key,prefer){
                                if (key === 'areaOfInterest') {
                                    cws_opts.enhanced_keyword_search_job_overlay_focus.map(function (options) {
                                        if($.inArray(options.value.toLocaleLowerCase(), prefer) !== -1){
                                            cws_opts.enhanced_keyword_search_job_overlay_logged_focus.push(options);
                                        }
                                    });
                                } else if (key === 'jobTitle') {
                                    cws_opts.enhanced_keyword_search_job_overlay_title.map(function (options) {
                                        if($.inArray(options.value.toLocaleLowerCase(), prefer) !== -1){
                                            cws_opts.enhanced_keyword_search_job_overlay_logged_focus.push(options);
                                        }
                                    });
                                } else if (key === 'location') {
                                    cws_opts.enhanced_keyword_search_job_overlay_location.map(function (options) {
                                        var newLoc = options.value.toLocaleLowerCase().split(", ");
                                        newLoc = newLoc[1]+','+newLoc[0];
                                        if($.inArray(newLoc, prefer) !== -1){
                                            cws_opts.enhanced_keyword_search_job_overlay_logged_focus.push(options);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            }

            if(jQuery(".enhanced_keyword_search_overlay_suggest").val() !== undefined){
                jQuery(".enhanced_keyword_search_overlay_suggest").val('');
            }

            $(".enhanced_keyword_search_overlay_suggest").catcomplete({
                source: function (request, response) {
                    if ((request.term || '').length <= 0) {
                        $('#eos-clear-search').css('display', 'none');
                        if(cws_opts.enhanced_keyword_search_job_overlay_logged_focus.length > 0){
                            response(filter(cws_opts.enhanced_keyword_search_job_overlay_logged_focus, request.term));
                        }else {
                            response(filter(cws_opts.enhanced_keyword_search_job_overlay_focus, request.term));
                        }
                    }
                    else{
                        $('#eos-clear-search').css('display', 'block');
                        response(filter(cws_opts.enhanced_keyword_search_job_overlay_keyup, request.term));
                    }
                }
                ,
                minLength: 0,
                select   : function (e, ui) {
                    // Need to make sure the value isn't html encoded...
                    var val = $("<div/>").html(ui.item.value).text();
                    ui.item.value = val;

                    // See document-ready function above for how this value is removed
                    if ($('#cws_quickjobsearch_fuzzy')) {
                        $('#cws_quickjobsearch_fuzzy').val('false');
                    }

                    if (ui.item.category === 'Job Category') {
                        $("#cws_quickjobsearch_overlay_category").val($.trim(ui.item.value));
                        $("#cws_quickjobsearch_overlay_location").val('');
                        $("#cws_quickjobsearch_overlay_keyword").val('');
                    } else if (ui.item.category === 'Job Location') {
                        $("#cws_quickjobsearch_overlay_location").val($.trim(ui.item.value));
                        $("#cws_quickjobsearch_overlay_category").val('');
                        $("#cws_quickjobsearch_overlay_keyword").val('');
                    } else {
                        $("#cws_quickjobsearch_overlay_keyword").val($.trim(ui.item.value));
                        $("#cws_quickjobsearch_overlay_category").val('');
                        $("#cws_quickjobsearch_overlay_location").val('');
                    }

                    if($.trim(ui.item.value).length > 0){
                        $('#eos-clear-search').css('display', 'block');
                    }
                    $(".enhanced_keyword_search_overlay_suggest").val(ui.item.value);
                    jQuery('#cws_enhanced_keyword_search_overlay').submit();
                },
                change   : function (event, ui) {
                    if (ui.item === null) {
                        $("#cws_quickjobsearch_overlay_category").val('');
                        $("#cws_quickjobsearch_overlay_location").val('');
                        $("#cws_quickjobsearch_overlay_keyword").val('');
                    }
                }
            });

            $(".enhanced_keyword_search_overlay_suggest").on('focus', function () {
                $(".enhanced_keyword_search_overlay_suggest").catcomplete("search");
            });


            function filter(array, searchTerm) {
                var matchingItems = [];
                for (var i = 0; i < array.length; i++) {
                    if(searchTerm.length >0 && searchTerm !== null) {
                        if (array[i].value.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >= 0)
                            matchingItems.push(array[i]);
                    }else{
                        matchingItems.push(array[i]);
                    }
                }
                return matchingItems;
            }

            $('#eos-clear-search').on('click', function () {
                $("#cws_quickjobsearch_overlay_category").val('');
                $("#cws_quickjobsearch_overlay_location").val('');
                $("#cws_quickjobsearch_overlay_keyword").val('');
                $(".enhanced_keyword_search_overlay_suggest").val('');
                $('#eos-clear-search').css('display', 'none');
            });

            jQuery('#cws_enhanced_keyword_search_overlay').submit(function (e) {
                // e.preventDefault();
                var customOverlaySuggest = $(".enhanced_keyword_search_overlay_suggest").val();
                $(".enhanced_keyword_search_overlay_suggest").val('');
                $(".enhanced_keyword_search_overlay_suggest").attr('disabled', true);
                if (customOverlaySuggest.length === 0) {
                    $("#cws_quickjobsearch_overlay_category").val('');
                    $("#cws_quickjobsearch_overlay_location").val('');
                    $("#cws_quickjobsearch_overlay_keyword").val('');
                }

                if (customOverlaySuggest.length > 0
                    && $("#cws_quickjobsearch_overlay_category").val().length === 0
                    && $("#cws_quickjobsearch_overlay_location").val().length === 0
                    && $("#cws_quickjobsearch_overlay_keyword").val().length === 0
                ) {
                    $("#cws_quickjobsearch_overlay_keyword").val(customOverlaySuggest);
                    if(CWS.storageAvailable('localStorage')) {
                        var recent_enhanced_search = JSON.parse(localStorage.getItem('recent_enhanced_search'));
                        if(recent_enhanced_search !== null) {
                            if (recent_enhanced_search.length > 0) {
                                for (var i = 0; i < recent_enhanced_search.length; i++) {
                                    if (recent_enhanced_search[i].value.toLocaleLowerCase().indexOf(customOverlaySuggest.toLocaleLowerCase()) === -1) {
                                        new_recent_enhanced_search = {
                                            'category'  : 'Recent Search',
                                            'label'     : customOverlaySuggest,
                                            'value'     : customOverlaySuggest,
                                            'count'     : ''
                                        };
                                        recent_enhanced_search.push(new_recent_enhanced_search);
                                    }
                                }
                            }
                        }
                        else{
                            recent_enhanced_search = [];
                            new_recent_enhanced_search = {
                                'category'  : 'Recent Search',
                                'label'     : customOverlaySuggest,
                                'value'     : customOverlaySuggest,
                                'count'     : ''
                            };
                            recent_enhanced_search.push(new_recent_enhanced_search);
                        }
                        localStorage.setItem('recent_enhanced_search', JSON.stringify(recent_enhanced_search));
                    }
                }

                var empty = true;
                jQuery(this).find('input,select').not(':input[type=button], :input[type=submit]').each(function () {
                    if (jQuery.trim(jQuery(this).val()) === '') {
                        jQuery(this).attr('disabled', true);
                    }
                    /*else {
                        empty = false;
                    }*/
                });
                /*if (empty) {
                    window.location = jQuery(this).attr('action');
                    return false;
                }*/
            });
        }
    }
};

CWS.init_keyword_autocomplete = function () {
    var $ = jQuery;
    if (cws_opts && !cws_opts.accessible) {
        if(cws_opts.title_autocomplete === null && cws_opts.api.indexOf('googleapi') === -1){
            $.get(
                '/wp-json/cws/autocomplete',
                function(data){
                    if(data) {
                        cws_opts.title_autocomplete = data;

                        // Just recall this function now that the data isn't null
                        CWS.init_keyword_autocomplete();
                    }
                }
            );
            return;
        }

        $('.keyword_suggest').each(function () {
            var limit = $(this).data('autocomplete_limit') || 10;

            $(this).autocomplete(CWS.apply_filter('keyword_autocomplete_options', {
                html: true,
                source: function (request, response) {
                    var results = $.ui.autocomplete.filter(cws_opts.title_autocomplete, request.term);
                    results = results.slice(0, limit)
                    results = $.map(results, function (n, i) {
                        var decoded = $("<div/>").html(n).text();
                        return decoded;
                    });

                    response(results);
                },
                select: function (e, ui) {
                    // Need to make sure the value isn't html encoded...
                    var val = $("<div/>").html(ui.item.value).text();
                    ui.item.value = val;

                    console.log(ui);

                    // See document-ready function above for how this value is removed
                    if ($('#cws_quickjobsearch_fuzzy')) {
                        $('#cws_quickjobsearch_fuzzy').val('false');
                    }
                    // If part of the full search, we want to try to
                    if ($(this).data('param') && typeof CWS.jobs !== 'undefined' && $('#loader').length > 0) {
                        //$('.widget-jobsearch-full').find('#cws-adv-search-btn').click();
                        e.stopPropagation();
                        e.preventDefault();
                        e.ui = ui;
                        CWS.jobs.gather(e);
                    }
                }
            }));
        });
    }

    if (cws_opts && (cws_opts.enhanced_keyword_search_job_overlay_keyup || cws_opts.enhanced_keyword_search_job_overlay_focus) && !cws_opts.accessible) {
        if(cws_opts.enhanced_keyword_search_job_overlay_focus.length > 0 || cws_opts.enhanced_keyword_search_job_overlay_focus.length > 0) {
            // Need to decode html entities first. But only once.



            if (!cws_opts.decoded) {
                $.map(cws_opts.title_autocomplete, function (n, i) {
                    var decoded = $("<div/>").html(n).text();
                    return decoded;
                });
                cws_opts.decoded = true;
            }

            $.widget("custom.catcomplete", $.ui.autocomplete, {
                _create    : function () {
                    this._super();
                    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
                },
                _renderMenu: function (ul, items) {
                    var that = this,
                        currentCategory = "";
                    $.each(items, function (index, item) {
                        var li;
                        if (item.category != currentCategory) {
                            ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                            currentCategory = item.category;
                        }
                        li = that._renderItemData(ul, item);
                        if (item.category) {
                            li.attr("aria-label", item.category + " : " + item.label);
                        }
                    });
                },

                _renderItem: function (ul, item) {
                    ul.addClass('enhanced-search-job-overlay');
                    var re = new RegExp(this.term, "i");
                    var t = '<span class="pr10">' + item.label.replace(re, "<span class='ui-selected-dropdown'>" + this.term + "</span>") + '</span>';
                    t += '<span class="ui-jobcount">' + item.count + '</span>';
                    return $("<li></li>")
                        .data("item.autocomplete", item)
                        .append("<a>" + t + "</a>")
                        .appendTo(ul);
                },
                _resizeMenu: function () {
                    var ul = this.menu.element;
                    ul.outerWidth(this.element.outerWidth());
                }
            });
            CWS.init_enhanced_keyword_search();
        }
    }
};

CWS.date_format = 'F j, Y';

CWS.cookies = {
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

CWS.depersonalize = CWS.cookies.getItem('depersonalize');

// Filter system very similar to Wordpress
CWS.filters = {};
CWS.add_filter = function (filter_name, filter_function) {
    if (typeof filter_function == 'function') {
        if (!CWS.filters.hasOwnProperty(filter_name)) {
            CWS.filters[filter_name] = [];
        }
        CWS.filters[filter_name].push(filter_function);
    }
};
CWS.apply_filter = function (filter_name, obj) {
    if (CWS.filters.hasOwnProperty(filter_name)) {
        for (var i = 0, len = CWS.filters[filter_name].length; i < len; i++) {
            // by passing in "arguments" minus the filter name, we can pass more than one
            //console.log(Array.prototype.slice.call(arguments, 1));
            //if(arguments.length > 2) {
            obj = CWS.filters[filter_name][i].apply(this, Array.prototype.slice.call(arguments, 1));
            //}
            /*
            else{
                CWS.filters[filter_name][i](obj);
            }
            */
        }
    }
    return obj;
};

CWS.location = (function($){
    var data = {
        city: '',
        state: '',
        country: '',
        country_code: '',
        latitude: '',
        longitude: '',
        ajax_active: false,
        enabled: typeof geoip2 !== 'undefined'
    };

    set_data = function(loc) {
        if(loc === null){
            loc = CWS.cookies.getItem('loc');
        }
        loc = loc.split('|');
        data.latitude = loc[1];
        data.longitude = loc[2];
        data.city = loc[3];
        data.state = loc[4];
        data.country_code = loc[5];
        data.country = loc[6];
        CWS.log(loc);
    };

    if(loc = CWS.cookies.getItem('loc')){
        set_data(loc);
    }
    else{
        // transfer cws.ip2location.js to here
    }

    return {
        'get': function(prop){
            return data[prop];
        },
        'set': set_data
    };
})(jQuery);

CWS.buttons = (function($){
    // This will need to be updated when we have more than one theme obviously
    var theme = $('body.l-body').length === 0 ? 'enfold' : 'zephyr';

    // Based on the above var, we need to figure out the classes
    var button_classes = {
        'enfold': 'avia-button',
        'zephyr': 'w-btn'
    };
    var button_types = {
        'enfold': {
            'primary': 'avia-color-theme-color',
            'secondary': 'avia-color-theme-color-subtle'
        },
        'zephyr': {
            'primary': 'color_primary',
            'secondary': 'color_secondary'
        }
    };
    var button_sizes = {
        'enfold': {
            'small': 'avia-size-small',
            'medium': 'avia-size-medium',
            'large': 'avia-size-large'
        },
        'zephyr': {
            'small': 'size_medium',
            'medium': 'size_medium',
            'large': 'size_large'
        }
    };

    return {
        'class': function(type, size, custom){
            type = type ? button_types[theme][type] : button_types[theme]['primary'];
            size = size ? button_sizes[theme][type] : button_sizes[theme]['medium'];
            custom = custom || '';
            custom = !custom && theme === 'zephyr' ? 'style_raised' : custom;

            return button_classes[theme] + ' ' + type + ' ' + size + ' ' + custom;
        },
        base: function(thm){
            if(thm){
                return button_classes[thm];
            }
            return button_classes[theme];
        },
        color: function (thm, clr){
            if(thm && clr){
                return button_types[thm][clr];
            }
            return button_types[theme]['primary'];
        },
        theme: function(){
            return theme;
        },
        init: function(){
            $(document).ready(function(){
                theme = $('body.l-body').length === 0 ? 'enfold' : 'zephyr';
            })
        }
    };
})(jQuery);
CWS.buttons.init();

searchToggle = function () {
    if (jQuery('#toggleAdvSearch').hasClass('close')) {
        CWS.aria_live('Collapsing', true);
        setTimeout(function () {
            //jQuery('#toggleAdvSearch').attr('aria-label', CWS._('Expand the search form')).focus();
            jQuery('#yourElementId').prop('title', 'Search Jobs - Collapsed');
            jQuery('#toggleAdvSearch').attr('aria-label', CWS._('Search Jobs - Collapsed')).focus();
        }, 200);
    }
    else {
        CWS.aria_live('Expanding', true);
        setTimeout(function () {
            //jQuery('#toggleAdvSearch').attr('aria-label', CWS._('Collapse the search form')).focus();
            jQuery('#yourElementId').prop('title', 'Search Jobs - Expanded');
            jQuery('#toggleAdvSearch').attr('aria-label', CWS._('Search Jobs - Expanded')).focus();
        }, 200);
    }
    jQuery('#cws-search-form').slideToggle();
    jQuery('#toggleAdvSearch').toggleClass('close');
    return false;
}

// MProgress loading bars
// https://github.com/lightningtgc/MProgress.js
// @formatter:off
;
(function(){"use strict";var t={extend:function(t,e){if(e=JSON.parse(JSON.stringify(e)),"string"==typeof t)return e;var s,r;for(var s in t)r=t[s],t.hasOwnProperty(s)&&void 0!==r&&(e[s]=r);return e},queue:function(){function t(){var s=e.shift();s&&s(t)}var e=[];return function(s){e.push(s),1==e.length&&t()}}(),setcss:function(){function t(t){return t.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(t,e){return e.toUpperCase()})}function e(t){var e=document.body.style;if(t in e)return t;for(var s,r=i.length,n=t.charAt(0).toUpperCase()+t.slice(1);r--;)if(s=i[r]+n,s in e)return s;return t}function s(s){return s=t(s),n[s]||(n[s]=e(s))}function r(t,e,r){e=s(e),t.style[e]=r}var i=["Webkit","O","Moz","ms"],n={};return function(t,e){var s,i,n=arguments;if(2==n.length)for(s in e)i=e[s],void 0!==i&&e.hasOwnProperty(s)&&r(t,s,i);else r(t,n[1],n[2])}}(),clamp:function(t,e,s){return e>t?e:t>s?s:t},toBarPerc:function(t){return 100*(-1+t)},hasClass:function(e,s){var r="string"==typeof e?e:t.classList(e);return r.indexOf(" "+s+" ")>=0},addClass:function(e,s){var r=t.classList(e),i=r+s;t.hasClass(r,s)||(e.className=i.substring(1))},removeClass:function(e,s){var r,i=t.classList(e);t.hasClass(e,s)&&(r=i.replace(" "+s+" "," "),e.className=r.substring(1,r.length-1))},showEl:function(e){t.setcss(e,{display:"block"})},hideEl:function(e){t.setcss(e,{display:"none"})},classList:function(t){return(" "+(t.className||"")+" ").replace(/\s+/gi," ")},removeElement:function(t){t&&t.parentNode&&t.parentNode.removeChild(t)}},e=t;!function(t,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():t.Mprogress=e()}("undefined"!=typeof window?window:this,function(){var t={template:1,parent:"body",start:!1,minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800},s="99",r=500,i=1500,n='[role="mpbar"]',o='[role="bufferBar"]',a='[role="dashed"]',u={determinate:'<div class="deter-bar" role="mpbar1"><div class="peg"></div></div><div class="bar-bg"></div>',buffer:'<div class="deter-bar" role="mpbar2"><div class="peg"></div></div><div class="buffer-bg" role="bufferBar"></div><div class="mp-ui-dashed" role="dashed"></div>',indeterminate:'<div class="indeter-bar" role="mpbar3"></div><div class="bar-bg"></div>',query:'<div class="query-bar" role="mpbar4"><div class="peg"></div></div><div class="bar-bg"></div>'},l={},f=function(s){var r=e.extend(s,t),i=r.parent+r.template,n=l[i]||"";return n||(n=new d(r),l[i]=n),"string"==typeof s&&"function"==typeof n[s]?n[s]():r.start&&n.start(),n},d=function(t){this.options=t||{},this.status=null,this.bufferStatus=null};return d.prototype={version:"0.1.0",constructor:d,start:function(){function t(){setTimeout(function(){s.status&&(s._trickle(),t())},s.options.trickleSpeed)}if(this.status||this._isBufferStyle()||this.set(0),this._isIndeterminateStyle()||this._isQueryStyle())return this;var s=this;if(this._isBufferStyle()&&!this.bufferStatus){var i=this._render(),n=i.querySelector(a),o=i.querySelector(this._getCurrSelector());e.hideEl(o),e.hideEl(n),this.setBuffer(0).setBuffer(1),setTimeout(function(){e.showEl(n),e.showEl(o),s.set(0).setBuffer(0)},r)}return this.options.trickle&&t(),this},end:function(t){if(!t&&!this.status)return this;var s=this,n=this.options.speed,o=this._getRenderedId();if(this._isBufferStyle()&&t)return this.set(0).set(1);if(this._isIndeterminateStyle())return!this._isRendered()&&t&&(this.set(0),o=this._getRenderedId(),n=r),e.setcss(o,{transition:"none",opacity:1}),o.offsetWidth,setTimeout(function(){e.setcss(o,{transition:"all "+n+"ms linear",opacity:0}),setTimeout(function(){s._remove()},n)},n),this;if(this._isQueryStyle()){if(this._isRendered()){var a=o.querySelector(this._getCurrSelector());return e.addClass(a,"end"),setTimeout(function(){s._remove()},i),this}if(t)return this.set(0),o=this._getRenderedId(),setTimeout(function(){s._remove()},i),this}return this.inc(.3+.5*Math.random()).set(1)},set:function(t){return t=e.clamp(t,this.options.minimum,1),this.status=1===t?null:t,this._setProgress(this._getCurrSelector(),t),this},setBuffer:function(t){return t=e.clamp(t,this.options.minimum,1),this.bufferStatus=1===t?null:t,this._setProgress(o,t),this},inc:function(t){var e=this.status,s=this.bufferStatus;return e?(e=this._getRandomNum(e,t),this._isBufferStyle()&&(s=this._getRandomNum(s>e?s:e+.1,t),this.setBuffer(s)),this.set(e)):this.start()},_trickle:function(){return this.inc(Math.random()*this.options.trickleRate)},_render:function(t){if(this._isRendered())return this._getRenderedId();var s,r=document.createElement("div"),i=this._getCurrTemplate()||"",n=document.querySelector(this.options.parent);if(r.id=this._getRenderedId(!0),r.className="ui-mprogress",r.innerHTML=i,!this._isIndeterminateStyle()&&!this._isQueryStyle()){t||(s=!this._isStarted());var a=r.querySelector(this._getCurrSelector()),u=s?"-100":e.toBarPerc(this.status||0);if(e.setcss(a,{transition:"all 0 linear",transform:"translate3d("+u+"%,0,0)"}),this._isBufferStyle()){var l=r.querySelector(o),f=s?"-100":e.toBarPerc(this.bufferStatus||0);e.setcss(l,{transition:"all 0 linear",transform:"translate3d("+f+"%,0,0)"})}}return n!=document.body&&e.addClass(n,"mprogress-custom-parent"),n.appendChild(r),r},_remove:function(){var t=this._getRenderedId(),s=document.querySelector(this.options.parent);s!=document.body&&e.removeClass(s,"mprogress-custom-parent");var r=this.options.parent+this.options.template;l[r]&&(l[r]=null),t&&(this.status=null,this.bufferStatus=null,e.removeElement(t))},_setProgress:function(t,s){var r=this._render(),i=r.querySelector(t),n=this.options.speed,o=this.options.easing,a=this;return r.offsetWidth,this._isIndeterminateStyle()||this._isQueryStyle()?this:void e.queue(function(t){""===a.options.positionUsing&&(a.options.positionUsing=a._getPositioningCSS()),e.setcss(i,a._barPositionCSS(s,n,o)),1===s?(e.setcss(r,{transition:"none",opacity:1}),r.offsetWidth,setTimeout(function(){e.setcss(r,{transition:"all "+n+"ms linear",opacity:0}),setTimeout(function(){a._remove(),t()},n)},n)):setTimeout(t,n)})},_getCurrSelector:function(){var t=this._getCurrTplId();return t!==s?'[role="mpbar'+t+'"]':n},_isStarted:function(){return"number"==typeof this.status},_getRandomNum:function(t,s){return"number"!=typeof s&&(s=(1-t)*e.clamp(Math.random()*t,.1,.95)),t=e.clamp(t+s,0,.994)},_isRendered:function(){return!!this._getRenderedId()},_getRenderedId:function(t){var e=this._getCurrTplId(),s="mprogress"+e;return t?s:document.getElementById(s)},_isBufferStyle:function(){return 2===this._getCurrTplId()},_isIndeterminateStyle:function(){return 3===this._getCurrTplId()},_isQueryStyle:function(){return 4===this._getCurrTplId()},_getCurrTplId:function(){var t=~~this.options.template||1;return"number"==typeof t?t:s},_getCurrTemplate:function(){var t,e=this.options.template||1,s=["determinate","buffer","indeterminate","query"];return"number"==typeof~~e?(t=s[e-1],u[t]||""):"string"==typeof e?template:void 0},_getPositioningCSS:function(){var t=document.body.style,e="WebkitTransform"in t?"Webkit":"MozTransform"in t?"Moz":"msTransform"in t?"ms":"OTransform"in t?"O":"";return e+"Perspective"in t?"translate3d":e+"Transform"in t?"translate":"margin"},_barPositionCSS:function(t,s,r){var i;return i="translate3d"===this.options.positionUsing?{transform:"translate3d("+e.toBarPerc(t)+"%,0,0)"}:"translate"===this.options.positionUsing?{transform:"translate("+e.toBarPerc(t)+"%,0)"}:{"margin-left":e.toBarPerc(t)+"%"},i.transition="all "+s+"ms "+r,i}},function(){var t=0,e=0;d.prototype.promise=function(s){if(!s||"resolved"==s.state())return this;var r=this;return 0==e&&r.start(),t++,e++,s.always(function(){e--,0==e?(t=0,r.end()):r.set((t-e)/t)}),this}}(),f})}).call(this);


// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){var b=Array.prototype.slice,c=Array.prototype.splice,d={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"auto"},e=a(window),f=a(document),g=[],h=e.height(),i=function(){for(var b=e.scrollTop(),c=f.height(),d=c-h,i=b>d?d-b:0,j=0,k=g.length;j<k;j++){var l=g[j],m=l.stickyWrapper.offset().top,n=m-l.topSpacing-i;if(l.stickyWrapper.css("height",l.stickyElement.outerHeight()),b<=n)null!==l.currentTop&&(l.stickyElement.css({width:"",position:"",top:"","z-index":""}),l.stickyElement.parent().removeClass(l.className),l.stickyElement.trigger("sticky-end",[l]),l.currentTop=null);else{var o=c-l.stickyElement.outerHeight()-l.topSpacing-l.bottomSpacing-b-i;if(o<0?o+=l.topSpacing:o=l.topSpacing,l.currentTop!==o){var p;l.getWidthFrom?p=a(l.getWidthFrom).width()||null:l.widthFromWrapper&&(p=l.stickyWrapper.width()),null==p&&(p=l.stickyElement.width()),l.stickyElement.css("width",p).css("position","fixed").css("top",o).css("z-index",l.zIndex),l.stickyElement.parent().addClass(l.className),null===l.currentTop?l.stickyElement.trigger("sticky-start",[l]):l.stickyElement.trigger("sticky-update",[l]),l.currentTop===l.topSpacing&&l.currentTop>o||null===l.currentTop&&o<l.topSpacing?l.stickyElement.trigger("sticky-bottom-reached",[l]):null!==l.currentTop&&o===l.topSpacing&&l.currentTop<o&&l.stickyElement.trigger("sticky-bottom-unreached",[l]),l.currentTop=o}var q=l.stickyWrapper.parent(),r=l.stickyElement.offset().top+l.stickyElement.outerHeight()>=q.offset().top+q.outerHeight()&&l.stickyElement.offset().top<=l.topSpacing;r?l.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):l.stickyElement.css("position","fixed").css("top",o).css("bottom","").css("z-index",l.zIndex)}}},j=function(){h=e.height();for(var b=0,c=g.length;b<c;b++){var d=g[b],f=null;d.getWidthFrom?d.responsiveWidth&&(f=a(d.getWidthFrom).width()):d.widthFromWrapper&&(f=d.stickyWrapper.width()),null!=f&&d.stickyElement.css("width",f)}},k={init:function(b){return this.each(function(){var c=a.extend({},d,b),e=a(this),f=e.attr("id"),h=f?f+"-"+d.wrapperClassName:d.wrapperClassName,i=a("<div></div>").attr("id",h).addClass(c.wrapperClassName);e.wrapAll(function(){if(0==a(this).parent("#"+h).length)return i});var j=e.parent();c.center&&j.css({width:e.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===e.css("float")&&e.css({float:"none"}).parent().css({float:"right"}),c.stickyElement=e,c.stickyWrapper=j,c.currentTop=null,g.push(c),k.setWrapperHeight(this),k.setupChangeListeners(this)})},setWrapperHeight:function(b){var c=a(b),d=c.parent();d&&d.css("height",c.outerHeight())},setupChangeListeners:function(a){if(window.MutationObserver){var b=new window.MutationObserver(function(b){(b[0].addedNodes.length||b[0].removedNodes.length)&&k.setWrapperHeight(a)});b.observe(a,{subtree:!0,childList:!0})}else window.addEventListener?(a.addEventListener("DOMNodeInserted",function(){k.setWrapperHeight(a)},!1),a.addEventListener("DOMNodeRemoved",function(){k.setWrapperHeight(a)},!1)):window.attachEvent&&(a.attachEvent("onDOMNodeInserted",function(){k.setWrapperHeight(a)}),a.attachEvent("onDOMNodeRemoved",function(){k.setWrapperHeight(a)}))},update:i,unstick:function(b){return this.each(function(){for(var b=this,d=a(b),e=-1,f=g.length;f-- >0;)g[f].stickyElement.get(0)===b&&(c.call(g,f,1),e=f);e!==-1&&(d.unwrap(),d.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",i,!1),window.addEventListener("resize",j,!1)):window.attachEvent&&(window.attachEvent("onscroll",i),window.attachEvent("onresize",j)),a.fn.sticky=function(c){return k[c]?k[c].apply(this,b.call(arguments,1)):"object"!=typeof c&&c?void a.error("Method "+c+" does not exist on jQuery.sticky"):k.init.apply(this,arguments)},a.fn.unstick=function(c){return k[c]?k[c].apply(this,b.call(arguments,1)):"object"!=typeof c&&c?void a.error("Method "+c+" does not exist on jQuery.sticky"):k.unstick.apply(this,arguments)},a(function(){setTimeout(i,0)})});
// @formatter:on