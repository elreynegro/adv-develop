<?php
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "site-content" div.
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */

//include_once('Adv_login_BrowserInfo.php');

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js" style="overflow-x: hidden;">
<head>
	<!-- Blueconic Tag -->
	<script src="//cdn.blueconic.net/advantage.js"></script>
	<!-- Google Tag Manager -->
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-NGHNZH');</script>
	<!-- End Google Tag Manager -->
	<!-- MP Script Translation -->
	<script src="/wp-content/plugins/adv_login/js/mp_linkcode.js"></script>
	<!-- End MP Script Translation -->
	<!--– mp_snippet_begins -->
	<script>
		MP.UrlLang='mp_js_current_lang';
		MP.SrcUrl=decodeURIComponent('mp_js_orgin_url');
		MP.oSite=decodeURIComponent('mp_js_origin_baseUrl');
		MP.tSite=decodeURIComponent('mp_js_translated_baseUrl');
		MP.init();
	</script>
<!-- Facebook Pixel Code -->
		<script>
		!function(f,b,e,v,n,t,s)
		{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};
		if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
		n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t,s)}(window, document,'script',
		'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '2081220988797702');
		fbq('track', 'PageView');
		</script>
		<noscript><img height="1" width="1" style="display:none"
		src="https://www.facebook.com/tr?id=2081220988797702&ev=PageView&noscript=1"
		/></noscript>
        <!-- End Facebook Pixel Code -->
	<!--– mp_snippet_ends -->
 	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
        
        <?php 
        $http_404_response = FALSE;
        if(http_response_code() == 404){
            $http_404_response = TRUE;
        }
        
		$is_no_index = Adv_login_Helper::addNoIndexNoFollow($_SERVER['REQUEST_URI']);
		
		//get vehicle details car class code
		$_SESSION['get_vehicle_details_car_code'] = Adv_login_Helper::getVehicleDetailsCarClassCode();
		
        if(($is_no_index == TRUE) || ($http_404_response == TRUE)) { 
        ?>
        <!-- add no index tag start-->
            <meta name="robots" content="noindex, follow" />
        <!-- add no index tag end-->
        <?php } ?>
        
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<?php endif; ?>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
	<link rel='stylesheet' href='//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.min.css?ver=1.11.4' type='text/css' media='all' />
	<?php wp_head(); ?>
	
</head>

<body <?php body_class(); ?> style="overflow-x: hidden;">
<?php 

	// *************************************************************************
	// BEGINNING OF THE CODE TO ADD TRACKING INFORMATION INTO THE tracking table
	// *************************************************************************
	if (isset($_SERVER['HTTPS'])) {
		$http = "https://";
	} else {
		$http = "http://";
	}

	$actual_link = $http.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	$query_string = parse_url($actual_link, PHP_URL_QUERY);

	if (isset($query_string) &&  $query_string !== false && $query_string !== "status=success") {

		if ((!isset($_SESSION['tracking_db_id']) && $_SESSION['tracking_db_id'] !== "")) {

			try {

				$date_time = date('Y-m-d H:i:s');

				$ip_address = (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '' );

				$first_page = (strtok($_SERVER["REQUEST_URI"],'?') !== "" ? strtok($_SERVER["REQUEST_URI"],'?') : '');

				$obj = new ADV_OS_BR();
				$browser = $obj->showInfo('browser');
				$browser_version = $obj->showInfo('version');
				$operating_system = $obj->showInfo('os');
				$browser_info = $browser. ' '. $browser_version . ', '. $operating_system;

				global $wpdb;
				$sql = $wpdb->prepare("INSERT INTO wp_adv_tracking ( QueryString, TimeEnteredSite, IP, FirstPage, Browser) VALUES (%s, %s, %s, %s, %s)", $query_string, $date_time, $ip_address, $first_page, $browser_info);

				$wpdb->query($sql);

				if ($wpdb->last_error !== '') {
					$error_message = $wpdb->last_error;
					$message = "Error inserting into wp_adv_tracking. SQL : ".trim($sql);
					$file = __FILE__;
					$function = __FUNCTION__;
					$line = __LINE__;
					Adv_login_Helper::saveToLog($message, $error_message, $file, $function, $line);

					//$_SESSION['tracking_db_id'] = "error";
				}

				$_SESSION['tracking_db_id'] = $wpdb->insert_id;

			} catch (Exception $e) {
				$message = "Try/catch caught an error.Error inserting into wp_adv_tracking";
				$file = __FILE__;
				$function = __FUNCTION__;
				$line = __LINE__;
				Adv_login_Helper::saveToLog($message, $e->getMessage(), $file, $function, $line);
			}
		}
	}
	// ********************************************************************
	// END OF THE CODE TO ADD TRACKING INFORMATION INTO THE tracking table
	// ********************************************************************

	// Check to see if we are on the complete page.
	// If we are then create the L3 data layer
	$URI = explode("/", $_SERVER['REQUEST_URI']);
	if ($URI[1] == "complete") {
		$vehicle = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];
		// Get the pre-paid or counter
		$payment_type = "counter";
		if (isset($_SESSION['confirm']['payment_type'])) {
			$payment_type = $_SESSION['confirm']['payment_type'];
		}
		// If it's prepaid add the prefix of "P" or add "R"
		if ($payment_type == "prepaid") {
			$pricing_prefix = "P";
		} else {
			$pricing_prefix = "R";
		}

		// if ($tax == 'included')
		$add_ons = '0.00';
		$tax = '0.00';
		$net_revenue = '0.00';
		$confirmNum = $_SESSION['complete']['ConfirmNum'];

		if (is_numeric($vehicle[$pricing_prefix.'TotalExtras'])) {
			$add_ons = sprintf("%01.2f", floatval($vehicle[$pricing_prefix.'TotalExtras']));
		}
		if (is_numeric($vehicle[$pricing_prefix.'TotalTaxes'])) {
			$tax = sprintf("%01.2f", floatval($vehicle[$pricing_prefix.'TotalTaxes']));
		}
		if (is_numeric($vehicle[$pricing_prefix.'TotalCharges'])) {
			$total = sprintf("%01.2f", floatval($vehicle[$pricing_prefix.'TotalCharges']));
		}
		$net_revenue = sprintf("%01.2f", floatval($total - $tax - $add_ons));

		if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {
			$price = $vehicle[$pricing_prefix.'RateAmount'];
		} else {
			$price = $_SESSION['confirm']['RateAmount'];
		}
?>
	<script>
		window.dataLayer = window.dataLayer || []
		dataLayer.push({
		     'transactionId': '<?php echo $confirmNum; ?>',
		     'transactionTotal': '<?php echo $total; ?>',
		     'transactionTax': '<?php echo $tax; ?>',
		     'transactionAddOn': '<?php echo $add_ons; ?>',
		     'transactionNetRevenue': '<?php echo $net_revenue; ?>',
		     'transactionProducts': [{
		               'sku': '<?php echo $confirmNum; ?>',
		               'name': '<?php echo $confirmNum; ?>',
		               'price': '<?php echo $price; ?>',
		               'quantity': '1'
		     }]
		});
	</script>
<?php
	}
