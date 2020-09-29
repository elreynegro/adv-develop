<?php

class Adv_Landingpage_Helper {

    /*
     * Get survey page questions
     */
    public static function getSurveyQuestions($guid) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $http = new GuzzleHttp\Client;

        try {
            $response = $http->get( $get_wp_config_settings_array['full_api_url'] . '/getSurveyQuestions', [
                'query' => [
                    'cs_service_url' => $api_url_array['cs_api_url'],
                    'guid'=> $guid
                    ]
                ] );
        } catch (Exception $e) {

            //error_log('bad deal 444: ' . print_r($e->getMessage(), true));
            //echo json_encode('{error: "2 Getting User Something went wrong. Please try your search another time."}');
        }

        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;

    }

}