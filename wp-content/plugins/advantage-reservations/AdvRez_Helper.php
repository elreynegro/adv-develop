<?php

// require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/aez_oauth2/AEZ_Oauth2_Plugin.php');
class AdvRez_Helper {

	public static function getChooseValues($response_arrays) {

		$ret_arr = array();
		// $star = -1;
		$premium_key = -1;
		$premium_class_code = '';

        if (isset($response_arrays['RateProduct'][0])) {

            foreach ($response_arrays['RateProduct'] as $key => $val_arr) {

                if (strtoupper($val_arr['ClassCode']) == 'STAR') {
                    $premium_key = $key;
                    $premium_class_code = 'STAR';
                }

                if (strtoupper($val_arr['ClassCode']) == 'PTAR' || strtoupper($val_arr['ClassCode']) == 'PCAR') {
                    $premium_key = $key;
                    $premium_class_code = strtoupper($val_arr['ClassCode']);//'PTAR';
                }
                $first =  AdvRez_Helper::first_letter(substr($val_arr['ClassCode'], 0, 1));
                $second =  AdvRez_Helper::second_letter(substr($val_arr['ClassCode'], 1, 1));
                $third =  AdvRez_Helper::third_letter(substr($val_arr['ClassCode'], 2, 1));
                $third_short =  AdvRez_Helper::third_letter_short(substr($val_arr['ClassCode'], 2, 1));
                $fourth =  AdvRez_Helper::fourth_letter(substr($val_arr['ClassCode'], 3, 1));

                $ret_arr[$key] = [
                    'RateID' => $val_arr['RateID'],
                    'RateIDSort' => $val_arr['RateIDSort'],
                    'ClassCode' => $val_arr['ClassCode'],
                    'ClassDesc' => $val_arr['ClassDesc'],
                    'ModelDesc' => $val_arr['ModelDesc'],
                    'RateAmount' => $val_arr['RateAmount'],
                    'DiscountPercent' => $val_arr['DiscountPercent'],
                    'Passengers' => (strlen($val_arr['Passengers']) > 0 ? $val_arr['Passengers'] : '?'),
                    'Luggage' => (strlen($val_arr['Luggage']) > 0 ? $val_arr['Luggage'] : '?'),
                    'ClassImageURL' => $val_arr['ClassImageURL'],
                    'MPGCity' => (isset($val_arr['MPGCity']) && strlen($val_arr['MPGCity']) > 0 ? $val_arr['MPGCity'] : '?'),
                    'MPGHighway' => (isset($val_arr['MPGHighway']) && strlen($val_arr['MPGHighway']) > 0 ? $val_arr['MPGHighway'] : '?'),
                    'Category' => $first,
                    'Type' => $second,
                    'Transmission' => $third,
                    'AC' => $fourth,
                    'RatePlan' => $val_arr['RatePlan'],
                    'CurrencyCode' => $val_arr['CurrencyCode'],
                    // 'RatePlan' => $val_arr['RatePlan'],
                    'RRateAmount' => $val_arr['RateAmount'],
                    'RRateCharge' => $val_arr['TotalPricing']['RateCharge'],
                    'RTotalTaxes' => $val_arr['TotalPricing']['TotalTaxes'],
                    'RTotalExtras' => $val_arr['TotalPricing']['TotalExtras'],
                    'RRateDiscount' => $val_arr['TotalPricing']['RateDiscount'],
                    'RTotalCharges' => $val_arr['TotalPricing']['TotalCharges'],
                    'RRate1PerDay' => $val_arr['TotalPricing']['RatePeriod']['Rate1PerDay'],
                    'PRateAmount' => $val_arr['Prepaid']['RateAmount'],
                    'PRateCharge' => $val_arr['Prepaid']['TotalPricing']['RateCharge'],
                    'PTotalTaxes' => $val_arr['Prepaid']['TotalPricing']['TotalTaxes'],
                    'PTotalExtras' => $val_arr['Prepaid']['TotalPricing']['TotalExtras'],
                    'PTotalCharges' => $val_arr['Prepaid']['TotalPricing']['TotalCharges'],
                    'PRateDiscount' => $val_arr['Prepaid']['TotalPricing']['RateDiscount'], 
                    'PRate1PerDay' => $val_arr['Prepaid']['TotalPricing']['RatePeriod']['Rate1PerDay'],
                ];
            }

        } else {

            $first =  AdvRez_Helper::first_letter(substr($response_arrays['RateProduct']['ClassCode'], 0, 1));
            $second =  AdvRez_Helper::second_letter(substr($response_arrays['RateProduct']['ClassCode'], 1, 1));
            $third =  AdvRez_Helper::third_letter(substr($response_arrays['RateProduct']['ClassCode'], 2, 1));
            $third_short =  AdvRez_Helper::third_letter_short(substr($response_arrays['RateProduct']['ClassCode'], 2, 1));
            $fourth =  AdvRez_Helper::fourth_letter(substr($response_arrays['RateProduct']['ClassCode'], 3, 1));

            $ret_arr[0] = [
                'RateID' => $response_arrays['RateProduct']['RateID'],
                'RateIDSort' => $response_arrays['RateProduct']['RateIDSort'],
                'ClassCode' => $response_arrays['RateProduct']['ClassCode'],
                'ClassDesc' => $response_arrays['RateProduct']['ClassDesc'],
                'ModelDesc' => $response_arrays['RateProduct']['ModelDesc'],
                'RateAmount' => $response_arrays['RateProduct']['RateAmount'],
                'DiscountPercent' => $response_arrays['DiscountPercent'],
                'Passengers' => (strlen($response_arrays['RateProduct']['Passengers']) > 0 ? $response_arrays['RateProduct']['Passengers'] : '?'),
                'Luggage' => (strlen($response_arrays['RateProduct']['Luggage']) > 0 ? $response_arrays['RateProduct']['Luggage'] : '?'),
                'ClassImageURL' => $response_arrays['RateProduct']['ClassImageURL'],
                'MPGCity' => (isset($response_arrays['RateProduct']['MPGCity']) && strlen($response_arrays['RateProduct']['MPGCity']) > 0 ? $response_arrays['RateProduct']['MPGCity'] : '?'),
                'MPGHighway' => (isset($response_arrays['RateProduct']['MPGHighway']) && strlen($response_arrays['RateProduct']['MPGHighway']) > 0 ? $response_arrays['RateProduct']['MPGHighway'] : '?'),
                'Category' => $first,
                'Type' => $second,
                'Transmission' => $third,
                'AC' => $fourth,
                'RatePlan' => $response_arrays['RateProduct']['RatePlan'],
                'CurrencyCode' => $response_arrays['RateProduct']['CurrencyCode'],
                // 'RatePlan' => $response_arrays['RateProduct']['RatePlan'],
                'RRateAmount' => $response_arrays['RateProduct']['RateAmount'],
                'RRateCharge' => $response_arrays['RateProduct']['TotalPricing']['RateCharge'],
                'RTotalTaxes' => $response_arrays['RateProduct']['TotalPricing']['TotalTaxes'],
                'RTotalExtras' => $response_arrays['RateProduct']['TotalPricing']['TotalExtras'],
                'RRateDiscount' => $response_arrays['TotalPricing']['RateDiscount'],
                'RTotalCharges' => $response_arrays['RateProduct']['TotalPricing']['TotalCharges'],
                'RRate1PerDay' => $response_arrays['RateProduct']['TotalPricing']['RatePeriod']['Rate1PerDay'],
                'PRateAmount' => $response_arrays['RateProduct']['Prepaid']['RateAmount'],
                'PRateCharge' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['RateCharge'],
                'PTotalTaxes' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['TotalTaxes'],
                'PTotalExtras' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['TotalExtras'],
                'PTotalCharges' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['TotalCharges'],
                'PRateDiscount' => $response_arrays['Prepaid']['TotalPricing']['RateDiscount'],
                'PRate1PerDay' => $response_arrays['RateProduct']['Prepaid']['TotalPricing']['RatePeriod']['Rate1PerDay'],
            ];

        }

		$ret_arr[$key + 1] = [
			'PremiumKey' => $premium_key,
			'PremiumClassCode' => $premium_class_code,
		];

		return $ret_arr;
	}

