<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');

class AdvLocations_ListLocationsShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $location_list;
    static $addedAlready = false;

 	/*
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
        }
    }

	public function handleShortcode($atts) {

		$locations_data_us = AdvLocations_Helper::getLocationsByBrand('Advantage', false);
		$locations_data_intl = AdvLocations_Helper::getLocationsByBrand('Advantage', true);

		$intl_Flag = 1;
		if(isset($_SESSION['loc_nav_flag'])) {
			$intl_Flag = ($_SESSION['loc_nav_flag'] == 2)?2:1;
			unset($_SESSION['loc_nav_flag']);
		}

// Adv_login_Helper::err_log($locations_data_us, __FUNCTION__, __FILE__);
// Adv_login_Helper::err_log($locations_data_intl, __FUNCTION__, __FILE__);

		$this->location_list = '<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/highway.jpg);
">

<script>var Loflag = '.$intl_Flag.'; </script>

	<div class="aez-gradient">
		<h1>Rental Car Locations</h1>
	</div>
</div>

<div class="aez-location-base-container">


	<select id="locations-dropdown" class="aez-select2-search aez-form-item__dropdown">
		<option value=""></option>
	</select>

	<div class="aez-horizontal-tabs">
		<span id="america" class="aez-tab">United States</span>
		<span id="international" class="aez-tab">International</span>
	</div>

	<div id="america-title" class="aez-location-title">
		<h2>United States Car Rental Locations</h2>
		<p>Advantage Rent a Car provides car rentals from convenient airport locations. Explore where Advantage provides the best value in car rental!</p>
	</div>

	<div id="international-title" class="aez-location-title" style="display:none">
		<h2>International Car Rental Locations</h2>
		<p>Advantage Rent a Car provides car rentals from convenient airport locations. Explore where Advantage provides the best value in car rental!</p>
	</div>

	<div id="america-tab" class="aez-location-content">';

global $wpdb;

$metas = $wpdb->get_results(
  $wpdb->prepare("SELECT meta_value, post_id FROM $wpdb->postmeta where meta_key = %s", 'page_location_id'), ARRAY_A
 );

// error_log('metas: ' . print_r($metas, true));
// $metas_string = implode('|', $metas);
// error_log('all meta keys:'. print_r($metas,true));
// error_log('all metas_string keys:'. print_r($metas_string,true));
// $arr_vals1 = array_values($metas);
// error_log('$arr_vals1: ' . print_r($arr_vals1, true));
// $arr_vals2 = array_values($arr_vals1);
// error_log('********');
// error_log('********');
// error_log('********');
// error_log('********');
// error_log('********');
// error_log('$arr_vals2: ' . print_r($arr_vals2, true));
// $location_string = '';
// $string_separator = '';
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

// $new_location_array = explode($location_string);
// error_log('new_location_array: ' . print_r($new_location_array, true));
// error_log('new_location_post_ids: ' . print_r($new_location_post_ids, true));

$in_clause = implode(',', $new_location_post_ids);

// error_log('in_clause: ' . print_r($in_clause, true));


// $myarray = array('144', '246');

// $args = array(
//    'post_type' => 'page',
//    'p'      => $new_location_array
// );
// // The Query
// $the_query = new WP_Query( $args );
// $test_array = array(293,295);
global $wpdb;
$location_page_data_tmp = $wpdb->get_results(
  // $wpdb->prepare("SELECT post_name, post_id FROM $wpdb->post where ID in %s", 'page_location_id'), ARRAY_A
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
// error_log('location_page_data: ' . print_r($location_page_data, true));


	$location_count = count($locations_data_us);
	$current_row_count = 0;
	// $column_one_ready = true;
	$column_two_ready = true;
	$working_on_column_2 = false;
	$old_state = '';
	$state_closing_tag = '';

	$this->location_list .= '<div class="aez-half-column">';

	foreach ($locations_data_us as $value_array) {
		# code...
		// $value_array = json_decode($value_json, true);

		if (strlen($value_array['StateName']) > 0) {
			$current_state = $value_array['StateName'];
		} else {
			$current_state = $value_array['CountryName'];
		}

// if ($current_row_count < 2) {

// 	Adv_login_Helper::err_log('  8 8 8 8 8 8 8 8 8 8  8', __FUNCTION__, __LINE__);

// 	Adv_login_Helper::err_log($value_json, __FUNCTION__, __LINE__);
// 	Adv_login_Helper::err_log($value_array, __FUNCTION__, __LINE__);
// }
		if ($old_state != $current_state) {

			if ( ($current_row_count * 2) > $location_count ) {

				$this->location_list .= '</div>';
				$this->location_list .= '</div>';
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



// error_log('$new_location_array[$location_found + 1]: ' . print_r($location_found, true));
		if ($location_found === false) {
			$location_href = $value_array['LocationCode'];
		} else {
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('location_found: ' . print_r($location_found, true));
// error_log('location_page_data: ' . print_r($location_page_data, true));
// error_log('new_location_array: ' . print_r($new_location_array, true));
// error_log('location_found: ' . print_r($location_found, true));
// error_log('$new_location_array[$location_found ]: ' . print_r($new_location_array[$location_found ], true));
// error_log('$new_location_array[$location_found + 1]: ' . print_r($new_location_array[$location_found + 1], true));
// error_log('$new_location_array[$location_found + 1]: ' . print_r($new_location_array[$location_found + 1], true));
		$location_data_id = array_search($new_location_array[$location_found + 1], $location_page_data);
// error_log('location_data_id: ' . print_r($location_data_id, true));



// error_log('$location_page_data[$location_data_id]: ' . print_r($location_page_data[$location_data_id], true));
// error_log('$location_page_data[$location_data_id + 1]: ' . print_r($location_page_data[$location_data_id+ 1] , true));


			$location_href = $location_page_data[$location_data_id + 1];

		}

		$this->location_list .= '<a href="/location/' . $location_href . '" class="aez-icon-location">
		<i class="fa fa-map-marker" aria-hidden="true"></i>
		<p>' . ucwords(strtolower($value_array['LocationName'])) . '</p>
		</a>';

		$current_row_count++;
	}

	$this->location_list .= '</div>';
	$this->location_list .= '</div>';
	$this->location_list .= '</div>';



	$this->location_list .= '<div id="international-tab" class="aez-location-content" style="display: none">';


	$location_count = count($locations_data_intl);
	$current_row_count = 0;
	// $column_one_ready = true;
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

// if ($current_row_count < 2) {

// 	Adv_login_Helper::err_log('  8 8 8 8 8 8 8 8 8 8  8', __FUNCTION__, __LINE__);

// 	Adv_login_Helper::err_log($value_json, __FUNCTION__, __LINE__);
// 	Adv_login_Helper::err_log($value_array, __FUNCTION__, __LINE__);
// }

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
// error_log('new_location_array: ' . print_r($new_location_array, true));
// error_log('$value_array[LocationCode]: ' . print_r($value_array['LocationCode'], true));

		if ($location_found === false) {
			$location_href = $value_array['LocationCode'];
		} else {
			// $location_data_id = array_search($new_location_array[$location_found + 1], $location_page_data);
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('   &&&&&&&&&&&&');
// error_log('location_found: ' . print_r($location_found, true));
// error_log('location_page_data: ' . print_r($location_page_data, true));
// error_log('new_location_array: ' . print_r($new_location_array, true));
// error_log('location_found: ' . print_r($location_found, true));
// error_log('$new_location_array[$location_found ]: ' . print_r($new_location_array[$location_found ], true));
// error_log('$new_location_array[$location_found + 1]: ' . print_r($new_location_array[$location_found + 1], true));
// error_log('$new_location_array[$location_found + 1]: ' . print_r($new_location_array[$location_found + 1], true));
		$location_data_id = array_search($new_location_array[$location_found + 1], $location_page_data);
// error_log('location_data_id: ' . print_r($location_data_id, true));



// error_log('$location_page_data[$location_data_id]: ' . print_r($location_page_data[$location_data_id], true));
// error_log('$location_page_data[$location_data_id + 1]: ' . print_r($location_page_data[$location_data_id+ 1] , true));

			$location_href = $location_page_data[$location_data_id + 1];

		}

		$this->location_list .= '<a href="/location/' . $location_href . '" class="aez-icon-location">
		<i class="fa fa-map-marker" aria-hidden="true"></i>
		<p>' . ucwords(strtolower($value_array['LocationName'])) . '</p>
		</a>';

		$current_row_count++;
	}

	$this->location_list .= '</div>';
	$this->location_list .= '</div>';
	$this->location_list .= '<div class="intl_discount_times_logo"><img class="intl_discount_logo"c src="/wp-content/plugins/advantage-locations/assets/Discount-Cdn-Logo-Wordmark.png" alt="Discount Car & Truck Rentals logo"><img class="intl_times_logo" src="/wp-content/plugins/advantage-locations/assets/Horizontal-Logo.jpg" alt="Times Car Rental logo"></div></div>';










		// $this->location_list .= '<div class="aez-half-column">
		// 	<div class="aez-state-content">
		// 		<h2>Scotland</h2>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Aberdeen Airport (ABZ)</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Edinburgh Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Glasgow Airport (GLA)</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Edinburgh Waverley (EDI)</p>
		// 		</a>
		// 	</div>
		// 	<div class="aez-state-content">
		// 		<h2>Northern Ireland</h2>

		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Belfast Intl Airport (BFS)</p>
		// 		</a>
		// 	</div>
		// 	<div class="aez-state-content">
		// 		<h2>England</h2>

		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Birmingham Airport (BHX)</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Bristol Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Gatwick Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Luton Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Manchester Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>London Marble Arch</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Newcastle Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Stansted Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>London Heathrow Airport (LHR)</p>
		// 		</a>
		// 	</div>
		// 	<div class="aez-state-content">
		// 		<h2>Ireland</h2>

		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Cork Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Dublin City Centre</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Dublin Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Shannon Airport</p>
		// 		</a>
		// 	</div>
		// </div>

		// <div class="aez-half-column">
		// 	<div class="aez-state-content">
		// 		<h2>Mexico</h2>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Puerto Vallarta Intl Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Mexico International Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Cancun International Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Guadalajara International Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>San Jose Del Cabo Intl Airport</p>
		// 		</a>
		// 	</div>
		// 	<div class="aez-state-content">
		// 		<h2>Trinidad And Tobago</h2>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Piarco Int\'l Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>ANR Robinson International Airport</p>
		// 		</a>
		// 	</div>
		// 	<div class="aez-state-content">
		// 		<h2>Germany</h2>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Dusseldorf Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Frankfurt Airport Terminal 1</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Frankfurt Airport Terminal 2</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Hanover Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Hamburg Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Munich Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Nuremberg Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Stuttgart Airport</p>
		// 		</a>
		// 		<a class="aez-icon-location">
		// 			<i class="fa fa-map-marker" aria-hidden="true"></i>
		// 			<p>Berlin Schoenefeld Airport</p>
		// 		</a>
		// 	</div>
        //$this->location_list .= '</div></div>'
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
                            <span style="color: #8ED8F8;">Advantage Expressway</span>
                            <p class="aez-uppercase" style= "color: white;">For Business Travelers</p>
                            <p style= "color: white;">
                                Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
                            </p>
                        </div>
            </div>
            <div class="aez-promo">
            <img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
                    <div style="margin-top: 5.2%;">
                        <span style="color: #8ED8F8;">Advantage Expressway</span>
                        <p class="aez-uppercase" style= "color: white;">For leisure travelers</p>
                        <p style= "color: white;">
                           Receive a free class upgrade instantly when you sign up for the Advantage Expressway program!
                        </p>
                    </div>
            </div>
        </div>

	    <div class="aez-member-login aez-vacation-spans">
	        <span>Advantage Expressway</span>
	        <a href="/login" class="aez-btn aez-btn--filled-green">Log In To Your Account</a>
	        <span>Not An Expressway Member?</span>
	        <a href="javascript:void(0);" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</a>
	    </div>
    </div>
</div>';

//         // $this->ddl_select_box = '<h1>test</h1>';
// 		$page_path = '/vehicles';
//         // return $this->ddl_select_box;
// 		$page = get_page_by_path($page_path);
// error_log('      %%%%%%%%%%%%%%%%');

// 	    if(!$page){
// 	        echo '<code>'.$page_path.'</code> Does not exist.';
// Adv_login_Helper::err_log('No page', __FUNCTION__,__LINE__);
// 	    } else{
// Adv_login_Helper::err_log('Page Page Page!!!', __FUNCTION__,__LINE__);
// 	        echo '<code>'.$page_path.'</code> Exists and resolves to: <code>'.get_permalink($page->ID).'</code>';
// 	    }
// Adv_login_Helper::err_log($_REQUEST,__FUNCTION__,__LINE__);
// Adv_login_Helper::err_log($_GET,__FUNCTION__,__LINE__);
// Adv_login_Helper::err_log($_POST,__FUNCTION__,__LINE__);

	return $this->location_list;
    }
}
