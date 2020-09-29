<?php
/*
 * Template Name: Location Check
 */

require_once( adv_plugin_dir('advantage-locations') . '/AdvLocations_Helper.php');

    wp_enqueue_script('locations-policies', plugins_url() . '/adv-contact-us/js/adv_location_policies.js', array('jquery', 'select2'), '1.0', true);
    wp_enqueue_script('contact-us', '/wp-content/themes/twentysixteen-child/js/contact-us.js', array('jquery', 'select2'), '1.0', true);
    wp_enqueue_script('locations', plugins_url() . '/advantage-locations/js/adv_locations_anchor.js', array('jquery', 'select2'), '1.0', true);
    

$location_data = AdvLocations_Helper::getLocation();

$hours_data = AdvLocations_Helper::getLocationHours($location_data['LocationCode']);

get_header();
wp_enqueue_script('locations_drop_down', '/wp-content/themes/twentysixteen-child/js/drop-down-location-page.js', array('jquery', 'select2'), '4.3', true);

$is_location_page = 1;
?>
<a name="locations_top"></a>

<div class="location-page-fac aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
    <div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

 <?php

// error_log('   ^^^^^eee^^ ^^^^^^ location_data: ' . print_r($location_data, true));
if (is_array($location_data) && array_key_exists('LocationName', $location_data)) {
?>
<div class="aez-locations__us">
    <div class="aez-secondary-header" style="background-image: url(/wp-content/plugins/advantage-locations/assets/maps-general.png);">
            <div class="row location-banner-main">
                <div class="col-sm-3 col-md-6" >
                    <div class="aez-gradient">
                        <h1><?php echo $location_data['LocationName']; ?></h1>
                    </div>
                </div>
                <div class="col-sm-7 col-md-6">
                    <!-- Find a car form world wide location detail page -->
                    <div class="find-a-car-location-banner d-none d-sm-block">
                        <?php include_once('find-a-car-worldwide-location-page.php'); ?>
                    </div>
                     <!-- Find a car form world wide location detail page -->            
                </div>
            </div>        
    </div>

<div class="location-usa-wrapper">
    
        <!-- Location additional info begins -->
     <div class="aez-locations__us">
            <div class="location-usa-wrapper">
                <div class="aez-info-block-container adv_location_info_block">
                    <div id="adv_location_info_block">
                        <div class="sub-details-loader" style="text-align: center; min-height: 100px; line-height: 40px; line-height: 98px; color:#06a; ">
                            <img style="margin-right: 20px;" alt="Loader" src="/wp-content/themes/twentysixteen-child/assets/ajax-loader-small-1.gif" /> Getting additional details.. Please wait..

                        </div>
                    </div>    
                </div>
            </div>
     </div>     
     <!-- Location additional info ends -->

    <div class="aez-body">
        <p>&nbsp;</p>
        <h2 class="-blue">Local Policies</h2>
        <p>Click below to view rental policy.</p>
        <p></p>
    </div>
    <div class="aez-body aez-extra aez-extra--location-policy aez-location-policies-dd">
    <div class="aez-extra-header">
        <h4><i class="fa fa-map-marker" aria-hidden="true"></i> <span>Location Policies</span></h4>
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div id="location-policy-drop-down" class="aez-extra-content">
        <div id="policies">Loading Details...</div>
        <input type="hidden" name="location" value="<?php echo $location_data['LocationCode'] ?>">
    </div>

</div> <!-- Margin Wrapper END -->


<div class="aez-body aez-extra aez-extra--location-policy aez-location-google-map-dd aez-location-google-map">
    <div class="aez-extra-header">
        <h4><i class="fa fa-map-marker" aria-hidden="true"></i> <span>Click here to directions/map</span></h4>
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div class="aez-extra-content">
        <div id="google-map"></div>
        <input type="hidden" id="location_code_hidden" name="location_code_hidden" value="<?php echo $location_data['LocationCode']; ?>">
    </div>

</div> 

<?php
    $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
    if ($api_url_array['google_location_maps'] == 'Y') {
        echo '<div style="display: none;" id="google-map-location-page" class="aez-location__map" data-latitude="' . $location_data['Latitude'] . '" data-longitude="' . $location_data['Longitude'] . '" ></div>';
    }
?>

<?php } else { ?>

    <div class="aez-locations__us">

        <div class="aez-secondary-header" style="background-image: url(/wp-content/plugins/advantage-locations/assets/maps-general.png);">
            <h1 class="-blue" style="color: #06A;">Location not found</h1>
        </div>
<div class="location-usa-wrapper">
        <div class="aez-info-block-container">
<div class="aez-info-block">
 	<h3>Sorry about that.</h3>
     </div>
</div>
    </div>
</div>
<?php	} ?>

        <div class="aez-awards-promo aez-travelers-promo">
            <div class="aez-dark-background">
                <h2>Like Where We're Going?</h2>
                <h3>Travelers of All Types Can Save With Advantage</h3>

                <div class="aez-promo-blocks">
                    <div class="aez-promo aez-advantage aez-traveler-corporate">
                        <div class="aez-img-container">
                            <img src="/wp-content/themes/twentysixteen-child/assets/group-icon.png" alt="group icon">
                        </div>
                        <div class="aez-traveler-corporate-content">
                            <span>Corporate Advantage</span>
                            <p class="aez-uppercase">For Corporations</p>
                            <p>
                                We know our business clients have a busy schedule, so no matter where or when they travel, the discount works 24/7. 
                            </p>
                        </div>
                    </div>

                    <div class="aez-promo aez-advantage aez-traveler-advantage desktop-hidden">
                        <div class="aez-img-container">
                            <img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
                        </div>

                        <div>
                            <span>Advantage Awards</span>
                            <p class="aez-uppercase">For Business Travelers</p>
                            <p>
                                Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
                            </p>
                        </div>
                    </div>

                    <div class="aez-promo aez-advantage aez-traveler-advantage desktop-hidden">
                        <div class="aez-img-container">
                            <img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
                        </div>
                        <div>
                            <p class="aez-uppercase">For Leisure Travelers</p>
                            <p>
                                Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!
                            </p>
                        </div>
                    </div>

                    <div class="aez-promo aez-advantage aez-traveler-advantage desktop-show">
                        <div class="aez-double-images">
                            <div class="aez-img-container">
                                <img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
                            </div>
                            <div class="aez-img-container">
                                <img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
                            </div>
                        </div>
                        <div>
                            <span>Advantage Awards</span>
                            <div class="aez-double-content">
                                <div class="aez-content-container">
                                    <p class="aez-uppercase">For Business Travelers</p>
                                    <p>
                                        Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
                                    </p>
                                </div>
                                <div class="aez-content-container">
                                    <p class="aez-uppercase">For Leisure Travelers</p>
                                    <p>
                                        Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="aez-member-login aez-vacation-spans">
                    <span>Advantage Expressway</span>
                    <a href="/login" class="aez-btn aez-btn--filled-green">Log In To Your Account</a>
                    <span>Not An Expressway Member?</span>
                    <a href="javascript:void(0);" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</a>
                </div>
        </div>
    </div>
