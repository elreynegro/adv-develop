<?php
/*
 * Template Name: Corporate
 */
get_header(); ?>

<div class="aez-find-a-car-dropdown is-open">
  <h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
  <div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<?php
//error_log('_REQUEST: ' . print_r($_REQUEST, true));
// Start the loop.
while ( have_posts() ) : the_post();
    // Include the page content template.
    get_template_part( 'template-parts/content', 'page' );


    // End of the loop.
endwhile;


include_once('includes/questions.php'); 
include_once('includes/return-to-top.php');
get_footer(); ?>