<?php

include_once('Adv_login_BrowserInfo.php');

class Adv_login_Helper {


    /**
     * Helper function to dump error_log with line number and function
     */
    public static function err_log($dump_vars, $function_called = __FUNCTION__, $line_called = __LINE__) {

        if (gettype($dump_vars) != 'array') {
            $dump_array[] = $dump_vars;
        } else {
            $dump_array = $dump_vars;
        }

        $display_string = '';

        $cnt = 1;
        foreach ($dump_array as $value) {
            $display_string .= ' var' . $cnt . ': ' . print_r($value, true);
            $cnt++;
        }

         //error_log('   ^^^   ^^^ : ' . print_r($function_called, true) . ' line#: ' . print_r($line_called, true) . ' ' . print_r($dump_array, true));
    }

    /**
     * Helper function to save errors to log file
     */
    public static function saveToLog($message, $error_message='', $file, $function, $line){

        $date = date('M d, Y h:iA');

        $ip_address = $_SERVER['REMOTE_ADDR'];

        $obj = new ADV_OS_BR();
        // get browser
        $browser = $obj->showInfo('browser');

        // get browser version
        $browser_version = $obj->showInfo('version');
        
        // get Operating system
        $operating_system = $obj->showInfo('os');

        $log_message = "Exception information: Date: {$date}, Message: {$message}, ";

         if (isset($error_message) && $error_message !== "") {
            $log_message .= "Error Message: {$error_message}
            ";
         }

        $log_message .=" File: {$file}, Line: {$line}, Function: {$function}, Browser: {$browser}, Browser Version: {$browser_version}, Operating System: {$operating_system}, IP Address: {$ip_address}";

         error_log($log_message);
    }

    /**
     * Get ADV User
     */
    public static function getAdvFullUser($refresh = "no") {

        $membernumber = '';
        $id = '';
        $hash = '';

        if (! isset($_SESSION['adv_login'])) {
            return;
        }
        // if (isset($_SESSION['adv_login'])) {

// error_log('getAdvFullUser   _SESSION[adv_login]: ' . print_r($_SESSION['adv_login'], true));   
// error_log('getAdvFullUser   _SESSION[adv_login]->aez_message: ' . print_r($_SESSION['adv_login']->aez_message, true));   

            $user_array = Adv_login_Helper::getAdvUser($_SESSION['adv_login']->access_token);
// error_log(' sd;lkj a;lkjas dfuser_array: ' . print_r($user_array, true));

        if (! isset($user_array['email'])) {
            return;
        }
            // if (isset($user_array['email'])) {

//                 $tmp_json = Adv_login_Helper::getLoyaltyUser($user_array['email']);
// error_log('    %%%%%%%%   tmp_json: ' . print_r($tmp_json, true));

//                 if (strpos($tmp_json['d'], 'ROR:') > 0 ) {

//                     $advUser = Adv_login_Helper::getAdvUser($_SESSION['adv_login']);

// error_log('    **** ***      $advUser: '  . print_r($advUser, ture));                    
//                     $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
//                     $http = new GuzzleHttp\Client;

//                     $response = $http->post($api_url_array['full_api_url'] . '/addPersuade', [
//                         'form_params' => [
//                             'FirstName' => $advUser['first_name'],
//                             'LastName' => $advUser['last_name'],
//                             'Email' => $advUser['email'],
                    // 'services_url' => $api_url_array['services_url'],
                    // 'logging_url' => $api_url_array['logging_url'],
//                         ],
//                         'http_errors' => false
//                     ] );

//                     $loyalty_response = $response->getBody()->getContents();
//                     $loyalty_response_array = json_decode((string) $loyalty_response);
// error_log('$loyalty_response 2: ' . print_r($loyalty_response,true));
// error_log('$loyalty_response_array: ' . print_r($loyalty_response_array,true));
// //                    echo json_encode($loyalty_response);

//                     $tmp_json = $loyalty_response;

//                 }

// error_log('tmp_json: ' . print_r($tmp_json, true));
                // $persuade_array = json_decode($tmp_json['d'],true);
// error_log('                    ******************* persuade_array[0]: ' . print_r($persuade_array[0], true));

        if (isset($_SESSION['adv_login']->memberNumber)) {
            $membernumber = $_SESSION['adv_login']->memberNumber;
        } else {
            return;
        }
        if (isset($_SESSION['adv_login']->userGUID)) {
            $id = $_SESSION['adv_login']->userGUID;
        } else {
            return;
        }
        if (isset($_SESSION['adv_login']->SSO_HASH)) {
            $hash = $_SESSION['adv_login']->SSO_HASH;
        } else {
            return;
        }

        //$tmp_json = Adv_login_Helper::getUserProfile($membernumber);
         
        /*code for fetch updated profile data when user profile updated dyanamically in any website flow.
         * we have to set loyalty_member_profile_refresh_flag SESSION to refresh user profile data
         * Ex: i want save profile
         */
        
        if(isset($_SESSION['loyalty_member_profile_refresh_flag'])) { 
            $refresh = "yes";
            unset($_SESSION['loyalty_member_profile_refresh_flag']);
        }
        
        if (isset($_SESSION['adv_login']->user['memberNumber']) && $refresh == "no") {
            $tmp_json = $_SESSION['adv_login']->user;
            $user_profile_array = $tmp_json;
        } else {
            $tmp_json = Adv_login_Helper::getUserProfile($membernumber);
            $user_profile_array = $tmp_json['Data'];
            $user_profile_array['memberNumber'] = $tmp_json['Data']['MemberNumber'];
            $profile_refresh_flag = 1;
        }

       //$user_profile_array = $tmp_json['d'];

        $tmp_user_array = $user_array;
        $tmp_user_array['loyalty_membernumber'] = $membernumber;
        $tmp_user_array['loyalty_id'] = $id;
        $tmp_user_array['loyalty_hash'] = $hash;

        $full_user_array = array_merge($tmp_user_array, $user_profile_array);
        
        //code for fetch updated profile data when user profile updated dyanamically in any website flow.
        if($refresh == "yes" && isset($profile_refresh_flag)) {
            $_SESSION['adv_login']->user = $full_user_array;
        }
        
// Adv_login_Helper::err_log($user_profile_array, __FUNCTION__, __LINE__);
// Adv_login_Helper::err_log($full_user_array, __FUNCTION__, __LINE__);
        return $full_user_array;
    }

