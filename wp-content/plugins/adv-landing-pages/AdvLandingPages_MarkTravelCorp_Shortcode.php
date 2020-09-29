<?php


    include_once('AdvLandingPages_ShortCodeScriptLoader.php');

class AdvLandingPages_MarkTravelCorp_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

	public $choose_list_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_register_style( 'landing-page-partners', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners.css' );
            wp_register_style( 'landing-page-marktravel', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners--marktravel.css');

            $styles = array('landing-page-marktravel', 'landing-page-partners');
            wp_enqueue_style($styles);
        }
    }

	public function handleShortcode($atts) {

        extract( shortcode_atts( array(
            'promocode' => ''
        ), $atts ) );
        
        $this->mark_travel_html = '
            <div class="aez-partners-feature">
                <div class="aez-partners-feature__hero">
                    <div class="aez-partners-feature__hero-gradient"></div>
                    <div class="aez-partners-feature__hero-content">
                        <h2>We Make Vacation Dreams Come True</h2>
                    </div>
                </div>

                <div class="aez-partners-feature__container">
                    <div class="aez-partners-feature__form aez-partners--primary-bg-color">
                        <div class="aez-partners-feature__form-promo aez-partners--promo-bg-color">
                            <p>Enter this promo code for an instant discount!</p>
                            <div class="code">'.$promocode.'</div>
                        </div>'.do_shortcode("[adv-find-a-car-world-wide promocode='$promocode']").'
                    </div>

                    <div class="aez-partners-feature__content">
                        <img class="aez-partners-feature__content-logo" src="'. plugin_dir_url( __FILE__) .'assets/partners/mark-travel/logo-horizontal.png" alt="MarkTravel Logo">
                        <h3 class="aez-partners-feature__content-title">Mark Travel Partners With Advantage Rent A Car</h3>
                        <p class="aez-partners-feature__content-copy">The people of The Mark Travel Corporation have proudly served millions of satisfied vacationers since 1974. From the moment a customer dreams about a vacation to the time they return home to recall their special vacation memories and start dreaming about the next, we deliver the ultimate "end-to-end" experience.</p>
                        <div class="aez-partners-feature__content-promo">
                            <div class="code aez-partners--promo-bg-color aez-partners--arrow-promo-bg-color"><span>'.$promocode.'</span></div>
                            <p>Enter this promo code for an instant discount!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="aez-partners-stacking aez-partners--stacking-rewards-bg-color">
                <div class="aez-partners-stacking__container">
                    <div class="aez-partners-stacking__header">
                        <h3 class="aez-partners-stacking__header-title">Start Stacking Your Rewards!</h3>
                        <h4 class="aez-partners-stacking__header-subtitle aez-partners--primary-color">For Business & Leisure Travelers</h4>
                    </div>
                    <div class="aez-partners-stacking__equation">
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--partner-logo"></div>
                        <i class="fa fa-plus aez-partners-stacking__equation-symbol aez-partners--primary-color"></i>
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--advantage-logo"></div>
                        <span class="aez-partners-stacking__equation-symbol aez-partners-stacking__equation-symbol--equals aez-partners--primary-color">
                          <i class="fa fa-minus"></i>
                          <i class="fa fa-minus"></i>
                        </span>
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--person"></div>
                    </div>
                    <p class="aez-partners-stacking__copy">Marktravel.com cusotmers earn even more when they sign up for Advantage Expressway.</p>
                    <ul class="aez-partners-stacking__bullets">
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">Free Upgrade</p>
                                <p class="aez-partners-stacking__bullet-content-copy">Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!</p>
                            </div>
                        </li>
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">Free Day</p>
                                <p class="aez-partners-stacking__bullet-content-copy">Earn a free day during an upcoming rental period.</p>
                            </div>
                        </li>
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">Free Weekend.</p>
                                <p class="aez-partners-stacking__bullet-content-copy">Earn a free weekend during an upcoming rental period.</p>
                            </div>
                        </li>
                    </ul>
                    <div class="aez-partners-stacking__adv-awards">
                        <h4 class="aez-partners-stacking__adv-awards-title">Advantage Expressway</h4>
                        <a href="sign-up" class="aez-partners-stacking__adv-awards-button aez-partners--sigh-up">Sign Up Now!</a>
                    </div>
                </div>
            </div>
            <div class="aez-partners-questions">
                <div class="aez-partners-questions__header">
                    <div class="aez-partners-questions__header-car"></div>
                    <h3 class="aez-partners-questions__header-title">Have Questions About Enrollment?</h3>
                </div>
                <div class="aez-partners-questions__content">
                    <p class="aez-partners-questions__content-copy">Email us Monday through Friday and we’ll help you choose the program that’s right for you!</p>
                    <a href="mailto:expressway@advantage.com" class="aez-partners-questions__content-button aez-partners--awards">expressway@advantage.com</a>
                </div>
            </div>';

        return $this->mark_travel_html;

	}

}