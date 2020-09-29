<?php
/**
 * Adds a new custom menu for additional links
 *
 * @since Twenty Sixteen Child 1.0
 *
 */
require_once('src/cookie.php');
require_once('src/login.php');
require_once('src/contact7.php');
require_once('src/my-reservations.php');
require_once(adv_plugin_dir('adv_login') . '/Adv_login_Auth.php');

// Version Number For CSS
$GLOBALS['style_css_version'] = '4.5'; // style.css

// Version Number For JavaScript
$GLOBALS['adv_locations_js_version'] = '4.5'; // adv_locations.js
$GLOBALS['adv_rez_js_version'] = '4.5'; // adv_rez.js
$GLOBALS['adv_login_js_version'] = '4.5'; // adv_login.js
$GLOBALS['drop-down_js_version'] = '4.5'; // drop-down.js
$GLOBALS['main_js_version'] = '4.5'; // main.js
$GLOBALS['adv_form_validation_js_version'] = '4.5'; // adv_form_validation.js
$GLOBALS['home_js_version'] = '4.5'; // home.js
$GLOBALS['quote-carousel_js_version'] = '4.5'; // quote-carousel.js
$GLOBALS['adv_reserve-summary-dropdown_js_version'] = '4.5'; // adv_reserve-summary-dropdown.js
$GLOBALS['adv_reserve_js_version'] = '4.5'; //adv_reserve_form.js
$GLOBALS['promo-code-add-remove_js_version'] = '4.5'; // promo-code-add-remove.js
$GLOBALS['contact-us_js_version'] = '4.5'; // contact-us.js
$GLOBALS['locations_js_version'] = '4.5'; // locations.js
$GLOBALS['find-a-car-worldwide-form_js_version'] = '4.5'; // find-a-car-worldwide-form.js
$GLOBALS['awards-block_js_version'] = '4.5'; // awards-block.js
$GLOBALS['adv_rez_enhance_js_version'] = '4.5'; // adv_rez_enhance.js
$GLOBALS['drop_down_location_page_version'] = '4.5'; //drop-down-location-page.js

define('PODS_SHORTCODE_ALLOW_SUB_SHORTCODES',true);

add_filter( 'pods_shortcode', function( $tags )  {
  $tags[ 'shortcodes' ] = true;
  return $tags;
});

add_action( 'wp_enqueue_scripts', 'my_deregister_javascript', 100 );

function my_deregister_javascript() {
  if(is_page_template('advantage-profile.php') || !is_page_template('home.php')){
       wp_dequeue_script('app-banners-custom-scripts');
      //  wp_register_script('app-banners-custom-scripts');
  }
}

function force_lowercase_urls() {
  if ( preg_match( '/[A-Z]/', $_SERVER['REQUEST_URI'] ) ) {
      wp_redirect( strtolower( $_SERVER['REQUEST_URI'] ), 302 );
      exit();
  }
}
add_action( 'init', 'force_lowercase_urls' );

add_filter('query_vars', 'add_state_var', 0, 1);
function add_state_var($vars){
    $vars[] = 'location_id';
    return $vars;
}

add_action( 'init' , 'setAirlineCookie' );
function setAirlineCookie() {

    $page_slug = trim( $_SERVER["REQUEST_URI"] , '/' );

    if ($page_slug == 'choose') {

      $clean_post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

      $reference = trim($clean_post_data['reference']);

      if (isset($reference) && $reference !== '') {
        // Set cookie for 3 days
        setrawcookie('reference', $reference, time()+3600 * 24 * 3);
      } 

    }

}

add_action('wp', 'disablePopup');
function disablePopup () {
  $page_slug = trim( $_SERVER["REQUEST_URI"] , '/' );
  if ($page_slug !== 'reserve') {
    if ((isset($_COOKIE['email_entered'])) || (isset($_SESSION['adv_login']))) {
        return remove_action('wp_enqueue_scripts', 'popmake_load_site_scripts');
    }
  }
}