	public static function getChoose3Vehicles($choose_list_array) {

		$tmp_choose_arr = $choose_list_array;
		$premium_class_code = $choose_list_array[count($choose_list_array) - 1]['PremiumClassCode'];
		$premium_key = $choose_list_array[count($choose_list_array) - 1]['PremiumKey'];
		$last_car_key = count($choose_list_array) - 2;
		$summary_key = count($choose_list_array) - 1;

		foreach ($choose_list_array as $key => &$value) {

			$upgrade = -1;
			$live_a_little = -1;
			// Key is not car classes
			if ($key == $summary_key) {
				// break;
			}

			// Set upgrade
			if ($key < $last_car_key) {
				foreach ($tmp_choose_arr as $up_key => $up_value) {
					if ($key == $summary_key) {
						break;
					}
					if ($up_key < $key + 1) {
						continue;
					}
					if ($value['RRateCharge'] < $up_value['RRateCharge']) {
						$upgrade = $up_key;
						break;
					}
				}
			}

            // Set Premium
            if ($key < $last_car_key - 1) {
                if ($premium_key > -1 && $key < $premium_key - 2) {
					$live_a_little = $premium_key;
                }
                else {
                    $live_a_little = -1;
                }
            }

			// if ($key < $last_car_key - 1 ) {
            //     $live_a_little = $up_key + 1;
            //     if($live_a_little > $last_car_key) { 
            //         $live_a_little = -1;
            //     }
            //     // This is for Premium cars STAR & PTAR/PCAR
			// 	if ($premium_key > -1 && $key < $premium_key - 2) {
			// 		$live_a_little = $premium_key;
			// 	}
			// }

			if ($key < $summary_key) {
				$value['upgrade'] = $upgrade;
				$value['live_a_little'] = $live_a_little;
			}

		}

		return $choose_list_array;
	}

	    /**
    * @param $letter - string, the category of the car.
    * @author Richard Garcia
    * @return string representation of the category of the car.
    */
    public static function first_letter($letter) {
        switch (strtoupper($letter)) {
            case 'M':
                return "Mini";
                break;
            case 'N':
                return "Mini Elite";
                break;
            case 'E':
                return "Economy";
                break;
            case 'C':
                return "Compact";
                break;
            case 'D':
                return "Compact Elite";
                break;
            case 'I':
                return "Intermediate";
                break;
            case 'J':
                return "Intermediate Elite";
                break;
            case 'S':
                return "Standard";
                break;
            case 'R':
                return "Standard Elite";
                break;
            case 'F':
                return "Fullsize";
                break;
            case 'P':
                return "Premium";
                break;
            case 'U':
                return "Premium Elite";
                break;
            case 'L':
                return "Luxury";
                break;
            case 'W':
                return "Luxury Elite";
                break;
            case 'O':
                return "Oversize";
                break;
            case 'X':
                return "Special";
                break;
            default:
                return "NA";
        }
    }


    /**
    * @param $letter - string, The type of car. Example: 4-5 Door
    * @author Richard Garcia
    * @return string representation of the type of the car.
    */
    public static function second_letter($letter) {
        switch (strtoupper($letter)) {
            case 'B':
                return "2-3 Door";
                break;
            case 'C':
                return "2/4 Door";
                break;
            case 'D':
                return "4-5 Door";
                break;
            case 'W':
                return "Wagon/Estate";
                break;
            case 'V':
                return "Passenger van";
                break;
            case 'L':
                return "Limousine";
                break;
            case 'S':
                return "Sport";
                break;
            case 'T':
                return "Convertible";
                break;
            case 'F':
                return "SUV";
                break;
            case 'J':
                return "Open-air All Terrain";
                break;
            case 'X':
                return "Special";
                break;
            case 'P':
                return "Pickup (regular cab)";
                break;
            case 'Q':
                return "Pickup (extended cab)";
                break;
            case 'Z':
                return "Special offer Car";
                break;
            case 'E':
                return "Coupe";
                break;
            case 'M':
                return "Monospace";
                break;
            case 'R':
                return "Recreational vehicle";
                break;
            case 'H':
                return "Motorhome";
                break;
            case 'Y':
                return "2-wheel vehicle";
                break;
            case 'N':
                return "Roadster";
                break;
            case 'G':
                return "Crossover";
                break;
            case 'K':
                return "Commercial van/truck";
                break;
            default:
                return "NA";
        }
    }

    /**
    * @param $letter - string, The type of Transmission.
    * @author Richard Garcia
    * @return string representation of the Transmission of the car.
    */
    public static function third_letter($letter) {
        switch (strtoupper($letter)) {
            case 'M':
            case 'N':
            case 'C':
                return 'Manual';
                break;
            case 'A':
            case 'B':
            case 'D':
                return 'Automatic';
                break;
            default:
                return 'NA';
        }
    }

    /**
    * @param $letter - string, The type of Transmission.
    * @author Richard Garcia
    * @return string representation of the Transmission of the car.
    */
    public static function third_letter_short($letter) {
        switch (strtoupper($letter)) {
            case 'M':
            case 'N':
            case 'C':
                return 'Man';
                break;
            case 'A':
            case 'B':
            case 'D':
                return 'Auto';
                break;
            default:
                return 'NA';
        }
    }

    /**
     * @param $letter - string, The type of Air Conditioning.
     * @author Richard Garcia
     * @return string representation of the Air Conditioning of the car.
     */
    public static function fourth_letter($letter) {
        switch (strtoupper($letter)) {
            case 'R':
            case 'D':
            case 'H':
            case 'E':
            case 'L':
            case 'A':
            case 'M':
            case 'V':
            case 'U':
                return "Yes";
                break;
            case 'N':
            case 'Q':
            case 'I':
            case 'C':
            case 'S':
            case 'B':
            case 'F':
            case 'Z':
            case 'X':
                return "No";
                break;
            default:
                return "NA";
        }
    }

    /**
     * @param $array - array of session variables.
     * @author Richard Garcia
     * @return Nothing. The session variables are saved in the function from the lowest price to highest.
     */
    public static function low_to_high($array) {
  
        // Create a temp array with the initial key value pairs
        $temp_array = $array;

        // Sort the array in descending order bases on the rate amount
        usort($array, function ($item1, $item2) {
            return $item1['RateAmount'] <=> $item2['RateAmount'];
        });

        // Check if the first element is the premimum key, if it is then move it to the bottom of the array.
        if (empty($array[0]['RateAmount'])) {
            // Pull out the first element
            $first_element = array_shift($array);
            // Push the first element to the bottom of the array
            array_push($array, $first_element);
        }


        // Create the choose_sort array which has the key => value of the sorted vehicles
        for ($x=0; $x < count($array); $x++) {
            for ($y=0; $y < count($temp_array); $y++) {
                // Compare arrays on the RateIDSort, if they are equal then set the choose_sort array
                // with the correct keys and values based on the seating
                if ($array[$x]['RateIDSort'] == $temp_array[$y]['RateIDSort']) {
                    $choose_sort[$x] = $y;
                }
            }
            
        }

        // Save new sorted session variables
        $_SESSION['choose-sort'] = $choose_sort;
    }