    /**
     * Get ADV User
     */
    public static function getAdvUser($bearToken) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;
        
        try {

            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/user', [
                'headers' => [
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer ' . $bearToken,
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
                ]
            ] );

        } catch (Exception $e) {

            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
            // die();            
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;
    }



    /**
     * Get Loyalty User
     */
    public static function getLoyaltyUser($userEmail) {

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;
        
        try {

            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getLoyaltyUser', [
                'query' => [
                    'Email' => $userEmail,
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
                    ],
	        	'headers' => [
				    'Accept' => 'application/json',
		        	]
                ] );
        } catch (Exception $e) {

            echo json_encode('{error: "3 Getting User Something went wrong. Please try your search another time."}');
            // die();            
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;

    }

    public static function getUserProfile($memberNumber) {
        $data['BrandName'] = "Advantage";
        $data['memberNumber'] = $memberNumber;
        try {

            $endpoint = 'Loyalty/GetLoyaltyAccount';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);

        } catch (Exception $e) {

        // error_log('bad deal 444: ' . print_r($e->getMessage(), true));
            echo json_encode('{error: "4 Getting User Something went wrong. Please try your search another time."}');
            // die();            
        }

        return $response_arrays;

    }

    /*
     * Find a car form that annimates to show search box
     */
    public static function find_a_car_form() {
        AdvLocations_Helper::getAllLocations();
        function formatDate($dateValue)
          {
            try{
                $dateValue = substr($dateValue, 0, 2) . '/' . substr($dateValue, 2, 2) . '/' . substr($dateValue, 4, 4);
                $today_date = new DateTime();
                $pick_date = new DateTime($pickup_date);
                $drop_date = new DateTime($dropoff_date);
            }
            catch(Exception $e)
            {
                $dateValue = date('m/d/Y', strtotime('+1 day'));
            }
            return $dateValue;
          }

        $return_html = "";
        $action = "";
        $rental_location = "";
        $return_location = "";
        $rental_location_name = "";
  		$return_location_name = "";
        $pickup_date = "";
        $pickup_time = "";
        $dropoff_date = "";
        $dropoff_time = "";
        $promo_codes[] = "";

        if (isset($_COOKIE['adv_userbookmark'])) {
            // Remove the slashes
            $json = stripslashes($_COOKIE['adv_userbookmark']);
           
            // Decode the json
            $json = json_decode(base64_decode($json));

            foreach ($json as $key => $value) {

                switch (strtolower($key)) {
                    case 'action':
                        $action = $value;
                        break;
                    case 'rental_location_id':
                        $rental_location = $value;
                        break;
                    case 'return_location_id':
                        $return_location = $value;
                        break;
                    case 'rental_location_name':
                        $rental_location_name = $value;
                        break;
                    case 'return_location_name':
                        $return_location_name = $value;
                        break;
                    case 'pickup_date':
                        $pickup_date = formatDate($value);
                        break;
                    case 'pickup_time':
                        $pickup_time = $value;
                        break;
                    case 'dropoff_date':
                        $dropoff_date = formatDate($value);
                        break;
                    case 'dropoff_time':
                        $dropoff_time = $value;
                        break;
                    // case 'promo_codes':
	                   //  $promo_codes[0] = $value;
	                   //  break;
                }
            }

        $today_date = date('Ymd');
        $pick_date = date('Ymd', strtotime($pickup_date));
        $drop_date =date('Ymd', strtotime($dropoff_date));
        }

        
        
        //pre populate registered user information 
        $e_check_flag = 0;
        if(isset($_SESSION['adv_login'])) {
            $profile_data = Adv_login_Helper::getAdvFullUser();
            if($rental_location == '' && $profile_data['PreferredRentalLocationCode'] != '') {
                $rental_location = $profile_data['PreferredRentalLocationCode'];
                $loc_arr = AdvLocations_Helper::getLocationInfo($rental_location);
                $rental_location_name = explode(";", $loc_arr['L']);
                $rental_location_name = $rental_location_name[0];
                
                $return_location = ($profile_data['PreferredDropoffLocationCode'] != '')?$profile_data['PreferredDropoffLocationCode']:$profile_data['PreferredRentalLocationCode'];
                $loc_arr = AdvLocations_Helper::getLocationInfo($return_location);
                $return_location_name = explode(";", $loc_arr['L']);            
                $return_location_name = $return_location_name[0];
            } 
            
            if($profile_data['CarSpecification'] != '' && $profile_data['PreferredRentalLocationCode'] != '' && $profile_data['AdditionalOption'] != '') {
                $e_check_flag = 1;
            }      
            
        }        
        
        
        

        $return_html = '<form id="adv_rez" class="aez-form" role="form" method="POST" name="adv_rez" action="/choose">
            <input
                type="hidden"
                name="api_provider"
                value="TSD"
            />
            <h3 class="aez-find-a-car__heading">Find A Car Worldwide</h3>
            <div class="aez-form-block">
                <div class="aez-form-item aez-form-item--white">
                    <label for="pickupValue" class="aez-form-item__label aez-form-item__label--hidden">Rent From</label>
                <input 
                type="search"
                id="pickupValue"
                name="pickupValue"
                pattern=".{15,}" 
                class="aez-select2-search aez-form-item__dropdown"
                placeholder="Rent From"
                style= "border-color:transparent;" 
                spellcheck="false"
                required
                value="'. $rental_location_name .'"';
                if ($pick_date < $today_date || empty($pickup_date)) {
                        $pickup_date = date('m/d/Y', strtotime('+ 1 day'));
                    }
                    if ($drop_date < $today_date || empty($dropoff_date)) {
                        $dropoff_date = date('m/d/Y', strtotime('+ 3 day'));
                    }

                $return_html .= '> 
                <label for="rental_location_id" class="aez-form-item__label--hidden">Rent From</label>
                <input id="rental_location_id" 
                name="rental_location_id" 
                style="display: none;" 
                class="aez-select2-search aez-form-item__dropdown"
                value="'. $rental_location .'"
                >
                </div>
                <div class="aez-form-item aez-form-item--white">
                    <label for="dropoffValue" class="aez-form-item__label aez-form-item__label--hidden">Return To</label>
            <input 
                type="search"
                id="dropoffValue"
                name="dropoffValue"
                class="aez-select2-search aez-form-item__dropdown"
                placeholder="Return To"
                pattern=".{15,}" 
                style= "border-color:transparent;"
                spellcheck="false"
                value="'. $return_location_name .'"
                required
            >
            <label for="return_location_id" class="aez-form-item__label aez-form-item__label--hidden">Return To</label>
            <input id="return_location_id" 
            class="aez-select2-search aez-form-item__dropdown" 
            name="return_location_id"
            style="display: none;"
            value="'.$return_location .'"
            >
                </div>
            </div>
            <div class="aez-form-block">
               <h4 class="aez-form-block__header">Rental Date</h4>
                <div class="aez-form-block--side-by-side">
                <div class="aez-form-item aez-form-item--date">
                <label for="pickup_date" class="aez-form-item__label"><i class="fa fa-calendar"></i></label>
                <input type="text" 
                id="pickup_date"
                class="aez-form-item__input aez-form-item__input--date calendar"
                placeholder="MM/DD/YYYY"
                name="pickup_date"
                value="'. $pickup_date . '"
                readonly="true"
                required
                >
                    </div>
                    <div class="aez-form-item aez-form-item--dropdown">
                        <label for="pickup_time" class="aez-form-item__label aez-form-item__label--hidden">Rental Time</label>
                        <select
                            id="pickup_time"
                            class="aez-form-item__dropdown aez-form-item__dropdown--full-width"
                            name="pickup_time"
                            required
                        >';
            $return_html .= '<option value="12:00AM" ' . (($pickup_time == '12:00AM') ? 'selected="selected"' : '' ) . '>12:00 AM</option>';
            $return_html .= '<option value="12:30AM" ' . (($pickup_time == '12:30AM') ? 'selected="selected"' : '' ) . '>12:30 AM</option>';
            $return_html .= '<option value="01:00AM" ' . (($pickup_time == '01:00AM') ? 'selected="selected"' : '' ) . '>1:00 AM</option>';
            $return_html .= '<option value="01:30AM" ' . (($pickup_time == '01:30AM') ? 'selected="selected"' : '' ) . '>1:30 AM</option>';
            $return_html .= '<option value="02:00AM" ' . (($pickup_time == '02:00AM') ? 'selected="selected"' : '' ) . '>2:00 AM</option>';
            $return_html .= '<option value="02:30AM" ' . (($pickup_time == '02:30AM') ? 'selected="selected"' : '' ) . '>2:30 AM</option>';
            $return_html .= '<option value="03:00AM" ' . (($pickup_time == '03:00AM') ? 'selected="selected"' : '' ) . '>3:00 AM</option>';
            $return_html .= '<option value="03:30AM" ' . (($pickup_time == '03:30AM') ? 'selected="selected"' : '' ) . '>3:30 AM</option>';
            $return_html .= '<option value="04:00AM" ' . (($pickup_time == '04:00AM') ? 'selected="selected"' : '' ) . '>4:00 AM</option>';
            $return_html .= '<option value="04:30AM" ' . (($pickup_time == '04:30AM') ? 'selected="selected"' : '' ) . '>4:30 AM</option>';
            $return_html .= '<option value="05:00AM" ' . (($pickup_time == '05:00AM') ? 'selected="selected"' : '' ) . '>5:00 AM</option>';
            $return_html .= '<option value="05:30AM" ' . (($pickup_time == '05:30AM') ? 'selected="selected"' : '' ) . '>5:30 AM</option>';
            $return_html .= '<option value="06:00AM" ' . (($pickup_time == '06:00AM') ? 'selected="selected"' : '' ) . '>6:00 AM</option>';
            $return_html .= '<option value="06:30AM" ' . (($pickup_time == '06:30AM') ? 'selected="selected"' : '' ) . '>6:30 AM</option>';
            $return_html .= '<option value="07:00AM" ' . (($pickup_time == '07:00AM') ? 'selected="selected"' : '' ) . '>7:00 AM</option>';
            $return_html .= '<option value="07:30AM" ' . (($pickup_time == '07:30AM') ? 'selected="selected"' : '' ) . '>7:30 AM</option>';
            $return_html .= '<option value="08:00AM" ' . (($pickup_time == '08:00AM') ? 'selected="selected"' : '' ) . '>8:00 AM</option>';
            $return_html .= '<option value="08:30AM" ' . (($pickup_time == '08:30AM') ? 'selected="selected"' : '' ) . '>8:30 AM</option>';
            $return_html .= '<option value="09:00AM" ' . (($pickup_time == '09:00AM' || empty($pickup_time)) ? 'selected="selected"' : '' ) . '>9:00 AM</option>';
            $return_html .= '<option value="09:30AM" ' . (($pickup_time == '09:30AM') ? 'selected="selected"' : '' ) . '>9:30 AM</option>';
            $return_html .= '<option value="10:00AM" ' . (($pickup_time == '10:00AM') ? 'selected="selected"' : '' ) . '>10:00 AM</option>';
            $return_html .= '<option value="10:30AM" ' . (($pickup_time == '10:30AM') ? 'selected="selected"' : '' ) . '>10:30 AM</option>';
            $return_html .= '<option value="11:00AM" ' . (($pickup_time == '11:00AM') ? 'selected="selected"' : '' ) . '>11:00 AM</option>';
            $return_html .= '<option value="11:30AM" ' . (($pickup_time == '11:30AM') ? 'selected="selected"' : '' ) . '>11:30 AM</option>';
            $return_html .= '<option value="12:00PM" ' . (($pickup_time == '12:00PM') ? 'selected="selected"' : '' ) . '>12:00 PM</option>';
            $return_html .= '<option value="12:30PM" ' . (($pickup_time == '12:30PM') ? 'selected="selected"' : '' ) . '>12:30 PM</option>';
            $return_html .= '<option value="01:00PM" ' . (($pickup_time == '01:00PM') ? 'selected="selected"' : '' ) . '>1:00 PM</option>';
            $return_html .= '<option value="01:30PM" ' . (($pickup_time == '01:30PM') ? 'selected="selected"' : '' ) . '>1:30 PM</option>';
            $return_html .= '<option value="02:00PM" ' . (($pickup_time == '02:00PM') ? 'selected="selected"' : '' ) . '>2:00 PM</option>';
            $return_html .= '<option value="02:30PM" ' . (($pickup_time == '02:30PM') ? 'selected="selected"' : '' ) . '>2:30 PM</option>';
            $return_html .= '<option value="03:00PM" ' . (($pickup_time == '03:00PM') ? 'selected="selected"' : '' ) . '>3:00 PM</option>';
            $return_html .= '<option value="03:30PM" ' . (($pickup_time == '03:30PM') ? 'selected="selected"' : '' ) . '>3:30 PM</option>';
            $return_html .= '<option value="04:00PM" ' . (($pickup_time == '04:00PM') ? 'selected="selected"' : '' ) . '>4:00 PM</option>';
            $return_html .= '<option value="04:30PM" ' . (($pickup_time == '04:30PM') ? 'selected="selected"' : '' ) . '>4:30 PM</option>';
            $return_html .= '<option value="05:00PM" ' . (($pickup_time == '05:00PM') ? 'selected="selected"' : '' ) . '>5:00 PM</option>';
            $return_html .= '<option value="05:30PM" ' . (($pickup_time == '05:30PM') ? 'selected="selected"' : '' ) . '>5:30 PM</option>';
            $return_html .= '<option value="06:00PM" ' . (($pickup_time == '06:00PM') ? 'selected="selected"' : '' ) . '>6:00 PM</option>';
            $return_html .= '<option value="06:30PM" ' . (($pickup_time == '06:30PM') ? 'selected="selected"' : '' ) . '>6:30 PM</option>';
            $return_html .= '<option value="07:00PM" ' . (($pickup_time == '07:00PM') ? 'selected="selected"' : '' ) . '>7:00 PM</option>';
            $return_html .= '<option value="07:30PM" ' . (($pickup_time == '07:30PM') ? 'selected="selected"' : '' ) . '>7:30 PM</option>';
            $return_html .= '<option value="08:00PM" ' . (($pickup_time == '08:00PM') ? 'selected="selected"' : '' ) . '>8:00 PM</option>';
            $return_html .= '<option value="08:30PM" ' . (($pickup_time == '08:30PM') ? 'selected="selected"' : '' ) . '>8:30 PM</option>';
            $return_html .= '<option value="09:00PM" ' . (($pickup_time == '09:00PM') ? 'selected="selected"' : '' ) . '>9:00 PM</option>';
            $return_html .= '<option value="09:30PM" ' . (($pickup_time == '09:30PM') ? 'selected="selected"' : '' ) . '>9:30 PM</option>';
            $return_html .= '<option value="10:00PM" ' . (($pickup_time == '10:00PM') ? 'selected="selected"' : '' ) . '>10:00 PM</option>';
            $return_html .= '<option value="10:30PM" ' . (($pickup_time == '10:30PM') ? 'selected="selected"' : '' ) . '>10:30 PM</option>';
            $return_html .= '<option value="11:00PM" ' . (($pickup_time == '11:00PM') ? 'selected="selected"' : '' ) . '>11:00 PM</option>';
            $return_html .= '<option value="11:30PM" ' . (($pickup_time == '11:30PM') ? 'selected="selected"' : '' ) . '>11:30 PM</option>';
            $return_html .= '</select>
                    </div>
                </div>
            </div>
            <div class="aez-form-block">
                <h4 class="aez-form-block__header">Return Date</h4>
                <div class="aez-form-block--side-by-side">
                    <div class="aez-form-item aez-form-item--date">
                        <label for="dropoff_date" class="aez-form-item__label"><i class="fa fa-calendar"></i></label>
                    <input
                    id="dropoff_date"
                    type="text"
                    class="aez-form-item__input aez-form-item__input--date"
                    name="dropoff_date"
                    placeholder="MM/DD/YYYY"
                    value="' . $dropoff_date . '"
                    readonly="true"
                    required
                >
                    </div>
                    <div class="aez-form-item aez-form-item--dropdown">
                        <label for="dropoff_time" class="aez-form-item__label aez-form-item__label--hidden">Return Time</label>
                        <select
                            id="dropoff_time"
                            class="aez-form-item__dropdown aez-form-item__dropdown--full-width"
                            name="dropoff_time"
                            required
                        >';
            $return_html .= '<option value="12:00AM" ' . (($dropoff_time == '12:00AM') ? 'selected="selected"' : '' ) . '>12:00 AM</option>';
            $return_html .= '<option value="12:30AM" ' . (($dropoff_time == '12:30AM') ? 'selected="selected"' : '' ) . '>12:30 AM</option>';
            $return_html .= '<option value="01:00AM" ' . (($dropoff_time == '01:00AM') ? 'selected="selected"' : '' ) . '>1:00 AM</option>';
            $return_html .= '<option value="01:30AM" ' . (($dropoff_time == '01:30AM') ? 'selected="selected"' : '' ) . '>1:30 AM</option>';
            $return_html .= '<option value="02:00AM" ' . (($dropoff_time == '02:00AM') ? 'selected="selected"' : '' ) . '>2:00 AM</option>';
            $return_html .= '<option value="02:30AM" ' . (($dropoff_time == '02:30AM') ? 'selected="selected"' : '' ) . '>2:30 AM</option>';
            $return_html .= '<option value="03:00AM" ' . (($dropoff_time == '03:00AM') ? 'selected="selected"' : '' ) . '>3:00 AM</option>';
            $return_html .= '<option value="03:30AM" ' . (($dropoff_time == '03:30AM') ? 'selected="selected"' : '' ) . '>3:30 AM</option>';
            $return_html .= '<option value="04:00AM" ' . (($dropoff_time == '04:00AM') ? 'selected="selected"' : '' ) . '>4:00 AM</option>';
            $return_html .= '<option value="04:30AM" ' . (($dropoff_time == '04:30AM') ? 'selected="selected"' : '' ) . '>4:30 AM</option>';
            $return_html .= '<option value="05:00AM" ' . (($dropoff_time == '05:00AM') ? 'selected="selected"' : '' ) . '>5:00 AM</option>';
            $return_html .= '<option value="05:30AM" ' . (($dropoff_time == '05:30AM') ? 'selected="selected"' : '' ) . '>5:30 AM</option>';
            $return_html .= '<option value="06:00AM" ' . (($dropoff_time == '06:00AM') ? 'selected="selected"' : '' ) . '>6:00 AM</option>';
            $return_html .= '<option value="06:30AM" ' . (($dropoff_time == '06:30AM') ? 'selected="selected"' : '' ) . '>6:30 AM</option>';
            $return_html .= '<option value="07:00AM" ' . (($dropoff_time == '07:30AM') ? 'selected="selected"' : '' ) . '>7:30 AM</option>';
            $return_html .= '<option value="08:00AM" ' . (($dropoff_time == '08:00AM') ? 'selected="selected"' : '' ) . '>8:00 AM</option>';
            $return_html .= '<option value="08:30AM" ' . (($dropoff_time == '08:30AM') ? 'selected="selected"' : '' ) . '>8:30 AM</option>';
            $return_html .= '<option value="09:00AM" ' . (($dropoff_time == '09:00AM' || empty($dropoff_time)) ? 'selected="selected"' : '' ) . '>9:00 AM</option>';
            $return_html .= '<option value="09:30AM" ' . (($dropoff_time == '09:30AM') ? 'selected="selected"' : '' ) . '>9:30 AM</option>';
            $return_html .= '<option value="10:00AM" ' . (($dropoff_time == '10:00AM') ? 'selected="selected"' : '' ) . '>10:00 AM</option>';
            $return_html .= '<option value="10:30AM" ' . (($dropoff_time == '10:30AM') ? 'selected="selected"' : '' ) . '>10:30 AM</option>';
            $return_html .= '<option value="11:00AM" ' . (($dropoff_time == '11:00AM') ? 'selected="selected"' : '' ) . '>11:00 AM</option>';
            $return_html .= '<option value="11:30AM" ' . (($dropoff_time == '11:30AM') ? 'selected="selected"' : '' ) . '>11:30 AM</option>';
            $return_html .= '<option value="12:00PM" ' . (($dropoff_time == '12:00PM') ? 'selected="selected"' : '' ) . '>12:00 PM</option>';
            $return_html .= '<option value="12:30PM" ' . (($dropoff_time == '12:30PM') ? 'selected="selected"' : '' ) . '>12:30 PM</option>';
            $return_html .= '<option value="01:00PM" ' . (($dropoff_time == '01:00PM') ? 'selected="selected"' : '' ) . '>1:00 PM</option>';
            $return_html .= '<option value="01:30PM" ' . (($dropoff_time == '01:30PM') ? 'selected="selected"' : '' ) . '>1:30 PM</option>';
            $return_html .= '<option value="02:00PM" ' . (($dropoff_time == '02:00PM') ? 'selected="selected"' : '' ) . '>2:00 PM</option>';
            $return_html .= '<option value="02:30PM" ' . (($dropoff_time == '02:30PM') ? 'selected="selected"' : '' ) . '>2:30 PM</option>';
            $return_html .= '<option value="03:00PM" ' . (($dropoff_time == '03:00PM') ? 'selected="selected"' : '' ) . '>3:00 PM</option>';
            $return_html .= '<option value="03:30PM" ' . (($dropoff_time == '03:30PM') ? 'selected="selected"' : '' ) . '>3:30 PM</option>';
            $return_html .= '<option value="04:00PM" ' . (($dropoff_time == '04:00PM') ? 'selected="selected"' : '' ) . '>4:00 PM</option>';
            $return_html .= '<option value="04:30PM" ' . (($dropoff_time == '04:30PM') ? 'selected="selected"' : '' ) . '>4:30 PM</option>';
            $return_html .= '<option value="05:00PM" ' . (($dropoff_time == '05:00PM') ? 'selected="selected"' : '' ) . '>5:00 PM</option>';
            $return_html .= '<option value="05:30PM" ' . (($dropoff_time == '05:30PM') ? 'selected="selected"' : '' ) . '>5:30 PM</option>';
            $return_html .= '<option value="06:00PM" ' . (($dropoff_time == '06:00PM') ? 'selected="selected"' : '' ) . '>6:00 PM</option>';
            $return_html .= '<option value="06:30PM" ' . (($dropoff_time == '06:30PM') ? 'selected="selected"' : '' ) . '>6:30 PM</option>';
            $return_html .= '<option value="07:00PM" ' . (($dropoff_time == '07:00PM') ? 'selected="selected"' : '' ) . '>7:00 PM</option>';
            $return_html .= '<option value="07:30PM" ' . (($dropoff_time == '07:30PM') ? 'selected="selected"' : '' ) . '>7:30 PM</option>';
            $return_html .= '<option value="08:00PM" ' . (($dropoff_time == '08:00PM') ? 'selected="selected"' : '' ) . '>8:00 PM</option>';
            $return_html .= '<option value="08:30PM" ' . (($dropoff_time == '08:30PM') ? 'selected="selected"' : '' ) . '>8:30 PM</option>';
            $return_html .= '<option value="09:00PM" ' . (($dropoff_time == '09:00PM') ? 'selected="selected"' : '' ) . '>9:00 PM</option>';
            $return_html .= '<option value="09:30PM" ' . (($dropoff_time == '09:30PM') ? 'selected="selected"' : '' ) . '>9:30 PM</option>';
            $return_html .= '<option value="10:00PM" ' . (($dropoff_time == '10:00PM') ? 'selected="selected"' : '' ) . '>10:00 PM</option>';
            $return_html .= '<option value="10:30PM" ' . (($dropoff_time == '10:30PM') ? 'selected="selected"' : '' ) . '>10:30 PM</option>';
            $return_html .= '<option value="11:00PM" ' . (($dropoff_time == '11:00PM') ? 'selected="selected"' : '' ) . '>11:00 PM</option>';
            $return_html .= '<option value="11:30PM" ' . (($dropoff_time == '11:30PM') ? 'selected="selected"' : '' ) . '>11:30 PM</option>';
            $return_html .= '</select>
                    </div>
                </div>
            </div>
            <div class="aez-form-block">
                <h4 class="aez-form-block__header">Promo or Corporate Code</h4>';

            // There is no promo code add the html for the input box
            if (count($promo_codes[0]) == 0) {


                $return_html .= '<div class="aez-form-item--with-btn">
                    <div class="aez-form-item">
                        <label for="promo_codes1" class="aez-form-item__label">Code</label>
                        
                        <input
                            id="promo_codes1"
                            type="text"
                            class="aez-form-item__input"
                            name="promo_codes[]"
                            data-number="1"
                            placeholder="Enter Code"
                        />
                    </div>
                    <span class="aez-add-btn" data-number="1"></span>
                </div>';


            } else {

                // Loop though all the promo codes
                for ($x=0; $x < count($promo_codes[0]); $x++) {

                    // If the current code is the last code in the array, add the  "+" button, else add the "-" button.
                    if ($x == (count($promo_codes[0]) - 1)) {
                        $class = "aez-add-btn";
                    } else {
                        $class = "aez-remove-btn";
                    }

                    $return_html .= '<div class="aez-form-item--with-btn">
                        <div class="aez-form-item">
                            <label for="promo_codes1" class="aez-form-item__label">Code</label>
                            
                            <input
                                id="promo_codes1"
                                type="text"
                                class="aez-form-item__input"
                                name="promo_codes[]"
                                data-number="1"
                                placeholder="Enter Code"
                                value="' . ((isset($promo_codes[0][$x])) ?  $promo_codes[0][$x] : '') . '"
                            />
                        </div>
                        <span class="' . $class . '" data-number="1"></span>
                    </div>';

                } // End for
                
            } // End if
            
            $display_string = '';
            if($e_check_flag == 0){
                $display_string = 'disabled="disabled"';
            } else if($e_check_flag == 1){
                $display_string = 'checked="checked"';
            }
            $return_html .= '</div>
            <div class="aez-form-block">
				<h4 class="aez-form-block__header express-checkout-link">
			<!--      <a id="express-checkout-detail-link" rel="modal:open" href="javascript:void(0);">-->
			<span>Expressway Checkout with <a href="/profile" style="">Expressway Member Preferences</a></span>
			<div class="popover__wrapper tooltip-alignment">
			<i class="fa fa-question-circle">
				<h2 class="popover__title"></h2>
			</i>
            <div class="push popover__content exp-popover__content exp-popover__content:before">
				<p class="popover__message">Express Checkout with Advantage Expressway Member Preferencesss </p>
            </div>
            </div>
              <!--  </a> -->
				   
			<label class="switch">
				<input
				id="express_checkout_option"
				type="checkbox"
				class="aez-form-item__checkbox"
				name="express_checkout_option"
				value="1" '.$display_string.'
				/> 
				<span class="slider round"></span>
			</label>
				
                </h4>            
			</div>    
            <div class="aez-form-block">
                <button id="adv_rez_submit" type="submit" class="aez-btn aez-btn--filled-green">Search</button>
            </div>
            <span class="close -blue">Close</span>
        </form>';

        return $return_html;
    }

    public static function getCountries() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $http = new GuzzleHttp\Client;
       
        try {
            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getCountries', [
                'query' => [
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
                    'brand'=> ''
                    ],
                'headers' => [
                    'Accept' => 'application/json',
                    ]
                ] );
        } catch (Exception $e) {
            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;
    }
    
   
    public static function getUSStates() {

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;        
        
        try {

            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getUSStates', [
                'query' => [
                    'brand' => '',
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
                    ],
                'headers' => [
                    'Accept' => 'application/json',
                    ]
                ] );
        } catch (Exception $e) {
            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);
 
        return $response_arrays;
    }     
    
    public static function getFrequentFlyerPrograms() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();        
        $http = new GuzzleHttp\Client;
        
        try {
            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getFrequentFlyerPrograms', [
                'query' => [
                    'brand' => '',
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],   
                    ],
                'headers' => [
                    'Accept' => 'application/json',
                    ]
                ] );
        } catch (Exception $e) {
            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);
        
        return $response_arrays;
        
    }         

       
    public function getCarClasses($rental_location_id) {
        $location_array = AdvLocations_Helper::getLocation($rental_location_id);
        if ($location_array['Country'] == 'US') {
            $get_car_classes = AdvVehicles_Helper::getVehicles($rental_location_id);
        } else {
          
            $get_car_classes = AdvVehicles_Helper::getIntlVehicles($rental_location_id);
        }
        
        return $get_car_classes['RateProduct'];
    }    
    
    public static function getUserCCDetails() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;
        
        $member_number = $_SESSION['adv_login']->memberNumber;
        
        try {
            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getLoyaltyProfileCCs', [
                'query' => [
                    'memberNumber'=> $member_number,
                    'BrandName' => 'Advantage',
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
                    ],
                'headers' => [
                    'Accept' => 'application/json',
                    ]
                ] );
        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong. Please try your search another time."}');
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);
        
        return $response_arrays;
        
    }     
    
    public static function isMemberForBrand ($email) { 
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;

        $member_exists_array = array('Email' => $email,
                                    'BrandName' => 'Advantage');

                try {

                    $response = $http->post($get_wp_config_settings_array['services_url'] . '/isMemberForBrand', [
                        'body' => json_encode($member_exists_array),
                        'headers' => [
                            'Content-Type' => 'application/json',
                            ],
                        ] );
        
                } catch (Exception $e) {
                    echo json_encode('{error: "Something went wrong getting member expressway history. Please try again at another time."}');
                }
        
                $response_contents = $response->getBody()->getContents();
        
                $response_arrays = json_decode($response_contents, true);
        
                return $response_arrays;

    }
    /* To get Loyalty referral information */
    public static function getLoyaltyReferral ($referral_id) {
        try {
                
            //api call
            $data['ReferralId'] = $referral_id;
            $data['BrandName'] = 'Advantage';
            $endpoint = 'Loyalty/ValidateLoyaltyReferral';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);

        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong getting member awards history. Please try again at another time."}');
        }
        
        return $response_arrays;
    }    
    
    /**
     * 
     * @param type $string
     * @return boolean
     * 
     */
    public static function addNoIndexNoFollow($string){
        
        $return_value = FALSE;
        
        //add the regex, which format we dont need to add meta tags
        $check_conditions[] = '/\/location\/[a-z-]+\/(\d)+\//';
        //ex: /location/chicago-ohare-intl-airport-ord/4/
        
        $check_conditions[] = '/\/?_sm_au_=[a-zA-Z0-5]+/';
        //ex: /?_sm_au_=iSHpHjSB5Mrs4BQj

        $check_conditions[] = '/irc=([^&]*)/';
        //ex: /?irc=00332EBA
        
        $check_conditions[] = '/ocid=([^&]*)/';
        //ex: /?ocid=1234
        
        $check_conditions[] = '/ltkmodaltestmode=([^&]*)/';
        //ex: /?ltkmodaltestmode=1
        
        $check_conditions[] = '/rc=([^&]*)/';
        //ex: /?rc=FALLFLASH15
        
        $check_conditions[] = '/s=([^&]*)/';
        //ex: /?s=las
        
        $check_conditions[] = '/aplicativo-2cxj/';
        //ex: /aplicativo-2cxj/
        
        $check_conditions[] = '/-bm0\/reservar/';
        //ex: /-bm0/reservar/
        
        $check_conditions[] = '/\/cache.aspx.[(\w)=&-]*/';
        //ex: /cache.aspx?q=rentalcarmomma&d=4973062807945470&mkt=en-US&setlang=en-US&w=BttWzRo-J07VfIoil-oRPOgn8P5MHR80
        
        $check_conditions[] = '/\/centro\/[a-z-0-9�]*\//';
        //ex: /centro/boston-logan-airport-bos-2cy/
        
        $check_conditions[] = '/\/communications\/.*?/';
        //ex: communications/IMAGE_SRC/assets/twitter.png
        
        $check_conditions[] = '/\/.*\/(\status=([^&]*))+/';
        //ex: /conclu�da-1goz/?status=success
        
        $check_conditions[] = '/\/customer-survey-page\/(\?guid=([^&]*))+/';
        //ex: customer-survey-page/?guid=01a5bc76-741a-40ce-b979-c3e77ad98287
        
        $check_conditions[] = '/\/location\/[a-zA-Z0-9]*/';
        //ex: /location/BGIT01

        $check_conditions[] = '/\/loja\/[a-z-0-5]*\//';
        $check_conditions[] = '/\/loja\/(.*)/';
        //ex: /loja/austin-bergstrom-intl-airport-aus-5lc/
        
        $check_conditions[] = '/\/loja-2wt\//';
        $check_conditions[] = '/\/loja-2wt\/(\?tab=([^&]*))+/';
        //ex: /loja-2wt/?tab=america
        
        $check_conditions[] = '/\/loja-2wt\/(\?tab=([^&]*))+/';
        //ex: /loja-2wt/?tab=america 

        $check_conditions[] = '/\/modify/';
        //ex: /modify
        
        $check_conditions[] = '/\/mx/';
        //ex: /mx
        
        $check_conditions[] = '/\/mx\/aplicaci�n-2cvn\//';
        //ex: /mx/aplicaci�n-2cvn/
        
        $check_conditions[] = '/\/mx\/centro\/[a-z-0-9]*\//';
        //ex: /mx/centro/orlando-intl-airport-mco-4a0/
        
        $check_conditions[] = '/\/mx\/location\/[a-z-0-9]*\//';
        //ex: /mx/location/las-vegas-mccarran-intl-airport/

        $check_conditions[] = '/\/mx\/recompensas\/[a-z-0-9]*\//';
        //ex: /mx/recompensas/las-vegas-mccarran-intl-airport/

        $check_conditions[] = '/\/mx\/recompensas-2fqu\//';
        //ex: /mx/recompensas-2fqu/
        
        $check_conditions[] = '/\/mx\/vehicles/';
        //ex: /mx/vehicles

        $check_conditions[] = '/\/partner-signup\/(.*)/';
        //ex: /partner-signup/?email=jim_maureen_2006@yahoo.ca&source=vacationvillage

        $check_conditions[] = '/\/rentals\/search?(.*)/';
        //ex: /rentals/search?rentfrom=MCO|4805&returnto=MCO|4805&use_same_return=on&pickup_date[date]=06/06/2016&pickup_time=22:30&return_date[date]=06/14/2016&return_time=17:30&iata_code=&promo_code=&form_build_id=form-PNAA58lmV0gvcIIgNmrwUQmfuK5-u-0eItG4WRCzSkk&form_id=ez_form_reservation_search_form

        $check_conditions[] = '/(.*\.aspx)\?(cn=.*)/';
        //ex: /ReservationLookup.aspx?cn=WADP04F7C8AD

        $check_conditions[] = '/\/reset\/[a-z0-9]*/';
        //ex: /reset/044f65ad041b3cfc29d532fefe6b0dfda2d449b07758b29cc53ac4523321c137/

        $check_conditions[] = '/\/reset-forgot-password\?(.*)/';
        //ex: /reset-forgot-password?email=ching.chang3@aol.com&password=BlueFalcon787$$&password_again=BlueFalcon787$$&terms_and_conditions=on&password_token=0a2db0fff9047ce8b7a54912851250b457a126f729fa66e9c9f5aacff4ec0062

        $check_conditions[] = '/\/search\?(.*)/';
        //ex: /search?q=cache:HQb1FUJnC7cJ:https://www.advantage.com/location/dallas-ft-worth-airport-dfw/+&cd=3&hl=en&ct=clnk&gl=us

        $check_conditions[] = '/\/sign-up\/\?(.*)/';
        //ex: /sign-up/?firstname=ALICIA&lastname=CHAPPELL&email=al-cee1525@live.com.au

        $check_conditions[] = '/\/Vehicles\/\?_loc=.*/';
        //ex: /Vehicles/?_loc=4805

        $check_conditions[] = '/\/view-reservation\/\?.*/';
        //ex: /view-reservation/?cancel_rental_location_id=HNL&cancel_renter_last=KOSAKA&cancel_confirm_num=Wad012cf15ad

        $check_conditions[] = '/\/wp-content\/plugins\/advantage-reservations\/as=(.*)/';
        //ex: /wp-content/plugins/advantage-reservations/as=

        $check_conditions[] = '/\/wp-content\/plugins\/advantage-reservations\/assets=(.*)/';
        //ex: /wp-content/plugins/advantage-reservations/assets=
        
        $check_conditions[] = '/^.*\.(png)$/';
        
        $check_conditions[] = '/^.*\.(aspx)$/';
        //ex: /reservationlookup.aspx
        
        $check_conditions[] = '/\/-wvw\/login/';
        //ex: /-wvw/login
        
        $check_conditions[] = '/\/mx\/vehicles/';
        //ex: /mx/vehicles
        
        $check_conditions[] = '/\/login\/\?onepasswdfill=[A-Z0-9]*&onepasswdvault=[A-Z0-9]*/';
        //ex: \/login\/\?onepasswdfill=[A-Z0-9]*&onepasswdvault=[A-Z0-9]*
              
        $check_conditions[] = '/\/location\/(\?tab=([^&]*))+/';
        $check_conditions[] = '/\/locations\/null/';
        $check_conditions[] = '/\/locations\/(\?tab=([^&]*))+/';
        $check_conditions[] = '/\/us-locations\/(\?tab=([^&]*))+/';
        $check_conditions[] = '/\/international-locations\/(\?tab=([^&]*))+/';
        //ex: location/?tab=america   
        
        $check_conditions[] = '/\/Toll policy/';
        //ex: /Toll policy   
        
        $check_conditions[] = '/\/travelagent/';
        //ex: /travelagent   
        
        //$check_conditions[] = '/\/american-association-of-physicians-of-indian-origin/';
        //ex: /american-association-of-physicians-of-indian-origin   
        
        $check_conditions[] = '/\/trinidad/';
        //ex: /trinidad   
        
        $check_conditions[] = '/\/ecuesta-p�gina-de-agradecimiento-2hwg/';
        //ex: /ecuesta-p�gina-de-agradecimiento-2hwg   
        
        $check_conditions[] = '/\/editar-perfil-1aq1/';
        //ex: /editar-perfil-1aq1 
        
        $check_conditions[] = '/\/editar-perfil-1aq1/';
        //ex: /editar-perfil-1aq1   
        
        // $check_conditions[] = '/\/europcar/';
        //ex: /europcar-1zll/  
        
        $check_conditions[] = '/\/preguntas-frecuentes\/promociones-programas-alquiler-2j2c\//';
        //ex: /preguntas-frecuentes/promociones-programas-alquiler-2j2c/
		$check_conditions[] = '/\/login\/\?[a-z]+=(\w)*&[a-z]+=(\w)*/';
        //ex: /login/?onepasswdfill=3B70884A21674689B9BA94C6E2D7A7C6&onepasswdvault=E9C739ABC4044431919264DD9CE12FCF 
		//$check_conditions[] = '/\/[\-a-z0-9]+\//';

        $check_conditions[] = '/\/american-association*/';
        //ex: /american-association-of-physicians-of-indian-origin/ 

        $check_conditions[] = '/^.*\.(jsp)$/';
        
        if(!empty($string)){
            foreach ($check_conditions as $value) {
                if (preg_match($value, $string)) {
                    $return_value = TRUE;
                    break;
                }
            }
        }
        return $return_value;
    }

    public static function getVehicleDetailsCarClassCode() {
        $returm_array['ECAR'] = 'vehicles/economy-car/';
        $returm_array['CCAR'] = 'vehicles/compact-car/';
        $returm_array['ICAR'] = 'vehicles/midsize-car-rental/';
        $returm_array['SCAR'] = 'vehicles/standard-size-car-rental/';
        $returm_array['PTAR'] = 'vehicles/premium-car-rental/';
        $returm_array['PCAR'] = 'vehicles/premium-car-rental/';
        $returm_array['LCAR'] = 'vehicles/luxury-car-rental/';
        $returm_array['FCAR'] = 'vehicles/full-size-car-rental/';
        $returm_array['SFAR'] = 'vehicles/standard-suv-rental/';
        $returm_array['IFAR'] = 'vehicles/midsize-suv-rental/';
        $returm_array['FFAR'] = 'vehicles/full-size-suv-rental/';
        $returm_array['PFAR'] = 'vehicles/premium-suv-rental/';
        $returm_array['MVAR'] = 'vehicles/minivan-rental/';
        $returm_array['STAR'] = 'vehicles/convertible-car-rental/';
        $returm_array['IJAR'] = 'vehicles/jeep-rental/';

        return $returm_array;
    }

    // calculate user dob for preselect in home page
    public static function calcDobHomePage($dob, $pickup_date) {         
    
        $pickup_day = substr($pickup_date, 3, 2);
        $pickup_month = substr($pickup_date, 0, 2);
        $pickup_year = substr($pickup_date, 6, 4);
        $dob_day = substr($dob, 8, 2);
        $dob_month = substr($dob, 5, 2);
        $dob_year = substr($dob, 0, 4);
    
        $current_entered_birthday = mktime(0, 0, 0, $dob_month, $dob_day, $dob_year);
        $pickup_of_25_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 25);
        $pickup_of_21_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 21);
        $pickup_of_18_years_ago = mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year - 18);
    
        if ($current_entered_birthday > $pickup_of_18_years_ago) {
            return 'under18';
        } else if ($current_entered_birthday > $pickup_of_21_years_ago) {
                return 'under21';
        } else if ($current_entered_birthday > $pickup_of_25_years_ago) {
            return 'under25';
        }
        return 'over25';
    }
    
}