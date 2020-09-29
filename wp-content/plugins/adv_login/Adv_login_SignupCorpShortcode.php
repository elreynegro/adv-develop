<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_SignupCorpShortcode extends Adv_login_ShortCodeScriptLoader {

	public $corp_signup_box_html;
    static $addedAlready = false;
    public $api_url_array;
 	
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
        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
        $persuade_url = isset($api_url_array['pursuade_url']) ? $api_url_array['pursuade_url'] : 'https://rewardsqa.advantage.com';
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
        
            _ltk.SCA.CaptureEmail('ContactEmail');
            /********** End Custom Code **********/ 
        });
        
        </script>
        
<?php
        $this->corp_signup_box_html = '<div id="primary">
                                    <div class="aez-secondary-header" style="
                                        background-image: url(/wp-content/themes/twentysixteen-child/assets/man_on_phone.jpg);
                                    ">
                                        <div class="aez-gradient">
                                            <h1>Corporate Advantage</h1>
                                        </div>
                                    </div>

                                    <div class="aez-sign-up-form">
                                        <form id="sign-up-corporate" action="/" class="aez-form">
                                            <span class="-blue aez-all-caps" style="margin-bottom:10px;">Sign Up For <div style="color: #036; display: inline; font-size: 1.2em;">Corporate Advantage</div>
                                            </span>
                                            <div class="aez-form-block">
                                                <h4 class="-dark-blue">My Corporate Advantage</h4>
                                                <div class="aez-form-item">
                                                    <label for="BizName" class="aez-form-item__label">Company Name<sup>*</sup></label>
                                                    <input
                                                        id="BizName"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="BizName"
                                                        pattern="[A-Za-z\\s]*"
                                                        placeholder="Company Name"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="ContactFirstName" class="aez-form-item__label">First Name<sup>*</sup></label>
                                                    <input
                                                        id="ContactFirstName"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="ContactFirstName"
                                                        pattern="^([^0-9]*)$"
                                                        placeholder="First Name"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="ContactLastName" class="aez-form-item__label">Last Name<sup>*</sup></label>
                                                    <input
                                                        id="ContactLastName"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="ContactLastName"
                                                        pattern="^([^0-9]*)$"
                                                        placeholder="Last Name"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="ContactEmail" class="aez-form-item__label">Email<sup>*</sup></label>
                                                    <input
                                                        id="ContactEmail"
                                                        type="email"
                                                        class="aez-form-item__input"
                                                        name="ContactEmail"
                                                        placeholder="Email"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="confirm_ContactEmail" class="aez-form-item__label">Confirm Email<sup>*</sup></label>
                                                    <input
                                                        id="confirm_ContactEmail"
                                                        type="email"
                                                        class="aez-form-item__input"
                                                        name="confirm_ContactEmail"
                                                        placeholder="Confirm Email"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div class="aez-form-block -checkbox">
                                                <div class="aez-form-item--checkbox-cont">
                                                    <input
                                                        id="read_location_policy"
                                                        type="checkbox"
                                                        class="aez-form-item__checkbox"
                                                        name="read_location_policy"
                                                    />
                                                    <label for="read_location_policy" class="aez-form-item__label">I agree with the <a href="/terms-and-conditions-corporate-advantage/" class="-green" target=_blank>Terms and Conditions</a> of the Corporate Advantage Program *</label>
                                                </div>
                                                <button type="submit" class="aez-btn aez-btn--filled-green">Submit</button>
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
                                        </div>
                                    </div> <!-- End Corporate Advantage -->

                                    <div class="aez-learn">
                                        <div>
                                            <h2 class="-dark-blue">Not The Right Program For You?</h2>
                                            <p class="-green">Advantage has multiple loyalty programs to choose from:</p>
                                        </div>

                                        <div class="aez-learn-block">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
                                            <h2 class="-dark-blue">Expressway Program</h2>
                                            <h3 class="-green">
                                                For Business &amp; Leisure Travelers
                                            </h3>
                                            <a href="' . $persuade_url . '" class="aez-btn aez-btn--outline-blue">Learn More</a>
                                        </div>

                                        <div class="aez-learn-block">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/arrow.png" alt="Illustration of an arrow" />
                                            <h2 class="-dark-blue">Book Friendly</h2>
                                            <h3 class="-green">
                                                For Travel Agents &amp; Tour Operations
                                            </h3>
                                            <a href="/book-friendly/" class="aez-btn aez-btn--outline-blue">Learn More</a>
                                        </div>
                                    </div>
                                </div>';

        return $this->corp_signup_box_html;

	}

}