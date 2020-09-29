<?php


    include_once('AdvLandingPages_ShortCodeScriptLoader.php');

class AdvLandingPages_ExpresswayPitStopAward_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

	public $expressway_pitstop_html;
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

        // extract( shortcode_atts( array(
        //     'promocode' => ''
        // ), $atts ) );


        if (isset($_SESSION['adv_login']) && (isset($_SESSION['adv_login']->memberNumber) && $_SESSION['adv_login']->memberNumber !== "")) {
            $member_number = $_SESSION['adv_login']->memberNumber;
        }

        $this->expressway_pitstop_html = '
            <div class="aez-partners-feature">
                <div class="aez-partners-feature__hero">
                    <div class="aez-partners-feature__hero-gradient"></div>
                    <div class="aez-partners-feature__hero-content">
                        <h2>Enjoy a Pitstop Reward everytime<br> you rent with us this summer.</h2>
                    </div>
                </div>

                <div class="aez-partners-feature__container pit_stop_landing_container">
                    <div class="aez-partners-feature__content" style="margin: auto; width: 80%; text-align: center; padding-bottom: 0;">
                       <a href="/expressway/benefits" target="_blank"><img class="aez-partners-feature__content-logo" src="'. plugin_dir_url( __FILE__) .'assets/expressway/expressway_logo.png" alt="Expressway Logo"></a>
                        <h3 class="pit_stop_h3 aez-partners-feature__content-title">Exclusive Offer for Expressway Members</h3>
                        <p class="aez-partners-feature__content-copy" style="margin-bottom: 10px;">
                            Our Pitstop Award is so popular that we want to offer it to all of our Expressway members on every rental all summer long. If you haven\'t yet earned a Pitstop Reward, here\'s how it works:<br>
                            Bring the vehicle back to us as is and we\'ll fill it up for you. You\'ll pay $2.50 per gallon for used fuel and we\'ll just attach it to your bill.<br>
                            This offer is limitless but not endless. Offer ends on August 31,2019.<br>';

                            if (isset($member_number) && $member_number !== "") {
                                $this->expressway_pitstop_html .= '
                                    <form id="expressway_pitstop" class="aez-form aez-sign-up-form">
                                        <div style="text-align: center;"> <button type="submit" style="width: 50%; margin: auto; padding: 0.75em 0;" class="aez-btn aez-btn--filled-blue">Register</button> </div>
                                    </form>
                        </p>
                    </div>
                </div>
            </div>';
                            } else {
                                 $this->expressway_pitstop_html .= '
                                    <p style="margin-bottom: 1em;" class="red-text">Note: You need to be logged into your Rewards account to register.</p>
                                    <div style="text-align: center;"> <button id="landing_page" type="button" class="aez-btn aez-btn--filled-green aez-site-footer__button pum-trigger" style="margin: 0%; width:40%; cursor: pointer;">LOG IN</button></div>
                        </p>
                    </div>
                    <div class="aez-partners-feature__content" style="margin: auto; width: 80%; text-align: left;">
                                    <p style="color: #003366; text-align: left; font-size: 1.1em; font-weight: 600; margin: 0;">Terms & Conditions<br></p>
                                    <p class="aez-partners-feature__content-copy" style="font-size: 0.76em; text-align: left; margin: 0;"> By registering for this promotion, you acknowledge and agree to the following terms: 
                                    <ol class="aez-partners-feature__content-copy" style="font-size: 0.74em; padding: 0px 0px 0px 16px; margin: 0; text-align: justify;">
                                        <li>After registering, you will receive 1 (one) Pit Stop reward through your Expressway member account.</li>
                                        <li>After registering, you will receive 1 (one) additional Pit Stop reward through your Expressway member account for every rental contract opened between the date of registration and the end of the promotion on August 31, 2019.</li>
                                        <li>Pit Stop Rewards earned through this promotion will expire on August 31, 2019 and cannot be used after that date.  Unused promotional Pit Stop Rewards or promotional Pit Stop Rewards applied to unused reservations cannot be reapplied to your Expressway account after August 31, 2019.</li>
                                        <li>Your first promotional Pit Stop Reward will be automatically applied to your next booking through the Advantage Rent A Car website, but you have the option to remove that reward at the time of booking to save it for a future reservation booked before August 31, 2019.</li>
                                        <li>Expressway Rewards can be applied to reservations for Advantage Rent A Car U.S. locations at the time of booking.</li>
                                        <li>Expressway Rewards cannot be combined with other discounts or promotions unless otherwise indicated.</li>
                                        <li>If a Pit Stop Reward is applied to a rental, you may return the car with less fuel than it had when you received it without incurring a penalty refueling fee.  You will be charged $2.50 per gallon for fuel used.  For example, if you receive a car with a full 10-gallon tank, and return the car with only 9 gallons of fuel, then you would be charged $2.50 for 1 gallon (plus mandatory taxes and fees).</li>
                                        <li>The Pit Stop Reward can only be used to alter the fuel charge for vehicles that take gasoline.  Vehicles that take diesel fuel are not eligible for the Pit Stop Reward.</li>
                                        <li>This promotion ends on August 31, 2019.  Registrations and open rental contracts that occur after this date will not yield additional Pit Stop Rewards per the terms of this promotion.</li>
                                        <li>All other <a href="/terms-and-conditions-expressway/">Expressway Terms and Conditions</a> apply.
                                        <li>For questions or concerns, please e-mail <a href="mailto:expressway@advantage.com">expressway@advantage.com</a> for assistance.</li>
                                    </ol></p>
                    </div>
                </div>
            </div>';
                            }

        return $this->expressway_pitstop_html;

	}

}