?>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGHNZH"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div id="page" class="site">
	<div class="">
		<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'twentysixteen' ); ?></a>

		<div id="masthead" role="banner">
			<div class="site-header-main">
				<div class="site-branding">
					<?php twentysixteen_the_custom_logo(); ?>

					<?php if ( is_front_page() && is_home() ) : ?>
						<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
					<?php else : ?>
						<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
					<?php endif;

					$description = get_bloginfo( 'description', 'display' );
					if ( $description || is_customize_preview() ) : ?>
						<p class="site-description"><?php echo $description; ?></p>
					<?php endif; ?>
				</div>
				<!-- .site-branding -->

			<?php if ( get_header_image() ) : ?>
				<?php
					/**
					 * Filter the default twentysixteen custom header sizes attribute.
					 *
					 * @since Twenty Sixteen 1.0
					 *
					 * @param string $custom_header_sizes sizes attribute
					 * for Custom Header. Default '(max-width: 709px) 85vw,
					 * (max-width: 909px) 81vw, (max-width: 1362px) 88vw, 1200px'.
					 */
					$custom_header_sizes = apply_filters( 'twentysixteen_custom_header_sizes', '(max-width: 709px) 85vw, (max-width: 909px) 81vw, (max-width: 1362px) 88vw, 1200px' );
				?>
				<div class="header-image">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
						<img src="<?php header_image(); ?>" srcset="<?php echo esc_attr( wp_get_attachment_image_srcset( get_custom_header()->attachment_id ) ); ?>" sizes="<?php echo esc_attr( $custom_header_sizes ); ?>" width="<?php echo esc_attr( get_custom_header()->width ); ?>" height="<?php echo esc_attr( get_custom_header()->height ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>">
					</a>
				</div><!-- .header-image -->
			<?php endif; // End header image check. ?>

			<!-- Hurrican Warning -->
			<?php 
				$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

				if ($api_url_array['hurricane_flag'] == "Y") {
					echo do_shortcode('[aez-hurricane-warning]'); 
				}
			?>
			<!-- End Hurrican Warning -->

			<!-- <div class="emergencyLabel">CONTACT US: 
				<a href="tel:+18007775500" class="emergency">(800) 777-5500</a>&nbsp;
				<a href="/wp-content/plugins/adv-contact-us/assets/Hurricane - Helpful Tips and Resources (Renters)vHI.pdf" target="_blank" class="emergency" style="text-decoration: underline !important;">(Hurricane Florence Travel Advisory)</a>
			</div> -->
			<div id="lang-dropdown-wrapper" style="display:none;">

				<!--mp_global_switch_begins-->
				<a mporgnav class="user-locale" href="#" onclick="return chooser();
				function chooser(){
				var script=document.createElement('SCRIPT');
				script.src='https://advantagerentacar.mpeasylink.com/mpel/mpel_chooser.js';
				document.body.appendChild(script);
				return false;
				}" title="Global Switch"><i class="lang-globe-select fa fa-globe fa-2x" aria-hidden="true" style="vertical-align: middle;"></i>
				<span id="lang-selector-desktop"> Choose Language</span><span id="lang-selector-mobile"> Choose <br> Language</span></a>
				<!--mp_global_switch_ends-->
				
			</div>
			<div id="site-header-menu" class="site-header-menu">
				<nav id="site-navigation" class="main-navigation adv-menu-nav text-uppercase" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
				<?php if ( has_nav_menu( 'secondary' ) ) : ?>
					<div class="menu-secondary">
						<?php
							wp_nav_menu( array(
								'theme_location' => 'secondary',
								'menu_class'     => 'primary-menu',
							 ) );
						?>
					</div>
				<?php endif; ?>
				</nav><!-- .main-navigation -->
			</div><!-- .site-header-menu -->
		</div><!-- .site-header -->

		<div class="aez-main-navigation">
			<?php if ( has_nav_menu( 'primary' ) ) : ?>
				<nav id="site-navigation" class="main-navigation aez-menu-nav" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
					<?php
						wp_nav_menu( array(
							'theme_location' => 'primary',
							'menu_class'     => 'primary-menu menu__primary__list',
						 ) );
					?>
			<?php endif; ?>
		</div>
		<div id="content" class="site-content">
