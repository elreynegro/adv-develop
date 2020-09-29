<?php
  /*
   * Template Name: Contact Us
   */
  AdvLocations_Helper::getAllLocations();
?>
<?php get_header(); ?>

<div class="aez-find-a-car-dropdown is-open">
  <h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
  <div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/contactus.jpg);
">
    <div class="aez-gradient">
        <h1>Contact Us</h1>
    </div>
</div>

<div class="aez-roadside-container">
  <div class="aez-cone-img-container">
    <img src="/wp-content/themes/twentysixteen-child/assets/cone.png" alt="Cone Image">
  </div>
  <div class="aez-roadside-number">
    <h2>Roadside Assistance</h2>
    <h3> <a href="tel:8006541111">(800) 654-1111</a></h3>
  </div>
</div>

 <div class="aez-extra aez-extra--contact-us">
    <div class="aez-extra-header">
        <h4><i class="fa fa-map-marker" aria-hidden="true"></i> <span>Location Policies</span></h4>
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div id="location-policy-drop-down" class="aez-extra-content">
    Choose a location to see the policy.
       <?php echo do_shortcode('[adv-contact-us-location-drop-down]'); ?>
    </div>
    <div class="aez-extra-header">
        <h4><i class="fa fa-phone" aria-hidden="true"></i> <span>Reservations &amp; Customer Service</span></h4>
		    <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div class="aez-extra-content">
        <span>Reservations & Customer Service - <a href="tel:8007775500">(800) 777-5500</a></span><br>

        <span>Toll Violations - <a href="tel:4078880501">(407) 888-0501</a></span><br>

        <span>Risk/Claims - <a href="tel:4078880508">(407) 888-0508</a></span><br>

        <span>Roadside Assistance - <a href="tel:8006541111">(800) 654-1111</a></span><br>
    </div>
    <div class="aez-extra-header">
        <h4><i class="fa fa-plane" aria-hidden="true"></i> <span>Travel Agents</span></h4>
		    <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div class="aez-extra-content">
        <span>Questions regarding travel agent programs, commissions, or other related inquiries. Send us an email at travelagentsupport@advantage.com.</span><br>

        <form action="mailto:travelagentsupport@advantage.com" method="GET">
            <input
              type="submit"
              class="aez-btn aez-btn--filled-blue"
              value="Inquire"
            />
        </form>
    </div>
    <div class="aez-extra-header activated">
        <h4><i class="fa fa-barcode" aria-hidden="true"></i> <span>Receipts</span></h4>
		    <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div class="aez-extra-content">
        <span>Want a receipt for your reservation?</span><br>

         <form action="https://receipts.advantage.com/HTMLClient/" method="GET" target="_blank">
            <input
              type="submit"
              class="aez-btn aez-btn--filled-blue"
              value="Get A Receipt"
            />
        </form>
    </div>
</div>

<form id="submit_contact_us" action="" method="POST" class="">
  <div class="aez-contact-us-header">
    <h3 class="aez-contact-us-header__title">Comments or Questions?</h3>
    <h4 class="aez-contact-us-header__subtitle">Please complete the form below. We'd love to hear from you!</h4>
  </div>


  <div class="aez-form-block">
    <div class="aez-contact-form">
        <?php echo do_shortcode('[aez-contact-us-communication-form]'); ?>
    </div>
  </div>
</form>
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<link src="./js/jquery-ui.min.css"/>

