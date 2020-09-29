<?php
/*
 * Template Name: Landing Page - Image Background
 */
get_header();

// Start the loop.
while ( have_posts() ) : the_post(); 
    // Include the page content template. ?>

<a name="reserve_top"></a>
<div class="aez-find-a-car-dropdown is-open">
    <h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>


<div class="landing-page-custom-wrapper">
	<div id="landing-page-custom-logos">
		<div class="landing-page-logo-left"><img src="/wp-content/plugins/advantage-reservations/assets/landing-pages/southwest_logo.png" alt="Southwest Airlines" /></div>
		<div class="landing-page-vertical-line"></div>
		<div class="landing-page-logo-right"><img src="/wp-content/plugins/advantage-reservations/assets/landing-pages/advantage_logo.png" alt="Advantage Rent A Car" /></div>
	</div>
	<div class="landing-page-custom-content">
		<div class="landing-page-custom-header">
			<h1>Welcome</h1>
			<h2><?php the_title(); ?></h2>
		</div>
		<div class="landing-page-custom-body">
			<?php the_content(); ?>
		</div>
	</div>
	<div class="landing-page-height-fill"></div>
</div>


<!-- Advantage Awards Information and Signup -->
<div class="aez-awards-promo aez-travelers-promo">
	<div class="aez-dark-background">
		<h2>Like Where We're Going?</h2>
		<h3>Travelers of All Types Can Save With Advantage</h3>

		<div class="aez-promo-blocks">
			<div class="aez-promo aez-advantage aez-traveler-corporate">
				<div class="aez-img-container">
					<img src="/wp-content/themes/twentysixteen-child/assets/group-icon.png" alt="group icon">
				</div>
				<div class="aez-traveler-corporate-content">
					<span>Corporate Advantage</span>
					<p class="aez-uppercase">For Corporations</p>
					<p>
						We know our business clients have a busy schedule, so no matter where or when they travel, the discount works 24/7. 
					</p>
				</div>
			</div>

			<div class="aez-promo aez-advantage aez-traveler-advantage desktop-hidden">
				<div class="aez-img-container">
					<img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
				</div>

				<div>
					<span>Advantage Awards</span>
					<p class="aez-uppercase">For Business Travelers</p>
					<p>
						Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
					</p>
				</div>
			</div>

			<div class="aez-promo aez-advantage aez-traveler-advantage desktop-hidden">
				<div class="aez-img-container">
					<img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
				</div>
				<div>
					<p class="aez-uppercase">For Leisure Travelers</p>
					<p>
						Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!
					</p>
				</div>
			</div>

			<div class="aez-promo aez-advantage aez-traveler-advantage desktop-show">
				<div class="aez-double-images">
					<div class="aez-img-container">
						<img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
					</div>
					<div class="aez-img-container">
						<img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
					</div>
				</div>
				<div>
					<span>Advantage Expressway</span>
					<div class="aez-double-content">
						<div class="aez-content-container">
							<p class="aez-uppercase">For Business Travelers</p>
							<p>
								Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
							</p>
						</div>
						<div class="aez-content-container">
							<p class="aez-uppercase">For Leisure Travelers</p>
							<p>
								Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program. 
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="aez-member-login aez-vacation-spans">
			<span>Advantage Expressway</span>
			<a href="/login/"><button type="button" class="aez-btn aez-btn--filled-green">Log In To Your Account</button></a>
			<span>Not An Expressway Member?</span>
			<a href="javascript:void(0);"><button type="button" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</button></a>
		</div>
	</div>
</div>
<!-- END Advantage Awards Information and Signup -->


<?php
endwhile;


include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
