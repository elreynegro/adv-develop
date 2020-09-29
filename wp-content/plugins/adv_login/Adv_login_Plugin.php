<?php

include_once('Adv_login_LifeCycle.php');
include_once('Adv_login_Helper.php');
include_once( $_SERVER["DOCUMENT_ROOT"] . '/wp-content/plugins/advantage-vehicles/AdvVehicles_Helper.php');

class Adv_login_Plugin extends Adv_login_LifeCycle {

    public $api_url_array;

    /**
     * See: http://plugin.michael-simpson.com/?page_id=31
     * @return array of option meta data.
     */
    public function getOptionMetaData() {
        //  http://plugin.michael-simpson.com/?page_id=31
        return array(
            //'_version' => array('Installed Version'), // Leave this one commented-out. Uncomment to test upgrades.
            'ATextInput' => array(__('Enter in some text', 'my-awesome-plugin')),
            'AmAwesome' => array(__('I like this awesome plugin', 'my-awesome-plugin'), 'false', 'true'),
            'CanDoSomething' => array(__('Which user role can do something', 'my-awesome-plugin'),
                                        'Administrator', 'Editor', 'Author', 'Contributor', 'Subscriber', 'Anyone')
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
        return 'ADV_Login';
    }

    protected function getMainPluginFileName() {
        return 'adv_login.php';
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
        // add_action('admin_menu', array(&$this, 'addSettingsSubMenuPage'));

        add_action('wp_ajax_advLogin', array(&$this, 'ajax_advLogin_func'));
        add_action('wp_ajax_nopriv_advLogin', array(&$this, 'ajax_advLogin_func')); // optional

        add_action('wp_ajax_advCreateUser', array(&$this, 'ajax_advCreateUser_func'));
        add_action('wp_ajax_nopriv_advCreateUser', array(&$this, 'ajax_advCreateUser_func')); // optional

        add_action('wp_ajax_advCreateUserpopup', array(&$this, 'ajax_advCreateUserpopup_func'));
        add_action('wp_ajax_nopriv_advCreateUserpopup', array(&$this, 'ajax_advCreateUserpopup_func')); // optional

        add_action('wp_ajax_advCreateBookFriendly', array(&$this, 'ajax_advCreateBookFriendly_func'));
        add_action('wp_ajax_nopriv_advCreateBookFriendly', array(&$this, 'ajax_advCreateBookFriendly_func')); // optional

        add_action('wp_ajax_advCreateCorporate', array(&$this, 'ajax_advCreateCorporate_func'));
        add_action('wp_ajax_nopriv_advCreateCorporate', array(&$this, 'ajax_advCreateCorporate_func')); // optional

        add_action('wp_ajax_advLogout', array(&$this, 'ajax_advLogout_func'));
        add_action('wp_ajax_nopriv_advLogout', array(&$this, 'ajax_advLogout_func')); // optional

        add_action('wp_ajax_advEditProfile', array(&$this, 'ajax_advEditProfile_func'));
        add_action('wp_ajax_nopriv_advEditProfile', array(&$this, 'ajax_advEditProfile_func')); // optional

        add_action('wp_ajax_advChangeProfilePassword', array(&$this, 'ajax_advChangeProfilePassword_func'));
        add_action('wp_ajax_nopriv_advChangeProfilePassword', array(&$this, 'ajax_advChangeProfilePassword_func')); // optional

        add_action('wp_ajax_advRequestResetPassword', array(&$this, 'ajax_advRequestResetPassword_func'));
        add_action('wp_ajax_nopriv_advRequestResetPassword', array(&$this, 'ajax_advRequestResetPassword_func')); // optional

        add_action('wp_ajax_advResetForgotPassword', array(&$this, 'ajax_advResetForgotPassword_func'));
        add_action('wp_ajax_nopriv_advResetForgotPassword', array(&$this, 'ajax_advResetForgotPassword_func')); // optional

        add_action('wp_ajax_advSubmitEmailForSpecialsDiscounts', array(&$this, 'ajax_advSubmitEmailForSpecialsDiscounts_func'));
        add_action('wp_ajax_nopriv_advSubmitEmailForSpecialsDiscounts', array(&$this, 'ajax_advSubmitEmailForSpecialsDiscounts_func')); // optional

        add_action('wp_ajax_saveSignUpEmail', array(&$this, 'ajax_saveSignUpEmail_func'));
        add_action('wp_ajax_nopriv_saveSignUpEmail', array(&$this, 'ajax_saveSignUpEmail_func')); // optional

        add_action('wp_ajax_getCarClasses', array(&$this, 'ajax_getCarClasses_func'));
        add_action('wp_ajax_nopriv_getCarClasses', array(&$this, 'ajax_getCarClasses_func')); // optional

        add_action('wp_ajax_advDeleteCard', array(&$this, 'ajax_advDeleteCard_func'));
        add_action('wp_ajax_nopriv_advDeleteCard', array(&$this, 'ajax_advDeleteCard_func')); // optional

        add_action('wp_ajax_advReferFriends', array(&$this, 'ajax_advReferFriends_func'));
        add_action('wp_ajax_nopriv_advReferFriends', array(&$this, 'ajax_advReferFriends_func')); // optional
        
        /**
         * Test function hooks for WP Ajax
         */
        // Example adding a script & style just for the options administration page
        // http://plugin.michael-simpson.com/?page_id=47
        //        if (strpos($_SERVER['REQUEST_URI'], $this->getSettingsSlug()) !== false) {
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
        include_once('Adv_login_Shortcode.php');
        $sc = new Adv_login_Shortcode();
        $sc->register('adv-login-box');

        include_once('Adv_login_popupShortcode.php');
        $sc = new Adv_login_popupShortcode();
        $sc->register('adv-login-popup');

        include_once('Adv_login_LogoutShortcode.php');
        $sc = new Adv_login_LogoutShortcode();
        $sc->register('adv-logout');

        //include_once('Adv_login_ProfileShortcode.php');
        //$sc = new Adv_login_ProfileShortcode();
        
        //profile page redirect to edit profile page
        include_once('Adv_login_EditProfileShortcode.php');
        $sc = new Adv_login_EditProfileShortcode();
        $sc->register('adv-profile');

        include_once('Adv_login_EditProfileShortcode.php');
        $sc = new Adv_login_EditProfileShortcode();
        $sc->register('adv-edit-profile');

        include_once('Adv_login_SignupAdvAwardsShortcode.php');
        $sc = new Adv_login_SignupAdvAwardsShortcode();
        $sc->register('adv-signup-advantage-awards');

        include_once('Adv_login_SignMeUpShortcode.php');
        $sc = new Adv_login_SignMeUpShortcode();
        $sc->register('adv-signup-popup');

        include_once('Adv_login_SignupCorpShortcode.php');
        $sc = new Adv_login_SignupCorpShortcode();
        $sc->register('adv-signup-corporate');

        include_once('Adv_login_ConfirmCorpShortcode.php');
        $sc = new Adv_login_ConfirmCorpShortcode();
        $sc->register('confirm-corporate-advantage');

        include_once('Adv_login_SignupBookFriendlyShortcode.php');
        $sc = new Adv_login_SignupBookFriendlyShortcode();
        $sc->register('adv-signup-book-friendly');

        include_once('Adv_login_ForgotPasswordRequestShortcode.php');
        $sc = new Adv_login_ForgotPasswordRequestShortcode();
        $sc->register('adv-forgot-password-request-form');

        include_once('Adv_login_ForgotPasswordShortcode.php');
        $sc = new Adv_login_ForgotPasswordShortcode();
        $sc->register('adv-forgot-password-form');

        include_once('Adv_login_PasswordChangeSuccessShortcode.php');
        $sc = new Adv_login_PasswordChangeSuccessShortcode();
        $sc->register('adv-change-password-success');
        
        include_once('Adv_login_ReferFriendsShortcode.php');
        $sc = new Adv_login_ReferFriendsShortcode();
        $sc->register('adv-refer-friends-form');         

        // Start session for all users once
// error_log('login 1 session start');
//         if (session_status() === PHP_SESSION_NONE){
// error_log('login 1 session start');
//             session_start(['cookie_lifetime' => 315360000]);
//         }

    }
     
    public function ajax_advLogin_func() {

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
// error_log('post_data: ' . print_r($post_data, true));
        if (empty($post_data["email"])) {

            $error = array('error' => 'empty_email', 'message' => 'email empty');
            echo json_encode($error);
            die();

        }

        if (empty($post_data["password"])) {

            $error = array('error' => 'empty_password', 'message' => 'password empty');
            echo json_encode($error);
            die();
        }

        if (!filter_var($post_data["email"], FILTER_VALIDATE_EMAIL)) {

            $error = array('error' => 'empty_invalid', 'message' => 'email not valid');
            echo json_encode($error);
            die();
        }

        /* This code added to reset renter age only for home page */
        $is_home = $post_data['is_home'];
        if($is_home) {
            unset($_SESSION['search']['age']);
        }
        /* This code added to reset renter age only for home page */

        // $post_data['username'] = $post_data['password'];
        // $post_data['email'] = $post_data['email'];
        $post_data['username'] = $post_data['email'];
        $post_data['grant_type'] = 'password';
        $post_data['client_id'] = $post_data['email'];
        $post_data['client_secret'] = $this->setClientSecret($post_data['password']);
        $post_data['scope'] = '';
// error_log('post_data: ' . print_r($post_data, true));
        $aez_oauth = new AEZ_Oauth2_Plugin();
        $login_status = $aez_oauth->login($post_data);
// error_log('  ***** ****** ******       login_status: ' . print_r($login_status, true));



        if (isset($login_status->error) ) {
// error_log('login error');
        } else {
			
			//To setup temporary session for homepage login
			if (isset($post_data['exp_home_login'])) {
				$_SESSION['exp_home_login_success'] = 1;
			}
            $this->saveUserInSession([
                'email' => $post_data['email'],
                'access_token' => $login_status->access_token,
                ]);

            $_SESSION['adv_login'] = $login_status;

            $full_user_array = Adv_login_Helper::getAdvFullUser();

            $_SESSION['adv_login']->user = $full_user_array;

        }
        echo json_encode($login_status);

        die();
    }

    public function ajax_advLogout_func() {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        if (!isset($_SESSION['adv_login']->access_token)) {
            echo json_encode(['error' => 'Already logged out']);
            die();
        }

        $http = new GuzzleHttp\Client;

        $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/logout-user/{' . $_SESSION['adv_login']->access_token . '}', [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => $_SESSION['adv_login']->user['email'],
                'username' => $_SESSION['adv_login']->user['email'],
                'scope' => '',
                'services_url' => $get_wp_config_settings_array['services_url'],
                'logging_url' => $get_wp_config_settings_array['logging_url'],
            ],
            'http_errors' => false
        ] );

        $login_response = $response->getBody()->getContents();
        $login_response_array = json_decode((string) $login_response);