<script>
    $(document).ready(function() {
        $('ul.ui-autocomplete').removeAttr('style');
        var locationsData =  <?= $_SESSION["ActiveBookingLocations"] ?>;
        // console.log(locationsData);
        function getLocations() {
            var arr = [];
            for (myLoc in locationsData) {
                if (locationsData.hasOwnProperty(myLoc)) {
                    var loc = locationsData[myLoc].L;
                        /*LocationName 
                        + ' (' + locationsData[myLoc].City + ', ' 
                        + locationsData[myLoc].State + ' '
                        + locationsData[myLoc].CountryName 
                        +  ') - '
                        + locationsData[myLoc].LocationCode;*/

                var locToPush = new Array();
                locToPush[0] = locationsData[myLoc].C;
                locToPush.value = loc;
                locToPush.label = loc;
                  arr.push(locToPush);
                }
            }
            // window.console&&console.log(arr);
            return arr;
        }
        $('.location-policy-dropdown').autocomplete({
            maxShowItems: 10,
            minLength: 2,
            source: getLocations(),
            select: function (event, ui) {
              var value = ui.item.value;
              $("#rental_location_id").val(ui.item[0]);
               var $dropdown = $(event.target);

              // Check if the hidden field 'location', which is on the locations-check.php page,
              // is defined or not. If it's undefined, then we use the value of the event target, else
              // we use the value of the hidden field 'location'.
              if (typeof document.getElementsByName("location")[0] != 'undefined') {
                  $drop_down_value = document.getElementsByName("location")[0].value;
              } else {
                  $drop_down_value = $dropdown.val();
              }
              $('#policies').html(' Loading...');

        $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data: {
                    // wp ajax action
                    action: 'advLocationPolicy',

                    // values for parameters
                    // Rental Location ID
                    rental_location_id: ui.item[0],

                    // send the nonce along with the request
                    advPolicyNonce: ADV_Rez_Ajax.advPolicyNonce
                },
                dataType: 'json'
            })
            .done(function(data) {
                // Create the policies in the policies div, which will be formated by php in the 
                // locations-check.php page in the ajax_advLocationPolicy_func method.
                $('#policies').html(data);
            });
            }

        }).focus(function() {
            $(this).select();
            $(this).autocomplete('search', $(this).val())
            $(this).attr('placeholder', 'Please start typing')
            }).blur(function() {
            $(this).attr('placeholder', 'Enter a city or country to find a location')
        });

          $(window).resize(function() {
            var isMobile=false;
            try {
              document.createEvent("TouchEvent");
              isMobile=true;
            }
            catch(e) {
              isMobile=false;
            }
            if(!isMobile) {
               $('#location-policy-dropdown').blur();
               $('#location-contact-us-drop-down').blur();
            }
        });
         jQuery.ui.autocomplete.prototype._resizeMenu = function () {
          var ul = this.menu.element;
          ul.outerWidth(this.element.outerWidth());
        }
}); 

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
<!--
    <div class="aez-form-block">
        <div class="aez-form-item">
            <label for="first_name" class="aez-form-item__label">First Name<sup>*</sup></label>
            <input
                id="first_name"
                type="text"
               do_shortcode('[faq p=327 style=accordion]');      class="aez-form-item__input"
                name="first_name"
                placeholder="First Name"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label>
            <input
                id="last_name"
                type="text"
                class="aez-form-item__input"
                name="last_name"
                placeholder="Last Name"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="email" class="aez-form-item__label">Email<sup>*</sup></label>
            <input
                id="email"
                type="tel"
                class="aez-form-item__input"
                name="email"
                placeholder="Email"
                required
            />
        </div>
        <div class="aez-form-item aez-form-item--dropdown">
            <label for="state" class="aez-form-item__label">Location</label>
            <select
                id="state"
                class="aez-form-item__dropdown"
                name="state"
            >
                <option>Select</option>
                <option value="">Florida</option>
            </select>
        </div>
        <div class="aez-form-item">
            <label for="message" class="aez-form-item__label">Message<sup>*</sup></label>
            <textarea
                id="message"
                class="aez-form-item__input"
                name="message"
                placeholder="Comments/Questions"
                required
            ></textarea>
        </div>
        <div class="aez-terms-submit-block">
         -->

<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>

<?php

// function dynamic_select_state_menu_item() {
//     $output = '<select id="locations-dropdown" class="aez-select2-search aez-form-item__dropdown">
//                 <option value=""></option>
//               </select>';
//     return $output;
// }

// // Add filter to diplay state drop down
// add_filter( 'state_drop_down', 'dynamic_select_state_menu_item');
// wpcf7_add_shortcode( 'state_drop_down', 'dynamic_select_state_menu_item')
?>
