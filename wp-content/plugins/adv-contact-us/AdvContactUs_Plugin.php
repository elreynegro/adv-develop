<?php


include_once('AdvContactUs_LifeCycle.php');

class AdvContactUs_Plugin extends AdvContactUs_LifeCycle {

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
        return 'advantage-contact-us';
    }

    protected function getMainPluginFileName() {
        return 'adv-contact-us.php';
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

         // Location Policy
        add_action('wp_ajax_advLocationPolicy', array(&$this, 'ajax_advLocationPolicy_func'));
        add_action('wp_ajax_nopriv_advLocationPolicy', array(&$this, 'ajax_advLocationPolicy_func')); // optional

        // Contact Us
        add_action('wp_ajax_advContactUsCommunication', array(&$this, 'ajax_advContactUsCommunication_func'));
        add_action('wp_ajax_nopriv_advContactUsCommunication', array(&$this, 'ajax_advContactUsCommunication_func')); // optional

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
        include_once('AdvContactUs_LocationDropDownShortcode.php');
        $sc = new AdvContactUs_LocationDropDownShortcode();
        $sc->register( 'adv-contact-us-location-drop-down' );

        include_once('AdvContactUs_CommunicationFormShortcode.php');
        $sc = new AdvContactUs_CommunicationFormShortcode();
        $sc->register( 'aez-contact-us-communication-form' );

         include_once('AdvContactUs_HurricaneWarningShortcode.php');
        $sc = new AdvContactUs_HurricaneWarningShortcode();
        $sc->register( 'aez-hurricane-warning' );

        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

    }

    // Function that will 
    public function ajax_advLocationPolicy_func() {
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        header("Content-type: application/json");

        try {
            //api call
            $data['locationCode'] = $post_data['rental_location_id'];
            $endpoint = 'Location/GetPolicies';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);
        } catch (Exception $e) {
            echo json_encode('{error: "Something went wrong. Please try your search another time."}');
            die();
        }

        $html = "";
        
        // Loop through the array of policies and created our html
        if (isset($response_arrays['Status']) && $response_arrays['Status'] == "Success") {
            foreach ($response_arrays['Data'] as $key => $value) {
                $PolicyText = str_replace("\r\n", "", $value['PolicyText']);
                $PolicyText = str_replace("|br|", "<br>", $value['PolicyText']);
                $html .= "<div><b>".$value['Description']."</b><br>".$PolicyText."</div><br>";
            }
        } 

        if (isset($location_array['d']['BrandName']) && $location_array['d']['BrandName'] == 'Europcar') {
            $html .= '<div class="aez-helpful-links"><b>SUPPORT</b><br /><span>Please visit <a href="https://www.europcar.com" target="_blank">www.europcar.com</a> for location policy information.</span></div>';
        } else {
            $html .= '<div class="aez-helpful-links"><b>SUPPORT</b><br /><span>Call <a href="tel:1-800-777-5500">1-800-777-5500</a></span></div>';
        }

        // Send json back to the ajax on adv_location_policies.js
        echo json_encode($html);
        die();
    }

    public function ajax_advContactUsCommunication_func() {
        
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        $http = new GuzzleHttp\Client;
        
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        
        $location_array = AdvLocations_Helper::getLocation($post_data['rental_location_id']);

        $brand_name = '';
        
        if (isset($location_array['BrandName'])) 
        {
            $brand_name = $location_array['BrandName'];
           
        }

        try {
            
            $response = $http->post( $get_wp_config_settings_array['full_api_url'] . '/contactUs', [
                    'query' => [
                            'first_name' => $post_data['first_name'],
                            'last_name' => $post_data['last_name'],
                            'your_email' => $post_data['your_email'],
                            'rental_location_id' => $post_data['rental_location_id'],
                            'rental_location_text' => $post_data['rental_location_text'],
                            'your_message' => $post_data['your_message'],
                            'brand' => $brand_name,
                            'cs_send_to_email' => $this->api_url_array['cs_send_to_email']
                    ]
            ] );
        } catch (Exception $e) {
            
            echo json_encode('{error: "2 Something went wrong. Please try adding your comments another time."}' + $e);
            die();
        }
        
        $response_contents = $response->getBody()->getContents();

        if ($this->api_url_array['logging_flag'] == "Y") {
            // Send to log file
            $decode_response = json_decode($response_contents, true);
            $file = __FILE__;
            $function = __FUNCTION__;
            $line = __LINE__;
            $message = "Contact us form email sent by ".$post_data['first_name']. " ". $post_data['last_name']. ", email: ".$post_data['your_email'];
            $error_message = "";
            if (strtolower($decode_response['status']) == "error") {
                $error_message = $decode_response['error']['errorMessage'];
            }
            Adv_login_Helper::saveToLog($message, $error_message, $file, $function, $line);
        }

        echo json_encode($response_contents);
        die();
    }


}
