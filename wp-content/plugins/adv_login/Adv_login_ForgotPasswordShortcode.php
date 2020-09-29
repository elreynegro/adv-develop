<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_ForgotPasswordShortcode extends Adv_login_ShortCodeScriptLoader {

	public $forgot_password_box_html;
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

		$password_token_plus = str_replace('/reset/', '', $_SERVER['REQUEST_URI']);
		$password_token = str_replace('/', '', $password_token_plus);

        $this->forgot_password_box_html = '';

        $this->forgot_password_box_html .= '
<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/highway.jpg);
">
	<div class="aez-gradient">
		<h1>Reset Your Password</h1>
	</div>
</div>
<div class="aez-sign-up-form">
	<form id="reset_forgot_password" action="/reset-forgot-password" class="aez-form">
	    <span class="-blue aez-all-caps">Reset Password</span>
		<h3 class="aez-find-a-car__heading">Enter Password Twice</h3>
		<div class="aez-form-block">
	        <h4 class="-dark-blue">My Password</h4>
            <div class="aez-form-item">
                <label for="email" class="aez-form-item__label">User Name</label>
                <input
                    id="email"
                    type="email"
                    class="aez-form-item__input"
                    name="email"
                    placeholder="Email Address"
                />
            </div>

	        <div class="aez-form-item">
	            <label for="password" class="aez-form-item__label">Password<sup>*</sup></label>
	            <input
	                id="password"
	                type="password"
	                class="aez-form-item__input"
	                name="password"
	                placeholder="Password"
	                required
	            />
	        </div>
	        <div class="aez-form-item">
	            <label for="password_again" class="aez-form-item__label">Password Again<sup>*</sup></label>
	            <input
	                id="password_again"
	                type="password"
	                class="aez-form-item__input"
	                name="password_again"
	                placeholder="Password Again"
	                required
	            />
	        </div>
		</div>
		<div class="aez-form-block -checkbox">
	        <div class="aez-form-item--checkbox-cont" style="width: 100%;">
	            <input
	                id="terms_and_conditions" 
	                type="checkbox"
	                class="aez-form-item__checkbox"
	                name="terms_and_conditions"
	            />
	             <label for="terms_and_conditions" class="aez-form-item__label">I agree with the <a href="/terms-and-conditions-advantage-awards/" class="-green" target=_blank>Terms and Conditions</a> of the Advantage Expressway Program *</label>
	        </div>
	        <input type="hidden" name="password_token" value="' . $password_token . '" />
		</div>
		<div class="aez-form-block">
		<button type="submit" class="aez-btn aez-btn--filled-green">Reset Password</button>
		</div>
	</form>
</div>';

        return $this->forgot_password_box_html ;

	}

}