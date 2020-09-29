
<?php
	/*
	 * Template Name: Home
	 */
	//  include_once (AdvAwards_Helper.php);
$get_data = AEZ_Oauth2_Plugin::clean_user_entered_data("get");

if (isset($get_data['reference']) && $get_data['reference'] !== "") {

	$reference = trim($get_data['reference']);

	// Set cookie for 3 days
	setrawcookie('reference', $reference, time()+3600 * 24 * 3);
}

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-content/plugins/aez_oauth2/AEZ_Oauth2_Plugin.php');

$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

$pursuade_url = $api_url_array['pursuade_url'];

get_header();

$post_data = AEZ_Oauth2_Plugin::clean_user_entered_data();

// Get the promocode from the get url parameter
if (isset($get_data)) {
	foreach ($get_data as $key => $value) {
		if ($key == "rc" || $key == "irc") {
			$promoCode = $value;
		}
	}
}

$password_reset = "no";
$reset_forgot_password = "no";
// Get the password reset post data.
if (isset($post_data)) {
	foreach ($post_data as $key => $value) {
		if ($key == "password_reset") {
			$password_reset = "yes";
		}
		 if ($key == "reset_forgot_password") {
			$reset_forgot_password = "yes";
		}
	}
}

$noCarsFound = "no";
if(isset($_SESSION["NoCarsFound"]))
{
	unset($_SESSION["NoCarsFound"]);
	$noCarsFound = "yes";
}

$session_expired = "no";
if(isset($_SESSION["session_expired"]))
{
    unset($_SESSION["session_expired"]);
    $session_expired = "yes";
}

// Initialize Pitstop session varialbes
$_SESSION['free_pitstop_removed'] = "False";
$_SESSION['free_pitstop_applied'] = "False";

?>
<script type="text/javascript">
//EMAIL ADDRESS CAPTURE
	(function(d) { 
		if (document.addEventListener) 
		document.addEventListener('ltkAsyncListener', d); 
		else {
			e = document.documentElement; 
			e.ltkAsyncProperty = 0; 
			e.attachEvent('onpropertychange', function (e) { 
				if (e.propertyName == 'ltkAsyncProperty')
				{
					d();
				}
			});
		}
	})(function() { 
		/********** Begin Custom Code **********/ 
		_ltk.SCA.CaptureEmail('sign_up_email_field');
		/********** End Custom Code **********/ 
    });

</script>

