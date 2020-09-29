<?php

include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_ConfirmShortcode extends AdvRez_ShortCodeScriptLoader {

	public $display_confirmation;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {

        if (!self::$addedAlready) {
            self::$addedAlready = true;

            wp_enqueue_style( 'remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');
            wp_enqueue_style( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css' );

            // Register Scripts to be loaded
            wp_register_script('adv_confirm', plugins_url('js/adv_confirm_form.js', __FILE__), array('jquery', 'main'), '1.0', true );
            wp_register_script( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
            wp_register_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
            wp_register_script( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
            wp_register_script( 'validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true );
            wp_register_script( 'mask', get_stylesheet_directory_uri() . '/vendor/jQuery-Mask-Plugin-1.14.0/dist/jquery.mask.min.js', array(), null, true );
            wp_register_script( 'adv_accordion_menu', plugins_url('js/adv_accordion_menu.js', __FILE__), array('jquery', 'main'), null, true);
            wp_register_script( 'adv_save_and_review', plugins_url('js/adv_save_and_review.js', __FILE__), array('jquery', 'main'),  null, true );
            wp_register_script( 'adv_js_encrypt', plugins_url('js/jsencrypt.min.js', __FILE__), array('jquery', 'main'),  null, true );
             wp_register_script( 'adv_reserve-summary-dropdown', plugins_url('js/adv_reserve-summary-dropdown.js'), array('jquery'), null, true );

            // Create array of scripts to be loaded
            $scripts = array('jquery', 'select2', 'moment', 'pikaday', 'validator', 'mask', 'adv_confirm', 'adv_accordion_menu', 'adv_save_and_review', 'adv_js_encrypt', 'adv_reserve-summary-dropdown');
            // Enqueue Reserve Form Script
            wp_enqueue_script($scripts);
            
     
            wp_localize_script( 'adv_confirm', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advReservetNonce' => wp_create_nonce( 'advreserve-nonce' )
        		)
        	);
         }
    }

	public function handleShortcode($atts) {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        if(count($_POST) == 0 && !isset($_SESSION['confirm']))
        {
            AdvRez_Helper::NoCarsFound(false);
        }

        if (isset($_SESSION['abandonment']['choose_error']) && $_SESSION['abandonment']['choose_error'] !== "" ) {
            $abandonment_choose_error = $_SESSION['abandonment']['choose_error'];
            unset($_SESSION['abandonment']['choose_error']);
        }

        $start_exp_year = (int)date('Y');
        $end_exp_year = (int)date('Y', strtotime('+30 years'));
        $card_exp_dropdown = '';

        for ($year = $start_exp_year; $year <= $end_exp_year; $year++) {
            $option = '<option value="' . $year . '">' . $year . '</option>';
            $card_exp_dropdown .= $option;
        }

        $dob = (isset($_POST['dob'])) ? $_POST['dob'] : '';
        $first_name = (isset($_POST['first_name'])) ? $_POST['first_name'] : '';
        $last_name = (isset($_POST['last_name'])) ? $_POST['last_name'] : '';
        $phone_number = (isset($_POST['phone_number'])) ? $_POST['phone_number'] : '';
        $email = (isset($_POST['email'])) ? $_POST['email'] : '';
        $street_address_1 = (isset($_POST['street_address_1'])) ? $_POST['street_address_1'] : '';
        $street_address_2 = (isset($_POST['street_address_2'])) ? $_POST['street_address_2'] : '';
        $postal_code = (isset($_POST['postal_code'])) ? $_POST['postal_code'] : '';
        $city = (isset($_POST['city'])) ? $_POST['city'] : '';
        $state = (isset($_POST['state'])) ? $_POST['state'] : '';
        $country = (isset($_POST['country'])) ? $_POST['country'] : '';
        // promo_codes array
        $pay_total = (isset($_POST['pay_total'])) ? $_POST['pay_total'] : '';

        $pickup_day = intval(substr($_SESSION['search']['pickup_date_time'], 2, 2));
        $pickup_month = intval(substr($_SESSION['search']['pickup_date_time'], 0, 2));
        $pickup_year = intval(substr($_SESSION['search']['pickup_date_time'], 4, 4));
        $pickup_time = substr($_SESSION['search']['pickup_date_time'], -8);

        $dropoff_day = intval(substr($_SESSION['search']['dropoff_date_time'], 2, 2));
        $dropoff_month = intval(substr($_SESSION['search']['dropoff_date_time'], 0, 2));
        $dropoff_year = intval(substr($_SESSION['search']['dropoff_date_time'], 4, 4));
        $dropoff_time = substr($_SESSION['search']['dropoff_date_time'], -8);

        $vehicle_picked = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];
        
        // Display default information for registered users
        if (isset($_SESSION['adv_login'])) {
            $profile_data = Adv_login_Helper::getAdvFullUser();
            $street_address_1 = $profile_data['BAddressLine1'];
            $street_address_2 = $profile_data['BAddressLine2'];
            $postal_code = $profile_data['BPostalCode'];
            $city = $profile_data['BCity'];
            $state = $profile_data['BState'];
            $country = $profile_data['BCountry'];
        }          

        if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
            $rate_amount = $vehicle_picked['PRateAmount'];
            $_SESSION['confirm']['RateAmount'] = $rate_amount;
            $rate_charge = $vehicle_picked['PRateCharge'];
            $total_taxes = $vehicle_picked['PTotalTaxes'];
            $total_extras = $vehicle_picked['PTotalExtras'];
            $total_charges = $vehicle_picked['PTotalCharges'];
            $vehicle_discount = sprintf('%01.2f', strval($vehicle_picked['PRateDiscount']));
        } else {
            $rate_amount = $vehicle_picked['RRateAmount'];
            $_SESSION['confirm']['RateAmount'] = $rate_amount;
            $rate_charge = $vehicle_picked['RRateCharge'];
            $total_taxes = $vehicle_picked['RTotalTaxes'];
            $total_extras = $vehicle_picked['RTotalExtras'];
            $total_charges = $vehicle_picked['RTotalCharges'];
            $vehicle_discount = sprintf('%01.2f', strval($vehicle_picked['RRateDiscount']));
        }

        $discount_percent = $vehicle_picked['DiscountPercent'];

        if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {
            $gas_mileage_label = 'mpg';
        } else {
            $gas_mileage_label = 'kpl';
        }

        // Check if RatePlan is weekly or daily. 
        if (strtoupper($vehicle_picked['RatePlan']) == 'WEEKLY') {
            $days = "week";
            $days_ly = "weekly";
        } else {
            $days = "day";
            $days_ly = "daily";
        }

        $date_of_pickup = $pickup_year . "-" . $pickup_month . "-" . $pickup_day;
        $date_of_return = $dropoff_year . "-" . $dropoff_month . "-" . $dropoff_day;
        $date_of_reservation = date("Y-m-d");

        // Get the currency symbol for the country
        $currency_symbol =  AdvRez_Helper::getAdvCurrency($vehicle_picked['CurrencyCode']);

         $this->display_confirmation = '<div id="abandonment_choose_error" data-abandonment-choose-error="'.$abandonment_choose_error.'"></div>
            <div id="primary">';

        if (isset($_SESSION['choose_promos']['PromoCodeEntered']) && count($_SESSION['choose_promos']['PromoCodeEntered']) > 0) {

            $output_message = '';

            if (isset($_SESSION['choose_promos']['PromoCodeEntered'][0])) { 
                foreach ($_SESSION['choose_promos']['PromoCodeEntered'] as $key => $value) {
                    if ($value['PromoStatus'] != 'OK') {
                        /* $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $value['PromoCode'] . '</span>' .
                                '<span class="aez-warning__additional-text">' . $value['PromoMsg'] . '</span>' .
                            '</div>' .
                        '</div>'; */
                        
                        $promo_code_title[] =  $value['PromoCode'];
                        $output_message_internal .= '<span class="aez-warning__additional-text">'.$value['PromoMsg'].'</span>';
                    }
                }
            } elseif ($_SESSION['choose_promos']['PromoCodeEntered']['PromoStatus'] != 'OK')  {
                $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'] . '</span>' .
                                '<span class="aez-warning__additional-text">' . $_SESSION['choose_promos']['PromoCodeEntered']['PromoMsg'] . '</span>' .
                            '</div>' .
                        '</div>';
            }
            
            if($output_message_internal){
                $implode_promo_code_title = implode(',', $promo_code_title);
                $output_message .='<div class="aez-warning">
                                    <div class="aez-warning__fa-exclamation-triangle"></div>
                                    <div class="aez-warning__message">
                                    <span class="aez-warning__main-text">There\'s a problem with Promo Code '.$implode_promo_code_title.'</span>'.$output_message_internal.'
                                    </div>
                                </div>';
            }

            if (strlen(trim($output_message)) > 0) {
                $this->display_confirmation .= '<div class="aez-warning-container">' . $output_message .
                    '<i class="fa fa-close aez-warning__close"></i></div>';
            }

        }
        
        if(isset($_SESSION['pay_with_card_failed_flag']) && $_SESSION['pay_with_card_failed_flag'] == 1) {
            unset($_SESSION['pay_with_card_failed_flag']);
            $output_message_error .= '<div class="aez-warning">' .
                        '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                        '<div class="aez-warning__message">' .
                            '<span class="aez-warning__main-text">Reservation Error</span>' .
                            '<span class="aez-warning__additional-text">There is a problem with card. Please provide new card details and continue</span>' .
                        '</div>' .
                    '</div>';

            $this->display_confirmation .= '<div class="aez-warning-container">' . $output_message_error .
                '<i class="fa fa-close aez-warning__close"></i></div>';

        }

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

    //This flag is used handle express checkout begins
    $exp_flag = isset($_SESSION['reserve']['express_checkout_complete_flag'])?1:0;
    $style1 = ($exp_flag == 1)?'display:none':'';
    $style2 = ($exp_flag == 0)?'display:none':'';
    //This flag is used handle express checkout  ends
    
    $this->display_confirmation .= '<main id="main" role="main">
            <div class="aez-progress-bar" style="'.$style1.'" >
                <div class="aez-progress-bar__item aez-progress-bar__item--completed">
                    <a id="progress" href="#"><div class="aez-progress-bar__item-text">Choose</div>
                    <div class="aez-progress-bar__item-arrow"></div></a>
                </div>
                <div class="aez-progress-bar__item aez-progress-bar__item--completed">
                    <a href="/enhance"><div class="aez-progress-bar__item-text">Enhance</div>
                    <div class="aez-progress-bar__item-arrow"></div></a>
                </div>
                <div class="aez-progress-bar__item aez-progress-bar__item--completed">
                <a href="/reserve"><div class="aez-progress-bar__item-text">Reserve</div>
                    <div class="aez-progress-bar__item-arrow"></div></a>
                </div>
            </div>

            <div class="aez-page-title">
                <h1>Confirm Reservation</h1>
            </div>

            <div class="aez-selected-car">
                <!-- <a href="#">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </a> -->
                <div class="aez-vehicle-img">
                    <img src="' . $vehicle_picked['ClassImageURL'] . '" alt="car picture">
                </div>
                <div class="aez-vehicle-content aez-complete-selection">
                    <span class="aez-enhance-selection__selected">Selected:</span>
                    <span class="aez-enhance-selection__car-name">' . $vehicle_picked['ModelDesc'] . '<span class="or_similar"> (or similar)</span></span>
                    <span class="aez-enhance-selection__car-type car-type">'. $vehicle_picked['Category'] . ' ' . $vehicle_picked['Type'] . ' <span class="aez-enhance-selection__car-code">(' . $vehicle_picked['ClassCode'] . ')</span></span>
                    <div class="aez-mini-details">';
                                if (isset($display_transmission)) {
                                    $this->display_confirmation .= '
                                    <span> 
                                        <i class="fa fa-road" aria-hidden="true"></i>
                                        <p>' . $vehicle_picked['Transmission'] . '</p>
                                    </span>';
                                }
                                
                               if (isset($display_mpg)) {
                                    $this->display_confirmation .= '
                                    <span>
                                        <i class="fa fa-tachometer" aria-hidden="true"></i>
                                        <p>' . $vehicle_picked['MPGCity'] . '/' . $vehicle_picked['MPGHighway'] . ' ' . $gas_mileage_label . '</p>
                                    </span>';
                                }
                                if (isset($display_passengers)) {
                                    $this->display_confirmation .= '
                                    <span>
                                        <i class="fa fa-users" aria-hidden="true"></i>
                                        <p>' . $vehicle_picked['Passengers'] . '</p>
                                    </span>';
                                }
                                if (isset($display_luggage)) {
                                     $this->display_confirmation .= '
                                    <span>
                                        <i class="fa fa-suitcase" aria-hidden="true"></i>
                                        <p>' . $vehicle_picked['Luggage'] . '</p>
                                    </span>';
                                }
  $this->display_confirmation .= '
                    </div>
                </div>
            </div> <!-- end aez-selected-car-container -->

            <div class="aez-info-block-container">
                <h3>Itinerary</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <div class="aez-info-section__header">
                            <h4 class="aez-all-caps -blue">Pick Up:</h4>
                            <div class="aez-edit-block">
                                <span class="modify_reserve_desk">Modify Reservation </span>
                                <i class="fa fa-pencil-square-o modify_reserve_desk" aria-hidden="true"></i>
                            </div>
                        </div>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year)) .' | ' . strtolower($pickup_time) . '</h5>
                        <p class="aez-info-text">
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_name'])) . ' (' . $_SESSION['search']['rental_location_id'] . ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_city'])) . ', ' . $_SESSION['search']['rental_location_state'] . ' ' . $_SESSION['search']['rental_location_zip'] . '
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <div class="aez-info-section__header">
                            <h4 class="aez-all-caps -blue">Drop Off:</h4>
                            <div class="aez-edit-block">
                                <span class="modify_reserve_mobile">Modify Reservation</span>
                                <i class="fa fa-pencil-square-o modify_reserve_mobile" aria-hidden="true"></i>
                            </div>
                        </div>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $dropoff_month, $dropoff_day, $dropoff_year)) . ' | ' . strtolower($dropoff_time) . '</h5>
                        <p class="aez-info-text">
                            ' . ucwords(strtolower($_SESSION['search']['return_location_name'])) . ' (' . $_SESSION['search']['return_location_id'] . ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_city'])) . ', ' . $_SESSION['search']['return_location_state'] . ' ' . $_SESSION['search']['return_location_zip'] . '
                        </p>
                    </div>
                </div>
            </div> <!-- end aez-info-block-container -->
            <div class="aez-list aez-list--confirmation">
                <h3>Fees &amp; Options</h3>
                <ul>
                    <div class="list-items total-bottom-border">
                        <li>Vehicle Rental</li>
                        <li>'. $currency_symbol. sprintf('%01.2f', strval($rate_amount)) . '<span class="aez-sub -blue"> /' . $days . '</span></li>
                    </div>';

                    // Display the discount if there is one amd it's greater than 0
                    if (isset($discount_percent) && $discount_percent > 0) {

                        $discount = $discount_percent * 100;

                        $this->display_confirmation .= '
                        <div class="list-items total-bottom-border">
                            <li>Discount (' . $discount . '%)</li>
                            <li>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"> ' . $currency_symbol . $vehicle_discount . '</span>
                            </li>
                        </div>';
                    }

                    // If the vehicle is US based then show the break down in taxes
                    if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {

                        $this->display_confirmation .= '
                        <div class="list-items">
                            <li>Taxes and Fees</li>
                        </div>';

                        // If it's prepaid then display the prepaid taxes, if it's not prepaid then display 
                        // the pay later taxes.
                        if ($_SESSION['confirm']['payment_type'] == 'prepaid' ) {

                            // Number of taxes and fees that we need to loop though
                            $number = floor(count($vehicle_picked['Taxes']['Prepaid'])/5);

                            // Chunk the vehicle_picked array and create a new array with 5 elements per indexed array
                            if (is_array($vehicle_picked['Taxes']['Prepaid'])) {
                                $chunk_array = array_chunk($vehicle_picked['Taxes']['Prepaid'], 5);
                            }

                            // Loop through the taxes and fees and display them
                            for ($x=0; $x < $number; $x++) {
                                $this->display_confirmation .= '
                                <div class="list-items taxes-fees">
                                    <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">' . $currency_symbol . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                                </div>';
                            }

                        } else {

                            // Number of taxes and fees that we need to loop though
                            $number = floor(count($vehicle_picked['Taxes'])/5);

                            // Chunk the vehicle_picked array and create a new array with 5 elements per indexed array
                            if (is_array($vehicle_picked['Taxes'])) {
                                $chunk_array = array_chunk($vehicle_picked['Taxes'], 5);
                            }

                            // Loop through the taxes and fees and display them
                            for ($x=0; $x < $number; $x++) {
                                $this->display_confirmation .= '
                                <div class="list-items taxes-fees">
                                    <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $currency_symbol . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                                </div>';
                            }

                        }

                        $this->display_confirmation .= '
                        <div class="list-items total-bottom-border">
                            <li>Taxes and Fees Total</li>
                            <li> '. $currency_symbol . sprintf('%01.2f', strval($total_taxes)) . '</li>
                        </div>';
                    } else {
                        $this->display_confirmation .= '
                        <div class="list-items total-bottom-border">
                            <li>Taxes and Fees</li>
                            <li> '. $currency_symbol . $total_taxes . '</li>
                        </div>';

                    }

                    // If the vehicle is US based then show the break down in extras
                    if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {

                        $this->display_confirmation .= '
                            <div class="list-items">
                                <li>Extras</li>
                            </div>';

                            // Number of extras
                            $numOptions = count($_SESSION['confirm']['DailyExtra']);

                            // Loop through the extras
                            for ($x=0; $x < $numOptions; $x++) {

                                $this->display_confirmation .= '
                                    <div class="list-items">
                                        <li class="fee-breakdown">' .$_SESSION['confirm']['DailyExtra'][$x]['ExtraDesc'] .'';

                                $this->display_confirmation .= AdvRez_Helper::getAwardsToolTips($_SESSION['confirm']['DailyExtra'][$x]['ExtraDesc']);
                                        
                                $this->display_confirmation .= '
                                        </li>
                                        <li class="fee-breakdown">
                                            <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $currency_symbol . sprintf('%01.2f', strval($_SESSION['confirm']['DailyExtra'][$x]['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span></li>
                                    </div>';
                            }

                    }

                        // Display the Extras Total
                        $this->display_confirmation .= '
                        <div class="list-items">
                            <li>Extras Total</li>
                            <li> '. $currency_symbol . sprintf('%01.2f', strval($total_extras)) . '</li>
                        </div>';


                        // Display the total charges
                        $this->display_confirmation .= '
                        <div class="list-items total">
                        <li>Total</li>
                        <li>'. $currency_symbol . sprintf('%01.2f', strval($total_charges)) . '</li>
                    </div>
                </ul>
            </div> <!-- end aez-list -->

            <div class="aez-info-block-container renter-info">
                <h3>Renter Information</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <div class="aez-info-section__header">
                            <h4 class="aez-all-caps -blue">Profile:</h4>
                            <!-- <div class="aez-edit-block">
                                <span> Edit </span>
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </div> --!>
                        </div>
                        
                        <p class="aez-info-text">
                            Name: ' . $_SESSION['renter']['renter_first'] . ' ' . $_SESSION['renter']['renter_last'] . '<br>';

                            // Check if the customer put in their address. If they did then display it.
                            // Otherwise just display the email address.
                            if (!empty($_SESSION['renter']['renter_address1'])) {
                                $this->display_confirmation .= 'Address: ' . $_SESSION['renter']['renter_address1'] . ((isset($_SESSION['renter']['renter_address2'])) && (trim(strlen($_SESSION['renter']['renter_address2'])) > 0) ? '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $_SESSION['renter']['renter_address2'] : '' ) .'<br>
                                ' . $_SESSION['renter']['renter_city'] . ', ' . $_SESSION['renter']['renter_state'] . ' ' . $_SESSION['renter']['renter_zip'] . ' ' . $_SESSION['renter']['renter_country'] . '';
                            } else {
                                $this->display_confirmation .= 'Email: ' . $_SESSION['renter']['renter_email_address'];
                            }
                            
                            $this->display_confirmation .= '
                        </p>
                    </div>';

        if (! (isset($_SESSION['adv_login']))) {
                    $this->display_confirmation .= '<div class="aez-info-section">
                        <div class="aez-info-section__header">
                            <h4 class="aez-all-caps -blue">Expressway Status:</h4>
                             <!--<div class="aez-edit-block">
                                <span>Edit</span>
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </div>--!>
                        </div>
                        <p class="aez-info-text">
                            Non-member
                        </p>
                        <p>
                            Simply add a username and password to start earning now!
                        </p>
<div class="aez-form-block aez-form-block--log-in-information">

<form id="adv_login" class="aez-form aez-login" action="/confirm" role="form" method="POST" name="adv_login">
                <div class="aez-form-block">
                    <div class="aez-form-block__header">
                        <h3 class="aez-form-block__heading">Log In to Advantage Expressway</h3>
                        <i class="fa fa-info-circle aez-form-block__icon"></i>
                    </div>
                    <div class="aez-form-item">
                        <label for="user_name" class="aez-form-item__label">User Name</label>
                        <input
                            id="user_name"
                            type="email"
                            class="aez-form-item__input"
                            name="user_name"
                            placeholder="Email Address"
                        />
                    </div>
                    <div class="aez-form-item">
                        <label for="password" class="aez-form-item__label">Password</label>
                        <input
                            id="password"
                            type="password"
                            class="aez-form-item__input"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                    <input type="hidden" name="return_url" value="/confirm">
                    <a href="/forgot-password-request" class="aez-awards-form__link aez-awards-form__link--forgot">Forgot Password?</a>
                    <button type="submit" class="aez-btn aez-btn--outline-blue aez-awards-form__submit aez-login__submit">Log In</button>
                    <a href="javascript:void(0);" class="aez-awards-form__link aez-awards-form__link--signup signup_menu">Not a member? Sign up now<i class="fa fa-angle-right"></i></a>
                </div>
            </form>
</div>
                        <!--<div class="aez-form-block aez-form-block--log-in-information">
                            <div class="aez-form-item">
                                <label for="user_name" class="aez-form-item__label">User Name</label>
                                <input
                                    id="user_name"
                                    type="email"
                                    class="aez-form-item__input"
                                    name="user_name"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="password" class="aez-form-item__label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    class="aez-form-item__input"
                                    name="password"
                                    placeholder="Password"
                                />
                            </div>
                        </div>-->
                        <button id="add-log-in-info" type="button" name="button" class="aez-btn aez-btn--outline-blue">Add Log-in Information</button>

                        
                    </div>';
} else {
    $this->display_confirmation .= '<div class="aez-info-section">
                        <div class="aez-info-section__header">
                            <h4 class="aez-all-caps -blue">Expressway Status:</h4>
                        </div>
                        <p class="aez-info-text">
                            Advantage Expressway Member
                        </p>
                        </div>';
}
                    
                $this->display_confirmation .= '</div>

            </div> 

            <form id="aez_confirm_reservation_form" class="aez-reservation aez-reservation-flow-form">';

            if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
            
// ADD REQUIRED TO:
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
                $this->display_confirmation .= '
                    <div class="aez-form-block aez-form-block--payment-method">
                    <h3 class="aez-form-block__heading">Payment Method</h3>
                    <div class="aez-form-block__cards">
                        <span>We accept:</span>
                        <div class="aez-credit-cards"></div>
                    </div>
                    <p>We accept all major credit cards as payment for a pre-paid rental. Please note, at the time of rental the renter will need to present a current driver\'s license and a valid credit or charge card in the renters name.</p>
                    <span class="aez-required-fields">Required Fields<sup>*</sup></span>
                    <div class="aez-form-item">
                        <label for="card_name" class="aez-form-item__label">Name On Card<sup>*</sup></label>
                        <input
                            id="card_name"
                            type="text"
                            class="aez-form-item__input"
                            name="card_name"
                            placeholder="Full Name"
                            required
                       />
                    </div>
                    <div class="aez-form-item">
                        <label for="card_number" class="aez-form-item__label">Credit Card<sup>*</sup></label>
                        <input
                            id="card_number"
                            type="text"
                            class="aez-form-item__input"
                            name="card_number"
                            placeholder="Credit Card"
                            required
                        />
                    </div>
                    <div class="aez-form-item--with-icon">
                        <div class="aez-form-item">
                            <label for="card_cvc" class="aez-form-item__label">CVC<sup>*</sup></label>
                            <input
                                id="card_cvc"
                                type="password"
                                class="aez-form-item__input"
                                name="card_cvc"
                                placeholder="3-4 Digit Code"
                                maxlength="4"
                                pattern="[0-9]{3,4}"
                                required
                            />
                        </div>
                        <!-- <i class="fa fa-info-circle aez-form-block__icon"></i> -->
                    </div>
                    <div class="aez-form-item aez-form-item--dropdown">
                        <label for="card_exp_year" class="aez-form-item__label">Expiration Year<sup>*</sup></label>
                        <select
                            id="card_exp_year"
                            class="aez-form-item__dropdown"
                            name="card_exp_year"
                            required
                        >
                            <option value="">&nbsp;</option>
                            ' . $card_exp_dropdown . '
                        </select>
                    </div>
                    <div class="aez-form-item aez-form-item--dropdown">
                        <label for="card_exp_month" class="aez-form-item__label">Expiration Month<sup>*</sup></label>
                        <select
                            id="card_exp_month"
                            class="aez-form-item__dropdown"
                            name="card_exp_month"
                            required
                        >
                            <option value="">&nbsp;</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">Jun</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>';

                    $publicKey = file_get_contents($_SERVER["DOCUMENT_ROOT"] . '/Payment/data/' . '/public.pem');
		
                    if(isset($_SESSION['adv_login'])) { 
                        $this->display_confirmation .= '          
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

                    $this->display_confirmation .= '                            
                    <span class="aez-form-block__heading">Billing Address</span>
                    <div class="aez-form-item--checkbox-cont">
                        <input
                            id="use_profile_address"
                            type="checkbox"
                            class="aez-form-item__checkbox"
                            name="use_profile_address"
                            checked
                        />
                        <label for="use_profile_address" class="aez-form-item__label">Same As Profile Address Above</label>
                    </div>
                    
                    <div class="aez-form-billing-address">
                        <div class="aez-form-item">
                            <label for="billing_street_address_1" class="aez-form-item__label">Street Address<sup>*</sup></label>
                            <input
                                id="billing_street_address_1"
                                type="text"
                                class="aez-form-item__input"
                                name="billing_street_address_1"
                                placeholder="Street Address"
                                value="' . $street_address_1 . '"
                                
                            />
                        </div>
                        <div class="aez-form-item">
                            <label for="billing_street_address_2" class="aez-form-item__label">Street Address</label>
                            <input
                                id="billing_street_address_2"
                                type="text"
                                class="aez-form-item__input"
                                name="billing_street_address_2"
                                placeholder="Street Address 2"
                                value="' . $street_address_2 . '"
                            />
                        </div>
                        <div class="aez-form-item">
                            <label for="billing_postal_code" class="aez-form-item__label">Postal Code<sup>*</sup></label>
                            <input
                                id="billing_postal_code"
                                type="text"
                                class="aez-form-item__input"
                                name="billing_postal_code"
                                placeholder="Postal Code"
                                value="' . $postal_code . '"
                                
                            />
                        </div>
                        <div class="aez-form-item">
                            <label for="billing_city" class="aez-form-item__label">City<sup>*</sup></label>
                            <input
                                id="billing_city"
                                type="text"
                                class="aez-form-item__input"
                                name="billing_city"
                                placeholder="City"
                                value="' . $city . '"
                                
                            />
                        </div>
                        <div class="aez-form-item aez-form-item--dropdown">
                            <label for="billing_state" class="aez-form-item__label">State</label>
                            <select
                                id="billing_state"
                                class="aez-form-item__dropdown"
                                name="billing_state"
                            >
                                <option>&nbsp;</option>
                                <option value="AL"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'AL' ? ' selected="selected"' : '' ) .
                                '>Alabama</option>
                                <option value="AK"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'AK' ? ' selected="selected"' : '' ) .
                                '>Alaska</option>
                                <option value="AZ"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'AZ' ? ' selected="selected"' : '' ) .
                                '>Arizona</option>
                                <option value="AR"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'AR' ? ' selected="selected"' : '' ) .
                                '>Arkansas</option>
                                <option value="CA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'CA' ? ' selected="selected"' : '' ) .
                                '>California</option>
                                <option value="CO"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'CO' ? ' selected="selected"' : '' ) .
                                '>Colorado</option>
                                <option value="CT"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'CT' ? ' selected="selected"' : '' ) .
                                '>Connecticut</option>
                                <option value="DE"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'DE' ? ' selected="selected"' : '' ) .
                                '>Delaware</option>
                                <option value="DC"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'DC' ? ' selected="selected"' : '' ) .
                                '>District of Columbia</option>
                                <option value="FL"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'FL' ? ' selected="selected"' : '' ) .
                                '>Florida</option>
                                <option value="GA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'GA' ? ' selected="selected"' : '' ) .
                                '>Georgia</option>
                                <option value="HI"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'HI' ? ' selected="selected"' : '' ) .
                                '>Hawaii</option>
                                <option value="ID"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'ID' ? ' selected="selected"' : '' ) .
                                '>Idaho</option>
                                <option value="IL"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'IL' ? ' selected="selected"' : '' ) .
                                '>Illinois</option>
                                <option value="IN"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'IN' ? ' selected="selected"' : '' ) .
                                '>Indiana</option>
                                <option value="IA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'IA' ? ' selected="selected"' : '' ) .
                                '>Iowa</option>
                                <option value="KS"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'KS' ? ' selected="selected"' : '' ) .
                                '>Kansas</option>
                                <option value="KY"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'KY' ? ' selected="selected"' : '' ) .
                                '>Kentucky</option>
                                <option value="LA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'LA' ? ' selected="selected"' : '' ) .
                                '>Louisiana</option>
                                <option value="ME"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'ME' ? ' selected="selected"' : '' ) .
                                '>Maine</option>
                                <option value="MD"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MD' ? ' selected="selected"' : '' ) .
                                '>Maryland</option>
                                <option value="MA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MA' ? ' selected="selected"' : '' ) .
                                '>Massachusetts</option>
                                <option value="MI"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MI' ? ' selected="selected"' : '' ) .
                                '>Michigan</option>
                                <option value="MN"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MN' ? ' selected="selected"' : '' ) .
                                '>Minnesota</option>
                                <option value="MS"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MS' ? ' selected="selected"' : '' ) .
                                '>Mississippi</option>
                                <option value="MO"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MO' ? ' selected="selected"' : '' ) .
                                '>Missouri</option>
                                <option value="MT"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'MT' ? ' selected="selected"' : '' ) .
                                '>Montana</option>
                                <option value="NE"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NE' ? ' selected="selected"' : '' ) .
                                '>Nebraska</option>
                                <option value="NV"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NV' ? ' selected="selected"' : '' ) .
                                '>Nevada</option>
                                <option value="NH"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NH' ? ' selected="selected"' : '' ) .
                                '>New Hampshire</option>
                                <option value="NJ"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NJ' ? ' selected="selected"' : '' ) .
                                '>New Jersey</option>
                                <option value="NM"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NM' ? ' selected="selected"' : '' ) .
                                '>New Mexico</option>
                                <option value="NY"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NY' ? ' selected="selected"' : '' ) .
                                '>New York</option>
                                <option value="NC"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'NC' ? ' selected="selected"' : '' ) .
                                '>North Carolina</option>
                                <option value="ND"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'ND' ? ' selected="selected"' : '' ) .
                                '>North Dakota</option>
                                <option value="OH"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'OH' ? ' selected="selected"' : '' ) .
                                '>Ohio</option>
                                <option value="OK"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'OK' ? ' selected="selected"' : '' ) .
                                '>Oklahoma</option>
                                <option value="OR"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'OR' ? ' selected="selected"' : '' ) .
                                '>Oregon</option>
                                <option value="PA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'PA' ? ' selected="selected"' : '' ) .
                                '>Pennsylvania</option>
                                <option value="RI"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'RI' ? ' selected="selected"' : '' ) .
                                '>Rhode Island</option>
                                <option value="SC"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'SC' ? ' selected="selected"' : '' ) .
                                '>South Carolina</option>
                                <option value="SD"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'SD' ? ' selected="selected"' : '' ) .
                                '>South Dakota</option>
                                <option value="TN"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'TN' ? ' selected="selected"' : '' ) .
                                '>Tennessee</option>
                                <option value="TX"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'TX' ? ' selected="selected"' : '' ) .
                                '>Texas</option>
                                <option value="UT"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'UT' ? ' selected="selected"' : '' ) .
                                '>Utah</option>
                                <option value="VT"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'VT' ? ' selected="selected"' : '' ) .
                                '>Vermont</option>
                                <option value="VA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'VA' ? ' selected="selected"' : '' ) .
                                '>Virginia</option>
                                <option value="WA"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'WA' ? ' selected="selected"' : '' ) .
                                '>Washington</option>
                                <option value="WV"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'WV' ? ' selected="selected"' : '' ) .
                                '>West Virginia</option>
                                <option value="WI"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'WI' ? ' selected="selected"' : '' ) .
                                '>Wisconsin</option>
                                <option value="WY"'
                                . (isset($_SESSION['renter']['renter_state']) && $_SESSION['renter']['renter_state'] == 'WY' ? ' selected="selected"' : '' ) .
                                '>Wyoming</option>
                            </select>
                        </div>
                        <!--<div class="aez-form-item aez-form-item--dropdown">
                            <label for="billing_country" class="aez-form-item__label">Country<sup>*</sup></label>
                            <select
                                id="billing_country"
                                class="aez-form-item__dropdown"
                                name="billing_country"
                                required
                            >
                                <option>&nbsp;</option>
                                <option value="USA" selected>United States</option>
                            </select>
                        </div>--> 
                    </div>
                </div>';    

            }

            $this->display_confirmation .= '<div class="aez-confirm-btn-container">
                <button
                    type="submit"
                    name="button"
                    class="aez-btn aez-btn--filled-green aez-confirm-btn"
                >Confirm Reservation</button>';

            if ($_SESSION['confirm']['payment_type'] == 'prepaid') {

                $this->display_confirmation .= '<span class="aez-confirm-btn__disclaimer">**Please note:  Your credit card will be charged after you press confirm.</span>';
            }

            $this->display_confirmation .= '</div>
        </form>

        <div class="aez-extra aez-extra--confirmation">
            <div class="aez-extra-header aez-location-policies-dd">
                <h4>Location Rental Policy</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div id="location-policy-drop-down" class="aez-extra-content">
                <div id="policies"></div>
                <input type="hidden" name="location" value="'. $_SESSION["search"]["rental_location_id"] .'">
            </div>
            <div id="terms-and-conditions-accordion-tab" class="aez-extra-header">
                <h4>Terms &amp; Conditions</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>';

            if (isset($_SESSION['search']['BrandName']) && $_SESSION['search']['BrandName'] == 'Europcar') {
                $this->display_confirmation .= AdvRez_Helper::getEuropeCarTermsAndConditions();
            } else {
                $this->display_confirmation .= AdvRez_Helper::getTermsAndConditions();
            }
            $this->display_confirmation .= '

        </div>
    </main>