add_action( 'init', 'aez_rewrite_add_rewrites' );
function aez_rewrite_add_rewrites() {

    $post_object = get_page_by_path( $_SERVER['REQUEST_URI'], OBJECT, 'page' );

    if (!$post_object){
        $location_slug = get_location_slug($_SERVER['REQUEST_URI']);

        if (strlen($location_slug) > 0) {

            wp_safe_redirect ('/location/' . $location_slug . '/', 301);
            exit;

        }

        $rewrite_rule = '^location/([^/]*)/';

        if (valid_location_code($_SERVER['REQUEST_URI'])){
          $rewrite_rule .= '?';
        }

        add_rewrite_rule($rewrite_rule,'index.php?pagename=location-check&location_id=$matches[1]','top');

    }

    if (!$post_object){
        add_rewrite_rule('^reset/([^/]+)/?$','index.php?pagename=reset&token=$matches[1]','top');
    }
}

function get_location_slug($uri) {

    $ret = '';

    if (strpos($uri, 'location/') ) {
        $location_pieces = explode('/', $uri);

        global $wpdb;
        $results = $wpdb->get_results( "select post_id, meta_key from $wpdb->postmeta where meta_value = '" . strtoupper($location_pieces[2]) . "' and meta_key = 'page_location_id'", ARRAY_A );

        if (count($results) > 0) {

            $post = get_post($results[0]['post_id']);

            $ret = $post->post_name;
        }

    }

    return $ret;
}

function valid_location_code($uri) {

    $ret = false;

    if (strpos($uri, 'location/') ) {
        $location_pieces = explode('/', $uri);
        $location_data = AdvLocations_Helper::getLocation($location_pieces[2]);

        if (isset($location_data['LocationCode']) && strtoupper(trim($location_data['LocationCode'])) ==  strtoupper(trim($location_pieces[2]))) {
           $ret = true;
        }

    }
    return $ret;
}

flush_rewrite_rules();

/**
 * Create Broker Page custom post type
 */
