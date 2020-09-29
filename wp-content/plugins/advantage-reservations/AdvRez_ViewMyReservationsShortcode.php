<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_ViewMyReservationsShortcode extends AdvRez_ShortCodeScriptLoader {

    public $view_my_rez_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            // needs select2, pikaday, moment
            wp_enqueue_script('my-reservations', plugins_url('js/adv_my-reservations.js', __FILE__), array('jquery', 'main'), '1.0', true);
            wp_enqueue_script('my-reservations-policies', plugins_url('adv-contact-us/js/adv_location_policies.js'), array('jquery', 'main'), '1.0', true);
            wp_enqueue_script('my-reservations-accordion', plugins_url('advantage-reservations/js/adv_accordion_menu.js'), array('jquery', 'main'), '1.0', true);
            wp_enqueue_script('awards-block',get_stylesheet_directory_uri() . '/js/awards-block.js', array('jquery', 'main'), '1.0', true );
            // wp_enqueue_script('promo-code-add-remove', get_stylesheet_directory_uri() . '/js/promo-code-add-remove.js', array('jquery', 'main'), '1.0', true);
 
            // wp_localize_script( 'adv_modal_form', 'ADV_Rez_Ajax', array(
            //     'ajaxurl'   => admin_url( 'admin-ajax.php' ),
            //     'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
            //     )
            // );
        }
    }

    public function handleShortcode($atts) {

        extract( shortcode_atts( array(
            'message' => ''
        ), $atts ) );

        $reservation_status = $_SESSION['my_reservation']['reservation_status'];
        // If reservation is cancelled then display the cancelled message
        if (strtolower($reservation_status) == "cancelled") {
            $this->view_my_rez_html = '
            <div id="primary">
                <div class="aez-confirmation">
                    <div class="aez-confirmation__heading" style="margin-top: 0 !important;">Your reservation has been canceled!</div>
                    <div class="aez-confirmation-number">
                        <div class="aez-confirmation-number__heading">Confirmation Number:</div>
                        <div class="aez-confirmation-number__number">' .  $_SESSION['my_reservation']['confirm_num'] . '</div>
                    </div>
                </div>';

        } else {
             $this->view_my_rez_html = '
             <div id="primary">
                <div class="aez-confirmation">
                    <div class="aez-confirmation__heading" style="margin-top: 0 !important;">Your reservation:</div>
                    <div class="aez-confirmation-number">
                        <div class="aez-confirmation-number__heading">Confirmation Number:</div>
                        <div class="aez-confirmation-number__number">' . $_SESSION['my_reservation']['confirm_num'] . '</div>
                    </div>
                </div>';
        }


        $this->view_my_rez_html .= '';
      
        if (isset($_SESSION['my_reservation']['WeeklyRate'])) {
            $rate_amount = $_SESSION['my_reservation']['WeeklyRate'];
            $days = "week";
            $days_ly = "weekly";
        } else {
            $days = "day";
            $days_ly = "daily";
            $rate_amount = $_SESSION['my_reservation']['DailyRate'];

        }
        $rate_charge = $_SESSION['my_reservation']['TotalPricing']['RateCharge'];
        $total_taxes = $_SESSION['my_reservation']['TotalPricing']['TotalTaxes'];
        $total_extras = $_SESSION['my_reservation']['TotalPricing']['TotalExtras'];
        $total_charges = $_SESSION['my_reservation']['TotalPricing']['TotalCharges'];
        $car_image_url = $_SESSION['my_reservation']['class_image_url'];
        $intl_locations = $_SESSION['my_reservation']['RentalVendorDetails']['AddressCountry'];
        $class_code = $_SESSION['my_reservation']['class_code'];

       $this->view_my_rez_html .= '<div id="primary">
   

    <main id="main" role="main">
        <div class="aez-reservation">
            <div class="aez-print-row">
                <a href="javascript:window.print();" class="aez-print-text">Print <i class="fa fa-print aez-print-icon"></i>
            </div></a>

            <div class="aez-selected-car">
                <!-- <a href="#">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </a> -->
                <div class="aez-vehicle-img">';
                if ($class_code == "XXAR") {
                    $this->view_my_rez_html .= '<img src="wp-content/plugins/advantage-vehicles/assets/XXAR_800x400.png" alt="car picture">';
                }
                else if((strpos($car_image_url, 'carimages') !== false) || empty($car_image_url) || !isset($car_image_url))  {
                     $this->view_my_rez_html .= '<img src="wp-content/plugins/advantage-vehicles/assets/XXAR_800x400.png" alt="car picture">';
                }
                else {
                     $this->view_my_rez_html .= '<img src="' . $_SESSION['my_reservation']['class_image_url'] . '" alt="car picture">';
                }
                $this->view_my_rez_html .= '</div>
               <div class="aez-vehicle-content aez-complete-selection">
                    <h3>Selected:</h3>
                    <span class="aez-enhance-selection__car-name">' . $_SESSION['my_reservation']['model_desc'] . '<span class="or_similar">(or similar)</span></span>
                    <span class="aez-enhance-selection__car-type car-type">'. $_SESSION['my_reservation']['category'] . ' ' . $_SESSION['my_reservation']['second'] . ' <span class="aez-enhance-selection__car-code">(' . $_SESSION['my_reservation']['class_code'] . ')</span>
                    </span>
                    <!--
                    <div class="aez-mini-details">
                        <span>
                            <i class="fa fa-road" aria-hidden="true"></i>
                            <p>' . $auto . '</p>
                        </span>
                        <span>
                            <i class="fa fa-tachometer" aria-hidden="true"></i>
                            <p></p>
                        </span>
                        <span>
                            <i class="fa fa-users" aria-hidden="true"></i>
                            <p>' . $passengers . '</p>
                        </span>
                        <span>
                            <i class="fa fa-suitcase" aria-hidden="true"></i>
                            <p>' . $luggage . '</p>
                        </span>
                    </div>
                    -->
                </div>
            </div> <!-- end aez-selected-car-container -->

            <div class="aez-info-block-container">
                <h3>Itinerary</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Pick Up</h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $_SESSION['my_reservation']['pickup_month'], $_SESSION['my_reservation']['pickup_day'], $_SESSION['my_reservation']['pickup_year'])) . ' | ' . strtolower($_SESSION['my_reservation']['pickup_time']) .'</h5>
                        <p class="aez-info-text">';

                        if ($_SESSION['my_reservation']['api_provider'] == "XRS") {
                            $this->view_my_rez_html .= '' . $_SESSION['my_reservation']['vendor_name'] .'<br>';
                        }

                        $this->view_my_rez_html .='
                            ' . $_SESSION['my_reservation']['rental_location_street1'] . ' (' . $_SESSION['my_reservation']['rental_location_name'] . ')<br>';

                        if (isset($_SESSION['my_reservation']['rental_location_street2']) && $_SESSION['my_reservation']['rental_location_street2'] !== "") {
                             $this->view_my_rez_html .= ''.$_SESSION['my_reservation']['rental_location_street2'].'<br>';
                        }

                        $this->view_my_rez_html .= '
                        ' . $_SESSION['my_reservation']['rental_location_city'] . ', ';

                        if (isset($_SESSION['my_reservation']['rental_location_state']) && $_SESSION['my_reservation']['rental_location_state'] !== "") {
                             $this->view_my_rez_html .= '' . $_SESSION['my_reservation']['rental_location_state'] . ' ' . $_SESSION['my_reservation']['rental_location_zip'].'';
                        } else {
                              $this->view_my_rez_html .= ''. $_SESSION['my_reservation']['rental_location_country'].'';
                        }

                        $this->view_my_rez_html .= '
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Drop Off</h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $_SESSION['my_reservation']['dropoff_month'], $_SESSION['my_reservation']['dropoff_day'], $_SESSION['my_reservation']['dropoff_year'])). ' | ' . strtolower($_SESSION['my_reservation']['dropoff_time']) .'</h5>
                        <p class="aez-info-text">';

                             if ($_SESSION['my_reservation']['api_provider'] == "XRS") {
                                $this->view_my_rez_html .= '' . $_SESSION['my_reservation']['vendor_name'] .'<br>';
                             }

                            $this->view_my_rez_html .= '
                            ' . $_SESSION['my_reservation']['return_location_street1'] . ' (' . $_SESSION['my_reservation']['return_location_name'] . ')<br>';

                             if (isset($_SESSION['my_reservation']['return_location_street2']) && $_SESSION['my_reservation']['return_location_street2'] !== "") {
                                 $this->view_my_rez_html .= ''.$_SESSION['my_reservation']['return_location_street2'].'<br>';
                            }

                             $this->view_my_rez_html .= '
                            ' . $_SESSION['my_reservation']['return_location_city'] . ', ';

                            if (isset($_SESSION['my_reservation']['return_location_state']) && $_SESSION['my_reservation']['return_location_state'] !== "") {
                                 $this->view_my_rez_html .= '' . $_SESSION['my_reservation']['return_location_state'] . ' ' . $_SESSION['my_reservation']['return_location_zip'].'';
                            } else {
                                  $this->view_my_rez_html .= ''. $_SESSION['my_reservation']['return_location_country'].'';
                            }

                         $this->view_my_rez_html .= '
                        </p>
                    </div>
                </div>
            </div> <!-- end aez-info-block-container -->';

            // Number of extras
            $numOptions = count($_SESSION['my_reservation']['daily_extra']);

                if ($_SESSION['my_reservation']['display_rate'] !== "N" ) {

                    $this->view_my_rez_html .= '
                        <div class="aez-list aez-list--summary aez-list--completed">
                            <h3>Fees &amp; Options</h3>
                            <ul>';
                } else {

                     $this->view_my_rez_html .= '
                        <div class="aez-list aez-list--summary aez-list--completed">
                            <ul>';

                }

                // Check the display rate. If it's equal to "N" don't display the vehicle cost. If the 
                // display rate equals "Y" then display everything.
                if ($_SESSION['my_reservation']['display_rate'] !== "N") { 

                    $this->view_my_rez_html .= '
                            <div class="list-items total-bottom-border">
                                <li>Vehicle Rental</li>
                                <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['rate_charge'] . '</li>
                            </div>';

                            // If there's a rate discount then show it.
                            if (isset($_SESSION['my_reservation']['TotalPricing']['RateDiscount']) && $_SESSION['my_reservation']['TotalPricing']['RateDiscount'] < 0) {
                                $this->view_my_rez_html .= '
                                <div class="list-items total-bottom-border">
                                    <li>Discount</li>
                                    <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['TotalPricing']['RateDiscount'] . '</li>
                                </div>';
                            }

                            $this->view_my_rez_html .= '
                            <div class="list-items">
                                <li>Taxes and Fees</li>
                            </div>';

                            // Number of taxes and fees that we need to loop though
                            $number = floor(count($_SESSION['my_reservation']['TotalPricing']['Taxes'])/5);

                            // Chunk the response_contents_array and create a new array with 5 elements per indexed array
                            if (is_array($_SESSION['my_reservation']['TotalPricing']['Taxes'])) {
                                $chunk_array = array_chunk($_SESSION['my_reservation']['TotalPricing']['Taxes'], 5);
                            }

                            // Loop through the taxes and fees and display them
                            for ($x=0; $x < $number; $x++) {
                                $this->view_my_rez_html .= '
                                <div class="list-items taxes-fees">
                                    <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">' . $_SESSION['my_reservation']['currency_symbol'] . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                                </div>';
                            }

                            $this->view_my_rez_html .= '
                             <div class="list-items total-bottom-border">
                                <li>Taxes and Fees Total</li>
                                <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['total_taxes'] . '</li>
                            </div>';

                } // End display rate

                // // Number of extras
                // $numOptions = count($_SESSION['my_reservation']['daily_extra']);

                if (isset($_SESSION['my_reservation']['daily_extra'])) {

                    $this->view_my_rez_html .= '
                        <div class="list-items">
                            <li>Extras</li>
                        </div>';

                        // Loop through the extras
                        for ($x=0; $x < $numOptions; $x++) {

                            $this->view_my_rez_html .= '
                                <div class="list-items">
                                    <li class="fee-breakdown">' .$_SESSION['my_reservation']['daily_extra'][$x]['ExtraDesc'] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $_SESSION['my_reservation']['currency_symbol'] . sprintf('%01.2f', strval($_SESSION['my_reservation']['daily_extra'][$x]['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span></li>
                                </div>';
                        }

                    $this->view_my_rez_html .= '
                        <div class="list-items">
                            <li>Extras Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['total_extras'] . '</li>
                        </div>';
                } else {
                     $this->view_my_rez_html .= '
                        <div class="list-items">
                            <li>Extras</li>
                        </div>
                         <div class="list-items">
                            <li>Extras Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . '0.00</li>
                        </div>';
                }

                // Check the display rate. If it's equal to "N" don't display the total cost. If the 
                // display rate equals "Y" then display it.
                if ($_SESSION['my_reservation']['display_rate'] !== "N") { 
                         $this->view_my_rez_html .= '
                        <div class="list-items total">
                            <li>Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['TotalPricing']['TotalCharges'] . '</li>
                        </div>';
                }

                 $this->view_my_rez_html .= '
                    </ul>
                </div><!-- end aez-list -->';

                 // If there's no credit card info don't display the Payment section
                if (!empty($_SESSION['my_reservation']['card_type'])) {

                    if (count($_SESSION['my_reservation']['card_number']) > 0 ) {
                        $credit_card = $_SESSION['my_reservation']['card_number'];
                    } else {
                        $credit_card = "xxxxxxxxxx";
                    }

                    $this->view_my_rez_html .= '
                    <div class="aez-info-block-container">
                        <h3>Payment</h3> 
                        <div class="aez-info-block">
                            <div class="aez-info-section">
                                <h4 class="aez-all-caps -blue">Credit Card</h4>
                                <p class="aez-info-text">
                                    Name: ' . $_SESSION['my_reservation']['card_type'] . '<br>
                                    Ends in: ' . $credit_card . '<br>
                                    Exp. Date: ' . substr($_SESSION['my_reservation']['card_exp'], 0, -2) . '/' . substr($_SESSION['my_reservation']['card_exp'], -2) . '
                                </p>
                            </div>

                            <div class="aez-info-section">
                                <h4 class="aez-all-caps -blue">Billing Address</h4>
                                <p class="aez-info-text">
                                    ' . $_SESSION['my_reservation']['street_address_1'] . ' ' . $_SESSION['my_reservation']['street_address_2'] . '<br />
                                    ' . $_SESSION['my_reservation']['city'] . ', ' . $_SESSION['my_reservation']['state'] . ' ' . $_SESSION['my_reservation']['postal_code'] . '
                                </p>
                            </div>
                        </div>
                    </div> <!-- end aez-info-block-container -->';

                } else {
                     $this->view_my_rez_html .= '
                    <div class="aez-info-block-container">
                        <h3>Payment</h3>
                        <div class="aez-info-block pay-counter">
                            Pay At counter
                        </div>
                    </div> <!-- end aez-info-block-container -->';
                } // End if

                // Check if the email address is empty. If it's not empty set the variable to the email. If it's empty
                // set it to nothing.
                if (!empty($_SESSION['my_reservation']['email_address'])) {
                    $email_address = strtolower($_SESSION['my_reservation']['email_address']);
                } else {
                    $email_address = "";
                }

                $this->view_my_rez_html .= '
                    <div class="aez-info-block-container renter-info">
                        <h3>Renter Information</h3>
                        <div class="aez-info-block">
                            <div class="aez-info-section">
                                <h4 class="aez-all-caps -blue">Profile</h4>
                                <p class="aez-info-text">
                                    Name: ' . ucwords(strtolower($_SESSION['my_reservation']['renter_first_name'])) . ' '. ucwords(strtolower($_SESSION['my_reservation']['renter_last_name'])) . '<br>';

                                    // Check if the customer put in their address. If they did then display it.
                                    // Otherwise just display the email address.
                                    if (!empty($_SESSION['my_reservation']['street_address_1'])) {
                                        $this->view_my_rez_html .= '
                                            Address: ' . $_SESSION['my_reservation']['street_address_1'] . '<br>';
                                        // If the street_address_2 isn't empty then display the content
                                        if (!empty($_SESSION['my_reservation']['street_address_2'])) {
                                            $this->view_my_rez_html .= $_SESSION['my_reservation']['street_address_2']."<br>";
                                        }
                                        if (!empty($_SESSION['my_reservation']['city'])) {
                                            $this->view_my_rez_html .= $_SESSION['my_reservation']['city'] . ', ' . $_SESSION['my_reservation']['state'] . ' ' . $_SESSION['my_reservation']['postal_code'] . ' ' . $_SESSION['my_reservation']['country'];
                                        }
                                    } else {
                                        $this->view_my_rez_html .= 'Email: ' . $email_address;
                                    }

                $this->view_my_rez_html .= '
                                </p>
                            </div>';

                            if (!isset($_SESSION['adv_login'])) {

                                $this->view_my_rez_html .= '  
                                <div class="aez-info-section">
                                    <h4 class="aez-all-caps -blue">EXPRESSWAY STATUS</h4>
                                    <p class="aez-info-text">
                                        Non-member
                                    </p>
                                    <p>
                                    <a target="_blank" href="expressway/benefits" class="view-reservation-text-link"> When you join the Expressway Program, you get a FREE reward instantly – every time you rent!</a>
                                    </p>
                                    <form action="javascript:void(0);" method="post">
                                        <button type="submit" name="button" class="signup_menu aez-btn aez-btn--filled-green view-reservation-signup-green-button signup_menu">Sign Up Today!</button>
                                    </form>
                                </div>';

                            } else {

                                $this->view_my_rez_html .= '
                                <div class="aez-info-section">
                                    <div class="aez-info-section__header">
                                        <h4 class="aez-all-caps -blue">EXPRESSWAY STATUS:</h4>
                                    </div>
                                    <p class="aez-info-text">
                                        Advantage Expressway Member
                                    </p>
                                </div>';

                            }

                        $this->view_my_rez_html .= '
                        </div>
                    </div> <!-- end aez-info-block-container -->
            </div><!-- end aez-reservation-container -->
        </main>';

        // Create the date from the viewReservation end point
        $date = date("Y-m-d", mktime(0, 0, 0, $_SESSION['my_reservation']['pickup_month'], $_SESSION['my_reservation']['pickup_day'], $_SESSION['my_reservation']['pickup_year']));

        //convert the date to a UNIX timestamp to compare, and make sure the PM time is represented in Military/24 hour time
        $date = strtotime($date . " " . date("H:i", strtotime($_SESSION['my_reservation']['pickup_time'])));

        // Get the gmt time from TSD in the viewReservation end point
        $today_date = explode("/", substr($_SESSION['my_reservation']['Dategmtime'], 0, 10));
        $today_date_month = $today_date[0];
        $today_date_day = $today_date[1];
        $today_date_year = $today_date[2];

        // Get the time 
        $today_time = substr($_SESSION['my_reservation']['Dategmtime'], -8, 8);

        //Convert the date to a UNIX timestamp to compare
        $today = strtotime($today_date_year . "-" . $today_date_month . "-" . $today_date_day . " " .$today_time);

        // Check to see if the display_cancel_reservation setting is set to "Y" in the aez_settings in wordpress.
        // If it is then display the "Cancel Reservation" button if the reservation isn't cancelled and if the date isn't older
        // than today's date. Display the 1-800 number if the reservation isn't cancelled or the date isn't older.
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        if ($api_url_array['display_cancel_reservation'] == "Y") {

            if (strtolower($reservation_status) !== "cancelled" && strtolower($_SESSION['my_reservation']['NoShow']) !== "yes" && $today <= $date) {

                $this->view_my_rez_html .= '
                    <div class="aez-form-block" style="marign-bottom: 50px; padding-bottom: 5%;">
                        <form id="cancel_rez_form">
                            <input type="hidden" name="cancel_rental_location_id" value="'.$_SESSION['my_reservation']['rental_location_id'].'">
                            <input type="hidden" name="cancel_renter_last" value="'.$_SESSION['my_reservation']['renter_last_name'].'">
                            <input type="hidden" name="cancel_confirm_num" value="'.$_SESSION['my_reservation']['confirm_num'].'">
                            <button type="submit" id="aez_rez_cancel" class="aez-btn aez-btn--filled-red" tabindex="-1">Cancel Reservation</button>
                        </form>
                    </div>
                </div>
                    ';

            } else {

                $this->view_my_rez_html .= '
                    <div class="aez-list aez-list--summary aez-list--completed rez-cancel-call">
                        <h2>' . $message . '</h2>
                    </div>
                </div>';

            }

        } else { 

            if (strtolower($reservation_status) !== "cancelled") {

                $this->view_my_rez_html .= '
                        <div class="aez-list aez-list--summary aez-list--completed rez-cancel-call">
                            <h2>' . $message . '</h2>
                        </div>
                    </div>';

            }

        }   // End If for Display Cancel Reservation

        return $this->view_my_rez_html;

    }
}
