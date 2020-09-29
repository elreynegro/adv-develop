<?php

    include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_SignupBookFriendlyShortcode extends Adv_login_ShortCodeScriptLoader {

	public $book_friendly_signup_box_html;
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

    _ltk.SCA.CaptureEmail('email');
    /********** End Custom Code **********/ 
});
</script>

<?php
        $this->book_friendly_signup_box_html = '<div id="primary">
                                    <div class="aez-secondary-header" style="
                                        background-image: url(/wp-content/themes/twentysixteen-child/assets/men_shaking_hands.png);
                                    ">
                                        <div class="aez-gradient">
                                            <h1>Book Friendly</h1>
                                        </div>
                                    </div>

                                    <div class="aez-sign-up-form">
                                        <form id="book-friendly-sign-up" action="/" class="aez-form">
                                            <span class="-blue aez-all-caps" style="margin-bottom:10px;">Sign Up For <div style="color: #036; display: inline; font-size: 1.2em;">Book Friendly</div>
                                            </span>
                                            <div class="aez-form-block">
                                                <h4 class="-dark-blue">My Profile</h4>
                                                <div class="aez-form-item">
                                                    <label for="first_name" class="aez-form-item__label">First Name<sup>*</sup></label>
                                                    <input
                                                        id="first_name"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="first_name"
                                                        pattern="^([^0-9]*)$"
                                                        placeholder="First Name"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label>
                                                    <input
                                                        id="last_name"
                                                        type="text"
                                                        class="aez-form-item__input"
                                                        name="last_name"
                                                        pattern="^([^0-9]*)$"
                                                        placeholder="Last Name"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="email" class="aez-form-item__label">Email<sup>*</sup></label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        class="aez-form-item__input"
                                                        name="email"
                                                        placeholder="Email"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="confirm_email" class="aez-form-item__label">Confirm Email<sup>*</sup></label>
                                                    <input
                                                        id="confirm_email"
                                                        type="email"
                                                        class="aez-form-item__input"
                                                        name="confirm_email"
                                                        placeholder="Confirm Email"
                                                        required
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
                                                    <label for="confirm_password" class="aez-form-item__label">Confirm Password<sup>*</sup></label>
                                                    <input
                                                        id="confirm_password"
                                                        type="password"
                                                        class="aez-form-item__input"
                                                        name="confirm_password"
                                                        placeholder="Confirm Password"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="phone_number" class="aez-form-item__label">Phone Number<sup>*</sup></label>
                                                    <input
                                                        id="phone_number"
                                                        type="tel"
                                                        class="aez-form-item__input"
                                                        name="phone_number"
                                                        placeholder="Phone Number"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="confirm_phone_number" class="aez-form-item__label">Confirm Phone Number<sup>*</sup></label>
                                                    <input
                                                        id="confirm_phone_number"
                                                        type="tel"
                                                        class="aez-form-item__input"
                                                        name="confirm_phone_number"
                                                        placeholder="Confirm Phone Number"
                                                        required
                                                    />
                                                </div>
                                                <div class="aez-form-item">
                                                    <label for="iata" class="aez-form-item__label">IATA<sup>*</sup></label>
                                                    <input
                                                        id="iata"
                                                        type="tel"
                                                        class="aez-form-item__input"
                                                        name="IATA"
                                                        placeholder="IATA"
                                                        required
                                                    />
                                                </div>
                                            <div class="aez-form-block -checkbox">
                                                <div class="aez-form-item--checkbox-cont">
                                                    <input
                                                        id="read_location_policy"
                                                        type="checkbox"
                                                        class="aez-form-item__checkbox"
                                                        name="read_location_policy"
                                                    />
                                                    <label for="read_location_policy" class="aez-form-item__label">I agree with the <a href="/terms-and-conditions-book-friendly/" class="-green" target=_blank>Terms and Conditions</a> of the Book Friendly Program. *</label>
                                                </div>
                                                <button type="submit" class="aez-btn aez-btn--filled-green">Submit</button>
                                            </div>
                                        </form>
                                    </div>

                                    <!-- Book Friendly -->
                                    <div class="aez-checklist-image -booking">
                                        <div class="aez-check-image">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/arrow.png" alt="Illustration of a group of a paper airplane." />
                                            <div class="aez-sub-info">
                                                <h3 class="-dark-blue">Book Friendly</h3>
                                                <h4 class="-green">For Travel Agents & Tour Operations</h4>
                                            </div>

                                            <!-- Checklist -->
                                            <div class="aez-checklist">
                                                <div class="aez-check-block">
                                                    <i class="fa fa-check"></i>
                                                    <div>
                                                        <h3>Free Day &amp; Double Commission</h3>
                                                        <p>Enroll now and get a FREE Day and Double Commission: 5% base plus 5% bonus.</p>
                                                    </div>
                                                </div>
                                                <div class="aez-check-block">
                                                    <i class="fa fa-check"></i>
                                                    <div>
                                                        <h3>Discounts on Rentals</h3>
                                                        <p>Enroll a Small Business Client in Advantage for Business, and when you book their rental you earn a FREE day!</p>
                                                    </div>
                                                </div>
                                                <div class="aez-check-block">
                                                    <i class="fa fa-check"></i>
                                                    <div>
                                                        <h3>Earn More Free Days</h3>
                                                        <p>Enroll your customers in the Expressway Loyalty Program, and when you book their rental you can earn a FREE day!</p>
                                                    </div>
                                                </div>
                                            </div> <!-- End Checklist -->
                                        </div>
                                    </div> <!-- End Book Friendly -->

                                    <div class="aez-learn">
                                        <div>
                                            <h2 class="-dark-blue">Not The Right Program For You?</h2>
                                            <p class="-green">Advantage has multiple loyalty programs to choose from:</p>
                                        </div>

                                        <div class="aez-learn-block">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/corporate_people_blue.png" alt="Illustration of a person with a beach ball." />
                                            <h2 class="-dark-blue">Corporate Advantage</h2>
                                            <h3 class="-green">
                                                For Corporations
                                            </h3>
                                            <a href="/corporate-advantage" class="aez-btn aez-btn--outline-blue">Learn More</a>
                                        </div>

                                        <div class="aez-learn-block">
                                            <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
                                            <h2 class="-dark-blue">Expressway Program</h2>
                                            <h3 class="-green">
                                                For Business &amp; Leisure Travelers
                                            </h3>
                                            <a href="' . $persuade_url . '" class="aez-btn aez-btn--outline-blue">Learn More</a>
                                        </div>
                                    </div>
                                </div>';

        return $this->book_friendly_signup_box_html;

	}

}