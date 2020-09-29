<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');

class AdvLocations_INTL_ListLocationsShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $location_list;
    static $addedAlready = false;

 	/*
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
             wp_register_script( 'adv-location-searchbox-helper', get_stylesheet_directory_uri() . '/js/adv_location_search_box_helper.js', array ( 'jquery'), null, true);

            $scripts = array('jquery', 'adv-location-searchbox-helper');
            wp_enqueue_script($scripts);

            wp_localize_script( 'adv_rez', 'ADV_Rez_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
        		)
        	);            
        }
    }

	public function handleShortcode($atts) {

		$locations_data_intl = AdvLocations_Helper::getLocationsByBrand('Advantage', true);

		$intl_Flag = 1;
		if(isset($_SESSION['loc_nav_flag'])) {
			$intl_Flag = ($_SESSION['loc_nav_flag'] == 2)?2:1;
			unset($_SESSION['loc_nav_flag']);
		}


		$this->location_list = '<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/highway.jpg);">

	<div class="aez-gradient">
		<h1>International Car Rental Locations</h1>
	</div>
</div>

<div class="aez-location-base-container">

        <input 
        type="search"
        id="locations-dropdown"
        name="locations-dropdown"
        pattern=".{15,}" 
        class="location-searcbox-autocomplete aez-select2-search aez-form-item__dropdown"
        placeholder="Enter a city or country to find a location"
        style= "font-size: .9em; border-radius: 5px;" 
        spellcheck="false"
        value= ""
        required >
        <label for="locations-dropdown" class="aez-form-item__label--hidden"></label>
        <input id="locations-dropdown-selected" 
        name="locations-dropdown-selected" 
        value= ""
        style="display:none;"
        class="aez-select2-search aez-form-item__dropdown">

	<div id="international-title" class="aez-location-title">
		<h2>International Rental Car Locations</h2>
		<p>Advantage Rent a Car provides car rentals from convenient international airport locations for when you travel abroad. Explore below where Advantage provides the best value in international car rental!</p>
	</div>

	<div id="america-tab" class="aez-location-content" style="display: none;">';

global $wpdb;

$metas = $wpdb->get_results(
  $wpdb->prepare("SELECT meta_value, post_id FROM $wpdb->postmeta where meta_key = %s", 'page_location_id'), ARRAY_A
 );

$new_location_array = array();
$new_location_post_ids = array();
foreach ($metas as $value1) {
	# code...
	foreach ($value1 as $key1 => $value2) {
		# code...
		$new_location_array[] = $value2;
		if ($key1 == 'post_id') {
			$new_location_post_ids[] = $value2;
		}

	}
}

$in_clause = implode(',', $new_location_post_ids);


global $wpdb;
$location_page_data_tmp = $wpdb->get_results(
 
$wpdb->prepare("SELECT ID, post_name FROM $wpdb->posts where post_status = 'publish' and ID in ($in_clause)", $in_clause), ARRAY_A
);

// error_log('location_page_data_tmp: ' . print_r($location_page_data_tmp, true));


foreach ($location_page_data_tmp as $value1) {
	# code...
	foreach ($value1 as $key1 => $value2) {
		# code...
		$location_page_data[] = $value2;
	}
}

	$location_count = count($locations_data_us);
	$current_row_count = 0;
	// $column_one_ready = true;
	$column_two_ready = true;
	$working_on_column_2 = false;
	$old_state = '';
	$state_closing_tag = '';

	$this->location_list .= '<div class="aez-half-column">';

	$this->location_list .= '</div>';
	$this->location_list .= '</div>';

	$this->location_list .= '<div id="international-tab" class="aez-location-content">';

	$location_count = count($locations_data_intl);
	$current_row_count = 0;
	
	$column_two_ready = true;
	$working_on_column_2 = false;
	$old_state = '';
	$state_closing_tag = '';

	$this->location_list .= '<div class="aez-half-column">';

	foreach ($locations_data_intl as $value_array) {
		# code...
		// $value_array = json_decode($value_json, true);

		if (strlen($value_array['StateName']) > 0) {
			$current_state = $value_array['StateName'];
		} else {
			$current_state = $value_array['CountryName'];
		}

		$this->location_list .= '';

		if ($old_state != $current_state) {

			if ( ($current_row_count * 2) > $location_count - 10) {

				$this->location_list .= '</div>';
				$this->location_list .= '<div class="discount_times_logo"><img class="discount_logo"c src="/wp-content/plugins/advantage-locations/assets/Discount-Cdn-Logo-Wordmark.png" alt="Discount Car & Truck Rentals logo"><img class="times_logo" src="/wp-content/plugins/advantage-locations/assets/Square-Logo.jpg" alt="Times Car Rental logo"></div></div>';
				$this->location_list .= '<div class="aez-half-column">';
				// $this->location_list .= "<h1>Go</h1>";
				$state_closing_tag = '';
				$location_count = 1000000;
			}

			$this->location_list .= $state_closing_tag;
			$state_closing_tag = '</div>';
			$this->location_list .= '<div class="aez-state-content">';
			$this->location_list .= '<h2>' . ucwords(strtolower($current_state)) . '</h2>';
		}

		$old_state = $current_state;

		$location_found = array_search($value_array['LocationCode'], $new_location_array);

		if ($location_found === false) {
			$location_href = $value_array['LocationCode'];
		} else {
			
		$location_data_id = array_search($new_location_array[$location_found + 1], $location_page_data);

			$location_href = $location_page_data[$location_data_id + 1];

		}

		$this->location_list .= '<a href="/international-locations/' . $location_href . '" class="aez-icon-location">
		<i class="fa fa-map-marker" aria-hidden="true"></i>
		<p>' . ucwords(strtolower($value_array['LocationName'])) . '</p>
		</a>';

		$current_row_count++;
	}

	$this->location_list .= '</div>';
	$this->location_list .= '</div>';
	$this->location_list .= '<div class="intl_discount_times_logo"><img class="intl_discount_logo"c src="/wp-content/plugins/advantage-locations/assets/Discount-Cdn-Logo-Wordmark.png" alt="Discount Car & Truck Rentals logo"><img class="intl_times_logo" src="/wp-content/plugins/advantage-locations/assets/Horizontal-Logo.jpg" alt="Times Car Rental logo"></div></div>';

		$this->location_list .= '</div>
<div id="promo_locations" class="aez-awards-promo aez-travelers-promo" style="background-color: rgba(0,0,0,0.7)!important; background-position: center !important;">
	<div class="aez-dark-background">
		<h2>Like Our Rides?</h2>
		<h3>Travelers of All Types Can Save With Advantage</h3>

		  <div class="aez-promo-blocks">
            <div class="aez-promo">
                <img src="/wp-content/themes/twentysixteen-child/assets/group-icon.png" alt="group icon">
                <div>
                    <span style="color: #8ED8F8;"">Corporate Advantage</span>
                     <p class="aez-uppercase" style= "color: white;">For Corporations</p>
                    <p style= "color: white;">
                         We know our business clients have a busy schedule, so no matter where or when they travel, the discount works 24/7.
                    </p>
                </div>
            </div>

             <div class="aez-promo">
             <img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
                        <div>
                            <span style="color: #8ED8F8;">Expressway Program</span>
                            <p class="aez-uppercase" style= "color: white;">For Business Travelers</p>
                            <p style= "color: white;">
                                Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
                            </p>
                        </div>
            </div>
            <div class="aez-promo">
            <img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
                    <div style="margin-top: 5.2%;">
                        <span style="color: #8ED8F8;">Expressway Program</span>
                        <p class="aez-uppercase" style= "color: white;">For leisure travelers</p>
                        <p style= "color: white;">
                           Receive a free class upgrade or a free day instantly upon signing up for the Expressway Loyalty Program!
                        </p>
                    </div>
            </div>
        </div>

	    <div class="aez-member-login aez-vacation-spans">
	        <span>Expressway Program</span>
	        <a href="/login" class="aez-btn aez-btn--filled-green">Log In To Your Account</a>
	        <span>Not An Expressway Member?</span>
	        <a href="javascript:void(0);" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</a>
	    </div>
    </div>
</div>';

	return $this->location_list;
    }
}
