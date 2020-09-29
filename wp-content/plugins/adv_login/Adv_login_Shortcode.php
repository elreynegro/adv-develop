<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_Shortcode extends Adv_login_ShortCodeScriptLoader {

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

        $member_number = $_SESSION['adv_login']->memberNumber;
        if (isset($member_number)) {
          $URL="/expressway";
          echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
        }
?>
    <script type="text/javascript">
    (function(d) { 
        if (document.addEventListener) 
        document.addEventListener('ltkAsyncListener', d); 
        else {
            e = document.documentElement; 
            e.ltkAsyncProperty = 0; 
            e.attachEvent('onpropertychange', function (e) { 
                if (e.propertyName == 'ltkAsyncProperty')
                {
                    d();
                }
            });
        }
    })(function() { 
        /********** Begin Custom Code **********/ 
    
        _ltk.SCA.CaptureEmail('user_name');
        /********** End Custom Code **********/ 
    });
    </script>
        
<?php
@session_start();
$return_url_f = (isset($_GET["return_url"]) && $_GET["return_url"] == "home")?site_url().'/home' : '/';

        $this->login_box_html = '<div id="primary"><form id="adv_login" class="aez-form aez-login" action="/expressway" role="form" method="POST" name="adv_login">
                <div class="aez-form-block">
                    <div class="aez-form-block__header">
                        <span class="-blue aez-all-caps">Log In To</span>
                        <h3 class="aez-form-block__heading">Your Rewards Account</h3>
                    </div>
                    <div class="aez-form-item">
                        <label for="user_name" class="aez-form-item__label">User Name</label>
                        <input
                            id="user_name"
                            type="email"
                            class="aez-form-item__input"
                            name="user_name"
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div class="aez-form-item">
                        <label for="password" class="aez-form-item__label">Password</label>
                        <input
                            id="password"
                            type="password"
                            class="aez-form-item__input"
                            name="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <input type="hidden" name="return_url" value="'.$return_url_f.'">
                    <div class="form-group aez-form-block" style="width: 100%; padding: 5px 0px;"><ul id="error_messages" class="error-messages" style="display: none; padding: 5px;"></ul></div>
                    <a href="/forgot-password-request" class="aez-awards-form__link aez-awards-form__link--forgot">Forgot Password?</a>
                    <button type="submit" class="aez-btn aez-btn--filled-green aez-awards-form__submit aez-login__submit">Log In</button>
                    <h3 class="-dark-blue" style="margin-bottom: 20px;">Not An Expressway Member?</h3>
                    <a href="javascript:void(0);" class="aez-btn aez-btn--outline-blue aez-awards-form__submit aez-earn-link signup_menu">Start Earning Now!</a>
                </div>
            </form>
            </div>';
        return $this->login_box_html ;

        // $this->login_box_html = '<div class="row">
        //     <div class="col-md-8 col-md-offset-2">
        //         <div class="panel panel-default">
        //             <div class="panel-heading">Login</div>
        //             <div class="panel-body">
        //                 <form class="form-horizontal" role="form" method="POST" action="/login">

        //                     <div class="form-group">
        //                         <label for="email" class="col-md-4 control-label">E-Mail Address</label>

        //                         <div class="col-md-6">
        //                             <input id="email" type="email" class="form-control" name="email" value="" required autofocus>

        //                         </div>
        //                     </div>

        //                     <div class="form-group">
        //                         <label for="password" class="col-md-4 control-label">Password</label>

        //                         <div class="col-md-6">
        //                             <input id="password" type="password" class="form-control" name="password" required>

        //                         </div>
        //                     </div>

        //                     <div class="form-group">
        //                         <div class="col-md-6 col-md-offset-4">
        //                             <div class="checkbox">
        //                                 <label>
        //                                     <input type="checkbox" name="remember"> Remember Me
        //                                 </label>
        //                             </div>
        //                         </div>
        //                     </div>

        //                     <div class="form-group">
        //                         <div class="col-md-8 col-md-offset-4">
        //                             <button id="adv_login_ajax" type="submit" class="btn btn-primary">
        //                                 Login
        //                             </button>

        //                             <a class="btn btn-link" href="/password-reset">
        //                                 Forgot Your Password?
        //                             </a>
        //                         </div>
        //                     </div>

        //                     <div class="form-group">
        //                         <div class="col-md-8 col-md-offset-4">
        //                             <button id="test_button_1" type="button" class="btn btn-primary">
        //                                 Test 1
        //                             </button>
        //                         </div>
        //                     </div>

        //                     <div class="form-group">
        //                         <div class="col-md-8 col-md-offset-4">
        //                             <button id="test_button_2" type="button" class="btn btn-primary">
        //                                 Test 2
        //                             </button>
        //                         </div>
        //                     </div>

        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>';

        // return $this->login_box_html;

	}

}