// error_log('$login_response 2: ' . print_r($login_response,true));
// error_log('$login_response_array: ' . print_r($login_response_array,true));

        unset($_SESSION['adv_login']);

        // When logging out, make sure the customers awards session data is unset.
        if (isset($_SESSION['awards_header_response'])) {
            unset($_SESSION['awards_header_response']);
        }
        if (isset($_SESSION['available_awards'])) {
            unset($_SESSION['available_awards']);
        }
        if (isset($_SESSION['awards_history'])) {
            unset($_SESSION['awards_history']);
        }
        if (isset($_SESSION['reservation_history_response'])) {
            unset($_SESSION['reservation_history_response']);
        }
        if (isset($_SESSION['awards_flag'])) {
            unset($_SESSION['awards_flag']);
        }
        if (isset($_SESSION['search']['promo_codes'])) {
            unset($_SESSION['search']['promo_codes']);
        }

        echo json_encode($login_response);

        die();
    }

    public function setClientSecret($password) {
        return base64_encode(hash_hmac('sha256',$password, 'secret', true));
    }

    public function ajax_advCreateUser_func() {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $client_secret = $this->setClientSecret($post_data['password']);
        $http = new GuzzleHttp\Client;
        
        //Frequent flyer number validation
        if(trim($post_data['frequent_flyer_airline']) != '') {
            $fr_arr = array('airline'=>$post_data['frequent_flyer_airline'], 'frequentflyernumber' => $post_data['frequent_flyer_number']);
            $fr_res  = $this->validateFrequentFlyerNumber($fr_arr);
            $fr_res = json_decode($fr_res, true);
            if(isset($fr_res['Status']) && $fr_res['Status'] == 'ERROR') {
                $fr_response = array('status'=>'error', 'FrqFlyError'=> $fr_res['Status']);
                echo json_encode($fr_response); 
                exit;
            }
            
        }
        
        $post_data['EmailOptIn'] = ($post_data['EmailOptIn'] == 1)?'True':'False';
        $post_data['SMSOptIn'] = ($post_data['SMSOptIn'] == 1)?'True':'False';        
        
        $dob = date('Y-m-d', strtotime($post_data['dob']));
        
        // if($post_data['is_billing_same_defalut_address'] == 1) {
        //     $post_data['billing_street_address1'] = '';
        //     $post_data['billing_street_address2'] = '';
        //     $post_data['billing_postal_code'] = '';
        //     $post_data['billing_city'] = '';
        //     $post_data['billing_state'] = '';
        //     $post_data['billing_country'] = '';
        // }
        
        $post_data['is_billing_same_defalut_address'] = (bool)($post_data['is_billing_same_defalut_address'] == 1)?'True':'False';
        $post_data['additional_driver'] = (bool)($post_data['additional_driver'] == 1)?'ADDDR':'';
        $post_data['child_seat'] = (bool)($post_data['child_seat'] == 1)?'CHILDSEAT':'';
        $post_data['stroller'] = (bool)($post_data['stroller'] == 1)?'STRO':'';
        $post_data['hand_controls_right'] = (bool)($post_data['hand_controls_right'] == 1)?'HCR':'';
        $post_data['hand_controls_left'] = (bool)($post_data['hand_controls_left'] == 1)?'HCL':'';
        $post_data['gps'] = (bool)($post_data['gps'] == 1)?'GPS':'';
        $post_data['skirack'] = (bool)($post_data['skirack'] == 1)?'SKIRACK':'';
        
        
        
        $all_options = array($post_data['additional_driver'],$post_data['child_seat'],$post_data['stroller'],$post_data['hand_controls_right'],$post_data['hand_controls_left'],$post_data['gps'],$post_data['skirack']);
        $addtional_options = implode(",",array_filter($all_options));          

        $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/signUp', [
            'form_params' => [
                'first_name' => $post_data['first_name'],
                'last_name' => $post_data['last_name'],
                'email' => $post_data['email'],
                'username' => $post_data['email'],
                'password' => $post_data['password'],
                'grant_type' => 'password',
                'client_id' => $post_data['email'],
                'client_secret' => $client_secret,
                'scope' => '',
                'action'=>'signupweb',
                'MobileNumber' => $post_data['phone_number'],
                'DOB' => $dob,
                'EmailOptIn' => $post_data['EmailOptIn'],
                'SMSOptIn' => $post_data['SMSOptIn'],
                'FrequentFlyerAirline' => $post_data['frequent_flyer_airline'],
                'FrequentFlyerNumber' => $post_data['frequent_flyer_number'],
                'PreferredRentalLocationCode' => $post_data['preferred_rental_location'],
                'PreferredDropoffLocationCode' => $post_data['preferred_dropoff_location'],
                'CarSpecification' => $post_data['car_specification'],
                'addtional_options'=> $addtional_options,
                'PaymentPreferences' => $post_data['payment_preferences'],
                'AddressLine1' => $post_data['street_address1'],
                'AddressLine2' => $post_data['street_address2'],
                'PostalCode' => $post_data['postal_code'],
                'City' => $post_data['city'],
                'State' => $post_data['state'],
                'Country' => $post_data['country'],
                'IsDefaultBillingAddress' => $post_data['is_billing_same_defalut_address'],
                'BAddressLine1' => $post_data['billing_street_address1'],
                'BAddressLine2' => $post_data['billing_street_address2'],
                'BPostalCode' => $post_data['billing_postal_code'],
                'BCity' => $post_data['billing_city'],
                'BState' => $post_data['billing_state'],
                'BCountry' => $post_data['billing_country'],                
                'services_url' => $get_wp_config_settings_array['services_url'],
                'logging_url' => $get_wp_config_settings_array['logging_url']
            ],
            'http_errors' => false
        ] );

        $create_login_response = $response->getBody()->getContents();
        $create_login_response_object = json_decode($create_login_response);

