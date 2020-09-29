<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_ForgotPasswordRequestShortcode extends Adv_login_ShortCodeScriptLoader {

	public $forgot_password_request_box_html;
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

        $this->forgot_password_request_box_html = '';

        $this->forgot_password_request_box_html .= '
<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/highway.jpg);
">
	<div class="aez-gradient">
		<h1>Request an Email to Reset Your Password</h1>
	</div>
</div>
<div class="aez-sign-up-form">
	<form id="request_reset_forgot_password" action="/" class="aez-form">
	    <span class="-blue aez-all-caps">Request to Reset Password</span>
		<h3 class="aez-find-a-car__heading">Enter Email</h3>
		<div class="aez-form-block">
	        <h4 class="-dark-blue">My Account</h4>
            <div class="aez-form-item">
                <label for="email" class="aez-form-item__label">Enter Email</label>
                <input
                    id="email"
                    type="email"
                    class="aez-form-item__input"
                    name="email"
                    placeholder="Email Address"
                    required
                />
            </div>
			<button type="submit" class="aez-btn aez-btn--filled-green">Send Me A Reset Email</button>
		</div>
	</form>
</div>';

        return $this->forgot_password_request_box_html ;

	}

}