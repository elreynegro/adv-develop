<?php

include_once('AdvRez_LifeCycle.php');
include_once('AdvRez_TSD_Reservations.php');
include_once('AdvRez_ReservationFlow.php');
include_once('AdvRez_Flow_Storage.php');
require_once('AdvRez_Helper.php');
require_once( $_SERVER["DOCUMENT_ROOT"] . '/vendor/autoload.php' );

class AdvRez_Plugin extends AdvRez_LifeCycle {

    public $api_url_array;

    /**
     * See: http://plugin.michael-simpson.com/?page_id=31
     * @return array of option meta data.
     */
    public function getOptionMetaData() {
        return array(
            'reservation_timeout' => array(__('Enter reservation flow timeout in number of seconds ', 'aez_api')),
        );
    }

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
        return 'Advantage Reservations';
    }

    protected function getMainPluginFileName() {
        return 'advantage-reservations.php';
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
     * Drop plugin-created tables on uninstall.F
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


        // Get API Url
        add_action('wp_ajax_advGetApiUrl', array(&$this, 'ajax_advGetApiUrl_func'));
        add_action('wp_ajax_nopriv_advGetApiUrl', array(&$this, 'ajax_advGetApiUrl_func')); // optional

        // Get Loyalty Url
        add_action('wp_ajax_advGetLoyaltyUrl', array(&$this, 'ajax_advGetLoyaltyUrl_func'));
        add_action('wp_ajax_nopriv_advGetLoyaltyUrl', array(&$this, 'ajax_advGetLoyaltyUrl_func')); // optional

        // Reservation Flow Search to Choose
        add_action('wp_ajax_advRezChoose', array(&$this, 'ajax_advRezChoose_func'));
        add_action('wp_ajax_nopriv_advRezChoose', array(&$this, 'ajax_advRezChoose_func')); // optional

        // Reservation Flow Search to Choose
        add_action('wp_ajax_advGetEnhanceChoices', array(&$this, 'ajax_advGetEnhanceChoices_func'));
        add_action('wp_ajax_nopriv_advGetEnhanceChoices', array(&$this, 'ajax_advGetEnhanceChoices_func')); // optional

        // Reservation Flow Choose to Enhance
        add_action('wp_ajax_advRezEnhance', array(&$this, 'ajax_advRezEnhance_func'));
        add_action('wp_ajax_nopriv_advRezEnhance', array(&$this, 'ajax_advRezEnhance_func')); // optional

        // Reservation Flow Enhance to Reserve
        add_action('wp_ajax_advRezReserve', array(&$this, 'ajax_advRezReserve_func'));
        add_action('wp_ajax_nopriv_advRezReserve', array(&$this, 'ajax_advRezReserve_func')); // optional 
        
        // Ajax load reserve page
        add_action('wp_ajax_advRezPromoCheck', array(&$this, 'ajax_advRezPromoCheck_func'));
        add_action('wp_ajax_nopriv_advRezPromoCheck', array(&$this, 'ajax_advRezPromoCheck_func')); // optional 

        // Reservation Flow Reserve to Confirm
        add_action('wp_ajax_advConfirm', array(&$this, 'ajax_advConfirm_func'));
        add_action('wp_ajax_nopriv_advConfirm', array(&$this, 'ajax_advConfirm_func')); // optional 

        // Reservation Flow Confirm to Complete
        add_action('wp_ajax_advComplete', array(&$this, 'ajax_advComplete_func'));
        add_action('wp_ajax_nopriv_advComplete', array(&$this, 'ajax_advComplete_func')); // optional 

        // Reservation View and Cancle -- set rez_task to endpoint viewReservation or cancelReservation
        add_action('wp_ajax_advViewAndCancelRez', array(&$this, 'ajax_advViewAndCancelRez_func'));
        add_action('wp_ajax_nopriv_advViewAndCancelRez', array(&$this, 'ajax_advViewAndCancelRez_func')); // optional 

        // Reservation & Confirm Policies
        add_action('wp_ajax_advReserveConfirmPolicy', array(&$this, 'ajax_advReserveConfirmPolicy_func'));
        add_action('wp_ajax_nopriv_advReserveConfirmPolicy', array(&$this, 'ajax_advReserveConfirmPolicy_func')); // optional 

        // Reservation Cancel -- set rez_task to endpoint cancelReservation
        add_action('wp_ajax_advCancelRez', array(&$this, 'ajax_advCancelRez_func'));
        add_action('wp_ajax_nopriv_advCancelRez', array(&$this, 'ajax_advCancelRez_func')); // optional 

        // Reservation Get Frequent Flyer Programs
        add_action('wp_ajax_validateFrequentFlyerNumber', array(&$this, 'ajax_validateFrequentFlyerNumber_func'));
        add_action('wp_ajax_nopriv_validateFrequentFlyerNumber', array(&$this, 'ajax_validateFrequentFlyerNumber_func')); // optional

          // Reservation Get Frequent Flyer Programs
        add_action('wp_ajax_advAbandonment', array(&$this, 'ajax_advAbandonment_func'));
        add_action('wp_ajax_nopriv_advAbandonment', array(&$this, 'ajax_advAbandonment_func')); // optional

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
        include_once('AdvRez_Shortcode.php');
        $sc = new AdvRez_Shortcode();
        $sc->register( 'adv-rez-box' );
        // $sc->register('adv-rez-listing');

        // Choose Shortcdde
        include_once('AdvRez_Choose_Shortcode.php');
        $sc = new AdvRez_Choose_Shortcode();
        $sc->register('adv-rez-vehicle-list');

        // Enhance Shortcdde
        include_once('AdvRez_Enhance_Shortcode.php');
        $sc = new AdvRez_Enhance_Shortcode();
        $sc->register('show-enhance-options');

        // Reserve Shortcdde
        include_once('AdvRez_ReserveShortcode.php');
        $sc = new AdvRez_ReserveShortcode();
        $sc->register('adv-reserve-form');

        // Reserve Shortcdde
        include_once('AdvRez_ConfirmShortcode.php');
        $sc = new AdvRez_ConfirmShortcode();
        $sc->register('adv-confirm-form');

        // Reserve Shortcdde
        include_once('AdvRez_CompleteShortcode.php');
        $sc = new AdvRez_CompleteShortcode();
        $sc->register('adv-complete');

        // Modal Form Shortcode
        // Should be registered last to make sure that necessary libraries are loaded
        // previous to any scripts attached to this form
        include_once('AdvRez_ModalFormShortcode.php'); 
        $sc = new AdvRez_ModalFormShortcode();
        $sc->register('adv-modal-form');

        // Modal Cancel Shortcode
        // Should be registered last to make sure that necessary libraries are loaded
        // previous to any scripts attached to this form
        include_once('AdvRez_ModalCancelShortcode.php'); 
        $sc = new AdvRez_ModalCancelShortcode();
        $sc->register('adv-modal-cancel');

        // My Reservation Shortcode
        include_once('AdvRez_MyReservationsShortcode.php');
        $sc = new AdvRez_MyReservationsShortcode();
        $sc->register( 'adv-my-reservation-form' );

        // View My Reservation Shortcode
        include_once('AdvRez_ViewMyReservationsShortcode.php');
        $sc = new AdvRez_ViewMyReservationsShortcode();
        $sc->register( 'adv-view-my-reservation' );

        // Cancel Reservation Shortcode
        include_once('AdvRez_CancelReservationShortcode.php');
        $sc = new AdvRez_CancelReservationShortcode();
        $sc->register( 'adv-cancel-my-reservation' );

        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

        // Kayak check and display
        $this->checkForKayak();

    }

    public function ajax_advGetApiUrl_func() {
        $url_array = AEZ_Oauth2_Plugin::getApiUrl();
        echo json_encode($url_array);
        // echo $url_array['full_api_url'];
        die();
    }

    public function ajax_advGetLoyaltyUrl_func() {
        $url_array = AEZ_Oauth2_Plugin::getApiUrl();
        echo $url_array['pursuade_url'];
        //echo "/awards";
        die();
    }

    public function ajax_advRezChoose_func() {

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $abandonment_promocode = strtolower(trim($api_url_array['abandonment_promocode']));

        // We check if the from_modal isset since this is from the modal popup. If the abandonment promocode was set, then 
        // we keep it set since we can use it. It wasn't manually added on the home page.
        if (!isset($post_data['from_modal'])) {
            if ($api_url_array['abandonment_promocode'] !== "" && isset($post_data['promo_codes']) && count($post_data['promo_codes']) > 0) {

                $promo_codes = array_map(function($x){
                    return strtolower(trim($x));
                }, $post_data['promo_codes']);

                if (in_array($abandonment_promocode, $promo_codes)) {
                    $ret_array = array('Status' => 'Failed', 'Msg' => 'Promo Code '.$api_url_array['abandonment_promocode'].' can not be used.');

                    echo json_encode($ret_array);

                    die();
                }
            }
        }

        $ReservationFlow = new AdvRez_ReservationFlow();
        $rezViewDisplay = $ReservationFlow->processChoosePage();

        // $this->();

        $ret_array = array('content' => 'success');

        echo json_encode($ret_array);

        die();

    }

   /**
     * Process data from AJAX for Reservation Form
     */
    public function ajax_advGetEnhanceChoices_func() {

        $ReservationFlow = new AdvRez_ReservationFlow();
        $enhanceChoices = $ReservationFlow->getEnhanceChoices();
        echo json_encode($enhanceChoices);
        die();
    }

   /**
     * Process data from AJAX for Reservation Form
     */
    public function ajax_advRezEnhance_func() {

        $ReservationFlow = new AdvRez_ReservationFlow();
        $ehanceDisplay = $ReservationFlow->processEnhancePage();
        echo json_encode($ehanceDisplay);
        die();
    }


    /**
     * Process data from AJAX for Reservation Form
     */
    public function ajax_advRezReserve_func() {
        $ReservationFlow = new AdvRez_ReservationFlow();
        $reserveDisplay = $ReservationFlow->processReservePage();
        echo json_encode($reserveDisplay);
        die();
    }
    
    
    /**
     * Process data from AJAX for Reservation Form
     */
    public function ajax_advRezPromoCheck_func() {

        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        // Set the abandonment_promocode session to the promo code setting in wordpress
        if (isset($clean_post_data['abandonment']) && $clean_post_data['abandonment'] == "yes") {
            $_SESSION['abandonment']['abandonment_promocode'] = $api_url_array['abandonment_promocode'];
        }

        $ReservationFlow = new AdvRez_ReservationFlow();
        $valideatePromos = $ReservationFlow->valideatePromos();
        
        echo json_encode($valideatePromos);
        die();
    }
    

    /**
     * Process data from AJAX for Confirmation Form
     */
    public function ajax_advConfirm_func_old() {
        $ReservationFlow = new AdvRez_ReservationFlow();
        $confirmDisplay = $ReservationFlow->processConfirmPage();
        echo json_encode($confirmDisplay);
        die();
    }

    /**
     * Process data from AJAX for Complete final step
     */
    public function ajax_advComplete_func_old() {
        $ReservationFlow = new AdvRez_ReservationFlow();
        $completeDisplay = $ReservationFlow->processCompletePage();
        echo json_encode(array('content' => $completeDisplay));
        die();
    }

    /**
     * Process data from AJAX for Complete final step
     */
    public function ajax_advComplete_func() {
        $ReservationFlow = new AdvRez_ReservationFlow();
//        $completeDisplay = $ReservationFlow->processReserveConfirmPage();
        $completeDisplay = $ReservationFlow->processConfirmCompletePage();
        echo json_encode(array('content' => $completeDisplay));
        die();
    }
    

    /**
     * Process data from AJAX for View and Cancel Reservation
     */

    public function ajax_advViewAndCancelRez_func() {
        $ReservationFlow = new AdvRez_ReservationFlow();
        $rezViewDisplay = $ReservationFlow->processRezViewAndCancelPage();
        echo json_encode(array('content' => $rezViewDisplay));
        die();
    }


    /**
     * Process data from AJAX for canceling a reservation
     */

    public function ajax_advCancelRez_func() {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $request_query = [
            'rental_location_id' => $clean_post_data['rental_location_id'],
            'renter_last' => $clean_post_data['renter_last'],
            'confirm_num' => $clean_post_data['confirm_num'],
            'services_url' => $get_wp_config_settings_array['services_url'],
            'logging_url' => $get_wp_config_settings_array['logging_url'],
            'base_url' => get_home_url()
        ];

        $response_contents = AdvRez_Helper::guzzlePost($get_wp_config_settings_array['full_api_url'] . '/cancelReservation', $request_query);

        $tmp_response_contents_array = json_decode($response_contents, true);

        // Check if there's an error
        if (stripos($response_contents, 'error') == true) {

            // If there's an error send it to the javascript
            echo json_encode(array('content' => 'error',
                                   'message' => $tmp_response_contents_array['error']['errorMessage']));
            die();

        } elseif (stripos($response_contents, 'RSPERR') == true) {

            echo json_encode(array('content' => 'error',
                                   'message' => $tmp_response_contents_array['Message']['MessageDescription']));
            die();

        } 

        // Send confirmation number
        $tmp_response_contents_array = array('confirm_num' => $clean_post_data['confirm_num']);

        // Release any loyalty codes if used
        $this->releaseLoyaltyCode($clean_post_data['confirm_num']);

        // Send json back to the ajax on adv_reserve_form.js
        echo json_encode($tmp_response_contents_array);

        die();

    }

    /**
     * Process the release of loyalty codes if a reservation is canceled
     */
    public function releaseLoyaltyCode($confirmationNumber) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $request_query = array('Confirmation' => $confirmationNumber);

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/releaseLoyaltyCode', $request_query);

        $response_arrays = json_decode($response_contents, true);

    }

    /**
     * Process data from AJAX for Reserve Policies
     */

    public function ajax_advReserveConfirmPolicy_func() {
        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        //api call
        $data['locationCode'] = $post_data['rental_location_id'];
        $endpoint = 'Location/GetPolicies';
        $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);
        
        $location_array = AdvLocations_Helper::getLocation($post_data['rental_location_id']);
        
	    $html = "";
        // Loop through the array of policies and created our html  
        if (isset($response_arrays['Status']) && $response_arrays['Status'] == "Success") {
            foreach ($response_arrays['Data'] as $key => $value) {
                $PolicyText = str_replace("\r\n", "", $value['PolicyText']);
                $PolicyText = str_replace("|br|", "<br>", $value['PolicyText']);
                $html .= "<div><b>".$value['Description']."</b><br>".$PolicyText."</div><br>";
            }
        } 
        if (isset($location_array['BrandName']) && $location_array['BrandName'] == 'Europcar') {
            $html .= '<div class="aez-helpful-links"><b>SUPPORT</b><br /><span>Please visit <a href="https://www.europcar.com" target="_blank">www.europcar.com</a> for location policy information.</span></div>';
        } else {
            $html .= '<div class="aez-helpful-links"><b>SUPPORT</b><br /><span>Call <a href="tel:1-800-777-5500">1-800-777-5500</a></span></div>';
        }
        // Send json back to the ajax on adv_location_policies.js
        echo json_encode($html);
        die();
    }

    public function checkForKayak() {

        $clean_get_data = AEZ_Oauth2_Plugin::clean_user_entered_data('get');

        if (isset($clean_get_data['RezSource']) && $clean_get_data['RezSource'] == 'KYK') {
            $this->build_Kayak($clean_get_data);
        }

    }

    public function build_Kayak($get_data) {

        if (! $this->kayak_data_verified($get_data)) {
            return false;
        }

        $ReservationFlow = new AdvRez_ReservationFlow();

        $rezViewDisplay = $ReservationFlow->processRezKayak($get_data);

    }

    public function kayak_data_verified($get_data) {

        If (isset($get_data['pickupdate']) && isset($get_data['pickuptime']) && isset($get_data['dropoffDate']) && isset($get_data['dropofftime']) && isset($get_data['rentalloc']) && isset($get_data['returnloc']) && isset($get_data['rateid']) && isset($get_data['classCode'])) {
            return true;
        }

        return false;

    }

     public function ajax_validateFrequentFlyerNumber_func($get_data) {
        $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $request_query = array('airline' => $post_data['airline'],
                               'frequentflyernumber' => $post_data['frequentflyernumber']);

        $response_contents = AdvRez_Helper::guzzleGet($get_wp_config_settings_array['full_api_url'] . '/validateFrequentFlyerNumber', $request_query);

        $response_arrays = json_decode($response_contents, true);

        // Send json back to the ajax on adv_reserve_form.js
        echo json_encode($response_arrays);

        die();

    }

    public function ajax_advAbandonment_func() {

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        // Set the abandonment_promocode session
        $_SESSION['abandonment']['abandonment_promocode'] = $api_url_array['abandonment_promocode'];

        // if (count($_SESSION['search']['promo_codes']) == 0) { 

            array_push($_SESSION['search']['promo_codes'], $api_url_array['abandonment_promocode']);
        // }

        $ReservationFlow = new AdvRez_ReservationFlow();
        $reserveDisplay = $ReservationFlow->processReservePage();

        echo json_encode($reserveDisplay);

        die();
    }

}