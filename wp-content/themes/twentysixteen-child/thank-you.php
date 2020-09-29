<?php
/*
 * Template Name: Thank You
 */
wp_register_script('thankyou-js', ('/wp-content/themes/twentysixteen-child/js/thankyou.js'), array('jquery'), null, true);
/************
	STYLES
*************/
// Base Styles
$base_styles = array('slick', 'slick-theme');

wp_enqueue_style($base_styles);

/********************
	Slider/Carousel
*********************/
aez_theme_scripts();

// Base Functionality
$base_scripts = array('jquery', 'main', 'adv_form_validation');

// Search Form Scripts
$search_form_scripts = array('select2', 'select2Helpers', 'moment', 'pikaday', 'promo-code-add-remove', 'find-a-car-form');

// Quote Carousel Scripts
$quote_carousel_scripts = array('slick', 'quote-carousel', 'thankyou-js');

// Base Functionality w/ Search Form
$base_with_search_form_and_quote_carousel_scripts = array_merge($base_scripts, $search_form_scripts, $quote_carousel_scripts);
wp_enqueue_script($base_with_search_form_and_quote_carousel_scripts);

get_header();
?>
 <a name="reserve_top"></a>
<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/hero_orlando.jpg);">
	<div class="aez-gradient">
		<h1 style="font-weight: 800; line-height: 1.95em;">THANK YOU</h1>
		<h2>For your feedback!</h2>
	</div>
</div>
<div class="aez-body" style="text-align: center;">
    <h1>Start Renting Now!</h1>
    <p>&nbsp;</p>
    <p><a class="aez-btn aez-btn--filled-green aez-site-footer__button redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" style="padding: 0.45em 2.95em; font-size: 1.25em;" value="">Book A Car</a></p>
    <p>&nbsp;</p>
    <h2>Expect More from a Car Rental App! Download Now..</h2>
<p>&nbsp;</p>
<span style="font-size: 14pt;">
    <a target="_blank" href='https://play.google.com/store/apps/details?id=com.advantage.advantage'>
        <img width="18%" height="63" src='/wp-content/themes/twentysixteen-child/assets/hp-pop-up-silver-google-button.png' alt='Google Play Store'>
    </a>
	<a target="_blank" href='https://itunes.apple.com/us/app/advantage-rent-a-car/id1300506882' style="display: inline;">
		<img width="18%" height="63" src='/wp-content/themes/twentysixteen-child/assets/hp-pop-up-silver-ios-button.png' alt='Apple App Store'></a>
		</a>
    </span>
</div>

<?php include_once('includes/aez-quote.php'); ?>

<div class="aez-body">
	<p>
		If we made your rental experience enjoyable and provided exceptional service, we’d appreciate it you would <a href="https://www.facebook.com/AdvantageRAC/?fref=ts" target="_blank" class="-green">rate us here</a> or <a href="https://twitter.com/rentadvantage" target="_blank" class="-green">give us a shout out on social media</a>.
	</p>
	<p>
		Thank you for choosing or considering Advantage Rent A Car. We hope to see you again soon.
	</p>
</div>

<?php include_once('includes/aez-awards-promo.php'); ?>
<?php include_once('includes/return-to-top.php'); ?>

<?php get_footer(); ?>
