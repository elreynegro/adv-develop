<?php 
add_action( 'wpcf7_init', 'custom_add_shortcode_location_dropdown_my_reservations' );
 
function custom_add_shortcode_location_dropdown_my_reservations() {
    wpcf7_add_shortcode( 'aez-location-dropdown-my-reservations', 'custom_location_dropdown_my_reservations_shortcode_handler');
}
 
function custom_location_dropdown_my_reservations_shortcode_handler( $tag ) {
	$output = '<select name="locations" id="locations-dropdown-my-reservations" class="aez-select2-search aez-form-item__dropdown">
                 <option value=""></option>
               </select>';
    return $output;
}