<div id="content" class="main-content home-container">
    <?php
    /*
        if ( have_posts() ) {
            while ( have_posts() ) { the_post(); ?>

                <?php the_content(); ?>

            <?php }
        }
    */
    ?>
    <div id="password_reset" data-password-reset="<?php echo $password_reset; ?>" data-reset-forgot-password="<?php echo $reset_forgot_password; ?>"></div>
    <div id="noCarsFound" data-no-cars="<?php echo $noCarsFound; ?>"></div>
    <div id="session_expired" data-session-expired="<?php echo $session_expired; ?>"></div>
    
    <div class="aez-home">
        
        <div class="aez-home-layer">
            
            
            <!-- Home Section 1 begins -->
            <div class="container">
                <div class="home-section-1 row">

                    <div class="col-md-12 col-lg-6 mobile_hide_banner">
                        <div class="home-feature-title">
                        <h1>Rethink Your Rental Car Experience.</h1>
                        <h2>TRY OUR PITSTOP REWARD FOR FREE</h2>
                        <div class="learn-more-button"><a href="/expressway/benefits/" class="ch-btn">Learn More</a></div>
                        </div>
                    </div>

                    <!-- Find a car begins -->
                    <div class="aez-home-find-a-car-container col-md-12 col-lg-6">
                    <div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
                        
                        <?php if(!isset($_SESSION['adv_login'])) { ?>
                        <div class="home-awards-member-signup">
                            <div class="awards-member-signup-link">Not an Expressway Member?<a href="/expressway" class="signup-link"> <span>Earn Rewards Today!</span></a></div>
                        </div>         
                        <?php } ?>
                    </div>

                    <!-- Find a car ends -->                

                </div>
            </div>
            <!-- Home Section 1 ends -->
            
            <!-- Home Section 2 begins -->
            <div class="banner-2-img mt-3">
                <div class="home-section-2">
                    <div class="row container">
                        <div class="col-sm-6 col-lg-4 my-3 europcar_home">
                            <a href="/europcar">
								<img class="banner-2-img img-type-webp lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Banner1.webp"  />
                                <img class="banner-2-img img-type-jp2 lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Banner1.jp2"  />
                                <img class="banner-2-img img-type-other lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Banner1.png"  />
						</a>
						</div>
                        <div class="col-sm-6 col-lg-4 my-3 section-2-cols sign_up_home">
                            <div class="col-bg-2 sec2-col-bg">
                                <div class="img-layer">
                                    <div class="signup-text-home">
                                        Sign up to<br/> receive the<br/> best offers <br>and promotions
                                    </div>
                                    <div class="signup-form-home">
                                        <div id="c1" action="/" method="post">
						<input type="email" id="sd_email_home" name="sd_email_home" placeholder="Email Address">
						<input id="receive_specials_discounts_email_button_home" class="aez-btn aez-site-footer__button" type="button" value="Sign Up" name="myEmailButton">
					</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-lg-4 my-3">
                            <a href="app">
                            <img class="banner-2-img img-type-webp lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Banner3.webp"  />
                            <img class="banner-2-img img-type-jp2 lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Banner3.jp2"  />
                            <img class="banner-2-img img-type-other lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Banner3.png"  />
                            </a>
                        </div>    
                    </div>
                </div>
            </div>
            <div class="hm-clear"></div>
            <!-- Home Section 2 ends -->
            
        </div> 
        
    </div>
    
    <!-- Newest fleets begins -->
    <div class="home-newest-fleets">
        <div class="row">  <div class="fleets-title mx-3"><h2>One Of The Newest Rental Fleets In The Industry</h2></div> </div>
        <div class="fleets-rows row">
            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['ECAR']); ?>">
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img">
                    <div class="fleet-img"><img class="img-type-webp lazy" data-src="/wp-content/plugins/advantage-vehicles/assets/home/ECAR_800x400.webp" alt="car option"  /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" data-src="/wp-content/plugins/advantage-vehicles/assets/home/ECAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" data-src="/wp-content/plugins/advantage-vehicles/assets/home/ECAR_800x400.png"  /> </div>
                    <h3 class="fleet-text">Economy</h3>
                    </div>
                <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>
            </a>
            
            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['CCAR']); ?>">
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="Compact rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/CCAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="Compact rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/CCAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="Compact rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/CCAR_800x400.png" /> </div>
                    <h3 class="fleet-text">Compact</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>
            </a>

            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['ICAR']); ?>">                
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="Intermediate rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/ICAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="Intermediate rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/ICAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="Intermediate rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/ICAR_800x400.png" /> </div>
                    <h3 class="fleet-text">Intermediate</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>
            </a>

            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['SCAR']); ?>">                
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="Standard rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/SCAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="Standard rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/SCAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="Standard rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/SCAR_800x400.png" /> </div>
                    <h3 class="fleet-text">Standard</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>  
            </a>
                      
        </div>
        
        <div class="fleets-rows row">
            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['PTAR']); ?>">
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="Premium rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/PCAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="Premium rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/PCAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="Premium rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/PCAR_800x400.png" /> </div>
                    <h3 class="fleet-text">Premium</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>
            </a>

            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['LCAR']); ?>">               
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="Luxury rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/LCAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="Luxury rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/LCAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="Luxury rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/LCAR_800x400.png" /> </div>
                    <h3 class="fleet-text">Luxury</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>
            </a>

            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['FCAR']); ?>">
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="full size rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/FCAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="full size rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/FCAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="full size rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/FCAR_800x400.png" /> </div>
                    <h3 class="fleet-text">Full Size</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>
            </a>

            <a href="<?php echo site_url($_SESSION['get_vehicle_details_car_code']['PFAR']); ?>">
                <div class="fleets-cols col-sm-6 col-md-6 col-lg-3">
                    <div class="fleet-img"><img class="img-type-webp lazy" alt="SUV rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/PFAR_800x400.webp" /> </div>
                    <div class="fleet-img"><img class="img-type-jp2 lazy" alt="SUV rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/PFAR_800x400.jp2" /> </div>
                    <div class="fleet-img"><img class="img-type-other lazy" alt="SUV rental car" data-src="/wp-content/plugins/advantage-vehicles/assets/home/PFAR_800x400.png" /> </div>
                    <h3 class="fleet-text">SUV</h3>
                    <div class="fleet-button"><a href="#adv_rez" class="ch-btn">Check availability</a></div>
                </div>        
            </a>    
        </div>         
        
    </div>


    <!-- Home Section 4 begins -->
    <div class="home-aez-images row">
            <div class="aez-image-block-award -first col-lg-6 ">
	
        <div class="aez-image-overlay">
                <div class="aez-image-block-content">
                    <a href="<?php echo $pursuade_url; ?>">
                        <img class="img-type-webp lazy" data-src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway Logo" />
						<img class="img-type-jp2 lazy" data-src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway Logo" />
						<img class="img-type-other lazy" data-src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway Logo" />
                        <div class="home-award-logo-text">RENT. REWARDS. REPEAT.</div>
                    </a>
                </div>
            </div>    
        </div>
        
        <div class="aez-image-block-award -second col-lg-6 ">
      
            <div class="aez-image-overlay">
                <div class="aez-image-block-content">
                    <a href="<?php echo $pursuade_url; ?>">
                        <img class="img-type-webp lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Corp_Adv.png" alt="Advantage Awards Logo" />
						<img class="img-type-jp2 lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Corp_Adv.png" alt="Advantage Awards Logo" />
						<img class="img-type-other lazy" data-src="/wp-content/themes/twentysixteen-child/assets/Corp_Adv.png" alt="Advantage Awards Logo" />
                        <div class="home-award-logo-text">INCREASE YOUR ROL</div>
                    </a>
                </div>
            </div>  
        </div>
    </div>
    <!-- Home Section 4 ends -->

