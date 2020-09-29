<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_PasswordChangeSuccessShortcode extends Adv_login_ShortCodeScriptLoader {

	public $passsword_change_success;
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

        $this->passsword_change_success = '';

        $this->passsword_change_success .= '
<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/highway.jpg);
">
	<div class="aez-gradient">
		<h1>Success</h1>
	</div>
</div>
<div class="aez-sign-up-form">
<h1>Your password was successfully reset.</h1>
</div>';

        return $this->passsword_change_success ;

	}

}