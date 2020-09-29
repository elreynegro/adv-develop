<?php
	/*
	 * Template Name: Landing Page - Partners
	 */
require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/aez_oauth2/AEZ_Oauth2_Plugin.php');

$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

$pursuade_url = $api_url_array['pursuade_url'];

get_header(); 

$get_data = AEZ_Oauth2_Plugin::clean_user_entered_data("get");

$post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

// Get the promocode from the get url parameter
if (isset($get_data)) {
	foreach ($get_data as $key => $value) {
		if ($key == "rc" || $key == "irc") {
			$promoCode = $value;
		}
	}
}

$password_reset = "no";
$reset_forgot_password = "no";
// Get the password reset post data.
if (isset($post_data)) {
	foreach ($post_data as $key => $value) {
		if ($key == "password_reset") {
			$password_reset = "yes";
		}
		 if ($key == "reset_forgot_password") {
			$reset_forgot_password = "yes";
		}
	}
}

?>
<div class="aez-partners-feature">
	<div class="aez-partners-feature__hero">
		<div class="aez-partners-feature__hero-gradient"></div>
		<div class="aez-partners-feature__hero-content">
			<h2>Take Advantage Of Savings!</h2>
		</div>
	</div>

	<div class="aez-partners-feature__container">
		<div class="aez-partners-feature__form aez-partners--primary-bg-color">
			<div class="aez-partners-feature__form-promo aez-partners--promo-bg-color">
				<p>Enter this promo code for an instant discount!</p>
				<div class="code">GAYTRAVEL</div>
			</div>
			<?php include_once('find-a-car-worldwide-form.php'); ?>
		</div>

		<div class="aez-partners-feature__content">
			<img class="aez-partners-feature__content-logo" src="/wp-content/themes/twentysixteen-child-advantage/assets/partners/gaytravel/logo-horizontal.png" alt="Gaytravel.com Logo">
			<h3 class="aez-partners-feature__content-title">Gay Travel Partners With Advantage Rent A Car</h3>
			<p class="aez-partners-feature__content-copy">Advantage Rent A Car is proud to be Gay Travel’s first travel partner for its Let’s Get OUT There! (LGOT) initiative, which inspires LGBTQ travelers to explore exciting destinations and enriching events. In honor of this special partnership, we’re thrilled to offer a 20% discount to our LGBTQ friends. In addition, we’ll waive the usual charge for an additional driver. Plus, if you sign up for our Advantage Rewards program, you’ll automatically be enrolled at the silver level! Advantage is the only rental car company that offers an award with every rental.</p>
			<div class="aez-partners-feature__content-promo">
				<div class="code aez-partners--promo-bg-color"><span>GAYTRAVEL</span></div>
				<p>Enter this promo code for an instant discount!</p>
			</div>
		</div>
	</div>
</div>
<div class="aez-partners-stacking aez-partners--stacking-rewards-bg-color">
	<div class="aez-partners-stacking__container">
		<div class="aez-partners-stacking__header">
			<h3 class="aez-partners-stacking__header-title">Start Stacking Your Rewards!</h3>
			<h4 class="aez-partners-stacking__header-subtitle aez-partners--primary-color">For Business & Leisure Travelers</h4>
		</div>
		<div class="aez-partners-stacking__equation">
			<div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--partner-logo"></div>
			<i class="fa fa-plus aez-partners-stacking__equation-symbol aez-partners--primary-color"></i>
			<div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--advantage-logo"></div>
			<span class="aez-partners-stacking__equation-symbol aez-partners-stacking__equation-symbol--equals aez-partners--primary-color">
			  <i class="fa fa-minus"></i>
			  <i class="fa fa-minus"></i>
			</span>
			<div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--person"></div>
		</div>
		<p class="aez-partners-stacking__copy">GayTravel.com cusotmers earn even more when they sign up for Advantage Expressway.</p>
		<ul class="aez-partners-stacking__bullets">
			<li class="aez-partners-stacking__bullet">
				<i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color"></i>
				<div class="aez-partners-stacking__bullet-content">
					<p class="aez-partners-stacking__bullet-content-title">Free Upgrade</p>
					<p class="aez-partners-stacking__bullet-content-copy">Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!</p>
				</div>
			</li>
			<li class="aez-partners-stacking__bullet">
				<i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color"></i>
				<div class="aez-partners-stacking__bullet-content">
					<p class="aez-partners-stacking__bullet-content-title">Free Day</p>
					<p class="aez-partners-stacking__bullet-content-copy">Earn a free day during an upcoming rental period.</p>
				</div>
			</li>
			<li class="aez-partners-stacking__bullet">
				<i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners--primary-color"></i>
				<div class="aez-partners-stacking__bullet-content">
					<p class="aez-partners-stacking__bullet-content-title">Free Weekend.</p>
					<p class="aez-partners-stacking__bullet-content-copy">Earn a free weekend during an upcoming rental period.</p>
				</div>
			</li>
		</ul>
		<div class="aez-partners-stacking__adv-awards">
			<h4 class="aez-partners-stacking__adv-awards-title">Advantage Expressway</h4>
			<a href="#" class="aez-partners-stacking__adv-awards-button aez-partners--primary-bg-color">Sign Up Now!</a>
		</div>
	</div>
</div>
<div class="aez-partners-questions">
	<div class="aez-partners-questions__header">
		<div class="aez-partners-questions__header-car"></div>
		<h3 class="aez-partners-questions__header-title">Have Questions About Enrollment?</h3>
	</div>
	<div class="aez-partners-questions__content">
		<p class="aez-partners-questions__content-copy">Call us between 8:00 am and 5:30 pm EST Monday through Friday and we’ll help you choose the program that’s right for you!</p>
		<a class="aez-partners-questions__content-button aez-partners--primary-bg-color" href="tel:8007775550">(800) 777-5550</a>
	</div>
</div>
<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
