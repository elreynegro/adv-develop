<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * @package WordPress
 * @subpackage Twenty Sixteen-Child
 * @since Twenty Sixteen-Child 1.0
 */

get_header(); ?>
<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">

		<?php
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
		?>

	</main><!-- .site-main -->

	<?php get_sidebar( 'content-bottom' ); ?>

</div><!-- .content-area -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
