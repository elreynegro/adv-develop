/*
 *	Reserve Accordion Menu Script
 *
 *  Opens and Closes the Reservation Flow Accordion Items
 */

(function($) {

	/*
	 *	Variable References
	 */

    var $accordionTab = $('.aez-extra-header');
    
    /*
     *  Functions
     */

    function handleAccordionTabClick(evt) {
        // Open/Close the accordion tab
        var selectedContent = $(this).next();
        var otherContent = $('.aez-extra-content').not(selectedContent);

        selectedContent.slideToggle('400');

        $(this)
            .children('.fa')
            .toggleClass('fa-chevron-down')
            .toggleClass('fa-chevron-up');
    }

    /*
     *  Event Listeners
     */

    $accordionTab.off('click').on('click', handleAccordionTabClick);

})(jQuery);
