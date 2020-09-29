(function($, window, document) {

	/* 
	 *	Variable References
	 */

	var $loginInfoContainer = $('.aez-form-block--log-in-information');
	var $addLoginInfoButton = $('#add-log-in-info');
	var $findACarWorldWide = $('.aez-main-navigation').find('.find-a-car-menu-item');
	var $member_exists = $('#memberCheck').val();
	$('.pum-theme-default-theme').css('display','none');

	/*
	 *	Functions
	 */
	
	if($member_exists !== 'OK') {
		// setTimeout(function() {
		// 	$('.popmake-reservation-sign-up').popmake('open');
		// }, 2000);
		// $('.pum-theme-default-theme').css('display','block');
		jQuery(document).on('pumInit', '.pum-theme-default-theme', function () {
			$('.pum-theme-framed-border').popmake('open');
			// PUM.open(15603); 
		});
	}
	
	function toggleLoginInfo() {
		$loginInfoContainer.animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 300);
	}

	function handleLoginInfoButtonClick(evt) {
		evt.preventDefault();

		// setLoginInfo();
	}

	function handleLoginInfoButtonFirstClick(evt) {
		evt.preventDefault();

		// Display login info fields
		toggleLoginInfo();
	}

	// Redirect customers to the Find A Car World Wide stand alone page.
	function handleFindACarWorldWide(evt) {
		evt.preventDefault();
		window.location = "/find-a-car-worldwide";
	}

	/* 
	 *	Event Listeners
	 */

	$addLoginInfoButton.on('click', handleLoginInfoButtonFirstClick);
	$findACarWorldWide.on('click', handleFindACarWorldWide);

	/*
	 *	Function Invocations
	 */
	
})(jQuery, window, document);