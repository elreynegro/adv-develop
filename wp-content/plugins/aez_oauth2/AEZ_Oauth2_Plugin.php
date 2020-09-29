<?php

include_once('AEZ_Oauth2_LifeCycle.php');
require_once( $_SERVER["DOCUMENT_ROOT"] . '/vendor/autoload.php' );

class AEZ_Oauth2_Plugin extends AEZ_Oauth2_LifeCycle {

    public $oauth_url;
    public $client_id;
    public $client_secret;
    public $api_version;
    public $user_api_version;
    public $full_api_url;
    public $full_user_api_url;

    /**
     * See: http://plugin.michael-simpson.com/?page_id=31
     * @return array of option meta data.
     */
    public function getOptionMetaData() {
        //  http://plugin.michael-simpson.com/?page_id=31
        return array(
            //'_version' => array('Installed Version'), // Leave this one commented-out. Uncomment to test upgrades.
            'services_url' => array(__('Enter AEZ RAC Services URL', 'aez_api')),
            'logging_url' => array(__('Enter AEZ RAC Logging URL', 'aez_api')),
            'services_v2_url' => array(__('Enter AEZ RAC V2 Services URL', 'aez_api')),
            'services_v2_apikey' => array(__('Enter AEZ RAC V2 API Key', 'aez_api')),
            'services_v2_source' => array(__('Enter AEZ RAC V2 Source', 'aez_api')),
            'logging_tsd' => array(__('Log TSD Calls (Y or N)', 'aez_api')),
            'logging_xrx' => array(__('Log XRS Calls (Y or N)', 'aez_api')),
            'logging_stop' => array(__('Stop All logging (Y or N)', 'aez_api')),
            'oauth_url' => array(__('Enter Rez Book API Base URL', 'aez_api')),
            'api_version' => array(__('Enter Rez Book API Version', 'aez_api')),
            'api_version_prefix' => array(__('Enter Rez Book API Prefix (if any)', 'aez_api')),
            'pursuade_url' => array(__('Enter Persuade URL for this environment', 'aez_api')),
            'flush_promo_codes' => array(__('Should promo codes be allowed to be reused for testing? (Y or N)', 'aez_api')),
            'kayak_iata' => array(__('Enter Kayak IATA (adds to promo codes in primary spot)', 'aez_api')),
            'cs_send_to_email' => array(__('Enter Customer Service Email for Contact Us Page', 'aez_api')),
            'signup_promo_code' => array(__('Enter Email Sign Up promo code', 'aez_api')),
            'user_api_version' => array(__('Enter User Rez Book API Version, Laravel default, usually left blank', 'aez_api')),
            'user_api_version_prefix' => array(__('Enter User Rez Book API Prefix (if any), Laravel default, usually left blank', 'aez_api')),
            'client_id' => array(__('Enter Client ID - likely not needed', 'aez_api')),
            'client_secret' => array(__('Enter Client Secret - likely not needed', 'aez_api')),
            'display_cancel_reservation' => array(__('Display the cancel reservation button on the my-reservations page (Y or N)', 'aez_api')),
            'cs_api_url' => array(__('Enter CS API URL', 'aez_api')),
            'logging_flag' => array(__('Turn on logging for contact us and reset password (Y or N)', 'aez_api')),
            'hurricane_flag' => array(__('Turn on hurricane warning (Y or N)', 'aez_api')),
            'hurricane_text' => array(__('Text for hurricane warning', 'aez_api')),
            'google_location_maps' => array(__('Show google maps on location pages (Y or N)', 'aez_api')),
            'abandonment_promocode' => array(__('Abandoment Promocode', 'aez_api')),
            'sojern_flag' => array(__('Turn on Sojern Pixel (Y or N)', 'aez_api')),
        );
    }

//    protected function getOptionValueI18nString($optionValue) {
//        $i18nValue = parent::getOptionValueI18nString($optionValue);
//        return $i18nValue;
//    }

    protected function initOptions() {
        $options = $this->getOptionMetaData();
        if (!empty($options)) {
            foreach ($options as $key => $arr) {
                if (is_array($arr) && count($arr > 1)) {
                    $this->addOption($key, $arr[1]);
                }
            }
        }
    }

    public function getPluginDisplayName() {
        return 'AEZ Settings';
    }

    public static function getFullPluginDisplayName() {
        return basename(__FILE__, '.php');
    }

    protected function getMainPluginFileName() {
        return 'aez_oauth2.php';
    }

