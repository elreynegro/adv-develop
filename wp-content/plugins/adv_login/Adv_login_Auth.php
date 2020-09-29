<?php

class Adv_login_Auth {

    /**
     * Helper function to dump error_log with line number and function
     */
    public static function login_check($redirect_page) {
// error_log('        %%%%%%%      here in login_check');

// error_log('_SESSION: ' . print_r($_SESSION, true));
// error_log('$_SESSION[adv_login]->access_token: ' . print_r($_SESSION['adv_login']->access_token, true));
        if (isset($_SESSION['adv_login']->access_token) && strlen(trim($_SESSION['adv_login']->access_token)) == 0) {
// error_log('        %%%%%%%      Not logged in and why?');
            wp_redirect( $redirect_page );
            exit;
 
        }
//         $loggedInCookie = getLoggedInCookie();

//         if (strlen(trim($loggedInCookie)) == 0) {
// error_log('here 2');
//             // header('Location: /');
//             wp_redirect( $redirect_page );
//             exit;
//         }

//         $aez_user = validateLoggedInCookie($loggedInCookie);
//         // header('Location: /login');
// Adv_login_Helper::err_log($aez_user, __FUNCTION__, __LINE__);
//         if (count($aez_user) == 0) {
// error_log('here 5');
//             // header('Location: /about-advantage');
//             wp_redirect( $redirect_page );
//             exit;
//         }

// error_log('        **** ***** *****      I am logged in');

    }

}