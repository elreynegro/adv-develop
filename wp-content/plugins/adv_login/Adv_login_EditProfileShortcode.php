<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_EditProfileShortcode extends Adv_login_ShortCodeScriptLoader {

    // public $login_box_html;
    static $addedAlready = false;
    public $aez_user;
    public $profile_data;
    public $profile_html;
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            
            wp_register_style( 'remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');
            wp_register_style( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/css/pikaday.css' );
            wp_register_style( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css' );

            $styles = array('remove-margin','pikaday','select2');
            wp_enqueue_style($styles); 
            
            wp_enqueue_script('adv_login', plugins_url('js/adv_login.js', __FILE__), array('jquery', 'main', 'select2'), '1.0', true);
            wp_enqueue_script('adv_edit_profile', plugins_url('js/adv_edit_profile.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_script('adv_js_encrypt', plugins_url('js/jsencrypt.min.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_script( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
            wp_enqueue_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
            wp_enqueue_script( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
            wp_enqueue_script( 'validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true );
            wp_enqueue_script( 'adv_accordion_menu', plugins_url('js/adv_accordion_menu.js', __FILE__), array('jquery', 'main'), null, true);
            wp_enqueue_script( 'ddslick', plugins_url('js/jquery.ddslick.min.js', __FILE__), array('jquery', 'main'), null, true); 
            
            wp_localize_script( 'adv_login', 'ADV_Ajax', 'adv_edit_profile', 'adv_js_encrypt' ,'select2', 'moment', 'pikaday', 'validator', 'mask', 'adv_accordion_menu', 'ddslick', array(
                'ajaxurl'   => admin_url( 'admin-ajax.php' ),
                'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
                )
            );
        }
    }
    public function handleShortcode($atts) {

        // Check if the user is logged in. If not then redirect them to the home page.

        if (!isset($_SESSION['adv_login']->memberNumber)) {
            echo '<script type="text/javascript">
                       window.location = "/"
                  </script>';
            die();
        }


        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        
        $this->profile_data = Adv_login_Helper::getAdvFullUser();
        // error_log('  handleShortcode  Login    -     $this->profile_data: ' . print_r($this->profile_data, true));

        $dob = (strtotime($this->profile_data['DOB']) != '')?date('m/d/Y', strtotime($this->profile_data['DOB'])):'';

        //Get location name by location ids
        $location_arr = json_decode($_SESSION["ActiveBookingLocations"]);

        
        $renter_location_id = $this->profile_data['PreferredRentalLocationCode'];
        $dropoff_location_id = $this->profile_data['PreferredDropoffLocationCode'];
        
        $rkey = $dkey = '';
        foreach($location_arr as $key => $val){
            if ($val->C === $renter_location_id) {
                $rkey= $key;
            }
            if ($val->C === $dropoff_location_id) {
                $dkey= $key;
            }
        }

        if (!isset($r_arr)) {
            $r_arr = new stdClass();
        }
        
        if (!isset($d_arr)) {
            $d_arr = new stdClass();
        }

        $r_arr = $location_arr[$rkey];
        $d_arr = $location_arr[$dkey];
        
        if(!empty($r_arr->L)){
            $explode_pickup_location = explode(';',$r_arr->L);
        }
        if(!empty($d_arr->L)){
            $explode_dropoff_location = explode(';',$d_arr->L);
        }
        
        $r_arr->L = !empty($explode_pickup_location) ? $explode_pickup_location[0] : $r_arr->L;
        $d_arr->L = !empty($explode_dropoff_location) ? $explode_dropoff_location[0] : $d_arr->L;     
        
    
       // $billing_add_style = ($this->profile_data['IsDefaultBillingAddress'] == 0)?'display:block;':'display:none;"';
        $billing_add_style = 'display:block;';
        //print_r($this->profile_data);

        //Get Country list for dropdown
        $this->countries = Adv_login_Helper::getCountries();
        
        //Get State list for dropdown
        $this->states = Adv_login_Helper::getUSStates();
        
        //Get Flyer Program
        $this->flyer_program = Adv_login_Helper::getFrequentFlyerPrograms();
        
        //Get Car classes
        $car_class_arr = array();
         $car_class_string = json_encode($car_class_arr);
        if($renter_location_id != '') {
            
            $get_car_classes = Adv_login_Helper::getCarClasses($renter_location_id);
                   
            $car_class_arr[] = array('text'=> "--NONE--",
                                         'value'=> '',
                                         'selected'=> false,
                                         'description'=> "&nbsp;",
                                         'imageSrc'=> ""
                                        );            
            foreach($get_car_classes as $row) {
         
                $sel = ($this->profile_data['CarSpecification'] == $row['ClassCode'])?true:false;
                $car_class_arr[] = array('text'=> $row['ClassCode'],
                                         'value'=> $row['ClassCode'],
                                         'selected'=> $sel,
                                         'description'=> $row['ClassDesc'],
                                         'imageSrc'=> $row['ClassImageURL']
                                        );
            }
            $car_class_string = json_encode($car_class_arr);
            
        }
        
        echo '<script>var carClassData = '.$car_class_string.';</script>';        
        
        $pro_option = $this->profile_data['AdditionalOption'];
        
        $add_option = explode(",", $pro_option);
      
        $add_option_arr = array();
        if(is_array($add_option)) {
            foreach($add_option as $val){
                $add_option_arr[$val] = 1;
            }
        }
        
        $add_option = $add_option_arr;
        
        $this->profile_data['AdditionalDriver'] = isset($add_option['ADDDR'])?1:0;
        $this->profile_data['GPS'] = isset($add_option['GPS'])?1:0;
        $this->profile_data['SKIRACK'] = isset($add_option['SKIRACK'])?1:0; 
        $this->profile_data['hand_controls_right'] = isset($add_option['HCR'])?1:0;
        $this->profile_data['hand_controls_left'] = isset($add_option['HCL'])?1:0;
        $this->profile_data['Stroller'] = isset($add_option['STRO'])?1:0;
        $this->profile_data['ChildSeat'] = isset($add_option['CHILDSEAT'])?1:0; 
        $this->profile_data['MTECH'] = isset($add_option['MTECH'])?1:0;
        
        //CC details begins
        $start_exp_year = (int)date('Y');
        $end_exp_year = (int)date('Y', strtotime('+30 years'));
        $card_exp_dropdown = '';

        for ($year = $start_exp_year; $year <= $end_exp_year; $year++) {
            $option = '<option value="' . $year . '">' . $year . '</option>';
            $card_exp_dropdown .= $option;
        }       
        
        $this->cc_details = Adv_login_Helper::getUserCCDetails();
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
})(function() { 
    /********** Begin Custom Code **********/ 

    _ltk.SCA.CaptureEmail('email');
    /********** End Custom Code **********/ 
});
</script>

<?php   
    
        $this->profile_html = '<div id="profile_updated" data-update_profile="<?php echo $go_to_profile; ?>" data-go_to_profile="<?php echo $go_to_profile; ?>"></div>
        <div id="primary">

<div class="aez-advantage-awards-banner">
    <div class="aez-awards-img">
        <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway logo">
    </div>
</div>';
    
    /********************** Profile information display start ************************************/
        
        // if (strlen($this->profile_data['AddressLine1'] . $this->profile_data['City'] . $this->profile_data['City']  . $this->profile_data['State'] . $this->profile_data['PostalCode']) == 0 ) {
        //     $display_address = 'Click "Edit Profile" to add your information';
        // } else {
        //     $display_address = $this->profile_data['AddressLine1'] ;
        //     if (strlen($this->profile_data['AddressLine2']) > 0) {
        //         $display_address .= '<br>' . $this->profile_data['AddressLine2'];
        //     }
        //     $display_address .= '<br>' . $this->profile_data['City'] . ', '  . $this->profile_data['State'] . ' ' . $this->profile_data['PostalCode'];
        // }

         if (strlen($this->profile_data['BAddressLine1'] . $this->profile_data['BCity'] . $this->profile_data['BState'] . $this->profile_data['BPostalCode']) == 0 ) {
            $display_address = 'Click "Edit Profile" to add your information';
        } else {
            $display_address = $this->profile_data['BAddressLine1'] ;
            if (strlen($this->profile_data['BAddressLine2']) > 0) {
                $display_address .= '<br>' . $this->profile_data['BAddressLine2'];
            }
            $display_address .= '<br>' . $this->profile_data['BCity'] . ', '  . $this->profile_data['BState'] . ' ' . $this->profile_data['BPostalCode'];
        }
        
        $display_phone = '<p></p>';
        if (strlen($this->profile_data['MobileNumber']) > 0) {
            $display_phone = '<p class="aez-info-text aez-phone-info">' . $this->profile_data['MobileNumber'] . '</p>';
        }
        
        $this->profile_html .= '<div class="aez-view-awards">
            <p>Click the button below to view or redeem existing Advantage Expressway.</p>';
        
        $this->profile_html .= '  
                <form action="' . $api_url_array['pursuade_url'] . '" method="post">
                    <input type="hidden" name="membernumber" value="' . (isset($this->profile_data['loyalty_membernumber']) ? $this->profile_data['loyalty_membernumber'] : '') . '">
                    <input type="hidden" name="id" value="' . (isset($this->profile_data['loyalty_id']) ? $this->profile_data['loyalty_id'] : '') . '">
                    <input type="hidden" name="hash" value="' . (isset($this->profile_data['loyalty_hash']) ? $this->profile_data['loyalty_hash'] : '') . '">
                    <input style="background-color: transparent; font-weight: 400; font-size: 1em;" type="submit" value="Advantage Expressway">
                    <button class="aez-btn aez-btn--filled-green profile-view-awards">View Your Expressway</button>
                </form>';
        
        $this->profile_html .= '
            </div>

            <div class="aez-info-block-container aez-profile-container aez-profile-display-container">
              <div class="aez-profile-container-main-block">
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Member Profile:</h4>
                        <h5 class="aez-profile-name">' . $this->profile_data['FirstName'] . ' ' . $this->profile_data['LastName'] . '</h5>
                        <p class="aez-info-text aez-email-info">' . $this->profile_data['email'] . '</p>
                        ' . $display_phone . '
                    </div>

                    <div class="aez-info-section aez-info-section-r">
                        <h4 class="aez-all-caps -blue">Billing Address:</h4>
                        <p class="aez-info-text">' . $display_address . '</p>
                    </div>

                </div>
                <button class="aez-btn aez-btn--outline-blue toggle-show-edit-profile">Edit Profile</button>
                </div>
            </div> <!-- end aez-info-block-container -->
            </div> <!-- end primary -->
            ';



    /********************** Profile information display end ************************************/

    $this->profile_html .= '<div class="profile-edit-part-dropdowm" style="display:none;"><div class="aez-advantage-awards-header">
        <h3 class="aez-advantage-awards-header__title">Edit Profile</h3>
    </div>
    <div class="aez-form-block">
    <form id="update_loyalty_profile" action="/profile" method="POST" class="aez-edit-profile-form">
        <input type="hidden" name="profile_form" value="edit_profile" />
        <input type="hidden" name="memberNumber" value="' . $this->profile_data['memberNumber'] . '" />
        
        
            
        <div class="aez-extra signup_dropdown">
        
        <div class="aez-extra-header aez-location-policies-dd">    
            <h4 class="-dark-blue">MY PROFILE</h4>
            <i class="fa fa-chevron-up" aria-hidden="true"></i>

        </div>    
        
        <div id="terms-and-conditions-drop-down" class="aez-extra-content-123" style="display: block;"> 
        <div class="aez-form-item">
            <label for="first_name" class="aez-form-item__label">First Name<sup>*</sup></label>
            <input
                id="first_name"
                type="text"
                class="aez-form-item__input"
                name="first_name"
                placeholder="First Name"
                pattern="[A-Za-z\\s]*"
                value="' . $this->profile_data['FirstName'] . '"
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
                pattern="[A-Za-z\\s]*"
                placeholder="Last Name"
                value="' . $this->profile_data['LastName'] . '"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="phone" class="aez-form-item__label">Phone Number<sup>*</sup></label>
            <input
                id="phone"
                type="tel"
                class="aez-form-item__input"
                name="phone"
                placeholder="Phone Number"
                value="' . $this->profile_data['MobileNumber'] . '"
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
                value="' . $this->profile_data['email'] . '"
                required disabled="disabled"
            />
        </div>

        <!-- User Profile Begins -->
        <div class="aez-form-item">
            <label for="dob" class="aez-form-item__label">Date of Birth<sup>*</sup></label>
            <input
                id="dob"
                type="text"
                class="aez-form-item__input"
                name="dob"
                placeholder="MM/DD/YYYY"
                pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d"
                value="'.$dob.'" 
                required   
            />
        </div>    
        <!-- User Profile Ends -->

        </div>
        </div>';

        $this->profile_html .='

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
                    <option selected value="'.$this->profile_data['PreferredRentalLocationCode'].'">'.$renter_location_name.'</option>
                    </select> 
                </div> -->
                <input type="search" name="pickupValue" id="pickup_select_dropdown" class="pickup_select_dropdown aez-select2-search aez-form-item__dropdown" placeholder="Rent From" value="'. trim($r_arr->L,';').'" >
                <input type="hidden" name="preferred_rental_location" class="preferred_rental_location" id="preferred_rental_location" value="'.$r_arr->C.'" />  
                                               
            </div>

            <div class="aez-form-item">
                <!-- <label for="preferred_dropoff_location" class="aez-form-item__label">Preferred Drop-Off Location</label>
                <div class="adv-size">
                        <select id="preferred_dropoff_location" 
                        class="aez-select2-search aez-form-item__dropdown select2-hidden-accessible" 
                        name="preferred_dropoff_location" 
                        >
                        <option value="">--Select--</option>
                        <option selected value="'.$this->profile_data['PreferredDropoffLocationCode'].'">'.$dropoff_location_name.'</option>
                        </select> 
                </div> -->
                <input type="search" name="dropoffValue" id="dropoff_select_dropdown" class="dropoff_select_dropdown aez-select2-search aez-form-item__dropdown" placeholder="Return To" value="'. trim($d_arr->L,';').'">
                <input type="hidden" name="preferred_dropoff_location" class="preferred_dropoff_location" id="preferred_dropoff_location" value="'.$d_arr->C.'" />
                                                
            </div>

            <div class="aez-form-item">
                <label for="first_name" class="aez-form-item__label">Car Class</label>
                    <div  class="advpa-car adv-size">
                    <div id="carClassSelector"></div>
                    </div>
                    <input type="hidden" name="car_specification" id="car_specification" />
                    <input type="hidden" name="car_specification_val" id="car_specification_val" value="'.$this->profile_data['CarSpecification'].'" />
                </div>
            </div>
            </div>
            <!-- Location Preferences Ends -->';
          $flyer_program = !empty($this->flyer_program) ? $this->flyer_program :'';

          if(!empty($flyer_program) && $flyer_program[0]['Status'] != 'ERROR' ) {

        $this->profile_html .= '<!-- Frequent Flyer Begins -->
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

                foreach($this->flyer_program as $row) {
                    $sel = ($row['AirlineCode'] == $this->profile_data['FrequentFlyerAirline'])?'selected':'';
                    $this->profile_html .= '<option '.$sel.' value="'.$row['AirlineCode'].'">'.$row['Airline'].'</option>';
                }
                
            $fr_disabled = ($this->profile_data["FrequentFlyerNumber"] == "")?"disabled":"";    
            $this->profile_html .= '</select>
        </div>

        <div class="aez-form-item">
            <label for="frequent_flyer_number" class="aez-form-item__label">Frequent Flyer Number</label>
            <input
            id="frequent_flyer_number"
            type="text"
            class="aez-form-item__input"
            name="frequent_flyer_number"
            placeholder="Frequent Flyer Number"
            value="'.$this->profile_data['FrequentFlyerNumber'].'" 
            '.$fr_disabled.'
            />
        </div>     
    </div>
    </div>
        <!-- Frequent Flyer Ends --> ';

        }else{
                                                
            $this->profile_html.= ' <div style="display:none;">  <select id="frequent_flyer_airline"  name="frequent_flyer_airline" >
                                          <option value="'.$this->profile_data['FrequentFlyerAirline'].'" selected></option>
                                          </select>
                                          <input type="hidden" id="frequent_flyer_number" name="frequent_flyer_number" value="'.$this->profile_data['FrequentFlyerNumber'].'"></div>';                              
                                                
                                            }   
                                            
                       
        $yes_gps = $no_gps = '';
        if($this->profile_data['GPS']==1 || $this->profile_data['MTECH']==1) {
            $yes_gps = 'checked';
        } else if($this->profile_data['GPS']==0 || $this->profile_data['MTECH']==0) {
             $no_gps = 'checked';
        }
                                               
       $this->profile_html.= '     <!-- Additional Options Begins -->
            <div class="aez-extra signup_dropdown">
                <div class="aez-extra-header aez-location-policies-dd">
                    <h4 class="-dark-blue">ADDITIONAL OPTIONS&nbsp;<font size="2px">(Optional)</font></h4>
                    <i class="fa fa-chevron-down" aria-hidden="true"></i>
                </div>
            <div class="aez-extra-content-123" style="display:none;"> 
            <span>Note: Please note that options availability is not guaranteed and may vary by location.</span>
            <div class="aez-form-item">
                <label for="additional_driver" class="aez-form-item__label">Additional Driver</label>

                <div class="adv-size"> 
                    <div class="advg-radio"><input '.($this->profile_data['AdditionalDriver']==1?'checked':'').' value="1" type="radio" name="additional_driver" >Yes</div>
                    <div class="advg-radio"><input '.($this->profile_data['AdditionalDriver']==0?'checked':'').' value="0"  type="radio" name="additional_driver" >No</div>
                </div>
            </div>
            <div class="aez-form-item">
                <label for="child_seat" class="aez-form-item__label">Child Seat</label>
                <div class="adv-size"> 
                    <div class="advg-radio"><input '.($this->profile_data['ChildSeat']==1?'checked':'').' value="1" type="radio" name="child_seat" >Yes</div>
                    <div class="advg-radio"><input '.($this->profile_data['ChildSeat']==0?'checked':'').' value="0"  type="radio" name="child_seat" >No</div>
                </div>
            </div>
            <div class="aez-form-item">
                <label for="stroller" class="aez-form-item__label">Stroller</label>
                <div class="adv-size"> 
                    <div class="advg-radio"><input '.($this->profile_data['Stroller']==1?'checked':'').' value="1" type="radio" name="stroller" >Yes</div>
                    <div class="advg-radio"><input '.($this->profile_data['Stroller']==0?'checked':'').' value="0" type="radio" name="stroller" >No</div>
                </div>
            </div>  
            <div class="aez-form-item">
                <label for="hand_controls" class="aez-form-item__label">Hand Controls Left</label>
                <div class="adv-size"> 
                    <div class="adv-radio"><input '.($this->profile_data['hand_controls_left']==1?'checked':'').' value="1" type="radio" name="hand_controls_left">Yes</div>
                    <div class="advg-radio"><input '.($this->profile_data['hand_controls_left']==0?'checked':'').' value="0"  type="radio" name="hand_controls_left">No</div>
                </div>
            </div>
             <div class="aez-form-item">
                <label for="hand_controls" class="aez-form-item__label">Hand Controls Right</label>
                <div class="adv-size"> 
                    <div class="adv-radio"><input '.($this->profile_data['hand_controls_right']==1?'checked':'').' value="1" type="radio" name="hand_controls_right">Yes</div>
                    <div class="advg-radio"><input '.($this->profile_data['hand_controls_right']==0?'checked':'').' value="0"  type="radio" name="hand_controls_right">No</div>
                </div>
            </div>
            <div class="aez-form-item">
                <label for="gps" class="aez-form-item__label">GPS/Mobile Technology</label>
                <div class="adv-size"> 
                    <div class="advg-radio"><input '.$yes_gps.' value="1" type="radio" name="gps" >Yes</div>
                    <div class="advg-radio"><input '.$no_gps.' value="0" type="radio" name="gps"  >No</div>
                </div>                                              
            </div>
            <div class="aez-form-item">
                <label for="skirack" class="aez-form-item__label">Ski Rack</label>
                <div class="adv-size"> 
                    <div class="advg-radio"><input '.($this->profile_data['SKIRACK']==1?'checked':'').' value="1" type="radio" name="skirack" >Yes</div>
                    <div class="advg-radio"><input '.($this->profile_data['SKIRACK']==0?'checked':'').' value="0" type="radio" name="skirack"  >No</div>
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
                <label for="payment_preferences" class="aez-form-item__label">Payment Preferences</label>
                <div class="adv-size"> 
                    <div class="advpa-radio"><input '.($this->profile_data['PaymentPreference']==0?'checked':'').' value="0" type="radio" id="pay_later_total" name="payment_preferences"  >Pay at the counter</div>
                    <div class="advg-radio"><input '.($this->profile_data['PaymentPreference']==1?'checked':'').' value="1" type="radio" id="pay_now_total" name="payment_preferences" >Pay Online</div>
              </div>            
            </div>
            </div>
            </div>
            <!-- Payment Preferences Ends -->';

            $publicKey = file_get_contents($_SERVER["DOCUMENT_ROOT"] . '/Payment/data/' . '/public.pem');

            $this->profile_html .= '
            <!-- Card Details Begins -->
            <div class="aez-extra signup_dropdown">
                <div class="aez-extra-header aez-location-policies-dd">
                <h4 class="-dark-blue">CARD DETAILS&nbsp;<font size="2px">(Optional)</font></h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
                </div>
                <div class="aez-extra-content-123" style="display:none;">
            
                                                <textarea id="pubKey" rows="15" cols="65" style="visibility: hidden; display: none;">' . $publicKey . '</textarea> ';
                                                        
            if(!isset($this->cc_details['d']['0']['CardHoldersName'])) {
        $this->profile_html .= '        
                    <!--<h4>Card Detail</h4>-->
                    <div class="aez-form-item">
                       <label for="name_on_card_1" class="aez-form-item__label">Name On Card</label>
                        <input 
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
                        <label for="expiry_month_1"  class="expiry_month_dropdown_label aez-form-item__label">Expiration Month</label>
                        <select id="expiry_month_1" 
                             class="aez_card_month aez-form-item__dropdown aez_card_month_first" 
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
                            class="card_enc_value"
                            />  
                    </div> 
                     <div class="aez-form-item">
                        <label for="expiry_year_1" class="aez-form-item__label">Expiration Year</label>
                        <select id="expiry_year_1" 
                             class="aez_card_year aez-form-item__dropdown aez_card_year_first aez_card_year_edit" 
                                 name="expiry_year" 
                                 >
                            <option value="">&nbsp;</option>
                            ' . $card_exp_dropdown . '
                        </select>
                    </div>
                </div>
                </div>
                ';
            }
                    $card_add_more_display = 'display:block;';
                    if(isset($this->cc_details['d']['0']['CardHoldersName'])) {
                        if(count($this->cc_details['d']) >=2 ) { 
                            $card_add_more_display = 'display:none;';
                        }
                        foreach($this->cc_details['d'] as $key=> $cc) {
                            $card_exp_dropdown_pre = '';
                            $card_expiry = explode(" ", $cc['ExpirationDate']);
                            list($c_month, $c_date, $c_year) = explode("/", $card_expiry[0]);

                            for ($year = $start_exp_year; $year <= $end_exp_year; $year++) {
                                $sel = ($year == $c_year)?'selected="selected"':'';
                                $option = '<option '.$sel.' value="' . $year . '">' . $year . '</option>';
                                $card_exp_dropdown_pre .= $option;
                            }          
                            
                            $this->profile_html .= '    
                            <div class="more_card_detail_data cc_pre_container" id="cc_pre_container_'.$key.'">    
                            <div class="card-section-title">
                                <div class="aez-form-item--with-btn">
                                    <span data-id="'.$key.'" data-token="'.$cc['CardTokenID'].'" id="aez_remove_btn_card_'.$key.'" class="aez-delete-btn-card aez-remove-btn-card">&nbsp;</span>
                                </div>
                                <div class="card-more-title-clear">&nbsp;</div>
                            </div>
                            <div class="aez-form-item">
                               <label class="aez-form-item__label">Name On Card</label>
                                <input 
                                type="text" 
                                class="aez-form-item__input"
                                value="'.$cc['CardHoldersName'].'"
                                disabled
                                />
                            </div>   
                            <div class="aez-form-item">
                               <label class="aez-form-item__label">Credit Card Number</label>
                                <input 
                                type="text" 
                                class="aez-form-item__input"
                                value="XXXX XXXX XXXX '.$cc['LastFour'].'"
                                disabled
                                />
                            </div> 
                        <div class="aez-form-block aez-form-card-expiry">    
                        <div class="aez-form-block--side-by-side">
                           
                            <div class="aez-form-item aez-form-item--dropdown">
                                <label class="expiry_month_dropdown_label aez-form-item__label expir">Expiration Month</label>
                                <select data-id="'.$key.'" data-tokenid="'.$cc['CardTokenID'].'" class="aez-form-item__dropdown expiry_month_dropdown" 
                                         name="cc_card_update_month"  
                                         >
                                    <!--<option value="">&nbsp;</option>-->
                                    <option value="01" '.(($c_month == 1)?"selected":"").' >January</option>
                                    <option value="02" '.(($c_month == 2)?"selected":"").'>February</option>
                                    <option value="03" '.(($c_month == 3)?"selected":"").'>March</option>
                                    <option value="04" '.(($c_month == 4)?"selected":"").'>April</option>
                                    <option value="05" '.(($c_month == 5)?"selected":"").'>May</option>
                                    <option value="06" '.(($c_month == 6)?"selected":"").'>Jun</option>
                                    <option value="07" '.(($c_month == 7)?"selected":"").'>July</option>
                                    <option value="08" '.(($c_month == 8)?"selected":"").'>August</option>
                                    <option value="09" '.(($c_month == 9)?"selected":"").'>September</option>
                                    <option value="10" '.(($c_month == 10)?"selected":"").'>October</option>
                                    <option value="11" '.(($c_month == 11)?"selected":"").'>November</option>
                                    <option value="12" '.(($c_month == 12)?"selected":"").'>December</option>
                                </select>
                                <input  type="hidden" name="cc_card_update_id" id="cc_card_update_'.$key.'" />
                            </div>
                            <div class="aez-form-item">
                                <label class="aez-form-item__label">Expiration Year</label>
                                <select data-id="'.$key.'" data-tokenid="'.$cc['CardTokenID'].'" class="aez_card_year_edit aez-form-item__dropdown expiry_year_dropdown" 
                                         name="cc_card_update_year" 
                                         >
                                    <!--<option value="">&nbsp;</option>-->
                                    ' . $card_exp_dropdown_pre . '

                                    </select>
                            </div>
                            </div>
                            </div>
                        </div>
                        ';
                }
            }
    
        $this->profile_html .= '
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
                           <label for="expiry_month" class="expiry_month_dropdown_label expiry_month_label aez-form-item__label expir">Expiration Month</label>
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
                                 class="aez_card_year aez-form-item__dropdown expiry_year_dropdown1 aez_card_year_edit" 
                                     name="expiry_year" 
                                     >
                                <option value="">&nbsp;</option>
                                ' . $card_exp_dropdown . '
                            </select>
                        </div>
                        <input 
                            id="card_enc_value" 
                            type="hidden" 
                            name="card_enc_value" 
                            class="card_enc_value"
                            />  
                        </div>
                        </div>
                </div>
                <div id="more_card_detail_container">
                </div>
                <!-- Add more button -->
                <div style='.$card_add_more_display.' class="add-more-card-btn-container">
                    <div class="aez-form-item--with-btn">
                    <span class="add_more_card_info aez-add-btn-card"></span>
                    </div>
                    <div class="add-more-text-card add_more_card_info"><a href="javascript:void(0);">Add Another Card</a></div>
                </div>
                <!-- Add more button -->
            </div>
            </div>
            <!-- Card Details Ends -->';
        
        $this->profile_html .= '
        <div class="aez-extra signup_dropdown">
    
            <div class="aez-extra-header aez-location-policies-dd">
                <h4 class="-dark-blue">BILLING ADDRESS&nbsp;<font size="2px">(Optional)</font></h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>


            <div class="aez-extra-content-123" style="display:none;">

            <!-- ********** THIS IS CODE FOR THE RENTERS ADDRESS. COMMENTED OUT FOR NOW **********
                <div class="aez-form-item">
                    <label for="address1" class="aez-form-item__label">Street Address<sup>*</sup></label>
                    <input
                        id="address1"
                        type="text"
                        class="aez-form-item__input"
                        name="address1"
                        placeholder="Street Address 1"
                        required
                        value="' . $this->profile_data['AddressLine1'] . '"
                        
                    />
                </div>
                <div class="aez-form-item">
                    <label for="address2" class="aez-form-item__label">Street Address</label>
                    <input
                        id="address2"
                        type="text"
                        class="aez-form-item__input"
                        name="address2"
                        placeholder="Street Address 2"
                        value="' . $this->profile_data['AddressLine2'] . '"
                    />
                </div>
                <div class="aez-form-item">
                    <label for="zipCode" class="aez-form-item__label">Postal Code<sup>*</sup></label>
                    <input
                        id="zipCode"
                        type="text"
                        class="aez-form-item__input"
                        name="zipCode"
                        placeholder="Postal Code"
                        required
                        value="' . $this->profile_data['PostalCode'] . '"
                        
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
                        value="' . $this->profile_data['City'] . '"
                        
                    />
                </div>
                <div class="aez-form-item aez-form-item--dropdown">
                    <label for="state" class="aez-form-item__label">State</label>
                    <select
                        id="state"
                        class="aez-form-item__dropdown"
                        name="state"
                        
                    >
                        <option value="">--Select--</option>';
                       foreach($this->states as $key => $state) {
                            if($key != 'status') {
                                $sel = ($this->profile_data['State'] == $key)?'selected':'';
                                $this->profile_html .= '<option '.$sel.' value="'.$key.'">'.$state.'</option>';
                            }
                        }
                                
                        $this->profile_html .= '        
                        </select>
                </div>
                <div class="aez-form-item">
                    <label for="country" class="aez-form-item__label">Country</label>
                    <select id="country" 
                    class="aez-form-item__dropdown select2-hidden-accessible1" 
                    name="country"  style="width: 68%;" tabindex="-1" >
                    <option value="">--Select--</option>';

                    foreach($this->countries as $key => $country) {
                        if($key != 'status') {
                            $sel = ($this->profile_data['Country'] == $key)?'selected':'';
                            $this->profile_html .= '<option '.$sel.' value="'.$key.'">'.$country['name'].'</option>';
                        }
                    }

                    $this->profile_html .= '
                    </select>
                </div>

                <h4>Billing Address</h4>
        
                <div class="aez-form-item--checkbox-cont">
                    <input id="use_profile_address" '.($this->profile_data['IsDefaultBillingAddress']==1?'checked':'').' type="checkbox" class="aez-form-item__checkbox" name="use_profile_address" value="1">
                    <label for="use_profile_address" class="aez-form-item__label">Same As Renter Address Above</label>
                </div>

            ********** END OF RENTERS ADDRESS COMMENT ********** -->

                <div class="aez-form-billing-address" style="'.($billing_add_style).'">
                    <div class="aez-form-item">
                        <label for="billing_street_address_1" class="aez-form-item__label">Billing Street Address 1</label>
                        <input 
                        id="billing_street_address_1" 
                        type="text" 
                        class="aez-form-item__input"
                        name="billing_street_address_1" 
                        placeholder="Street Address" 
                        value="' . $this->profile_data['BAddressLine1'] . '"
                        />
                   </div>
                    <div class="aez-form-item">
                        <label for="billing_street_address_2" class="aez-form-item__label">Billing Street Address 2</label>
                        <input 
                        id="billing_street_address_2" 
                        type="text" 
                        class="aez-form-item__input" 
                        name="billing_street_address_2" 
                        placeholder="Street Address 2" 
                        value="' . $this->profile_data['BAddressLine2'] . '"
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
                        value="' . $this->profile_data['BPostalCode'] . '"
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
                        value="' . $this->profile_data['BCity'] . '"
                        />
                    </div>
                    <div class="aez-form-item">
                        <label for="billing_state" class="aez-form-item__label">State</label>
                    <select id="billing_state" 
                    class="aez-form-item__dropdown select2-hidden-accessible1" 
                    name="billing_state" style="width: 68%;" tabindex="-1">
                        <option value="">--Select--</option>';
                        foreach($this->states as $key => $state) {
                            if($key != 'status') {
                                $sel = ($this->profile_data['BState'] == $key)?'selected':'';
                                $this->profile_html .= '<option '.$sel.' value="'.$key.'">'.$state.'</option>';
                            }
                        }

                        $this->profile_html .= '
                        </select>
                    </div>
                    <div class="aez-form-item">
                        <label for="billing_country" class="aez-form-item__label">Country</label>
                        <select id="billing_country" 
                        class="aez-form-item__dropdown select2-hidden-accessible1" 
                        name="billing_country" style="width: 68%;" tabindex="-1" >
                            <option value="">--Select--</option>';
                            foreach($this->countries as $key => $country) {
                                if($key != 'status') {
                                    $sel = ($this->profile_data['BCountry'] == $key)?'selected':'';
                                    $this->profile_html .= '<option '.$sel.' value="'.$key.'">'.$country['name'].'</option>';
                                }
                            }

                            $this->profile_html .= '
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <div>&nbsp;</div>
        <div class="aez-form-item--checkbox-cont">
              <input
                id="EmailOptIn"
                type="checkbox"
                class="aez-form-item__checkbox"
                name="EmailOptIn"
                 ' . ($this->profile_data['EmailOptIn'] == 1 ? 'checked' : '' ) .'
                     
                value="1"

            />
            <label for="EmailOptIn" class="aez-form-item__label">Receive exclusive members-only offers and specials via email</label>
        </div>    
        <div class="aez-form-item--checkbox-cont">
              <input
                id="SMSOptIn"
                type="checkbox"
                class="aez-form-item__checkbox"
                name="SMSOptIn"
                 ' . ($this->profile_data['SMSOptIn'] == 1 ? 'checked' : '' ) .'
                value="1"     
            />
            <label for="SMSOptIn" class="aez-form-item__label">Receive exclusive members-only offers and specials via text messaging</label>
        </div>  
        
        <div class="aez-terms-submit-block">
            <button type="submit" class="aez-btn aez-btn--filled-green aez-update-password">Update Your Profile</button>
        </div>
        </form>
    </div>

    <div class="aez-advantage-awards-header">
        <h3 class="aez-advantage-awards-header__title">Change Your Password</h3>
    </div>
    <div class="aez-form-block">
        <form id="change_password" action="/profile" method="POST" class="aez-edit-password-form">
        <input type="hidden" name="profile_form" value="change_password" />
        <input id="email" type="hidden" name="email" value="' . $this->profile_data['email'] . '" />

        <div class="aez-form-item">
            <label for="current_password" class="aez-form-item__label">Current Password<sup>*</sup></label>
            <input
                id="current_password"
                type="password"
                class="aez-form-item__input"
                name="current_password"
                placeholder="Current Password"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="new_password1" class="aez-form-item__label">New Password<sup>*</sup></label>
            <input
                id="new_password1"
                type="password"
                class="aez-form-item__input"
                name="new_password1"
                placeholder="New Password"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="new_password2" class="aez-form-item__label">New Password Again<sup>*</sup></label>
            <input
                id="new_password2"
                type="password"
                class="aez-form-item__input"
                name="new_password2"
                placeholder="New Password Again"
                required
            />
        </div>

        <div class="aez-terms-submit-block">
            <button type="submit" class="aez-btn aez-btn--filled-green aez-update-password">Update Your Password</button>
        </div>
        </form>
    </div>
    </div> <!-- end profile-edit-part-dropdowm -->
</div> <!-- end aez-info-block-container -->
</div> <!-- end primary -->';

        return $this->profile_html;

    }

}

