var load_hotjobs = function ($, geoip2blocked) {
    if (ip2locationEnabled && showHotJobsByLocation) {

        var facetFilterString = null;
        var lastJobViewedCategory = null;

        try {
            // Attempt to read the value in from the cookie if it exists
            lastJobViewedCategory = CWS.cookies.getItem('_vwo_lastjob_viewed_category');
        } catch (err) {
            lastJobViewedCategory = null;
        }

        // Add the standard criteria
        var criteria = {
            organization: orgId,
            limit: limit,
            offset: 0
        };

        var facets = [];

        // Check to see if we know the last viewed job category
        if (lastJobViewedCategory != null) {
            // Append it to the facet filter
            facets.push('primary_category:' + lastJobViewedCategory);
        }

        // Add site-wide filter if set
        if (typeof facetFilter !== 'undefined') {
            if (typeof facetFilter === 'string') {
                facets.push(facetFilter);
            }
            else if(typeof facetFilter === 'object'){
                facets = _.union(facets, facetFilter);
            }
        }

        // Check to see if we are filtering by any facets
        if (facets.length > 0) {
            // We are, so add them to the criteria
            criteria.facet = facets;
        }

        if (geoip2blocked !== true) {
            // First try to return jobs based on lat/lon/radius
            criteria.latitude = get_location_cookie_value('latitude');
            criteria.longitude = get_location_cookie_value('longitude');
            if (criteria.latitude !== '') {
                criteria.locationRadius = '25';
            }
            else {
                delete criteria.latitude;
                delete criteria.longitude;
                criteria.sortfield = 'open_date';
                criteria.sortorder = 'descending';
            }

            if(hotJobsOptions.hasOwnProperty('searchby_or') && hotJobsOptions.searchby_or && hotJobsOptions.searchvalue){
                criteria.orFacet = [hotJobsOptions.searchby_or + ':' + hotJobsOptions.searchvalue];
            }
        }
        else {
            criteria.sortfield = 'open_date';
            criteria.sortorder = 'descending';
        }

        $.ajax({
            url: api_url + 'job',
            data: CWS.apply_filter('maxmind_search', criteria),
            dataType: 'jsonp',
            crossDomain: true,
            cache: true,
            jsonpCallback: 'jobsCallback',
            success: function (data) {
                if (data.totalHits > 0) {
                    display_hotjobs(data, $);
                }
                else {
                    /*
                     Ok, this really sucks but I dont see any way around it.  Because we now have to add
                     the sitewide filter (if it's set) to the hot jobs control, I had to rewrite this
                     block of code to manually build the url based on the settings, rather than using
                     JSON to set them.  The reason for this is because the sitewide filter uses the facet
                     parameter but the primary_country ALSO uses the facet parameter - there is no way to
                     combine the two into 1 facet parameter using JSON.
                     */
                    var criteriaString = '';

                    // Add the country
                    facets.push('primary_country:' + get_location_cookie_value('countrycode'));

                    // Check to see if we know the last viewed job category
                    if (lastJobViewedCategory != null) {
                        // Append it to the facet filter
                        facetFilterString += "&" + 'primary_category:' + lastJobViewedCategory;
                    }

                    // Add site-wide filter if set
                    if (typeof facetFilter !== 'undefined' && typeof facetFilterValue !== 'undefined') {
                        if (facetFilter != null && facetFilterValue != null) {
                            facetFilterString += "&" + facetFilter + ':' + facetFilterValue;
                        }
                    }

                    // Add the standard criteria
                    criteriaString = 'organization=' + orgId;
                    criteriaString += '&limit=' + limit;
                    criteriaString += '&offset=0';
                    criteriaString += '&facet=' + facetFilterString;

                    if(hotJobsOptions.hasOwnProperty('searchby_or') && hotJobsOptions.searchby_or && hotJobsOptions.searchvalue){
                        criteriaString += 'orFacet[]=' + hotJobsOptions.searchby_or + ':' + encodeURIComponent(hotJobsOptions.searchvalue);
                    }

                    $.ajax({
                        url: api_url + 'job' + '?' + criteriaString,
                        //data: criteria,
                        dataType: 'jsonp',
                        crossDomain: true,
                        cache: true,
                        jsonpCallback: 'jobsCallback',
                        success: function (data) {
                            if (data.totalHits > 0) {
                                display_hotjobs(data, $);
                            }

                            // This is the worst code over...
                            else{
                                criteriaString = 'organization=' + orgId;
                                criteriaString += '&limit=' + limit;
                                criteriaString += '&offset=0';
                                criteriaString += '&sortfield=open_date&sortorder=descending';

                                if(hotJobsOptions.hasOwnProperty('searchby_or') && hotJobsOptions.searchby_or && hotJobsOptions.searchvalue){
                                    criteriaString += 'orFacet[]=' + hotJobsOptions.searchby_or + ':' + encodeURIComponent(hotJobsOptions.searchvalue);
                                }

                                $.ajax({
                                    url          : api_url + 'job' + '?' + criteriaString,
                                    dataType     : 'jsonp',
                                    crossDomain  : true,
                                    cache        : true,
                                    jsonpCallback: 'jobsCallback',
                                    success      : display_hotjobs
                                });
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            // Errors messages will be viewable via inspector tools
                            //results.html(options.results_error + '<span style="display:none;">' + textStatus + ' -- ' + errorThrown + '</span>');
                        },
                        complete: function () {
                            // nothing yet
                        }
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Errors messages will be viewable via inspector tools
                //results.html(options.results_error + '<span style="display:none;">' + textStatus + ' -- ' + errorThrown + '</span>');
            },
            complete: function () {
                // nothing yet
            }
        });
    }
};

var display_hotjobs = function (data, $) {
    var i = 1,
        alt = 0,
        className = '',
        styleName = '',
        url = '',
        html = '';

    $ = jQuery;

    html = hotJobsTitleTag;

    if(data.queryResult.length === 0){
        html = '<div class="widget_joblist_row no-jobs">No jobs found.</div>';
    }

    $.each(data.queryResult, function (index, value) {
        var job = data.queryResult[index];

        i++;
        alt = i % 2;
        className = (alt ? ' alt' : '');
        if(hotJobsOptions['image']){
            className += ' ' + CWS.str_to_css_class(job[hotJobsOptions['image']]);
        }
        styleName = (alt && altColor.length > 0 ? ' style="background-color:' + altColor + ';"' : '');
        url = jobDetailPath + '/' + format_seo_url(job.id, job.title, job.primary_city, job.primary_state, job.primary_country);

        html += '<div class="widget_joblist_row' + className + '" ' + styleName + '>';
        html += '<a href="/' + url + '">' + job.title + '</a>';

        if(hotJobsOptions['displaycategory']){
            html += '<div class="widget_joblist_category">' + job['primary_category'] + '</div>';
        }
        if (displayLocation) {
            html += '<div class="widget_joblist_loc">' + job.primary_city + (job.primary_state.length > 0 ? ', ' + job.primary_state : '') + '</div>';
        }
        if(hotJobsOptions['displayposted_date'] || hotJobsOptions['displayposted_day']){
            html += '<div class="widget_joblist_posted">';
            html += '<span class="posted-text">Posted: </span>';
            html += '<span class="posted-date">';
            var date = new Date(job['open_date']);
            if(hotJobsOptions['displayposted_date']) {
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

        html = CWS.apply_filter('maxmind_after_job', html, job);

        html += '</div>';
    });

    if(data.queryResult.length === 0){
        // Might be a useful hook
        html = CWS.apply_filter('iplocation_no_jobs_found', html, data);
    }

    $('.widget-joblist').html(html);
};

var format_seo_url = function (jobId, jobTitle, city, state, country) {

    var text = '',
        patterns = '',
        replacements = '';

    text = jobTitle + ' ' + city + ' ' + state;
    text = text.toLowerCase().trim();

    // Replace any character that's not a number or a letter with a "-"
    pattern = /[^a-z0-9]/g;
    replacement = '-';

    var text = text.replace(pattern, replacement);

    return jobId + '/' + text + '/';
}

/*
 * Some versions of IE (IE8) do not include a trim function in their javascript
 * library.  This code will add a trim function if one does not already exist.
 */
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}