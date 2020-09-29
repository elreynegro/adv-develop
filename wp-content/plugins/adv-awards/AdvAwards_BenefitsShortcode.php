<?php

    include_once('AdvAwards_ShortCodeScriptLoader.php');
    include_once('AdvAwards_Helper.php');
 
class AdvAwards_BenefitsShortcode extends AdvAwards_ShortCodeScriptLoader {

    public $awards_benegits_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_style('awards-header', plugins_url('css/awards-header.css', __FILE__), false,'1.1','all');
            wp_enqueue_style('awards-activity', plugins_url('css/awards-activity.css', __FILE__), false,'1.1','all');
            wp_enqueue_style('awards-benefits', plugins_url('css/awards-benefits.css', __FILE__), false,'1.1','all');
            wp_enqueue_script('awards-javascript', plugins_url('js/adv_awards.js', __FILE__), array('jquery'), '1.0', true);
         }
    }

 public function handleShortcode($atts) {

    if(isset($_SESSION['adv_login'])) { 
      if(isset($_SESSION['adv_login']->memberNumber))
        $member_number = $_SESSION['adv_login']->memberNumber;
    }

    $this->awards_benefits_html = '
    <div id="benefits" style="padding-left: 0% !important; padding-right: 0% !important;">';
    if (!isset($member_number)) {
    $this->awards_benefits_html .= '
    <div class="visible-xs header_no_desktop">               
                  <span style="padding-right: 1%; margin-left: -7%;">
                     <a class="benefits" href="/expressway/benefits">BENEFITS</a>
                  </span>
                  <div class="header_division_tablets">
                  <span>
                      <a class="faq" href="/expressway/faq">FAQS</a>
                  </span></div>
    </div>
        <div class="bg-super-light-gray mt-5 pb-4">
        <div class="text-center w-75 mx-auto" >
            <p class="h1 line-space font-weight-bold" style="color:#036;font-size: 45px;margin-top:30px;font-weight: 500!important;" >Get the Most of your <span style="white-space: nowrap;">Membership</span></p>
            <p class="line-space h4 "><a class="btn btn-lg bg-green btn-medium signup_menu" href="javascript:void(0);" style="height: 50px; line-height: 33px; width: 300px; font-size: 1.5em!important; padding-top: 10px">SIGN UP FOR FREE NOW!</a>
            </p>
            <p class="h2 font-weight-light line-space" style="color:#036; padding-top: 10px" >
                      With the Expressway program, you get a FREE reward instantly, every time you rent.<br>  No complicated program rules.  No points to earn.
            </p>
            <p class="h3 font-weight-bold line-space" style="color:#036;">And best of all, no waiting!</p>

            <div class="row w-75 mx-auto">
                <div class="col-md-4">
                    <div class="text-center">
                        <div class="">
                            <div><img src="/wp-content/themes/twentysixteen-child/assets/icon1.png"></div>
                            <h2>Free Days</h2>
                            <p class="h4 font-weight-light" style="color:#036;">Make your rental cost efficient!</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-center">
                        <div class="">
                            <div><img src="/wp-content/themes/twentysixteen-child/assets/icon2.png"></div>
                            <h2>Free Upgrades</h2>
                            <p class="h4 font-weight-light" style="color:#036;">Ride in style with more room!</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-center">
                        <div class="">
                            <div><img src="/wp-content/themes/twentysixteen-child/assets/icon3.png"></div>
                            <h2>Free <span style="white-space: nowrap;">Weekends</span></h2>
                            <p class="h4 font-weight-light" style="color:#036;">For those extended vacations!</p>
                        </div>
                    </div>
                </div>
            </div>

            <p style="font-size: 40px;font-weight: bold;color: #036;margin-top: 15px;margin-bottom: 0px;">AND MORE!</h1>

            <div>
                <p class="line-space h3 font-weight-light" style="color:#036;font-size: 26px; padding-top: 10px;margin-top: 5px;">
                It&#39;s that simple. Sign up today and we&#39;ll give you your first reward to use with your next rental.
                You will then receive one random reward for each rental. The more you rent, the more rewards you receive. And, each rental counts towards your next tier status where each tier provides additional Expressway member benefits.
                 </p>
                <p class="line-space h4 "><a class="btn btn-lg bg-green btn-medium signup_menu" href="javascript:void(0);" style="height: 50px;line-height: 33px;width: 300px;font-size: 1.5em!important;">SIGN UP FOR FREE NOW!</a>
                </p>
            </div>
        </div>
        </div>
        ';
    }

    else {
      $this->awards_benefits_html .= '
      <div class="visible-xs header_no_desktop"  style="margin-bottom: 4%;">
                <span style="padding-right: 1%; padding-left: 2%;"><a class="awards" href="/expressway">EXPRESSWAY</a>
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
                </span></div></div>
        <div class="aez-awards-promo text-center" style="display: -webkit-inline-box; width:-webkit-fill-available;">
        <div style="margin: auto;">
        <h2>Expressway Program</h2>
          <h3>Increase Your ROL</h3>
          <h4>Return On Loyalty</h4>

          <div class="row aez-promo-blocks">
            <div class="col-sm-4">
              <i class="fa fa-car" aria-hidden="true"></i>
              <div>
                <span>Free Upgrade</span>
                <p>
                   Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!
                </p>
              </div>
            </div>

            <div class="col-sm-4">
              <i class="fa fa-tag" aria-hidden="true"></i>
              <div>
                <span>Free Day</span>
                <p>
                    Earn a free day for an upcoming rental period when you’re signed up for Advantage Expressway.
                </p>
              </div>
            </div>

            <div class="col-sm-4">
              <i class="fa fa-calendar" aria-hidden="true"></i>
              <div>
                <span>Free <span style="white-space: nowrap;">Weekend</span></span>
                <p>
                  Earn a free weekend for an upcoming rental period when you&#39;re signed up for Advantage Expressway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>';
    }

     $this->awards_benefits_html .= '<div class="w-75 mx-auto" style="background-color:#fff"><div class="container-fluid-two"><p class="font-weight-bold text-center" style="color:#036;font-size:50px;line-height:1.3;">How Do You Benefit?</p>
        <div id="benefits-table" class="text-center">
            <div class="row row-header line-space">
                <div class="col-m-12 col-lg-6 description hidden-xs hidden-m"><span><b>MEMBERSHIP BENEFIT DESCRIPTION</b></span></div>
                <div class="col-m-12 col-lg-6 ">
                    <div class="row">
                        <div class="col-3 base"><span><b>BASE</b><br>1-2 rentals</span></div>
                        <div class="col-3 silver"><span><b>SILVER</b><br>3-4 rentals</span></div>
                        <div class="col-3 gold"><span><b>GOLD</b><br>5-6 rentals</span></div>
                        <div class="col-3 platinum"><span><b>PLATINUM</b><br>7+ rentals</span></div>
                    </div>
                </div>
            </div>
            <div class="row row-body">
                <div class="col-sm-12 col-lg-6 description"><span>Enrollment bonus Reward<br />(Free Day or Basic Upgrade)</span></div>
                <div class="col-sm-12 col-lg-6">
                    <div class="row">
                        <div class="col-3 base"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 silver"><span>&nbsp;</span></div>
                        <div class="col-3 gold"><span>&nbsp;</span></div>
                        <div class="col-3 platinum"><span>&nbsp;</span></div>
                    </div>
                </div>
            </div>
            <div class="row row-body">
                <div class="col-sm-12 col-lg-6 description"><span>Instant Reward earned with every rental<br />(earned after rental pickup)</span></div>
                <div class="col-sm-12 col-lg-6">
                    <div class="row">
                        <div class="col-3 base"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 silver"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 gold"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 platinum"><span><i class="fa fa-check"></i></span></div>
                    </div>
                </div>
            </div>
            <div class="row row-body">
                <div class="col-sm-6 col-sm-12 col-lg-6 description">
            <span>ONE Pit Stop Reward <div class="popover__wrapper"><i class="fa fa-question-circle"><h2 class="popover__title"></h2></i>
               <div class="push popover__content">
               <p class="popover__message">Bring the vehicle back to us as is and we’ll fill it up. You’ll pay $2.50 per gallon for used fuel and we’ll just attach it to your bill.</p>
               </div></div>
            </span>
                </div>
                <div class="col-sm-6 col-sm-12 col-lg-6">
                    <div class="row">
                        <div class="col-3 base"><span>&nbsp;</span></div>
                        <div class="col-3 silver"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 gold"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 platinum"><span>&nbsp;</span></div>
                    </div>
                </div>
            </div>
            <div class="row row-body">
                <div class="col-sm-6 col-sm-12 col-lg-6 description"><span>Pit Stop Reward on every rental</span></div>
                <div class="col-sm-6 col-sm-12 col-lg-6">
                    <div class="row">
                        <div class="col-3 base"><span>&nbsp;</span></div>
                        <div class="col-3 silver"><span>&nbsp;</span></div>
                        <div class="col-3 gold"><span>&nbsp;</span></div>
                        <div class="col-3 platinum"><span><i class="fa fa-check"></i></span></div>
                    </div>
                </div>
            </div>
            <div class="row row-body">
                <div class="col-sm-6 col-sm-12 col-lg-6 description"><span>Choose your perk<br><span>(ONE choice of: GPS, toll pass or car seat)</span></span>
                </div>
                <div class="col-sm-6 col-sm-12 col-lg-6">
                    <div class="row">
                        <div class="col-3 base"><span>&nbsp;</span></div>
                        <div class="col-3 silver"><span>&nbsp;</span></div>
                        <div class="col-3 gold"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 platinum"><span><i class="fa fa-check"></i></span></div>
                    </div>
                </div>
            </div>
            <div class="row row-body">
                <div class="col-sm-6 col-sm-12 col-lg-6 description"><span>Expressway Lane</span></div>
                <div class="col-sm-6 col-sm-12 col-lg-6">
                    <div class="row">
                        <div class="col-3 base"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 silver"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 gold"><span><i class="fa fa-check"></i></span></div>
                        <div class="col-3 platinum"><span><i class="fa fa-check"></i></span></div>
                    </div>
                </div>
            </div>
        </div>

        <p>&nbsp;</p>
    </div>
    </div>

    <div class="w-75 mx-auto" style="background-color:#fff">
        <div class="summary_head">
        <h2>Expressway Reward Summaries</h2>
        </div>
        <div class="container-fluid-two">

            <!-- BASE SECTION -->
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head base_new"><span>Basic Upgrade</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc base_new"><span>The Basic Upgrade Reward will upgrade your vehicle to the next available vehicle class when you arrive at the counter. You can apply your Basic Upgrade Reward to a reservation for an economy car, a compact car, an intermediate car, or a standard car to receive up to a full-size car. Please note that this Reward cannot be applied to a full-size car, a "Manager\'s Choice" or any other car class. All Expressway members are eligible to receive the Basic Upgrade Reward.</span></div>
            </div>
                <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head base_new"><span>Free Day</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc base_new"><span>The Free Day Reward will remove 1 day’s rate from a rental at least 2 days (48 hours) in length. You would need to pay for at least 1 day plus mandatory local taxes and fees. All Expressway members are eligible to receive the Free Day Reward.</span></div>
            </div>
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head base_new"><span>Free Weekend</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc base_new"><span>The Free Weekend Reward will remove the cost of 2 days from a rental at least 3 days (72 hours) in length. The rental period must include a full weekend (Saturday and Sunday). You would need to pay for at least 1 day plus mandatory local taxes and fees. All Expressway members are eligible to receive the Free Weekend Reward.</span></div>
            </div>
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head base_new"><span>Advantage Expressway</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc base_new"><span>All Expressway members will have access to Advantage Expressway – a speedy-checkout line is currently available at the following locations: MCO, LAS, HNL, PHX, LAX, and SFO.</span></div>
            </div>
            <!-- END BASE SECTION -->

            <!-- SILVER SECTION -->
           
            <!-- END SILVER SECTION -->

            <!-- GOLD SECTION -->
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head gold_new"><span>Free Toll Pass</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc gold_new"><span>The Free Toll Pass Perk will apply our toll package to your rental for free. The toll package allows you to drive through unlimited tolls at no extra charge. The Free Toll Pass perk is only available for Gold and Platinum Expressway members.</span></div>
            </div>
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head gold_new"><span>Free Child’s Car Seat</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc gold_new"><span>The Child’s Car Seat Perk will grant you 1 free car seat for your rental. The Child’s Car Seat perk is only available for Gold and Platinum Expressway members.</span></div>
            </div>
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head gold_new"><span>Free GPS Navigation</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc gold_new"><span>The GPS Perk will grant you 1 free modular GPS unit for your rental. The GPS perk is only available for Gold and Platinum Expressway members.</span></div>
            </div>
            <!-- END GOLD SECTION -->

            <!-- PLATINUM SECTION -->
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head platinum_new"><span>Pit Stop</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc platinum_new"><span>The Pit Stop Reward is the only Reward that can be combined with other Rewards. If you return the car with less than a full tank of gas, you will be charged only for the gas that you used at a rate of $2.50 per gallon. You will receive one Pit Stop Reward upon reaching the Silver or Gold membership tier levels. If you are at the Platinum tier level, you will have the option to apply the Pit Stop Reward to each and every rental. <br><br>
                Please note the Pit Stop Reward cannot be used if you are renting a car that takes diesel fuel.</span></div>
            </div>
            <div class="row summary">
                <div class="col-md-3 col-md-pull-9 summary_table_head platinum_new"><span>Platinum Upgrade</span></div>
                <div class="col-md-9 col-md-push-3 summary_table_desc platinum_new"><span>The Platinum Upgrade Reward will upgrade your vehicle to the next available vehicle class. Unlike the Basic Upgrade Reward, the Platinum Upgrade Reward can also be applied to full-size cars, premium cars, intermediate SUVs, and standard minivans. When you arrive at the counter, you could receive up to a premium car, intermediate SUV, standard SUV, standard minivan, or premium minivan.</span></div>
            </div>
            <!-- END PLATINUM SECTION -->
        </div>
    </div>
    <div class="ng-isolate-scope">
        <div class="text-center bg-super-light-gray" style="display: flow-root;">
            <p class="text-center" style="color:#036;font-size: 41px;margin-top:30px;font-weight: 500!important;">Not the right program for you?</p>
          
             <p class="h3 font-weight-light" style="color:#036;font-size: 26px;">Advantage has multiple loyalty programs to choose from.</p>
            <div class="row awards-benefit-logos w-75 mx-auto">
                <div class="col-md-6">
                    <div class="text-center mt-2">
                        <div class="">
                            <div><a ui-sref="benefits.bookfriendly" href="/book-friendly"><img src="/wp-content/plugins/adv-awards/assets/logo-advantage-book-friendly.png"></a>
                            </div>
                            <p class="line-space mt-2 h3 font-weight-light" style="color:#036;font-size: 23px;width: 250px;margin: 0 auto;font-weight: 400!important;">For Travel Agents &amp; Tour Operations</p>
                            <p class="line-space mt-2"><a style="height: 52px;font-size: 17px;width: 254px;line-height: 36px;" class="btn btn-default btn-blue-medium" href="/book-friendly">Learn More</a></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="text-center mt-2">
                        <div class="">
                            <div><a ui-sref="benefits.corporate" href="/corporate-advantage"><img src="/wp-content/plugins/adv-awards/assets/logo-corporate-advantage.png"></a>
                            </div>
                            <p class="line-space mt-2 h3 font-weight-light" style="color:#036;font-size: 23px;width: 250px;margin: 0 auto;font-weight: 400!important;">For Business &amp; Corporate Travelers</p>
                            <p class="line-space mt-2"><a style="height: 52px;font-size: 17px;width: 254px;line-height: 36px;"  class="btn btn-default btn-blue-medium" href="/corporate-advantage">Learn More</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>';
        return $this->awards_benefits_html;
        }

}
