<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_popupShortcode extends Adv_login_ShortCodeScriptLoader {

	public $login_box_html;
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
    $find_is_home = strlen($_SERVER['REQUEST_URI']) > 1  ? 0 : 1 ;    
    
?>
    
<?php
$return_url_f = (isset($_GET["return_url"]) && $_GET["return_url"] == "home")?site_url().'/home' : '/reserve';
        $this->login_box_html = '<div id="primary2"><form id="adv_login" class="aez-form aez-login aez_login_popup" action="'.$return_url_f.'" role="form" method="POST" name="adv_login">
                <div class="aez-form-block">
                    <div class="aez-form-block__header">
                        <span class="-blue aez-all-caps">Log In To</span>
                        <h3 class="aez-form-block__heading">Your Rewards Account</h3>
                    </div>
                    <div class="form-group aez-form-item">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                        </div>
                        <label for="user_name" style="display: none;" class="aez-form-item__label">User Name</label>
                        <input
                            id="user_name"
                            type="email"
                            class="aez-form-item__input"
                            name="user_name"
                            placeholder="Email Address"
                            required
                        />
                    </div> <!-- input-group.// -->
                    </div>
                    <div class="form-group aez-form-item">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                            </div>
                            <label for="password" style="display: none;" class="aez-form-item__label">Password</label>
                            <input
                                id="password"
                                type="password"
                                class="aez-form-item__input"
                                name="password"
                                placeholder="********"
                                required
                            />
                        </div> <!-- input-group.// -->
                    </div>
                    <input type="hidden" name="return_url" value="'.$return_url_f.'">
                    <input type="hidden" name="is_home" value="'.$find_is_home.'">
                    <div class="form-group aez-form-block" style="width: 100%; padding: 5px 0px;"><ul id="error_messages" class="error-messages" style="display: none; padding: 5px;"></ul></div>
                    <div class="form-group aez-form-item" style="border: none; margin: auto; background-color: transparent; text-align: center;">
                    <button type="submit" id="reserve_login_button" class="aez-awards-form__submit aez-login__submit" style="padding: .6em 0;">Login</button> </div>
                    <p class="popup_p">
                    <a href="/forgot-password-request" class="aez-awards-form__link aez-awards-form__link--forgot">Forgot Password?</a></p>
                    </div>
                    <div class="popup_footer_div">
                        <h3 class="-white popup_footer_header">Not An Expressway Member?</h3>
                        <div class="popup_footer_button"> <a href="javascript:void(0);" class="signup_menu text-center">Start Earning Now!</a> </div>
                    </div>
                </form>
                </div>';
        return $this->login_box_html ;
	}

}