<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */
?>

		</div><!-- .site-content -->
        <div class="footer-background">
            <div class="container h-100">
            <div class="row text-center h-100 justify-content-center align-items-center" style="border-bottom: 2px solid #707474;">
				<div style="width: 73%; display:inline-flex;">
                <div class="col-lg-3 p-2">
                    <img style="margin-top: 1%;" src="/wp-content/themes/twentysixteen-child/assets/expway2.png" />
                </div>
                <div class="col-lg-3 p-2">
                    <img src="/wp-content/themes/twentysixteen-child/assets/BookFriendly.png" />
                </div>
                <div class="col-lg-3 p-2">
                    <img src="/wp-content/themes/twentysixteen-child/assets/Corp_Adv.png" />
                </div>
				</div>
                <div class="col-lg-3">
                    <div class="site-footer-newsletter">
    					<p class="helper-title text-center">
    						Sign up for Expressway
    					</p>
    					<form id="c" action="/" method="post">
    						<input type="email" id="sd_email" name="sd_email" placeholder="Email Address">
    						<input id="receive_specials_discounts_email_button" class="aez-btn aez-btn--filled-green aez-site-footer__button" type="button" value="Sign Up" name="myEmailButton">
    					</form>
    				</div>
                </div>
            </div>
            <div class="row mt-4 footer-sec-menu">
                <div class="col-lg-3 foo-menu">
                    <?php if ( has_nav_menu( 'primary' ) ) : ?>
    					<nav class="main-navigation aez-footer-menu__footer" role="navigation" aria-label="<?php esc_attr_e( 'Footer Primary Menu', 'twentysixteen' ); ?>">
    						<?php
    							wp_nav_menu(array(
    								'theme_location' => 'primary',
    								'menu_class'     => 'aez-footer-menu',
    							 ));
    						?>    
    					</nav><!-- .main-navigation -->
    				<?php endif; ?>
                </div>
                
                <div class="col-lg-2">
                    <?php if ( has_nav_menu( 'secondary' ) ) : ?>
    					<nav class="main-navigation  aez-footer-menu__footer" role="navigation" aria-label="<?php esc_attr_e( 'Footer Primary Menu', 'twentysixteen' ); ?>">
    						<?php
    							wp_nav_menu(array(
    								'theme_location' => 'secondary',
    								'menu_class'     => 'aez-footer-menu',
    							 ));
    						?>    
    					</nav><!-- .main-navigation -->
    				<?php endif; ?>
                </div>
                <div class="col-lg-3 text-center">
                   
                    <div class="social-icons mt-5">
                        <a href="https://www.facebook.com/AdvantageRAC" target="_blank">
                            <i class="fa fa-facebook-square" aria-hidden="true"></i>
                        </a>
                        <a href="https://twitter.com/@RentAdvantage" target="_blank">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                    </div>
                    
                </div></a>
                <div class="col-lg-4 mt-1 text-center">
				<a class="site-info" href="/" style="margin-bottom: 2%;">
					<?php
						/**
						 * Fires before the twentysixteen footer text for footer customization.
						 *
						 * @since Twenty Sixteen 1.0
						 */
						do_action( 'twentysixteen_credits' );
					?>
					<img class="desktop-show" src="/wp-content/themes/twentysixteen-child/assets/adv_logo_light.png" alt="Advantage Logo" /> 
				</a><!-- .site-info -->
				<!-- <div style="display:inline-block;"> -->
                <p class="h6 footer-cp" style="margin-left: 8%;margin-top: 5%;">&copy;<?php echo date("Y"); ?>  Advantage OPCO, LLC</p>
					<!-- </div> -->
                                        				<?php
					try
					{
						$gitHead = file('.git/HEAD', FILE_USE_INCLUDE_PATH);
						$branchLine = $gitHead[0];
						$lineArray = explode("/", $branchLine, 3);
						$branchname = $lineArray[2];
						echo "<span style='display: none; visibility: hidden;' class='site-version-info'>" . $branchname . "</span>";
					}
					catch (Exception $e){}
				?>
				</div>
            </div>

        </div>
        </div>
        <div style="background-color: #ffff; height: 95px;">
            <div class="container row pull-right" >
                <div class="col-6 col-sm-10 col-md-10">
                    <a class="gay-travel" href="/gay-travel" style="float: right;">
						<img class="gay-travel-img" style="width: 60%; float: right;" src="/wp-content/themes/twentysixteen-child/assets/gay-travel-approved.jpg" />
					</a>
                </div>
                <div class="col-6 col-sm-2 col-md-2">
					<!-- <a id="bbblink" style="padding: 0px; margin: 0 auto!important;" class="ruhzbum" href="https://www.bbb.org/central-florida/business-reviews/auto-renting-and-leasing/advantage-rent-a-car-in-orlando-fl-141831953#bbbseal" title="Advantage Rent A Car, Auto Renting & Leasing, Orlando, FL">
						<img style="margin-top:4% !important;" id="bbblinkimg" src="/wp-content/themes/twentysixteen-child/assets/adv_blue_med.png" alt="Advantage Rent A Car, Auto Renting & Leasing, Orlando, FL" />
					</a>
					<script type="text/javascript">var bbbprotocol = ( ("https:" == document.location.protocol) ? "https://" : "http://" ); (function(){var s=document.createElement('script');s.src=bbbprotocol + 'seal-centralflorida.bbb.org' + unescape('%2Flogo%2Fadvantage-rent-a-car-141831953.js');s.type='text/javascript';s.async=true;var st=document.getElementsByTagName('script');st=st[st.length-1];var pt=st.parentNode;pt.insertBefore(s,pt.nextSibling);})();
					</script> -->
					<a id="bbblink" class="ruhzbum" href="https://www.bbb.org/us/fl/orlando/profile/auto-renting-and-leasing/advantage-rent-a-car-0733-141831953#bbbseal" title="Advantage Rent A Car, Auto Renting & Leasing, Orlando, FL" style="display: block;position: relative;overflow: hidden; width: 150px; height: 68px; margin: 0px; padding: 0px;">
						<img style="padding: 0px; border: none;" id="bbblinkimg" src="https://seal-centralflorida.bbb.org/logo/ruhzbum/advantage-rent-a-car-141831953.png" width="300" height="68" alt="Advantage Rent A Car, Auto Renting & Leasing, Orlando, FL" />
					</a>
					<script type="text/javascript">
					var bbbprotocol = ( ("https:" == document.location.protocol) ? "https://" : "http://" ); 
					(function(){var s=document.createElement('script');s.src=bbbprotocol + 'seal-centralflorida.bbb.org' + unescape('%2Flogo%2Fadvantage-rent-a-car-141831953.js');s.type='text/javascript';s.async=true;var st=document.getElementsByTagName('script');st=st[st.length-1];var pt=st.parentNode;pt.insertBefore(s,pt.nextSibling);})();
					</script>
                </div>
            </div>
        </div>
        
		
	</div><!-- .site-inner -->
