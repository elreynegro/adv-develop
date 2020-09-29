<?php

    include_once('AdvAwards_ShortCodeScriptLoader.php');
    include_once('AdvAwards_Helper.php');
 
class AdvAwards_FaqShortcode extends AdvAwards_ShortCodeScriptLoader {

    public $faq_awards_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('awards-javascript', plugins_url('js/adv_awards.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_style('awards-header', plugins_url('css/awards-header.css', __FILE__), false,'1.1','all');
            wp_enqueue_style('awards-faq', plugins_url('css/awards-faq.css', __FILE__), false,'1.1','all');
            wp_register_script( 'find-a-car-form', get_stylesheet_directory_uri() . '/js/find-a-car-worldwide-form.js', array('jquery'), null, true );
         }
    }

    public function handleShortcode($atts) {

        if(isset($_SESSION['adv_login'])) { 
          if(isset($_SESSION['adv_login']->memberNumber))
            $member_number = $_SESSION['adv_login']->memberNumber;
        }

       $this->faq_awards_html = '
        <div id="main">
          <div class="container-fluid" id="faq" style="padding-right: 0px !important; padding-left: 0px !important;">';
          if (!isset($member_number)) {
            $this->faq_awards_html .= '<div class="visible-xs header_no_desktop">
                  <span style="padding-right: 1%; margin-left: -7%;">
                     <a class="benefits" href="/expressway/benefits">BENEFITS</a>
                  </span>
                  <div class="header_division_tablets">
                  <span>
                      <a class="faq" href="/expressway/faq">FAQS</a>
                  </span></div>
                </div>';
            }
            else {
                $this->faq_awards_html .= '<div class="visible-xs header_no_desktop">
                <span style="padding-right: 1%; padding-left: 2%;"><a class="awards" href="/expressway">Rewards</a>
                </span>
                <div class="header_division_tablets">
                <span>
                    <a class="activity" href="/expressway/activity">ACTIVITY</a>
                </span></div>
                <div class="header_division_tablets">
                <span>
                   <a class="benefits" href="/expressway/benefits">BENEFITS</a>
                </span></div>
                <div class="header_division_tablets">
                <span>
                    <a class="faq" href="/expressway/faq">FAQS</a>
                </span></div></div>';
            }
            $this->faq_awards_html .= '<h1>Frequently Asked Questions</h1>
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Questions &amp; Answers</h3>
              </div>
              <div class="panel-body" style="font-size: 1.39em;">
                <h4 class="collapsed"><i class="fa"></i> How do I register?</h4>
                <p class="collapse expand-faq signup_menu" id="q1">Register by completing the Expressway Program enrollment form <a href="javascript:void(0);">here</a>.</p>

                <h4 class="collapsed"><i class="fa"></i> Who can participate?</h4>
                <p class="collapse expand-faq" id="q2">Anyone 21 years of age or older with a valid US driver\'s license is welcome to enroll in the program.</p>

                <h4 class="collapsed"><i class="fa"></i> How do I earn Rewards?</h4>
                <p class="collapse expand-faq" id="q3">You earn a Reward every time you rent! You must book your rental reservation on Advantage.com while logged into your account to earn a Reward for that rental. The more you rent, the more you earn. See the complete program  <a ui-sref="benefits" href="/expressway/benefits">benefits</a>.</p>

                <h4 class="collapsed"><i class="fa"></i> How do I redeem Rewards?</h4>
                <p class="collapse expand-faq" id="q4">Rewards can only be earned, redeemed and applied when booking a reservation on Advantage.com. They cannot be applied to a current reservation or at the time of pickup.</p>

                <h4 class="collapsed"><i class="fa"></i> Do my Rewards expire?</h4>
                <p class="collapse expand-faq" id="q5">Rewards expire after 12 months from date of issue.</p>

                <h4 class="collapsed"><i class="fa"></i> Can I change or transfer a Reward?</h4>
                <p class="collapse expand-faq" id="q6">Advantage determines the Reward. Rewards are not transferrable and cannot be redeemed for cash.</p>

                <h4 class="collapsed"><i class="fa"></i> How long does it take receive my Reward?</h4>
                <p class="collapse expand-faq" id="q7">It typically takes seven to ten business days after returning your rental for your Reward to post to your account.</p>

                <h4 class="collapsed"><i class="fa"></i> Can I receive Rewards for past rentals?</h4>
                <p class="collapse expand-faq" id="q8">No, only reservations booked through your account after your Expressway Program enrollment at Advantage.com qualify for Rewards.</p>

                <h4 class="collapsed"><i class="fa"></i> What if I need to change or cancel a reservation I\'ve booked with an Expressway?</h4>
                <p class="collapse expand-faq" id="q9">For assistance with your reservation, please reach out to our Expressway team at <a href="mailto: expressway@advantage.com">expressway@advantage.com</a>.</p>

                <h4 class="collapsed"><i class="fa"></i> Can my Rewards be redeemed for cash?</h4>
                <p class="collapse expand-faq" id="q10">Rewards can only be used for future rentals. They cannot be redeemed for cash.</p>

                <h4 class="collapsed"><i class="fa"></i> How can I make sure my Expressway emails don’t go into my junk folder?</h4>
                <p class="collapse expand-faq" id="q11">Please add <a href="mailto: no-reply@advantage.com">no-reply@advantage.com</a> and  and <a href="mailto: expressway@advantage.com">expressway@advantage.com</a> to your contact list.</p>

                <h4 class="collapsed"><i class="fa"></i> Are Rewards available to be redeemed at all locations?</h4>
                <p class="collapse expand-faq" id="q12">Rewards are not eligible to be applied to rentals at affiliate and international locations. Rewards can only be applied to rentals at U.S. locations that are operated by Advantage Rent A Car.</p>

                <h4 class="collapsed"><i class="fa"></i> What happens if my Rewards cannot be honored?</h4>
                <p class="collapse expand-faq" id="q13">If you don’t show up for your rental or if your upgrade or perk wasn’t available at the counter – don’t worry! Simply reach out to our Expressway team at <a href="mailto: expressway@advantage.com">expressway@advantage.com</a> and we will reapply the Reward to your account to be used on a future rental.</p>

                <h4 class="collapsed"><i class="fa"></i> Didn’t find your answer?</h4>
                <p class="collapse expand-faq" id="q14">Terms and Conditions for the Expressway Loyalty Program can be found <a href="/terms-and-conditions-expressway">here</a>. Expressway Program customer service e-mail: <a href="mailto: expressway@advantage.com">expressway@advantage.com</a>.
                </p>
            </div>
          </div>
        </div>
            ';

        return $this->faq_awards_html;

    }

}