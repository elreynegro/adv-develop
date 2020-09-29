<?php


    include_once('AdvLandingPages_ShortCodeScriptLoader.php');

class AdvLandingPages_EmailOptOut_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

	public $email_opt_out_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_register_style( 'landing-page-expressway', plugin_dir_url( __FILE__) . 'css/aez-landing-page-expressway.css');
            wp_register_style( 'landing-page-partners', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners.css' );

            $styles = array('landing-page-expressway', 'landing-page-partners');
            wp_enqueue_style($styles);

             wp_register_script('expressway-js', plugins_url('js/expressway.js', __FILE__), array('jquery', 'main'),  null, true );

            $scripts = array('jquery', 'expressway-js');
            wp_enqueue_script($scripts);

            wp_localize_script( 'adv_login', 'ADV_Ajax', array(
                'ajaxurl'   => admin_url( 'admin-ajax.php' ),
                'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
                )
            );

        }
    }

	public function handleShortcode($atts) {

        $clean_get_data = AEZ_Oauth2_Plugin::clean_user_entered_data('get');

        $member_number = $clean_get_data['MemberNumber'];

        if (isset($member_number) && $member_number !== "") {
            $memberOptOut_response = AdvLandingPages_Helper::memberOptOut($member_number, 'Email');
        } else {
            $memberOptOut_response['Status'] == "Failed";
        }

        if (isset($memberOptOut_response['Status']) && $memberOptOut_response['Status'] == "Success") {

            $this->email_opt_out_html = '
                <div class="aez-partners-feature">
                    <div class="aez-partners-feature__hero">
                        <div class="aez-partners-feature__hero-gradient"></div>
                        <div class="aez-partners-feature__hero-content">
                            <h2>You have successfully unsubscribed from Expressway promotional emails.</h2>
                        </div>
                    </div>
                   ';
        } else {

            $this->email_opt_out_html = '
                <div class="aez-partners-feature">
                    <div class="aez-partners-feature__hero">
                        <div class="aez-partners-feature__hero-gradient"></div>
                        <div class="aez-partners-feature__hero-content">
                            <h2>There was an issue opting out of the Expressway promotional emails. Please try again later.</h2>
                        </div>
                    </div>
                   ';
        }

        return $this->email_opt_out_html;

	}

}