<div class="aez-worldwide row">
            <div class="aez-world-top col-sm-12 col-md-12 col-lg-6">
                    <img src="/wp-content/uploads/2017/01/flags.png" alt="Locations at a glance" />
                    <p>
                            Servicing 143 Countries Worldwide
                    </p>
            </div> 
            <div class="aez-world-bottom col-sm-12 col-md-12 col-lg-6">
                    <a href="<?php echo site_url() ?>/us-location/" class="aez-btn aez-btn--outline-blue w-100">See U.S.A Locations</a>
                    <a href="<?php echo site_url() ?>/international-locations/" class="aez-btn aez-btn--outline-blue w-100">See International Locations</a>
            </div>
</div>
    
<div class="home-rethinking">
    <div class="rectancle_gradient">
        <div>
            Advantage Rent A Car is the reliable link to your final destination. With a wide selection of sedans, SUVs, and vans, Advantage Rent A Car provides the vehicle that’s best equipped for your trip. Advantage Rent A Car features one of the newest and most responsibly maintained <a href="/vehicles">economy and luxury fleets</a> in the rental industry. Whether you’re traveling for business or checking off an item on your bucket list, you’ll be safe and stylish in one of our premium vehicles.
            <br>
            The moment you choose Advantage Rent a Car is the moment you start reaping the benefits. You can be sure that the car you reserved will be the car you drive at the price you were quoted. When you walk into one of our convenient locations across the country, you’ll be warmly greeted by our helpful staff. We understand it’s our job to get you on the road with no excuses and no suprises.
            <br>
            Advantage Rent A Car is ready to make it a memorable trip for all of the right reasons. Rent a car at one of Advantage’s <a href="/us-location">locations</a> today!
        </div>
    </div>
</div>

