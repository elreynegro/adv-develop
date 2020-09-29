<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');

 
class AdvRez_Enhance_Shortcode extends AdvRez_ShortCodeScriptLoader {

	public $enhance_options_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_register_style( 'remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');
            wp_register_style( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css' );
            wp_register_style( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/css/pikaday.css' );

            $styles = array('remove-margin', 'select2', 'pikaday');
            wp_enqueue_style($styles);

            wp_register_script( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
            wp_register_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
            wp_register_script( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
            wp_register_script( 'mask', get_stylesheet_directory_uri() . '/vendor/jQuery-Mask-Plugin-1.14.0/dist/jquery.mask.min.js', array(), null, true );
            wp_register_script( 'adv_reserve-summary-dropdown', plugins_url('js/adv_reserve-summary-dropdown.js'), array('jquery'), null, true );
            wp_register_script( 'adv_save_and_review', plugins_url('js/adv_save_and_review.js', __FILE__), array('jquery', 'main'),  null, true );
            wp_register_script( 'drop-down-js', get_stylesheet_directory_uri() . '/js/drop-down.js', array ( 'jquery', 'jquery-ui-js' ), null, true);

            $scripts = array('jquery', 'select2', 'moment', 'pikaday', 'mask', 'adv_reserve-summary-dropdown', 'adv_save_and_review', 'drop-down-js');
            wp_enqueue_script($scripts);

            wp_localize_script( 'adv_rez', 'ADV_Rez_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {

        if (isset($_SESSION['reserve']['express_checkout_complete_flag'])) {
            AdvRez_Helper::NoCarsFound(false);
            return '<div>An error occured. Please try your search again.</div>';
		}            
		
		//remove one hand control, if user has two hand controls
		$enhance_vehicle_options = $_SESSION['reserve']['vehicleOptions']; 
		
		$sort_options_handcontrol_filter = array();
                
                if(count($enhance_vehicle_options) > 0){
                    foreach($enhance_vehicle_options as $voption){  
			if($voption == 'HCR' || $voption == 'HCL'){
				array_push($sort_options_handcontrol_filter,$voption);
			}
                    }
                    if(count($sort_options_handcontrol_filter) == 2){
			$key = array_search ('HCR', $enhance_vehicle_options);
			unset($enhance_vehicle_options[$key]);
                    }
                }

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        
        // location code for get booking engine id
        $get_location_code=$_SESSION["search"]['rental_location_id'];
            
        $booking_engine_id=AdvLocations_Helper::isValidExpresswayLocation($get_location_code);
       
        // get  user all rewards
        if($booking_engine_id == 1) {                
            $expressway_rewards = $_SESSION['available_awards_unique_sort'];
        } 
		
        //Handle hand controls
        $add_options_tmp = $_SESSION['reserve']['vehicleOptions'];
        if(count($enhance_vehicle_options) > 0){
            if(in_array('HCL', $add_options_tmp) && in_array('HCR', $add_options_tmp)) {
                            $arr_key =  array_search("HCR", $add_options_tmp);
                            unset($_SESSION['reserve']['vehicleOptions'][$arr_key]);
            }
        }
        
        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

		$car_key = -1;
		 
		if (isset($_SESSION['enhance']['vehicleIndex'])) {
			$car_key = $_SESSION['enhance']['vehicleIndex'];
		}

		$payment_type = 'none';
		if (isset($_SESSION['enhance']['payment_type'])) {
			$payment_type = $_SESSION['enhance']['payment_type'];
		}

        // Check if RatePlan is weekly or daily. 
        if (strtoupper($_SESSION['choose'][$car_key]['RatePlan']) == 'WEEKLY') {
            $days = "week";
            $days_ly = "weekly";
        } else {
            $days = "day";
            $days_ly = "daily";
		}

		// Get the currency symbol for the country
		$currency_symbol =  AdvRez_Helper::getAdvCurrency($_SESSION['choose'][$car_key]['CurrencyCode']);

		
		$closing_tags = '
    	</main>
	</div>';
        $this->enhance_options_html = '';
        
        //pre populate registered user information
        $additional_options = '';
        
        if(isset($_SESSION['adv_login'])) {
                $profile_data = Adv_login_Helper::getAdvFullUser();
                $additional_options = explode(",", $profile_data['AdditionalOption']);

                foreach ($additional_options as $add_value) {
                    if($add_value == 'HCR' || $add_value == 'HCL'){
                            array_push($sort_options_handcontrol_filter,$voption);
                    }
                }
                if(count($sort_options_handcontrol_filter) == 2){
                    $key = array_search ('HCR', $additional_options);
                    unset($additional_options[$key]);
                }  
                
                if(in_array('GPS',$additional_options)){
                                    $additional_options[]="MTECH";
                            }else if(in_array('MTECH',$additional_options)){
                               $additional_options[]="GPS";	
                    }
	}

//FB pixel code
        $pick_date_fb = (string)$_SESSION['search']['pickup_date'];
        $arr = str_split($pick_date_fb, 4);
        $arr2 = str_split($arr[0], 2);
        array_shift($arr);
        $pick_date = implode("-", array_merge($arr, $arr2)); 
       
        $drop_date_fb = (string)$_SESSION['search']['dropoff_date'];
        $arr3 = str_split($drop_date_fb, 4);
        $arr4 = str_split($arr3[0], 2);
        array_shift($arr3);
		$drop_date = implode("-", array_merge($arr3, $arr4)); 
		$member_number = $_SESSION['adv_login']->memberNumber;
		if (isset($member_number)) {  
			$awards_header_response = AdvAwards_Helper::getAwardsPageHeaderInfo($member_number);
            ?>
        <input type="hidden" name="BestTier" id="BestTier" value="<?php echo $awards_header_response['BestTier'];?>" />
		<?php } ?>
		
		<script>

		fbq('track', 'ViewContent', {
			content_type: '["destination", "car"]',
			content_ids: '<?php echo $_SESSION['enhance']['ClassCode'];?>',
			departing_departure_date: '<?php echo $pick_date;?>',
			returning_departure_date: '<?php echo $drop_date;?>',
			origin_airport: '<?php echo $_SESSION['search']['rental_location_name'];?>',
			destination_airport: '<?php echo $_SESSION['search']['return_location_name'];?>',
			city: '<?php echo $_SESSION['search']['rental_location_city'];?>',
			region: '<?php echo $_SESSION['search']['rental_location_state'];?>',
			country: '<?php echo $_SESSION['search']['rental_location_country'];?>',
			purchase_currency: '<?php echo $_SESSION['choose'][0]['CurrencyCode'];?>',
		});
		</script>

<!----- Sojern Tag v6_js, Pixel Version: 2 -->
<?php if (isset($this->api_url_array['sojern_flag']) && strtolower($this->api_url_array['sojern_flag']) == "y") { ?>
	<script>
	var loyaltyStatus = document.getElementById("BestTier");
    if(loyaltyStatus !== null) {
        loyaltyStatus = loyaltyStatus.value;
    }
    else {
        loyaltyStatus = "Non member";
    }
	(function () {
		/* Please fill the following values. */
		var params = {
		rd1: "<?php echo $pick_date;?>", /* Pickup Date */
        rd2: "<?php echo $drop_date;?>", /* Dropoff Date */
        ra1: "<?php echo $_SESSION['search']['rental_location_name'];?>", /* Nearest Airport to Rental Pickup */
        rc1: "<?php echo $_SESSION['search']['rental_location_city'];?>", /* Pickup City */
        rs2: "<?php echo $_SESSION['search']['rental_location_state'];?>", /* Pickup State or Region */
        ra2: "<?php echo $_SESSION['search']['return_location_name'];?>", /* Nearest Airport to Rental Dropoff */
        rc2: "<?php echo $_SESSION['search']['return_location_city'];?>", /* Dropoff City */
        rs1: "<?php echo $_SESSION['search']['return_location_state'];?>", /* Dropoff State or Region */
		rcu: "<?php echo $_SESSION['choose'][0]['CurrencyCode'];?>", /* Purchase Currency */
		rc: "<?php echo $_SESSION['choose'][$car_key]['ClassCode'];?>", /* Vehicle Class */
		ffl: loyaltyStatus /* Loyalty Status */
		};

		/* Please do not modify the below code. */
		var cid = [];
		var paramsArr = [];
		var cidParams = [];
		var pl = document.createElement('script');
		var defaultParams = {"vid":"car"};
		for(key in defaultParams) { params[key] = defaultParams[key]; };
		for(key in cidParams) { cid.push(params[cidParams[key]]); };
		params.cid = cid.join('|');
		for(key in params) { paramsArr.push(key + '=' + encodeURIComponent(params[key])) };
		pl.type = 'text/javascript';
		pl.async = true;
		pl.src = 'https://beacon.sojern.com/pixel/p/10991?f_v=v6_js&p_v=2&' + paramsArr.join('&');
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(pl);
		// console.log("ENHANCE PAGE ---> ");
        // console.log(params);
	})();
	</script>
	<!-- End Sojern Tag -->
<?php } ?>

        <?php
        
		$this->enhance_options_html .= '<div id="primary">
		<input type="hidden" id="payment_type" name="payment_type" value="'. $_SESSION['enhance']['payment_type'] . '">
		<input type="hidden" id="ls_pay_later_total" name="ls_pay_later_total" value="'. sprintf('%01.2f', strval($_SESSION['choose'][$car_key]['RRateAmount'])) . '">
		<input type="hidden" id="ls_pay_now_total" name="ls_pay_now_total" value="'. sprintf('%01.2f', strval($_SESSION['choose'][$car_key]['PRateAmount'])) . '">
		<input type="hidden" id="ls_descp" name="ls_descp" value="'. $_SESSION['choose'][$car_key]['ModelDesc'] . '">
		<input type="hidden" id="vehicle_image" name="vehicle_image" value="'. $_SESSION['choose'][$car_key]['ClassImageURL'] . '">
		<input type="hidden" id="rental_location" name="rental_location" value="'. ($_SESSION['search']['rental_location_name']) . ' (' . $_SESSION['search']['rental_location_id'] . ')">
		<input type="hidden" id="return_location" name="return_location" value=" ' . ($_SESSION['search']['return_location_name']) . ' (' . $_SESSION['search']['return_location_id'] . ')">
		<input type="hidden" id="pickup_date_time" name="pickup_date_time" value="'. $_SESSION['search']['pickup_date_time'] . '">
		<input type="hidden" id="dropoff_date_time" name="dropoff_date_time" value="'. $_SESSION['search']['dropoff_date_time'] . '">
		<input type="hidden" id="count_extras_check" name="count_extras_check" value="'. $_SESSION['enhance']['DailyExtra'][0] . '">
		<input type="hidden" id="count_extras" name="count_extras" value="'. count($_SESSION['enhance']['DailyExtra']) . '">';
		// echo count($_SESSION['enhance']['DailyExtra']);
		// for($extras_count_val=0; $extras_count_val < count($_SESSION['enhance']['DailyExtra']); $extras_count_val++) {
		// 	$this->display_reservation .= '<input type="hidden" name="ls_extra" value="'.  $_SESSION['enhance']['DailyExtra'][$extras_count_val]['ExtraDesc'] . '">
		// 	<input type="hidden" name="extras_image" value="/wp-content/plugins/advantage-reservations/assets/' . $_SESSION['enhance']['DailyExtra'][$extras_count_val]['ExtraCode'] . '.png">
		// 	<input type="hidden" name="ls_extraRate" value="'.  $_SESSION['enhance']['DailyExtra'][$extras_count_val]['ExtraAmount'] . '">';
		// }
	$this->enhance_options_html .= '<main id="main" role="main" class="aez-reservation"> 
    	<form id="submit-enhance" action="/reserve" class="form-horizontal enhancements_chosen aez-reservation-flow-form" role="form" method="POST" name="adv_enhance">
        <div class="aez-progress-bar content-mobile-hide">
			<div class="aez-progress-bar__item aez-progress-bar__item--completed">
				<a id="progress" href="#"><div class="aez-progress-bar__item-text">Choose</div>
				<div class="aez-progress-bar__item-arrow"></div></a>
			</div>
			<div class="aez-progress-bar__item aez-progress-bar__item--completed">
				<div class="aez-progress-bar__item-text">Enhance</div>
				<div class="aez-progress-bar__item-arrow"></div>
			</div>
			<div class="aez-progress-bar__item">
				<div class="aez-progress-bar__item-text">Reserve</div>
				<div class="aez-progress-bar__item-arrow"></div>
			</div>
		</div>
		
        <div class="aez-reservation-summary is-open aez-reservation-summary__full">'.
            '<div class="aez-reservation-title-bar enhance-reserve-title">'.
                '<h3>Enhance Your Car </h3>'.
                // <!-- <span>Total: US $200.00</span> -->
            '</div>'.
			
            '<div class="aez-reservation-container">'.
                '<div class="aez-reservation-info">'.
                    '<div class="aez-reservation-edit">'.
                        // '<span>Modify Reservation </span>'.
                        '<i class="fa fa-pencil-square-o"></i>'.
                    '</div>'.
                    '<div class="aez-reservation-section">'.
                        '<h4 class="aez-all-caps -blue">Pick Up</h4>'.
                        '<h5 class="aez-reservation-date">' . $_SESSION['search']['pickup_date_formatted'] . '</h5>'.
                        '<h5 class="aez-reservation-time"> ' . $_SESSION['search']['pickup_time'] . '</h5>'.
                        '<p class="aez-reservation-text">
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_name'])) . ' (' . $_SESSION['search']['rental_location_id'] .  ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_city'])) . ', ' . $_SESSION['search']['rental_location_state'] . ' ' . $_SESSION['search']['rental_location_zip'] . '
                        </p>'.
                    '</div>'.
                    '<div class="aez-reservation-section ">'.
                        '<h4 class="aez-all-caps -blue">Drop Off</h4>'.
                        '<h5 class="aez-reservation-date">'. $_SESSION['search']['dropoff_date_formatted'] . '</h5>'.
                        '<h5 class="aez-reservation-time"> ' . $_SESSION['search']['dropoff_time'] . '</h5>'.
                        '<p class="aez-reservation-text">
                            ' . ucwords(strtolower($_SESSION['search']['return_location_name'])) . ' (' . $_SESSION['search']['return_location_id'] .  ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_city'])) . ', ' . $_SESSION['search']['return_location_state'] . ' ' . $_SESSION['search']['return_location_zip'] . '
                        </p>'.
                    '</div>'.
					'<div class="aez-reservation-section content-mobile">';
					$this->enhance_options_html .= '<div class="aez-car-option aez-selected-car aez-car-option--active enhance-page " data-class-code="' . $_SESSION['choose'][$car_key]['ClassCode'] . '" data-selected="true">
			<div class="aez-vehicle-img tablet-enhance">
				<img src="' . $_SESSION['choose'][$car_key]['ClassImageURL'] . '" alt="car picture">
			</div><div class="aez-vehicle-content aez-enhance-selection">
			<span class="aez-enhance-selection__car-type car-type tablet-enhance-box-content">'. $_SESSION['choose'][$car_key]['Category'] . ' ' . $_SESSION['choose'][$car_key]['Type'] . '
			</span>';
                    if($_SESSION['choose'][$car_key]['ClassCode'] == 'XXAR') {
        $this->enhance_options_html .='<span class="aez-enhance-selection__car-name" style="font-size: .8em !important;">' . $_SESSION['choose'][$car_key]['ModelDesc'] . '</span>';
                    }
                    else{
        $this->enhance_options_html .='<span class="aez-enhance-selection__car-name">' . $_SESSION['choose'][$car_key]['ModelDesc'] . '';
                    }           
        $this->enhance_options_html .='<span class="or_similar"> (Or Similar)</span></span>
				<span class="aez-enhance-selection__car-price">'.$currency_symbol;


					if ($payment_type == 'prepaid') {
						$this->enhance_options_html .= $_SESSION['choose'][$car_key]['PRateAmount'];
					} else {
						$this->enhance_options_html .= $_SESSION['choose'][$car_key]['RRateAmount'];
					}
		$this->enhance_options_html .= '		</span>
			</div>
			<input
				type="radio" checked="checked"
				name="rate_id"
				data-class-code="'. $_SESSION['choose'][$car_key]['ClassCode'] . '"
				data-rate-id="'. $_SESSION['choose'][$car_key]['RateID'] . '" data-vehicle-index="' . $car_key  . '" data-vehicle-enhance-type="initial_selected_car"
				value="' . $_SESSION['choose'][$car_key]['RateID'] . '"
			/>
			';
			        //set display_options to the DisplayOptions session array 
        $display_options = $_SESSION['DisplayOptions'];

		// Loop though the display options and set the display variables.
		for ($x=0; $x < count($display_options); $x++) {
		    
		    switch ($display_options[$x]['name']) {
		        case 'Transmission':
		            $display_transmission = $display_options[$x]['name'];
		            break;
		        case 'Luggage':
		            $display_luggage = $display_options[$x]['name'];
		            break;
		        case 'Passengers':
		            $display_passengers = $display_options[$x]['name'];
		            break;
		        case 'MPG':
		            $display_mpg = $display_options[$x]['name'];
		            break;
		    } // End switch

		} // End for loop
			$this->enhance_options_html .= '
			<div class="aez-mini-details enhance-your-car-details">
					<span>
						<i class="fa fa-road" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['Transmission'] . '</p>
					</span>';
                      if (isset($display_mpg)) {
					$this->enhance_options_html .= '
					<span>
						<i class="fa fa-tachometer" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['MPGCity'] . '/' . $_SESSION['choose'][$car_key]['MPGHighway'] . ' mpg</p>
					</span>';
					}
					if (isset($display_passengers)) {
				 	$this->enhance_options_html .= '
					<span>
						<i class="fa fa-users" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['Passengers'] . '</p>
					</span>';
				}
				if (isset($display_luggage)) {
					$this->enhance_options_html .= '
					<span>
						<i class="fa fa-suitcase" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['Luggage'] . '</p>
					</span>';
				}
				 $this->enhance_options_html .= '	</div>
		</div>';
							
					
					$this->enhance_options_html .= '</div>'.
                '</div>'.
                '<span class="aez-all-caps aez-sub -blue">Close</span>'.
            '</div>'.
        '</div>';
		

        if ( $payment_type ==	 'none' || $car_key == -1 ) {
        	// Fix to go back from choose page if no cars are found
        	AdvRez_Helper::NoCarsFound(true);
        	
	        $this->enhance_options_html .= '<div class="aez-choose-results-bar">'.
                            '<span class="aez-choose-results-bar__heading">No Vehicle Selected</span>'.
                        '</div>';
	        $this->enhance_options_html .= $closing_tags;
	        return $this->enhance_options_html;
        }

        // $_SESSION['enhance']['rate_id'] = $_SESSION['choose'][$car_key]['RateID'];
        // $_SESSION['enhance']['class_code'] = $_SESSION['choose'][$car_key]['ClassCode'];
        // $_SESSION['enhance']['payment_type'] = $payment_type;

		// $selected_first =  AdvRez_Helper::first_letter(substr($_SESSION['choose'][$car_key]['ClassCode'], 0, 1));
		// $selected_second =  AdvRez_Helper::second_letter(substr($_SESSION['choose'][$car_key]['ClassCode'], 1, 1));
		// $selected_third =  AdvRez_Helper::third_letter(substr($_SESSION['choose'][$car_key]['ClassCode'], 2, 1));
		// $selected_fourth =  AdvRez_Helper::fourth_letter(substr($_SESSION['choose'][$car_key]['ClassCode'], 3, 1));

		$upgrade_car_key = $_SESSION['choose'][$car_key]['upgrade'];

		$live_a_little_car_key = $_SESSION['choose'][$car_key]['live_a_little'];

        $_SESSION['enhance']['initial_selected_car'] = $car_key;
        $_SESSION['enhance']['initial_selected_car_class_code'] = $_SESSION['choose'][$car_key]['ClassCode'];
        $_SESSION['enhance']['upgrade_car'] = $upgrade_car_key;
        $_SESSION['enhance']['upgrade_car_class_code'] = $_SESSION['choose'][$upgrade_car_key]['ClassCode'];
        $_SESSION['enhance']['live_a_little_car'] = $live_a_little_car_key;
        $_SESSION['enhance']['live_a_little_car_class_code'] = $_SESSION['choose'][$live_a_little_car_key]['ClassCode'];
        
        //set display_options to the DisplayOptions session array 
        $display_options = $_SESSION['DisplayOptions'];

		// Loop though the display options and set the display variables.
		/*for ($x=0; $x < count($display_options); $x++) {
		    
		    switch ($display_options[$x]['name']) {
		        case 'Transmission':
		            $display_transmission = $display_options[$x]['name'];
		            break;
		        case 'Luggage':
		            $display_luggage = $display_options[$x]['name'];
		            break;
		        case 'Passengers':
		            $display_passengers = $display_options[$x]['name'];
		            break;
		        case 'MPG':
		            $display_mpg = $display_options[$x]['name'];
		            break;
		    } // End switch

		} // End for loop    */

        $this->enhance_options_html .= '<div class="aez-car-option aez-selected-car aez-car-option--active enhance-page content-mobile-hide" data-class-code="' . $_SESSION['choose'][$car_key]['ClassCode'] . '" data-selected="true">
			<div class="aez-vehicle-img tablet-enhance">
				<img src="' . $_SESSION['choose'][$car_key]['ClassImageURL'] . '" alt="car picture">
			</div>
			<div class="aez-vehicle-content aez-enhance-selection">
			<span class="aez-enhance-selection__car-type car-type tablet-enhance-box-content">'. $_SESSION['choose'][$car_key]['Category'] . ' ' . $_SESSION['choose'][$car_key]['Type'] . '</span>';
                    if($_SESSION['choose'][$car_key]['ClassCode'] == 'XXAR') {
        $this->enhance_options_html .='<span class="aez-enhance-selection__car-name" style="font-size: .8em !important;">' . $_SESSION['choose'][$car_key]['ModelDesc'] . '</span>';
                    }
                    else{
        $this->enhance_options_html .='<span class="aez-enhance-selection__car-name">' . $_SESSION['choose'][$car_key]['ModelDesc'] . '';
                    }           
        $this->enhance_options_html .='<span class="or_similar"> (Or Similar)</span></span>
				<span class="aez-enhance-selection__car-price">'.$currency_symbol;


					if ($payment_type == 'prepaid') {
						$this->enhance_options_html .= $_SESSION['choose'][$car_key]['PRateAmount'];
					} else {
						$this->enhance_options_html .= $_SESSION['choose'][$car_key]['RRateAmount'];
					}
		$this->enhance_options_html .= '</span>
			</div>
			<input
				type="radio" checked="checked"
				name="rate_id"
				data-class-code="'. $_SESSION['choose'][$car_key]['ClassCode'] . '"
				data-rate-id="'. $_SESSION['choose'][$car_key]['RateID'] . '" data-vehicle-index="' . $car_key  . '" data-vehicle-enhance-type="initial_selected_car"
				value="' . $_SESSION['choose'][$car_key]['RateID'] . '"
			/>

			<div class="aez-mini-details">
					<span>
						<i class="fa fa-road" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['Transmission'] . '</p>
					</span>';
                      if (isset($display_mpg)) {
					$this->enhance_options_html .= '
					<span>
						<i class="fa fa-tachometer" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['MPGCity'] . '/' . $_SESSION['choose'][$car_key]['MPGHighway'] . ' mpg</p>
					</span>';
					}
					if (isset($display_passengers)) {
				 	$this->enhance_options_html .= '
					<span>
						<i class="fa fa-users" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['Passengers'] . '</p>
					</span>';
				}
				if (isset($display_luggage)) {
					$this->enhance_options_html .= '
					<span>
						<i class="fa fa-suitcase" aria-hidden="true"></i>
						<p>' . $_SESSION['choose'][$car_key]['Luggage'] . '</p>
					</span>';
					
				}
				 $this->enhance_options_html .= '	</div>
		</div>
';

		if ($upgrade_car_key > -1 ) {

			if ($payment_type == 'prepaid') {
				$selected_rate_amount = $_SESSION['choose'][$car_key]['PRateAmount'];
				$upgrade_rate_amount = $_SESSION['choose'][$upgrade_car_key]['PRateAmount'];
			} else {
				$selected_rate_amount = $_SESSION['choose'][$car_key]['RRateAmount'];
				$upgrade_rate_amount = $_SESSION['choose'][$upgrade_car_key]['RRateAmount'];
			}

			$upgrade_amount = $upgrade_rate_amount - $selected_rate_amount;

			$this->enhance_options_html .= '<div class="aez-upsell-cars-container">';

			$this->enhance_options_html .= '<div class="aez-car-option aez-upgrade-container upgrade-car" data-class-code="'. $_SESSION['choose'][$upgrade_car_key]['ClassCode'] . '" data-selected="false">
				<div class="aez-upgrade-content upgrade-car">
					<span class="aez-upgrade-content__title upgrade-car">Upgrade to </span>
					<span class="aez-upgrade-content__car-name upgrade-car">' . $_SESSION['choose'][$upgrade_car_key]['ModelDesc'] . '<span class="or_similar"> (Or Similar)</span> </span>
					<span class="for_additional"> for additional</span>
					<span class="aez-upgrade-content__description upgrade-car"><b class="upgrade-car"> ' . $currency_symbol . number_format($upgrade_amount, 2, '.', '') . '</b> /' . $days . '!</span>
				</div>
				<div class="aez-vehicle-img upgrade-car">
					<img src="'. $_SESSION['choose'][$upgrade_car_key]['ClassImageURL'] . '" alt="car picture" class="upgrade-car">
				</div>
				<input type="radio" name="rate_id" data-class-code="'. $_SESSION['choose'][$upgrade_car_key]['ClassCode'] . '" data-rate-id="'. $_SESSION['choose'][$upgrade_car_key]['RateID'] . '" data-vehicle-index="' . $upgrade_car_key  . '" data-vehicle-enhance-type="upgrade_car" value="'. $_SESSION['choose'][$upgrade_car_key]['RateID'] . '">
			</div>';

			if ($live_a_little_car_key > -1 ) {

				if ($payment_type == 'prepaid') {
					$live_a_little_rate_amount = $_SESSION['choose'][$live_a_little_car_key]['PRateAmount'];
				} else {
					$live_a_little_rate_amount = $_SESSION['choose'][$live_a_little_car_key]['RRateAmount'];
				}

				$live_a_little_amount = $live_a_little_rate_amount - $selected_rate_amount;

				$this->enhance_options_html .= '<div class="aez-car-option aez-upgrade-container live-a-little" data-class-code="'. $_SESSION['choose'][$live_a_little_car_key]['ClassCode'] . '" data-selected="false">
					<div class="aez-upgrade-content live-a-little">
						<span class="aez-upgrade-content__title live-a-little">Live a little with </span><span class="aez-upgrade-content__car-name live-a-little">' . $_SESSION['choose'][$live_a_little_car_key]['ModelDesc'] . '<span class="or_similar"> (Or Similar)</span></span>
						<span class="for_additional"> for additional</span>
						<span class="aez-upgrade-content__description live-a-little"><b class="live-a-little"> ' . $currency_symbol . number_format($live_a_little_amount, 2, '.', '') . '</b> /' . $days . '!</span>
						
						
					</div>
					<div class="aez-vehicle-img live-a-little">
						<img src="'. $_SESSION['choose'][$live_a_little_car_key]['ClassImageURL'] . '" alt="car picture" class="live-a-little">
					</div>
					<input type="radio" name="rate_id" data-class-code="'. $_SESSION['choose'][$live_a_little_car_key]['ClassCode'] . '" data-rate-id="'. $_SESSION['choose'][$live_a_little_car_key]['RateID'] . '" data-vehicle-index="' . $live_a_little_car_key  . '" data-vehicle-enhance-type="live_a_little_car" value="'. $_SESSION['choose'][$live_a_little_car_key]['RateID'] . '">
				</div>';
			}

			$this->enhance_options_html .= '</div>';
		}

		if(isset($expressway_rewards)){
			foreach($expressway_rewards as $rew)  {
				foreach ($_SESSION['enhance']['DailyExtra'] as $k => $v) {
					if($rew['TSDExtraCode']==$v['ExtraCode']) {
						$expway_reward[$v['ExtraCode']] = array('promocode'=>$rew['AwardCode'],'stackable'=>$rew['Stackable']);        
					}
				}
			}
		}
		
		

		// Check if the extras are empty. If they aren't display them.
		if (!empty($_SESSION['enhance']['DailyExtra']) && ($_SESSION['enhance']['DailyExtra'][0]['Status'] != 'ERROR')) {
                    
 
                        $choose_title_class = ($additional_options != '' && !isset($_SESSION['reserve']['vehicleOptions']))?"enhance-choose-title":'';
 			
                        // Extra's *** Need to add dynamic call
			$this->enhance_options_html .= '<div class="aez-choose-option-container">
				<h1 class="'.$choose_title_class.'">Choose Options</h1>';
                        
                        if($additional_options != '' && !isset($_SESSION['reserve']['vehicleOptions']) ) {
                            $this->enhance_options_html .= '<div class="presel-enhance-ribbon-container"> 
                                                                <span class="preselectlabel-enhance-text"> Member Pre-Selected</span>
                                                                <span data-ribbon-enhance-heading="SELECTED" class="aez-enhance-header-pre-select-ribbon"></span>                                    
                                                            </div>';   
                        }
                        
                         $this->enhance_options_html .='<div style="clear: both;"></div>';
                	foreach ($_SESSION['enhance']['DailyExtra'] as $key => $value) {
				# code...
            
                                $option_class_start_div = '';
                                $option_checked = '';
                                $data_ribbon='';
                                $select_free_expresss='';
                                $exp_opt_selected = 0;
                                if(!isset($_SESSION['reserve']['vehicleOptions']) && $additional_options != '' && in_array($value['ExtraCode'], $additional_options)) {
                                        $option_class_start_div = ' aez-options--active aez-options-pre-sel';
                                        $option_checked = 'checked="checked"';      
                                        $data_ribbon='data-ribbone="SELECTED"';
                                    }
                                if($_SESSION['choose_promos']['PromoCodeEntered']['PromoMsg'] == 'Valid free car seat' && $value['ExtraCode'] == 'CHILDSEAT') {
                                        $option_class_start_div = ' aez-options--active aez-options-pre-sel';
                                        $option_checked = 'checked="checked"'; 
                                        $data_ribbon='data-ribbone="SELECTED"';
                                    }
                          
                                $exp_flag = 0;
                       
                                /* handle express rewards after come back from reserve page */
                                if(isset($_SESSION['reserve']['vehicleOptions'])&& isset($expway_reward)&& isset($_SESSION['adv_login']->memberNumber)) {                           
                              
                                    $stackable = '';    
                                   if(array_key_exists($value['ExtraCode'], $expway_reward)) {
                                         $sel_attr = '';
                                         
                                
                                        if(isset($_SESSION['search']['promo_codes']) && empty($_SESSION['search']['promo_codes'][0])&&($expway_reward[$value['ExtraCode']]['stackable'] == "False")){
                                            $stackable = "";  
                                         }
                                   
										/* compare user all rewards with his redeem */ 
										if(count($_SESSION['search']['promo_codes']) > 0) {
											foreach ($_SESSION['search']['promo_codes'] as $exp_promo) {
											$false_stackable = "1";
										
												$exp_opt_selected = (isset($_SESSION['reserve']['vehicleOptions']) && in_array($value['ExtraCode'], $_SESSION['reserve']['vehicleOptions']))?1:0;
												/* compare user all rewards with his redeem */
												if($expway_reward[$value['ExtraCode']]['promocode'] == $exp_promo && $exp_opt_selected == 1&&($expway_reward[$value['ExtraCode']]['stackable'] == "False")){
													
													$exp_flag = 1;
													$stackable = "free-text-disable";  
													$sel_attr = 'expressway-selected="true" ';
													
													break;
												}else if($expway_reward[$value['ExtraCode']]['promocode'] == $exp_promo && $exp_opt_selected == 1&&($expway_reward[$value['ExtraCode']]['stackable'] == "True")){
									
													$exp_flag = 1;
													$stackable = "free-text-disable";
													$sel_attr = 'expressway-selected="true" ';
													break;
												} 
											
											}
										}
                                        /*enable only one stackable false*/
                                        $false_all_stackable = (($false_stackable == 1)&&($exp_flag == 1)&&($expway_reward[$value['ExtraCode']]['stackable'] == "False"))?'ff free-text-disable':''; 
                                      
                                        $select_free_expresss = '<div '.$sel_attr.'  data-promo-code="'.$expway_reward[$value['ExtraCode']]['promocode'].'" data-express-free='.$value['ExtraCode'].' data-stackable="'.$expway_reward[$value['ExtraCode']]['stackable'].'"  class="free_express_code '.$stackable.'  '.$false_all_stackable.'" ><a href="javascript:void(0);" class="sel_free_text">OR SELECT FREE WITH EXPRESSWAY&nbsp;<i style="margin-left: 2px;" class="fa fa-question-circle" title="Click link to apply '.$value['ExtraCode'].' promocode to the reservation."></i>
										</a></div>';
                                   }
                                }else if(!isset($_SESSION['reserve']['vehicleOptions'])&& isset($expway_reward) && isset($_SESSION['adv_login']->memberNumber)) {
                                        $stackable = '';
                                        if(array_key_exists($value['ExtraCode'], $expway_reward)) {
                         
                                        $sel_attr = '';
                                        /* compare user all rewards with his redeem */
                                        foreach ($_SESSION['search']['promo_codes'] as $exp_promo) {

                                              if($expway_reward[$value['ExtraCode']]['promocode'] == $exp_promo ){
                                                  $exp_flag = 1;
                                                  $stackable = "free-text-disable"; 
                                                  $sel_attr = 'expressway-selected="true"  ';
                                                  $option_class_start_div = ' aez-options--active aez-options-pre-sel';
                                                  break;
                                              }
                                          }
                                                                           
                                        $select_free_expresss = '<div '.$sel_attr.'  data-promo-code="'.$expway_reward[$value['ExtraCode']]['promocode'].'" data-express-free='.$value['ExtraCode'].' data-stackable="'.$expway_reward[$value['ExtraCode']]['stackable'].'"  class="free_express_code '.$stackable.'"><a href="javascript:void(0);"  class="sel_free_text">OR SELECT FREE WITH EXPRESSWAY&nbsp;<i style="margin-left: 2px;" class="fa fa-question-circle" title="Click link to apply '.$value['ExtraCode'].' promocode to the reservation."></i>
										</a></div>';
                                   }    
                                    
                                }
							
                                $exp_clses = ' exp-spl-text'.strtolower($value['ExtraCode']);
				$this->enhance_options_html .= '<div addtional-opt-price='.$value['ExtraAmount'].' addtional-opt-code='.$value['ExtraCode'].' class="'. $value['ExtraCode'] . ' aez-options '.str_replace(' ', '-', trim(strtolower($value['ExtraDesc']))). $option_class_start_div.'" '.$data_ribbon.'>
                                                <div class="aez-options__img '.str_replace(' ', '-', trim(strtolower($value['ExtraDesc']))).'">
							<img src="/wp-content/plugins/advantage-reservations/assets/' . $value['ExtraCode'] . '.png" alt="' . ucfirst(strtolower($value['ExtraDesc'])) . '">
						</div>

						<div class="aez-options__info '.str_replace(' ', '-', trim(strtolower($value['ExtraDesc']))).'">
							<h3 class="'.str_replace(' ', '-', trim(strtolower($value['ExtraDesc']))).'">' . ucfirst(strtolower($value['ExtraDesc'])) . '</h3>';

                                        $extra_amout_disp = ($exp_flag == 1)?number_format(0, 2):number_format($value['ExtraAmount'], 2);
                                        
                                	$this->enhance_options_html .=	'		
							<button class="aez-options__button aez-btn aez-btn--outline-blue '.str_replace(' ', '-', trim(strtolower($value['ExtraDesc']))).'">
								<span>Select For</span> <b>' . $currency_symbol . '<span  class="'.$exp_clses.'">'. $extra_amout_disp .'</span></b> <span>/day </span>
							</button>
                                                        '.$select_free_expresss.'';             

           
					$this->enhance_options_html .= '	</div>
                                                
						<input id="'. $value['ExtraCode'] . '"  class="vehicle_options_checkbox" type="checkbox" name="options[]" value="' . $value['ExtraCode'] . '"  '.$option_checked.' >
					</div>';

			}
		}
		// $this->enhance_options_html .= '<div class="aez-options">
		// 		<div class="aez-options__img">
		// 			<img src="/wp-content/uploads/2016/11/additional-driver.png" alt="Additional Driver">
		// 		</div>

		// 		<div class="aez-options__info">
		// 			<h3>Additional Driver</h3>
		// 			<p>Share time behind the wheel</p>
		// 			<button class="aez-options__button aez-btn aez-btn--outline-blue">
		// 				<span>Select For</span> <b>$12.75</b> <span>per day</span>
		// 			</button>
		// 		</div>
		// 		<input type="checkbox" name="options[]" value="additional_driver">
		// 	</div>


		// 	<div class="aez-options">
		// 		<div class="aez-options__img">
		// 			<img src="/wp-content/plugins/advantage-vehicles/assets/CarSeat.png" alt="Baby Seat">
		// 		</div>

		// 		<div class="aez-options__info">
		// 			<h3>Child\'s Car Seat</h3>
		// 			<p>For newborns through XX Pounds</p>
		// 			<button class="aez-options__button aez-btn aez-btn--outline-blue">
		// 				<span>Select For</span> <b>$12.75</b> <span>per day</span>
		// 			</button>
		// 		</div>
		// 		<input type="checkbox" name="options[]" value="baby_seat">
		// 	</div>

		// 	<div class="aez-options">
		// 		<div class="aez-options__img">
		// 			<img src="/wp-content/uploads/2016/11/left-hand-controls.png" alt="Hand Controls on Left">
		// 		</div>

		// 		<div class="aez-options__info">
		// 			<h3>Hand Controls on Left</h3>
		// 			<p>For our customers with disabilities</p>
		// 			<button class="aez-options__button aez-btn aez-btn--outline-blue">
		// 				<span>Select For</span> <b>$0.00</b> <span>per day</span>
		// 			</button>
		// 		</div>
  //               <input type="checkbox" name="options[]" value="hand_controls_left">
		// 	</div>

		// 	<div class="aez-options">
		// 		<div class="aez-options__img">
		// 			<img src="/wp-content/uploads/2016/11/right-hand-controls.png" alt="Hand Controls on Right">
		// 		</div>

		// 		<div class="aez-options__info">
		// 			<h3>Hand Controls on Right</h3>
		// 			<p>For our customers with disabilities</p>
		// 			<button class="aez-options__button aez-btn aez-btn--outline-blue">
		// 				<span>Select For</span> <b>$0.00</b> <span>per day</span>
		// 			</button>
		// 		</div>
		// 		<input type="checkbox" name="options[]" value="hand_controls_right">
		// 	</div>
		// </div>';


		$this->enhance_options_html .= '<div class="aez-reservation__fixed-footer">
		    <div class="aez-reservation__row">
		        <a href="/choose" class="aez-reservation__back-btn">Back</a>
		        <span class="aez-reservation__save-btn">Next</span>
		    </div>
		</div>';

		// Close off <form> tag -- Do we need these hidden variables?
		$this->enhance_options_html .= '
			<input type="submit" class="aez-btn aez-btn--filled-green aez-reserve-btn" value="Next">
		</form>';

		$this->enhance_options_html .= '
			<input type="hidden" id="progress-rental-location" name="progress-rental-location" value="'. $_SESSION['search']['rental_location_id']. '">
			<input type="hidden" id="progress-return-location" name="progress-return-location" value="'. $_SESSION['search']['return_location_id']. '">

			<input type="hidden" id="progress-pickup-date" name="progress-pickup-date" value="'. $_SESSION['search']['pickup_date']. '">
			<input type="hidden" id="progress-pickup-time" name="progress-pickup-time" value="'. $_SESSION['search']['pickup_time']. '">

			<input type="hidden" id="progress-dropoff-date" name="progress-dropoff-date" value="'. $_SESSION['search']['dropoff_date']. '">
			<input type="hidden" id="progress-dropoff-time" name="progress-dropoff-time" value="'. $_SESSION['search']['dropoff_time']. '">
			<input type="hidden" id="progress-express-checkout-option" name="progress-express-checkout-option" value="'. $_SESSION['search']['express_checkout_option']. '">';

			if ($_SESSION['search']['promo_codes'] > 0) {
				foreach ($_SESSION['search']['promo_codes'] as $value) {
					$this->enhance_options_html .= '<input type="hidden" id="progress-promo-codes" name="progress-promo-codes[]" value="'. $value. '">';
				}
			}

        $this->enhance_options_html .= $closing_tags;

        return $this->enhance_options_html;

    }


}