    /**
     * @param $array - array of session variables.
     * @author Richard Garcia
     * @return Nothing. The session variables are saved in the function from highest price to lowest.
     */
    public static function high_to_low($array) {
        // Create a temp array with the initial key value pairs
        $temp_array = $array;

        // Sort the array in descending order bases on the rate amount
        usort($array, function ($item1, $item2) {
            return $item2['RateAmount'] <=> $item1['RateAmount'];
        });

        // Check if the first element is the premimum key, if it is then move it to the bottom of the array.
        if (empty($array[0]['RateAmount'])) {
            // Pull out the first element
            $first_element = array_shift($array);
            // Push the first element to the bottom of the array
            array_push($array, $first_element);
        }


        // Create the choose_sort array which has the key => value of the sorted vehicles
        for ($x=0; $x < count($array); $x++) {
            for ($y=0; $y < count($temp_array); $y++) {
                // Compare arrays on the RateIDSort, if they are equal then set the choose_sort array
                // with the correct keys and values based on the seating
                if ($array[$x]['RateIDSort'] == $temp_array[$y]['RateIDSort']) {
                    $choose_sort[$x] = $y;
                }
            }
            
        }

        // Save new sorted session variables
        $_SESSION['choose-sort'] = $choose_sort;
    }

    /**
     * @param $array - array of session variables.
     * @author Richard Garcia
     * @return Nothing. The session variables are saved with the seating from highest to lowest.
     */
    public static function seating($array) {

        // Create a temp array with the initial key value pairs
        $temp_array = $array;

        // Sort the array in descending order bases on the passenger amount
        usort($array, function ($item1, $item2) {
            return $item2['Passengers'] <=> $item1['Passengers'];
        });

         // Check if the first element is the premimum key, if it is then move it to the bottom of the array.
        if (empty($array[0]['Passengers'])) {
            // Pull out the first element
            $first_element = array_shift($array);
            // Push the first element to the bottom of the array
            array_push($array, $first_element);
        }

        // Create the choose_sort array which has the key => value of the sorted vehicles
        for ($x=0; $x < count($array); $x++) {
            for ($y=0; $y < count($temp_array); $y++) {
                // Compare arrays on the RateIDSort, if they are equal then set the choose_sort array
                // with the correct keys and values based on the seating
                if ($array[$x]['RateIDSort'] == $temp_array[$y]['RateIDSort']) {
                    $choose_sort[$x] = $y;
                }
            }
            
        }

        // Save new sorted session variables
        $_SESSION['choose-sort'] = $choose_sort;
    }

    /**
     * @param $array - array of session variables.
     * @author Richard Garcia
     * @return Nothing. The session variables are saved with the luggage as the highest to lowest.
     */
    public static function luggage($array) {

        // Create a temp array with the initial key value pairs
        $temp_array = $array;

        // Sort the array in descending order bases on the luggage amount
        usort($array, function ($item1, $item2) {
            return $item2['Luggage'] <=> $item1['Luggage'];
        });

         // Check if the first element is the premimum key, if it is then move it to the bottom of the array.
        if (empty($array[0]['Luggage'])) {
            // Pull out the first element
            $first_element = array_shift($array);
            // Push the first element to the bottom of the array
            array_push($array, $first_element);
        }

        // Create the choose_sort array which has the key => value of the sorted vehicles
        for ($x=0; $x < count($array); $x++) {
            for ($y=0; $y < count($temp_array); $y++) {
                // Compare arrays on the RateIDSort, if they are equal then set the choose_sort array
                // with the correct keys and values based on the seating
                if ($array[$x]['RateIDSort'] == $temp_array[$y]['RateIDSort']) {
                    $choose_sort[$x] = $y;
                }
            }
            
        }

        // Save new sorted session variables
        $_SESSION['choose-sort'] = $choose_sort;
    }

     /**
     * @param $array - array of session variables.
     * @author Richard Garcia
     * @return Nothing. The session variables are saved with the MPG as highest to lowest.
     */
    public static function mpg($array) {
        // Create a temp array with the initial key value pairs
        $temp_array = $array;

        // Sort the array in descending order bases on the mpgcity amount
        usort($array, function ($item1, $item2) {
            return $item2['MPGCity'] <=> $item1['MPGCity'];
        });

         // Check if the first element is the premimum key, if it is then move it to the bottom of the array.
        if (empty($array[0]['MPGCity'])) {
            // Pull out the first element
            $first_element = array_shift($array);
            // Push the first element to the bottom of the array
            array_push($array, $first_element);
        }

        // Create the choose_sort array which has the key => value of the sorted vehicles
        for ($x=0; $x < count($array); $x++) {
            for ($y=0; $y < count($temp_array); $y++) {
                // Compare arrays on the RateIDSort, if they are equal then set the choose_sort array
                // with the correct keys and values based on the seating
                if ($array[$x]['RateIDSort'] == $temp_array[$y]['RateIDSort']) {
                    $choose_sort[$x] = $y;
                }
            }
            
        }

        // Save new sorted session variables
        $_SESSION['choose-sort'] = $choose_sort;
    }

   
    /**
     * @param $location_id - location of the vehicle rental, example: 'MCO'.
     * @author Richard Garcia
     * @return array of location data.
     */
  
	
	/**
     * @param $update_member_data - member profile data.
     * @author 
     * @return array.
     */
    public static function updateMemberPreference($update_member_data) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $request_params['services_url'] = $get_wp_config_settings_array['services_url'];

        $update_member_data['BrandName'] = "Advantage";
        $request_params['inputvalue'] = array($update_member_data);	

        $http = new GuzzleHttp\Client;
        
        try {

            $response = $http->post( $get_wp_config_settings_array['full_api_url'] . '/updateMemberPreference', [
                'query' => $request_params,
                'headers' => [
                    'Accept' => 'application/json',
                    ]
                ]);
        } catch (Exception $e) {
            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }

