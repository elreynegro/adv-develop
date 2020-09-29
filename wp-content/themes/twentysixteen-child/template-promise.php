<?php
/*
 * Template Name: Brand Promise
 */
require_once( adv_plugin_dir('aez_oauth2') . '/AEZ_Oauth2_Plugin.php');

$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

$pursuade_url = $api_url_array['pursuade_url'];

get_header();
?>

<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>
<div id="brand-promise-background" class="aez-secondary-header hero-margin" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/rethink-friendly.jpg);position: relative;
">
	<div class="brand-promise-main-heading">Rethinking Friendly</div>
</div>
<div  class="brand-promise-whole-container">
<div class="row" >
	<div class="col-md-12">
		<h1 class="mx-auto brand-promise-heading">
				When renting from Advantage you get:
		</h1><br>
	</div>
	
</div>

	
		<div class="row">
		    <div class="col-md-6 col-lg-3 my-3" >
		      
		        <div class="brand-promise-container">
		            <h3 class="brand-promise-title">New or almost new autos that are clean and ready to travel</h3>
					<span>&nbsp;</span>
		            <p class="brand-promise-sub-title">We have one of the newest, most diverse fleets in the U.S.</p>
					
					<div class="brand-promise-image"><img class="img2" src="/wp-content/themes/twentysixteen-child/assets/icon4.png" alt="Pineapple" width="170" height="170"></div>
		        </div>
		    </div>
			
		    <div class="col-md-6 col-lg-3 my-3" >
		        
		        <div class="brand-promise-container">
		            <h3 class="brand-promise-title">The car you reserved at the price you were quoted</h3>
					<span>&nbsp;</span>
		            <p class="brand-promise-sub-title">No surprises at<br> the counter</p>
					
					<div class="brand-promise-image"><img class="img2" src="/wp-content/themes/twentysixteen-child/assets/icon5.png" alt="Pineapple" width="170" height="170"></div>
		        </div>
		    </div>
		    <div class="col-md-6 col-lg-3 my-3" >
		        
		        <div class="brand-promise-container">
		            <h3 class="brand-promise-title">A car that's ready when you arrive</h3>
					<span>&nbsp;</span>
		            <p class="brand-promise-sub-title">When we promise you a vehicle, it will be waiting when you get here</p>
					
					<div class="brand-promise-image"><img class="img2" src="/wp-content/themes/twentysixteen-child/assets/icon6.png" alt="Pineapple" width="170" height="170"></div>
		        </div>
		    </div>
		    <div class="col-md-6 col-lg-3 my-3" >
		       
		        <div class="brand-promise-container">
		            <h3 class="brand-promise-title">A friendly experience</h3>
					<span>&nbsp;</span>
		            <p class="brand-promise-sub-title">We want you to have the best rental experience possible</p>
					
					<div class="brand-promise-image"><img class="img2" src="/wp-content/themes/twentysixteen-child/assets/icon7.png" alt="Pineapple" width="170" height="170"></div>
		        </div>
		    </div>
		</div>

</div>

<!-- Home Section 4 begins -->
    <div class="home-aez-images row">
        
        
        <div class="aez-image-block-award -first col-lg-6">
            <div class="aez-image-overlay">
                <div class="aez-image-block-content">
                    <a href="<?php echo $pursuade_url; ?>">
                        <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage expway2 Logo" />
                        <div class="home-award-logo-text">RENT. EXPRESSWAY. REPEAT</div>
                    </a>
                </div>
            </div>    
        </div>
        

        <div class="aez-image-block-award -second col-lg-6">
            <div class="aez-image-overlay">
                <div class="aez-image-block-content">
                    <a href="<?php echo $pursuade_url; ?>">
                        <img src="/wp-content/themes/twentysixteen-child/assets/Corp_Adv.png" alt="Advantage Expressway Logo" />
                        <div class="home-award-logo-text">INCREASE YOUR ROL</div>
                    </a>
                </div>
            </div>  
        </div>
    </div>
    <!-- Home Section 4 ends -->






<?php

// Start the loop.
// while ( have_posts() ) : the_post();

	// Include the page content template.
//	get_template_part( 'template-parts/content', 'adv' );

	// If comments are open or we have at least one comment, load up the comment template.
	// if ( comments_open() || get_comments_number() ) {
	// 	comments_template();
	// }

	// End of the loop.
// endwhile;

include_once('includes/return-to-top.php'); 

get_footer();
