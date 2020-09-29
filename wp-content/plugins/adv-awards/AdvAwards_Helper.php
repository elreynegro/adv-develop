<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/aez_oauth2/AEZ_Oauth2_Plugin.php');

class AdvAwards_Helper {

     public static function getReservationHistory($email) { 

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;

        $reservation_history_array = array('Email' => $email,
                                           'BrandName' => 'Advantage');

         try {

            $promise = $http->requestAsync('POST', $get_wp_config_settings_array['services_url'] . '/getReservationHistory', [
                'body' => json_encode($reservation_history_array),
                'headers' => [
                    'Content-Type' => 'application/json',
                    ],
                ] )->then(function($response) {

                    $response_contents = $response->getBody()->getContents();

                    $response_arrays = json_decode($response_contents, true);

                    return $response_arrays['d'];

                }, function($exception) {

                    $exception = array('0'=>array('Status'=>'ERROR'));

                    return $exception;
                }
            );
        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong getting reservation history. Please try again at another time."}');
        }

        $response = $promise->wait();

        return $response;

    }

    public static function getAwardsPageHeaderInfo($memberNumber) { 

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;

        $header_array = array('memberNumber' => $memberNumber);

        try {

            $promise = $http->requestAsync('POST', $get_wp_config_settings_array['services_url'] . '/getAwardsPageHeaderInfo', [
                'body' => json_encode($header_array),
                'headers' => [
                    'Content-Type' => 'application/json',
                    ],
                ] )->then(function($response) {

                    $response_contents = $response->getBody()->getContents();

                    $response_arrays = json_decode($response_contents, true);

                    return $response_arrays['d'];

                }, function($exception) {

                    // $exception = array('0'=>array('Status'=>'ERROR'));

                    // return $exception;
                }
            );


        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong getting header information. Please try again at another time."}');
        }

        $response = $promise->wait();

        return $response;

    }


    public static function getAvailableMemberAwards($memberNumber) { 

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $http = new GuzzleHttp\Client;

        $available_member_awards_array = array('memberNumber' => $memberNumber);

        try {

             $promise = $http->requestAsync('POST', $get_wp_config_settings_array['services_url'] . '/getAvailableMemberAwards', [
                'body' => json_encode($available_member_awards_array),
                'headers' => [
                    'Content-Type' => 'application/json',
                    ],
                ] )->then(function($response) {

                    $response_contents = $response->getBody()->getContents();

                    $response_arrays = json_decode($response_contents, true);

                    return $response_arrays;

                }, function($exception) {

                    // $exception = array('0'=>array('Status'=>'ERROR'));

                    // return $exception;
                }
            );

        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong getting avaliable member awards. Please try again at another time."}');
        }

        $response = $promise->wait();

        return $response;

    }

    public static function getMemberAwardsHistory($memberNumber) { 

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;

        $member_awards_history_array = array('memberNumber' => $memberNumber);

        try {

            $response = $http->post( $get_wp_config_settings_array['services_url'] . '/getMemberAwardsHistory', [
                'body' => json_encode($member_awards_history_array),
                'headers' => [
                    'Content-Type' => 'application/json',
                    ],
                ] );

        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong getting member awards history. Please try again at another time."}');
        }

        $response_contents = $response->getBody()->getContents();

        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;

    }

    /*
	 * Get the full status name from the status character
	 */ 
    public static function getStatus($status) {

        switch (strtolower($status)) {
            // N - Active
            case "n":
                $return_status = "Active";
                break;
            // C - Cancelled
            case "c":
                $return_status = "Cancelled";
                break;
            // P - Contract
            case "p":
                $return_status = "Contract";
                break;
            default:
                $return_status = "Not Avaliable";
        }

        return $return_status;

    }
    

    /**
     * @param type $array
     * @return array
     */
    function sortAwardsBasedExpireDate($array) {
        $available_rewards = $array['d'];
        
        if(!empty($available_rewards)){
            //for sorting available rewards
            $orderByDate = $my2 = array();
            foreach($available_rewards as $key=>$row)
            {
                $orderByAutoApply[$key] = $row['AutoApply'];
                $my2 = explode('/',$row['ExpiresOn']);
                $my_date2 = $my2[0].'/'.$my2[1].'/'.$my2[2];
                $orderByDate[$key] = strtotime($my_date2);
            }
            array_multisort($orderByAutoApply, SORT_DESC, $orderByDate, SORT_ASC, $available_rewards);
            $return_array = array();
            $i = 0; 
            $key_array = array(); 
            $key = 'AwardType';
            foreach($available_rewards as $val) { 
                if (!in_array($val[$key], $key_array)) { 
                    $key_array[$i] = $val[$key]; 
                    $return_array[$i] = $val; 
                } 
                $i++; 
            } 
            return $return_array;
        }
        return FALSE;
    }
    

    

}