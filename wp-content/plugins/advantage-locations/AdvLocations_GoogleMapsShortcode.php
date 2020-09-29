<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');
 
class AdvLocations_GoogleMapsShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $display_complete;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('google_maps_api', '//maps.google.com/maps/api/js?key=AIzaSyCcJEu_F9bGxmUc8hw05U0uKLu5l6Qb8JA');
            wp_enqueue_script('adv_google_maps', plugins_url('js/adv_google_maps.js', __FILE__), array('jquery'), '1.0', true);
 
            /*
            wp_localize_script( 'adv_reserve', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advReservetNonce' => wp_create_nonce( 'advreserve-nonce' )
        		)
        	);
            */
         }
    }

	public function handleShortcode($atts) {

        $this->display_complete = '<div id="google-map" class="aez-location__map" data-location="' . $atts['location_id'] . '" data-latitude="' . $atts['latitude'] . '" data-longitude="' . $atts['longitude'] . '"></div>';

        return $this->display_complete;

	}

}