<?php

    include_once('AdvAwards_ShortCodeScriptLoader.php');
    include_once('AdvAwards_Helper.php');
 
class AdvAwards_AwardsShortcode extends AdvAwards_ShortCodeScriptLoader {

    public $awards_awards_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('awards-javascript', plugins_url('js/adv_awards.js', __FILE__), array('jquery'), '1.0', true);
            wp_enqueue_style('awards-header', plugins_url('css/awards-header.css', __FILE__), false,'1.1','all');
            wp_enqueue_style('awards-page', plugins_url('css/awards-page.css', __FILE__), false,'1.1','all');
         }
    }

    public function handleShortcode($atts) {

      if(isset($_SESSION['adv_login'])) { 
        if(isset($_SESSION['adv_login']->memberNumber))
          $member_number = $_SESSION['adv_login']->memberNumber;
      }

      if(!isset($member_number)) {
        return do_shortcode('[adv-awards-benefits]');
      }
      else 
      {
          $awards_header_response = $_SESSION['awards_header_response'];
          $available_awards = $_SESSION['available_awards'];
          $reservation_history_response = $_SESSION['reservation_history_response'];
      }

       $this->awards_awards_html ='
        <div id="main">';
        if (isset($member_number)) {
              $this->awards_awards_html .= '<div class="visible-xs header_no_desktop" style="margin-bottom: 4%;">
              <span style="padding-right: 1%; padding-left: 2%;"><a class="awards" href="/awards">Rewards</a>
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
          $this->awards_awards_html .= '<div id="rewards">
                <div class="rewards-top">
                    <div class="container-fluid">
                        <div class="row">
                          <div id="carousel-main" class="carousel">
                              <div class="carousel-inner">
                                  <div class="item active">
                                      <img class="img-responsive" src="/wp-content/plugins/adv-awards/assets/home-carousel-car.jpg">
                                  </div>
                              </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="rewards-bottom">
                  <div class="container-fluid">

                    <reservations class="ng-isolate-scope"><h1>Reservation History</h1>
                    <span>Note: Reservations might take up to 24hrs to appear in the Reservation history.</span>
                      <table class="table table-condensed table-curved table-striped">
                        <thead style="line-height: 1.5;">
                          <tr>
                            <th class="text-center">See Details</th>
                            <th style="width: 40%;">Confirmation Number</th>
                            <th>Pickup Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>';

          if ($reservation_history_response[0]['Status'] !== "ERROR") {

            for ($x = 0; $x < count($reservation_history_response); $x++) {
              
              // Pull the date out of the PickupDate string 
              preg_match('/\d{1,2}\/\d{1,2}\/\d{4}/', $reservation_history_response[$x]['PickupDate'], $matches);

              $pickup_date = $matches[0];

              $status = AdvAwards_Helper::getStatus($reservation_history_response[$x]['Status']);

              //$awards_header_response['BestTier'] = "platnium";

              $this->awards_awards_html .= '
                        <tbody>
                          <tr class="awards-plus view" style="cursor: pointer;">
                            <td class="text-center">
                              <a href="#"><i class="fa"></i></a>
                            </td>
                            <td class="confirmation_num">'.$reservation_history_response[$x]['Confirmation'].'</td>
                            <td>'.$pickup_date.'</td>
                            <td>'.$status.'</td>
                            <td class="renter_name" style="display: none;"> '. $reservation_history_response[$x]['Renter'] . '</td>
                            <td class="rental_location" style="display: none;"> '. $reservation_history_response[$x]['PickupLocation'] . '</td>
                          </tr>
                          <tr class="expand-reservation">
                            <td>&nbsp;</td>
                            <td colspan="3" class="short-rows">
                              <div class="row">
                                <div class="one"><strong>Reservation for:</strong></div>
                                <div class="two">'.$reservation_history_response[$x]['Renter'].'</div>
                              </div>
                              <div class="row">
                                <div class="one"><strong>Pickup:</strong></div>
                                <div class="two">'.$reservation_history_response[$x]['PickupDate'].'</div>
                              </div>
                              <div class="row">
                                <div class="one"><strong>Return:</strong></div>
                                <div class="two">'.$reservation_history_response[$x]['ReturnDate'].'</div>
                              </div>
                              <div class="row">
                                <div class="one"><strong>Car Class:</strong></div>
                                <div class="two">'.$reservation_history_response[$x]['CarClass'].'</div>
                              </div>
                            </td>
                          </tr>
                        </tbody>';
            } // End For Loop

          } else {

            $this->awards_awards_html .= '
                        <tbody>
                          <tr class="awards-plus">
                            <td colspan="4" class="text-center">
                              No reservations to display.
                            </td>
                          </tr>
                        </tbody>';
          } // End If

            $this->awards_awards_html .= '
                      </table>
                    </reservations>
                    <div class="row">
                      <div class="col-12 col-lg-3 awards-book-now-btn">
                          <a nohref class="btn btn-default btn-block btn-spaced find-a-car-menu-item redeem_now" onclick="goToAnchorReserve();">Book Now</a>
                      </div>
                    </div>
                    ';

            if ((count($available_awards) > 0 && !isset($available_awards['d'][0]['Status']))) {
              $this->awards_awards_html .= '
                    <div class="aez-awards">
                      <div class="row" style="margin-left: 0px;">
                        <div class="col col-awards"><h1>Available Rewards</h1></div>
                        <div class="col text-right align-with-h2 col-awards-all"><a href="/expressway/activity">View All Reward Activity <i class="fa fa-chevron-right"></i></a></div>
                      </div>';

              $this->awards_awards_html .= '
                        <div class="row">';

              // Only loop through top three
              for ($x = 0; $x < 3; $x++) {
                 $this->awards_awards_html .= '
                     <div class="col awards-one">
                        <div class="panel reward-box text-white text-center bg-blue-dark">
                          <div class="panel-body">
                          <div><img width="90" height="90" class="award-icons" src="/wp-content/plugins/adv-awards/assets/mobile-'.$available_awards['d'][$x]['AwardType'].'.png"> </div>
                            <h3 class="text-white">'.$available_awards['d'][$x]['AwardType'].'</h3>
                            <p class="ng-binding">
                              <span class="small">Redemption Code:</span><br>
                              '.$available_awards['d'][$x]['AwardCode'].'<br>
                            </p>
                            <p class="small ng-binding">
                              Expires: '.$available_awards['d'][$x]['ExpiresOn'].'
                            </p>
                            <p><a class="btn btn-default redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$available_awards['d'][$x]['AwardCode'].'">Redeem Now</a></p>
                          </div>
                        </div>
                      </div>';
                     // Break out of the for loop if there's less than 3 awards
                      if ((count($available_awards['d']) - 1) == $x){
                        break;
                      }

              } // Exit for loop

              $this->awards_awards_html .= '
                    </div>
                  </div>
                 ';

            } // Exit if

            // Show Platinum header
            if (strtolower($awards_header_response['BestTier']) === "platinum") {

              $this->awards_awards_html .= '
              <div id="perks">
                <div class="row" style="margin-left: 0; margin-right: 0;">
                  <div style="background-color: #565656;" class="text-center bg-platinum">
                    <h2>Choose a Platinum Tier Reservation Perk</h2>
                  </div>
                </div>';

            }

            // Show Gold header
            if (strtolower($awards_header_response['BestTier']) === "gold") {

              $this->awards_awards_html .= '
              <div id="perks">
                <div class="row" style="margin-left: 0; margin-right: 0;">
                  <div style="background-color: #d69c00;" class="text-center bg-gold">
                    <h2>Choose a Gold Tier Reservation Perk</h2>
                  </div>
                </div>';

            }
            
            $perks_awards = array();
            for($x = 0; $x < count($available_awards['d']); $x++) {
              if(($available_awards['d'][$x]['IsPerk'] == 'True')) {
                if ($available_awards['d'][$x]['AwardType'] == 'Free Child Seat') {
                  if(!(array_key_exists('Free Child Seat', $perks_awards))) {
                    $perks_awards['Free Child Seat'] = $available_awards['d'][$x]['AwardCode'];
                  }
                }
                if ($available_awards['d'][$x]['AwardType'] == 'Free GPS') {
                  if(!array_key_exists('Free GPS', $perks_awards)) {
                    $perks_awards['Free GPS'] = $available_awards['d'][$x]['AwardCode'];
                  }
                }
                if ($available_awards['d'][$x]['AwardType'] == 'Skip The Pump') {
                  if(!array_key_exists('Skip The Pump', $perks_awards)) {
                    $perks_awards['Skip The Pump'] = $available_awards['d'][$x]['AwardCode'];
                  }
                }
                if ($available_awards['d'][$x]['AwardType'] == 'Free Toll Pass') {
                  if(!array_key_exists('Free Toll Pass', $perks_awards)) {
                    $perks_awards['Free Toll Pass'] =  $available_awards['d'][$x]['AwardCode'];
                  }
                }
                if ($available_awards['d'][$x]['AwardType'] == 'Pit Stop') {
                  if(!array_key_exists('Pit Stop', $perks_awards)) {
                    $perks_awards['Pit Stop'] = $available_awards['d'][$x]['AwardCode'];
                  }
                }
              }
            } 
  
          //Get a count of the perks. If there aren't any then show message. 
            if (count($perks_awards) > 0) { 
              // Loop through the perks
                foreach($perks_awards as $key => $value) {
                if ($key == 'Free Child Seat') { 
                  $this->awards_awards_html .= '
                    <div class="row perks bg-super-light-gray align-items-center text-center">
                      <div class="col-md-2">
                        <div class="">
                          <img src="/wp-content/plugins/adv-awards/assets/perk-carseat.jpg" class="img-responsive"> 
                        </div>
                      </div>
                      <div class="col-md-7">
                        <h3>Free Child\'s Car Seat</h3>
                        <p>Lighten your load and pack less with a child\'s car seat for newborns through 40 pounds.</p>
                      </div>
                      <div class="col-md-3">
                        <div class="">
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$value.'">Apply to Reservation</a></p>
                        </div>
                      </div>
                    </div>';
              }
              elseif ($key == 'Free GPS') {  
                $this->awards_awards_html .= '
                  <div class="row perks bg-super-light-gray align-items-center text-center">
                    <div class="col-md-2">
                      <div>
                        <img src="/wp-content/plugins/adv-awards/assets/perk-gps.jpg" class="img-responsive img-responsive-gps"> 
                      </div>
                    </div>
                    <div class="col-md-7">
                      <h3>Free GPS Navigation</h3>
                      <p>The sure way to get around! Never get lost with an easy-to-use GPS navigation.</p>
                    </div>
                    <div class="col-md-3">
                      <div>
                        <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$value.'">Apply to Reservation</a></p>
                      </div>
                    </div>
                  </div>';
                }
                elseif ($key == 'Skip The Pump') {   
                  $this->awards_awards_html .= '
                    <div class="row bg-super-light-gray align-items-center text-center">
                      <div class="col-md-2">
                        <div>
                          <img src="/wp-content/plugins/adv-awards/assets/perk-gas.jpg" class="img-responsive img-responsive-gps"> 
                        </div> 
                      </div>
                      <div class="col-md-7 text-center">
                        <h3>Prepaid Gas</h3>
                        <p>Save time and avoid the hassle of having to refill the tank before returning your rental.</p>
                      </div>
                      <div class="col-md-3">
                        <div>
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$value.'">Apply to Reservation</a></p>
                        </div>
                      </div>
                    </div>';
                }
                elseif ($key == 'Pit Stop') {   
                  $this->awards_awards_html .= '
                    <div class="row bg-super-light-gray align-items-center text-center">
                      <div class="col-md-2">
                        <div>
                          <img src="/wp-content/plugins/adv-awards/assets/perk-gas.jpg" class="img-responsive img-responsive-gps"> 
                        </div> 
                      </div>
                      <div class="col-md-7 text-center">
                        <h3>Prepaid Gas</h3>
                        <p>Save time and avoid the hassle of having to refill the tank before returning your rental.</p>
                      </div>
                      <div class="col-md-3">
                        <div>
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$value.'">Apply to Reservation</a></p>
                        </div>
                      </div>
                    </div>';
                }
                elseif ($key == 'Free Toll Pass') {    
                  $this->awards_awards_html .= '
                    <div class="row perks bg-super-light-gray align-items-center text-center">

                      <div class="col-md-2">
                        <div>
                          <img src="/wp-content/plugins/adv-awards/assets/perk-tollpass.jpg" class="img-responsive img-responsive-gps"> 
                        </div>
                      </div>
                      <div class="col-md-7">
                        <h3>Free Toll Pass</h3>
                        <p>Skip the lines and leave the loose change at home when you select the Free Toll Pass with your reservation.</p>
                      </div>
                      <div class="col-md-3">
                        <div>
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$value.'">Apply to Reservation</a></p>
                        </div>
                      </div>
                      </div>';
                }

              } // End for loopif (count($perks_awards) > 0) { 
              // Loop through the perks
              for ($x = 0; $x < count($perks_awards); $x++) {
                if (isset($perks_awards[$x]['Free Child Seat'])) { 
                  $this->awards_awards_html .= '
                    <div class="row bg-super-light-gray align-items-center text-center">
                      <div class="col-md-2">
                        <div>
                          <img src="/wp-content/plugins/adv-awards/assets/perk-carseat.jpg" class="img-responsive"> 
                        </div>
                      </div>
                      <div class="col-md-7">
                        <h3>Free Child\'s Car Seat</h3>
                        <p>Lighten your load and pack less with a child\'s car seat for newborns through 40 pounds.</p>
                      </div>
                      <div class="col-md-3">
                        <div>
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$perks_awards['Free Child Seat'].'">Apply to Reservation</a></p>
                        </div>
                      </div>
                    </div>';
              }
              elseif (isset($perks_awards[$x]['Free GPS'])) {  
                $this->awards_awards_html .= '
                  <div class="row perks bg-super-light-gray align-items-center text-center">
                    <div class="col-md-2">
                      <div>
                        <img src="/wp-content/plugins/adv-awards/assets/perk-gps.jpg" class="img-responsive img-responsive-gps"> 
                      </div>
                    </div>
                    <div class="col-md-7">
                      <h3>Free GPS Navigation</h3>
                      <p>The sure way to get around! Never get lost with an easy-to-use GPS navigation.</p>
                    </div>
                    <div class="col-md-3">
                      <div>
                        <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$perks_awards['Free GPS'].'">Apply to Reservation</a></p>
                      </div>
                    </div>
                  </div>';
                }
                elseif(isset($perks_awards[$x]['Free Toll Pass'])) {   
                  $this->awards_awards_html .= '
                    <div class="row perks bg-super-light-gray align-items-center text-center">
                      <div class="col-md-2">
                        <div>
                          <img src="/wp-content/plugins/adv-awards/assets/perk-gas.jpg" class="img-responsive img-responsive-gps"> 
                        </div>
                      </div>
                      <div class="col-md-7">
                        <h3>Prepaid Gas</h3>
                        <p>Save time and avoid the hassle of having to refill the tank before returning your rental.</p>
                      </div>
                      <div class="col-md-3">
                        <div>
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$perks_awards['Skip The Pump'].'">Apply to Reservation</a></p>
                        </div>
                      </div>
                    </div>';
                }
                elseif (isset($perks_awards[$x]['Free Child Seat'])) {    
                  $this->awards_awards_html .= '
                    <div class="row perks bg-super-light-gray align-items-center text-center">

                      <div class="col-md-2">
                        <div>
                          <img src="/wp-content/plugins/adv-awards/assets/perk-tollpass.jpg" class="img-responsive img-responsive-gps"> 
                        </div>
                      </div>
                      <div class="col-md-7">
                        <h3>Free Toll Pass</h3>
                        <p>Skip the lines and leave the loose change at home when you select the Free Toll Pass with your reservation.</p>
                      </div>
                      <div class="col-md-3">
                        <div>
                          <p><a nohref class="btn btn-light redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'.$unique_available_awards['Free Toll Pass'].'">Apply to Reservation</a></p>
                        </div>
                      </div>
                      </div>';
                }

              } // End for loop

               $this->awards_awards_html .= '
                  </div>
                </div>
              ';
            } else {

              // If there are no perks show message
              if (strtolower($awards_header_response['BestTier']) === "gold" || strtolower($awards_header_response['BestTier']) === "platinum") {
               $this->awards_awards_html .= '
                    <div class="row perks">
                      <div class="no-perks">
                        <div>
                          There are no perks assoicated to this account at this time. 
                        </div>
                      </div>
                    </div>';

              }

            }

        $this->awards_awards_html .= '
          </div>
        </div>
    </div>
  </div>
</div>
';

        return $this->awards_awards_html;

    }

}