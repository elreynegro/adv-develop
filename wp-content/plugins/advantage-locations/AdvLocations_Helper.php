<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/aez_oauth2/AEZ_Oauth2_Plugin.php');

class AdvLocations_Helper {

        /*
         * Get location information for 1 location
         */ 
        public static function getLocation($location_id = 'none') {

            if (!isset($_SERVER['REQUEST_URI'])) {
                return;
            }

            $pieces = explode('/', $_SERVER['REQUEST_URI']);
            // Finding locationId from URL without using COUNT-1 as that could be query string parameter
            for ($i = 0; $i < count($pieces); $i++) {
                $loc = strtoupper($pieces[$i]);
                if ($loc == "LOCATION") {
                    if ($i < count($pieces) - 1)
                        $location_id = $pieces[$i + 1];
                }
            }

            if ($location_id == 'none') {
                $pieces = explode('/', $_SERVER['REQUEST_URI']);
                $location_id = $pieces[2];
                if (strlen($location_id) == 0 || strpos($location_id, '?') !== false) {
                    $location_id = $pieces[count($pieces) - 2];
                }
            }

            if (strpos($location_id, '-') > 0) {

                $the_slug = 'my_slug';
                $args = array(
                    'name' => $location_id,
                    'post_type' => 'page',
                    'post_status' => 'publish',
                    'numberposts' => 1
                );
                $my_posts = get_posts($args);
                if ($my_posts) {
                    $post_id = $my_posts[0]->ID;
                    $new_location_id = get_post_meta($post_id, 'page_location_id', true);
                    if ($new_location_id) {
                        $location_id = $new_location_id;
                    }
                }
            }

            //.Net v2 api integration
            $data['LocationCode'] = $location_id;
            try {

                $endpoint = 'Location/GetLocation';
                $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data, $endpoint);
            } catch (Exception $e) {
                echo json_encode('{error: "No locations found."}');
            }

            if (!array_key_exists('Data', $response_arrays)) {
                return;
            }

            if (isset($response_arrays['Data']['Latitude'])) {
                $response_arrays['Data']['Latitude'] = str_replace(',', '.', $response_arrays['Data']['Latitude']);
                $response_arrays['Data']['Longitude'] = str_replace(',', '.', $response_arrays['Data']['Longitude']);
            }


            return $response_arrays['Data'];
        }

	/*
	 * Get location information for 1 location
	 */
	public static function getLocationsByBrand($BrandName = 'Advantage', $intl_locations = false) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $http = new GuzzleHttp\Client;
        
        try {

            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getLocationsByBrand', [
                'query' => [
                    'BrandName' => $BrandName,
                    'INTL' => $intl_locations,
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
                    ],
	        	'headers' => [
				    'Accept' => 'application/json',
		        	]
                ] );
        } catch (Exception $e) {

            error_log('bad deal 444: ' . print_r($e->getMessage(), true));
            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }

        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

		if (! array_key_exists('d', $response_arrays)) {
			return;
		}

		return $response_arrays['d'];

	}

    /*
     * Get location hours information for 1 location
     */
    public static function getLocationHours($rental_location_id = 'MCO') {

        $data['LocationCode'] = $rental_location_id ;
        try {

            $endpoint = 'Location/GetBusinessHours';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);

        } catch (Exception $e) {

            echo json_encode('{error: "Getting Location Hours. Something went wrong. Please try your search another time."}');
            // die();            
        }

        if (! array_key_exists('Data', $response_arrays)) {
            return;
        }

        return $response_arrays['Data'][0];

    }

    public static function getAllLocations() {
        
        //unset($_SESSION["ActiveBookingLocations"]);
        
        if(count($_SESSION["ActiveBookingLocations"]) == 0)
        {
            unset($_SESSION["ActiveBookingLocations"]);
        }
        
        if(!isset($_SESSION["ActiveBookingLocations"]))
        {
            
            try {
             
                $data['BrandName'] = 'Advantage';
                $endpoint = 'Location/GetActiveBookingLocations';
                $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);
            } catch (Exception $e) {

                //error_log('bad deal 444: ' . print_r($e->getMessage(), true));
                echo json_encode('{error: "No locations found."}');
            }

            if(isset($response_arrays["Data"]))
            {
                $locations = $response_arrays["Data"];
                
                $locModified = array();
        
                $length = count($locations);
                
                for ($i = 0; $i < $length; $i++) {
                    
                    $loc = $locations[$i]["LocationName"] . 
                    ' (' . $locations[$i]["City"] . 
                    ', ' . $locations[$i]["State"] . 
                    ' ' . $locations[$i]["CountryName"] . 
                    ') - ' . $locations[$i]["LocationCode"] . ';' . $locations[$i]["GreaterCityArea"];
                    
                    $locModified[$i]["C"] = $locations[$i]["LocationCode"];
                    $locModified[$i]["L"] = $loc;
                    $locModified[$i]["E"] = $locations[$i]["BookingEngineID"];
                }

                $locations = $locModified;
            }
            

            $_SESSION["ActiveBookingLocations"] = json_encode($locations);
            //print_r($_SESSION["ActiveBookingLocations"]);
        }
        else {
        }

        return $_SESSION["ActiveBookingLocations"];

    }

    public static function getLocationInfo($loc_code) {
        $locations = json_decode($_SESSION["ActiveBookingLocations"], true);
        $rent_loc_col = array_column($locations, 'C');
        $key = array_search($loc_code, $rent_loc_col);  
        $location_arr = $locations[$key];
        return $location_arr;
    }  
    
    public static function isValidExpresswayLocation($locatoionCode) {
        $location_arr = self::getLocationInfo($locatoionCode);
        $isValidExpresswayLocation = 0;
        //if it is 1, it will US location
        if($location_arr['E'] == 1){
            $isValidExpresswayLocation = 1;
        }
        
        //returned boolean value (true or false)
        return $isValidExpresswayLocation;   
    }
    

}