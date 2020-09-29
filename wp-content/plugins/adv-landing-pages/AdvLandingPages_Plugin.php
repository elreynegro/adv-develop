<?php


include_once('AdvLandingPages_LifeCycle.php');
include_once('Adv_Landingpage_Helper.php');

class AdvLandingPages_Plugin extends AdvLandingPages_LifeCycle {

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
        return 'adv-landing-pages';
    }

    protected function getMainPluginFileName() {
        return 'adv-landing-pages.php';
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

        add_action('wp_ajax_activeBookingLocations', array(&$this, 'ajax_activeBookingLocations_func'));
        add_action('wp_ajax_nopriv_activeBookingLocations', array(&$this, 'ajax_activeBookingLocations_func')); // optional

        add_action('wp_ajax_submitSurvey', array(&$this, 'ajax_submitSurvey_func'));
        add_action('wp_ajax_nopriv_submitSurvey', array(&$this, 'ajax_submitSurvey_func')); // optional   

        add_action('wp_ajax_saveCampaignEnrollment', array(&$this, 'ajax_saveCampaignEnrollment_func'));
        add_action('wp_ajax_nopriv_saveCampaignEnrollment', array(&$this, 'ajax_saveCampaignEnrollment_func')); // optional   
        
                
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


        // Find A Car World Wide
        include_once('AdvLandingPages_FindACarWorldWide_Shortcode.php');
        $sc = new AdvLandingPages_FindACarWorldWide_Shortcode();
        $sc->register('adv-find-a-car-world-wide');

        // Gay Travel Landing Page
        include_once('AdvLandingPages_GayTravel_Shortcode.php');
        $sc = new AdvLandingPages_GayTravel_Shortcode();
        $sc->register('adv-landing-pages-gaytravel');
       
        // Brooklyn Bowl Landing Page
        include_once('AdvLandingPages_BrooklynBowl_Shortcode.php');
        $sc = new AdvLandingPages_BrooklynBowl_Shortcode();
        $sc->register('adv-landing-pages-brooklyn-bowl');

        // Mountain Sports Landing Page
        include_once('AdvLandingPages_MountainSports_Shortcode.php');
        $sc = new AdvLandingPages_MountainSports_Shortcode();
        $sc->register('adv-landing-pages-mountain-sports');

        // Hawaiian Airlines Landing Page
        include_once('AdvLandingPages_HawaiianAirlines_Shortcode.php');
        $sc = new AdvLandingPages_HawaiianAirlines_Shortcode();
        $sc->register('adv-landing-pages-hawaiian-airlines');

        // Mark Travel Corporation Landing Page
        include_once('AdvLandingPages_MarkTravelCorp_Shortcode.php');
        $sc = new AdvLandingPages_MarkTravelCorp_Shortcode();
        $sc->register('adv-landing-pages-mark-travel-corp');

        // Azul Landing Page
        include_once('AdvLandingPages_AzulAirlines_Shortcode.php');
        $sc = new AdvLandingPages_AzulAirlines_Shortcode();
        $sc->register('adv-landing-pages-azul-airlines');

        // Rent A Car Momma
        include_once('AdvLandingPages_RentACarMomma_Shortcode.php');
        $sc = new AdvLandingPages_RentACarMomma_Shortcode();
        $sc->register('adv-landing-pages-rent-a-car-momma');

        // Augeo Loyalty Landing Page
        include_once('AdvLandingPages_AugeoLoyalty_Shortcode.php');
        $sc = new AdvLandingPages_AugeoLoyalty_Shortcode();
        $sc->register('adv-landing-pages-augeo-loyalty');

        // Customer Survey Landing Page
        include_once('AdvLandingPages_CustomerSurvey_Shortcode.php');
        $sc = new AdvLandingPages_CustomerSurvey_Shortcode();
        $sc->register('adv-landing-pages-customer-survey-page');

        // Partner Signup Landing Page
        include_once('AdvLandingPages_PartnerSignUp_Shortcode.php');
        $sc = new AdvLandingPages_PartnerSignUp_Shortcode();
        $sc->register('adv-landing-pages-partner-signup');

        // Expressway Pit Stop Award page
        include_once('AdvLandingPages_ExpresswayPitStopAward_Shortcode.php');
        $sc = new AdvLandingPages_ExpresswayPitStopAward_Shortcode();
        $sc->register('adv-expressway-pitstop-award');

        // Email Opt Out
        include_once('AdvLandingPages_EmailOptOut_Shortcode.php');
        $sc = new AdvLandingPages_EmailOptOut_Shortcode();
        $sc->register('adv-email-opt-out');

        // SMS Opt Out
        include_once('AdvLandingPages_SMSOptOut_Shortcode.php');
        $sc = new AdvLandingPages_SMSOptOut_Shortcode();
        $sc->register('adv-SMS-opt-out');

        // PODS PLUGIN
        include_once('AdvLandingPages_DefaultPodsTemplate.php');
        $sc = new AdvLandingPages_DefaultPodsTemplate();
        $sc->register('adv-default-pods-template');

        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

    }

    public function ajax_activeBookingLocations_func() {

        $active_booking_locations = $_SESSION["ActiveBookingLocations"];

        echo $active_booking_locations;
        
        die();

    }

    public function ajax_submitSurvey_func() {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
        
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $cs_service_url = $this->api_url_array['cs_api_url'];
        $survey_data = $post_data['survey_data'];
        $request_query = array('cs_service_url' => $cs_service_url,
                               'SurveyGuid' => $_SESSION['survey_guid'], 
                               'AnswerDateTime' =>date('m/d/Y h:i:s'),
                               'IPAddress' => $_SERVER['REMOTE_ADDR']
                               );
        
        $survey_answers = $post_data['survey_answers'];
        $answers = array();
        if(is_array($survey_answers)) {
            foreach($survey_answers as $key=> $row) {
                $answer = array('QuestionId'=> $key, 'Answer'=>'', 'AnswerOptionId' => '');
                if($row['qType'] == 1) { 
                    $answer['AnswerOptionId'] = $row['qVal'];
}
                if($row['qType'] == 2 || $row['qType'] == 3) { 
                    $answer['Answer'] = $row['qVal'];
                } 
                
                $answers[] = $answer;
            }
        }
        $request_query['SurveyAnswers'] =  $answers;

        $response_contents = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/submitSurvey', $request_query);
        
        echo $response_contents;
        exit;
        
    }

    
    public static function ajax_saveCampaignEnrollment_func() {
        if (isset($_SESSION['adv_login']->memberNumber) && $_SESSION['adv_login']->memberNumber !=="" ) {
            $member_number = $_SESSION['adv_login']->memberNumber;
        } else {
             echo json_encode(array('Status' => 'Failed', 'Error' => array('ErrorMessage' => 'You need to log in to register.')));
            die();
        }

        try {
            
            //api call
            $data['MemberNumber'] = $member_number;
            $data['CampaignID'] = '5';
            $data['BrandName'] = 'Advantage';
            $endpoint = 'Loyalty/SaveCampaignEnrollment';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);

        } catch (Exception $e) {

            echo json_encode(array('Status' => 'Failed', 'Error' => array('ErrorMessage' => 'Something went wrong. Please try to register another time.')));
            die();
        }

        echo json_encode($response_arrays);

        die();

    }
}