if ( ! function_exists('broker_pagessd') ) {
// Register Custom Post Type
function broker_pages() {
  $labels = array(
    'name'                  => _x( 'Broker Pages', 'Post Type General Name', 'aez' ),
    'singular_name'         => _x( 'Broker Page', 'Post Type Singular Name', 'aez' ),
    'menu_name'             => __( 'Broker Pages', 'aez' ),
    'name_admin_bar'        => __( 'Broker Pages', 'aez' ),
    'archives'              => __( 'Broker Archives', 'aez' ),
    'attributes'            => __( 'Broker Attributes', 'aez' ),
    'parent_item_colon'     => __( 'Parent Broker Page:', 'aez' ),
    'all_items'             => __( 'All Broker Pages', 'aez' ),
    'add_new_item'          => __( 'Add New Broker Page', 'aez' ),
    'add_new'               => __( 'Add Broker Page', 'aez' ),
    'new_item'              => __( 'New Broker Page', 'aez' ),
    'edit_item'             => __( 'Edit Broker Page', 'aez' ),
    'update_item'           => __( 'Update Broker Page', 'aez' ),
    'view_item'             => __( 'View Broker Page', 'aez' ),
    'view_items'            => __( 'View Broker Pages', 'aez' ),
    'search_items'          => __( 'Search Broker Page', 'aez' ),
    'not_found'             => __( 'Broker Page Not found', 'aez' ),
    'not_found_in_trash'    => __( 'Broker Page Not found in Trash', 'aez' ),
    'featured_image'        => __( 'Broker Page Hero Image', 'aez' ),
    'set_featured_image'    => __( 'Set Broker Page Hero image', 'aez' ),
    'remove_featured_image' => __( 'Remove Broker Page Hero image', 'aez' ),
    'use_featured_image'    => __( 'Use as Broker Page Hero image', 'aez' ),
    'insert_into_item'      => __( 'Insert into Broker Page', 'aez' ),
    'uploaded_to_this_item' => __( 'Uploaded to this Broker Page', 'aez' ),
    'items_list'            => __( 'Broker Pages list', 'aez' ),
    'items_list_navigation' => __( 'Broker Pages list navigation', 'aez' ),
    'filter_items_list'     => __( 'Filter Broker Pages list', 'aez' ),
  );
  $rewrite = array(
    'slug'                  => 'post_type',
    'with_front'            => true,
    'pages'                 => true,
    'feeds'                 => true,
  );

  $capabilities = array(
    'edit_post'             => 'edit_post',
    'read_post'             => 'read_post',
    'delete_post'           => 'delete_post',
    'edit_posts'            => 'edit_posts',
    'edit_others_posts'     => 'edit_others_posts',
    'publish_posts'         => 'publish_posts',
    'read_private_posts'    => 'read_private_posts',
  );

  $args = array(
    'label'                 => __( 'Broker Page', 'aez' ),
    'description'           => __( 'Broker Pages', 'aez' ),
    'labels'                => $labels,
    'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'revisions', 'page-attributes' ),
    // 'taxonomies'            => array( 'category', ' post_tag' ),
    'hierarchical'          => false,
    'public'                => true,
    // 'show_ui'               => true,
    // 'show_in_menu'          => true,
    // 'menu_position'         => 20,
    // 'menu_icon'             => 'dashicons-media-document',
    // 'show_in_admin_bar'     => true,
    // 'show_in_nav_menus'     => true,
    // 'can_export'            => true,
    // 'has_archive'           => true,
    // 'exclude_from_search'   => false,
    // 'publicly_queryable'    => true,
    // 'rewrite'               => $rewrite,
    // 'capabilities'          => $capabilities,
    // 'map_meta_cap'          => true,
    // 'show_in_rest'          => true,
  );
  register_post_type( 'broker_page', $args );
}
// add_action( 'init', 'broker_pages', 0 );
}

/**
 * Proper way to enqueue scripts and styles.
 */

