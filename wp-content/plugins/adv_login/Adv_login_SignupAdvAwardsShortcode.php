<?php

include_once('Adv_login_ShortCodeScriptLoader.php');

class Adv_login_SignupAdvAwardsShortcode extends Adv_login_ShortCodeScriptLoader {

    public $adv_awards_signup_box_html;
    static $addedAlready = false;
    public $api_url_array;

    /*
     * Load scripts and styles
     */

    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            wp_register_style('remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');
            wp_register_style('pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/css/pikaday.css');
            wp_register_style('select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css');

            $styles = array('remove-margin', 'pikaday', 'select2');
            wp_enqueue_style($styles);

            wp_enqueue_script('adv_login', plugins_url('js/adv_login.js', __FILE__), array('jquery', 'main', 'select2'), '1.0', true);
            wp_enqueue_script('adv_sign_up', plugins_url('js/adv_sign_up.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_script('adv_js_encrypt', plugins_url('js/jsencrypt.min.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_script('adv_accordion_menu', plugins_url('js/adv_accordion_menu.js', __FILE__), array('jquery', 'main'), null, true);
            wp_enqueue_script('ddslick', plugins_url('js/jquery.ddslick.min.js', __FILE__), array('jquery', 'main'), null, true);
            wp_enqueue_script('select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true);
            wp_enqueue_script('moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true);
            wp_enqueue_script('pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true);
            wp_enqueue_script('validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true);
            wp_enqueue_script('mask', get_stylesheet_directory_uri() . '/vendor/jQuery-Mask-Plugin-1.14.0/dist/jquery.mask.min.js', array(), null, true);

            wp_localize_script('adv_login', 'adv_sign_up', 'adv_js_encrypt', 'ADV_Ajax', 'adv_accordion_menu', 'ddslick', 'select2', 'moment', 'pikaday', 'validator', 'mask', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'advlogintNonce' => wp_create_nonce('advlogin-nonce')
                    )
            );
        }
    }

    public function handleShortcode($atts) {

        $member_number = $_SESSION['adv_login']->memberNumber;
        if (isset($member_number)) {
            $URL = "/expressway";
            echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
        }

        $get_data = AEZ_Oauth2_Plugin::clean_user_entered_data("get");

        if (isset($get_data['email']) && $get_data['email'] !== "") {
            $email = trim($get_data['email']);
        } else {
            $email = "";
        }

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $persuade_url = isset($api_url_array['pursuade_url']) ? $api_url_array['pursuade_url'] : 'https://rewardsqa.advantage.com';

        //Get Country list for dropdown
        $this->countries = Adv_login_Helper::getCountries();

        //Get State list for dropdown
        $this->states = Adv_login_Helper::getUSStates();

        //Get Flyer Program
        $this->flyer_program = Adv_login_Helper::getFrequentFlyerPrograms();

        //CC details
        $start_exp_year = (int) date('Y');
        $end_exp_year = (int) date('Y', strtotime('+30 years'));
        $card_exp_dropdown = '';

        for ($year = $start_exp_year; $year <= $end_exp_year; $year++) {
            $option = '<option value="' . $year . '">' . $year . '</option>';
            $card_exp_dropdown .= $option;
        }
        ?>
        <script type="text/javascript">
            (function (d) {
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
            })(function () {
                /********** Begin Custom Code **********/

                _ltk.SCA.CaptureEmail('email');
                /********** End Custom Code **********/
            });
        </script>

        <?php

        $this->adv_awards_signup_box_html = '
        <div id="primary">
            <div class="aez-advantage-awards-banner">
                <div class="aez-awards-img">
                    <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway logo">
                </div>
            </div>

            <div class="aez-sign-up-form">
                <form id="adv-awards-sign-up" action="/" class="aez-form">
                    <span class="-blue aez-all-caps" style="margin-bottom:10px;">Sign Up For <div style="color: #036; display: inline; font-size: 1.2em;">Expressway</div>
                    </span>
                    <div class="aez-form-block">
                    
                    <div class="aez-extra signup_dropdown">
                        <div class="aez-extra-header aez-location-policies-dd">    
                            <h4 class="-dark-blue">MY PROFILE </h4>
                            <i class="fa fa-chevron-up" aria-hidden="true"></i>
                        </div>                        
                        <div id="terms-and-conditions-drop-down" class="aez-extra-content-123" style="display: block;">
                            <!-- User Profile Begins -->
                            <div class="aez-form-item">
                                <label for="first_name" class="aez-form-item__label">First Name<sup>*</sup></label>
                                <input
                                    id="first_name"
                                    type="text"
                                    class="aez-form-item__input"
                                    name="first_name"
                                    pattern="^([^0-9]*)$"
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label>
                                <input
                                    id="last_name"
                                    type="text"
                                    class="aez-form-item__input"
                                    name="last_name"
                                    pattern="^([^0-9]*)$"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="email" class="aez-form-item__label">Email<sup>*</sup></label>
                                <input
                                    id="email"
                                    type="email"
                                    class="aez-form-item__input"
                                    name="email"
                                    placeholder="Email"
                                    value="' . $email . '"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="confirm_email" class="aez-form-item__label">Confirm Email<sup>*</sup></label>
                                <input
                                    id="confirm_email"
                                    type="email"
                                    class="aez-form-item__input"
                                    name="confirm_email"
                                    placeholder="Confirm Email"
                                    value="' . $email . '"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="password" class="aez-form-item__label">Password<sup>*</sup></label>
                                <input
                                    id="password"
                                    type="password"
                                    class="aez-form-item__input"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="confirm_password" class="aez-form-item__label">Confirm Password<sup>*</sup></label>
                                <input
                                    id="confirm_password"
                                    type="password"
                                    class="aez-form-item__input"
                                    name="confirm_password"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="phone_number" class="aez-form-item__label">Phone Number<sup>*</sup></label>
                                <input
                                    id="phone_number"
                                    type="tel"
                                    class="aez-form-item__input"
                                    name="phone_number"
                                    placeholder="Phone Number"
                                    required
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="confirm_phone_number" class="aez-form-item__label">Confirm Phone Number<sup>*</sup></label>
                                <input
                                    id="confirm_phone_number"
                                    type="tel"
                                    class="aez-form-item__input"
                                    name="confirm_phone_number"
                                    placeholder="Confirm Phone Number"
                                    required
                                />
                            </div>

                        <div class="aez-form-item">
                            <label for="dob" class="aez-form-item__label">Date of Birth<sup>*</sup></label>
                            <input
                                id="dob"
                                type="text"
                                class="aez-form-item__input"
                                name="dob"
                                placeholder="MM/DD/YYYY"
                                required
                                pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d"
                            />
                        </div>    
                        <!-- User Profile Ends -->

                        </div>
                        </div>';

        $this->adv_awards_signup_box_html .= '                                                
                    
                    <!-- Location Preferences Begins -->
                        <div class="aez-extra signup_dropdown">
                    <div class="aez-extra-header aez-location-policies-dd">
                        <h4 class="-dark-blue">LOCATION PREFERENCES&nbsp;<font size="2px">(Optional)</font></h4>
                        <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </div>
                    <div class="aez-extra-content-123" style="display:none;"> 
                        
                         <div class="aez-form-item">
                           <!-- <label for="preferred_rental_location" class="aez-form-item__label">Preferred Rental Location</label>
                            <div class="adv-size">
                                <select id="preferred_rental_location" 
                                class="aez-select2-search aez-form-item__dropdown select2-hidden-accessible" 
                                name="preferred_rental_location" 
                                >
                                <option value="">--Select--</option>
                                </select> 
                            </div>-->
                            
                           
                        <input type="search" name="pickupValue" id="pickup_select_dropdown" class="pickup_select_dropdown aez-select2-search aez-form-item__dropdown" placeholder="Rent From" >
                        <input type="hidden" name="preferred_rental_location" class="preferred_rental_location" id="preferred_rental_location_value" value="" />
                       
                        </div>
                        
                        <div class="aez-form-item">
                           <!-- <label for="preferred_dropoff_location" class="aez-form-item__label">Preferred Drop-Off Location</label>
                            <div class="adv-size">
                                    <select id="preferred_dropoff_location" 
                                    class="aez-select2-search aez-form-item__dropdown select2-hidden-accessible" 
                                    name="preferred_dropoff_location" 
                                    >
                                    <option value></option>
                                    </select>
                            </div>
                            -->
                        <input type="search" name="dropoffValue" id="dropoff_select_dropdown" class="dropoff_select_dropdown aez-select2-search aez-form-item__dropdown" placeholder="Return To" >
                        <input type="hidden" name="preferred_dropoff_location" class="preferred_dropoff_location" id="preferred_dropoff_location_value" value="" /> 
                        </div>
                        
                        
                        <div class="aez-form-item">
                            <label for="car_specification" class="aez-form-item__label">Car Class</label>
              
                                <div  class="advpa-car adv-size">
                                <div id="carClassSelector"></div>
                                </div>
                                <input type="hidden" name="car_specification" id="car_specification" />
                            </div>
                        </div>
                        
                        </div>
                        <!-- Location Preferences Ends -->';

        $flyer_program = !empty($this->flyer_program) ? $this->flyer_program : '';

        if (!empty($flyer_program) && $flyer_program[0]['Status'] != 'ERROR') {

            $this->adv_awards_signup_box_html .= '<!-- Frequent Flyer Begins -->
                        <div class="aez-extra signup_dropdown">
                    <div class="aez-extra-header aez-location-policies-dd">
                        <h4 class="-dark-blue">FREQUENT FLYER AIRLINE&nbsp;<font size="2px">(Optional)</font></h4>
                        <i class="fa fa-chevron-down" aria-hidden="true"></i>
                    </div>
                    <div class="aez-extra-content-123" style="display:none;"> 
                        <div class="aez-form-item">
                            <label for="frequent_flyer_airline" class="aez-form-item__label">Frequent Flyer Airline</label>
                            <select id="frequent_flyer_airline" 
                                 class="aez-form-item__dropdown" 
                                     name="frequent_flyer_airline" 
                                     >
                            <option value="">--Select--</option>';

            foreach ($this->flyer_program as $row) {
                $this->adv_awards_signup_box_html .= '<option value="' . $row['AirlineCode'] . '">' . $row['Airline'] . '</option>';
            }

            $this->adv_awards_signup_box_html .= '</select>
                        </div>
                        
                        <div class="aez-form-item">
                            <label for="frequent_flyer_number" class="aez-form-item__label">Frequent Flyer Number</label>
                            <input
                            id="frequent_flyer_number"
                            type="text"
                            class="aez-form-item__input"
                            name="frequent_flyer_number"
                            placeholder="Frequent Flyer Number"
                            disabled
                            />
                        </div>     
                    </div>
                    </div>
                        <!-- Frequent Flyer Ends --> ';
        } else {

            $this->adv_awards_signup_box_html .= ' <div style="display:none;">  <select id="frequent_flyer_airline"  name="frequent_flyer_airline" >
                  <option value="">--Select--</option>
                  </select>
                  <input type="hidden" id="frequent_flyer_number" name="frequent_flyer_number" value=""></div>';
        }
        $publicKey = file_get_contents($_SERVER["DOCUMENT_ROOT"] . '/Payment/data/' . '/public.pem');

        $this->adv_awards_signup_box_html .= ' <!-- Additional Options Begins -->
                        <div class="aez-extra signup_dropdown">
                    <div class="aez-extra-header aez-location-policies-dd">
                        <h4 class="-dark-blue">ADDITIONAL OPTIONS&nbsp;<font size="2px">(Optional)</font></h4>
                        <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </div>
                        <div class="aez-extra-content-123" style="display:none;"> 
                        <span style="text-align: left;">Note: Please note that options availability is not guaranteed and may vary by location.</span>
                        <div class="aez-form-item">
                            <label for="additional_driver" class="aez-form-item__label">Additional Driver</label>
                            
                            <div class="adv-size"> 
                                <div class="advg-radio"><input value="1" type="radio" name="additional_driver" >Yes</div>
                                <div class="advg-radio"><input value="0"  type="radio" name="additional_driver" checked >No</div>
                            </div>
                        </div>
                        <div class="aez-form-item">
                            <label for="child_seat" class="aez-form-item__label">Child Seat</label>
                            <div class="adv-size"> 
                                <div class="advg-radio"><input value="1" type="radio" name="child_seat" >Yes</div>
                                <div class="advg-radio"><input value="0"  type="radio" name="child_seat" checked >No</div>
                            </div>
                        </div>
                        <div class="aez-form-item">
                            <label for="stroller" class="aez-form-item__label">Stroller</label>
                            <div class="adv-size"> 
                                <div class="advg-radio"><input value="1" type="radio" name="stroller" >Yes</div>
                                <div class="advg-radio"><input value="0" type="radio" name="stroller" checked >No</div>
                            </div>
                        </div>  
                        <div class="aez-form-item">
                            <label for="hand_controls_left" class="aez-form-item__label">Hand Controls Left</label>
                            <div class="adv-size"> 
                                <div class="adv-radio"><input value="1" type="radio" name="hand_controls_left">Yes</div>
                                <div class="advg-radio"><input value="0"  type="radio" name="hand_controls_left" checked>No</div>
                            </div>
                        </div>
                        <div class="aez-form-item">
                            <label for="hand_controls_right" class="aez-form-item__label">Hand Controls Right</label>
                            <div class="adv-size"> 
                                <div class="adv-radio"><input value="1" type="radio" name="hand_controls_right">Yes</div>
                                <div class="advg-radio"><input value="0"  type="radio" name="hand_controls_right" checked>No</div>
                            </div>
                        </div>
                        <div class="aez-form-item">
                            <label for="gps" class="aez-form-item__label">GPS/Mobile Technology</label>
                            <div class="adv-size"> 
                                <div class="advg-radio"><input value="1" type="radio" name="gps" >Yes</div>
                                <div class="advg-radio"><input value="0" type="radio" name="gps" checked >No</div>
                            </div>                                              
                        </div>
                        <div class="aez-form-item">
                            <label for="skirack" class="aez-form-item__label">Ski Rack</label>
                            <div class="adv-size"> 
                                <div class="advg-radio"><input value="1" type="radio" name="skirack" >Yes</div>
                                <div class="advg-radio"><input value="0" type="radio" name="skirack" checked >No</div>
                        </div>
                        </div>
                        </div>
                        </div>
                        <!-- Additional Options Ends -->
                        
                        <!-- Payment Preferences Begins -->
                        <div class="aez-extra signup_dropdown">
                    <div class="aez-extra-header aez-location-policies-dd">
                        <h4 class="-dark-blue">PAYMENT PREFERENCES&nbsp;<font size="2px">(Optional)</font></h4>
                        <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </div>
                <div class="aez-extra-content-123" style="display:none;"> 
                        <div class="aez-form-item">
                            <label for="pay_later_total" class="aez-form-item__label">Payment Preferences</label>
                            <div class="adv-size"> 
                                <div class="advpa-radio"><input value="0" type="radio" id="pay_later_total"  name="payment_preferences" checked >Pay at the counter</div>
                                <div class="advg-radio"><input value="1" type="radio" id="pay_now_total" name="payment_preferences" >Pay Online</div>
                          </div>            
                        </div>
                        </div>
                        </div>
                        <!-- Payment Preferences Ends -->

                        <!-- Card Details Begins -->
                        <div class="aez-extra signup_dropdown">
                            <div class="aez-extra-header aez-location-policies-dd">
                            <h4 class="-dark-blue">CARD DETAILS&nbsp;<font size="2px">(Optional)</font></h4>
                            <i class="fa fa-chevron-down" aria-hidden="true"></i>
                            </div>
                            <div class="aez-extra-content-123" style="display:none;"> 
                                <!--<h4>Card Detail</h4>-->
                                <div class="aez-form-item">
                                   <label for="name_on_card_1" class="aez-form-item__label">Name On Card</label>
                                    <input 
                                    id="name_on_card_1" 
                                    type="text" 
                                    class="aez_card_name aez-form-item__input"
                                    name="name_on_card" 
                                    placeholder="Full Name" 
                                    />
                                </div>   
                                <div class="aez-form-item">
                                   <label for="credit_card_1" class="aez-form-item__label">Credit Card Number</label>
                                    <input 
                                    id="credit_card_1" 
                                    type="password" 
                                    class="aez_card_number aez-form-item__input"
                                    name="credit_card" 
                                    placeholder="Credit Card" 
                                    />
                                </div> 
                            <div class="aez-form-block aez-form-card-expiry">    
                            <div class="aez-form-block--side-by-side">
                             <div class="aez-form-item aez-form-item--dropdown">
                                <label for="expiry_month_1" class="expiry_month_dropdown_label aez-form-item__label">Expiration Month</label>
                                <select id="expiry_month_1" 
                                     class="aez_card_month aez-form-item__dropdown expiry_month_dropdown" 
                                         name="expiry_month" 
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
                                <input 
                                    id="card_enc_value_1" 
                                    type="hidden" 
                                    name="card_enc_value" 
                                    />
                            </div> 
                            <div class="aez-form-item">
                                <label for="expiry_year_1" class="aez-form-item__label">Expiration Year</label>
                                <select id="expiry_year_1" 
                                     class="aez_card_year aez-form-item__dropdown expiry_year_dropdown" 
                                         name="expiry_year" 
                                         >
                                    <option value="">&nbsp;</option>
                                    ' . $card_exp_dropdown . '
                                </select>
                            </div>
                            </div>
                            </div>
                            <div style="display:none;" id="more_card_detail_data" class="more_card_detail_data">
                                    <div class="card-section-title">
                                        <div class="aez-form-item--with-btn">
                                            <span class="aez-remove-btn-card"></span>
                                        </div>
                                        <div class="card-more-title-clear">&nbsp;</div>
                                    </div>
                                    <div class="aez-form-item">
                                       <label for="name_on_card" class="aez_card_name_label aez-form-item__label">Name On Card</label>
                                        <input 
                                        id="name_on_card" 
                                        type="text" 
                                        class="aez_card_name aez-form-item__input"
                                        name="name_on_card" 
                                        placeholder="Full Name" 
                                        />
                                    </div>   
                                    <div class="aez-form-item">
                                       <label for="credit_card" class="credit_card_label aez-form-item__label">Credit Card Number</label>
                                        <input 
                                        id="credit_card" 
                                        type="password" 
                                        class="aez_card_number aez-form-item__input"
                                        name="credit_card" 
                                        placeholder="Credit Card" 
                                        />
                                    </div> 
                                <div class="aez-form-block aez-form-card-expiry">    
                                <div class="aez-form-block--side-by-side">
                                    <div class="aez-form-item">
                                    <label for="expiry_month"  class="expiry_month_dropdown_label expiry_month_label aez-form-item__label">Expiration Month</label>
                                    <select id="expiry_month" 
                                         class="aez_card_month aez-form-item__dropdown expiry_month_dropdown1" 
                                             name="expiry_month" 
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
                                </div> 
                                 <div class="aez-form-item">
                                    <label for="expiry_year" class="expiry_year_label aez-form-item__label">Expiration Year</label>
                                    <select id="expiry_year" 
                                         class="aez_card_year aez-form-item__dropdown expiry_year_dropdown1" 
                                             name="expiry_year" 
                                             >
                                        <option value="">&nbsp;</option>
                                        ' . $card_exp_dropdown . '
                                    </select>
                                </div>
                            </div>
                                    <input 
                                    id="card_enc_value" 
                                    type="hidden" 
                                    name="card_enc_value" 
                                    class="card_enc_value"
                                    /> 
                            </div>
                            </div>
                            <div id="more_card_detail_container" class="more_card_detail_data">
                            </div>
                            <!-- Add more button -->
                            <div class="add-more-card-btn-container">
                                <div class="aez-form-item--with-btn">
                                <span class="aez-add-btn-card add_more_card_info"></span>
                                </div>
                                <div class="add-more-text-card add_more_card_info"><a href="javascript:void(0);">Add Another Card</a></div>
                            </div>
                            <!-- Add more button -->
                        </div>
                        </div>
                        <textarea id="pubKey" rows="15" cols="65" style="visibility: hidden; display: none;">' . $publicKey . '</textarea>
                        <!-- Card Details Ends -->

                        <!-- Default Address Begins -->
                
                        <div class="aez-extra signup_dropdown">
                            <div class="aez-extra-header aez-location-policies-dd">
                                <h4 class="-dark-blue">BILLING ADDRESS&nbsp;<font size="2px">(Optional)</font></h4>
                                <i class="fa fa-chevron-down" aria-hidden="true"></i>
                            </div>
                            <div class="aez-extra-content-123" style="display:none;">

                            <!-- ****************** COMMENT OUT THE RENTER ADDRESS ******************
                                <div class="aez-form-item">
                                    <label for="street_address1" class="aez-form-item__label">Street Address<sup>*</sup></label>
                                    <input 
                                    id="street_address1" 
                                    type="text" 
                                    class="aez-form-item__input"
                                    name="street_address1" 
                                    placeholder="Street Address"
                                    required
                                    />
                                </div>
                                <div class="aez-form-item">
                                    <label for="street_address2" class="aez-form-item__label">Street Address</label>
                                    <input 
                                    id="street_address2" 
                                    type="text" 
                                    class="aez-form-item__input" 
                                    name="street_address2" 
                                    placeholder="Street Address 2" 
                                    />
                                </div>
                                <div class="aez-form-item">
                                    <label for="postal_code" class="aez-form-item__label">Postal Code<sup>*</sup></label>
                                    <input 
                                    id="postal_code" 
                                    type="text" 
                                    class="aez-form-item__input" 
                                    name="postal_code" 
                                    placeholder="Postal Code" 
                                    required
                                    />
                                </div>
                                <div class="aez-form-item">
                                    <label for="city" class="aez-form-item__label">City<sup>*</sup></label>
                                    <input 
                                    id="city" 
                                    type="text" 
                                    class="aez-form-item__input" 
                                    name="city" 
                                    placeholder="City" 
                                    required
                                    />
                                </div>
                                <div class="aez-form-item aez-form-item--dropdown">
                                    <label for="state" class="aez-form-item__label">State</label>
                                    <select id="state" 
                                    class="aez-form-item__dropdown" 
                                    name="state" style="width: 68%;" tabindex="-1" >
                                        <option value="">--Select--</option>';
        foreach ($this->states as $key => $state) {
            if ($key != 'status') {
                $this->adv_awards_signup_box_html .= '<option value="' . $key . '">' . $state . '</option>';
            }
        }

        $this->adv_awards_signup_box_html .= '
                                    </select>
                                </div>
                                <div class="aez-form-item">
                                    <label for="country" class="aez-form-item__label">Country</label>
                                    <select id="country" 
                                    class="aez-form-item__dropdown" 
                                    name="country"  style="width: 68%;" tabindex="-1" >
                                    <option value="">--Select--</option>';

        foreach ($this->countries as $key => $country) {
            if ($key != 'status') {
                $this->adv_awards_signup_box_html .= '<option value="' . $key . '">' . $country['name'] . '</option>';
            }
        }

        $this->adv_awards_signup_box_html .= '
                                    </select>
                                 </div>
                            ****************** COMMENT OUT THE RENTER ADDRESS ****************** -->
                        <!-- Default Address Ends -->   
                        
                        <!-- Default Billing Address Begins -->
                                <!--
                                <h4>Billing Address</h4>
                                <div class="aez-form-item--checkbox-cont">
                                    <input id="use_profile_address" type="checkbox" class="aez-form-item__checkbox" name="use_profile_address" checked="" value="1">
                                    <label for="use_profile_address" class="aez-form-item__label">Same As Renter Address Above</label>
                                </div>
                                -->

                                <div class="aez-form-billing-address">
                                    <div class="aez-form-item">
                                        <label for="billing_street_address_1" class="aez-form-item__label">Billing Street Address</label>
                                        <input 
                                        id="billing_street_address_1" 
                                        type="text" 
                                        class="aez-form-item__input"
                                        name="billing_street_address_1"
                                        placeholder="Street Address"
                                        />
                                   </div>
                                    <div class="aez-form-item">
                                        <label for="billing_street_address_2" class="aez-form-item__label">Billing Street Address</label>
                                        <input 
                                        id="billing_street_address_2" 
                                        type="text" 
                                        class="aez-form-item__input" 
                                        name="billing_street_address_2" 
                                        placeholder="Street Address 2" 
                                        />
                                    </div>
                                    <div class="aez-form-item">
                                        <label for="billing_postal_code" class="aez-form-item__label">Billing Postal Code</label>
                                        <input 
                                        id="billing_postal_code" 
                                        type="text" 
                                        class="aez-form-item__input" 
                                        name="billing_postal_code" 
                                        placeholder="Postal Code"
                                        />
                                    </div>
                                    <div class="aez-form-item">
                                        <label for="billing_city" class="aez-form-item__label">Billing City</label>
                                        <input 
                                        id="billing_city" 
                                        type="text" 
                                        class="aez-form-item__input" 
                                        name="billing_city" 
                                        placeholder="City"
                                        />
                                    </div>
                                    <div class="aez-form-item">
                                        <label for="billing_state" class="aez-form-item__label">State</label>
                                    <select id="billing_state" 
                                    class="aez-form-item__dropdown" 
                                    name="billing_state" style="width: 68%;" tabindex="-1">
                                        <option value="">--Select--</option>';
        foreach ($this->states as $key => $state) {
            if ($key != 'status') {
                $this->adv_awards_signup_box_html .= '<option value="' . $key . '">' . $state . '</option>';
            }
        }

        $this->adv_awards_signup_box_html .= '
                                        </select>
                                    </div>
                                    <div class="aez-form-item">
                                        <label for="billing_country" class="aez-form-item__label">Country</label>
                                        <select id="billing_country" 
                                        class="aez-form-item__dropdown" 
                                        name="billing_country" style="width: 68%;" tabindex="-1" >
                                            <option value="">--Select--</option>';
        foreach ($this->countries as $key => $country) {
            if ($key != 'status') {
                $this->adv_awards_signup_box_html .= '<option value="' . $key . '">' . $country['name'] . '</option>';
            }
        }

        $this->adv_awards_signup_box_html .= '
                                        </select>
                                    </div>
                                </div>
                            </div>
                        <!-- Default Billing Address Ends -->
                        <div> &nbsp; </div>
                            <div class="aez-form-item--checkbox-cont">
                             <input
                               id="EmailOptIn"
                               type="checkbox"
                               class="aez-form-item__checkbox"
                               name="EmailOptIn"
                                value="1"
                                checked                           />
                           <label for="EmailOptIn" class="aez-form-item__label">Receive exclusive members-only offers and specials via email</label>
                       </div> 
                        <div class="aez-form-item--checkbox-cont">
                             <input
                               id="SMSOptIn"
                               type="checkbox"
                               class="aez-form-item__checkbox"
                               name="SMSOptIn"
                               value="1"     
                               checked
                           />
                           <label for="SMSOptIn" class="aez-form-item__label">Receive exclusive members-only offers and specials via text messaging</label>
                       </div> 
                        <div class="aez-form-item--checkbox-cont" style="width: 100%;">
                            <input
                                id="read_location_policy"
                                type="checkbox"
                                class="aez-form-item__checkbox"
                                name="read_location_policy"
                            />
                            <label for="read_location_policy" class="aez-form-item__label">I agree with the <a href="/terms-and-conditions-expressway/" class="-green" target=_blank>Terms and Conditions</a> of the Expressway Loyalty Program *</label>
                            </div>
                            <div class="aez-terms-submit-block">
                            <button type="submit" class="aez-btn aez-btn--filled-green">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Advantage Awards -->
            <div class="aez-checklist-image -awards">
                <div class="aez-check-image">
                    <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
                    <div class="aez-sub-info">
                        <h3 class="-dark-blue">Expressway Program</h3>
                        <h4 class="-green">For Business &amp; Leisure Travelers</h4>
                    </div>

                    <!-- Checklist -->
                    <div class="aez-checklist">
                        <div class="aez-check-block">
                            <i class="fa fa-check"></i>
                            <div>
                                <h3>Free Upgrade</h3>
                                <p>Earn a free class upgrade for an upcoming rental period!</p>
                            </div>
                        </div>
                        <div class="aez-check-block">
                            <i class="fa fa-check"></i>
                            <div>
                                <h3>Free Day</h3>
                                <p>Earn a free day for an upcoming rental period!</p>
                            </div>
                        </div>
                        <div class="aez-check-block">
                            <i class="fa fa-check"></i>
                            <div>
                                <h3>Free Weekend</h3>
                                <p>Earn a free weekend for an upcoming rental period!</p>
                            </div>
                        </div>
                    </div> <!-- End Checklist -->

                    <div>
                        <span class="-dark-blue">Expressway Program</span>
                        <a class="aez-btn aez-btn--outline-blue" href="' . $persuade_url . '">Learn More</a>
                    </div>
                </div>
            </div> <!-- End Advantage Awards -->


            <div class="aez-learn aez-learn-bgcolor">
                <div>
                    <h2 class="aez-learn-h2">Not The Right Program For You?</h2>
                    <p class="aez-multiple-loyalty">Advantage has multiple loyalty programs to choose from.</p>
                    <p class="aez-more-info-bold">Find answers to common questions in <a ui-sref="faq" class="-green" href="/faq">Frequently Asked
                Questions</a>.</p>
                </div>

                <div class="aez-learn-block">
                    <a href="/book-friendly/">
                        <img src="/wp-content/themes/twentysixteen-child/assets/logo-advantage-book-friendly.png" alt="Illustration of a Globe with Advantage Book Friendly." />
                    </a>
                    <h3 class="aez-multiple-loyalty">
                        For Travel Agents & Tour Operations
                    </h3>
                    <a href="/book-friendly/" class="aez-btn aez-btn--outline-blue">Learn More</a>
                </div>

                <div class="aez-learn-block">
                    <a href="/corporate-advantage">
                        <img src="/wp-content/themes/twentysixteen-child/assets/logo-corporate-advantage.png" alt="Illustration of an arrow" />
                    </a>
                    <h3 class="aez-multiple-loyalty">
                        For Business & Corporate Travelers
                    </h3>
                    <a href="/corporate-advantage" class="aez-btn aez-btn--outline-blue">Learn More</a>
                </div>
            </div>
        </div>';

        return $this->adv_awards_signup_box_html;
    }

}