// error_log('$create_login_response 2: ' . print_r($create_login_response,true));
// error_log('$create_login_response_array: ' . print_r($create_login_response_array,true));
// error_log('$create_login_response_array[access_token]: ' . print_r($create_login_response_array['access_token'],true));

        // if (! array_key_exists('error', $create_login_response_array)) {

        //     $this->saveUserInSession([
        //         'email' => $post_data['email'],
        //         'first_name' => $post_data['first_name'],
        //         'last_name' => $post_data['last_name'],
        //         'access_token' => $create_login_response_array['access_token'],
        //         ]);

        // }

        // echo json_encode($create_login_response);


        if (isset($create_login_response_object->error) ) {
// error_log('login error');
        } else {
            $this->saveUserInSession([
                'email' => $post_data['email'],
                'access_token' => $create_login_response_object->access_token,
                ]);

            $_SESSION['adv_login'] = $create_login_response_object;

            $full_user_array = Adv_login_Helper::getAdvFullUser();
            $memberNumber = $full_user_array['memberNumber'];
            
            //Add card details
            if(isset($post_data['cc_card_name'])) {

                foreach($post_data['cc_card_name'] as $key=> $card) {

                    if(trim($card['value']) != '') {

                        if($post_data['cc_card_number'][$key]['value'] != '' && $post_data['cc_expiry_month'][$key]['value'] != '' && $post_data['cc_expiry_year'][$key]['value'] != '') {
                            $cc_number = $post_data['cc_card_number'][$key]['value'];
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

                            $card_detail[] = array('card_name'=> trim($card['value']),  
                                                 'card_number'=> trim($post_data['card_enc_value'][$key]['value']),
                                                 'expiry_month'=> $post_data['cc_expiry_month'][$key]['value'],
                                                 'expiry_year'=> $post_data['cc_expiry_year'][$key]['value'],
                                                 'last_four'=> $last_four,
                                                 'card_type'=> $cc_type
                                                );
                        }

                    }
                }

                if(is_array($card_detail)) {
                    $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/saveLoyaltyProfileCC', [
                        'form_params' => [
                            'memberNumber' => $memberNumber,
                            'card_details' => $card_detail,
                            'services_url' => $get_wp_config_settings_array['services_url'],
                            'logging_url' => $get_wp_config_settings_array['logging_url']
                        ],
                        'http_errors' => false
                    ] );

                    $add_user_card = $response->getBody()->getContents();
                    $add_user_card_response = json_decode($add_user_card); 
                }
            }
            //Add card details 

            $_SESSION['adv_login']->user = $full_user_array;

        }
        echo json_encode($create_login_response_object);


        die();
    }

    public function ajax_advCreateUserpopup_func() {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $client_secret = $this->setClientSecret($post_data['password']);

        $http = new GuzzleHttp\Client;
        
        $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/signUpPopup', [
            'form_params' => [
                'first_name' => $post_data['first_name'],
                'last_name' => $post_data['last_name'],
                'email' => $post_data['email'],
                'password' => $post_data['password'],
                'confirm_password' => $post_data['password'],
                'dob' => $post_data['dob'],
                'MobileNumber' => $post_data['phone_number'],
                'services_url' => $get_wp_config_settings_array['services_url'],
                'logging_url' => $get_wp_config_settings_array['logging_url'],
                'EnrollSource' => $post_data['EnrollSource'],
                'EmailOptIn' => $post_data['EmailOptIn'],
                'SMSOptIn' => $post_data['SMSOptIn'],
            ],
            'http_errors' => false
        ] );

        $create_login_response = $response->getBody()->getContents();
        $create_login_response_object = json_decode($create_login_response);

        echo json_encode($create_login_response_object);

        die();
    }
    

    public function ajax_advCreateBookFriendly_func() {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $client_secret = $this->setClientSecret($post_data['password']);
        $http = new GuzzleHttp\Client;

        $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/signUpBookFriendly', [
            'form_params' => [
                'first_name' => $post_data['first_name'],
                'last_name' => $post_data['last_name'],
                'email' => $post_data['email'],
                'username' => $post_data['email'],
                'password' => $post_data['password'],
                'MobileNumber' => $post_data['MobileNumber'],
                'grant_type' => 'password',
                'client_id' => $post_data['email'],
                'client_secret' => $client_secret,
                'IATA' => $post_data['IATA'],
                'scope' => '',
                'services_url' =>$get_wp_config_settings_array['services_url'],
                'logging_url' => $get_wp_config_settings_array['logging_url'],
            ],
            'http_errors' => false
        ] );

        $create_login_response = $response->getBody()->getContents();
        $create_login_response_object = json_decode($create_login_response);
