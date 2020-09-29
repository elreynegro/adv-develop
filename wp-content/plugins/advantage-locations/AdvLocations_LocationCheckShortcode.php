<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');
 
class AdvLocations_LocationCheckShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $ddl_select_box;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
// error_log('outside addscript');
        if (!self::$addedAlready) {
            self::$addedAlready = true;
        }
    }

	public function handleShortcode($atts) {

error_log('in handleShortcode');

    }
}