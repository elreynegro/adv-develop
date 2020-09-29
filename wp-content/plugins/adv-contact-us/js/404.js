/*
 *	404 page JS
 *
 *	Requires:
 *	- jQuery
 */

(function($) {
	/* Variable References */
	var $findACarWorldWideLink = $('#open_find_a_car_404');
	var $findACarMenuItem = $('.find-a-car-menu-item');

	/* Event Handlers */
	function handleOpenFindACar(evt) {
		evt.preventDefault();

		// Open the Dropdown Form
		$findACarMenuItem.trigger('click');

		// Scroll Top
		$('html, body').animate({
        scrollTop: $('body').offset().top - '300'
    }, 500);
	}

	// /* Event Listeners */
	$findACarWorldWideLink.on('click', handleOpenFindACar);


})(jQuery);
