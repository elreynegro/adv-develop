<?php
include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_ReserveShortcode extends AdvRez_ShortCodeScriptLoader {

    public $display_reservation;

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
            // wp_register_style( 'valid-forms', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/css/forms.css' );
            // wp_register_style( 'valid-js-socnet', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/css/js-socnet.css' );
            // wp_register_style( 'valid-js-splash', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/css/js-splash.css' );
            // wp_register_style( 'valid-tables', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/css/tables.css' );
            // wp_register_style( 'valid-layout', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/css/layout.css' );
            // wp_register_style( 'valid-mobile', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/css/mobile.css' );

            $styles = array('remove-margin', 'select2', 'pikaday');
            wp_enqueue_style($styles);

            // Register Scripts to be loaded
            wp_register_script( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
            wp_register_script( 'js-form-validator', get_stylesheet_directory_uri() . '/vendor/js-form-validator-master/js-form-validator.js', array('jquery'), null, true );            
            wp_register_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
            wp_register_script( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
            wp_register_script( 'validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true );
            wp_register_script( 'mask', get_stylesheet_directory_uri() . '/vendor/jQuery-Mask-Plugin-1.14.0/dist/jquery.mask.min.js', array(), null, true );
            wp_register_script( 'promo-code-add-remove', get_stylesheet_directory_uri() . '/js/promo-code-add-remove.js', array('jquery'), null, true );
            wp_register_script( 'adv_reserve', plugins_url('js/adv_reserve_form.js', __FILE__), array('jquery'), null, true);
            wp_register_script( 'adv_confirm', plugins_url('js/adv_confirm_form.js', __FILE__), array('jquery', 'main'), '1.0', true );
            wp_register_script( 'adv_reserve-summary-dropdown', plugins_url('js/adv_reserve-summary-dropdown.js', __FILE__), array('jquery'), null, true );
            wp_register_script( 'adv_accordion_menu', plugins_url('js/adv_accordion_menu.js', __FILE__), array('jquery', 'main'), null, true);
            wp_register_script( 'adv_login', plugins_url('adv_login/js/adv_login.js'), array('jquery', 'main', 'select2'),  null, true );
            wp_register_script( 'adv_save_and_review', plugins_url('js/adv_save_and_review.js', __FILE__), array('jquery', 'main'),  null, true );
            wp_register_script( 'adv_js_encrypt', plugins_url('js/jsencrypt.min.js', __FILE__), array('jquery', 'main'),  null, true );
            wp_register_script( 'drop-down-js', get_stylesheet_directory_uri() . '/js/drop-down.js', array ( 'jquery', 'jquery-ui-js' ), null, true);
           
            $scripts = array('jquery', 'select2', 'js-form-validator', 'moment', 'pikaday', 'mask', 'promo-code-add-remove', 'adv_reserve', 'adv_confirm','adv_reserve-summary-dropdown', 'adv_accordion_menu', 'adv_login', 'adv_save_and_review','adv_js_encrypt','drop-down-js');
            wp_enqueue_script($scripts);

            wp_localize_script( 'adv_login', 'ADV_Ajax', array(
                'ajaxurl'   => admin_url( 'admin-ajax.php' ),
                'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
                )
            );

         }
    }


    // adv rez confirm shortcode
    public function handleShortcode($atts) {

    $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

    if ($_SESSION['enhance']['payment_type'] == 'prepaid') {
        $is_prepaid = true;
    } else {
        $is_prepaid = false;
    }
    // If the price is 0 or less then redirect customer to the home page
    if (($is_prepaid && $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PTotalCharges'] <= 0) || (!$is_prepaid && $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RTotalCharges'] <= 0)) {
        $URL="/";
        $_SESSION['session_expired'] = "yes";
        echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
        return;
    }

    // $search_cookie = json_decode(base64_decode($_COOKIE['search']), true);
    
    //expressway flow get rewards
    //$expressway_rewards = $_SESSION['available_awards_unique_sort'];
    
    // location code for get booking engine id
    $get_location_code = $_SESSION["search"]['rental_location_id'];

    $booking_engine_id = AdvLocations_Helper::isValidExpresswayLocation($get_location_code);
    $member_number = $_SESSION['adv_login']->memberNumber;

    if($booking_engine_id == 1 && isset($member_number)) {

        /*Session set */
              if (!isset($_SESSION['available_awards'])) {  
              
                $_SESSION['available_awards'] = AdvAwards_Helper::getAvailableMemberAwards($member_number);
                
                //set rewards to session with unique and sort
                $available_awards = isset($_SESSION['available_awards']) ? $_SESSION['available_awards'] : '';
                $_SESSION['available_awards_unique_sort'] = AdvAwards_Helper::sortAwardsBasedExpireDate($available_awards);
            }
         $expressway_rewards = $_SESSION['available_awards_unique_sort'];
    }

    $exp_rewards_flag = isset($expressway_rewards[0]['AwardType']) ? true : false;
    
    if (! $this->valuesSet()) {
        AdvRez_Helper::NoCarsFound(false);
        return '<div>An error occured. Please try your search again.</div>';
    }
   
    $renterAage = $_SESSION['search']['age'];
    $pickup_day = intval(substr($_SESSION['search']['pickup_date_time'], 2, 2));
    $pickup_month = intval(substr($_SESSION['search']['pickup_date_time'], 0, 2));
    $pickup_year = intval(substr($_SESSION['search']['pickup_date_time'], 4, 4));
    $pickup_time = substr($_SESSION['search']['pickup_date_time'], -8);

    $dropoff_day = intval(substr($_SESSION['search']['dropoff_date_time'], 2, 2));
    $dropoff_month = intval(substr($_SESSION['search']['dropoff_date_time'], 0, 2));
    $dropoff_year = intval(substr($_SESSION['search']['dropoff_date_time'], 4, 4));
    $dropoff_time = substr($_SESSION['search']['dropoff_date_time'], -8);

    $vehicle_picked = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];

    $vehicle_prepaid_amount = sprintf('%01.2f', strval($vehicle_picked['PRateAmount']));
    $vehicle_prepaid_charge = sprintf('%01.2f', strval($vehicle_picked['PRateCharge']));
    if ($vehicle_picked['PTotalTaxes'] == 'Included') {
        $vehicle_prepaid_taxes = 'Included';
    } else {
        $vehicle_prepaid_taxes = sprintf('%01.2f', strval($vehicle_picked['PTotalTaxes']));
    }
    $vehicle_prepaid_extras = sprintf('%01.2f', strval($vehicle_picked['PTotalExtras']));
    $vehicle_prepaid_total = sprintf('%01.2f', strval($vehicle_picked['PTotalCharges']));
    $vehicle_prepaid_discount = sprintf('%01.2f', strval($vehicle_picked['PRateDiscount']));
    $vehicle_counter_amount = sprintf('%01.2f', strval($vehicle_picked['RRateAmount']));
    $vehicle_counter_charge = sprintf('%01.2f', strval($vehicle_picked['RRateCharge']));
    if ($vehicle_picked['RTotalTaxes'] == 'Included') {
        $vehicle_counter_taxes = 'Included';
    } else {
        $vehicle_counter_taxes = sprintf('%01.2f', strval($vehicle_picked['RTotalTaxes']));
    }
    $vehicle_counter_extras = sprintf('%01.2f', strval($vehicle_picked['RTotalExtras']));
    $vehicle_counter_total = sprintf('%01.2f', strval($vehicle_picked['RTotalCharges']));
    $vehicle_counter_discount = sprintf('%01.2f', strval($vehicle_picked['RRateDiscount']));
    
 
        // $v_prepaid = ($_SESSION['reserve']['Prepaid'] == 'Y' ? 'P' : 'R');
// error_log('     vvvvvvvvvvvvv vvvvvvv vvvvv v vvv vehicle_picked: ' . print_r($vehicle_picked, true));

    $initial_counter_display  = '';
    $initial_prepaid_display  = '';
    $counter_display = '';
    $prepaid_display = '';
    $saved_card_display = 'display: none;';
    
    
    $pay_now_content_disp = ($_SESSION['enhance']['payment_type'] == 'prepaid')?'block':'none';
        
    if(isset($_SESSION['enhance']['payment_type']) && isset($_SESSION['submit']['payment_type']) && $_SESSION['submit']['payment_type'] == 'prepaid') {
        $pay_now_content_disp = ($_SESSION['submit']['payment_type'] == 'prepaid')?'block':'none';
    }
    
    if ($_SESSION['enhance']['payment_type'] == 'prepaid' ) {
        $saved_card_display = '';
    
// error_log('    IN PREPAID');
// *** CHANGE THIS FOR PREPAID TESTING
        $pay_now_value = 'checked';
        $pay_later_value = '';
        $is_prepaid = true;
        // $pay_now_value = '';
        // $pay_later_value = 'checked';
        $initial_counter_display  = ' style="display: none;"';
        $counter_display  = ' style="display: none;"';
    } else {
// error_log('    IN NO NO NO NO NO NO');
        $pay_now_value = '';
        $pay_later_value = 'checked';
        $is_prepaid = false;
        $initial_prepaid_display  = ' style="display: none;"';
        $prepaid_display  = ' style="display: none;"';
    }

    $prepaid_rate_amount = sprintf('%01.2f', strval($vehicle_prepaid_amount));
    $prepaid_rate_charge = sprintf('%01.2f', strval($vehicle_prepaid_charge));
    $prepaid_total_taxes = ($vehicle_prepaid_taxes <= 0) ? "Included" : $vehicle_prepaid_taxes;
    $prepaid_total_extras = sprintf('%01.2f', strval($vehicle_prepaid_extras));
    $prepaid_total_charges = sprintf('%01.2f', strval($vehicle_prepaid_total));
    $prepaid_discount = sprintf('%01.2f', strval($vehicle_prepaid_discount));

    $counter_rate_amount = sprintf('%01.2f', strval($vehicle_counter_amount));
    $counter_rate_charge = sprintf('%01.2f', strval($vehicle_counter_charge));
    $counter_total_taxes = ($vehicle_counter_taxes <= 0) ? "Included" : $vehicle_counter_taxes;
    $counter_total_extras = sprintf('%01.2f', strval($vehicle_counter_extras));
    $counter_total_charges = sprintf('%01.2f', strval($vehicle_counter_total));
    $counter_discount = sprintf('%01.2f', strval($vehicle_counter_discount));

    $discount_percent = ($vehicle_picked['RRateDiscount'] == '' && $vehicle_picked['PRateDiscount'] == '')?0:$vehicle_picked['DiscountPercent'];

// error_log('is prepaid? ' . print_r($is_prepaid, true));
//         $action = "";
//         $rental_location = "";
//         $return_location = "";
//         $pickup_date = "";
//         $pickup_time = "";
//         $dropoff_date = "";
//         $dropoff_time = "";
//         $promo_codes[] = "";

//         if (isset($_COOKIE['adv_userbookmark'])) {
//             // Remove the slashes
//             $json = stripslashes($_COOKIE['adv_userbookmark']);
           
//             // Decode the json
//             $json = json_decode(base64_decode($json));


// // error_log('json: ' . print_r($json, true));          

//             foreach ($json as $key => $value) {

//                 switch (strtolower($key)) {
//                     case 'action':
//                         $action = $value;
//                         break;
//                     case 'rental_location_id':
//                         $rental_location = $value;
//                         break;
//                     case 'return_location_id':
//                         $return_location = $value;
//                         break;
//                     case 'rental_location_name':
//                         $rental_location_name = $value;
//                         break;
//                     case 'return_location_name':
//                         $return_location_name = $value;
//                         break;
//                     case 'pickup_date':
//                         $pickup_date = $value;
//                         break;
//                     case 'pickup_time':
//                         $pickup_time = $value;
//                         break;
//                     case 'dropoff_date':
//                         $dropoff_date = $value;
//                         break;
//                     case 'dropoff_time':
//                         $dropoff_time = $value;
//                         break;
//                     // case 'promo_codes':
//                     //     $promo_codes[0] = $value;
//                     //     break;
//                 }

//             }
//         }

        $action = "";
        $rental_location = "";
        $return_location = "";
        $pickup_date = "";
        $pickup_time = "";
        $dropoff_date = "";
        $dropoff_time = "";
        $promo_codes[] = "";

        if (isset($_SESSION['search'])) {

            if (isset($_SESSION['search']['action'])) {
                $action = $_SESSION['search']['action'];
            }
            if (isset($_SESSION['search']['rental_location_id'])) {
                $rental_location = $_SESSION['search']['rental_location'];
            }
            if (isset($_SESSION['search']['return_location_id'])) {
                $return_location = $_SESSION['search']['return_location'];
            }
            if (isset($_SESSION['search']['rental_location_name'])) {
                $rental_location_name = $_SESSION['search']['rental_location_name'];
            }
            if (isset($_SESSION['search']['return_location_name'])) {
                $return_location_name = $_SESSION['search']['return_location_name'];
            }
            if (isset($_SESSION['search']['pickup_date'])) {
                $pickup_date = $_SESSION['search']['pickup_date'];
            }
            if (isset($_SESSION['search']['pickup_time'])) {
                $pickup_time = $_SESSION['search']['pickup_time'];
            }
            if (isset($_SESSION['search']['dropoff_date'])) {
                $dropoff_date = $_SESSION['search']['dropoff_date'];
            }
            if (isset($_SESSION['search']['dropoff_time'])) {
                $dropoff_time = $_SESSION['search']['dropoff_time'];
            }
            if (isset($_SESSION['search']['promo_codes'])) {
                $promo_codes[0] = $_SESSION['search']['promo_codes'];
            }
            if (isset($_SESSION['search']['age'])) {
                $renter_age = $_SESSION['search']['age'];
            } elseif (empty($_SESSION['search']['age']) || $_SESSION['search']['age'] == '') {
                $renter_age = '25+';
            }
        }
    
        //Update the promo
        if (isset($_SESSION['abandonment_promocode'])) {
            array_push($promo_codes[0],$_SESSION['abandonment_promocode']);
        }

    // Don't show under 25 message
    $birthday_25_msg_show = ' style="display: none;"';
    $birthday_21_msg_show = ' style="display: none;"';

    if (isset($_SESSION['renter']['renter_dob'])) {

        $pickup_of_25_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 25);
        $pickup_of_21_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 21);

        // Check the renter birthday is set and not blank. If there's a renter birthday, then set the current_entered_birthday variable
        if (isset($_SESSION['renter']['renter_dob']) && $_SESSION['renter']['renter_dob'] !== "") {
            $current_entered_birthday = mktime(0, 0, 0, 
                substr($_SESSION['renter']['renter_dob'], 0, 2),
                substr($_SESSION['renter']['renter_dob'], 3, 2),
                substr($_SESSION['renter']['renter_dob'], 6, 4) );
        }