function aez_theme_styles() {

  // Register Vendor Styles
  wp_register_style( 'font-awesome', get_stylesheet_directory_uri() . '/vendor/font-awesome-4.7.0/css/font-awesome.min.css' );
  wp_register_style( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css' );
  wp_register_style( 'slick', get_stylesheet_directory_uri() . '/vendor/slick-1.6.0/slick/slick.css' );
  wp_register_style( 'slick-theme', get_stylesheet_directory_uri() . '/vendor/slick-1.6.0/slick/slick-theme.css' );
  wp_register_style( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/css/pikaday.css' );

  // Register Custom Styles
  wp_register_style( 'blog-style', get_stylesheet_directory_uri() . '/css/blog_news.css' );
  wp_register_style( 'remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');

  // Register JQuery CSS
  // jquery-ui.min.css is enqueued by the Arconix FAQ plugin. Once that plugin isn't used anymore we need to enqueue that css
  // here and add it to the $base_styles
  //wp_register_style( 'jquery-ui-css', get_stylesheet_directory_uri() . '/css/jquery-ui.min.css',  array(), '1.12.1');
  
  // Base Styles
  $base_styles = array('font-awesome', 'select2', 'slick', 'slick-theme', 'pikaday');
  // Blog Page Styles
  $blog_styles = array_merge($base_styles, array('blog-style'));
  // Reservation Flow Styles
  $reservation_flow_styles = array_merge($base_styles, array('remove-margin'));

  // Check template page and load appropriate vendor styles
  if (
    is_page_template('template-blog.php')
    || is_page_template('template-news.php')
  ) {

    wp_enqueue_style($blog_styles);

  } else if (
    is_page_template('reservation-enhance.php') 
    || is_page_template('reservation-confirmation.php')
    || is_page_template('reservation-complete.php')
    || is_page_template('reservation-choose.php')) {
    
    wp_enqueue_style($reservation_flow_styles);

  } else {
    wp_enqueue_style($base_styles);
  } 

  // Enqueue the Child 2016 Theme
  wp_enqueue_style(
    'child-style',
    get_stylesheet_directory_uri() . '/style.css',
    wp_get_theme()->get('Version'), $GLOBALS['style_css_version']
  );
}

function aez_theme_scripts() {
  // Register Vendor Scripts
  wp_register_script( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
  wp_register_script( 'slick', get_stylesheet_directory_uri() . '/vendor/slick-1.6.0/slick/slick.min.js', array('jquery'), null, true );
  wp_register_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
  wp_register_script( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
  wp_register_script( 'validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true );
  wp_register_script( 'jquery-ui-js', get_stylesheet_directory_uri() . '/js/jquery-ui.min.js', array ( 'jquery' ), '1.12.1', true);
  wp_register_script( 'drop-down-js', get_stylesheet_directory_uri() . '/js/drop-down.js', array ( 'jquery', 'jquery-ui-js' ), $GLOBALS['drop-down_js_version'], true);

  // Register Custom Scripts
  wp_register_script(
    'main',
    get_stylesheet_directory_uri() . '/js/main.js',
    array('jquery'),
    $GLOBALS['main_js_version'],
    true
  );
    wp_register_script(
      'adv_form_validation',
      get_stylesheet_directory_uri() . '/js/adv_form_validation.js',
      array('jquery','main'), 
      $GLOBALS['adv_form_validation_js_version'], 
      true
    );
  wp_register_script(
    'home',
    get_stylesheet_directory_uri() . '/js/home.js',
    array('jquery', 'slick', 'main'),
    $GLOBALS['home_js_version'],
    true
  );
  wp_register_script(
    'quote-carousel',
    get_stylesheet_directory_uri() . '/js/quote-carousel.js',
    array('jquery', 'slick', 'main'),
     $GLOBALS['quote-carousel_js_version'],
    true
  );
  wp_register_script(
    'adv_reserve-summary-dropdown',
    plugins_url('advantage-reservations/js/adv_reserve-summary-dropdown.js'),
    array('jquery', 'main'),
    $GLOBALS['adv_reserve-summary-dropdown_js_version'],
    true
  );
  wp_register_script(
    'adv_reserve',
    plugins_url('advantage-reservations/js/adv_reserve_form.js'),
    array('jquery', 'main'),
    $GLOBALS['adv_reserve_js_version'],
    true
  );
  wp_register_script(
    'promo-code-add-remove',
    get_stylesheet_directory_uri() . '/js/promo-code-add-remove.js',
    array('jquery', 'main'),
    $GLOBALS['promo-code-add-remove_js_version'],
    true
  );
  wp_register_script(
    'contact-us',
    get_stylesheet_directory_uri() . '/js/contact-us.js',
    array('jquery', 'main'),
    $GLOBALS['contact-us_js_version'],
    true
  );
  wp_register_script(
    'locations',
    get_stylesheet_directory_uri() . '/js/locations.js',
    array('jquery', 'main'),
    $GLOBALS['locations_js_version'],
    true
  );
  wp_register_script(
    'find-a-car-form',
    get_stylesheet_directory_uri() . '/js/find-a-car-worldwide-form.js',
    array('jquery', 'select2', 'moment', 'pikaday', 'main'),
    $GLOBALS['find-a-car-worldwide-form_js_version'],
    true
  );
  wp_register_script(
    'awards-block',
    get_stylesheet_directory_uri() . '/js/awards-block.js',
    array('jquery'),
    $GLOBALS['awards-block_js_version'],
    true
  );
  wp_register_script(
    'adv_rez_enhance',
    get_stylesheet_directory_uri() . '/js/adv_rez_enhance.js',
    array('jquery', 'main'),
    $GLOBALS['adv_rez_enhance_js_version'],
    true
  );
  // wp_register_script(
  //   'drop-down-location-page',
  //   get_stylesheet_directory_uri() . '/js/drop-down-location-page.js',
  //   array('jquery', 'main'),
  //   $GLOBALS['drop_down_location_page_version'],
  //   true
  // );

  wp_enqueue_script(
    'adv_rez',
    plugins_url('advantage-reservations/js/adv_rez.js'),
    array('jquery', 'main'),
    $GLOBALS['adv_rez_js_version'],
    true
  );

  wp_enqueue_script(
    'adv_locations_anchor',
    plugins_url('advantage-locations/js/adv_locations_anchor.js'),
    array('jquery', 'main'),
    $GLOBALS['adv_locations_js_version'],
    true
  );

  wp_enqueue_script(
    'adv_login',
    plugins_url('adv_login/js/adv_login.js'),
    array('jquery', 'main', 'select2'),
    $GLOBALS['adv_login_js_version'],
    true
  );
 
  wp_localize_script( 'adv_rez', 'ADV_Rez_Ajax', array(
      'ajaxurl'   => admin_url( 'admin-ajax.php' ),
      'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
    )
  );

  // Base Functionality
  $base_scripts = array('jquery', 'main', 'adv_form_validation', 'jquery-ui-js', 'drop-down-js');

  // Reservation Flow Vendor Scripts
  $reservation_flow_vendor_scripts = array('jquery', 'select2', 'moment', 'pikaday', 'validator', 'main');

  // Search Form Scripts
  $search_form_scripts = array('select2', 'moment', 'pikaday', 'promo-code-add-remove', 'find-a-car-form');

  // Quote Carousel Scripts
  $quote_carousel_scripts = array('slick', 'quote-carousel');

  // Base Functionality w/ Search Form
  $base_with_quote_carousel_scripts = array_merge($base_scripts, $quote_carousel_scripts);

  // Base Functionality w/ Search Form
  $base_with_search_form_scripts = array_merge($base_scripts, $search_form_scripts);

  // Base Functionality w/ Search Form
  $base_with_search_form_and_quote_carousel_scripts = array_merge($base_scripts, $search_form_scripts, $quote_carousel_scripts);

  if (
    is_page_template('locations.php') 
    || is_page_template('locations-check.php')) {

    // Location Page Scripts
    $location_page_scripts = array_merge($base_with_search_form_scripts, array('locations'));
    wp_enqueue_script($location_page_scripts);

  } else if (
    is_page_template('about.php') 
    || is_page_template('advantage-profile.php')) {

    wp_enqueue_script($base_with_search_form_and_quote_carousel_scripts);

  } else if (is_page_template('my-reservations.php')) {

    // My Reservation Page Scripts
    $my_reservation_page_scripts = array_merge($base_with_search_form_scripts, array('my-reservations', 'awards-block'));
    wp_enqueue_script($my_reservation_page_scripts);

  } else if (is_page_template('contact-us.php')) {

    // Contact Us Page Scripts
    $contact_us_page_scripts = array_merge($base_with_search_form_scripts, array('locations', 'contact-us'));
    wp_enqueue_script($contact_us_page_scripts);

  } else if (
    is_page_template('reserve.php')
    || is_page_template('reservation-choose.php')
    || is_page_template('reservation-confirmation.php')
    || is_page_template('reservation-complete.php')
  ) {

    $reservation_flow_scripts = array_merge($reservation_flow_vendor_scripts, array('adv_form_validation'));

    wp_enqueue_script($reservation_flow_scripts);

  } else if (is_page_template('reservation-enhance.php')) {

     $reservation_enhance_scripts = array_merge($reservation_flow_vendor_scripts, array('adv_rez_enhance'));
    wp_enqueue_script($reservation_enhance_scripts);

  } else if (is_page_template('home.php')) {

    // Home Page Scripts
    $home_page_scripts = array_merge($base_with_search_form_and_quote_carousel_scripts, array('home', 'awards-block', 'adv_login'));
    wp_enqueue_script($home_page_scripts);

  } else if (is_page_template('template-promise.php')) {
      // Brand Promise Page Scripts
      $promise_page_scripts = array_merge($base_with_search_form_scripts, array('awards-block'));
      wp_enqueue_script($promise_page_scripts);

  } else {
    wp_enqueue_script($base_with_search_form_scripts);

  }
}

function register_my_menu() {
  register_nav_menu('secondary',_('New Menu'));
}

function tertiary_complete_menu() {
  register_nav_menu('tertiary',_('Complete Menu'));
  register_nav_menu('secondary_header_menu',_('Secondary Header Menu'));
}

add_action('wp_print_styles', 'aez_theme_styles');
add_action('wp_print_scripts', 'aez_theme_scripts');
add_action('init', 'register_my_menu');
add_action('init', 'tertiary_complete_menu');

add_action('admin_post_enhance', 'prefix_admin_enhance');
add_action('admin_post_nopriv_enhance', 'prefix_admin_enhance');

function prefix_admin_enhance () {
  status_header(200);
  // error_log("IN function prefix_admin_enhance");
  die('Server Received Your Data');
}



/*
 * Shortcodes
 */

function get_location_about_shortcode( $atts, $content = null ) {
  return '<div class="aez-body">
            <h2 class="-dark-blue">About ' . $atts['city_state'] . '</h2>' . $content . 
          '</div>';
}

function get_location_info_shortcode( $atts ) {
  return '<div class="aez-info-section">
            <h4 class="aez-all-caps -blue"><i class="fa fa-map-marker -green" aria-hidden="true"></i> Address:</h4>
            <p class="aez-info-text">'. $atts['address'] .'<br>' . $atts['city_state'] . ' ' . $atts['zip'] . ' ' . $atts['country'] . '<br><a href="tel:' . $atts['phone'] . '"><i class="fa fa-phone -blue" aria-hidden="true"></i> ' . $atts['masked_phone'] . '</a></p>
        </div>';
}

function get_location_hours_shortcode( $atts ) {
  return '<div class="aez-info-section">
            <h4 class="aez-all-caps -blue"><i class="fa fa-clock-o -green" aria-hidden="true"></i> Hours</h4>
            <p class="aez-info-text">Open: ' . $atts['open'] . '<br>Close: ' . $atts['close'] . '<br>' . $atts['days'] . '</p>
        </div>';
}

add_shortcode( 'location_about', 'get_location_about_shortcode' );
add_shortcode('location_info', 'get_location_info_shortcode');
add_shortcode('location_hours', 'get_location_hours_shortcode');

// Remove the admin login header

// add_action('get_header', 'remove_admin_login_header');
// function remove_admin_login_header() {
//   remove_action('wp_head', '_admin_bar_bump_cb');
// }

function adv_base_dir(){
  return $_SERVER['DOCUMENT_ROOT'];
}

function adv_plugin_dir($plugin_name = '') {
  
  $plugin_base_dir = adv_base_dir() . '/wp-content/plugins';
  if (empty($plugin_name)) {
    return $plugin_base_dir;
  }
  return $plugin_base_dir . '/' . $plugin_name;

}

function adv_async_scripts($url)
{
    if ( strpos( $url, '#asyncload') === false )
        return $url;
    else if ( is_admin() )
        return str_replace( '#asyncload', '', $url );
    else
  return str_replace( '#asyncload', '', $url )."' async='async"; 
}
add_filter( 'clean_url', 'adv_async_scripts', 11, 1 );


//use config variables in js files
add_action('wp_enqueue_scripts' , function(){ 
    $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
    wp_localize_script('jquery', 'script_common_full_api_url', $get_wp_config_settings_array['full_api_url']);
    wp_localize_script('jquery', 'script_common_services_url', $get_wp_config_settings_array['services_url']);
    wp_localize_script('jquery', 'script_common_logging_url', $get_wp_config_settings_array['logging_url']);
});