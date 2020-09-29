/*
 *	Google Maps Script
 */

(function($) {

	// function buildLocationUrl(id) {
	// 	// Build the location url based on rental location id
	// 	return 'https://qapi.advantage.com/api/v1/getLocation?rental_location_id=' + id;
	// }

	// function getRentalLocationId(path) {
	// 	// Take the path and trim it to just the rental location id
	// 	var path = window.location.pathname.replace('/location/','');
	// 	var id = path.replace('/','');
	// 	var rentalLocationId = id.toUpperCase();

	// 	return rentalLocationId;
	// }
	
	function getLatAndLng(lat, lng) {
		// Function that formats the latitude and longitude
		return { 
			lat: Number(lat), 
			lng: Number(lng),
		};
	}

	// function parseLocation(res) {
	// 	// Parse out the location response into a readable form
	// 	var data = JSON.parse(res);
	// 	return data.d;

	// }

	// var url = buildLocationUrl(getRentalLocationId(window.location.pathname));

console.log('location, latitude, longitude');

console.log($('#google-map').data('location'));
console.log($('#google-map').data('latitude'));
console.log($('#google-map').data('longitude'));

	// var latLng = {lat: Number(location.Latitude), 
	// 		lng: Number(location.Longitude)};
	// Ajax call to return the location information
	// Handles population of the map
// 	$.get(url)
// 		.then(function(res) {
// 			var location = parseLocation(res);
// console.log('location:');
// console.log(location);

		// 	return getLatAndLng(location);
		// })
		// .done(function(latLng) {
	var latLng = getLatAndLng($('#google-map').data('latitude'), $('#google-map').data('longitude'));
	var map = new google.maps.Map(document.getElementById('google-map'), {
        zoom: 16,
        center: latLng,
        scrollwheel: false
    });
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
			// });

})(jQuery);
