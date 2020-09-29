<?php
/*
 * Template Name: Landing Page - Corporate
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


<div class="aez-secondary-header" style="background-image: url(<?php the_post_thumbnail_url(); ?>);">
    <div class="aez-gradient">
        <h1><?php the_title(); ?></h1>
    </div>
</div>

<div class="landing-page-wrapper">
	<div class="landing-page-content">
	<?php the_content(); ?>
	</div>
</div>


<!-- Advantage Expressway Information and Signup -->
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
					<p class="aez-uppercase">For corporations</p>
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
					<span>Advantage Expressway</span>
					<p class="aez-uppercase">For business travelers</p>
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
					<p class="aez-uppercase">For leisure travelers</p>
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
					<span>Expressway Program</span>
					<div class="aez-double-content">
						<div class="aez-content-container">
							<p class="aez-uppercase">For business travelers</p>
							<p>
								Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
							</p>
						</div>
						<div class="aez-content-container">
							<p class="aez-uppercase">For leisure travelers</p>
							<p>
								Receive a free class upgrade or a free day instantly upon signing up for the Expressway Loyalty Program!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="aez-member-login aez-vacation-spans">
			<span>Expressway Program</span>
			<a href="/login/"><button type="button" class="aez-btn aez-btn--filled-green">Log In To Your Account</button></a>
			<span>Not An Expressway Member?</span>
			<a href="javascript:void(0);"><button type="button" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</button></a>
		</div>
	</div>
</div>
<!-- END Advantage Expressway Information and Signup -->


<?php
endwhile;


include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
