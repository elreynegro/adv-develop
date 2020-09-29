<?php
/*
 * Template Name: Login
 */
get_header();

// Start the loop.
while ( have_posts() ) : the_post();

    // Include the page content template.
    get_template_part( 'template-parts/content', 'page' );

    // If comments are open or we have at least one comment, load up the comment template.
    if ( comments_open() || get_comments_number() ) {
        comments_template();
    }

// End of the loop.
endwhile;

include_once('includes/return-to-top.php');
// include_once('includes/steps.php'); 

get_footer(); 
?>