// error_log('current_entered_birthday: ' . print_r($current_entered_birthday, true));
// error_log('pickup_of_25_years_ago: ' . print_r($pickup_of_25_years_ago, true));
// error_log('pickup_of_21_years_ago: ' . print_r($pickup_of_21_years_ago, true));

        // If under 25 years old on day of pick, show message
        if ($current_entered_birthday > $pickup_of_21_years_ago) {
// error_log('under 25');
            $birthday_21_msg_show = ' ';
            // $birthday_21_msg_show = ' ';
        } else if ($current_entered_birthday > $pickup_of_25_years_ago) {
// error_log('under 21');
            $birthday_25_msg_show = ' ';
        } else {
// error_log('older than 25');            
            // $birthday_21_msg_show = ' ';
        }

    }

    // Check if RatePlan is weekly or daily. 
    if (strtoupper($vehicle_picked['RatePlan']) == 'WEEKLY') {
        $days = "week";
        $days_ly = "weekly";
    } else {
        $days = "day";
        $days_ly = "daily";
    }

    // Get the currency symbol for the country
    $currency_symbol =  AdvRez_Helper::getAdvCurrency($vehicle_picked['CurrencyCode']);
  
    // Display default information for registered users
    $profile_data = Adv_login_Helper::getAdvFullUser();
    $profile_data_u = $profile_data;
    $dob = ($profile_data_u['DOB'] != '' && strtotime($profile_data_u['DOB']) != '')?date('m/d/Y', strtotime($profile_data_u['DOB'])):'';
    $profile_data_u['DOB'] = $dob;
    if (isset($_SESSION['adv_login']) && !isset($_SESSION['renter']['renter_first']) ) {
        $profile_data_u['renter_dob'] = $dob;
        $dob = ($profile_data['DOB'] != '' && strtotime($profile_data['DOB']) != '')?date('m/d/Y', strtotime($profile_data['DOB'])):'';
        $profile_data['renter_first'] = $profile_data['FirstName'];
        $profile_data['renter_last'] = $profile_data['LastName'];
        $profile_data['renter_home_phone'] = $profile_data['MobileNumber'];
        $profile_data['renter_email_address'] = $profile_data['Email'];
        $profile_data['renter_dob'] = $dob;
        $profile_data['renter_address1'] = $profile_data['AddressLine1'];
        $profile_data['renter_address2'] = $profile_data['AddressLine2'];
        $profile_data['renter_zip'] = $profile_data['PostalCode'];
        $profile_data['renter_city'] = $profile_data['City'];     
        $profile_data['renter_state'] = $profile_data['State'];        
        $_SESSION['renter']['renter_state'] = $profile_data['State'];
        $_SESSION['renter']['renter_dob'] = $dob;

    }

    if(isset($_SESSION['renter']['renter_first'])) {
        $profile_data['renter_first'] = $_SESSION['renter']['renter_first'];
        $profile_data['renter_last'] = $_SESSION['renter']['renter_last'];
        $profile_data['renter_home_phone'] = $_SESSION['renter']['renter_home_phone'];
        $profile_data['renter_email_address'] = $_SESSION['renter']['renter_email_address'];
        $profile_data['renter_dob'] = $_SESSION['renter']['renter_dob'];
        $profile_data['renter_address1'] = $_SESSION['renter']['renter_address1'];
        $profile_data['renter_address2'] = $_SESSION['renter']['renter_address2'];
        $profile_data['renter_zip'] = $_SESSION['renter']['renter_zip'];
        $profile_data['renter_city'] = $_SESSION['renter']['renter_city'];
        $profile_data['renter_state'] = $_SESSION['renter']['renter_state'];        
    }

    //This flag is used handle express checkout begins
    $exp_flag = (isset($_SESSION['adv_login']) && isset($_SESSION['reserve']['express_checkout_complete_flag']))?1:0;
    $style1 = ($exp_flag == 1)?'display:none':'';
    $style2 = ($exp_flag == 0)?'display:none':'';
    //This flag is used handle express checkout  ends
?>
<script type="text/javascript">
    (function(d) { 
        if (document.addEventListener) 
        document.addEventListener('ltkAsyncListener', d); 
        else {
            e = document.documentElement; 
            e.ltkAsyncProperty = 0; 
            e.attachEvent('onpropertychange', function (e) { 
                if (e.propertyName == 'ltkAsyncProperty')
                {
                    d();
                }
            });
        }
    })
    (function() { 
        /********** Begin Custom Code **********/ 
        _ltk.SCA.CaptureEmail('email');
        /********** End Custom Code **********/ 
    });
   
