<?php
/*
 * Template Name: Advantage Edit profile
 */


Adv_login_Auth::login_check('/login');
get_header();
// echo '<h2>here again </h2>';

// Start the loop.
while ( have_posts() ) : the_post();

    // Include the page content template.
    get_template_part( 'template-parts/content', 'page' );


    // End of the loop.
endwhile;


include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>