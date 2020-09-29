<?php

class AdvRez_ReservationFlow {

    public $api_url_array;
    public $display_complete;

	public function __construct() {

	}

	public function init() {

	}

    public function getEnhanceChoices() {

        $ret_array = [];

        if (isset($_SESSION['reserve']['RateID'])) {
            $ret_array['RateID'] = $_SESSION['reserve']['RateID'];
        }

        if (isset($_SESSION['reserve']['ClassCode'])) {
            $ret_array['ClassCode'] = $_SESSION['reserve']['ClassCode'];
        }

        if (isset($_SESSION['reserve']['Prepaid'])) {
            $ret_array['Prepaid'] = $_SESSION['reserve']['Prepaid'];
        }

        if (isset($_SESSION['reserve']['vehicleEnhanceType'])) {
            $ret_array['vehicleEnhanceType'] = $_SESSION['reserve']['vehicleEnhanceType'];
        }

        if (isset($_SESSION['reserve']['vehicleIndex'])) {
            $ret_array['vehicleIndex'] = $_SESSION['reserve']['vehicleIndex'];
        }

        if (isset($_SESSION['reserve']['vehicleOptions'])) {
            $ret_array['vehicleOptions'] = $_SESSION['reserve']['vehicleOptions'];
        }

        if (count($ret_array) == 0) {
            $ret_array = ['error' => 'empty'];
        }
        return $ret_array;
        // die();
    }

    public function processRezKayak($get_data) {

        AdvRez_Flow_Storage::reservation_flow_delete('search');
        $this->processChoosePage();

        $car_class = $get_data['classCode'];

        $vehicleIndex = 0;

        foreach ($_SESSION['choose'] as $key => $value) {
            if (isset($value['ClassCode']) && $value['ClassCode'] == $get_data['classCode']) {
                $vehicleIndex = $key;
            }
        }

        if (isset($get_data['payment_type']) && $get_data['payment_type'] == "counter") {
            $vehicleSelectedArray['payment_type'] = 'counter';
        } else {
            $vehicleSelectedArray['payment_type'] = 'prepaid';
        }

        if (isset($vehicleSelectedArray['payment_type']) && $vehicleSelectedArray['payment_type'] == "prepaid") {
            $vehicleSelectedArray['prepaid'] = 'Y';
        } else {
            $vehicleSelectedArray['prepaid'] = 'N';
        }

        $vehicleSelectedArray['rate_id'] = $get_data['rateid'];
        $vehicleSelectedArray['class_code'] = $get_data['classCode'];
        $vehicleSelectedArray['vehicleIndex'] = $vehicleIndex;
        $vehicleSelectedArray['kayakclickid'] = $get_data['clickID'];

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $vehicleSelectedArray['promo_primary'] = $api_url_array['kayak_iata'];

        // $car_class = $_SESSION['choose']['']
        $this->processEnhancePage($vehicleSelectedArray);

    }

    public function processFromVehiclesPage($c_code){
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        
        $rental_location_id = $post_data['rental_location_id'];
        $return_location_id = $post_data['return_location_id'];
        
        $profile_data = Adv_login_Helper::getAdvFullUser();
        $post_data['promo_codes'] = array_unique($post_data['promo_codes']);

        //Process choose activities
        $post_data['adv_reservation'] = AEZ_Oauth2_Plugin::get_reservation_cookie();

        // Set promo codes to a temp array
        $temp_post_array = $post_data['promo_codes'];
        //Check if both temp post array and post data are arrays
        if (is_array($temp_post_array) && is_array($post_data['promo_codes'])) {
            // Loop through the temp post array
            foreach ($temp_post_array as $key => $value) {
                // If the value is empty then unset it.
                if (empty($temp_post_array[$key]) || !isset($temp_post_array[$key])) {
                    unset($post_data['promo_codes'][$key]);
                }
            }
            // Reorder the array so the key starts at 0
            $post_data['promo_codes'] = array_values($post_data['promo_codes']);
            // If all the promo codes don't exist, then set a default one so we get search results at the next page.
            if (array_key_exists('0', $post_data['promo_codes']) === false) {
                $post_data['promo_codes'] = array();
            }
        }


        // Rental Location
        $rental_response_array = AdvLocations_Helper::getLocation($post_data['rental_location_id']);
        // Add rental_location_name to the post_data array
        $post_data['rental_location_name'] = $rental_response_array['LocationName'].' ('.$rental_response_array['City'].', '.$rental_response_array['State'].' '.$rental_response_array['CountryName'].') - '.$rental_response_array['LocationCode'];

        $post_data['BrandName'] = $rental_response_array['BrandName'];

        // Return Location 
        $return_response_array = AdvLocations_Helper::getLocation($post_data['return_location_id']);
        // Add return_location_name to the post_data array
        $post_data['return_location_name'] = $return_response_array['LocationName'].' ('.$return_response_array['City'].', '.$return_response_array['State'].' '.$return_response_array['CountryName'].') - '.$return_response_array['LocationCode'];

        
        
        AdvRez_Flow_Storage::reservation_flow_delete_cookie('search');
        // Set the user cookie for 10 years
        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        AdvRez_Flow_Storage::reservation_flow_set_cookie('adv_userbookmark', $post_data, time() + (185 * 24 * 60 * 60));
        // AdvRez_Flow_Storage::reservation_flow_save('adv_userbookmark', $post_data);

        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        AdvRez_Flow_Storage::reservation_flow_delete('search');


        // Set adv_login_member_number to 0 as default, meaning customer is not logged in.
        $adv_login_member_number = 0;
        // Check if the customer is logged in or not, if they are set the member number.
        if(isset($_SESSION['adv_login']->memberNumber)) {
            $adv_login_member_number = $_SESSION['adv_login']->memberNumber;
        }

         $request_query = [
            // 'HTTP_ORIGIN' => $_SERVER['HTTP_ORIGIN'],
            // 'adv_reservation' => $post_data['adv_reservation'],
            'rental_location_id' => $post_data['rental_location_id'],
            'return_location_id' => $post_data['return_location_id'],
            'pickup_date' => $post_data['pickup_date'],
            'pickup_time' => $post_data['pickup_time'],
            'dropoff_date' => $post_data['dropoff_date'],
            'dropoff_time' => $post_data['dropoff_time'],
            'promo_codes' => $post_data['promo_codes'],
            'adv_login_member_number' => $adv_login_member_number
        ];
        
            $rates_endpoint = '/getRates';
            
            

            $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . $rates_endpoint, $request_query);
            $tmp_response_arrays = json_decode($response_contents, true);
            
            
            
            
            $response_arrays = $tmp_response_arrays['Payload'];
            
            if(isset($response_arrays['RateProduct'][0]['RateID']))
            {
                foreach($response_arrays['RateProduct'] as $index_key => $car) {
                    $f_flag = 1;
                    if($car['ClassCode'] == $c_code) {
                        $f_flag = 0;
                        $rate_id = $car['RateID'];

                        // Choose activity begins
                        $request_query = [
                                    'rental_location_id' => $post_data['rental_location_id'],
                                    'rental_location_ids' => $post_data['rental_location_id'] . ',' . $post_data['return_location_id'],
                                    ];

                        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/getLocations', $request_query);

                        $req_locs_response_array_tmp = json_decode($response_contents, true);
                        $location_1 = $req_locs_response_array_tmp['d'][0];

                        if (count($req_locs_response_array_tmp['d']) > 1) {
                            $location_2 = $req_locs_response_array_tmp['d'][1];

                            if ($location_1['LocationCode'] == $post_data['rental_location_id']) {
                                $rental_location_array['RentalLocation'] = $location_1;
                                $return_location_array['ReturnLocation'] = $location_2;                
                            } else {
                                $rental_location_array['RentalLocation'] = $location_2;
                                $return_location_array['ReturnLocation'] = $location_1;                
                            }

                        } else {
                            $rental_location_array['RentalLocation'] = $location_1;
                            $return_location_array['ReturnLocation'] = $location_1;
                        }

                        $pickup_time = $post_data['pickup_time'];
                        $pickup_date = $post_data['pickup_date'];
                        $dropoff_time = $post_data['dropoff_time'];
                        $dropoff_date = $post_data['dropoff_date'];

                        $pickupToDate = date_create_from_format("mdY", $pickup_date);
                        $pickup_date_formatted = date_format($pickupToDate, "l - F, d, Y");

                        $tag_manager_pickup_date = date_format($pickupToDate, "Y-m-d");

                        $dropoffToDate = date_create_from_format("mdY", $dropoff_date);
                        $dropoff_date_formatted = date_format($dropoffToDate, "l - F, d, Y");

                        $tag_manager_dropoff_date = date_format($dropoffToDate, "Y-m-d");

                        $rental_location = $rental_location_array['RentalLocation'];
                        $return_location = $return_location_array['ReturnLocation'];

                        $rental_location_id = $post_data['rental_location_id'];
                        $rental_location_name = $rental_location['LocationName'];
                        $rental_location_street = $rental_location['AddLine1'];
                        $rental_location_city = $rental_location['City'];
                        $rental_location_state = trim(strlen($rental_location['State'])) == 0 ? $rental_location['Country'] : $rental_location['State'];
                        $rental_location_zip = $rental_location['PostalCode'];
                        $rental_location_country = trim(strlen($rental_location['Country'])) == 0 ? $rental_location['State'] : $rental_location['Country'];

                        $return_location_id = $post_data['return_location_id'];
                        $return_location_name = $return_location['LocationName'];
                        $return_location_street = $return_location['AddLine1'];
                        $return_location_city = $return_location['City'];
                        $return_location_state = trim(strlen($return_location['State'])) == 0 ? $return_location['Country'] : $return_location['State'];
                        $return_location_zip = $return_location['PostalCode'];
                        $return_location_country = trim(strlen($return_location['Country'])) == 0 ? $return_location['State'] : $return_location['Country'];

                        $post_data['rental_location_name'] = $rental_location_name;
                        $post_data['rental_location_street'] = $rental_location_street;
                        $post_data['rental_location_city'] = $rental_location_city;
                        $post_data['rental_location_state'] = $rental_location_state;
                        $post_data['rental_location_zip'] = $rental_location_zip;
                        $post_data['rental_location_country'] = $rental_location_country;

                        $post_data['return_location_name'] = $return_location_name;
                        $post_data['return_location_street'] = $return_location_street;
                        $post_data['return_location_city'] = $return_location_city;
                        $post_data['return_location_state'] = $return_location_state;
                        $post_data['return_location_zip'] = $return_location_zip;
                        $post_data['return_location_country'] = $return_location_country;
                // error_log('response_arrays: ' . print_r($response_arrays, true));
                        if (isset($response_arrays['RateProduct'][0])) {
                            $post_data['vehicle_count'] = count($response_arrays['RateProduct']);
                        } else {
                            $post_data['vehicle_count'] = 1;
                        }

                // error_log('$post_data[vehicle_count]: ' . print_r($post_data['vehicle_count'], true));

                        $post_data['pickup_date_formatted'] = $pickup_date_formatted;
                        $post_data['pickup_date'] = $pickup_date;
                        $post_data['pickup_time'] = $pickup_time;
                        $post_data['pickup_date_time'] = $post_data['pickup_date'] . ' ' . substr($post_data['pickup_time'], 0, 5) . ' ' . substr($post_data['pickup_time'], 5);
                        $post_data['rental_location_name'] = $rental_location_name;
                        $post_data['rental_location_street'] = $rental_location_street;
                        $post_data['rental_location_city'] = $rental_location_city;
                        $post_data['rental_location_state'] = $rental_location_state;
                        $post_data['rental_location_country'] = $rental_location_country;
                        $post_data['rental_location_zip'] = $rental_location_zip;
                        $post_data['rental_latitude'] = $rental_location_array['RentalLocation']['Latitude'];
                        $post_data['rental_longitude'] = $rental_location_array['RentalLocation']['Longitude'];
                        $post_data['rental_phone1'] = (isset($rental_location_array['RentalLocation']['Phone1']) ? $rental_location_array['RentalLocation']['Phone1'] : '');
                        $post_data['rental_phone2'] = (isset($rental_location_array['RentalLocation']['Phone2']) ? $rental_location_array['RentalLocation']['Phone2'] : '');
                        $post_data['rental_fax'] = (isset($rental_location_array['RentalLocation']['Fax']) ? $rental_location_array['RentalLocation']['Fax'] : '');

                        $post_data['dropoff_date_formatted'] = $dropoff_date_formatted;
                        $post_data['dropoff_date'] = $dropoff_date;
                        $post_data['dropoff_time'] = $dropoff_time;
                        $post_data['dropoff_date_time'] = $post_data['dropoff_date'] . ' ' . substr($post_data['dropoff_time'], 0, 5) . ' ' . substr($post_data['dropoff_time'], 5);
                        $post_data['return_location_name'] = $return_location_name;
                        $post_data['return_location_street'] = $return_location_street;
                        $post_data['return_location_city'] = $return_location_city;
                        $post_data['return_location_state'] = $return_location_state;
                        $post_data['return_location_zip'] = $return_location_zip;
                        $post_data['return_location_country'] = $return_location_country;
                        $post_data['return_latitude'] = $return_location_array['ReturnLocation']['Latitude'];
                        $post_data['return_longitude'] = $return_location_array['ReturnLocation']['Longitude'];
                        $post_data['return_phone1'] = (isset($return_location_array['ReturnLocation']['Phone1']) ? $return_location_array['ReturnLocation']['Phone1'] : '');
                        $post_data['return_phone2'] = (isset($return_location_array['ReturnLocation']['Phone2']) ? $return_location_array['ReturnLocation']['Phone2'] : '');
                        $post_data['return_fax'] = (isset($return_location_array['ReturnLocation']['Fax']) ? $return_location_array['ReturnLocation']['Fax'] : '');

                        AdvRez_Flow_Storage::reservation_flow_set_cookie('search', $post_data);
                        AdvRez_Flow_Storage::reservation_flow_save('search', $post_data);

                        $tmp_choose_list_array = AdvRez_Helper::getChooseValues($response_arrays);

                        //set display options
                        $_SESSION['DisplayOptions']= $response_arrays['Options']['DisplayOptions'];

                        // Check if it's a multi-dimentional array, if not then add the array to the session variable
                        if (count($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra']) == count($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'], COUNT_RECURSIVE)) {
                            // If there's a ONEWAY drop charge then add it to the session.
                            if (in_array("ONEWAY", $response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'])) {
                                $_SESSION['enhance']['OneWay'] = $response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'];
                            }
                        } else {
                            // Loop through the Extras and check if there's a ONEWAY drop charge.
                            // If there is then add it to the session.
                            foreach($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'] as $key => $value) {
                                // Check if ONEWAY is in the array
                                if (in_array("ONEWAY", $value)) {
                                    // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                                    $_SESSION['enhance']['OneWay'] = $value;
                                }
                            }
                        }

                        // $choose_full_array[] = array('e' => 'stuff');
                        $choose_full_array = AdvRez_Helper::getChoose3Vehicles($tmp_choose_list_array);

                        AdvRez_Flow_Storage::reservation_flow_save('choose', $choose_full_array);
                        for ($x=0; $x <= count($choose_full_array) - 2; $x++) {
                            $choose_sort_array[$x] = $x;
                        }
                        AdvRez_Flow_Storage::reservation_flow_save('choose-sort', $choose_sort_array);
                        AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $response_arrays['PromoCodeResponse']);
                        // Choose activity ends
                        
                        //Enhance activity begins
                       $request_query = [
                            'rental_location_id' => $_SESSION['search']['rental_location_id'],
                            'class_code' => $car['ClassCode'],
                        ];

                        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestExtras', $request_query, false);

                        $tmp_response_arrays = json_decode($response_contents, true);
                        $response_arrays = $tmp_response_arrays['d'];
                        $tmp_pay_type = 'counter';
                        $_SESSION['enhance']['RateID'] = $rate_id;
                        $_SESSION['enhance']['ClassCode'] = $car['ClassCode'];
                        $_SESSION['enhance']['Prepaid'] = 'N';
                        $_SESSION['enhance']['payment_type'] = $tmp_pay_type; //counter or prepaid
                        $_SESSION['enhance']['vehicleIndex'] = $index_key;

                        if (count($response_arrays) > 0 ) {
                            $_SESSION['enhance']['DailyExtra'] = $response_arrays;
                        }
                        if (isset($clean_post_data['promo_primary']) ) {
                            $_SESSION['enhance']['promo_primary'] = $clean_post_data['promo_primary'];
                        }
                        if (isset($clean_post_data['kayakclickid']) ) {
                            $_SESSION['enhance']['kayakclickid'] = $clean_post_data['kayakclickid'];
                        }                        
                        
                        $tmp_response_arrays = json_decode($response_contents, true);
                        $response_arrays = $tmp_response_arrays['d'];   
                        
                        if(!empty($profile_data['AdditionalOption'])) {
                            $add_options = explode(",", $profile_data['AdditionalOption']);
                            if(in_array('GPS', $add_options)){
                                $add_options[] = 'MTECH';
                            }
                            if(in_array('MTECH', $add_options)){
                                $add_options[] = 'GPS';
                            }

                            $vehicleOptions = array();
                            if(isset($response_arrays[0]['ExtraCode'])) {
                                foreach($response_arrays as $opt) {
                                    $code = $opt['ExtraCode'];
                                    if(in_array($code, $add_options)) {
                                        $vehicleOptions[] = $code;
                                    }
                                }
                            }                        

                            //remove one hand control, if user has two hand controls
                            $sort_options_handcontrol_filter = array();
                            foreach($vehicleOptions as $voption){  
                                if($voption == 'HCR' || $voption == 'HCL'){
                                        array_push($sort_options_handcontrol_filter,$voption);
                                }
                            }
                            if(count($sort_options_handcontrol_filter) == 2){
                                $key = array_search ('HCR', $vehicleOptions);
                                unset($vehicleOptions[$key]);
                            }
                        }
                        
                        
                        break;  
                        
                    }
                    
                }
            }
            //Enhance activity ends
            
            
            if($f_flag == 1) {
                unset($_SESSION['reserve'], $_SESSION['choose'], $_SESSION['enhance']);
                return false;
            }

            return true;
          
    }

    public function processChoosePage() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        //unset($_SESSION['abandonment']['abandonment_promocode']);

        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');
