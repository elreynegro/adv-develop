<?php

// require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/aez_oauth2/AEZ_Oauth2_Plugin.php');
class AdvLandingPages_Helper {

	
    /**
     * @param $email - customer's email. $program_code - code of the program used.
     * @author Richard Garcia
     * @return array.
     */
    public static function saveAffiliateSignup($email, $program_code) { 

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;

        $reservation_history_array = array('Email' => $email,
                                           'ProgramCode' => $program_code);

        try {

            $response = $http->post( $get_wp_config_settings_array['services_url'] . '/saveAffiliateSignup', [
                'body' => json_encode($reservation_history_array),
                'headers' => [
                    'Content-Type' => 'application/json',
                    ],
                ] );
        } catch (Exception $e) {
            echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }

        $response_contents = $response->getBody()->getContents();
      
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays['d'];

    }

    public static function memberOptOut($MemberNumber, $UnsubscribeFrom) {
        try {
            //api call
            $data['MemberNumber'] = $MemberNumber;
            $data['UnsubscribeFrom'] = $UnsubscribeFrom;
            $data['BrandName'] = 'Advantage';
            $endpoint = 'Loyalty/MemberOptOut';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);
        } catch (Exception $e) {
            return array('Status' => 'Failed');
        }


        return $response_arrays;

    }

}