// error_log('$create_login_response 2: ' . print_r($create_login_response,true));
// error_log('$create_login_response_array: ' . print_r($create_login_response_array,true));
// error_log('$create_login_response_array[access_token]: ' . print_r($create_login_response_array['access_token'],true));

        // if (! array_key_exists('error', $create_login_response_array)) {

        //     $this->saveUserInSession([
        //         'email' => $post_data['email'],
        //         'first_name' => $post_data['first_name'],
        //         'last_name' => $post_data['last_name'],
        //         'access_token' => $create_login_response_array['access_token'],
        //         ]);

        // }

        // echo json_encode($create_login_response);

        if (isset($create_login_response_object->error) ) {
// error_log('login error');
        } else {
            $this->saveUserInSession([
                'email' => $post_data['email'],
                'access_token' => $create_login_response_object->access_token,
                ]);

            $_SESSION['adv_login'] = $create_login_response_object;

            $full_user_array = Adv_login_Helper::getAdvFullUser();

            $_SESSION['adv_login']->user = $full_user_array;

        }
        echo json_encode($create_login_response_object);

        die();
    }

    public function ajax_advCreateCorporate_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        // $client_secret = $this->setClientSecret($post_data['password']);
        $http = new GuzzleHttp\Client;

        $response = $http->post($get_wp_config_settings_array['full_api_url'] . '/signUpCorporate', [
            'form_params' => [
                'BizName' => $post_data['BizName'],
                'ContactFirstName' => $post_data['ContactFirstName'],
                'ContactLastName' => $post_data['ContactLastName'],
                'ContactEmail' => $post_data['ContactEmail'],
                'services_url' => $get_wp_config_settings_array['services_url'],
                'logging_url' => $get_wp_config_settings_array['logging_url'],
            ],
            'http_errors' => false
        ] );

        $create_corp_response = $response->getBody()->getContents();
        $create_corp_response_object = json_decode($create_corp_response);
