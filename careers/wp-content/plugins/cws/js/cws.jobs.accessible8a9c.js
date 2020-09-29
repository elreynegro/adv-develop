var CWS = CWS || {};

CWS.jobs = (function (w, $) {
    // Private variables and functions
    var options = {
            org_id: '68',
            search_on_pause: true,
            search_on_blur: true,
            disable_fuzzy: false,
            display_loading_bar: true,
            show_column_headers: true,
            results_error: 'There was a problem processing your search, please try again.',
            results_none: 'No jobs match your search criteria.',
            location_invalid_visible: CWS._('Error: Please enter and select a valid location'),
            location_invalid_read: CWS._('Error please enter and select a valid location'),
            limit: 10,
            max_pages: 6,
            jobdetail_path: 'job-description',
            pollinator_cp: '',
            pollinator_noresults: false,
            pollinator_noresults_text: 'What! No results? Well, let\'s not lose touch. {{pollinator_link}} so we can email you when a job like this becomes available.',
            pollinator_noresults_link: 'Join our Talent Network',
            locations_page: false,
            locations_page_radius: 25,
            locations_page_search_by: 'radius',
            columns: '',
            column_spans: '',
            filters: [],
            set_location_error_flase: false,
            node : 0,
            boost: false,
            use_boolean_search: false,
            view_by_layout: 'original'
        },

        columns = '',
        column_spans = '',
        column_labels = '',
        include_country ='',

        page = 0,
        api_url = 'http://jobsapi3.ac-devapp-01.findly.com/api/',
        parent,
        results = $('#widget-jobsearch-results-list'),
        loader = $('#loader'),
        pages = $('#widget-jobsearch-results-pages'),
        total_jobs = 0,
        current_jobs = {},
        sortfield = 'open_date',
        sortorder = 'descending',
        auto_titles = [],
        autocomplete,
        autocomplete_service,
        location_criteria,
        pageloaded = false,
        old_keywords = '',
        focus_on_first_result = false,
        initiated = false,
        last_place;


    var search_jobs = function (criteria, pollinator_data) {
        // Just in case
        criteria = criteria || {};

        if((criteria['latitude'] == -1 || criteria['longitude'] == -1) && criteria['LocationRadius'] != undefined){
            options.set_location_error_flase = true;
            var $locfield = $('#cws_jobsearch_location');
            $locfield.attr('aria-invalid', 'true')
                .parent()
                .addClass('error');
            if ($('#loc-error').length == 0) {
                $locfield.parent().append('<div class="error-msg" id="loc-error">'+options.location_invalid_visible+'</div>');
            }
            $locfield.attr('aria-describedby', 'loc-error');
        }else{
            options.set_location_error_flase = false;
            $('#cws_jobsearch_location').attr('aria-invalid', 'false').parent().removeClass('error');
            $('.location-wrapper .error-msg').remove();
        }

        refresh_column_sort();

        // Sort by date if there's no other criteria, otherwise sort by relevance
        if (sortfield && !criteria.hasOwnProperty('sortfield')) {
            criteria.sortfield = sortfield;
            criteria.sortorder = sortorder;
        }

        // Check if there are any sitewide filters such as language
        if (options.filters.length > 0) {
            if (criteria['facet']) {
                // Underscore's union() removes duplicate keys... probably not necessary but it's cleaner
                criteria['facet'] = _.union(criteria['facet'], options.filters);
            }
            else {
                // No existing filters from the search form exist
                criteria['facet'] = options.filters;
            }
        }

        if (options.node) {
            criteria['node'] = options.node;
        }

        if (options.boost) {
            criteria['boost'] = options.boost;
        }

        criteria.Limit = options.limit;
        criteria.Organization = options.org_id;
        if (!criteria.hasOwnProperty('offset')) {
            criteria.offset = page * options.limit + 1;
        }

        if (options.disable_fuzzy) {
            criteria.fuzzy = 'false';
        }

        if (options.use_boolean_search) {
            criteria.useBooleanKeywordSearch = 'true';
        }

        if(cws_opts && cws_opts.personalization && !CWS.depersonalize){
            save_last_search(criteria);
        }

        if (options.display_loading_bar) {
            loader.start();
        }

        //CWS.aria_live('Searching for jobs.');

        $.ajax({
            url: api_url + 'job',
            data: criteria,
            dataType: 'jsonp',
            crossDomain: true,
            cache: !CWS.isIE(), // IE9 and below have problems caching ajax requests, sigh
            jsonpCallback: 'jobsCallback',
            success: function (data) {
                // Didn't want to have to do this, the criteria is needed for the no-results pollinator
                display_jobs(data, pollinator_data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Errors messages will be viewable via inspector tools
                results.html(options.results_error + '<span style="display:none;">' + textStatus + ' -- ' + errorThrown + '</span>');
            },
            complete: function () {
                if (CWS.map) {
                    CWS.map.search(criteria, loader);
                }
                else if (options.display_loading_bar) {
                    loader.end();

                    if(options.set_location_error_flase){
                        CWS.aria_live(options.location_invalid_read, true);
                    }
                }
            }
        });
    };

    var gather_criteria = function (e, location_changed) {
        if ((e && e.keyCode == 13) // enter key
            || (e && e.type == 'click') // button
            || (e && e.type == 'change') // locatoin suggest
            || (e && e.type == 'slidechange') // date slider
            || (e && e.type == 'autocompleteselect') // keyword suggest
            || !e) {
            var criteria = {};
            var querystring = {};
            widget_jobsearch_full_horizontal = $('.widget-jobsearch-full-horizontal').length > 0 ? 'widget-jobsearch-full-horizontal' : 'widget-jobsearch-full';

            if (e) {
                page = 0;

                /**
                 * Here's the fuzzy logic. If you select a keyword suggestion, set fuzzy to false.
                 * If other fields changed but not keywords, leave fuzzy as false.
                 * If the keyword field changes but is not because of a keyword suggestion select, remove the fuzzy = false.
                 */
                var keyword = $('#cws_jobsearch_keywords'),
                    fuzzy = $('#cws_jobsearch_fuzzy');

                if (e.type == 'autocompleteselect') {
                    // I prevent event propagation so that the onchange event wouldn't get triggered after selecting a suggested keyword
                    // Because of that, the .each() below does not pick up the new keyword value
                    keyword.val(e.ui.item.value);
                    fuzzy.val('false');
                }
                else if (keyword.val() !== old_keywords) {
                    fuzzy.val('');
                }

                old_keywords = keyword.val();
            }

            // Page is a little bit unique. Let's sync the hidden field with our internal var here
            if (page !== 0) {
                $('#cws-search-page').val(page + 1);
            }
            else {
                $('#cws-search-page').val('');
            }


            // Close pollinator after form submission by default
            var pollinator_data = {cp: options.pollinator_cp, d: 'fnCLOSE'};

            $('.'+ widget_jobsearch_full_horizontal +' .clear-btn').remove();

            // Each form field will have a data-param attribute to tell it what API parameter it is for
            $('.'+widget_jobsearch_full_horizontal).find('input[type=text],input[type=hidden],select,.unit-switch:checked').each(function () {
                var key = $(this).data('param'),
                    facet = $(this).data('facet'),
                    name = $(this).attr('name'),
                    val = $(this).val(),
                    placeholder = $(this).attr('placeholder'),
                    is_multi = $(this).hasClass('multi'),
                    nationwide = false;

                if (!is_multi) {
                    // Multi select comes back as an array, which we want. Trim turns it into a string.
                    val = $.trim(val);
                }

                // Accessible sites have clear links under fields with content, let's clear them first as a precaution.
                if (cws_opts && cws_opts.accessible) {
                    if (val !== '' && val !== placeholder && key !== 'LocationRadius' && !$(this).is('[type=hidden]')) {
                        var label_el = $(this).siblings('label').length > 0 ? $(this).siblings('label') : $(this).parent().siblings('label');
                        if (label_el.length > 0) {
                            // Might be multiple labels next to each other in the DOM
                            if (label_el.length > 1) {
                                label_el = label_el.first();
                            }

                            var txt = label_el.text();
                            var lbl = txt == 'Select a Location' ? 'location' : txt;
                            $(this).after('<a href="#" onclick="CWS.jobs.clear_field(this); return false;" class="clear-btn" aria-label="' + CWS._('Clear the') + ' ' + lbl + '">' + CWS._('Clear') + '</a>');
                        }
                    }
                }

                if (key) {
                    if (facet) {
                        if (val !== '' && val !== placeholder) {
                            if (!criteria[key]) {
                                criteria[key] = [];
                            }
                            criteria[key].push(facet + ':' + $(this).val());
                            querystring[name] = $(this).val();

                            if (facet == 'primary_category') {
                                // "General Title", could be overwritten by a keyword search... seems logical to me
                                pollinator_data['gj'] = $(this).val();
                            }
                        }
                    }
                    else if (val && val != placeholder) {
                        if (key === 'offset') {
                            criteria[key] = page * options.limit + 1;
                            querystring[name] = val;
                        }
                        else {
                            criteria[key] = val;
                            querystring[name] = val;

                            // Hardcoded conditional statements, everything I've tried to avoid, but there's no time left.
                            if (key == 'SearchText') {
                                pollinator_data['gj'] = val;

                                // Remove sorting if there's a keyword and submit event
                                if (e) {
                                    sortfield = '';
                                    $('#cws-search-sortfield').val('');
                                    $('#cws-search-direction').val('');
                                    delete querystring['sort'];
                                    delete querystring['dir'];
                                }

                                // SearchText currently does not support searching by job id
                                // Not a great solution.... may cause issues with a category selected.
                                // TODO: use similar custom querystring builder in class-cws-search-options
                                /* removing as api should be searching against ids
                                 var job_id_test = parseInt(val);
                                 if (job_id_test) {
                                 criteria['facet'] = 'id:' + job_id_test;
                                 delete criteria.SearchText;
                                 }
                                 */
                            }
                        }
                    }
                }
            });

            if ($('#date-slider')) {
                var val = $('#date-slider').slider('value'),
                    now = new Date(),
                    tfh = 1000 * 60 * 60 * 24,
                    msg = 'Posted date, ';

                if (val === 1) {
                    criteria.openeddate = new Date(now.getTime() - tfh).toISOString();
                    msg += 'within the last twenty four hours, use right arrow to increase';
                }
                else if (val === 2) {
                    criteria.openeddate = new Date(now.getTime() - (tfh * 7)).toISOString();
                    msg += 'within the last seven days, use left and right arrow keys to change';
                }
                else if (val === 3) {
                    criteria.openeddate = new Date(now.getTime() - (tfh * 30)).toISOString();
                    msg += 'within the last thirty days, use left and right arrow keys to change';
                }
                else {
                    msg += 'any time, use left arrow to reduce';
                }

                if (e && e.type == 'slidechange') {
                    CWS.aria_live(msg, true);
                }
            }

            // Checkbox groups are handled a bit differently
            $('.'+widget_jobsearch_full_horizontal).find('input:checked:not(.unit-switch)').each(function () {
                var $this = $(this);
                var name = $this.attr('name');
                if (criteria[name]) {
                    criteria[name] += ',' + $this.val();
                    querystring[name] += ',' + $this.val();
                }
                else {
                    criteria[name] = $this.val();
                    querystring[name] = $this.val();
                }

                if ($this.val() === 'Nationwide') {
                    nationwide = true;
                }
            });

            // The location field is handled WAY different.
            // Need to check if it's changed but we're missing lat/lon coordinates
            if (criteria.hasOwnProperty('Location') && criteria.Location && criteria.Location != 'Location') {
                // Needs to do a quick check to see if location is set as a facet, and that's an array, go go underscore
                var contains_state_or_country = false;
                if (criteria.facet) { // necessary null check
                    contains_state_or_country = _.some(criteria.facet, function (item) {
                        // state or country, we don't know what their values are either way
                        return item.indexOf('primary_') > -1;
                    });
                }

                // location_changed should only be true from an autocomplete event
                if (location_changed === true) {
                    get_location(criteria, pollinator_data, querystring);
                }

                // There's a location property but no lat/lng, AS WELL AS no whole state/country, get coords from Google
                else if (( !criteria.hasOwnProperty('latitude') || !criteria.hasOwnProperty('longitude') ) && contains_state_or_country === false) {
                    //sortfield = '';
                    get_location(criteria, pollinator_data, querystring);
                }
                else {
                    pollinator_data['gl'] = criteria.Location;
                    delete criteria.Location;

                    /* Switching whole country to use countryStateCity
                    if(contains_state_or_country){
                        for(var f = 0, flen = criteria.facet.length; f < flen; f++){
                            if(criteria.facet[f].indexOf('primary_country') > -1){
                                criteria['countryStateCity'] = criteria.facet[f].split(':')[1];
                                delete criteria.facet[f];
                                break;
                            }
                        }
                    }*/

                    // Switching whole country to use countryStateCity
                    if(contains_state_or_country){
                        var new_facets = [];

                        var state, country;

                        for(var f = 0, flen = criteria.facet.length; f < flen; f++){
                            if(criteria.facet[f].indexOf('primary_country') > -1){
                                country = criteria.facet[f].split(':')[1];
                            }
                            else if(criteria.facet[f].indexOf('primary_state') > -1){
                                state = criteria.facet[f].split(':')[1];
                            }
                            else{
                                new_facets.push(criteria.facet[f]);
                            }
                        }

                        // Replace old facet array with the one that does NOT have country/state in it
                        criteria.facet = new_facets;

                        if(country){
                            criteria['countryStateCity'] = country;
                            if(state){
                                criteria['countryStateCity'] += ',' + state;
                            }
                        }
                    }

                    // This prevents a duplicate GTM tag from firing off on page load
                    if (pageloaded !== false) {
                        History.replaceState(null, document.title, CWS.build_querystring(querystring));
                    }
                    pageloaded = true;

                    search_jobs(criteria, pollinator_data);
                }
            }
            else {
                // Don't include radius if there is no location
                delete querystring.radius;
                delete criteria.LocationRadius;
                delete querystring.units;
                delete criteria.locationunits;

                // Also look for IE8 placeholders
                // Gross repetitive if-statement
                if (criteria.hasOwnProperty('Location') && criteria.Location == 'Location') {
                    delete criteria.Location;
                    delete querystring.Location;
                }

                $('#cws_jobsearch_latitude').val('');
                $('#cws_jobsearch_longitude').val('');

                var country = $('#cws_jobsearch_country'),
                    state = $('#cws_jobsearch_state');
                if (country.length > 0) {
                    delete querystring.country;
                    delete querystring.state;
                    delete criteria.nationwideCountries;
                    delete criteria.statewideStates;
                    delete criteria.countryStateCity;
                    if (criteria.facet) {
                        // facets are an array so we can delete like we did with the others
                        var new_facets = [];
                        for (var i = 0, len = criteria.facet.length; i < len; i++) {
                            if (criteria.facet[i] !== 'primary_country:' + country.val() &&
                                criteria.facet[i] !== 'primary_state:' + state.val()) {
                                new_facets.push(criteria.facet[i]);
                            }
                        }
                        criteria.facet = new_facets;
                    }

                    country.val('');
                    state.val('');
                }

                delete criteria.Latitude;
                delete criteria.Longitude;
                delete querystring.latitude;
                delete querystring.longitude;

                $('#cws_jobsearch_location').attr('aria-invalid', 'false').parent().removeClass('error');
                $('.location-wrapper .error-msg').remove();

                // This prevents a duplicate GTM tag from firing off on page load
                if (pageloaded !== false) {
                    History.replaceState(null, document.title, CWS.build_querystring(querystring));
                }
                pageloaded = true;

                if (location_criteria) {
                    criteria = location_criteria;
                }

                search_jobs(criteria, pollinator_data);
            }

            return false;
        }
    };

    var display_jobs = function (data, pollinator_data) {
        var html = '';
        data = data || current_jobs;
        var focus_el = '#widget-jobsearch-results-list .job:first-child a';

        if (data) {
            // For pagination
            total_jobs = data.totalHits || 0;
            current_jobs = data;

            $('#live-results-counter').html(total_jobs);

            //CWS.aria_live(total_jobs + ' total jobs found.', true);

            if (pollinator_data) {
                if (pollinator_data.hasOwnProperty('gj')) {
                    pollinator_data['a'] = 'Looking for ' + pollinator_data.gj;
                }
                else {
                    pollinator_data['a'] = 'Looking for all jobs';
                }

                var poll_url = options.pollinator_noresults + CWS.build_querystring(pollinator_data, true);
                $('#job-alert').attr('href', poll_url);
            }

            if (data.totalHits && data.totalHits > 0) {
                var cols = columns.split(',');
                var col_spans = column_spans.split(',');
                var col_labels = column_labels.split(',');

                // We don't want to do an unecessary string replace for non-accessible sites
                var aria_replace = cws_opts && cws_opts.accessible ? ' {aria_title}' : '';

                html += '<ol class="search-results-ol">';

                for (var i = 0, len = data.queryResult.length; i < len; i++) {
                    var job = data.queryResult[i];
                    var posted = Date.fromISO(job.open_date);
                    var formatted = (posted.getUTCMonth() + 1) + '/' + posted.getUTCDate() + '/' + posted.getUTCFullYear();
                    var joburl = CWS.apply_filter('result_job_url', options.jobdetail_path + '/' + job.id + '/' + seo_url_text(job));
                    var secondary_locations = '';

                    var aria_formatted_date = CWS.months[posted.getUTCMonth()] + ' ' + posted.getUTCDate() + ', ' + posted.getUTCFullYear();

                    if (job.hasOwnProperty('addtnl_locations') && job.addtnl_locations.length > 0) {
                        for (var z = 0, lenz = job.addtnl_locations.length; z < lenz; z++) {
                            if (job.addtnl_locations[z].addtnl_city !== job.primary_city) {
                                secondary_locations += '<div class="child addtnl_loc">';
                                secondary_locations += job.addtnl_locations[z].addtnl_city + (job.addtnl_locations[z].addtnl_state ? ', ' + job.addtnl_locations[z].addtnl_state : '');
                                if(include_country){
                                    secondary_locations += (job.addtnl_locations[z].addtnl_country ? ', ' + job.addtnl_locations[z].addtnl_country : '');
                                }
                                secondary_locations += '</div>';
                            }
                        }
                    }
                    var job_html = '<li class="job clearfix' + (i % 2 == 0 ? '' : ' alt') + '" onclick="CWS.jobs.go_to_job(this);"><ul class="job-innerwrap">';

                    for (j = 0, len2 = cols.length; j < len2; j++) {
                        if (cols[j] === 'title') {
                            job_html += '<li class="job-data ' + cols[j] + '" title="' + job.title + '">';
                        }
                        else if (cols[j] === 'title_category') {
                            job_html += '<li class="job-data ' + cols[j] + '" title="'+ job.title +", "+job.primary_category+'">';
                        }
                        else{
                            job_html += '<li class="job-data ' + cols[j] + '" title="' + col_labels[j] + '">';
                        }
                        
                        if (cols[j] === 'title') {
                            // job_html += '<div class="jobTitle"><a title="'+ job.title +'" href="' + joburl + '"' + aria_replace + ' id="job-result' + i + '">' + job.title + '</a></div>';
                            job_html += '<div class="jobTitle"><a href="' + joburl + '"' + aria_replace + ' id="job-result' + i + '">' + job.title + '</a></div>';
                        }
                        else if (cols[j] === 'title_category') {
                            // job_html += '<div class="jobTitle"><a title="'+ job.title +", "+job.primary_category+'" href="' + joburl + '"' + aria_replace + ' id="job-result' + i + '">' + job.title + '</a></div><div class="jobCategory">' + job.primary_category + '</div>';
                            job_html += '<div class="jobTitle"><a href="' + joburl + '"' + aria_replace + ' id="job-result' + i + '">' + job.title + '</a></div><div class="jobCategory">' + job.primary_category + '</div>';
                        }
                        else if (cols[j] === 'city_state') {
                            var location_formatted = job.primary_city + (job.primary_state ? ', ' + job.primary_state : (job.primary_country ? ', ' + job.primary_country : ''));

                            job_html += location_formatted;
                            job_html += secondary_locations;
                        }
                        else if (cols[j] === 'address_city_state') {
                            var address = job.primary_address ? '<div class="job-address">' + job.primary_address + '</div>' : '';
                            var location_formatted = address + '<div class="job-locale">' + job.primary_city + (job.primary_state ? ', ' + job.primary_state : (job.primary_country ? ', ' + job.primary_country : '')) + '</div>';

                            job_html += location_formatted;
                            job_html += secondary_locations;
                        }
                        else if (cols[j] === 'city_state_locationtype') {
                            var location_formatted = job.primary_city + (job.primary_state ? ', ' + job.primary_state : (job.primary_country ? ', ' + job.primary_country : ''));

                            job_html += '<div class="parent location">' + location_formatted + '</div>';
                            job_html += secondary_locations;
                            if (job.location_type) {
                                job_html += '<div class="child locationtype">' + job.location_type + '</div>';
                            }
                        }
                        else if (cols[j] === 'city_state_or_locationtype') {
                            if (job.location_type) {
                                // Statewide jobs should show the state, and the full state name not the initials
                                if (job.location_type === 'Statewide' && job.primary_state && CWS.states && job.primary_state in CWS.states) {
                                    job_html += '<div class="parent location">' + CWS.states[job.primary_state] + '</div>';
                                }
                                job_html += '<div class="child locationtype">' + job.location_type + '</div>';
                            }
                            else {
                                var location_formatted = job.primary_city + (job.primary_state ? ', ' + job.primary_state : (job.primary_country ? ', ' + job.primary_country : ''));

                                job_html += '<div class="parent location">' + location_formatted + '</div>';
                                job_html += secondary_locations;
                            }
                        }
                        else if (cols[j] === 'city_state_country') {
                            var location_formatted = job.primary_city + (job.primary_state ? ', ' + job.primary_state : '') + ', ' + job.primary_country

                            job_html += location_formatted;
                            job_html += secondary_locations;
                        }
                        else if (cols[j] === 'address_city_state_country') {
                            var address = job.primary_address ? '<div class="job-address">' + job.primary_address + '</div>' : '';
                            var location_formatted = address + '<div class="job-locale">' + job.primary_city + (job.primary_state ? ', ' + job.primary_state : '') + ', ' + job.primary_country + '</div>';
                            aria_message += '; Located in ' + aria_formatted_state;

                            job_html += location_formatted;
                            job_html += secondary_locations;
                        }
                        else if (cols[j] === 'city_state_country_locationtype') {
                            var location_formatted = job.primary_city + (job.primary_state ? ', ' + job.primary_state : '') + ', ' + job.primary_country;

                            job_html += '<div class="parent location">' + location_formatted + '</div>';
                            job_html += secondary_locations;
                            if (job.location_type) {
                                job_html += '<div class="child locationtype">' + job.location_type + '</div>';
                            }
                        }
                        else if (cols[j] === 'city_state_country_or_locationtype') {
                            if (job.location_type) {
                                if (job.location_type === 'Statewide' && job.primary_state && CWS.states && job.primary_state in CWS.states) {
                                    job_html += '<div class="parent location">' + CWS.states[job.primary_state] + '</div>';
                                }
                                job_html += '<div class="child locationtype">' + job.location_type + '</div>';
                            }
                            else {
                                job_html += '<div class="parent location">' + job.primary_city + (job.primary_state ? ', ' + job.primary_state : '') + ', ' + job.primary_country + '</div>';
                                job_html += secondary_locations;
                            }
                        }
                        else if (cols[j] === 'addtnl_categories') {
                            for (cat in job[cols[j]]) {
                                job_html += '<div class="addtnl_category">' + job[cols[j]][cat] + '</div>';
                            }
                        }
                        else if (cols[j] === 'open_date') {
                            job_html += formatted;
                        }
                        else {
                            job_html += job[cols[j]];
                        }
                        job_html += '</li>';

                        job_html = CWS.apply_filter('after_job_column_' + cols[j], job_html, job);
                    }

                    job_html = CWS.apply_filter('after_job_columns', job_html, job);
                    job_html += '</ul></li>';

                    html += job_html;
                }

                html += '</ol>';
                options.set_location_error_flase = false;
            }
            else {
                // options.set_location_error_flase = true;
                html = '<div id="no_results_found" tabindex="0">';
                if (options.pollinator_noresults) {
                    html += options.pollinator_noresults_text.replace('{{pollinator_link}}', '<a href="' + poll_url + '" ' + (cws_opts && cws_opts.accessible ? 'target="_blank"' : 'onclick="CWS.show_pollinator_lightbox(this); return false;"') + ' class="findly-connect-lightbox">' + options.pollinator_noresults_link + '</a>');
                }
                else {
                    // Generic message. The jQuery renders html encoded chars.
                    html += '<div class="error">' + $('<div/>').html(options.results_none).text() + '</div>';
                }
                html += '</div>';

                focus_el = '#no_results_found';
            }
        }
        else {
            html = '<div id="results_error" class="error">' + options.results_error + '</div>';
            focus_el = '#results_error';
            CWS.log(data);
        }
        $('#widget-jobsearch-results-list').html(html);

        if (cws_opts && cws_opts.accessible) {
            if (focus_on_first_result) {
                setTimeout(function () {
                    // What's happening here? Focusing on a link overrides an aria-live element. Focus first, then use a live message.
                    $(focus_el).focus();
                    if (total_jobs > 0) {
                        CWS.aria_live('Displaying page ' + (page + 1) + ' of ' + total_jobs + ' jobs.', true);
                    }
                }, 500);
            }
            /*
             setTimeout(function(){
             if(total_jobs == 0){
             CWS.aria_live('No jobs found.', true);
             }
             else{
             CWS.aria_live('Displaying page ' + (page + 1) + ' of ' + total_jobs + ' jobs.', true);
             }
             }, 750);
             if(focus_on_first_result) {
             setTimeout(function () {
             $(focus_el).focus();
             focus_on_first_result = false;
             }, 2000);
             }
             */
        }

        display_pages();
    };

    var display_pages = function () {
        var num_pages = Math.ceil(total_jobs / options.limit);

        num_pages = CWS.apply_filter('search_results_last_page_number', num_pages, total_jobs, options.limit);

        // Try to have the current page in the middle if possible.
        var extra_pages = 0;
        var begin = page - Math.floor(options.max_pages / 2);
        var end = page + Math.floor(options.max_pages / 2);

        if (begin < 0) {
            extra_pages += Math.abs(0 - begin);
            end += extra_pages;
            begin = 0;
        }
        if (end > num_pages) {
            begin -= end - num_pages;
            end = num_pages;
        }
        if (begin < 0) {
            begin = 0;
        }

        var html = '';

        if (num_pages > 1) {
            if (page > 0) {
                html = '<a href="#" onclick="CWS.jobs.goto_page(0); return false;" class="button inactive" role="button" aria-label="' + CWS._('Go to the first page of results.') + '">&lt;&lt;</a>';
                html += '<a href="#" onclick="CWS.jobs.prev_page(); return false;" class="button inactive" role="button" aria-label="' + CWS._('Go to the previous page of results.') + '">&lt;</a>';
            }

            for (var i = begin; i < end; i++) {
                html += '<a href="#" onclick="CWS.jobs.goto_page(' + i + '); return false;" class="button ' + (page == i ? '' : 'inactive') + '" role="button" aria-label="' + CWS._('Go to page') + ' ' + (i + 1) + ' ' + CWS._('of results') + '." >' + (i + 1) + '</a>';
            }

            if (page + 1 < num_pages) {
                html += '<a href="#" onclick="CWS.jobs.next_page(); return false;" class="button inactive" role="button" aria-label="' + CWS._('Go to the next page of results.') + '">&gt;</a>';
                html += '<a href="#" onclick="CWS.jobs.goto_page(' + (num_pages - 1) + '); return false;" class="button inactive"  role="button" aria-label="' + CWS._('Go to the last page of results.') + '">&gt;&gt;</a>';
            }
        }

        $('#widget-jobsearch-results-pages').html(html);
    };

    var get_location = function (criteria, pollinator_data, querystring) {
        if (options.display_loading_bar && loader) {
            loader.start();
        }

        // It should be safe to show the geolocation icon again assuming the location changed by user input
        $('.location-wrapper.with_geo .geolocation-icon').show().parent().addClass('with_geo');

        var location_input = criteria.Location;
        delete criteria.Location;

        // Retrieve the full location (city, state, country) from IP2Location
        var iplocation = $('#cws_jobsearch_iplocation').val(),
            country = $('#cws_jobsearch_country'),
            state = $('#cws_jobsearch_state');
        options.set_location_error_flase = false;
        if (autocomplete) {
            var place = autocomplete.getPlace();

            if (place && place.geometry) {
                // Things changed, let's start fresh
                if (criteria.facet) {
                    criteria.facet = remove_facets(criteria.facet, ['primary_state', 'primary_country']);
                }
                delete criteria['latitude'];
                delete criteria['longitude'];
                delete querystring['latitude'];
                delete querystring['longitude'];
                delete querystring['state'];
                delete querystring['country'];

                $('#cws_jobsearch_latitude').val('');
                $('#cws_jobsearch_longitude').val('');
                $('#cws-search-sortfield').val('');
                $('#cws-search-direction').val('');
                country.val('');
                state.val('');

                page = 0; // go back to the first page, no matter what kind of location we use
                $('#cws-search-page').val('');
                delete criteria['offset'];
                delete querystring['pg'];

                // We want to use primary_country and primary_state if they're
                if (place.address_components[0]['types'][0] === 'country') {
                    country.val(place.address_components[0]['short_name']);
                    if (typeof criteria['facet'] != 'object') {
                        criteria['facet'] = [];
                    }
                    //criteria['facet'].push('primary_country:' + place.address_components[0]['short_name']);
                    criteria['countryStateCity'] = place.address_components[0]['short_name'];
                    querystring['country'] = place.address_components[0]['short_name'];
                }
                else if (place.address_components[0]['types'][0] === 'administrative_area_level_1') {
                    state.val(place.address_components[0]['short_name']);
                    if (typeof criteria['facet'] != 'object') {
                        criteria['facet'] = [];
                    }
                    querystring['state'] = place.address_components[0]['short_name'];

                    if (place.address_components.length > 1 &&  place.address_components[1]['types'][0] === 'country'){
                        country.val(place.address_components[1]['short_name']);
                        querystring['country'] = place.address_components[1]['short_name'];
                        criteria['countryStateCity'] = place.address_components[1]['short_name'] + ',' + place.address_components[0]['short_name'];
                    }
                    else{
                        criteria['facet'].push('primary_state:' + place.address_components[0]['short_name']);
                    }
                }

                // Back to regular radius search
                else {
                    criteria['latitude'] = place.geometry.location.lat();
                    criteria['longitude'] = place.geometry.location.lng();
                    querystring['latitude'] = place.geometry.location.lat();
                    querystring['longitude'] = place.geometry.location.lng();

                    $('#cws_jobsearch_latitude').val(criteria['latitude']);
                    $('#cws_jobsearch_longitude').val(criteria['longitude']);

                    delete criteria['sortfield'];
                    delete criteria['sortorder'];
                    delete querystring['sort'];
                    delete querystring['dir'];

                    sortfield = ''; // need to sort by proximity
                }

                // Location Type
                if ($('#cws_jobsearch_nationwide_country').length > 0) {
                    // We're going to set the nationwideCountries and statewideStates params if they're available from Google
                    var state_country = get_state_country(place.address_components);

                    if (state_country.country) {
                        criteria['nationwideCountries'] = state_country.country;
                        querystring['nationwide'] = state_country.country;
                        $('#cws_jobsearch_nationwide_country').val(state_country.country);
                    }
                    if (state_country.state) {
                        criteria['statewideStates'] = state_country.state;
                        querystring['statewide'] = state_country.state;
                        $('#cws_jobsearch_nationwide_state').val(state_country.state);
                    }

                }

                last_place = place;

                History.replaceState(null, document.title, CWS.build_querystring(querystring));

                // The error class is applied for invalid locations, see else-statement below
                $('#cws_jobsearch_location').attr('aria-invalid', 'false')
                    .removeAttr('aria-describedby')
                    .parent()
                    .removeClass('error');
                $('.location-wrapper .error-msg').remove();

                if (place.address_components && place.address_components[0]) {
                    // General location... tries to get state. Will likely need to come back if empty for country.
                    pollinator_data['gl'] = place.address_components[0].short_name;
                }
                options.set_location_error_flase = false;
            }
            else {
                // Check to see if the user has entered a location that is different than the
                // location brought over from IP2Location - if not, lat/lon can stay, otherwise
                // reset to -1 since we dont have a valid location.
                if (iplocation != location_input && !country.val() && !state.val()) {
                    // Not a real place? This needs a better solution. A much better solution.
                    criteria['latitude'] = '-1';
                    criteria['longitude'] = '-1';
                    $('#cws_jobsearch_latitude').val('-1');
                    $('#cws_jobsearch_longitude').val('-1');

                    if (country) {
                        country.val('');
                        state.val('');
                    }

                    var $locfield = $('#cws_jobsearch_location');
                    $locfield.attr('aria-invalid', 'true')
                        .parent()
                        .addClass('error');
                    if ($('#loc-error').length == 0) {
                        $locfield.parent().append('<div class="error-msg" id="loc-error">'+options.location_invalid_visible+'</div>');
                    }
                    $locfield.attr('aria-describedby', 'loc-error');

                    /*setTimeout(function () {
                        $locfield.focus();
                    }, 200);*/

                    // CWS.aria_live('Error please enter and select a valid location.', true);
                    options.set_location_error_flase = true;
                }

            }
        }
        else {
            // Check to see if the user has entered a location that is different than the
            // location brought over from IP2Location - if not, lat/lon can stay, otherwise
            // reset to -1 since we dont have a valid location.
            if (iplocation != location_input && !country.val() && !state.val()) {
                // Not a real place? This needs a better solution. A much better solution.
                criteria['latitude'] = '-1';
                criteria['longitude'] = '-1';
                $('#cws_jobsearch_latitude').val('-1');
                $('#cws_jobsearch_longitude').val('-1');

                var $locfield = $('#cws_jobsearch_location');
                $locfield.attr('aria-invalid', 'true')
                    .parent()
                    .addClass('error');
                if ($('#loc-error').length == 0) {
                    $locfield.parent().append('<div class="error-msg" id="loc-error">'+options.location_invalid_visible+'</div>');
                }
                $locfield.attr('aria-describedby', 'loc-error');

                /*setTimeout(function () {
                    $locfield.focus();
                }, 200);*/

                // CWS.aria_live('Error please enter and select a valid location.', true);
                options.set_location_error_flase = true;

                //if (cws_opts && cws_opts.accessible) {
                //    CWS.aria_live('Invalid location selected.', true);
                //}
            }
        }
        search_jobs(criteria, pollinator_data);
    };

    var refresh_column_sort = function () {
        $('.col-controls .col-control,.col-controls').hide();
        $('.search-columns .flex_column, .search-columns .sort-btn').each(function () {
            var opp_sort = sortorder == 'ascending' ? 'descending' : 'ascending';
            if (sortfield == $(this).data('param')) {
                $(this).addClass('active')
                    .find('.col-controls,.col-control.del,.col-control.' + sortorder)
                    .show();
            }
            else {
                $(this).removeClass('active');
            }
        });

    };

    var get_state_country = CWS.get_state_country;

    var seo_url_text = CWS.seo_url;

    var remove_facets = function (facets, vals) {
        var new_facets = [];
        for (var i = 0, len = facets.length; i < len; i++) {
            var matches = false;
            for (j = 0, jlen = vals.length; j < jlen; j++) {
                if (facets[i].indexOf(vals[j]) > -1) {
                    matches = true;
                }
            }

            if (!matches) {
                new_facets.push(facets[i]);
            }
        }
        return new_facets;
    };

    var save_last_search = function(criteria){
        // What we're saving is a little long, so we're going to use LocalStorage instead of cookies
        if(storageAvailable('localStorage')) {
            var str = '';

            if (criteria.SearchText) {
                str = criteria.SearchText + ' jobs';
            }
            else if (criteria.primary_category) {
                str = criteria.primary_category + ' jobs';
            }
            else if (criteria.multiCategory) {
                str = criteria.multiCategory.join(', ') + ' jobs';
            }
            else {
                str = 'Jobs';
            }

            str = str.replace('~', ' '); // just in case, we're using that to delimit
            str = str.replace('|', ' '); // just in case, we're using that to delimit
            str = CWS.apply_filter('last_search_str_jobs', str);
            var loc = '';

            if (criteria.latitude && last_place && last_place.vicinity) {
                loc = ' near ' + last_place.vicinity;
            }
            else if (criteria.stateCity) {
                if(typeof criteria.stateCity === 'object'){
                    loc = ' in ' + criteria.stateCity.join(', ');
                }
                else {
                    loc = ' in ' + criteria.stateCity.split(', ')[1];
                }
            }
            else if (criteria.countryStateCity) {
                if(typeof criteria.countryStateCity === 'object'){
                    loc = ' in ' + criteria.countryStateCity.join(', ');
                }
                else {
                    loc = ' in ' + criteria.countryStateCity.split(', ')[2];
                }
            }

            loc = CWS.apply_filter('last_search_str_location', loc);
            str = str + loc;

            // No sense in storing an empty search
            if (str !== 'Jobs') {
                var current = localStorage.getItem('last_searches');
                var full_str = str + '~' + window.location.pathname + window.location.search;

                if (current == null) {
                    localStorage.setItem('last_searches', full_str);
                }
                else {
                    current = current.split('|');

                    // I'm going to make it so that if the STRING matches, it doesn't matter what the page path is,
                    // the page path will update.
                    var existing_index = _.findIndex(current, function(src){
                        return src.split('~')[0] == str;
                    });

                    // Remove the existing entry with the same string
                    if (existing_index !== -1) {
                        current.splice(existing_index, 1);
                    }

                    if (current.length == 10) {
                        current.shift();
                    }
                    current.push(full_str);

                    localStorage.setItem('last_searches', current.join('|'));
                }
            }
        }
    };

    var storageAvailable = function(type) {
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

    // Public variables and functions
    return {
        marker_events_set: false,
        set_options: function (opts) {
            // Underscore makes sure we don't lose our default options
            options = _.defaults(opts, options);
        },
        get_option: function(opt){
            return options[opt];
        },
        set_api: function (url) {
            api_url = url;
        },
        set_columns: function (cols, col_spans, col_labels) {
            columns = cols;
            column_spans = col_spans;
            column_labels = col_labels;
            include_country = cols.indexOf('city_state_country') !== -1;
        },
        set_autocomplete: function (titles) {
            auto_titles = titles;
        },
        clear_field: function (el) {
            $(el).siblings('input,select').val('').focus();
            gather_criteria();
        },
        init_loc_autocomplete: function () {
            var location_field = document.getElementById('cws_jobsearch_location');
            if ($(location_field).is('input')) {

                /******* THIS SECTION SELECTS THE FIRST LOCATION ON ENTER **********/
                // jQuery doesn't return an event object, so we need to check for IE-compatibility
                var _addEventListener = (location_field.addEventListener) ? location_field.addEventListener : location_field.attachEvent;

                function addEventListenerWrapper(type, listener) {
                    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
                    // and then trigger the original listener.
                    if (type == "keydown") {
                        var orig_listener = listener;
                        listener = function (event) {
                            var suggestion_selected = $(".pac-item-selected").length > 0;
                            if (event.which == 13 && !suggestion_selected) {
                                var simulated_downarrow = $.Event("keydown", {keyCode: 40, which: 40});
                                orig_listener.apply(location_field, [simulated_downarrow]);

                                if ($(".pac-container").css('display') != 'none') {
                                    event.preventDefault();
                                }
                                else {
                                    page = 0;
                                }
                            }

                            orig_listener.apply(location_field, [event]);
                        };
                    }

                    // add the modified listener
                    _addEventListener.apply(location_field, [type, listener]);
                }

                // More IE-checks
                if (location_field.addEventListener) {
                    location_field.addEventListener = addEventListenerWrapper;
                }
                else if (location_field.attachEvent) {
                    location_field.attachEvent = addEventListenerWrapper;
                }
                /********************* END HACK *************************/

                /*autocomplete = new google.maps.places.Autocomplete(location_field,
                    {
                        'types': ['geocode']
                    });

                autocomplete.setTypes(['geocode']);*/

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

                autocomplete = new google.maps.places.Autocomplete(location_field, place_set_type);		
		        
                autocomplete.setTypes([location_type]);
			
                google.maps.event.addListener(autocomplete, 'place_changed', function (e) {
                    gather_criteria(null, true);
                });

                $(location_field).keydown(function (e) {
                    if (e.keyCode == 13 && $(".pac-container").css('display') != 'none') {
                        setTimeout(function () {
                            CWS.aria_live($(location_field).val() + ' selected.', true);
                        }, 500);
                    }
                });
                $(location_field).on('focus', function (e) {
                    CWS.aria_live('Type a location, and use the down arrow to select a suggestion.', true);
                });
                $(location_field).keyup(function (e) {
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
            }
        },
        page: page,
        next_page: function () {
            page++;
            var offset = $('.widget-jobsearch-results,.widget-jobsearch-results-list').offset().top - $('#wpadminbar').height();
            $('html, body').scrollTop(offset);
            focus_on_first_result = true;
            gather_criteria();
        },
        prev_page: function () {
            page--;
            var offset = $('.widget-jobsearch-results,.widget-jobsearch-results-list').offset().top - $('#wpadminbar').height();
            $('html, body').scrollTop(offset);
            focus_on_first_result = true;
            gather_criteria();
        },
        goto_page: function (num) {
            page = num;
            var offset = $('.widget-jobsearch-results,.widget-jobsearch-results-list').offset().top - $('#wpadminbar').height();
            $('html, body').scrollTop(offset);
            focus_on_first_result = true;
            gather_criteria();
        },
        sortby: function (str, order) {
            sortfield = str;
            if (order) {
                sortorder = order;
            }
        },
        go_to_job: function (el) {
            var url = $(el).find('a').attr('href');
            window.location.href = url;
        },
        search: search_jobs,
        gather: gather_criteria,
        display: display_jobs,
        layout: function(){
            return options.view_by_layout;
        },
        loader: loader, // Job Map widget is going to use it
        initiated: initiated,
        init: function (parent, results) {
            window.blur_timer = null;
            //var gather_criteria = this.gather_critera;

            if (options.display_loading_bar) {
                // Uses MProgress loading bar. Template:3 = indeterminate load time.
                loader = new Mprogress({template: 3, parent: '#loader'});
            }

            if (options.pollinator_noresults === false) {
                $('#job-alert').hide();
            }
            
            widget_jobsearch_full_horizontal = $('.widget-jobsearch-full-horizontal').length > 0 ? 'widget-jobsearch-full-horizontal' : 'widget-jobsearch-full';
            parent = $('.'+widget_jobsearch_full_horizontal);
            results = $('#widget-jobsearch-results-list');
            pages = $('#widget-jobsearch-results-pages');
            old_keywords = $('#cws_jobsearch_keywords').val();
            loaded_page = parseInt($('#cws-search-page').val());

            if (loaded_page && loaded_page !== 0) {
                page = loaded_page - 1;
            }

            var unit_switch = $('.unit-switch');
            if (unit_switch.length > 0) {
                var switch_opts = unit_switch.data();
                switch_opts.height = 14;
                switch_opts = CWS.apply_filter('unit_switch_opts', switch_opts);
                unit_switch.switchButton(switch_opts);

                var update_aria = function(e){
                    var labels = $('.switch-button-label');
                    labels.attr({'role': 'button', 'tabindex': '0'});
                    if(e.target.checked){
                        $(labels[0]).attr('aria-label', CWS._('switch to') + ' ' + CWS._('miles'));
                        $(labels[1]).attr('aria-label', CWS._('kilometers'));
                    }
                    else{
                        $(labels[0]).attr('aria-label', CWS._('miles'));
                        $(labels[1]).attr('aria-label', CWS._('switch to') + ' ' + CWS._('kilometers'));
                    }

                    labels.on('keydown', function(event){
                        switch (event.which) {
                            case 13:
                            case 32: {
                                $(event.target).click();

                                // Necessary?
                                event.stopPropagation();
                                return false;
                            }
                        }
                    });
                };
                update_aria({target: document.getElementById('units')});
                $(unit_switch).change(update_aria);
            }

            function sort_click(e) {
                var $this = $(this);
                var param = $this.data('param'), alias = $this.data('alias');

                if(param == 'city_state_country_or_locationtype'){
                    param = 'primary_city';
                }

                var which = e.which;
                if (e.type == 'keydown') {
                    if (which === 13 || which === 32) {
                        e.preventDefault();
                    }
                    else {
                        return;
                    }
                }

                if (sortfield == param) {
                    sortorder = sortorder == 'ascending' ? 'descending' : 'ascending';
                }
                else {
                    sortfield = param;
                    sortorder = 'ascending';
                }

                sortorder = CWS.apply_filter('search_results_sort_order', sortorder, param);

                $('#cws-search-sortfield').val(sortfield);
                $('#cws-search-direction').val(sortorder);

                if (cws_opts && cws_opts.accessible) {
                    setTimeout(function () {
                        CWS.aria_live('Sorting job list ' + sortorder, true);
                    }, 200);
                }

                $('.sort-description').text('');
                $('#' + param + '-description').text('Job list sorted ' + sortorder);

                setTimeout(function () {
                    $this.focus();
                }, 350);

                gather_criteria();
            }

            CWS.apply_filter('pre_column_event_listener', null);

            $('.search-columns .flex_column:not(.unsortable), .search-columns .sort-btn:not(.unsortable)')
                .click(sort_click)
                .keydown(sort_click);

            var slider = $('#date-slider');
            if (slider.length > 0) {
                $('#date-slider .ui-slider-handle').focus(function () {
                    var val = slider.slider('value');
                    var msg = 'Posted date, ';

                    if (val === 1) {
                        msg += 'within the last twenty four hours, use right arrow to increase';
                    }
                    else if (val === 2) {
                        msg += 'within the last seven days, use left and right arrow keys to change';
                    }
                    else if (val === 3) {
                        msg += 'within the last thirty days, use left and right arrow keys to change';
                    }
                    else {
                        msg += 'any time, use left arrow to reduce';
                    }

                    CWS.aria_live(msg, true);
                });
            }

            // Check to see if there's the search form, otherwise, otherwise this script can be used as utility (CWS.jobs.search())
            if (parent.length > 0) {
                if(cws_opts && cws_opts.personalization && CWS.storageAvailable('localStorage')){
                    var place_from_quick_search = localStorage.getItem('last_place');
                    if(place_from_quick_search){
                        last_place = JSON.parse(place_from_quick_search);
                        localStorage.removeItem('last_place');
                    }
                }

                parent.find('input:not(.loc_auto)').on('keypress', gather_criteria);
                parent.find('input.loc_auto').on('keyup', function (e) {
                    if (e.keyCode == 13 && $(this).val() == '') {
                        $('#cws_jobsearch_latitude,#cws_jobsearch_longitude').val('');
                        page = 0;

                        var $country = $('#cws_jobsearch_country'),
                            $state = $('#cws_jobsearch_state');
                        if ($country) {
                            $country.val('');
                            $state.val('');
                        }
                    }
                    if ($(this).val() === '') {
                        $('.location-wrapper .geolocation-icon').show().parent().addClass('with_geo');
                    }
                });
                parent.find('#cws-adv-search-btn').on('click', gather_criteria);
                parent.find('select').change(gather_criteria);
                parent.find('input:checkbox').change(function (e) {
                    gather_criteria(e);
                    return true;
                });

                // No longer using ip detection for the location field, HTML5 button only.
                // Let's check if the user has already allowed it.
                var geolocation_addr = CWS.cookies.getItem('geolocation_addr'),
                    loc_field = $('#cws_jobsearch_location'),
                    geolocation_lat = CWS.cookies.getItem('geolocation_lat'),
                    lat_field = $('#cws_jobsearch_latitude'),
                    geolocation_lon = CWS.cookies.getItem('geolocation_lon'),
                    lon_field = $('#cws_jobsearch_longitude');

                // Check for querystring first, from refresh or quick search
                if (loc_field && loc_field.val()) {
                    sortfield = '';

                    if (loc_field.val() == geolocation_addr) {
                        $('.location-wrapper.with_geo .geolocation-icon').hide().parent().removeClass('with_geo');
                    }
                }

                // Now see if the user has accepted html5 geolocation to prepopulate
                // Ignore them if one is somehow missing
                else if (geolocation_addr !== null && geolocation_lat !== null && geolocation_lon !== null) {
                    lat_field.val(geolocation_lat);
                    lon_field.val(geolocation_lon);
                    loc_field.val(geolocation_addr);

                    $('.location-wrapper.with_geo .geolocation-icon').hide().parent().removeClass('with_geo');
                }

                if (options.search_on_pause && cws_opts.api.indexOf('googleapi') === -1) {
                    parent.find('input[type=text]:not(.loc_auto)').on('keyup', function (e) {
                        // Alphanumeric only; may change later; also backspace
                        if ((e.which <= 90 && e.which >= 48) || e.which == 8) {
                            clearTimeout(window.blur_timer);
                            window.blur_timer = null;
                            window.blur_timer = setTimeout(function () {
                                // I don't like this solution to get around closure
                                parent.find('#cws-adv-search-btn').click();
                            }, 500);
                        }
                    });
                }

                if (old_keywords !== '') {
                    sortfield = '';
                }

                gather_criteria();
            }

            // An odd check... the map plugin doesn't offer much in the way of events, let's see if there's a marker's array
            if (typeof allmarkers == 'object' && google) {
                $('.widget-jobsearch-results,.widget-jobsearch-results-list').hide();
                options.locations_page = true;
                google.setOnLoadCallback(setTimeout(function () {
                        for (var i = 0, len = allmarkers.length; i < len; i++) {
                            // We should definitely do performance tests on this
                            var marker = allmarkers[i],
                                criteria = {};
                            criteria.LocationRadius = 50;

                            google.maps.event.addListener(marker, "click", function (mrk) {
                                criteria.Latitude = mrk.latLng.lat();
                                criteria.Longitude = mrk.latLng.lng();

                                location_criteria = criteria;
                                page = 0;
                                $('.widget-jobsearch-results,.widget-jobsearch-results-list').slideDown();

                                search_jobs(criteria);
                            });
                        }
                    },
                    2000));
            }

            // Check for Leaflet maps
            if ($('.mapsmarker').length > 0) {
                $('.widget-jobsearch-results,.widget-jobsearch-results-list').hide();
                $('#job-alert').hide();
                options.locations_page = true;

                var layer_id = $('.mapsmarker.layermap').attr('class').replace(/.+?layer-(\d+).*/gi, '$1');

                if (window['layermap_' + layer_id]) {
                    window['layermap_' + layer_id].on('layeradd', function (e) {
                        if (window['markerID_layermap_' + layer_id] && !CWS.marker_events_set) {
                            CWS.marker_events_set = true;
                            for (mrk in window['markerID_layermap_' + layer_id]) {
                                if (!window['markerID_layermap_' + layer_id][mrk]['jobeventset']) {
                                    window['markerID_layermap_' + layer_id][mrk]['jobseventset'] = true;
                                    window['markerID_layermap_' + layer_id][mrk].on('click', function (em) {
                                        var criteria = {};
                                        if (options.locations_page_search_by === 'radius') {
                                            criteria.Latitude = em.latlng.lat;
                                            criteria.Longitude = em.latlng.lng;
                                            criteria.LocationRadius = options.locations_page_radius;
                                        }
                                        else if (options.locations_page_search_by === 'city') {
                                            var address = em.target.feature.properties.address;
                                            var address_regex = /(.+?),\s* (.+?),.*$/gi;
                                            var city = address.replace(address_regex, '$2');
                                            if (city) {
                                                criteria.facet = 'primary_city:' + city;
                                            }
                                            else {
                                                CWS.log('City not found. Address given: ' + address + '. City from regex: ' + city + '.');
                                                return;
                                            }
                                        }

                                        location_criteria = criteria;
                                        page = 0;
                                        $('.widget-jobsearch-results,.widget-jobsearch-results-list').slideDown();

                                        search_jobs(criteria);
                                    });
                                }
                            }
                        }
                    });
                }
            }

            initiated = true;
        }
    }
})(window, jQuery);