</script>

    <?php
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

    ?>
    <script>

    fbq('track', 'InitiateCheckout', {
        content_type: '["destination", "car"]',
        content_ids: '<?php echo $_SESSION['enhance']['ClassCode'];?>',
        departing_departure_date: '<?php echo $pick_date;?>',
        returning_departure_date: '<?php echo $drop_date;?>',
        origin_airport: '<?php echo $_SESSION['search']['rental_location_name'];?>',
        destination_airport: '<?php echo $_SESSION['search']['return_location_name'];?>',
        city: '<?php echo $_SESSION['search']['rental_location_city'];?>',
        region: '<?php echo $_SESSION['search']['rental_location_state'];?>',
        country: '<?php echo $_SESSION['search']['rental_location_country'];?>',
        purchase_currency: '<?php echo $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['CurrencyCode'];?>',
    });
    </script>

    <?php
    $this->display_reservation = '<div id="primary">
    <input type="hidden" id="ls_pay_later_total" name="ls_pay_later_total" value="'. sprintf('%01.2f', strval($vehicle_picked['RTotalCharges'])) . '">
    <input type="hidden" id="ls_pay_now_total" name="ls_pay_now_total" value="'. sprintf('%01.2f', strval($vehicle_picked['PTotalCharges'])) . '">
    <input type="hidden" id="ls_descp" name="ls_descp" value="'. $vehicle_picked['ModelDesc'] . '">
    <input type="hidden" id="vehicle_image" name="vehicle_image" value="'. $vehicle_picked['ClassImageURL'] . '">
    <input type="hidden" id="rental_location" name="rental_location" value="'. ($_SESSION['search']['rental_location_name']) . ' (' . $_SESSION['search']['rental_location_id'] . ')">
    <input type="hidden" id="return_location" name="return_location" value=" ' . ($_SESSION['search']['return_location_name']) . ' (' . $_SESSION['search']['return_location_id'] . ')">
    <input type="hidden" id="pickup_date_time" name="pickup_date_time" value="'. $_SESSION['search']['pickup_date_time'] . '">
    <input type="hidden" id="dropoff_date_time" name="dropoff_date_time" value="'. $_SESSION['search']['dropoff_date_time'] . '">
    <input type="hidden" id="count_extras_check" name="count_extras_check" value="'. $_SESSION['reserve']['DailyExtra'][0] . '">
    <input type="hidden" id="count_extras" name="count_extras" value="'. count($_SESSION['reserve']['DailyExtra']) . '">';

    for($extras_count_val=0; $extras_count_val < count($_SESSION['reserve']['DailyExtra']); $extras_count_val++) {
        $this->display_reservation .= '<input type="hidden" name="ls_extra" value="'.  $_SESSION['reserve']['DailyExtra'][$extras_count_val]['ExtraDesc'] . '">
        <input type="hidden" name="extras_image" value="/wp-content/plugins/advantage-reservations/assets/' . $_SESSION['reserve']['DailyExtra'][$extras_count_val]['ExtraCode'] . '.png">
        <input type="hidden" name="ls_extraRate" value="'.  $_SESSION['reserve']['DailyExtra'][$extras_count_val]['ExtraAmount'] . '">';
}

    $this->display_reservation .= AdvRez_Helper::reservePromocodeMessageDsiplay();
       
    $this->display_reservation .='    
    <div class="aez-page-title aez-page-title-express" style="'.$style2.'">
        <h1>EXPRESSWAY MEMBER CHECKOUT</h1>
    </div>
        
    <main id="main" role="main" class="aez-reservation">
   
        <div class="aez-progress-bar" style="'.$style1.'">
            <div class="aez-progress-bar__item aez-progress-bar__item--completed">
                <a id="progress" href="#"><div class="aez-progress-bar__item-text">Choose</div>
                <div class="aez-progress-bar__item-arrow"></div></a>
            </div>
            <div class="aez-progress-bar__item aez-progress-bar__item--completed">
                <a href="/enhance"><div class="aez-progress-bar__item-text">Enhance</div>
                <div class="aez-progress-bar__item-arrow"></div></a>
            </div>
            <div class="aez-progress-bar__item aez-progress-bar__item--completed">
                <div class="aez-progress-bar__item-text">Reserve</div>
                <div class="aez-progress-bar__item-arrow"></div>
            </div>
        </div>';


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
        
        
        $this->display_reservation .= '<div id="reserve_page_sum" class="aez-reservation-summary aez-reservation-summary__sidebar is-open">
            <div class="aez-reservation-title-bar" data-page-name="reserve">
                <h3>Reservation Summary </h3>
                   <span class="aez-reserve-dolar-display"' . $initial_prepaid_display . '>Total: '. $currency_symbol .'<span id="vehicle_prepaid_total_title">'.sprintf('%01.2f', strval($vehicle_prepaid_total)).'</span></span>
                   <span class="aez-reserve-dolar-display"' . $initial_counter_display . '>Total: '. $currency_symbol .'<span id="vehicle_counter_total_title"">'. sprintf('%01.2f', strval($vehicle_counter_total)) .'</span></span>
            </div>
            <div class="aez-reservation-container">';

            $this->display_reservation .='
        <div class="aez-selected-car-container">
            <!--<h3 style="'.$style2.'">MEMBER PREFERRED OPTIONS PRE-SELECTED:</h3>-->
            <div class="aez-selected-car reserve-page">
                <div class="aez-vehicle-img"><img src="' . $vehicle_picked['ClassImageURL'] . '" alt="car picture">
                </div>
                <div class="aez-vehicle-content aez-reserve-selection">
                    <!--<span class="aez-enhance-selection__selected">Selected:</span>-->
                  <span class="aez-enhance-selection__car-type car-type">'. $vehicle_picked['Category'] . ' ' . $vehicle_picked['Type'] . '
                  <a href="/choose" ><span class="aez-enhance-selection__selected1"><i class="fa fa-pencil-square-o" style="font-size: 1.85em !important;"></i></span></a></span>';
                    if($vehicle_picked['ClassCode'] == 'XXAR') {
        $this->display_reservation .='<span class="aez-enhance-selection__car-name" style="font-size: 0.9em !important;">' . $vehicle_picked['ModelDesc'] . '<span class="or_similar"> (or similar)</span></span>';
                    }
                    else{
        $this->display_reservation .='<span class="aez-enhance-selection__car-name">' . $vehicle_picked['ModelDesc'] . '<span class="or_similar"> (or similar)</span></span>';
                    }           
        $this->display_reservation .='
                    <div class="aez-mini-details reserve-page">
                        <span>
                            <i class="fa fa-road" aria-hidden="true"></i>
                            <p>' . $vehicle_picked['Transmission'] . '</p>
                        </span>';
                        
                            if (isset($display_mpg)) {
                            $this->display_reservation .= '
                            <span>
                                <i class="fa fa-tachometer" aria-hidden="true"></i>
                                <p>' . $vehicle_picked['MPGCity'] . '/' . $vehicle_picked['MPGHighway'] . ' mpg</p>
                            </span>';
                         }
                       if (isset($display_passengers)) {
                            $this->display_reservation .= '
                            <span>
                                <i class="fa fa-users" aria-hidden="true"></i>
                                <p>' . $vehicle_picked['Passengers'] . '</p>
                            </span>';
                        }
                        if (isset($display_luggage)) {
                            $this->display_reservation .= '
                            <span>
                                <i class="fa fa-suitcase" aria-hidden="true"></i>
                                <p>' . $vehicle_picked['Luggage'] . '</p>
                            </span>';
                        }

                     $this->display_reservation .= ' </div></div></div></div>';
        $this->display_reservation .=' <div class="aez-reservation-info">
                    <div class="aez-reservation-section">
                        <h4 class="aez-all-caps -blue">Pick Up <i class="aez-reservation-edit fa fa-pencil-square-o"></i></h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year)) .'</h5>
                        <h5 class="aez-reservation-time">' . strtolower($pickup_time) . '</h5>
                        <p class="aez-reservation-text">
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_name'])) . ' (' . $_SESSION['search']['rental_location_id'] . ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_city'])) . ', ' . $_SESSION['search']['rental_location_state'] . ' ' . $_SESSION['search']['rental_location_zip'] . '
                        </p>
                    </div>

                    <div class="aez-reservation-section">
                        <h4 class="aez-all-caps -blue">Drop Off</h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $dropoff_month, $dropoff_day, $dropoff_year)) . '</h5>
                        <h5 class="aez-reservation-time">' . strtolower($dropoff_time) . '</h5>
                        <p class="aez-reservation-text">
                            ' . ucwords(strtolower($_SESSION['search']['return_location_name'])) . ' (' . $_SESSION['search']['return_location_id'] . ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_city'])) . ', ' . $_SESSION['search']['return_location_state'] . ' ' . $_SESSION['search']['return_location_zip'] . '
                        </p>
                    </div>
                </div>';
                       $this->display_reservation .= AdvRez_Helper::generateReserveSummaryWithUpdatedContent();
              
               $this->display_reservation .='
                <span class="aez-all-caps aez-sub -blue">Close</span>
            </div>
        </div>';
     
        /* Display additional options for express checkout */             
        $numOptions = count($_SESSION['reserve']['DailyExtra']);
        
        // Loop through the extras
        if(($numOptions > 0 && $_SESSION['enhance']['DailyExtra'][0]['Status'] != 'ERROR' && isset($_SESSION['enhance']['DailyExtra'][0]['ExtraCode'])) || $exp_rewards_flag) {
            $vehicle_options = $_SESSION['reserve']['vehicleOptions'];
            foreach($_SESSION['enhance']['DailyExtra'] as $sort_opt) {
                foreach($vehicle_options as $key=> $opt) {
                    $chk_flag = 0;
                    if($opt == $sort_opt['ExtraCode']) {
                        $chk_flag = 1;
                        break;
                    }
                }
                if($chk_flag == 1) {
                    $sort_option_arr['sel'][] = $sort_opt;
                } else {
                    $sort_option_arr['unsel'][] = $sort_opt;
                }
            }
            
            if(isset($sort_option_arr['sel']) && !isset($sort_option_arr['unsel']))
                $sort_options = $sort_option_arr['sel'];
            if(isset($sort_option_arr['unsel']) && !isset($sort_option_arr['sel']))
                $sort_options = $sort_option_arr['unsel'];            
            if(isset($sort_option_arr['sel']) && isset($sort_option_arr['unsel']))
                $sort_options = array_merge($sort_option_arr['sel'], $sort_option_arr['unsel']);  

    // Sojern pixel var
        if ($_SESSION['reserve']['Prepaid'] !== 'N') { ?>
            <input type="hidden" name="rate_amount" id="rate_amount" value="<?php echo $vehicle_picked['PRateAmount'];?>" />
      <?php } else { ?>
            <input type="hidden" name="rate_amount" id="rate_amount" value="<?php echo $vehicle_picked['RRateAmount'];?>" /> <?php
        }
    // end
        //get first name
        if (isset($_SESSION['adv_login']->memberNumber)) {
            $awards_header_response = AdvAwards_Helper::getAwardsPageHeaderInfo($member_number);
            ?>
            <input type="hidden" name="BestTier" id="BestTier" value="<?php echo $awards_header_response['BestTier'];?>" />
            <?php
        }
           
// <!--- Sojern Tag v6_js, Pixel Version: 2 -->
if (isset($this->api_url_array['sojern_flag']) && strtolower($this->api_url_array['sojern_flag']) == "y") { ?>
<script>
    var loyaltyStatus = document.getElementById("BestTier");
    if(loyaltyStatus !== null) {
        loyaltyStatus = loyaltyStatus.value;
    }
    else {
        loyaltyStatus = "Non member";
    }
    var rate_amount = document.getElementById("rate_amount").value;
    var promos = [];

    <?php for($i=0; $i<count($_SESSION['search']['promo_codes']); $i++) { ?>
            promos.push('<?php echo $_SESSION['search']['promo_codes'][$i];?>');
    <?php } ?>
    promos = promos.toString();
    (function () {
    /* Please fill the following values. */
        var params = {
            rd1: "<?php echo $pick_date;?>", /* Pickup Date */
            rd2: "<?php echo $drop_date;?>", /* Dropoff Date */
            ra1: "<?php echo $_SESSION['search']['rental_location_name'];?>", /* Nearest Airport to Rental Pickup */
            rc1: "<?php echo $_SESSION['search']['rental_location_city'];?>", /* Pickup City */
            rs2: "<?php echo $_SESSION['search']['rental_location_state'];?>", /* Pickup State or Region */
            rn1: "<?php echo $_SESSION['search']['rental_location_country'];?>", /* Pickup Country */
            ra2: "<?php echo $_SESSION['search']['return_location_name'];?>", /* Nearest Airport to Rental Dropoff */
            rc2: "<?php echo $_SESSION['search']['return_location_city'];?>", /* Dropoff City */
            rs1: "<?php echo $_SESSION['search']['return_location_state'];?>", /* Dropoff State or Region */
            rn2: "<?php echo $_SESSION['search']['return_location_country'];?>", /* Dropoff Country */
            rp: rate_amount, /* Rental Rate */
            rd: "<?php echo $vehicle_picked['RentalDays'];?>", /* Length of Travel in Nights */
            rcu: "<?php echo $vehicle_picked['CurrencyCode'];?>", /* Purchase Currency */
            rdc: promos, /* Discount Code */
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
        pl.src = 'https://beacon.sojern.com/pixel/p/49564?f_v=v6_js&p_v=3&' + paramsArr.join('&');
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(pl);
        // console.log("RESERVE PAGE ---> ");
        // console.log(params);
    })();
</script>
<!-- End Sojern Tag -->
<?php } ?>

            <?php  
                $this->display_reservation .= '
                    
                <div class="express_extra_options_container">
                <input type="hidden" name="opt_class_code" value="'.$_SESSION['reserve']['ClassCode'].'" />
                <input type="hidden" name="opt_rate_id" value="'.$_SESSION['reserve']['RateID'].'" />
                <input type="hidden" name="opt_vehicle_enhance_type" value="'.$_SESSION['reserve']['vehicleEnhanceType'].'" />
                <input type="hidden" name="opt_vehicle_index" value="'.$_SESSION['reserve']['vehicleIndex'].'" />
                <div class="change_option_btn">   
                </div>
                <input  style="display: none;" id="exp_checkout_update_option" class="remove_option_btn aez-btn aez-btn--filled-blue" type="button" value="Update Reservation">
                <!--<input  style="display: none;" id="exp_checkout_cancel_option" class="remove_option_btn aez-btn aez-btn--filled-blue" type="button" value="Cancel">-->
                </div>
                ';

            if ((!empty($_SESSION['enhance']['DailyExtra']) && ($_SESSION['enhance']['DailyExtra'][0]['Status'] != 'ERROR')) || $exp_rewards_flag) {
            $this->display_reservation .= '<div class="login_options">';
            if(!empty($_SESSION['adv_login']->memberNumber)){
                $this->display_reservation .= '<div class="options-text"><a data-display="0" data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#modal" id="edit_option_container_modal" href="javascript:void(0);" class="aez-btn aez-btn--filled-green aez-save-and-review-promo aez-btn--rounded" style="padding: 2px 4px;"><span style="font-size: 0.85em;font-weight: 400;">Modify Options<i class="fa fa-pencil-square-o"></i></span></a></div>
                <div class="modal fade" id="modal" style="padding-right: 0px !important;">
                    <div class="modal-dialog" style="max-width: 852px;">
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close modify_option_close" data-dismiss="modal">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="aez-form-block__header_left">
                                <p>Reservation Extras</p>
                            </div> 
                            <div class="aez-form-block__header">
                                <p>Available Expressway Benefits</p>
                            </div>
                            <div class="row reserve_page_2_column_design_row">
                                <ul class="col-11 col-md-6 rez_add_options list_vehicle_options_exp reserve_page_2_column_design">';
            }
            else{
                $this->display_reservation .= '<div class="login-text"><a data-display="0" id="log_in_reserve" href=""class="aez-btn aez-btn--filled-green aez-save-and-review-promo aez-btn--rounded" style="padding: 2px 4px;"><span style="font-size: 0.85em;font-weight: 400;">Log In</span></a></div>
                <div class="login_options-text"><a data-display="0" data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#modal" id="edit_option_container_modal" href="javascript:void(0);" class="aez-btn aez-btn--filled-green aez-save-and-review-promo aez-btn--rounded" style="padding: 2px 4px;"><span style="font-size: 0.85em;font-weight: 400;">Modify Options<i class="fa fa-pencil-square-o"></i></span></a></div>
                <div class="modal fade" id="modal" style="padding: 0 !important;">
                <div class="modal-dialog">
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close modify_option_close" data-dismiss="modal">×</button>
                        </div>
                        <div class="modal-body">
                        <div class="aez-form-block__header" style="width: 100%;">
                            <p>Reservation Extras</p>
                        </div>
                        <ul class="rez_add_options">';
            }

                $pre_check_flag  = 0;
                //filter dummy promo codes
                if (isset($_SESSION['search']['promo_codes'])) {
                $promo_codes = AdvRez_Helper::filter_valid_promo_codes($promo_codes[0],$_SESSION['choose_promos']['PromoCodeEntered']);
                }

                $clicked_stackable_false_flag = FALSE;

                if (isset($_SESSION['search']['promo_codes']) && isset($expressway_rewards)) {
                    foreach($_SESSION['search']['promo_codes'] as $loc_promo_codes) {
                        foreach ($expressway_rewards as $key => $val) {
                            if ($val['AwardCode'] == $loc_promo_codes) {
                                if($val['Stackable'] == "False") {
                                   $clicked_stackable_false_flag = TRUE;
                                } 
                            }
                        }
                    } 
                }

                //remove one hand control, if user has two hand controls
                $sort_options_handcontrol_filter = array();
                foreach($vehicle_options as $voption){  
                    if($voption == 'HCR' || $voption == 'HCL'){
                        array_push($sort_options_handcontrol_filter,$voption);
                    }
                }
                if(count($sort_options_handcontrol_filter) == 2){
                    $key = array_search ('HCR', $vehicle_options);
                    unset($vehicle_options[$key]);
                }
                
                //check code is selected free benefits
                $flag_open_modify_options = 0;
                $is_promo_code_added = 0;

                foreach($sort_options as $key => $x_option) {
                    $handControlCls = '';
                    if($x_option['ExtraCode'] == 'HCR' || $x_option['ExtraCode'] == 'HCL'){
                        $handControlCls = 'manage_hand_control';
                        $handControlChkBoxCls = 'manage_hand_control_check_box';
                    }
                    $opt_checked = '';
                    $opt_sel_class = "remove_option_btn option_unselected_list exp_vehicle_option_list_popup ".$handControlCls;
                    foreach($vehicle_options as $key1=> $opt) {
                        if($opt == $x_option['ExtraCode']) {
                            $opt_checked = 'checked="checked"';
                            $opt_sel_class = "option_selected_list exp_vehicle_option_list_popup exp_vehicle_option_list_popup_selected ".$handControlCls;
                            $pre_check_flag = 1;
                            break;
                        }
                    }

                    $add_free_benifit = $add_data_to_clickable_li = '';
                    $add_free_benifit_link_class = '';
                    $dont_set_class = "True";

                    if(!empty($_SESSION['adv_login']->memberNumber)) {
                        foreach($expressway_rewards as $exp_reward){

                            if($x_option['ExtraCode'] == $exp_reward['TSDExtraCode']) {
                                // This is mostly for Childseat. If the childseat isn't in the vehicle_options array then 
                                // make sure the option isn't selected by setting the exp_vehicle_option_list_popup_selected
                                // class. We want to skip that code by setting the flag to false.
                                if (isset($x_option['ExtraCode']) && isset($vehicle_options) && count($vehicle_options) > 0) {
                                    if (!in_array($x_option['ExtraCode'], $vehicle_options)) {
                                        $dont_set_class = "False";
                                    }
                                }

                                $exp_vehicle_option_exp_link_disabled = '';
                                
                                if(($clicked_stackable_false_flag) && $exp_reward['Stackable'] == "False"){
                                    $exp_vehicle_option_exp_link_disabled = 'exp_vehicle_option_exp_link_disabled';  
                                }

                                if(($clicked_stackable_false_flag) && $exp_reward['Stackable'] == "False" && $dont_set_class !== "False"){
                                    $opt_sel_class = "option_selected_list exp_vehicle_option_list_popup exp_vehicle_option_list_popup_selected ".$handControlCls;
                                }

                                if (isset($exp_reward['AwardCode']) && isset($_SESSION['search']['promo_codes']) && count($_SESSION['search']['promo_codes']) > 0) {
                                    if (in_array($exp_reward['AwardCode'], $_SESSION['search']['promo_codes'])) {
                                        $add_free_benifit_link_class = 'disabled btn_list_benifits_active';
                                    }
                                }

                                $flag_open_modify_options = $flag_open_modify_options+1;
                                if (isset($_SESSION['adv_login']->memberNumber)) {
                                    $add_free_benifit = '<a style="border: none !important;" href="javascript:void();" data-is_stackable="'.$exp_reward['Stackable'].'" class="'.$exp_vehicle_option_exp_link_disabled.' expressway-options-btn '.$add_free_benifit_link_class.'" data-selected_award_type="'.$x_option['ExtraCode'].'" data-promo_code="'.$exp_reward['AwardCode'].'">OR SELECT FREE WITH EXPRESSWAY<i style="margin-left: 2px;" data-toggle="tooltip" data-placement="bottom"  class="fa fa-question-circle" title="Click link to apply '.$exp_reward['AwardType'].' promocode to the reservation."></i></a>';   

                                    $add_data_to_clickable_li = 'data-is_stackable="'.$exp_reward['Stackable'].'" data-selected_award_type="'.$x_option['ExtraCode'].'" data-promo_code="'.$exp_reward['AwardCode'].'"';
                                }
                            }
                        }
                    }
                        
                    $this->display_reservation .= '
                            <li class="'.$opt_sel_class.'" '.$add_data_to_clickable_li.'>
                                    <label style="width: 100%;" for="change_option_label_'.$key.'" class="">
                                    <input id="change_option_label_'.$key.'" type="checkbox" class="'.$handControlChkBoxCls.' checkbox_vehicle_option aez-form-item__checkbox vehicle_options_checkbox_rez" '.$opt_checked.' value="'.$x_option['ExtraCode'].'" type="checkbox" >
                                <div class="vehicle_option_based_free_benefits">
                                <img class="reserve-option-img-modal" src="/wp-content/plugins/advantage-reservations/assets/' . $x_option['ExtraCode'] . '.png" alt="' . ucfirst(strtolower($x_option['ExtraDesc'])) . '">
                                <div class="reserve-option-desc-modal">
                                <span class="aez-reserve-dolar-display2 ">'.$x_option['ExtraDesc'].'</span>
                                '.$add_free_benifit.'
                                </div>
                                <!--<div class="'.$opt_sel_class.'" id="change_option_label_'.$key.'_option">&nbsp;</div>-->
                                <div class="reserve-option-amount-modal" data-org_amt="'.$currency_symbol . sprintf('%01.2f', strval($x_option['ExtraAmount'])).' /day"><label>'.$currency_symbol . sprintf('%01.2f', strval($x_option['ExtraAmount'])).' /day</label></div>
                                <div class="reserve-option-clear"></div>
<!--<span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'.$x_option['ExtraDesc'].'  <label> '. $currency_symbol . sprintf('%01.2f', strval($x_option['ExtraAmount'])) .' /day</label> <span class="aez-sub -blue"></span></span>-->

                                    </div>  
                                    </label>

                            </li>        
                        ';                      
                }

                $this->display_reservation .= '</ul>';
                if(empty($_SESSION['adv_login']->memberNumber)){ 
                    $this->display_reservation .= '<div class="update_button_div"><button type="button" id="expressway_flow_apply_to_reservation_modal_ul" class="btn btn-block apply-btn-text expressway_flow_apply_to_reservation">Update Reservation</button></div></div></div></div></div>';
                }
                if(!empty($_SESSION['adv_login']->memberNumber)){
                /************ expressway flow start *******/ 
                if(!empty($_SESSION['available_awards_unique_sort'])) {
                    $this->display_reservation .= '<div class="aez-form-block__header_benefits">
                            <p>Available Expressway Benefits</p>
                        </div>';
                }
                else {
                    $this->display_reservation .= '<div class="aez-form-block__header_benefits">
                            <p>There are no available benefits in your account.</p>
                        </div>';
                }
                $this->display_reservation .= '
                <div class="col-11 col-md-6 exp-reserve-benefit-container">';
                  
                $expressway_list = '';

                $clicked_stackable_false_flag = FALSE;
                if(count($_SESSION['search']['promo_codes']) > 0) {
                    foreach($_SESSION['search']['promo_codes'] as $loc_promo_codes) {
                        foreach ($expressway_rewards as $key => $val) {
                            if ($val['AwardCode'] == $loc_promo_codes) {
                                if($val['Stackable'] == "False") {
                                $clicked_stackable_false_flag = TRUE;
                                } 
                            }
                        }
                    } 
                }

                $no_rewards_flag = false;
                //buid expressway benefit buttons start
                foreach($expressway_rewards as $ek => $ev){
                    //if there is no expressway rewards
                    if($ev['Status'] == 'OK'){
                        $no_rewards_flag = true;
                    }
                    
                    $active_cls = '';
                    $exp_btn_disabled =  '';
                    $exp_btn_disabled_cls = ''; 

                    if(($clicked_stackable_false_flag) && $ev['Stackable'] == "False"){
                        $exp_btn_disabled =  'disabled="disabled"';
                        $exp_btn_disabled_cls = 'btn-grey'; 
                        $exp_vehicle_option_exp_link_disabled = 'btn_list_benifits_active';
                    }

                    if (is_array($_SESSION['search']['promo_codes']) && in_array($ev['AwardCode'], $_SESSION['search']['promo_codes'])) {
                        $active_cls = 'btn_list_benifits_active';
                        $exp_btn_disabled =  '';
                        $exp_btn_disabled_cls = ''; 
                    } 
                
                
                    $selected_val = isset($ev['TSDExtraCode']) ? $ev['TSDExtraCode'] : '';
      
                    $temp_add_div = 'style="display:block;"'; 
                    foreach ($sort_options as $key => $val) {
                    if ($val['ExtraCode'] === $ev['TSDExtraCode']) {
                        $temp_add_div = 'style="display:none;"';
                    }
   }
                    
                    $expressway_list .= '<div class="mb-2 free_benefit_button_parent">
                        <button '.$temp_add_div.' class="btn_list_benifits '.$exp_btn_disabled_cls.' expressway-options-btn '.$active_cls.'" data-promo_code='.$ev['AwardCode'].' data-is_stackable='.$ev['Stackable'].' data-selected_award_type = "'.$selected_val.'" '.$exp_btn_disabled.'>
                    <div class="btn-text"> <img class="award-icons" src="/wp-content/plugins/advantage-reservations/assets/'.$ev['AwardType'].'.png"><span class="select-text">SELECT</span> <b>  '.$ev['AwardType'].'</b></div>
                    </button>
                        </div>';
                    
                }
                $implode_promo_codes = "";
                if (is_array($_SESSION['search']['promo_codes']) && isset($_SESSION['search']['promo_codes']) && $_SESSION['search']['promo_codes'] !== "") {
                    $implode_promo_codes = implode(",",$_SESSION['search']['promo_codes']);
                }

                //buid expressway benefit buttons end
                if(!$no_rewards_flag) {
                    $this->display_reservation .= '
                <div class="aez-form-block">
                    <div class="aez-expressway-container">
                        '.$expressway_list.'
                    </div>
                    <input type="hidden" name="is_free_benefit_applied" id="is_free_benefit_applied" value="'.$is_promo_code_added.'" />
                    <input type="hidden" name="modify_options_open_flag" id="modify_options_open_flag" value="'.$flag_open_modify_options.'" >
                    <input type="hidden" name="return_url" value="/reserve">     
                </div></div>'; 
                } else {
                    $this->display_reservation .= '<div class="mb-2 free_benefit_button_paren no_rewards">There are no available rewards in your account.</div></div>'; 
                }
                $this->display_reservation .= '<input type="hidden" name="" id="expressway_promo_codes_list" value="'.$implode_promo_codes.'" />';
                $this->display_reservation .= '<div class="update_button_div"><button type="button" id="expressway_flow_apply_to_reservation_modal" class="btn btn-block apply-btn-text expressway_flow_apply_to_reservation">Update Reservation</button></div></div></div></div></div></div>';
                
                /************ expressway flow end *******/
                }
              

            } 
           
            $this->display_reservation .= '</div>';
            
    }
    else{
		if(empty($_SESSION['adv_login']->memberNumber)){
            $this->display_reservation .= '<div class="login_options"><div class="login-text" style="float: left; text-align: left;"><a data-display="0" style="padding: 2px 4px;" id="log_in_reserve" href=""><span>Log In</span></a></div></div>';
        }     
	}
        
        /* Display additional options for express checkout */ 
       
        /* Default profile information values */
        if(isset($_SESSION['adv_login'])) {        
            $this->display_reservation .= '
                    <input type="hidden" id="pr_d_first_name" value="'.$profile_data_u['FirstName'].'" />
                    <input type="hidden" id="pr_d_last_name" value="'.$profile_data_u['LastName'].'" />
                    <input type="hidden" id="pr_d_phone" value="'.$profile_data_u['MobileNumber'].'" />
                    <input type="hidden" id="pr_d_email" value="'.$profile_data_u['Email'].'" />
                    <input type="hidden" id="pr_d_dob" value="'.$profile_data_u['DOB'].'" />
                    <input type="hidden" id="pr_d_address_1" value="'.$profile_data_u['AddressLine1'].'" />
                    <input type="hidden" id="pr_d_address_2" value="'.$profile_data_u['AddressLine2'].'" />
                    <input type="hidden" id="pr_d_zip" value="'.$profile_data_u['PostalCode'].'" />
                    <input type="hidden" id="pr_d_city" value="'.$profile_data_u['City'].'" />
                    <input type="hidden" id="pr_d_state" value="'.$profile_data_u['State'].'" />';     
        }           
        /* Default profile information values */
      
        $this->display_reservation .= '<form id="submit-reserve" class="aez-reservation-form aez-reservation-flow-form" action="/confirm">

        <div class="aez-form-block reserve-box">
                <div class="aez-form-block__header">
                <h3 class="aez-form-block__heading">Required Information</h3>
                </div>
                ';
               if (isset($_SESSION['adv_login'])) {
             $use_profile = (!$_SESSION['renter']['renter_first'])?'checked':'';
        $this->display_reservation .= '
            
                <div>
                <input
                        id="use_member_profile_info"
                        type="checkbox"
                        class="aez-form-item__checkbox"
                        name="use_member_profile_info"
                        value="1"
                        '.$use_profile.'
                    />
                    <label style="display: block;" for="use_member_profile_info" class="aez-form-item__label">Use Member profile information</label>
                    </div>';
        
         }
        $this->display_reservation .= '
                <div class="aez-form-item renter-info renter-info-left">
                    <label for="first_name" class="aez-form-item__label">First Name<sup>*</sup></label>
                    <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                    <input
                        id="first_name"
                        type="text"
                        class="aez-form-item__input"
                        name="first_name"
                        pattern="^([^0-9]*)$"
                        placeholder="First Name" '
                        . (isset($profile_data['renter_first']) ? ' value="' . $profile_data['renter_first'] . '"' : '' ) .
                        ' required
                    />
                </div>
                <div class="aez-form-item renter-info renter-info-right">
                    <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label>
                    <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                    <input
                        id="last_name"
                        type="text"
                        class="aez-form-item__input"
                        name="last_name"
                        pattern="^([^0-9]*)$"
                        placeholder="Last Name"'
                       . (isset($profile_data['renter_last']) ? ' value="' . $profile_data['renter_last'] . '"' : '' ) .
                        ' required
                    />
                </div>
                <div class="aez-form-item renter-info renter-info-left">
                <label for="email" class="aez-form-item__label">Email<sup>*</sup></label>
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">@</span>
                </div>
                <input
                    id="email"
                    type="email"
                    class="aez-form-item__input"
                    name="email"
                    placeholder="Email"'
                 . (isset($profile_data['renter_email_address']) ? ' value="' . $profile_data['renter_email_address'] . '"' : '' ) .   
                   ' required
                />
            </div>
            <div class="aez-form-item renter-info renter-info-right">
                <label for="email2" class="aez-form-item__label">Confirm Email<sup>*</sup></label>
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">@</span>
                </div>
                <input
                    id="email2"
                    type="email"
                    class="aez-form-item__input"
                    name="email"
                    placeholder="Confirm Email"'
                . (isset($profile_data['renter_email_address']) ? ' value="' . $profile_data['renter_email_address'] . '"' : '' ) .
                   ' required
                />
            </div>
            <!-----  <div class="aez-form-item renter-info renter-info-left renters_age">
                <label for="age_select" class="aez-form-item__label" style="display: block; font-weight: 300; padding: 6px 8px;">Renter Age<sup></sup></label>
                    <select class="age_select_reserve" id="renter_age" name="age">
                        <option class="select" value="21" '. ($renter_age == '21' ? 'selected=selected' : '' ) .'>21</option>
                        <option class="select" value="22" '. ($renter_age == '22' ? 'selected=selected' : '' ) .'>22</option>
                        <option class="select" value="23" '. ($renter_age == '23' ? 'selected=selected' : '' ) .'>23</option>
                        <option class="select" value="24" '. ($renter_age == '24' ? 'selected=selected' : '' ) .'>24</option>
                        <option class="select" value="25+" '.($renter_age == '25+' ? 'selected=selected' : '' ) .'>25+</option>
                    </select>   
                    </div>
                    <div style="display: inline-block; margin-left: 3px;">
                    <i class="fa fa-question-circle"  data-toggle="tooltip" data-placement="bottom" title="Additional fees apply for drivers under 25 years old." style="font-size: 1.3em; color: #036 !important";></i>
                </div> -----!>
                <!----- end of aez-form-block div -----!>
                </div>
                <br>
                <div id="optional_div" class="aez-form-block reserve-box">
                <div class="aez-form-block__header optional_block">
                        <h4 class="aez-form-block__heading">Optional Details</h4></div>
                    <div class="optional_fields is-hidden">
                <div class="aez-form-item renter-info-left">
                    <label for="airlineNumber" class="aez-form-item__label">Flight #</label>
                    <input
                        id="airlineNumber"
                        type="text"
                        class="aez-form-item__input"
                        name="airlineNumber"
                        placeholder="Airline Number (if any)"
                    />
                </div>';

                // If there is no airline then don't show the Frequent Flyer Number section
                if (isset($_SESSION['reserve']['airlines'][0][0])) {
                    
                    $airlineref = "";
                    $airline_code = "";
                    
                    $pre_ff_airline = '';
                    $pre_ff_number = '';
                    if($profile_data['FrequentFlyerAirline'] != '') {
                        $pre_ff_airline = $profile_data['FrequentFlyerAirline'];
                        $pre_ff_number = isset($profile_data['FrequentFlyerNumber'])?$profile_data['FrequentFlyerNumber']:'';
                        $airlineref = $pre_ff_airline;
                    }
                    
                    $this->display_reservation .= '
                    <i class="fa fa-question-circle" data-toggle="tooltip" data-placement="bottom" title="If your airline is listed in the drop down, please select and then enter your Frequent Flyer number." style="font-size: 1.1em; color: #036 !important; margin-bottom: 4px; margin-left: 3px; float: right; padding: 5px 0px;"></i>
                    <div class="aez-form-item aez-form-item--dropdown-airline renter-info-right">
                        <label for="state" class="aez-form-item__label">Airline</label>
                        <select
                            id="airline"
                            class="aez-form-item__dropdown"
                            name="airline"
                            data-placeholder="Airline"
                            style="width: 100%;"
                        />   
                        <option value="" selected="selected" style="display:none;"></option>
                        <option value="select">---SELECT---</option>
                            ';


                        if (isset($_COOKIE['reference'])) {
                            // Get the airline full name
                            $airline_data = explode(",", AdvRez_Helper::getAirlines($_COOKIE['reference']));
                            $airlineref = $airline_data[0];
                        }

                        // Loop through the airlines and display them
                        for ($x=0; $x < count($_SESSION['reserve']['airlines']); $x++) {
                            $airline = trim($_SESSION['reserve']['airlines'][$x][1]);
                            //$airline_data = explode(",", AdvRez_Helper::getAirlines($airline));
                            $airline_code = trim($_SESSION['reserve']['airlines'][$x][0]);//$airline_data[1];
                            $this->display_reservation .='
                            <option value="">---Select--</option>
                                <option value="'.$airline_code.'"'
                                . (((trim($airlineref) == strtolower($airline)) || $airlineref == $airline_code) ? ' selected="selected"' : '' ) .
                                '>'.$airline.'</option>';
                        }

                    $this->display_reservation .='
                        </select>
                        <a href="" id="clear-airline"><i class="fa fa-times" aria-hidden="true"></i></a>
                    </div>
                   <div class="aez-form-item renter-info-left">
                        <label for="frequentFlyerNumber" class="aez-form-item__label">Frequent Flyer #</label>
                        <input
                            id="frequentFlyerNumber"
                            type="text"
                            class="aez-form-item__input"
                            name="frequentFlyerNumber"
                            placeholder="Enter frequent flyer #"
                            value="'.$pre_ff_number.'"
                        />
                    </div>
                    <div class="aez-form-item renter-info renter-info-right">
                    <label for="phone_number" class="aez-form-item__label">Phone Number<sup>*</sup></label>
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-phone"></i> </span>
                    </div>
                    <input
                        id="phone_number"
                        type="tel"
                        class="aez-form-item__input"
                        name="phone_number"
                        placeholder="Phone Number"
                        maxlength="14"'
                        . (isset($profile_data['renter_home_phone']) ? ' value="' . $profile_data['renter_home_phone'] . '"' : '' ) .
                        '
                    />
                </div>';

                }

            $this->display_reservation .= '
            </div></div>

                <div class="aez-form-block promocode">';
               $this->display_reservation .= AdvRez_Helper::reservePagepromocodesection();

    $this->display_reservation .= '
            </div>
            <div class="aez-form-block aez-total">
                <span class="aez-total__heading" style="clear: both;">Payment Method</span>
            </div>';
    
    
           if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {

                //Get user credit card details
                $cc_details = Adv_login_Helper::getUserCCDetails(); 
                $card_html = '';
                if(isset($cc_details['d'][0]['LastFour'])) {
                    $card_html = '
                        <div style="'.$saved_card_display.'" class="aez-form-item aez-saved-card-container">
                            <label class="saved-card-label aez-form-item__label">Saved Cards</label>
                            <select class="aez-form-item__dropdown" id="pay_with_card_option" name="pay_with_card_option">
                            <option value="-1">New Card</option>
                    ';
                    
                    foreach($cc_details['d'] as $card) {
                        $cardDisable = ($card['IsExpired'] == 'true')?'disabled="disabled"':'';
                        $card_html .= '<option '.$cardDisable.' value="'.$card['CardTokenID'].'">'.$card['LastFour'].' - ('.$card['FormattedExpDate'].') </option>';   
                    }
                    
                    $card_html .= '</select> </div>  ';                    
                    
                }        
                
                $this->display_reservation .= '

            <div class="aez-pay-total">
                <div class="aez-form-item--radio-cont">
                    <input
                        id="pay_now_total"
                        type="radio"
                        class="aez-form-item__radio"
                        name="pay_total"
                        value="pay_now"
                        ' . $pay_now_value . '
                    />
                    <label for="pay_now_total" class="aez-form-item__label">Pay Now Total </label>
                    '.$card_html.'
                </div>
                <span class="aez-reserve-payment-amount">' . $currency_symbol .'<span id="vehicle_prepaid_total">'. sprintf('%01.2f', strval($vehicle_prepaid_total)) . '</span></span>
            </div> ';  
           }                     
        
        /*********** Pay online card option start *************/
        
          /* Pay Online Option content begins */
//          ADD REQUIRED TO:
                // card_name
                // card_number
                // card_cvc
                // card_exp_year
                // card_exp_month
                // street_address_1
                // postal_code
                // city
                // state
                // country
        
        
                $start_exp_year = (int)date('Y');
                $end_exp_year = (int)date('Y', strtotime('+10 year'));
                $card_exp_dropdown = '';
                
                for ($year = $start_exp_year; $year <= $end_exp_year; $year++) {
                    $option = '<option value="' . $year . '">' . $year . '</option>';
                    $card_exp_dropdown .= $option;
                }
                
                $this->display_reservation .= '
                    <div class="reserve-box aez-form-payonline-container" style="display:'.$pay_now_content_disp.'">
                    <div id="pay_now_total_container" class="aez-form-block aez-form-block--payment-method">
                        <span style="font-size: 0.9em;">We accept:</span>
                            <i class="cc-fa fa fa-cc-amex"></i>
                            <i class="cc-fa fa fa-cc-mastercard"></i>
                            <i class="cc-fa fa fa-cc-visa"></i>
                    <p>We accept all major credit cards as payment for a pre-paid rental. Please note, at the time of rental the renter will need to present a current driver&#39;s license and a valid credit or charge card in the renters name.</p>
                    <span class="aez-required-fields">All fields are required</span>
                   
                    <div class="aez-form-item renter-info">
                    <label for="card_name" class="aez-form-item__label">Name On Card<sup>*</sup></label>
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                        </div>
                        <input
                            id="card_name"
                            type="text"
                            class="aez-form-item__input"
                            name="card_name"
                            placeholder="Full Name"
                            style="width: 100%;"
                            required
                       />
                    </div>
                    <div class="aez-form-item renter-info renter-info-left credit_card">
                        <label for="card_number" class="aez-form-item__label">Credit Card<sup>*</sup></label>
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-credit-card"></i> </span>
                        </div>
                        <input
                            id="card_number"
                            type="password"
                            class="aez-form-item__input"
                            name="card_number"
                            placeholder="Credit Card"
                            style="width: 100%;"
                            required
                        />
                    </div>
                        <div class="aez-form-item renter-info renter-info-right credit_card_cvv">
                            <label for="card_cvc" class="aez-form-item__label">CVC<sup>*</sup></label>
                            <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-question-circle" style="color: #495057 !important;"  data-toggle="tooltip" data-placement="bottom" title="3-4 digits printed on the back of the card." style="font-size: 1.3em; color: #036 !important";></i> </span>
                            </div>
                            <input
                                id="card_cvc"
                                type="password"
                                class="aez-form-item__input"
                                name="card_cvc"
                                placeholder="CVV"
                                maxlength="4"
                                pattern="[0-9]{3,4}"
                                required
                            />
                        </div>
                    <div class="aez-form-item renter-info renter-info-left renters_age">
                        <label for="card_exp" class="aez-form-item__label">Expiration Year<sup>*</sup></label>
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-calendar"></i> </span>
                        </div>
                        <input
                        id="card_exp"
                        type="text"
                        class="aez-form-item__input"
                        placeholder="Exp MM/YY"
                        name="card_exp"
                        pattern="(0[1-9]|10|11|12)\/[0-9]{2}$"
                        maxlength="5"
                        required />
                    
                    </div>';

                if(isset($_SESSION['adv_login'])) { 
                        $publicKey = file_get_contents($_SERVER["DOCUMENT_ROOT"] . '/Payment/data/' . '/public.pem');
                        $this->display_reservation .= '          
                            <div class="aez-form-item--checkbox-cont">
                                <div class="save-this-card-profile">
                                    <div class="aez-form-item--checkbox-cont">
                                        <input
                                            id="save_new_card_user"
                                            type="checkbox"
                                            class="aez-form-item__checkbox"
                                            name="save_new_card_user"
                                            value="1"
                                        />
                                        <label for="save_new_card_user" class="aez-form-item__label">Please save this card to my profile</label>
                                    </div>   
                                    <input type="hidden" name="card_enc_value" id="card_enc_value" />
                                </div>
                                
                                <textarea id="pubKey" rows="15" cols="65" style="visibility: hidden; display: none;">' . $publicKey . '</textarea> 
                            </div>
                            ';
                    }

                    if (isset($_SESSION['adv_login']->memberNumber) && ($_SESSION['adv_login']->memberNumber !=="")) {
                        $billing_street_address_1 = $_SESSION['adv_login']->user['BAddressLine1'];
                        $billing_street_address_2 = $_SESSION['adv_login']->user['BAddressLine2'];
                        $billing_city = $_SESSION['adv_login']->user['BCity'];
                        $billing_state = $_SESSION['adv_login']->user['BState'];
                        $billing_country = $_SESSION['adv_login']->user['BCountry'];
                        $billing_postal_code = $_SESSION['adv_login']->user['BPostalCode'];
                    } else {
                        $billing_street_address_1 = "";
                        $billing_street_address_2 = "";
                        $billing_city = "";
                        $billing_state = "";
                        $billing_country = "";
                        $billing_postal_code = "";
                    }

                    $this->display_reservation .= '  
                    <div class="aez-form-block__header">
                    <h4 class="aez-form-block__heading" style="margin: 9px 0px 6px;">Billing Address</h4>
                    </div>                  
                   
                    <div class="aez-form-billing-address">
                            <div class="aez-form-item renter-info renter-info-left">
                                <label for="billing_street_address_1" class="aez-form-item__label">Billing Street Address<sup>*</sup></label>
                                <input
                                    id="billing_street_address_1"
                                    type="text"
                                    class="aez-form-item__input reserve_page_billing_info"
                                    name="billing_street_address_1"
                                    placeholder="Street Address"
                                    required
                                    value="' . $billing_street_address_1 . '"
                                />
                            </div>
                            <div class="aez-form-item renter-info renter-info-right">
                                <label for="billing_street_address_2" class="aez-form-item__label ">Billing Street Address</label>
                                <input
                                    id="billing_street_address_2"
                                    type="text"
                                    class="aez-form-item__input reserve_page_billing_info"
                                    name="billing_street_address_2"
                                    placeholder="Street Address 2"
                                    value="' . $billing_street_address_2 . '"
                                />
                            </div>
                            <div class="aez-form-item renter-info renter-info-left b_city">
                                <label for="billing_city" class="aez-form-item__label">Billing City<sup>*</sup></label>
                                <input
                                    id="billing_city"
                                    type="text"
                                    class="aez-form-item__input reserve_page_billing_info"
                                    name="billing_city"
                                    placeholder="City"
                                    required
                                    value="' . $billing_city . '"
                                />
                            </div>
                            <div class="aez-form-item renter-info renter-info-right b_state">
                                <label for="billing_state" class="aez-form-item__label">Billing State</label>
                                <select
                                    id="billing_state"
                                    class="aez-form-item__dropdown"
                                    name="billing_state"
                                >
                                    <option>&nbsp;</option>
                                    <option value="AL"'
                                    . (isset($billing_state) && $billing_state == 'AL' ? ' selected="selected"' : '' ) .
                                    '>Alabama</option>
                                    <option value="AK"'
                                    . (isset($billing_state) && $billing_state == 'AK' ? ' selected="selected"' : '' ) .
                                    '>Alaska</option>
                                    <option value="AZ"'
                                    . (isset($billing_state) && $billing_state == 'AZ' ? ' selected="selected"' : '' ) .
                                    '>Arizona</option>
                                    <option value="AR"'
                                    . (isset($billing_state) && $billing_state == 'AR' ? ' selected="selected"' : '' ) .
                                    '>Arkansas</option>
                                    <option value="CA"'
                                    . (isset($billing_state) && $billing_state == 'CA' ? ' selected="selected"' : '' ) .
                                    '>California</option>
                                    <option value="CO"'
                                    . (isset($billing_state) && $billing_state == 'CO' ? ' selected="selected"' : '' ) .
                                    '>Colorado</option>
                                    <option value="CT"'
                                    . (isset($billing_state) && $billing_state == 'CT' ? ' selected="selected"' : '' ) .
                                    '>Connecticut</option>
                                    <option value="DE"'
                                    . (isset($billing_state) && $billing_state == 'DE' ? ' selected="selected"' : '' ) .
                                    '>Delaware</option>
                                    <option value="DC"'
                                    . (isset($billing_state) && $billing_state == 'DC' ? ' selected="selected"' : '' ) .
                                    '>District of Columbia</option>
                                    <option value="FL"'
                                    . (isset($billing_state) && $billing_state == 'FL' ? ' selected="selected"' : '' ) .
                                    '>Florida</option>
                                    <option value="GA"'
                                    . (isset($billing_state) && $billing_state == 'GA' ? ' selected="selected"' : '' ) .
                                    '>Georgia</option>
                                    <option value="HI"'
                                    . (isset($billing_state) && $billing_state == 'HI' ? ' selected="selected"' : '' ) .
                                    '>Hawaii</option>
                                    <option value="ID"'
                                    . (isset($billing_state) && $billing_state == 'ID' ? ' selected="selected"' : '' ) .
                                    '>Idaho</option>
                                    <option value="IL"'
                                    . (isset($billing_state) && $billing_state == 'IL' ? ' selected="selected"' : '' ) .
                                    '>Illinois</option>
                                    <option value="IN"'
                                    . (isset($billing_state) && $billing_state == 'IN' ? ' selected="selected"' : '' ) .
                                    '>Indiana</option>
                                    <option value="IA"'
                                    . (isset($billing_state) && $billing_state == 'IA' ? ' selected="selected"' : '' ) .
                                    '>Iowa</option>
                                    <option value="KS"'
                                    . (isset($billing_state) && $billing_state == 'KS' ? ' selected="selected"' : '' ) .
                                    '>Kansas</option>
                                    <option value="KY"'
                                    . (isset($billing_state) && $billing_state == 'KY' ? ' selected="selected"' : '' ) .
                                    '>Kentucky</option>
                                    <option value="LA"'
                                    . (isset($billing_state) && $billing_state == 'LA' ? ' selected="selected"' : '' ) .
                                    '>Louisiana</option>
                                    <option value="ME"'
                                    . (isset($billing_state) && $billing_state == 'ME' ? ' selected="selected"' : '' ) .
                                    '>Maine</option>
                                    <option value="MD"'
                                    . (isset($billing_state) && $billing_state == 'MD' ? ' selected="selected"' : '' ) .
                                    '>Maryland</option>
                                    <option value="MA"'
                                    . (isset($billing_state) && $billing_state == 'MA' ? ' selected="selected"' : '' ) .
                                    '>Massachusetts</option>
                                    <option value="MI"'
                                    . (isset($billing_state) && $billing_state == 'MI' ? ' selected="selected"' : '' ) .
                                    '>Michigan</option>
                                    <option value="MN"'
                                    . (isset($billing_state) && $billing_state == 'MN' ? ' selected="selected"' : '' ) .
                                    '>Minnesota</option>
                                    <option value="MS"'
                                    . (isset($billing_state) && $billing_state == 'MS' ? ' selected="selected"' : '' ) .
                                    '>Mississippi</option>
                                    <option value="MO"'
                                    . (isset($billing_state) && $billing_state == 'MO' ? ' selected="selected"' : '' ) .
                                    '>Missouri</option>
                                    <option value="MT"'
                                    . (isset($billing_state) && $billing_state == 'MT' ? ' selected="selected"' : '' ) .
                                    '>Montana</option>
                                    <option value="NE"'
                                    . (isset($billing_state) && $billing_state == 'NE' ? ' selected="selected"' : '' ) .
                                    '>Nebraska</option>
                                    <option value="NV"'
                                    . (isset($billing_state) && $billing_state == 'NV' ? ' selected="selected"' : '' ) .
                                    '>Nevada</option>
                                    <option value="NH"'
                                    . (isset($billing_state) && $billing_state == 'NH' ? ' selected="selected"' : '' ) .
                                    '>New Hampshire</option>
                                    <option value="NJ"'
                                    . (isset($billing_state) && $billing_state == 'NJ' ? ' selected="selected"' : '' ) .
                                    '>New Jersey</option>
                                    <option value="NM"'
                                    . (isset($billing_state) && $billing_state == 'NM' ? ' selected="selected"' : '' ) .
                                    '>New Mexico</option>
                                    <option value="NY"'
                                    . (isset($billing_state) && $billing_state == 'NY' ? ' selected="selected"' : '' ) .
                                    '>New York</option>
                                    <option value="NC"'
                                    . (isset($billing_state) && $billing_state == 'NC' ? ' selected="selected"' : '' ) .
                                    '>North Carolina</option>
                                    <option value="ND"'
                                    . (isset($billing_state) && $billing_state == 'ND' ? ' selected="selected"' : '' ) .
                                    '>North Dakota</option>
                                    <option value="OH"'
                                    . (isset($billing_state) && $billing_state == 'OH' ? ' selected="selected"' : '' ) .
                                    '>Ohio</option>
                                    <option value="OK"'
                                    . (isset($billing_state) && $billing_state == 'OK' ? ' selected="selected"' : '' ) .
                                    '>Oklahoma</option>
                                    <option value="OR"'
                                    . (isset($billing_state) && $billing_state == 'OR' ? ' selected="selected"' : '' ) .
                                    '>Oregon</option>
                                    <option value="PA"'
                                    . (isset($billing_state) && $billing_state == 'PA' ? ' selected="selected"' : '' ) .
                                    '>Pennsylvania</option>
                                    <option value="RI"'
                                    . (isset($billing_state) && $billing_state == 'RI' ? ' selected="selected"' : '' ) .
                                    '>Rhode Island</option>
                                    <option value="SC"'
                                    . (isset($billing_state) && $billing_state == 'SC' ? ' selected="selected"' : '' ) .
                                    '>South Carolina</option>
                                    <option value="SD"'
                                    . (isset($billing_state) && $billing_state == 'SD' ? ' selected="selected"' : '' ) .
                                    '>South Dakota</option>
                                    <option value="TN"'
                                    . (isset($billing_state) && $billing_state == 'TN' ? ' selected="selected"' : '' ) .
                                    '>Tennessee</option>
                                    <option value="TX"'
                                    . (isset($billing_state) && $billing_state == 'TX' ? ' selected="selected"' : '' ) .
                                    '>Texas</option>
                                    <option value="UT"'
                                    . (isset($billing_state) && $billing_state == 'UT' ? ' selected="selected"' : '' ) .
                                    '>Utah</option>
                                    <option value="VT"'
                                    . (isset($billing_state) && $billing_state == 'VT' ? ' selected="selected"' : '' ) .
                                    '>Vermont</option>
                                    <option value="VA"'
                                    . (isset($billing_state) && $billing_state == 'VA' ? ' selected="selected"' : '' ) .
                                    '>Virginia</option>
                                    <option value="WA"'
                                    . (isset($billing_state) && $billing_state == 'WA' ? ' selected="selected"' : '' ) .
                                    '>Washington</option>
                                    <option value="WV"'
                                    . (isset($billing_state) && $billing_state == 'WV' ? ' selected="selected"' : '' ) .
                                    '>West Virginia</option>
                                    <option value="WI"'
                                    . (isset($billing_state) && $billing_state == 'WI' ? ' selected="selected"' : '' ) .
                                    '>Wisconsin</option>
                                    <option value="WY"'
                                    . (isset($billing_state) && $billing_state == 'WY' ? ' selected="selected"' : '' ) .
                                    '>Wyoming</option>
                                </select>
                            </div>
                            
                            <div class="aez-form-item renter-info renter-info-left b_country">
                                <label for="billing_country" class="aez-form-item__label">Billing Country</label>
                                <select
                                    id="billing_country"
                                    class="aez-form-item__dropdown"
                                    name="billing_country">
                                    <option>&nbsp;</option>
                                    <option value="USA" selected>United States</option>
                                </select>
                            </div>
                            <div class="aez-form-item renter-info renter-info-right b_postal_code">
                                <label for="billing_postal_code" class="aez-form-item__label">Billing Postal Code<sup>*</sup></label>
                                <input
                                    id="billing_postal_code"
                                    type="text"
                                    class="aez-form-item__input"
                                    name="billing_postal_code"
                                    placeholder="Postal Code"
                                    required
                                    value="' . $billing_postal_code . '"
                                />
                            </div>
                            
                    </div>

                </div>
                <p id="cancel"><b>CANCELLATION POLICY</b><br>Cancelling a reservation must be done at the <a href="/my-reservations"><u>Advantage.com My Rental Car Reservation page</u></a> by searching for your reservation and then using the Cancel option. If a prepaid reservation is cancelled more than 24 hours before the pickup time, a $50 cancellation fee will be assessed. If you do not cancel a pre-paid reservation within 24 hours of the scheduled pick-up time or if the rental vehicle is not picked up by the close of business on the arrival date listed on the confirmation email, the entire amount will be forfeited.</p>
                <div id="cancel_check" style="display: block;"><div class="aez-form-item--checkbox-cont">
                    <input
                        id="cancel_policy"
                        type="checkbox"
                        class="aez-form-item__checkbox"
                        name="cancel_policy"
                    />
                    <label for="cancel_policy" class="aez-form-item__label" style="display: block;">I agree with
                    <a id="cancellation-policy" rel="modal:open">&nbsp;<u>Cancellation Policy</u></a>
                    </label>
                <div id="myModal3" class="modal"> 
                <div style="font-size: 1.2em;" class="modal-content" id="can"><div style="float: right;"><span id="close3">x</span></div>';
                if (isset($_SESSION['search']['BrandName']) && $_SESSION['search']['BrandName'] == 'Europcar') {
                    $this->display_reservation .= AdvRez_Helper::getEuropeCarTermsAndConditions();
                } else {
                    $this->display_reservation .= AdvRez_Helper::getTermsAndConditions();
                }
                $this->display_reservation .= '</div> </div></div> </div>';
            
                $this->display_reservation .= '</div>';
        /*********** Pay online card option end *************/
        $this->display_reservation .= '
        <div class="aez-pay-total">
            <div class="aez-form-item--radio-cont">';
            if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {
$this->display_reservation .= '
                <input
                    id="pay_later_total"
                    type="radio"
                    class="aez-form-item__radio"
                    name="pay_total"
                    value="pay_later"
                    ' . $pay_later_value . '
                />';
            }
$this->display_reservation .= '
                <label for="pay_later_total" class="aez-form-item__label">Pay Later Total</label>
            </div>
            <span class="aez-reserve-payment-amount" >' . $currency_symbol .'<span id="vehicle_counter_total">'. sprintf('%01.2f', strval($vehicle_counter_total)) . '</span></span>
        </div>';
        
        
    
    $this->display_reservation .= '<div class="aez-form-block" style="padding: 5px 8px;">';
            
    if(isset($_SESSION['adv_login'])) {
$this->display_reservation .= '               
                <div class="aez-form-item--checkbox-cont">
                  <input
                    id="save_user_profile_info"
                    type="checkbox"
                    class="aez-form-item__checkbox"
                    name="save_user_profile_info"
                />
                <label for="save_user_profile_info" class="aez-form-item__label">I want to save these options and update my Expressway Member profile preferences</label></div> ';   
    }

    if($_SESSION['search']['rental_phone1'] !== "") {        
            if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {
                $phone_number = "+1" . preg_replace("/[^0-9]/","",$_SESSION["search"]['rental_phone1']);
                $phone_number_display = $_SESSION['search']['rental_phone1'];
               
            } else {
                $phone_number = "+" . preg_replace("/[^0-9]/","",$_SESSION['search']['rental_phone1']);
                $phone_number_display = $_SESSION['search']['rental_phone1'];
            }
    }
    else {
           if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {
                $phone_number = "+1" . preg_replace("/[^0-9]/","",$_SESSION['search']['rental_phone2']);
                $phone_number_display = $_SESSION['search']['rental_phone2'];
            } else {
                $phone_number = "+" . preg_replace("/[^0-9]/","",$_SESSION['search']['rental_phone2']);
                $phone_number_display = $_SESSION['search']['rental_phone2'];
            }
    }

$this->display_reservation .= '     
                       
                <div class="aez-form-item--checkbox-cont">
                      <input
                        id="read_location_policy"
                        type="checkbox"
                        class="aez-form-item__checkbox"
                        name="read_location_policy"
                    />
                    <label for="read_location_policy" class="aez-form-item__label">I have read the <a id="location-rental-policy-link" rel="modal:open">Location Rental Policies</a></label>
                    <div id="myModal" class="modal"> 
                        <div class="modal-content" id="policies">
                        <input type="hidden" id="location_country" value="'.$_SESSION["search"]["rental_location_country"] .'"/>
                        <input type="hidden" id="location_phone" value="'.  $phone_number .'"/> 
                        <input type="hidden" id="location_phone_display" value="'. $phone_number_display .'"/> 
                        <div style="float: right;"><span id="close1">x</span></div>
                            <input type="hidden" name="location" value="'. $_SESSION["search"]["rental_location_id"] .'">
                            <div class="policies_content"> Loading... </div>
                        </div>
                    </div>
                 <div class="aez-form-item--checkbox-cont">
                    <input
                        id="terms_and_conditions"
                        type="checkbox"
                        class="aez-form-item__checkbox"
                        name="terms_and_conditions"
                    />
                    <label for="terms_and_conditions" class="aez-form-item__label">I agree with Advantage Rent A Car\'s <a id="terms-and-conditions-link" rel="modal:open" style="margin-bottom:2%;">Terms and Conditions</a></label>
                     <div id="myModal2" class="modal"> <div class="modal-content" id="tnc"> <div style="float: right;"><span id="close2">x</span></div>';

            if (isset($_SESSION['search']['BrandName']) && $_SESSION['search']['BrandName'] == 'Europcar') {
                $this->display_reservation .= AdvRez_Helper::getEuropeCarTermsAndConditions();
            } else {
                $this->display_reservation .= AdvRez_Helper::getTermsAndConditions();
            }

            $disabled_complete = "";
            if (($is_prepaid && $prepaid_total_charges <= 0) || (!$is_prepaid && $counter_total_charges <= 0)) {
                $disabled_complete = "disabled";
            }

            $this->display_reservation .= '</div> </div> </div>
                <input type="hidden" id="pickup_date_comparison" name="pickup_date_comparison" value="' . $pickup_year . sprintf("%'.02d", $pickup_month) . sprintf("%'.02d", $pickup_day) . '">
                <div class="reserve_submit_div"> <button id="submit-reserve-button1" name="submit-reserve-button" value="submit-reserve-button1" type="submit" class="aez-btn aez-btn--filled-green aez-save-and-review-promo aez-btn--rounded" '.$disabled_complete.'>Complete Reservation</button>
                <button id="submit-reserve-button1-disabled" name="submit-reserve-button" value="submit-reserve-button1" type="submit" class="aez-btn aez-btn--filled-green aez-save-and-review-promo aez-btn--rounded" style="display: none;" disabled="disabled" disabled>Complete Reservation</button> </div>
                <span style="display:'.$pay_now_content_disp.'" class="pay_now_content_display aez-confirm-btn__disclaimer">**Please note:  Your credit card will be charged after you press confirm.</span>
            </div>
        </form>
    </main>
</div>
<div class="aez-reservation__fixed-footer">
    <div class="aez-reservation__row">
        <a href="/enhance" class="aez-reservation__back-btn" style="'.$style1.'">Back</a>
            <span id="submit-reserve-button2" class="aez-save-and-review-promo aez-reservation__save-btn" name="submit-reserve-button"  value="submit-reserve-button2">Complete Reservation </span>
       <button id="submit-reserve-button2-disabled" class="aez-reservation__save-btn" name="submit-reserve-button" value="submit-reserve-button2" style="text-transform: capitalize;display: none;" disabled="disabled" disabled>Complete Reservation </button>
    </div>
</div>';

$this->display_reservation .= '
    <input type="hidden" id="progress-rental-location" name="progress-rental-location" value="'. $_SESSION['search']['rental_location_id']. '">
    <input type="hidden" id="progress-return-location" name="progress-return-location" value="'. $_SESSION['search']['return_location_id']. '">

    <input type="hidden" id="progress-pickup-date" name="progress-pickup-date" value="'. $_SESSION['search']['pickup_date']. '">
    <input type="hidden" id="progress-pickup-time" name="progress-pickup-time" value="'. $_SESSION['search']['pickup_time']. '">

    <input type="hidden" id="progress-dropoff-date" name="progress-dropoff-date" value="'. $_SESSION['search']['dropoff_date']. '">
    <input type="hidden" id="progress-dropoff-time" name="progress-dropoff-time" value="'. $_SESSION['search']['dropoff_time']. '">
    <input type="hidden" id="progress-express-checkout-option" name="progress-express-checkout-option" value="'. $_SESSION['search']['express_checkout_option']. '">

    <!-- HIDDEN FIELDS FOR ABANDONMENT POPUP -->
    <input type="hidden" id="class_code" value="'.$_SESSION['reserve']['ClassCode'].'" />
    <input type="hidden" id="rate_id" value="'.$_SESSION['reserve']['RateID'].'" />
    <input type="hidden" id="vehicle_enhance_type" value="'.$_SESSION['reserve']['vehicleEnhanceType'].'" />
    <input type="hidden" id="vehicle_index" value="'.$_SESSION['reserve']['vehicleIndex'].'" />
    <input type="hidden" id="location_country" value="'.$_SESSION['search']['rental_location_country'].'" />';

     /* Checks whether user completed reservation to manage abandoned popup*/
    $set_flag_reserve_popup = isset($_SESSION['flag_reserve_popup'])?0:1; 

    $this->display_reservation .= '
        <input type="hidden" id="show_discount_popup_flag" name="show_discount_popup_flag" value="'.$set_flag_reserve_popup.'">
        <input type="hidden" id="abandonment_promo_code" name="abandonment_promo_code" value="'.$_SESSION['abandonment']['abandonment_promocode'].'">
    ';

     if (isset($_SESSION['abandonment']['abandonment_promocode']) && $_SESSION['abandonment']['abandonment_promocode'] !== "") {
        $this->display_reservation .= '<input type="hidden" id="abandonment_promocode_exists" value="true" />';
    } else {
        $this->display_reservation .= '<input type="hidden" id="abandonment_promocode_exists" value="false" />';
    }

    if (!isset($this->api_url_array['abandonment_promocode']) || $this->api_url_array['abandonment_promocode'] == "") {
        $this->display_reservation .= '
            <input type="hidden" id="show_abandonment_popup" value="false" />';
    }

    if ($_SESSION['search']['promo_codes'] > 0) {
        foreach ($_SESSION['search']['promo_codes'] as $value) {
            $this->display_reservation .= '<input type="hidden" id="progress-promo-codes" name="progress-promo-codes[]" value="'. $value. '">';
        }
    }
    
    $this->display_reservation .= '<div class="showmessage" style="position: fixed; display:none;top:0; height: 50px; width:100%; background:#9c0; color:#fff; text-align:center;line-height: 48px;">
             Reservation summary has been updated successfully!</div>';

    return $this->display_reservation;

    }

    function valuesSet() {

        if (! isset($_SESSION['reserve'])) {
            return false;
        }
        if (! isset($_SESSION['reserve']['RateID'])) {
            return false;
        }
        if (! isset($_SESSION['reserve']['ClassCode'])) {
            return false;
        }
        if (! isset($_SESSION['reserve']['Prepaid'])) {
            return false;
        }
        if (! isset($_SESSION['reserve']['vehicleIndex'])) {
            return false;
        }
		if (! isset($_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RTotalCharges'])) {
            return false;
        } 
       return true;
    }
}

