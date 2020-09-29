/*
 * Sets the 'loc' cookie to expire in 30 days
 *
 * This method returns a promise which is fired when the ajax call to get the
 * location information from the Ip2LocationAPI Service finishes executing.
 * This allows you to do $.when(set_location_cookie()).then( function () { });
 * to execute code once the service finishes executing.
 */
var ip2LocationServiceCallInProgress = false;

set_location_cookie = function () {
    var $ = jQuery,
        cookieValue = '',
        domainName = document.location.hostname,
        dt = new Date(),
        expDate = new Date(dt.getTime() + 1000 * 60 * 60 * 24 * 30);        // Expires in 30 days

    var defer = $.Deferred();

    if (typeof geoip2 !== 'undefined') {

        if (!ip2LocationServiceCallInProgress) {
            ip2LocationServiceCallInProgress = true;

            // Query the Maxmind service and store the result in the cookie
            geoip2.city(function (data) {
                    var ipAddress = latitude = longitude = cityName = stateName = countryCode = countryName = stateCode = postal = "";


                    if (data != undefined) {
                        ipAddress = data.traits.ip_address;
                        longitude = data.location.longitude;
                        latitude = data.location.latitude;
                        cityName = data.city.names.en;
                        stateName = data.subdivisions[0].names.en;
                        stateCode = data.subdivisions[0].iso_code || '';
                        countryCode = data.country.iso_code;
                        countryName = data.country.names.en;
                        postal = data.postal.code;
                    }

                    cookieValue = format_Cookie(ipAddress, latitude, longitude, cityName, stateName, countryCode, countryName, stateCode, postal);
                    if (cookieValue.length > 0) {
                        CWS.cookies.setItem('loc', cookieValue, expDate.toGMTString(), "/", domainName);
                        CWS.location.set(cookieValue);

                        $.event.trigger({
                            type: "maxmindLocation",
                            loc: cookieValue
                        });
                    }

                    ip2LocationServiceCallInProgress = false;
                    defer.resolve();
                },
                function (error) {
                    if (error && error.code) {
                        if (error.code == 'DOMAIN_REGISTRATION_REQUIRED') {
                            CWS.log('This is not registered for IP detection.');
                        }
                        else {
                            CWS.log(error);
                        }
                    }
                    defer.resolve();
                });
        }
    }
    else {
        CWS.log('GeoIP2 could not be loaded. Possibly blocked.');
        defer.reject();
    }

    return defer.promise();
};

/*
 * Reads the entire contents of the location cookie
 */
read_location_cookie = function () {
    var cookie = null;

    // Retrieve the cookie contents
    cookie = CWS.cookies.getItem('loc');

    return cookie;
};

/*
 * Retrieves a specific property value stored in the location cookie
 */
var get_location_cookie_value = function (propertyName) {
    var propertyValue = "";

    // Retrieve the cookie contents
    var cookie = read_location_cookie();

    // Verify the cookie does exist just to be safe
    if (cookie && cookie.length > 0) {
        var propertyValues = cookie.split('|');
        switch (propertyName.toLowerCase()) {
            case 'ipaddress' :
            {
                propertyValue = propertyValues[0];
                break;
            }
            case 'latitude' :
            {
                propertyValue = propertyValues[1];
                break;
            }
            case 'longitude' :
            {
                propertyValue = propertyValues[2];
                break;
            }
            case 'cityname' :
            {
                propertyValue = propertyValues[3];
                break;
            }
            case 'statename':
            {
                propertyValue = propertyValues[4];
                break;
            }
            case 'countrycode':
            {
                propertyValue = propertyValues[5];
                break;
            }
            case 'countryname':
            {
                propertyValue = propertyValues[6];
                break;
            }
            case 'statecode':
            {
                propertyValue = propertyValues.length > 7 ? propertyValues[7] : '';
                break;
            }
            case 'postal':
            {
                propertyValue = propertyValues.length > 8 ? propertyValues[8] : '';
                break;
            }
        }
    }

    return propertyValue;
};

/*
 * Returns true/false if location cookie exists
 */
var isset_location_cookie = function () {
    var retVal = false,
        cookie = null;

    // Retrieve the cookie contents
    cookie = read_location_cookie();

    // Check to see if the cookie is set
    retVal = cookie != null && cookie !== "";

    if (retVal) {
        // Check to see if the cookie is in the correct format.  The old format contained ':' as
        // the delimiter, the new formation contains ';' as the delimiter.
        if (cookie.indexOf("|") == -1) {
            // Cookie is in old format, so pretend like it doesnt exist so it will be rewritten
            retVal = null;
        }
    }

    return retVal;
};

/*
 * Formats the location data to be stored in the cookie
 */
var format_Cookie = function (ipAddress, latitude, longitude, cityName, stateName, countryCode, countryName, stateCode, postal) {
    return ipAddress + "|" + latitude + "|" + longitude + "|" + cityName + "|" + stateName + "|" + countryCode + "|" + countryName + "|" + stateCode + "|" + postal;
};