<?php echo do_shortcode('[adv-location-markup-template]'); ?>
<?php include_once('includes/return-to-top.php'); ?>
<?php $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";  ?>
<script type='application/ld+json'> 
{
  "@context": "http://www.schema.org",
  "@type": "AutoRental",
  "name": "Advantage Rent A Car",
  "url": "<?php echo $actual_link; ?>",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "image": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "description": "Advantage Rent A Car at <?php echo $location_data['LocationName']; ?> offers a wide variety of new and almost new car rentals at the price and convenience you expect.",
  "telephone": "+1-800-777-5500",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<?php echo $location_data['AddLine1']; ?>",
    "addressLocality": "<?php echo $location_data['City']; ?>",
    "addressRegion": "<?php echo $location_data['State']; ?>",
    "postalCode": "<?php echo $location_data['PostalCode']; ?>",  
    "addressCountry": "<?php echo $location_data['CountryName']; ?>"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "<?php echo $location_data['Latitude']; ?>",
    "longitude": "<?php echo $location_data['Longitude']; ?>"
  },
  "hasMap": "https://www.google.com/maps/place/Advantage+Rent+A+Car/@<?php echo $location_data['Latitude']; ?>,<?php echo $location_data['Longitude']; ?>,15z/data=!4m5!3m4!1s0x0:0x78944d8b41c7e4a5!8m2!3d<?php echo $location_data['Latitude']; ?>!4d<?php echo $location_data['Longitude']; ?>",
  "openingHours": "Mo, Tu, We, Th, Fr, Sa, Su 12:00-23:30",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-777-5500",
    "contactType": "Customer Support"
  }
}
 </script>

<?php get_footer(); ?>