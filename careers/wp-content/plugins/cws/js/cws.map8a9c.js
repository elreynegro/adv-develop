/*
 Developed by Nick Bowman (nick.bowman@hodes.com)
 Copyright 2015 Hodes
 */
var CWS = CWS || {};

var previous_map = previous_map || null;
var previous_router = previous_router|| null;
var previous_map_router = previous_map_router || true;

CWS.map = (function (w, $) {
    var options = {
            high_volume: false,
            marker_clustering: true,
            display_loading_bar: true, //CWS-4574/CWS-4576 added for showing and hiding loader
            cluster_radius: 40,
            custom_marker: false,
            starting_coords: [39.2037532, -96.6201883],
            starting_zoom: 3,
            fit_bounds: true,
            tilemap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            api_url: 'http://dev-jobsapi3internal.findly.com/api/map',
            jobdetail_path: '/job',
            org_id: 1927,
            wait_for_searchform: false,
            include_geolocation: true,
            include_directions: true,
            custom_popup: false
        },
        filters = {},
        map,
        markers,
        geojson,
        router,
        router_on_map = false,
        jobs = {},
        stores = {},
        stores_exist = false,
        arrow_icon = '<span class="job-arrow avia-font-entypo-fontello">&#xe875</span>',
        popup_loader,
        current_criteria = {};

    var search_jobs = function (criteria, loader) {
        // Criteria should always be set, but just in case...
        criteria = criteria || {};
        criteria.Organization = options.org_id;

        if (filters.length > 0) {
            if (criteria['facet']) {
                // Underscore's union() removes duplicate keys... probably not necessary but it's cleaner
                criteria['facet'] = _.union(criteria['facet'], filters);
            }
            else {
                // No existing filters from the search form exist
                criteria['facet'] = filters;
            }
        }

        // Maxing out at 500, enable high_volume setting if
        criteria.Limit = 500;
        delete criteria.Offset;

        if (options.high_volume) {
            criteria.Limit = 0;
            criteria.facetlist = 'coordinates';
        }

        if(CWS.jobs && CWS.jobs.get_option('use_boolean_search')){
            criteria.useBooleanKeywordSearch = 'true';
        }

        current_criteria = criteria;

        $.ajax({
            url: CWS.apply_filter('map_api_url', options.api_url),
            data: CWS.apply_filter('map_criteria', criteria),
            dataType: 'jsonp',
            crossDomain: true,
            cache: true,
            jsonpCallback: 'CWS.map.mapCallback',
            //success: display_jobs,
            complete: function () {
                if (loader) {
                    loader.end();
                }
            }
        });
    };

    var display_jobs = function (data) {
        data = CWS.apply_filter('job_map_search_response', data);

        if (markers) {
            map.removeLayer(markers);
            jobs = {};

            if (router_on_map) {
                map.removeControl(router);
            }
        }
        if (options.marker_clustering) {
            var cluster_options = {maxClusterRadius: options.cluster_radius};
            cluster_options = CWS.apply_filter('marker_cluster_options', cluster_options);
            markers = new L.MarkerClusterGroup(cluster_options);
        }

        stores_exist = false;

        var dataset = options.high_volume ? ('markers' in data ? data.markers : data.aggregations.coordinates.buckets) : data.queryResult;

        for (var i = 0, len = dataset.length; i < len; i++) {
            var marker_opts = {};
            if (options.custom_marker !== false) {
                // I have it set so that the icon options format comes from the widget settings correctly
                marker_opts.icon = new L.icon(CWS.apply_filter('marker_icon_options', options.custom_marker, dataset[i]));
            }

            // For now, only some clients can use the new coordinates-by-aggregation, so there's going to be some duplicating code
            if (options.high_volume) {
                CWS.apply_filter('map_marker_data', dataset[i]);
                var job = dataset[i].key;
                var coords = job.split(',');
                var marker = new L.Marker([coords[1].trim(), coords[0]], CWS.apply_filter('marker_options', marker_opts, dataset[i]))
                    .bindPopup('')
                    .on('popupopen', get_jobs_at_coords);

                marker.orig_coords = job;

                marker = CWS.apply_filter('marker_init', marker, dataset[i]);

                markers.addLayer(marker);
            }

            // Original endpoint
            else {
                var job = dataset[i];
                if (job) {
                    var coord_text = job.primary_location[1] + ',' + job.primary_location[0];
                    // We're going to group jobs into an array if they have the same coordinates
                    if (typeof jobs[coord_text] === 'undefined') {
                        var marker = new L.Marker([job.primary_location[1], job.primary_location[0]], CWS.apply_filter('marker_options', marker_opts, dataset[i]))
                            // We'll be setting popup content on-click
                            .bindPopup('')
                            .on('popupopen', popup_open);

                        markers.addLayer(marker);

                        jobs[coord_text] = [];
                        jobs[coord_text].push(job);

                        if (job.store_id) {
                            stores_exist = true;
                        }
                    }
                    else {
                        jobs[coord_text].push(job);
                    }
                }
            }
        }

        geojson = CWS.apply_filter('map_geojson', geojson, map, data);

        // Unfortunately another loop is needed for stores
        // But at least we check if there are any store ids in the first loop, so this'll be ignored for most clients
        if (stores_exist) {
            for (var coords in jobs) {
                // Nifty underscore function
                stores[coords] = _.groupBy(jobs[coords], function (jb) {
                    return jb.store_id;
                });
            }
        }

        map.addLayer(markers);
        if (markers.getLayers().length > 0 && options.fit_bounds) {
            map.fitBounds(markers.getBounds(), {maxZoom: 12});
        }
        if (dataset.length == 0) {
            map.setView(options.starting_coords, options.starting_zoom, {animate: true});
        }

        map = CWS.apply_filter('map_layers_complete', map, markers, geojson);
        /*if (!initial==) {

            initial.center = map.getCenter();
            initial.zoom = map.getZoom();
            map.setView(initial.center, initial.zoom)
        }*/
        
            
    };

    var popup_open = function (popup, data) {
        // to clear previous layer
        if (previous_router != null && previous_map_router) {
            previour_map.removeControl(previous_router);
        } else {
            previous_map_router = true;
        }

        if(CWS.buttons.theme() === 'zephyr'){
            arrow_icon = '<i class="mdfi_navigation_chevron_right job-arrow"></i>';
        }

        // Well this is kinda stupid on Leaflet's part...
        popup = popup.popup;
        var html = '';
        var count = 0;

        if(options.custom_popup){
            html = CWS.apply_filter('map_custom_popup', html, data);
            popup.setContent(html);
            popup.update();
        }
        else {
            var coords = popup.getLatLng().lat + ',' + popup.getLatLng().lng;

            var dataset = options.high_volume ? data.queryResult : jobs[coords];

            var len = dataset.length;
            var $popup = $('<div/>').html(popup.getContent()).contents();

            $popup.find('.location-jobcount').html(' - ' + len + ' opening' + (len > 1 ? 's' : ''));


            html += '<div class="location-header">' + dataset[0].primary_city + ', '
                + (dataset[0].primary_country === 'US' ? dataset[0].primary_state : dataset[0].primary_country)
                + '<span class="location-jobcount"> - ' + len + ' ' + (len > 1 ? CWS._('openings') : CWS._('opening')) + '</span></div>'
                + '<div class="map-jobs">';

            if (stores_exist === false || (data && !data[0].store_id)) {
                for (var i = 0; i < len; i++) {
                    var job = dataset[i];
                    var joburl = options.jobdetail_path + '/' + job.id + '/' + CWS.seo_url(job);
                    html += '<a href="' + joburl + '" class="map-job ' + (i % 2 == 0 ? '' : 'alt') + '">'
                        + arrow_icon
                        + '<span class="title">' + job.title + '</span>'
                        + '</a>';

                    count++;
                }
            }

            // If we have store ids, they're grouped a bit differently
            // TODO: repetitive code needs to be cleaned up
            else {
                var count = 0;
                for (var store in stores[coords]) {
                    // Jobs with missing store id are just empty strings, we want to do those last
                    // We want store names bolded before its list of jobs, then go back and list ones without store names
                    if (store != '') {
                        for (var i = 0, len = stores[coords][store].length; i < len; i++) {
                            var job = stores[coords][store][i];

                            if (i === 0) {
                                html += '<div class="store"><div class="store-name">' + store + '</div>';
                            }

                            var joburl = options.jobdetail_path + '/' + job.id + '/' + CWS.seo_url(job);
                            html += '<a href="' + joburl + '" class="map-job ' + (i % 2 == 0 ? '' : 'alt') + '">'
                                + arrow_icon
                                + '<span class="title">' + job.title + '</span>'
                                + '</a>';

                            count++;
                        }

                        html += '</div>'; // .store
                    }
                }

                // Ugh more repetition
                // This ensures jobs without store names are last
                if (stores[coords]['']) {
                    if (html != '') {
                        html += '<div class="no-stores"><div class="store-name">Other stores</div>';
                    }

                    for (var i = 0, len = stores[coords][''].length; i < len; i++) {
                        var job = stores[coords][''][i];
                        var joburl = options.jobdetail_path + '/' + job.id + '/' + CWS.seo_url(job);
                        html += '<a href="' + joburl + '" class="map-job ' + (i % 2 == 0 ? '' : 'alt') + '">'
                            + arrow_icon
                            + '<span class="title">' + job.title + '</span>'
                            + '</a>';

                    }

                    html += '</div>'; // .no-stores
                }
            }

            html += '</div>'; // .map-jobs

            popup.setContent(CWS.apply_filter('map_popup_html', html));
            popup.update();

            var dir_content = '&#xe843;', dir_class = 'directions';
            if ($('body.l-body'.length)) {
                dir_class = 'mdfi_maps_directions';
                dir_content = '';
            }
            if (options.include_directions) {
                $('.leaflet-popup').prepend('<a href="#" class="' + dir_class + '" title="Get Directions" onclick="CWS.map.directions([' + popup.getLatLng().lat + ',' + popup.getLatLng().lng + ']); return false;">' + dir_content + '</a>');
            }
        }
    };

    var get_jobs_at_coords = function (popup) {
        var real_popup = popup.popup;
        var coords = real_popup.getLatLng().lng + ', ' + real_popup.getLatLng().lat;

        if(typeof current_criteria.facet !== 'object') {
            current_criteria.facet = [];
        }

        var new_facets = [];
        for(var facet in current_criteria.facet){
            if(current_criteria.facet[facet].indexOf('coordinates:') === -1){
                new_facets.push(current_criteria.facet[facet]);
            }
        }
        current_criteria.facet = new_facets;
        current_criteria.facet.push('coordinates:' + coords);

        delete current_criteria['LocationRadius'];
        delete current_criteria['latitude'];
        delete current_criteria['longitude'];
        delete current_criteria['Limit'];

        // Failed experiment
        real_popup.setContent('<div class="popup_loader_wrap"><div id="popup_loader" class="popup_loader"></div></div>');

        if(CWS.jobs && CWS.jobs.get_option('use_boolean_search')){
            current_criteria.useBooleanKeywordSearch = 'true';
        }

        $.ajax({
            url: CWS.apply_filter('map_popup_url', options.api_url),
            data: CWS.apply_filter('map_popup_criteria', current_criteria, coords),
            dataType: 'jsonp',
            crossDomain: true,
            cache: true,
            jsonpCallback: 'mapCallback',
            success: function (data) {
                data = CWS.apply_filter('map_popup_response', data);
                popup_open(popup, data);
            },
            complete: function () {
				//CWS-4574/CWS-4576 added for hiding/end loader
                //if (options.display_loading_bar) {
                //    loader.end();
                //}
            }
        });
    };

    var set_options = function (opts) {
        // Underscore makes sure we don't lose our default options
        options = _.defaults(opts, options);
        options = CWS.apply_filter('map_script_options', options);
    };

    // Public vars/methods
    return {
        init: function (opts) {
            if (opts) {
                set_options(opts);
            }
			
			//CWS-4574/CWS-4576 added to initialize loader
            //if (options.display_loading_bar) {
                // Uses MProgress loading bar. Template:3 = indeterminate load time.
            //    loader = new Mprogress({template: 3, parent: '#loader'});
            //}

            // This is going to sound weird, but we want to move it below the "search results" header if it exists...
            if ($('.widget-jobsearch-results,.widget-jobsearch-results-list').length > 0) {
                var insert_before = '#search-filters';
                var new_search_layout = CWS && CWS.jobs && CWS.jobs.layout() === 'new';
                if($('.widget-jobsearch-results.table_tile').length > 0){
                    if(new_search_layout) {
                        insert_before = '#widget-jobsearch-results-list';
                    }
                }
                insert_before = CWS.apply_filter('insert_map_selector', insert_before);
                $('.widget-job-map').insertBefore(insert_before);

                // Might as well add the toggle button too
                // Check to see if someone hid the map or left it to show by default
                var icon = '&#xe8b1;';
                if($('body.l-body').length){
                    icon = '<span class="mdfi_social_public"></span>';
                }
                var button = '<span class="world-icon">' + icon + '</span><span class="toggle-text">' + ( $('#job-map').css('display') === 'none' ? CWS._('Show Map') : CWS._('Hide Map') ) + '</span>';
                if(!new_search_layout) {
                    $('<a href="#" onclick="CWS.map.toggle(this); return false;" id="job-map-toggle" class="' + CWS.buttons['class']('primary', 'small') + '">'
                        + button + '</a>').insertBefore('#live-results');
                }

                options.wait_for_searchform = true;
            }

            map = L.map('job-map').setView(options.starting_coords, options.starting_zoom);
            L.tileLayer(options.tilemap, {}).addTo(map);

            // Geolocation
            var icon = 'geolocation';
            if($('body.l-body').length){
                icon = 'mdfi_maps_my_location';
            }
            if (options.include_geolocation) {
                L.control.locate({
                    icon: icon,
                    showPopup: false,
                    metric: false,
                    locateOptions: {
                        maxZoom: 11
                    }
                }).addTo(map);
            }

            map = CWS.apply_filter('map_object', map);

            if (!options.wait_for_searchform) {
                search_jobs();
            }
        },
        search: search_jobs,
        set_options: set_options,
        mapCallback: display_jobs,
        set_geojson: function(json){
            geojson = json;
        },
        set_view: function(coords, zoom){
            map.setView(coords, zoom);
        },
        //loader: loader, // CWS-4574/CWS-4576 Job Map widget is going to use it
        set_filters: function (opts) {
            filters = opts;
        },
        toggle: function (el) {
            if ($('#job-map').css('display') === 'none') {
                $(el).children('.toggle-text').html(CWS._('Hide Map'));

                // Need to fix the map after it's been resized
                $('#job-map').slideDown(function () {
                    map.invalidateSize();
                    if (markers.getLayers().length > 0) {
                        map.fitBounds(markers.getBounds());
                    }
                });
            }
            else {
                $(el).children('.toggle-text').html(CWS._('Show Map'));
                $('#job-map').slideUp();
            }
        },
        directions: function (end, start) {
            /*if(previous_router != null && previous_map_router){
                previour_map.removeControl(previous_router);
            }else{
                previous_map_router = true;
            }*/
            var units = 'imperial', unit_switch = $('.unit-switch');
            if ($('.unit-switch').length && $('.unit-switch').val() == 'km') {
                units = 'metric';
            }

            // Nominatim is a geocoder with no rate limiting per day, we'll go with that.
            var opts = {
                lineOptions: {addWaypoints: false},
                fitSelectedRoutes: true,
                formatter: new L.Routing.Formatter({units: units})
            };

            // Use google if we've provided an api key
            if (cws_opts && cws_opts.google_type && cws_opts.google_key) {
                opts.geocoder = L.Control.Geocoder.google();
            }
            // Otherwise use a free service
            else {
                opts.geocoder = L.Control.Geocoder.nominatim();
            }

            // We want to make it so that this function can be called by anything, so start/end waypoints should be optional
            opts.waypoints = [];
            if (start) {
                opts.waypoints.push(L.latLng(start[0], start[1]));
            }
            else opts.waypoints.push(null);
            if (end) {
                opts.waypoints.push(L.latLng(end[0], end[1]));
            }

            router = L.Routing.control(opts).addTo(map);
            previour_map = map;
            previous_router = router;
            router_on_map = true;

            $('.leaflet-routing-remove-waypoint').click(function () {
                router_on_map = false;
                previous_map_router = false;
                map.removeControl(router);
            });
        }
    };

})(window, jQuery);