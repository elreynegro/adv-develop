<?php

// Sets the visitor cookie on entering the site
// add_action( 'after_setup_theme', 'start_session' );
add_action( 'init', 'visitor_cookie' );

/**
 * Start Session if it has been set.
 *
 * @param None
 * @return None
 * @author Scott Latsa
 */
function start_session() {
// // error_log('1session_id(): ' . session_id());
// // error_log('1_SESSION(): ' . print_r($_SESSION,true));

// error_log('    &&&    &&&&   &&&        session_status(): ' . print_r(session_status(), true));
	if (session_status() === PHP_SESSION_NONE){
		session_start(['cookie_lifetime' => 315360000]);
	}
// // error_log('2session_id(): ' . session_id());
// // error_log('2_SESSION(): ' . print_r($_SESSION, true));
// // $_SESSION['time'] = time();
// // error_log('2ession_status()): ' . session_status());
}
// error_log('session_id(): ' . print_r(session_id(), true));

// start_session();
// error_log('debug_backtrace(): ' . print_r(debug_backtrace(), true));
/**
 * Add a visitor cookie and insert a unique identifier.
 *
 * @param None
 * @return None
 * @author Richard Garcia
 */
function visitor_cookie() {
	// If the cookie isn't set, then set it.
	if (!isset($_COOKIE['adv_visitor'])) {
		// uniqid - generates unique identifier.
		// This cookie expires in 6 months from when it's set.
		// setcookie( 'adv_visitor', uniqid('adv_', true), time() + (10 * 365 * 24 * 60 * 60), '/');
		setcookie( 'adv_visitor', uniqid('adv_', true), time() + (185 * 24 * 60 * 60), '/');
	}
    
}

/**
 * Add a login cookie
 *
 * @param None
 * @return None
 * @author Richard Garcia
 */
function login_cookie($v_value) {

	ob_start();

	// This cookie expires in 6 months from when it's set.
	// setcookie( 'adv_login', $v_value, time() + (10 * 365 * 24 * 60 * 60), '/');
	setcookie( 'adv_login', $v_value, time() + (185 * 24 * 60 * 60), '/');

	ob_end_flush();

}
