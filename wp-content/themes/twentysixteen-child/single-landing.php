<?php
/**
 * The template for displaying all single posts and attachments
 *
 * @package WordPressE
 * @subpackage Twenty Sixteen-Child
 * @since Twenty Sixteen-Child 1.0
 */

get_header(); 

?>

<!-- <div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<?php //include_once('find-a-car-worldwide-form.php'); ?>
</div> -->

<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">
		<?php
		// Start the loop.
		while ( have_posts() ) : the_post();

			// Include the single post content template.
			get_template_part( 'template-parts/content', 'single-landing' );

		endwhile;
		?>

	</main><!-- .site-main -->

	<?php get_sidebar( 'content-bottom' ); ?>

</div><!-- .content-area -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