    /**
     * Get api paramenters from WP Options table
     */
    public static function getApiUrl() {

        $oauth_url = get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_oauth_url');

        $brand_pieces = explode('.', $oauth_url);

        if ($brand_pieces[1] == 'aezrac') {
            $brand_pieces[1] = 'advantage';
        }

        return [
            'services_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_services_url'),
            'logging_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_logging_url'),
            'services_v2_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_services_v2_url'),
            'services_v2_apikey' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_services_v2_apikey'),
            'services_v2_source' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_services_v2_source'),
            'logging_tsd' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_logging_tsd'),
            'logging_xrs' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_logging_xrs'),
            'logging_stop' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_logging_stop'),
            'oauth_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_oauth_url'),
            'api_version' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_api_version'),
            'api_version_prefix' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_api_version_prefix'),
            'user_api_version' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_user_api_version'),
            'user_api_version_prefix' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_user_api_version_prefix'),
            'client_id' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_client_id'),
            'client_secret' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_client_secret'),
            'full_api_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_oauth_url') . get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_api_version_prefix') . get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_api_version'),
            'full_user_api_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_oauth_url') . get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_user_api_version_prefix') . get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_user_api_version'),
            'pursuade_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_pursuade_url'),
            'flush_promo_codes' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_flush_promo_codes'),
            'kayak_iata' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_kayak_iata'),
            'cs_send_to_email' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_cs_send_to_email'),
            'signup_promo_code' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_signup_promo_code'),
            'brand' => $brand_pieces[1],
            'display_cancel_reservation' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_display_cancel_reservation'),
            'cs_api_url' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_cs_api_url'),
            'logging_flag' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_logging_flag'),
            'hurricane_flag' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_hurricane_flag'),
            'hurricane_text' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_hurricane_text'),
            'google_location_maps' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_google_location_maps'),
            'abandonment_promocode' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_abandonment_promocode'),
            'sojern_flag' => get_option( AEZ_Oauth2_Plugin::getFullPluginDisplayName() . '_sojern_flag'),
        ];

    }
  

    /**
     * Clean Get and Post data
     */
    public static function clean_user_entered_data ($type = 'post', $args = FILTER_SANITIZE_STRING) {

        if (strtolower($type) == 'post') {

            return filter_input_array(INPUT_POST, $args);

        } else if (strtolower($type) == 'get') {

            return filter_input_array(INPUT_GET, $args);

        }

        return array();

    }

    /**
     * Get reservation cookie
     */
    public static function get_reservation_cookie () {

        if (isset($_COOKIE['adv_reservation'])) {
            return $_COOKIE['adv_reservation'];
        } 

        return '';
    }

    /**
     * Make call to AEZ API
     */
    public static function callAezApi ($http_method, $api_method, $data) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;

        $data['services_url'] = $get_wp_config_settings_array['services_url'];
        $data['logging_url'] =$get_wp_config_settings_array['logging_url'];

        
        // error_log("Above Try get callAezApi");
        try {

            $response = $http->$http_method( $get_wp_config_settings_array['full_api_url'] . '/' . $api_method, [
                'query' => $data,
                'headers' => [
                    'Accept' => 'application/json',
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
     * See: http://plugin.michael-simpson.com/?page_id=101
     * Called by install() to create any database tables if needed.
     * Best Practice:
     * (1) Prefix all table names with $wpdb->prefix
     * (2) make table names lower case only
     * @return void
     */
    protected function installDatabaseTables() {
        //        global $wpdb;
        //        $tableName = $this->prefixTableName('mytable');
        //        $wpdb->query("CREATE TABLE IF NOT EXISTS `$tableName` (
        //            `id` INTEGER NOT NULL");
    }

    /**
     * See: http://plugin.michael-simpson.com/?page_id=101
     * Drop plugin-created tables on uninstall.
     * @return void
     */
    protected function unInstallDatabaseTables() {
        //        global $wpdb;
        //        $tableName = $this->prefixTableName('mytable');
        //        $wpdb->query("DROP TABLE IF EXISTS `$tableName`");
    }


    /**
     * Perform actions when upgrading from version X to version Y
     * See: http://plugin.michael-simpson.com/?page_id=35
     * @return void
     */
    public function upgrade() {
    }

    public function addActionsAndFilters() {

        // Add options administration page
        // http://plugin.michael-simpson.com/?page_id=47
        add_action('admin_menu', array(&$this, 'addSettingsSubMenuPage'));


        // Example adding a script & style just for the options administration page
        // http://plugin.michael-simpson.com/?page_id=47
        //        if (strpos($_SERVER['REQUEST_URI'], $this->getSettingsSlug()) !== false) {
        //            wp_enqueue_script('my-script', plugins_url('/js/my-script.js', __FILE__));
        //            wp_enqueue_style('my-style', plugins_url('/css/my-style.css', __FILE__));
        //        }


        // Add Actions & Filters
        // http://plugin.michael-simpson.com/?page_id=37


        // Adding scripts & styles to all pages
        // Examples:
        //        wp_enqueue_script('jquery');
        //        wp_enqueue_style('my-style', plugins_url('/css/my-style.css', __FILE__));
        //        wp_enqueue_script('my-script', plugins_url('/js/my-script.js', __FILE__));


        // Register short codes
        // http://plugin.michael-simpson.com/?page_id=39


        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

    }

    /**
     * Login into AEZ API using OAuth2 password grant type
     */
    public function login($post_array) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
// error_log('111111 api_url_array: ' . print_r($api_url_array,true));
//         if ((strlen(trim($api_url_array['client_id'])) < 1) || (strlen(trim($api_url_array['client_secret'])) < 1)) {

//             return ['error' => 'No OAuth Client'];

//         }
// error_log('22222 api_url_array: ' . print_r($api_url_array,true));
        
        $client_secret = base64_encode(hash_hmac('sha256',$post_array['password'], 'secret', true));
        $http = new GuzzleHttp\Client;

        $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/login', [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => $post_array['email'],
                'client_secret' => $client_secret,
                'username' => $post_array['email'],
                'email' => $post_array['email'],
                'password' => $post_array['password'],
                'scope' => '',
                'services_url' => $get_wp_config_settings_array['services_url'],
                'logging_url' => $get_wp_config_settings_array['logging_url'],
            ],
            'http_errors' => false
        ] );

        $login_response = $response->getBody()->getContents();
        $login_response_array = json_decode((string) $login_response);
// error_log('$login_response 222: ' . print_r($login_response,true));
// error_log('$login_response_array: ' . print_r($login_response_array,true));

//         if (array_key_exists('error', $login_response_array)) {

//             $httpError = new GuzzleHttp\Client;
//             $errorResponse = $httpError->get( $api_url_array['full_api_url'] . '/errors', [
//             'query' => [
//                 'code' => 1001,
                    // 'services_url' => $api_url_array['services_url'],
                    // 'logging_url' => $api_url_array['logging_url'],
//                 ]
//             ] );

//             // Invalid Credentials ErrorCode:1002
// //            $login_response_array = AEZError::getError(1002);
//             $login_response = $errorResponse->getBody()->getContents();
//             $login_response_array = json_decode((string) $login_response);

//         }

        return json_decode($login_response);

    }

    
    
    /**
     * Common helper for .net v2 api call
     * @param       array  $data - request data array
     * @param       string $endpoint - end point
     * @param       string $calling_method - data passing method get or post
     * @return      array
     */

    public static function apiRequestAgent($request_data,$endpoint,$method = 'POST'){
        $get_wp_config_settings_array = self::GetWPConfigSettings();
        
        $http = new GuzzleHttp\Client;
        
        try {
            $req_arr = array('Data'=>$request_data,
                    'Source'=> $get_wp_config_settings_array['services_v2_source'] );
            
            $apiURL = $get_wp_config_settings_array['services_v2_url'];
            
            $lenEP = strlen("/");
            $lenURL = strlen("/"); 
            if((substr($apiURL, -$lenURL) !== "/") && (substr($apiURL, 0, $lenEP) !== "/"))
            {
                $endpoint = "/" . $endpoint;
            } 
        
            if($method == 'POST') {
                $response = $http->post($apiURL.$endpoint, 
                [
                    'body' => json_encode($req_arr),
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'API_KEY' => $get_wp_config_settings_array['services_v2_api_key'] 
                    ]
                ]);
            }                               
        } catch (Exception $e) {
            error_log($endpoint . ' - '. $method.' : '. print_r($e->getMessage(), true));
            echo json_encode('{error: "No locations found. Something went wrong. Please try your search another time."}');
        }

        $return_response = $response->getBody()->getContents();
        if(isset($return_response)){
            return json_decode($return_response, true);
        } else {
            return false;
        }
    }
    
      
    
    
    public static function GetWPConfigSettings(){        
        /** frontend php api v1 credentials **/ 
        $configArray['full_api_url'] = self::encryptDecrypt(RAC_FULL_API_URL,'dec');
        $configArray['services_url'] = self::encryptDecrypt(RAC_SERVICES_URL,'dec');
        $configArray['logging_url'] = self::encryptDecrypt(RAC_LOGGING_URL,'dec');
        
        
        /** .net v2 api credentials ****/
        $configArray['services_v2_url'] = self::encryptDecrypt(SERVICES_V2_URL,'dec');
        $configArray['services_v2_api_key'] = self::encryptDecrypt(SERVICES_V2_APIKEY,'dec');
        $configArray['services_v2_source'] = self::encryptDecrypt(SERVICES_V2_SOURCE,'dec');
                
        return $configArray;
    }

    

    
    
    /**
     * encrypt and decrypt for aez setting .net v2 credentials
     * @param       array  $string, $action
     * @return      string
     */
    
    public static function encryptDecrypt($string, $action = 'dec') {
    
        $secret_key = 'SQZc0bCfbiN4kxO5A32ypVLNKb7jBrQH';
        $secret_iv = 'OWfrUbLBwININzZf5yCnXXBgG5KznJe8';
        
        $output = false;
        $encrypt_method = "AES-256-CBC";
        $key = hash( 'sha256', $secret_key );
        $iv = substr( hash( 'sha256', $secret_iv ), 0, 16 );
        if( $action == 'enc' ) {
            //encrypt string
            $output = base64_encode( openssl_encrypt( $string, $encrypt_method, $key, 0, $iv ) );
        }
        else if( $action == 'dec' ){
            //decrypt string
            $output = openssl_decrypt( base64_decode( $string ), $encrypt_method, $key, 0, $iv );
        }
        return $output;
    }
}
