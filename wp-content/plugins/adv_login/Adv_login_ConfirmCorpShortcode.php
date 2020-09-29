<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_ConfirmCorpShortcode extends Adv_login_ShortCodeScriptLoader {

	public $corp_signup_confirm_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            wp_enqueue_script('adv_login', plugins_url('js/adv_login.js', __FILE__), array('jquery', 'main', 'select2'), '1.0', true);
            wp_enqueue_script('adv_sign_up', plugins_url('js/adv_sign_up.js', __FILE__), array('jquery'), '1.0', true);
 
            wp_localize_script( 'adv_login', 'adv_sign_up', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {

        $this->corp_signup_confirm_html = '<div id="primary">
                                    <div class="aez-secondary-header" style="
                                        background-image: url(/wp-content/themes/twentysixteen-child/assets/man_on_phone.jpg);
                                    ">
                                        <div class="aez-gradient">
                                            <h1>Corporate Advantage</h1>
                                        </div>
                                    </div>

                                    <div class="aez-sign-up-form">
	                                    <form id="sign-up-corporate" action="/" class="aez-form">
                                            <span class="-blue aez-all-caps">Sign Up For</span>
                                            <h3 class="aez-find-a-car__heading">Corporate Advantage</h3>
                                            <div class="aez-form-block">
                                                <h4 class="-dark-blue">My Corporate Advantage</h4>
                                                <div><h1>My Corporate Advantage promo code is: <strong>' . $_POST['BizCode'] . '<stong></h1></div>
                                            </div>
                                        </form>
                                    </div>

                                    <!-- Corporate Advantage -->
                                    <div class="aez-checklist-image -corporate">
                                        <div class="aez-check-image">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/corporate_people.png" alt="Illustration of a group of business people." />
                                            <div class="aez-sub-info">
                                                <h3 class="-white">Corporate Advantage</h3>
                                                <h4 class="-green">Benefits:</h4>
                                            </div>

                                            <!-- Checklist -->
                                            <div class="aez-checklist">
                                                <div class="aez-check-block">
                                                    <i class="fa fa-check"></i>
                                                    <div>
                                                        <h3>Discounts On Every Rental Anywhere &amp; Anytime</h3>
                                                        <p>We know our business clients have a busy schedule, so no matter where they travel to, or when they travel, the discount works 24/7.</p>
                                                    </div>
                                                </div>
                                                <div class="aez-check-block">
                                                    <i class="fa fa-check"></i>
                                                    <div>
                                                        <h3>No Blackout Dates</h3>
                                                        <p>Discounts apply every day of the year and in every domestic market.</p>
                                                    </div>
                                                </div>
                                            </div> <!-- End Checklist -->

                                            <div>
                                                <span class="-white">Corporate Advantage</span>
                                                <a class="aez-btn aez-btn--filled-green" href="#">Sign Up Now!</a>
                                            </div>
                                        </div>
                                    </div> <!-- End Corporate Advantage -->

                                    <div class="aez-learn">
                                        <div>
                                            <h2 class="-dark-blue">Not The Right Program For You?</h2>
                                            <p class="-green">Advantage has multiple loyalty programs to choose from:</p>
                                        </div>

                                        <div class="aez-learn-block">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
                                            <h2 class="-dark-blue">Advantage Expressway</h2>
                                            <h3 class="-green">
                                                For Business &amp; Leisure Travelers
                                            </h3>
                                            <a href="#" class="aez-btn aez-btn--outline-blue">Learn More</a>
                                        </div>

                                        <div class="aez-learn-block">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/arrow.png" alt="Illustration of an arrow" />
                                            <h2 class="-dark-blue">Book Friendly</h2>
                                            <h3 class="-green">
                                                For Travel Agents &amp; Tour Operations
                                            </h3>
                                            <a href="#" class="aez-btn aez-btn--outline-blue">Learn More</a>
                                        </div>
                                    </div>
                                </div>';

        return $this->corp_signup_confirm_html;

	}

}