<?php
/*
 * Template Name: Vehicle Details Template
 */
get_header();
?>
<div class="row home-container vehicle-details-page-container" >
    <div class="aez-home-find-a-car-container col-lg-5 col-md-6 col-sm-12 mt-3 vehicle-car-class"><div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div> </div>
    <div class="col-lg-7 col-md-6 col-sm-12 mt-3 right-side-text-container">
        <div class="mt-3"><div><h1 class="text-center"> <?php
                    if (the_title()) {
                        the_title();
                    }
                    ?> </h1></div>
            <div class="vehicle-details-page-right-img float-left"> 
            </div>         </div>
        <div class="img-vehicle-detail-content">
            <?php
                if (has_post_thumbnail()) {
                    the_post_thumbnail('medium');
                }
            ?>
            <?php
            while (have_posts()) : the_post();
                the_content();
            endwhile;
            ?>
        </div>

    </div>
</div>


<div id="promo_locations" class="aez-awards-promo aez-travelers-promo vehicle-page-secondary-footer mt-3" >
    <div class="aez-dark-background">
        <h2>Like Our Rides?</h2>
        <h3>Travelers of All Types Can Save With Advantage</h3>

        <div class="aez-promo-blocks">
            <div class="aez-promo">
                <img src="/wp-content/themes/twentysixteen-child/assets/group-icon.png" alt="group icon">
                <div>
                    <span class="color-8ED8F8">Corporate Advantage</span>
                    <p class="aez-uppercase color-white">For Corporations</p>
                    <p class="color-white">
                        We know our business clients have a busy schedule, so no matter where or when they travel, the discount works 24/7.
                    </p>
                </div>
            </div>

            <div class="aez-promo">
                <img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
                <div>
                    <span class="color-8ED8F8">Expressway Program</span>
                    <p class="aez-uppercase color-white">For Business Travelers</p>
                    <p class="color-white">
                        Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
                    </p>
                </div>
            </div>
            <div class="aez-promo">
                <img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
                <div class="vehicle-page-secondary-footer-exp-prog">
                    <span class="color-8ED8F8">Expressway Program</span>
                    <p class="aez-uppercase color-white" >For leisure travelers</p>
                    <p class= "color-white">
                        Receive a free class upgrade or a free day instantly upon signing up for the Expressway Loyalty Program!
                    </p>
                </div>
            </div>
        </div>

        <div class="aez-member-login">
            <span class= "color-white">Expressway Program</span>
            <a href="/login" type="button" class="aez-btn aez-btn--filled-green">Log In To Your Account</a>
            <span class= "color-white">Not An Expressway Member?</span>
            <a href="javascript:void(0);" type="button" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</a>
        </div>
    </div>
</div>
<?php
include_once('includes/return-to-top.php');
get_footer();
?>