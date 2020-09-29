<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');
    include_once('AdvRez_Helper.php');
 
class AdvRez_Choose_Shortcode extends AdvRez_ShortCodeScriptLoader {

    public $choose_list_html;
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
            wp_register_script( 'adv_reserve-summary-dropdown', plugins_url('js/adv_reserve-summary-dropdown.js', __FILE__), array('jquery'), null, true );
            wp_register_script( 'drop-down-js', get_stylesheet_directory_uri() . '/js/drop-down.js', array ( 'jquery', 'jquery-ui-js' ), null, true);
            
            $scripts = array('jquery', 'select2', 'moment', 'pikaday', 'mask', 'adv_reserve-summary-dropdown','drop-down-js');
            wp_enqueue_script($scripts);

            wp_localize_script( 'adv_rez', 'ADV_Rez_Ajax', array(
                'ajaxurl'   => admin_url( 'admin-ajax.php' ),
                'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
                )
            );
        }
    }

    public function handleShortcode($atts) {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        // TODO: Retrieve the cookie from the search form
        
        //Unset user express checkout flag
        unset($_SESSION['reserve']['express_checkout_complete_flag']);
        
        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $this->choose_list_html = '';

        // If the sort_value is set, which means the user is sorting the vehicles, then sort the vehicle
        // to the user's specifications. 
        if (isset($clean_post_data['sort_value'])) {
            // for ($x=0; $x < count($_SESSION['choose-sort']); $x++) {
            //     $choose_sort_array[$x] = $x;
            // }
            // AdvRez_Flow_Storage::reservation_flow_save('choose-sort', $choose_sort_array);
            switch ($clean_post_data['sort_value']) {
                // Sort the vehicles in price from lowest to highest.
                case 'low-high':
                    AdvRez_Helper::low_to_high($_SESSION['choose']);
                    break;
                // Sort the vehicles in price from highest to lowest.
                case 'high-low':
                    AdvRez_Helper::high_to_low($_SESSION['choose']);
                    break;
                // Sort the vehicles in seating space from highest to lowest.
                case 'seating':
                    AdvRez_Helper::seating($_SESSION['choose']);
                    break;
                // Sort the vehicles in luggage space from highest to lowest.
                case 'luggage':
                    AdvRez_Helper::luggage($_SESSION['choose']);
                    break;
                // Sort the vehicles in mpg from highest to lowest.
                case 'mpg':
                    AdvRez_Helper::mpg($_SESSION['choose']);
                    break;
            }
        }

        $car_count_msg = 'No Cars Found';

        if (!isset($_SESSION['choose'])) {
            $car_count = 0;
        } elseif (!isset($_SESSION['search']['vehicle_count'])) {
            $car_count = 0;
        } else {
            $car_count = $_SESSION['search']['vehicle_count'];
            if ($car_count > 0 ){
                $car_count_msg = 'We found '. $car_count . ' Cars:';
            }
        }
         if ($car_count == 1) {
            if(!isset($_SESSION['choose'][0]['RateID']))
            {
                $car_count = 0;
            }
        }

        // Fix to go back from choose page if no cars are found
        if($car_count == 0)
        {
            AdvRez_Helper::NoCarsFound(true);
        }

        $posted_sort_value = (isset($clean_post_data['sort_value']) ? $clean_post_data['sort_value']: '');
        
        //pre populate registered user information
        $pre_sel_cont_paycounters = '';
        
        if(isset($_SESSION['adv_login'])) {
            $profile_data = Adv_login_Helper::getAdvFullUser();
            if($profile_data['CarSpecification'] != '') {
                $pre_sel_cont_paycounters = '<a href="javascript:void(0);" data-ribbon="SELECTED">';
                 
            }
        }
        
        if(isset($_SESSION['search']['age'])) {

            $renter_age = $_SESSION['search']['age'];
            // $ages = array('21', '22', '23', '24');

            if($renter_age == "21") {
                $_SESSION['search']['age_category'] = 'UAGE';
            }
        } elseif (empty($_SESSION['search']['age']) || $_SESSION['search']['age'] == '') {
            $_SESSION['search']['age'] = '25+';
            $_SESSION['search']['age_category'] = '';
        }  

        $this->choose_list_html .= '<div id="primary">';
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

        fbq('track', 'Search', {
            content_type: '["destination", "car"]',
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
        pl.src = 'https://beacon.sojern.com/pixel/p/10990?f_v=v6_js&p_v=2&' + paramsArr.join('&');
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(pl);
        // console.log("CHOOSE PAGE --->");
        // console.log(params);
    })();
</script>
<!-- End Sojern Tag -->
<?php } ?>

        <?php
        $output_message = '';
        
        if (isset($_SESSION['express_checkout_fail'])) {

            //$output_message = '';
            

            $output_message .= '<div class="aez-warning">' .
                        '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                        '<div class="aez-warning__message">' .
                            '<span class="aez-warning__main-text">Express checkout error</span>' .
                            '<span class="aez-warning__additional-text">We are unable to pre-select your car preferences, please choose your car to continue.</span>' .
                        '</div>' .
                    '</div>';
            if(count($_SESSION['choose_promos']['PromoCodeEntered']) == 0) {    
                $this->choose_list_html .= '<div class="aez-warning-container"> '.$output_message.'<i class="fa fa-close aez-warning__close"></i></div>';
            }
            
            unset($_SESSION['express_checkout_fail']);
        } 
        
        if (isset($_SESSION['choose_promos']['PromoCodeEntered']) && count($_SESSION['choose_promos']['PromoCodeEntered']) > 0) {

            

            if (isset($_SESSION['choose_promos']['PromoCodeEntered'][0])) { 
                foreach ($_SESSION['choose_promos']['PromoCodeEntered'] as $key => $value) {
                    if ($value['PromoStatus'] != 'OK') {
                        /* $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $value['PromoCode'] . '</span>' .
                                '<span class="aez-warning__additional-text">' . $value['PromoMsg'] . '</span>' .
                            '</div>' .
                        '</div>';
                        */
                        
                        $promo_code_title[] =  $value['PromoCode'];
                    
                        $output_message_internal .= '<span class="aez-warning__additional-text">'.$value['PromoMsg'].'</span>';
                    }
                }
            } elseif ($_SESSION['choose_promos']['PromoCodeEntered']['PromoStatus'] != 'OK')  {
                $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__main-text">Promo Code restriction for ' . $_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'] . '</span>' .
                                '<span class="aez-warning__additional-text">' . $_SESSION['choose_promos']['PromoCodeEntered']['PromoMsg'] . '</span>' .
                            '</div>' .
                        '</div>';
            } elseif ($_SESSION['choose_promos']['PromoCodeEntered']['PromoStatus'] == 'OK' && $_SESSION['choose_promos']['PromoCodeEntered']['VehicleRestrictions'] == 'True')  {
                $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__additional-text">' . $_SESSION['choose_promos']['PromoCodeEntered']['VehicleRestrictionsMsg'] . '</span>' .
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
                $this->choose_list_html .= '<div class="aez-warning-container">' . $output_message .
                    '<i class="fa fa-close aez-warning__close"></i></div>';
            }

        }
        
        $this->choose_list_html .=

                    '<main id="main" role="main" class="aez-reservation-choose">'.
                        '<div class="aez-progress-bar content-mobile-hide">'.
                            '<div class="aez-progress-bar__item aez-progress-bar__item--completed">'.
                                '<div class="aez-progress-bar__item-text">Choose</div>'.
                                '<div class="aez-progress-bar__item-arrow"></div>'.
                            '</div>'.
                            '<div class="aez-progress-bar__item">'.
                                '<div class="aez-progress-bar__item-text">Enhance</div>'.
                                '<div class="aez-progress-bar__item-arrow"></div>'.
                            '</div>'.
                            '<div class="aez-progress-bar__item">'.
                                '<div class="aez-progress-bar__item-text">Reserve</div>'.
                                '<div class="aez-progress-bar__item-arrow"></div>'.
                            '</div>'.
                        '</div>'.
                        '<div class="aez-reservation-summary is-open aez-reservation-summary__full">'.
                            '<div class="aez-reservation-title-bar">'.
                                '<h3>Choose Your Car</h3>'.
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
                                    '<div class="aez-reservation-section">'.
                                        '<h4 class="aez-all-caps -blue">Drop Off</h4>'.
                                        '<h5 class="aez-reservation-date">'. $_SESSION['search']['dropoff_date_formatted'] . '</h5>'.
                                        '<h5 class="aez-reservation-time"> ' . $_SESSION['search']['dropoff_time'] . '</h5>'.
                                        '<p class="aez-reservation-text">
                                            ' . ucwords(strtolower($_SESSION['search']['return_location_name'])) . ' (' . $_SESSION['search']['return_location_id'] .  ')<br>
                                            ' . ucwords(strtolower($_SESSION['search']['return_location_street'])) . '<br>
                                            ' . ucwords(strtolower($_SESSION['search']['return_location_city'])) . ', ' . $_SESSION['search']['return_location_state'] . ' ' . $_SESSION['search']['return_location_zip'] . '
                                        </p>'.
                                    '</div>'.
                                '</div>'.
                                '<span class="aez-all-caps aez-sub -blue">Close</span>'.
                            '</div>'.
                        '</div>';
        
           if($pre_sel_cont_paycounters != '') {
                            $this->choose_list_html .= '<div class="preselected-text-container">
                                                            <div class="select-box-text">
                                                           <span class="member-pre-select-text"> Member Pre-Selected </span> <span data-ribbon-choose-heading="SELECTED">&nbsp;</span>
                                                            </div>
                                                        </div>';
            }
                $this->choose_list_html .='<div class="aez-vehicle-choose-outside-container">  
