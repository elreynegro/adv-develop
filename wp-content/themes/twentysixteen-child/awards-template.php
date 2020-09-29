<?php
/*
 * Template Name: awards-template
 */
get_header();
?>
  <a name="reserve_top"></a>
  <div class="aez-find-a-car-dropdown is-open">
      <h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
      <div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>
  
  
   <!-- awards banner start -->
  <div class="row">
    <div class="awards-background-img" >
            <div ><p class="awards-banner-text col-sm-12 col-md-12 col-lg-12">Expressway Program<br/><span class="font-weight-light text-uppercase">Rent. Rewards. Repeat.</span></p></div>
    </div>
  </div>
  <!-- awards banner end -->    

        <?php 
          $member_number = $_SESSION['adv_login']->memberNumber;
          if (isset($member_number)) {
            if (!isset($_SESSION['awards_flag']) || $_SESSION['awards_flag'] == 'True') {

                // Call the endpoint and set the header response variable
                $awards_header_response = AdvAwards_Helper::getAwardsPageHeaderInfo($member_number);

                // Set the session
                $_SESSION['awards_header_response'] = $awards_header_response;
                $_SESSION['available_awards'] = AdvAwards_Helper::getAvailableMemberAwards($member_number);
                
                //set rewards to session with unique and sort
                $available_awards = isset($_SESSION['available_awards']) ? $_SESSION['available_awards'] : '';
                $_SESSION['available_awards_unique_sort'] = AdvAwards_Helper::sortAwardsBasedExpireDate($available_awards);
                
                
                $_SESSION['awards_history'] = AdvAwards_Helper::getMemberAwardsHistory($member_number);
                $email = $_SESSION['adv_login']->user['email'];
                $_SESSION['reservation_history_response'] = AdvAwards_Helper::getReservationHistory($email);

                // Set the flag to false
                $_SESSION['awards_flag'] = 'False';

            } else {

                $awards_header_response = $_SESSION['awards_header_response'];

            }
          }

          if (!isset($member_number)) {
        ?>
        <div class="row awards_header_tablets">
            <div class="col-lg-1"></div>
            <div class="col-lg-8 mt-5">
                <div class="d-inline">
                    <a  href="/expressway"><img class="sec-banner-logo-division w-354"  src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Car Rental" /></a>
                </div>
                
                <div class="d-inline">
                <a href="/login" class="awards-login-btn aez-btn--filled-green">Log In</a>
                <div class="d-inline font-weight-bold" style="margin-left:2%;">Not a member yet?
                    <a style="color: #99CC00; margin-left: 0.7%" class="font-weight-bold signup_menu" href="javascript:void(0);">Sign Up</a>
                </div>
                </div>
            </div>
           
            <div class=" col-lg-2 my-3 ml-5">
                <div class="d-inline"><a class="awards-tabs benefits benifits-faq" href="/expressway/benefits">BENEFITS</a></div>
                <div class="d-inline"><a class="awards-tabs faq benifits-faq" href="/expressway/faq">FAQS</a></div>
            </div>
            <div class=" col-lg-1 "></div>
        </div>
        <?php } else { ?>
        
        <div class="container awards_header_tablets">
            <div class="row mt-2">
            <div class="col-6 col-lg-3 mt-3">
                <div class="d-inline">
                    <a  href="/expressway"><img class="sec-banner-logo-division w-354"  src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Car Rental" /></a>
                </div>
            </div>
            <div class="col-6 col-lg-4 mt-3" style="font-size: 1.12em;">
                <div class="d-inline">
                    Welcome, <b><?php echo $awards_header_response['FirstName']; ?></b> <br />
                    Available Rewards: <b><?php echo $awards_header_response['AvailableAwardsCount']; ?></b> <br />
                    Status: <b><?php echo $awards_header_response['BestTier']; ?></b>
                    <input type="hidden" id="status" value="<?php echo $awards_header_response['BestTier'];?>"/>
                </div>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-6 col-md-3 col-lg-1 mt-3">
                <div class="d-inline">
                    <a class="awards-tabs-wo-login awards active-tab" href="/expressway">REWARDS</a>
                </div>
            </div>
            <div class="col-6 col-md-3 col-lg-1 mt-3">
                <div class="d-inline">
                    <a class="awards-tabs-wo-login activity" href="/expressway/activity">ACTIVITY</a>
                </div>
            </div>
            <div class="col-6 col-md-3 col-lg-1 mt-3">
                <div class="d-inline">
                    <a class="awards-tabs-wo-login benefits" href="/expressway/benefits">BENEFITS</a>
                </div>
            </div>
            <div class="col-6 col-md-3 col-lg-1 mt-3">
                <div class="d-inline">
                    <a class="awards-tabs-wo-login faq" href="/expressway/faq">FAQS</a>
                </div>
            </div>
            
        </div>
        </div>
        
        
        
        <?php } ?>  
<div class="row">
<div class="col-lg-12 mt-5">
<?php
  // Start the loop.
  while ( have_posts() ) : the_post();
    // Include the page content template.
    get_template_part( 'template-parts/content', 'page' );
    // End of the loop.
  endwhile;

?>
</div>
</div>
</div>
<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>