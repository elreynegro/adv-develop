<?php

    include_once('AdvContactUs_ShortCodeScriptLoader.php');
 
class AdvContactUs_LocationDropDownShortcode extends AdvContactUs_ShortCodeScriptLoader {

    public $location_drop_down_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('location_policies', plugins_url('js/adv_location_policies.js', __FILE__), array('jquery'), '1.0', true);
         }
    }

    public function adv_rez_vehicle_list_func($atts) {
            error_log("In vehicle function");
            error_log("POST: ".print_r($_POST, true));
            $this->location_drop_down_html = $_POST['vehicles_html'];
        return $this->location_drop_down_html;

    }

    public function handleShortcode($atts) {


        $this->location_drop_down_html = '  <input 
                                            type="search"
                                            id="location-policy-dropdown"
                                            name="location-policy-dropdown"
                                            pattern=".{15,}" 
                                            class="aez-select2-search aez-form-item__dropdown location-policy-dropdown"
                                            placeholder="Enter a city or country to find a location"
                                            style= "font-size: .9em; border-radius: 5px;" 
                                            spellcheck="false"
                                            required
                                            >
                                            <label for="rental_location_id" class="aez-form-item__label--hidden"></label>
                                            <input id="rental_location_id" 
                                            name="rental_location_id" 
                                            style="display: none;" 
                                            class="aez-select2-search aez-form-item__dropdown" 
                                            >
                                            <div id="policies"></div>';

        return $this->location_drop_down_html;

    }

}