// error_log('$create_corp_response 2: ' . print_r($create_corp_response,true));
// error_log('$create_corp_response_object: ' . print_r($create_corp_response_object,true));
// error_log('$create_corp_response_array[access_token]: ' . print_r($create_corp_response_array['access_token'],true));

        // if (! array_key_exists('error', $create_corp_response_array)) {

        //     $this->saveUserInSession([
        //         'email' => $post_data['email'],
        //         'first_name' => $post_data['first_name'],
        //         'last_name' => $post_data['last_name'],
        //         'access_token' => $create_corp_response_array['access_token'],
        //         ]);

        // }

        // echo json_encode($create_corp_response);


//         if (isset($create_corp_response_object->error) ) {
// // error_log('login error');
//         } else {
//             $this->saveUserInSession([
//                 'email' => $post_data['email'],
//                 'access_token' => $create_corp_response_object->access_token,
//                 ]);

//             $_SESSION['adv_login'] = $create_corp_response_object;

//             $full_user_array = Adv_login_Helper::getAdvFullUser();

//             $_SESSION['adv_login']->user = $full_user_array;

//         }
        echo json_encode($create_corp_response_object);

        die();

    }

    public function ajax_advEditProfile_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

// error_log('in edit profile post_data: ' . print_r($post_data, true));
        //if (! (isset($post_data['FirstName']) && isset($post_data['LastName']) && isset($post_data['MobileNumber']) && isset($post_data['AddressLine1']) && isset($post_data['City']) && isset($post_data['State']) && isset($post_data['PostalCode']) )) {
        if (! (isset($post_data['FirstName']) && isset($post_data['LastName']) && isset($post_data['MobileNumber']))) {
// error_log('something is not setin edit profile');

            echo json_encode(['error' => 'Information entered is not correct.']);
            die();
        }
