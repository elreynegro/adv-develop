<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');
 
class AdvLocations_SearchShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $ddl_select_box;
    static $addedAlready = false;
 
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

        $this->ddl_select_box = '<h1>test</h1>';

        return $this->ddl_select_box;

    }
}