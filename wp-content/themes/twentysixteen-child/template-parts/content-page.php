<?php
/**
 * The template used for displaying blog content
 *
 * Twentysixteen-child theme
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>


	<div class="aez-full-width-content">
		<?php
		the_content();
		?>
	</div><!-- .entry-content -->

	<?php
		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				__( 'Edit<span class="screen-reader-text"> "%s"</span>', 'twentysixteen' ),
				get_the_title()
			),
			'<footer class="entry-footer"><span class="edit-link">',
			'</span></footer><!-- .entry-footer -->'
		);
	?>

</article><!-- #post-## -->
