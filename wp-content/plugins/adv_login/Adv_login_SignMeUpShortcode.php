<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_SignMeUpShortcode extends Adv_login_ShortCodeScriptLoader {

	public $adv_awards_signup_popup;
    static $addedAlready = false;
    public $api_url_array;

 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_register_style( 'remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');
            wp_register_style( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/css/pikaday.css' );
            wp_register_style( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css' );

            $styles = array('remove-margin','pikaday','select2');
            wp_enqueue_style($styles);  

            wp_enqueue_script('adv_login', plugins_url('js/adv_login.js', __FILE__), array('jquery', 'main', 'select2'), '1.0', true);
            wp_enqueue_script('adv_popup_signup', plugins_url('js/adv_popup_signup.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_script('moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
            wp_enqueue_script('pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
            wp_enqueue_script('validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true );
            wp_enqueue_script('select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
            wp_enqueue_script('mask', get_stylesheet_directory_uri() . '/vendor/jQuery-Mask-Plugin-1.14.0/dist/jquery.mask.min.js', array(), null, true );
            wp_localize_script( 'adv_login', 'adv_popup_signup', 'select2', 'moment', 'pikaday', 'validator', 'mask', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $renter_email = $_SESSION['renter']['renter_email_address'];
        $renter_first_name = $_SESSION['renter']['renter_first'];
        $renter_last_name = $_SESSION['renter']['renter_last'];
        $renter_ph_num = $_SESSION['renter']['renter_home_phone'];
        $renter_dob =$_SESSION['renter']['renter_dob'];
        $this->adv_awards_signup_popup = '<div id="primary2">
        <div class="aez-advantage-awards-banner">
            <div class="aez-awards-img" style="padding-top: 1em; padding-bottom: 0.5em;">
                <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" style="width: 95%;" alt="Advantage Expressway logo">  
            </div>
        </div>
        <h1 style="text-align: center; color: #003366;font-size: 1.5em; font-weight: 500;"> You\'re just one click away. </h1>
        <label for="email_flag" class="aez-form-item__label" hidden>Email Address Mismatch<sup>*</sup></label>
            <input id="email_flag" type="hidden" class="aez-form-item__input" name="email_flag" required />
        <label for="phone_flag" class="aez-form-item__label" hidden>Phone Number Mismatch<sup>*</sup></label>
            <input id="phone_flag" type="hidden" class="aez-form-item__input" name="phone_flag" required />
        <label for="passwords_flag" class="aez-form-item__label" hidden>Passwords do not matche<sup>*</sup></label>
            <input id="passwords_flag" type="hidden" class="aez-form-item__input" name="passwords_flag" required />
                                    <div class="aez-sign-up-form popup-form">
                                        <form id="popup_adv_awards_sign_up" action="/" class="aez-form aez-sign-up-form">
                                            <span class="-blue aez-all-caps">Sign Up For Advantage Expressway</span>
                                            <div class="aez-form-block">
                                                <div class="aez-form-item">
                                                    <label for="first_name1" class="aez-form-item__label">First Name<sup>*</sup></label>
                                                    <input
                                                        id="first_name1"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="first_name1"
                                                        placeholder="First Name"
                                                        pattern="^([^0-9]*)$"
                                                        value="' . $renter_first_name  .'"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="last_name1" class="aez-form-item__label">Last Name<sup>*</sup></label>
                                                    <input
                                                        id="last_name1"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="last_name1"
                                                        placeholder="Last Name"
                                                        pattern="^([^0-9]*)$"
                                                        value="' . $renter_last_name  .'"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="email1" class="aez-form-item__label">Email<sup>*</sup></label>
                                                    <input
                                                        id="email1"
                                                        type="email"
                                                        class="aez-form-item__input"
                                                        name="email1"
                                                        placeholder="Email"
                                                        required
                                                        value="' . $renter_email  .'"
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="password1" class="aez-form-item__label">Password<sup>*</sup></label>
                                                    <input
                                                        id="password1"
                                                        type="password"
                                                        class="aez-form-item__input"
                                                        name="password1"
                                                        placeholder="Password"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="confirm_password1" class="aez-form-item__label">Confirm Password<sup>*</sup></label>
                                                    <input
                                                        id="confirm_password1"
                                                        type="password"
                                                        class="aez-form-item__input"
                                                        name="confirm_password1"
                                                        placeholder="Confirm Password"
                                                        required
                                                    />
                                                </div>
                                               
                                                <div class="aez-form-item">
                                                <label for="phone_number1" class="aez-form-item__label">Phone Number</label>
                                                <input
                                                    id="phone_number1"
                                                    type="tel"
                                                    class="aez-form-item__input"
                                                    name="phone_number1"
                                                    placeholder="Phone Number"';
                                                    if(isset($_SESSION['renter']['renter_home_phone'])) {
                                                        $this->adv_awards_signup_popup .= 'value="' . $renter_ph_num  .'"';
                                                    }
                                                        $this->adv_awards_signup_popup .= '
                                                />
                                                </div>
                                            </div>
                                            <div class="aez-form-block -checkbox" style="display:block; padding-top: 0px;">
                                                <div class="aez-form-item--checkbox-cont" style="width: 100%;">
                                                    <input id="EmailOptIn" type="checkbox" class="aez-form-item__checkbox" name="EmailOptIn" checked>
                                                    <label for="EmailOptIn" class="aez-form-item__label" style="color: #555 !important; font-size: 0.75em !important;">Receive exclusive members-only offers and specials via email</label>
                                                </div>
                                                <div class="aez-form-item--checkbox-cont" style="width: 100%;">
                                                    <input id="SMSOptIn" type="checkbox" class="aez-form-item__checkbox" name="SMSOptIn" checked>
                                                    <label for="SMSOptIn" class="aez-form-item__label" style="font-size: 0.75em !important; color: #555 !important;">Receive exclusive members-only offers and specials via text messaging</label>
                                                </div>
                                                <div class="aez-form-item--checkbox-cont" style="width: 100%;">
                                                    <input id="read_i_agree_terms" type="checkbox" class="aez-form-item__checkbox" name="read_i_agree_terms">
                                                    <label for="read_i_agree_terms" class="aez-form-item__label" style="color: #555; font-size: 0.75em !important;">I agree with the <a href="/terms-and-conditions-expressway/" class="-green" target="_blank">Terms and Conditions</a> of of the Expressway Loyalty Program *</label>
                                                </div>
                                                <button type="submit" style="width: 100%; margin: 1% 0; padding: 0.75em 0;" class="aez-btn aez-btn--filled-green pum-close">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>';

        return $this->adv_awards_signup_popup;

	}

}