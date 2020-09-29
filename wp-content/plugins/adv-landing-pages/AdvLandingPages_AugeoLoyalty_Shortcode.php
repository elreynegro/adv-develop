<?php

include_once('AdvLandingPages_ShortCodeScriptLoader.php');

class AdvLandingPages_AugeoLoyalty_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

	public $augeo_loyalty_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_register_style( 'landing-page-partners-augeoloyalty', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners--augeoloyalty.css');
            wp_register_style( 'landing-page-partners', plugin_dir_url( __FILE__) . 'css/aez-landing-page-partners.css' );

            $styles = array('landing-page-partners-augeoloyalty', 'landing-page-partners');
            wp_enqueue_style($styles);
        }
    }

	public function handleShortcode($atts) {

        extract( shortcode_atts( array(
            'promocode' => ''
        ), $atts ) );

        $this->augeo_loyalty_html = '
            <div class="aez-partners-feature">
                <div class="aez-partners-feature__hero">
                    <div class="aez-partners-feature__hero-gradient"> </div>
                    <!-- <div> <h2 class="azul-airlines">Bem-Vindos To Value!</h2> </div>-->
                    <div class="aez-partners-feature__hero-content">
                    </div>
                </div>

                <div class="aez-partners-feature__container">
                    <div class="aez-partners-feature__form aez-partners--primary-bg-color hawaiian-error">
                        <div class="aez-partners-feature__form-promo aez-partners--promo-bg-color">
                            <p>Enter this promo code for an instant discount!</p>
                            <div class="code">'.$promocode.'</div>
                        </div>'.do_shortcode("[adv-find-a-car-world-wide reference='' promocode='$promocode']").'
                    </div>

                    <div class="aez-partners-feature__content">
                        <img class="aez-partners-feature__content-logo" src="'. plugin_dir_url( __FILE__) .'assets/partners/augeo-loyalty/advantage-logo.png" alt="Advantage Logo">
                        <img class="aez-partners-feature__content-logo" src="'. plugin_dir_url( __FILE__) .'assets/partners/augeo-loyalty/augeo-logo.png" alt="Augeo Logo">
                                <p align="justify" class="aez-partners-feature__content-copy"><br> Welcome to Advantage Rent A Car, where we want you to have the best rental experience possible.<br><br>
                                    When renting from Advantage you will get:<br>
                                    A car that is ready when you arrive<br>
                                    A new or almost new clean car as we have one of the newest, most diverse fleets in the U.S.<br>
                                    And a friendly staff ready and willing to make your experience a pleasurable one</p>
                       
                    </div>
                </div>
            </div>
            <div class="aez-partners-stacking aez-partners--stacking-rewards-bg-color">
                <div class="aez-partners-stacking__container">
                    <div class="aez-partners-stacking__header">
                        <h3 class="aez-partners-stacking__header-title azul_stacking_header">Start Stacking Your Rewards!</h3>
                        <h4 class="aez-partners-stacking__header-subtitle aez-partners--primary-color">For Business & Leisure Travelers</h4>
                    </div>
                    <div class="aez-partners-stacking__equation">
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--partner-logo"></div>
                        <i class="fa fa-plus aez-partners-stacking__equation-symbol aez-partners--primary-color-azul"></i>
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--advantage-logo"></div>
                        <span class="aez-partners-stacking__equation-symbol aez-partners-stacking__equation-symbol--equals aez-partners--primary-color-azul">
                          <i class="fa fa-minus"></i>
                          <i class="fa fa-minus"></i>
                        </span>
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--person"></div>
                    </div>
                    <p class="aez-partners-stacking__copy">Earn even more when you sign up for Advantage Expressway.</p>
                    <ul class="aez-partners-stacking__bullets">
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color-azul"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">Free Upgrade</p>
                                <p class="aez-partners-stacking__bullet-content-copy">Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!</p>
                            </div>
                        </li>
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color-azul"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">Free Day</p>
                                <p class="aez-partners-stacking__bullet-content-copy">Earn a free day during an upcoming rental period.</p>
                            </div>
                        </li>
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color-azul"></i>
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
                    <p class="aez-partners-questions__content-copy">Call us between 8:00 am and 5:30 pm EST Monday through Friday and we&apos;ll help you choose the program that&apos;s right for you!</p>
                    <a href="tel:+18007775500" class="aez-partners-questions__content-button aez-partners--awards"> (800) 777-5500 </a>
                </div>
            </div>';

        try{
            $file_name= 'url_data.txt';
            //echo $file_name;
            $full_url = $_SERVER['QUERY_STRING'];
            //echo $full_url;
            $datetime = date('m/d/Y h:i:s a', time());
            $current_info = file_get_contents($file_name);
            $current_info .= PHP_EOL . $datetime . "; URL: " . $full_url . PHP_EOL;
            file_put_contents($file_name, $current_info);
        }catch(Exception $e){
        }

        return $this->augeo_loyalty_html;

	}

}