// error_log(' above guzzle in edit profile');

        $userId = $_SESSION['adv_login']->user['id'];
        $dob = date('Y-m-d', strtotime($post_data['dob']));

        //Frequent flyer number validation
        if(trim($post_data['frequent_flyer_airline']) != '') {
            
            $fr_arr = array('airline'=>$post_data['frequent_flyer_airline'], 'frequentflyernumber' => $post_data['frequent_flyer_number']);
            $fr_res  = $this->validateFrequentFlyerNumber($fr_arr);
            $fr_res = json_decode($fr_res, true);
            if(isset($fr_res['Status']) && $fr_res['Status'] == 'ERROR') {
                $fr_response = array('status'=>'error', 'FrqFlyError'=> $fr_res['Status']);
                echo json_encode($fr_response); 
                exit;
            }
            
        }

        if($post_data['is_billing_same_defalut_address'] == 1) {
            $post_data['billing_street_address1'] = '';
            $post_data['billing_street_address2'] = '';
            $post_data['billing_postal_code'] = '';
            $post_data['billing_city'] = '';
            $post_data['billing_state'] = '';
            $post_data['billing_country'] = '';
        }

        $post_data['EmailOptIn'] = ($post_data['EmailOptIn'] == 1)?'True':'False';
        $post_data['SMSOptIn'] = ($post_data['SMSOptIn'] == 1)?'True':'False';
        
        $post_data['is_billing_same_defalut_address'] = (bool)($post_data['is_billing_same_defalut_address'] == 1)?'True':'False';
        $post_data['additional_driver'] = (bool)(trim($post_data['additional_driver']) == 1)?'ADDDR':'';
        $post_data['child_seat'] = (bool)($post_data['child_seat'] == 1)?'CHILDSEAT':'';
        $post_data['stroller'] = (bool)($post_data['stroller'] == 1)?'STRO':'';
        $post_data['hand_controls_right'] = (bool)($post_data['hand_controls_right'] == 1)?'HCR':'';
        $post_data['hand_controls_left'] = (bool)($post_data['hand_controls_left'] == 1)?'HCL':'';
        $post_data['gps'] = (bool)($post_data['gps'] == 1)?'GPS':'';
        $post_data['skirack'] = (bool)($post_data['skirack'] == 1)?'SKIRACK':'';
        
        
        
        $all_options = array($post_data['additional_driver'],$post_data['child_seat'],$post_data['stroller'],$post_data['hand_controls_right'],$post_data['hand_controls_left'],$post_data['gps'], $post_data['skirack']);
        $addtional_options = implode(",", array_filter($all_options));

        //Add card details
        if(isset($post_data['cc_card_name'])) {
            
            foreach($post_data['cc_card_name'] as $key=> $card) {

                if(trim($card['value']) != '') {

                    if($post_data['cc_card_number'][$key]['value'] != '' && $post_data['cc_expiry_month'][$key]['value'] != '' && $post_data['cc_expiry_year'][$key]['value'] != '') {
                        $cc_number = $post_data['cc_card_number'][$key]['value'];
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
                        
                        $card_detail[] = array('card_name'=> trim($card['value']),  
                                             'card_number'=> trim($post_data['card_enc_value'][$key]['value']),
                                             'expiry_month'=> $post_data['cc_expiry_month'][$key]['value'],
                                             'expiry_year'=> $post_data['cc_expiry_year'][$key]['value'],
                                             'last_four'=> $last_four,
                                             'card_type'=> $cc_type
                                            );
                    }

                }
            }
            
            if(is_array($card_detail)) {
                
                $addCardParams = array('memberNumber' => $_SESSION['adv_login']->memberNumber,
                        'card_details' => $card_detail,
                        'services_url' => $get_wp_config_settings_array['services_url'],
                        'logging_url' => $get_wp_config_settings_array['logging_url']);
                $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/saveLoyaltyProfileCC', $addCardParams);
                $add_user_card_response = json_decode($response, true); 

                if($add_user_card_response['status'] == 'error') {
                    $card_response = array('status'=>'error', 'error'=> 'Something went wrong, Some cards has not been added.');
                    echo json_encode($card_response); 
                    exit;                    
                }
                
            }
        }
        //Add card details   
        
        //Update card details
        if(isset($post_data['cc_card_update_id'])) {
            
            foreach($post_data['cc_card_update_id'] as $key=> $card) {
                
                if(trim($card['value']) != '') {

                    if($post_data['cc_card_update_month'][$key]['value'] != '' && $post_data['cc_card_update_year'][$key]['value'] != '') {
                      
                        $update_card_detail[] = array('card_token'=> trim($card['value']),  
                                             'expiry_month'=> $post_data['cc_card_update_month'][$key]['value'],
                                             'expiry_year'=> $post_data['cc_card_update_year'][$key]['value'],
                                            );
                    }

                }
            }
            
            if(is_array($update_card_detail)) {
                
                $updateCardFormParms  = [
                    'card_details' => $update_card_detail
                ];
                $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url']  . '/updateLoyaltyProfileCC', $updateCardFormParms);

            }            
        }
        //Update card details
        
        $guzzleFormParms  = [
            'memberNumber' => $post_data['memberNumber'],
            'FirstName' => $post_data['FirstName'],
            'LastName' => $post_data['LastName'],
            'MobileNumber' => $post_data['MobileNumber'],
            'AddressLine1' => $post_data['AddressLine1'],
            'AddressLine2' => $post_data['AddressLine2'],
            'City' => $post_data['City'],
            'State' => $post_data['State'],
            'PostalCode' => $post_data['PostalCode'],
            'EmailOptIn' => $post_data['EmailOptIn'],
            'SMSOptIn' => $post_data['SMSOptIn'],
            'userId' => $userId,
            'DOB' => $dob,
            'Country' => $post_data['Country'],
            'FrequentFlyerAirline' => $post_data['frequent_flyer_airline'],
            'FrequentFlyerNumber' => $post_data['frequent_flyer_number'],
            'PreferredRentalLocationCode' => $post_data['preferred_rental_location'],
            'PreferredDropoffLocationCode' => $post_data['preferred_dropoff_location'],
            'CarSpecification' => $post_data['car_specification'],
            'AdditionalOption'=> $addtional_options,
            'PaymentPreferences' => $post_data['payment_preferences'],
            'IsDefaultBillingAddress' => $post_data['is_billing_same_defalut_address'],
            'BAddressLine1' => $post_data['billing_street_address1'],
            'BAddressLine2' => $post_data['billing_street_address2'],
            'BPostalCode' => $post_data['billing_postal_code'],
            'BCity' => $post_data['billing_city'],
            'BState' => $post_data['billing_state'],
            'BCountry' => $post_data['billing_country']
        ];

        $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/saveLoyaltyProfile', $guzzleFormParms);
        
        $response_array = json_decode($response, true);
        
        $just_profile_array = $response_array['d'];
        if (array_key_exists('memberNumber', $just_profile_array)) {
            $_SESSION['loyalty_member_profile_refresh_flag'] = 1;
            echo json_encode(['success' => 'Your profile has been updated']);
        } else {
            echo json_encode(['error' => 'An error occured while update your profile. Please check your data.']);
        }

        // After editing the profile, we need to update the user session with fresh data.
        $full_user_array = Adv_login_Helper::getAdvFullUser('yes');

        $_SESSION['adv_login']->user = $full_user_array;

        die();

    }

    public function ajax_advChangeProfilePassword_func() {

        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $http = new GuzzleHttp\Client;
        try {

            $response = $http->post($get_wp_config_settings_array['full_api_url']  . '/updatePassword/' . $_SESSION['adv_login']->access_token, [
                'form_params' => [
                    'email' => $post_data['email'],
                    'current_password' => $post_data['current_password'],
                    'new_password1' => $post_data['new_password1'],
                    'new_password2' => $post_data['new_password2'],
                    'base_url' => get_home_url(),
                    'services_url' => $get_wp_config_settings_array['services_url'],
                    'logging_url' => $get_wp_config_settings_array['logging_url'],
               ],
                'http_errors' => false,
//                'headers' => ['Content-type' => 'application/json',],
            ] );

        } catch (Exception $e) {

// error_log('bad deal 222: ' . print_r($e->getMessage(), true));
            echo json_encode('{error: "Something went wrong. Please try your search another time."}');
            die();            
        }
// error_log("After Call");
        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);
