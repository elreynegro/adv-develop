<?php 
add_action( 'wpcf7_init', 'custom_add_shortcode_location_dropdown' );
 
function custom_add_shortcode_location_dropdown() {
    wpcf7_add_form_tag( 'aez-location-dropdown', 'custom_location_dropdown_shortcode_handler'); // "clock" is the type of the form-tag
}
 
function custom_location_dropdown_shortcode_handler( $tag ) {
	$output = '<select name="locations" id="locations-dropdown-contact7" class="aez-select2-search aez-form-item__dropdown">
                 <option value=""></option>
               </select>';
    return $output;
}