// error_log(' processChoosePage  bookmark_search_array: ' . print_r($bookmark_search_array, true));
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        if (isset($post_data['promo_codes'])) {
            $post_data['promo_codes'] = array_unique($post_data['promo_codes']);
        }

        /****** SET promocode to the ABANDONMENT promocode ******/
        if ((count($post_data['promo_codes']) == 1  && $post_data['promo_codes'][0] == "") && (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($this->api_url_array['abandonment_promocode'])))) {
            $post_data['promo_codes'][0] = $this->api_url_array['abandonment_promocode'];
        }

        //Unset user express checkout flag
        unset($_SESSION['reserve']['express_checkout_complete_flag']);
        unset($_SESSION['express_checkout_fail']);
        if(isset($_SESSION['adv_login']) && $post_data['express_checkout_option'] == 1 ) {
            if($this->processExpressCheckout()) {
                $response = array('status'=> 'success', 'express_checkout_flag'=> 1);
                echo json_encode($response);
                exit;
            }
            $_SESSION['express_checkout_fail'] = 1;
        }            

        unset($_SESSION['choosed_car_from_vehicle_page_fail']);
        if(!empty($post_data['selected_car_class'])){
            if($this->processFromVehiclesPage($post_data['selected_car_class'])) {
                $response = array('status'=> 'success', 'choosed_car_from_vehicle_page'=> 1);
                echo json_encode($response);
                exit;
            } 
            $_SESSION['choosed_car_from_vehicle_page_fail'] = 1;
        }     

        //To set session pre-select age if age field not in find a car form
        if(!isset($post_data['age']) && isset($_SESSION['search']['age'])) {
            $post_data['age'] = $_SESSION['search']['age'];
        }   
        
        if (count($post_data) == 0) {
            $get_data = AEZ_Oauth2_Plugin::clean_user_entered_data('get');

            $post_data['action'] = 'advRezChoose';
            $post_data['rental_location_id'] = $get_data['rentalloc'];
            $post_data['return_location_id'] = $get_data['returnloc'];
            $post_data['pickup_date'] = str_replace('/', '', $get_data['pickupdate']);
            $post_data['dropoff_date'] = str_replace('/', '', $get_data['dropoffDate']);
            $post_data['pickup_time'] = str_replace(' ', '', $get_data['pickuptime']);
            $post_data['dropoff_time'] = str_replace(' ', '', $get_data['dropofftime']);
            $post_data['promo_codes'] = array(0 => '');
            $post_data['payment_type'] = $get_data['payment_type'];
            $post_data['age'] = $get_data['age'];
            $post_data['vehicleOptions'] = $get_data['vehicleOptions'];
            if (isset($get_data['rateid']) && isset($get_data['classCode'])) {
                $post_data['rate_id'] = $get_data['rateid'];
                $post_data['class_code'] = $get_data['classCode'];
            }
        }

        $post_data['adv_reservation'] = AEZ_Oauth2_Plugin::get_reservation_cookie();

        // Set promo codes to a temp array
        $temp_post_array = $post_data['promo_codes'];
        //Check if both temp post array and post data are arrays
        if (is_array($temp_post_array) && is_array($post_data['promo_codes'])) {
            // Loop through the temp post array
            foreach ($temp_post_array as $key => $value) {
                // If the value is empty then unset it.
                if (empty($temp_post_array[$key]) || !isset($temp_post_array[$key])) {
                    unset($post_data['promo_codes'][$key]);
                }
            }
            // Reorder the array so the key starts at 0
            $post_data['promo_codes'] = array_values($post_data['promo_codes']);
            // If all the promo codes don't exist, then set a default one so we get search results at the next page.
            if (array_key_exists('0', $post_data['promo_codes']) === false) {
                //$post_data['promo_codes'] = array('0'=>'');
            	//$post_data['promo_codes'] = array('0'=>'TAKE15PCTOFF');
            	$post_data['promo_codes'] = array();
            	
            }
        }

        if (count($post_data['promo_codes']) < 1) {
            $post_data['promo_codes'] = array();
            if (isset($_SESSION['email_signup']) && $_SESSION['email_signup'] == $this->api_url_array['brand'] && strlen($this->api_url_array['signup_promo_code']) > 0) {
                $post_data['promo_codes'][0] = $this->api_url_array['signup_promo_code'];
                unset($_SESSION['email_signup']);
            }
        }

        // Rental Location
        $rental_response_array = AdvLocations_Helper::getLocation($post_data['rental_location_id']);
        // Add rental_location_name to the post_data array
        $post_data['rental_location_name'] = $rental_response_array['LocationName'].' ('.$rental_response_array['City'].', '.$rental_response_array['State'].' '.$rental_response_array['CountryName'].') - '.$rental_response_array['LocationCode'];

        $post_data['BrandName'] = $rental_response_array['BrandName'];

        // Return Location 
        $return_response_array = AdvLocations_Helper::getLocation($post_data['return_location_id']);
        // Add return_location_name to the post_data array
        $post_data['return_location_name'] = $return_response_array['LocationName'].' ('.$return_response_array['City'].', '.$return_response_array['State'].' '.$return_response_array['CountryName'].') - '.$return_response_array['LocationCode'];
    

        AdvRez_Flow_Storage::reservation_flow_delete_cookie('search');
        // Set the user cookie for 10 years
        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        AdvRez_Flow_Storage::reservation_flow_set_cookie('adv_userbookmark', $post_data, time() + (185 * 24 * 60 * 60));
        // AdvRez_Flow_Storage::reservation_flow_save('adv_userbookmark', $post_data);

        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        AdvRez_Flow_Storage::reservation_flow_delete('search');


        // Set adv_login_member_number to 0 as default, meaning customer is not logged in.
        $adv_login_member_number = 0;
        // Check if the customer is logged in or not, if they are set the member number.
        if(isset($_SESSION['adv_login']->memberNumber)) {
            $adv_login_member_number = $_SESSION['adv_login']->memberNumber;
        }


        $request_query = [
            // 'HTTP_ORIGIN' => $_SERVER['HTTP_ORIGIN'],
            // 'adv_reservation' => $post_data['adv_reservation'],
            'rental_location_id' => $post_data['rental_location_id'],
            'return_location_id' => $post_data['return_location_id'],
            'pickup_date' => $post_data['pickup_date'],
            'pickup_time' => $post_data['pickup_time'],
            'dropoff_date' => $post_data['dropoff_date'],
            'dropoff_time' => $post_data['dropoff_time'],
            'age' => $post_data['age'],
            'promo_codes' => $post_data['promo_codes'],
            'vehicleOptions' => $post_data['vehicleOptions'],
            'adv_login_member_number' => $adv_login_member_number
        ];

        $rates_endpoint = '/getRates';
        if (isset($post_data['rate_id']) && isset($post_data['class_code'])) {
            $rates_endpoint = '/updateRates';
            $request_query['rate_id'] = $post_data['rate_id'];
            $request_query['class_code'] = $post_data['class_code'];
        }

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . $rates_endpoint, $request_query);

        $tmp_response_arrays = json_decode($response_contents, true);

        $response_arrays = $tmp_response_arrays['Payload'];

        $request_query = [
                    'rental_location_id' => $post_data['rental_location_id'],
                    'rental_location_ids' => $post_data['rental_location_id'] . ',' . $post_data['return_location_id'],
                    ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/getLocations', $request_query);

        $req_locs_response_array_tmp = json_decode($response_contents, true);
        $location_1 = $req_locs_response_array_tmp['d'][0];

        if (count($req_locs_response_array_tmp['d']) > 1) {
            $location_2 = $req_locs_response_array_tmp['d'][1];

            if ($location_1['LocationCode'] == $post_data['rental_location_id']) {
                $rental_location_array['RentalLocation'] = $location_1;
                $return_location_array['ReturnLocation'] = $location_2;                
            } else {
                $rental_location_array['RentalLocation'] = $location_2;
                $return_location_array['ReturnLocation'] = $location_1;                
            }

        } else {
            $rental_location_array['RentalLocation'] = $location_1;
            $return_location_array['ReturnLocation'] = $location_1;
        }

        $pickup_time = $post_data['pickup_time'];
        $pickup_date = $post_data['pickup_date'];
        $dropoff_time = $post_data['dropoff_time'];
        $dropoff_date = $post_data['dropoff_date'];

        $pickupToDate = date_create_from_format("mdY", $pickup_date);
        $pickup_date_formatted = $pickupToDate->format("l - F, d, Y");

        $tag_manager_pickup_date =  $pickupToDate->format("Y-m-d");

        $dropoffToDate = date_create_from_format("mdY", $dropoff_date);
        $dropoff_date_formatted = $dropoffToDate->format("l - F, d, Y");

        $tag_manager_dropoff_date = $dropoffToDate->format("Y-m-d");

        $rental_location = $rental_location_array['RentalLocation'];
        $return_location = $return_location_array['ReturnLocation'];

        $rental_location_id = $post_data['rental_location_id'];
        $rental_location_name = $rental_location['LocationName'];
        $rental_location_street = $rental_location['AddLine1'];
        $rental_location_city = $rental_location['City'];
        $rental_location_state = trim(strlen($rental_location['State'])) == 0 ? $rental_location['Country'] : $rental_location['State'];
        $rental_location_zip = $rental_location['PostalCode'];
        $rental_location_country = trim(strlen($rental_location['Country'])) == 0 ? $rental_location['State'] : $rental_location['Country'];

        $return_location_id = $post_data['return_location_id'];
        $return_location_name = $return_location['LocationName'];
        $return_location_street = $return_location['AddLine1'];
        $return_location_city = $return_location['City'];
        $return_location_state = trim(strlen($return_location['State'])) == 0 ? $return_location['Country'] : $return_location['State'];
        $return_location_zip = $return_location['PostalCode'];
        $return_location_country = trim(strlen($return_location['Country'])) == 0 ? $return_location['State'] : $return_location['Country'];

        $post_data['rental_location_name'] = $rental_location_name;
        $post_data['rental_location_street'] = $rental_location_street;
        $post_data['rental_location_city'] = $rental_location_city;
        $post_data['rental_location_state'] = $rental_location_state;
        $post_data['rental_location_zip'] = $rental_location_zip;
        $post_data['rental_location_country'] = $rental_location_country;

        $post_data['return_location_name'] = $return_location_name;
        $post_data['return_location_street'] = $return_location_street;
        $post_data['return_location_city'] = $return_location_city;
        $post_data['return_location_state'] = $return_location_state;
        $post_data['return_location_zip'] = $return_location_zip;
        $post_data['return_location_country'] = $return_location_country;
// error_log('response_arrays: ' . print_r($response_arrays, true));
        if (isset($response_arrays['RateProduct'][0])) {
            $post_data['vehicle_count'] = count($response_arrays['RateProduct']);
        } else {
            $post_data['vehicle_count'] = 1;
        }
        
// error_log('$post_data[vehicle_count]: ' . print_r($post_data['vehicle_count'], true));

        $post_data['pickup_date_formatted'] = $pickup_date_formatted;
        $post_data['pickup_date'] = $pickup_date;
        $post_data['pickup_time'] = $pickup_time;
        $post_data['pickup_date_time'] = $post_data['pickup_date'] . ' ' . substr($post_data['pickup_time'], 0, 5) . ' ' . substr($post_data['pickup_time'], 5);
        $post_data['rental_location_name'] = $rental_location_name;
        $post_data['rental_location_street'] = $rental_location_street;
        $post_data['rental_location_city'] = $rental_location_city;
        $post_data['rental_location_state'] = $rental_location_state;
        $post_data['rental_location_country'] = $rental_location_country;
        $post_data['rental_location_zip'] = $rental_location_zip;
        $post_data['rental_latitude'] = $rental_location_array['RentalLocation']['Latitude'];
        $post_data['rental_longitude'] = $rental_location_array['RentalLocation']['Longitude'];
        $post_data['rental_phone1'] = (isset($rental_location_array['RentalLocation']['Phone1']) ? $rental_location_array['RentalLocation']['Phone1'] : '');
        $post_data['rental_phone2'] = (isset($rental_location_array['RentalLocation']['Phone2']) ? $rental_location_array['RentalLocation']['Phone2'] : '');
        $post_data['rental_fax'] = (isset($rental_location_array['RentalLocation']['Fax']) ? $rental_location_array['RentalLocation']['Fax'] : '');

        $post_data['dropoff_date_formatted'] = $dropoff_date_formatted;
        $post_data['dropoff_date'] = $dropoff_date;
        $post_data['dropoff_time'] = $dropoff_time;
        $post_data['dropoff_date_time'] = $post_data['dropoff_date'] . ' ' . substr($post_data['dropoff_time'], 0, 5) . ' ' . substr($post_data['dropoff_time'], 5);
        $post_data['return_location_name'] = $return_location_name;
        $post_data['return_location_street'] = $return_location_street;
        $post_data['return_location_city'] = $return_location_city;
        $post_data['return_location_state'] = $return_location_state;
        $post_data['return_location_zip'] = $return_location_zip;
        $post_data['return_location_country'] = $return_location_country;
        $post_data['return_latitude'] = $return_location_array['ReturnLocation']['Latitude'];
        $post_data['return_longitude'] = $return_location_array['ReturnLocation']['Longitude'];
        $post_data['return_phone1'] = (isset($return_location_array['ReturnLocation']['Phone1']) ? $return_location_array['ReturnLocation']['Phone1'] : '');
        $post_data['return_phone2'] = (isset($return_location_array['ReturnLocation']['Phone2']) ? $return_location_array['ReturnLocation']['Phone2'] : '');
        $post_data['return_fax'] = (isset($return_location_array['ReturnLocation']['Fax']) ? $return_location_array['ReturnLocation']['Fax'] : '');

        AdvRez_Flow_Storage::reservation_flow_set_cookie('search', $post_data);
        AdvRez_Flow_Storage::reservation_flow_save('search', $post_data);

        $tmp_choose_list_array = AdvRez_Helper::getChooseValues($response_arrays);

        //set display options
        $_SESSION['DisplayOptions']= $response_arrays['Options']['DisplayOptions'];

        // Check if it's a multi-dimentional array, if not then add the array to the session variable
        if (count($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra']) == count($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'], COUNT_RECURSIVE)) {

            // Check if the array exists. 
            if (isset($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'])) {
                // If there's a ONEWAY drop charge then add it to the session.
                if (in_array("ONEWAY", $response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'])) {
                    $_SESSION['enhance']['OneWay'] = $response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'];
                }
            }

        } else {
            // Loop through the Extras and check if there's a ONEWAY drop charge.
            // If there is then add it to the session.
            foreach($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'] as $key => $value) {
                // Check if ONEWAY is in the array
                if (in_array("ONEWAY", $value)) {
                    // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                    $_SESSION['enhance']['OneWay'] = $value;
                }
            }
        }

        if (isset($post_data['age'])) {
            $_SESSION['search']['age'] = $post_data['age'];
        }
        elseif (empty($post_data['age']) || $post_data['age'] == '') {
            $_SESSION['search']['age'] = '25+';
        }

        // $choose_full_array[] = array('e' => 'stuff');
        $choose_full_array = AdvRez_Helper::getChoose3Vehicles($tmp_choose_list_array);

        AdvRez_Flow_Storage::reservation_flow_save('choose', $choose_full_array);
        for ($x=0; $x <= count($choose_full_array) - 2; $x++) {
            $choose_sort_array[$x] = $x;
        }
        AdvRez_Flow_Storage::reservation_flow_save('choose-sort', $choose_sort_array);

        AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $response_arrays['PromoCodeResponse']);
    }

    public function processEnhancePage($vehicleSelectedArray = array()) {

        // If the session is empty then return the URL to the javascript so we get redirect to the home page
        // This goes to the adv_rez.js.
        if(empty($_SESSION)) {
            $URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
            $_SESSION['session_expired'] = "yes";
            return array('redirect' => $URL);
        }

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        if (count($vehicleSelectedArray) > 0) {
            $clean_post_data = $vehicleSelectedArray;

        } else {
            $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        }

        /****** UNSET Abandonment promocode if one of the restricted car classes was chosen ******/
        $car_restrictions = array('ECAR', 'CCAR', 'XXAR');
        if (in_array($clean_post_data['class_code'], $car_restrictions)) {
            if (count($_SESSION['search']['promo_codes']) == 1 && (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($_SESSION['search']['promo_codes'][0])))) {
                unset($_SESSION['search']['promo_codes'][0]);
                unset($_SESSION['abandonment']['abandonment_promocode']);
            }
        }

        unset($_SESSION['reserve']['express_checkout_complete_flag']);
        unset($_SESSION['reserve']['vehicleOptions']);
        $_SESSION['reserve']['ClassCode'] = $clean_post_data['class_code'];
        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        $prepaid = 'N';
        if ($clean_post_data['payment_type'] == 'prepaid') {
            $prepaid = 'Y';
        }

       $request_query = [
            'rental_location_id' => $_SESSION['search']['rental_location_id'],
            'class_code' => $clean_post_data['class_code'],
        ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestExtras', $request_query, false);

       $tmp_response_arrays = json_decode($response_contents, true);
       $response_arrays = $tmp_response_arrays['d'];

        $_SESSION['enhance']['RateID'] = $clean_post_data['rate_id'];
        $_SESSION['enhance']['ClassCode'] = $clean_post_data['class_code'];
        $_SESSION['enhance']['Prepaid'] = $clean_post_data['prepaid'];
        $_SESSION['enhance']['payment_type'] = $clean_post_data['payment_type'];
        $_SESSION['enhance']['vehicleIndex'] = $clean_post_data['vehicleIndex'];

        if (count($response_arrays) > 0 ) {
            $_SESSION['enhance']['DailyExtra'] = $response_arrays;
        }
        if (isset($clean_post_data['promo_primary']) ) {
            $_SESSION['enhance']['promo_primary'] = $clean_post_data['promo_primary'];
        }
        if (isset($clean_post_data['kayakclickid']) ) {
            $_SESSION['enhance']['kayakclickid'] = $clean_post_data['kayakclickid'];
        }

// error_log('processEnhancePage $_SESSION[enhance]: ' . print_r($_SESSION['enhance'], true));

        return array('content' => 'success');

    }

	public function processReservePage() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $clean_post_data = [];
        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        // If cart abandonment is applied and there's renters info, then set it so we don't lose it on the 
        // page refresh.
        if (!isset($_SESSION['adv_login']->memberNumber) && $_SESSION['adv_login']->memberNumber == "") {
            if (isset($clean_post_data['firstName']) && $clean_post_data['firstName'] !== "") {
                $_SESSION['renter']['renter_first'] = $clean_post_data['firstName'];
            }
            if (isset($clean_post_data['lastName']) && $clean_post_data['lastName'] !== "") {
                $_SESSION['renter']['renter_last'] = $clean_post_data['lastName'];
            }
            if (isset($clean_post_data['email']) && $clean_post_data['email'] !== "") {
                 $_SESSION['renter']['renter_email_address'] = $clean_post_data['email'];
            }
        }

        $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        $promo_codes[] = '';

        if (!is_array($_SESSION['search']['promo_codes'])) {
            $_SESSION['search']['promo_codes'] = array();
        }

        $available_awardcode = '';
        if (!isset($_SESSION['free_pitstop_removed'])) {
            $_SESSION['free_pitstop_removed'] = "False";
        }
        if (!isset($_SESSION['free_pitstop_applied'])) {
            $_SESSION['free_pitstop_applied'] = "False";
        }
        if (isset($_SESSION['free_pitstop_applied']) && $_SESSION['free_pitstop_applied'] !== "False") {
            if (in_array($_SESSION['free_pitstop_applied'], $clean_post_data['deletePromoCode'])) {
                $_SESSION['free_pitstop_removed'] = "True";
            }
        }

        if (isset($_SESSION['adv_login']->memberNumber) && $_SESSION['adv_login']->memberNumber !== "" &&  $_SESSION['free_pitstop_applied'] == "False") {
            $available_member_awards = AdvAwards_Helper::getAvailableMemberAwards($_SESSION['adv_login']->memberNumber);

            for ($x=0; $x < count($available_member_awards['d']); $x++) {

                if ($available_member_awards['d'][$x]['AutoApply'] == "True") {
                    $available_awardcode = $available_member_awards['d'][$x]['AwardCode'];
                    if (!in_array($available_awardcode, $_SESSION['search']['promo_codes'])) {
                        array_push($_SESSION['search']['promo_codes'], $available_awardcode);
                    }

                    $_SESSION['free_pitstop_applied'] = $available_awardcode;
                    break;
                }
            }
        }

        $_SESSION['search']['promo_codes'] = !empty($_SESSION['search']['promo_codes']) ? array_filter($_SESSION['search']['promo_codes']) : array();

        // If no other promocode but the Cart Abandoment promocode is set, make sure it gets set on the reserve page.
        if (count($_SESSION['search']['promo_codes']) == 0 && (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($this->api_url_array['abandonment_promocode'])))) {
            // If the car class is not restricted then set the abandonment promocode
            $car_restrictions = array('ECAR', 'CCAR', 'XXAR');
            if (!in_array($clean_post_data['ClassCode'], $car_restrictions)) {
                $_SESSION['search']['promo_codes'][0] = $_SESSION['abandonment']['abandonment_promocode'];
            }
        }

        if(isset($clean_post_data['expresswayFlow']) && $clean_post_data['expresswayFlow'] == 1 && isset($_SESSION['adv_login']->memberNumber)){

            if ($clean_post_data['expresswayFlowPromos'] !== "") {
                $exp_promo_codes = explode(',', $clean_post_data['expresswayFlowPromos']);

                //case only for enhance page
                if(isset($clean_post_data['expresswayEnhance'])) {
                    $old_promos = $_SESSION['search']['promo_codes'];
                    if(count($old_promos) > 0) {
                        $exp_promo_codes = array_merge($old_promos,$exp_promo_codes);
                        
                        $exp_promo_codes = array_unique($exp_promo_codes);
                    }
                }
                $_SESSION['search']['promo_codes'] = $exp_promo_codes;

                if (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($this->api_url_array['abandonment_promocode']))) {
                    if (!in_array($_SESSION['abandonment']['abandonment_promocode'], $_SESSION['search']['promo_codes'])) {
                        array_unshift($_SESSION['search']['promo_codes'], $this->api_url_array['abandonment_promocode']);
                    }
                }
       
            }
            else if($clean_post_data['expresswayFlowPromos'] == '') {
               
                //case only for enhance page
                if(isset($clean_post_data['expresswayEnhance']) && isset($clean_post_data['isFreePromoUpdated']) && $clean_post_data['isFreePromoUpdated'] == 0 ) {
                    $old_promos = $_SESSION['search']['promo_codes'];
                    if(count($old_promos) > 0) {
                        $_SESSION['search']['promo_codes'] = $old_promos;
                    }
                } 
                else {
                    $_SESSION['search']['promo_codes'] = array();
                }
            }

            if (isset($clean_post_data['deletePromoCode']) && isset($_SESSION['search']['promo_codes'])) {
                for ($x=0; $x < count($clean_post_data['deletePromoCode']); $x++) {
                    for ($y=0; $y < count($_SESSION['search']['promo_codes']); $y++) {
                         if ($_SESSION['search']['promo_codes'][$y] == $clean_post_data['deletePromoCode'][$x]) {
                            //array_push($keep_choose_promos, $_SESSION['choose_promos']['PromoCodeEntered'][$y]);
                            unset($_SESSION['search']['promo_codes'][$y]);
                        }
                    }
                }
                if (isset($_SESSION['search']['promo_codes']) && count($_SESSION['search']['promo_codes']) > 0) {
                   array_values($_SESSION['search']['promo_codes']);
                }
            }

            if (isset($clean_post_data['deletePromoCode']) && $_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'] == "") {
                //$delete_promo_codes = explode(',',$clean_post_data['deletePromoCode']);
                $keep_choose_promos = array();
                for ($x=0; $x < count($clean_post_data['deletePromoCode']); $x++) {
                    for ($y=0; $y < count($_SESSION['choose_promos']['PromoCodeEntered']); $y++) {
                        if ($_SESSION['choose_promos']['PromoCodeEntered'][$y]['PromoCode'] == $delete_promo_codes[$x]) {
                            unset($_SESSION['choose_promos']['PromoCodeEntered'][$y]);
                        }
                    }
                }
                if (isset($_SESSION['choose_promos']['PromoCodeEntered']) && count($_SESSION['choose_promos']['PromoCodeEntered']) > 0){
                   array_values($_SESSION['choose_promos']['PromoCodeEntered']);
                }

            } elseif (isset($clean_post_data['deletePromoCode']) && isset($_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'])) {

                for ($x=0; $x < count($clean_post_data['deletePromoCode']); $x++) {
                    if ($_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'] == $clean_post_data['deletePromoCode'][$x]) {
                        $_SESSION['choose_promos']['PromoCodeEntered'] = array();
                    }
                }
            }
        } 

        // promocodes get from reserve page  
        if(isset($clean_post_data['reservePromoReload'])) {
           $_SESSION['search']['promo_codes'] = $clean_post_data['promo_codes'];
        }

        if (isset($_SESSION['search']['promo_codes'])) {
            $promo_codes = $this->getPromoCodes($_SESSION['search']['promo_codes']);
        }

        $reserve_vehicle_index = $clean_post_data['vehicleIndex'];

        $prepaid = 'N';
        $payment_type_prefix = 'R';
        if (isset($_SESSION['enhance']['payment_type'])) {
            if ($_SESSION['enhance']['payment_type'] == 'prepaid') {
                $prepaid = 'Y';
                $payment_type_prefix = 'P';
            }
        }

        if (!isset($_SESSION['tmp_vehicleOptions'])) {
            $_SESSION['tmp_vehicleOptions'] = $clean_post_data['vehicleOptions'];
        } else {

            if (!isset($clean_post_data['vehicleOptions'])) {
                $vehicleOptions = array('0' => '');
            } else {
                $vehicleOptions = $clean_post_data['vehicleOptions'];
            }

            $vehicleOptions_array_diff = array_values(array_diff($_SESSION['tmp_vehicleOptions'], $vehicleOptions));

            if ((count($vehicleOptions_array_diff > 0) && count($_SESSION['choose_promos']['PromoCodeEntered']) > 0)) {

                for ($x=0; $x < count($vehicleOptions_array_diff); $x++) {

                    if (isset($_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'])) {
                        $promoCodeEntered_array = $_SESSION['choose_promos']['PromoCodeEntered'];
                        if ($promoCodeEntered_array['PromoTSDCode'] == $vehicleOptions_array_diff[$x]) {
                            $promocode_to_remove = $_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'];
                        }
                    } else {
                        $promoCodeEntered_array = $_SESSION['choose_promos']['PromoCodeEntered'][$x];

                        $key = array_search($vehicleOptions_array_diff[$x], $promoCodeEntered_array);

                        if (isset($key) && $key !== false) {
                            // $promocode_to_remove = $promoCodeEntered;
                            $promocode_to_remove = $_SESSION['choose_promos']['PromoCodeEntered'][$x]['PromoCode'];
                        }
                    }

                    if (isset($promocode_to_remove) && $promocode_to_remove !== "") {
                        $key_to_unset = array_search($promocode_to_remove, $promo_codes);

                        if ($key_to_unset) {
                            unset($promo_codes[$key_to_unset]);
                            $promo_codes = array_values($promo_codes);
                            unset($_SESSION['search']['promo_codes'][$key_to_unset]);
                            $_SESSION['search']['promo_codes'] = array_values($_SESSION['search']['promo_codes']);
                        }
                    }

                    $promocode_to_remove = '';

                }

                 $_SESSION['tmp_vehicleOptions'] = $clean_post_data['vehicleOptions'];

            }

        }

        $vehicleOptions = isset($clean_post_data['vehicleOptions']) ? $clean_post_data['vehicleOptions'] : array( 0 => '');
        $daily_rate = $_SESSION['choose'][$clean_post_data['vehicleIndex']][$payment_type_prefix . 'Rate1PerDay'];

        if (empty($vehicleOptions)) {
            $vehicleOptions = array( 0 => '');
        }
        
        //Age Dropdown code
        $this->setUserAgeCode();
        if(isset($_SESSION['search']['age']) && $_SESSION['search']['age_category'] == 'UAGE') {
            $drivers_age = $_SESSION['search']['age_category'];
            foreach ($vehicleOptions as $key => $value) {
                if ($value == 'UAGE') {
                    unset($vehicleOptions[$key]);
                    unset($_SESSION['reserve']['vehicleOptions'][$key]);
                }
            }
            if ($drivers_age == 'UAGE') {
                $vehicleOptions[] = 'UAGE';
                $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
            }
        }
        elseif (empty($_SESSION['search']['age']) || $_SESSION['search']['age'] == '') {
            $_SESSION['search']['age_category'] = '';
            $_SESSION['search']['age'] = '25+';
            $drivers_age = $_SESSION['search']['age_category'];
        }

        if (empty($promo_codes)) {
            $promo_codes = array();
        }

        // Automatically add the Free Pitstop award if they are logged in and it's avaliable
        if (isset($available_awardcode) && $available_awardcode !== "") {
            if (!in_array($available_awardcode, $promo_codes)) {
                 array_push($promo_codes, $available_awardcode);

                 // This code was added so the avaliable award code is added to input box on reserve page
                 array_push($_SESSION['search']['promo_codes'], $available_awardcode);
            }
        }

        // Set adv_login_member_number to 0 as default, meaning customer is not logged in.
        $adv_login_member_number = 0;
        // Check if the customer is logged in or not, if they are set the member number.
        if(isset($_SESSION['adv_login']->memberNumber)) {
            $adv_login_member_number = $_SESSION['adv_login']->memberNumber;
        }

        $request_query = [
                    'rental_location_id' => $_SESSION['search']['rental_location_id'],
                    'return_location_id' => $_SESSION['search']['return_location_id'],
                    'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                    'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                    'rate_id' => $clean_post_data['RateID'],
                    'class_code' => $clean_post_data['ClassCode'],
                    'prepaid' => 'Y',
                    'promo_codes' => $promo_codes,
                    'vehicleOptions' => $vehicleOptions,
                    'daily_rate' => $daily_rate,
                    'adv_login_member_number' => $adv_login_member_number,
        ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);

        $tmp_req_bil_prepaid_response_array = json_decode($response_contents, true);

        if (isset($tmp_req_bil_prepaid_response_array['Payload'])) {
            $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array['Payload'];
        } else {
            $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array;
        }
        
       

       $request_query = [
                    'rental_location_id' => $_SESSION['search']['rental_location_id'],
                    'return_location_id' => $_SESSION['search']['return_location_id'],
                    'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                    'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                    'rate_id' => $clean_post_data['RateID'],
                    'class_code' => $clean_post_data['ClassCode'],
                    'prepaid' => 'N',
                    'promo_codes' => $promo_codes,
                    'vehicleOptions' => $vehicleOptions,
                    'daily_rate' => $daily_rate,
                    'adv_login_member_number' => $adv_login_member_number,
        ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);

        $tmp_req_bil_counter_response_array = json_decode($response_contents, true);

        if (isset($tmp_req_bil_counter_response_array['Payload'])) {
            $req_bil_counter_response_array = $tmp_req_bil_counter_response_array['Payload'];
        } else {
            $req_bil_counter_response_array = $tmp_req_bil_counter_response_array;
        }

        $_SESSION['choose'][$reserve_vehicle_index]['RentalDays'] = $req_bil_prepaid_response_array['RentalDays'];

        if (strtoupper($req_bil_counter_response_array['RatePlan']) == 'WEEKLY') {
            $rate_amount = $req_bil_counter_response_array['RatePeriod']['AmtPerWeek'];
        } else {
            $rate_amount = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];
        }

        $payment_type_prefix = 'R';
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateAmount'] = $rate_amount;
        //Setting getRates DiscountPercent to requestBill DiscountPercent
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateDiscount'] = $req_bil_counter_response_array['RateDiscount'];
        $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $req_bil_counter_response_array['DiscountPercent'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateCharge'] = $req_bil_counter_response_array['RateCharge'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalTaxes'] = $req_bil_counter_response_array['TotalTaxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalExtras'] = $req_bil_counter_response_array['TotalExtras'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalCharges'] = $req_bil_counter_response_array['TotalCharges'];
        $_SESSION['choose'][$reserve_vehicle_index]['Taxes'] = $req_bil_counter_response_array['Taxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'] = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];

 
        if (strtoupper($req_bil_prepaid_response_array['RatePlan']) == 'WEEKLY') {
            $rate_amount = $req_bil_prepaid_response_array['RatePeriod']['AmtPerWeek'];
        } else {
            $rate_amount = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];
        }

        // Check if DailExtra is an array, if not then there is no DailyExtras
        if (is_array($req_bil_counter_response_array['DailyExtra'])) {


            // Check if it's a multi-dimensional array, if not then add the array to the session variable
            if (count($req_bil_counter_response_array['DailyExtra']) == count($req_bil_counter_response_array['DailyExtra'], COUNT_RECURSIVE)) {

                // If there's a ONEWAY drop charge then add it to the session.
                if (in_array("ONEWAY", $req_bil_counter_response_array['DailyExtra'])) {
                    $_SESSION['enhance']['ROneWay'] = $req_bil_counter_response_array['DailyExtra'];
                    // Unset the DailyExtra if the ONEWAY drop charge is the only extra 
                    // so we don't get double drop charges on the reserve page.
                    unset($req_bil_counter_response_array['DailyExtra']);
                }

            } else {

                // If there's a ONEWAY drop charge then add it to the session.
                if (count($req_bil_counter_response_array['DailyExtra']) > 0) {
                    // Loop through the Extras and check if there's a ONEWAY drop charge.
                    // If there is then add it to the session.
                    foreach($req_bil_counter_response_array['DailyExtra'] as $key => $value) {
                        // Check if ONEWAY is in the array
                        if (in_array("ONEWAY", $value)) {
                            // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                            $_SESSION['enhance']['ROneWay'] = $value;
                            // Unset the ONEWAY drop charge so we don't get double drop charges on the reserve page.
                            unset($req_bil_counter_response_array['DailyExtra'][$key]);
                        }
                    }
                }

            } // End recursive if

        } // End is_array check

        // If it's not prepaid, then add the DailyExtra's to the session
        if ($prepaid == "N") {
            $tmp_array = $req_bil_counter_response_array['DailyExtra'];
            // Check if it's a multi-dimentional array, if it's not then make it so
            if (count($tmp_array) == count($tmp_array, COUNT_RECURSIVE)) {
                $tmp_array = array('0' => $tmp_array);
            }
            $_SESSION['reserve']['DailyExtra'] = array_values($tmp_array);
        }
      
        $payment_type_prefix = 'P';
       
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateAmount'] = $rate_amount;
        //Setting getRates DiscountPercent to requestBill DiscountPercent

        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateDiscount'] = $req_bil_prepaid_response_array['RateDiscount'];
        $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $req_bil_prepaid_response_array['DiscountPercent'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateCharge'] = $req_bil_prepaid_response_array['RateCharge'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalTaxes'] = $req_bil_prepaid_response_array['TotalTaxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalExtras'] = $req_bil_prepaid_response_array['TotalExtras'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalCharges'] = $req_bil_prepaid_response_array['TotalCharges'];
        $_SESSION['choose'][$reserve_vehicle_index]['Taxes']['Prepaid'] = $req_bil_prepaid_response_array['Taxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'] = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];

        // Check if DailExtra is an array, if not then there is no DailyExtras
        if (is_array($req_bil_prepaid_response_array['DailyExtra'])) {

            // Check if it's a multi-dimensional array, if not then add the array to the session variable
            if (count($req_bil_prepaid_response_array['DailyExtra']) == count($req_bil_prepaid_response_array['DailyExtra'], COUNT_RECURSIVE)) {

                // If there's a ONEWAY drop charge then add it to the session.
                if (in_array("ONEWAY", $req_bil_prepaid_response_array['DailyExtra'])) {
                    $_SESSION['enhance']['POneWay'] = $req_bil_prepaid_response_array['DailyExtra'];
                    // Unset the DailyExtra if the ONEWAY drop charge is the only extra 
                    // so we don't get double drop charges on the reserve page.
                    unset($req_bil_prepaid_response_array['DailyExtra']);
                }

            } else {

                if (count($req_bil_prepaid_response_array['DailyExtra']) > 0) {
                    // Loop through the Extras and check if there's a ONEWAY drop charge.
                    // If there is then add it to the session.
                    foreach($req_bil_prepaid_response_array['DailyExtra'] as $key => $value) {
                        // Check if ONEWAY is in the array
                        if (in_array("ONEWAY", $value)) {
                            // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                            $_SESSION['enhance']['POneWay'] = $value;
                            // Unset the ONEWAY drop charge so we don't get double drop charges on the reserve page.
                            unset($req_bil_prepaid_response_array['DailyExtra'][$key]);
                        }
                    }
                }
            } //End recursive if

        } // End is_array check

        $_SESSION['reserve']['RateID'] = $clean_post_data['RateID'];
        $_SESSION['reserve']['ClassCode'] = $clean_post_data['ClassCode'];
        $_SESSION['reserve']['Prepaid'] = $prepaid;
        $_SESSION['reserve']['vehicleEnhanceType'] = $clean_post_data['vehicleEnhanceType'];
        $_SESSION['reserve']['vehicleIndex'] = $reserve_vehicle_index;
        $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;

        // If it's not prepaid, then add the DailyExtra's to the session
        if ($prepaid == "Y") {

            $tmp_array = $req_bil_prepaid_response_array['DailyExtra'];

            // Check if it's a multi-dimentional array, if it's not then make it so
            if (count($tmp_array) == count($tmp_array, COUNT_RECURSIVE)) {
                $tmp_array = array('0' => $tmp_array);
            }

            $_SESSION['reserve']['DailyExtra'] = array_values($tmp_array);
        }

        //Setting validatePromoStack with updated payment type/prepaid value
        if ($prepaid == 'N') {
            AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $req_bil_counter_response_array['PromoCodeResponse']);
        }
        else {
            AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $req_bil_prepaid_response_array['PromoCodeResponse']);
        }

        // Get the frequent flyer programs
        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/getFrequentFlyerPrograms', array('0' => ''));

        $frequent_flyer_programs_array = json_decode($response_contents, true);
        //print_r($frequent_flyer_programs_array);

        if (count($frequent_flyer_programs_array) > 0) {
            $airline = array();
            for ($x=0; $x < count($frequent_flyer_programs_array); $x++) {

                $airline[$x][0] = $frequent_flyer_programs_array[$x]['AirlineCode'];
                $airline[$x][1] = $frequent_flyer_programs_array[$x]['Airline'];
                
            }
            $_SESSION['reserve']['airlines'] = $airline;
        }
 
        // reserve summary updated without page reload related to modify option section
        if(isset($clean_post_data['reservesummaryupdated_without_pagereload'])) { 
            $_SESSION['enhance']['payment_type'] = ($clean_post_data['payType'] == "pay_now")?'prepaid':'';
       
            $updated_content = AdvRez_Helper::generateReserveSummaryWithUpdatedContent();
            $promo_msg_html = AdvRez_Helper::reservePromocodeMessageDsiplay();
            $promocode_section_html = AdvRez_Helper::reservePagepromocodesection();
            $promocode_button = AdvRez_Helper::modifyoptionsPopup_promocodesection();

            $res_summary_with_promo= array('content' => 'success','updated_content' => $updated_content,'promo_msg_html'=>$promo_msg_html,'promocode_section_html'=>$promocode_section_html,'vehicle_counter_total'=>$_SESSION['vehicle_counter_total'],'vehicle_prepaid_total'=>$_SESSION['vehicle_prepaid_total'],'modify_options_promos'=>$promocode_button);

            return json_encode($res_summary_with_promo);
            
        } else {
            return array('content' => 'success');
        }

    }


    public function processConfirmCompletePage() {

        // If the session is empty then return the URL to the javascript so we get redirect to the home page
        // This goes to the AdvRez_Plugin.php - ajax_advComplete_func method
        if(empty($_SESSION)) {
            $URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
            $_SESSION['session_expired'] = "yes";
            return array('redirect' => $URL);
        }

        if ($_SESSION['enhance']['payment_type'] == 'prepaid') {
            $is_prepaid = true;
        } else {
            $is_prepaid = false;
        }

        // If the price is 0 or less then redirect customer to the home page
        if (($is_prepaid && $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PTotalCharges'] <= 0) || (!$is_prepaid && $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RTotalCharges'] <= 0)) {
            $URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
            $_SESSION['session_expired'] = "yes";
            return array('redirect' => $URL);
        }

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        //error_log('post_data: ' . print_r($post_data, true));
        // Muhammad - Save Frequent Flyer (HAWAIIAN AIRLINES PROJECT)
        // Get the value from form and save it in session to be used on confirmation
        $frequentFlyerNumber = $post_data['frequentFlyerNumber'];
        $airline =  $post_data['airline'];
        $airlineNumber =  $post_data['airlineNumber'];

        // Initialize Frequent Flyer and Airline with empty string in session
        $_SESSION['reserve']['frequentFlyerNumber'] = "";
        $_SESSION['reserve']['airline'] = "";

        // Check and add Frequent Flyer number & Airline only if Frequent flyer number is provided
        if(isset($frequentFlyerNumber) && !is_null($frequentFlyerNumber) && $frequentFlyerNumber != "")
        {
            $_SESSION['reserve']['frequentFlyerNumber'] = $frequentFlyerNumber;
            if(isset($airline) && !is_null($airline) && $airline != "")
            {
                $_SESSION['reserve']['airline'] = $airline;
            }
        }
        
        if(isset($airlineNumber) && !is_null($airlineNumber) && $airlineNumber != "")
        {
            $_SESSION['reserve']['airlineNumber'] = $airlineNumber;
        }

        $drivers_age = $this->calcDriverAge($post_data['dob'], $post_data['pickup_date_comparison']);
        
       /* if ($drivers_age == 'under21') {
            return array('error' => 'Under 21', 'error_code'=> 'AGE_UNDER_21_ERR');
        } */
         if ($drivers_age == 'under21' || $drivers_age == 'under18') {
            return array('error' => 'Under 21', 'ageError'=>1, 'errorMsg'=> 'Driver under 21 may not rent a car.');
        } 

        $vehicleOptions = $_SESSION['reserve']['vehicleOptions'];
        
        // removing following loop to unset uage for hotfix of age param
        /*
        foreach ($vehicleOptions as $key => $value) {

            if ($value == 'UAGE') {
                unset($vehicleOptions[$key]);
                unset($_SESSION['reserve']['vehicleOptions'][$key]);
            }
            if ($value == 'UAGEJR') {
                unset($vehicleOptions[$key]);
                unset($_SESSION['reserve']['vehicleOptions'][$key]);
            }
        }*/

        // if ($drivers_age == 'under25') {
        //     $vehicleOptions[] = 'UAGE';
        //     $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
        // } elseif ($drivers_age == 'under21') {
        //     $vehicleOptions[] = 'UAGEJR';
        //     $_SESSION['reserve']['vehicleOptions'] = array_values($vehicleOptions);
        // }

        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        if ($post_data['pay_total'] == 'pay_later') {
            $prepaid = 'N';
            $payment_type_prefix = 'R';
        } else {
            $prepaid = 'Y';
            $payment_type_prefix = 'P';
        }

        $abandonment_promocode = strtolower(trim($this->api_url_array['abandonment_promocode']));

        $promo_codes = array_map(function($x){
            return strtolower(trim($x));
        },$post_data['promot_codes']);
  
        // If no other promocode but the Cart Abandoment promocode is set, make sure it gets set on the confirm page.
        if ($post_data['promot_codes'][0] == "" && (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($this->api_url_array['abandonment_promocode'])))) {
               // If the car class is not restricted then set the abandonment promocode
             $car_restrictions = array('ECAR', 'CCAR', 'XXAR');
            if (!in_array($_SESSION['reserve']['ClassCode'], $car_restrictions)) {
                 $post_data['promot_codes'][0] = $_SESSION['abandonment']['abandonment_promocode'];
             }
        // If the abandonment_promocode is not set, but the abandonment_promocode is in the promot_codes array, then someone entered the 
        // promocode manually on the reserve page. Remove it so it doesn't get applied.
        } elseif (count($post_data['promot_codes']) > 0 && (!isset($_SESSION['abandonment']['abandonment_promocode'])) && (is_array($post_data['promot_codes']) && in_array($abandonment_promocode, $promo_codes))) {

            for ($x=0; $x < count($post_data['promot_codes']); $x++) {
                if (strtolower($post_data['promot_codes'][$x]) == $abandonment_promocode) {
                     unset($post_data['promot_codes'][$x]);
                     $post_data['promot_codes'] = array_values($post_data['promot_codes']);
                     break;
                }
            }
         }

        $promo_codes[] = array() ;
        if (isset($post_data['promot_codes'])) {
            $promo_codes = $this->getPromoCodes($post_data['promot_codes']);

            // If the first index of the array is empty then unset it. We unset it since that technically
            // is not a promocode.
            if (count($post_data['promot_codes']) == 1 && empty($promo_codes[0])) {
                unset($promo_codes[0]);
            }

        }

        $daily_rate = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']][$payment_type_prefix . 'Rate1PerDay'];

        // Set adv_login_member_number to 0 as default, meaning customer is not logged in.
        $adv_login_member_number = 0;
        // Check if the customer is logged in or not, if they are set the member number.
        if(isset($_SESSION['adv_login']->memberNumber)) {
            $adv_login_member_number = $_SESSION['adv_login']->memberNumber;
        }

        $request_query = [
            'rental_location_id' => $_SESSION['search']['rental_location_id'],
            'return_location_id' => $_SESSION['search']['return_location_id'],
            'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
            'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
            'rate_id' => $_SESSION['reserve']['RateID'],
            'class_code' => $_SESSION['reserve']['ClassCode'],
            'prepaid' => 'Y',
            // 'promo_codes' => $post_data['promot_codes'],
            'promo_codes' => $promo_codes,
            'vehicleOptions' => $_SESSION['reserve']['vehicleOptions'],
            'daily_rate' => $daily_rate,
            'adv_login_member_number' => $adv_login_member_number
            ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);

        $tmp_req_bil_prepaid_response_array = json_decode($response_contents, true);

        // Create the temp_array
        $tmp_array = $tmp_req_bil_prepaid_response_array['Payload']['DailyExtra'];

        // Check if it's a multi-dimentional array, if it's not then make it so
        if (count($tmp_array) == count($tmp_array, COUNT_RECURSIVE)) {
            $tmp_array = array('0' => $tmp_array);
        }

        $_SESSION['confirm']['DailyExtra'] = array_values($tmp_array);

        if (isset($tmp_req_bil_prepaid_response_array['Payload'])) {
            $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array['Payload'];
        } else {
            $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array;
        }

        $request_query = [
            'rental_location_id' => $_SESSION['search']['rental_location_id'],
            'return_location_id' => $_SESSION['search']['return_location_id'],
            'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
            'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
            'rate_id' => $_SESSION['reserve']['RateID'],
            'class_code' => $_SESSION['reserve']['ClassCode'],
            'prepaid' => 'N',
            'promo_codes' => $promo_codes,
            'vehicleOptions' => $_SESSION['reserve']['vehicleOptions'],
            'daily_rate' => $daily_rate,
            'adv_login_member_number' => $adv_login_member_number
            ];


        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);

        $tmp_req_bil_counter_response_array = json_decode($response_contents, true);

        if (isset($tmp_req_bil_counter_response_array['Payload'])) {
            $req_bil_counter_response_array = $tmp_req_bil_counter_response_array['Payload'];
        } else {
            $req_bil_counter_response_array = $tmp_req_bil_counter_response_array;
        }
        
        $promo_message_html = '';
        if (isset($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']) && count($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']) > 0) {

            $output_message = '';

            if (isset($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered'][0])) { 
                foreach ($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered'] as $key => $value) {
                    if ($value['PromoStatus'] != 'OK') {
                        $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $value['PromoCode'] . '</span>' .
                                '<span class="aez-warning__additional-text">' . $value['PromoMsg'] . '</span>' .
                            '</div>' .
                        '</div>';
                    }
                }
            } elseif ($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']['PromoStatus'] != 'OK')  {
                $output_message .= '<div class="aez-warning">' .
                            '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                            '<div class="aez-warning__message">' .
                                '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']['PromoCode'] . '</span>' .
                                '<span class="aez-warning__additional-text">' . $req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']['PromoMsg'] . '</span>' .
                            '</div>' .
                        '</div>';
            }

            if (strlen(trim($output_message)) > 0) {
                $promo_message_html = '<div class="aez-warning-container">' . $output_message .
                    '<i class="fa fa-close aez-warning__close"></i></div>';
            }

        }
        
        if($promo_message_html != '') {
            return array('error'=> 'promo code error', 'error_code'=> 'PROMO_CODE_ERR');
        }

        AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $req_bil_counter_response_array['PromoCodeResponse']);

        if (strtoupper($req_bil_counter_response_array['RatePlan']) == 'WEEKLY') {
            $rate_amount_counter = $req_bil_counter_response_array['RatePeriod']['AmtPerWeek'];
            $rate_amount_prepaid = $req_bil_prepaid_response_array['RatePeriod']['AmtPerWeek'];
        } else {
            $rate_amount_counter = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];
            $rate_amount_prepaid = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];
        }

        // if ($post_data['pay_total'] == 'pay_later') {
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RRateAmount'] = $rate_amount_counter;

        // If DiscountPercent is set add it to the choose array otherwise unset it since there is no DiscountPercent
        if (isset($req_bil_counter_response_array['DiscountPercent'])) {
             $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['DiscountPercent'] = $req_bil_counter_response_array['DiscountPercent'];
        } else {
            unset($_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['DiscountPercent']);
        }

        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RRateCharge'] = $req_bil_counter_response_array['RateCharge'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RTotalTaxes'] = $req_bil_counter_response_array['TotalTaxes'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RTotalExtras'] = $req_bil_counter_response_array['TotalExtras'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RTotalCharges'] = $req_bil_counter_response_array['TotalCharges'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['Taxes'] = $req_bil_counter_response_array['Taxes'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RRate1PerDay'] = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['RRateDiscount'] = $req_bil_counter_response_array['RateDiscount'];

        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PRateAmount'] = $rate_amount_prepaid;
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PRateCharge'] = $req_bil_prepaid_response_array['RateCharge'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PTotalTaxes'] = $req_bil_prepaid_response_array['TotalTaxes'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PTotalExtras'] = $req_bil_prepaid_response_array['TotalExtras'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PTotalCharges'] = $req_bil_prepaid_response_array['TotalCharges'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['Taxes']['Prepaid'] = $req_bil_prepaid_response_array['Taxes'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PRate1PerDay'] = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];
        $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['PRateDiscount'] = $req_bil_prepaid_response_array['RateDiscount'];


        // $bookmark_search_array['promo_codes'] = $post_data['promot_codes'];

        // AdvRez_Flow_Storage::reservation_flow_set_cookie('adv_userbookmark', $bookmark_search_array, time() + ( 185 * 24 * 60 * 60));
// error_log('post_data: ' . print_r($post_data, true));
        $phone_dial_code = $post_data['phone_dial_code'];
        $phone_number = $post_data['phone_number'];
        $i = 1;
        // Save promo codes from Reserve page
        $_SESSION['search']['promo_codes'] = $post_data['promot_codes'];

        $_SESSION['renter']['renter_dob'] = $post_data['dob'];
        $_SESSION['renter']['renter_first'] = $post_data['first_name'];
        $_SESSION['renter']['renter_last'] = $post_data['last_name'];
        $_SESSION['renter']['renter_email_address'] = $post_data['email'];
        // $_SESSION['renter']['renter_home_phone'] = str_replace($phone_dial_code, "", $phone_number, $i);
        $_SESSION['renter']['renter_home_phone'] = $phone_number;
        $_SESSION['renter']['renter_home_phone_country'] = $post_data['phone_country'];
        $_SESSION['renter']['renter_home_phone_dial_code'] = $phone_dial_code;
        $_SESSION['renter']['renter_address1'] = $post_data['street_address_1'];
        $_SESSION['renter']['renter_address2'] = $post_data['street_address_2'];
        $_SESSION['renter']['renter_city'] = $post_data['city'];
        $_SESSION['renter']['renter_state'] = $post_data['state'];
        $_SESSION['renter']['renter_zip'] = $post_data['postal_code'];
        $_SESSION['renter']['renter_country'] = $post_data['country'];
     
        $_SESSION['confirm']['read_location_policy'] = (isset($post_data['read_location_policy']) ? 'Y' : 'N');
        $_SESSION['confirm']['enroll_instant_rewards'] = (isset($post_data['read_location_policy']) ? 'Y' : 'N');
        $_SESSION['confirm']['terms_and_conditions'] = (isset($post_data['read_location_policy']) ? 'Y' : 'N');
        $_SESSION['confirm']['payment_type'] = ($post_data['pay_total'] == 'pay_now' ? 'prepaid' : 'counter');
        $_SESSION['reserve']['save_user_profile_info'] = (isset($post_data['save_user_profile_info']) ? 1 : '');
        
        $pickupToDate = date_create_from_format("mdY", $_SESSION['search']['pickup_date']);
        $tag_manager_pickup_date = $pickupToDate->format("Y-m-d");

        $dropOffToDate = date_create_from_format("mdY", $_SESSION['search']['dropoff_date']);
        $tag_manager_dropoff_date = $dropOffToDate->format("Y-m-d");

        /*return array('content' => 'success',
                     'date_of_pickup' => $tag_manager_pickup_date,
                     'date_of_return' => $tag_manager_dropoff_date,
                     'rental_location' => $_SESSION['search']['rental_location_id'],
                     'rental_location_city' => $_SESSION['search']['rental_location_city'],
                     'rental_location_state' => $_SESSION['search']['rental_location_state'],
                     'return_to_id' => $_SESSION['search']['return_location_id'],
                     'return_location_city' => $_SESSION['search']['return_location_city'],
                     'return_location_state' => $_SESSION['search']['return_location_state'],
                     'purchase_currency' => $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['CurrencyCode'],
                     'class_code' => $_SESSION['reserve']['ClassCode']);*/

        //Complete page begins
        /*if (isset($_SESSION['complete']['ConfirmNum'])) {
            return array('error' => $_SESSION['complete']['ConfirmNum'] );
            die();
        }*/
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $prepaid = 'N';
        $payment_type_prefix = 'R';
        $payment_type_total = 'TOTAL DUE';
        if (isset($_SESSION['confirm']['payment_type'])) {
            if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
                $prepaid = 'Y';
                $payment_type_prefix = 'P';
                $payment_type_total = 'TOTAL PAID';
            }
        }

        $vehicle_picked = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];

        // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        // Check if RatePlan is weekly or daily. 
        if (strtoupper($vehicle_picked['RatePlan']) == 'WEEKLY') {
            $days = "week";
            $days_ly = "weekly";
        } else {
            $days = "day";
            $days_ly = "daily";
        }

        $vehicleOptions = $_SESSION['reserve']['vehicleOptions'];

        // // Fix for duplicate Childseat extra in addRez
        // foreach ($vehicleOptions as $key => $value) {
        //     if($value == "CHILDSEAT") {
        //       unset($vehicleOptions[$key]);
        //       unset($_SESSION['reserve']['vehicleOptions'][$key]);
        //     }
        // }

        // Fix for duplicate Childseat extra in addRez
        if (isset($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']) && count($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']) > 2) {
            foreach ($vehicleOptions as $key => $options_value) {
                if($options_value == $req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']['PromoTSDCode']) {
                    unset($vehicleOptions[$key]);
                    unset($_SESSION['reserve']['vehicleOptions'][$key]);
                }  
            }
        } elseif (isset($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']) && count($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered']) < 3) {
            foreach ($req_bil_counter_response_array['PromoCodeResponse']['PromoCodeEntered'] as $key => $value) {
                foreach ($vehicleOptions as $key => $options_value) {
                    if($options_value == $value['PromoTSDCode']) {
                    unset($vehicleOptions[$key]);
                    unset($_SESSION['reserve']['vehicleOptions'][$key]);
                    }
                }       
            }
        }

        $promo_codes[] = '';

        $promo_codes[] = array();
        if (isset($bookmark_search_array['promo_codes'])) {
            $promo_codes = $this->getPromoCodes($bookmark_search_array['promo_codes']);
            // If the first index of the array is empty then unset it. We unset it since that technically
            // is a blank promocode.
            if (count($promo_codes) == 1 && empty($promo_codes[0])) {
                unset($promo_codes[0]);
            }
        }

        $promo_codes[] = '';
        // $user_search_array = array();
        if (isset($_SESSION['search']['promo_codes'])) {
            $promo_codes = $this->getPromoCodes($_SESSION['search']['promo_codes']);
            // $user_search_array = $_SESSION['search'];
        }

        // $full_promo_codes[] = '';
        // if (isset($_SESSION['enhance']['promo_primary'])) {
        //     $full_promo_codes .= $_SESSION['enhance']['promo_primary'];
        // }

        // if (isset($post_data['promot_codes'])) {
        //     $full_promo_codes .= $post_data['promot_codes'];
        // }

        // Muhammad - Save Frequent Flyer (HAWAIIAN AIRLINES PROJECT)
        $frequentFlyerNumber = "";
        $frequentFlyerAirline = "";
		$airlineCode = "";
        $frequentRenterFlag = "N";
        $frequentRenterID = "";
		$flight = "";
        $airline = "";
        try{
            if (isset($_SESSION['reserve']['frequentFlyerNumber']))
            {
                $frequentFlyerNumber = $_SESSION['reserve']['frequentFlyerNumber'];
            }

            if (isset($_SESSION['reserve']['airline']))
            {
                // example: "HA" - for Hawaiian Airlines
                $frequentFlyerAirline = $_SESSION['reserve']['airline'];

                // // Get the airline_code
                // $airline_data = explode(",", AdvRez_Helper::getAirlines($frequentFlyerAirline));
                // $airline = $airline_data[0];
                // $airlineCode =  $airline_data[1];
            }

            if (isset($_SESSION['reserve']['airlineNumber']))
            {
                // Flight Number
                $flight = $_SESSION['reserve']['airlineNumber'];
            }
        }
        catch(Exception $e)
        {
            error_log('Frequent Flyer: ' . $e);
        }

        // Check if the user is logged in with an email address
        if (isset($_SESSION['adv_login']->user['Email']) && !empty($_SESSION['adv_login']->user['Email'])) {

            // Set the email variable to the user's login email
            $email = $_SESSION['adv_login']->user['Email'];

            $request_query_renter = ['email' => $email];

            // Get the frequent renter status
            $get_frequent_renter_status_response = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/getFrequentRenterStatus', $request_query_renter);

            $get_frequent_renter_status_array = json_decode($get_frequent_renter_status_response, true);

            // If this is a frequent renter set their Member Number to the Frequent Renter ID
            if ($get_frequent_renter_status_array['Status'] == "OK" && $get_frequent_renter_status_array['FrequentRenter'] == "True") {

                $frequentRenterID = $get_frequent_renter_status_array['MemberNumber'];
                $frequentRenterFlag = "Y";

            }

        }

        $tier = '';
        if (isset($_SESSION['awards_header_response']['BestTier']) && $_SESSION['awards_header_response']['BestTier'] !== '') {
            $tier = $_SESSION['awards_header_response']['BestTier']." Member";
        }

        $request_query = [
            'rental_location_id' => $_SESSION['search']['rental_location_id'],
            'return_location_id' => $_SESSION['search']['return_location_id'],
            'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
            'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
            'prepaid' => $prepaid,
            'rate_id' => $vehicle_picked['RateID'],
            'class_code' => $vehicle_picked['ClassCode'],
            'class_name' => AdvRez_Helper::first_letter(substr($vehicle_picked['ClassCode'], 0, 1)),
            'renter_first' => $_SESSION['renter']['renter_first'],
            'renter_last' => $_SESSION['renter']['renter_last'],
            'email_address' => $_SESSION['renter']['renter_email_address'],
            'renter_home_phone' => $_SESSION['renter']['renter_home_phone_dial_code'] . $_SESSION['renter']['renter_home_phone'],
            'renter_address1' => $_SESSION['renter']['renter_address1'],
            'renter_address2' => $_SESSION['renter']['renter_address2'],
            'renter_city' => $_SESSION['renter']['renter_city'],
            'renter_state' => $_SESSION['renter']['renter_state'],
            'renter_zip' => $_SESSION['renter']['renter_zip'],
            'vehicleOptions' => $vehicleOptions,
            'promo_codes' => $promo_codes,
            'CurrencyCode' => $vehicle_picked['CurrencyCode'],
            'CurrencyCodeDisplay' => AdvRez_Helper::getAdvCurrency($vehicle_picked['CurrencyCode']),
            'ClassImageURL' => $vehicle_picked['ClassImageURL'],
            'FullClassImageURL' => get_home_url() . $vehicle_picked['ClassImageURL'], 
            'ClassDesc' => $vehicle_picked['ClassDesc'],
            'ModelDesc' => $vehicle_picked['ModelDesc'],
            'RatePlan' => $vehicle_picked['RatePlan'],
            'daily_rate' => $vehicle_picked[$payment_type_prefix . 'Rate1PerDay'],
            'rate_period_label' => $days,
            // sprintf('%01.2f', strval($total_extras))
            'RateAmount' => sprintf('%01.2f', strval($vehicle_picked[$payment_type_prefix . 'RateAmount'])),
            'RateCharge' => sprintf('%01.2f', strval($vehicle_picked[$payment_type_prefix . 'RateCharge'])),
            'TotalTaxes' => sprintf('%01.2f', strval($vehicle_picked[$payment_type_prefix . 'TotalTaxes'])),
            'TotalExtras' => sprintf('%01.2f', strval($vehicle_picked[$payment_type_prefix . 'TotalExtras'])),
            'TotalCharges' => sprintf('%01.2f', strval($vehicle_picked[$payment_type_prefix . 'TotalCharges'])),
            'payment_type_total' => $payment_type_total,
            'pickup_date_formatted' => $_SESSION['search']['pickup_date_formatted'],
            'rental_location_name' => $_SESSION['search']['rental_location_name'],
            'rental_location_street' => $_SESSION['search']['rental_location_street'],
            'rental_location_city' => $_SESSION['search']['rental_location_city'],
            'rental_location_state' => $_SESSION['search']['rental_location_state'],
            'rental_location_zip' => $_SESSION['search']['rental_location_zip'],
            'rental_location_country' => $_SESSION['search']['rental_location_country'],
            'dropoff_date_formatted' => $_SESSION['search']['dropoff_date_formatted'],
            'return_location_name' => $_SESSION['search']['return_location_name'],
            'return_location_street' => $_SESSION['search']['return_location_street'],
            'return_location_city' => $_SESSION['search']['return_location_city'],
            'return_location_state' => $_SESSION['search']['return_location_state'],
            'return_location_zip' => $_SESSION['search']['return_location_zip'],
            'return_location_country' => $_SESSION['search']['return_location_country'],
            'base_url' => get_home_url(),
            'keep_promo_codes' => $this->api_url_array['flush_promo_codes'],
            
            'frequent_flyer_number' => $frequentFlyerNumber, // FREQUENT FLYER # in TSD
            'airline_code' => $frequentFlyerAirline, //FREQUENT FLYER AC in TSD

            'frequent_renter_flag' => $frequentRenterFlag,
            'frequent_renter_id' => $frequentRenterID, // PREFERRED RENTER # in TSD

            'airline' => $airline, // FLIGHT AC field in TSD
            'flight' => $flight, // FLIGHT # in TSD
            'adv_login_member_number' => $adv_login_member_number,
            'rental_comments' => $tier // Adding Tier level to Broascast notes in TSD
        ];

        if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
            // This is where you add data for Credit Card
            // $request_query['cc_type'] = $post_data['4024-5190-0278-533'];

            // AX – American Expressxcz
            // MC – Master Card
            // VI – VISA
            // DS 6011, 622126-622925, 644-649, 65
            $cc_number = str_replace('-', '', $post_data['card_number']);
            $first_cc_number = substr($cc_number, 0, 1);
            $first2_cc_number = substr($cc_number, 0, 2);
            $first3_cc_number = substr($cc_number, 0, 3);
            $first4_cc_number = substr($cc_number, 0, 4);
            $first6_cc_number = substr($cc_number, 0, 6);

            $cc_type = '';
            if ($first_cc_number == '4') {
                $cc_type = 'VI';
                $cc_name = 'Visa';
            } elseif ($first2_cc_number == '34' || $first2_cc_number == '37') {
                $cc_type = 'AX';
                $cc_name = 'American Express';
            } elseif ($first2_cc_number >= '51' && $first2_cc_number <= '55') {
                $cc_type = 'MC';
                $cc_name = 'Master Card';
            } elseif ($first4_cc_number >= '2221' && $first4_cc_number <= '2720') {
                $cc_type = 'MC';
                $cc_name = 'Master Card';
            } elseif ($first2_cc_number == '65' ) {
                $cc_type = 'DS';
                $cc_name = 'Diners Club';
            } elseif ($first2_cc_number == '65' ) {
                $cc_type = 'DS';
                $cc_name = 'Diners Club';
            } elseif ($first3_cc_number >= '644' && $first3_cc_number <= '649' ) {
                $cc_type = 'DS';
                $cc_name = 'Diners Club';
            } elseif ($first4_cc_number == '6011' ) {
                $cc_type = 'DS';
                $cc_name = 'Diners Club';
            } elseif ($first6_cc_number >= '622126' && $first6_cc_number <= '622925' ) {
                $cc_type = 'DS';
                $cc_name = 'Diners Club';
            }

            $split_date = explode("/", $post_data['card_exp']);
            $split_year = $split_date[1];

            $tmp_date = $split_date[0] . '/01/' . $split_year;

            $expiration_full_date  =  date("m/t/y", strtotime($tmp_date));

            $request_query['cc_type'] = $cc_type;
            $request_query['cc_number'] = $cc_number;
            $request_query['cc_exp'] = $expiration_full_date;
            $request_query['cc_sec_code'] = $post_data['card_cvc'];
            $request_query['prepaid_amount'] = sprintf('%01.2f', strval($vehicle_picked[$payment_type_prefix . 'TotalCharges']));
            
            //Process reservatio with saved CC card
            if(isset($post_data['pay_with_card_option']) && $post_data['pay_with_card_option'] != '-1') {
                $request_query['card_payment_express_flag'] = 1;
                $request_query['cc_token_value'] = $post_data['pay_with_card_option'];
                $request_query['services_url'] = $get_wp_config_settings_array['services_url'];      
            }
            
            //To display CC card info on complete page
            $this->cc_details = Adv_login_Helper::getUserCCDetails();

            if(isset($this->cc_details['d']['0']['CardHoldersName'])) {
                foreach($this->cc_details['d'] as $card) {
                    if($card['CardTokenID'] == $post_data['pay_with_card_option']) {
                        $_SESSION['confirm']['cc_card_expiry'] = $card['cc_exp'];
                        $_SESSION['confirm']['cc_card_type'] = $card['CardType'];
                        $_SESSION['confirm']['cc_last_four'] = $card['LastFour'];     
                        $_SESSION['confirm']['cc_holder_name'] = $card['CardHoldersName'];
                        break;
                    }
                }
            }

        }

        $add_reservation_response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/addReservation', $request_query);
        $add_reservation_response_array = json_decode($add_reservation_response, true);
        
        if (isset($request_query['cc_number'])) {

            $add_reservation_response_array['card_name'] = $cc_name;
            // $add_reservation_response_array['card_exp_month'] = $post_data['card_exp_month'];
            // $add_reservation_response_array['card_exp_year'] = substr($post_data['card_exp_year'], 2, 2);
            $add_reservation_response_array['card_exp'] = $post_data['card_exp'];

            $add_reservation_response_array['cc_card_expiry'] = $post_data['card_exp'];
            // $add_reservation_response_array['cc_card_expiry'] = $post_data['card_exp_month']."/".substr($post_data['card_exp_year'], 2, 2);
            
            $add_reservation_response_array['card_number'] = substr($request_query['cc_number'], -4);
            $add_reservation_response_array['street_address_1'] = $request_query['renter_address1'];
            $add_reservation_response_array['street_address_2'] = $request_query['renter_address2'];
            $add_reservation_response_array['postal_code'] = $request_query['renter_zip'];
            $add_reservation_response_array['city'] = $request_query['renter_city'];
            $add_reservation_response_array['state'] = $request_query['renter_state'];

        }        
        
        $_SESSION['complete'] = $add_reservation_response_array;
        // If an error comes back, fill in the response with the error message to be displayed to the customer.
        // Otherwise return the success response. 
        if (isset($add_reservation_response_array['error'])) {
            $response  = array('content' => 'error',
                         'message' => $add_reservation_response_array['error']['errorMessage']);
            $_SESSION['pay_with_card_failed_flag'] = 1;
        } else {
            unset($_SESSION['pay_with_card_failed_flag']);
            
            /* Update loyalty profile data begins */
            $this->updateLoyaltyProfile($post_data);
            /* Update loyalty profile data end */

            
            //Save User Card begins
            if(isset($post_data['save_new_card_user'])) {
                if($post_data['pay_total'] == 'pay_now') {
                    $card_number = $post_data['card_number'];
                    $member_number = $_SESSION['adv_login']->memberNumber;

                    if(trim($card_number) != '') {

                        if($post_data['card_exp'] != '') {
                            $cc_number =$card_number;
                            $cc_number = str_replace('-', '', $cc_number);
                            $last_four = substr($cc_number, 12, 16);

                              // AX – American Express
                            // DS – Discover
                            // MC – Master Card
                            // VI – VISA
                            // DS 6011, 622126-622925, 644-649, 65
                            $cc_number = str_replace('-', '', $cc_number);
                            $first_cc_number = substr($cc_number, 0, 1);
                            $first2_cc_number = substr($cc_number, 0, 2);
                            $first3_cc_number = substr($cc_number, 0, 3);
                            $first4_cc_number = substr($cc_number, 0, 4);
                            $first6_cc_number = substr($cc_number, 0, 6);

                            $cc_type = '';
                            if ($first_cc_number == '4') {
                                $cc_type = 'VI';
                            } elseif ($first2_cc_number == '34' || $first2_cc_number == '37') {
                                $cc_type = 'AX';
                            } elseif ($first2_cc_number >= '51' && $first2_cc_number <= '55') {
                                $cc_type = 'MC';
                            } elseif ($first4_cc_number >= '2221' && $first4_cc_number <= '2720') {
                                $cc_type = 'MC';
                            } elseif ($first2_cc_number == '65' ) {
                                $cc_type = 'DS';
                            } elseif ($first2_cc_number == '65' ) {
                                $cc_type = 'DS';
                            } elseif ($first3_cc_number >= '644' && $first3_cc_number <= '649' ) {
                                $cc_type = 'DS';
                            } elseif ($first4_cc_number == '6011' ) {
                                $cc_type = 'DS';
                            } elseif ($first6_cc_number >= '622126' && $first6_cc_number <= '622925' ) {
                                $cc_type = 'DS';
                            }

                            $card_detail[] = array('card_name'=> trim($post_data['card_name']),  
                                                 'card_number'=> trim($post_data['card_enc_value']),
                                                //  'expiry_month'=> $post_data['card_exp_month'],
                                                //  'expiry_year'=> $post_data['card_exp_year'],
                                                'expiry' => $post_data['card_exp'],
                                                 'last_four'=> $last_four,
                                                 'card_type'=> $cc_type
                                                );
                        }

                    }

                    $card_response = array('status'=> 'error', 'error_code'=> 'SAVE_CARD_ERR', 'error'=> 'We have trouble adding new card, Please try later.');
                    if(is_array($card_detail)) {

                        $addCardParams = array('memberNumber' => $member_number,
                                'card_details' => $card_detail,
                                'services_url' => $get_wp_config_settings_array['services_url'],
                                'logging_url' => $get_wp_config_settings_array['logging_url']);
                        $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/saveLoyaltyProfileCC', $addCardParams);
                        $add_user_card_response = json_decode($response, true); 
                        /*if($add_user_card_response['status'] == 'error') {
                            $card_response = array('status'=>'error', 'error_code'=> 'SAVE_CARD_ERR', 'error'=> 'Same card alreay exist in profile or Expired or Validation failed or Etc.');
                            echo json_encode($card_response);
                            exit;
                        }*/

                    } 
                }
        }
            //Save User Card ends
            

            unset($_SESSION['reserve']['express_checkout_complete_flag']);
            $promo_codes = array();
            unset($_SESSION['search']['promo_codes']);
            $email_popup_cookie_name = "email_entered";
            $email_popup_cookie_value = "true";
            setcookie($email_popup_cookie_name, $email_popup_cookie_value, time() - 3600, "/");
            $response =  array('content' => 'success',
                         'confirmNum' => $add_reservation_response_array['ConfirmNum'],
                         'promo_codes' => $promo_codes);
        }        
        return $response;
        //Complete page ends
    }

    public function calcDriverAge($dob, $pickup_date, $brand = 'advantage') {

       $pickup_day = substr($pickup_date, 6, 2);
       $pickup_month = substr($pickup_date, 4, 2);
       $pickup_year = substr($pickup_date, 0, 4);
       $dob_day = substr($dob, 3, 2);
       $dob_month = substr($dob, 0, 2);
       $dob_year = substr($dob, 6, 4);

       $current_entered_birthday = mktime(0, 0, 0, $dob_month, $dob_day, $dob_year);
       $pickup_of_25_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 25);
       $pickup_of_21_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 21);
       $pickup_of_18_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 18);

       if (($current_entered_birthday > $pickup_of_18_years_ago) && $brand = 'e-zrentacar') {
           return 'under18';
       } else if ($current_entered_birthday > $pickup_of_21_years_ago) {
            return 'under21';
       } else if ($current_entered_birthday > $pickup_of_25_years_ago) {
           return 'under25';
       }
       return 'over25';
   }

    public function build_new_rate($vehicleIndex, $new_rate_array) {


        $_SESSION['choose'][$vehicleIndex]['RateID'] = $new_rate_array['Payload']['RateProduct']['RateID'];
        $_SESSION['choose'][$vehicleIndex]['RateIDSort'] = sprintf("%'.02d\n", $vehicleIndex) . substr($new_rate_array['Payload']['RateProduct']['RateIDSort'], 2);
        $_SESSION['choose'][$vehicleIndex]['RateAmount'] = $new_rate_array['Payload']['RateProduct']['RateAmount'];
        $_SESSION['choose'][$vehicleIndex]['RRateAmount'] = $new_rate_array['Payload']['RateProduct']['RateAmount'];
        $_SESSION['choose'][$vehicleIndex]['RRateCharge'] = $new_rate_array['Payload']['RateProduct']['TotalPricing']['RateCharge'];
        $_SESSION['choose'][$vehicleIndex]['RTotalTaxes'] = $new_rate_array['Payload']['RateProduct']['TotalPricing']['TotalTaxes'];
        $_SESSION['choose'][$vehicleIndex]['RTotalExtras'] = $new_rate_array['Payload']['RateProduct']['TotalPricing']['TotalExtras'];
        $_SESSION['choose'][$vehicleIndex]['RTotalCharges'] = $new_rate_array['Payload']['RateProduct']['TotalPricing']['TotalCharges'];
        $_SESSION['choose'][$vehicleIndex]['RRate1PerDay'] = $new_rate_array['Payload']['RateProduct']['TotalPricing']['RatePeriod']['Rate1PerDay'];
        $_SESSION['choose'][$vehicleIndex]['PRateAmount'] = $new_rate_array['Payload']['RateProduct']['Prepaid']['RateAmount'];
        $_SESSION['choose'][$vehicleIndex]['PRateCharge'] = $new_rate_array['Payload']['RateProduct']['Prepaid']['TotalPricing']['RateCharge'];
        $_SESSION['choose'][$vehicleIndex]['PTotalTaxes'] = $new_rate_array['Payload']['RateProduct']['Prepaid']['TotalPricing']['TotalTaxes'];
        $_SESSION['choose'][$vehicleIndex]['PTotalExtras'] = $new_rate_array['Payload']['RateProduct']['Prepaid']['TotalPricing']['TotalExtras'];
        $_SESSION['choose'][$vehicleIndex]['PTotalCharges'] = $new_rate_array['Payload']['RateProduct']['Prepaid']['TotalPricing']['TotalCharges'];
        $_SESSION['choose'][$vehicleIndex]['PRate1PerDay'] = $new_rate_array['Payload']['RateProduct']['Prepaid']['TotalPricing']['RatePeriod']['Rate1PerDay'];
        $_SESSION['choose'][$vehicleIndex]['Taxes'] = $new_rate_array['Payload']['RateProduct'];
        $_SESSION['choose'][$vehicleIndex]['Taxes']['Prepaid'] = $new_rate_array['Payload']['RateProduct'];


        $_SESSION['reserve']['RateID'] = $new_rate_array['Payload']['RateProduct']['RateID'];
        $_SESSION['reserve']['ClassCode'] = $new_rate_array['Payload']['RateProduct']['ClassCode'];
        // $_SESSION['reserve']['vehicleOptions'],

                // 'RRateAmount' => $response_arrays['RateProduct']['RateAmount'],
                // 'RRateCharge' => $response_arrays['RateProduct']['TotalPricing']['RateCharge'],
                // 'RTotalTaxes' => $response_arrays['RateProduct']['TotalPricing']['TotalTaxes'],
                // 'RTotalExtras' => $response_arrays['RateProduct']['TotalPricing']['TotalExtras'],
                // 'RTotalCharges' => $response_arrays['RateProduct']['TotalPricing']['TotalCharges'],
                // 'RRate1PerDay' => $response_arrays['RateProduct']['TotalPricing']['RatePeriod']['Rate1PerDay'],
                // 'PRateAmount' => $response_arrays['RateProduct']['Prepaid']['RateAmount'],
                // 'PRateCharge' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['RateCharge'],
                // 'PTotalTaxes' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['TotalTaxes'],
                // 'PTotalExtras' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['TotalExtras'],
                // 'PTotalCharges' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['TotalCharges'],
                // 'PRate1PerDay' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['RatePeriod']['Rate1PerDay'],
        // $_SESSION['choose'][$vehicleIndex]['ClassCode'] = ;
        // $_SESSION['choose'][$vehicleIndex]['ClassDesc'] = ;
        // $_SESSION['choose'][$vehicleIndex]['ModelDesc'] = ;
        // $_SESSION['choose'][$vehicleIndex]['Passengers'] = ;
        // $_SESSION['choose'][$vehicleIndex]['Luggage'] = ;
        // $_SESSION['choose'][$vehicleIndex]['ClassImageURL'] = ;
        // $_SESSION['choose'][$vehicleIndex]['MPGCity'] = ;
        // $_SESSION['choose'][$vehicleIndex]['MPGHighway'] = ;
        // $_SESSION['choose'][$vehicleIndex]['Category'] = ;
        // $_SESSION['choose'][$vehicleIndex]['Type'] = ;
        // $_SESSION['choose'][$vehicleIndex]['Transmission'] = ;
        // $_SESSION['choose'][$vehicleIndex]['AC'] = ;
        // $_SESSION['choose'][$vehicleIndex]['RatePlan'] = ;
        // $_SESSION['choose'][$vehicleIndex]['upgrade'] = ;
        // $_SESSION['choose'][$vehicleIndex]['live_a_little'] = ;
        // $_SESSION['choose'][$vehicleIndex]['RentalDays'] = ;
 

    }



    //public function processRezViewAndCancelPage($endpoint) {
    public function processRezViewAndCancelPage() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        // Add reservation data to the session.
        $_SESSION['my_reservation']['rental_location_id'] = $clean_post_data['rental_location_id'];
        $_SESSION['my_reservation']['renter_last'] = $clean_post_data['renter_last'];
        $_SESSION['my_reservation']['confirm_num'] = $clean_post_data['confirm_num'];

        $rez_task = 'viewReservation';
        if (isset($clean_post_data['rez_task'])) {
            if ($clean_post_data['rez_task'] == 'cancelReservation') {
                $rez_task = $clean_post_data['rez_task'];
            }
        }

        $request_query = [
            'rental_location_id' => $clean_post_data['rental_location_id'],
            'renter_last' => $clean_post_data['renter_last'],
            'confirm_num' => $clean_post_data['confirm_num'],
            'base_url' => get_home_url(),
            ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/' . $rez_task, $request_query);

        $tmp_response_contents_array = json_decode($response_contents, true);

        // Check if there's an error
        if ($tmp_response_contents_array['status'] == 'error') {

            // If there's an error send it to the javascript
            return array('content' => 'error',
                         'message' => $tmp_response_contents_array['error']['errorMessage']);

        } else {

            $_SESSION['my_reservation']['Dategmtime'] = $tmp_response_contents_array['Dategmtime'];

            $response_contents_array = $tmp_response_contents_array['Payload'];

            foreach ($response_contents_array as $key => $value) {
                switch ($key) {
                    case 'ApiProvider':
                        $_SESSION['my_reservation']['api_provider'] = $value;
                        break;
                    case 'ReservationStatus':
                        $_SESSION['my_reservation']['reservation_status'] = $value;
                        break;
                    case 'ClassImageURL':
                        $_SESSION['my_reservation']['class_image_url'] = $value;
                        break;
                    case 'ClassCode':
                        $_SESSION['my_reservation']['class_code'] = $value;
                        $class_code = $value;
                        break;
                    case 'DisplayRate':
                        $_SESSION['my_reservation']['display_rate'] = $value;
                        break;
                    case 'ModelDesc':
                        $_SESSION['my_reservation']['model_desc'] = $value;
                        break;
                    case 'PickupDateTime':
                        $pieces = explode(" ", $value);
                        $date = $pieces[0]; 
                        $time = $pieces[1]; 
                        $ampm = $pieces[2]; 
                        $_SESSION['my_reservation']['pickup_month'] = $date[0].$date[1];
                        $_SESSION['my_reservation']['pickup_day'] = $date[2].$date[3];
                        $_SESSION['my_reservation']['pickup_year'] = $date[4].$date[5].$date[6].$date[7];
                        $_SESSION['my_reservation']['pickup_time'] = $time." ".$ampm; 
                        break;
                    case 'ReturnDateTime':
                        $pieces = explode(" ", $value);
                        $date = $pieces[0]; 
                        $time = $pieces[1]; 
                        $ampm = $pieces[2]; 
                        $_SESSION['my_reservation']['dropoff_month'] = $date[0].$date[1];
                        $_SESSION['my_reservation']['dropoff_day'] = $date[2].$date[3];
                        $_SESSION['my_reservation']['dropoff_year'] = $date[4].$date[5].$date[6].$date[7];
                        $_SESSION['my_reservation']['dropoff_time'] = $time." ".$ampm; 
                        break;
                    case 'RentalLocationID':
                         $_SESSION['my_reservation']['rental_location_name'] = $value;
                         $rental_location_name = $value;
                         break;
                    case 'RentalVendorDetails':
                        $_SESSION['my_reservation']['vendor_name'] = $value['VendorName'];
                        $_SESSION['my_reservation']['rental_location_street1'] = $value['AddressLine1'];
                        $_SESSION['my_reservation']['rental_location_street2'] =  $value['AddressLine2'];
                        $_SESSION['my_reservation']['rental_location_city'] = $value['AddressCity'];
                        $_SESSION['my_reservation']['rental_location_state'] = $value['AddressState'];
                        $_SESSION['my_reservation']['rental_location_zip'] = $value['AddressZipCode'];
                        $_SESSION['my_reservation']['rental_location_country'] = $value['Country'];
                        $rental_location_street1 = $value['AddressLine1'];
                        $rental_location_street2 =  $value['AddressLine2'];
                        $rental_location_city = $value['AddressCity'];
                        $rental_location_state = $value['AddressState'];
                        $rental_location_zip = $value['AddressZipCode'];
                        $rental_location_country = $value['Country'];
                        break;
                    case 'ReturnLocationID':
                        $_SESSION['my_reservation']['return_location_name'] = $value;
                        $return_location_name = $value;
                        break;
                    case 'ReturnLocation':
                        $_SESSION['my_reservation']['return_location_street1'] = $value['AddressLine1'];
                        $_SESSION['my_reservation']['return_location_street2'] =  $value['AddressLine2'];
                        $_SESSION['my_reservation']['return_location_city'] = $value['AddressCity'];
                        $_SESSION['my_reservation']['return_location_state']  = $value['AddressState'];
                        $_SESSION['my_reservation']['return_location_zip'] = $value['AddressZipCode'];
                        break;
                    case 'TotalPricing':
                        $_SESSION['my_reservation']['rate_charge'] = $value['RateCharge'];
                        $_SESSION['my_reservation']['total_taxes'] = $value['TotalTaxes'];
                        $_SESSION['my_reservation']['total_extras'] = $value['TotalExtras'];
                        $_SESSION['my_reservation']['total_charges'] = $value['TotalCharges'];
                        break;
                    case 'RenterLast':
                        $_SESSION['my_reservation']['renter_last_name'] = $value;
                        break;
                    case 'RenterFirst':
                        $_SESSION['my_reservation']['renter_first_name'] = $value;
                        break;
                    case 'RenterAddress1':
                        if (empty($value)) {
                            $_SESSION['my_reservation']['street_address_1'] = '';
                        } else {
                            $_SESSION['my_reservation']['street_address_1'] = $value;
                        }
                        break;
                    case 'RenterAddress2':
                         if (empty($value)) {
                            $_SESSION['my_reservation']['street_address_2'] = "";
                        } else {
                            $_SESSION['my_reservation']['street_address_2'] = $value;
                        }
                        break;
                    case 'RenterCity':
                        if (empty($value)) {
                            $_SESSION['my_reservation']['city'] = '';
                        } else {
                            $_SESSION['my_reservation']['city'] = $value;
                        }
                        break;
                    case 'RenterState':
                        if (empty($value)) {
                            $_SESSION['my_reservation']['state'] = '';
                        } else {
                            $_SESSION['my_reservation']['state'] = $value;
                        }
                        break;
                    case 'RenterZIP':
                        if (empty($value)) {
                            $_SESSION['my_reservation']['postal_code'] = '';
                        } else {
                            $_SESSION['my_reservation']['postal_code'] = $value;
                        }
                        break;
                    case 'RenterCountry':
                         if (empty($value)) {
                            $_SESSION['my_reservation']['renter_country'] = "";
                        } else {
                            $_SESSION['my_reservation']['renter_country'] = $value;
                        }
                        break;
                    case 'CardType':
                        $_SESSION['my_reservation']['card_type'] = $value;
                        break;
                    case 'CardNumber':
                        $_SESSION['my_reservation']['card_number'] = $value;
                        break;
                    case 'CardExp':
                        $_SESSION['my_reservation']['card_exp'] = $value;
                        break;
                    case 'DailyRate':
                        $_SESSION['my_reservation']['daily_rate'] = $value;
                        break;
                    case 'WeeklyRate':
                        $_SESSION['my_reservation']['weekly_rate'] = $value;
                        break;
                    case 'EmailAddress':
                        $_SESSION['my_reservation']['email_address'] = $value;
                        break;
                    case 'IATA':
                        $_SESSION['my_reservation']['iata'] = $value;
                        break;
                    case 'NoShow':
                        $_SESSION['my_reservation']['NoShow'] = $value;
                        break;
                    default:
                        # code...
                        break;
                }
            }

            // If the Pick up and drop off location is the same, make the address for the drop off the same as the pick up location.
            if ($rental_location_name == $return_location_name) {
                $_SESSION['my_reservation']['return_location_street1'] = $rental_location_street1;
                $_SESSION['my_reservation']['return_location_street2'] = $rental_location_street2;
                $_SESSION['my_reservation']['return_location_city'] = $rental_location_city;
                $_SESSION['my_reservation']['return_location_state'] = $rental_location_state;
                $_SESSION['my_reservation']['return_location_zip'] = $rental_location_zip;
                $_SESSION['my_reservation']['return_location_country'] = $rental_location_country;
            }

            if ($class_code !== "") {
                // Looping though the Class code to pull out the letters
                for( $i = 0; $i < strlen($class_code); $i++ ) {
                    if ($i == 0) {
                        // First Letter - category
                        $_SESSION['my_reservation']['category'] =  AdvRez_Helper::first_letter($class_code[$i]);
                    } elseif ($i == 1) {
                        // Second Letter
                        $_SESSION['my_reservation']['second'] =  AdvRez_Helper::second_letter($class_code[$i]);
                   } elseif ($i == 2) {
                        // Third Letter - Automatic or Manual
                        $_SESSION['my_reservation']['auto'] =  AdvRez_Helper::third_letter($class_code[$i]);
                    } elseif ($i == 3) {
                        // Fourth Letter - AC
                        $_SESSION['my_reservation']['ac'] =  AdvRez_Helper::fourth_letter($class_code[$i]);
                    }
                }
            }

            // Get the currency symbol for the country
            $_SESSION['my_reservation']['currency_symbol'] =  AdvRez_Helper::getAdvCurrency($response_contents_array['CurrencyCode']);

            // Taxes
            $_SESSION['my_reservation']['TotalPricing'] = $response_contents_array['TotalPricing'];

            // DailyExtras
            $_SESSION['my_reservation']['daily_extra'] = $response_contents_array['TotalPricing']['DailyExtra'];

            // Credit Card Info
            if (isset($response_contents_array['CardType'])) {
                $_SESSION['my_reservation']['card_type'] = AdvRez_Helper::getCreditCardName($response_contents_array['CardType']);
            }
            if (isset($response_contents_array['CardNumber'])) {
                $_SESSION['my_reservation']['card_number'] = $response_contents_array['CardNumber'];
            }
            if (isset($response_contents_array['CardExp'])) {
                $_SESSION['my_reservation']['card_exp'] = $response_contents_array['CardExp'];
            }

        } // End If

        return array('content' => 'success');

    }

    public function getPromoCodes($promo_codes) {

        $temp_promo_codes = $promo_codes;

        if (isset($_SESSION['enhance']['promo_primary'])) {

            if (isset($temp_promo_codes[0]) && strlen($temp_promo_codes[0]) > 0) {

                array_unshift($temp_promo_codes, $_SESSION['enhance']['promo_primary']);

            } else {

                $temp_promo_codes[0] = $_SESSION['enhance']['promo_primary'];

            }
        }

        return $temp_promo_codes;
    }    

    public function getPromoFromCookie($brand, $promotion, $promo_code_value, $current_promos) {

        $ret = '';

        if (count($current_promos) < 1) {
            if (isset($_COOKIE[$brand]) && $_COOKIE[$brand] == $promotion) {

                if (strlen($promo_code_value) > 0) {
                    $ret = ['0' => $promo_code_value];

                }
            }
        }

        return $ret;

    }

    public function processExpressCheckout() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $rental_location_id = $post_data['rental_location_id'];
        $return_location_id = $post_data['return_location_id'];

        $profile_data = Adv_login_Helper::getAdvFullUser();

        $pflag = 0;
        
        $post_data['promo_codes'] = array_unique($post_data['promo_codes']);

        // PIT STOP Reward code
        $available_awardcode = '';
        if (!isset($_SESSION['free_pitstop_removed'])) {
            $_SESSION['free_pitstop_removed'] = "False";
        }
        if (!isset($_SESSION['free_pitstop_applied'])) {
            $_SESSION['free_pitstop_applied'] = "False";
        }
        if (isset($_SESSION['free_pitstop_applied']) && $_SESSION['free_pitstop_applied'] !== "False") {
            if (in_array($_SESSION['free_pitstop_applied'], $clean_post_data['deletePromoCode'])) {
                $_SESSION['free_pitstop_removed'] = "True";
            }
        } 

        if (isset($_SESSION['adv_login']->memberNumber) && $_SESSION['adv_login']->memberNumber !== "" &&  $_SESSION['free_pitstop_applied'] == "False") {
            $available_member_awards = AdvAwards_Helper::getAvailableMemberAwards($_SESSION['adv_login']->memberNumber);

            for ($x=0; $x < count($available_member_awards['d']); $x++) {

                if ($available_member_awards['d'][$x]['AutoApply'] == "True") {
                    $available_awardcode = $available_member_awards['d'][$x]['AwardCode'];
                    if (!is_array($_SESSION['search']['promo_codes'])) {
                        $_SESSION['search']['promo_codes'] = array();
                    }
                    if (!in_array($available_awardcode, $_SESSION['search']['promo_codes'])) {
                        array_push($_SESSION['search']['promo_codes'], $available_awardcode);
                    }
                    if (!in_array($available_awardcode, $post_data['promo_codes'])) {
                        
                        $post_data['promo_codes'] = array_filter($post_data['promo_codes'], 'strlen');
                        array_push($post_data['promo_codes'], $available_awardcode);
                    }
                    $_SESSION['free_pitstop_applied'] = $available_awardcode;
                    break;
                }
            }
        }
        // END PIT STOP Reward code

        if($profile_data['CarSpecification'] != '' && $profile_data['PreferredRentalLocationCode'] != '' && $profile_data['AdditionalOption'] != '') {
            $pflag = 1;
        }

        $abandonment_promocode = strtolower(trim($this->api_url_array['abandonment_promocode']));

        if (!isset($post_data['promo_codes'])){
            $post_data['promo_codes'] = array();
        }

        // If the abandonment promo code is set then push it to the front of the array
        if (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($this->api_url_array['abandonment_promocode']))) {
               // If the car class is not restricted then set the abandonment promocode
            $car_restrictions = array('ECAR', 'CCAR', 'XXAR');
            if ((!in_array($_SESSION['reserve']['ClassCode'], $car_restrictions) && !in_array($profile_data['CarSpecification'], $car_restrictions))) {
                //$post_data['promot_codes'][0] = $_SESSION['abandonment']['abandonment_promocode'];
                array_unshift($post_data['promo_codes'], $_SESSION['abandonment']['abandonment_promocode']);
                 
             }
        }

        $f_flag = 1;
        if($pflag == 1) {
            
            //Process choose activities
            $post_data['adv_reservation'] = AEZ_Oauth2_Plugin::get_reservation_cookie();

            // Set promo codes to a temp array
            $temp_post_array = $post_data['promo_codes'];
            //Check if both temp post array and post data are arrays
            if (is_array($temp_post_array) && is_array($post_data['promo_codes'])) {
                // Loop through the temp post array
                foreach ($temp_post_array as $key => $value) {
                    // If the value is empty then unset it.
                    if (empty($temp_post_array[$key]) || !isset($temp_post_array[$key])) {
                        unset($post_data['promo_codes'][$key]);
                    }
                }
                // Reorder the array so the key starts at 0
                $post_data['promo_codes'] = array_values($post_data['promo_codes']);

                // If all the promo codes don't exist, then set a default one so we get search results at the next page.
                if (array_key_exists('0', $post_data['promo_codes']) === false) {
                    //$post_data['promo_codes'] = array('0'=>'');
                    //$post_data['promo_codes'] = array('0'=>'TAKE15PCTOFF');
                    $post_data['promo_codes'] = array();

                }
            }

            // Rental Location
            $rental_response_array = AdvLocations_Helper::getLocation($post_data['rental_location_id']);
            // Add rental_location_name to the post_data array
            $post_data['rental_location_name'] = $rental_response_array['LocationName'].' ('.$rental_response_array['City'].', '.$rental_response_array['State'].' '.$rental_response_array['CountryName'].') - '.$rental_response_array['LocationCode'];

            $post_data['BrandName'] = $rental_response_array['BrandName'];

            // Return Location 
            $return_response_array = AdvLocations_Helper::getLocation($post_data['return_location_id']);
            // Add return_location_name to the post_data array
            $post_data['return_location_name'] = $return_response_array['LocationName'].' ('.$return_response_array['City'].', '.$return_response_array['State'].' '.$return_response_array['CountryName'].') - '.$return_response_array['LocationCode'];



            AdvRez_Flow_Storage::reservation_flow_delete_cookie('search');
            // Set the user cookie for 10 years
            // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

            AdvRez_Flow_Storage::reservation_flow_set_cookie('adv_userbookmark', $post_data, time() + (185 * 24 * 60 * 60));
            // AdvRez_Flow_Storage::reservation_flow_save('adv_userbookmark', $post_data);

            // $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

            AdvRez_Flow_Storage::reservation_flow_delete('search');


            // Set adv_login_member_number to 0 as default, meaning customer is not logged in.
            $adv_login_member_number = 0;
            // Check if the customer is logged in or not, if they are set the member number.
            if(isset($_SESSION['adv_login']->memberNumber)) {
                $adv_login_member_number = $_SESSION['adv_login']->memberNumber;
            }

            $request_query = [
                // 'HTTP_ORIGIN' => $_SERVER['HTTP_ORIGIN'],
                // 'adv_reservation' => $post_data['adv_reservation'],
                'rental_location_id' => $post_data['rental_location_id'],
                'return_location_id' => $post_data['return_location_id'],
                'pickup_date' => $post_data['pickup_date'],
                'pickup_time' => $post_data['pickup_time'],
                'dropoff_date' => $post_data['dropoff_date'],
                'dropoff_time' => $post_data['dropoff_time'],
                'promo_codes' => $post_data['promo_codes'],
                'adv_login_member_number' => $adv_login_member_number
            ];

            $rates_endpoint = '/getRates';
            /*if (isset($post_data['rate_id']) && isset($post_data['class_code'])) {
                $rates_endpoint = '/updateRates';
                $request_query['rate_id'] = $post_data['rate_id'];
                $request_query['class_code'] = $post_data['class_code'];
            }*/


            $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . $rates_endpoint, $request_query);

            $tmp_response_arrays = json_decode($response_contents, true);

            $response_arrays = $tmp_response_arrays['Payload'];
            
            if(isset($response_arrays['RateProduct'][0]['RateID']))
            {
                foreach($response_arrays['RateProduct'] as $index_key => $car) {
                    
                    if($car['ClassCode'] == $profile_data['CarSpecification']) {
                        $rate_id = $car['RateID'];

                        // Choose activity begins
                        $request_query = [
                                    'rental_location_id' => $post_data['rental_location_id'],
                                    'rental_location_ids' => $post_data['rental_location_id'] . ',' . $post_data['return_location_id'],
                                    ];

                        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/getLocations', $request_query);

                        $req_locs_response_array_tmp = json_decode($response_contents, true);
                        $location_1 = $req_locs_response_array_tmp['d'][0];

                        if (count($req_locs_response_array_tmp['d']) > 1) {
                            $location_2 = $req_locs_response_array_tmp['d'][1];

                            if ($location_1['LocationCode'] == $post_data['rental_location_id']) {
                                $rental_location_array['RentalLocation'] = $location_1;
                                $return_location_array['ReturnLocation'] = $location_2;                
                            } else {
                                $rental_location_array['RentalLocation'] = $location_2;
                                $return_location_array['ReturnLocation'] = $location_1;                
                            }

                        } else {
                            $rental_location_array['RentalLocation'] = $location_1;
                            $return_location_array['ReturnLocation'] = $location_1;
                        }

                        $pickup_time = $post_data['pickup_time'];
                        $pickup_date = $post_data['pickup_date'];
                        $dropoff_time = $post_data['dropoff_time'];
                        $dropoff_date = $post_data['dropoff_date'];

                        $pickupToDate = date_create_from_format("mdY", $pickup_date);
                        $pickup_date_formatted = $pickupToDate->format("l - F, d, Y");

                        $tag_manager_pickup_date = $pickupToDate->format("Y-m-d");

                        $dropoffToDate = date_create_from_format("mdY", $dropoff_date);
                        $dropoff_date_formatted = $dropoffToDate->format("l - F, d, Y");

                        $tag_manager_dropoff_date = $dropoffToDate->format("Y-m-d");

                        $rental_location = $rental_location_array['RentalLocation'];
                        $return_location = $return_location_array['ReturnLocation'];

                        $rental_location_id = $post_data['rental_location_id'];
                        $rental_location_name = $rental_location['LocationName'];
                        $rental_location_street = $rental_location['AddLine1'];
                        $rental_location_city = $rental_location['City'];
                        $rental_location_state = trim(strlen($rental_location['State'])) == 0 ? $rental_location['Country'] : $rental_location['State'];
                        $rental_location_zip = $rental_location['PostalCode'];
                        $rental_location_country = trim(strlen($rental_location['Country'])) == 0 ? $rental_location['State'] : $rental_location['Country'];

                        $return_location_id = $post_data['return_location_id'];
                        $return_location_name = $return_location['LocationName'];
                        $return_location_street = $return_location['AddLine1'];
                        $return_location_city = $return_location['City'];
                        $return_location_state = trim(strlen($return_location['State'])) == 0 ? $return_location['Country'] : $return_location['State'];
                        $return_location_zip = $return_location['PostalCode'];
                        $return_location_country = trim(strlen($return_location['Country'])) == 0 ? $return_location['State'] : $return_location['Country'];

                        $post_data['rental_location_name'] = $rental_location_name;
                        $post_data['rental_location_street'] = $rental_location_street;
                        $post_data['rental_location_city'] = $rental_location_city;
                        $post_data['rental_location_state'] = $rental_location_state;
                        $post_data['rental_location_zip'] = $rental_location_zip;
                        $post_data['rental_location_country'] = $rental_location_country;

                        $post_data['return_location_name'] = $return_location_name;
                        $post_data['return_location_street'] = $return_location_street;
                        $post_data['return_location_city'] = $return_location_city;
                        $post_data['return_location_state'] = $return_location_state;
                        $post_data['return_location_zip'] = $return_location_zip;
                        $post_data['return_location_country'] = $return_location_country;
                // error_log('response_arrays: ' . print_r($response_arrays, true));
                        if (isset($response_arrays['RateProduct'][0])) {
                            $post_data['vehicle_count'] = count($response_arrays['RateProduct']);
                        } else {
                            $post_data['vehicle_count'] = 1;
                        }

                // error_log('$post_data[vehicle_count]: ' . print_r($post_data['vehicle_count'], true));

                        $post_data['pickup_date_formatted'] = $pickup_date_formatted;
                        $post_data['pickup_date'] = $pickup_date;
                        $post_data['pickup_time'] = $pickup_time;
                        $post_data['pickup_date_time'] = $post_data['pickup_date'] . ' ' . substr($post_data['pickup_time'], 0, 5) . ' ' . substr($post_data['pickup_time'], 5);
                        $post_data['rental_location_name'] = $rental_location_name;
                        $post_data['rental_location_street'] = $rental_location_street;
                        $post_data['rental_location_city'] = $rental_location_city;
                        $post_data['rental_location_state'] = $rental_location_state;
                        $post_data['rental_location_country'] = $rental_location_country;
                        $post_data['rental_location_zip'] = $rental_location_zip;
                        $post_data['rental_latitude'] = $rental_location_array['RentalLocation']['Latitude'];
                        $post_data['rental_longitude'] = $rental_location_array['RentalLocation']['Longitude'];
                        $post_data['rental_phone1'] = (isset($rental_location_array['RentalLocation']['Phone1']) ? $rental_location_array['RentalLocation']['Phone1'] : '');
                        $post_data['rental_phone2'] = (isset($rental_location_array['RentalLocation']['Phone2']) ? $rental_location_array['RentalLocation']['Phone2'] : '');
                        $post_data['rental_fax'] = (isset($rental_location_array['RentalLocation']['Fax']) ? $rental_location_array['RentalLocation']['Fax'] : '');

                        $post_data['dropoff_date_formatted'] = $dropoff_date_formatted;
                        $post_data['dropoff_date'] = $dropoff_date;
                        $post_data['dropoff_time'] = $dropoff_time;
                        $post_data['dropoff_date_time'] = $post_data['dropoff_date'] . ' ' . substr($post_data['dropoff_time'], 0, 5) . ' ' . substr($post_data['dropoff_time'], 5);
                        $post_data['return_location_name'] = $return_location_name;
                        $post_data['return_location_street'] = $return_location_street;
                        $post_data['return_location_city'] = $return_location_city;
                        $post_data['return_location_state'] = $return_location_state;
                        $post_data['return_location_zip'] = $return_location_zip;
                        $post_data['return_location_country'] = $return_location_country;
                        $post_data['return_latitude'] = $return_location_array['ReturnLocation']['Latitude'];
                        $post_data['return_longitude'] = $return_location_array['ReturnLocation']['Longitude'];
                        $post_data['return_phone1'] = (isset($return_location_array['ReturnLocation']['Phone1']) ? $return_location_array['ReturnLocation']['Phone1'] : '');
                        $post_data['return_phone2'] = (isset($return_location_array['ReturnLocation']['Phone2']) ? $return_location_array['ReturnLocation']['Phone2'] : '');
                        $post_data['return_fax'] = (isset($return_location_array['ReturnLocation']['Fax']) ? $return_location_array['ReturnLocation']['Fax'] : '');

                        AdvRez_Flow_Storage::reservation_flow_set_cookie('search', $post_data);
                        AdvRez_Flow_Storage::reservation_flow_save('search', $post_data);

                        $tmp_choose_list_array = AdvRez_Helper::getChooseValues($response_arrays);

                        //set display options
                        $_SESSION['DisplayOptions']= $response_arrays['Options']['DisplayOptions'];

                        // Check if it's a multi-dimentional array, if not then add the array to the session variable
                        if (count($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra']) == count($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'], COUNT_RECURSIVE)) {
                            // If there's a ONEWAY drop charge then add it to the session.
                            if (in_array("ONEWAY", $response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'])) {
                                $_SESSION['enhance']['OneWay'] = $response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'];
                            }
                        } else {
                            // Loop through the Extras and check if there's a ONEWAY drop charge.
                            // If there is then add it to the session.
                            foreach($response_arrays['RateProduct'][0]['TotalPricing']['DailyExtra'] as $key => $value) {
                                // Check if ONEWAY is in the array
                                if (in_array("ONEWAY", $value)) {
                                    // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                                    $_SESSION['enhance']['OneWay'] = $value;
                                }
                            }
                        }

                        // $choose_full_array[] = array('e' => 'stuff');
                        $choose_full_array = AdvRez_Helper::getChoose3Vehicles($tmp_choose_list_array);

                        AdvRez_Flow_Storage::reservation_flow_save('choose', $choose_full_array);
                        for ($x=0; $x <= count($choose_full_array) - 2; $x++) {
                            $choose_sort_array[$x] = $x;
                        }
                        AdvRez_Flow_Storage::reservation_flow_save('choose-sort', $choose_sort_array);
                        AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $response_arrays['PromoCodeResponse']);
                        // Choose activity ends
                        
                        //Enhance activity begins
                       $request_query = [
                            'rental_location_id' => $_SESSION['search']['rental_location_id'],
                            'class_code' => $car['ClassCode'],
                        ];

                        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestExtras', $request_query, false);

                        $tmp_response_arrays = json_decode($response_contents, true);
                        $response_arrays = $tmp_response_arrays['d'];
                        $tmp_pay_type = ($profile_data['PaymentPreference'] == 1)?'prepaid':'counter';
                        $_SESSION['enhance']['RateID'] = $rate_id;
                        $_SESSION['enhance']['ClassCode'] = $car['ClassCode'];
                        $_SESSION['enhance']['Prepaid'] = 'N';
                        $_SESSION['enhance']['payment_type'] = $tmp_pay_type; //counter or prepaid
                        $_SESSION['enhance']['vehicleIndex'] = $index_key;

                        if (count($response_arrays) > 0 ) {
                            $_SESSION['enhance']['DailyExtra'] = $response_arrays;
                        }
                        if (isset($clean_post_data['promo_primary']) ) {
                            $_SESSION['enhance']['promo_primary'] = $clean_post_data['promo_primary'];
                        }
                        if (isset($clean_post_data['kayakclickid']) ) {
                            $_SESSION['enhance']['kayakclickid'] = $clean_post_data['kayakclickid'];
                        }                        
                        
                        $tmp_response_arrays = json_decode($response_contents, true);
                        $response_arrays = $tmp_response_arrays['d'];    
                        $add_options = explode(",", $profile_data['AdditionalOption']);
                        if(in_array('GPS', $add_options)){
                            $add_options[] = 'MTECH';
                        }
                        if(in_array('MTECH', $add_options)){
                            $add_options[] = 'GPS';
                        }
                        $vehicleOptions = array();
                        if(isset($response_arrays[0]['ExtraCode'])) {
                            foreach($response_arrays as $opt) {
                                $code = $opt['ExtraCode'];
                                if(in_array($code, $add_options)) {
                                    $vehicleOptions[] = $code;
                                }
                            }
                        }                        
                        //Enhance activity ends
                        
                        //remove one hand control, if user has two hand controls
                        $sort_options_handcontrol_filter = array();
                        foreach($vehicleOptions as $voption){  
                            if($voption == 'HCR' || $voption == 'HCL'){
                                    array_push($sort_options_handcontrol_filter,$voption);
                            }
                        }
                        if(count($sort_options_handcontrol_filter) == 2){
                            $key = array_search ('HCR', $vehicleOptions);
                            unset($vehicleOptions[$key]);
                        } 
                        
                        //Age Dropdown code
                        $this->setUserAgeCode();
                        if(isset($_SESSION['search']['age']) && $_SESSION['search']['age_category'] == 'UAGE') {
                            $drivers_age = $_SESSION['search']['age_category'];
                            foreach ($vehicleOptions as $key => $value) {
                                if ($value == 'UAGE') {
                                    unset($vehicleOptions[$key]);
                                    unset($_SESSION['reserve']['vehicleOptions'][$key]);
                                }
                            }
                            if ($drivers_age == 'UAGE') {
                                $vehicleOptions[] = 'UAGE';
                                $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
                            }
                        }
                        elseif (empty($_SESSION['search']['age']) || $_SESSION['search']['age'] == '') {
                            $_SESSION['search']['age_category'] = '';
                            $_SESSION['search']['age'] = '25+';
                            $drivers_age = $_SESSION['search']['age_category'];
                        }                        
                        
                        //Reserve activities begins
                        if(count($vehicleOptions) > 0) {
                            $_SESSION['reserve']['vehicle_options'] = $vehicleOptions;
                            $f_flag = 0;
                            
                            $promo_codes[] = '';
                            // $user_search_array = array();

                            if (isset($_SESSION['search']['promo_codes'])) {
                                $promo_codes = $this->getPromoCodes($_SESSION['search']['promo_codes']);
                                // $user_search_array = $_SESSION['search'];
                            }
                            // $promos = $bookmark_search_array['promo_codes'];
                            
                            $clean_post_data['vehicleIndex'] = $index_key;
                            $clean_post_data['RateID'] = $rate_id;
                            $clean_post_data['ClassCode'] = $car['ClassCode'];
                            $clean_post_data['vehicleEnhanceType'] = 'initial_selected_car';
                            
                            $reserve_vehicle_index = $clean_post_data['vehicleIndex'];
                     // error_log(' B-444444   $_SESSION[choose][$reserve_vehicle_index]: ' . print_r($_SESSION['choose'][$reserve_vehicle_index], true));

                            $prepaid = 'N';
                            $payment_type_prefix = 'R';
                            if (isset($_SESSION['enhance']['payment_type'])) {
                                if ($_SESSION['enhance']['payment_type'] == 'prepaid') {
                                    $prepaid = 'Y';
                                    $payment_type_prefix = 'P';
                                }
                            }

                            //$vehicleOptions = isset($clean_post_data['vehicleOptions']) ? $clean_post_data['vehicleOptions'] : array( 0 => '');
                            $daily_rate = $_SESSION['choose'][$clean_post_data['vehicleIndex']][$payment_type_prefix . 'Rate1PerDay'];

                            /*if (empty($vehicleOptions)) {
                                $vehicleOptions = array( 0 => '');
                            }*/
                            //$vehicleOptions = array( 0 => '');    
                            $request_query = [
                                        'rental_location_id' => $_SESSION['search']['rental_location_id'],
                                        'return_location_id' => $_SESSION['search']['return_location_id'],
                                        'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                                        'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                                        'rate_id' => $clean_post_data['RateID'],
                                        'class_code' => $clean_post_data['ClassCode'],
                                        'prepaid' => 'Y',
                                        'promo_codes' => $promo_codes,
                                        'vehicleOptions' => $vehicleOptions,
                                        'daily_rate' => $daily_rate,
                                        'adv_login_member_number' => $adv_login_member_number
                            ];

                            $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);
                            $tmp_req_bil_prepaid_response_array = json_decode($response_contents, true);
                            
                            if (isset($tmp_req_bil_prepaid_response_array['Payload'])) {
                                $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array['Payload'];
                            } else {
                                $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array;
                            }
                            
                            if(!is_array($tmp_req_bil_prepaid_response_array)) {
                                $f_flag = 1;
                            }

                            $request_query = [
                                        'rental_location_id' => $_SESSION['search']['rental_location_id'],
                                        'return_location_id' => $_SESSION['search']['return_location_id'],
                                        'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                                        'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                                        'rate_id' => $clean_post_data['RateID'],
                                        'class_code' => $clean_post_data['ClassCode'],
                                        'prepaid' => 'N',
                                        'promo_codes' => $promo_codes,
                                        'vehicleOptions' => $vehicleOptions,
                                        'daily_rate' => $daily_rate,
                                        'adv_login_member_number' => $adv_login_member_number,
                            ];

                            $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);
                            $tmp_req_bil_counter_response_array = json_decode($response_contents, true);                            
                            
                            if (isset($tmp_req_bil_counter_response_array['Payload'])) {
                                $req_bil_counter_response_array = $tmp_req_bil_counter_response_array['Payload'];
                            } else {
                                $req_bil_counter_response_array = $tmp_req_bil_counter_response_array;
                            }
                            
                            if(!is_array($tmp_req_bil_counter_response_array)) {
                                $f_flag = 1;
                            }

                            $_SESSION['choose'][$reserve_vehicle_index]['RentalDays'] = $req_bil_prepaid_response_array['RentalDays'];

                            if (strtoupper($req_bil_counter_response_array['RatePlan']) == 'WEEKLY') {
                                $rate_amount = $req_bil_counter_response_array['RatePeriod']['AmtPerWeek'];
                            } else {
                                $rate_amount = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];
                            }

                            $payment_type_prefix = 'R';
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateAmount'] = $rate_amount;
                        //Setting getRates DiscountPercent to requestBill DiscountPercent
                            $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $req_bil_counter_response_array['DiscountPercent'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateCharge'] = $req_bil_counter_response_array['RateCharge'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalTaxes'] = $req_bil_counter_response_array['TotalTaxes'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalExtras'] = $req_bil_counter_response_array['TotalExtras'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalCharges'] = $req_bil_counter_response_array['TotalCharges'];
                            $_SESSION['choose'][$reserve_vehicle_index]['Taxes'] = $req_bil_counter_response_array['Taxes'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'] = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];

                            if (strtoupper($req_bil_prepaid_response_array['RatePlan']) == 'WEEKLY') {
                                $rate_amount = $req_bil_prepaid_response_array['RatePeriod']['AmtPerWeek'];
                            } else {
                                $rate_amount = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];
                            }

                            // Check if it's a multi-dimensional array, if not then add the array to the session variable
                            if (count($req_bil_counter_response_array['DailyExtra']) == count($req_bil_counter_response_array['DailyExtra'], COUNT_RECURSIVE)) {

                                // If there's a ONEWAY drop charge then add it to the session.
                                if (in_array("ONEWAY", $req_bil_counter_response_array['DailyExtra'])) {
                                    $_SESSION['enhance']['ROneWay'] = $req_bil_counter_response_array['DailyExtra'];
                                }

                            } else {

                                // If there's a ONEWAY drop charge then add it to the session.
                                if (count($req_bil_counter_response_array['DailyExtra']) > 0) {
                                    // Loop through the Extras and check if there's a ONEWAY drop charge.
                                    // If there is then add it to the session.
                                    foreach($req_bil_counter_response_array['DailyExtra'] as $key => $value) {
                                        // Check if ONEWAY is in the array
                                        if (in_array("ONEWAY", $value)) {
                                            // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                                            $_SESSION['enhance']['ROneWay'] = $value;
                                        }
                                    }
                                }

                            } // End recursive if


                            $payment_type_prefix = 'P';
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateAmount'] = $rate_amount;
                        //Setting getRates DiscountPercent to requestBill DiscountPercent
                            $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $req_bil_counter_response_array['DiscountPercent'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateCharge'] = $req_bil_prepaid_response_array['RateCharge'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalTaxes'] = $req_bil_prepaid_response_array['TotalTaxes'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalExtras'] = $req_bil_prepaid_response_array['TotalExtras'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalCharges'] = $req_bil_prepaid_response_array['TotalCharges'];
                            $_SESSION['choose'][$reserve_vehicle_index]['Taxes']['Prepaid'] = $req_bil_prepaid_response_array['Taxes'];
                            $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'] = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];

                             // Check if it's a multi-dimensional array, if not then add the array to the session variable
                            if (count($req_bil_prepaid_response_array['DailyExtra']) == count($req_bil_prepaid_response_array['DailyExtra'], COUNT_RECURSIVE)) {

                                // If there's a ONEWAY drop charge then add it to the session.
                                if (in_array("ONEWAY", $req_bil_prepaid_response_array['DailyExtra'])) {
                                    $_SESSION['enhance']['POneWay'] = $req_bil_prepaid_response_array['DailyExtra'];
                                    // Unset the DailyExtra if the ONEWAY drop charge is the only extra 
                                    // so we don't get double drop charges on the reserve page.
                                    unset($req_bil_prepaid_response_array['DailyExtra']);                                
                                }

                            } else {

                                if (count($req_bil_prepaid_response_array['DailyExtra']) > 0) {
                                    // Loop through the Extras and check if there's a ONEWAY drop charge.
                                    // If there is then add it to the session.
                                    foreach($req_bil_prepaid_response_array['DailyExtra'] as $key => $value) {
                                        // Check if ONEWAY is in the array
                                        if (in_array("ONEWAY", $value)) {
                                            // Add the DailyExtra array to the session variable so we can show the ONEWAY tax in the breakdown on the reserve page
                                            $_SESSION['enhance']['POneWay'] = $value;
                                            // Unset the ONEWAY drop charge so we don't get double drop charges on the reserve page.
                                            unset($req_bil_prepaid_response_array['DailyExtra'][$key]);                                            
                                        }
                                    }
                                }
                            }
                            
                            $_SESSION['reserve']['RateID'] = $clean_post_data['RateID'];
                            $_SESSION['reserve']['ClassCode'] = $clean_post_data['ClassCode'];
                            $_SESSION['reserve']['Prepaid'] = $prepaid;
                            $_SESSION['reserve']['vehicleEnhanceType'] = $clean_post_data['vehicleEnhanceType'];
                            $_SESSION['reserve']['vehicleIndex'] = $reserve_vehicle_index;
                            $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
                            
                            
                            // Get the frequent flyer programs
                            $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/getFrequentFlyerPrograms', array('0' => ''));

                            $frequent_flyer_programs_array = json_decode($response_contents, true);
                            //print_r($frequent_flyer_programs_array);

                            if (count($frequent_flyer_programs_array) > 0) {
                                $airline = array();
                                for ($x=0; $x < count($frequent_flyer_programs_array); $x++) {

                                    $airline[$x][0] = $frequent_flyer_programs_array[$x]['AirlineCode'];
                                    $airline[$x][1] = $frequent_flyer_programs_array[$x]['Airline'];

                                }
                                $_SESSION['reserve']['airlines'] = $airline;
                            }                            

                            $tmp_array = $req_bil_prepaid_response_array['DailyExtra'];

                            // Check if it's a multi-dimentional array, if it's not then make it so
                            if (count($tmp_array) == count($tmp_array, COUNT_RECURSIVE)) {
                                $tmp_array = array('0' => $tmp_array);
                            }

                            $_SESSION['reserve']['DailyExtra'] = array_values($tmp_array);
                        }

                        // Set tmp_vehicleOptions with the vehicleOptions array
                        $_SESSION['tmp_vehicleOptions'] = $vehicleOptions;

                        //Reserve activities ends
                        $_SESSION['reserve']['express_checkout_complete_flag'] = 1;
                        break;
                    }
                }
            }
        }
        
        if($f_flag == 1) {
            unset($_SESSION['reserve'], $_SESSION['choose'], $_SESSION['enhance']);
            return false;
        }

        return true;

    }    
    
    public function updateLoyaltyProfile($post_data)
    {
        /* Update loyalty profile data begins */

        if (isset($_SESSION['adv_login']) && $_SESSION['reserve']['save_user_profile_info'] ==
            '1') {

            $update_data['memberNumber'] = $_SESSION['adv_login']->user['loyalty_membernumber'];


            if (isset($_SESSION['search']['rental_location_id']) && trim($_SESSION['search']['rental_location_id']) !=
                '') {
                $update_data['PreferredRentalLocationCode'] = $_SESSION['search']['rental_location_id'];
            }

            if (isset($_SESSION['search']['return_location_id']) && trim($_SESSION['search']['return_location_id']) !=
                '') {
                $update_data['PreferredDropoffLocationCode'] = $_SESSION['search']['return_location_id'];
            }

            if (isset($_SESSION['reserve']['ClassCode']) && trim($_SESSION['reserve']['ClassCode']) !=
                '') {
                $update_data['CarSpecification'] = $_SESSION['reserve']['ClassCode'];
            }

            if (isset($_SESSION['renter']['renter_home_phone']) && trim($_SESSION['renter']['renter_home_phone']) !=
                '') {
                $update_data['MobileNumber'] = $_SESSION['renter']['renter_home_phone'];
            }

            if (isset($_SESSION['renter']['renter_dob']) && trim($_SESSION['renter']['renter_dob']) !=
                '') {
                $update_data['dob'] = $_SESSION['renter']['renter_dob'];
            }

            if (isset($_SESSION['renter']['renter_address1']) && trim($_SESSION['renter']['renter_address1']) !=
                '') {
                $update_data['AddressLine1'] = $_SESSION['renter']['renter_address1'];
            }

            if (isset($_SESSION['renter']['renter_address2']) && trim($_SESSION['renter']['renter_address2']) !=
                '') {
                $update_data['AddressLine2'] = $_SESSION['renter']['renter_address2'];
            }

            if (isset($_SESSION['renter']['renter_city']) && trim($_SESSION['renter']['renter_city']) !=
                '') {
                $update_data['City'] = $_SESSION['renter']['renter_city'];
            }

            if (isset($_SESSION['renter']['renter_state']) && trim($_SESSION['renter']['renter_state']) !=
                '') {
                $update_data['State'] = $_SESSION['renter']['renter_state'];
            }

            if (isset($_SESSION['renter']['renter_zip']) && trim($_SESSION['renter']['renter_zip']) !=
                '') {
                $update_data['PostalCode'] = $_SESSION['renter']['renter_zip'];
            }

            if (isset($_SESSION['renter']['renter_country']) && trim($_SESSION['renter']['renter_country']) !=
                '') {
                $update_data['Country'] = $_SESSION['renter']['renter_country'];
            }

            if (isset($_SESSION['reserve']['frequentFlyerNumber']) && isset($_SESSION['reserve']['airline']) &&
                trim($_SESSION['reserve']['frequentFlyerNumber']) != "" && trim($_SESSION['reserve']['airline']) !=
                "") {
                $update_data['FrequentFlyerAirline'] = $_SESSION['reserve']['airline'];
                $update_data['FrequentFlyerNumber'] = $_SESSION['reserve']['frequentFlyerNumber'];
            }

            if (!isset($post_data['use_profile_address'])) {

                if (isset($post_data['billing_street_address_1']) && trim($post_data['billing_street_address_1']) !=
                    '') {
                    $update_data['BAddressLine1'] = $post_data['billing_street_address_1'];
                }
                if (isset($post_data['billing_street_address_2']) && trim($post_data['billing_street_address_2']) !=
                    '') {
                    $update_data['BAddressLine2'] = $post_data['billing_street_address_2'];
                }
                if (isset($post_data['billing_postal_code']) && trim($post_data['billing_postal_code']) !=
                    '') {
                    $update_data['BPostalCode'] = $post_data['billing_postal_code'];
                }
                if (isset($post_data['billing_city']) && trim($post_data['billing_city']) != '') {
                    $update_data['BCity'] = $post_data['billing_city'];
                }
                if (isset($post_data['billing_state']) && trim($post_data['billing_state']) !=
                    '') {
                    $update_data['BState'] = $post_data['billing_state'];
                }
                if (isset($post_data['billing_country']) && trim($post_data['billing_country']) !=
                    '') {
                    $update_data['BCountry'] = $post_data['billing_country'];
                }

            }


            if (count($_SESSION['confirm']['DailyExtra']) > 0 && $_SESSION['reserve']['vehicleOptions'][0] != '') {
                $additional_option = implode(",", $_SESSION['reserve']['vehicleOptions']);
                if ($additional_option != '') {
                    $update_data['AdditionalOption'] = $additional_option;
                }
            }

            if (isset($_SESSION['confirm']['payment_type']) && trim($_SESSION['confirm']['payment_type']) != '') {
                if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
                    $update_data['PaymentPreference'] = '1';
                }
                if ($_SESSION['confirm']['payment_type'] == 'counter') {
                    $update_data['PaymentPreference'] = '0';
                }
            }

            $request_member_profile_update = AdvRez_Helper::updateMemberPreference($update_data);


            if ($request_member_profile_update['d']['Status'] == 'OK') {
                $_SESSION['loyalty_member_profile_update_flag'] = 1;
                $_SESSION['loyalty_member_profile_refresh_flag'] = 1;
            }

        }
        return TRUE;
        /* Update loyalty profile data ends */
    }
    
    
    public function valideatePromos(){
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $clean_post_data = [];
        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

       	//Adding session to manage user profile information checkbox
        unset($_SESSION['show_user_profile_reserve_flag']);
        if(isset($clean_post_data['use_profile_info']) && $clean_post_data['use_profile_info'] != 'true') {
            $_SESSION['show_user_profile_reserve_flag'] = 1;
        }
        
        $_SESSION['enhance']['payment_type'] = '';
        if($clean_post_data['payType'] == 'pay_now') {
            $_SESSION['enhance']['payment_type'] = 'prepaid';
        }

        if(isset($clean_post_data['profile_check_flag']) && $clean_post_data['profile_check_flag']  == 1){
            $_SESSION['renter']['use_profile_info'] = 1;
        }

        /******************** CART ABANDONMENT CODE ********************/
        $promo_codes = array_map(function($x){
            return strtolower(trim($x));
        }, $clean_post_data['promo_codes']);

        $abandonment_promocode = strtolower($this->api_url_array['abandonment_promocode']);

        $car_restrictions = array('ECAR', 'CCAR', 'XXAR');

        // Set the abandonment_promocode session
        if (isset($_SESSION['abandonment']['abandonment_promocode']) && count($clean_post_data['promo_codes']) == 0) {

            $clean_post_data['promo_codes'][0] = $_SESSION['abandonment']['abandonment_promocode'];


        } elseif ((isset($clean_post_data['promo_codes']) && count($clean_post_data['promo_codes']) > 0) && (isset($_SESSION['abandonment']['abandonment_promocode']) && $_SESSION['abandonment']['abandonment_promocode'] !== "")) {

            if (!in_array($_SESSION['reserve']['ClassCode'], $car_restrictions)) {
                if (!in_array($abandonment_promocode, $promo_codes)) {
                    array_unshift($clean_post_data['promo_codes'], $_SESSION['abandonment']['abandonment_promocode']);
                }
            }

        } elseif ((isset($clean_post_data['promo_codes']) && count($clean_post_data['promo_codes']) > 0) && (!isset($_SESSION['abandonment']['abandonment_promocode']) && in_array($abandonment_promocode,$promo_codes))) {
            for ($x=0; $x < count($clean_post_data['promo_codes']) ; $x++) {
                if (strtolower(trim($clean_post_data['promo_codes'][$x])) == strtolower($this->api_url_array['abandonment_promocode'])) {

                    $updated_content = AdvRez_Helper::generateReserveSummaryWithUpdatedContent();
                    $promo_msg_html = AdvRez_Helper::reservePromocodeMessageDsiplay();
                    $promocode_section_html = AdvRez_Helper::reservePagepromocodesection();
                    unset($clean_post_data['promo_codes'][$x]);
                    $res_summary_with_promo= array('Status' => 'ERROR', 'ErrorMsg' => 'Promo code '.$this->api_url_array['abandonment_promocode']. ' can not be used.','content' => 'success','updated_content' => $updated_content,'promo_msg_html'=>$promo_msg_html,'promocode_section_html'=>$promocode_section_html);
        
                    return json_encode($res_summary_with_promo);
                }
            }

        }  elseif (in_array($_SESSION['reserve']['ClassCode'],$car_restrictions)) {

            if ((isset($clean_post_data['promo_codes']) && count($clean_post_data['promo_codes']) > 0) && (isset($_SESSION['abandonment']['abandonment_promocode']) && in_array($abandonment_promocode,$promo_codes))) {

                for ($x=0; $x < count($clean_post_data['promo_codes']) ; $x++) {

                    if (strtolower(trim($clean_post_data['promo_codes'][$x])) == strtolower(trim($_SESSION['abandonment']['abandonment_promocode']))) {

                        unset($clean_post_data['promo_codes'][$x]);

                        array_values($clean_post_data['promo_codes']);

                        break;
                    }
                }
            }
        }
        /******************** END CART ABANDONMENT CODE ********************/

        $promo_codes[] = array();
        if (isset($clean_post_data['promo_codes'])) {
            $promo_codes = $this->getPromoCodes($clean_post_data['promo_codes']);

            // If the first index of the array is empty then unset it. We unset it since that technically
            // is a blank promocode.
            if (count($clean_post_data['promo_codes']) == 1 && empty($promo_codes[0])) {
                unset($promo_codes[0]);
            }

        }

        $bookmark_search_array = AdvRez_Helper::getCookieArray('adv_userbookmark');

        $reserve_vehicle_index = $_SESSION['reserve']['vehicleIndex'];
        $prepaid = 'N';
        $payment_type_prefix = 'R';
        if (isset($_SESSION['enhance']['payment_type'])) {
            if ($_SESSION['enhance']['payment_type'] == 'prepaid') {
                $prepaid = 'Y';
                $payment_type_prefix = 'P';
            }
        }

        $vehicleOptions = $_SESSION['reserve']['vehicleOptions'];
        $daily_rate = $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'];

        if (empty($vehicleOptions)) {
            $vehicleOptions = array( 0 => '');
        }
        
        
        $bookmark_search_array['renter_dob'] = $clean_post_data['dob'];
        $bookmark_search_array['renter_pickup_date'] = $clean_post_data['pickupDate'];
        
        $drivers_age = $this->calcDriverAge($clean_post_data['dob'], $clean_post_data['pickupDate']);
        
        // foreach ($vehicleOptions as $key => $value) {

        //     if ($value == 'UAGE') {
        //         unset($vehicleOptions[$key]);
        //         unset($_SESSION['reserve']['vehicleOptions'][$key]);
        //     }
        //     if ($value == 'UAGEJR') {
        //         unset($vehicleOptions[$key]);
        //         unset($_SESSION['reserve']['vehicleOptions'][$key]);
        //     }
        // }
        
        // if ($drivers_age == 'under25') {
        //     $vehicleOptions[] = 'UAGE';
        //     $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
        // } elseif ($drivers_age == 'under21') {
        //     $vehicleOptions[] = 'UAGEJR';
        //     $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
        // }

        //Age Dropdown code
        if(isset($clean_post_data['renterAge'])) {
            $renter_age = $clean_post_data['renterAge'];
            $_SESSION['search']['age'] = $renter_age;
        }
        else {
            $renter_age = $_SESSION['search']['age'];
            // $_SESSION['search']['age'] = $renter_age;
        }
        $this->setUserAgeCode();
        if(isset($_SESSION['search']['age']) && $_SESSION['search']['age_category'] == 'UAGE') {
            $drivers_age = $_SESSION['search']['age_category'];
            foreach ($vehicleOptions as $key => $value) {
                if ($value == 'UAGE') {
                    unset($vehicleOptions[$key]);
                    unset($_SESSION['reserve']['vehicleOptions'][$key]);
                }
            }
            if ($drivers_age == 'UAGE') {
                $vehicleOptions[] = 'UAGE';
                $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
            }
        }
        elseif (empty($_SESSION['search']['age']) || $_SESSION['search']['age'] == '') {
            $_SESSION['search']['age_category'] = '';
            $_SESSION['search']['age'] = '25+';
            $drivers_age = $_SESSION['search']['age_category'];
        }        
        
        
        // Set adv_login_member_number to 0 as default, meaning customer is not logged in.
        $adv_login_member_number = 0;
        // Check if the customer is logged in or not, if they are set the member number.
        if(isset($_SESSION['adv_login']->memberNumber)) {
            $adv_login_member_number = $_SESSION['adv_login']->memberNumber;
        }

//        echo "<pre>";print_r($vehicleOptions);
        
        $request_query = [
                    'rental_location_id' => $_SESSION['search']['rental_location_id'],
                    'return_location_id' => $_SESSION['search']['return_location_id'],
                    'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                    'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                    // 'rate_id' => $clean_post_data['RateID'],
                    'rate_id' => $_SESSION['reserve']['RateID'],
                    // 'class_code' => $clean_post_data['ClassCode'],
                    'class_code' => $_SESSION['reserve']['ClassCode'],
                    'prepaid' => 'Y',
                    'promo_codes' => $promo_codes,
                    'vehicleOptions' => $vehicleOptions,
                    'daily_rate' => $daily_rate,
                    'adv_login_member_number' => $adv_login_member_number,
        ];
        

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);
                
        $tmp_req_bil_prepaid_response_array = json_decode($response_contents, true);
        
         // Create the temp_array
       $tmp_array = $tmp_req_bil_prepaid_response_array['Payload']['DailyExtra'];

       // Check if it's a multi-dimentional array, if it's not then make it so
       if (count($tmp_array) == count($tmp_array, COUNT_RECURSIVE)) {
           $tmp_array = array('0' => $tmp_array);
       }

       $_SESSION['reserve']['DailyExtra'] = array_values($tmp_array);
       
      
       
        $_SESSION['choose'][$reserve_vehicle_index]['PRateDiscount'] = $tmp_req_bil_prepaid_response_array['Payload']['RateDiscount'];
        

        if (isset($tmp_req_bil_prepaid_response_array['Payload']['PromoCodeResponse']['PromoCodeEntered'])) {

            $cnt = 1;
            $call_req_bil_again = false;
            $bookmark_search_array['promo_codes'] = array();
            foreach ($tmp_req_bil_prepaid_response_array['Payload']['PromoCodeResponse']['PromoCodeEntered'] as $key => $value) {
                if (isset($value['VehicleRestrictions']) && $value['VehicleRestrictions'] == 'True' && $value['PromoStatus'] != 'OK') {
                    unset($tmp_req_bil_prepaid_response_array['Payload']['PromoCodeResponse']['PromoCodeEntered'][$key]);
                    $call_req_bil_again = true;
                } elseif (isset($value['PromoXMLElements']['DiscountPercent']) && $value['PromoStatus'] == 'OK') {
                    $call_req_bil_again = true;
                } else {
                    $bookmark_search_array['promo_codes'][] = $value['PromoCode'];
                }
                $cnt++;
            }

            // if (1 == 1) {
            /*if ($call_req_bil_again) {

                $request_query = [
                    // 'adv_reservation' => $clean_post_data['adv_reservation'],
                    'rental_location_id' => $_SESSION['search']['rental_location_id'],
                    'return_location_id' => $_SESSION['search']['return_location_id'],
                    'pickup_date' => $_SESSION['search']['pickup_date'],
                    'dropoff_date' => $_SESSION['search']['dropoff_date'],
                    'pickup_time' => $_SESSION['search']['pickup_time'],
                    'dropoff_time' => $_SESSION['search']['dropoff_time'],
                    'promo_codes' => $promo_codes,
                    'class_code' => $_SESSION['choose'][$reserve_vehicle_index]['ClassCode'],
                    'rate_id' => $_SESSION['choose'][$reserve_vehicle_index]['RateID'],
                    'adv_login_member_number' => $adv_login_member_number,
                ];

                $rates_endpoint = '/updateRates';

                $response_contents = AdvRez_Helper::guzzleGet($this->api_url_array['full_api_url'] . $rates_endpoint, $request_query);

                $tmp_response_arrays = json_decode($response_contents, true);
                $response_arrays = $tmp_response_arrays['Payload']['RateProduct']['0'];


                if (strtoupper($response_arrays['RatePlan']) == 'WEEKLY') {
                    $_SESSION['choose'][$reserve_vehicle_index]['RRate1PerDay'] = $response_arrays['TotalPricing']['RatePeriod']['AmtPerWeek'];
                    $_SESSION['choose'][$reserve_vehicle_index]['PRate1PerDay'] = $response_arrays['Prepaid']['TotalPricing']['RatePeriod']['AmtPerWeek'];
                } else {
                    $_SESSION['choose'][$reserve_vehicle_index]['RRate1PerDay'] = $response_arrays['TotalPricing']['RatePeriod']['Rate1PerDay'];
                    $_SESSION['choose'][$reserve_vehicle_index]['PRate1PerDay'] = $response_arrays['Prepaid']['TotalPricing']['RatePeriod']['Rate1PerDay'];
                }

                $_SESSION['choose'][$reserve_vehicle_index]['RateAmount'] = $response_arrays['RateAmount'];
                $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $response_arrays['DiscountPercent'];
                $_SESSION['choose'][$reserve_vehicle_index]['RRateAmount'] = $response_arrays['RateAmount'];
                $_SESSION['choose'][$reserve_vehicle_index]['RRateCharge'] = $response_arrays['TotalPricing']['RateCharge'];
                $_SESSION['choose'][$reserve_vehicle_index]['RTotalTaxes'] = $response_arrays['TotalPricing']['TotalTaxes'];
                $_SESSION['choose'][$reserve_vehicle_index]['RTotalExtras'] = $response_arrays['TotalPricing']['TotalExtras'];
                $_SESSION['choose'][$reserve_vehicle_index]['RRateDiscount'] = $response_arrays['TotalPricing']['RateDiscount'];
                $_SESSION['choose'][$reserve_vehicle_index]['RTotalCharges'] = $response_arrays['TotalPricing']['TotalCharges'];
                $_SESSION['choose'][$reserve_vehicle_index]['PRateAmount'] = $response_arrays['Prepaid']['RateAmount'];
                $_SESSION['choose'][$reserve_vehicle_index]['PRateCharge'] = $response_arrays['Prepaid']['TotalPricing']['RateCharge'];
                $_SESSION['choose'][$reserve_vehicle_index]['PTotalTaxes'] = $response_arrays['Prepaid']['TotalPricing']['TotalTaxes'];
                $_SESSION['choose'][$reserve_vehicle_index]['PTotalExtras'] = $response_arrays['Prepaid']['TotalPricing']['TotalExtras'];
                $_SESSION['choose'][$reserve_vehicle_index]['PRateDiscount'] = $response_arrays['Prepaid']['TotalPricing']['RateDiscount'];
                $_SESSION['choose'][$reserve_vehicle_index]['PTotalCharges'] = $response_arrays['Prepaid']['TotalPricing']['TotalCharges'];

                $request_query = [
                            'rental_location_id' => $_SESSION['search']['rental_location_id'],
                            'return_location_id' => $_SESSION['search']['return_location_id'],
                            'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                            'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                            // 'rate_id' => $clean_post_data['RateID'],
                            'rate_id' => $_SESSION['reserve']['RateID'],
                            // 'class_code' => $clean_post_data['ClassCode'],
                            'class_code' => $_SESSION['reserve']['ClassCode'],
                            'prepaid' => 'Y',
                            'promo_codes' => $promo_codes,
                            'vehicleOptions' => $vehicleOptions,
                            'daily_rate' => $daily_rate,
                            'adv_login_member_number' => $adv_login_member_number,
                ];

                $response_contents = AdvRez_Helper::guzzleGet($this->api_url_array['full_api_url'] . '/requestBill', $request_query);

                $tmp_req_bil_prepaid_response_array = json_decode($response_contents, true);

            }*/

        }

        if ($tmp_req_bil_prepaid_response_array['status'] == 'success') {
            $_SESSION['enhance']['enhanceDailyExtra'] = $tmp_req_bil_prepaid_response_array['Payload']['DailyExtra'];
        }
 
        if (isset($tmp_req_bil_prepaid_response_array['Payload'])) {
            $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array['Payload'];
        } else {
            $req_bil_prepaid_response_array = $tmp_req_bil_prepaid_response_array;
        }

        $request_query = [
                    'rental_location_id' => $_SESSION['search']['rental_location_id'],
                    'return_location_id' => $_SESSION['search']['return_location_id'],
                    'pickup_date_time' => $_SESSION['search']['pickup_date_time'],
                    'dropoff_date_time' => $_SESSION['search']['dropoff_date_time'],
                    // 'rate_id' => $clean_post_data['RateID'],
                    'rate_id' => $_SESSION['reserve']['RateID'],
                    // 'class_code' => $clean_post_data['ClassCode'],
                    'class_code' => $_SESSION['reserve']['ClassCode'],
                    'prepaid' => 'N',
                    'promo_codes' => $promo_codes,
                    'vehicleOptions' => $vehicleOptions,
                    'daily_rate' => $daily_rate,
                    'adv_login_member_number' => $adv_login_member_number,
        ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/requestBill', $request_query);

        $tmp_req_bil_counter_response_array = json_decode($response_contents, true);

        $_SESSION['choose'][$reserve_vehicle_index]['RRateDiscount'] = $tmp_req_bil_counter_response_array['Payload']['RateDiscount'];
        $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $tmp_req_bil_counter_response_array['Payload']['DiscountPercent'];


        if ($tmp_req_bil_counter_response_array['status'] == 'success') {
            $_SESSION['enhance']['enhanceDailyExtra'] = $tmp_req_bil_counter_response_array['Payload']['DailyExtra'];
        }

        if (isset($tmp_req_bil_counter_response_array['Payload'])) {
            $req_bil_counter_response_array = $tmp_req_bil_counter_response_array['Payload'];
        } else {
            $req_bil_counter_response_array = $tmp_req_bil_counter_response_array;
        }

        $_SESSION['choose'][$reserve_vehicle_index]['RentalDays'] = $req_bil_prepaid_response_array['RentalDays'];

        // if (isset)
        if (strtoupper($req_bil_counter_response_array['RatePlan']) == 'WEEKLY') {
            $rate_amount = $req_bil_counter_response_array['RatePeriod']['AmtPerWeek'];
        } else {
            $rate_amount = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];
        }
        $payment_type_prefix = 'R';

       // $_SESSION['choose'][$reserve_vehicle_index]['DiscountPercent'] = $response_arrays['DiscountPercent'];

        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateAmount'] = $rate_amount;
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateCharge'] = $req_bil_counter_response_array['RateCharge'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalTaxes'] = $req_bil_counter_response_array['TotalTaxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalExtras'] = $req_bil_counter_response_array['TotalExtras'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateDiscount'] = $req_bil_counter_response_array['RateDiscount'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalCharges'] = $req_bil_counter_response_array['TotalCharges'];
        $_SESSION['choose'][$reserve_vehicle_index]['Taxes'] = $req_bil_counter_response_array['Taxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'] = $req_bil_counter_response_array['RatePeriod']['Rate1PerDay'];

 
        if (strtoupper($req_bil_prepaid_response_array['RatePlan']) == 'WEEKLY') {
            $rate_amount = $req_bil_prepaid_response_array['RatePeriod']['AmtPerWeek'];
        } else {
            $rate_amount = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];
        }

        $payment_type_prefix = 'P';
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateAmount'] = $rate_amount;
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateCharge'] = $req_bil_prepaid_response_array['RateCharge'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalTaxes'] = $req_bil_prepaid_response_array['TotalTaxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalExtras'] = $req_bil_prepaid_response_array['TotalExtras'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'RateDiscount'] = $req_bil_prepaid_response_array['RateDiscount'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'TotalCharges'] = $req_bil_prepaid_response_array['TotalCharges'];
        $_SESSION['choose'][$reserve_vehicle_index]['Taxes']['Prepaid'] = $req_bil_prepaid_response_array['Taxes'];
        $_SESSION['choose'][$reserve_vehicle_index][$payment_type_prefix . 'Rate1PerDay'] = $req_bil_prepaid_response_array['RatePeriod']['Rate1PerDay'];

        // $_SESSION['reserve']['RateID'] = $clean_post_data['RateID'];
        // $_SESSION['reserve']['ClassCode'] = $clean_post_data['ClassCode'];
        $_SESSION['reserve']['Prepaid'] = $prepaid;
        // $_SESSION['reserve']['vehicleEnhanceType'] = $clean_post_data['vehicleEnhanceType'];
        // $_SESSION['reserve']['vehicleIndex'] = $reserve_vehicle_index;
        // $_SESSION['reserve']['vehicleOptions'] = $vehicleOptions;
        $bookmark_search_array['promo_codes'] = $clean_post_data['promo_codes'];
        $_SESSION['search']['promo_codes'] = $clean_post_data['promo_codes'];
        
        AdvRez_Flow_Storage::reservation_flow_set_cookie('adv_userbookmark', $bookmark_search_array, time() + ( 185 * 24 * 60 * 60));

        //Setting validatePromoStack with updated payment type/prepaid value
        if ($prepaid == 'N') {
            AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $req_bil_counter_response_array['PromoCodeResponse']);
        }
        else {
            AdvRez_Flow_Storage::reservation_flow_save('choose_promos', $req_bil_prepaid_response_array['PromoCodeResponse']);
        }
        
        $phone_dial_code = $post_data['phone_dial_code'];
        $phone_number = $post_data['phone_number'];
        $i = 1;
        $_SESSION['renter']['renter_dob'] = $clean_post_data['dob'];
        $_SESSION['renter']['renter_pickup_date'] = $clean_post_data['pickupDate'];

        $_SESSION['renter']['renter_first'] = $clean_post_data['first_name'];
        $_SESSION['renter']['renter_last'] = $clean_post_data['last_name'];
        $_SESSION['renter']['renter_email_address'] = $clean_post_data['email'];
        // $_SESSION['renter']['renter_home_phone'] = str_replace($phone_dial_code, "", $phone_number, $i);
       // $_SESSION['renter']['renter_home_phone'] = $phone_number;
        $_SESSION['renter']['renter_home_phone'] = $clean_post_data['phone_number'];
        $_SESSION['renter']['renter_home_phone_country'] = $post_data['phone_country'];
        $_SESSION['renter']['renter_home_phone_dial_code'] = $phone_dial_code;
        $_SESSION['renter']['renter_address1'] = $clean_post_data['street_address_1'];
        $_SESSION['renter']['renter_address2'] = $clean_post_data['street_address_2'];
        $_SESSION['renter']['renter_city'] = $clean_post_data['city'];
        $_SESSION['renter']['renter_state'] = $clean_post_data['state'];
        $_SESSION['renter']['renter_zip'] = $clean_post_data['postal_code'];
        //$_SESSION['renter']['renter_country'] = $clean_post_data['country']; 
        
     
        
       // reserve summary updated without page reload
        if(isset($clean_post_data['reservesummaryupdated_without_pagereload'])) { 
          
            $_SESSION['enhance']['payment_type'] = ($clean_post_data['payType'] == "pay_now")?'prepaid':'';

            $updated_content = AdvRez_Helper::generateReserveSummaryWithUpdatedContent();
            $promo_msg_html = AdvRez_Helper::reservePromocodeMessageDsiplay();
            $promocode_section_html = AdvRez_Helper::reservePagepromocodesection();
            $promocode_button = AdvRez_Helper::modifyoptionsPopup_promocodesection();
            $res_summary_with_promo= array('content' => 'success','updated_content' => $updated_content,'promo_msg_html'=>$promo_msg_html,'promocode_section_html'=>$promocode_section_html,'vehicle_counter_total'=>$_SESSION['vehicle_counter_total'],'vehicle_prepaid_total'=>$_SESSION['vehicle_prepaid_total'],'modify_options_promos'=>$promocode_button);

            return json_encode($res_summary_with_promo);
            
        } else {

            return array('content' => 'success');
        }


    }
    
    function setUserAgeCode() {
        
        $_SESSION['search']['age_category'] = '';
        if(isset($_SESSION['search']['age'])) {
            $renter_age = $_SESSION['search']['age'];

            if($renter_age == "21") {
                $_SESSION['search']['age_category'] = 'UAGE';
            }
        }
        
    }
    
}