// Adv_login_Helper::err_log($response_arrays, __FUNCTION__, __LINE__);

        // if (array_key_exists('error', $response_arrays)) {
            
        // }

        echo json_encode($response_arrays);

        // echo json_encode(['success' => 'Password change successfully']);
        die();

    }

    public function ajax_advRequestResetPassword_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

            $guzzleFormParms  = [
                'email' => $post_data['email'],
                'base_url' => get_home_url(),
            ];

        $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/forgetPassword', $guzzleFormParms);

        if ($this->api_url_array['logging_flag'] == "Y") {
            $decode_response = json_decode($response, true);
            $file = __FILE__;
            $function = __FUNCTION__;
            $line = __LINE__;
            $message = "Request to receive password reset email by ".$post_data['email'];
            $error_message = "";
            if (strtolower($decode_response['status']) == "error") {
                $error_message = $decode_response['error']['errorMessage'];
            }
            Adv_login_Helper::saveToLog($message, $error_message, $file, $function, $line);
        }

        echo json_encode($response);
        die();
    }


    public function ajax_advResetForgotPassword_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

            $guzzleFormParms  = [
                'username' => $post_data['email'],
                'password' => $post_data['password'],
                'grant_type' => 'password',
                'client_id' => $post_data['email'],
                'client_secret' => $this->setClientSecret($post_data['password']),
                'scope' => '',
                'email' => $post_data['email'],
                'token' => $post_data['password_token'],
                'base_url' => get_home_url(),
            ];

        $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/resetForgotPassword', $guzzleFormParms);

        if ($this->api_url_array['logging_flag'] == "Y") {
            // Send to log file
            $decode_response = json_decode($response, true);

            $file = __FILE__;
            $function = __FUNCTION__;
            $line = __LINE__;
            $message = "Reset password link clicked on and reset password submitted by : ".$post_data['email'];
            $error_message = "";
            if (isset($decode_response['error'])) {
                $error_message = $decode_response['error'];
            }
            Adv_login_Helper::saveToLog($message, $error_message, $file, $function, $line);
        }

        echo json_encode($response);
        die();
    }


    public function saveUserInSession($user_array) {

        // login_cookie($user_array['access_token']);

        // $_SESSION['user']['email'] = $user_array['email'];
        // $_SESSION['user']['access_token'] = $user_array['access_token'];

        // if (isset($user_array['first_name'])) {
        //     $_SESSION['user']['first_name'] = $user_array['first_name'];
        //     $_SESSION['user']['last_name'] = $user_array['last_name'];            
        // } else {
        //     $new_user_array = Adv_login_Helper::getAdvUser($user_array['access_token']);
        //     $_SESSION['user']['first_name'] = $new_user_array['first_name'];
        //     $_SESSION['user']['last_name'] = $new_user_array['last_name'];            
        // }

    }
    
    public function removeUserFromSession() {

        // unset($_SESSION['user']);

    }

    public function ajax_advSubmitEmailForSpecialsDiscounts_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $guzzleFormParms  = [
            'sd_email' => $post_data['email'],
        ];

        $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/saveEmailDeals', $guzzleFormParms);

        echo json_encode($response);
        die();
    }

    public function ajax_saveSignUpEmail_func() {

        $email_popup_cookie_name = "email_entered";
        $email_popup_cookie_value = "true";
        setrawcookie($email_popup_cookie_name, $email_popup_cookie_value, time()+3600 * 24, "/");
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $brand_pieces = explode('.', $_SERVER['HTTP_HOST']);

        if (isset($brand_pieces[1]) && $brand_pieces[1] == 'advantage') {
            $type = 'advantage_email_signup';
        } elseif (isset($brand_pieces[1]) && $brand_pieces[1] == 'e-zrentacar') {
            $type = 'ez_email_signup';
        } else {
            return ['status' => 'error', 'msg'=> 'Brand not sent.'];
            die;
        }

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        $guzzleFormParms  = [
            'email' => $post_data['sign_up_email'],
            'type' => $type,
        ];

        $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/saveSignUpEmails', $guzzleFormParms);

        $_SESSION['email_signup'] = $brand_pieces[1];

        echo json_encode($response);

        die();
    }
    
    public function ajax_getCarClasses_func() {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        
        $rental_location_id = $post_data['rental_location_id'];
       
        $location_array = AdvLocations_Helper::getLocation($rental_location_id);
     
        if ($location_array['Country'] == 'US') {
            $vehicle_data = AdvVehicles_Helper::getVehicles($rental_location_id);
        } else {
          
            $vehicle_data = AdvVehicles_Helper::getIntlVehicles($rental_location_id);
        }
      
        
        if(isset($vehicle_data['RateProduct'])) {
         
            echo json_encode($vehicle_data['RateProduct']);
            exit;
        }
           
        $response = array('status'=>'error');
        echo  json_encode($response);
        die();
    }    
    
    public function validateFrequentFlyerNumber($data) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $request_query = array('airline' => $data['airline'],
                               'frequentflyernumber' => $data['frequentflyernumber']);

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url']  . '/validateFrequentFlyerNumber', $request_query);

        $response_arrays = json_decode($response_contents, true);

        return json_encode($response_arrays);
    }
    
    public function ajax_advDeleteCard_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        
        $guzzleFormParms  = [
            'CardTokenID' => $post_data['CardTokenID'],
        ];

        echo $response = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url']  . '/deleteLoyaltyProfileCC', $guzzleFormParms);
        
        die();

    }
    public function ajax_advReferFriends_func() {        
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        
        $emails = $post_data['emails'];
        $emails = array_filter($emails);

        //Check for valid email formatEmail validation
        $err_flag = 0;
        $a = 0;
        foreach($emails as $email) {
            if(!(filter_var($email, FILTER_VALIDATE_EMAIL))) {
                $err_flag = 1;
            }
        }
        
        if(count($emails) ==0 || $err_flag == 1) {
            $arr_response = array('status'=> 'error', 'email_err' => "1");
            echo json_encode($arr_response);
            exit;
        }
        $email_list = implode(',', $emails);     
        

        try {

             //api call
             $data['EmailList'] = $email_list;
             $data['ReferralId'] = $post_data['ReferralId'];
             $data['BrandName'] = 'Advantage';
             $endpoint = 'Loyalty/SaveLoyaltyReferrals';
             $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);
 
        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong getting member awards history. Please try again at another time."}');
        }

        if($response_arrays['Status'] == 'Success') {
            $data_count = count($response_arrays['Data']);
            $fcount = 0;
            $message_f = '';
            $message_s = '';
            $fail_cnt = 0;
            $success_cnt = 0;
            foreach($response_arrays['Data'] as $data) {
                if($data['Status'] == 'Failed') {
                    $fcount++;
                    $message_f .= '<div>'.$data['Email'].' cannot be referred</div>';
                    $fail_cnt = 1;
                }
                else if($data['Status'] == 'Success') {
                    //$message_s .= '<div>'.$data['Email'].': '.$data['Result'] .'</div>';
                    $success_cnt = 1;
                }
            }
            if($data_count == $fcount) {
                $arr_response = array('status'=> 'error', 'error_message' => $message_f);
            }
            else if($fail_cnt == 1 && $success_cnt == 1) {
                 $arr_response = array('status'=> 'success', 'error_message' => $message_f, 'success_message' => $message_s);
            }
            else if($fail_cnt == 0) {
                $arr_response = array('status'=> 'success', 'error_message' => '', 'success_message' => 'Successfully added the member referral');
             
            }
            
            echo json_encode($arr_response);
            exit;               
        }
        
        

        $arr_response = array('status'=> 'error', 'error_message' => "Sorry an error has occurred. Please try again later sometime.");
        echo json_encode($arr_response);
        exit;                
       
    }     
}
