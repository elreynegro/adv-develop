<?php

//require_once( adv_plugin_dir('aez_oauth2') . '/AEZ_Oauth2_Plugin.php');
require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/advantage-locations/AdvLocations_Helper.php');

class AdvVehicles_Helper {

	public static function getVehicles($location_id) {
            $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();


        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        // $pickup_date_string = strtotime("+180 Days");
		// $dropoff_date_string = strtotime("+181 Days");
		// $pickup_date = date('mdY', $pickup_date_string);
		// $dropoff_date = date('mdY', $dropoff_date_string);

        // Check date 14 days from now.
        $pickup_date_string = strtotime("+14 Days");
        $dropoff_date_string = strtotime("+15 Days");

        // Memorial Day May 27 2019
        $start_memorial_day_2019 = strtotime("19 November 2019");
        $end_memorial_day_2019 = strtotime("31 November 2019");
        if (($pickup_date_string >= $start_memorial_day_2019) && ($pickup_date_string <= $end_memorial_day_2019)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Memorial Day May 25 2020
        $start_memorial_day_2020 = strtotime("17 May 2020");
        $end_memorial_day_2020 = strtotime("31 May 2020");
        if (($pickup_date_string >= $start_memorial_day_2020) && ($pickup_date_string <= $end_memorial_day_2020)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Memorial Day May 31 2021
        $start_memorial_day_2021 = strtotime("24 May 2021");
        $end_memorial_day_2021 = strtotime("7 June 2021");
        if (($pickup_date_string >= $start_memorial_day_2021) && ($pickup_date_string <= $end_memorial_day_2021)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // 4th of July 2019
        $start_4july_2019 = strtotime("27 June 2019");
        $end_4july_2019 = strtotime("11 July 2019");
        if (($pickup_date_string >= $start_4july_2019) && ($pickup_date_string <= $end_4july_2019)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // 4th of July 2020
        $start_4july_2020 = strtotime("27 June 2020");
        $end_4july_2020 = strtotime("11 July 2020");
        if (($pickup_date_string >= $start_4july_2020) && ($pickup_date_string <= $end_4july_2020)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // 4th of July 2021
        $start_4july_2021 = strtotime("27 June 2021");
        $end_4july_2021 = strtotime("11 July 2021");
        if (($pickup_date_string >= $start_4july_2021) && ($pickup_date_string <= $end_4july_2021)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Labor Day Sept 2 2019
        $start_labor_day_2019 = strtotime("26 August 2019");
        $end_labor_day_2019 = strtotime("9 September 2019");
        if (($pickup_date_string >= $start_labor_day_2019) && ($pickup_date_string <= $end_labor_day_2019)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Labor Day Sept 7 2020
        $start_labor_day_2020 = strtotime("31 August 2020");
        $end_labor_day_2020 = strtotime("14 September 2020");
        if (($pickup_date_string >= $start_labor_day_2020) && ($pickup_date_string <= $end_labor_day_2020)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

         // Labor Day Sept 6 2021
        $start_labor_day_2021 = strtotime("30 August 2021");
        $end_labor_day_2021 = strtotime("13 September 2021");
        if (($pickup_date_string >= $start_labor_day_2021) && ($pickup_date_string <= $end_labor_day_2021)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Thanksgiving Nov 28 2019
        $start_thanksgiving_2019 = strtotime("24 November 2019");
        $end_thanksgiving_2019 = strtotime("8 December 2019");
        if (($pickup_date_string >= $start_thanksgiving_2019) && ($pickup_date_string <= $end_thanksgiving_2019)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Thanksgiving Nov 26 2020
        $start_thanksgiving_2020 = strtotime("19 November 2020");
        $end_thanksgiving_2020 = strtotime("3 December 2020");
        if (($pickup_date_string >= $start_thanksgiving_2020) && ($pickup_date_string <= $end_thanksgiving_2020)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Thanksgiving Nov 25 2021
        $start_thanksgiving_2021 = strtotime("18 November 2021");
        $end_thanksgiving_2021 = strtotime("2 December 2021");
        if (($pickup_date_string >= $start_thanksgiving_2021) && ($pickup_date_string <= $end_thanksgiving_2021)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Christmas Dec 24 2019
        $start_christmas_2019 = strtotime("15 December 2019");
        $end_christmas_2019 = strtotime("5 January 2020");
        if (($pickup_date_string >= $start_christmas_2019) && ($pickup_date_string <= $end_christmas_2019)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Christmas Dec 24 2020
        $start_christmas_2020 = strtotime("16 December 2020");
        $end_christmas_2020 = strtotime("7 January 2021");
        if (($pickup_date_string >= $start_christmas_2020) && ($pickup_date_string <= $end_christmas_2020)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }

        // Christmas Dec 24 2021
        $start_christmas_2021 = strtotime("16 December 2021");
        $end_christmas_2021 = strtotime("7 January 2022");
        if (($pickup_date_string >= $start_christmas_2021) && ($pickup_date_string <= $end_christmas_2021)) {
            $pickup_date_string = strtotime("+28 Days");
            $dropoff_date_string = strtotime("+29 Days");
        }
        
        $pickup_date = date('mdY', $pickup_date_string);
        $dropoff_date = date('mdY', $dropoff_date_string);

        $http = new GuzzleHttp\Client;
        
        try {

            $response = $http->get( $get_wp_config_settings_array['full_api_url']  . '/getRates', [
                'query' => [
                    'rental_location_id' => $location_id,
                    'return_location_id' => $location_id,
                    'pickup_date' => $pickup_date,
                    'pickup_time' => '12:00PM',
                    'dropoff_date' => $dropoff_date,
                    'dropoff_time' => '12:00PM',
                    'promo_codes[]' => '',
                    'services_url' =>$get_wp_config_settings_array['services_url'] ,
                    'logging_url' => $get_wp_config_settings_array['logging_url'] ,
                    ]
                ] );
        } catch (Exception $e) {

error_log('bad deal 222: ' . print_r($e->getMessage(), true));
            echo json_encode('{error: "Something went wrong. Please try your search another time."}');
            die();            
        }
        $response_contents = $response->getBody()->getContents();
        $tmp_response_arrays = json_decode($response_contents, true);

        $response_arrays = $tmp_response_arrays['Payload'];

        return $response_arrays;
 
	}

    public static function getIntlVehicles($rental_location_id) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $request_query = [
            'rental_location_id' => $rental_location_id,
        ];

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url']  . '/requestLocationVehicles', $request_query);

        $tmp_vehicle_response_array = json_decode($response_contents, true);
        $vehicle_response_array = $tmp_vehicle_response_array['Payload'];

        return $vehicle_response_array;
    }

	public static function getVehicles_old($location_id) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        // header("Content-type: application/json");

        $http = new GuzzleHttp\Client;
        
        try {

            $response = $http->get( $get_wp_config_settings_array['full_api_url']  . '/getVehicles', [
                'query' => [
                    'rental_location_id' => $location_id,
                    'services_url' => $get_wp_config_settings_array['services_url'] ,
                    'logging_url' => $get_wp_config_settings_array['logging_url'] ,
                    ],
                'headers' => [
                    'Accept' => 'application/json',
                    ]
                ] );

        } catch (Exception $e) {

error_log('bad deal 444: ' . print_r($e->getMessage(), true));
            echo json_encode('{error: "5 Getting User Something went wrong. Please try your search another time."}');
            // die();            
        }
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;

	}
}