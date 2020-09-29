<?php


include_once('AdvLocations_LifeCycle.php');
require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/adv_login/Adv_login_Helper.php');
require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/advantage-locations/AdvLocations_Helper.php');
class AdvLocations_Plugin extends AdvLocations_LifeCycle {

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
        return 'Advantage Locations';
    }

    protected function getMainPluginFileName() {
        return 'advantage-locations.php';
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

        add_action( 'add_meta_boxes', array(&$this, 'location_id_meta_box_display' ));

        add_action( 'save_post', array(&$this, 'location_id_meta_box_save' ));
        // Add Actions & Filters
        // http://plugin.michael-simpson.com/?page_id=37


        // Adding scripts & styles to all pages
        // Examples:
        //        wp_enqueue_script('jquery');
        //        wp_enqueue_style('my-style', plugins_url('/css/my-style.css', __FILE__));
        //        wp_enqueue_script('my-script', plugins_url('/js/my-script.js', __FILE__));

        // Get API Url
        add_action('wp_ajax_advGetLocationSlug', array(&$this, 'ajax_advGetLocationSlug_func'));
        add_action('wp_ajax_nopriv_advGetLocationSlug', array(&$this, 'ajax_advGetLocationSlug_func')); // optional
		
        // Get Location Info
        add_action('wp_ajax_advGetLocationInfo', array(&$this, 'ajax_advGetLocationInfo_func'));
        add_action('wp_ajax_nopriv_advGetLocationInfo', array(&$this, 'ajax_advGetLocationInfo_func')); // optional		

        // Register short codes
        // http://plugin.michael-simpson.com/?page_id=39
        include_once('AdvLocations_SearchShortcode.php');
        $sc = new AdvLocations_SearchShortcode();
        $sc->register( 'adv-search-locations-ddl' );

        include_once('AdvLocations_GoogleMapsShortcode.php');
        $sc = new AdvLocations_GoogleMapsShortcode();
        $sc->register( 'adv-google-maps' );

        include_once('AdvLocations_LocationCheckShortcode.php');
        $sc = new AdvLocations_LocationCheckShortcode();
        $sc->register( 'adv-location-check' );

        include_once('AdvLocations_US_ListLocationsShortcode.php');
        $sc = new AdvLocations_US_ListLocationsShortcode();
        $sc->register( 'adv-us-locations' );

        include_once('AdvLocations_INTL_ListLocationsShortcode.php');
        $sc = new AdvLocations_INTL_ListLocationsShortcode();
        $sc->register( 'adv-intl-locations' );

        include_once('AdvLocations_LocationHoursShortcode.php');
        $sc = new AdvLocations_LocationHoursShortcode();
        $sc->register( 'adv-location-info-block' );

        include_once('AdvLocations_LocationMarkupTemplateShortcode.php');
        $sc = new AdvLocations_LocationMarkupTemplateShortcode();
        $sc->register( 'adv-location-markup-template' );

        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

    }

    function location_id_meta_box_display()
    {
        add_meta_box( 'location-meta-box-id', 'Location ID: ', array(&$this, 'location_meta_box_form'), 'page', 'normal', 'high' );
    }

    function location_meta_box_form()
    {

        global $post;

        $page_location_id =  get_post_meta( $post->ID, 'page_location_id', true );
        ?>
            <label for="page_location_id">Location ID: </label>
            <input type="text" name="page_location_id" id="page_location_id" value="<?php echo $page_location_id; ?>" />
        <?php    

    }

    function location_id_meta_box_save( $post_id )
    {

        // Bail if we're doing an auto save
        if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
         
        // if our current user can't edit this post, bail
        if( !current_user_can( 'edit_post' ) ) return;

        // Make sure your data is set before trying to save it
        if( isset( $_POST['page_location_id'] ) ) {
            update_post_meta( $post_id, 'page_location_id', strtoupper($_POST['page_location_id']));

        }
             
    }

    function ajax_advGetLocationSlug_func(){

        global $wpdb;

        $get_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        $post_id_array = $wpdb->get_results( 
          $wpdb->prepare("SELECT post_id FROM $wpdb->postmeta where meta_key = %s and meta_value = '" . $get_data['location_id'] . "'", 'page_location_id'), ARRAY_A
         );

        global $post;
        $post = get_post($post_id_array[0]['post_id'],'ARRAY_A');


        echo json_encode(array('slug' => $post['post_name']));
        die();

    }
	
    function ajax_advGetLocationInfo_func() {

        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();
        $location_code = $post_data["location_code"];

        if(trim($location_code) == '') {
                echo "No info to display...";
                die;
        }

        $location_data = AdvLocations_Helper::getLocation($location_code);
        $loc_flag = ($location_data['Country'] == 'US' || $location_data['Country'] == 'PR')?1:2;
        $_SESSION['loc_nav_flag'] = $loc_flag;

        $hours_data = AdvLocations_Helper::getLocationHours($location_data['LocationCode']);
         $phone_replace = str_replace($phone, "", $location_data['Phone1']);
        $location_value = $location_data['LocationName'] . " (" . $location_data['City'] . ", " . $location_data['State'] . " " . $location_data['CountryName'] . ") - " . $location_data['LocationCode'];
        if($location_data['Phone1'] !== "")
        {        
                if (isset($location_data['Country']) && $location_data['Country'] == 'US') {
                    $phone_number = "+1" . preg_replace("/[^0-9]/","",$location_data['Phone1']);
                    $phone_number_display = $location_data['Phone1'];
                } else {
                    $phone_number = "+" . preg_replace("/[^0-9]/","",$location_data['Phone1']);
                    $phone_number_display = $location_data['Phone1'];
                }
        }
        else
        {
               if (isset($location_data['Country']) && $location_data['Country'] == 'US') {
                    $phone_number = "+1" . preg_replace("/[^0-9]/","",$location_data['Phone2']);
                    $phone_number_display = $location_data['Phone2'];
                } else {
                    $phone_number = "+" . preg_replace("/[^0-9]/","",$location_data['Phone2']);
                    $phone_number_display = $location_data['Phone2'];
                }
        }
        
        $this->display_complete = '';
        
        if (is_array($location_data) && array_key_exists('LocationName', $location_data)) {

            $this->display_complete ='  <div class="aez-locations__us">
                                            <div class="location-usa-wrapper">
                                                <div class="aez-info-block-container">
                                                    <div class="aez-info-block">
                                                        <div class="aez-info-section">
                                                            <h4 class="aez-all-caps -blue"><i class="fa fa-map-marker -green" aria-hidden="true"></i> Address:</h4>
                                                            <p class="aez-info-text">' . $location_data['AddLine1'] .
                                                            (! empty($location_data['AddLine2']) ? '<br>' . $location_data['AddLine2'] : '') .
                                                            '<br>'. $location_data['City'] ." " . $location_data['State'] . " " . $location_data['PostalCode'] . " " .$location_data['Country'] .
                                                            '<br>';

                                                            if ($location_data['Phone1'] !== "" || $location_data['Phone2'] !== "") {
                                                                $this->display_complete .='
                                                                <i class="fa fa-phone -blue" aria-hidden="true"></i><a href="tel:'. $phone_number . '">' . $phone_number_display . '</a>'; 
                                                            }

                                                        $this->display_complete .='
                                                        </p></div><br>
                                                        <div class="aez-info-section">
                                                            <h4 class="aez-all-caps -blue"><i class="fa fa-clock-o -green" aria-hidden="true"></i> Hours</h4>';

                                                            $opening_time = "";
                                                            $closing_time = "";

                                                            if ( (count($hours_data) == 0 ) || (isset($hours_data['Status']) && $hours_data['Status'] == 'ERROR') ) {
                                                                        $this->display_complete .= '<div class="aez-info-time">Contact location for hours.</div>';
                                                                        $hours_css = "check_avail_no_hours";
                                                            } else {
                                                                $hours_css = "check_avail";
                                                                // Loop through the location hours
                                                                foreach ($hours_data as $key => $value) {
                                                                    // Explode the time to get the open and closing time of the location
                                                                    $time = explode ("-", $value);
                                                                    if (!empty($time[0])) {
                                                                        $opening_time = $time[0];
                                                                    }
                                                                    if (!empty($time[1])) {
                                                                        $closing_time = $time[1];
                                                                    }

                                                                    if ($key == 'Mon') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Monday:</div> <div class="aez-info-time">'. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Tues') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Tuesday:</div> <div class="aez-info-time">'. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Wed') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Wednesday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Thurs') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Thursday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Fri') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Friday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Sat') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Saturday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Sun') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Sunday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                }
                                                            }
            $this->display_complete .='                  </div><div class="loc_check_avail_btn '. $hours_css .'">'
                    . '                                 <p class="aez-body">'
                    . '                                 <button id="check_availability_id" type="button" name="button" value="'. $location_value .'" class="aez-btn aez-btn--filled-green __location find-a-car-menu-item" onclick="goToAnchor()">Check Availability
                                                        </button></p>
                                                    </div>

                                                </div>
                                               ';

        } 

        echo $this->display_complete;
        die();
    }

}