</div>
<div class="aez-reservation__fixed-footer">
    <div class="aez-reservation__row">
        <a href="/reserve?back=yes" class="aez-reservation__back-btn">Back</a>
        <span class="aez-reservation__save-btn">Confirm Reservation</span>
    </div>
</div>';

$this->display_confirmation .= '
    <input type="hidden" id="progress-rental-location" name="progress-rental-location" value="'. $_SESSION['search']['rental_location_id']. '">
    <input type="hidden" id="progress-return-location" name="progress-return-location" value="'. $_SESSION['search']['return_location_id']. '">

    <input type="hidden" id="progress-pickup-date" name="progress-pickup-date" value="'. $_SESSION['search']['pickup_date']. '">
    <input type="hidden" id="progress-pickup-time" name="progress-pickup-time" value="'. $_SESSION['search']['pickup_time']. '">

    <input type="hidden" id="progress-dropoff-date" name="progress-dropoff-date" value="'. $_SESSION['search']['dropoff_date']. '">
    <input type="hidden" id="progress-dropoff-time" name="progress-dropoff-time" value="'. $_SESSION['search']['dropoff_time']. '">
    <input type="hidden" id="progress-express-checkout-option" name="progress-express-checkout-option" value="'. $_SESSION['search']['express_checkout_option']. '">';

    if ($_SESSION['search']['promo_codes'] > 0) {
        foreach ($_SESSION['search']['promo_codes'] as $value) {
            $this->display_confirmation .= '<input type="hidden" id="progress-promo-codes" name="progress-promo-codes[]" value="'. $value. '">';
        }
    }
        return $this->display_confirmation;

	}

}