        $response_contents = $response->getBody()->getContents();

        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;
    }



    /**
     * @param  None.
     * @author Richard Garcia
     * @return $days - the difference in days between the dates and times. Example: 8
     */
    public static function getDaysBetweenDates() {

        // Convert pickup_date to mm/dd/yyyy
        $pick_up_date = $_SESSION['search']['pickup_date'];
        $pick_up_month = substr($pick_up_date, 0, 2);
        $pick_up_day = substr($pick_up_date, 2, 2);
        $pick_up_year = substr($pick_up_date, 4);
        $pickup_date = $pick_up_month . '/' . $pick_up_day . '/' . $pick_up_year;

        // Conver pickup_time to xx:xx:xx
        $pick_up_time = $_SESSION['search']['pickup_time'];
        $pickup_time = date('H:i:s', strtotime($pick_up_time));

        // Convert dropoff_date to mm/dd/yyyy
        $dropoff_date = $_SESSION['search']['dropoff_date'];
        $dropoff_month = substr($dropoff_date, 0, 2);
        $dropoff_day = substr($dropoff_date, 2, 2);
        $dropoff_year = substr($dropoff_date, 4);
        $dropoff_date = $dropoff_month . '/' . $dropoff_day . '/' . $dropoff_year;

        // Conver dropoff_time to xx:xx:xx
        $drop_off_time = $_SESSION['search']['dropoff_time'];
        $dropoff_time = date('H:i:s', strtotime($drop_off_time));

        $pick_up_datetime = new DateTime($pickup_date . " " . $pickup_time);
        $dropoff_datetime = new DateTime($dropoff_date . " " . $dropoff_time);

        // Find the difference between the dates
        $interval = $pick_up_datetime->diff($dropoff_datetime);

        // Pull out the number of days between the dates
        $days = $interval->format('%a');

        return $days;
    }

    public static function guzzleGet($getURL, $guzzleQuery, $send_header = true) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $guzzleQuery['services_url'] = $get_wp_config_settings_array['services_url'];
        $guzzleQuery['logging_url'] = $get_wp_config_settings_array['logging_url'];
        $guzzleQuery['logging_tsd'] = $api_url_array['logging_tsd'];
        $guzzleQuery['logging_xrs'] = $api_url_array['logging_xrs'];
        $guzzleQuery['logging_stop'] = $api_url_array['logging_stop'];
 
        if ($send_header) {
            header("Content-type: application/json");
        }

        $http = new GuzzleHttp\Client;

        try {
            $response = $http->get( $getURL, [
                'query' => $guzzleQuery
                ] );
                
        } catch (Exception $e) {

            return json_encode('{error: "Something went wrong. Please try your search another time."}');
        }

        $response_contents = $response->getBody()->getContents();

        return $response_contents;

    }

    public static function guzzlePost($postUrl, $guzzleFormParms, $guzzleHeader = []) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $guzzleFormParms['services_url'] = $get_wp_config_settings_array['services_url'];
        $guzzleFormParms['logging_url'] = $get_wp_config_settings_array['logging_url'];
        $guzzleFormParms['logging_tsd'] = $api_url_array['logging_tsd'];
        $guzzleFormParms['logging_xrs'] = $api_url_array['logging_xrs'];
        $guzzleFormParms['logging_stop'] = $api_url_array['logging_stop'];
 
        header("Content-type: application/json");

        $http = new GuzzleHttp\Client;

        try {

            $response = $http->post($postUrl, [
                'form_params' => $guzzleFormParms,
                'http_errors' => false
            ] );

        } catch (Exception $e) {

            return json_encode('{error: "Something went wrong with guzzlePost. Please try your search another time."}');
            // die();            
        }

        $response_contents = $response->getBody()->getContents();

        return $response_contents;

    }

    public static function getCookieArray($cookie = 'adv_userbookmark') {

        if (isset($_COOKIE[$cookie])) {
            return json_decode(base64_decode($_COOKIE[$cookie]), true);
        }
        return array();
    }

    /**
     * @param  None.
     * @author Richard Garcia
     * @return $terms_condtions - the terms and conditions verbiage.
     */
    public static function getTermsAndConditions() {

        $terms_conditions = '
                <div id="terms-and-conditions-drop-down" class="aez-extra-content">
                    <p>For prepaid reservations Advantage accepts the following forms of payments: American Express /Mastercard /Discover /Visa /Bankamericard /Optima Amex. Credit cards must have the available credit for the estimated amount of rental charges plus up to $200 in order to secure the rental. Please note that at the time of rental you will need to present 1) a current driver license and 2) a valid credit or charge card in the renter’s name.</p>

                    <p>All rentals are subject to Advantage Rent A Car standard terms and conditions of the Advantage Rent A Car Rental Agreement in effect at time and place of rental. Prepaid rates are subject to availability. This program is only available at participating cities/locations. Standard rental qualifications and rental period restrictions apply.</p>
         
                    <p>The reservation should be made in the renter’s name. The name on all rental credentials (license and credit card) presented at the time of rental must match the name on the reservation. If the names do not match, for security purposes the prepaid reservation must be cancelled and a new reservation made at prevailing rates. In addition, the name may not be changed after reservation confirmation.</p>
                     
                    <p>A valid driver license and credit card (both in the renter’s name) must be presented at the time of rental to cover any reasonably anticipated charges that have not been included in the Pay Now voucher. A prepaid charge card is not an acceptable credential.</p>
                     
                    <p>Pay Now rates are only available for reservations booked online at Advantage.com. Rental days are based on 24-hour periods commencing at time of pick-up. Additional days will apply if the rental is kept longer than specified and will be billed at a higher rate. When you pay in advance for your qualified reservation, your prepaid discount will automatically be applied to your rate. Prepaid rates cannot be combined with any other promotional offer. Fees or surcharges may be applied at time of rental. Voluntary upgrades will be charged at locally applicable rates. Your total rental rate is calculated based on the information provided at time of reservation. Approximate rental charges are based on available information at the time of reservation for renters age 25 and older. For renters under age 25 an additional daily age differential charge may apply. For minimum age requirements please see "Location Specific Information" or the "Terms and Conditions" on your rental contract.</p>
                     
                    <p>To release the car to you at time of pick-up all rental terms and conditions must be met, regardless of your original prepayment. You will have a hold put on your credit card at the time of rental for any additional estimated charges plus up to a $200 deposit.</p>
                     
                    <p>Upon returning the vehicle, Advantage Rent A Car will process a release of the unused portion of the hold subject to your bank’s procedure. This hold may take up to 7 business days to be released by your bank. If you fail to return the vehicle as agreed, Advantage Rent A Car will obtain additional authorizations from your account to cover the rental charges. Advantage Rent A Car is not responsible for any returned checks or overdrafts based on this policy. Extensions or late returns result in additional charges.</p>
                     
                    <p>Cancellation fees apply for prepaid reservations. No refunds or credits for unused rental days. If the prepaid reservation is cancelled any time prior to 24 hours of pick-up time, a $50 fee will be assessed. If you do not cancel the reservation within 24 hours of the scheduled pick-up time or if the rental vehicle is not picked up by the close of business on the arrival date listed on the confirmation email, the entire prepaid amount will be forfeited. Cancellation requests must be made at Advantage.com. In order to cancel a prepaid reservation, <a href="/my-reservations">click here</a> and fill out the form to retrieve your reservation. Click on view or modify reservation. After retrieving your reservation, click the cancel button. You will receive an email confirming the cancellation. Pay Now reservations cannot be modified.</p>
                </div>';

        return $terms_conditions;
    }

    public static function getCancellationPolicy() {
        $cancellation_policy = '<div id="cancellation-policy-content" class="aez-extra-content">
                                         <p> Cancelling a reservation must be done at the <a style="color: #00539f;" href="/my-reservations"><u> Advantage.com My Rental Car Reservation page</u></a> by searching for your reservation and then using the Cancel option. If a prepaid reservation is cancelled more than 24 hours before the pickup time, a $50 cancellation fee will be assessed. If you do not cancel a pre-paid reservation within 24 hours of the scheduled pick-up time or if the rental vehicle is not picked up by the close of business on the arrival date listed on the confirmation email, the entire amount will be forfeited.  
                                        </p>
                                    </div>';
        return $cancellation_policy; 
    }

    /**
     * @param  None.
     * @author Richard Garcia
     * @return $europecar_terms_condtions - Europe Car's terms and conditions verbiage.
     */
    public static function getEuropeCarTermsAndConditions() {
        $europecar_terms_conditions = '
                <div id="terms-and-conditions-drop-down" class="aez-extra-content">
                        <p>Please visit <a href="https://www.europcar.com" target="_blank">www.europcar.com</a> for terms and conditions.</p>
                </div>';

        return $europecar_terms_conditions;
    }


    /**
     * @param  $currencyCode - the currency code from the country.
     * @author Richard Garcia
     * @return $currencyCode and $currency_symbol - the currency code plus the currency symbol for that country.
     */
    public static function getAdvCurrency($currencyCode) {

        switch ($currencyCode) {
            // Austria, Belgium, France, Germany, Greece, Ireland, Italy, Netherlands, Portugal, Spain
            case "EUR":
                $currency_symbol = "€";
                break;
            // Aruba
            case "AWG":
                $currency_symbol = "ƒ";
                break;
            // Denmark
            case "DKK":
                $currency_symbol = "Kr";
                break;
            // Israel
            case "ILS":
                $currency_symbol = "₪";
                break;
            // South Africa    
            case "ZAR":
                $currency_symbol = "R";
                break;
            // Sweden
            case "SEK":
                $currency_symbol = "Kr";
                break;
            // Switzerland
            case "CHF":
                $currency_symbol = "Fr.";
                break;
            // United Kingdom
            case "GBP":
                $currency_symbol = "£";
                break;
            // Australia, Mexico, US
            case "USD":
                $currency_symbol = "$";
                break;
            default:
                $currency_symbol = "";
                break;
        }
        return $currencyCode . " " . $currency_symbol;
    }

     public static function NoCarsFound($displayMessage)
    {
        if($displayMessage)
            $_SESSION["NoCarsFound"] = "true";
        
        echo ("<script language='javascript'>
                window.location.href='http://".$_SERVER['SERVER_NAME']."';
                </script>");
        exit();
    }

      /**
     * @param  $creditCardName - the credit card name: Example "VI" for VISA
     * @author Richard Garcia
     * @return $ccName - the full credit card name
     */
    public static function getCreditCardName($creditCardName)
    {

        // If the creditCardName is not empty, the set the variable
        if (!empty($creditCardName)) {
            $cc_name = strtolower($creditCardName);
        }

        if ($cc_name == "american express" || $cc_name == "americanexpress" || $cc_name == "american" || $cc_name == "ax" || $cc_name == "a") {

            $ccName = 'American Express';

        } elseif ($cc_name == "mastercard" || $cc_name == "master card" || $cc_name == "master" || $cc_name == "m" || $cc_name == "mc") {

            $ccName = 'Mastercard';

        } elseif ($cc_name == "discover" || $cc_name == "discovercard" || $cc_name == "discover card" || $cc_name == "d" || $cc_name == "ds") {

            $ccName = 'Discover';

        } elseif ($cc_name == "diners" || $cc_name == "dc" || $cc_name == "diners club") {

            $ccName = 'Diners Club';

        } elseif ($cc_name == "visa" || $cc_name == "v" || $cc_name == "vi") {

            $ccName = 'Visa';

        } else {

            $ccName = '';

        }
        return $ccName;
    }

    /**
     * @param  $airline - airline 
     * @author Richard Garcia
     * @return $airline - the full airline name
     */
    public static function getAirlines($airline) {
        
        $airlineData = "";
        if(isset($_SESSION['reserve']['airlines']))
        {
            foreach ($_SESSION['reserve']['airlines'] as $arr) {
                $airlineCode = strtolower($arr[0]);
                $airlineValue = strtolower($arr[1]);

                $airlineValueSplitted = explode(' ', $airlineValue)[0];

                $airline = strtolower($airline);

                if($airlineCode == $airline 
                    || $airlineValue == $airline
                    || $airlineValueSplitted == $airline)
                {
                    $airlineData = $airlineValue . "," . $airlineCode;
                }
            }
        }
        return $airlineData;

        /*
        switch (strtolower($airline)) {
            case "hawaiian":
            case "hawaiian airlines":
            case "ha":
                $airline = "Hawaiian Airlines";
                $airline_code = "HA";
                break;
            case "spirit":
            case "spirit airlines":
            case "nk":
                $airline = "Spirit Airlines";
                $airline_code = "NK";
                break;
        }
        return $airline . ",".$airline_code;
        */
    }

     /**
     * @param  $award_description - description of the award
     * @author Richard Garcia
     * @return $tool_tips - the tool tip string that customer canhover over to get more info on the award
     */
    public static function getAwardsToolTips($award_description) {
         $no_tool_tips = 'false';

        switch (strtoupper($award_description)) {
            case "FREE CHILDSEAT":
                $tool_tip_title = 'You applied a Free Child’s Car Seat Award to your reservation.  Your rental will include 1 free car seat.';
                break;
            case "FREE GPS":
                $tool_tip_title = 'You applied a Free GPS Navigation Award to your reservation.  Your rental will include 1 free modular GPS unit.';
                break;
            case "REWARD-FREE DAY":
                $tool_tip_title = 'You applied a Free Day Award to your reservation.  We will waive the rate for 1 day from your total, and you will pay for at least 1 day plus mandatory local taxes and fees.';
                break;
            case "SKIP THE PUMP":
                $tool_tip_title = 'You applied a Pit Stop Award to your reservation.  If you return the car with less than a full tank of gas, we will charge you $2.50 per gallon needed to refill the tank.';
                break;
            case "E-Z TOLL":
                $tool_tip_title = 'You applied a Free Toll Pass Award to your reservation.  Your rental will include the E-Z Toll package free of charge, allowing you to drive through an unlimited number of tolls without penalty.';
                break;
            case "REWARD - FREE WEEKEND":
                $tool_tip_title = 'You applied a Free Weekend Award to your reservation.  We will waive the rate for 2 days from your total, and you will pay for at least 1 day plus mandatory taxes and fees';
                break;
            case "REWARD - ONE CAR CLASS UPGRADE":
                $tool_tip_title = 'You applied a Basic Upgrade Award to your reservation.  When you get to the counter, the agent will upgrade you to the next available vehicle class.  The largest vehicle class you could receive is a full-size car.';
                break;
            case "REWARD - BEST CAR CLASS UPGRADE":
                $tool_tip_title = 'You applied a Platinum Upgrade Award to your reservation.  When you get to the counter, the agent will upgrade you to the next available vehicle class.  You could receive up to a premium car, intermediate SUV, standard SUV, standard minivan, or premium minivan.';
                break;
            case "FREE - PIT STOP":
                $tool_tip_title = 'A free Pitstop Reward was applied automatically for you.';
                break;
            case "REWARD - PIT STOP":
                $tool_tip_title = 'Bring the vehicle back to us as is and we will fill it up.  You will pay $2.50 per gallon for used fuel and we will just attach it to your bill.';
                break;
            default:
                $no_tool_tips = 'true';
                break;
        }

        $tool_tips = '<i class="fa fa-question-circle" 
        data-toggle="tooltip" data-placement="bottom" 
        title=" ' . $tool_tip_title . '" 
        style="font-size: 1.3em; margin-left: 3px"></i>';

        if ($no_tool_tips == 'true') {
            $tool_tips = '';
        }

        return $tool_tips;
    }

    public function callListrakToOderDataImport($listrak_req_data){
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;
        try {
            $response = $http->post( $get_wp_config_settings_array['full_api_url'] . '/submitDataToListrakOrderImport',[
                'form_params' => $listrak_req_data
            ]);
        } catch (Exception $e) {
            error_log('bad deal 444: ' . print_r($e->getMessage(), true));
        }

        $response_contents = $response->getBody()->getContents();
        
        return json_encode($response_contents);
    }
    
     //check promocode status 
    public function in_array_r($needle, $haystack) {

        //if (isset($haystack) && $haystack !== "") {
        if (isset($haystack['PromoCode']) && $haystack['PromoCode'] !== "") {

            //if ((strtolower($item['PromoCode']) == strtolower($needle)) && ($item['PromoStatus'] =='OK')) {
            if ((strtolower($haystack['PromoCode']) == strtolower($needle)) && ($haystack['PromoStatus'] =='OK')) {
                return true;
            }

        } else {
            
            for ($x=0; $x < count($haystack); $x++) {
                if ((strtolower($haystack[$x]['PromoCode']) == strtolower($needle)) && ($haystack[$x]['PromoStatus'] =='OK')) {
                    return true;
                }
            }
        }

        return false;
    }
    
    //filter only valid promo codes
    public function filter_valid_promo_codes($needle, $haystack) {
        $needle = array_unique($needle);
        $promo_codes = array();
        foreach ($needle as $value) {
            if(isset($haystack[0])){
                foreach ($haystack as $item) {
                    if ((strtolower($item['PromoCode']) == strtolower($value)) && ($item['PromoStatus'] =='OK')) {
                        $promo_codes[0][] = $value;
                    } 
                }
            } else {
                if ((strtolower($haystack['PromoCode']) == strtolower($value)) && ($haystack['PromoStatus'] =='OK')) {
                        $promo_codes[0][] = $value;
                } 
            }
        }
        $_SESSION['search']['promo_codes'] = $promo_codes[0];
        return $promo_codes;
        
    }
    
    //update reserve summary content without page reload
     public function generateReserveSummaryWithUpdatedContent() {

    $vehicle_picked = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];
    $vehicle_prepaid_amount = sprintf('%01.2f', strval($vehicle_picked['PRateAmount']));
    $vehicle_prepaid_charge = sprintf('%01.2f', strval($vehicle_picked['PRateCharge']));
    if ($vehicle_picked['PTotalTaxes'] == 'Included') {
        $vehicle_prepaid_taxes = 'Included';
    } else {
        $vehicle_prepaid_taxes = sprintf('%01.2f', strval($vehicle_picked['PTotalTaxes']));
    }
    $vehicle_prepaid_extras = sprintf('%01.2f', strval($vehicle_picked['PTotalExtras']));
    $vehicle_prepaid_total = sprintf('%01.2f', strval($vehicle_picked['PTotalCharges']));
    $vehicle_prepaid_discount = sprintf('%01.2f', strval($vehicle_picked['PRateDiscount']));
    $vehicle_counter_amount = sprintf('%01.2f', strval($vehicle_picked['RRateAmount']));
    $vehicle_counter_charge = sprintf('%01.2f', strval($vehicle_picked['RRateCharge']));
    if ($vehicle_picked['RTotalTaxes'] == 'Included') {
        $vehicle_counter_taxes = 'Included';
    } else {
        $vehicle_counter_taxes = sprintf('%01.2f', strval($vehicle_picked['RTotalTaxes']));
    }
    $vehicle_counter_extras = sprintf('%01.2f', strval($vehicle_picked['RTotalExtras']));
    $vehicle_counter_total = sprintf('%01.2f', strval($vehicle_picked['RTotalCharges']));
    $vehicle_counter_discount = sprintf('%01.2f', strval($vehicle_picked['RRateDiscount']));
    
   $_SESSION['vehicle_counter_total']= $vehicle_counter_total;
   
   $_SESSION['vehicle_prepaid_total']= $vehicle_prepaid_total;

         // $v_prepaid = ($_SESSION['reserve']['Prepaid'] == 'Y' ? 'P' : 'R');
// error_log('     vvvvvvvvvvvvv vvvvvvv vvvvv v vvv vehicle_picked: ' . print_r($vehicle_picked, true));

    $initial_counter_display  = '';
    $initial_prepaid_display  = '';
    $counter_display = '';
    $prepaid_display = '';
    $saved_card_display = 'display: none;';
    
    
    $pay_now_content_disp = ($_SESSION['enhance']['payment_type'] == 'prepaid')?'block':'none';
        
    if(isset($_SESSION['enhance']['payment_type']) && isset($_SESSION['submit']['payment_type']) && $_SESSION['submit']['payment_type'] == 'prepaid') {
        $pay_now_content_disp = ($_SESSION['submit']['payment_type'] == 'prepaid')?'block':'none';
    }
    
    if ($_SESSION['enhance']['payment_type'] == 'prepaid' ) {
        $saved_card_display = '';
        $pay_now_value = 'checked';
        $pay_later_value = '';
        $is_prepaid = true;
        // $pay_now_value = '';
        // $pay_later_value = 'checked';
        $initial_counter_display  = ' style="display: none;"';
        $counter_display  = ' style="display: none;"';
    } else {
        $pay_now_value = '';
        $pay_later_value = 'checked';
        $is_prepaid = false;
        $initial_prepaid_display  = ' style="display: none;"';
        $prepaid_display  = ' style="display: none;"';
    }

    $prepaid_rate_amount = sprintf('%01.2f', strval($vehicle_prepaid_amount));
    $prepaid_rate_charge = sprintf('%01.2f', strval($vehicle_prepaid_charge));
    $prepaid_total_taxes = ($vehicle_prepaid_taxes <= 0) ? "Included" : $vehicle_prepaid_taxes;
    $prepaid_total_extras = sprintf('%01.2f', strval($vehicle_prepaid_extras));
    $prepaid_total_charges = sprintf('%01.2f', strval($vehicle_prepaid_total));
    $prepaid_discount = sprintf('%01.2f', strval($vehicle_prepaid_discount));

    $counter_rate_amount = sprintf('%01.2f', strval($vehicle_counter_amount));
    $counter_rate_charge = sprintf('%01.2f', strval($vehicle_counter_charge));
    $counter_total_taxes = ($vehicle_counter_taxes <= 0) ? "Included" : $vehicle_counter_taxes;
    $counter_total_extras = sprintf('%01.2f', strval($vehicle_counter_extras));
    $counter_total_charges = sprintf('%01.2f', strval($vehicle_counter_total));
    $counter_discount = sprintf('%01.2f', strval($vehicle_counter_discount));
    
      $_SESSION['current_total_price']= $vehicle_counter_total;
    
    $discount_percent = ($vehicle_picked['RRateDiscount'] == '' && $vehicle_picked['PRateDiscount'] == '')?0:$vehicle_picked['DiscountPercent'];

          // Check if RatePlan is weekly or daily. 
    if (strtoupper($vehicle_picked['RatePlan']) == 'WEEKLY') {
        $days = "week";
        $days_ly = "weekly";
    } else {
        $days = "day";
        $days_ly = "daily";
    }

    // Get the currency symbol for the country
    $currency_symbol = AdvRez_Helper::getAdvCurrency($vehicle_picked['CurrencyCode']);
     $summary_content='';
      $summary_content.='      <div class="aez-list aez-list--summary">
                    <h3>Fees &amp; Options</h3>
                    <ul>
                        <div class="list-items total-bottom-border">
                            <li>Vehicle Rental</li>
                            <li>
                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '> ' . $currency_symbol . sprintf('%01.2f', strval($prepaid_rate_amount)) . '</span>

                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '> ' . $currency_symbol . sprintf('%01.2f', strval($counter_rate_amount)) . '</span>

                                    <span class="aez-sub -blue">/' . $days . '</span>
                            </li>
                        </div>';

                         // Display the coupon discount if there is one.
                        if (isset($discount_percent) && $discount_percent > 0) {

                            $discount = $discount_percent * 100;

                            $summary_content .= '
                            <div class="list-items total-bottom-border">
                                <li>Discount (' . $discount . '%)</li>
                                <li>
                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '> ' . $currency_symbol . $prepaid_discount . '</span>

                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '> ' . $currency_symbol . $counter_discount . '</span>
                                </li>
                            </div>';
                        }

                        // If the vehicle is US based then show "Taxes and Fees" title
                        if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {

                            // If the taxes are included then don't show the taxes title
                            if ($prepaid_total_taxes !== "Included" && $counter_total_taxes !== "Included") {
                                $summary_content .= '
                                <div class="list-items">
                                    <li>Taxes and Fees</li>
                                </div>';
                            }

                            // Number of taxes and fees that we need to loop though
                            $number = floor(count($vehicle_picked['Taxes']['Prepaid'])/5);

                            // Chunk the vehicle_picked array and create a new array with 5 elements per indexed array
                            if (is_array($vehicle_picked['Taxes']['Prepaid'])) {
                                $chunk_array = array_chunk($vehicle_picked['Taxes']['Prepaid'], 5);
                            }

                            // Loop through the taxes and fees and display them
                            for ($x=0; $x < $number; $x++) {
                                $summary_content .= '
                                <div class="list-items taxes-fees"'. $prepaid_display .'>
                                    <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '>' . $currency_symbol . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                                </div>';
                            }

                            // Number of taxes and fees that we need to loop though
                            $number = floor(count($vehicle_picked['Taxes'])/5);

                            // Chunk the vehicle_picked array and create a new array with 5 elements per indexed array
                            if (is_array($vehicle_picked['Taxes'])) {
                                $chunk_array = array_chunk($vehicle_picked['Taxes'], 5);
                            }

                            // Loop through the taxes and fees and display them
                            for ($x=0; $x < $number; $x++) {
                               $summary_content.= '
                                <div class="list-items taxes-fees"' . $counter_display .'>
                                    <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '>' . $currency_symbol . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                                </div>';
                            }

                        }

                        // Display Taxes and Fees Total
                        $summary_content .= '
                        <div class="list-items total-bottom-border">
                            <li>Taxes and Fees Total</li>
                            <li>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '>' . (($prepaid_total_taxes == 'Included') ? ' ' : $currency_symbol) . $prepaid_total_taxes . '</span>

                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '>' . (($counter_total_taxes == 'Included') ? ' ' : $currency_symbol) . $counter_total_taxes . '</span>
                            </li>
                        </div>
                        <div class="list-items">
                            <li>Extras</li>
                        </div>';
                        
                        //echo "<pre>";print_r($_SESSION['reserve']['DailyExtra']);echo "</pre>";
                        
                        // If the vehicle is US based then show "Extras" title
						$oneway_flag = 1;
                        if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US' && !empty($_SESSION['reserve']['DailyExtra'][0])) {
                            // Number of extras
                            $numOptions = count($_SESSION['reserve']['DailyExtra']);

                            // Loop through the extras
                            for ($x=0; $x < $numOptions; $x++) {
								if(isset($_SESSION['reserve']['DailyExtra'][$x]['ExtraCode']) && $_SESSION['reserve']['DailyExtra'][$x]['ExtraCode'] == "ONEWAY"){
									$oneway_flag = 0;
								}
                               $summary_content .= '
                                    <div class="list-items">
                                        <li class="fee-breakdown">' .$_SESSION['reserve']['DailyExtra'][$x]['ExtraDesc'] .'';

                                // Pit Stop Code
                                if (isset($_SESSION['free_pitstop_applied']) && $_SESSION['free_pitstop_applied'] !== "False" && $_SESSION['free_pitstop_removed'] == "False" && $_SESSION['reserve']['DailyExtra'][$x]['ExtraDesc'] == "REWARD - PIT STOP") {
                                    $_SESSION['reserve']['DailyExtra'][$x]['ExtraDesc'] = "FREE - PIT STOP";
                                }
                                // End Pit Stop Code

                                $summary_content.= AdvRez_Helper::getAwardsToolTips($_SESSION['reserve']['DailyExtra'][$x]['ExtraDesc']);
                                      
                                $summary_content.= '
                                        </li>

                                        <li class="fee-breakdown">
                                            <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display extras_list">'. $currency_symbol . sprintf('%01.2f', strval($_SESSION['reserve']['DailyExtra'][$x]['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span>
                                        </li>
                                    </div>';
                            }

                        }

                        // If there's a ONEWAY fee display it. The ONEWAY fee is either prepaid or counter. Need to check if the
                        // ONEWAY fee exists in either one.
                        if ($oneway_flag && ((!empty($_SESSION['enhance']['POneWay']) && is_array($_SESSION['enhance']['POneWay'])) || (!empty($_SESSION['enhance']['ROneWay']) && is_array($_SESSION['enhance']['ROneWay'])))) {

                            $summary_content.= '
                                <div class="list-items">
                                    <li class="fee-breakdown">

                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '>' .$_SESSION['enhance']['POneWay']['ExtraDesc'] .' </span>

                                         <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '>' .$_SESSION['enhance']['ROneWay']['ExtraDesc'] .' </span>

                                    </li>
                                    <li class="fee-breakdown">

                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '>' . $currency_symbol . sprintf('%01.2f', strval($_SESSION['enhance']['POneWay']['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span>

                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '>' . $currency_symbol . sprintf('%01.2f', strval($_SESSION['enhance']['ROneWay']['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span>

                                    </li>
                                </div>';
                        }

                        
                        // Display Extra Totals
                        $summary_content.= '
                        <div class="list-items">
                            <li>Extras Total</li>
                            <li>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '> '. $currency_symbol . sprintf('%01.2f', strval($prepaid_total_extras)) . '</span>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '> ' . $currency_symbol . sprintf('%01.2f', strval($counter_total_extras)) . '</span>
                            </li>
                        </div>
                        <div class="list-items total">
                            <li>Total</li>
                            <li>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_prepaid_display . '> '. $currency_symbol . sprintf('%01.2f', strval($prepaid_total_charges)) . '</span>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"' . $initial_counter_display . '> '. $currency_symbol . sprintf('%01.2f', strval($counter_total_charges)) . '</span>
                                 <input type="hidden" name="last_total_price" id="last_total_price" value="'.$counter_total_charges.'">
                                    
                            </li>
                        </div>
                    </ul>
                </div>
               ';

        // Set hidden fields for abandonment promocode
        if (isset($_SESSION['abandonment']['abandonment_promocode']) && $_SESSION['abandonment']['abandonment_promocode'] !== "") {
            $summary_content  .= '<input type="hidden" id="abandonment_promocode_exists_2" value="true" />';
        } else {
            $summary_content  .= '<input type="hidden" id="abandonment_promocode_exists_2" value="false" />';
        }

      return $summary_content;
     }
     
     //reserve page promocode related message dispaly
    function reservePromocodeMessageDsiplay() {

        $clean_post_data = [];
        if(AEZ_Oauth2_Plugin::clean_user_entered_data() !== null) {
            $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        }
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        if(!empty($clean_post_data)) {
            $promo_codes = array_map(function($x){
                return strtolower(trim($x));
            }, $clean_post_data['promo_codes']);
        }

        $abandonment_promocode = strtolower($api_url_array['abandonment_promocode']);
      
        $msg_html = '';
        if(((isset($clean_post_data['promo_codes']) && count($clean_post_data['promo_codes']) > 0) && (!isset($_SESSION['abandonment']['abandonment_promocode']) && in_array($abandonment_promocode,$promo_codes)))) {
            
        $output_message .= '<div class="aez-warning">' .
                '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                '<div class="aez-warning__message">' .
                '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $api_url_array['abandonment_promocode'] . '</span>' .
                '<span class="aez-warning__additional-text">Promo Code ' . $api_url_array['abandonment_promocode'] . ' can not be used.</span>' .
                '</div>' .
                '</div>';
        } 
        elseif (isset($_SESSION['choose_promos']['PromoCodeEntered']) && count($_SESSION['choose_promos']['PromoCodeEntered']) > 0) {

            $output_message = '';

            if (isset($_SESSION['choose_promos']['PromoCodeEntered'][0])) {
                $tmp_promos_removed = array();
                foreach ($_SESSION['choose_promos']['PromoCodeEntered'] as $key => $value) {
                    if ($value['PromoStatus'] != 'OK') {
                        if(!in_array($value['PromoCode'], $tmp_promos_removed)) {
                            $promo_code_title[] = $value['PromoCode'];
                            $output_message_internal .= '<span class="aez-warning__additional-text">' . $value['PromoMsg'] . '</span>';
    
                        }
                        // If abandonment promo code is set, remove the other ones from the Stack so the error messages
                        // don't keep appending to each other.
                        if (isset($_SESSION['abandonment']['abandonment_promocode']) && $_SESSION['abandonment']['abandonment_promocode'] !== "") {
                           
                            // Create a temporary array of removed promo codes that we will use to compare to another array later
                            array_push($tmp_promos_removed, $_SESSION['choose_promos']['PromoCodeEntered'][$key]['PromoCode']);
                            // Unset the bad promo codes
                            unset($_SESSION['choose_promos']['PromoCodeEntered'][$key]);
                        }

                    }
                }

                // Create the hidden field with the good promo codes which is read from the javascript
                $_SESSION['search']['promo_codes'] = array_diff($_SESSION['search']['promo_codes'],$tmp_promos_removed);
                $implode_promo_codes = implode(",",$_SESSION['search']['promo_codes']);
                $output_message_internal .= '<input type="hidden" name="" id="new_promo_stack" value="'.$implode_promo_codes.'" />';

                // Reindex the ['choose_promos']['PromoCodeEntered'] array after unsetting the bad promo codes
                if (isset($_SESSION['abandonment']['abandonment_promocode']) && $_SESSION['abandonment']['abandonment_promocode'] !== "") {
                    array_values($_SESSION['choose_promos']['PromoCodeEntered']); 
                }

            } elseif ($_SESSION['choose_promos']['PromoCodeEntered']['PromoStatus'] != 'OK') {

                $output_message .= '<div class="aez-warning">' .
                        '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                        '<div class="aez-warning__message">' .
                        '<span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $_SESSION['choose_promos']['PromoCodeEntered']['PromoCode'] . '</span>' .
                        '<span class="aez-warning__additional-text">' . $_SESSION['choose_promos']['PromoCodeEntered']['PromoMsg'] . '</span>' .
                        '</div>' .
                        '</div>';

            } elseif ($_SESSION['choose_promos']['PromoCodeEntered']['PromoStatus'] == 'OK' && $_SESSION['choose_promos']['PromoCodeEntered']['VehicleRestrictions'] == 'True') {
                $output_message .= '<div class="aez-warning">' .
                        '<div class="aez-warning__fa-exclamation-triangle"></div>' .
                        '<div class="aez-warning__message">' .
                        '<span class="aez-warning__additional-text">' . $_SESSION['choose_promos']['PromoCodeEntered']['VehicleRestrictionsMsg'] . '</span>' .
                        '</div>' .
                        '</div>';
            }
          
            if ($output_message_internal && is_array($promo_code_title)) {
                $implode_promo_code_title = implode(',', $promo_code_title);
                $output_message .= '<div class="aez-warning">
                                        <div class="aez-warning__fa-exclamation-triangle"></div>
                                        <div class="aez-warning__message">
                                        <span class="aez-warning__main-text">There\'s a problem with Promo Code ' . $implode_promo_code_title . '</span>' . $output_message_internal . '
                                        </div>
                                    </div>';
            }

            if (strlen(trim($output_message)) > 0) {
                $msg_html .= '<div class="aez-warning-container">' . $output_message .
                        '<i class="fa fa-close aez-warning__close"></i></div>';

            }
        }
      
        if (strlen(trim($output_message)) > 0) {
            $msg_html .= '<div class="aez-warning-container">' . $output_message .
                    '<i class="fa fa-close aez-warning__close"></i></div>';

        }

        return $msg_html;
    }
    //reserve page promocode updated when user enter or remove promocode
    function reservePagepromocodesection() {

        $promo_code_html = '';
        if (isset($_SESSION['search']['promo_codes'])) {
            $promo_codes[0] = $_SESSION['search']['promo_codes'];
        }
        //filter dummy promo codes
        if (isset($_SESSION['search']['promo_codes'])) {
        $promo_codes = AdvRez_Helper::filter_valid_promo_codes($promo_codes[0],$_SESSION['choose_promos']['PromoCodeEntered']);
        }
        $promo_code_html .= '<h4 class="aez-form-block__header">Promo or Corporate Code</h4>';

        // There is no promo code add the html for the input box
        if (!isset($promo_codes[0][0])) {

            $promo_code_html .= '<div class="aez-form-item--with-btn renter-info add1">
                        <div class="aez-form-item renter-info-left code">
                            <label for="promot_codes1" class="aez-form-item__label">Code</label>
                            
                            <input
                                id="promot_codes1"
                                type="text"
                                class="aez-form-item__input aez-validate-promo-code"
                                name="promot_codes[]"
                                data-number="1"
                                placeholder="Enter Code"
                            />
                        </div>
                        <span class="aez-add-btn-total reserve-code" data-number="1"></span>
                    </div>';
        } else {

            // Loop though all the promo codes
            for ($x = 0; $x < count($promo_codes[0]); $x++) {

                if (isset($member_number)) {

                    if (isset($_SESSION['choose_promos']['PromoCodeEntered'])) {
                        $is_there = AdvRez_Helper::in_array_r($promo_codes[0][$x], $_SESSION['choose_promos']['PromoCodeEntered']);
                        if ($is_there != '1') {
                            $is_there = AdvRez_Helper::in_array_r($promo_codes[0][$x], $_SESSION['choose_promos']);
                        }
                    }
                } else {

                    $is_there = AdvRez_Helper::in_array_r($promo_codes[0][$x], $_SESSION['choose_promos']['PromoCodeEntered']);
                    if ($is_there != '1') {
                        $is_there = AdvRez_Helper::in_array_r($promo_codes[0][$x], $_SESSION['choose_promos']);
                    }
                }

                $check_valid_promo = '';
                //apply yes attributes   for only valid promo codes 
                if ($is_there) {
                    $check_valid_promo = 'data-valid-promo="yes"';
                }

                // If the current code is the last code in the array, add the  "+" button, else add the "-" button.
                if ($x == (count($promo_codes[0]) - 1) && (count($promo_codes[0])) < 2) {
                    $class = "aez-add-btn-total";
                } else {
                    $class = "aez-remove-btn-total";
                }
                // error_log('in promo >>>>> 1'); 
                $check_side = $x % 2;
                if ($check_side == 0) {
                    $class_to_add = 'add1';
                } else {
                    $class_to_add = 'add2';
                }

                // If the abandoment promocode is in the promodo array, that means it's been applied.
                // We need to skip showing this code to the customer.
                if (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($promo_codes[0][$x]))) {
                    $promoCode = "";
                } else {

                    $promoCode = $promo_codes[0][$x];
                }

                $promo_code_html .= '<div ' . $check_valid_promo . ' class="aez-form-item--with-btn renter-info add1 ' . $class_to_add . '">
                            <div class="aez-form-item renter-info-left code">
                                <label for="promot_codes1" class="aez-form-item__label">Code</label>

                                <input
                                    id="promot_codes1"
                                    type="text"
                                    class="aez-form-item__input aez-validate-promo-code get_promo_code_' . $promoCode . '"
                                    name="promot_codes[]"
                                    data-number="1"
                                    placeholder="Enter Code"
                                    value="' . $promoCode . '"  
                                />
                            </div>
                            <span class="' . $class . '" data-number="1"></span>
                        </div>';
            } // End for
        } // End if



        return $promo_code_html;
    }
    
    /* update promocode section dynamically in modal popup  */
     function modifyoptionsPopup_promocodesection() {

            $promo_codes[0] = $_SESSION['search']['promo_codes'];

            $promo_code_buttons=' <h4 class="aez-form-block__header">Promo or Corporate Code</h4>';

            if (count($promo_codes[0]) >= 1)
            {

                for ($x=0; $x < count($promo_codes[0]); $x++) {

                    // If the abandoment promocode is in the promo_codes array, that means it's been applied.
                    // We need to skip showing this code to the customer.
                    if (isset($_SESSION['abandonment']['abandonment_promocode']) && strtolower(trim($_SESSION['abandonment']['abandonment_promocode'])) == strtolower(trim($promo_codes[0][$x]))) {
                        // Set promo code to nothing so it doesn't show to customer.
                        $promo_codes[0][$x] = "";
                    }

                    // If the current code is the last code in the array, add the  "+" button, else add the "-" button.
                    $class = "aez-remove-btn";
                    if ($x == (count($promo_codes[0]) - 1) && (count($promo_codes[0])) < 2) {
                        $class = "aez-add-btn";
                    } 
                    $promo_code_value = (isset($promo_codes[0][$x])) ?  $promo_codes[0][$x] : '';
                    $promo_code_buttons =  $promo_code_buttons . '<div class="aez-form-item--with-btn promo-code-section-dynamic">' .
                        '<div class="aez-form-item aez-form-item--white">' .
                            '<label for="promo_codes1" class="aez-form-item__label">Code</label>' .
                                '<input
                                    id="promo_codes1"
                                    type="text"
                                    class="aez-form-item__input"
                                    name="promo_codes[]"
                                    data-number="1"
                                    placeholder="Enter Code"
                                    value="' . $promo_code_value . '"
                                />' .
                        '</div>' .
                        '<span class="' . $class . '" data-number="1"></span><div class="">&nbsp;</div>' .
                    '</div>';
                }

            } else {
                $promo_code_buttons = '<div class="aez-form-item--with-btn promo-code-section-dynamic">' .
                            '<div class="aez-form-item aez-form-item--white">' .
                                '<label for="promo_codes1" class="aez-form-item__label">Code</label>' .
                                '<input
                                    id="promo_codes1"
                                    type="text"
                                    class="aez-form-item__input"
                                    name="promo_codes[]"
                                    data-number="1"
                                    placeholder="Enter Code"
                                />' .
                            '</div>' .
                            '<span class="aez-add-btn" data-number="1"></span><div class="">&nbsp;</div>' .
                        '</div>';
            }


        return $promo_code_buttons;
    }


}