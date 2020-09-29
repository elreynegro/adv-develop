<?php
/*
   Plugin Name: Advantage Reservations
   Plugin URI: http://wordpress.org/extend/plugins/advantage-reservations/
   Version: 0.1
   Author: Scott latsa
   Description: Advantage Rent A Car Reservations
   Text Domain: advantage-reservations
   License: GPLv3
  */

/*
    "WordPress Plugin Template" Copyright (C) 2016 Michael Simpson  (email : michael.d.simpson@gmail.com)

    This following part of this file is part of WordPress Plugin Template for WordPress.

    WordPress Plugin Template is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WordPress Plugin Template is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Contact Form to Database Extension.
    If not, see http://www.gnu.org/licenses/gpl-3.0.html
*/

$AdvRez_minimalRequiredPhpVersion = '5.0';

// add_action( 'plugins_loaded', 'rez_start_session' );

/**
 * Start Session if it has been set.
 *
 * @param None
 * @return None
 * @author Scott Latsa
 */
function rez_start_session() {

    if (session_status() === PHP_SESSION_NONE){
        session_start(['cookie_lifetime' => 315360000]);
    }

    // Check if session timed out. 1800 = 30 minutes, 180 = 3 minutes. Use 3 minutes for testing.
    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
        // last request was more than 30 minutes ago
        session_unset();     // unset $_SESSION variable for the run-time 
        session_destroy();   // destroy session data in storage
    }
    $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp

}

/**
 * Check the PHP version and give a useful error message if the user's version is less than the required version
 * @return boolean true if version check passed. If false, triggers an error which WP will handle, by displaying
 * an error message on the Admin page
 */
function AdvRez_noticePhpVersionWrong() {
    global $AdvRez_minimalRequiredPhpVersion;
    echo '<div class="updated fade">' .
      __('Error: plugin "Advantage Reservations" requires a newer version of PHP to be running.',  'advantage-reservations').
            '<br/>' . __('Minimal version of PHP required: ', 'advantage-reservations') . '<strong>' . $AdvRez_minimalRequiredPhpVersion . '</strong>' .
            '<br/>' . __('Your server\'s PHP version: ', 'advantage-reservations') . '<strong>' . phpversion() . '</strong>' .
         '</div>';
}


function AdvRez_PhpVersionCheck() {
    global $AdvRez_minimalRequiredPhpVersion;
    if (version_compare(phpversion(), $AdvRez_minimalRequiredPhpVersion) < 0) {
        add_action('admin_notices', 'AdvRez_noticePhpVersionWrong');
        return false;
    }
    return true;
}


/**
 * Initialize internationalization (i18n) for this plugin.
 * References:
 *      http://codex.wordpress.org/I18n_for_WordPress_Developers
 *      http://www.wdmac.com/how-to-create-a-po-language-translation#more-631
 * @return void
 */
function AdvRez_i18n_init() {
    $pluginDir = dirname(plugin_basename(__FILE__));
    load_plugin_textdomain('advantage-reservations', false, $pluginDir . '/languages/');
}


//////////////////////////////////
// Run initialization
/////////////////////////////////

// Initialize i18n
add_action('plugins_loadedi','AdvRez_i18n_init');

// Run the version check.
// If it is successful, continue with initialization for this plugin
if (AdvRez_PhpVersionCheck()) {
    // Only load and run the init function if we know PHP version can parse it
    rez_start_session();
    include_once('advantage-reservations_init.php');
    AdvRez_init(__FILE__);
}
