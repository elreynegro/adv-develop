<?php


include_once('AdvVehicles_LifeCycle.php');

class AdvVehicles_Plugin extends AdvVehicles_LifeCycle {

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
        return 'Advantage Vehicles';
    }

    protected function getMainPluginFileName() {
        return 'advantage-vehicles.php';
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

         // Vehicles
        add_action('wp_ajax_advVehicles', array(&$this, 'ajax_advVehicles_func'));
        add_action('wp_ajax_nopriv_advVehicles', array(&$this, 'ajax_advVehicles_func')); // optional

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
        include_once('AdvVehicles_ListShortcode.php');
        $sc = new AdvVehicles_ListShortcode();
        $sc->register( 'adv-vehicles-list' );


        // Register AJAX hooks
        // http://plugin.michael-simpson.com/?page_id=41

    }

     public function ajax_advVehicles_func() {
        $post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

        header("Content-type: application/json");        
        try {
            //api call
            $data['locationCode'] = $post_data['rental_location_id'];
            $endpoint = 'Location/GetPolicies';
            $response_arrays = AEZ_Oauth2_Plugin::apiRequestAgent($data,$endpoint);
        } catch (Exception $e) {
            echo json_encode('{error: "1 Something went wrong. Please try your search another time."}');
            die();            
        }

        $html = "";
        
        // Loop through the array of policies and created our html
        if (isset($response_arrays['Status']) && $response_arrays['Status'] == "Success") {
            foreach ($response_arrays['Data'] as $key => $value) {
                $html .= "<div><b>".$value['Description']."</b><br>".$value['PolicyText']."</div><br>";
            }
        } 
        // Send json back to the ajax on adv_location_policies.js
        echo json_encode($html);
        die();
    }


}