</div><!-- .site -->

<!-- begin olark code -->
<script type="text/javascript" async>
;(function(o,l,a,r,k,y){if(o.olark)return;
r="script";y=l.createElement(r);r=l.getElementsByTagName(r)[0];
y.async=1;y.src="//"+a;r.parentNode.insertBefore(y,r);
y=o.olark=function(){k.s.push(arguments);k.t.push(+new Date)};
y.extend=function(i,j){y("extend",i,j)};
y.identify=function(i){y("identify",k.i=i)};
y.configure=function(i,j){y("configure",i,j);k.c[i]=j};
k=y._={s:[],t:[+new Date],c:{},l:a};
})(window,document,"static.olark.com/jsclient/loader.js");
/* Add configuration calls below this comment */
olark.identify('6538-157-10-8230');</script>
<!-- end olark code -->

<!--mp_easylink_begins-->
<script type="text/javascript" id="mpelid" src="//advantagerentacar.mpeasylink.com/mpel/mpel.js" async></script>
<!--mp_easylink_ends-->

<?php wp_footer(); ?>

<!-- Google Code for Remarketing Tag -->
<!--
Remarketing tags may not be associated with personally identifiable information or placed on pages related to sensitive categories. See more information and instructions on how to setup the tag on: http://google.com/ads/remarketingsetup
-->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 810040189;
var google_custom_params = window.google_tag_params;
var google_remarketing_only = true;
/* ]]> */
</script>
<!-- Twitter universal website tag code -->
<script>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
// Insert Twitter Pixel ID and Standard Event data below
twq('init','nzupy');
twq('track','PageView');
</script>
<!-- End Twitter universal website tag code -->

<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/810040189/?guid=ON&amp;script=0"/>
</div>
</noscript>

<!-- Listrak Analytics – Javascript Framework -->
<script type="text/javascript">
        var biJsHost = (("https:" == document.location.protocol) ? "https://" : "http://");
        (function (d, s, id, tid, vid) {
          var js, ljs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return; js = d.createElement(s); js.id = id;
          js.src = biJsHost + "cdn.listrakbi.com/scripts/script.js?m=" + tid + "&v=" + vid;
          ljs.parentNode.insertBefore(js, ljs);
		})(document, 'script', 'ltkSDK', 'qvlMNwqsZtmU', '1');
</script>
<script type="text/javascript">
//BROWSE ACTIVITY TRACKING
	(function(d) { 
		if (document.addEventListener) 
		document.addEventListener('ltkAsyncListener', d); 
		else {
			e = document.documentElement; 
			e.ltkAsyncProperty = 0; 
			e.attachEvent('onpropertychange', function (e) { 
				if (e.propertyName == 'ltkAsyncProperty'){
					d();
				}
			});
		}
	})
	(function() 
	{ /********** Begin Custom Code **********/ 
		_ltk.Activity.AddPageBrowse(); 
		_ltk.Activity.Submit(); 
		/********** End Custom Code **********/ 
	});
</script>

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

		_ltk.SCA.CaptureEmail('email_sign_up');
		_ltk.SCA.CaptureEmail('sign_up_email_field');
		_ltk.SCA.CaptureEmail('sd_email');
		_ltk.SCA.CaptureEmail('sd_email_home');
		/********** End Custom Code **********/ 
	});
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
<div id="primary"></div>
</body>
</html>
