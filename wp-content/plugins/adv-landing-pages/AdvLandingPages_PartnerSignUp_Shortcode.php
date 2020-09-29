<?php


    include_once('AdvLandingPages_ShortCodeScriptLoader.php');
    include_once('AdvLandingPages_Helper.php');

class AdvLandingPages_PartnerSignup_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

	//public $choose_list_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            // wp_register_style( 'landing-page-gaytravel', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners--gaytravel.css');
            // wp_register_style( 'landing-page-partners', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners.css' );

            // $styles = array('landing-page-gaytravel', 'landing-page-partners');
            // wp_enqueue_style($styles);
        }
    }

	public function handleShortcode($atts) {

        $get_data = AEZ_Oauth2_Plugin::clean_user_entered_data("get");

        if (isset($get_data['email']) && $get_data['email'] !== "") {
            $email = trim($get_data['email']);
        }
        if (isset($get_data['source']) && $get_data['source'] !== "") {
            $source = trim($get_data['source']);
        }

        switch ($source) {
            case "vacationvillage":
                $program_code = 'VVS';
                // If the email exists then save their email.
                // If not then skip saving their email and just redirect the customer to the sign up page
                if (isset($email) && $email !== "") {
                    $saveAffiliateSignup = AdvLandingPages_Helper::saveAffiliateSignup($email, $program_code);
                }
                // Set the redirect to the sign up page
                $redirect = "/sign-up?email=".$email;
                break;
            default:
                $redirect = "/sign-up";
        }

        echo '<script type="text/javascript">
                window.location = "'. $redirect .'"
              </script>';
        die();
	}

}