<div class="aez-vehicle-choose-container">
<div class="aez-choose-vehicle-container row">  ';

        if ($car_count == 0 ) {
            $this->choose_list_html .= '</main></div>';
            return $this->choose_list_html;
        }
        
   
            $count = 0;
        foreach ($_SESSION['choose-sort'] as $sort_key => $sort_value) {
            $count++;
            
            // Set the car_key to the sort_value, which is the index of that vehicle
            $car_key = $sort_value;

            // Set the car_value to the vehicle in the choose-sort array. 
            $car_value = $_SESSION['choose'][$sort_value];

            if ($car_key == count($_SESSION['choose']) - 1) {
                break;
            }

            // Difference in days between the pickup date/time and dropoff date/time
            //$diff_days = AdvRez_Helper::getDaysBetweenDates();
            $currency_symbol =  AdvRez_Helper::getAdvCurrency($car_value['CurrencyCode']);
            // Check if RatePlan is weekly or daily. 
            if (strtoupper($car_value['RatePlan']) == 'WEEKLY') {
                $days = "/week";
            } else {
                $days = "/day";
            }

            $pay_now_label = 'PAY NOW';
            $save_label ="Save $currency_symbol";
            $save =$car_value['RTotalCharges'] - $car_value['PTotalCharges'];
            $save_amount= sprintf('%01.2f', strval($save));

            if ($car_value['RRateAmount'] == $car_value['PRateAmount']) {
                $pay_now_label = 'PAY NOW';
                $save_label='';
                $save_amount="";
            }

            // Get the type of Transmission
            $third =  AdvRez_Helper::third_letter_short(substr($car_value['ClassCode'], 2, 1));

            // Get the currency symbol for the country
            // $currency_symbol =  AdvRez_Helper::getAdvCurrency($car_value['CurrencyCode']);

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
            
//assign all mini details into one variabe for responsive
 if (isset($display_transmission)) {
$mini_details= '
<span> 
    <i class="fa fa-road" aria-hidden="true"></i>
    <p>' . $third . '</p>
</span>';
}
if (isset($display_mpg)) {
$mini_details .= '
<span>
    <i class="fa fa-tachometer" aria-hidden="true"></i>
    <p>' . $car_value['MPGCity'] . '/' . $car_value['MPGHighway'] . ' mpg</p>
</span>';
}
if (isset($display_passengers) && $car_value['Passengers'] !== "?") {
$mini_details  .= '
<span>
    <i class="fa fa-users" aria-hidden="true"></i>
    <p>' . $car_value['Passengers'] . '</p>
</span>';
}
if (isset($display_luggage) && $car_value['Luggage'] !== "?") {
 $mini_details  .= '
<span>
    <i class="fa fa-suitcase" aria-hidden="true"></i>
    <p>' . $car_value['Luggage'] . '</p>
</span>';
}

$car_desc = $car_value['ClassDesc'];
$remove_string = 'Automatic With AC';
$car_desc_modified = trim(str_ireplace($remove_string, '', $car_desc));

if($car_desc == "Special Special Automatic With AC ") {
    $car_desc_modified = str_ireplace($car_desc_modified, "MANAGER'S SPECIAL", "SPECIAL SPECIAL");
}
// echo $car_desc_modified;

            $this->choose_list_html .= '            
        <div class="aez-choose-vehicle-container-details col-12 col-md-6 col-lg-4">  
        <div class="aez-single-car-view">
        <div class="aez-choose-car-title "><span>'.$car_desc_modified.'</span> </div>
        <div class="aez-choose-car">                            
        <div class="aez-single-car-detail-view">
            <div class="aez-choose-car-information content-desktop">
                   <div class="aez-car-header-main-title">
                            <span class="aez-choose-mini-details-container car-name-text-align" ><p>' . $car_value['ModelDesc'] . ' or Similar </p></span>
                   </div>
            </div>    
            <div class="aez-choose-vehicle-img-container content-desktop"><img  class="aez-choose-vehicle-img-info" alt="car picture" src="' . $car_value['ClassImageURL'] . '" /> </div> 
            <div class="content-mobile">
                <div class="row">
                        <div class="col-6 ">
                            <img  class="aez-choose-vehicle-img-info" alt="car picture" src="' . $car_value['ClassImageURL'] . '" />
                        </div>
                        <div class="col-6 model-desc">
                                    <div class="choose-mob-title-desc">  ' . $car_value['ModelDesc'] . ' <span><br>or Similar</span></div>                        
                                    <div class="aez-mini-details-container">
                                         <div class="aez-mini-details">'.$mini_details;                   
                                           $this->choose_list_html .= '
                                        </div>                                      
                                    </div> 
                        </div>                                          
                </div>
            </div> 
             <div class="aez-mini-details-container content-desktop">
                                        <div class="aez-mini-details">'.$mini_details;                                              
                                           $this->choose_list_html .= '
                                        </div>
                                        <!-- <div class="aez-details">
                                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                                            <a href="#">View Vehicle Details</a>
                                        </div> -->
                            </div>      
                   ';    
                                                       
                                                $sel_class = '';
                                                $not_us_location=   'col-md-12 col-lg-12'; 
                                                $remove_border='style=border-right:none;';
                                                $pay_counter_title=' style="position: relative;left: 4px;"';
                                                $pre_selected_text1_start = '';
                                                 $pre_selected_text1_end = '';
                                                if($profile_data['CarSpecification'] == $car_value['ClassCode'] && $profile_data['PaymentPreference'] == 0) {
                                                    $sel_class = 'rez-choose-selected';
                                                    $pre_selected_text1_start ='<a href="javascript:void(0);" data-ribbon="SELECTED">';
                                                    $pre_selected_text1_end = '</a>';
                                                } 
                                                if($_SESSION['search']['rental_location_country'] == 'US') {
                                                  $not_us_location=   'col-md-6 col-lg-6';
                                                  $remove_border='';
                                                  $pay_counter_title='';
                                                } 
                                                
                                            $this->choose_list_html .= '                 
        
                     <div class="aez-choose-total-pay-container row">
                             <div class="aez-choose-pay-at-the-counter tablet-border-remove   col-6 col-sm-6'.$not_us_location.'" '.$remove_border.'>
                         
                                <div class="aez-counter-option  '.$sel_class.' ">
                                              
                                                                                         
                                            <form id="form' . $count . '" action="/enhance" class="form-horizontal vehicle_chosen" role="form" method="POST" name="adv_choose">
                                                <input type="hidden" name="atCounter" value="true">
                                                <input type="hidden" name="rate_id" value="' . $car_value['RateID'] . '">
                                                <input type="hidden" name="class_code" value="' . $car_value['ClassCode'] . '">
                                                <input type="hidden" name="payment_type" value="counter">
                                                <input type="hidden" name="prepaid" value="N">
                                                <input type="hidden" name="car_key" value="' . $car_key . '">
                                              '.$pre_selected_text1_start.'   <button
                                                    id="adv_rez_enhance_submit' . $count . '"
                                                    type="submit"
                                                    class="aez-btn aez-btn aez-btn--filled-white aez-total-container"
                                                    disabled
                                                    style="width: 179px;"
                                                >
                                                <h3   '.$pay_counter_title.'>PAY LATER</h3>
                                                <p>'.$currency_symbol.'<b>'. $car_value['RRateAmount'] . '</b> '. $days .'</p>
                                                </button>'.$pre_selected_text1_end.'
                                                <div class="total-display">Total: '.$currency_symbol.'' . $car_value['RTotalCharges'] . '</div>
                                            </form>
                                 </div>
                             </div>
                              ';
                                 // Next form goes up in the count.
                                        $count ++;

                                        $sel_class1 = ''; 
                                        $pay_online_text = ''; 
                                        $save_usd_text1 = '';
                                        $save_usd_text2 = '';
                                        $gap_bwet_save = '';
                                        $pre_selected_text2_start ='';
                                        $pre_selected_text2_end = '';        
                                        if($profile_data['CarSpecification'] == $car_value['ClassCode'] && $profile_data['PaymentPreference'] == 1) {
                                            $sel_class1 = 'rez-choose-selected';
                                            $pay_online_text = 'pay_online_text';
                                            $save_usd_text1 = 'save_usd_text1';
                                            $save_usd_text2 = 'save_usd_text2';
                                            $gap_bwet_save = 'gap_bwet_save';
                                            $pre_selected_text2_start ='<a href="javascript:void(0);" data-ribbon="SELECTED">';
                                            $pre_selected_text2_end = '</a>';
                                        } 
                                        
                                        if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {

                                            // Start the htmlString again
                                            $this->choose_list_html.= '
                                          <div class="aez-choose-pay-online   col-6 col-sm-6 col-md-6 col-lg-6">
                                            
                                            <div class="aez-online-option '.$sel_class1.'tablet-pay-button ">
                                                     
                                                  <!--  <div class="pre-select-button-cont">'.$pre_selected_text2.'</div> -->
                                                      
                                                    <form id="form' . $count . '" action="/enhance" class="form-horizontal vehicle_chosen" role="form" method="POST" name="adv_choose">
                                                    <input type="hidden" name="prepaid" value="true">
                                                    <input type="hidden" name="rate_id" value="' . $car_value['RateID'] . '">
                                                    <input type="hidden" name="class_code" value="' . $car_value['ClassCode'] . '">
                                                    <input type="hidden" name="payment_type" value="prepaid">
                                                    <input type="hidden" name="prepaid" value="Y">
                                                    <input type="hidden" name="car_key" value="' . $car_key . '">
                                                    '.$pre_selected_text2_start.'  <button
                                                        id="adv_rez_enhance_submit' . $count . '"
                                                        type="submit"
                                                        class="aez-btn aez-btn aez-btn--filled-white aez-total-container best-rate"
                                                        disabled
                                                        style="width: 179px;"
                                                    >
                                                    <h3>' . $pay_now_label . '</h3>
                                                    <p style="margin-bottom: 0rem;">'.$currency_symbol.'<b>' . $car_value['PRateAmount'] . '</b> '. $days .'</p>
                                                    
                                                    </button>'.$pre_selected_text2_end.'
                                                    <div class="total-display">Total: '.$currency_symbol.''.$car_value['PTotalCharges'].'</div>
                                                    <p><font style="color:#003366;">'. $save_label .''. $save_amount . '</font></p>
                                                    </form>
                                            </div> </div> ';
                            }
                            $this->choose_list_html.= '
                              
                    </div>
                 
        </div>
        </div>   
        </div>    
        </div>                        


';
        }
        
         $this->choose_list_html.= '      
                                        </div>
                                    </div>
                                </div>';

        $vehicle_html = '';
        if (isset($_POST['vehicles_html']))
        {
            $vehicle_html = $_POST['vehicles_html'];
        }
        $this->choose_list_html .= preg_replace('/\\\\/', '', $vehicle_html);
        return $this->choose_list_html;

    }


}