</div>
<script type='application/ld+json'> 
{
  "@context": "http://www.schema.org",
  "@type": "Corporation",
  "name": "Advantage Rent A Car",
  "url": "https://www.advantage.com/",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "description": "Advantage Rent A Car offers a wide variety of new and almost new car rentals at the price and convenience you expect.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2003 McCoy Road",
    "addressLocality": "Orlando",
    "addressRegion": "Florida",
    "postalCode": "32809",
    "addressCountry": "United States"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "telephone": "+1-800-777-5500"
  }
}
</script>
<!--structure data markup AutoRental-->
<script type='application/ld+json'> 
{
  "@context": "http://www.schema.org",
  "@type": "AutoRental",
  "name": "Advantage Rent A Car",
  "url": "https://www.advantage.com/",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "image": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "priceRange": "1 to 100",
  "description": "Advantage Rent A Car offers a wide variety of new and almost new car rentals at the price and convenience you expect.",
  "telephone": "+1-800-777-5500",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2003 McCoy Road",
    "addressLocality": "Orlando",
    "addressRegion": "Florida",
    "postalCode": "32809",  
    "addressCountry": "United States"
  },
 
  "openingHours": "Mo, Tu, We, Th, Fr, Sa, Su 12:00-23:30",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-777-5500",
    "contactType": "Customer Support"
  }
}
</script>
<!--structure data markup Organization-->
<script type='application/ld+json'> 
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://www.advantage.com/",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+1-800-777-5500",
    "contactType": "Customer Support"
  }]
}
</script>
<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
<script src="/wp-content/themes/twentysixteen-child/js/jquery.lazy.min.js"></script> 
<script type='text/javascript'>
	document.addEventListener("DOMContentLoaded", function() {
  var lazyloadImages = document.querySelectorAll("img.lazy");    
  var lazyloadThrottleTimeout;
  var br_flag = msieversion();
  
  function lazyload () {
    if(lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }    
    
    lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
            if(img.offsetTop < (window.innerHeight + scrollTop)) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
        });
        if(lazyloadImages.length == 0) { 
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
    }, 20);
  }
  
  if(br_flag == 1) {
	  document.addEventListener("scroll", lazyload);
	  window.addEventListener("resize", lazyload);
	  window.addEventListener("orientationChange", lazyload);
  }
});

function msieversion() 
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
	var flag = 1;
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
    {
		flag = 0;
		jQuery( document ).ready(function($) {
		$('.lazy').lazy();
    });
    }
    return flag;
}

// A $( document ).ready() block.
jQuery( document ).ready(function($) {
    $("html, body").animate({ scrollTop: window.pageYOffset+2 }, "slow");
});
</script>

<!-- Session set -->
<?php
$member_number = $_SESSION['adv_login']->memberNumber;
if (isset($member_number)) {
    $awards_header_response = AdvAwards_Helper::getAwardsPageHeaderInfo($member_number);
        ?>
    <input type="hidden" name="BestTier" id="BestTier" value="<?php echo $awards_header_response['BestTier'];?>" />
    <?php if (!isset($_SESSION['available_awards'])) {  
        $_SESSION['available_awards'] = AdvAwards_Helper::getAvailableMemberAwards($member_number);
        //set rewards to session with unique and sort
        $available_awards = isset($_SESSION['available_awards']) ? $_SESSION['available_awards'] : '';
        $_SESSION['available_awards_unique_sort'] = AdvAwards_Helper::sortAwardsBasedExpireDate($available_awards);	
    } 
}

//--- Sojern Tag v6_js, Pixel Version: 2 -->
if (isset($api_url_array['sojern_flag']) && strtolower($api_url_array['sojern_flag']) == "y") { ?>
    <script>
    var loyaltyStatus = document.getElementById("BestTier");
    if(loyaltyStatus !== null) {
        loyaltyStatus = loyaltyStatus.value;
    }
    else {
        loyaltyStatus = "Non member";
    }
    (function () {
    /* Please fill the following values. */
        var params = {
        ffl: loyaltyStatus /* Loyalty Status */
        };

    /* Please do not modify the below code. */
        var cid = [];
        var paramsArr = [];
        var cidParams = [];
        var pl = document.createElement('script');
        var defaultParams = {"vid":"car"};
        for(key in defaultParams) { params[key] = defaultParams[key]; };
        for(key in cidParams) { cid.push(params[cidParams[key]]); };
        params.cid = cid.join('|');
        for(key in params) { paramsArr.push(key + '=' + encodeURIComponent(params[key])) };
        pl.type = 'text/javascript';
        pl.async = true;
        pl.src = 'https://beacon.sojern.com/pixel/p/10988?f_v=v6_js&p_v=2&' + paramsArr.join('&');
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(pl);
        // console.log("HOME PAGE --->");
        // console.log(params);
    })();
    </script>
<?php } ?>
<!-- End Sojern Tag -->
