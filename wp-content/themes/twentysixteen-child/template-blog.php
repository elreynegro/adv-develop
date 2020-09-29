<?php
/*
 * Template Name: Blog Posts
 */

get_header();
?>

<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-secondary-header hero-margin" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/blog_banner.png);
">
	<div class="aez-gradient aez-blog-text">
		<h1 style="font-size: 3em !important;">Advantage Blog</h1>
	</div>
</div>

<?php

// Start the loop.
while ( have_posts() ) : the_post();

	// Include the page content template.
	get_template_part( 'template-parts/content', 'adv' );

	// If comments are open or we have at least one comment, load up the comment template.
	// if ( comments_open() || get_comments_number() ) {
	// 	comments_template();
	// }

	// End of the loop.
endwhile;

include_once('includes/return-to-top.php'); 

get_footer();

