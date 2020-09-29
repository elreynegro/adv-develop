<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_ProfileShortcode extends Adv_login_ShortCodeScriptLoader {

	// public $login_box_html;
    static $addedAlready = false;
    public $aez_user;
    public $profile_data;
    public $profile_html;
    public $api_url_array;

 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('adv_login', plugins_url('js/adv_login.js', __FILE__), array('jquery', 'main', 'select2'), '1.0', true);
 
            wp_localize_script( 'adv_login', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {

    $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

    $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

// Adv_login_Helper::err_log($post_data, __FUNCTION__, __LINE__);


    if (isset($post_data['profile_form'])) {
// Adv_login_Helper::err_log('here1', __FUNCTION__, __LINE__);

        if ($post_data['profile_form'] == 'edit_profile') {
// Adv_login_Helper::err_log('here2', __FUNCTION__, __LINE__);
            $profile_sso = $this->save_profile();
        }

        if ($post_data['profile_form'] == 'change_password') {
// Adv_login_Helper::err_log('here2', __FUNCTION__, __LINE__);
            // $profile_sso = $this->change_password();
        }


    }

        $this->profile_data = Adv_login_Helper::getAdvFullUser();
// error_log('  Adv_login_ProfileShortcode  $this->profile_data: ' . print_r($this->profile_data, true));

        if (strlen($this->profile_data['AddressLine1'] . $this->profile_data['City'] . $this->profile_data['City']  . $this->profile_data['State'] . $this->profile_data['PostalCode']) == 0 ) {
            $display_address = 'Click "Edit Profile" to add your information';
        } else {
            $display_address = $this->profile_data['AddressLine1'] ;
            if (strlen($this->profile_data['AddressLine2']) > 0) {
                $display_address .= '<br>' . $this->profile_data['AddressLine2'];
            }
            $display_address .= '<br>' . $this->profile_data['City'] . ', '  . $this->profile_data['State'] . ' ' . $this->profile_data['PostalCode'];
        }

        $display_phone = '<p></p>';
        if (strlen($this->profile_data['MobileNumber']) > 0) {
            $display_phone = '<p class="aez-info-text aez-phone-info">' . $this->profile_data['MobileNumber'] . '</p>';
        }
        $this->profile_html = '<div id="changed_password" data-password_chage="<?php echo $password_changed; ?>" data-password_changed="<?php echo $password_changed; ?>"></div>
        <div id="primary"><div class="aez-find-a-car-dropdown is-open">
            <h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>';
        $this->profile_html .= Adv_login_Helper::find_a_car_form();
        $this->profile_html .= '</div>

        <div class="aez-advantage-awards-banner">
            <div class="aez-awards-img">
                <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway logo">
            </div>
        </div>

        <div class="aez-view-awards">
            <p>Click the button below to view or redeem existing Advantage Expressway.</p>
        ';
            $this->profile_html .= '  
                <form action="' . $api_url_array['pursuade_url'] . '/sso.php" method="post">
                    <input type="hidden" name="membernumber" value="' . (isset($this->profile_data['loyalty_membernumber']) ? $this->profile_data['loyalty_membernumber'] : '') . '">
                    <input type="hidden" name="id" value="' . (isset($this->profile_data['loyalty_id']) ? $this->profile_data['loyalty_id'] : '') . '">
                    <input type="hidden" name="hash" value="' . (isset($this->profile_data['loyalty_hash']) ? $this->profile_data['loyalty_hash'] : '') . '">
                    <input style="background-color: transparent; font-weight: 400; font-size: 1em;" type="submit" value="Advantage Expressway">
                    <button class="aez-btn aez-btn--filled-green profile-view-awards">View Your Expressway</button>
                </form>';

            $this->profile_html .= '
            </div>

            <div class="aez-info-block-container aez-profile-container aez-profile-display-container">
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Member Profile:</h4>
                        <h5 class="aez-profile-name">' . $this->profile_data['FirstName'] . ' ' . $this->profile_data['LastName'] . '</h5>
                        <p class="aez-info-text aez-email-info">' . $this->profile_data['email'] . '</p>
                        ' . $display_phone . '
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Mailing Address:</h4>
                        <p class="aez-info-text">' . $display_address . '</p>
                    </div>
                </div>
                <a href="/edit-profile"><button class="aez-btn aez-btn--outline-blue">Edit Profile</button></a>
            </div> <!-- end aez-info-block-container -->
            </div> <!-- end primary -->
            ';

        return $this->profile_html;
//        header("Location: " . $_POST['referal_url']);
 	}

    public function save_profile() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $http = new GuzzleHttp\Client;
        try {

            $response = $http->post($get_wp_config_settings_array['full_api_url']  . '/saveLoyaltyProfile', [
                'form_params' => [
                    'memberNumber' => $post_data['memberNumber'],
                    'FirstName' => $post_data['first_name'],
                    'LastName' => $post_data['last_name'],
                    'MobileNumber' => $post_data['phone'],
                    'AddressLine1' => $post_data['address1'],
                    'AddressLine2' => $post_data['address2'],
                    'PostalCode' => $post_data['zipCode'],
                    'City' => $post_data['city'],
                    'State' => $post_data['state'],
                    'EmailOptIn' => $post_data['EmailOptIn'],
                    'SMSOptIn' => $post_data['SMSOptIn'],
                    'services_url' => $get_wp_config_settings_array['services_url'] ,
                    'logging_url' => $get_wp_config_settings_array['logging_url'] ,
                ],
                'http_errors' => false,
            ] );

        } catch (Exception $e) {


            echo json_encode('{error: "Something went wrong. Please try your search another time."}');
            die();            
        }

        $response_contents = $response->getBody()->getContents();
        $response_arrays = json_decode($response_contents, true);

        return $response_arrays;
    }

}