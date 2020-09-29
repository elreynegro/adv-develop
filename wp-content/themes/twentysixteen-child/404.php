<?php

header("HTTP/1.1 301 Moved Permanently");
header("Location: ".get_bloginfo('url'));
exit();

/*
 * Template Name: About
 */

wp_register_script('404-detail', plugins_url('adv-contact-us/js/404.js'), array('jquery'), null, true);

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
$quote_carousel_scripts = array('slick', 'quote-carousel', '404-detail');

// Base Functionality w/ Search Form
$base_with_search_form_and_quote_carousel_scripts = array_merge($base_scripts, $search_form_scripts, $quote_carousel_scripts);

wp_enqueue_script($base_with_search_form_and_quote_carousel_scripts);


/************
	Header
*************/
get_header();

?>

<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/cars_in_sunset.jpg);
">
	<div class="aez-gradient">
		<h1>You went left, but the page went right. </h1>
		<h2>(404 page not found)</h2>	</div>
</div>

<div class="aez-body">
	<p><h2>Sorry, the page you’re attempting to reach does not exist. While you’re here check out the great rates we have available at our locations by clicking the <span class="find-a-car-link-green"><a href="#" id="open_find_a_car_404">‘Find a Car Worldwide’</a></span> tab in the top left corner.</h2></p>
</div>

<?php include_once('includes/aez-quote.php'); ?>

<?php include_once('includes/aez-awards-promo.php'); ?>
<?php include_once('includes/return-to-top.php'); ?>

<?php get_footer(); ?>
