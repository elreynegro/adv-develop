<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_CancelReservationShortcode extends AdvRez_ShortCodeScriptLoader {

    public $cancel_rez_html;
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

         $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        // If reservation is cancelled then display the cancelled message
        $this->cancel_rez_html = '
            <div id="primary">
                <div class="aez-confirmation">
                    <div class="aez-confirmation__heading" style="margin-top: 0 !important;">Your reservation with confirmation number <span class="-green">' . $post_data['confirm_num'] . ' </span> has been canceled!</div>
                    <div class="aez-confirmation-number">
                        <div class="aez-confirmation-number__message">A copy of your cancellation has been sent to your email.</div>
                    </div>
                </div>
            </div>';

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
        $class_code = $_SESSION['my_reservation']['class_code'];
        $car_image_url = $_SESSION['my_reservation']['class_image_url'];
        $intl_locations = $_SESSION['my_reservation']['country'];

    $this->cancel_rez_html .= '<div id="primary">
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
                    $this->cancel_rez_html .= '<img src="wp-content/plugins/advantage-vehicles/assets/XXAR_800x400.png" alt="car picture">';
                } else if((strpos($car_image_url, 'carimages') !== false) || empty($car_image_url) || !isset($car_image_url))  {
                     $this->cancel_rez_html .= '<img src="wp-content/plugins/advantage-vehicles/assets/XXAR_800x400.png" alt="car picture">';
                }
                else {
                     $this->cancel_rez_html .= '<img src="' . $_SESSION['my_reservation']['class_image_url'] . '" alt="car picture">';
                }
                $this->cancel_rez_html .= '</div>
               <div class="aez-vehicle-content aez-complete-selection">
                    <h3>Selected:</h3>
                    <span class="aez-enhance-selection__car-name">' . $_SESSION['my_reservation']['model_desc'] . '</span>
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
                                $this->cancel_rez_html .= '' . $_SESSION['my_reservation']['vendor_name'] .'<br>';
                            }

                            $this->cancel_rez_html .='
                            ' . $_SESSION['my_reservation']['rental_location_street1'] . ' (' . $_SESSION['my_reservation']['rental_location_name'] . ')<br>';

                            if (isset($_SESSION['my_reservation']['rental_location_street2']) && $_SESSION['my_reservation']['rental_location_street2'] !== "") {
                                $this->cancel_rez_html .= ''.$_SESSION['my_reservation']['rental_location_street2'].'<br>';
                            }

                            $this->cancel_rez_html .= '
                            ' . $_SESSION['my_reservation']['rental_location_city'] . ', ';

                            if (isset($_SESSION['my_reservation']['rental_location_state']) && $_SESSION['my_reservation']['rental_location_state'] !== "") {
                                 $this->cancel_rez_html .= '' . $_SESSION['my_reservation']['rental_location_state'] . ' ' . $_SESSION['my_reservation']['rental_location_zip'].'';
                            } else {
                                  $this->cancel_rez_html .= ''. $_SESSION['my_reservation']['rental_location_country'].'';
                            }

                       $this->cancel_rez_html .= '
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Drop Off</h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $_SESSION['my_reservation']['dropoff_month'], $_SESSION['my_reservation']['dropoff_day'], $_SESSION['my_reservation']['dropoff_year'])). ' | ' . strtolower($_SESSION['my_reservation']['dropoff_time']) .'</h5>
                        <p class="aez-info-text">';

                            if ($_SESSION['my_reservation']['api_provider'] == "XRS") {
                                $this->cancel_rez_html .= '' . $_SESSION['my_reservation']['vendor_name'] .'<br>';
                             }

                            $this->cancel_rez_html .= '
                            ' . $_SESSION['my_reservation']['return_location_street1'] . ' (' . $_SESSION['my_reservation']['return_location_name'] . ')<br>';

                             if (isset($_SESSION['my_reservation']['return_location_street2']) && $_SESSION['my_reservation']['return_location_street2'] !== "") {
                                 $this->cancel_rez_html .= ''.$_SESSION['my_reservation']['return_location_street2'].'<br>';
                            }

                             $this->cancel_rez_html .= '
                            ' . $_SESSION['my_reservation']['return_location_city'] . ', ';

                            if (isset($_SESSION['my_reservation']['return_location_state']) && $_SESSION['my_reservation']['return_location_state'] !== "") {
                                 $this->cancel_rez_html .= '' . $_SESSION['my_reservation']['return_location_state'] . ' ' . $_SESSION['my_reservation']['return_location_zip'].'';
                            } else {
                                  $this->cancel_rez_html .= ''. $_SESSION['my_reservation']['return_location_country'].'';
                            }

                         $this->cancel_rez_html .= '

                        </p>
                    </div>
                </div>
            </div> <!-- end aez-info-block-container -->

            <div class="aez-list aez-list--summary aez-list--completed">
                    <h3>Fees &amp; Options</h3>
                    <ul>
                        <div class="list-items total-bottom-border">
                            <li>Vehicle Rental</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['rate_charge'] . '</li>
                        </div>';

                        // If there's a rate discount then show it.
                        if (isset($_SESSION['my_reservation']['TotalPricing']['RateDiscount']) && $_SESSION['my_reservation']['TotalPricing']['RateDiscount'] < 0) {
                            $this->cancel_rez_html .= '
                            <div class="list-items total-bottom-border">
                                <li>Discount</li>
                                <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['TotalPricing']['RateDiscount'] . '</li>
                            </div>';
                        }

                        $this->cancel_rez_html .= '
                        <div class="list-items">
                            <li>Taxes and Fees</li>
                        </div>';

                        // Number of taxes and fees that we need to loop though
                        $number = floor(count($_SESSION['my_reservation']['TotalPricing']['Taxes'])/5);


                        if (is_array($_SESSION['my_reservation']['TotalPricing']['Taxes'])) {
                            // Chunk the response_contents_array and create a new array with 5 elements per indexed array
                            $chunk_array = array_chunk($_SESSION['my_reservation']['TotalPricing']['Taxes'], 5);
                        }

                        // Loop through the taxes and fees and display them
                        for ($x=0; $x < $number; $x++) {
                            $this->cancel_rez_html .= '
                            <div class="list-items taxes-fees">
                                <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                <li class="fee-breakdown">
                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">' . $_SESSION['my_reservation']['currency_symbol'] . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                            </div>';
                        }

                        $this->cancel_rez_html .= '
                         <div class="list-items total-bottom-border">
                            <li>Taxes and Fees Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['total_taxes'] . '</li>
                        </div>';

                    if (isset($_SESSION['my_reservation']['daily_extra'])) {

                        $this->cancel_rez_html .= '
                        <div class="list-items">
                            <li>Extras</li>
                        </div>';

                        // Number of extras
                        $numOptions = count($_SESSION['my_reservation']['daily_extra']);

                        // Loop through the extras
                        for ($x=0; $x < $numOptions; $x++) {

                            $this->cancel_rez_html .= '
                                <div class="list-items">
                                    <li class="fee-breakdown">' .$_SESSION['my_reservation']['daily_extra'][$x]['ExtraDesc'] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $_SESSION['my_reservation']['currency_symbol'] . sprintf('%01.2f', strval($_SESSION['my_reservation']['daily_extra'][$x]['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span></li>
                                </div>';
                        }

                        $this->cancel_rez_html .= '
                        <div class="list-items">
                            <li>Extras Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['total_extras'] . '</li>
                        </div>';

                    } else {
                     $this->cancel_rez_html .= '
                        <div class="list-items">
                            <li>Extras</li>
                        </div>
                         <div class="list-items">
                            <li>Extras Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . '0.00</li>
                        </div>';
                }

                     $this->cancel_rez_html .= '
                        <div class="list-items total">
                            <li>Total</li>
                            <li>' . $_SESSION['my_reservation']['currency_symbol'] . $_SESSION['my_reservation']['TotalPricing']['TotalCharges'] . '</li>
                        </div>
                    </ul>
                </div><!-- end aez-list -->';

                if (count($_SESSION['my_reservation']['card_number']) > 0 ) {
                    $credit_card = $_SESSION['my_reservation']['card_number'];
                } else {
                    $credit_card = "xxxxxxxxxx";
                }

                 // If there's no credit card info don't display the Payment section
                if (!empty($_SESSION['my_reservation']['card_type'])) {

                    $this->cancel_rez_html .= '
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
                     $this->cancel_rez_html .= '
                    <div class="aez-info-block-container">
                        <h3>Payment</h3>
                        <div class="aez-info-block pay-counter">
                            Pay At counter
                        </div>
                    </div> <!-- end aez-info-block-container -->';
                } // End if

  $this->cancel_rez_html .= '
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
                                        $this->cancel_rez_html .= '
                                            Address: ' . $_SESSION['my_reservation']['street_address_1'] . '<br>';
                                        // If the street_address_2 isn't empty then display the content
                                        if (!empty($_SESSION['my_reservation']['street_address_2'])) {
                                            $this->cancel_rez_html .= $_SESSION['my_reservation']['street_address_2']."<br>";
                                        }
                                        if (!empty($_SESSION['my_reservation']['city'])) {
                                            $this->cancel_rez_html .= $_SESSION['my_reservation']['city'] . ', ' . $_SESSION['my_reservation']['state'] . ' ' . $_SESSION['my_reservation']['postal_code'] . ' ' . $_SESSION['my_reservation']['country'];
                                        }
                                    } else {
                                        $this->cancel_rez_html .= 'Email: ' . strtolower($_SESSION['my_reservation']['email_address']);
                                    }

                $this->cancel_rez_html .= '
                                </p>
                            </div>';

                            if (! (isset($_SESSION['adv_login']))) {

                                $this->cancel_rez_html .= '  
                                <div class="aez-info-section">
                                    <h4 class="aez-all-caps -blue">EXPRESSWAY STATUS</h4>
                                    <p class="aez-info-text">
                                        Non-member
                                    </p>
                                    <p>
                                      <a target="_blank" href="expressway/benefits" class="view-reservation-text-link"> When you join the Expressway Program, you get a FREE reward instantly – every time you rent!</a>
                                    </p>
                                    <form action="javascript:void(0);" method="post">
                                        <button type="submit" name="button" class="aez-btn aez-btn--filled-green view-reservation-signup-green-button signup_menu">Sign Up Today!</button>
                                    </form>
                                </div>';

                            } else {

                                $this->cancel_rez_html .= '
                                <div class="aez-info-section">
                                    <div class="aez-info-section__header">
                                        <h4 class="aez-all-caps -blue">EXPRESSWAY STATUS:</h4>
                                    </div>
                                    <p class="aez-info-text">
                                        Advantage Expressway Member
                                    </p>
                                </div>';

                            }

                            // This is used in the Kayak Cancellation Pixel
                            $random_number = rand(100000000, 999999999);

                            // Check if the IATA code is Kayak. If it is then fire off the Kayak Pixel.
                            if (isset($_SESSION['my_reservation']['iata']) && strtolower($_SESSION['my_reservation']['iata']) == 'kayak') {

                                $this->cancel_rez_html .= '
                                    <img src="https://www.kayak.com/s/kayakpixel/cancel/IARAC?confirmation='.$_SESSION['my_reservation']['confirm_num'].'&rand='.$random_number.'"/>';

                            }


                        $this->cancel_rez_html .= '
                        </div>
                    </div> <!-- end aez-info-block-container -->
            </div><!-- end aez-reservation-container -->
        </main>';

    return $this->cancel_rez_html;

    }
}
