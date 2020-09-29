<?php

include_once('Adv_login_ShortCodeScriptLoader.php');
 
class Adv_login_ReferFriendsShortcode extends Adv_login_ShortCodeScriptLoader {

    public $refer_friends_box_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            wp_enqueue_script('adv_refer_friends', plugins_url('js/adv_refer_friends.js', __FILE__), array('jquery', 'main', 'select2'), '1.0', true);
 
            wp_localize_script( 'adv_login', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advlogintNonce' => wp_create_nonce( 'advlogin-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {
            
        $err_flag = (!isset($_GET['ReferralId']))?1:0;

        $invalid_link_text = '<div class="aez-friend-referral-container" style="padding: 14em;">
        <div class="aez-body refer_friends" style="min-height: auto; padding: 35px 9px;"> 
            <div><img class="form_logo" alt="Expressway Logo" src="/wp-content/themes/twentysixteen-child/assets/expway2.png"></div>
            <h2 style="min-height: auto;vertical-align: middle;margin: auto;padding: 1.5em 0;">Please provide a valid link.</h2>
        </div>
    </div>';
    

        if($err_flag == 1) {
            $this->refer_friends_box_html = $invalid_link_text;
            return $this->refer_friends_box_html;
        }
        
        $referral_id = $_GET['ReferralId'];
        $get_loyalty_referral = Adv_login_Helper::getLoyaltyReferral($referral_id);
        
        if($get_loyalty_referral['Status']  == 'Failed'){
            $this->refer_friends_box_html = $invalid_link_text;
            return $this->refer_friends_box_html;            
        }
        
        if($get_loyalty_referral['Status'] == "Success") {
            $pending  = $get_loyalty_referral['Data']['RequiredReferrals'] - $get_loyalty_referral['Data']['MemberReferrals'];
            if($pending > 0 && $pending <= $get_loyalty_referral['Data']['RequiredReferrals'])  {
                $this->refer_friends_box_html .= '
                        <div class="aez-friend-referral-container">
    
                            <h1>Share the Love! Earn up to 3 Free Days.</h1>

                            <!-- Refer Container Begins -->
                            <form id="refer_friends" action="/refer-friends" class="aez-form">
    
                                <div><img class="form_logo" alt="Expressway Logo" src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Car Rental"></div> 
                                <div class="friend-text-container">
                                    <div class="text-head"> Invite your friends to join Expressway and get Free Days.</div>
                                    <div class="text-1"> 1. Every friend invited instantly gets a <span>Free Day Reward</span> when they sign up.</div>
                                    <div class="text-1"> 2. You earn a <span>Free Day Reward</span> for each friend (up to 3) who joins and books a rental.</div>
                                    <div class="text-1"> 3. You can earn up to <span>3 Free Days!</span></div>
                                </div>
                                
                                <div id="error_container" class="error_container"> 
                                    
                                </div>

                                <div class="aez-form-block">
                                    <h4 class="text-2">Friend\'s Emails</h4>';
                                    for($a=1; $a<=$pending; $a++) {
                                        $required = ($a == 1)?' required="required" ':'';
                                        $this->refer_friends_box_html .= '
                                        <div class="aez-form-item">
                                            <label style="display: none" class="aez-form-item__label">Friend #'.$a.' Email Address</label>
                                            <input
                                                id="email'.$a.'"
                                                class="aez-form-item__input refer_email"
                                                name="emails[]"
                                                type="text"
                                                placeholder="Friend #'.$a.' Email Address" 
                                                '.$required.' 
                                            />
                                        </div>
                                          ';
                                    }
                                            
                                    $this->refer_friends_box_html .= '
                                    <input type="hidden" value="'.$referral_id.'" name="ReferralId" id="ReferralId">    
                                    <input type="submit" value="Send Invites" class="aez-btn" name="Submit" id="submit-refer-friends">
                            </div>
                            </form> 
                        
                        <!-- Success Container Ends -->   
                        
                        <!-- Success Container begins -->
                        <div id="refer_friends_success" class="refer-success-container">
                            <h2>THANK YOU FOR <br />SHARING THE LOVE!</h2>
                            <div class="success_msg">Success! Emails have been sent to your friends. 
                                                    <br /> We value our relationship and promise to take good care of your friends, too. 
                            </div>
                            <div class="failed_msg" id="ref_fail_emails">
                                cannot be referred
                                cannot be referred
                            </div>
                            <a class="return-home-link" href="'.get_site_url().'" style="">Return to Home Page</a>
                            <div><img class="ctn-logo" src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Car Rental"></div>
                        </div>
                        <!-- Success Container Ends -->
                    
                    </div>
                    
                    <!-- <div class="spacer">&nbsp;</div> -->';
            }
            else {
                $this->refer_friends_box_html = '
                <div class="aez-friend-referral-container" style="padding: 14em;">
                    <div class="aez-body refer_friends" style="min-height: auto; padding: 35px 9px;"> 
                        <div><img class="form_logo" alt="Expressway Logo" src="/wp-content/themes/twentysixteen-child/assets/expway2.png"></div>
                        <h2 style="min-height: auto;vertical-align: middle;margin: auto;padding: 1.5em 0;">You have completed all your referrals already.</h2>
                    </div>
                </div>';
            }
        }
        return $this->refer_friends_box_html;

	}

}